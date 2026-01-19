/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../../transport';
import { ENDPOINTS } from '../../constants';

export const settlementOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['settlement'] } },
		options: [
			{ name: 'Confirm', value: 'confirm', description: 'Confirm a settlement', action: 'Confirm settlement' },
			{ name: 'Create', value: 'create', description: 'Create a new settlement', action: 'Create settlement' },
			{ name: 'Export', value: 'export', description: 'Export settlement data', action: 'Export settlement' },
			{ name: 'Get', value: 'get', description: 'Get settlement details', action: 'Get settlement' },
			{ name: 'Get DVP Status', value: 'getDvpStatus', description: 'Get DVP status', action: 'Get DVP status' },
			{ name: 'Get Instructions', value: 'getInstructions', description: 'Get settlement instructions', action: 'Get instructions' },
			{ name: 'Get Many', value: 'getMany', description: 'Get many settlements', action: 'Get many settlements' },
			{ name: 'Get Network Status', value: 'getNetworkStatus', description: 'Get settlement network status', action: 'Get network status' },
			{ name: 'Initiate', value: 'initiate', description: 'Initiate settlement process', action: 'Initiate settlement' },
		],
		default: 'getMany',
	},
];

export const settlementFields: INodeProperties[] = [
	{
		displayName: 'Settlement ID',
		name: 'settlementId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['settlement'], operation: ['get', 'confirm', 'initiate', 'getInstructions', 'getDvpStatus', 'export'] } },
		default: '',
		description: 'Settlement ID',
	},
	{
		displayName: 'Counterparty',
		name: 'counterparty',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['settlement'], operation: ['create'] } },
		default: '',
		description: 'Counterparty identifier',
	},
	{
		displayName: 'Settlement Type',
		name: 'settlementType',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['settlement'], operation: ['create'] } },
		options: [
			{ name: 'DVP (Delivery vs Payment)', value: 'dvp' },
			{ name: 'FOP (Free of Payment)', value: 'fop' },
			{ name: 'PVP (Payment vs Payment)', value: 'pvp' },
			{ name: 'Atomic', value: 'atomic' },
		],
		default: 'dvp',
		description: 'Type of settlement',
	},
	{
		displayName: 'Asset',
		name: 'asset',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['settlement'], operation: ['create'] } },
		default: '',
		description: 'Asset to settle',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['settlement'], operation: ['create'] } },
		default: '',
		description: 'Settlement amount',
	},
	{
		displayName: 'Settlement Date',
		name: 'settlementDate',
		type: 'dateTime',
		required: true,
		displayOptions: { show: { resource: ['settlement'], operation: ['create'] } },
		default: '',
		description: 'Target settlement date',
	},
	{
		displayName: 'Vault ID',
		name: 'vaultId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['settlement'], operation: ['create', 'initiate'] } },
		default: '',
		description: 'Vault to use for settlement',
	},
	{
		displayName: 'Settlement Network',
		name: 'network',
		type: 'options',
		displayOptions: { show: { resource: ['settlement'], operation: ['create', 'getNetworkStatus'] } },
		options: [
			{ name: 'DTCC', value: 'dtcc' },
			{ name: 'Euroclear', value: 'euroclear' },
			{ name: 'Clearstream', value: 'clearstream' },
			{ name: 'SWIFT', value: 'swift' },
			{ name: 'Internal', value: 'internal' },
		],
		default: 'internal',
		description: 'Settlement network',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['settlement'], operation: ['create'] } },
		options: [
			{ displayName: 'Reference', name: 'reference', type: 'string', default: '' },
			{ displayName: 'Notes', name: 'notes', type: 'string', default: '' },
			{ displayName: 'Payment Asset', name: 'paymentAsset', type: 'string', default: '' },
			{ displayName: 'Payment Amount', name: 'paymentAmount', type: 'string', default: '' },
		],
	},
	{
		displayName: 'Export Format',
		name: 'exportFormat',
		type: 'options',
		displayOptions: { show: { resource: ['settlement'], operation: ['export'] } },
		options: [
			{ name: 'JSON', value: 'json' },
			{ name: 'CSV', value: 'csv' },
			{ name: 'PDF', value: 'pdf' },
			{ name: 'ISO 20022', value: 'iso20022' },
		],
		default: 'json',
		description: 'Export format',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['settlement'], operation: ['getMany'] } },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['settlement'], operation: ['getMany'], returnAll: [false] } },
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
		displayOptions: { show: { resource: ['settlement'], operation: ['getMany'] } },
		options: [
			{ displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'Pending', value: 'pending' }, { name: 'In Progress', value: 'inProgress' }, { name: 'Completed', value: 'completed' }, { name: 'Failed', value: 'failed' }], default: '' },
			{ displayName: 'Counterparty', name: 'counterparty', type: 'string', default: '' },
			{ displayName: 'Start Date', name: 'startDate', type: 'dateTime', default: '' },
			{ displayName: 'End Date', name: 'endDate', type: 'dateTime', default: '' },
		],
	},
];

export async function executeSettlement(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);

	switch (operation) {
		case 'create': {
			const counterparty = this.getNodeParameter('counterparty', i) as string;
			const settlementType = this.getNodeParameter('settlementType', i) as string;
			const asset = this.getNodeParameter('asset', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const settlementDate = this.getNodeParameter('settlementDate', i) as string;
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const network = this.getNodeParameter('network', i, 'internal') as string;
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

			return client.request('POST', ENDPOINTS.SETTLEMENTS.BASE, {
				counterparty, type: settlementType, asset, amount, settlementDate, vaultId, network, ...additionalFields,
			});
		}

		case 'get': {
			const settlementId = this.getNodeParameter('settlementId', i) as string;
			return client.request('GET', ENDPOINTS.SETTLEMENTS.BY_ID(settlementId));
		}

		case 'getMany': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const filters = this.getNodeParameter('filters', i) as IDataObject;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.SETTLEMENTS.BASE, {}, filters);
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.SETTLEMENTS.BASE, {}, { ...filters, limit });
		}

		case 'initiate': {
			const settlementId = this.getNodeParameter('settlementId', i) as string;
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			return client.request('POST', ENDPOINTS.SETTLEMENTS.INITIATE, { settlementId, vaultId });
		}

		case 'confirm': {
			const settlementId = this.getNodeParameter('settlementId', i) as string;
			return client.request('POST', ENDPOINTS.SETTLEMENTS.CONFIRM(settlementId));
		}

		case 'getInstructions': {
			const settlementId = this.getNodeParameter('settlementId', i) as string;
			return client.request('GET', ENDPOINTS.SETTLEMENTS.INSTRUCTIONS(settlementId));
		}

		case 'getDvpStatus': {
			const settlementId = this.getNodeParameter('settlementId', i) as string;
			return client.request('GET', ENDPOINTS.SETTLEMENTS.DVP(settlementId));
		}

		case 'getNetworkStatus': {
			const network = this.getNodeParameter('network', i, 'internal') as string;
			return client.request('GET', ENDPOINTS.SETTLEMENTS.NETWORK, {}, { network });
		}

		case 'export': {
			const settlementId = this.getNodeParameter('settlementId', i) as string;
			const exportFormat = this.getNodeParameter('exportFormat', i) as string;
			return client.request('GET', ENDPOINTS.SETTLEMENTS.EXPORT, {}, { settlementId, format: exportFormat });
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
