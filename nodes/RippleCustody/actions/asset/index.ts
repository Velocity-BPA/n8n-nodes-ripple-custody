/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../../transport';
import { ENDPOINTS } from '../../constants';

export const assetOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['asset'] } },
		options: [
			{ name: 'Create Custom Asset', value: 'createCustomAsset', description: 'Add a custom asset', action: 'Create custom asset' },
			{ name: 'Get Balance', value: 'getBalance', description: 'Get asset balance for a vault', action: 'Get asset balance' },
			{ name: 'Get Chains', value: 'getChains', description: 'Get chains supporting an asset', action: 'Get asset chains' },
			{ name: 'Get History', value: 'getHistory', description: 'Get asset price history', action: 'Get price history' },
			{ name: 'Get Metadata', value: 'getMetadata', description: 'Get asset metadata', action: 'Get asset metadata' },
			{ name: 'Get NFT Info', value: 'getNftInfo', description: 'Get NFT details', action: 'Get NFT info' },
			{ name: 'Get Price', value: 'getPrice', description: 'Get current asset price', action: 'Get asset price' },
			{ name: 'Get Supported', value: 'getSupported', description: 'Get supported assets', action: 'Get supported assets' },
			{ name: 'Get Token Info', value: 'getTokenInfo', description: 'Get token contract details', action: 'Get token info' },
		],
		default: 'getSupported',
	},
];

export const assetFields: INodeProperties[] = [
	{
		displayName: 'Asset',
		name: 'asset',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['asset'], operation: ['getPrice', 'getHistory', 'getMetadata', 'getChains', 'getTokenInfo'] } },
		default: '',
		placeholder: 'BTC, ETH, USDC',
		description: 'Asset symbol or contract address',
	},
	{
		displayName: 'Vault ID',
		name: 'vaultId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['asset'], operation: ['getBalance'] } },
		default: '',
		description: 'Vault to get balance for',
	},
	{
		displayName: 'Blockchain',
		name: 'blockchain',
		type: 'options',
		displayOptions: { show: { resource: ['asset'], operation: ['getTokenInfo', 'getNftInfo', 'createCustomAsset'] } },
		options: [
			{ name: 'Ethereum', value: 'ethereum' },
			{ name: 'Polygon', value: 'polygon' },
			{ name: 'Solana', value: 'solana' },
			{ name: 'BNB Chain', value: 'bnb' },
			{ name: 'Arbitrum', value: 'arbitrum' },
			{ name: 'Optimism', value: 'optimism' },
			{ name: 'Avalanche', value: 'avalanche' },
		],
		default: 'ethereum',
		description: 'Blockchain network',
	},
	{
		displayName: 'Contract Address',
		name: 'contractAddress',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['asset'], operation: ['getTokenInfo', 'getNftInfo'] } },
		default: '',
		description: 'Token or NFT contract address',
	},
	{
		displayName: 'Token ID',
		name: 'tokenId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['asset'], operation: ['getNftInfo'] } },
		default: '',
		description: 'NFT token ID',
	},
	{
		displayName: 'Currency',
		name: 'currency',
		type: 'options',
		displayOptions: { show: { resource: ['asset'], operation: ['getPrice', 'getHistory'] } },
		options: [
			{ name: 'USD', value: 'usd' },
			{ name: 'EUR', value: 'eur' },
			{ name: 'GBP', value: 'gbp' },
			{ name: 'BTC', value: 'btc' },
			{ name: 'ETH', value: 'eth' },
		],
		default: 'usd',
		description: 'Price currency',
	},
	{
		displayName: 'Time Range',
		name: 'timeRange',
		type: 'options',
		displayOptions: { show: { resource: ['asset'], operation: ['getHistory'] } },
		options: [
			{ name: '24 Hours', value: '1d' },
			{ name: '7 Days', value: '7d' },
			{ name: '30 Days', value: '30d' },
			{ name: '90 Days', value: '90d' },
			{ name: '1 Year', value: '1y' },
			{ name: 'All Time', value: 'all' },
		],
		default: '7d',
		description: 'Historical time range',
	},
	{
		displayName: 'Custom Asset Details',
		name: 'customAssetDetails',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['asset'], operation: ['createCustomAsset'] } },
		options: [
			{ displayName: 'Symbol', name: 'symbol', type: 'string', default: '', required: true },
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Contract Address', name: 'contractAddress', type: 'string', default: '' },
			{ displayName: 'Decimals', name: 'decimals', type: 'number', default: 18 },
			{ displayName: 'Type', name: 'type', type: 'options', options: [{ name: 'Token', value: 'token' }, { name: 'NFT', value: 'nft' }], default: 'token' },
			{ displayName: 'Logo URL', name: 'logoUrl', type: 'string', default: '' },
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['asset'], operation: ['getSupported', 'getBalance'] } },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['asset'], operation: ['getSupported', 'getBalance'], returnAll: [false] } },
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
		displayOptions: { show: { resource: ['asset'], operation: ['getSupported'] } },
		options: [
			{ displayName: 'Blockchain', name: 'blockchain', type: 'string', default: '' },
			{ displayName: 'Type', name: 'type', type: 'options', options: [{ name: 'Native', value: 'native' }, { name: 'Token', value: 'token' }, { name: 'NFT', value: 'nft' }, { name: 'Stablecoin', value: 'stablecoin' }], default: '' },
			{ displayName: 'Search', name: 'search', type: 'string', default: '' },
		],
	},
];

export async function executeAsset(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);

	switch (operation) {
		case 'getSupported': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const filters = this.getNodeParameter('filters', i) as IDataObject;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.ASSETS.SUPPORTED, {}, filters);
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.ASSETS.SUPPORTED, {}, { ...filters, limit });
		}

		case 'getPrice': {
			const asset = this.getNodeParameter('asset', i) as string;
			const currency = this.getNodeParameter('currency', i) as string;
			return client.request('GET', ENDPOINTS.ASSETS.PRICE(asset), {}, { currency });
		}

		case 'getBalance': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const asset = this.getNodeParameter('asset', i, '') as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.VAULTS.BALANCE(vaultId), {}, asset ? { asset } : {});
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.VAULTS.BALANCE(vaultId), {}, { ...(asset ? { asset } : {}), limit });
		}

		case 'getHistory': {
			const asset = this.getNodeParameter('asset', i) as string;
			const currency = this.getNodeParameter('currency', i) as string;
			const timeRange = this.getNodeParameter('timeRange', i) as string;
			return client.request('GET', ENDPOINTS.ASSETS.HISTORY(asset), {}, { currency, range: timeRange });
		}

		case 'createCustomAsset': {
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			const customAssetDetails = this.getNodeParameter('customAssetDetails', i) as IDataObject;

			return client.request('POST', ENDPOINTS.ASSETS.CUSTOM, { blockchain, ...customAssetDetails });
		}

		case 'getMetadata': {
			const asset = this.getNodeParameter('asset', i) as string;
			return client.request('GET', ENDPOINTS.ASSETS.METADATA(asset));
		}

		case 'getChains': {
			const asset = this.getNodeParameter('asset', i) as string;
			return client.request('GET', ENDPOINTS.ASSETS.CHAINS(asset));
		}

		case 'getTokenInfo': {
			const asset = this.getNodeParameter('asset', i) as string;
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			return client.request('GET', ENDPOINTS.ASSETS.TOKEN_INFO(asset), {}, { blockchain });
		}

		case 'getNftInfo': {
			const asset = this.getNodeParameter('asset', i) as string;
			const tokenId = this.getNodeParameter('tokenId', i) as string;
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			return client.request('GET', ENDPOINTS.ASSETS.NFT_INFO(asset), {}, { tokenId, blockchain });
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
