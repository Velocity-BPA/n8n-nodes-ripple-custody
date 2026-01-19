/*
 * Copyright (c) Velocity BPA, LLC
 * Licensed under the Business Source License 1.1
 * Commercial use requires a separate commercial license.
 * See LICENSE file for details.
 */

/**
 * Compliance and regulatory constants for Ripple Custody
 */

// KYT (Know Your Transaction) Providers
export const KYT_PROVIDERS = [
	{ name: 'Chainalysis', value: 'chainalysis' },
	{ name: 'Elliptic', value: 'elliptic' },
	{ name: 'TRM Labs', value: 'trm' },
	{ name: 'CipherTrace', value: 'ciphertrace' },
	{ name: 'Scorechain', value: 'scorechain' },
	{ name: 'Coinfirm', value: 'coinfirm' },
	{ name: 'Crystal Blockchain', value: 'crystal' },
	{ name: 'AnChain.AI', value: 'anchain' },
] as const;

// Risk Score Levels
export const RISK_LEVELS = [
	{ name: 'Low', value: 'low', minScore: 0, maxScore: 25 },
	{ name: 'Medium', value: 'medium', minScore: 26, maxScore: 50 },
	{ name: 'High', value: 'high', minScore: 51, maxScore: 75 },
	{ name: 'Severe', value: 'severe', minScore: 76, maxScore: 100 },
] as const;

// Risk Categories
export const RISK_CATEGORIES = [
	{ name: 'Sanctions', value: 'sanctions' },
	{ name: 'Darknet Market', value: 'darknet' },
	{ name: 'Ransomware', value: 'ransomware' },
	{ name: 'Terrorist Financing', value: 'terrorist_financing' },
	{ name: 'Mixer/Tumbler', value: 'mixer' },
	{ name: 'Gambling', value: 'gambling' },
	{ name: 'Scam', value: 'scam' },
	{ name: 'Stolen Funds', value: 'stolen' },
	{ name: 'High-Risk Exchange', value: 'high_risk_exchange' },
	{ name: 'P2P Exchange', value: 'p2p_exchange' },
	{ name: 'Child Exploitation', value: 'child_exploitation' },
	{ name: 'Human Trafficking', value: 'human_trafficking' },
	{ name: 'Drug Trafficking', value: 'drug_trafficking' },
	{ name: 'Fraud', value: 'fraud' },
	{ name: 'Money Laundering', value: 'money_laundering' },
] as const;

// Sanctions Lists
export const SANCTIONS_LISTS = [
	{ name: 'OFAC SDN List', value: 'ofac_sdn' },
	{ name: 'OFAC Non-SDN Lists', value: 'ofac_non_sdn' },
	{ name: 'EU Sanctions', value: 'eu_sanctions' },
	{ name: 'UK Sanctions', value: 'uk_sanctions' },
	{ name: 'UN Sanctions', value: 'un_sanctions' },
	{ name: 'Australian Sanctions', value: 'aus_sanctions' },
	{ name: 'Canadian Sanctions', value: 'can_sanctions' },
	{ name: 'Japanese Sanctions', value: 'jpn_sanctions' },
] as const;

// Travel Rule Providers
export const TRAVEL_RULE_PROVIDERS = [
	{ name: 'Notabene', value: 'notabene' },
	{ name: 'Sygna', value: 'sygna' },
	{ name: 'TravelRule Protocol', value: 'trp' },
	{ name: 'TRISA', value: 'trisa' },
	{ name: 'OpenVASP', value: 'openvasp' },
	{ name: 'Shyft Network', value: 'shyft' },
	{ name: 'Veriscope', value: 'veriscope' },
] as const;

// Regulatory Frameworks
export const REGULATORY_FRAMEWORKS = [
	{ name: 'FATF Recommendations', value: 'fatf', description: 'Financial Action Task Force guidelines' },
	{ name: 'MiCA (EU)', value: 'mica', description: 'Markets in Crypto-Assets Regulation' },
	{ name: 'BSA/AML (US)', value: 'bsa_aml', description: 'Bank Secrecy Act / Anti-Money Laundering' },
	{ name: 'FinCEN (US)', value: 'fincen', description: 'Financial Crimes Enforcement Network' },
	{ name: 'FCA (UK)', value: 'fca', description: 'Financial Conduct Authority' },
	{ name: 'BaFin (Germany)', value: 'bafin', description: 'Federal Financial Supervisory Authority' },
	{ name: 'AMF (France)', value: 'amf', description: 'Autorité des marchés financiers' },
	{ name: 'MAS (Singapore)', value: 'mas', description: 'Monetary Authority of Singapore' },
	{ name: 'SFC (Hong Kong)', value: 'sfc', description: 'Securities and Futures Commission' },
	{ name: 'FSA (Japan)', value: 'fsa_japan', description: 'Financial Services Agency' },
	{ name: 'AUSTRAC (Australia)', value: 'austrac', description: 'Australian Transaction Reports and Analysis Centre' },
	{ name: 'FINMA (Switzerland)', value: 'finma', description: 'Swiss Financial Market Supervisory Authority' },
] as const;

// Compliance Status
export const COMPLIANCE_STATUS = [
	{ name: 'Pending Review', value: 'pending' },
	{ name: 'Under Review', value: 'reviewing' },
	{ name: 'Approved', value: 'approved' },
	{ name: 'Rejected', value: 'rejected' },
	{ name: 'Flagged', value: 'flagged' },
	{ name: 'Escalated', value: 'escalated' },
	{ name: 'Blocked', value: 'blocked' },
] as const;

// Alert Types
export const ALERT_TYPES = [
	{ name: 'Sanctions Match', value: 'sanctions_match' },
	{ name: 'High-Risk Transaction', value: 'high_risk_transaction' },
	{ name: 'Unusual Activity', value: 'unusual_activity' },
	{ name: 'Threshold Exceeded', value: 'threshold_exceeded' },
	{ name: 'Suspicious Pattern', value: 'suspicious_pattern' },
	{ name: 'Watchlist Match', value: 'watchlist_match' },
	{ name: 'Travel Rule Failure', value: 'travel_rule_failure' },
	{ name: 'KYC Expiration', value: 'kyc_expiration' },
] as const;

// Report Types
export const COMPLIANCE_REPORT_TYPES = [
	{ name: 'Suspicious Activity Report (SAR)', value: 'sar' },
	{ name: 'Currency Transaction Report (CTR)', value: 'ctr' },
	{ name: 'AML Compliance Report', value: 'aml_report' },
	{ name: 'KYT Screening Report', value: 'kyt_report' },
	{ name: 'Travel Rule Report', value: 'travel_rule_report' },
	{ name: 'Risk Assessment Report', value: 'risk_assessment' },
	{ name: 'Transaction Monitoring Report', value: 'transaction_monitoring' },
	{ name: 'Regulatory Filing', value: 'regulatory_filing' },
] as const;

// Security Standards
export const SECURITY_STANDARDS = {
	FIPS_140_2_LEVEL_4: {
		name: 'FIPS 140-2 Level 4',
		description: 'Highest level of physical security for cryptographic modules',
	},
	ISO_27001: {
		name: 'ISO 27001',
		description: 'Information security management system standard',
	},
	SOC_2_TYPE_II: {
		name: 'SOC 2 Type II',
		description: 'Service Organization Control 2 audit standard',
	},
	SOC_1_TYPE_II: {
		name: 'SOC 1 Type II',
		description: 'Service Organization Control 1 audit standard',
	},
	PCI_DSS: {
		name: 'PCI DSS',
		description: 'Payment Card Industry Data Security Standard',
	},
	GDPR: {
		name: 'GDPR',
		description: 'General Data Protection Regulation',
	},
	CCPA: {
		name: 'CCPA',
		description: 'California Consumer Privacy Act',
	},
} as const;

// Travel Rule Thresholds by Jurisdiction
export const TRAVEL_RULE_THRESHOLDS = {
	FATF: { amount: 1000, currency: 'USD', description: 'FATF recommended threshold' },
	US: { amount: 3000, currency: 'USD', description: 'US FinCEN threshold' },
	EU: { amount: 1000, currency: 'EUR', description: 'EU threshold under MiCA' },
	SINGAPORE: { amount: 1500, currency: 'SGD', description: 'MAS threshold' },
	SWITZERLAND: { amount: 1000, currency: 'CHF', description: 'FINMA threshold' },
	UK: { amount: 1000, currency: 'GBP', description: 'FCA threshold' },
	JAPAN: { amount: 0, currency: 'JPY', description: 'All transactions (no threshold)' },
} as const;
