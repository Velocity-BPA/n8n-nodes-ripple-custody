/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as crypto from 'crypto';
import { ethers } from 'ethers';

export interface SigningRequest {
	id: string;
	type: 'transaction' | 'message' | 'typedData';
	blockchain: string;
	data: string;
	requester: string;
	approvers: string[];
	status: 'pending' | 'approved' | 'rejected' | 'signed';
	createdAt: string;
	expiresAt: string;
}

export interface Signature {
	r: string;
	s: string;
	v: number;
	serialized: string;
}

/**
 * Prepare transaction for signing
 */
export function prepareTransactionForSigning(
	to: string,
	value: string,
	data: string,
	chainId: number,
	nonce: number,
	gasLimit: string,
	maxFeePerGas?: string,
	maxPriorityFeePerGas?: string,
): string {
	const tx: ethers.TransactionLike = {
		to,
		value: ethers.parseEther(value),
		data,
		chainId,
		nonce,
		gasLimit: BigInt(gasLimit),
		type: 2, // EIP-1559
		maxFeePerGas: maxFeePerGas ? ethers.parseUnits(maxFeePerGas, 'gwei') : undefined,
		maxPriorityFeePerGas: maxPriorityFeePerGas ? ethers.parseUnits(maxPriorityFeePerGas, 'gwei') : undefined,
	};

	return ethers.Transaction.from(tx).unsignedSerialized;
}

/**
 * Create EIP-712 typed data hash
 */
export function createTypedDataHash(
	domain: {
		name: string;
		version: string;
		chainId: number;
		verifyingContract: string;
	},
	types: Record<string, Array<{ name: string; type: string }>>,
	value: Record<string, unknown>,
): string {
	return ethers.TypedDataEncoder.hash(domain, types, value);
}

/**
 * Create personal message hash (EIP-191)
 */
export function createPersonalMessageHash(message: string): string {
	return ethers.hashMessage(message);
}

/**
 * Verify ECDSA signature
 */
export function verifySignature(
	message: string,
	signature: string,
	expectedAddress: string,
): boolean {
	try {
		const recoveredAddress = ethers.verifyMessage(message, signature);
		return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
	} catch {
		return false;
	}
}

/**
 * Verify typed data signature (EIP-712)
 */
export function verifyTypedDataSignature(
	domain: {
		name: string;
		version: string;
		chainId: number;
		verifyingContract: string;
	},
	types: Record<string, Array<{ name: string; type: string }>>,
	value: Record<string, unknown>,
	signature: string,
	expectedAddress: string,
): boolean {
	try {
		const recoveredAddress = ethers.verifyTypedData(domain, types, value, signature);
		return recoveredAddress.toLowerCase() === expectedAddress.toLowerCase();
	} catch {
		return false;
	}
}

/**
 * Recover signer address from signature
 */
export function recoverAddress(digest: string, signature: string): string {
	return ethers.recoverAddress(digest, signature);
}

/**
 * Split signature into r, s, v components
 */
export function splitSignature(signature: string): Signature {
	const sig = ethers.Signature.from(signature);
	return {
		r: sig.r,
		s: sig.s,
		v: sig.v,
		serialized: sig.serialized,
	};
}

/**
 * Join signature components into serialized signature
 */
export function joinSignature(r: string, s: string, v: number): string {
	return ethers.Signature.from({ r, s, v }).serialized;
}

/**
 * Generate signing request ID
 */
export function generateSigningRequestId(): string {
	return `sr-${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
}

/**
 * Validate signing request hasn't expired
 */
export function isSigningRequestValid(request: SigningRequest): boolean {
	if (request.status !== 'pending') {
		return false;
	}
	return new Date(request.expiresAt).getTime() > Date.now();
}

/**
 * Calculate signing quorum
 */
export function calculateQuorum(
	totalApprovers: number,
	threshold: number,
	currentApprovals: number,
): { required: number; current: number; met: boolean } {
	const required = Math.min(threshold, totalApprovers);
	return {
		required,
		current: currentApprovals,
		met: currentApprovals >= required,
	};
}

/**
 * Create message hash for Bitcoin transaction signing
 */
export function createBitcoinSighash(
	prevTxHash: string,
	outputIndex: number,
	scriptPubKey: string,
	value: bigint,
	hashType = 0x01, // SIGHASH_ALL
): string {
	// Simplified - actual implementation would follow BIP-143
	const data = `${prevTxHash}${outputIndex}${scriptPubKey}${value.toString()}${hashType}`;
	return crypto.createHash('sha256').update(crypto.createHash('sha256').update(data).digest()).digest('hex');
}

/**
 * Create XRP transaction hash for signing
 */
export function createXrpTransactionHash(
	account: string,
	destination: string,
	amount: string,
	fee: string,
	sequence: number,
): string {
	// Simplified - actual implementation would follow XRP serialization
	const data = `${account}${destination}${amount}${fee}${sequence}`;
	return crypto.createHash('sha512').update(data).digest('hex').substring(0, 64);
}

/**
 * Serialize signature for specific blockchain
 */
export function serializeSignature(
	signature: Signature,
	blockchain: string,
): string {
	switch (blockchain) {
		case 'ethereum':
		case 'polygon':
		case 'avalanche':
		case 'arbitrum':
		case 'optimism':
		case 'base':
		case 'binance':
			return signature.serialized;
		case 'bitcoin':
			// DER encoding for Bitcoin
			return encodeDerSignature(signature.r, signature.s);
		default:
			return signature.serialized;
	}
}

/**
 * Encode signature in DER format (for Bitcoin)
 */
function encodeDerSignature(r: string, s: string): string {
	const rBuf = Buffer.from(r.replace('0x', ''), 'hex');
	const sBuf = Buffer.from(s.replace('0x', ''), 'hex');

	// Add leading zero if high bit is set
	const rPadded = rBuf[0] & 0x80 ? Buffer.concat([Buffer.from([0]), rBuf]) : rBuf;
	const sPadded = sBuf[0] & 0x80 ? Buffer.concat([Buffer.from([0]), sBuf]) : sBuf;

	const sequence = Buffer.concat([
		Buffer.from([0x02, rPadded.length]),
		rPadded,
		Buffer.from([0x02, sPadded.length]),
		sPadded,
	]);

	return Buffer.concat([Buffer.from([0x30, sequence.length]), sequence]).toString('hex');
}
