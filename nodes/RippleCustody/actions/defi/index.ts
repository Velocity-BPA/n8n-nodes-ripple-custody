/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../../transport';
import { ENDPOINTS } from '../../constants';

export const defiOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['defi'] } },
		options: [
			{ name: 'Add Liquidity', value: 'addLiquidity', description: 'Add liquidity to a pool', action: 'Add liquidity' },
			{ name: 'Connect DApp', value: 'connectDapp', description: 'Connect to a DeFi protocol', action: 'Connect DApp' },
			{ name: 'Disconnect DApp', value: 'disconnectDapp', description: 'Disconnect from a DeFi protocol', action: 'Disconnect DApp' },
			{ name: 'Execute', value: 'execute', description: 'Execute a DeFi transaction', action: 'Execute DeFi transaction' },
			{ name: 'Get Analytics', value: 'getAnalytics', description: 'Get DeFi portfolio analytics', action: 'Get analytics' },
			{ name: 'Get Positions', value: 'getPositions', description: 'Get DeFi positions', action: 'Get DeFi positions' },
			{ name: 'Get Protocols', value: 'getProtocols', description: 'Get supported DeFi protocols', action: 'Get protocols' },
			{ name: 'Get Yield', value: 'getYield', description: 'Get yield opportunities', action: 'Get yield opportunities' },
			{ name: 'Harvest', value: 'harvest', description: 'Harvest DeFi rewards', action: 'Harvest rewards' },
			{ name: 'Remove Liquidity', value: 'removeLiquidity', description: 'Remove liquidity from a pool', action: 'Remove liquidity' },
			{ name: 'Swap', value: 'swap', description: 'Execute a token swap', action: 'Swap tokens' },
		],
		default: 'getPositions',
	},
];

export const defiFields: INodeProperties[] = [
	{
		displayName: 'Vault ID',
		name: 'vaultId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['defi'],
				operation: ['connectDapp', 'disconnectDapp', 'execute', 'addLiquidity', 'removeLiquidity', 'swap', 'harvest', 'getPositions', 'getAnalytics'],
			},
		},
		default: '',
		description: 'The vault to use for DeFi operations',
	},
	{
		displayName: 'Blockchain',
		name: 'blockchain',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['defi'] } },
		options: [
			{ name: 'Ethereum', value: 'ethereum' },
			{ name: 'Polygon', value: 'polygon' },
			{ name: 'Avalanche', value: 'avalanche' },
			{ name: 'BNB Chain', value: 'bnb' },
			{ name: 'Arbitrum', value: 'arbitrum' },
			{ name: 'Optimism', value: 'optimism' },
			{ name: 'Base', value: 'base' },
			{ name: 'Solana', value: 'solana' },
		],
		default: 'ethereum',
		description: 'Blockchain network',
	},
	{
		displayName: 'Protocol',
		name: 'protocol',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['defi'], operation: ['connectDapp', 'disconnectDapp', 'execute', 'addLiquidity', 'removeLiquidity', 'swap'] } },
		options: [
			{ name: 'Uniswap', value: 'uniswap' },
			{ name: 'Aave', value: 'aave' },
			{ name: 'Compound', value: 'compound' },
			{ name: 'Curve', value: 'curve' },
			{ name: 'Lido', value: 'lido' },
			{ name: 'MakerDAO', value: 'makerdao' },
			{ name: 'SushiSwap', value: 'sushiswap' },
			{ name: '1inch', value: '1inch' },
			{ name: 'Balancer', value: 'balancer' },
			{ name: 'Yearn', value: 'yearn' },
		],
		default: 'uniswap',
		description: 'DeFi protocol to interact with',
	},
	{
		displayName: 'Pool Address',
		name: 'poolAddress',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['defi'], operation: ['addLiquidity', 'removeLiquidity'] } },
		default: '',
		description: 'Liquidity pool address',
	},
	{
		displayName: 'Token A',
		name: 'tokenA',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['defi'], operation: ['addLiquidity', 'swap'] } },
		default: '',
		description: 'First token address',
	},
	{
		displayName: 'Token B',
		name: 'tokenB',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['defi'], operation: ['addLiquidity', 'swap'] } },
		default: '',
		description: 'Second token address',
	},
	{
		displayName: 'Amount A',
		name: 'amountA',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['defi'], operation: ['addLiquidity'] } },
		default: '',
		description: 'Amount of first token',
	},
	{
		displayName: 'Amount B',
		name: 'amountB',
		type: 'string',
		displayOptions: { show: { resource: ['defi'], operation: ['addLiquidity'] } },
		default: '',
		description: 'Amount of second token',
	},
	{
		displayName: 'Swap Amount',
		name: 'swapAmount',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['defi'], operation: ['swap'] } },
		default: '',
		description: 'Amount to swap',
	},
	{
		displayName: 'Slippage (%)',
		name: 'slippage',
		type: 'number',
		displayOptions: { show: { resource: ['defi'], operation: ['addLiquidity', 'removeLiquidity', 'swap'] } },
		typeOptions: { minValue: 0.1, maxValue: 50 },
		default: 0.5,
		description: 'Maximum slippage tolerance',
	},
	{
		displayName: 'LP Token Amount',
		name: 'lpAmount',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['defi'], operation: ['removeLiquidity'] } },
		default: '',
		description: 'Amount of LP tokens to remove',
	},
	{
		displayName: 'Position ID',
		name: 'positionId',
		type: 'string',
		displayOptions: { show: { resource: ['defi'], operation: ['harvest', 'removeLiquidity'] } },
		default: '',
		description: 'DeFi position ID',
	},
	{
		displayName: 'Transaction Data',
		name: 'transactionData',
		type: 'json',
		required: true,
		displayOptions: { show: { resource: ['defi'], operation: ['execute'] } },
		default: '{}',
		description: 'Raw transaction data for execution',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['defi'], operation: ['getPositions', 'getProtocols', 'getYield'] } },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['defi'], operation: ['getPositions', 'getProtocols', 'getYield'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
		description: 'Max number of results to return',
	},
];

export async function executeDefi(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);
	const blockchain = this.getNodeParameter('blockchain', i) as string;

	switch (operation) {
		case 'connectDapp': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const protocol = this.getNodeParameter('protocol', i) as string;

			return client.request('POST', ENDPOINTS.DEFI.CONNECT, { vaultId, blockchain, protocol });
		}

		case 'disconnectDapp': {
			const connectionId = this.getNodeParameter('connectionId', i, '') as string;
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const protocol = this.getNodeParameter('protocol', i) as string;

			if (connectionId) {
				return client.request('POST', ENDPOINTS.DEFI.DISCONNECT(connectionId));
			}
			return client.request('POST', `${ENDPOINTS.DEFI.BASE}/disconnect`, { vaultId, blockchain, protocol });
		}

		case 'execute': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const protocol = this.getNodeParameter('protocol', i) as string;
			const transactionData = JSON.parse(this.getNodeParameter('transactionData', i) as string);

			return client.request('POST', ENDPOINTS.DEFI.EXECUTE, { vaultId, blockchain, protocol, ...transactionData });
		}

		case 'addLiquidity': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const protocol = this.getNodeParameter('protocol', i) as string;
			const poolAddress = this.getNodeParameter('poolAddress', i) as string;
			const tokenA = this.getNodeParameter('tokenA', i) as string;
			const tokenB = this.getNodeParameter('tokenB', i) as string;
			const amountA = this.getNodeParameter('amountA', i) as string;
			const amountB = this.getNodeParameter('amountB', i, '') as string;
			const slippage = this.getNodeParameter('slippage', i) as number;

			return client.request('POST', ENDPOINTS.DEFI.ADD_LIQUIDITY, {
				vaultId, blockchain, protocol, poolAddress, tokenA, tokenB, amountA, amountB, slippage,
			});
		}

		case 'removeLiquidity': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const protocol = this.getNodeParameter('protocol', i) as string;
			const poolAddress = this.getNodeParameter('poolAddress', i) as string;
			const lpAmount = this.getNodeParameter('lpAmount', i) as string;
			const slippage = this.getNodeParameter('slippage', i) as number;
			const positionId = this.getNodeParameter('positionId', i, '') as string;

			return client.request('POST', ENDPOINTS.DEFI.REMOVE_LIQUIDITY, {
				vaultId, blockchain, protocol, poolAddress, lpAmount, slippage, positionId: positionId || undefined,
			});
		}

		case 'swap': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const protocol = this.getNodeParameter('protocol', i) as string;
			const tokenA = this.getNodeParameter('tokenA', i) as string;
			const tokenB = this.getNodeParameter('tokenB', i) as string;
			const swapAmount = this.getNodeParameter('swapAmount', i) as string;
			const slippage = this.getNodeParameter('slippage', i) as number;

			return client.request('POST', ENDPOINTS.DEFI.SWAP, {
				vaultId, blockchain, protocol, fromToken: tokenA, toToken: tokenB, amount: swapAmount, slippage,
			});
		}

		case 'harvest': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const positionId = this.getNodeParameter('positionId', i, '') as string;

			return client.request('POST', ENDPOINTS.DEFI.HARVEST, {
				vaultId, blockchain, positionId: positionId || undefined,
			});
		}

		case 'getPositions': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.DEFI.POSITIONS, {}, { vaultId, blockchain });
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.DEFI.POSITIONS, {}, { vaultId, blockchain, limit });
		}

		case 'getProtocols': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.DEFI.PROTOCOLS, {}, { blockchain });
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.DEFI.PROTOCOLS, {}, { blockchain, limit });
		}

		case 'getYield': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.DEFI.YIELD, {}, { blockchain });
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.DEFI.YIELD, {}, { blockchain, limit });
		}

		case 'getAnalytics': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			return client.request('GET', ENDPOINTS.DEFI.ANALYTICS, {}, { vaultId, blockchain });
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
