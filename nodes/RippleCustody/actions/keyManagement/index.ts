/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../../transport';
import { ENDPOINTS } from '../../constants';

export const keyManagementOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['keyManagement'] } },
		options: [
			{ name: 'Archive Key', value: 'archiveKey', description: 'Archive a key', action: 'Archive key' },
			{ name: 'Create Key', value: 'createKey', description: 'Create a new key', action: 'Create key' },
			{ name: 'Delete Key', value: 'deleteKey', description: 'Delete a key', action: 'Delete key' },
			{ name: 'Export Public Key', value: 'exportPublicKey', description: 'Export public key', action: 'Export public key' },
			{ name: 'Generate Key', value: 'generateKey', description: 'Generate key via HSM/MPC', action: 'Generate key' },
			{ name: 'Get HSM Status', value: 'getHsmStatus', description: 'Get HSM status', action: 'Get HSM status' },
			{ name: 'Get Key', value: 'getKey', description: 'Get key details', action: 'Get key details' },
			{ name: 'Get Key Shares', value: 'getKeyShares', description: 'Get MPC key shares info', action: 'Get key shares' },
			{ name: 'Get Key Usage', value: 'getKeyUsage', description: 'Get key usage statistics', action: 'Get key usage' },
			{ name: 'Get Many', value: 'getMany', description: 'Get many keys', action: 'Get many keys' },
			{ name: 'Import Key', value: 'importKey', description: 'Import an existing key', action: 'Import key' },
			{ name: 'Initiate Ceremony', value: 'initiateCeremony', description: 'Initiate key ceremony', action: 'Initiate ceremony' },
			{ name: 'Reconstruct Key', value: 'reconstructKey', description: 'Reconstruct key from shares', action: 'Reconstruct key' },
			{ name: 'Rotate Key', value: 'rotateKey', description: 'Rotate a key', action: 'Rotate key' },
		],
		default: 'getMany',
	},
];

export const keyManagementFields: INodeProperties[] = [
	{
		displayName: 'Key ID',
		name: 'keyId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['keyManagement'], operation: ['getKey', 'deleteKey', 'rotateKey', 'archiveKey', 'exportPublicKey', 'getKeyShares', 'getKeyUsage'] } },
		default: '',
		description: 'Key identifier',
	},
	{
		displayName: 'Key Name',
		name: 'keyName',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['keyManagement'], operation: ['createKey', 'generateKey'] } },
		default: '',
		description: 'Name for the key',
	},
	{
		displayName: 'Key Type',
		name: 'keyType',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['keyManagement'], operation: ['createKey', 'generateKey'] } },
		options: [
			{ name: 'ECDSA secp256k1', value: 'secp256k1' },
			{ name: 'ECDSA secp256r1', value: 'secp256r1' },
			{ name: 'EdDSA Ed25519', value: 'ed25519' },
			{ name: 'RSA 2048', value: 'rsa2048' },
			{ name: 'RSA 4096', value: 'rsa4096' },
		],
		default: 'secp256k1',
		description: 'Cryptographic key type',
	},
	{
		displayName: 'Generation Method',
		name: 'generationMethod',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['keyManagement'], operation: ['generateKey'] } },
		options: [
			{ name: 'HSM', value: 'hsm' },
			{ name: 'MPC', value: 'mpc' },
			{ name: 'Software', value: 'software' },
		],
		default: 'hsm',
		description: 'Key generation method',
	},
	{
		displayName: 'HSM Pool ID',
		name: 'hsmPoolId',
		type: 'string',
		displayOptions: { show: { resource: ['keyManagement'], operation: ['generateKey'], generationMethod: ['hsm'] } },
		default: '',
		description: 'HSM pool for key generation',
	},
	{
		displayName: 'MPC Group ID',
		name: 'mpcGroupId',
		type: 'string',
		displayOptions: { show: { resource: ['keyManagement'], operation: ['generateKey'], generationMethod: ['mpc'] } },
		default: '',
		description: 'MPC group for distributed key generation',
	},
	{
		displayName: 'Threshold',
		name: 'threshold',
		type: 'number',
		displayOptions: { show: { resource: ['keyManagement'], operation: ['generateKey'], generationMethod: ['mpc'] } },
		typeOptions: { minValue: 2, maxValue: 10 },
		default: 2,
		description: 'Threshold for MPC signing (t-of-n)',
	},
	{
		displayName: 'Total Shares',
		name: 'totalShares',
		type: 'number',
		displayOptions: { show: { resource: ['keyManagement'], operation: ['generateKey'], generationMethod: ['mpc'] } },
		typeOptions: { minValue: 2, maxValue: 10 },
		default: 3,
		description: 'Total number of key shares',
	},
	{
		displayName: 'Key Material',
		name: 'keyMaterial',
		type: 'string',
		typeOptions: { password: true },
		required: true,
		displayOptions: { show: { resource: ['keyManagement'], operation: ['importKey'] } },
		default: '',
		description: 'Encrypted key material to import',
	},
	{
		displayName: 'Wrapping Key ID',
		name: 'wrappingKeyId',
		type: 'string',
		displayOptions: { show: { resource: ['keyManagement'], operation: ['importKey', 'exportPublicKey'] } },
		default: '',
		description: 'Key used for wrapping/unwrapping',
	},
	{
		displayName: 'Key Shares',
		name: 'keyShares',
		type: 'json',
		required: true,
		displayOptions: { show: { resource: ['keyManagement'], operation: ['reconstructKey'] } },
		default: '[]',
		description: 'Key shares for reconstruction (JSON array)',
	},
	{
		displayName: 'Ceremony Type',
		name: 'ceremonyType',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['keyManagement'], operation: ['initiateCeremony'] } },
		options: [
			{ name: 'Key Generation', value: 'keygen' },
			{ name: 'Key Refresh', value: 'refresh' },
			{ name: 'Key Recovery', value: 'recovery' },
		],
		default: 'keygen',
		description: 'Type of ceremony',
	},
	{
		displayName: 'Participants',
		name: 'participants',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['keyManagement'], operation: ['initiateCeremony'] } },
		default: '',
		placeholder: 'user1,user2,user3',
		description: 'Comma-separated list of participant IDs',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['keyManagement'], operation: ['createKey', 'generateKey'] } },
		options: [
			{ displayName: 'Description', name: 'description', type: 'string', default: '' },
			{ displayName: 'Tags', name: 'tags', type: 'string', default: '' },
			{ displayName: 'Vault ID', name: 'vaultId', type: 'string', default: '' },
			{ displayName: 'Exportable', name: 'exportable', type: 'boolean', default: false },
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['keyManagement'], operation: ['getMany'] } },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['keyManagement'], operation: ['getMany'], returnAll: [false] } },
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
		displayOptions: { show: { resource: ['keyManagement'], operation: ['getMany'] } },
		options: [
			{ displayName: 'Type', name: 'type', type: 'string', default: '' },
			{ displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'Active', value: 'active' }, { name: 'Archived', value: 'archived' }, { name: 'Pending', value: 'pending' }], default: 'active' },
			{ displayName: 'Vault ID', name: 'vaultId', type: 'string', default: '' },
		],
	},
];

export async function executeKeyManagement(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);

	switch (operation) {
		case 'createKey': {
			const keyName = this.getNodeParameter('keyName', i) as string;
			const keyType = this.getNodeParameter('keyType', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

			const body: IDataObject = { name: keyName, type: keyType, ...additionalFields };
			if (additionalFields.tags) {
				body.tags = (additionalFields.tags as string).split(',').map(t => t.trim());
			}

			return client.request('POST', ENDPOINTS.KEYS.BASE, body);
		}

		case 'generateKey': {
			const keyName = this.getNodeParameter('keyName', i) as string;
			const keyType = this.getNodeParameter('keyType', i) as string;
			const generationMethod = this.getNodeParameter('generationMethod', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;

			const body: IDataObject = { name: keyName, type: keyType, method: generationMethod, ...additionalFields };

			if (generationMethod === 'hsm') {
				body.hsmPoolId = this.getNodeParameter('hsmPoolId', i, '') as string;
			} else if (generationMethod === 'mpc') {
				body.mpcGroupId = this.getNodeParameter('mpcGroupId', i, '') as string;
				body.threshold = this.getNodeParameter('threshold', i) as number;
				body.totalShares = this.getNodeParameter('totalShares', i) as number;
			}

			if (additionalFields.tags) {
				body.tags = (additionalFields.tags as string).split(',').map(t => t.trim());
			}

			return client.request('POST', ENDPOINTS.KEYS.GENERATE, body);
		}

		case 'getKey': {
			const keyId = this.getNodeParameter('keyId', i) as string;
			return client.request('GET', ENDPOINTS.KEYS.BY_ID(keyId));
		}

		case 'getMany': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const filters = this.getNodeParameter('filters', i) as IDataObject;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.KEYS.BASE, {}, filters);
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.KEYS.BASE, {}, { ...filters, limit });
		}

		case 'deleteKey': {
			const keyId = this.getNodeParameter('keyId', i) as string;
			await client.request('DELETE', ENDPOINTS.KEYS.BY_ID(keyId));
			return { success: true, keyId };
		}

		case 'rotateKey': {
			const keyId = this.getNodeParameter('keyId', i) as string;
			return client.request('POST', ENDPOINTS.KEYS.ROTATE(keyId));
		}

		case 'archiveKey': {
			const keyId = this.getNodeParameter('keyId', i) as string;
			return client.request('POST', ENDPOINTS.KEYS.ARCHIVE(keyId));
		}

		case 'exportPublicKey': {
			const keyId = this.getNodeParameter('keyId', i) as string;
			const wrappingKeyId = this.getNodeParameter('wrappingKeyId', i, '') as string;
			return client.request('GET', ENDPOINTS.KEYS.EXPORT(keyId), {}, { wrappingKeyId: wrappingKeyId || undefined });
		}

		case 'importKey': {
			const keyMaterial = this.getNodeParameter('keyMaterial', i) as string;
			const wrappingKeyId = this.getNodeParameter('wrappingKeyId', i, '') as string;

			return client.request('POST', ENDPOINTS.KEYS.IMPORT, {
				keyMaterial,
				wrappingKeyId: wrappingKeyId || undefined,
			});
		}

		case 'getKeyShares': {
			const keyId = this.getNodeParameter('keyId', i) as string;
			return client.request('GET', ENDPOINTS.KEYS.SHARES(keyId));
		}

		case 'reconstructKey': {
			const keyId = this.getNodeParameter('keyId', i) as string;
			const keyShares = JSON.parse(this.getNodeParameter('keyShares', i) as string);
			return client.request('POST', ENDPOINTS.KEYS.RECONSTRUCT(keyId), { shares: keyShares });
		}

		case 'initiateCeremony': {
			const ceremonyType = this.getNodeParameter('ceremonyType', i) as string;
			const participants = (this.getNodeParameter('participants', i) as string).split(',').map(p => p.trim());

			return client.request('POST', ENDPOINTS.KEYS.CEREMONY, { type: ceremonyType, participants });
		}

		case 'getHsmStatus': {
			return client.request('GET', ENDPOINTS.KEYS.HSM_STATUS);
		}

		case 'getKeyUsage': {
			const keyId = this.getNodeParameter('keyId', i) as string;
			return client.request('GET', ENDPOINTS.KEYS.USAGE(keyId));
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
