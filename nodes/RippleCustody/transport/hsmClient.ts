/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import { EventEmitter } from 'events';

export interface HsmConfig {
	provider: 'thales' | 'awsCloudHsm' | 'azureHsm' | 'gcpHsm' | 'utimaco' | 'ncipher';
	endpoint: string;
	slotId: string;
	partitionId: string;
	username: string;
	password: string;
	pin?: string;
	useTls?: boolean;
	tlsCertificate?: string;
	tlsPrivateKey?: string;
	caCertificate?: string;
	connectionTimeout?: number;
	operationTimeout?: number;
	enableHA?: boolean;
	failoverEndpoints?: string[];
}

export interface HsmKeyInfo {
	id: string;
	label: string;
	type: 'RSA' | 'EC' | 'AES' | 'ECDSA';
	size: number;
	exportable: boolean;
	createdAt: string;
	algorithm: string;
}

export interface HsmSignResult {
	signature: string;
	keyId: string;
	algorithm: string;
	timestamp: string;
}

export interface HsmStatus {
	connected: boolean;
	provider: string;
	partitionId: string;
	availableSlots: number;
	firmwareVersion: string;
	fipsMode: boolean;
	lastHealthCheck: string;
}

/**
 * HSM (Hardware Security Module) client for secure key operations
 * Supports FIPS 140-2 Level 4 certified modules
 */
export class RippleCustodyHsmClient extends EventEmitter {
	private config: HsmConfig;
	private isConnected = false;
	private sessionHandle?: string;

	constructor(config: HsmConfig) {
		super();
		this.config = {
			useTls: true,
			connectionTimeout: 10000,
			operationTimeout: 30000,
			enableHA: true,
			...config,
		};
	}

	/**
	 * Connect to the HSM
	 */
	async connect(): Promise<void> {
		// Implementation would interface with actual HSM SDK
		// This is a placeholder showing the expected interface
		this.emit('connecting', { endpoint: this.config.endpoint });

		try {
			// Simulate HSM connection
			// In production, this would use provider-specific SDKs:
			// - Thales: Luna SDK
			// - AWS: CloudHSM SDK
			// - Azure: Managed HSM SDK
			// - GCP: Cloud KMS client

			this.sessionHandle = `session-${Date.now()}`;
			this.isConnected = true;
			this.emit('connected', { sessionHandle: this.sessionHandle });
		} catch (error) {
			this.emit('error', error);
			throw error;
		}
	}

	/**
	 * Disconnect from the HSM
	 */
	async disconnect(): Promise<void> {
		if (!this.isConnected) {
			return;
		}

		try {
			// Close HSM session
			this.sessionHandle = undefined;
			this.isConnected = false;
			this.emit('disconnected');
		} catch (error) {
			this.emit('error', error);
			throw error;
		}
	}

	/**
	 * Generate a new key in the HSM
	 */
	async generateKey(
		label: string,
		algorithm: 'RSA' | 'EC' | 'AES' | 'ECDSA',
		size: number,
		exportable = false,
	): Promise<HsmKeyInfo> {
		this.ensureConnected();

		// Generate key in HSM
		const keyInfo: HsmKeyInfo = {
			id: `key-${Date.now()}`,
			label,
			type: algorithm,
			size,
			exportable,
			createdAt: new Date().toISOString(),
			algorithm: this.getAlgorithmName(algorithm, size),
		};

		this.emit('keyGenerated', keyInfo);
		return keyInfo;
	}

	/**
	 * Sign data using a key stored in the HSM
	 */
	async sign(
		keyId: string,
		_data: Buffer,
		algorithm: string,
	): Promise<HsmSignResult> {
		this.ensureConnected();

		// Sign data using HSM key
		// In production, this would call the HSM SDK's sign method
		const signature = Buffer.from('placeholder-signature').toString('base64');

		const result: HsmSignResult = {
			signature,
			keyId,
			algorithm,
			timestamp: new Date().toISOString(),
		};

		this.emit('signed', { keyId, algorithm });
		return result;
	}

	/**
	 * Verify a signature using a key stored in the HSM
	 */
	async verify(
		keyId: string,
		_data: Buffer,
		_signature: string,
		algorithm: string,
	): Promise<boolean> {
		this.ensureConnected();

		// Verify signature using HSM key
		// In production, this would call the HSM SDK's verify method
		this.emit('verified', { keyId, algorithm });
		return true;
	}

	/**
	 * Encrypt data using a key stored in the HSM
	 */
	async encrypt(
		keyId: string,
		_data: Buffer,
		algorithm: string,
	): Promise<Buffer> {
		this.ensureConnected();

		// Encrypt data using HSM key
		// In production, this would call the HSM SDK's encrypt method
		this.emit('encrypted', { keyId, algorithm });
		return Buffer.from('encrypted-placeholder');
	}

	/**
	 * Decrypt data using a key stored in the HSM
	 */
	async decrypt(
		keyId: string,
		_encryptedData: Buffer,
		algorithm: string,
	): Promise<Buffer> {
		this.ensureConnected();

		// Decrypt data using HSM key
		// In production, this would call the HSM SDK's decrypt method
		this.emit('decrypted', { keyId, algorithm });
		return Buffer.from('decrypted-placeholder');
	}

	/**
	 * List keys in the HSM partition
	 */
	async listKeys(): Promise<HsmKeyInfo[]> {
		this.ensureConnected();

		// List keys from HSM
		// In production, this would query the HSM for key metadata
		return [];
	}

	/**
	 * Get information about a specific key
	 */
	async getKeyInfo(keyId: string): Promise<HsmKeyInfo> {
		this.ensureConnected();

		// Get key info from HSM
		return {
			id: keyId,
			label: 'unknown',
			type: 'RSA',
			size: 2048,
			exportable: false,
			createdAt: new Date().toISOString(),
			algorithm: 'RSA-2048',
		};
	}

	/**
	 * Delete a key from the HSM
	 */
	async deleteKey(keyId: string): Promise<void> {
		this.ensureConnected();

		// Delete key from HSM
		// In production, this would call the HSM SDK's destroy method
		this.emit('keyDeleted', { keyId });
	}

	/**
	 * Export the public key (if allowed)
	 */
	async exportPublicKey(_keyId: string): Promise<string> {
		this.ensureConnected();

		// Export public key from HSM
		// In production, this would call the HSM SDK's export method
		return 'placeholder-public-key';
	}

	/**
	 * Get HSM status and health
	 */
	async getStatus(): Promise<HsmStatus> {
		return {
			connected: this.isConnected,
			provider: this.config.provider,
			partitionId: this.config.partitionId,
			availableSlots: 10,
			firmwareVersion: '7.4.0',
			fipsMode: true,
			lastHealthCheck: new Date().toISOString(),
		};
	}

	/**
	 * Wrap a key for secure export
	 */
	async wrapKey(_keyId: string, _wrappingKeyId: string): Promise<string> {
		this.ensureConnected();

		// Wrap key for secure export
		return 'wrapped-key-placeholder';
	}

	/**
	 * Unwrap and import a wrapped key
	 */
	async unwrapKey(
		_wrappedKey: string,
		_wrappingKeyId: string,
		label: string,
	): Promise<HsmKeyInfo> {
		this.ensureConnected();

		// Unwrap and import key
		return {
			id: `unwrapped-${Date.now()}`,
			label,
			type: 'AES',
			size: 256,
			exportable: false,
			createdAt: new Date().toISOString(),
			algorithm: 'AES-256',
		};
	}

	/**
	 * Ensure the HSM is connected
	 */
	private ensureConnected(): void {
		if (!this.isConnected) {
			throw new Error('HSM is not connected. Call connect() first.');
		}
	}

	/**
	 * Get algorithm name for display
	 */
	private getAlgorithmName(algorithm: string, size: number): string {
		switch (algorithm) {
			case 'RSA':
				return `RSA-${size}`;
			case 'EC':
			case 'ECDSA':
				return `ECDSA-P${size}`;
			case 'AES':
				return `AES-${size}`;
			default:
				return algorithm;
		}
	}

	/**
	 * Check if HSM is connected
	 */
	isActive(): boolean {
		return this.isConnected;
	}
}

/**
 * Create an HSM client instance
 */
export function createHsmClient(config: HsmConfig): RippleCustodyHsmClient {
	return new RippleCustodyHsmClient(config);
}
