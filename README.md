# n8n-nodes-ripple-custody

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

An n8n community node for integrating with Ripple Custody's digital asset management platform. This node provides 6 resources with comprehensive operations for managing wallets, transactions, balances, keys, policies, and approvals in Ripple's institutional custody solution.

![n8n Community Node](https://img.shields.io/badge/n8n-Community%20Node-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![Ripple](https://img.shields.io/badge/Ripple-Custody-0052CC)
![Crypto](https://img.shields.io/badge/Crypto-Custody-gold)
![Enterprise](https://img.shields.io/badge/Enterprise-Ready-green)

## Features

- **Wallet Management** - Create, configure, and monitor institutional custody wallets
- **Transaction Processing** - Execute, track, and manage digital asset transactions with enterprise-grade security
- **Balance Monitoring** - Real-time balance tracking across multiple digital assets and currencies
- **Key Management** - Secure cryptographic key generation, storage, and lifecycle management
- **Policy Enforcement** - Configure and manage approval policies for transaction governance
- **Approval Workflows** - Handle multi-signature approvals and compliance workflows
- **Institutional Security** - Enterprise-grade security controls and audit trails
- **Multi-Asset Support** - Support for XRP, Bitcoin, Ethereum, and other major digital assets

## Installation

### Community Nodes (Recommended)

1. Open n8n
2. Go to **Settings** → **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-ripple-custody`
5. Click **Install**

### Manual Installation

```bash
cd ~/.n8n
npm install n8n-nodes-ripple-custody
```

### Development Installation

```bash
git clone https://github.com/Velocity-BPA/n8n-nodes-ripple-custody.git
cd n8n-nodes-ripple-custody
npm install
npm run build
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-ripple-custody
n8n start
```

## Credentials Setup

| Field | Description | Required |
|-------|-------------|----------|
| API Key | Your Ripple Custody API key from the management console | Yes |
| Environment | Environment (sandbox/production) | Yes |
| Base URL | Custom API base URL if using private deployment | No |

## Resources & Operations

### 1. Wallets

| Operation | Description |
|-----------|-------------|
| Create | Create a new custody wallet for digital assets |
| Get | Retrieve wallet details and configuration |
| List | Get all wallets associated with your account |
| Update | Modify wallet settings and configuration |
| Delete | Remove a wallet from custody |
| Get Address | Retrieve wallet address for specific asset |

### 2. Transactions

| Operation | Description |
|-----------|-------------|
| Create | Initiate a new transaction from custody wallet |
| Get | Retrieve transaction details and status |
| List | Get transaction history with filtering options |
| Cancel | Cancel a pending transaction |
| Sign | Sign a transaction with custody keys |
| Submit | Submit a signed transaction to the network |
| Get Status | Check current status of transaction |

### 3. Balances

| Operation | Description |
|-----------|-------------|
| Get | Retrieve balance for specific wallet and asset |
| List | Get all balances across wallets |
| Get History | Retrieve balance history over time |
| Get by Asset | Get balances filtered by asset type |
| Refresh | Force refresh of balance data |

### 4. Keys

| Operation | Description |
|-----------|-------------|
| Generate | Generate new cryptographic key pairs |
| Get | Retrieve key information and metadata |
| List | Get all keys in custody |
| Archive | Archive keys that are no longer needed |
| Get Public Key | Retrieve public key for external verification |
| Rotate | Rotate keys according to security policies |

### 5. Policies

| Operation | Description |
|-----------|-------------|
| Create | Create new approval and governance policies |
| Get | Retrieve policy configuration |
| List | Get all active policies |
| Update | Modify existing policy rules |
| Delete | Remove policy from system |
| Test | Test policy against sample transactions |

### 6. Approvals

| Operation | Description |
|-----------|-------------|
| Create | Create approval request for transaction |
| Get | Retrieve approval details and status |
| List | Get pending approvals requiring action |
| Approve | Approve a pending request |
| Reject | Reject a pending approval request |
| Get History | Retrieve approval audit history |

## Usage Examples

```javascript
// Create a new custody wallet
{
  "name": "Corporate Treasury Wallet",
  "assetType": "XRP",
  "policy": "multi-sig-policy-001",
  "description": "Primary treasury wallet for XRP holdings"
}
```

```javascript
// Execute a transaction with approval workflow
{
  "fromWallet": "wallet-123",
  "toAddress": "rDNvpMRVsEAg8VnWWpGGaNKmB9pqvkBcKr",
  "amount": "1000.00",
  "assetCode": "XRP",
  "memo": "Monthly vendor payment",
  "requiresApproval": true
}
```

```javascript
// Get balance information for portfolio tracking
{
  "walletId": "wallet-123",
  "assetCode": "XRP",
  "includeHistory": true,
  "timeframe": "30d"
}
```

```javascript
// Create approval policy for governance
{
  "name": "Large Transaction Policy",
  "rules": {
    "threshold": "10000.00",
    "requiredApprovers": 2,
    "timeoutHours": 24
  },
  "applicableAssets": ["XRP", "BTC", "ETH"]
}
```

## Error Handling

| Error | Description | Solution |
|-------|-------------|----------|
| Authentication Failed | Invalid API key or expired credentials | Verify API key in Ripple Custody console |
| Insufficient Balance | Transaction amount exceeds available balance | Check wallet balance before transaction |
| Policy Violation | Transaction violates configured policies | Review and comply with approval policies |
| Invalid Address | Destination address format is invalid | Validate address format for target network |
| Rate Limit Exceeded | Too many API requests in time window | Implement request throttling and retry logic |
| Transaction Timeout | Transaction approval or processing timeout | Check transaction status and retry if needed |

## Development

```bash
npm install
npm run build
npm test
npm run lint
npm run dev
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service, or paid automation offering requires a commercial license.

For licensing inquiries: **licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please ensure:

1. Code follows existing style conventions
2. All tests pass (`npm test`)
3. Linting passes (`npm run lint`)
4. Documentation is updated for new features
5. Commit messages are descriptive

## Support

- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-ripple-custody/issues)
- **Ripple Custody Documentation**: [Ripple Developer Portal](https://xrpl.org/ripple-custody.html)
- **Enterprise Support**: [Ripple Enterprise](https://ripple.com/custody/)