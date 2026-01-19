/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Ripple Custody API Endpoints
 * Based on Metaco Harmonize API structure
 */

export const ENVIRONMENTS = {
	production: 'https://api.ripple-custody.com',
	sandbox: 'https://sandbox-api.ripple-custody.com',
} as const;

export const API_VERSION = 'v1';

export const ENDPOINTS = {
	// System Endpoints (grouped)
	SYSTEM: {
		HEALTH: '/health',
		STATUS: '/status',
		VERSION: '/version',
		FEATURES: '/features',
		RATE_LIMITS: '/rate-limits',
		TEST: '/test',
		AUDIT: '/audit',
	},

	// Vault Endpoints (grouped)
	VAULTS: {
		BASE: '/vaults',
		BY_ID: (id: string) => `/vaults/${id}`,
		BALANCE: (id: string) => `/vaults/${id}/balance`,
		ADDRESSES: (id: string) => `/vaults/${id}/addresses`,
		TRANSACTIONS: (id: string) => `/vaults/${id}/transactions`,
		POLICIES: (id: string) => `/vaults/${id}/policies`,
		LOCK: (id: string) => `/vaults/${id}/lock`,
		UNLOCK: (id: string) => `/vaults/${id}/unlock`,
		AUDIT: (id: string) => `/vaults/${id}/audit`,
	},

	// Wallet Endpoints (grouped)
	WALLETS: {
		BASE: '/wallets',
		BY_ID: (id: string) => `/wallets/${id}`,
		BALANCE: (id: string) => `/wallets/${id}/balance`,
		ADDRESSES: (id: string) => `/wallets/${id}/addresses`,
		TRANSACTIONS: (id: string) => `/wallets/${id}/transactions`,
		EXPORT: (id: string) => `/wallets/${id}/export`,
		POLICIES: (id: string) => `/wallets/${id}/policies`,
	},

	// Address Endpoints (grouped)
	ADDRESSES: {
		BASE: '/addresses',
		BY_ID: (id: string) => `/addresses/${id}`,
		BALANCE: (id: string) => `/addresses/${id}/balance`,
		TRANSACTIONS: (id: string) => `/addresses/${id}/transactions`,
		VALIDATE: '/addresses/validate',
		VERIFY: (id: string) => `/addresses/${id}/verify`,
	},

	// Transaction Endpoints (grouped)
	TRANSACTIONS: {
		BASE: '/transactions',
		BY_ID: (id: string) => `/transactions/${id}`,
		SUBMIT: '/transactions/submit',
		STATUS: (id: string) => `/transactions/${id}/status`,
		CANCEL: (id: string) => `/transactions/${id}/cancel`,
		RETRY: (id: string) => `/transactions/${id}/retry`,
		RECEIPT: (id: string) => `/transactions/${id}/receipt`,
		FEE: '/transactions/fee',
		ESTIMATE: '/transactions/estimate',
	},

	// Transfer Endpoints (grouped)
	TRANSFERS: {
		BASE: '/transfers',
		BY_ID: (id: string) => `/transfers/${id}`,
		STATUS: (id: string) => `/transfers/${id}/status`,
		CANCEL: (id: string) => `/transfers/${id}/cancel`,
		CONFIRM: (id: string) => `/transfers/${id}/confirm`,
		RECEIPT: (id: string) => `/transfers/${id}/receipt`,
		SCHEDULE: '/transfers/schedule',
		RECURRING: '/transfers/recurring',
	},

	// Signing Endpoints (grouped)
	SIGNING: {
		BASE: '/signing',
		BY_ID: (id: string) => `/signing/${id}`,
		APPROVE: (id: string) => `/signing/${id}/approve`,
		REJECT: (id: string) => `/signing/${id}/reject`,
		STATUS: (id: string) => `/signing/${id}/status`,
		MULTI: '/signing/multi',
		QUORUM: '/signing/quorum',
	},

	// Policy Endpoints (grouped)
	POLICIES: {
		BASE: '/policies',
		BY_ID: (id: string) => `/policies/${id}`,
		RULES: (id: string) => `/policies/${id}/rules`,
		WORKFLOW: (id: string) => `/policies/${id}/workflow`,
		LIMITS: (id: string) => `/policies/${id}/limits`,
		WHITELIST: (id: string) => `/policies/${id}/whitelist`,
		BLACKLIST: (id: string) => `/policies/${id}/blacklist`,
		VALIDATE: '/policies/validate',
	},

	// Token Endpoints (grouped)
	TOKENS: {
		BASE: '/tokens',
		BY_ID: (id: string) => `/tokens/${id}`,
		MINT: (id: string) => `/tokens/${id}/mint`,
		BURN: (id: string) => `/tokens/${id}/burn`,
		TRANSFER: (id: string) => `/tokens/${id}/transfer`,
		METADATA: (id: string) => `/tokens/${id}/metadata`,
		HOLDERS: (id: string) => `/tokens/${id}/holders`,
		SUPPLY: (id: string) => `/tokens/${id}/supply`,
		HISTORY: (id: string) => `/tokens/${id}/history`,
		DEPLOY: '/tokens/deploy',
		PAUSE: (id: string) => `/tokens/${id}/pause`,
		RESUME: (id: string) => `/tokens/${id}/resume`,
	},

	// Smart Contract Endpoints (grouped)
	CONTRACTS: {
		BASE: '/contracts',
		BY_ID: (id: string) => `/contracts/${id}`,
		DEPLOY: '/contracts/deploy',
		CALL: (id: string) => `/contracts/${id}/call`,
		EXECUTE: (id: string) => `/contracts/${id}/execute`,
		STATE: (id: string) => `/contracts/${id}/state`,
		EVENTS: (id: string) => `/contracts/${id}/events`,
		ABI: (id: string) => `/contracts/${id}/abi`,
		VERIFY: (id: string) => `/contracts/${id}/verify`,
		UPGRADE: (id: string) => `/contracts/${id}/upgrade`,
		PAUSE: (id: string) => `/contracts/${id}/pause`,
		GAS: '/contracts/gas',
	},

	// Staking Endpoints (grouped)
	STAKING: {
		BASE: '/staking',
		POSITIONS: '/staking/positions',
		BY_ID: (id: string) => `/staking/${id}`,
		STAKE: '/staking/stake',
		UNSTAKE: '/staking/unstake',
		REWARDS: '/staking/rewards',
		CLAIM: '/staking/claim',
		VALIDATORS: '/staking/validators',
		DELEGATE: '/staking/delegate',
		UNDELEGATE: '/staking/undelegate',
		REDELEGATE: '/staking/redelegate',
		APY: '/staking/apy',
		HISTORY: '/staking/history',
		QUEUE: '/staking/queue',
	},

	// DeFi Endpoints (grouped)
	DEFI: {
		BASE: '/defi',
		BY_ID: (id: string) => `/defi/${id}`,
		CONNECT: '/defi/connect',
		DISCONNECT: (id: string) => `/defi/${id}/disconnect`,
		DAPPS: '/defi/dapps',
		EXECUTE: '/defi/execute',
		PROTOCOLS: '/defi/protocols',
		POSITIONS: '/defi/positions',
		LIQUIDITY: '/defi/liquidity',
		ADD_LIQUIDITY: '/defi/liquidity/add',
		REMOVE_LIQUIDITY: '/defi/liquidity/remove',
		SWAP: '/defi/swap',
		YIELD: '/defi/yield',
		HARVEST: '/defi/harvest',
		ANALYTICS: '/defi/analytics',
	},

	// Trading Endpoints (grouped)
	TRADING: {
		BASE: '/trading',
		PAIRS: '/trading/pairs',
		ORDERS: '/trading/orders',
		ORDER: (id: string) => `/trading/orders/${id}`,
		SUBMIT: '/trading/orders/submit',
		CANCEL: (id: string) => `/trading/orders/${id}/cancel`,
		HISTORY: '/trading/history',
		ORDERBOOK: '/trading/orderbook',
		EXECUTION: (id: string) => `/trading/executions/${id}`,
		EXCHANGE: '/trading/exchange',
		EXCHANGE_CONNECT: '/trading/exchange/connect',
		EXCHANGE_DISCONNECT: (id: string) => `/trading/exchange/${id}/disconnect`,
		BALANCES: '/trading/balances',
		WITHDRAW: '/trading/withdraw',
		DEPOSIT: '/trading/deposit',
	},

	// Settlement Endpoints (grouped)
	SETTLEMENTS: {
		BASE: '/settlements',
		BY_ID: (id: string) => `/settlements/${id}`,
		INITIATE: '/settlements/initiate',
		CONFIRM: (id: string) => `/settlements/${id}/confirm`,
		STATUS: (id: string) => `/settlements/${id}/status`,
		NETWORK: '/settlements/network',
		DVP: (id: string) => `/settlements/${id}/dvp`,
		INSTRUCTIONS: (id: string) => `/settlements/${id}/instructions`,
		EXPORT: '/settlements/export',
	},

	// Custody Endpoints (grouped)
	CUSTODY: {
		BASE: '/custody',
		ACCOUNTS: '/custody/accounts',
		ACCOUNT: (id: string) => `/custody/accounts/${id}`,
		BY_ID: (id: string) => `/custody/accounts/${id}`,
		SUB_ACCOUNTS: (id: string) => `/custody/accounts/${id}/sub-accounts`,
		TRANSFER: '/custody/transfer',
		STATEMENT: (id: string) => `/custody/accounts/${id}/statement`,
		FEES: '/custody/fees',
		SCHEDULE: '/custody/fee-schedule',
		AUDIT: '/custody/audit',
		REGULATORY: '/custody/regulatory',
	},

	// Key Management Endpoints (grouped)
	KEYS: {
		BASE: '/keys',
		BY_ID: (id: string) => `/keys/${id}`,
		GENERATE: '/keys/generate',
		IMPORT: '/keys/import',
		EXPORT: (id: string) => `/keys/${id}/export`,
		ROTATE: (id: string) => `/keys/${id}/rotate`,
		ARCHIVE: (id: string) => `/keys/${id}/archive`,
		SHARES: (id: string) => `/keys/${id}/shares`,
		RECONSTRUCT: (id: string) => `/keys/${id}/reconstruct`,
		CEREMONY: '/keys/ceremony',
		HSM_STATUS: '/keys/hsm/status',
		USAGE: (id: string) => `/keys/${id}/usage`,
	},

	// Cold Storage Endpoints (grouped)
	COLD_STORAGE: {
		BASE: '/cold-storage',
		VAULTS: '/cold-storage/vaults',
		BY_ID: (id: string) => `/cold-storage/${id}`,
		MOVE_IN: '/cold-storage/move',
		MOVE_OUT: '/cold-storage/move-out',
		BALANCE: (id: string) => `/cold-storage/${id}/balance`,
		SCHEDULE: '/cold-storage/schedule',
		SCHEDULED: '/cold-storage/scheduled',
		OSO: '/cold-storage/oso',
		OSO_INITIATE: '/cold-storage/oso/initiate',
		OSO_COMPLETE: '/cold-storage/oso/complete',
	},

	// Asset Endpoints (grouped)
	ASSETS: {
		BASE: '/assets',
		SUPPORTED: '/assets/supported',
		BY_ID: (id: string) => `/assets/${id}`,
		PRICE: (id: string) => `/assets/${id}/price`,
		BALANCE: (id: string) => `/assets/${id}/balance`,
		HISTORY: (id: string) => `/assets/${id}/history`,
		CUSTOM: '/assets/custom',
		METADATA: (id: string) => `/assets/${id}/metadata`,
		CHAINS: (id: string) => `/assets/${id}/chains`,
		TOKEN: (id: string) => `/assets/${id}/token`,
		TOKEN_INFO: (id: string) => `/assets/${id}/token`,
		NFT: (id: string) => `/assets/${id}/nft`,
		NFT_INFO: (id: string) => `/assets/${id}/nft`,
	},

	// Blockchain Endpoints (grouped)
	BLOCKCHAINS: {
		BASE: '/blockchains',
		SUPPORTED: '/blockchains/supported',
		BY_ID: (id: string) => `/blockchains/${id}`,
		STATUS: (id: string) => `/blockchains/${id}/status`,
		HEIGHT: (id: string) => `/blockchains/${id}/height`,
		GAS: (id: string) => `/blockchains/${id}/gas`,
		FEE: (id: string) => `/blockchains/${id}/fee`,
		NODE: (id: string) => `/blockchains/${id}/node`,
		ANALYTICS: (id: string) => `/blockchains/${id}/analytics`,
		MEMPOOL: (id: string) => `/blockchains/${id}/mempool`,
	},

	// Compliance Endpoints (grouped)
	COMPLIANCE: {
		BASE: '/compliance',
		KYT: '/compliance/kyt',
		SCREEN: '/compliance/screen',
		SCREEN_ADDRESS: '/compliance/screen/address',
		SCREEN_TRANSACTION: '/compliance/screen/transaction',
		RISK: '/compliance/risk',
		RISK_SCORE: (address: string) => `/compliance/risk/${address}`,
		ALERTS: '/compliance/alerts',
		AML: '/compliance/aml',
		AML_REPORT: (address: string) => `/compliance/aml/${address}`,
		TRAVEL_RULE: '/compliance/travel-rule',
		SANCTIONS: '/compliance/sanctions',
		AUDIT: '/compliance/audit',
		FILINGS: '/compliance/filings',
	},

	// Reporting Endpoints (grouped)
	REPORTS: {
		BASE: '/reports',
		BY_ID: (id: string) => `/reports/${id}`,
		GENERATE: (id: string) => `/reports/${id}/generate`,
		SCHEDULE: (id: string) => `/reports/${id}/schedule`,
		SCHEDULED: '/reports/scheduled',
		DATA: (id: string) => `/reports/${id}/data`,
		POSITION: '/reports/position',
		TRANSACTION: '/reports/transaction',
		AUDIT: '/reports/audit',
		COMPLIANCE: '/reports/compliance',
		TAX: '/reports/tax',
		EXPORT: (id: string) => `/reports/${id}/export`,
		DASHBOARD: '/reports/dashboard',
	},

	// Webhook Endpoints (grouped)
	WEBHOOKS: {
		BASE: '/webhooks',
		BY_ID: (id: string) => `/webhooks/${id}`,
		EVENTS: '/webhooks/events',
		TEST: (id: string) => `/webhooks/${id}/test`,
		LOGS: (id: string) => `/webhooks/${id}/logs`,
		RETRY: (id: string) => `/webhooks/${id}/retry`,
	},

	// User Admin Endpoints (grouped)
	USERS: {
		BASE: '/users',
		BY_ID: (id: string) => `/users/${id}`,
		ROLES: '/users/roles',
		PERMISSIONS: '/users/permissions',
		PERMISSIONS_BY_ID: (id: string) => `/users/${id}/permissions`,
		ACTIVITY: (id: string) => `/users/${id}/activity`,
		SESSIONS: (id: string) => `/users/${id}/sessions`,
		SESSION: '/users/session',
		REVOKE: (id: string) => `/users/${id}/revoke`,
	},
} as const;

export const WEBSOCKET_ENDPOINTS = {
	events: '/ws/events',
	transactions: '/ws/transactions',
	transfers: '/ws/transfers',
	signing: '/ws/signing',
	compliance: '/ws/compliance',
} as const;
