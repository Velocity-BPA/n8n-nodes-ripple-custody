/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../../transport';
import { ENDPOINTS } from '../../constants';

export const coldStorageOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['coldStorage'] } },
		options: [
			{ name: 'Complete OSO', value: 'completeOso', description: 'Complete offline signing orchestration', action: 'Complete OSO' },
			{ name: 'Get Balance', value: 'getBalance', description: 'Get cold storage balance', action: 'Get cold storage balance' },
			{ name: 'Get Scheduled', value: 'getScheduled', description: 'Get scheduled transfers', action: 'Get scheduled transfers' },
			{ name: 'Get Vault', value: 'getVault', description: 'Get cold storage vault', action: 'Get cold storage vault' },
			{ name: 'Get Vaults', value: 'getVaults', description: 'Get all cold storage vaults', action: 'Get cold storage vaults' },
			{ name: 'Initiate OSO', value: 'initiateOso', description: 'Initiate offline signing orchestration', action: 'Initiate OSO' },
			{ name: 'Move In', value: 'moveIn', description: 'Move assets to cold storage', action: 'Move to cold storage' },
			{ name: 'Move Out', value: 'moveOut', description: 'Move assets from cold storage', action: 'Move from cold storage' },
			{ name: 'Schedule Transfer', value: 'scheduleTransfer', description: 'Schedule a cold storage transfer', action: 'Schedule transfer' },
		],
		default: 'getVaults',
	},
];

export const coldStorageFields: INodeProperties[] = [
	{
		displayName: 'Cold Vault ID',
		name: 'coldVaultId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['coldStorage'], operation: ['getVault', 'getBalance', 'moveIn', 'moveOut', 'scheduleTransfer', 'initiateOso'] } },
		default: '',
		description: 'Cold storage vault ID',
	},
	{
		displayName: 'Source Vault ID',
		name: 'sourceVaultId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['coldStorage'], operation: ['moveIn'] } },
		default: '',
		description: 'Source vault (hot/warm) for transfer',
	},
	{
		displayName: 'Destination Vault ID',
		name: 'destinationVaultId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['coldStorage'], operation: ['moveOut'] } },
		default: '',
		description: 'Destination vault (hot/warm) for transfer',
	},
	{
		displayName: 'Asset',
		name: 'asset',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['coldStorage'], operation: ['moveIn', 'moveOut', 'scheduleTransfer', 'getBalance'] } },
		default: '',
		description: 'Asset to transfer',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['coldStorage'], operation: ['moveIn', 'moveOut', 'scheduleTransfer'] } },
		default: '',
		description: 'Amount to transfer',
	},
	{
		displayName: 'Scheduled Date',
		name: 'scheduledDate',
		type: 'dateTime',
		required: true,
		displayOptions: { show: { resource: ['coldStorage'], operation: ['scheduleTransfer'] } },
		default: '',
		description: 'Date and time for scheduled transfer',
	},
	{
		displayName: 'Transfer Direction',
		name: 'transferDirection',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['coldStorage'], operation: ['scheduleTransfer'] } },
		options: [
			{ name: 'In (Hot → Cold)', value: 'in' },
			{ name: 'Out (Cold → Hot)', value: 'out' },
		],
		default: 'in',
		description: 'Direction of transfer',
	},
	{
		displayName: 'OSO Session ID',
		name: 'osoSessionId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['coldStorage'], operation: ['completeOso'] } },
		default: '',
		description: 'Offline signing orchestration session ID',
	},
	{
		displayName: 'Signed Payload',
		name: 'signedPayload',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['coldStorage'], operation: ['completeOso'] } },
		default: '',
		description: 'Signed payload from offline device',
	},
	{
		displayName: 'Transaction Data',
		name: 'transactionData',
		type: 'json',
		required: true,
		displayOptions: { show: { resource: ['coldStorage'], operation: ['initiateOso'] } },
		default: '{}',
		description: 'Transaction data for offline signing',
	},
	{
		displayName: 'Approval Options',
		name: 'approvalOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['coldStorage'], operation: ['moveIn', 'moveOut'] } },
		options: [
			{ displayName: 'Required Approvers', name: 'requiredApprovers', type: 'number', default: 2 },
			{ displayName: 'Approval Timeout (Hours)', name: 'approvalTimeout', type: 'number', default: 24 },
			{ displayName: 'Notes', name: 'notes', type: 'string', default: '' },
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['coldStorage'], operation: ['getVaults', 'getScheduled'] } },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['coldStorage'], operation: ['getVaults', 'getScheduled'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
		description: 'Max number of results to return',
	},
];

export async function executeColdStorage(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);

	switch (operation) {
		case 'getVaults': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.COLD_STORAGE.VAULTS);
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.COLD_STORAGE.VAULTS, {}, { limit });
		}

		case 'getVault': {
			const coldVaultId = this.getNodeParameter('coldVaultId', i) as string;
			return client.request('GET', ENDPOINTS.COLD_STORAGE.BY_ID(coldVaultId));
		}

		case 'getBalance': {
			const coldVaultId = this.getNodeParameter('coldVaultId', i) as string;
			const asset = this.getNodeParameter('asset', i, '') as string;
			return client.request('GET', ENDPOINTS.COLD_STORAGE.BALANCE(coldVaultId), {}, { asset: asset || undefined });
		}

		case 'moveIn': {
			const coldVaultId = this.getNodeParameter('coldVaultId', i) as string;
			const sourceVaultId = this.getNodeParameter('sourceVaultId', i) as string;
			const asset = this.getNodeParameter('asset', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const approvalOptions = this.getNodeParameter('approvalOptions', i) as IDataObject;

			return client.request('POST', ENDPOINTS.COLD_STORAGE.MOVE_IN, {
				coldVaultId,
				sourceVaultId,
				asset,
				amount,
				...approvalOptions,
			});
		}

		case 'moveOut': {
			const coldVaultId = this.getNodeParameter('coldVaultId', i) as string;
			const destinationVaultId = this.getNodeParameter('destinationVaultId', i) as string;
			const asset = this.getNodeParameter('asset', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const approvalOptions = this.getNodeParameter('approvalOptions', i) as IDataObject;

			return client.request('POST', ENDPOINTS.COLD_STORAGE.MOVE_OUT, {
				coldVaultId,
				destinationVaultId,
				asset,
				amount,
				...approvalOptions,
			});
		}

		case 'scheduleTransfer': {
			const coldVaultId = this.getNodeParameter('coldVaultId', i) as string;
			const asset = this.getNodeParameter('asset', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const scheduledDate = this.getNodeParameter('scheduledDate', i) as string;
			const transferDirection = this.getNodeParameter('transferDirection', i) as string;

			return client.request('POST', ENDPOINTS.COLD_STORAGE.SCHEDULE, {
				coldVaultId,
				asset,
				amount,
				scheduledDate,
				direction: transferDirection,
			});
		}

		case 'getScheduled': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.COLD_STORAGE.SCHEDULED);
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.COLD_STORAGE.SCHEDULED, {}, { limit });
		}

		case 'initiateOso': {
			const coldVaultId = this.getNodeParameter('coldVaultId', i) as string;
			const transactionData = JSON.parse(this.getNodeParameter('transactionData', i) as string);

			return client.request('POST', ENDPOINTS.COLD_STORAGE.OSO_INITIATE, { coldVaultId, ...transactionData });
		}

		case 'completeOso': {
			const osoSessionId = this.getNodeParameter('osoSessionId', i) as string;
			const signedPayload = this.getNodeParameter('signedPayload', i) as string;

			return client.request('POST', ENDPOINTS.COLD_STORAGE.OSO_COMPLETE, { osoSessionId, signedPayload });
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
