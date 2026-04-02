/**
 * Copyright (c) 2026 Velocity BPA
 * Licensed under the Business Source License 1.1
 */

import { IExecuteFunctions, INodeExecutionData } from 'n8n-workflow';
import { RippleCustody } from '../nodes/Ripple Custody/Ripple Custody.node';

// Mock n8n-workflow
jest.mock('n8n-workflow', () => ({
  ...jest.requireActual('n8n-workflow'),
  NodeApiError: class NodeApiError extends Error {
    constructor(node: any, error: any) { super(error.message || 'API Error'); }
  },
  NodeOperationError: class NodeOperationError extends Error {
    constructor(node: any, message: string) { super(message); }
  },
}));

describe('RippleCustody Node', () => {
  let node: RippleCustody;

  beforeAll(() => {
    node = new RippleCustody();
  });

  describe('Node Definition', () => {
    it('should have correct basic properties', () => {
      expect(node.description.displayName).toBe('Ripple Custody');
      expect(node.description.name).toBe('ripplecustody');
      expect(node.description.version).toBe(1);
      expect(node.description.inputs).toContain('main');
      expect(node.description.outputs).toContain('main');
    });

    it('should define 6 resources', () => {
      const resourceProp = node.description.properties.find(
        (p: any) => p.name === 'resource'
      );
      expect(resourceProp).toBeDefined();
      expect(resourceProp!.type).toBe('options');
      expect(resourceProp!.options).toHaveLength(6);
    });

    it('should have operation dropdowns for each resource', () => {
      const operations = node.description.properties.filter(
        (p: any) => p.name === 'operation'
      );
      expect(operations.length).toBe(6);
    });

    it('should require credentials', () => {
      expect(node.description.credentials).toBeDefined();
      expect(node.description.credentials!.length).toBeGreaterThan(0);
      expect(node.description.credentials![0].required).toBe(true);
    });

    it('should have parameters with proper displayOptions', () => {
      const params = node.description.properties.filter(
        (p: any) => p.displayOptions?.show?.resource
      );
      for (const param of params) {
        expect(param.displayOptions.show.resource).toBeDefined();
        expect(Array.isArray(param.displayOptions.show.resource)).toBe(true);
      }
    });
  });

  // Resource-specific tests
describe('Wallets Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.custody.ripple.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('listWallets operation', () => {
		it('should list wallets successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listWallets')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(0)
				.mockReturnValueOnce('BTC');

			const mockResponse = {
				wallets: [
					{ id: 'wallet1', currency: 'BTC', balance: '1.5' },
					{ id: 'wallet2', currency: 'BTC', balance: '2.3' },
				],
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWalletsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle listWallets errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('listWallets')
				.mockReturnValueOnce(50)
				.mockReturnValueOnce(0)
				.mockReturnValueOnce('BTC');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
				new Error('API Error'),
			);
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWalletsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: { error: 'API Error' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('createWallet operation', () => {
		it('should create wallet successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createWallet')
				.mockReturnValueOnce('BTC')
				.mockReturnValueOnce('Test Wallet')
				.mockReturnValueOnce('hot');

			const mockResponse = {
				id: 'wallet123',
				currency: 'BTC',
				label: 'Test Wallet',
				type: 'hot',
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWalletsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle createWallet errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('createWallet')
				.mockReturnValueOnce('BTC')
				.mockReturnValueOnce('Test Wallet')
				.mockReturnValueOnce('hot');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
				new Error('Creation failed'),
			);
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWalletsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: { error: 'Creation failed' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('getWallet operation', () => {
		it('should get wallet successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getWallet')
				.mockReturnValueOnce('wallet123');

			const mockResponse = {
				id: 'wallet123',
				currency: 'BTC',
				balance: '1.5',
				addresses: ['1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'],
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWalletsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle getWallet errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getWallet')
				.mockReturnValueOnce('wallet123');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
				new Error('Wallet not found'),
			);
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWalletsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: { error: 'Wallet not found' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('updateWallet operation', () => {
		it('should update wallet successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateWallet')
				.mockReturnValueOnce('wallet123')
				.mockReturnValueOnce('Updated Wallet');

			const mockResponse = {
				id: 'wallet123',
				label: 'Updated Wallet',
				updated: true,
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWalletsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle updateWallet errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('updateWallet')
				.mockReturnValueOnce('wallet123')
				.mockReturnValueOnce('Updated Wallet');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
				new Error('Update failed'),
			);
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWalletsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: { error: 'Update failed' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});

	describe('deleteWallet operation', () => {
		it('should delete wallet successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteWallet')
				.mockReturnValueOnce('wallet123');

			const mockResponse = {
				id: 'wallet123',
				status: 'archived',
				deleted: true,
			};

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

			const result = await executeWalletsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: mockResponse,
					pairedItem: { item: 0 },
				},
			]);
		});

		it('should handle deleteWallet errors', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('deleteWallet')
				.mockReturnValueOnce('wallet123');

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(
				new Error('Delete failed'),
			);
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeWalletsOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toEqual([
				{
					json: { error: 'Delete failed' },
					pairedItem: { item: 0 },
				},
			]);
		});
	});
});

describe('Transactions Resource', () => {
  let mockExecuteFunctions: any;
  
  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.custody.ripple.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { httpRequest: jest.fn(), requestWithAuthentication: jest.fn() },
    };
  });
  
  test('should list transactions successfully', async () => {
    const mockResponse = { transactions: [{ id: 'txn_123', status: 'confirmed' }] };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listTransactions')
      .mockReturnValueOnce('wallet_123')
      .mockReturnValueOnce('all')
      .mockReturnValueOnce(50)
      .mockReturnValueOnce(0);
    
    const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.custody.ripple.com/v1/transactions?walletId=wallet_123&limit=50&offset=0',
      headers: { 'Authorization': 'Bearer test-key', 'Content-Type': 'application/json' },
      json: true,
    });
  });
  
  test('should create transaction successfully', async () => {
    const mockResponse = { id: 'txn_123', status: 'pending' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createTransaction')
      .mockReturnValueOnce('wallet_123')
      .mockReturnValueOnce('rDNuCg3v7QrZrxwLxEXXvCE9bCNKLvRtrr')
      .mockReturnValueOnce('100.50')
      .mockReturnValueOnce('XRP');
    
    const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.custody.ripple.com/v1/transactions',
      headers: { 'Authorization': 'Bearer test-key', 'Content-Type': 'application/json' },
      json: true,
      body: {
        walletId: 'wallet_123',
        recipient: 'rDNuCg3v7QrZrxwLxEXXvCE9bCNKLvRtrr',
        amount: '100.50',
        currency: 'XRP',
      },
    });
  });
  
  test('should get transaction successfully', async () => {
    const mockResponse = { id: 'txn_123', status: 'confirmed', amount: '100.50' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('getTransaction')
      .mockReturnValueOnce('txn_123');
    
    const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.custody.ripple.com/v1/transactions/txn_123',
      headers: { 'Authorization': 'Bearer test-key', 'Content-Type': 'application/json' },
      json: true,
    });
  });
  
  test('should sign transaction successfully', async () => {
    const mockResponse = { id: 'txn_123', status: 'signed' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('signTransaction')
      .mockReturnValueOnce('txn_123');
    
    const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'PUT',
      url: 'https://api.custody.ripple.com/v1/transactions/txn_123/sign',
      headers: { 'Authorization': 'Bearer test-key', 'Content-Type': 'application/json' },
      json: true,
      body: {},
    });
  });
  
  test('should broadcast transaction successfully', async () => {
    const mockResponse = { id: 'txn_123', status: 'broadcast', hash: 'hash_123' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('broadcastTransaction')
      .mockReturnValueOnce('txn_123');
    
    const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.custody.ripple.com/v1/transactions/txn_123/broadcast',
      headers: { 'Authorization': 'Bearer test-key', 'Content-Type': 'application/json' },
      json: true,
      body: {},
    });
  });
  
  test('should cancel transaction successfully', async () => {
    const mockResponse = { id: 'txn_123', status: 'cancelled' };
    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('cancelTransaction')
      .mockReturnValueOnce('txn_123');
    
    const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'DELETE',
      url: 'https://api.custody.ripple.com/v1/transactions/txn_123',
      headers: { 'Authorization': 'Bearer test-key', 'Content-Type': 'application/json' },
      json: true,
    });
  });
  
  test('should handle API errors', async () => {
    const error = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getTransaction');
    
    await expect(executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]))
      .rejects.toThrow('API Error');
  });
  
  test('should handle errors with continueOnFail', async () => {
    const error = new Error('API Error');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(error);
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockReturnValue('getTransaction');
    
    const result = await executeTransactionsOperations.call(mockExecuteFunctions, [{ json: {} }]);
    
    expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
  });
});

describe('Balances Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-api-key',
				baseUrl: 'https://api.custody.ripple.com/v1',
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('getAllBalances', () => {
		it('should get all balances successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllBalances')
				.mockReturnValueOnce('USD')
				.mockReturnValueOnce(true);

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				balances: [{ currency: 'USD', amount: '1000.00' }],
			});

			const result = await executeBalancesOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.custody.ripple.com/v1/balances?currency=USD&includeEmpty=true',
				headers: {
					Authorization: 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toHaveLength(1);
			expect(result[0].json.balances).toBeDefined();
		});

		it('should handle errors when getting all balances', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getAllBalances')
				.mockReturnValueOnce('')
				.mockReturnValueOnce(false);

			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeBalancesOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(result).toHaveLength(1);
			expect(result[0].json.error).toBe('API Error');
		});
	});

	describe('getWalletBalances', () => {
		it('should get wallet balances successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getWalletBalances')
				.mockReturnValueOnce('wallet-123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				walletId: 'wallet-123',
				balances: [{ currency: 'XRP', amount: '5000.00' }],
			});

			const result = await executeBalancesOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.custody.ripple.com/v1/wallets/wallet-123/balances',
				headers: {
					Authorization: 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toHaveLength(1);
			expect(result[0].json.walletId).toBe('wallet-123');
		});
	});

	describe('getBalanceHistory', () => {
		it('should get balance history successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('getBalanceHistory')
				.mockReturnValueOnce('wallet-123')
				.mockReturnValueOnce('2023-01-01T00:00:00Z')
				.mockReturnValueOnce('2023-12-31T23:59:59Z');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				history: [
					{ date: '2023-01-01', balance: '1000.00' },
					{ date: '2023-12-31', balance: '2000.00' },
				],
			});

			const result = await executeBalancesOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.custody.ripple.com/v1/balances/history?walletId=wallet-123&startDate=2023-01-01T00%3A00%3A00Z&endDate=2023-12-31T23%3A59%3A59Z',
				headers: {
					Authorization: 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});

			expect(result).toHaveLength(1);
			expect(result[0].json.history).toBeDefined();
		});
	});

	describe('refreshBalances', () => {
		it('should refresh balances successfully', async () => {
			mockExecuteFunctions.getNodeParameter
				.mockReturnValueOnce('refreshBalances')
				.mockReturnValueOnce('wallet-123');

			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
				message: 'Balance refresh initiated',
				walletId: 'wallet-123',
			});

			const result = await executeBalancesOperations.call(
				mockExecuteFunctions,
				[{ json: {} }],
			);

			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.custody.ripple.com/v1/balances/refresh',
				headers: {
					Authorization: 'Bearer test-api-key',
					'Content-Type': 'application/json',
				},
				body: { walletId: 'wallet-123' },
				json: true,
			});

			expect(result).toHaveLength(1);
			expect(result[0].json.message).toBe('Balance refresh initiated');
		});
	});
});

describe('Keys Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.custody.ripple.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  describe('listKeys operation', () => {
    it('should list all keys successfully', async () => {
      const mockKeys = [
        { id: 'key1', algorithm: 'ecdsa', status: 'active' },
        { id: 'key2', algorithm: 'eddsa', status: 'inactive' }
      ];

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listKeys')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockKeys);

      const result = await executeKeysOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockKeys, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.custody.ripple.com/v1/keys',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        },
        json: true
      });
    });

    it('should handle listKeys with filters', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listKeys')
        .mockReturnValueOnce('wallet123')
        .mockReturnValueOnce('active');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue([]);

      await executeKeysOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.custody.ripple.com/v1/keys?walletId=wallet123&status=active',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        },
        json: true
      });
    });

    it('should handle listKeys error', async () => {
      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('listKeys')
        .mockReturnValueOnce('')
        .mockReturnValueOnce('');

      mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
      mockExecuteFunctions.continueOnFail.mockReturnValue(true);

      const result = await executeKeysOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
    });
  });

  describe('generateKey operation', () => {
    it('should generate a new key successfully', async () => {
      const mockKey = { id: 'newkey123', algorithm: 'ecdsa', curve: 'secp256k1', status: 'active' };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('generateKey')
        .mockReturnValueOnce('ecdsa')
        .mockReturnValueOnce('secp256k1')
        .mockReturnValueOnce('wallet123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockKey);

      const result = await executeKeysOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockKey, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'POST',
        url: 'https://api.custody.ripple.com/v1/keys',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        },
        body: {
          algorithm: 'ecdsa',
          curve: 'secp256k1',
          walletId: 'wallet123'
        },
        json: true
      });
    });
  });

  describe('getKey operation', () => {
    it('should get key details successfully', async () => {
      const mockKey = { id: 'key123', algorithm: 'ecdsa', status: 'active' };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('getKey')
        .mockReturnValueOnce('key123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockKey);

      const result = await executeKeysOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockKey, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'GET',
        url: 'https://api.custody.ripple.com/v1/keys/key123',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        },
        json: true
      });
    });
  });

  describe('rotateKey operation', () => {
    it('should rotate key successfully', async () => {
      const mockResponse = { id: 'key123', status: 'rotating', message: 'Key rotation initiated' };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('rotateKey')
        .mockReturnValueOnce('key123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeKeysOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'PUT',
        url: 'https://api.custody.ripple.com/v1/keys/key123/rotate',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        },
        json: true
      });
    });
  });

  describe('deleteKey operation', () => {
    it('should delete key successfully', async () => {
      const mockResponse = { id: 'key123', status: 'deleted', message: 'Key securely deleted' };

      mockExecuteFunctions.getNodeParameter
        .mockReturnValueOnce('deleteKey')
        .mockReturnValueOnce('key123');

      mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);

      const result = await executeKeysOperations.call(mockExecuteFunctions, [{ json: {} }]);

      expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
      expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
        method: 'DELETE',
        url: 'https://api.custody.ripple.com/v1/keys/key123',
        headers: {
          'Authorization': 'Bearer test-key',
          'Content-Type': 'application/json'
        },
        json: true
      });
    });
  });
});

describe('Policies Resource', () => {
  let mockExecuteFunctions: any;

  beforeEach(() => {
    mockExecuteFunctions = {
      getNodeParameter: jest.fn(),
      getCredentials: jest.fn().mockResolvedValue({ 
        apiKey: 'test-key', 
        baseUrl: 'https://api.custody.ripple.com/v1' 
      }),
      getInputData: jest.fn().mockReturnValue([{ json: {} }]),
      getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
      continueOnFail: jest.fn().mockReturnValue(false),
      helpers: { 
        httpRequest: jest.fn(),
        requestWithAuthentication: jest.fn() 
      },
    };
  });

  it('should list policies successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('listPolicies')
      .mockReturnValueOnce('security')
      .mockReturnValueOnce('active');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      policies: [{ id: 'policy1', name: 'Test Policy', status: 'active' }]
    });

    const result = await executePoliciesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'GET',
      url: 'https://api.custody.ripple.com/v1/policies?type=security&status=active',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      json: true,
    });

    expect(result).toEqual([{
      json: { policies: [{ id: 'policy1', name: 'Test Policy', status: 'active' }] },
      pairedItem: { item: 0 }
    }]);
  });

  it('should create policy successfully', async () => {
    mockExecuteFunctions.getNodeParameter
      .mockReturnValueOnce('createPolicy')
      .mockReturnValueOnce('Test Security Policy')
      .mockReturnValueOnce('{"threshold": 2, "timeout": 3600}')
      .mockReturnValueOnce('user1,user2');

    mockExecuteFunctions.helpers.httpRequest.mockResolvedValue({
      id: 'policy123',
      name: 'Test Security Policy',
      status: 'active'
    });

    const result = await executePoliciesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
      method: 'POST',
      url: 'https://api.custody.ripple.com/v1/policies',
      headers: {
        'Authorization': 'Bearer test-key',
        'Content-Type': 'application/json',
      },
      body: {
        name: 'Test Security Policy',
        rules: { threshold: 2, timeout: 3600 },
        approvers: ['user1', 'user2']
      },
      json: true,
    });

    expect(result).toEqual([{
      json: { id: 'policy123', name: 'Test Security Policy', status: 'active' },
      pairedItem: { item: 0 }
    }]);
  });

  it('should handle API errors', async () => {
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getPolicy').mockReturnValueOnce('invalid');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Policy not found'));

    await expect(executePoliciesOperations.call(mockExecuteFunctions, [{ json: {} }])).rejects.toThrow('Policy not found');
  });

  it('should handle errors gracefully when continueOnFail is true', async () => {
    mockExecuteFunctions.continueOnFail.mockReturnValue(true);
    mockExecuteFunctions.getNodeParameter.mockReturnValueOnce('getPolicy').mockReturnValueOnce('invalid');
    mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('Policy not found'));

    const result = await executePoliciesOperations.call(mockExecuteFunctions, [{ json: {} }]);

    expect(result).toEqual([{
      json: { error: 'Policy not found' },
      pairedItem: { item: 0 }
    }]);
  });
});

describe('Approvals Resource', () => {
	let mockExecuteFunctions: any;

	beforeEach(() => {
		mockExecuteFunctions = {
			getNodeParameter: jest.fn(),
			getCredentials: jest.fn().mockResolvedValue({
				apiKey: 'test-key',
				baseUrl: 'https://api.custody.ripple.com/v1'
			}),
			getInputData: jest.fn().mockReturnValue([{ json: {} }]),
			getNode: jest.fn().mockReturnValue({ name: 'Test Node' }),
			continueOnFail: jest.fn().mockReturnValue(false),
			helpers: {
				httpRequest: jest.fn(),
				requestWithAuthentication: jest.fn(),
			},
		};
	});

	describe('listApprovals operation', () => {
		it('should list approvals successfully', async () => {
			const mockResponse = { approvals: [{ id: 'approval1', status: 'pending' }] };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'listApprovals';
					case 'status': return 'pending';
					case 'limit': return 100;
					default: return '';
				}
			});

			const result = await executeApprovalsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.custody.ripple.com/v1/approvals?status=pending&limit=100',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});

		it('should handle listApprovals error', async () => {
			mockExecuteFunctions.helpers.httpRequest.mockRejectedValue(new Error('API Error'));
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				if (param === 'operation') return 'listApprovals';
				return '';
			});
			mockExecuteFunctions.continueOnFail.mockReturnValue(true);

			const result = await executeApprovalsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: { error: 'API Error' }, pairedItem: { item: 0 } }]);
		});
	});

	describe('approveTransaction operation', () => {
		it('should approve transaction successfully', async () => {
			const mockResponse = { success: true, approvalId: 'approval1' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'approveTransaction';
					case 'approvalId': return 'approval1';
					default: return '';
				}
			});

			const result = await executeApprovalsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.custody.ripple.com/v1/approvals/approval1/approve',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});

	describe('rejectTransaction operation', () => {
		it('should reject transaction successfully', async () => {
			const mockResponse = { success: true, approvalId: 'approval1' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'rejectTransaction';
					case 'approvalId': return 'approval1';
					case 'reason': return 'Policy violation';
					default: return '';
				}
			});

			const result = await executeApprovalsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'POST',
				url: 'https://api.custody.ripple.com/v1/approvals/approval1/reject',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				body: {
					reason: 'Policy violation',
				},
				json: true,
			});
		});
	});

	describe('getApproval operation', () => {
		it('should get approval details successfully', async () => {
			const mockResponse = { id: 'approval1', status: 'pending' };
			mockExecuteFunctions.helpers.httpRequest.mockResolvedValue(mockResponse);
			mockExecuteFunctions.getNodeParameter.mockImplementation((param: string) => {
				switch (param) {
					case 'operation': return 'getApproval';
					case 'approvalId': return 'approval1';
					default: return '';
				}
			});

			const result = await executeApprovalsOperations.call(mockExecuteFunctions, [{ json: {} }]);

			expect(result).toEqual([{ json: mockResponse, pairedItem: { item: 0 } }]);
			expect(mockExecuteFunctions.helpers.httpRequest).toHaveBeenCalledWith({
				method: 'GET',
				url: 'https://api.custody.ripple.com/v1/approvals/approval1',
				headers: {
					'Authorization': 'Bearer test-key',
					'Content-Type': 'application/json',
				},
				json: true,
			});
		});
	});
});
});
