/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IExecuteFunctions, INodeProperties, IDataObject } from 'n8n-workflow';
import { createApiClient } from '../../transport';
import { ENDPOINTS } from '../../constants';

export const policyOperations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: { show: { resource: ['policy'] } },
		options: [
			{ name: 'Add Rule', value: 'addRule', description: 'Add a rule to policy', action: 'Add policy rule' },
			{ name: 'Add to Blacklist', value: 'addToBlacklist', description: 'Add address to blacklist', action: 'Add to blacklist' },
			{ name: 'Add to Whitelist', value: 'addToWhitelist', description: 'Add address to whitelist', action: 'Add to whitelist' },
			{ name: 'Create', value: 'create', description: 'Create a policy', action: 'Create a policy' },
			{ name: 'Delete', value: 'delete', description: 'Delete a policy', action: 'Delete a policy' },
			{ name: 'Get', value: 'get', description: 'Get a policy', action: 'Get a policy' },
			{ name: 'Get Approval Workflow', value: 'getApprovalWorkflow', description: 'Get approval workflow', action: 'Get approval workflow' },
			{ name: 'Get Blacklist', value: 'getBlacklist', description: 'Get blacklist', action: 'Get blacklist' },
			{ name: 'Get Many', value: 'getMany', description: 'Get many policies', action: 'Get many policies' },
			{ name: 'Get Rules', value: 'getRules', description: 'Get policy rules', action: 'Get policy rules' },
			{ name: 'Get Spending Limits', value: 'getSpendingLimits', description: 'Get spending limits', action: 'Get spending limits' },
			{ name: 'Get Whitelist', value: 'getWhitelist', description: 'Get whitelist', action: 'Get whitelist' },
			{ name: 'Remove from Blacklist', value: 'removeFromBlacklist', description: 'Remove from blacklist', action: 'Remove from blacklist' },
			{ name: 'Remove from Whitelist', value: 'removeFromWhitelist', description: 'Remove from whitelist', action: 'Remove from whitelist' },
			{ name: 'Remove Rule', value: 'removeRule', description: 'Remove rule from policy', action: 'Remove policy rule' },
			{ name: 'Set Approval Workflow', value: 'setApprovalWorkflow', description: 'Set approval workflow', action: 'Set approval workflow' },
			{ name: 'Set Spending Limits', value: 'setSpendingLimits', description: 'Set spending limits', action: 'Set spending limits' },
			{ name: 'Update', value: 'update', description: 'Update a policy', action: 'Update a policy' },
			{ name: 'Validate', value: 'validate', description: 'Validate against policy', action: 'Validate against policy' },
		],
		default: 'getMany',
	},
];

export const policyFields: INodeProperties[] = [
	{
		displayName: 'Policy ID',
		name: 'policyId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['policy'], operation: ['get', 'update', 'delete', 'getRules', 'addRule', 'removeRule', 'getApprovalWorkflow', 'setApprovalWorkflow', 'getSpendingLimits', 'setSpendingLimits', 'getWhitelist', 'addToWhitelist', 'removeFromWhitelist', 'getBlacklist', 'addToBlacklist', 'removeFromBlacklist', 'validate'] } },
		default: '',
	},
	{
		displayName: 'Policy Name',
		name: 'name',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['policy'], operation: ['create'] } },
		default: '',
	},
	{
		displayName: 'Policy Type',
		name: 'policyType',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['policy'], operation: ['create'] } },
		options: [
			{ name: 'Transaction', value: 'transaction' },
			{ name: 'Transfer', value: 'transfer' },
			{ name: 'Signing', value: 'signing' },
			{ name: 'Access', value: 'access' },
		],
		default: 'transaction',
	},
	{
		displayName: 'Rule ID',
		name: 'ruleId',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['policy'], operation: ['removeRule'] } },
		default: '',
	},
	{
		displayName: 'Rule Type',
		name: 'ruleType',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['policy'], operation: ['addRule'] } },
		options: [
			{ name: 'Amount Limit', value: 'amount_limit' },
			{ name: 'Velocity Limit', value: 'velocity_limit' },
			{ name: 'Whitelist', value: 'whitelist' },
			{ name: 'Blacklist', value: 'blacklist' },
			{ name: 'Time Window', value: 'time_window' },
			{ name: 'Approval Required', value: 'approval_required' },
			{ name: 'Asset Restriction', value: 'asset_restriction' },
		],
		default: 'amount_limit',
	},
	{
		displayName: 'Rule Condition',
		name: 'ruleCondition',
		type: 'json',
		required: true,
		displayOptions: { show: { resource: ['policy'], operation: ['addRule'] } },
		default: '{\n  "field": "amount",\n  "operator": "gt",\n  "value": 1000\n}',
	},
	{
		displayName: 'Rule Action',
		name: 'ruleAction',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['policy'], operation: ['addRule'] } },
		options: [
			{ name: 'Allow', value: 'allow' },
			{ name: 'Deny', value: 'deny' },
			{ name: 'Require Approval', value: 'require_approval' },
		],
		default: 'require_approval',
	},
	{
		displayName: 'Address',
		name: 'address',
		type: 'string',
		required: true,
		displayOptions: { show: { resource: ['policy'], operation: ['addToWhitelist', 'removeFromWhitelist', 'addToBlacklist', 'removeFromBlacklist'] } },
		default: '',
	},
	{
		displayName: 'Workflow Type',
		name: 'workflowType',
		type: 'options',
		required: true,
		displayOptions: { show: { resource: ['policy'], operation: ['setApprovalWorkflow'] } },
		options: [
			{ name: 'Single', value: 'single' },
			{ name: 'Multi', value: 'multi' },
			{ name: 'Quorum', value: 'quorum' },
			{ name: 'Sequential', value: 'sequential' },
		],
		default: 'single',
	},
	{
		displayName: 'Required Approvers',
		name: 'requiredApprovers',
		type: 'number',
		required: true,
		displayOptions: { show: { resource: ['policy'], operation: ['setApprovalWorkflow'] } },
		typeOptions: { minValue: 1 },
		default: 1,
	},
	{
		displayName: 'Spending Limits',
		name: 'spendingLimits',
		type: 'fixedCollection',
		typeOptions: { multipleValues: true },
		displayOptions: { show: { resource: ['policy'], operation: ['setSpendingLimits'] } },
		default: {},
		options: [
			{
				name: 'limits',
				displayName: 'Limits',
				values: [
					{ displayName: 'Asset', name: 'asset', type: 'string', default: '' },
					{ displayName: 'Period', name: 'period', type: 'options', options: [{ name: 'Transaction', value: 'transaction' }, { name: 'Hourly', value: 'hourly' }, { name: 'Daily', value: 'daily' }, { name: 'Weekly', value: 'weekly' }, { name: 'Monthly', value: 'monthly' }], default: 'daily' },
					{ displayName: 'Max Amount', name: 'maxAmount', type: 'string', default: '' },
				],
			},
		],
	},
	{
		displayName: 'Transaction Data',
		name: 'transactionData',
		type: 'json',
		required: true,
		displayOptions: { show: { resource: ['policy'], operation: ['validate'] } },
		default: '{\n  "amount": "1000",\n  "asset": "ETH",\n  "destination": "0x..."\n}',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		default: {},
		displayOptions: { show: { resource: ['policy'], operation: ['create', 'update'] } },
		options: [
			{ displayName: 'Description', name: 'description', type: 'string', default: '' },
			{ displayName: 'Enabled', name: 'enabled', type: 'boolean', default: true },
		],
	},
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: { show: { resource: ['policy'], operation: ['getMany', 'getRules', 'getWhitelist', 'getBlacklist'] } },
		default: false,
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: { show: { resource: ['policy'], operation: ['getMany', 'getRules', 'getWhitelist', 'getBlacklist'], returnAll: [false] } },
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
	},
];

export async function executePolicy(this: IExecuteFunctions, operation: string, i: number): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);

	switch (operation) {
		case 'create': {
			const name = this.getNodeParameter('name', i) as string;
			const policyType = this.getNodeParameter('policyType', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
			return client.request('POST', ENDPOINTS.POLICIES.BASE, { name, type: policyType, ...additionalFields });
		}

		case 'get': {
			const policyId = this.getNodeParameter('policyId', i) as string;
			return client.request('GET', ENDPOINTS.POLICIES.BY_ID(policyId));
		}

		case 'getMany': {
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.POLICIES.BASE);
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.POLICIES.BASE, {}, { limit });
		}

		case 'update': {
			const policyId = this.getNodeParameter('policyId', i) as string;
			const additionalFields = this.getNodeParameter('additionalFields', i) as IDataObject;
			return client.request('PATCH', ENDPOINTS.POLICIES.BY_ID(policyId), additionalFields);
		}

		case 'delete': {
			const policyId = this.getNodeParameter('policyId', i) as string;
			await client.request('DELETE', ENDPOINTS.POLICIES.BY_ID(policyId));
			return { success: true, policyId };
		}

		case 'getRules': {
			const policyId = this.getNodeParameter('policyId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.POLICIES.RULES(policyId));
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.POLICIES.RULES(policyId), {}, { limit });
		}

		case 'addRule': {
			const policyId = this.getNodeParameter('policyId', i) as string;
			const ruleType = this.getNodeParameter('ruleType', i) as string;
			const ruleCondition = JSON.parse(this.getNodeParameter('ruleCondition', i) as string);
			const ruleAction = this.getNodeParameter('ruleAction', i) as string;
			return client.request('POST', ENDPOINTS.POLICIES.RULES(policyId), { type: ruleType, condition: ruleCondition, action: ruleAction });
		}

		case 'removeRule': {
			const policyId = this.getNodeParameter('policyId', i) as string;
			const ruleId = this.getNodeParameter('ruleId', i) as string;
			await client.request('DELETE', `${ENDPOINTS.POLICIES.RULES(policyId)}/${ruleId}`);
			return { success: true, policyId, ruleId };
		}

		case 'getApprovalWorkflow': {
			const policyId = this.getNodeParameter('policyId', i) as string;
			return client.request('GET', ENDPOINTS.POLICIES.WORKFLOW(policyId));
		}

		case 'setApprovalWorkflow': {
			const policyId = this.getNodeParameter('policyId', i) as string;
			const workflowType = this.getNodeParameter('workflowType', i) as string;
			const requiredApprovers = this.getNodeParameter('requiredApprovers', i) as number;
			return client.request('PUT', ENDPOINTS.POLICIES.WORKFLOW(policyId), { type: workflowType, required_approvers: requiredApprovers });
		}

		case 'getSpendingLimits': {
			const policyId = this.getNodeParameter('policyId', i) as string;
			return client.request('GET', ENDPOINTS.POLICIES.LIMITS(policyId));
		}

		case 'setSpendingLimits': {
			const policyId = this.getNodeParameter('policyId', i) as string;
			const spendingLimits = this.getNodeParameter('spendingLimits', i) as IDataObject;
			const limits = (spendingLimits.limits as IDataObject[]) || [];
			return client.request('PUT', ENDPOINTS.POLICIES.LIMITS(policyId), { limits });
		}

		case 'getWhitelist': {
			const policyId = this.getNodeParameter('policyId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.POLICIES.WHITELIST(policyId));
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.POLICIES.WHITELIST(policyId), {}, { limit });
		}

		case 'addToWhitelist': {
			const policyId = this.getNodeParameter('policyId', i) as string;
			const address = this.getNodeParameter('address', i) as string;
			return client.request('POST', ENDPOINTS.POLICIES.WHITELIST(policyId), { address });
		}

		case 'removeFromWhitelist': {
			const policyId = this.getNodeParameter('policyId', i) as string;
			const address = this.getNodeParameter('address', i) as string;
			await client.request('DELETE', `${ENDPOINTS.POLICIES.WHITELIST(policyId)}/${encodeURIComponent(address)}`);
			return { success: true, policyId, address };
		}

		case 'getBlacklist': {
			const policyId = this.getNodeParameter('policyId', i) as string;
			const returnAll = this.getNodeParameter('returnAll', i) as boolean;
			if (returnAll) return client.requestAllItems('GET', ENDPOINTS.POLICIES.BLACKLIST(policyId));
			const limit = this.getNodeParameter('limit', i) as number;
			return client.request('GET', ENDPOINTS.POLICIES.BLACKLIST(policyId), {}, { limit });
		}

		case 'addToBlacklist': {
			const policyId = this.getNodeParameter('policyId', i) as string;
			const address = this.getNodeParameter('address', i) as string;
			return client.request('POST', ENDPOINTS.POLICIES.BLACKLIST(policyId), { address });
		}

		case 'removeFromBlacklist': {
			const policyId = this.getNodeParameter('policyId', i) as string;
			const address = this.getNodeParameter('address', i) as string;
			await client.request('DELETE', `${ENDPOINTS.POLICIES.BLACKLIST(policyId)}/${encodeURIComponent(address)}`);
			return { success: true, policyId, address };
		}

		case 'validate': {
			const policyId = this.getNodeParameter('policyId', i) as string;
			const transactionData = JSON.parse(this.getNodeParameter('transactionData', i) as string);
			return client.request('POST', ENDPOINTS.POLICIES.VALIDATE, { policyId, ...transactionData });
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
