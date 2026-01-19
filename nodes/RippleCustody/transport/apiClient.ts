/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IExecuteFunctions,
	ILoadOptionsFunctions,
	IHookFunctions,
	IWebhookFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
	IDataObject,
} from 'n8n-workflow';
import { NodeApiError, NodeOperationError } from 'n8n-workflow';
import * as jose from 'jose';
import { ENVIRONMENTS, API_VERSION } from '../constants/endpoints';

// Emit licensing notice once per module load
const LICENSING_NOTICE_LOGGED = Symbol.for('rippleCustodyLicensingNotice');
if (!(globalThis as Record<symbol, boolean>)[LICENSING_NOTICE_LOGGED]) {
	console.warn(`[Velocity BPA Licensing Notice]

This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).

Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.

For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.`);
	(globalThis as Record<symbol, boolean>)[LICENSING_NOTICE_LOGGED] = true;
}

export interface ApiCredentials {
	authMethod: 'apiKey' | 'oauth2' | 'mtls' | 'jwt';
	environment: 'production' | 'sandbox';
	baseUrl?: string;
	tenantId: string;
	apiKey?: string;
	apiSecret?: string;
	oauthClientId?: string;
	oauthClientSecret?: string;
	tokenUrl?: string;
	scope?: string;
	clientCertificate?: string;
	privateKey?: string;
	caCertificate?: string;
	jwtSigningKey?: string;
	jwtKeyId?: string;
	jwtAlgorithm?: string;
	jwtAudience?: string;
	timeout?: number;
	retryOnFailure?: boolean;
	maxRetries?: number;
}

export interface ApiResponse<T = IDataObject> {
	success: boolean;
	data?: T;
	error?: {
		code: string;
		message: string;
		details?: IDataObject;
	};
	pagination?: {
		page: number;
		pageSize: number;
		totalItems: number;
		totalPages: number;
	};
}

export type ContextType = IExecuteFunctions | ILoadOptionsFunctions | IHookFunctions | IWebhookFunctions;

/**
 * Ripple Custody API Client
 * Handles authentication, requests, and error handling for the Ripple Custody API
 */
export class RippleCustodyApiClient {
	private context: ContextType;
	private credentials: ApiCredentials;
	private baseUrl: string;
	private accessToken?: string;
	private tokenExpiry?: number;

	constructor(context: ContextType, credentials: ApiCredentials) {
		this.context = context;
		this.credentials = credentials;
		this.baseUrl = credentials.baseUrl || ENVIRONMENTS[credentials.environment] || ENVIRONMENTS.sandbox;
	}

	/**
	 * Get the base URL for API requests
	 */
	getBaseUrl(): string {
		return `${this.baseUrl}/${API_VERSION}`;
	}

	/**
	 * Generate JWT token for authentication
	 */
	private async generateJwtToken(): Promise<string> {
		if (!this.credentials.jwtSigningKey || !this.credentials.jwtKeyId) {
			throw new NodeOperationError(
				this.context.getNode(),
				'JWT signing key and key ID are required for JWT authentication',
			);
		}

		const privateKey = await jose.importPKCS8(
			this.credentials.jwtSigningKey,
			this.credentials.jwtAlgorithm || 'RS256',
		);

		const jwt = await new jose.SignJWT({
			sub: this.credentials.tenantId,
			iss: this.credentials.tenantId,
		})
			.setProtectedHeader({
				alg: this.credentials.jwtAlgorithm || 'RS256',
				kid: this.credentials.jwtKeyId,
			})
			.setAudience(this.credentials.jwtAudience || this.baseUrl)
			.setIssuedAt()
			.setExpirationTime('1h')
			.sign(privateKey);

		return jwt;
	}

	/**
	 * Get OAuth2 access token
	 */
	private async getOAuthToken(): Promise<string> {
		// Check if we have a valid cached token
		if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
			return this.accessToken;
		}

		if (!this.credentials.oauthClientId || !this.credentials.oauthClientSecret) {
			throw new NodeOperationError(
				this.context.getNode(),
				'OAuth client ID and secret are required for OAuth authentication',
			);
		}

		const tokenUrl = this.credentials.tokenUrl || `${this.baseUrl}/oauth/token`;

		const response = await this.context.helpers.request({
			method: 'POST',
			url: tokenUrl,
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
			},
			body: new URLSearchParams({
				grant_type: 'client_credentials',
				client_id: this.credentials.oauthClientId,
				client_secret: this.credentials.oauthClientSecret,
				scope: this.credentials.scope || 'custody:read custody:write',
			}).toString(),
			json: true,
		}) as { access_token: string; expires_in: number };

		this.accessToken = response.access_token;
		this.tokenExpiry = Date.now() + (response.expires_in - 60) * 1000; // Refresh 1 minute early

		return this.accessToken;
	}

	/**
	 * Build authentication headers based on the configured method
	 */
	private async buildAuthHeaders(): Promise<Record<string, string>> {
		const headers: Record<string, string> = {
			'X-Tenant-ID': this.credentials.tenantId,
			'Content-Type': 'application/json',
		};

		switch (this.credentials.authMethod) {
			case 'apiKey':
				if (!this.credentials.apiKey || !this.credentials.apiSecret) {
					throw new NodeOperationError(
						this.context.getNode(),
						'API key and secret are required for API key authentication',
					);
				}
				headers['X-API-Key'] = this.credentials.apiKey;
				headers['X-API-Secret'] = this.credentials.apiSecret;
				break;

			case 'oauth2':
				const token = await this.getOAuthToken();
				headers['Authorization'] = `Bearer ${token}`;
				break;

			case 'jwt':
				const jwtToken = await this.generateJwtToken();
				headers['Authorization'] = `Bearer ${jwtToken}`;
				break;

			case 'mtls':
				// mTLS is handled at the request level with certificates
				break;
		}

		return headers;
	}

	/**
	 * Make an API request to Ripple Custody
	 */
	async request<T = IDataObject>(
		method: IHttpRequestMethods,
		endpoint: string,
		body?: IDataObject,
		query?: IDataObject,
	): Promise<T> {
		const url = `${this.getBaseUrl()}${endpoint}`;
		const headers = await this.buildAuthHeaders();

		const options: IHttpRequestOptions = {
			method,
			url,
			headers,
			json: true,
		};

		if (body && Object.keys(body).length > 0) {
			options.body = body;
		}

		if (query && Object.keys(query).length > 0) {
			options.qs = query;
		}

		// Note: mTLS would require custom agent configuration not supported in IHttpRequestOptions
		// For mTLS, implement via custom https.Agent in production environments

		// Add timeout
		if (this.credentials.timeout) {
			options.timeout = this.credentials.timeout;
		}

		// Retry logic
		const maxRetries = this.credentials.retryOnFailure ? (this.credentials.maxRetries || 3) : 1;
		let lastError: Error | undefined;

		for (let attempt = 1; attempt <= maxRetries; attempt++) {
			try {
				const response = await this.context.helpers.httpRequest(options);
				return response as T;
			} catch (error) {
				lastError = error as Error;

				// Don't retry on client errors (4xx)
				const httpCode = (error as any).httpCode;
				if (httpCode && typeof httpCode === 'number' && httpCode < 500) {
					throw this.handleError(error as Error);
				}

				// Wait before retrying (exponential backoff)
				if (attempt < maxRetries) {
					const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
					await new Promise((resolve) => setTimeout(resolve, delay));
				}
			}
		}

		throw this.handleError(lastError!);
	}

	/**
	 * Make a GET request
	 */
	async get<T = IDataObject>(endpoint: string, query?: IDataObject): Promise<T> {
		return this.request<T>('GET', endpoint, undefined, query);
	}

	/**
	 * Make a POST request
	 */
	async post<T = IDataObject>(endpoint: string, body?: IDataObject): Promise<T> {
		return this.request<T>('POST', endpoint, body);
	}

	/**
	 * Make a PUT request
	 */
	async put<T = IDataObject>(endpoint: string, body?: IDataObject): Promise<T> {
		return this.request<T>('PUT', endpoint, body);
	}

	/**
	 * Make a PATCH request
	 */
	async patch<T = IDataObject>(endpoint: string, body?: IDataObject): Promise<T> {
		return this.request<T>('PATCH', endpoint, body);
	}

	/**
	 * Make a DELETE request
	 */
	async delete<T = IDataObject>(endpoint: string): Promise<T> {
		return this.request<T>('DELETE', endpoint);
	}

	/**
	 * Make a paginated API request
	 */
	async requestAllItems(
		method: IHttpRequestMethods,
		endpoint: string,
		body?: IDataObject,
		query?: IDataObject,
		limit?: number,
	): Promise<IDataObject[]> {
		const items: IDataObject[] = [];
		let page = 1;
		const pageSize = 100;

		while (true) {
			const response = await this.request<ApiResponse<IDataObject[]>>(method, endpoint, body, {
				...query,
				page,
				pageSize,
			});

			if (response.data) {
				items.push(...response.data);
			}

			// Check if we've reached the limit
			if (limit && items.length >= limit) {
				return items.slice(0, limit);
			}

			// Check if there are more pages
			if (!response.pagination || page >= response.pagination.totalPages) {
				break;
			}

			page++;
		}

		return items;
	}

	/**
	 * Handle API errors and convert to n8n errors
	 */
	private handleError(error: Error): never {
		if (error instanceof NodeApiError || error instanceof NodeOperationError) {
			throw error;
		}

		const axiosError = error as { response?: { status?: number }; message?: string };
		const httpCode = axiosError.response?.status || 500;
		const message = axiosError.message || 'Unknown error occurred';

		let description = 'An error occurred while communicating with Ripple Custody API';

		if (httpCode === 400) {
			description = 'Bad request - please check your input parameters';
		} else if (httpCode === 401) {
			description = 'Authentication failed - please check your credentials';
		} else if (httpCode === 403) {
			description = 'Access forbidden - you do not have permission for this operation';
		} else if (httpCode === 404) {
			description = 'Resource not found';
		} else if (httpCode === 409) {
			description = 'Conflict - the resource may already exist or be in an invalid state';
		} else if (httpCode === 429) {
			description = 'Rate limit exceeded - please try again later';
		} else if (httpCode === 500) {
			description = 'Internal server error - please try again later';
		} else if (httpCode === 503) {
			description = 'Service unavailable - Ripple Custody may be under maintenance';
		}

		throw new NodeApiError(this.context.getNode(), { message, httpCode }, {
			message,
			description,
			httpCode: httpCode.toString(),
		});
	}
}

/**
 * Create an API client instance from the execution context
 */
export async function createApiClient(
	context: ContextType,
	credentialsName = 'rippleCustodyApi',
): Promise<RippleCustodyApiClient> {
	const credentials = (await context.getCredentials(credentialsName)) as unknown as ApiCredentials;
	return new RippleCustodyApiClient(context, credentials);
}
