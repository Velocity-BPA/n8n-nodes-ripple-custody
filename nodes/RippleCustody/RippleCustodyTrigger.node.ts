/**
 * Ripple Custody (Metaco Harmonize) Trigger Node
 * Real-time event notifications for digital asset custody
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
	IHookFunctions,
	IWebhookFunctions,
	IDataObject,
	INodeType,
	INodeTypeDescription,
	IWebhookResponseData,
} from 'n8n-workflow';

import { createApiClient } from './transport/apiClient';
import { ENDPOINTS } from './constants/endpoints';

export class RippleCustodyTrigger implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Ripple Custody Trigger',
		name: 'rippleCustodyTrigger',
		icon: 'file:ripple-custody.svg',
		group: ['trigger'],
		version: 1,
		subtitle: '={{$parameter["event"]}}',
		description: 'Listen for Ripple Custody events in real-time',
		defaults: {
			name: 'Ripple Custody Trigger',
		},
		inputs: [],
		outputs: ['main'],
		credentials: [
			{
				name: 'rippleCustodyApi',
				required: true,
			},
		],
		webhooks: [
			{
				name: 'default',
				httpMethod: 'POST',
				responseMode: 'onReceived',
				path: 'webhook',
			},
		],
		properties: [
			{
				displayName: 'Event',
				name: 'event',
				type: 'options',
				required: true,
				default: 'transaction.created',
				options: [
					// Transaction Events
					{
						name: 'Transaction Created',
						value: 'transaction.created',
						description: 'A new transaction has been created',
					},
					{
						name: 'Transaction Pending',
						value: 'transaction.pending',
						description: 'Transaction is pending approval',
					},
					{
						name: 'Transaction Approved',
						value: 'transaction.approved',
						description: 'Transaction has been approved',
					},
					{
						name: 'Transaction Signed',
						value: 'transaction.signed',
						description: 'Transaction has been signed',
					},
					{
						name: 'Transaction Broadcast',
						value: 'transaction.broadcast',
						description: 'Transaction has been broadcast to network',
					},
					{
						name: 'Transaction Confirmed',
						value: 'transaction.confirmed',
						description: 'Transaction has been confirmed on-chain',
					},
					{
						name: 'Transaction Failed',
						value: 'transaction.failed',
						description: 'Transaction has failed',
					},
					{
						name: 'Transaction Rejected',
						value: 'transaction.rejected',
						description: 'Transaction was rejected',
					},

					// Deposit Events
					{
						name: 'Deposit Detected',
						value: 'deposit.detected',
						description: 'Incoming deposit detected',
					},
					{
						name: 'Deposit Confirmed',
						value: 'deposit.confirmed',
						description: 'Deposit has been confirmed',
					},
					{
						name: 'Deposit Credited',
						value: 'deposit.credited',
						description: 'Deposit has been credited to account',
					},

					// Withdrawal Events
					{
						name: 'Withdrawal Requested',
						value: 'withdrawal.requested',
						description: 'Withdrawal has been requested',
					},
					{
						name: 'Withdrawal Approved',
						value: 'withdrawal.approved',
						description: 'Withdrawal has been approved',
					},
					{
						name: 'Withdrawal Completed',
						value: 'withdrawal.completed',
						description: 'Withdrawal has been completed',
					},

					// Vault Events
					{
						name: 'Vault Created',
						value: 'vault.created',
						description: 'New vault has been created',
					},
					{
						name: 'Vault Updated',
						value: 'vault.updated',
						description: 'Vault settings have been updated',
					},
					{
						name: 'Vault Archived',
						value: 'vault.archived',
						description: 'Vault has been archived',
					},

					// Wallet Events
					{
						name: 'Wallet Created',
						value: 'wallet.created',
						description: 'New wallet has been created',
					},
					{
						name: 'Wallet Updated',
						value: 'wallet.updated',
						description: 'Wallet settings have been updated',
					},
					{
						name: 'Wallet Balance Changed',
						value: 'wallet.balance_changed',
						description: 'Wallet balance has changed',
					},

					// Address Events
					{
						name: 'Address Generated',
						value: 'address.generated',
						description: 'New address has been generated',
					},
					{
						name: 'Address Whitelisted',
						value: 'address.whitelisted',
						description: 'Address has been whitelisted',
					},
					{
						name: 'Address Blacklisted',
						value: 'address.blacklisted',
						description: 'Address has been blacklisted',
					},

					// Policy Events
					{
						name: 'Policy Created',
						value: 'policy.created',
						description: 'New policy has been created',
					},
					{
						name: 'Policy Updated',
						value: 'policy.updated',
						description: 'Policy has been updated',
					},
					{
						name: 'Policy Triggered',
						value: 'policy.triggered',
						description: 'Policy rule has been triggered',
					},
					{
						name: 'Approval Required',
						value: 'approval.required',
						description: 'Approval is required for an operation',
					},
					{
						name: 'Approval Granted',
						value: 'approval.granted',
						description: 'Approval has been granted',
					},
					{
						name: 'Approval Denied',
						value: 'approval.denied',
						description: 'Approval has been denied',
					},

					// Compliance Events
					{
						name: 'Compliance Alert',
						value: 'compliance.alert',
						description: 'Compliance alert has been triggered',
					},
					{
						name: 'Sanctions Match',
						value: 'compliance.sanctions_match',
						description: 'Sanctions list match detected',
					},
					{
						name: 'High Risk Detected',
						value: 'compliance.high_risk',
						description: 'High risk activity detected',
					},
					{
						name: 'Travel Rule Required',
						value: 'compliance.travel_rule',
						description: 'Travel rule information required',
					},

					// Key Management Events
					{
						name: 'Key Generated',
						value: 'key.generated',
						description: 'New key has been generated',
					},
					{
						name: 'Key Rotated',
						value: 'key.rotated',
						description: 'Key has been rotated',
					},
					{
						name: 'Key Archived',
						value: 'key.archived',
						description: 'Key has been archived',
					},
					{
						name: 'MPC Ceremony Started',
						value: 'mpc.ceremony_started',
						description: 'MPC ceremony has started',
					},
					{
						name: 'MPC Ceremony Completed',
						value: 'mpc.ceremony_completed',
						description: 'MPC ceremony has completed',
					},

					// Staking Events
					{
						name: 'Stake Created',
						value: 'staking.created',
						description: 'New stake position created',
					},
					{
						name: 'Stake Rewards',
						value: 'staking.rewards',
						description: 'Staking rewards received',
					},
					{
						name: 'Unstake Completed',
						value: 'staking.unstaked',
						description: 'Unstaking completed',
					},

					// DeFi Events
					{
						name: 'DeFi Position Opened',
						value: 'defi.position_opened',
						description: 'DeFi position has been opened',
					},
					{
						name: 'DeFi Position Closed',
						value: 'defi.position_closed',
						description: 'DeFi position has been closed',
					},
					{
						name: 'DeFi Rewards Harvested',
						value: 'defi.rewards_harvested',
						description: 'DeFi rewards have been harvested',
					},

					// Settlement Events
					{
						name: 'Settlement Initiated',
						value: 'settlement.initiated',
						description: 'Settlement has been initiated',
					},
					{
						name: 'Settlement Completed',
						value: 'settlement.completed',
						description: 'Settlement has been completed',
					},
					{
						name: 'Settlement Failed',
						value: 'settlement.failed',
						description: 'Settlement has failed',
					},

					// Cold Storage Events
					{
						name: 'Cold Storage Transfer In',
						value: 'cold_storage.transfer_in',
						description: 'Assets moved to cold storage',
					},
					{
						name: 'Cold Storage Transfer Out',
						value: 'cold_storage.transfer_out',
						description: 'Assets moved from cold storage',
					},
					{
						name: 'Cold Storage Approval Required',
						value: 'cold_storage.approval_required',
						description: 'Cold storage operation requires approval',
					},

					// System Events
					{
						name: 'System Health Alert',
						value: 'system.health_alert',
						description: 'System health alert',
					},
					{
						name: 'API Rate Limit Warning',
						value: 'system.rate_limit',
						description: 'API rate limit warning',
					},
					{
						name: 'Maintenance Scheduled',
						value: 'system.maintenance',
						description: 'System maintenance scheduled',
					},
				],
			},
			{
				displayName: 'Filters',
				name: 'filters',
				type: 'collection',
				placeholder: 'Add Filter',
				default: {},
				options: [
					{
						displayName: 'Vault IDs',
						name: 'vaultIds',
						type: 'string',
						default: '',
						description: 'Filter by vault IDs (comma-separated)',
					},
					{
						displayName: 'Wallet IDs',
						name: 'walletIds',
						type: 'string',
						default: '',
						description: 'Filter by wallet IDs (comma-separated)',
					},
					{
						displayName: 'Blockchains',
						name: 'blockchains',
						type: 'multiOptions',
						default: [],
						options: [
							{ name: 'Bitcoin', value: 'bitcoin' },
							{ name: 'Ethereum', value: 'ethereum' },
							{ name: 'XRP Ledger', value: 'xrpl' },
							{ name: 'Polygon', value: 'polygon' },
							{ name: 'Solana', value: 'solana' },
							{ name: 'Avalanche', value: 'avalanche' },
							{ name: 'BNB Chain', value: 'bnb' },
							{ name: 'Arbitrum', value: 'arbitrum' },
							{ name: 'Optimism', value: 'optimism' },
							{ name: 'Cardano', value: 'cardano' },
							{ name: 'Polkadot', value: 'polkadot' },
							{ name: 'Cosmos', value: 'cosmos' },
							{ name: 'Tezos', value: 'tezos' },
							{ name: 'Stellar', value: 'stellar' },
							{ name: 'Algorand', value: 'algorand' },
						],
						description: 'Filter by blockchain networks',
					},
					{
						displayName: 'Minimum Amount',
						name: 'minAmount',
						type: 'number',
						default: 0,
						description: 'Minimum transaction amount to trigger',
					},
					{
						displayName: 'Asset Types',
						name: 'assetTypes',
						type: 'multiOptions',
						default: [],
						options: [
							{ name: 'Native', value: 'native' },
							{ name: 'ERC-20', value: 'erc20' },
							{ name: 'ERC-721 (NFT)', value: 'erc721' },
							{ name: 'ERC-1155', value: 'erc1155' },
							{ name: 'BEP-20', value: 'bep20' },
							{ name: 'SPL Token', value: 'spl' },
						],
						description: 'Filter by asset types',
					},
					{
						displayName: 'Risk Levels',
						name: 'riskLevels',
						type: 'multiOptions',
						default: [],
						options: [
							{ name: 'Low', value: 'low' },
							{ name: 'Medium', value: 'medium' },
							{ name: 'High', value: 'high' },
							{ name: 'Critical', value: 'critical' },
						],
						description: 'Filter by risk levels (for compliance events)',
					},
				],
			},
			{
				displayName: 'Options',
				name: 'options',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Include Raw Data',
						name: 'includeRawData',
						type: 'boolean',
						default: false,
						description: 'Whether to include raw blockchain data in the payload',
					},
					{
						displayName: 'Include Metadata',
						name: 'includeMetadata',
						type: 'boolean',
						default: true,
						description: 'Whether to include event metadata',
					},
					{
						displayName: 'Signature Verification',
						name: 'verifySignature',
						type: 'boolean',
						default: true,
						description: 'Whether to verify webhook signature',
					},
				],
			},
		],
	};

	webhookMethods = {
		default: {
			async checkExists(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const event = this.getNodeParameter('event') as string;

				try {
					const client = await createApiClient(this as unknown as IHookFunctions);
					const webhooks = await client.get(ENDPOINTS.WEBHOOKS.BASE, {
						url: webhookUrl,
						event,
					});

					if (Array.isArray(webhooks) && webhooks.length > 0) {
						const webhookData = this.getWorkflowStaticData('node');
						webhookData.webhookId = webhooks[0].id;
						return true;
					}
				} catch (error) {
					return false;
				}

				return false;
			},

			async create(this: IHookFunctions): Promise<boolean> {
				const webhookUrl = this.getNodeWebhookUrl('default') as string;
				const event = this.getNodeParameter('event') as string;
				const filters = this.getNodeParameter('filters', {}) as IDataObject;
				const options = this.getNodeParameter('options', {}) as IDataObject;

				const client = await createApiClient(this as unknown as IHookFunctions);

				const body: IDataObject = {
					url: webhookUrl,
					events: [event],
					active: true,
				};

				// Add filters
				if (filters.vaultIds) {
					body.vaultIds = (filters.vaultIds as string).split(',').map((id: string) => id.trim());
				}
				if (filters.walletIds) {
					body.walletIds = (filters.walletIds as string).split(',').map((id: string) => id.trim());
				}
				if (filters.blockchains && (filters.blockchains as string[]).length > 0) {
					body.blockchains = filters.blockchains;
				}
				if (filters.minAmount) {
					body.minAmount = filters.minAmount;
				}
				if (filters.assetTypes && (filters.assetTypes as string[]).length > 0) {
					body.assetTypes = filters.assetTypes;
				}
				if (filters.riskLevels && (filters.riskLevels as string[]).length > 0) {
					body.riskLevels = filters.riskLevels;
				}

				// Add options
				if (options.includeRawData !== undefined) {
					body.includeRawData = options.includeRawData;
				}
				if (options.includeMetadata !== undefined) {
					body.includeMetadata = options.includeMetadata;
				}

				const webhook = await client.post(ENDPOINTS.WEBHOOKS.BASE, body);

				const webhookData = this.getWorkflowStaticData('node');
				webhookData.webhookId = webhook.id;
				webhookData.webhookSecret = webhook.secret;

				return true;
			},

			async delete(this: IHookFunctions): Promise<boolean> {
				const webhookData = this.getWorkflowStaticData('node');

				if (!webhookData.webhookId) {
					return true;
				}

				try {
					const client = await createApiClient(this as unknown as IHookFunctions);
					await client.delete(ENDPOINTS.WEBHOOKS.BY_ID(webhookData.webhookId as string));
				} catch (error) {
					return false;
				}

				delete webhookData.webhookId;
				delete webhookData.webhookSecret;

				return true;
			},
		},
	};

	async webhook(this: IWebhookFunctions): Promise<IWebhookResponseData> {
		const req = this.getRequestObject();
		const body = this.getBodyData() as IDataObject;
		const options = this.getNodeParameter('options', {}) as IDataObject;

		// Verify webhook signature if enabled
		if (options.verifySignature !== false) {
			const webhookData = this.getWorkflowStaticData('node');
			const signature = req.headers['x-ripple-signature'] as string;
			const timestamp = req.headers['x-ripple-timestamp'] as string;

			if (webhookData.webhookSecret && signature) {
				const crypto = await import('crypto');
				const payload = `${timestamp}.${JSON.stringify(body)}`;
				const expectedSignature = crypto
					.createHmac('sha256', webhookData.webhookSecret as string)
					.update(payload)
					.digest('hex');

				if (signature !== expectedSignature) {
					return {
						webhookResponse: {
							status: 401,
							body: { error: 'Invalid signature' },
						},
					};
				}
			}
		}

		// Build output data
		const outputData: IDataObject = {
			event: body.event || body.type,
			timestamp: body.timestamp || new Date().toISOString(),
			data: body.data || body.payload || body,
		};

		// Include metadata if requested
		if (options.includeMetadata !== false && body.metadata) {
			outputData.metadata = body.metadata;
		}

		// Include raw data if requested
		if (options.includeRawData && body.rawData) {
			outputData.rawData = body.rawData;
		}

		return {
			workflowData: [
				this.helpers.returnJsonArray([outputData]),
			],
		};
	}
}
