# n8n-nodes-ripple-custody

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for **Ripple Custody (Metaco Harmonize)** - the enterprise-grade institutional digital asset custody platform. This node provides 23 resources and 250+ operations for complete custody management, multi-chain transactions, tokenization, staking, DeFi integrations, cold storage operations, and regulatory compliance.

![n8n](https://img.shields.io/badge/n8n-community--node-blue)
![Version](https://img.shields.io/badge/version-1.0.0-green)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.2-blue)
![Node.js](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)

## Features

- **23 Resource Categories** with 250+ operations for complete custody management
- **15 Blockchain Networks** supported including Bitcoin, Ethereum, XRP, Solana, and more
- **3 Credential Types**: API Key, HSM, and MPC authentication methods
- **60+ Webhook Event Types** for real-time notifications and automation
- **Enterprise Security**: Multi-signature policies, cold storage, key ceremonies
- **Regulatory Compliance**: KYT screening, sanctions checks, travel rule, AML reporting
- **DeFi & Trading**: Protocol connections, liquidity management, staking operations
- **Comprehensive Documentation**: Full API coverage with examples

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Click **Install a community node**
4. Enter `n8n-nodes-ripple-custody`
5. Click **Install**

### Manual Installation

```bash
npm install n8n-nodes-ripple-custody
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-ripple-custody.git
cd n8n-nodes-ripple-custody

# Install dependencies
npm install

# Build the project
npm run build

# Link to n8n (Linux/macOS)
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-ripple-custody

# Restart n8n
```

## Credentials Setup

### API Key Credentials

| Field | Description |
|-------|-------------|
| Environment | Production or Sandbox |
| API URL | Custom API endpoint (optional) |
| API Key | Your Ripple Custody API key |
| API Secret | Your API secret for request signing |
| Auth Method | HMAC, JWT, or mTLS |

### HSM Credentials

| Field | Description |
|-------|-------------|
| HSM Provider | Thales Luna, AWS CloudHSM, Azure HSM, Utimaco |
| HSM Address | HSM module address/endpoint |
| Partition | HSM partition name |
| Credentials | HSM authentication credentials |

### MPC Credentials

| Field | Description |
|-------|-------------|
| MPC Protocol | Threshold ECDSA, Threshold EdDSA, Shamir |
| Party ID | Your party identifier |
| Key Share | Your encrypted key share |
| Parties | Total number of parties |
| Threshold | Required signatures threshold |

## Resources & Operations

### Core Operations

| Resource | Operations |
|----------|------------|
| **Vault** | Create, Get, List, Update, Delete, Lock, Unlock, Get Balance, Get Audit |
| **Wallet** | Create, Get, List, Update, Delete, Get Balance, Export |
| **Address** | Generate, Get, List, Validate, Get Balance, Get Transactions |
| **Transaction** | Create, Get, List, Submit, Cancel, Retry, Get Status, Get Receipt |
| **Transfer** | Create, Get, List, Cancel, Confirm, Schedule, Get Recurring |

### Security & Signing

| Resource | Operations |
|----------|------------|
| **Signing** | Sign Transaction, Sign Message, Get Request, Approve, Reject, Multi-Sign |
| **Policy** | Create, Get, Update, Delete, Add Rules, Whitelist/Blacklist Management |
| **Key Management** | Generate, Import, Export, Rotate, Archive, Get Shares, HSM Status |
| **Cold Storage** | Get Vaults, Move In/Out, Schedule Transfer, Initiate/Complete OSO |

### Blockchain & Assets

| Resource | Operations |
|----------|------------|
| **Blockchain** | Get Supported, Get Status, Block Height, Gas Price, Network Fee |
| **Asset** | Get Supported, Get Price, Get Balance, Get History, Token/NFT Info |
| **Tokenization** | Deploy Token, Mint, Burn, Transfer, Get Metadata, Pause/Resume |
| **Smart Contract** | Deploy, Call, Execute, Get State, Get Events, Verify, Upgrade |

### DeFi & Trading

| Resource | Operations |
|----------|------------|
| **Staking** | Stake, Unstake, Claim Rewards, Delegate, Redelegate, Get Validators |
| **DeFi** | Connect DApp, Execute, Add/Remove Liquidity, Swap, Harvest Yield |
| **Trading** | Connect Exchange, Submit Order, Cancel, Get History, Withdraw/Deposit |
| **Settlement** | Initiate, Confirm, Get Instructions, DVP Status, Export |

### Compliance & Reporting

| Resource | Operations |
|----------|------------|
| **Compliance** | Screen Address/Transaction, Risk Score, Sanctions Check, Travel Rule |
| **Reporting** | Create Report, Generate, Schedule, Get Data, Export |
| **Custody** | Get Accounts, Sub-accounts, Internal Transfer, Generate Statement |

### Administration

| Resource | Operations |
|----------|------------|
| **User Admin** | Create/Update/Delete User, Manage Roles, Permissions, Sessions |
| **Webhook** | Create, Update, Delete, List, Test, Get Logs |
| **Utility** | API Status, Version, Features, Rate Limits, Test Connection |

## Trigger Node

The **Ripple Custody Trigger** node supports 60+ event types:

### Event Categories

- **Transaction Events**: created, pending, confirmed, failed, cancelled
- **Deposit Events**: detected, confirmed, credited
- **Withdrawal Events**: requested, approved, completed, failed
- **Vault Events**: created, updated, locked, unlocked
- **Signing Events**: required, approved, rejected, completed
- **Compliance Events**: alert, risk_detected, sanctions_match
- **Staking Events**: staked, unstaked, rewards_claimed
- **DeFi Events**: position_opened, position_closed, yield_harvested

## Usage Examples

### Create a Vault

```javascript
// Node: Ripple Custody
// Resource: Vault
// Operation: Create

{
  "name": "Treasury Vault",
  "type": "hot",
  "blockchain": "ethereum",
  "signingPolicy": {
    "type": "multi-sig",
    "requiredSignatures": 2,
    "totalSigners": 3
  }
}
```

### Submit a Transfer

```javascript
// Node: Ripple Custody
// Resource: Transfer
// Operation: Create

{
  "fromVaultId": "vault-123",
  "toAddress": "0x742d35Cc6634C0532925a3b844Bc9e7595f1Ed3B",
  "asset": "ETH",
  "amount": "1.5",
  "memo": "Payment for services"
}
```

### Screen Address for Compliance

```javascript
// Node: Ripple Custody
// Resource: Compliance
// Operation: Screen Address

{
  "address": "0x742d35Cc6634C0532925a3b844Bc9e7595f1Ed3B",
  "blockchain": "ethereum",
  "provider": "chainalysis"
}
```

## Supported Networks

| Network | Symbol | Type |
|---------|--------|------|
| Bitcoin | BTC | UTXO |
| Ethereum | ETH | EVM |
| XRP Ledger | XRP | Native |
| Solana | SOL | Native |
| Polygon | MATIC | EVM |
| Avalanche | AVAX | EVM |
| Arbitrum | ARB | EVM L2 |
| Optimism | OP | EVM L2 |
| BNB Chain | BNB | EVM |
| Cardano | ADA | Native |
| Polkadot | DOT | Native |
| Cosmos | ATOM | Native |
| Tezos | XTZ | Native |
| Algorand | ALGO | Native |
| Stellar | XLM | Native |

## Error Handling

The node provides comprehensive error handling:

- **Authentication Errors**: Invalid API key, expired token, insufficient permissions
- **Validation Errors**: Invalid parameters, missing required fields
- **Business Logic Errors**: Insufficient balance, policy violations, compliance blocks
- **Network Errors**: Timeout, rate limiting, service unavailable

All errors include detailed messages and error codes for debugging.

## Security Best Practices

1. **Credential Security**: Store API keys securely using n8n's credential system
2. **Multi-Signature**: Enable multi-sig policies for high-value vaults
3. **Cold Storage**: Use cold storage for long-term asset holdings
4. **Compliance Screening**: Always screen addresses before transfers
5. **Audit Logging**: Enable comprehensive audit trails
6. **IP Whitelisting**: Restrict API access to known IP addresses
7. **Rate Limiting**: Implement appropriate rate limits

## Development

```bash
# Install dependencies
npm install

# Build the project
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)
- Email: [licensing@velobpa.com](mailto:licensing@velobpa.com)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add/update tests
5. Submit a pull request

## Support

- **Documentation**: [GitHub Wiki](https://github.com/Velocity-BPA/n8n-nodes-ripple-custody/wiki)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-ripple-custody/issues)
- **Email**: [support@velobpa.com](mailto:support@velobpa.com)

## Acknowledgments

- [Ripple](https://ripple.com/) for the Ripple Custody platform
- [Metaco](https://metaco.com/) for the Harmonize infrastructure
- [n8n](https://n8n.io/) for the workflow automation platform
- The n8n community for their support and feedback
