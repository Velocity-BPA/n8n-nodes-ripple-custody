/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Asset definitions and configurations for Ripple Custody
 */

export interface AssetInfo {
	id: string;
	name: string;
	symbol: string;
	blockchain: string;
	type: 'native' | 'token' | 'nft' | 'stablecoin';
	contractAddress?: string;
	decimals: number;
	isStablecoin: boolean;
}

export const NATIVE_ASSETS: Record<string, AssetInfo> = {
	BTC: {
		id: 'btc',
		name: 'Bitcoin',
		symbol: 'BTC',
		blockchain: 'bitcoin',
		type: 'native',
		decimals: 8,
		isStablecoin: false,
	},
	ETH: {
		id: 'eth',
		name: 'Ethereum',
		symbol: 'ETH',
		blockchain: 'ethereum',
		type: 'native',
		decimals: 18,
		isStablecoin: false,
	},
	XRP: {
		id: 'xrp',
		name: 'XRP',
		symbol: 'XRP',
		blockchain: 'xrp',
		type: 'native',
		decimals: 6,
		isStablecoin: false,
	},
	SOL: {
		id: 'sol',
		name: 'Solana',
		symbol: 'SOL',
		blockchain: 'solana',
		type: 'native',
		decimals: 9,
		isStablecoin: false,
	},
	MATIC: {
		id: 'matic',
		name: 'Polygon',
		symbol: 'MATIC',
		blockchain: 'polygon',
		type: 'native',
		decimals: 18,
		isStablecoin: false,
	},
	AVAX: {
		id: 'avax',
		name: 'Avalanche',
		symbol: 'AVAX',
		blockchain: 'avalanche',
		type: 'native',
		decimals: 18,
		isStablecoin: false,
	},
	BNB: {
		id: 'bnb',
		name: 'BNB',
		symbol: 'BNB',
		blockchain: 'binance',
		type: 'native',
		decimals: 18,
		isStablecoin: false,
	},
	ADA: {
		id: 'ada',
		name: 'Cardano',
		symbol: 'ADA',
		blockchain: 'cardano',
		type: 'native',
		decimals: 6,
		isStablecoin: false,
	},
	DOT: {
		id: 'dot',
		name: 'Polkadot',
		symbol: 'DOT',
		blockchain: 'polkadot',
		type: 'native',
		decimals: 10,
		isStablecoin: false,
	},
	ATOM: {
		id: 'atom',
		name: 'Cosmos',
		symbol: 'ATOM',
		blockchain: 'cosmos',
		type: 'native',
		decimals: 6,
		isStablecoin: false,
	},
	LTC: {
		id: 'ltc',
		name: 'Litecoin',
		symbol: 'LTC',
		blockchain: 'litecoin',
		type: 'native',
		decimals: 8,
		isStablecoin: false,
	},
	DOGE: {
		id: 'doge',
		name: 'Dogecoin',
		symbol: 'DOGE',
		blockchain: 'dogecoin',
		type: 'native',
		decimals: 8,
		isStablecoin: false,
	},
};

export const STABLECOINS: Record<string, AssetInfo> = {
	USDT_ETH: {
		id: 'usdt-eth',
		name: 'Tether USD (Ethereum)',
		symbol: 'USDT',
		blockchain: 'ethereum',
		type: 'stablecoin',
		contractAddress: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
		decimals: 6,
		isStablecoin: true,
	},
	USDC_ETH: {
		id: 'usdc-eth',
		name: 'USD Coin (Ethereum)',
		symbol: 'USDC',
		blockchain: 'ethereum',
		type: 'stablecoin',
		contractAddress: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
		decimals: 6,
		isStablecoin: true,
	},
	DAI: {
		id: 'dai',
		name: 'Dai Stablecoin',
		symbol: 'DAI',
		blockchain: 'ethereum',
		type: 'stablecoin',
		contractAddress: '0x6B175474E89094C44Da98b954EesB9ef33DA5B36',
		decimals: 18,
		isStablecoin: true,
	},
	BUSD: {
		id: 'busd',
		name: 'Binance USD',
		symbol: 'BUSD',
		blockchain: 'ethereum',
		type: 'stablecoin',
		contractAddress: '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
		decimals: 18,
		isStablecoin: true,
	},
	USDC_SOL: {
		id: 'usdc-sol',
		name: 'USD Coin (Solana)',
		symbol: 'USDC',
		blockchain: 'solana',
		type: 'stablecoin',
		contractAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
		decimals: 6,
		isStablecoin: true,
	},
	USDC_MATIC: {
		id: 'usdc-matic',
		name: 'USD Coin (Polygon)',
		symbol: 'USDC',
		blockchain: 'polygon',
		type: 'stablecoin',
		contractAddress: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
		decimals: 6,
		isStablecoin: true,
	},
};

export const ALL_ASSETS = { ...NATIVE_ASSETS, ...STABLECOINS };

export const ASSET_OPTIONS = Object.values(ALL_ASSETS).map((asset) => ({
	name: `${asset.name} (${asset.symbol})`,
	value: asset.id,
}));

export const ASSET_TYPES = [
	{ name: 'Native Token', value: 'native' },
	{ name: 'Token (ERC-20, SPL, etc.)', value: 'token' },
	{ name: 'NFT', value: 'nft' },
	{ name: 'Stablecoin', value: 'stablecoin' },
] as const;
