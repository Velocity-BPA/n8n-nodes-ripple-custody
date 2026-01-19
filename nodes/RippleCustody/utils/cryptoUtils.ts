/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as crypto from 'crypto';
import { ethers } from 'ethers';

/**
 * Validate Ethereum address
 */
export function isValidEthereumAddress(address: string): boolean {
	return ethers.isAddress(address);
}

/**
 * Validate Bitcoin address (basic check)
 */
export function isValidBitcoinAddress(address: string): boolean {
	// P2PKH (starts with 1), P2SH (starts with 3), or Bech32 (starts with bc1)
	return /^[13][a-km-zA-HJ-NP-Z1-9]{25,34}$/.test(address) ||
		/^bc1[ac-hj-np-z02-9]{39,59}$/.test(address);
}

/**
 * Validate XRP address
 */
export function isValidXrpAddress(address: string): boolean {
	return /^r[1-9A-HJ-NP-Za-km-z]{24,34}$/.test(address);
}

/**
 * Validate Solana address
 */
export function isValidSolanaAddress(address: string): boolean {
	// Base58 encoded, 32-44 characters
	return /^[1-9A-HJ-NP-Za-km-z]{32,44}$/.test(address);
}

/**
 * Validate address for a given blockchain
 */
export function validateAddress(address: string, blockchain: string): boolean {
	switch (blockchain.toLowerCase()) {
		case 'ethereum':
		case 'polygon':
		case 'avalanche':
		case 'arbitrum':
		case 'optimism':
		case 'base':
		case 'binance':
		case 'fantom':
			return isValidEthereumAddress(address);
		case 'bitcoin':
		case 'litecoin':
		case 'dogecoin':
			return isValidBitcoinAddress(address);
		case 'xrp':
			return isValidXrpAddress(address);
		case 'solana':
			return isValidSolanaAddress(address);
		default:
			// For unknown blockchains, just check it's not empty
			return address.length > 0;
	}
}

/**
 * Checksum an Ethereum address
 */
export function checksumAddress(address: string): string {
	return ethers.getAddress(address);
}

/**
 * Convert hex string to bytes
 */
export function hexToBytes(hex: string): Uint8Array {
	const cleanHex = hex.startsWith('0x') ? hex.slice(2) : hex;
	return Uint8Array.from(Buffer.from(cleanHex, 'hex'));
}

/**
 * Convert bytes to hex string
 */
export function bytesToHex(bytes: Uint8Array, prefix = true): string {
	const hex = Buffer.from(bytes).toString('hex');
	return prefix ? `0x${hex}` : hex;
}

/**
 * Hash data using keccak256 (Ethereum style)
 */
export function keccak256(data: string | Uint8Array): string {
	return ethers.keccak256(typeof data === 'string' ? ethers.toUtf8Bytes(data) : data);
}

/**
 * Encode function call data for smart contract interaction
 */
export function encodeFunctionCall(abi: string[], functionName: string, params: unknown[]): string {
	const iface = new ethers.Interface(abi);
	return iface.encodeFunctionData(functionName, params);
}

/**
 * Decode function result from smart contract
 */
export function decodeFunctionResult(abi: string[], functionName: string, data: string): unknown[] {
	const iface = new ethers.Interface(abi);
	return Array.from(iface.decodeFunctionResult(functionName, data));
}

/**
 * Generate a deterministic wallet address from a seed
 */
export function deriveAddress(seed: string, path: string): { address: string; publicKey: string } {
	const hdNode = ethers.HDNodeWallet.fromSeed(ethers.toUtf8Bytes(seed));
	const derived = hdNode.derivePath(path);
	return {
		address: derived.address,
		publicKey: derived.publicKey,
	};
}

/**
 * Encrypt data using AES-256-GCM
 */
export function encryptAes256Gcm(data: string, key: Buffer): { encrypted: string; iv: string; tag: string } {
	const iv = crypto.randomBytes(12);
	const cipher = crypto.createCipheriv('aes-256-gcm', key, iv);
	let encrypted = cipher.update(data, 'utf8', 'hex');
	encrypted += cipher.final('hex');
	const tag = cipher.getAuthTag();
	return {
		encrypted,
		iv: iv.toString('hex'),
		tag: tag.toString('hex'),
	};
}

/**
 * Decrypt data using AES-256-GCM
 */
export function decryptAes256Gcm(encrypted: string, key: Buffer, iv: string, tag: string): string {
	const decipher = crypto.createDecipheriv('aes-256-gcm', key, Buffer.from(iv, 'hex'));
	decipher.setAuthTag(Buffer.from(tag, 'hex'));
	let decrypted = decipher.update(encrypted, 'hex', 'utf8');
	decrypted += decipher.final('utf8');
	return decrypted;
}

/**
 * Generate a key derivation using PBKDF2
 */
export function deriveKey(password: string, salt: Buffer, iterations = 100000, keyLength = 32): Buffer {
	return crypto.pbkdf2Sync(password, salt, iterations, keyLength, 'sha256');
}

/**
 * Convert wei to ether
 */
export function weiToEther(wei: string | bigint): string {
	return ethers.formatEther(wei);
}

/**
 * Convert ether to wei
 */
export function etherToWei(ether: string): bigint {
	return ethers.parseEther(ether);
}

/**
 * Format units for any token decimal
 */
export function formatUnits(value: string | bigint, decimals: number): string {
	return ethers.formatUnits(value, decimals);
}

/**
 * Parse units for any token decimal
 */
export function parseUnits(value: string, decimals: number): bigint {
	return ethers.parseUnits(value, decimals);
}
