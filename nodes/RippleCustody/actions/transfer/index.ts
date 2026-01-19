/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../../transport';
import { ENDPOINTS } from '../../constants';

export const transferOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['transfer'] } },
		options: [
			{ name: 'Cancel', value: 'cancel', description: 'Cancel a transfer', action: 'Cancel a transfer' },
			{ name: 'Confirm', value: 'confirm', description: 'Confirm a transfer', action: 'Confirm a transfer' },
			{ name: 'Create Recurring', value: 'createRecurring', description: 'Create a recurring transfer', action: 'Create recurring transfer' },
			{ name: 'Get', value: 'get', description: 'Get a transfer', action: 'Get a transfer' },
			{ name: 'Get Inbound', value: 'getInbound', description: 'Get inbound transfers', action: 'Get inbound transfers' },
			{ name: 'Get Many', value: 'getMany', description: 'Get many transfers', action: 'Get many transfers' },
			{ name: 'Get Outbound', value: 'getOutbound', description: 'Get outbound transfers', action: 'Get outbound transfers' },
			{ name: 'Get Receipt', value: 'getReceipt', description: 'Get transfer receipt', action: 'Get transfer receipt' },
			{ name: 'Get Recurring', value: 'getRecurring', description: 'Get recurring transfers', action: 'Get recurring transfers' },
			{ name: 'Get Status', value: 'getStatus', description: 'Get transfer status', action: 'Get transfer status' },
			{ name: 'Initiate', value: 'initiate', description: 'Initiate a transfer', action: 'Initiate a transfer' },
			{ name: 'Schedule', value: 'schedule', description: 'Schedule a transfer', action: 'Schedule a transfer' },
		],
		default: 'getMany',
	},
];

export const transferFields: INodeProperties[] = [
	{
		displayName: 'Transfer ID',
		name: 'transferId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['transfer'], operation: ['get', 'getStatus', 'cancel', 'confirm', 'getReceipt'] } },
		default: '',
	},
	{
		displayName: 'Source Wallet ID',
		name: 'sourceWalletId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['transfer'], operation: ['initiate', 'schedule', 'createRecurring'] } },
		default: '',
	},
	{
		displayName: 'Destination',
		name: 'destination',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['transfer'], operation: ['initiate', 'schedule', 'createRecurring'] } },
		default: '',
		description: 'Destination address or wallet ID',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['transfer'], operation: ['initiate', 'schedule', 'createRecurring'] } },
		default: '',
	},
	{
		displayName: 'Asset',
		name: 'asset',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['transfer'], operation: ['initiate', 'schedule', 'createRecurring'] } },
		default: '',
	},
	{
		displayName: 'Schedule Time',
		name: 'scheduleTime',
		type: 'dateTime',
		required: true,
		displayOptions: { show: { resource: ['transfer'], operation: ['schedule'] } },
		default: '',
	},
	{
		displayName: 'Frequency',
		name: 'frequency',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['transfer'], operation: ['createRecurring'] } },
		options: [
			{ name: 'Daily', value: 'daily' },
			{ name: 'Weekly', value: 'weekly' },
			{ name: 'Bi-Weekly', value: 'biweekly' },
			{ name: 'Monthly', value: 'monthly' },
		],
		default: 'monthly',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['transfer'], operation: ['initiate', 'schedule', 'createRecurring'] } },
		options: [
			{ displayName: 'Memo', name: 'memo', type: 'string', default: '' },
			{ displayName: 'Reference', name: 'reference', type: 'string', default: '' },
			{ displayName: 'Beneficiary Name', name: 'beneficiaryName', type: 'string', default: '' },
			{ displayName: 'Idempotency Key', name: 'idempotencyKey', type: 'string', default: '' },
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['transfer'], operation: ['getMany', 'getInbound', 'getOutbound', 'getRecurring'] } },
		default: false,
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['transfer'], operation: ['getMany', 'getInbound', 'getOutbound', 'getRecurring'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
	},
];

export async function executeTransfer(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);

	switch (operation) {
		case 'initiate': {
			const sourceWalletId = this.getNodeParameter('sourceWalletId', i) as string;
			const destination = this.getNodeParameter('destination', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const asset = this.getNodeParameter('asset', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
			return client.request('POST', ENDPOINTS.TRANSFERS.BASE, { source_wallet_id: sourceWalletId, destination, amount, asset, ...additionalFields });
		}

		case 'get': {
			const transferId = this.getNodeParameter('transferId', i) as string;
			return client.request('GET', ENDPOINTS.TRANSFERS.BY_ID(transferId));
		}

		case 'getMany': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.TRANSFERS.BASE);
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.TRANSFERS.BASE, {}, { limit });
		}

		case 'getStatus': {
			const transferId = this.getNodeParameter('transferId', i) as string;
			return client.request('GET', ENDPOINTS.TRANSFERS.STATUS(transferId));
		}

		case 'cancel': {
			const transferId = this.getNodeParameter('transferId', i) as string;
			return client.request('POST', `${ENDPOINTS.TRANSFERS.BY_ID(transferId)}/cancel`);
		}

		case 'getInbound': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.TRANSFERS.BASE, {}, { direction: 'inbound' });
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.TRANSFERS.BASE, {}, { direction: 'inbound', limit });
		}

		case 'getOutbound': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.TRANSFERS.BASE, {}, { direction: 'outbound' });
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.TRANSFERS.BASE, {}, { direction: 'outbound', limit });
		}

		case 'confirm': {
			const transferId = this.getNodeParameter('transferId', i) as string;
			return client.request('POST', `${ENDPOINTS.TRANSFERS.BY_ID(transferId)}/confirm`);
		}

		case 'getReceipt': {
			const transferId = this.getNodeParameter('transferId', i) as string;
			return client.request('GET', ENDPOINTS.TRANSFERS.RECEIPT(transferId));
		}

		case 'schedule': {
			const sourceWalletId = this.getNodeParameter('sourceWalletId', i) as string;
			const destination = this.getNodeParameter('destination', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const asset = this.getNodeParameter('asset', i) as string;
			const scheduleTime = this.getNodeParameter('scheduleTime', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
			return client.request('POST', `${ENDPOINTS.TRANSFERS.BASE}/schedule`, { source_wallet_id: sourceWalletId, destination, amount, asset, schedule_time: scheduleTime, ...additionalFields });
		}

		case 'getRecurring': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', `${ENDPOINTS.TRANSFERS.BASE}/recurring`);
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', `${ENDPOINTS.TRANSFERS.BASE}/recurring`, {}, { limit });
		}

		case 'createRecurring': {
			const sourceWalletId = this.getNodeParameter('sourceWalletId', i) as string;
			const destination = this.getNodeParameter('destination', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const asset = this.getNodeParameter('asset', i) as string;
			const frequency = this.getNodeParameter('frequency', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
			return client.request('POST', `${ENDPOINTS.TRANSFERS.BASE}/recurring`, { source_wallet_id: sourceWalletId, destination, amount, asset, frequency, ...additionalFields });
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
