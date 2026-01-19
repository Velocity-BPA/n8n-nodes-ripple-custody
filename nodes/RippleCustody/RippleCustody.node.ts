/**
 * Ripple Custody (Metaco Harmonize) n8n Node
 * Enterprise-grade digital asset custody integration
 *
 * SPDX-License-Identifier: BSL-1.1
 * Copyright (c) 2025 Velocity BPA
 *
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://mariadb.com/bsl11/
 *
 * Change Date: 2029-12-30
 * Change License: Apache License, Version 2.0
 *
 * For commercial licensing inquiries, contact: commercial@velocitybpa.com
 */

import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	IDataObject,
} from 'n8n-workflow';

// Import all resource modules
import {
	vaultOperations,
	vaultFields,
	executeVault,
} from './actions/vault';

import {
	walletOperations,
	walletFields,
	executeWallet,
} from './actions/wallet';

import {
	addressOperations,
	addressFields,
	executeAddress,
} from './actions/address';

import {
	transactionOperations,
	transactionFields,
	executeTransaction,
} from './actions/transaction';

import {
	transferOperations,
	transferFields,
	executeTransfer,
} from './actions/transfer';

import {
	signingOperations,
	signingFields,
	executeSigning,
} from './actions/signing';

import {
	policyOperations,
	policyFields,
	executePolicy,
} from './actions/policy';

import {
	tokenizationOperations,
	tokenizationFields,
	executeTokenization,
} from './actions/tokenization';

import {
	smartContractOperations,
	smartContractFields,
	executeSmartContract,
} from './actions/smartContract';

import {
	stakingOperations,
	stakingFields,
	executeStaking,
} from './actions/staking';

import {
	defiOperations,
	defiFields,
	executeDefi,
} from './actions/defi';

import {
	tradingOperations,
	tradingFields,
	executeTrading,
} from './actions/trading';

import {
	settlementOperations,
	settlementFields,
	executeSettlement,
} from './actions/settlement';

import {
	custodyOperations,
	custodyFields,
	executeCustody,
} from './actions/custody';

import {
	keyManagementOperations,
	keyManagementFields,
	executeKeyManagement,
} from './actions/keyManagement';

import {
	coldStorageOperations,
	coldStorageFields,
	executeColdStorage,
} from './actions/coldStorage';

import {
	assetOperations,
	assetFields,
	executeAsset,
} from './actions/asset';

import {
	blockchainOperations,
	blockchainFields,
	executeBlockchain,
} from './actions/blockchain';

import {
	complianceOperations,
	complianceFields,
	executeCompliance,
} from './actions/compliance';

import {
	operations as reportingOperations,
	fields as reportingFields,
	execute as executeReporting,
} from './actions/reporting';

import {
	operations as webhookOperations,
	fields as webhookFields,
	execute as executeWebhook,
} from './actions/webhook';

import {
	operations as userAdminOperations,
	fields as userAdminFields,
	execute as executeUserAdmin,
} from './actions/userAdmin';

import {
	operations as utilityOperations,
	fields as utilityFields,
	execute as executeUtility,
} from './actions/utility';

export class RippleCustody implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Ripple Custody',
		name: 'rippleCustody',
		icon: 'file:ripple-custody.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Enterprise-grade digital asset custody platform (Metaco Harmonize)',
		defaults: {
			name: 'Ripple Custody',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'rippleCustodyApi',
				required: true,
			},
			{
				name: 'rippleCustodyHsm',
				required: false,
				displayOptions: {
					show: {
						resource: ['signing', 'keyManagement', 'coldStorage'],
					},
				},
			},
			{
				name: 'rippleCustodyMpc',
				required: false,
				displayOptions: {
					show: {
						resource: ['signing', 'keyManagement'],
					},
				},
			},
		],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Address', value: 'address', description: 'Manage blockchain addresses' },
					{ name: 'Asset', value: 'asset', description: 'Asset management and pricing' },
					{ name: 'Blockchain', value: 'blockchain', description: 'Blockchain network operations' },
					{ name: 'Cold Storage', value: 'coldStorage', description: 'Cold storage vault operations' },
					{ name: 'Compliance', value: 'compliance', description: 'AML/KYT compliance screening' },
					{ name: 'Custody', value: 'custody', description: 'Custody account management' },
					{ name: 'DeFi', value: 'defi', description: 'DeFi protocol interactions' },
					{ name: 'Key Management', value: 'keyManagement', description: 'Cryptographic key operations' },
					{ name: 'Policy', value: 'policy', description: 'Governance and approval policies' },
					{ name: 'Reporting', value: 'reporting', description: 'Reports and analytics' },
					{ name: 'Settlement', value: 'settlement', description: 'Settlement and DVP operations' },
					{ name: 'Signing', value: 'signing', description: 'Transaction signing operations' },
					{ name: 'Smart Contract', value: 'smartContract', description: 'Smart contract deployment and interaction' },
					{ name: 'Staking', value: 'staking', description: 'Staking and delegation operations' },
					{ name: 'Tokenization', value: 'tokenization', description: 'Token minting and management' },
					{ name: 'Trading', value: 'trading', description: 'Exchange trading operations' },
					{ name: 'Transaction', value: 'transaction', description: 'Transaction management' },
					{ name: 'Transfer', value: 'transfer', description: 'Asset transfers' },
					{ name: 'User Admin', value: 'userAdmin', description: 'User and role management' },
					{ name: 'Utility', value: 'utility', description: 'System utilities and health checks' },
					{ name: 'Vault', value: 'vault', description: 'Vault management' },
					{ name: 'Wallet', value: 'wallet', description: 'Wallet management' },
					{ name: 'Webhook', value: 'webhook', description: 'Webhook management' },
				],
				default: 'vault',
			},

			// All operations and fields
			...vaultOperations,
			...vaultFields,
			...walletOperations,
			...walletFields,
			...addressOperations,
			...addressFields,
			...transactionOperations,
			...transactionFields,
			...transferOperations,
			...transferFields,
			...signingOperations,
			...signingFields,
			...policyOperations,
			...policyFields,
			...tokenizationOperations,
			...tokenizationFields,
			...smartContractOperations,
			...smartContractFields,
			...stakingOperations,
			...stakingFields,
			...defiOperations,
			...defiFields,
			...tradingOperations,
			...tradingFields,
			...settlementOperations,
			...settlementFields,
			...custodyOperations,
			...custodyFields,
			...keyManagementOperations,
			...keyManagementFields,
			...coldStorageOperations,
			...coldStorageFields,
			...assetOperations,
			...assetFields,
			...blockchainOperations,
			...blockchainFields,
			...complianceOperations,
			...complianceFields,
			...reportingOperations,
			...reportingFields,
			...webhookOperations,
			...webhookFields,
			...userAdminOperations,
			...userAdminFields,
			...utilityOperations,
			...utilityFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];
		const resource = this.getNodeParameter('resource', 0) as string;

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;
				let result: IDataObject | IDataObject[];

				// Route to appropriate resource handler
				switch (resource) {
					case 'vault':
						result = await executeVault.call(this, operation, i);
						break;
					case 'wallet':
						result = await executeWallet.call(this, operation, i);
						break;
					case 'address':
						result = await executeAddress.call(this, operation, i);
						break;
					case 'transaction':
						result = await executeTransaction.call(this, operation, i);
						break;
					case 'transfer':
						result = await executeTransfer.call(this, operation, i);
						break;
					case 'signing':
						result = await executeSigning.call(this, operation, i);
						break;
					case 'policy':
						result = await executePolicy.call(this, operation, i);
						break;
					case 'tokenization':
						result = await executeTokenization.call(this, operation, i);
						break;
					case 'smartContract':
						result = await executeSmartContract.call(this, operation, i);
						break;
					case 'staking':
						result = await executeStaking.call(this, operation, i);
						break;
					case 'defi':
						result = await executeDefi.call(this, operation, i);
						break;
					case 'trading':
						result = await executeTrading.call(this, operation, i);
						break;
					case 'settlement':
						result = await executeSettlement.call(this, operation, i);
						break;
					case 'custody':
						result = await executeCustody.call(this, operation, i);
						break;
					case 'keyManagement':
						result = await executeKeyManagement.call(this, operation, i);
						break;
					case 'coldStorage':
						result = await executeColdStorage.call(this, operation, i);
						break;
					case 'asset':
						result = await executeAsset.call(this, operation, i);
						break;
					case 'blockchain':
						result = await executeBlockchain.call(this, operation, i);
						break;
					case 'compliance':
						result = await executeCompliance.call(this, operation, i);
						break;
					case 'reporting':
						result = await executeReporting.call(this, operation, i);
						break;
					case 'webhook':
						result = await executeWebhook.call(this, operation, i);
						break;
					case 'userAdmin':
						result = await executeUserAdmin.call(this, operation, i);
						break;
					case 'utility':
						result = await executeUtility.call(this, operation, i);
						break;
					default:
						throw new Error(`Resource '${resource}' is not supported`);
				}

				// Handle array results (returnAll scenarios)
				if (Array.isArray(result)) {
					for (const item of result) {
						returnData.push({
							json: item,
							pairedItem: { item: i },
						});
					}
				} else {
					returnData.push({
						json: result,
						pairedItem: { item: i },
					});
				}
			} catch (error) {
				if (this.continueOnFail()) {
					const operation = this.getNodeParameter('operation', i) as string;
					returnData.push({
						json: {
							error: (error as Error).message,
							resource,
							operation,
						},
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
