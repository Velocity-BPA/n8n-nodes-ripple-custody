/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Policy utility functions for Ripple Custody governance and compliance
 */

export interface PolicyRule {
	id: string;
	type: 'amount_limit' | 'velocity_limit' | 'whitelist' | 'blacklist' | 'time_window' | 'approval_required' | 'asset_restriction' | 'destination_restriction';
	condition: PolicyCondition;
	action: 'allow' | 'deny' | 'require_approval';
	priority: number;
	enabled: boolean;
}

export interface PolicyCondition {
	field: string;
	operator: 'eq' | 'ne' | 'gt' | 'gte' | 'lt' | 'lte' | 'in' | 'not_in' | 'contains' | 'matches';
	value: string | number | boolean | string[];
}

export interface Policy {
	id: string;
	name: string;
	description?: string;
	rules: PolicyRule[];
	approvalWorkflow?: ApprovalWorkflow;
	spendingLimits?: SpendingLimit[];
	whitelist?: string[];
	blacklist?: string[];
	enabled: boolean;
}

export interface ApprovalWorkflow {
	type: 'single' | 'multi' | 'quorum' | 'sequential';
	requiredApprovers: number;
	approverGroups?: string[];
	timeoutHours?: number;
	escalationPolicy?: string;
}

export interface SpendingLimit {
	asset: string;
	period: 'transaction' | 'hourly' | 'daily' | 'weekly' | 'monthly';
	maxAmount: string;
	currentUsage?: string;
}

export interface PolicyValidationResult {
	valid: boolean;
	matchedRules: PolicyRule[];
	action: 'allow' | 'deny' | 'require_approval';
	violations: PolicyViolation[];
	requiredApprovals?: number;
}

export interface PolicyViolation {
	ruleId: string;
	ruleName: string;
	message: string;
	severity: 'warning' | 'error' | 'critical';
}

export interface TransactionContext {
	amount: string;
	asset: string;
	sourceAddress: string;
	destinationAddress: string;
	blockchain: string;
	transactionType: string;
	timestamp: number;
	metadata?: Record<string, unknown>;
}

/**
 * Validate a transaction against a policy
 */
export function validateTransaction(
	transaction: TransactionContext,
	policy: Policy,
): PolicyValidationResult {
	const result: PolicyValidationResult = {
		valid: true,
		matchedRules: [],
		action: 'allow',
		violations: [],
	};

	if (!policy.enabled) {
		return result;
	}

	const sortedRules = [...policy.rules]
		.filter(r => r.enabled)
		.sort((a, b) => b.priority - a.priority);

	for (const rule of sortedRules) {
		const ruleResult = evaluateRule(rule, transaction);
		if (ruleResult.matched) {
			result.matchedRules.push(rule);
			if (rule.action === 'deny') {
				result.valid = false;
				result.action = 'deny';
				result.violations.push({
					ruleId: rule.id,
					ruleName: `Rule ${rule.type}`,
					message: ruleResult.message || 'Policy rule violated',
					severity: 'error',
				});
			} else if (rule.action === 'require_approval') {
				result.action = 'require_approval';
				result.requiredApprovals = policy.approvalWorkflow?.requiredApprovers || 1;
			}
		}
	}

	// Check whitelist
	if (policy.whitelist?.length && !policy.whitelist.includes(transaction.destinationAddress)) {
		result.valid = false;
		result.action = 'deny';
		result.violations.push({
			ruleId: 'whitelist',
			ruleName: 'Whitelist Check',
			message: 'Destination address not in whitelist',
			severity: 'error',
		});
	}

	// Check blacklist
	if (policy.blacklist?.includes(transaction.destinationAddress)) {
		result.valid = false;
		result.action = 'deny';
		result.violations.push({
			ruleId: 'blacklist',
			ruleName: 'Blacklist Check',
			message: 'Destination address is blacklisted',
			severity: 'critical',
		});
	}

	return result;
}

/**
 * Evaluate a single policy rule
 */
export function evaluateRule(
	rule: PolicyRule,
	context: TransactionContext,
): { matched: boolean; message?: string } {
	const { condition } = rule;
	const fieldValue = getFieldValue(context, condition.field);

	const matched = evaluateCondition(fieldValue, condition.operator, condition.value);

	return {
		matched,
		message: matched ? `Rule ${rule.type} matched: ${condition.field} ${condition.operator} ${condition.value}` : undefined,
	};
}

/**
 * Get field value from transaction context
 */
function getFieldValue(context: TransactionContext, field: string): unknown {
	const fields: Record<string, unknown> = {
		amount: parseFloat(context.amount),
		asset: context.asset,
		source: context.sourceAddress,
		destination: context.destinationAddress,
		blockchain: context.blockchain,
		type: context.transactionType,
		timestamp: context.timestamp,
		...context.metadata,
	};
	return fields[field];
}

/**
 * Evaluate a condition
 */
function evaluateCondition(
	fieldValue: unknown,
	operator: PolicyCondition['operator'],
	conditionValue: PolicyCondition['value'],
): boolean {
	switch (operator) {
		case 'eq':
			return fieldValue === conditionValue;
		case 'ne':
			return fieldValue !== conditionValue;
		case 'gt':
			return typeof fieldValue === 'number' && fieldValue > (conditionValue as number);
		case 'gte':
			return typeof fieldValue === 'number' && fieldValue >= (conditionValue as number);
		case 'lt':
			return typeof fieldValue === 'number' && fieldValue < (conditionValue as number);
		case 'lte':
			return typeof fieldValue === 'number' && fieldValue <= (conditionValue as number);
		case 'in':
			return Array.isArray(conditionValue) && conditionValue.includes(fieldValue as string);
		case 'not_in':
			return Array.isArray(conditionValue) && !conditionValue.includes(fieldValue as string);
		case 'contains':
			return typeof fieldValue === 'string' && fieldValue.includes(conditionValue as string);
		case 'matches':
			return typeof fieldValue === 'string' && new RegExp(conditionValue as string).test(fieldValue);
		default:
			return false;
	}
}

/**
 * Check spending limits
 */
export function checkSpendingLimit(
	limits: SpendingLimit[],
	asset: string,
	amount: string,
): { allowed: boolean; limit?: SpendingLimit; remaining?: string } {
	const assetLimits = limits.filter(l => l.asset === asset || l.asset === '*');

	for (const limit of assetLimits) {
		const amountNum = parseFloat(amount);
		const maxAmount = parseFloat(limit.maxAmount);
		const currentUsage = parseFloat(limit.currentUsage || '0');

		if (currentUsage + amountNum > maxAmount) {
			return {
				allowed: false,
				limit,
				remaining: (maxAmount - currentUsage).toString(),
			};
		}
	}

	return { allowed: true };
}

/**
 * Validate approval workflow
 */
export function validateApprovalWorkflow(workflow: ApprovalWorkflow): { valid: boolean; errors: string[] } {
	const errors: string[] = [];

	if (workflow.requiredApprovers < 1) {
		errors.push('Required approvers must be at least 1');
	}

	if (workflow.type === 'quorum' && !workflow.approverGroups?.length) {
		errors.push('Quorum workflow requires approver groups');
	}

	if (workflow.timeoutHours !== undefined && workflow.timeoutHours < 1) {
		errors.push('Timeout must be at least 1 hour');
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}

/**
 * Calculate quorum requirements
 */
export function calculateQuorum(
	totalApprovers: number,
	quorumType: 'majority' | 'supermajority' | 'unanimous' | 'threshold',
	threshold?: number,
): number {
	switch (quorumType) {
		case 'majority':
			return Math.floor(totalApprovers / 2) + 1;
		case 'supermajority':
			return Math.ceil(totalApprovers * 0.67);
		case 'unanimous':
			return totalApprovers;
		case 'threshold':
			return threshold || 1;
		default:
			return 1;
	}
}

/**
 * Merge policies (for hierarchical policy evaluation)
 */
export function mergePolicies(policies: Policy[]): Policy {
	const mergedRules: PolicyRule[] = [];
	const mergedWhitelist: Set<string> = new Set();
	const mergedBlacklist: Set<string> = new Set();

	for (const policy of policies) {
		if (!policy.enabled) continue;

		mergedRules.push(...policy.rules);

		policy.whitelist?.forEach(addr => mergedWhitelist.add(addr));
		policy.blacklist?.forEach(addr => mergedBlacklist.add(addr));
	}

	return {
		id: 'merged',
		name: 'Merged Policy',
		rules: mergedRules.sort((a, b) => b.priority - a.priority),
		whitelist: Array.from(mergedWhitelist),
		blacklist: Array.from(mergedBlacklist),
		enabled: true,
	};
}

/**
 * Create a default policy
 */
export function createDefaultPolicy(name: string): Policy {
	return {
		id: `policy_${Date.now()}`,
		name,
		rules: [],
		whitelist: [],
		blacklist: [],
		enabled: true,
		approvalWorkflow: {
			type: 'single',
			requiredApprovers: 1,
		},
		spendingLimits: [],
	};
}

/**
 * Add a rule to a policy
 */
export function addPolicyRule(policy: Policy, rule: Omit<PolicyRule, 'id'>): Policy {
	return {
		...policy,
		rules: [
			...policy.rules,
			{
				...rule,
				id: `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
			},
		],
	};
}

/**
 * Remove a rule from a policy
 */
export function removePolicyRule(policy: Policy, ruleId: string): Policy {
	return {
		...policy,
		rules: policy.rules.filter(r => r.id !== ruleId),
	};
}

/**
 * Format policy for API request
 */
export function formatPolicyForApi(policy: Policy): Record<string, unknown> {
	return {
		id: policy.id,
		name: policy.name,
		description: policy.description,
		rules: policy.rules.map(r => ({
			id: r.id,
			type: r.type,
			condition: r.condition,
			action: r.action,
			priority: r.priority,
			enabled: r.enabled,
		})),
		approval_workflow: policy.approvalWorkflow ? {
			type: policy.approvalWorkflow.type,
			required_approvers: policy.approvalWorkflow.requiredApprovers,
			approver_groups: policy.approvalWorkflow.approverGroups,
			timeout_hours: policy.approvalWorkflow.timeoutHours,
			escalation_policy: policy.approvalWorkflow.escalationPolicy,
		} : undefined,
		spending_limits: policy.spendingLimits?.map(l => ({
			asset: l.asset,
			period: l.period,
			max_amount: l.maxAmount,
		})),
		whitelist: policy.whitelist,
		blacklist: policy.blacklist,
		enabled: policy.enabled,
	};
}

/**
 * Parse policy from API response
 */
export function parsePolicyFromApi(data: Record<string, unknown>): Policy {
	const rules = (data.rules as Record<string, unknown>[])?.map(r => ({
		id: r.id as string,
		type: r.type as PolicyRule['type'],
		condition: r.condition as PolicyCondition,
		action: r.action as PolicyRule['action'],
		priority: r.priority as number,
		enabled: r.enabled as boolean,
	})) || [];

	const approvalWorkflow = data.approval_workflow ? {
		type: (data.approval_workflow as Record<string, unknown>).type as ApprovalWorkflow['type'],
		requiredApprovers: (data.approval_workflow as Record<string, unknown>).required_approvers as number,
		approverGroups: (data.approval_workflow as Record<string, unknown>).approver_groups as string[],
		timeoutHours: (data.approval_workflow as Record<string, unknown>).timeout_hours as number,
		escalationPolicy: (data.approval_workflow as Record<string, unknown>).escalation_policy as string,
	} : undefined;

	const spendingLimits = (data.spending_limits as Record<string, unknown>[])?.map(l => ({
		asset: l.asset as string,
		period: l.period as SpendingLimit['period'],
		maxAmount: l.max_amount as string,
	}));

	return {
		id: data.id as string,
		name: data.name as string,
		description: data.description as string,
		rules,
		approvalWorkflow,
		spendingLimits,
		whitelist: data.whitelist as string[],
		blacklist: data.blacklist as string[],
		enabled: data.enabled as boolean,
	};
}
