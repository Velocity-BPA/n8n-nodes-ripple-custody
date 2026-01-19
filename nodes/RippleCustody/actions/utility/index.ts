/**
 * Ripple Custody - Utility Resource
 * SPDX-License-Identifier: BSL-1.1
 * Copyright (c) 2024 Anthropic, PBC
 *
 * This file is licensed under the Business Source License 1.1.
 * You may use this file in compliance with the License.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	INodeProperties,
} from 'n8n-workflow';
import { createApiClient } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export const operations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['utility'],
			},
		},
		options: [
			{
				name: 'Get API Status',
				value: 'getApiStatus',
				description: 'Get current API status and health',
				action: 'Get API status',
			},
			{
				name: 'Get API Version',
				value: 'getApiVersion',
				description: 'Get API version information',
				action: 'Get API version',
			},
			{
				name: 'Get Audit Trail',
				value: 'getAuditTrail',
				description: 'Get system audit trail',
				action: 'Get audit trail',
			},
			{
				name: 'Get Features',
				value: 'getFeatures',
				description: 'Get available features and capabilities',
				action: 'Get features',
			},
			{
				name: 'Get Rate Limits',
				value: 'getRateLimits',
				description: 'Get current rate limit status',
				action: 'Get rate limits',
			},
			{
				name: 'Get SDK Version',
				value: 'getSdkVersion',
				description: 'Get SDK and node package version info',
				action: 'Get SDK version',
			},
			{
				name: 'Test Connection',
				value: 'testConnection',
				description: 'Test API connection and authentication',
				action: 'Test connection',
			},
		],
		default: 'getApiStatus',
	},
];

export const fields: INodeProperties[] = [
	// ----------------------------------
	//         Audit Trail Filters
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getAuditTrail'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getAuditTrail'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 1000,
		},
		default: 100,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Audit Filters',
		name: 'auditFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getAuditTrail'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Filter events after this date',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'Filter events before this date',
			},
			{
				displayName: 'Event Type',
				name: 'eventType',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Authentication', value: 'authentication' },
					{ name: 'Authorization', value: 'authorization' },
					{ name: 'Transaction', value: 'transaction' },
					{ name: 'Configuration', value: 'configuration' },
					{ name: 'Policy', value: 'policy' },
					{ name: 'User Management', value: 'user_management' },
					{ name: 'Key Management', value: 'key_management' },
					{ name: 'Compliance', value: 'compliance' },
					{ name: 'System', value: 'system' },
				],
				default: '',
				description: 'Filter by event type',
			},
			{
				displayName: 'User ID',
				name: 'userId',
				type: 'string',
				default: '',
				description: 'Filter by user ID',
			},
			{
				displayName: 'Resource Type',
				name: 'resourceType',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Vault', value: 'vault' },
					{ name: 'Wallet', value: 'wallet' },
					{ name: 'Transaction', value: 'transaction' },
					{ name: 'Policy', value: 'policy' },
					{ name: 'User', value: 'user' },
					{ name: 'Key', value: 'key' },
					{ name: 'Webhook', value: 'webhook' },
					{ name: 'Report', value: 'report' },
				],
				default: '',
				description: 'Filter by resource type',
			},
			{
				displayName: 'Resource ID',
				name: 'resourceId',
				type: 'string',
				default: '',
				description: 'Filter by specific resource ID',
			},
			{
				displayName: 'Action',
				name: 'action',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Create', value: 'create' },
					{ name: 'Read', value: 'read' },
					{ name: 'Update', value: 'update' },
					{ name: 'Delete', value: 'delete' },
					{ name: 'Approve', value: 'approve' },
					{ name: 'Reject', value: 'reject' },
					{ name: 'Sign', value: 'sign' },
					{ name: 'Export', value: 'export' },
				],
				default: '',
				description: 'Filter by action',
			},
			{
				displayName: 'IP Address',
				name: 'ipAddress',
				type: 'string',
				default: '',
				description: 'Filter by IP address',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Success', value: 'success' },
					{ name: 'Failure', value: 'failure' },
					{ name: 'Pending', value: 'pending' },
				],
				default: '',
				description: 'Filter by status',
			},
		],
	},

	// ----------------------------------
	//         Features Options
	// ----------------------------------
	{
		displayName: 'Feature Options',
		name: 'featureOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getFeatures'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Category',
				name: 'category',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Core', value: 'core' },
					{ name: 'Advanced', value: 'advanced' },
					{ name: 'Enterprise', value: 'enterprise' },
					{ name: 'Beta', value: 'beta' },
				],
				default: '',
				description: 'Filter by feature category',
			},
			{
				displayName: 'Include Disabled',
				name: 'includeDisabled',
				type: 'boolean',
				default: false,
				description: 'Whether to include disabled features',
			},
		],
	},

	// ----------------------------------
	//         Test Connection Options
	// ----------------------------------
	{
		displayName: 'Test Options',
		name: 'testOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['testConnection'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Test Components',
				name: 'testComponents',
				type: 'multiOptions',
				options: [
					{ name: 'API', value: 'api' },
					{ name: 'Authentication', value: 'auth' },
					{ name: 'Database', value: 'database' },
					{ name: 'HSM', value: 'hsm' },
					{ name: 'MPC Network', value: 'mpc' },
					{ name: 'Blockchain Nodes', value: 'blockchain' },
					{ name: 'Webhooks', value: 'webhooks' },
				],
				default: ['api', 'auth'],
				description: 'Components to test',
			},
			{
				displayName: 'Timeout (Seconds)',
				name: 'timeout',
				type: 'number',
				typeOptions: { minValue: 5, maxValue: 60 },
				default: 10,
				description: 'Connection timeout in seconds',
			},
			{
				displayName: 'Verbose',
				name: 'verbose',
				type: 'boolean',
				default: false,
				description: 'Whether to return detailed diagnostics',
			},
		],
	},

	// ----------------------------------
	//         Rate Limits Options
	// ----------------------------------
	{
		displayName: 'Rate Limit Options',
		name: 'rateLimitOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['utility'],
				operation: ['getRateLimits'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Endpoint',
				name: 'endpoint',
				type: 'string',
				default: '',
				description: 'Filter by specific endpoint',
			},
			{
				displayName: 'Include History',
				name: 'includeHistory',
				type: 'boolean',
				default: false,
				description: 'Whether to include usage history',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);

	switch (operation) {
		case 'getApiStatus': {
			const response = await client.get(ENDPOINTS.SYSTEM.STATUS);
			return {
				status: response.status || 'operational',
				uptime: response.uptime,
				timestamp: new Date().toISOString(),
				services: response.services || {},
				...response,
			};
		}

		case 'getApiVersion': {
			const response = await client.get(ENDPOINTS.SYSTEM.VERSION);
			return {
				apiVersion: response.version || response.apiVersion,
				buildNumber: response.buildNumber,
				releaseDate: response.releaseDate,
				deprecations: response.deprecations || [],
				...response,
			};
		}

		case 'getFeatures': {
			const featureOptions = this.getNodeParameter('featureOptions', index) as IDataObject;
			const params: IDataObject = {};

			if (featureOptions.category) {
				params.category = featureOptions.category;
			}
			if (featureOptions.includeDisabled) {
				params.includeDisabled = featureOptions.includeDisabled;
			}

			const response = await client.get(ENDPOINTS.SYSTEM.FEATURES, params);
			return (response.features || response) as IDataObject;
		}

		case 'getRateLimits': {
			const rateLimitOptions = this.getNodeParameter('rateLimitOptions', index) as IDataObject;
			const params: IDataObject = { ...rateLimitOptions };

			const response = await client.get(ENDPOINTS.SYSTEM.RATE_LIMITS, params);
			return {
				limits: response.limits || response,
				current: response.current || {},
				resetAt: response.resetAt,
				...response,
			};
		}

		case 'testConnection': {
			const testOptions = this.getNodeParameter('testOptions', index) as IDataObject;

			const body: IDataObject = {
				components: testOptions.testComponents || ['api', 'auth'],
				timeout: testOptions.timeout || 10,
				verbose: testOptions.verbose || false,
			};

			try {
				const response = await client.post(ENDPOINTS.SYSTEM.TEST, body);
				return {
					success: true,
					timestamp: new Date().toISOString(),
					results: response.results || response,
					latency: response.latency,
					...response,
				};
			} catch (error) {
				return {
					success: false,
					timestamp: new Date().toISOString(),
					error: (error as Error).message,
				};
			}
		}

		case 'getAuditTrail': {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const auditFilters = this.getNodeParameter('auditFilters', index) as IDataObject;
			const params: IDataObject = { ...auditFilters };

			if (!returnAll) {
				params.limit = this.getNodeParameter('limit', index) as number;
			}

			const response = await client.get(ENDPOINTS.SYSTEM.AUDIT, params);
			return (response.events || response.auditTrail || response.data || response) as IDataObject[];
		}

		case 'getSdkVersion': {
			// Return local package info plus API version
			const apiVersion = await client.get(ENDPOINTS.SYSTEM.VERSION);

			return {
				nodePackage: {
					name: 'n8n-nodes-ripple-custody',
					version: '0.1.0',
					license: 'BSL-1.1',
				},
				api: {
					version: apiVersion.version || apiVersion.apiVersion,
					endpoint: client.getBaseUrl?.() || 'configured',
				},
				compatibility: {
					n8n: '>=1.0.0',
					node: '>=18.0.0',
				},
				timestamp: new Date().toISOString(),
			};
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
