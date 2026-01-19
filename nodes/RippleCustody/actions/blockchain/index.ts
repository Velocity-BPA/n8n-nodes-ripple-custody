/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../../transport';
import { ENDPOINTS } from '../../constants';

export const blockchainOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['blockchain'] } },
		options: [
			{ name: 'Get Analytics', value: 'getAnalytics', description: 'Get blockchain analytics', action: 'Get blockchain analytics' },
			{ name: 'Get Block Height', value: 'getBlockHeight', description: 'Get current block height', action: 'Get block height' },
			{ name: 'Get Gas Price', value: 'getGasPrice', description: 'Get current gas price', action: 'Get gas price' },
			{ name: 'Get Mempool', value: 'getMempool', description: 'Get mempool status', action: 'Get mempool status' },
			{ name: 'Get Network Fee', value: 'getNetworkFee', description: 'Get network fee estimates', action: 'Get network fee' },
			{ name: 'Get Node Status', value: 'getNodeStatus', description: 'Get node connection status', action: 'Get node status' },
			{ name: 'Get Status', value: 'getStatus', description: 'Get blockchain status', action: 'Get blockchain status' },
			{ name: 'Get Supported', value: 'getSupported', description: 'Get supported blockchains', action: 'Get supported blockchains' },
		],
		default: 'getSupported',
	},
];

export const blockchainFields: INodeProperties[] = [
	{
		displayName: 'Blockchain',
		name: 'blockchain',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['blockchain'], operation: ['getStatus', 'getBlockHeight', 'getGasPrice', 'getNetworkFee', 'getNodeStatus', 'getAnalytics', 'getMempool'] } },
		options: [
			{ name: 'Bitcoin', value: 'bitcoin' },
			{ name: 'Ethereum', value: 'ethereum' },
			{ name: 'XRP Ledger', value: 'xrp' },
			{ name: 'Solana', value: 'solana' },
			{ name: 'Polygon', value: 'polygon' },
			{ name: 'Avalanche', value: 'avalanche' },
			{ name: 'BNB Chain', value: 'bnb' },
			{ name: 'Arbitrum', value: 'arbitrum' },
			{ name: 'Optimism', value: 'optimism' },
			{ name: 'Base', value: 'base' },
			{ name: 'Cardano', value: 'cardano' },
			{ name: 'Polkadot', value: 'polkadot' },
			{ name: 'Cosmos', value: 'cosmos' },
			{ name: 'Tezos', value: 'tezos' },
			{ name: 'Algorand', value: 'algorand' },
		],
		default: 'ethereum',
		description: 'Blockchain network',
	},
	{
		displayName: 'Network',
		name: 'network',
		type: 'options',
		displayOptions: { show: { resource: ['blockchain'], operation: ['getStatus', 'getBlockHeight', 'getGasPrice', 'getNetworkFee', 'getNodeStatus'] } },
		options: [
			{ name: 'Mainnet', value: 'mainnet' },
			{ name: 'Testnet', value: 'testnet' },
			{ name: 'Devnet', value: 'devnet' },
		],
		default: 'mainnet',
		description: 'Network type',
	},
	{
		displayName: 'Fee Priority',
		name: 'feePriority',
		type: 'options',
		displayOptions: { show: { resource: ['blockchain'], operation: ['getNetworkFee'] } },
		options: [
			{ name: 'Low', value: 'low' },
			{ name: 'Medium', value: 'medium' },
			{ name: 'High', value: 'high' },
			{ name: 'All', value: 'all' },
		],
		default: 'all',
		description: 'Fee priority level',
	},
	{
		displayName: 'Analytics Type',
		name: 'analyticsType',
		type: 'options',
		displayOptions: { show: { resource: ['blockchain'], operation: ['getAnalytics'] } },
		options: [
			{ name: 'Overview', value: 'overview' },
			{ name: 'Transactions', value: 'transactions' },
			{ name: 'Addresses', value: 'addresses' },
			{ name: 'Fees', value: 'fees' },
			{ name: 'Volume', value: 'volume' },
		],
		default: 'overview',
		description: 'Type of analytics',
	},
	{
		displayName: 'Time Range',
		name: 'timeRange',
		type: 'options',
		displayOptions: { show: { resource: ['blockchain'], operation: ['getAnalytics'] } },
		options: [
			{ name: '24 Hours', value: '1d' },
			{ name: '7 Days', value: '7d' },
			{ name: '30 Days', value: '30d' },
			{ name: '90 Days', value: '90d' },
		],
		default: '7d',
		description: 'Analytics time range',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['blockchain'], operation: ['getSupported'] } },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['blockchain'], operation: ['getSupported'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['blockchain'], operation: ['getSupported'] } },
		options: [
			{ displayName: 'Type', name: 'type', type: 'options', options: [{ name: 'EVM', value: 'evm' }, { name: 'UTXO', value: 'utxo' }, { name: 'Account', value: 'account' }], default: '' },
			{ displayName: 'Staking Enabled', name: 'stakingEnabled', type: 'boolean', default: false },
			{ displayName: 'DeFi Enabled', name: 'defiEnabled', type: 'boolean', default: false },
		],
	},
];

export async function executeBlockchain(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);

	switch (operation) {
		case 'getSupported': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const filters = this.getNodeParameter('filters', i) as IDataObject;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.BLOCKCHAINS.SUPPORTED, {}, filters);
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.BLOCKCHAINS.SUPPORTED, {}, { ...filters, limit });
		}

		case 'getStatus': {
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			const network = this.getNodeParameter('network', i, 'mainnet') as string;
			return client.request('GET', ENDPOINTS.BLOCKCHAINS.STATUS(blockchain), {}, { network });
		}

		case 'getBlockHeight': {
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			const network = this.getNodeParameter('network', i, 'mainnet') as string;
			return client.request('GET', ENDPOINTS.BLOCKCHAINS.HEIGHT(blockchain), {}, { network });
		}

		case 'getGasPrice': {
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			const network = this.getNodeParameter('network', i, 'mainnet') as string;
			return client.request('GET', ENDPOINTS.BLOCKCHAINS.GAS(blockchain), {}, { network });
		}

		case 'getNetworkFee': {
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			const network = this.getNodeParameter('network', i, 'mainnet') as string;
			const feePriority = this.getNodeParameter('feePriority', i) as string;
			return client.request('GET', ENDPOINTS.BLOCKCHAINS.FEE(blockchain), {}, { network, priority: feePriority });
		}

		case 'getNodeStatus': {
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			const network = this.getNodeParameter('network', i, 'mainnet') as string;
			return client.request('GET', ENDPOINTS.BLOCKCHAINS.NODE(blockchain), {}, { network });
		}

		case 'getAnalytics': {
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			const analyticsType = this.getNodeParameter('analyticsType', i) as string;
			const timeRange = this.getNodeParameter('timeRange', i) as string;
			return client.request('GET', ENDPOINTS.BLOCKCHAINS.ANALYTICS(blockchain), {}, { type: analyticsType, range: timeRange });
		}

		case 'getMempool': {
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			return client.request('GET', ENDPOINTS.BLOCKCHAINS.MEMPOOL(blockchain));
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
