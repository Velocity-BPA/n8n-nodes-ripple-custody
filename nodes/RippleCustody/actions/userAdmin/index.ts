/**
 * Ripple Custody - User Admin Resource
 * SPDX-License-Identifier: BSL-1.1
 * Copyright (c) 2024 Anthropic, PBC
 *
 * This file is licensed under the Business Source License 1.1.
 * You may use this file in compliance with the License.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	INodeProperties,
} from 'n8n-workflow';
import { createApiClient } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export const operations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['userAdmin'],
			},
		},
		options: [
			{
				name: 'Create User',
				value: 'createUser',
				description: 'Create a new user account',
				action: 'Create a user',
			},
			{
				name: 'Delete User',
				value: 'deleteUser',
				description: 'Delete a user account',
				action: 'Delete a user',
			},
			{
				name: 'Get Activity Log',
				value: 'getActivityLog',
				description: 'Get user activity log',
				action: 'Get activity log',
			},
			{
				name: 'Get Many Users',
				value: 'getManyUsers',
				description: 'Get multiple user accounts',
				action: 'Get many users',
			},
			{
				name: 'Get Permissions',
				value: 'getPermissions',
				description: 'Get available permissions',
				action: 'Get permissions',
			},
			{
				name: 'Get Roles',
				value: 'getRoles',
				description: 'Get available roles',
				action: 'Get roles',
			},
			{
				name: 'Get Sessions',
				value: 'getSessions',
				description: 'Get active user sessions',
				action: 'Get sessions',
			},
			{
				name: 'Get User',
				value: 'getUser',
				description: 'Get a specific user account',
				action: 'Get a user',
			},
			{
				name: 'Revoke Access',
				value: 'revokeAccess',
				description: 'Revoke user access or session',
				action: 'Revoke access',
			},
			{
				name: 'Update Permissions',
				value: 'updatePermissions',
				description: 'Update user permissions',
				action: 'Update permissions',
			},
			{
				name: 'Update User',
				value: 'updateUser',
				description: 'Update a user account',
				action: 'Update a user',
			},
		],
		default: 'getManyUsers',
	},
];

export const fields: INodeProperties[] = [
	// ----------------------------------
	//         User ID Field
	// ----------------------------------
	{
		displayName: 'User ID',
		name: 'userId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['userAdmin'],
				operation: ['getUser', 'updateUser', 'deleteUser', 'getActivityLog', 'getSessions', 'updatePermissions', 'revokeAccess'],
			},
		},
		default: '',
		description: 'Unique identifier of the user',
	},

	// ----------------------------------
	//         Create User Fields
	// ----------------------------------
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		placeholder: 'name@email.com',
		required: true,
		displayOptions: {
			show: {
				resource: ['userAdmin'],
				operation: ['createUser'],
			},
		},
		default: '',
		description: 'Email address for the user account',
	},
	{
		displayName: 'Role',
		name: 'role',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['userAdmin'],
				operation: ['createUser'],
			},
		},
		options: [
			{ name: 'Admin', value: 'admin' },
			{ name: 'Operator', value: 'operator' },
			{ name: 'Viewer', value: 'viewer' },
			{ name: 'Approver', value: 'approver' },
			{ name: 'Auditor', value: 'auditor' },
			{ name: 'Compliance Officer', value: 'compliance_officer' },
			{ name: 'Trader', value: 'trader' },
			{ name: 'Custom', value: 'custom' },
		],
		default: 'operator',
		description: 'Role to assign to the user',
	},
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['userAdmin'],
				operation: ['createUser'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'User\'s first name',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'User\'s last name',
			},
			{
				displayName: 'Phone Number',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number for MFA',
			},
			{
				displayName: 'Department',
				name: 'department',
				type: 'string',
				default: '',
				description: 'User\'s department',
			},
			{
				displayName: 'Vault Access',
				name: 'vaultIds',
				type: 'string',
				default: '',
				description: 'Comma-separated vault IDs the user can access (empty for all)',
			},
			{
				displayName: 'MFA Required',
				name: 'mfaRequired',
				type: 'boolean',
				default: true,
				description: 'Whether MFA is required for this user',
			},
			{
				displayName: 'MFA Method',
				name: 'mfaMethod',
				type: 'options',
				options: [
					{ name: 'Authenticator App', value: 'totp' },
					{ name: 'SMS', value: 'sms' },
					{ name: 'Hardware Key', value: 'hardware' },
					{ name: 'Email', value: 'email' },
				],
				default: 'totp',
				description: 'Preferred MFA method',
			},
			{
				displayName: 'Send Invitation',
				name: 'sendInvitation',
				type: 'boolean',
				default: true,
				description: 'Whether to send an invitation email',
			},
			{
				displayName: 'IP Whitelist',
				name: 'ipWhitelist',
				type: 'string',
				default: '',
				description: 'Comma-separated list of allowed IP addresses',
			},
			{
				displayName: 'Session Timeout (Minutes)',
				name: 'sessionTimeout',
				type: 'number',
				typeOptions: { minValue: 5, maxValue: 1440 },
				default: 60,
				description: 'Session timeout in minutes',
			},
		],
	},

	// ----------------------------------
	//         Update User Fields
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['userAdmin'],
				operation: ['updateUser'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'First Name',
				name: 'firstName',
				type: 'string',
				default: '',
				description: 'User\'s first name',
			},
			{
				displayName: 'Last Name',
				name: 'lastName',
				type: 'string',
				default: '',
				description: 'User\'s last name',
			},
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				options: [
					{ name: 'Admin', value: 'admin' },
					{ name: 'Operator', value: 'operator' },
					{ name: 'Viewer', value: 'viewer' },
					{ name: 'Approver', value: 'approver' },
					{ name: 'Auditor', value: 'auditor' },
					{ name: 'Compliance Officer', value: 'compliance_officer' },
					{ name: 'Trader', value: 'trader' },
					{ name: 'Custom', value: 'custom' },
				],
				default: 'operator',
				description: 'Role to assign',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Suspended', value: 'suspended' },
					{ name: 'Locked', value: 'locked' },
				],
				default: 'active',
				description: 'User account status',
			},
			{
				displayName: 'Phone Number',
				name: 'phone',
				type: 'string',
				default: '',
				description: 'Phone number for MFA',
			},
			{
				displayName: 'Department',
				name: 'department',
				type: 'string',
				default: '',
				description: 'User\'s department',
			},
			{
				displayName: 'Vault Access',
				name: 'vaultIds',
				type: 'string',
				default: '',
				description: 'Comma-separated vault IDs',
			},
			{
				displayName: 'IP Whitelist',
				name: 'ipWhitelist',
				type: 'string',
				default: '',
				description: 'Comma-separated IP addresses',
			},
			{
				displayName: 'Reset MFA',
				name: 'resetMfa',
				type: 'boolean',
				default: false,
				description: 'Whether to reset user MFA',
			},
		],
	},

	// ----------------------------------
	//         Update Permissions Fields
	// ----------------------------------
	{
		displayName: 'Permissions',
		name: 'permissions',
		type: 'multiOptions',
		required: true,
		displayOptions: {
			show: {
				resource: ['userAdmin'],
				operation: ['updatePermissions'],
			},
		},
		options: [
			{ name: 'View Vaults', value: 'vaults:read' },
			{ name: 'Manage Vaults', value: 'vaults:write' },
			{ name: 'View Wallets', value: 'wallets:read' },
			{ name: 'Manage Wallets', value: 'wallets:write' },
			{ name: 'View Transactions', value: 'transactions:read' },
			{ name: 'Create Transactions', value: 'transactions:write' },
			{ name: 'Approve Transactions', value: 'transactions:approve' },
			{ name: 'View Policies', value: 'policies:read' },
			{ name: 'Manage Policies', value: 'policies:write' },
			{ name: 'View Reports', value: 'reports:read' },
			{ name: 'Generate Reports', value: 'reports:write' },
			{ name: 'View Users', value: 'users:read' },
			{ name: 'Manage Users', value: 'users:write' },
			{ name: 'View Audit Logs', value: 'audit:read' },
			{ name: 'Manage Keys', value: 'keys:write' },
			{ name: 'Access Cold Storage', value: 'coldstorage:access' },
			{ name: 'Manage Webhooks', value: 'webhooks:write' },
			{ name: 'View Compliance', value: 'compliance:read' },
			{ name: 'Manage Compliance', value: 'compliance:write' },
			{ name: 'Trading', value: 'trading:execute' },
			{ name: 'Staking', value: 'staking:manage' },
			{ name: 'DeFi Access', value: 'defi:access' },
		],
		default: ['vaults:read', 'wallets:read', 'transactions:read'],
		description: 'Permissions to assign to the user',
	},
	{
		displayName: 'Permission Options',
		name: 'permissionOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['userAdmin'],
				operation: ['updatePermissions'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Mode',
				name: 'mode',
				type: 'options',
				options: [
					{ name: 'Replace', value: 'replace' },
					{ name: 'Add', value: 'add' },
					{ name: 'Remove', value: 'remove' },
				],
				default: 'replace',
				description: 'How to apply permissions',
			},
			{
				displayName: 'Vault Scope',
				name: 'vaultScope',
				type: 'string',
				default: '',
				description: 'Limit permissions to specific vault IDs (comma-separated)',
			},
		],
	},

	// ----------------------------------
	//         Revoke Access Fields
	// ----------------------------------
	{
		displayName: 'Revoke Type',
		name: 'revokeType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['userAdmin'],
				operation: ['revokeAccess'],
			},
		},
		options: [
			{ name: 'All Sessions', value: 'all_sessions' },
			{ name: 'Specific Session', value: 'session' },
			{ name: 'API Keys', value: 'api_keys' },
			{ name: 'All Access', value: 'all_access' },
		],
		default: 'all_sessions',
		description: 'Type of access to revoke',
	},
	{
		displayName: 'Session ID',
		name: 'sessionId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['userAdmin'],
				operation: ['revokeAccess'],
				revokeType: ['session'],
			},
		},
		default: '',
		description: 'Session ID to revoke',
	},
	{
		displayName: 'Revoke Options',
		name: 'revokeOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['userAdmin'],
				operation: ['revokeAccess'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Reason',
				name: 'reason',
				type: 'string',
				default: '',
				description: 'Reason for revoking access',
			},
			{
				displayName: 'Notify User',
				name: 'notifyUser',
				type: 'boolean',
				default: true,
				description: 'Whether to notify the user',
			},
			{
				displayName: 'Lock Account',
				name: 'lockAccount',
				type: 'boolean',
				default: false,
				description: 'Whether to lock the account',
			},
		],
	},

	// ----------------------------------
	//         Get Many Users Filters
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['userAdmin'],
				operation: ['getManyUsers', 'getActivityLog', 'getSessions'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['userAdmin'],
				operation: ['getManyUsers', 'getActivityLog', 'getSessions'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['userAdmin'],
				operation: ['getManyUsers'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Admin', value: 'admin' },
					{ name: 'Operator', value: 'operator' },
					{ name: 'Viewer', value: 'viewer' },
					{ name: 'Approver', value: 'approver' },
					{ name: 'Auditor', value: 'auditor' },
				],
				default: '',
				description: 'Filter by role',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Active', value: 'active' },
					{ name: 'Suspended', value: 'suspended' },
					{ name: 'Locked', value: 'locked' },
					{ name: 'Pending', value: 'pending' },
				],
				default: '',
				description: 'Filter by status',
			},
			{
				displayName: 'Department',
				name: 'department',
				type: 'string',
				default: '',
				description: 'Filter by department',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search by name or email',
			},
		],
	},

	// ----------------------------------
	//         Activity Log Filters
	// ----------------------------------
	{
		displayName: 'Activity Filters',
		name: 'activityFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['userAdmin'],
				operation: ['getActivityLog'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Action Type',
				name: 'actionType',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Login', value: 'login' },
					{ name: 'Logout', value: 'logout' },
					{ name: 'Transaction', value: 'transaction' },
					{ name: 'Approval', value: 'approval' },
					{ name: 'Settings Change', value: 'settings' },
					{ name: 'API Call', value: 'api' },
				],
				default: '',
				description: 'Filter by action type',
			},
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Filter activities after this date',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'Filter activities before this date',
			},
			{
				displayName: 'Resource Type',
				name: 'resourceType',
				type: 'string',
				default: '',
				description: 'Filter by resource type (e.g., vault, wallet)',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);

	switch (operation) {
		case 'createUser': {
			const email = this.getNodeParameter('email', index) as string;
			const role = this.getNodeParameter('role', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

			const body: IDataObject = {
				email,
				role,
				...additionalFields,
			};

			if (additionalFields.vaultIds) {
				body.vaultIds = (additionalFields.vaultIds as string).split(',').map((id) => id.trim());
			}
			if (additionalFields.ipWhitelist) {
				body.ipWhitelist = (additionalFields.ipWhitelist as string).split(',').map((ip) => ip.trim());
			}

			return await client.post(ENDPOINTS.USERS.BASE, body);
		}

		case 'getUser': {
			const userId = this.getNodeParameter('userId', index) as string;
			return await client.get(ENDPOINTS.USERS.BY_ID(userId));
		}

		case 'getManyUsers': {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const filters = this.getNodeParameter('filters', index) as IDataObject;
			const params: IDataObject = { ...filters };

			if (!returnAll) {
				params.limit = this.getNodeParameter('limit', index) as number;
			}

			const response = await client.get(ENDPOINTS.USERS.BASE, params);
			return (response.users || response.data || response) as IDataObject[];
		}

		case 'updateUser': {
			const userId = this.getNodeParameter('userId', index) as string;
			const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

			if (updateFields.vaultIds) {
				updateFields.vaultIds = (updateFields.vaultIds as string).split(',').map((id) => id.trim());
			}
			if (updateFields.ipWhitelist) {
				updateFields.ipWhitelist = (updateFields.ipWhitelist as string).split(',').map((ip) => ip.trim());
			}

			return await client.patch(ENDPOINTS.USERS.BY_ID(userId), updateFields);
		}

		case 'deleteUser': {
			const userId = this.getNodeParameter('userId', index) as string;
			await client.delete(ENDPOINTS.USERS.BY_ID(userId));
			return { success: true, userId };
		}

		case 'getRoles': {
			return await client.get(ENDPOINTS.USERS.ROLES);
		}

		case 'getPermissions': {
			return await client.get(ENDPOINTS.USERS.PERMISSIONS);
		}

		case 'updatePermissions': {
			const userId = this.getNodeParameter('userId', index) as string;
			const permissions = this.getNodeParameter('permissions', index) as string[];
			const permissionOptions = this.getNodeParameter('permissionOptions', index) as IDataObject;

			const body: IDataObject = {
				permissions,
				...permissionOptions,
			};

			if (permissionOptions.vaultScope) {
				body.vaultScope = (permissionOptions.vaultScope as string).split(',').map((id) => id.trim());
			}

			return await client.put(ENDPOINTS.USERS.PERMISSIONS_BY_ID(userId), body);
		}

		case 'getActivityLog': {
			const userId = this.getNodeParameter('userId', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const activityFilters = this.getNodeParameter('activityFilters', index) as IDataObject;
			const params: IDataObject = { ...activityFilters };

			if (!returnAll) {
				params.limit = this.getNodeParameter('limit', index) as number;
			}

			const response = await client.get(ENDPOINTS.USERS.ACTIVITY(userId), params);
			return (response.activities || response.data || response) as IDataObject[];
		}

		case 'getSessions': {
			const userId = this.getNodeParameter('userId', index) as string;
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const params: IDataObject = {};

			if (!returnAll) {
				params.limit = this.getNodeParameter('limit', index) as number;
			}

			const response = await client.get(ENDPOINTS.USERS.SESSIONS(userId), params);
			return (response.sessions || response.data || response) as IDataObject[];
		}

		case 'revokeAccess': {
			const userId = this.getNodeParameter('userId', index) as string;
			const revokeType = this.getNodeParameter('revokeType', index) as string;
			const revokeOptions = this.getNodeParameter('revokeOptions', index) as IDataObject;

			const body: IDataObject = {
				type: revokeType,
				...revokeOptions,
			};

			if (revokeType === 'session') {
				body.sessionId = this.getNodeParameter('sessionId', index) as string;
			}

			return await client.post(ENDPOINTS.USERS.REVOKE(userId), body);
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
