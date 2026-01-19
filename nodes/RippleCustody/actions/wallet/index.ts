/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../../transport';
import { ENDPOINTS } from '../../constants';

export const walletOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['wallet'] } },
		options: [
			{ name: 'Archive', value: 'archive', description: 'Archive a wallet', action: 'Archive a wallet' },
			{ name: 'Create', value: 'create', description: 'Create a new wallet', action: 'Create a wallet' },
			{ name: 'Export (Watch-Only)', value: 'export', description: 'Export wallet as watch-only', action: 'Export wallet' },
			{ name: 'Generate Address', value: 'generateAddress', description: 'Generate new address', action: 'Generate address' },
			{ name: 'Get', value: 'get', description: 'Get a wallet by ID', action: 'Get a wallet' },
			{ name: 'Get Addresses', value: 'getAddresses', description: 'Get wallet addresses', action: 'Get wallet addresses' },
			{ name: 'Get Balance', value: 'getBalance', description: 'Get wallet balance', action: 'Get wallet balance' },
			{ name: 'Get by Asset', value: 'getByAsset', description: 'Get wallets by asset', action: 'Get wallets by asset' },
			{ name: 'Get by Blockchain', value: 'getByBlockchain', description: 'Get wallets by blockchain', action: 'Get wallets by blockchain' },
			{ name: 'Get Many', value: 'getMany', description: 'Get many wallets', action: 'Get many wallets' },
			{ name: 'Get Policies', value: 'getPolicies', description: 'Get wallet policies', action: 'Get wallet policies' },
			{ name: 'Get Transactions', value: 'getTransactions', description: 'Get wallet transactions', action: 'Get wallet transactions' },
			{ name: 'Update', value: 'update', description: 'Update a wallet', action: 'Update a wallet' },
		],
		default: 'getMany',
	},
];

export const walletFields: INodeProperties[] = [
	{
		displayName: 'Wallet ID',
		name: 'walletId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['wallet'],
				operation: ['get', 'update', 'archive', 'getBalance', 'getAddresses', 'generateAddress', 'getTransactions', 'getPolicies', 'export'],
			},
		},
		default: '',
		description: 'The unique identifier of the wallet',
	},
	{
		displayName: 'Vault ID',
		name: 'vaultId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['wallet'], operation: ['create'] } },
		default: '',
		description: 'The vault to create the wallet in',
	},
	{
		displayName: 'Wallet Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['wallet'], operation: ['create'] } },
		default: '',
		description: 'Name of the wallet',
	},
	{
		displayName: 'Asset',
		name: 'asset',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['wallet'], operation: ['create', 'getByAsset'] } },
		default: '',
		placeholder: 'ETH, BTC, XRP...',
		description: 'Asset symbol for the wallet',
	},
	{
		displayName: 'Blockchain',
		name: 'blockchain',
		type: 'options',
		displayOptions: { show: { resource: ['wallet'], operation: ['getByBlockchain'] } },
		options: [
			{ name: 'Bitcoin', value: 'bitcoin' },
			{ name: 'Ethereum', value: 'ethereum' },
			{ name: 'XRP Ledger', value: 'xrp' },
			{ name: 'Solana', value: 'solana' },
			{ name: 'Polygon', value: 'polygon' },
		],
		default: 'ethereum',
		description: 'Blockchain to filter by',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['wallet'], operation: ['create'] } },
		options: [
			{ displayName: 'Description', name: 'description', type: 'string', default: '' },
			{ displayName: 'Policy ID', name: 'policyId', type: 'string', default: '' },
			{ displayName: 'Auto Generate Address', name: 'autoGenerateAddress', type: 'boolean', default: true },
		],
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['wallet'], operation: ['update'] } },
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Description', name: 'description', type: 'string', default: '' },
			{ displayName: 'Policy ID', name: 'policyId', type: 'string', default: '' },
		],
	},
	{
		displayName: 'Address Label',
		name: 'addressLabel',
		type: 'string',
		displayOptions: { show: { resource: ['wallet'], operation: ['generateAddress'] } },
		default: '',
		description: 'Optional label for the generated address',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['wallet'], operation: ['getMany', 'getAddresses', 'getTransactions', 'getPolicies', 'getByAsset', 'getByBlockchain'] } },
		default: false,
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['wallet'], operation: ['getMany', 'getAddresses', 'getTransactions', 'getPolicies', 'getByAsset', 'getByBlockchain'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
	},
];

export async function executeWallet(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);

	switch (operation) {
		case 'create': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const name = this.getNodeParameter('name', i) as string;
			const asset = this.getNodeParameter('asset', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
			return client.request('POST', ENDPOINTS.WALLETS.BASE, { vault_id: vaultId, name, asset, ...additionalFields });
		}

		case 'get': {
			const walletId = this.getNodeParameter('walletId', i) as string;
			return client.request('GET', ENDPOINTS.WALLETS.BY_ID(walletId));
		}

		case 'getMany': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.WALLETS.BASE);
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.WALLETS.BASE, {}, { limit });
		}

		case 'update': {
			const walletId = this.getNodeParameter('walletId', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;
			return client.request('PATCH', ENDPOINTS.WALLETS.BY_ID(walletId), updateFields);
		}

		case 'archive': {
			const walletId = this.getNodeParameter('walletId', i) as string;
			return client.request('POST', `${ENDPOINTS.WALLETS.BY_ID(walletId)}/archive`);
		}

		case 'getBalance': {
			const walletId = this.getNodeParameter('walletId', i) as string;
			return client.request('GET', ENDPOINTS.WALLETS.BALANCE(walletId));
		}

		case 'getAddresses': {
			const walletId = this.getNodeParameter('walletId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.WALLETS.ADDRESSES(walletId));
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.WALLETS.ADDRESSES(walletId), {}, { limit });
		}

		case 'generateAddress': {
			const walletId = this.getNodeParameter('walletId', i) as string;
			const label = this.getNodeParameter('addressLabel', i, '') as string;
			return client.request('POST', `${ENDPOINTS.WALLETS.ADDRESSES(walletId)}/generate`, { label });
		}

		case 'getTransactions': {
			const walletId = this.getNodeParameter('walletId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.WALLETS.TRANSACTIONS(walletId));
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.WALLETS.TRANSACTIONS(walletId), {}, { limit });
		}

		case 'getByAsset': {
			const asset = this.getNodeParameter('asset', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.WALLETS.BASE, {}, { asset });
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.WALLETS.BASE, {}, { asset, limit });
		}

		case 'getByBlockchain': {
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.WALLETS.BASE, {}, { blockchain });
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.WALLETS.BASE, {}, { blockchain, limit });
		}

		case 'getPolicies': {
			const walletId = this.getNodeParameter('walletId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', `${ENDPOINTS.WALLETS.BY_ID(walletId)}/policies`);
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', `${ENDPOINTS.WALLETS.BY_ID(walletId)}/policies`, {}, { limit });
		}

		case 'export': {
			const walletId = this.getNodeParameter('walletId', i) as string;
			return client.request('POST', `${ENDPOINTS.WALLETS.BY_ID(walletId)}/export`);
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
