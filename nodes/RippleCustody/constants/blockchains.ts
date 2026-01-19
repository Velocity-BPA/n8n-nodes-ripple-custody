/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Supported blockchains in Ripple Custody
 */

export interface BlockchainInfo {
	id: string;
	name: string;
	symbol: string;
	type: 'evm' | 'utxo' | 'account' | 'substrate' | 'other';
	testnet?: string;
	explorer?: string;
	nativeAsset: string;
	decimals: number;
	supportsSmartContracts: boolean;
	supportsStaking: boolean;
	supportsNft: boolean;
}

export const BLOCKCHAINS: Record<string, BlockchainInfo> = {
	bitcoin: {
		id: 'bitcoin',
		name: 'Bitcoin',
		symbol: 'BTC',
		type: 'utxo',
		testnet: 'testnet',
		explorer: 'https://blockstream.info',
		nativeAsset: 'BTC',
		decimals: 8,
		supportsSmartContracts: false,
		supportsStaking: false,
		supportsNft: false,
	},
	ethereum: {
		id: 'ethereum',
		name: 'Ethereum',
		symbol: 'ETH',
		type: 'evm',
		testnet: 'sepolia',
		explorer: 'https://etherscan.io',
		nativeAsset: 'ETH',
		decimals: 18,
		supportsSmartContracts: true,
		supportsStaking: true,
		supportsNft: true,
	},
	xrp: {
		id: 'xrp',
		name: 'XRP Ledger',
		symbol: 'XRP',
		type: 'account',
		testnet: 'testnet',
		explorer: 'https://livenet.xrpl.org',
		nativeAsset: 'XRP',
		decimals: 6,
		supportsSmartContracts: false,
		supportsStaking: false,
		supportsNft: true,
	},
	polygon: {
		id: 'polygon',
		name: 'Polygon',
		symbol: 'MATIC',
		type: 'evm',
		testnet: 'mumbai',
		explorer: 'https://polygonscan.com',
		nativeAsset: 'MATIC',
		decimals: 18,
		supportsSmartContracts: true,
		supportsStaking: true,
		supportsNft: true,
	},
	avalanche: {
		id: 'avalanche',
		name: 'Avalanche',
		symbol: 'AVAX',
		type: 'evm',
		testnet: 'fuji',
		explorer: 'https://snowtrace.io',
		nativeAsset: 'AVAX',
		decimals: 18,
		supportsSmartContracts: true,
		supportsStaking: true,
		supportsNft: true,
	},
	solana: {
		id: 'solana',
		name: 'Solana',
		symbol: 'SOL',
		type: 'account',
		testnet: 'devnet',
		explorer: 'https://explorer.solana.com',
		nativeAsset: 'SOL',
		decimals: 9,
		supportsSmartContracts: true,
		supportsStaking: true,
		supportsNft: true,
	},
	arbitrum: {
		id: 'arbitrum',
		name: 'Arbitrum One',
		symbol: 'ARB',
		type: 'evm',
		testnet: 'goerli',
		explorer: 'https://arbiscan.io',
		nativeAsset: 'ETH',
		decimals: 18,
		supportsSmartContracts: true,
		supportsStaking: false,
		supportsNft: true,
	},
	optimism: {
		id: 'optimism',
		name: 'Optimism',
		symbol: 'OP',
		type: 'evm',
		testnet: 'goerli',
		explorer: 'https://optimistic.etherscan.io',
		nativeAsset: 'ETH',
		decimals: 18,
		supportsSmartContracts: true,
		supportsStaking: false,
		supportsNft: true,
	},
	base: {
		id: 'base',
		name: 'Base',
		symbol: 'BASE',
		type: 'evm',
		testnet: 'goerli',
		explorer: 'https://basescan.org',
		nativeAsset: 'ETH',
		decimals: 18,
		supportsSmartContracts: true,
		supportsStaking: false,
		supportsNft: true,
	},
	binance: {
		id: 'binance',
		name: 'BNB Smart Chain',
		symbol: 'BNB',
		type: 'evm',
		testnet: 'testnet',
		explorer: 'https://bscscan.com',
		nativeAsset: 'BNB',
		decimals: 18,
		supportsSmartContracts: true,
		supportsStaking: true,
		supportsNft: true,
	},
	litecoin: {
		id: 'litecoin',
		name: 'Litecoin',
		symbol: 'LTC',
		type: 'utxo',
		testnet: 'testnet',
		explorer: 'https://litecoinspace.org',
		nativeAsset: 'LTC',
		decimals: 8,
		supportsSmartContracts: false,
		supportsStaking: false,
		supportsNft: false,
	},
	dogecoin: {
		id: 'dogecoin',
		name: 'Dogecoin',
		symbol: 'DOGE',
		type: 'utxo',
		testnet: 'testnet',
		explorer: 'https://dogechain.info',
		nativeAsset: 'DOGE',
		decimals: 8,
		supportsSmartContracts: false,
		supportsStaking: false,
		supportsNft: false,
	},
	cardano: {
		id: 'cardano',
		name: 'Cardano',
		symbol: 'ADA',
		type: 'account',
		testnet: 'preprod',
		explorer: 'https://cardanoscan.io',
		nativeAsset: 'ADA',
		decimals: 6,
		supportsSmartContracts: true,
		supportsStaking: true,
		supportsNft: true,
	},
	polkadot: {
		id: 'polkadot',
		name: 'Polkadot',
		symbol: 'DOT',
		type: 'substrate',
		testnet: 'westend',
		explorer: 'https://polkadot.subscan.io',
		nativeAsset: 'DOT',
		decimals: 10,
		supportsSmartContracts: true,
		supportsStaking: true,
		supportsNft: true,
	},
	cosmos: {
		id: 'cosmos',
		name: 'Cosmos Hub',
		symbol: 'ATOM',
		type: 'account',
		testnet: 'theta-testnet',
		explorer: 'https://www.mintscan.io/cosmos',
		nativeAsset: 'ATOM',
		decimals: 6,
		supportsSmartContracts: true,
		supportsStaking: true,
		supportsNft: false,
	},
	tron: {
		id: 'tron',
		name: 'TRON',
		symbol: 'TRX',
		type: 'account',
		testnet: 'shasta',
		explorer: 'https://tronscan.org',
		nativeAsset: 'TRX',
		decimals: 6,
		supportsSmartContracts: true,
		supportsStaking: true,
		supportsNft: true,
	},
	stellar: {
		id: 'stellar',
		name: 'Stellar',
		symbol: 'XLM',
		type: 'account',
		testnet: 'testnet',
		explorer: 'https://stellarchain.io',
		nativeAsset: 'XLM',
		decimals: 7,
		supportsSmartContracts: true,
		supportsStaking: false,
		supportsNft: false,
	},
	algorand: {
		id: 'algorand',
		name: 'Algorand',
		symbol: 'ALGO',
		type: 'account',
		testnet: 'testnet',
		explorer: 'https://algoexplorer.io',
		nativeAsset: 'ALGO',
		decimals: 6,
		supportsSmartContracts: true,
		supportsStaking: true,
		supportsNft: true,
	},
	near: {
		id: 'near',
		name: 'NEAR Protocol',
		symbol: 'NEAR',
		type: 'account',
		testnet: 'testnet',
		explorer: 'https://nearblocks.io',
		nativeAsset: 'NEAR',
		decimals: 24,
		supportsSmartContracts: true,
		supportsStaking: true,
		supportsNft: true,
	},
	fantom: {
		id: 'fantom',
		name: 'Fantom',
		symbol: 'FTM',
		type: 'evm',
		testnet: 'testnet',
		explorer: 'https://ftmscan.com',
		nativeAsset: 'FTM',
		decimals: 18,
		supportsSmartContracts: true,
		supportsStaking: true,
		supportsNft: true,
	},
} as const;

export const BLOCKCHAIN_OPTIONS = Object.values(BLOCKCHAINS).map((chain) => ({
	name: chain.name,
	value: chain.id,
}));

export const EVM_CHAINS = Object.values(BLOCKCHAINS)
	.filter((chain) => chain.type === 'evm')
	.map((chain) => chain.id);

export const STAKING_CHAINS = Object.values(BLOCKCHAINS)
	.filter((chain) => chain.supportsStaking)
	.map((chain) => chain.id);

export const NFT_CHAINS = Object.values(BLOCKCHAINS)
	.filter((chain) => chain.supportsNft)
	.map((chain) => chain.id);

export const SMART_CONTRACT_CHAINS = Object.values(BLOCKCHAINS)
	.filter((chain) => chain.supportsSmartContracts)
	.map((chain) => chain.id);
