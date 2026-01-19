/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

/**
 * Ripple Custody MPC Credentials
 * 
 * For Multi-Party Computation (MPC) key management in Ripple Custody.
 * MPC enables distributed key generation and signing without
 * exposing full private keys to any single party.
 */
export class RippleCustodyMpc implements ICredentialType {
	name = 'rippleCustodyMpc';
	displayName = 'Ripple Custody MPC';
	documentationUrl = 'https://docs.ripple.com/custody/mpc';

	properties: INodeProperties[] = [
		{
			displayName: 'MPC Protocol',
			name: 'mpcProtocol',
			type: 'options',
			options: [
				{
					name: 'GG18 (Gennaro-Goldfeder)',
					value: 'gg18',
				},
				{
					name: 'GG20 (Gennaro-Goldfeder 2020)',
					value: 'gg20',
				},
				{
					name: 'CGGMP (Canetti-Gennaro-Goldfeder-Makriyannis-Peled)',
					value: 'cggmp',
				},
				{
					name: 'Lindell17',
					value: 'lindell17',
				},
				{
					name: 'Fireblocks MPC-CMP',
					value: 'mpcCmp',
				},
			],
			default: 'gg20',
			description: 'MPC protocol for threshold signing',
		},
		{
			displayName: 'Signing Threshold',
			name: 'signingThreshold',
			type: 'number',
			default: 2,
			required: true,
			description: 'Minimum number of parties required to sign (t in t-of-n)',
			hint: 'For 2-of-3 scheme, set threshold to 2',
		},
		{
			displayName: 'Total Parties',
			name: 'totalParties',
			type: 'number',
			default: 3,
			required: true,
			description: 'Total number of key share holders (n in t-of-n)',
		},
		{
			displayName: 'Party ID',
			name: 'partyId',
			type: 'string',
			default: '',
			required: true,
			description: 'This node\'s party identifier in the MPC network',
		},
		// MPC Node Configuration
		{
			displayName: 'MPC Coordinator URL',
			name: 'coordinatorUrl',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'https://mpc-coordinator.ripple-custody.com',
			description: 'URL of the MPC coordinator service',
		},
		{
			displayName: 'MPC Node Endpoints',
			name: 'nodeEndpoints',
			type: 'fixedCollection',
			typeOptions: {
				multipleValues: true,
			},
			default: {},
			description: 'MPC node endpoints for peer-to-peer communication',
			options: [
				{
					name: 'endpoints',
					displayName: 'Endpoints',
					values: [
						{
							displayName: 'Party ID',
							name: 'partyId',
							type: 'string',
							default: '',
							description: 'Party identifier',
						},
						{
							displayName: 'Endpoint URL',
							name: 'url',
							type: 'string',
							default: '',
							placeholder: 'https://mpc-node-1.example.com',
							description: 'MPC node endpoint URL',
						},
						{
							displayName: 'Public Key',
							name: 'publicKey',
							type: 'string',
							default: '',
							description: 'Party\'s communication public key (hex)',
						},
					],
				},
			],
		},
		// Key Share Configuration
		{
			displayName: 'Key Share',
			name: 'keyShare',
			type: 'string',
			typeOptions: {
				password: true,
				rows: 5,
			},
			default: '',
			required: true,
			description: 'This party\'s encrypted key share (base64)',
		},
		{
			displayName: 'Key Share Password',
			name: 'keySharePassword',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Password to decrypt the key share',
		},
		{
			displayName: 'Key ID',
			name: 'keyId',
			type: 'string',
			default: '',
			required: true,
			description: 'Unique identifier for the distributed key',
		},
		// Authentication
		{
			displayName: 'Communication Key',
			name: 'communicationKey',
			type: 'string',
			typeOptions: {
				password: true,
				rows: 3,
			},
			default: '',
			required: true,
			description: 'Private key for secure inter-party communication (PEM)',
		},
		{
			displayName: 'Authentication Token',
			name: 'authToken',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'Authentication token for MPC coordinator',
		},
		// Security Settings
		{
			displayName: 'Encryption Algorithm',
			name: 'encryptionAlgorithm',
			type: 'options',
			options: [
				{ name: 'AES-256-GCM', value: 'aes256gcm' },
				{ name: 'ChaCha20-Poly1305', value: 'chacha20poly1305' },
			],
			default: 'aes256gcm',
			description: 'Encryption for inter-party messages',
		},
		{
			displayName: 'Message Signing',
			name: 'messageSigning',
			type: 'options',
			options: [
				{ name: 'Ed25519', value: 'ed25519' },
				{ name: 'ECDSA P-256', value: 'ecdsaP256' },
			],
			default: 'ed25519',
			description: 'Signature scheme for message authentication',
		},
		// Session Configuration
		{
			displayName: 'Session Timeout',
			name: 'sessionTimeout',
			type: 'number',
			default: 300000,
			description: 'MPC session timeout in milliseconds (default: 5 minutes)',
		},
		{
			displayName: 'Max Retries',
			name: 'maxRetries',
			type: 'number',
			default: 3,
			description: 'Maximum retry attempts for failed rounds',
		},
		{
			displayName: 'Round Timeout',
			name: 'roundTimeout',
			type: 'number',
			default: 60000,
			description: 'Timeout per MPC round in milliseconds',
		},
		// Backup Configuration
		{
			displayName: 'Enable Key Share Backup',
			name: 'enableBackup',
			type: 'boolean',
			default: true,
			description: 'Whether to backup key shares to secure storage',
		},
		{
			displayName: 'Backup Encryption Key',
			name: 'backupEncryptionKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			displayOptions: {
				show: {
					enableBackup: [true],
				},
			},
			description: 'Key for encrypting key share backups',
		},
		// Audit Settings
		{
			displayName: 'Enable Audit Logging',
			name: 'enableAuditLogging',
			type: 'boolean',
			default: true,
			description: 'Whether to log MPC operations for audit',
		},
		{
			displayName: 'Audit Log Destination',
			name: 'auditLogDestination',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					enableAuditLogging: [true],
				},
			},
			description: 'URL or path for audit log destination',
		},
	];
}
