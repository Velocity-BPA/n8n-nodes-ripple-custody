/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../../transport';
import { ENDPOINTS } from '../../constants';

export const smartContractOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['smartContract'] } },
		options: [
			{ name: 'Call', value: 'call', description: 'Call a smart contract method (read-only)', action: 'Call smart contract' },
			{ name: 'Deploy', value: 'deploy', description: 'Deploy a new smart contract', action: 'Deploy smart contract' },
			{ name: 'Estimate Gas', value: 'estimateGas', description: 'Estimate gas for contract execution', action: 'Estimate gas' },
			{ name: 'Execute', value: 'execute', description: 'Execute a smart contract method (write)', action: 'Execute smart contract' },
			{ name: 'Get ABI', value: 'getAbi', description: 'Get contract ABI', action: 'Get contract ABI' },
			{ name: 'Get Events', value: 'getEvents', description: 'Get contract events', action: 'Get contract events' },
			{ name: 'Get State', value: 'getState', description: 'Get contract state', action: 'Get contract state' },
			{ name: 'Pause', value: 'pause', description: 'Pause a contract', action: 'Pause contract' },
			{ name: 'Resume', value: 'resume', description: 'Resume a paused contract', action: 'Resume contract' },
			{ name: 'Upgrade', value: 'upgrade', description: 'Upgrade a proxy contract', action: 'Upgrade contract' },
			{ name: 'Verify', value: 'verify', description: 'Verify contract source code', action: 'Verify contract' },
		],
		default: 'call',
	},
];

export const smartContractFields: INodeProperties[] = [
	{
		displayName: 'Contract Address',
		name: 'contractAddress',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['smartContract'],
				operation: ['call', 'execute', 'getState', 'getEvents', 'getAbi', 'pause', 'resume', 'upgrade', 'verify', 'estimateGas'],
			},
		},
		default: '',
		description: 'The smart contract address',
	},
	{
		displayName: 'Blockchain',
		name: 'blockchain',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['smartContract'] } },
		options: [
			{ name: 'Ethereum', value: 'ethereum' },
			{ name: 'Polygon', value: 'polygon' },
			{ name: 'Avalanche', value: 'avalanche' },
			{ name: 'BNB Chain', value: 'bnb' },
			{ name: 'Arbitrum', value: 'arbitrum' },
			{ name: 'Optimism', value: 'optimism' },
			{ name: 'Base', value: 'base' },
		],
		default: 'ethereum',
		description: 'Blockchain network',
	},
	{
		displayName: 'Method Name',
		name: 'methodName',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['smartContract'], operation: ['call', 'execute', 'estimateGas'] } },
		default: '',
		description: 'Contract method to call',
	},
	{
		displayName: 'Method Parameters',
		name: 'methodParams',
		type: 'json',
		displayOptions: { show: { resource: ['smartContract'], operation: ['call', 'execute', 'estimateGas'] } },
		default: '[]',
		description: 'Parameters to pass to the method (JSON array)',
	},
	{
		displayName: 'Vault ID',
		name: 'vaultId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['smartContract'], operation: ['deploy', 'execute'] } },
		default: '',
		description: 'Vault to use for signing',
	},
	{
		displayName: 'Bytecode',
		name: 'bytecode',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['smartContract'], operation: ['deploy'] } },
		default: '',
		description: 'Contract bytecode to deploy',
	},
	{
		displayName: 'ABI',
		name: 'abi',
		type: 'json',
		required: true,
		displayOptions: { show: { resource: ['smartContract'], operation: ['deploy', 'verify'] } },
		default: '[]',
		description: 'Contract ABI (JSON)',
	},
	{
		displayName: 'Constructor Arguments',
		name: 'constructorArgs',
		type: 'json',
		displayOptions: { show: { resource: ['smartContract'], operation: ['deploy'] } },
		default: '[]',
		description: 'Constructor arguments (JSON array)',
	},
	{
		displayName: 'New Implementation',
		name: 'newImplementation',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['smartContract'], operation: ['upgrade'] } },
		default: '',
		description: 'Address of the new implementation contract',
	},
	{
		displayName: 'Source Code',
		name: 'sourceCode',
		type: 'string',
		typeOptions: { rows: 10 },
		required: true,
		displayOptions: { show: { resource: ['smartContract'], operation: ['verify'] } },
		default: '',
		description: 'Contract source code',
	},
	{
		displayName: 'Event Filters',
		name: 'eventFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['smartContract'], operation: ['getEvents'] } },
		options: [
			{ displayName: 'Event Name', name: 'eventName', type: 'string', default: '' },
			{ displayName: 'From Block', name: 'fromBlock', type: 'number', default: 0 },
			{ displayName: 'To Block', name: 'toBlock', type: 'string', default: 'latest' },
		],
	},
	{
		displayName: 'Gas Options',
		name: 'gasOptions',
		type: 'collection',
		placeholder: 'Add Option',
		default: {},
		displayOptions: { show: { resource: ['smartContract'], operation: ['deploy', 'execute'] } },
		options: [
			{ displayName: 'Gas Limit', name: 'gasLimit', type: 'number', default: 0 },
			{ displayName: 'Max Fee Per Gas (Gwei)', name: 'maxFeePerGas', type: 'number', default: 0 },
			{ displayName: 'Max Priority Fee (Gwei)', name: 'maxPriorityFeePerGas', type: 'number', default: 0 },
		],
	},
];

export async function executeSmartContract(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);
	const blockchain = this.getNodeParameter('blockchain', i) as string;

	switch (operation) {
		case 'deploy': {
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const bytecode = this.getNodeParameter('bytecode', i) as string;
			const abi = JSON.parse(this.getNodeParameter('abi', i) as string);
			const constructorArgs = JSON.parse(this.getNodeParameter('constructorArgs', i, '[]') as string);
			const gasOptions = this.getNodeParameter('gasOptions', i) as IDataObject;

			return client.request('POST', ENDPOINTS.CONTRACTS.DEPLOY, {
				vaultId,
				blockchain,
				bytecode,
				abi,
				constructorArgs,
				...gasOptions,
			});
		}

		case 'call': {
			const contractAddress = this.getNodeParameter('contractAddress', i) as string;
			const methodName = this.getNodeParameter('methodName', i) as string;
			const methodParams = JSON.parse(this.getNodeParameter('methodParams', i, '[]') as string);

			return client.request('POST', ENDPOINTS.CONTRACTS.CALL(contractAddress), {
				blockchain,
				methodName,
				params: methodParams,
			});
		}

		case 'execute': {
			const contractAddress = this.getNodeParameter('contractAddress', i) as string;
			const vaultId = this.getNodeParameter('vaultId', i) as string;
			const methodName = this.getNodeParameter('methodName', i) as string;
			const methodParams = JSON.parse(this.getNodeParameter('methodParams', i, '[]') as string);
			const gasOptions = this.getNodeParameter('gasOptions', i) as IDataObject;

			return client.request('POST', ENDPOINTS.CONTRACTS.EXECUTE(contractAddress), {
				vaultId,
				blockchain,
				methodName,
				params: methodParams,
				...gasOptions,
			});
		}

		case 'getState': {
			const contractAddress = this.getNodeParameter('contractAddress', i) as string;
			return client.request('GET', ENDPOINTS.CONTRACTS.STATE(contractAddress), {}, { blockchain });
		}

		case 'getEvents': {
			const contractAddress = this.getNodeParameter('contractAddress', i) as string;
			const eventFilters = this.getNodeParameter('eventFilters', i) as IDataObject;
			return client.request('GET', ENDPOINTS.CONTRACTS.EVENTS(contractAddress), {}, { blockchain, ...eventFilters });
		}

		case 'getAbi': {
			const contractAddress = this.getNodeParameter('contractAddress', i) as string;
			return client.request('GET', ENDPOINTS.CONTRACTS.ABI(contractAddress), {}, { blockchain });
		}

		case 'estimateGas': {
			const contractAddress = this.getNodeParameter('contractAddress', i) as string;
			const methodName = this.getNodeParameter('methodName', i) as string;
			const methodParams = JSON.parse(this.getNodeParameter('methodParams', i, '[]') as string);

			return client.request('POST', ENDPOINTS.CONTRACTS.GAS, {
				contractAddress,
				blockchain,
				methodName,
				params: methodParams,
			});
		}

		case 'verify': {
			const contractAddress = this.getNodeParameter('contractAddress', i) as string;
			const sourceCode = this.getNodeParameter('sourceCode', i) as string;
			const abi = JSON.parse(this.getNodeParameter('abi', i) as string);

			return client.request('POST', ENDPOINTS.CONTRACTS.VERIFY(contractAddress), {
				blockchain,
				sourceCode,
				abi,
			});
		}

		case 'upgrade': {
			const contractAddress = this.getNodeParameter('contractAddress', i) as string;
			const newImplementation = this.getNodeParameter('newImplementation', i) as string;

			return client.request('POST', ENDPOINTS.CONTRACTS.UPGRADE(contractAddress), {
				newImplementation,
				blockchain,
			});
		}

		case 'pause': {
			const contractAddress = this.getNodeParameter('contractAddress', i) as string;
			return client.request('POST', ENDPOINTS.CONTRACTS.PAUSE(contractAddress), { blockchain });
		}

		case 'resume': {
			const contractAddress = this.getNodeParameter('contractAddress', i) as string;
			return client.request('POST', `${ENDPOINTS.CONTRACTS.BASE}/${contractAddress}/resume`, { blockchain });
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
