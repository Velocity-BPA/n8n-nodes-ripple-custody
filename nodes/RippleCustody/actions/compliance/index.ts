/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../../transport';
import { ENDPOINTS } from '../../constants';

export const complianceOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['compliance'] } },
		options: [
			{ name: 'Check Sanctions', value: 'checkSanctions', description: 'Check address against sanctions lists', action: 'Check sanctions' },
			{ name: 'Create Filing', value: 'createFiling', description: 'Create a regulatory filing', action: 'Create filing' },
			{ name: 'Get AML Report', value: 'getAmlReport', description: 'Get AML report', action: 'Get AML report' },
			{ name: 'Get Alerts', value: 'getAlerts', description: 'Get compliance alerts', action: 'Get compliance alerts' },
			{ name: 'Get Audit Trail', value: 'getAuditTrail', description: 'Get compliance audit trail', action: 'Get audit trail' },
			{ name: 'Get Filings', value: 'getFilings', description: 'Get regulatory filings', action: 'Get filings' },
			{ name: 'Get Risk Score', value: 'getRiskScore', description: 'Get risk score for address', action: 'Get risk score' },
			{ name: 'KYT Analysis', value: 'kytAnalysis', description: 'Perform KYT analysis', action: 'KYT analysis' },
			{ name: 'Screen Address', value: 'screenAddress', description: 'Screen an address', action: 'Screen address' },
			{ name: 'Screen Transaction', value: 'screenTransaction', description: 'Screen a transaction', action: 'Screen transaction' },
			{ name: 'Send Travel Rule', value: 'sendTravelRule', description: 'Send travel rule message', action: 'Send travel rule' },
		],
		default: 'screenAddress',
	},
];

export const complianceFields: INodeProperties[] = [
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['compliance'], operation: ['screenAddress', 'getRiskScore', 'checkSanctions'] } },
		default: '',
		description: 'Blockchain address to screen',
	},
	{
		displayName: 'Transaction Hash',
		name: 'transactionHash',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['compliance'], operation: ['screenTransaction', 'kytAnalysis'] } },
		default: '',
		description: 'Transaction hash to analyze',
	},
	{
		displayName: 'Blockchain',
		name: 'blockchain',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['compliance'], operation: ['screenAddress', 'screenTransaction', 'getRiskScore', 'checkSanctions', 'kytAnalysis'] } },
		options: [
			{ name: 'Bitcoin', value: 'bitcoin' },
			{ name: 'Ethereum', value: 'ethereum' },
			{ name: 'XRP Ledger', value: 'xrp' },
			{ name: 'Solana', value: 'solana' },
			{ name: 'Polygon', value: 'polygon' },
			{ name: 'BNB Chain', value: 'bnb' },
		],
		default: 'ethereum',
		description: 'Blockchain network',
	},
	{
		displayName: 'KYT Provider',
		name: 'kytProvider',
		type: 'options',
		displayOptions: { show: { resource: ['compliance'], operation: ['screenAddress', 'screenTransaction', 'kytAnalysis'] } },
		options: [
			{ name: 'Chainalysis', value: 'chainalysis' },
			{ name: 'Elliptic', value: 'elliptic' },
			{ name: 'TRM Labs', value: 'trm' },
			{ name: 'Crystal', value: 'crystal' },
			{ name: 'Scorechain', value: 'scorechain' },
		],
		default: 'chainalysis',
		description: 'KYT provider to use',
	},
	{
		displayName: 'Sanctions Lists',
		name: 'sanctionsLists',
		type: 'multiOptions',
		displayOptions: { show: { resource: ['compliance'], operation: ['checkSanctions'] } },
		options: [
			{ name: 'OFAC SDN', value: 'ofac_sdn' },
			{ name: 'EU Sanctions', value: 'eu' },
			{ name: 'UK Sanctions', value: 'uk' },
			{ name: 'UN Sanctions', value: 'un' },
			{ name: 'All', value: 'all' },
		],
		default: ['all'],
		description: 'Sanctions lists to check against',
	},
	{
		displayName: 'Travel Rule Data',
		name: 'travelRuleData',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['compliance'], operation: ['sendTravelRule'] } },
		options: [
			{ displayName: 'Originator Name', name: 'originatorName', type: 'string', default: '' },
			{ displayName: 'Originator Address', name: 'originatorAddress', type: 'string', default: '' },
			{ displayName: 'Beneficiary Name', name: 'beneficiaryName', type: 'string', default: '' },
			{ displayName: 'Beneficiary Address', name: 'beneficiaryAddress', type: 'string', default: '' },
			{ displayName: 'Amount', name: 'amount', type: 'string', default: '' },
			{ displayName: 'Asset', name: 'asset', type: 'string', default: '' },
			{ displayName: 'VASP ID', name: 'vaspId', type: 'string', default: '' },
		],
	},
	{
		displayName: 'Filing Type',
		name: 'filingType',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['compliance'], operation: ['createFiling'] } },
		options: [
			{ name: 'SAR', value: 'sar' },
			{ name: 'CTR', value: 'ctr' },
			{ name: 'STR', value: 'str' },
			{ name: 'FATCA', value: 'fatca' },
			{ name: 'CRS', value: 'crs' },
		],
		default: 'sar',
		description: 'Type of regulatory filing',
	},
	{
		displayName: 'Filing Details',
		name: 'filingDetails',
		type: 'json',
		required: true,
		displayOptions: { show: { resource: ['compliance'], operation: ['createFiling'] } },
		default: '{}',
		description: 'Filing details as JSON',
	},
	{
		displayName: 'Alert Status',
		name: 'alertStatus',
		type: 'options',
		displayOptions: { show: { resource: ['compliance'], operation: ['getAlerts'] } },
		options: [
			{ name: 'All', value: 'all' },
			{ name: 'Open', value: 'open' },
			{ name: 'Investigating', value: 'investigating' },
			{ name: 'Resolved', value: 'resolved' },
			{ name: 'Dismissed', value: 'dismissed' },
		],
		default: 'open',
		description: 'Filter alerts by status',
	},
	{
		displayName: 'Report Period',
		name: 'reportPeriod',
		type: 'options',
		displayOptions: { show: { resource: ['compliance'], operation: ['getAmlReport'] } },
		options: [
			{ name: 'Daily', value: 'daily' },
			{ name: 'Weekly', value: 'weekly' },
			{ name: 'Monthly', value: 'monthly' },
			{ name: 'Quarterly', value: 'quarterly' },
			{ name: 'Custom', value: 'custom' },
		],
		default: 'monthly',
		description: 'Report period',
	},
	{
		displayName: 'Start Date',
		name: 'startDate',
		type: 'dateTime',
		displayOptions: { show: { resource: ['compliance'], operation: ['getAmlReport', 'getAuditTrail', 'getFilings'], reportPeriod: ['custom'] } },
		default: '',
		description: 'Start date for report',
	},
	{
		displayName: 'End Date',
		name: 'endDate',
		type: 'dateTime',
		displayOptions: { show: { resource: ['compliance'], operation: ['getAmlReport', 'getAuditTrail', 'getFilings'], reportPeriod: ['custom'] } },
		default: '',
		description: 'End date for report',
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['compliance'], operation: ['getAlerts', 'getAuditTrail', 'getFilings'] } },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['compliance'], operation: ['getAlerts', 'getAuditTrail', 'getFilings'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
		description: 'Max number of results to return',
	},
];

export async function executeCompliance(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);

	switch (operation) {
		case 'screenAddress': {
			const address = this.getNodeParameter('address', i) as string;
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			const kytProvider = this.getNodeParameter('kytProvider', i) as string;

			return client.request('POST', ENDPOINTS.COMPLIANCE.SCREEN_ADDRESS, { address, blockchain, provider: kytProvider });
		}

		case 'screenTransaction': {
			const transactionHash = this.getNodeParameter('transactionHash', i) as string;
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			const kytProvider = this.getNodeParameter('kytProvider', i) as string;

			return client.request('POST', ENDPOINTS.COMPLIANCE.SCREEN_TRANSACTION, { transactionHash, blockchain, provider: kytProvider });
		}

		case 'getRiskScore': {
			const address = this.getNodeParameter('address', i) as string;
			const blockchain = this.getNodeParameter('blockchain', i) as string;

			return client.request('GET', ENDPOINTS.COMPLIANCE.RISK_SCORE(address), {}, { blockchain });
		}

		case 'checkSanctions': {
			const address = this.getNodeParameter('address', i) as string;
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			const sanctionsLists = this.getNodeParameter('sanctionsLists', i) as string[];

			return client.request('POST', ENDPOINTS.COMPLIANCE.SANCTIONS, { address, blockchain, lists: sanctionsLists });
		}

		case 'kytAnalysis': {
			const transactionHash = this.getNodeParameter('transactionHash', i) as string;
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			const kytProvider = this.getNodeParameter('kytProvider', i) as string;

			return client.request('POST', ENDPOINTS.COMPLIANCE.KYT, { transactionHash, blockchain, provider: kytProvider });
		}

		case 'sendTravelRule': {
			const travelRuleData = this.getNodeParameter('travelRuleData', i) as IDataObject;
			return client.request('POST', ENDPOINTS.COMPLIANCE.TRAVEL_RULE, travelRuleData);
		}

		case 'getAlerts': {
			const alertStatus = this.getNodeParameter('alertStatus', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			const params: IDataObject = alertStatus !== 'all' ? { status: alertStatus } : {};

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.COMPLIANCE.ALERTS, {}, params);
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.COMPLIANCE.ALERTS, {}, { ...params, limit });
		}

		case 'getAmlReport': {
			const address = this.getNodeParameter('address', i, '') as string;
			const reportPeriod = this.getNodeParameter('reportPeriod', i) as string;
			const params: IDataObject = { period: reportPeriod };

			if (reportPeriod === 'custom') {
				params.startDate = this.getNodeParameter('startDate', i) as string;
				params.endDate = this.getNodeParameter('endDate', i) as string;
			}

			const endpoint = address ? ENDPOINTS.COMPLIANCE.AML_REPORT(address) : ENDPOINTS.COMPLIANCE.AML;
			return client.request('GET', endpoint, {}, params);
		}

		case 'getAuditTrail': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.COMPLIANCE.AUDIT);
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.COMPLIANCE.AUDIT, {}, { limit });
		}

		case 'createFiling': {
			const filingType = this.getNodeParameter('filingType', i) as string;
			const filingDetails = JSON.parse(this.getNodeParameter('filingDetails', i) as string);

			return client.request('POST', ENDPOINTS.COMPLIANCE.FILINGS, { type: filingType, ...filingDetails });
		}

		case 'getFilings': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.COMPLIANCE.FILINGS);
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.COMPLIANCE.FILINGS, {}, { limit });
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
