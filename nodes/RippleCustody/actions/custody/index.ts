/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../../transport';
import { ENDPOINTS } from '../../constants';

export const custodyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['custody'] } },
		options: [
			{ name: 'Create Sub-Account', value: 'createSubAccount', description: 'Create a sub-account', action: 'Create sub-account' },
			{ name: 'Generate Statement', value: 'generateStatement', description: 'Generate custody statement', action: 'Generate statement' },
			{ name: 'Get Account', value: 'getAccount', description: 'Get custody account details', action: 'Get custody account' },
			{ name: 'Get Audit Log', value: 'getAuditLog', description: 'Get custody audit log', action: 'Get audit log' },
			{ name: 'Get Fees', value: 'getFees', description: 'Get custody fees', action: 'Get custody fees' },
			{ name: 'Get Regulatory Reports', value: 'getRegulatoryReports', description: 'Get regulatory reports', action: 'Get regulatory reports' },
			{ name: 'Get Sub-Accounts', value: 'getSubAccounts', description: 'Get sub-accounts', action: 'Get sub-accounts' },
			{ name: 'Internal Transfer', value: 'internalTransfer', description: 'Transfer between sub-accounts', action: 'Internal transfer' },
			{ name: 'Update Sub-Account', value: 'updateSubAccount', description: 'Update a sub-account', action: 'Update sub-account' },
		],
		default: 'getAccount',
	},
];

export const custodyFields: INodeProperties[] = [
	{
		displayName: 'Account ID',
		name: 'accountId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['custody'], operation: ['getAccount', 'getSubAccounts', 'createSubAccount', 'generateStatement', 'getFees', 'getAuditLog'] } },
		default: '',
		description: 'Custody account ID',
	},
	{
		displayName: 'Sub-Account ID',
		name: 'subAccountId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['custody'], operation: ['updateSubAccount'] } },
		default: '',
		description: 'Sub-account ID',
	},
	{
		displayName: 'Sub-Account Name',
		name: 'subAccountName',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['custody'], operation: ['createSubAccount'] } },
		default: '',
		description: 'Name for the new sub-account',
	},
	{
		displayName: 'Sub-Account Type',
		name: 'subAccountType',
		type: 'options',
		displayOptions: { show: { resource: ['custody'], operation: ['createSubAccount'] } },
		options: [
			{ name: 'Trading', value: 'trading' },
			{ name: 'Custody', value: 'custody' },
			{ name: 'Staking', value: 'staking' },
			{ name: 'DeFi', value: 'defi' },
		],
		default: 'custody',
		description: 'Type of sub-account',
	},
	{
		displayName: 'From Sub-Account',
		name: 'fromSubAccount',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['custody'], operation: ['internalTransfer'] } },
		default: '',
		description: 'Source sub-account ID',
	},
	{
		displayName: 'To Sub-Account',
		name: 'toSubAccount',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['custody'], operation: ['internalTransfer'] } },
		default: '',
		description: 'Destination sub-account ID',
	},
	{
		displayName: 'Asset',
		name: 'asset',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['custody'], operation: ['internalTransfer'] } },
		default: '',
		description: 'Asset to transfer',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['custody'], operation: ['internalTransfer'] } },
		default: '',
		description: 'Amount to transfer',
	},
	{
		displayName: 'Statement Period',
		name: 'statementPeriod',
		type: 'options',
		displayOptions: { show: { resource: ['custody'], operation: ['generateStatement'] } },
		options: [
			{ name: 'Daily', value: 'daily' },
			{ name: 'Weekly', value: 'weekly' },
			{ name: 'Monthly', value: 'monthly' },
			{ name: 'Quarterly', value: 'quarterly' },
			{ name: 'Annual', value: 'annual' },
			{ name: 'Custom', value: 'custom' },
		],
		default: 'monthly',
		description: 'Statement period',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		displayOptions: { show: { resource: ['custody'], operation: ['generateStatement', 'getAuditLog', 'getRegulatoryReports'], statementPeriod: ['custom'] } },
		default: '',
		description: 'Start date for statement',
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		displayOptions: { show: { resource: ['custody'], operation: ['generateStatement', 'getAuditLog', 'getRegulatoryReports'], statementPeriod: ['custom'] } },
		default: '',
		description: 'End date for statement',
	},
	{
		displayName: 'Report Type',
		name: 'reportType',
		type: 'options',
		displayOptions: { show: { resource: ['custody'], operation: ['getRegulatoryReports'] } },
		options: [
			{ name: 'FATCA', value: 'fatca' },
			{ name: 'CRS', value: 'crs' },
			{ name: 'MiFID II', value: 'mifid2' },
			{ name: 'GDPR', value: 'gdpr' },
			{ name: 'AML', value: 'aml' },
		],
		default: 'aml',
		description: 'Regulatory report type',
	},
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['custody'], operation: ['updateSubAccount'] } },
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '' },
			{ displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'Active', value: 'active' }, { name: 'Suspended', value: 'suspended' }, { name: 'Closed', value: 'closed' }], default: 'active' },
			{ displayName: 'Description', name: 'description', type: 'string', default: '' },
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['custody'], operation: ['getSubAccounts', 'getAuditLog', 'getRegulatoryReports'] } },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['custody'], operation: ['getSubAccounts', 'getAuditLog', 'getRegulatoryReports'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
		description: 'Max number of results to return',
	},
];

export async function executeCustody(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);

	switch (operation) {
		case 'getAccount': {
			const accountId = this.getNodeParameter('accountId', i) as string;
			return client.request('GET', ENDPOINTS.CUSTODY.BY_ID(accountId));
		}

		case 'getSubAccounts': {
			const accountId = this.getNodeParameter('accountId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.CUSTODY.SUB_ACCOUNTS(accountId));
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.CUSTODY.SUB_ACCOUNTS(accountId), {}, { limit });
		}

		case 'createSubAccount': {
			const accountId = this.getNodeParameter('accountId', i) as string;
			const subAccountName = this.getNodeParameter('subAccountName', i) as string;
			const subAccountType = this.getNodeParameter('subAccountType', i) as string;

			return client.request('POST', ENDPOINTS.CUSTODY.SUB_ACCOUNTS(accountId), {
				name: subAccountName,
				type: subAccountType,
			});
		}

		case 'updateSubAccount': {
			const subAccountId = this.getNodeParameter('subAccountId', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

			return client.request('PATCH', `${ENDPOINTS.CUSTODY.BASE}/sub-accounts/${subAccountId}`, updateFields);
		}

		case 'internalTransfer': {
			const fromSubAccount = this.getNodeParameter('fromSubAccount', i) as string;
			const toSubAccount = this.getNodeParameter('toSubAccount', i) as string;
			const asset = this.getNodeParameter('asset', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;

			return client.request('POST', ENDPOINTS.CUSTODY.TRANSFER, {
				from: fromSubAccount,
				to: toSubAccount,
				asset,
				amount,
			});
		}

		case 'generateStatement': {
			const accountId = this.getNodeParameter('accountId', i) as string;
			const statementPeriod = this.getNodeParameter('statementPeriod', i) as string;
			const body: IDataObject = { period: statementPeriod };

			if (statementPeriod === 'custom') {
				body.startDate = this.getNodeParameter('startDate', i) as string;
				body.endDate = this.getNodeParameter('endDate', i) as string;
			}

			return client.request('POST', ENDPOINTS.CUSTODY.STATEMENT(accountId), body);
		}

		case 'getFees': {
			const accountId = this.getNodeParameter('accountId', i) as string;
			return client.request('GET', ENDPOINTS.CUSTODY.FEES, {}, { accountId });
		}

		case 'getAuditLog': {
			const accountId = this.getNodeParameter('accountId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.CUSTODY.AUDIT, {}, { accountId });
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.CUSTODY.AUDIT, {}, { accountId, limit });
		}

		case 'getRegulatoryReports': {
			const reportType = this.getNodeParameter('reportType', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.CUSTODY.REGULATORY, {}, { type: reportType });
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.CUSTODY.REGULATORY, {}, { type: reportType, limit });
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
