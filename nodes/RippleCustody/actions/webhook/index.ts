/**
 * Ripple Custody - Webhook Resource
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
				resource: ['webhook'],
			},
		},
		options: [
			{
				name: 'Create Webhook',
				value: 'create',
				description: 'Create a new webhook subscription',
				action: 'Create a webhook',
			},
			{
				name: 'Delete Webhook',
				value: 'delete',
				description: 'Delete a webhook subscription',
				action: 'Delete a webhook',
			},
			{
				name: 'Get Events',
				value: 'getEvents',
				description: 'Get available webhook event types',
				action: 'Get webhook events',
			},
			{
				name: 'Get Logs',
				value: 'getLogs',
				description: 'Get webhook delivery logs',
				action: 'Get webhook logs',
			},
			{
				name: 'Get Many Webhooks',
				value: 'getMany',
				description: 'Get multiple webhook subscriptions',
				action: 'Get many webhooks',
			},
			{
				name: 'Get Webhook',
				value: 'get',
				description: 'Get a specific webhook subscription',
				action: 'Get a webhook',
			},
			{
				name: 'Retry Delivery',
				value: 'retry',
				description: 'Retry a failed webhook delivery',
				action: 'Retry webhook delivery',
			},
			{
				name: 'Test Webhook',
				value: 'test',
				description: 'Send a test event to webhook endpoint',
				action: 'Test a webhook',
			},
			{
				name: 'Update Webhook',
				value: 'update',
				description: 'Update a webhook subscription',
				action: 'Update a webhook',
			},
		],
		default: 'getMany',
	},
];

export const fields: INodeProperties[] = [
	// ----------------------------------
	//         Webhook ID Field
	// ----------------------------------
	{
		displayName: 'Webhook ID',
		name: 'webhookId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['get', 'update', 'delete', 'test', 'getLogs'],
			},
		},
		default: '',
		description: 'Unique identifier of the webhook',
	},

	// ----------------------------------
	//         Delivery ID (for retry)
	// ----------------------------------
	{
		displayName: 'Delivery ID',
		name: 'deliveryId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['retry'],
			},
		},
		default: '',
		description: 'Unique identifier of the webhook delivery to retry',
	},

	// ----------------------------------
	//         Create Fields
	// ----------------------------------
	{
		displayName: 'Webhook URL',
		name: 'webhookUrl',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		default: '',
		placeholder: 'https://example.com/webhook',
		description: 'URL to receive webhook events',
	},
	{
		displayName: 'Event Types',
		name: 'eventTypes',
		type: 'multiOptions',
		required: true,
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		options: [
			{ name: 'All Events', value: '*' },
			{ name: 'Transaction Created', value: 'transaction.created' },
			{ name: 'Transaction Pending', value: 'transaction.pending' },
			{ name: 'Transaction Confirmed', value: 'transaction.confirmed' },
			{ name: 'Transaction Failed', value: 'transaction.failed' },
			{ name: 'Transfer Initiated', value: 'transfer.initiated' },
			{ name: 'Transfer Completed', value: 'transfer.completed' },
			{ name: 'Transfer Failed', value: 'transfer.failed' },
			{ name: 'Deposit Detected', value: 'deposit.detected' },
			{ name: 'Deposit Confirmed', value: 'deposit.confirmed' },
			{ name: 'Withdrawal Requested', value: 'withdrawal.requested' },
			{ name: 'Withdrawal Completed', value: 'withdrawal.completed' },
			{ name: 'Policy Triggered', value: 'policy.triggered' },
			{ name: 'Policy Approved', value: 'policy.approved' },
			{ name: 'Policy Rejected', value: 'policy.rejected' },
			{ name: 'Vault Created', value: 'vault.created' },
			{ name: 'Vault Updated', value: 'vault.updated' },
			{ name: 'Wallet Created', value: 'wallet.created' },
			{ name: 'Address Generated', value: 'address.generated' },
			{ name: 'Signing Requested', value: 'signing.requested' },
			{ name: 'Signing Completed', value: 'signing.completed' },
			{ name: 'Compliance Alert', value: 'compliance.alert' },
			{ name: 'Staking Reward', value: 'staking.reward' },
			{ name: 'Key Rotation', value: 'key.rotation' },
		],
		default: ['*'],
		description: 'Event types to subscribe to',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['create'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'Friendly name for the webhook',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the webhook purpose',
			},
			{
				displayName: 'Secret',
				name: 'secret',
				type: 'string',
				typeOptions: {
					password: true,
				},
				default: '',
				description: 'Secret for HMAC signature verification',
			},
			{
				displayName: 'Vault Filter',
				name: 'vaultIds',
				type: 'string',
				default: '',
				description: 'Comma-separated vault IDs to filter events (empty for all)',
			},
			{
				displayName: 'Blockchain Filter',
				name: 'blockchains',
				type: 'multiOptions',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Bitcoin', value: 'bitcoin' },
					{ name: 'Ethereum', value: 'ethereum' },
					{ name: 'XRP Ledger', value: 'xrpl' },
					{ name: 'Polygon', value: 'polygon' },
					{ name: 'Solana', value: 'solana' },
				],
				default: ['all'],
				description: 'Filter events by blockchain',
			},
			{
				displayName: 'Active',
				name: 'active',
				type: 'boolean',
				default: true,
				description: 'Whether the webhook is active',
			},
			{
				displayName: 'Headers',
				name: 'headers',
				type: 'fixedCollection',
				typeOptions: {
					multipleValues: true,
				},
				default: {},
				options: [
					{
						name: 'header',
						displayName: 'Header',
						values: [
							{
								displayName: 'Name',
								name: 'name',
								type: 'string',
								default: '',
							},
							{
								displayName: 'Value',
								name: 'value',
								type: 'string',
								default: '',
							},
						],
					},
				],
				description: 'Custom headers to include in webhook requests',
			},
			{
				displayName: 'Retry Config',
				name: 'retryConfig',
				type: 'fixedCollection',
				default: {},
				options: [
					{
						name: 'config',
						displayName: 'Retry Configuration',
						values: [
							{
								displayName: 'Max Retries',
								name: 'maxRetries',
								type: 'number',
								typeOptions: { minValue: 0, maxValue: 10 },
								default: 3,
							},
							{
								displayName: 'Retry Interval (seconds)',
								name: 'retryInterval',
								type: 'number',
								typeOptions: { minValue: 10, maxValue: 3600 },
								default: 60,
							},
							{
								displayName: 'Exponential Backoff',
								name: 'exponentialBackoff',
								type: 'boolean',
								default: true,
							},
						],
					},
				],
				description: 'Retry configuration for failed deliveries',
			},
		],
	},

	// ----------------------------------
	//         Update Fields
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Webhook URL',
				name: 'url',
				type: 'string',
				default: '',
				description: 'New URL for webhook delivery',
			},
			{
				displayName: 'Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the webhook',
			},
			{
				displayName: 'Event Types',
				name: 'eventTypes',
				type: 'multiOptions',
				options: [
					{ name: 'All Events', value: '*' },
					{ name: 'Transaction Created', value: 'transaction.created' },
					{ name: 'Transaction Confirmed', value: 'transaction.confirmed' },
					{ name: 'Transaction Failed', value: 'transaction.failed' },
					{ name: 'Transfer Completed', value: 'transfer.completed' },
					{ name: 'Deposit Confirmed', value: 'deposit.confirmed' },
					{ name: 'Withdrawal Completed', value: 'withdrawal.completed' },
					{ name: 'Policy Triggered', value: 'policy.triggered' },
					{ name: 'Compliance Alert', value: 'compliance.alert' },
				],
				default: [],
				description: 'Updated event types',
			},
			{
				displayName: 'Secret',
				name: 'secret',
				type: 'string',
				typeOptions: { password: true },
				default: '',
				description: 'New secret for signature verification',
			},
			{
				displayName: 'Active',
				name: 'active',
				type: 'boolean',
				default: true,
				description: 'Whether the webhook is active',
			},
		],
	},

	// ----------------------------------
	//         Test Options
	// ----------------------------------
	{
		displayName: 'Test Options',
		name: 'testOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['test'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Event Type',
				name: 'eventType',
				type: 'options',
				options: [
					{ name: 'Transaction Created', value: 'transaction.created' },
					{ name: 'Transaction Confirmed', value: 'transaction.confirmed' },
					{ name: 'Transfer Completed', value: 'transfer.completed' },
					{ name: 'Deposit Confirmed', value: 'deposit.confirmed' },
					{ name: 'Policy Triggered', value: 'policy.triggered' },
				],
				default: 'transaction.created',
				description: 'Event type to simulate',
			},
			{
				displayName: 'Include Sample Data',
				name: 'includeSampleData',
				type: 'boolean',
				default: true,
				description: 'Whether to include sample event data',
			},
		],
	},

	// ----------------------------------
	//         Get Many / Get Logs Filters
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['getMany', 'getLogs'],
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
				resource: ['webhook'],
				operation: ['getMany', 'getLogs'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['getMany'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Active Only',
				name: 'activeOnly',
				type: 'boolean',
				default: false,
				description: 'Whether to return only active webhooks',
			},
			{
				displayName: 'Event Type',
				name: 'eventType',
				type: 'string',
				default: '',
				description: 'Filter by subscribed event type',
			},
		],
	},
	{
		displayName: 'Log Filters',
		name: 'logFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['webhook'],
				operation: ['getLogs'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Success', value: 'success' },
					{ name: 'Failed', value: 'failed' },
					{ name: 'Pending', value: 'pending' },
				],
				default: '',
				description: 'Filter by delivery status',
			},
			{
				displayName: 'Event Type',
				name: 'eventType',
				type: 'string',
				default: '',
				description: 'Filter by event type',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Filter logs after this date',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'Filter logs before this date',
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
		case 'create': {
			const webhookUrl = this.getNodeParameter('webhookUrl', index) as string;
			const eventTypes = this.getNodeParameter('eventTypes', index) as string[];
			const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

			const body: IDataObject = {
				url: webhookUrl,
				eventTypes,
				...additionalFields,
			};

			if (additionalFields.vaultIds) {
				body.vaultIds = (additionalFields.vaultIds as string).split(',').map((id) => id.trim());
			}

			if (additionalFields.headers) {
				const headersData = additionalFields.headers as IDataObject;
				const headerArray = (headersData.header || []) as IDataObject[];
				body.headers = headerArray.reduce((acc, h) => {
					acc[h.name as string] = h.value;
					return acc;
				}, {} as IDataObject);
			}

			if (additionalFields.retryConfig) {
				const retryData = additionalFields.retryConfig as IDataObject;
				body.retryConfig = (retryData.config || [])[0] || {};
			}

			return await client.post(ENDPOINTS.WEBHOOKS.BASE, body);
		}

		case 'get': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			return await client.get(ENDPOINTS.WEBHOOKS.BY_ID(webhookId));
		}

		case 'getMany': {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const filters = this.getNodeParameter('filters', index) as IDataObject;
			const params: IDataObject = { ...filters };

			if (!returnAll) {
				params.limit = this.getNodeParameter('limit', index) as number;
			}

			const response = await client.get(ENDPOINTS.WEBHOOKS.BASE, params);
			return (response.webhooks || response.data || response) as IDataObject[];
		}

		case 'update': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

			return await client.patch(ENDPOINTS.WEBHOOKS.BY_ID(webhookId), updateFields);
		}

		case 'delete': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			await client.delete(ENDPOINTS.WEBHOOKS.BY_ID(webhookId));
			return { success: true, webhookId };
		}

		case 'test': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			const testOptions = this.getNodeParameter('testOptions', index) as IDataObject;

			return await client.post(ENDPOINTS.WEBHOOKS.TEST(webhookId), testOptions);
		}

		case 'getEvents': {
			return await client.get(ENDPOINTS.WEBHOOKS.EVENTS);
		}

		case 'getLogs': {
			const webhookId = this.getNodeParameter('webhookId', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const logFilters = this.getNodeParameter('logFilters', index) as IDataObject;
			const params: IDataObject = { ...logFilters };

			if (!returnAll) {
				params.limit = this.getNodeParameter('limit', index) as number;
			}

			const response = await client.get(ENDPOINTS.WEBHOOKS.LOGS(webhookId), params);
			return (response.logs || response.data || response) as IDataObject[];
		}

		case 'retry': {
			const deliveryId = this.getNodeParameter('deliveryId', index) as string;
			return await client.post(ENDPOINTS.WEBHOOKS.RETRY(deliveryId), {});
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
