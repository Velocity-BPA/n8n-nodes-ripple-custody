/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../../transport';
import { ENDPOINTS } from '../../constants';

export const addressOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['address'] } },
		options: [
			{ name: 'Archive', value: 'archive', description: 'Archive an address', action: 'Archive an address' },
			{ name: 'Generate', value: 'generate', description: 'Generate new address', action: 'Generate an address' },
			{ name: 'Get', value: 'get', description: 'Get an address by ID', action: 'Get an address' },
			{ name: 'Get Balance', value: 'getBalance', description: 'Get address balance', action: 'Get address balance' },
			{ name: 'Get by Blockchain', value: 'getByBlockchain', description: 'Get addresses by blockchain', action: 'Get addresses by blockchain' },
			{ name: 'Get Deposit Address', value: 'getDeposit', description: 'Get deposit address', action: 'Get deposit address' },
			{ name: 'Get Many', value: 'getMany', description: 'Get many addresses', action: 'Get many addresses' },
			{ name: 'Get Transactions', value: 'getTransactions', description: 'Get address transactions', action: 'Get address transactions' },
			{ name: 'Get Withdrawal Address', value: 'getWithdrawal', description: 'Get withdrawal address', action: 'Get withdrawal address' },
			{ name: 'Label', value: 'label', description: 'Label an address', action: 'Label an address' },
			{ name: 'Validate', value: 'validate', description: 'Validate an address', action: 'Validate an address' },
			{ name: 'Verify Ownership', value: 'verifyOwnership', description: 'Verify address ownership', action: 'Verify address ownership' },
		],
		default: 'getMany',
	},
];

export const addressFields: INodeProperties[] = [
	{
		displayName: 'Address ID',
		name: 'addressId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['address'], operation: ['get', 'getBalance', 'getTransactions', 'label', 'archive', 'verifyOwnership'] } },
		default: '',
	},
	{
		displayName: 'Wallet ID',
		name: 'walletId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['address'], operation: ['generate', 'getDeposit', 'getWithdrawal'] } },
		default: '',
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['address'], operation: ['validate'] } },
		default: '',
		description: 'Blockchain address to validate',
	},
	{
		displayName: 'Blockchain',
		name: 'blockchain',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['address'], operation: ['validate', 'getByBlockchain'] } },
		options: [
			{ name: 'Bitcoin', value: 'bitcoin' },
			{ name: 'Ethereum', value: 'ethereum' },
			{ name: 'XRP Ledger', value: 'xrp' },
			{ name: 'Solana', value: 'solana' },
			{ name: 'Polygon', value: 'polygon' },
		],
		default: 'ethereum',
	},
	{
		displayName: 'Label',
		name: 'label',
		type: 'string',
		displayOptions: { show: { resource: ['address'], operation: ['generate', 'label'] } },
		default: '',
	},
	{
		displayName: 'Address Type',
		name: 'addressType',
		type: 'options',
		displayOptions: { show: { resource: ['address'], operation: ['generate'] } },
		options: [
			{ name: 'Standard', value: 'standard' },
			{ name: 'Segwit', value: 'segwit' },
			{ name: 'Legacy', value: 'legacy' },
		],
		default: 'standard',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['address'], operation: ['getMany', 'getTransactions', 'getByBlockchain'] } },
		default: false,
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['address'], operation: ['getMany', 'getTransactions', 'getByBlockchain'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
	},
];

export async function executeAddress(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);

	switch (operation) {
		case 'generate': {
			const walletId = this.getNodeParameter('walletId', i) as string;
			const label = this.getNodeParameter('label', i, '') as string;
			const addressType = this.getNodeParameter('addressType', i, 'standard') as string;
			return client.request('POST', ENDPOINTS.ADDRESSES.BASE, { wallet_id: walletId, label, type: addressType });
		}

		case 'get': {
			const addressId = this.getNodeParameter('addressId', i) as string;
			return client.request('GET', ENDPOINTS.ADDRESSES.BY_ID(addressId));
		}

		case 'getMany': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.ADDRESSES.BASE);
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.ADDRESSES.BASE, {}, { limit });
		}

		case 'validate': {
			const address = this.getNodeParameter('address', i) as string;
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			return client.request('POST', `${ENDPOINTS.ADDRESSES.BASE}/validate`, { address, blockchain });
		}

		case 'getBalance': {
			const addressId = this.getNodeParameter('addressId', i) as string;
			return client.request('GET', ENDPOINTS.ADDRESSES.BALANCE(addressId));
		}

		case 'getTransactions': {
			const addressId = this.getNodeParameter('addressId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.ADDRESSES.TRANSACTIONS(addressId));
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.ADDRESSES.TRANSACTIONS(addressId), {}, { limit });
		}

		case 'label': {
			const addressId = this.getNodeParameter('addressId', i) as string;
			const label = this.getNodeParameter('label', i) as string;
			return client.request('PATCH', ENDPOINTS.ADDRESSES.BY_ID(addressId), { label });
		}

		case 'archive': {
			const addressId = this.getNodeParameter('addressId', i) as string;
			return client.request('POST', `${ENDPOINTS.ADDRESSES.BY_ID(addressId)}/archive`);
		}

		case 'getByBlockchain': {
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.ADDRESSES.BASE, {}, { blockchain });
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.ADDRESSES.BASE, {}, { blockchain, limit });
		}

		case 'verifyOwnership': {
			const addressId = this.getNodeParameter('addressId', i) as string;
			return client.request('POST', `${ENDPOINTS.ADDRESSES.BY_ID(addressId)}/verify-ownership`);
		}

		case 'getDeposit': {
			const walletId = this.getNodeParameter('walletId', i) as string;
			return client.request('GET', `${ENDPOINTS.WALLETS.BY_ID(walletId)}/deposit-address`);
		}

		case 'getWithdrawal': {
			const walletId = this.getNodeParameter('walletId', i) as string;
			return client.request('GET', `${ENDPOINTS.WALLETS.BY_ID(walletId)}/withdrawal-address`);
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
