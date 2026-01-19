/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Token standards and smart contract interfaces for Ripple Custody
 */

export interface TokenStandard {
	id: string;
	name: string;
	blockchain: string[];
	type: 'fungible' | 'non-fungible' | 'semi-fungible';
	description: string;
	features: string[];
}

export const TOKEN_STANDARDS: Record<string, TokenStandard> = {
	// Ethereum Standards
	ERC20: {
		id: 'erc20',
		name: 'ERC-20',
		blockchain: ['ethereum', 'polygon', 'avalanche', 'arbitrum', 'optimism', 'base', 'binance', 'fantom'],
		type: 'fungible',
		description: 'Standard interface for fungible tokens',
		features: ['transfer', 'approve', 'allowance', 'balanceOf', 'totalSupply'],
	},
	ERC721: {
		id: 'erc721',
		name: 'ERC-721',
		blockchain: ['ethereum', 'polygon', 'avalanche', 'arbitrum', 'optimism', 'base', 'binance', 'fantom'],
		type: 'non-fungible',
		description: 'Standard interface for non-fungible tokens (NFTs)',
		features: ['ownerOf', 'safeTransferFrom', 'approve', 'setApprovalForAll', 'tokenURI'],
	},
	ERC1155: {
		id: 'erc1155',
		name: 'ERC-1155',
		blockchain: ['ethereum', 'polygon', 'avalanche', 'arbitrum', 'optimism', 'base', 'binance', 'fantom'],
		type: 'semi-fungible',
		description: 'Multi-token standard supporting both fungible and non-fungible tokens',
		features: ['safeTransferFrom', 'safeBatchTransferFrom', 'balanceOf', 'balanceOfBatch', 'uri'],
	},
	ERC4626: {
		id: 'erc4626',
		name: 'ERC-4626',
		blockchain: ['ethereum', 'polygon', 'avalanche', 'arbitrum', 'optimism'],
		type: 'fungible',
		description: 'Tokenized vault standard for yield-bearing tokens',
		features: ['deposit', 'withdraw', 'redeem', 'mint', 'convertToShares', 'convertToAssets'],
	},

	// Solana Standards
	SPL: {
		id: 'spl',
		name: 'SPL Token',
		blockchain: ['solana'],
		type: 'fungible',
		description: 'Solana Program Library token standard',
		features: ['transfer', 'approve', 'burn', 'mint', 'freeze'],
	},
	METAPLEX: {
		id: 'metaplex',
		name: 'Metaplex NFT',
		blockchain: ['solana'],
		type: 'non-fungible',
		description: 'Metaplex NFT standard for Solana',
		features: ['create', 'update', 'transfer', 'burn', 'verify'],
	},

	// Cardano Standards
	CARDANO_NATIVE: {
		id: 'cardano-native',
		name: 'Cardano Native Token',
		blockchain: ['cardano'],
		type: 'fungible',
		description: 'Native tokens on Cardano blockchain',
		features: ['mint', 'burn', 'transfer'],
	},
	CIP25: {
		id: 'cip25',
		name: 'CIP-25 NFT',
		blockchain: ['cardano'],
		type: 'non-fungible',
		description: 'Cardano NFT metadata standard',
		features: ['mint', 'transfer', 'metadata'],
	},

	// Polkadot Standards
	PSP22: {
		id: 'psp22',
		name: 'PSP-22',
		blockchain: ['polkadot'],
		type: 'fungible',
		description: 'Polkadot fungible token standard',
		features: ['transfer', 'approve', 'allowance', 'balanceOf'],
	},
	PSP34: {
		id: 'psp34',
		name: 'PSP-34',
		blockchain: ['polkadot'],
		type: 'non-fungible',
		description: 'Polkadot NFT standard',
		features: ['ownerOf', 'transfer', 'approve'],
	},

	// Cosmos Standards
	CW20: {
		id: 'cw20',
		name: 'CW-20',
		blockchain: ['cosmos'],
		type: 'fungible',
		description: 'CosmWasm fungible token standard',
		features: ['transfer', 'send', 'burn', 'mint', 'allowance'],
	},
	CW721: {
		id: 'cw721',
		name: 'CW-721',
		blockchain: ['cosmos'],
		type: 'non-fungible',
		description: 'CosmWasm NFT standard',
		features: ['transferNft', 'sendNft', 'approve', 'revoke'],
	},

	// TRON Standards
	TRC20: {
		id: 'trc20',
		name: 'TRC-20',
		blockchain: ['tron'],
		type: 'fungible',
		description: 'TRON fungible token standard',
		features: ['transfer', 'approve', 'allowance', 'balanceOf'],
	},
	TRC721: {
		id: 'trc721',
		name: 'TRC-721',
		blockchain: ['tron'],
		type: 'non-fungible',
		description: 'TRON NFT standard',
		features: ['ownerOf', 'safeTransferFrom', 'approve'],
	},

	// Algorand Standards
	ASA: {
		id: 'asa',
		name: 'Algorand Standard Asset',
		blockchain: ['algorand'],
		type: 'fungible',
		description: 'Algorand Standard Asset for fungible tokens',
		features: ['transfer', 'freeze', 'clawback', 'optIn'],
	},
	ARC3: {
		id: 'arc3',
		name: 'ARC-3 NFT',
		blockchain: ['algorand'],
		type: 'non-fungible',
		description: 'Algorand NFT metadata standard',
		features: ['transfer', 'metadata', 'optIn'],
	},

	// Stellar Standards
	STELLAR_ASSET: {
		id: 'stellar-asset',
		name: 'Stellar Asset',
		blockchain: ['stellar'],
		type: 'fungible',
		description: 'Stellar native asset',
		features: ['payment', 'trustline', 'claimableBalance'],
	},

	// XRP Ledger Standards
	XRPL_TOKEN: {
		id: 'xrpl-token',
		name: 'XRPL Token',
		blockchain: ['xrp'],
		type: 'fungible',
		description: 'XRP Ledger issued currency',
		features: ['payment', 'trustLine', 'rippling'],
	},
	XRPL_NFT: {
		id: 'xrpl-nft',
		name: 'XRPL NFToken',
		blockchain: ['xrp'],
		type: 'non-fungible',
		description: 'XRP Ledger native NFT standard',
		features: ['mint', 'burn', 'createOffer', 'acceptOffer'],
	},
} as const;

export const TOKEN_STANDARD_OPTIONS = Object.values(TOKEN_STANDARDS).map((standard) => ({
	name: `${standard.name} (${standard.blockchain.join(', ')})`,
	value: standard.id,
}));

export const FUNGIBLE_STANDARDS = Object.values(TOKEN_STANDARDS)
	.filter((s) => s.type === 'fungible')
	.map((s) => s.id);

export const NFT_STANDARDS = Object.values(TOKEN_STANDARDS)
	.filter((s) => s.type === 'non-fungible' || s.type === 'semi-fungible')
	.map((s) => s.id);

export const getStandardsForBlockchain = (blockchain: string): TokenStandard[] => {
	return Object.values(TOKEN_STANDARDS).filter((s) => s.blockchain.includes(blockchain));
};
