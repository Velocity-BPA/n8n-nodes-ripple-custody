/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import * as crypto from 'crypto';

/**
 * Generate HMAC signature for API request authentication
 */
export function generateHmacSignature(
	apiSecret: string,
	timestamp: string,
	method: string,
	path: string,
	body?: string,
): string {
	const message = `${timestamp}${method.toUpperCase()}${path}${body || ''}`;
	return crypto.createHmac('sha256', apiSecret).update(message).digest('hex');
}

/**
 * Generate API request timestamp
 */
export function generateTimestamp(): string {
	return Math.floor(Date.now() / 1000).toString();
}

/**
 * Validate API key format
 */
export function isValidApiKey(apiKey: string): boolean {
	// API keys should be 32-64 characters, alphanumeric with dashes
	return /^[A-Za-z0-9-]{32,64}$/.test(apiKey);
}

/**
 * Validate tenant ID format
 */
export function isValidTenantId(tenantId: string): boolean {
	// Tenant IDs are typically UUIDs or alphanumeric strings
	return /^[A-Za-z0-9-]{8,64}$/.test(tenantId);
}

/**
 * Mask sensitive data for logging
 */
export function maskSensitiveData(data: string, visibleChars = 4): string {
	if (data.length <= visibleChars * 2) {
		return '*'.repeat(data.length);
	}
	return `${data.substring(0, visibleChars)}${'*'.repeat(data.length - visibleChars * 2)}${data.substring(data.length - visibleChars)}`;
}

/**
 * Parse and validate JWT token (without verification)
 */
export function parseJwtPayload(token: string): Record<string, unknown> | null {
	try {
		const parts = token.split('.');
		if (parts.length !== 3) {
			return null;
		}
		const payload = Buffer.from(parts[1], 'base64url').toString('utf-8');
		return JSON.parse(payload);
	} catch {
		return null;
	}
}

/**
 * Check if JWT token is expired
 */
export function isJwtExpired(token: string): boolean {
	const payload = parseJwtPayload(token);
	if (!payload || !payload.exp) {
		return true;
	}
	return (payload.exp as number) * 1000 < Date.now();
}

/**
 * Generate a secure random string
 */
export function generateSecureRandom(length = 32): string {
	return crypto.randomBytes(length).toString('hex');
}

/**
 * Hash data using SHA-256
 */
export function sha256Hash(data: string): string {
	return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Generate nonce for request signing
 */
export function generateNonce(): string {
	return `${Date.now()}-${crypto.randomBytes(8).toString('hex')}`;
}
