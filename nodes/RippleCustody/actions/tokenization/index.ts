/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../../transport';
import { ENDPOINTS } from '../../constants';

export const tokenizationOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['tokenization'] } },
		options: [
			{ name: 'Burn Token', value: 'burn', description: 'Burn tokens', action: 'Burn tokens' },
			{ name: 'Create Token', value: 'create', description: 'Create a new token', action: 'Create a token' },
			{ name: 'Deploy Contract', value: 'deployContract', description: 'Deploy token contract', action: 'Deploy token contract' },
			{ name: 'Get', value: 'get', description: 'Get a token', action: 'Get a token' },
			{ name: 'Get History', value: 'getHistory', description: 'Get token history', action: 'Get token history' },
			{ name: 'Get Holders', value: 'getHolders', description: 'Get token holders', action: 'Get token holders' },
			{ name: 'Get Many', value: 'getMany', description: 'Get many tokens', action: 'Get many tokens' },
			{ name: 'Get Metadata', value: 'getMetadata', description: 'Get token metadata', action: 'Get token metadata' },
			{ name: 'Get Standards', value: 'getStandards', description: 'Get token standards', action: 'Get token standards' },
			{ name: 'Get Supply', value: 'getSupply', description: 'Get token supply', action: 'Get token supply' },
			{ name: 'Mint Token', value: 'mint', description: 'Mint tokens', action: 'Mint tokens' },
			{ name: 'Pause Token', value: 'pause', description: 'Pause token transfers', action: 'Pause token' },
			{ name: 'Resume Token', value: 'resume', description: 'Resume token transfers', action: 'Resume token' },
			{ name: 'Transfer Token', value: 'transfer', description: 'Transfer tokens', action: 'Transfer tokens' },
			{ name: 'Update Metadata', value: 'updateMetadata', description: 'Update token metadata', action: 'Update token metadata' },
		],
		default: 'getMany',
	},
];

export const tokenizationFields: INodeProperties[] = [
	{
		displayName: 'Token ID',
		name: 'tokenId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['tokenization'], operation: ['get', 'mint', 'burn', 'transfer', 'getMetadata', 'updateMetadata', 'getHolders', 'getSupply', 'getHistory', 'pause', 'resume'] } },
		default: '',
	},
	{
		displayName: 'Token Name',
		name: 'tokenName',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['tokenization'], operation: ['create'] } },
		default: '',
	},
	{
		displayName: 'Token Symbol',
		name: 'tokenSymbol',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['tokenization'], operation: ['create'] } },
		default: '',
	},
	{
		displayName: 'Token Standard',
		name: 'tokenStandard',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['tokenization'], operation: ['create', 'deployContract'] } },
		options: [
			{ name: 'ERC-20', value: 'ERC20' },
			{ name: 'ERC-721 (NFT)', value: 'ERC721' },
			{ name: 'ERC-1155 (Multi-Token)', value: 'ERC1155' },
			{ name: 'SPL Token', value: 'SPL' },
		],
		default: 'ERC20',
	},
	{
		displayName: 'Blockchain',
		name: 'blockchain',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['tokenization'], operation: ['create', 'deployContract'] } },
		options: [
			{ name: 'Ethereum', value: 'ethereum' },
			{ name: 'Polygon', value: 'polygon' },
			{ name: 'BNB Chain', value: 'bnb' },
			{ name: 'Solana', value: 'solana' },
			{ name: 'Avalanche', value: 'avalanche' },
		],
		default: 'ethereum',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['tokenization'], operation: ['mint', 'burn', 'transfer'] } },
		default: '',
	},
	{
		displayName: 'To Address',
		name: 'toAddress',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['tokenization'], operation: ['mint', 'transfer'] } },
		default: '',
	},
	{
		displayName: 'From Address',
		name: 'fromAddress',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['tokenization'], operation: ['burn'] } },
		default: '',
	},
	{
		displayName: 'Metadata',
		name: 'metadata',
		type: 'json',
		displayOptions: { show: { resource: ['tokenization'], operation: ['create', 'updateMetadata'] } },
		default: '{}',
	},
	{
		displayName: 'Contract Bytecode',
		name: 'bytecode',
		type: 'string',
		displayOptions: { show: { resource: ['tokenization'], operation: ['deployContract'] } },
		default: '',
		description: 'Compiled contract bytecode (optional, uses standard if empty)',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['tokenization'], operation: ['create'] } },
		options: [
			{ displayName: 'Decimals', name: 'decimals', type: 'number', default: 18 },
			{ displayName: 'Initial Supply', name: 'initialSupply', type: 'string', default: '' },
			{ displayName: 'Max Supply', name: 'maxSupply', type: 'string', default: '' },
			{ displayName: 'Mintable', name: 'mintable', type: 'boolean', default: true },
			{ displayName: 'Burnable', name: 'burnable', type: 'boolean', default: true },
			{ displayName: 'Pausable', name: 'pausable', type: 'boolean', default: true },
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['tokenization'], operation: ['getMany', 'getHolders', 'getHistory'] } },
		default: false,
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['tokenization'], operation: ['getMany', 'getHolders', 'getHistory'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
	},
];

export async function executeTokenization(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);

	switch (operation) {
		case 'create': {
			const tokenName = this.getNodeParameter('tokenName', i) as string;
			const tokenSymbol = this.getNodeParameter('tokenSymbol', i) as string;
			const tokenStandard = this.getNodeParameter('tokenStandard', i) as string;
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			const metadata = JSON.parse(this.getNodeParameter('metadata', i, '{}') as string);
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
			return client.request('POST', ENDPOINTS.TOKENS.BASE, { name: tokenName, symbol: tokenSymbol, standard: tokenStandard, blockchain, metadata, ...additionalFields });
		}

		case 'get': {
			const tokenId = this.getNodeParameter('tokenId', i) as string;
			return client.request('GET', ENDPOINTS.TOKENS.BY_ID(tokenId));
		}

		case 'getMany': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.TOKENS.BASE);
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.TOKENS.BASE, {}, { limit });
		}

		case 'mint': {
			const tokenId = this.getNodeParameter('tokenId', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const toAddress = this.getNodeParameter('toAddress', i) as string;
			return client.request('POST', ENDPOINTS.TOKENS.MINT(tokenId), { amount, to: toAddress });
		}

		case 'burn': {
			const tokenId = this.getNodeParameter('tokenId', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const fromAddress = this.getNodeParameter('fromAddress', i) as string;
			return client.request('POST', ENDPOINTS.TOKENS.BURN(tokenId), { amount, from: fromAddress });
		}

		case 'transfer': {
			const tokenId = this.getNodeParameter('tokenId', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const toAddress = this.getNodeParameter('toAddress', i) as string;
			return client.request('POST', ENDPOINTS.TOKENS.TRANSFER(tokenId), { amount, to: toAddress });
		}

		case 'getMetadata': {
			const tokenId = this.getNodeParameter('tokenId', i) as string;
			return client.request('GET', ENDPOINTS.TOKENS.METADATA(tokenId));
		}

		case 'updateMetadata': {
			const tokenId = this.getNodeParameter('tokenId', i) as string;
			const metadata = JSON.parse(this.getNodeParameter('metadata', i) as string);
			return client.request('PUT', ENDPOINTS.TOKENS.METADATA(tokenId), metadata);
		}

		case 'getHolders': {
			const tokenId = this.getNodeParameter('tokenId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.TOKENS.HOLDERS(tokenId));
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.TOKENS.HOLDERS(tokenId), {}, { limit });
		}

		case 'getSupply': {
			const tokenId = this.getNodeParameter('tokenId', i) as string;
			return client.request('GET', ENDPOINTS.TOKENS.SUPPLY(tokenId));
		}

		case 'getHistory': {
			const tokenId = this.getNodeParameter('tokenId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.TOKENS.HISTORY(tokenId));
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.TOKENS.HISTORY(tokenId), {}, { limit });
		}

		case 'deployContract': {
			const tokenStandard = this.getNodeParameter('tokenStandard', i) as string;
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			const bytecode = this.getNodeParameter('bytecode', i, '') as string;
			return client.request('POST', `${ENDPOINTS.TOKENS.BASE}/deploy`, { standard: tokenStandard, blockchain, bytecode: bytecode || undefined });
		}

		case 'getStandards': {
			return client.request('GET', `${ENDPOINTS.TOKENS.BASE}/standards`);
		}

		case 'pause': {
			const tokenId = this.getNodeParameter('tokenId', i) as string;
			return client.request('POST', `${ENDPOINTS.TOKENS.BY_ID(tokenId)}/pause`);
		}

		case 'resume': {
			const tokenId = this.getNodeParameter('tokenId', i) as string;
			return client.request('POST', `${ENDPOINTS.TOKENS.BY_ID(tokenId)}/resume`);
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
