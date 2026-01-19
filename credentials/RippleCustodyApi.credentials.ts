/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	IAuthenticateGeneric,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

/**
 * Ripple Custody API Credentials
 * 
 * Supports multiple authentication methods for Ripple Custody (Metaco Harmonize):
 * - API Key + Secret: Standard API authentication
 * - OAuth 2.0: Token-based authentication
 * - Client Certificate (mTLS): Mutual TLS authentication
 * - JWT Bearer Token: JSON Web Token authentication
 */
export class RippleCustodyApi implements ICredentialType {
	name = 'rippleCustodyApi';
	displayName = 'Ripple Custody API';
	documentationUrl = 'https://docs.ripple.com/custody';

	properties: INodeProperties[] = [
		{
			displayName: 'Authentication Method',
			name: 'authMethod',
			type: 'options',
			options: [
				{
					name: 'API Key + Secret',
					value: 'apiKey',
				},
				{
					name: 'OAuth 2.0',
					value: 'oauth2',
				},
				{
					name: 'Client Certificate (mTLS)',
					value: 'mtls',
				},
				{
					name: 'JWT Bearer Token',
					value: 'jwt',
				},
			],
			default: 'apiKey',
			description: 'The authentication method to use',
		},
		{
			displayName: 'Environment',
			name: 'environment',
			type: 'options',
			options: [
				{
					name: 'Production',
					value: 'production',
				},
				{
					name: 'Sandbox',
					value: 'sandbox',
				},
			],
			default: 'sandbox',
			description: 'The Ripple Custody environment to connect to',
		},
		{
			displayName: 'Base URL',
			name: 'baseUrl',
			type: 'string',
			default: '',
			placeholder: 'https://api.ripple-custody.com',
			description: 'Custom base URL for the API (leave empty to use default)',
		},
		{
			displayName: 'Tenant ID',
			name: 'tenantId',
			type: 'string',
			default: '',
			required: true,
			description: 'Your Ripple Custody tenant identifier',
		},
		// API Key Authentication
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			displayOptions: {
				show: {
					authMethod: ['apiKey'],
				},
			},
			description: 'Your Ripple Custody API key',
		},
		{
			displayName: 'API Secret',
			name: 'apiSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			displayOptions: {
				show: {
					authMethod: ['apiKey'],
				},
			},
			description: 'Your Ripple Custody API secret',
		},
		// OAuth 2.0 Authentication
		{
			displayName: 'OAuth Client ID',
			name: 'oauthClientId',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					authMethod: ['oauth2'],
				},
			},
			description: 'OAuth 2.0 Client ID',
		},
		{
			displayName: 'OAuth Client Secret',
			name: 'oauthClientSecret',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			displayOptions: {
				show: {
					authMethod: ['oauth2'],
				},
			},
			description: 'OAuth 2.0 Client Secret',
		},
		{
			displayName: 'Token URL',
			name: 'tokenUrl',
			type: 'string',
			default: '',
			placeholder: 'https://auth.ripple-custody.com/oauth/token',
			displayOptions: {
				show: {
					authMethod: ['oauth2'],
				},
			},
			description: 'OAuth 2.0 token endpoint URL',
		},
		{
			displayName: 'Scope',
			name: 'scope',
			type: 'string',
			default: 'custody:read custody:write',
			displayOptions: {
				show: {
					authMethod: ['oauth2'],
				},
			},
			description: 'OAuth 2.0 scopes (space-separated)',
		},
		// mTLS Authentication
		{
			displayName: 'Client Certificate',
			name: 'clientCertificate',
			type: 'string',
			typeOptions: {
				password: true,
				rows: 5,
			},
			default: '',
			required: true,
			displayOptions: {
				show: {
					authMethod: ['mtls'],
				},
			},
			description: 'PEM-encoded client certificate for mTLS',
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			typeOptions: {
				password: true,
				rows: 5,
			},
			default: '',
			required: true,
			displayOptions: {
				show: {
					authMethod: ['mtls'],
				},
			},
			description: 'PEM-encoded private key for mTLS',
		},
		{
			displayName: 'CA Certificate',
			name: 'caCertificate',
			type: 'string',
			typeOptions: {
				password: true,
				rows: 5,
			},
			default: '',
			displayOptions: {
				show: {
					authMethod: ['mtls'],
				},
			},
			description: 'PEM-encoded CA certificate (optional)',
		},
		// JWT Authentication
		{
			displayName: 'JWT Signing Key',
			name: 'jwtSigningKey',
			type: 'string',
			typeOptions: {
				password: true,
				rows: 5,
			},
			default: '',
			required: true,
			displayOptions: {
				show: {
					authMethod: ['jwt'],
				},
			},
			description: 'Private key for signing JWT tokens (PEM format)',
		},
		{
			displayName: 'JWT Key ID',
			name: 'jwtKeyId',
			type: 'string',
			default: '',
			required: true,
			displayOptions: {
				show: {
					authMethod: ['jwt'],
				},
			},
			description: 'Key ID (kid) for JWT header',
		},
		{
			displayName: 'JWT Algorithm',
			name: 'jwtAlgorithm',
			type: 'options',
			options: [
				{ name: 'RS256', value: 'RS256' },
				{ name: 'RS384', value: 'RS384' },
				{ name: 'RS512', value: 'RS512' },
				{ name: 'ES256', value: 'ES256' },
				{ name: 'ES384', value: 'ES384' },
				{ name: 'ES512', value: 'ES512' },
			],
			default: 'RS256',
			displayOptions: {
				show: {
					authMethod: ['jwt'],
				},
			},
			description: 'Algorithm for signing JWT tokens',
		},
		{
			displayName: 'JWT Audience',
			name: 'jwtAudience',
			type: 'string',
			default: 'https://api.ripple-custody.com',
			displayOptions: {
				show: {
					authMethod: ['jwt'],
				},
			},
			description: 'Audience claim for JWT',
		},
		// Additional Options
		{
			displayName: 'Request Timeout',
			name: 'timeout',
			type: 'number',
			default: 30000,
			description: 'Request timeout in milliseconds',
		},
		{
			displayName: 'Retry On Failure',
			name: 'retryOnFailure',
			type: 'boolean',
			default: true,
			description: 'Whether to retry failed requests',
		},
		{
			displayName: 'Max Retries',
			name: 'maxRetries',
			type: 'number',
			default: 3,
			displayOptions: {
				show: {
					retryOnFailure: [true],
				},
			},
			description: 'Maximum number of retry attempts',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				'X-Tenant-ID': '={{$credentials.tenantId}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			baseURL: '={{$credentials.baseUrl || ($credentials.environment === "production" ? "https://api.ripple-custody.com" : "https://sandbox-api.ripple-custody.com")}}',
			url: '/v1/health',
			method: 'GET',
		},
	};
}
