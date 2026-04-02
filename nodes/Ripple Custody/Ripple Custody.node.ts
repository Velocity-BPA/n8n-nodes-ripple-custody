/**
 * Copyright (c) 2026 Velocity BPA
 * 
 * Licensed under the Business Source License 1.1 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     https://github.com/VelocityBPA/n8n-nodes-ripplecustody/blob/main/LICENSE
 * 
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError,
  NodeApiError,
} from 'n8n-workflow';

export class RippleCustody implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Ripple Custody',
    name: 'ripplecustody',
    icon: 'file:ripplecustody.svg',
    group: ['transform'],
    version: 1,
    subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
    description: 'Interact with the Ripple Custody API',
    defaults: {
      name: 'Ripple Custody',
    },
    inputs: ['main'],
    outputs: ['main'],
    credentials: [
      {
        name: 'ripplecustodyApi',
        required: true,
      },
    ],
    properties: [
      {
        displayName: 'Resource',
        name: 'resource',
        type: 'options',
        noDataExpression: true,
        options: [
          {
            name: 'Wallets',
            value: 'wallets',
          },
          {
            name: 'Transactions',
            value: 'transactions',
          },
          {
            name: 'Balances',
            value: 'balances',
          },
          {
            name: 'Keys',
            value: 'keys',
          },
          {
            name: 'Policies',
            value: 'policies',
          },
          {
            name: 'Approvals',
            value: 'approvals',
          }
        ],
        default: 'wallets',
      },
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['wallets'],
		},
	},
	options: [
		{
			name: 'List Wallets',
			value: 'listWallets',
			description: 'Retrieve all wallets for the account',
			action: 'List wallets',
		},
		{
			name: 'Create Wallet',
			value: 'createWallet',
			description: 'Create a new custody wallet',
			action: 'Create wallet',
		},
		{
			name: 'Get Wallet',
			value: 'getWallet',
			description: 'Get specific wallet details',
			action: 'Get wallet',
		},
		{
			name: 'Update Wallet',
			value: 'updateWallet',
			description: 'Update wallet configuration',
			action: 'Update wallet',
		},
		{
			name: 'Delete Wallet',
			value: 'deleteWallet',
			description: 'Archive a wallet',
			action: 'Delete wallet',
		},
	],
	default: 'listWallets',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['transactions'] } },
  options: [
    { name: 'List Transactions', value: 'listTransactions', description: 'Get transaction history', action: 'List transactions' },
    { name: 'Create Transaction', value: 'createTransaction', description: 'Initiate a new transaction', action: 'Create transaction' },
    { name: 'Get Transaction', value: 'getTransaction', description: 'Get transaction details', action: 'Get transaction' },
    { name: 'Sign Transaction', value: 'signTransaction', description: 'Sign pending transaction with MPC', action: 'Sign transaction' },
    { name: 'Broadcast Transaction', value: 'broadcastTransaction', description: 'Broadcast signed transaction', action: 'Broadcast transaction' },
    { name: 'Cancel Transaction', value: 'cancelTransaction', description: 'Cancel pending transaction', action: 'Cancel transaction' }
  ],
  default: 'listTransactions',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['balances'] } },
	options: [
		{
			name: 'Get All Balances',
			value: 'getAllBalances',
			description: 'Get balances across all wallets',
			action: 'Get all balances',
		},
		{
			name: 'Get Wallet Balances',
			value: 'getWalletBalances',
			description: 'Get balances for specific wallet',
			action: 'Get wallet balances',
		},
		{
			name: 'Get Balance History',
			value: 'getBalanceHistory',
			description: 'Get historical balance data',
			action: 'Get balance history',
		},
		{
			name: 'Refresh Balances',
			value: 'refreshBalances',
			description: 'Trigger balance refresh',
			action: 'Refresh balances',
		},
	],
	default: 'getAllBalances',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['keys'] } },
  options: [
    { name: 'List Keys', value: 'listKeys', description: 'Get all managed keys', action: 'List keys' },
    { name: 'Generate Key', value: 'generateKey', description: 'Generate new MPC key shares', action: 'Generate key' },
    { name: 'Get Key', value: 'getKey', description: 'Get key details and metadata', action: 'Get key' },
    { name: 'Rotate Key', value: 'rotateKey', description: 'Rotate key shares', action: 'Rotate key' },
    { name: 'Delete Key', value: 'deleteKey', description: 'Securely delete key shares', action: 'Delete key' }
  ],
  default: 'listKeys',
},
{
  displayName: 'Operation',
  name: 'operation',
  type: 'options',
  noDataExpression: true,
  displayOptions: { show: { resource: ['policies'] } },
  options: [
    { name: 'List Policies', value: 'listPolicies', description: 'Get all security policies', action: 'List all policies' },
    { name: 'Create Policy', value: 'createPolicy', description: 'Create new security policy', action: 'Create a policy' },
    { name: 'Get Policy', value: 'getPolicy', description: 'Get specific policy details', action: 'Get a policy' },
    { name: 'Update Policy', value: 'updatePolicy', description: 'Update policy configuration', action: 'Update a policy' },
    { name: 'Delete Policy', value: 'deletePolicy', description: 'Remove security policy', action: 'Delete a policy' }
  ],
  default: 'listPolicies',
},
{
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: {
		show: {
			resource: ['approvals'],
		},
	},
	options: [
		{
			name: 'List Approvals',
			value: 'listApprovals',
			description: 'Get pending approvals',
			action: 'List approvals',
		},
		{
			name: 'Approve Transaction',
			value: 'approveTransaction',
			description: 'Approve pending transaction',
			action: 'Approve transaction',
		},
		{
			name: 'Reject Transaction',
			value: 'rejectTransaction',
			description: 'Reject pending transaction',
			action: 'Reject transaction',
		},
		{
			name: 'Get Approval',
			value: 'getApproval',
			description: 'Get approval details',
			action: 'Get approval',
		},
	],
	default: 'listApprovals',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	default: 50,
	description: 'Maximum number of wallets to return',
	displayOptions: {
		show: {
			resource: ['wallets'],
			operation: ['listWallets'],
		},
	},
},
{
	displayName: 'Offset',
	name: 'offset',
	type: 'number',
	default: 0,
	description: 'Number of wallets to skip for pagination',
	displayOptions: {
		show: {
			resource: ['wallets'],
			operation: ['listWallets'],
		},
	},
},
{
	displayName: 'Currency',
	name: 'currency',
	type: 'string',
	default: '',
	description: 'Filter wallets by currency (e.g., BTC, ETH, XRP)',
	displayOptions: {
		show: {
			resource: ['wallets'],
			operation: ['listWallets', 'createWallet'],
		},
	},
},
{
	displayName: 'Currency',
	name: 'currency',
	type: 'string',
	required: true,
	default: '',
	description: 'Currency for the new wallet (e.g., BTC, ETH, XRP)',
	displayOptions: {
		show: {
			resource: ['wallets'],
			operation: ['createWallet'],
		},
	},
},
{
	displayName: 'Label',
	name: 'label',
	type: 'string',
	default: '',
	description: 'Label or name for the wallet',
	displayOptions: {
		show: {
			resource: ['wallets'],
			operation: ['createWallet', 'updateWallet'],
		},
	},
},
{
	displayName: 'Type',
	name: 'type',
	type: 'options',
	options: [
		{
			name: 'Hot',
			value: 'hot',
		},
		{
			name: 'Cold',
			value: 'cold',
		},
		{
			name: 'MPC',
			value: 'mpc',
		},
	],
	default: 'hot',
	description: 'Type of wallet to create',
	displayOptions: {
		show: {
			resource: ['wallets'],
			operation: ['createWallet'],
		},
	},
},
{
	displayName: 'Wallet ID',
	name: 'walletId',
	type: 'string',
	required: true,
	default: '',
	description: 'ID of the wallet to retrieve, update, or delete',
	displayOptions: {
		show: {
			resource: ['wallets'],
			operation: ['getWallet', 'updateWallet', 'deleteWallet'],
		},
	},
},
{
  displayName: 'Wallet ID',
  name: 'walletId',
  type: 'string',
  required: true,
  default: '',
  displayOptions: { show: { resource: ['transactions'], operation: ['listTransactions', 'createTransaction'] } },
  description: 'The wallet ID to query transactions for',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  default: 'all',
  displayOptions: { show: { resource: ['transactions'], operation: ['listTransactions'] } },
  options: [
    { name: 'All', value: 'all' },
    { name: 'Pending', value: 'pending' },
    { name: 'Signed', value: 'signed' },
    { name: 'Broadcast', value: 'broadcast' },
    { name: 'Confirmed', value: 'confirmed' },
    { name: 'Failed', value: 'failed' },
    { name: 'Cancelled', value: 'cancelled' }
  ],
  description: 'Filter transactions by status',
},
{
  displayName: 'Limit',
  name: 'limit',
  type: 'number',
  default: 50,
  typeOptions: { minValue: 1, maxValue: 500 },
  displayOptions: { show: { resource: ['transactions'], operation: ['listTransactions'] } },
  description: 'Maximum number of transactions to return',
},
{
  displayName: 'Offset',
  name: 'offset',
  type: 'number',
  default: 0,
  typeOptions: { minValue: 0 },
  displayOptions: { show: { resource: ['transactions'], operation: ['listTransactions'] } },
  description: 'Number of transactions to skip',
},
{
  displayName: 'Recipient',
  name: 'recipient',
  type: 'string',
  required: true,
  default: '',
  displayOptions: { show: { resource: ['transactions'], operation: ['createTransaction'] } },
  description: 'The recipient address or account for the transaction',
},
{
  displayName: 'Amount',
  name: 'amount',
  type: 'string',
  required: true,
  default: '',
  displayOptions: { show: { resource: ['transactions'], operation: ['createTransaction'] } },
  description: 'The amount to send (as string to preserve precision)',
},
{
  displayName: 'Currency',
  name: 'currency',
  type: 'string',
  required: true,
  default: 'XRP',
  displayOptions: { show: { resource: ['transactions'], operation: ['createTransaction'] } },
  description: 'The currency code for the transaction',
},
{
  displayName: 'Transaction ID',
  name: 'transactionId',
  type: 'string',
  required: true,
  default: '',
  displayOptions: { show: { resource: ['transactions'], operation: ['getTransaction', 'signTransaction', 'broadcastTransaction', 'cancelTransaction'] } },
  description: 'The ID of the transaction',
},
{
	displayName: 'Currency',
	name: 'currency',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['balances'],
			operation: ['getAllBalances'],
		},
	},
	default: '',
	description: 'Filter by specific currency code',
},
{
	displayName: 'Include Empty',
	name: 'includeEmpty',
	type: 'boolean',
	displayOptions: {
		show: {
			resource: ['balances'],
			operation: ['getAllBalances'],
		},
	},
	default: false,
	description: 'Whether to include wallets with zero balances',
},
{
	displayName: 'Wallet ID',
	name: 'walletId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['balances'],
			operation: ['getWalletBalances', 'getBalanceHistory', 'refreshBalances'],
		},
	},
	default: '',
	description: 'ID of the wallet',
},
{
	displayName: 'Start Date',
	name: 'startDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['balances'],
			operation: ['getBalanceHistory'],
		},
	},
	default: '',
	description: 'Start date for historical data',
},
{
	displayName: 'End Date',
	name: 'endDate',
	type: 'dateTime',
	displayOptions: {
		show: {
			resource: ['balances'],
			operation: ['getBalanceHistory'],
		},
	},
	default: '',
	description: 'End date for historical data',
},
{
  displayName: 'Wallet ID',
  name: 'walletId',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['keys'], operation: ['listKeys'] } },
  default: '',
  description: 'Filter keys by wallet ID'
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['keys'], operation: ['listKeys'] } },
  options: [
    { name: 'Active', value: 'active' },
    { name: 'Inactive', value: 'inactive' },
    { name: 'Pending', value: 'pending' },
    { name: 'Revoked', value: 'revoked' }
  ],
  default: '',
  description: 'Filter keys by status'
},
{
  displayName: 'Algorithm',
  name: 'algorithm',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['keys'], operation: ['generateKey'] } },
  options: [
    { name: 'ECDSA', value: 'ecdsa' },
    { name: 'EdDSA', value: 'eddsa' },
    { name: 'RSA', value: 'rsa' }
  ],
  default: 'ecdsa',
  description: 'Cryptographic algorithm for the key'
},
{
  displayName: 'Curve',
  name: 'curve',
  type: 'options',
  required: true,
  displayOptions: { show: { resource: ['keys'], operation: ['generateKey'] } },
  options: [
    { name: 'secp256k1', value: 'secp256k1' },
    { name: 'secp256r1', value: 'secp256r1' },
    { name: 'ed25519', value: 'ed25519' }
  ],
  default: 'secp256k1',
  description: 'Elliptic curve for the key'
},
{
  displayName: 'Wallet ID',
  name: 'walletId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['keys'], operation: ['generateKey'] } },
  default: '',
  description: 'Wallet ID to associate the key with'
},
{
  displayName: 'Key ID',
  name: 'keyId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['keys'], operation: ['getKey', 'rotateKey', 'deleteKey'] } },
  default: '',
  description: 'Unique identifier of the key'
},
{
  displayName: 'Policy Type',
  name: 'type',
  type: 'string',
  required: false,
  displayOptions: { show: { resource: ['policies'], operation: ['listPolicies'] } },
  default: '',
  description: 'Filter policies by type',
},
{
  displayName: 'Status',
  name: 'status',
  type: 'options',
  required: false,
  displayOptions: { show: { resource: ['policies'], operation: ['listPolicies'] } },
  options: [
    { name: 'Active', value: 'active' },
    { name: 'Inactive', value: 'inactive' },
    { name: 'Pending', value: 'pending' }
  ],
  default: '',
  description: 'Filter policies by status',
},
{
  displayName: 'Policy Name',
  name: 'name',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['policies'], operation: ['createPolicy'] } },
  default: '',
  description: 'Name of the security policy',
},
{
  displayName: 'Rules',
  name: 'rules',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['policies'], operation: ['createPolicy', 'updatePolicy'] } },
  default: '',
  description: 'Policy rules configuration as JSON string',
},
{
  displayName: 'Approvers',
  name: 'approvers',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['policies'], operation: ['createPolicy'] } },
  default: '',
  description: 'Comma-separated list of approver user IDs',
},
{
  displayName: 'Policy ID',
  name: 'policyId',
  type: 'string',
  required: true,
  displayOptions: { show: { resource: ['policies'], operation: ['getPolicy', 'updatePolicy', 'deletePolicy'] } },
  default: '',
  description: 'The ID of the policy',
},
{
	displayName: 'Status',
	name: 'status',
	type: 'options',
	options: [
		{
			name: 'Pending',
			value: 'pending',
		},
		{
			name: 'Approved',
			value: 'approved',
		},
		{
			name: 'Rejected',
			value: 'rejected',
		},
	],
	displayOptions: {
		show: {
			resource: ['approvals'],
			operation: ['listApprovals'],
		},
	},
	default: 'pending',
	description: 'Filter approvals by status',
},
{
	displayName: 'Wallet ID',
	name: 'walletId',
	type: 'string',
	displayOptions: {
		show: {
			resource: ['approvals'],
			operation: ['listApprovals'],
		},
	},
	default: '',
	description: 'Filter approvals by wallet ID',
},
{
	displayName: 'Limit',
	name: 'limit',
	type: 'number',
	displayOptions: {
		show: {
			resource: ['approvals'],
			operation: ['listApprovals'],
		},
	},
	default: 100,
	description: 'Maximum number of approvals to return',
},
{
	displayName: 'Approval ID',
	name: 'approvalId',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['approvals'],
			operation: ['approveTransaction', 'rejectTransaction', 'getApproval'],
		},
	},
	default: '',
	description: 'The ID of the approval',
},
{
	displayName: 'Rejection Reason',
	name: 'reason',
	type: 'string',
	required: true,
	displayOptions: {
		show: {
			resource: ['approvals'],
			operation: ['rejectTransaction'],
		},
	},
	default: '',
	description: 'Reason for rejecting the transaction',
},
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const resource = this.getNodeParameter('resource', 0) as string;

    switch (resource) {
      case 'wallets':
        return [await executeWalletsOperations.call(this, items)];
      case 'transactions':
        return [await executeTransactionsOperations.call(this, items)];
      case 'balances':
        return [await executeBalancesOperations.call(this, items)];
      case 'keys':
        return [await executeKeysOperations.call(this, items)];
      case 'policies':
        return [await executePoliciesOperations.call(this, items)];
      case 'approvals':
        return [await executeApprovalsOperations.call(this, items)];
      default:
        throw new NodeOperationError(this.getNode(), `The resource "${resource}" is not supported`);
    }
  }
}

// ============================================================
// Resource Handler Functions
// ============================================================

async function executeWalletsOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('ripplecustodyApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'listWallets': {
					const limit = this.getNodeParameter('limit', i) as number;
					const offset = this.getNodeParameter('offset', i) as number;
					const currency = this.getNodeParameter('currency', i) as string;

					const params: any = {};
					if (limit) params.limit = limit;
					if (offset) params.offset = offset;
					if (currency) params.currency = currency;

					const queryString = Object.keys(params).length > 0 
						? '?' + new URLSearchParams(params).toString() 
						: '';

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/wallets${queryString}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'createWallet': {
					const currency = this.getNodeParameter('currency', i) as string;
					const label = this.getNodeParameter('label', i) as string;
					const type = this.getNodeParameter('type', i) as string;

					const body: any = {
						currency,
						type,
					};
					if (label) body.label = label;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/wallets`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getWallet': {
					const walletId = this.getNodeParameter('walletId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/wallets/${walletId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'updateWallet': {
					const walletId = this.getNodeParameter('walletId', i) as string;
					const label = this.getNodeParameter('label', i) as string;

					const body: any = {};
					if (label) body.label = label;

					const options: any = {
						method: 'PUT',
						url: `${credentials.baseUrl}/wallets/${walletId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'deleteWallet': {
					const walletId = this.getNodeParameter('walletId', i) as string;

					const options: any = {
						method: 'DELETE',
						url: `${credentials.baseUrl}/wallets/${walletId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(
						this.getNode(),
						`Unknown operation: ${operation}`,
					);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeTransactionsOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('ripplecustodyApi') as any;
  
  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;
      const baseOptions: any = {
        headers: {
          'Authorization': `Bearer ${credentials.apiKey}`,
          'Content-Type': 'application/json',
        },
        json: true,
      };
      
      switch (operation) {
        case 'listTransactions': {
          const walletId = this.getNodeParameter('walletId', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          const limit = this.getNodeParameter('limit', i) as number;
          const offset = this.getNodeParameter('offset', i) as number;
          
          const queryParams: string[] = [];
          queryParams.push(`walletId=${encodeURIComponent(walletId)}`);
          if (status !== 'all') {
            queryParams.push(`status=${encodeURIComponent(status)}`);
          }
          queryParams.push(`limit=${limit}`);
          queryParams.push(`offset=${offset}`);
          
          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${credentials.baseUrl}/transactions?${queryParams.join('&')}`,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'createTransaction': {
          const walletId = this.getNodeParameter('walletId', i) as string;
          const recipient = this.getNodeParameter('recipient', i) as string;
          const amount = this.getNodeParameter('amount', i) as string;
          const currency = this.getNodeParameter('currency', i) as string;
          
          const options: any = {
            ...baseOptions,
            method: 'POST',
            url: `${credentials.baseUrl}/transactions`,
            body: {
              walletId,
              recipient,
              amount,
              currency,
            },
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'getTransaction': {
          const transactionId = this.getNodeParameter('transactionId', i) as string;
          
          const options: any = {
            ...baseOptions,
            method: 'GET',
            url: `${credentials.baseUrl}/transactions/${encodeURIComponent(transactionId)}`,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'signTransaction': {
          const transactionId = this.getNodeParameter('transactionId', i) as string;
          
          const options: any = {
            ...baseOptions,
            method: 'PUT',
            url: `${credentials.baseUrl}/transactions/${encodeURIComponent(transactionId)}/sign`,
            body: {},
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'broadcastTransaction': {
          const transactionId = this.getNodeParameter('transactionId', i) as string;
          
          const options: any = {
            ...baseOptions,
            method: 'POST',
            url: `${credentials.baseUrl}/transactions/${encodeURIComponent(transactionId)}/broadcast`,
            body: {},
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        case 'cancelTransaction': {
          const transactionId = this.getNodeParameter('transactionId', i) as string;
          
          const options: any = {
            ...baseOptions,
            method: 'DELETE',
            url: `${credentials.baseUrl}/transactions/${encodeURIComponent(transactionId)}`,
          };
          result = await this.helpers.httpRequest(options) as any;
          break;
        }
        
        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }
      
      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }
  
  return returnData;
}

async function executeBalancesOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('ripplecustodyApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'getAllBalances': {
					const currency = this.getNodeParameter('currency', i) as string;
					const includeEmpty = this.getNodeParameter('includeEmpty', i) as boolean;

					const queryParams: any = {};
					if (currency) queryParams.currency = currency;
					if (includeEmpty) queryParams.includeEmpty = includeEmpty.toString();

					const queryString = Object.keys(queryParams).length > 0 ? 
						'?' + new URLSearchParams(queryParams).toString() : '';

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/balances${queryString}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getWalletBalances': {
					const walletId = this.getNodeParameter('walletId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/wallets/${walletId}/balances`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getBalanceHistory': {
					const walletId = this.getNodeParameter('walletId', i) as string;
					const startDate = this.getNodeParameter('startDate', i) as string;
					const endDate = this.getNodeParameter('endDate', i) as string;

					const queryParams: any = {};
					if (walletId) queryParams.walletId = walletId;
					if (startDate) queryParams.startDate = startDate;
					if (endDate) queryParams.endDate = endDate;

					const queryString = Object.keys(queryParams).length > 0 ? 
						'?' + new URLSearchParams(queryParams).toString() : '';

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/balances/history${queryString}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'refreshBalances': {
					const walletId = this.getNodeParameter('walletId', i) as string;

					const requestBody: any = {};
					if (walletId) requestBody.walletId = walletId;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/balances/refresh`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: requestBody,
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});

		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}

async function executeKeysOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('ripplecustodyApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'listKeys': {
          const walletId = this.getNodeParameter('walletId', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          
          let url = `${credentials.baseUrl}/keys`;
          const params = new URLSearchParams();
          
          if (walletId) {
            params.append('walletId', walletId);
          }
          if (status) {
            params.append('status', status);
          }
          
          if (params.toString()) {
            url += `?${params.toString()}`;
          }

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'generateKey': {
          const algorithm = this.getNodeParameter('algorithm', i) as string;
          const curve = this.getNodeParameter('curve', i) as string;
          const walletId = this.getNodeParameter('walletId', i) as string;

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/keys`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            body: {
              algorithm,
              curve,
              walletId
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getKey': {
          const keyId = this.getNodeParameter('keyId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/keys/${keyId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'rotateKey': {
          const keyId = this.getNodeParameter('keyId', i) as string;

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/keys/${keyId}/rotate`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deleteKey': {
          const keyId = this.getNodeParameter('keyId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/keys/${keyId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json'
            },
            json: true
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({
          json: { error: error.message },
          pairedItem: { item: i }
        });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executePoliciesOperations(
  this: IExecuteFunctions,
  items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
  const returnData: INodeExecutionData[] = [];
  const operation = this.getNodeParameter('operation', 0) as string;
  const credentials = await this.getCredentials('ripplecustodyApi') as any;

  for (let i = 0; i < items.length; i++) {
    try {
      let result: any;

      switch (operation) {
        case 'listPolicies': {
          const type = this.getNodeParameter('type', i) as string;
          const status = this.getNodeParameter('status', i) as string;
          
          let url = `${credentials.baseUrl}/policies`;
          const params = new URLSearchParams();
          if (type) params.append('type', type);
          if (status) params.append('status', status);
          if (params.toString()) url += `?${params.toString()}`;

          const options: any = {
            method: 'GET',
            url,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'createPolicy': {
          const name = this.getNodeParameter('name', i) as string;
          const rules = this.getNodeParameter('rules', i) as string;
          const approvers = this.getNodeParameter('approvers', i) as string;

          let parsedRules: any;
          try {
            parsedRules = JSON.parse(rules);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), 'Invalid JSON in rules parameter');
          }

          const body = {
            name,
            rules: parsedRules,
            approvers: approvers.split(',').map((id: string) => id.trim()),
          };

          const options: any = {
            method: 'POST',
            url: `${credentials.baseUrl}/policies`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'getPolicy': {
          const policyId = this.getNodeParameter('policyId', i) as string;

          const options: any = {
            method: 'GET',
            url: `${credentials.baseUrl}/policies/${policyId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'updatePolicy': {
          const policyId = this.getNodeParameter('policyId', i) as string;
          const rules = this.getNodeParameter('rules', i) as string;

          let parsedRules: any;
          try {
            parsedRules = JSON.parse(rules);
          } catch (error: any) {
            throw new NodeOperationError(this.getNode(), 'Invalid JSON in rules parameter');
          }

          const body = {
            rules: parsedRules,
          };

          const options: any = {
            method: 'PUT',
            url: `${credentials.baseUrl}/policies/${policyId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            body,
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        case 'deletePolicy': {
          const policyId = this.getNodeParameter('policyId', i) as string;

          const options: any = {
            method: 'DELETE',
            url: `${credentials.baseUrl}/policies/${policyId}`,
            headers: {
              'Authorization': `Bearer ${credentials.apiKey}`,
              'Content-Type': 'application/json',
            },
            json: true,
          };

          result = await this.helpers.httpRequest(options) as any;
          break;
        }

        default:
          throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
      }

      returnData.push({ json: result, pairedItem: { item: i } });
    } catch (error: any) {
      if (this.continueOnFail()) {
        returnData.push({ json: { error: error.message }, pairedItem: { item: i } });
      } else {
        throw error;
      }
    }
  }

  return returnData;
}

async function executeApprovalsOperations(
	this: IExecuteFunctions,
	items: INodeExecutionData[],
): Promise<INodeExecutionData[]> {
	const returnData: INodeExecutionData[] = [];
	const operation = this.getNodeParameter('operation', 0) as string;
	const credentials = await this.getCredentials('ripplecustodyApi') as any;

	for (let i = 0; i < items.length; i++) {
		try {
			let result: any;

			switch (operation) {
				case 'listApprovals': {
					const status = this.getNodeParameter('status', i) as string;
					const walletId = this.getNodeParameter('walletId', i) as string;
					const limit = this.getNodeParameter('limit', i) as number;

					const params: any = {};
					if (status) params.status = status;
					if (walletId) params.walletId = walletId;
					if (limit) params.limit = limit;

					const queryString = new URLSearchParams(params).toString();
					const url = `${credentials.baseUrl}/approvals${queryString ? `?${queryString}` : ''}`;

					const options: any = {
						method: 'GET',
						url,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'approveTransaction': {
					const approvalId = this.getNodeParameter('approvalId', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/approvals/${approvalId}/approve`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'rejectTransaction': {
					const approvalId = this.getNodeParameter('approvalId', i) as string;
					const reason = this.getNodeParameter('reason', i) as string;

					const options: any = {
						method: 'POST',
						url: `${credentials.baseUrl}/approvals/${approvalId}/reject`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						body: {
							reason,
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				case 'getApproval': {
					const approvalId = this.getNodeParameter('approvalId', i) as string;

					const options: any = {
						method: 'GET',
						url: `${credentials.baseUrl}/approvals/${approvalId}`,
						headers: {
							'Authorization': `Bearer ${credentials.apiKey}`,
							'Content-Type': 'application/json',
						},
						json: true,
					};

					result = await this.helpers.httpRequest(options) as any;
					break;
				}

				default:
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`);
			}

			returnData.push({
				json: result,
				pairedItem: { item: i },
			});
		} catch (error: any) {
			if (this.continueOnFail()) {
				returnData.push({
					json: { error: error.message },
					pairedItem: { item: i },
				});
			} else {
				throw error;
			}
		}
	}

	return returnData;
}
