/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../../transport';
import { ENDPOINTS } from '../../constants';

export const tradingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['trading'] } },
		options: [
			{ name: 'Cancel Order', value: 'cancelOrder', description: 'Cancel an open order', action: 'Cancel order' },
			{ name: 'Connect Exchange', value: 'connectExchange', description: 'Connect to an exchange', action: 'Connect exchange' },
			{ name: 'Deposit', value: 'deposit', description: 'Deposit to exchange', action: 'Deposit to exchange' },
			{ name: 'Disconnect Exchange', value: 'disconnectExchange', description: 'Disconnect from an exchange', action: 'Disconnect exchange' },
			{ name: 'Get Balances', value: 'getBalances', description: 'Get exchange balances', action: 'Get exchange balances' },
			{ name: 'Get Execution', value: 'getExecution', description: 'Get order execution details', action: 'Get execution details' },
			{ name: 'Get Order History', value: 'getOrderHistory', description: 'Get order history', action: 'Get order history' },
			{ name: 'Get Orderbook', value: 'getOrderbook', description: 'Get orderbook for a pair', action: 'Get orderbook' },
			{ name: 'Get Pairs', value: 'getPairs', description: 'Get available trading pairs', action: 'Get trading pairs' },
			{ name: 'Submit Order', value: 'submitOrder', description: 'Submit a new order', action: 'Submit order' },
			{ name: 'Withdraw', value: 'withdraw', description: 'Withdraw from exchange', action: 'Withdraw from exchange' },
		],
		default: 'getPairs',
	},
];

export const tradingFields: INodeProperties[] = [
	{
		displayName: 'Exchange',
		name: 'exchange',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['trading'] } },
		options: [
			{ name: 'Binance', value: 'binance' },
			{ name: 'Coinbase', value: 'coinbase' },
			{ name: 'Kraken', value: 'kraken' },
			{ name: 'FTX', value: 'ftx' },
			{ name: 'Bitstamp', value: 'bitstamp' },
			{ name: 'Gemini', value: 'gemini' },
			{ name: 'OKX', value: 'okx' },
			{ name: 'Bybit', value: 'bybit' },
		],
		default: 'binance',
		description: 'Exchange to trade on',
	},
	{
		displayName: 'Vault ID',
		name: 'vaultId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['trading'], operation: ['connectExchange', 'disconnectExchange', 'deposit', 'withdraw'] } },
		default: '',
		description: 'Vault for exchange operations',
	},
	{
		displayName: 'Trading Pair',
		name: 'pair',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['trading'], operation: ['submitOrder', 'getOrderbook'] } },
		default: '',
		placeholder: 'BTC/USD',
		description: 'Trading pair',
	},
	{
		displayName: 'Order Type',
		name: 'orderType',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['trading'], operation: ['submitOrder'] } },
		options: [
			{ name: 'Market', value: 'market' },
			{ name: 'Limit', value: 'limit' },
			{ name: 'Stop-Loss', value: 'stopLoss' },
			{ name: 'Take-Profit', value: 'takeProfit' },
			{ name: 'Stop-Limit', value: 'stopLimit' },
		],
		default: 'market',
		description: 'Order type',
	},
	{
		displayName: 'Side',
		name: 'side',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['trading'], operation: ['submitOrder'] } },
		options: [
			{ name: 'Buy', value: 'buy' },
			{ name: 'Sell', value: 'sell' },
		],
		default: 'buy',
		description: 'Order side',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['trading'], operation: ['submitOrder', 'deposit', 'withdraw'] } },
		default: '',
		description: 'Amount to trade/transfer',
	},
	{
		displayName: 'Price',
		name: 'price',
		type: 'string',
		displayOptions: { show: { resource: ['trading'], operation: ['submitOrder'], orderType: ['limit', 'stopLimit'] } },
		default: '',
		description: 'Limit price',
	},
	{
		displayName: 'Stop Price',
		name: 'stopPrice',
		type: 'string',
		displayOptions: { show: { resource: ['trading'], operation: ['submitOrder'], orderType: ['stopLoss', 'takeProfit', 'stopLimit'] } },
		default: '',
		description: 'Stop trigger price',
	},
	{
		displayName: 'Order ID',
		name: 'orderId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['trading'], operation: ['cancelOrder', 'getExecution'] } },
		default: '',
		description: 'Order ID',
	},
	{
		displayName: 'Asset',
		name: 'asset',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['trading'], operation: ['deposit', 'withdraw'] } },
		default: '',
		description: 'Asset to deposit/withdraw',
	},
	{
		displayName: 'Destination Address',
		name: 'destinationAddress',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['trading'], operation: ['withdraw'] } },
		default: '',
		description: 'Withdrawal destination address',
	},
	{
		displayName: 'API Credentials',
		name: 'apiCredentials',
		type: 'collection',
		placeholder: 'Add Credentials',
		default: {},
		displayOptions: { show: { resource: ['trading'], operation: ['connectExchange'] } },
		options: [
			{ displayName: 'API Key', name: 'apiKey', type: 'string', typeOptions: { password: true }, default: '' },
			{ displayName: 'API Secret', name: 'apiSecret', type: 'string', typeOptions: { password: true }, default: '' },
			{ displayName: 'Passphrase', name: 'passphrase', type: 'string', typeOptions: { password: true }, default: '' },
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['trading'], operation: ['getPairs', 'getOrderHistory', 'getBalances'] } },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['trading'], operation: ['getPairs', 'getOrderHistory', 'getBalances'], returnAll: [false] } },
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
		displayOptions: { show: { resource: ['trading'], operation: ['getOrderHistory'] } },
		options: [
			{ displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'Open', value: 'open' }, { name: 'Closed', value: 'closed' }, { name: 'Cancelled', value: 'cancelled' }], default: '' },
			{ displayName: 'Pair', name: 'pair', type: 'string', default: '' },
			{ displayName: 'Start Date', name: 'startDate', type: 'dateTime', default: '' },
			{ displayName: 'End Date', name: 'endDate', type: 'dateTime', default: '' },
		],
	},
];

export async function executeTrading(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);
	const exchange = this.getNodeParameter('exchange', i) as string;

	switch (operation) {
		case 'connectExchange': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const apiCredentials = this.getNodeParameter('apiCredentials', i) as IDataObject;

			return client.request('POST', ENDPOINTS.TRADING.EXCHANGE_CONNECT, { vaultId, exchange, ...apiCredentials });
		}

		case 'disconnectExchange': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			return client.request('POST', ENDPOINTS.TRADING.EXCHANGE_DISCONNECT(exchange), { vaultId });
		}

		case 'getPairs': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.TRADING.PAIRS, {}, { exchange });
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.TRADING.PAIRS, {}, { exchange, limit });
		}

		case 'submitOrder': {
			const pair = this.getNodeParameter('pair', i) as string;
			const orderType = this.getNodeParameter('orderType', i) as string;
			const side = this.getNodeParameter('side', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const price = this.getNodeParameter('price', i, '') as string;
			const stopPrice = this.getNodeParameter('stopPrice', i, '') as string;

			return client.request('POST', ENDPOINTS.TRADING.ORDERS, {
				exchange, pair, type: orderType, side, amount,
				price: price || undefined,
				stopPrice: stopPrice || undefined,
			});
		}

		case 'cancelOrder': {
			const orderId = this.getNodeParameter('orderId', i) as string;
			return client.request('DELETE', `${ENDPOINTS.TRADING.ORDERS}/${orderId}`, { exchange });
		}

		case 'getOrderHistory': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const filters = this.getNodeParameter('filters', i) as IDataObject;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.TRADING.HISTORY, {}, { exchange, ...filters });
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.TRADING.HISTORY, {}, { exchange, limit, ...filters });
		}

		case 'getOrderbook': {
			const pair = this.getNodeParameter('pair', i) as string;
			return client.request('GET', ENDPOINTS.TRADING.ORDERBOOK, {}, { exchange, pair });
		}

		case 'getExecution': {
			const orderId = this.getNodeParameter('orderId', i) as string;
			return client.request('GET', `${ENDPOINTS.TRADING.ORDERS}/${orderId}/execution`, { exchange });
		}

		case 'getBalances': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.TRADING.BALANCES, {}, { exchange });
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.TRADING.BALANCES, {}, { exchange, limit });
		}

		case 'deposit': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const asset = this.getNodeParameter('asset', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;

			return client.request('POST', ENDPOINTS.TRADING.DEPOSIT, { vaultId, exchange, asset, amount });
		}

		case 'withdraw': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const asset = this.getNodeParameter('asset', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const destinationAddress = this.getNodeParameter('destinationAddress', i) as string;

			return client.request('POST', ENDPOINTS.TRADING.WITHDRAW, {
				vaultId, exchange, asset, amount, destinationAddress,
			});
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
