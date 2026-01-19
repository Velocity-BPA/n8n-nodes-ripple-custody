/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../../transport';
import { ENDPOINTS } from '../../constants';

export const vaultOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['vault'] } },
		options: [
			{ name: 'Create', value: 'create', description: 'Create a new vault', action: 'Create a vault' },
			{ name: 'Delete', value: 'delete', description: 'Delete a vault', action: 'Delete a vault' },
			{ name: 'Get', value: 'get', description: 'Get a vault by ID', action: 'Get a vault' },
			{ name: 'Get Addresses', value: 'getAddresses', description: 'Get vault addresses', action: 'Get vault addresses' },
			{ name: 'Get Audit Trail', value: 'getAuditTrail', description: 'Get vault audit trail', action: 'Get vault audit trail' },
			{ name: 'Get Balance', value: 'getBalance', description: 'Get vault balance', action: 'Get vault balance' },
			{ name: 'Get Many', value: 'getMany', description: 'Get many vaults', action: 'Get many vaults' },
			{ name: 'Get Policies', value: 'getPolicies', description: 'Get vault policies', action: 'Get vault policies' },
			{ name: 'Get Transactions', value: 'getTransactions', description: 'Get vault transactions', action: 'Get vault transactions' },
			{ name: 'Get Type', value: 'getType', description: 'Get vault type (Hot/Warm/Cold)', action: 'Get vault type' },
			{ name: 'Lock', value: 'lock', description: 'Lock a vault', action: 'Lock a vault' },
			{ name: 'Set Temperature', value: 'setTemperature', description: 'Set vault temperature', action: 'Set vault temperature' },
			{ name: 'Unlock', value: 'unlock', description: 'Unlock a vault', action: 'Unlock a vault' },
			{ name: 'Update', value: 'update', description: 'Update a vault', action: 'Update a vault' },
		],
		default: 'getMany',
	},
];

export const vaultFields: INodeProperties[] = [
	// Vault ID field (used by multiple operations)
	{
		displayName: 'Vault ID',
		name: 'vaultId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['vault'],
				operation: ['get', 'update', 'delete', 'getBalance', 'getAddresses', 'getTransactions', 'getPolicies', 'getAuditTrail', 'getType', 'setTemperature', 'lock', 'unlock'],
			},
		},
		default: '',
		description: 'The unique identifier of the vault',
	},

	// Create operation fields
	{
		displayName: 'Vault Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['vault'], operation: ['create'] } },
		default: '',
		description: 'Name of the vault',
	},
	{
		displayName: 'Vault Type',
		name: 'vaultType',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['vault'], operation: ['create'] } },
		options: [
			{ name: 'Hot', value: 'hot', description: 'Online vault for frequent transactions' },
			{ name: 'Warm', value: 'warm', description: 'Semi-online vault for moderate frequency' },
			{ name: 'Cold', value: 'cold', description: 'Offline vault for long-term storage' },
		],
		default: 'hot',
		description: 'Type of vault based on accessibility',
	},
	{
		displayName: 'Blockchain',
		name: 'blockchain',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['vault'], operation: ['create'] } },
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
		],
		default: 'ethereum',
		description: 'Blockchain network for the vault',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['vault'], operation: ['create'] } },
		options: [
			{ displayName: 'Description', name: 'description', type: 'string', default: '', description: 'Description of the vault' },
			{ displayName: 'Policy ID', name: 'policyId', type: 'string', default: '', description: 'ID of the policy to apply to this vault' },
			{ displayName: 'HSM Pool ID', name: 'hsmPoolId', type: 'string', default: '', description: 'HSM pool for key management' },
			{ displayName: 'MPC Group ID', name: 'mpcGroupId', type: 'string', default: '', description: 'MPC group for distributed signing' },
			{ displayName: 'Tags', name: 'tags', type: 'string', default: '', description: 'Comma-separated tags' },
		],
	},

	// Update operation fields
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['vault'], operation: ['update'] } },
		options: [
			{ displayName: 'Name', name: 'name', type: 'string', default: '', description: 'New vault name' },
			{ displayName: 'Description', name: 'description', type: 'string', default: '', description: 'New description' },
			{ displayName: 'Policy ID', name: 'policyId', type: 'string', default: '', description: 'New policy ID' },
			{ displayName: 'Tags', name: 'tags', type: 'string', default: '', description: 'Comma-separated tags' },
		],
	},

	// Set Temperature field
	{
		displayName: 'Temperature',
		name: 'temperature',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['vault'], operation: ['setTemperature'] } },
		options: [
			{ name: 'Hot', value: 'hot' },
			{ name: 'Warm', value: 'warm' },
			{ name: 'Cold', value: 'cold' },
		],
		default: 'warm',
		description: 'New temperature level for the vault',
	},

	// Pagination fields for getMany
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['vault'], operation: ['getMany', 'getAddresses', 'getTransactions', 'getPolicies', 'getAuditTrail'] } },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['vault'], operation: ['getMany', 'getAddresses', 'getTransactions', 'getPolicies', 'getAuditTrail'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
		description: 'Max number of results to return',
	},

	// Filters for getMany
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['vault'], operation: ['getMany'] } },
		options: [
			{ displayName: 'Blockchain', name: 'blockchain', type: 'string', default: '', description: 'Filter by blockchain' },
			{ displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'Active', value: 'active' }, { name: 'Locked', value: 'locked' }, { name: 'Archived', value: 'archived' }], default: 'active' },
			{ displayName: 'Type', name: 'type', type: 'options', options: [{ name: 'Hot', value: 'hot' }, { name: 'Warm', value: 'warm' }, { name: 'Cold', value: 'cold' }], default: '' },
		],
	},

	// Lock/Unlock reason
	{
		displayName: 'Reason',
		name: 'reason',
		type: 'string',
		displayOptions: { show: { resource: ['vault'], operation: ['lock', 'unlock'] } },
		default: '',
		description: 'Reason for locking/unlocking the vault (for audit purposes)',
	},
];

export async function executeVault(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);

	switch (operation) {
		case 'create': {
			const name = this.getNodeParameter('name', i) as string;
			const vaultType = this.getNodeParameter('vaultType', i) as string;
			const blockchain = this.getNodeParameter('blockchain', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

			const body: IDataObject = {
				name,
				type: vaultType,
				blockchain,
				...additionalFields,
			};

			if (additionalFields.tags) {
				body.tags = (additionalFields.tags as string).split(',').map(t => t.trim());
			}

			return client.request('POST', ENDPOINTS.VAULTS.BASE, body);
		}

		case 'get': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			return client.request('GET', ENDPOINTS.VAULTS.BY_ID(vaultId));
		}

		case 'getMany': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const filters = this.getNodeParameter('filters', i) as IDataObject;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.VAULTS.BASE, {}, filters);
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.VAULTS.BASE, {}, { ...filters, limit });
		}

		case 'update': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const updateFields = this.getNodeParameter('updateFields', i) as IDataObject;

			if (updateFields.tags) {
				updateFields.tags = (updateFields.tags as string).split(',').map(t => t.trim());
			}

			return client.request('PATCH', ENDPOINTS.VAULTS.BY_ID(vaultId), updateFields);
		}

		case 'delete': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			await client.request('DELETE', ENDPOINTS.VAULTS.BY_ID(vaultId));
			return { success: true, vaultId };
		}

		case 'getBalance': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			return client.request('GET', ENDPOINTS.VAULTS.BALANCE(vaultId));
		}

		case 'getAddresses': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.VAULTS.ADDRESSES(vaultId));
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.VAULTS.ADDRESSES(vaultId), {}, { limit });
		}

		case 'getTransactions': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.VAULTS.TRANSACTIONS(vaultId));
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.VAULTS.TRANSACTIONS(vaultId), {}, { limit });
		}

		case 'getPolicies': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.VAULTS.POLICIES(vaultId));
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.VAULTS.POLICIES(vaultId), {}, { limit });
		}

		case 'getAuditTrail': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.VAULTS.AUDIT(vaultId));
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.VAULTS.AUDIT(vaultId), {}, { limit });
		}

		case 'getType': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const vault = await client.request('GET', ENDPOINTS.VAULTS.BY_ID(vaultId)) as IDataObject;
			return { vaultId, type: vault.type, temperature: vault.temperature };
		}

		case 'setTemperature': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const temperature = this.getNodeParameter('temperature', i) as string;
			return client.request('POST', `${ENDPOINTS.VAULTS.BY_ID(vaultId)}/temperature`, { temperature });
		}

		case 'lock': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const reason = this.getNodeParameter('reason', i, '') as string;
			return client.request('POST', `${ENDPOINTS.VAULTS.BY_ID(vaultId)}/lock`, { reason });
		}

		case 'unlock': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const reason = this.getNodeParameter('reason', i, '') as string;
			return client.request('POST', `${ENDPOINTS.VAULTS.BY_ID(vaultId)}/unlock`, { reason });
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
