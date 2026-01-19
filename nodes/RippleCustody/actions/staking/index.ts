/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../../transport';
import { ENDPOINTS } from '../../constants';

export const stakingOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['staking'] } },
		options: [
			{ name: 'Claim Rewards', value: 'claimRewards', description: 'Claim staking rewards', action: 'Claim rewards' },
			{ name: 'Delegate', value: 'delegate', description: 'Delegate stake to a validator', action: 'Delegate stake' },
			{ name: 'Get APY', value: 'getApy', description: 'Get current staking APY', action: 'Get APY' },
			{ name: 'Get History', value: 'getHistory', description: 'Get staking history', action: 'Get staking history' },
			{ name: 'Get Positions', value: 'getPositions', description: 'Get staking positions', action: 'Get staking positions' },
			{ name: 'Get Queue', value: 'getQueue', description: 'Get unstaking queue', action: 'Get unstaking queue' },
			{ name: 'Get Rewards', value: 'getRewards', description: 'Get pending rewards', action: 'Get pending rewards' },
			{ name: 'Get Validators', value: 'getValidators', description: 'Get available validators', action: 'Get validators' },
			{ name: 'Redelegate', value: 'redelegate', description: 'Move stake to another validator', action: 'Redelegate stake' },
			{ name: 'Stake', value: 'stake', description: 'Stake assets', action: 'Stake assets' },
			{ name: 'Undelegate', value: 'undelegate', description: 'Remove delegation from validator', action: 'Undelegate stake' },
			{ name: 'Unstake', value: 'unstake', description: 'Unstake assets', action: 'Unstake assets' },
		],
		default: 'getPositions',
	},
];

export const stakingFields: INodeProperties[] = [
	{
		displayName: 'Vault ID',
		name: 'vaultId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['staking'],
				operation: ['stake', 'unstake', 'delegate', 'undelegate', 'redelegate', 'claimRewards', 'getPositions', 'getRewards', 'getHistory'],
			},
		},
		default: '',
		description: 'The vault to stake from',
	},
	{
		displayName: 'Blockchain',
		name: 'blockchain',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['staking'] } },
		options: [
			{ name: 'Ethereum', value: 'ethereum' },
			{ name: 'Solana', value: 'solana' },
			{ name: 'Polygon', value: 'polygon' },
			{ name: 'Avalanche', value: 'avalanche' },
			{ name: 'Cosmos', value: 'cosmos' },
			{ name: 'Polkadot', value: 'polkadot' },
			{ name: 'Cardano', value: 'cardano' },
			{ name: 'Tezos', value: 'tezos' },
		],
		default: 'ethereum',
		description: 'Blockchain network for staking',
	},
	{
		displayName: 'Amount',
		name: 'amount',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['staking'], operation: ['stake', 'unstake', 'delegate', 'redelegate'] } },
		default: '',
		description: 'Amount to stake/unstake',
	},
	{
		displayName: 'Validator Address',
		name: 'validatorAddress',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['staking'], operation: ['delegate', 'undelegate', 'redelegate'] } },
		default: '',
		description: 'Validator address to delegate to',
	},
	{
		displayName: 'New Validator Address',
		name: 'newValidatorAddress',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['staking'], operation: ['redelegate'] } },
		default: '',
		description: 'New validator address for redelegation',
	},
	{
		displayName: 'Position ID',
		name: 'positionId',
		type: 'string',
		displayOptions: { show: { resource: ['staking'], operation: ['unstake', 'claimRewards'] } },
		default: '',
		description: 'Staking position ID',
	},
	{
		displayName: 'Staking Options',
		name: 'stakingOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['staking'], operation: ['stake', 'delegate'] } },
		options: [
			{ displayName: 'Lock Period (Days)', name: 'lockPeriod', type: 'number', default: 0 },
			{ displayName: 'Auto-Compound', name: 'autoCompound', type: 'boolean', default: false },
			{ displayName: 'Validator ID', name: 'validatorId', type: 'string', default: '' },
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['staking'], operation: ['getPositions', 'getValidators', 'getHistory', 'getQueue'] } },
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['staking'], operation: ['getPositions', 'getValidators', 'getHistory', 'getQueue'], returnAll: [false] } },
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
		displayOptions: { show: { resource: ['staking'], operation: ['getValidators'] } },
		options: [
			{ displayName: 'Status', name: 'status', type: 'options', options: [{ name: 'Active', value: 'active' }, { name: 'Inactive', value: 'inactive' }, { name: 'Jailed', value: 'jailed' }], default: 'active' },
			{ displayName: 'Min APY', name: 'minApy', type: 'number', default: 0 },
			{ displayName: 'Sort By', name: 'sortBy', type: 'options', options: [{ name: 'APY', value: 'apy' }, { name: 'Stake', value: 'stake' }, { name: 'Commission', value: 'commission' }], default: 'apy' },
		],
	},
];

export async function executeStaking(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);
	const blockchain = this.getNodeParameter('blockchain', i) as string;

	switch (operation) {
		case 'stake': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const stakingOptions = this.getNodeParameter('stakingOptions', i) as IDataObject;

			return client.request('POST', ENDPOINTS.STAKING.STAKE, {
				vaultId,
				blockchain,
				amount,
				...stakingOptions,
			});
		}

		case 'unstake': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const positionId = this.getNodeParameter('positionId', i, '') as string;

			return client.request('POST', ENDPOINTS.STAKING.UNSTAKE, {
				vaultId,
				blockchain,
				amount,
				positionId: positionId || undefined,
			});
		}

		case 'delegate': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const validatorAddress = this.getNodeParameter('validatorAddress', i) as string;
			const stakingOptions = this.getNodeParameter('stakingOptions', i) as IDataObject;

			return client.request('POST', ENDPOINTS.STAKING.DELEGATE, {
				vaultId,
				blockchain,
				amount,
				validatorAddress,
				...stakingOptions,
			});
		}

		case 'undelegate': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const validatorAddress = this.getNodeParameter('validatorAddress', i) as string;

			return client.request('POST', ENDPOINTS.STAKING.UNDELEGATE, {
				vaultId,
				blockchain,
				validatorAddress,
			});
		}

		case 'redelegate': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const amount = this.getNodeParameter('amount', i) as string;
			const validatorAddress = this.getNodeParameter('validatorAddress', i) as string;
			const newValidatorAddress = this.getNodeParameter('newValidatorAddress', i) as string;

			return client.request('POST', ENDPOINTS.STAKING.REDELEGATE, {
				vaultId,
				blockchain,
				amount,
				fromValidator: validatorAddress,
				toValidator: newValidatorAddress,
			});
		}

		case 'claimRewards': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const positionId = this.getNodeParameter('positionId', i, '') as string;

			return client.request('POST', ENDPOINTS.STAKING.CLAIM, {
				vaultId,
				blockchain,
				positionId: positionId || undefined,
			});
		}

		case 'getPositions': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.STAKING.POSITIONS, {}, { vaultId, blockchain });
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.STAKING.POSITIONS, {}, { vaultId, blockchain, limit });
		}

		case 'getRewards': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			return client.request('GET', ENDPOINTS.STAKING.REWARDS, {}, { vaultId, blockchain });
		}

		case 'getValidators': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			const filters = this.getNodeParameter('filters', i) as IDataObject;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.STAKING.VALIDATORS, {}, { blockchain, ...filters });
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.STAKING.VALIDATORS, {}, { blockchain, limit, ...filters });
		}

		case 'getApy': {
			return client.request('GET', ENDPOINTS.STAKING.APY, {}, { blockchain });
		}

		case 'getHistory': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.STAKING.HISTORY, {}, { vaultId, blockchain });
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.STAKING.HISTORY, {}, { vaultId, blockchain, limit });
		}

		case 'getQueue': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;

			if (returnAll) {
				return client.requestAllItems('GET', ENDPOINTS.STAKING.QUEUE, {}, { blockchain });
			}

			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.STAKING.QUEUE, {}, { blockchain, limit });
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
