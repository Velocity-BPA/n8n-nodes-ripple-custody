/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

import type { IDataObject } from 'n8n-workflow';
import WebSocket from 'ws';
import { EventEmitter } from 'events';
import { WEBSOCKET_ENDPOINTS } from '../constants/endpoints';

export interface WebSocketConfig {
	baseUrl: string;
	tenantId: string;
	authToken: string;
	reconnect?: boolean;
	maxReconnectAttempts?: number;
	reconnectInterval?: number;
	heartbeatInterval?: number;
}

export interface WebSocketMessage {
	type: string;
	event: string;
	data: IDataObject;
	timestamp: string;
	id: string;
}

export type WebSocketEventType = 
	| 'transaction'
	| 'transfer'
	| 'signing'
	| 'vault'
	| 'compliance'
	| 'staking'
	| 'defi'
	| 'token'
	| 'coldStorage';

/**
 * WebSocket client for real-time event streaming from Ripple Custody
 */
export class RippleCustodyWebSocketClient extends EventEmitter {
	private config: WebSocketConfig;
	private ws?: WebSocket;
	private reconnectAttempts = 0;
	private heartbeatTimer?: NodeJS.Timeout;
	private isConnected = false;
	private subscriptions: Set<string> = new Set();

	constructor(config: WebSocketConfig) {
		super();
		this.config = {
			reconnect: true,
			maxReconnectAttempts: 5,
			reconnectInterval: 5000,
			heartbeatInterval: 30000,
			...config,
		};
	}

	/**
	 * Connect to the WebSocket server
	 */
	async connect(endpoint: keyof typeof WEBSOCKET_ENDPOINTS = 'events'): Promise<void> {
		return new Promise((resolve, reject) => {
			const wsUrl = `${this.config.baseUrl.replace('https://', 'wss://').replace('http://', 'ws://')}${WEBSOCKET_ENDPOINTS[endpoint]}`;

			this.ws = new WebSocket(wsUrl, {
				headers: {
					'X-Tenant-ID': this.config.tenantId,
					'Authorization': `Bearer ${this.config.authToken}`,
				},
			});

			this.ws.on('open', () => {
				this.isConnected = true;
				this.reconnectAttempts = 0;
				this.startHeartbeat();
				this.emit('connected');
				resolve();
			});

			this.ws.on('message', (data: WebSocket.Data) => {
				try {
					const message = JSON.parse(data.toString()) as WebSocketMessage;
					this.handleMessage(message);
				} catch (error) {
					this.emit('error', new Error(`Failed to parse WebSocket message: ${error}`));
				}
			});

			this.ws.on('close', (code, reason) => {
				this.isConnected = false;
				this.stopHeartbeat();
				this.emit('disconnected', { code, reason: reason.toString() });

				if (this.config.reconnect && this.reconnectAttempts < (this.config.maxReconnectAttempts || 5)) {
					this.reconnectAttempts++;
					setTimeout(() => {
						this.connect(endpoint).catch((err) => this.emit('error', err));
					}, this.config.reconnectInterval);
				}
			});

			this.ws.on('error', (error) => {
				this.emit('error', error);
				reject(error);
			});
		});
	}

	/**
	 * Disconnect from the WebSocket server
	 */
	disconnect(): void {
		this.config.reconnect = false;
		this.stopHeartbeat();
		if (this.ws) {
			this.ws.close(1000, 'Client disconnecting');
			this.ws = undefined;
		}
		this.isConnected = false;
	}

	/**
	 * Subscribe to specific event types
	 */
	subscribe(eventTypes: WebSocketEventType[]): void {
		if (!this.isConnected || !this.ws) {
			throw new Error('WebSocket is not connected');
		}

		const subscribeMessage = {
			action: 'subscribe',
			events: eventTypes,
			timestamp: new Date().toISOString(),
		};

		this.ws.send(JSON.stringify(subscribeMessage));
		eventTypes.forEach((type) => this.subscriptions.add(type));
	}

	/**
	 * Unsubscribe from specific event types
	 */
	unsubscribe(eventTypes: WebSocketEventType[]): void {
		if (!this.isConnected || !this.ws) {
			return;
		}

		const unsubscribeMessage = {
			action: 'unsubscribe',
			events: eventTypes,
			timestamp: new Date().toISOString(),
		};

		this.ws.send(JSON.stringify(unsubscribeMessage));
		eventTypes.forEach((type) => this.subscriptions.delete(type));
	}

	/**
	 * Handle incoming WebSocket messages
	 */
	private handleMessage(message: WebSocketMessage): void {
		// Handle heartbeat response
		if (message.type === 'pong') {
			this.emit('heartbeat');
			return;
		}

		// Emit the message to listeners
		this.emit('message', message);
		this.emit(message.type, message);

		// Emit specific event types
		if (message.event) {
			this.emit(`event:${message.event}`, message);
		}
	}

	/**
	 * Start heartbeat to keep connection alive
	 */
	private startHeartbeat(): void {
		this.stopHeartbeat();
		this.heartbeatTimer = setInterval(() => {
			if (this.isConnected && this.ws) {
				this.ws.send(JSON.stringify({ type: 'ping', timestamp: new Date().toISOString() }));
			}
		}, this.config.heartbeatInterval);
	}

	/**
	 * Stop heartbeat timer
	 */
	private stopHeartbeat(): void {
		if (this.heartbeatTimer) {
			clearInterval(this.heartbeatTimer);
			this.heartbeatTimer = undefined;
		}
	}

	/**
	 * Check if WebSocket is connected
	 */
	isActive(): boolean {
		return this.isConnected;
	}

	/**
	 * Get current subscriptions
	 */
	getSubscriptions(): string[] {
		return Array.from(this.subscriptions);
	}
}

/**
 * Create a WebSocket client instance
 */
export function createWebSocketClient(config: WebSocketConfig): RippleCustodyWebSocketClient {
	return new RippleCustodyWebSocketClient(config);
}
