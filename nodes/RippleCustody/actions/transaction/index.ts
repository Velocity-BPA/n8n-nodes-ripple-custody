/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../../transport';
import { ENDPOINTS } from '../../constants';

export const transactionOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['transaction'] } },
		options: [
			{ name: 'Cancel', value: 'cancel', description: 'Cancel a transaction', action: 'Cancel a transaction' },
			{ name: 'Create', value: 'create', description: 'Create a transaction', action: 'Create a transaction' },
			{ name: 'Estimate Fee', value: 'estimateFee', description: 'Estimate transaction fee', action: 'Estimate transaction fee' },
			{ name: 'Export', value: 'export', description: 'Export transactions', action: 'Export transactions' },
			{ name: 'Get', value: 'get', description: 'Get a transaction', action: 'Get a transaction' },
			{ name: 'Get by Hash', value: 'getByHash', description: 'Get transaction by hash', action: 'Get transaction by hash' },
			{ name: 'Get Fee', value: 'getFee', description: 'Get transaction fee', action: 'Get transaction fee' },
			{ name: 'Get History', value: 'getHistory', description: 'Get transaction history', action: 'Get transaction history' },
			{ name: 'Get Many', value: 'getMany', description: 'Get many transactions', action: 'Get many transactions' },
			{ name: 'Get Pending', value: 'getPending', description: 'Get pending transactions', action: 'Get pending transactions' },
			{ name: 'Get Receipt', value: 'getReceipt', description: 'Get transaction receipt', action: 'Get transaction receipt' },
			{ name: 'Get Status', value: 'getStatus', description: 'Get transaction status', action: 'Get transaction status' },
			{ name: 'Retry', value: 'retry', description: 'Retry failed transaction', action: 'Retry a transaction' },
			{ name: 'Submit', value: 'submit', description: 'Submit a transaction', action: 'Submit a transaction' },
		],
		default: 'getMany',
	},
];

export const transactionFields: INodeProperties[] = [
	{
		displayName: 'Transaction ID',
		name: 'transactionId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['transaction'], operation: ['get', 'getStatus', 'cancel', 'getReceipt', 'getFee', 'retry'] } },
		default: '',
	},
	{
		displayName: 'Transaction Hash',
		name: 'transactionHash',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['transaction'], operation: ['getByHash'] } },
		default: '',
	},
	{
		displayName: 'Wallet ID',
		name: 'walletId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['transaction'], operation: ['create', 'submit', 'getHistory'] } },
		default: '',
	},
	{
		displayName: 'To Address',
		name: 'toAddress',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['transaction'], operation: ['create', 'estimateFee'] } },
		default: '',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['transaction'], operation: ['create', 'estimateFee'] } },
		default: '',
		description: 'Amount to send (in base units)',
	},
	{
		displayName: 'Asset',
		name: 'asset',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['transaction'], operation: ['create', 'estimateFee'] } },
		default: '',
		placeholder: 'ETH, BTC, XRP...',
	},
	{
		displayName: 'Blockchain',
		name: 'blockchain',
		type: 'options',
		displayOptions: { show: { resource: ['transaction'], operation: ['estimateFee', 'getByHash'] } },
		options: [
			{ name: 'Bitcoin', value: 'bitcoin' },
			{ name: 'Ethereum', value: 'ethereum' },
			{ name: 'XRP Ledger', value: 'xrp' },
			{ name: 'Solana', value: 'solana' },
		],
		default: 'ethereum',
	},
	{
		displayName: 'Signed Transaction',
		name: 'signedTransaction',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['transaction'], operation: ['submit'] } },
		default: '',
		description: 'Hex-encoded signed transaction',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['transaction'], operation: ['create'] } },
		options: [
			{ displayName: 'Memo', name: 'memo', type: 'string', default: '' },
			{ displayName: 'Gas Limit', name: 'gasLimit', type: 'string', default: '' },
			{ displayName: 'Gas Price', name: 'gasPrice', type: 'string', default: '' },
			{ displayName: 'Max Fee Per Gas', name: 'maxFeePerGas', type: 'string', default: '' },
			{ displayName: 'Priority', name: 'priority', type: 'options', options: [{ name: 'Low', value: 'low' }, { name: 'Medium', value: 'medium' }, { name: 'High', value: 'high' }], default: 'medium' },
			{ displayName: 'Idempotency Key', name: 'idempotencyKey', type: 'string', default: '' },
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['transaction'], operation: ['getMany', 'getPending', 'getHistory'] } },
		default: false,
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['transaction'], operation: ['getMany', 'getPending', 'getHistory'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['transaction'], operation: ['getMany', 'getHistory', 'export'] } },
		options: [
			{ displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'Pending', value: 'pending' }, { name: 'Confirmed', value: 'confirmed' }, { name: 'Failed', value: 'failed' }, { name: 'Cancelled', value: 'cancelled' }], default: '' },
			{ displayName: 'From Date', name: 'fromDate', type: 'dateTime', default: '' },
			{ displayName: 'To Date', name: 'toDate', type: 'dateTime', default: '' },
			{ displayName: 'Asset', name: 'asset', type: 'string', default: '' },
			{ displayName: 'Direction', name: 'direction', type: 'options', options: [{ name: 'Inbound', value: 'inbound' }, { name: 'Outbound', value: 'outbound' }], default: '' },
		],
	},
	{
		displayName: 'Export Format',
		name: 'exportFormat',
		type: 'options',
		displayOptions: { show: { resource: ['transaction'], operation: ['export'] } },
		options: [
			{ name: 'CSV', value: 'csv' },
			{ name: 'JSON', value: 'json' },
			{ name: 'Excel', value: 'xlsx' },
		],
		default: 'csv',
	},
];

export async function executeTransaction(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);

	switch (operation) {
		case 'create': {
			const walletId = this.getNodeParameter('walletId', i) as string;
			const toAddress = this.getNodeParameter('toAddress', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const asset = this.getNodeParameter('asset', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
			return client.request('POST', ENDPOINTS.TRANSACTIONS.BASE, { wallet_id: walletId, to: toAddress, amount, asset, ...additionalFields });
		}

		case 'get': {
			const transactionId = this.getNodeParameter('transactionId', i) as string;
			return client.request('GET', ENDPOINTS.TRANSACTIONS.BY_ID(transactionId));
		}

		case 'getMany': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const filters = this.getNodeParameter('filters', i) as IDataObject;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.TRANSACTIONS.BASE, {}, filters);
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.TRANSACTIONS.BASE, {}, { ...filters, limit });
		}

		case 'submit': {
			const walletId = this.getNodeParameter('walletId', i) as string;
			const signedTransaction = this.getNodeParameter('signedTransaction', i) as string;
			return client.request('POST', `${ENDPOINTS.TRANSACTIONS.BASE}/submit`, { wallet_id: walletId, signed_tx: signedTransaction });
		}

		case 'getStatus': {
			const transactionId = this.getNodeParameter('transactionId', i) as string;
			return client.request('GET', ENDPOINTS.TRANSACTIONS.STATUS(transactionId));
		}

		case 'cancel': {
			const transactionId = this.getNodeParameter('transactionId', i) as string;
			return client.request('POST', `${ENDPOINTS.TRANSACTIONS.BY_ID(transactionId)}/cancel`);
		}

		case 'getPending': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.TRANSACTIONS.BASE, {}, { status: 'pending' });
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.TRANSACTIONS.BASE, {}, { status: 'pending', limit });
		}

		case 'getHistory': {
			const walletId = this.getNodeParameter('walletId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const filters = this.getNodeParameter('filters', i) as IDataObject;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.WALLETS.TRANSACTIONS(walletId), {}, filters);
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.WALLETS.TRANSACTIONS(walletId), {}, { ...filters, limit });
		}

		case 'getByHash': {
			const transactionHash = this.getNodeParameter('transactionHash', i) as string;
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			return client.request('GET', `${ENDPOINTS.TRANSACTIONS.BASE}/hash/${transactionHash}`, {}, { blockchain });
		}

		case 'getFee': {
			const transactionId = this.getNodeParameter('transactionId', i) as string;
			return client.request('GET', `${ENDPOINTS.TRANSACTIONS.BY_ID(transactionId)}/fee`);
		}

		case 'estimateFee': {
			const toAddress = this.getNodeParameter('toAddress', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const asset = this.getNodeParameter('asset', i) as string;
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			return client.request('POST', `${ENDPOINTS.TRANSACTIONS.BASE}/estimate-fee`, { to: toAddress, amount, asset, blockchain });
		}

		case 'retry': {
			const transactionId = this.getNodeParameter('transactionId', i) as string;
			return client.request('POST', `${ENDPOINTS.TRANSACTIONS.BY_ID(transactionId)}/retry`);
		}

		case 'getReceipt': {
			const transactionId = this.getNodeParameter('transactionId', i) as string;
			return client.request('GET', ENDPOINTS.TRANSACTIONS.RECEIPT(transactionId));
		}

		case 'export': {
			const filters = this.getNodeParameter('filters', i) as IDataObject;
			const exportFormat = this.getNodeParameter('exportFormat', i) as string;
			return client.request('POST', `${ENDPOINTS.TRANSACTIONS.BASE}/export`, { format: exportFormat, ...filters });
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
