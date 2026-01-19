/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../../transport';
import { ENDPOINTS } from '../../constants';

export const signingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['signing'] } },
		options: [
			{ name: 'Approve Request', value: 'approveRequest', description: 'Approve a signing request', action: 'Approve signing request' },
			{ name: 'Get Pending Signatures', value: 'getPendingSignatures', description: 'Get pending signatures', action: 'Get pending signatures' },
			{ name: 'Get Quorum', value: 'getQuorum', description: 'Get signing quorum status', action: 'Get signing quorum' },
			{ name: 'Get Request', value: 'getRequest', description: 'Get a signing request', action: 'Get signing request' },
			{ name: 'Get Requests', value: 'getRequests', description: 'Get signing requests', action: 'Get signing requests' },
			{ name: 'Get Signature', value: 'getSignature', description: 'Get a signature', action: 'Get signature' },
			{ name: 'Get Status', value: 'getStatus', description: 'Get signing status', action: 'Get signing status' },
			{ name: 'Multi-Sign', value: 'multiSign', description: 'Multi-party sign transaction', action: 'Multi sign transaction' },
			{ name: 'Reject Request', value: 'rejectRequest', description: 'Reject a signing request', action: 'Reject signing request' },
			{ name: 'Sign Message', value: 'signMessage', description: 'Sign a message', action: 'Sign a message' },
			{ name: 'Sign Transaction', value: 'signTransaction', description: 'Sign a transaction', action: 'Sign a transaction' },
		],
		default: 'getRequests',
	},
];

export const signingFields: INodeProperties[] = [
	{
		displayName: 'Request ID',
		name: 'requestId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['signing'], operation: ['getRequest', 'approveRequest', 'rejectRequest', 'getStatus', 'getQuorum'] } },
		default: '',
	},
	{
		displayName: 'Signature ID',
		name: 'signatureId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['signing'], operation: ['getSignature'] } },
		default: '',
	},
	{
		displayName: 'Transaction ID',
		name: 'transactionId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['signing'], operation: ['signTransaction', 'multiSign'] } },
		default: '',
	},
	{
		displayName: 'Key ID',
		name: 'keyId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['signing'], operation: ['signTransaction', 'signMessage', 'multiSign'] } },
		default: '',
		description: 'The key to use for signing',
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['signing'], operation: ['signMessage'] } },
		default: '',
		description: 'Message to sign (hex encoded)',
	},
	{
		displayName: 'Message Type',
		name: 'messageType',
		type: 'options',
		displayOptions: { show: { resource: ['signing'], operation: ['signMessage'] } },
		options: [
			{ name: 'Raw', value: 'raw' },
			{ name: 'EIP-191 Personal Sign', value: 'personal_sign' },
			{ name: 'EIP-712 Typed Data', value: 'typed_data' },
		],
		default: 'raw',
	},
	{
		displayName: 'Signers',
		name: 'signers',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['signing'], operation: ['multiSign'] } },
		default: '',
		description: 'Comma-separated list of signer key IDs',
	},
	{
		displayName: 'Rejection Reason',
		name: 'rejectionReason',
		type: 'string',
		displayOptions: { show: { resource: ['signing'], operation: ['rejectRequest'] } },
		default: '',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['signing'], operation: ['signTransaction', 'signMessage'] } },
		options: [
			{ displayName: 'HSM Session ID', name: 'hsmSessionId', type: 'string', default: '' },
			{ displayName: 'MPC Session ID', name: 'mpcSessionId', type: 'string', default: '' },
			{ displayName: 'Derivation Path', name: 'derivationPath', type: 'string', default: '', placeholder: "m/44'/60'/0'/0/0" },
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['signing'], operation: ['getRequests', 'getPendingSignatures'] } },
		default: false,
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['signing'], operation: ['getRequests', 'getPendingSignatures'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['signing'], operation: ['getRequests'] } },
		options: [
			{ displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'Pending', value: 'pending' }, { name: 'Approved', value: 'approved' }, { name: 'Rejected', value: 'rejected' }, { name: 'Completed', value: 'completed' }], default: '' },
			{ displayName: 'Type', name: 'type', type: 'options', options: [{ name: 'Transaction', value: 'transaction' }, { name: 'Message', value: 'message' }], default: '' },
		],
	},
];

export async function executeSigning(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);

	switch (operation) {
		case 'signTransaction': {
			const transactionId = this.getNodeParameter('transactionId', i) as string;
			const keyId = this.getNodeParameter('keyId', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
			return client.request('POST', ENDPOINTS.SIGNING.BASE, { transaction_id: transactionId, key_id: keyId, ...additionalFields });
		}

		case 'signMessage': {
			const keyId = this.getNodeParameter('keyId', i) as string;
			const message = this.getNodeParameter('message', i) as string;
			const messageType = this.getNodeParameter('messageType', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
			return client.request('POST', `${ENDPOINTS.SIGNING.BASE}/message`, { key_id: keyId, message, message_type: messageType, ...additionalFields });
		}

		case 'getRequest': {
			const requestId = this.getNodeParameter('requestId', i) as string;
			return client.request('GET', ENDPOINTS.SIGNING.BY_ID(requestId));
		}

		case 'getRequests': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const filters = this.getNodeParameter('filters', i) as IDataObject;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.SIGNING.BASE, {}, filters);
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.SIGNING.BASE, {}, { ...filters, limit });
		}

		case 'approveRequest': {
			const requestId = this.getNodeParameter('requestId', i) as string;
			return client.request('POST', ENDPOINTS.SIGNING.APPROVE(requestId));
		}

		case 'rejectRequest': {
			const requestId = this.getNodeParameter('requestId', i) as string;
			const reason = this.getNodeParameter('rejectionReason', i, '') as string;
			return client.request('POST', ENDPOINTS.SIGNING.REJECT(requestId), { reason });
		}

		case 'getStatus': {
			const requestId = this.getNodeParameter('requestId', i) as string;
			return client.request('GET', ENDPOINTS.SIGNING.STATUS(requestId));
		}

		case 'getSignature': {
			const signatureId = this.getNodeParameter('signatureId', i) as string;
			return client.request('GET', `${ENDPOINTS.SIGNING.BASE}/${signatureId}/signature`);
		}

		case 'multiSign': {
			const transactionId = this.getNodeParameter('transactionId', i) as string;
			const keyId = this.getNodeParameter('keyId', i) as string;
			const signers = (this.getNodeParameter('signers', i) as string).split(',').map(s => s.trim());
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
			return client.request('POST', ENDPOINTS.SIGNING.MULTI, { transaction_id: transactionId, key_id: keyId, signers, ...additionalFields });
		}

		case 'getQuorum': {
			const requestId = this.getNodeParameter('requestId', i) as string;
			return client.request('GET', ENDPOINTS.SIGNING.QUORUM, {}, { requestId });
		}

		case 'getPendingSignatures': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.SIGNING.BASE, {}, { status: 'pending' });
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.SIGNING.BASE, {}, { status: 'pending', limit });
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
