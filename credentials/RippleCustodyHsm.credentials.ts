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
 * Ripple Custody HSM Credentials
 * 
 * For Hardware Security Module (HSM) operations in Ripple Custody.
 * HSMs provide FIPS 140-2 Level 4 certified secure key storage
 * and cryptographic operations.
 */
export class RippleCustodyHsm implements ICredentialType {
	name = 'rippleCustodyHsm';
	displayName = 'Ripple Custody HSM';
	documentationUrl = 'https://docs.ripple.com/custody/hsm';

	properties: INodeProperties[] = [
		{
			displayName: 'HSM Provider',
			name: 'hsmProvider',
			type: 'options',
			options: [
				{
					name: 'Thales Luna',
					value: 'thales',
				},
				{
					name: 'AWS CloudHSM',
					value: 'awsCloudHsm',
				},
				{
					name: 'Azure Dedicated HSM',
					value: 'azureHsm',
				},
				{
					name: 'Google Cloud HSM',
					value: 'gcpHsm',
				},
				{
					name: 'Utimaco',
					value: 'utimaco',
				},
				{
					name: 'nCipher',
					value: 'ncipher',
				},
			],
			default: 'thales',
			description: 'The HSM provider type',
		},
		{
			displayName: 'HSM Endpoint',
			name: 'hsmEndpoint',
			type: 'string',
			default: '',
			required: true,
			placeholder: 'hsm.example.com:1792',
			description: 'HSM network endpoint (host:port)',
		},
		{
			displayName: 'HSM Slot ID',
			name: 'hsmSlotId',
			type: 'string',
			default: '',
			required: true,
			description: 'HSM slot identifier',
		},
		{
			displayName: 'Partition ID',
			name: 'partitionId',
			type: 'string',
			default: '',
			required: true,
			description: 'HSM partition identifier for isolation',
		},
		{
			displayName: 'HSM Username',
			name: 'hsmUsername',
			type: 'string',
			default: '',
			required: true,
			description: 'HSM authentication username',
		},
		{
			displayName: 'HSM Password',
			name: 'hsmPassword',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'HSM authentication password',
		},
		{
			displayName: 'HSM PIN',
			name: 'hsmPin',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			description: 'HSM PIN (if required)',
		},
		// AWS CloudHSM specific
		{
			displayName: 'AWS Region',
			name: 'awsRegion',
			type: 'string',
			default: 'us-east-1',
			displayOptions: {
				show: {
					hsmProvider: ['awsCloudHsm'],
				},
			},
			description: 'AWS region for CloudHSM',
		},
		{
			displayName: 'Cluster ID',
			name: 'clusterId',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					hsmProvider: ['awsCloudHsm'],
				},
			},
			description: 'AWS CloudHSM cluster ID',
		},
		// Azure HSM specific
		{
			displayName: 'Azure Vault URL',
			name: 'azureVaultUrl',
			type: 'string',
			default: '',
			placeholder: 'https://myvault.vault.azure.net',
			displayOptions: {
				show: {
					hsmProvider: ['azureHsm'],
				},
			},
			description: 'Azure Key Vault URL',
		},
		// GCP HSM specific
		{
			displayName: 'GCP Project ID',
			name: 'gcpProjectId',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					hsmProvider: ['gcpHsm'],
				},
			},
			description: 'GCP project ID',
		},
		{
			displayName: 'GCP Location',
			name: 'gcpLocation',
			type: 'string',
			default: 'global',
			displayOptions: {
				show: {
					hsmProvider: ['gcpHsm'],
				},
			},
			description: 'GCP Cloud HSM location',
		},
		{
			displayName: 'Key Ring',
			name: 'gcpKeyRing',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					hsmProvider: ['gcpHsm'],
				},
			},
			description: 'GCP Cloud KMS key ring name',
		},
		// Access Controls
		{
			displayName: 'Access Control List',
			name: 'accessControlList',
			type: 'string',
			default: '',
			description: 'Comma-separated list of allowed operations (sign,verify,encrypt,decrypt)',
		},
		{
			displayName: 'Key Label Prefix',
			name: 'keyLabelPrefix',
			type: 'string',
			default: '',
			description: 'Prefix for HSM key labels',
		},
		// TLS Configuration
		{
			displayName: 'Use TLS',
			name: 'useTls',
			type: 'boolean',
			default: true,
			description: 'Whether to use TLS for HSM connection',
		},
		{
			displayName: 'TLS Certificate',
			name: 'tlsCertificate',
			type: 'string',
			typeOptions: {
				password: true,
				rows: 5,
			},
			default: '',
			displayOptions: {
				show: {
					useTls: [true],
				},
			},
			description: 'PEM-encoded TLS certificate for HSM connection',
		},
		{
			displayName: 'TLS Private Key',
			name: 'tlsPrivateKey',
			type: 'string',
			typeOptions: {
				password: true,
				rows: 5,
			},
			default: '',
			displayOptions: {
				show: {
					useTls: [true],
				},
			},
			description: 'PEM-encoded TLS private key',
		},
		{
			displayName: 'CA Certificate',
			name: 'caCertificate',
			type: 'string',
			typeOptions: {
				password: true,
				rows: 5,
			},
			default: '',
			displayOptions: {
				show: {
					useTls: [true],
				},
			},
			description: 'PEM-encoded CA certificate',
		},
		// Connection Settings
		{
			displayName: 'Connection Timeout',
			name: 'connectionTimeout',
			type: 'number',
			default: 10000,
			description: 'Connection timeout in milliseconds',
		},
		{
			displayName: 'Operation Timeout',
			name: 'operationTimeout',
			type: 'number',
			default: 30000,
			description: 'Operation timeout in milliseconds',
		},
		{
			displayName: 'Enable High Availability',
			name: 'enableHA',
			type: 'boolean',
			default: true,
			description: 'Whether to enable high availability mode',
		},
		{
			displayName: 'Failover Endpoints',
			name: 'failoverEndpoints',
			type: 'string',
			default: '',
			displayOptions: {
				show: {
					enableHA: [true],
				},
			},
			description: 'Comma-separated list of failover HSM endpoints',
		},
	];
}
