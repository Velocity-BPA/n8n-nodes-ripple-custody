/**
 * Ripple Custody - Reporting Resource
 * SPDX-License-Identifier: BSL-1.1
 * Copyright (c) 2024 Anthropic, PBC
 *
 * This file is licensed under the Business Source License 1.1.
 * You may use this file in compliance with the License.
 * See LICENSE file for details.
 */

import type {
	IDataObject,
	IExecuteFunctions,
	INodeProperties,
} from 'n8n-workflow';
import { createApiClient } from '../../transport/apiClient';
import { ENDPOINTS } from '../../constants/endpoints';

export const operations: INodeProperties[] = [
	{
		displayName: 'Operation',
		name: 'operation',
		type: 'options',
		noDataExpression: true,
		displayOptions: {
			show: {
				resource: ['reporting'],
			},
		},
		options: [
			{
				name: 'Create Report',
				value: 'create',
				description: 'Create a new report configuration',
				action: 'Create a report',
			},
			{
				name: 'Delete Report',
				value: 'delete',
				description: 'Delete a report configuration',
				action: 'Delete a report',
			},
			{
				name: 'Export Report',
				value: 'export',
				description: 'Export report data in various formats',
				action: 'Export a report',
			},
			{
				name: 'Generate Report',
				value: 'generate',
				description: 'Generate a report on demand',
				action: 'Generate a report',
			},
			{
				name: 'Get Dashboard',
				value: 'getDashboard',
				description: 'Get dashboard data and metrics',
				action: 'Get dashboard',
			},
			{
				name: 'Get Many Reports',
				value: 'getMany',
				description: 'Get multiple report configurations',
				action: 'Get many reports',
			},
			{
				name: 'Get Report',
				value: 'get',
				description: 'Get a specific report configuration',
				action: 'Get a report',
			},
			{
				name: 'Get Report Data',
				value: 'getData',
				description: 'Get generated report data',
				action: 'Get report data',
			},
			{
				name: 'Get Scheduled Reports',
				value: 'getScheduled',
				description: 'Get all scheduled reports',
				action: 'Get scheduled reports',
			},
			{
				name: 'Schedule Report',
				value: 'schedule',
				description: 'Schedule a report for automated generation',
				action: 'Schedule a report',
			},
			{
				name: 'Update Report',
				value: 'update',
				description: 'Update a report configuration',
				action: 'Update a report',
			},
		],
		default: 'getMany',
	},
];

export const fields: INodeProperties[] = [
	// ----------------------------------
	//         Report Type Field
	// ----------------------------------
	{
		displayName: 'Report Type',
		name: 'reportType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['create', 'generate'],
			},
		},
		options: [
			{ name: 'Position Report', value: 'position' },
			{ name: 'Transaction Report', value: 'transaction' },
			{ name: 'Audit Report', value: 'audit' },
			{ name: 'Compliance Report', value: 'compliance' },
			{ name: 'Tax Report', value: 'tax' },
			{ name: 'Performance Report', value: 'performance' },
			{ name: 'Risk Report', value: 'risk' },
			{ name: 'Reconciliation Report', value: 'reconciliation' },
			{ name: 'Fee Report', value: 'fee' },
			{ name: 'Staking Report', value: 'staking' },
			{ name: 'DeFi Report', value: 'defi' },
			{ name: 'Custom Report', value: 'custom' },
		],
		default: 'position',
		description: 'Type of report to create or generate',
	},

	// ----------------------------------
	//         Report ID Field
	// ----------------------------------
	{
		displayName: 'Report ID',
		name: 'reportId',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['get', 'update', 'delete', 'generate', 'schedule', 'getData', 'export'],
			},
		},
		default: '',
		description: 'Unique identifier of the report',
	},

	// ----------------------------------
	//         Report Name Field
	// ----------------------------------
	{
		displayName: 'Report Name',
		name: 'reportName',
		type: 'string',
		required: true,
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['create'],
			},
		},
		default: '',
		description: 'Name for the report configuration',
	},

	// ----------------------------------
	//         Create Fields
	// ----------------------------------
	{
		displayName: 'Additional Fields',
		name: 'additionalFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['create'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'Description of the report',
			},
			{
				displayName: 'Vault IDs',
				name: 'vaultIds',
				type: 'string',
				default: '',
				description: 'Comma-separated list of vault IDs to include',
			},
			{
				displayName: 'Asset Types',
				name: 'assetTypes',
				type: 'multiOptions',
				options: [
					{ name: 'All', value: 'all' },
					{ name: 'Crypto', value: 'crypto' },
					{ name: 'Tokens', value: 'tokens' },
					{ name: 'NFTs', value: 'nfts' },
					{ name: 'Stablecoins', value: 'stablecoins' },
				],
				default: ['all'],
				description: 'Asset types to include in report',
			},
			{
				displayName: 'Date Range Type',
				name: 'dateRangeType',
				type: 'options',
				options: [
					{ name: 'Last 24 Hours', value: '24h' },
					{ name: 'Last 7 Days', value: '7d' },
					{ name: 'Last 30 Days', value: '30d' },
					{ name: 'Last 90 Days', value: '90d' },
					{ name: 'Year to Date', value: 'ytd' },
					{ name: 'Custom', value: 'custom' },
				],
				default: '30d',
				description: 'Predefined date range for report',
			},
			{
				displayName: 'Include Sub-Accounts',
				name: 'includeSubAccounts',
				type: 'boolean',
				default: true,
				description: 'Whether to include sub-account data',
			},
			{
				displayName: 'Currency',
				name: 'currency',
				type: 'options',
				options: [
					{ name: 'USD', value: 'USD' },
					{ name: 'EUR', value: 'EUR' },
					{ name: 'GBP', value: 'GBP' },
					{ name: 'BTC', value: 'BTC' },
					{ name: 'ETH', value: 'ETH' },
				],
				default: 'USD',
				description: 'Base currency for report values',
			},
			{
				displayName: 'Timezone',
				name: 'timezone',
				type: 'string',
				default: 'UTC',
				description: 'Timezone for date/time values (e.g., America/New_York)',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Comma-separated tags for categorization',
			},
		],
	},

	// ----------------------------------
	//         Schedule Fields
	// ----------------------------------
	{
		displayName: 'Schedule Frequency',
		name: 'scheduleFrequency',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['schedule'],
			},
		},
		options: [
			{ name: 'Hourly', value: 'hourly' },
			{ name: 'Daily', value: 'daily' },
			{ name: 'Weekly', value: 'weekly' },
			{ name: 'Monthly', value: 'monthly' },
			{ name: 'Quarterly', value: 'quarterly' },
			{ name: 'Custom Cron', value: 'cron' },
		],
		default: 'daily',
		description: 'How often to generate the report',
	},
	{
		displayName: 'Schedule Options',
		name: 'scheduleOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['schedule'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Time of Day',
				name: 'timeOfDay',
				type: 'string',
				default: '00:00',
				description: 'Time to run (HH:MM format)',
			},
			{
				displayName: 'Day of Week',
				name: 'dayOfWeek',
				type: 'options',
				options: [
					{ name: 'Monday', value: 1 },
					{ name: 'Tuesday', value: 2 },
					{ name: 'Wednesday', value: 3 },
					{ name: 'Thursday', value: 4 },
					{ name: 'Friday', value: 5 },
					{ name: 'Saturday', value: 6 },
					{ name: 'Sunday', value: 0 },
				],
				default: 1,
				description: 'Day of week for weekly reports',
			},
			{
				displayName: 'Day of Month',
				name: 'dayOfMonth',
				type: 'number',
				typeOptions: {
					minValue: 1,
					maxValue: 31,
				},
				default: 1,
				description: 'Day of month for monthly reports',
			},
			{
				displayName: 'Cron Expression',
				name: 'cronExpression',
				type: 'string',
				default: '0 0 * * *',
				description: 'Custom cron expression for scheduling',
			},
			{
				displayName: 'Timezone',
				name: 'timezone',
				type: 'string',
				default: 'UTC',
				description: 'Timezone for schedule',
			},
			{
				displayName: 'Email Recipients',
				name: 'emailRecipients',
				type: 'string',
				default: '',
				description: 'Comma-separated email addresses for delivery',
			},
			{
				displayName: 'Output Format',
				name: 'outputFormat',
				type: 'options',
				options: [
					{ name: 'PDF', value: 'pdf' },
					{ name: 'Excel', value: 'xlsx' },
					{ name: 'CSV', value: 'csv' },
					{ name: 'JSON', value: 'json' },
				],
				default: 'pdf',
				description: 'Format for generated reports',
			},
			{
				displayName: 'Enabled',
				name: 'enabled',
				type: 'boolean',
				default: true,
				description: 'Whether the schedule is active',
			},
		],
	},

	// ----------------------------------
	//         Export Fields
	// ----------------------------------
	{
		displayName: 'Export Format',
		name: 'exportFormat',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['export'],
			},
		},
		options: [
			{ name: 'PDF', value: 'pdf' },
			{ name: 'Excel (XLSX)', value: 'xlsx' },
			{ name: 'CSV', value: 'csv' },
			{ name: 'JSON', value: 'json' },
			{ name: 'XML', value: 'xml' },
			{ name: 'HTML', value: 'html' },
		],
		default: 'pdf',
		description: 'Format for exported report',
	},
	{
		displayName: 'Export Options',
		name: 'exportOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['export'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Include Headers',
				name: 'includeHeaders',
				type: 'boolean',
				default: true,
				description: 'Whether to include column headers',
			},
			{
				displayName: 'Include Summary',
				name: 'includeSummary',
				type: 'boolean',
				default: true,
				description: 'Whether to include summary section',
			},
			{
				displayName: 'Include Charts',
				name: 'includeCharts',
				type: 'boolean',
				default: true,
				description: 'Whether to include charts and graphs',
			},
			{
				displayName: 'Compress Output',
				name: 'compress',
				type: 'boolean',
				default: false,
				description: 'Whether to compress the output file',
			},
			{
				displayName: 'Password Protected',
				name: 'passwordProtected',
				type: 'boolean',
				default: false,
				description: 'Whether to password protect the file',
			},
		],
	},

	// ----------------------------------
	//         Dashboard Fields
	// ----------------------------------
	{
		displayName: 'Dashboard Type',
		name: 'dashboardType',
		type: 'options',
		required: true,
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['getDashboard'],
			},
		},
		options: [
			{ name: 'Overview', value: 'overview' },
			{ name: 'Portfolio', value: 'portfolio' },
			{ name: 'Transactions', value: 'transactions' },
			{ name: 'Performance', value: 'performance' },
			{ name: 'Risk', value: 'risk' },
			{ name: 'Compliance', value: 'compliance' },
			{ name: 'Operations', value: 'operations' },
		],
		default: 'overview',
		description: 'Type of dashboard to retrieve',
	},
	{
		displayName: 'Dashboard Options',
		name: 'dashboardOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['getDashboard'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Time Period',
				name: 'timePeriod',
				type: 'options',
				options: [
					{ name: 'Real-Time', value: 'realtime' },
					{ name: 'Last Hour', value: '1h' },
					{ name: 'Last 24 Hours', value: '24h' },
					{ name: 'Last 7 Days', value: '7d' },
					{ name: 'Last 30 Days', value: '30d' },
				],
				default: '24h',
				description: 'Time period for dashboard data',
			},
			{
				displayName: 'Vault IDs',
				name: 'vaultIds',
				type: 'string',
				default: '',
				description: 'Filter by specific vault IDs',
			},
			{
				displayName: 'Include Alerts',
				name: 'includeAlerts',
				type: 'boolean',
				default: true,
				description: 'Whether to include active alerts',
			},
			{
				displayName: 'Include Metrics',
				name: 'includeMetrics',
				type: 'boolean',
				default: true,
				description: 'Whether to include key metrics',
			},
		],
	},

	// ----------------------------------
	//         Generate Options
	// ----------------------------------
	{
		displayName: 'Generate Options',
		name: 'generateOptions',
		type: 'collection',
		placeholder: 'Add Option',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['generate'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Start Date',
				name: 'startDate',
				type: 'dateTime',
				default: '',
				description: 'Start date for report data',
			},
			{
				displayName: 'End Date',
				name: 'endDate',
				type: 'dateTime',
				default: '',
				description: 'End date for report data',
			},
			{
				displayName: 'Output Format',
				name: 'outputFormat',
				type: 'options',
				options: [
					{ name: 'PDF', value: 'pdf' },
					{ name: 'Excel', value: 'xlsx' },
					{ name: 'CSV', value: 'csv' },
					{ name: 'JSON', value: 'json' },
				],
				default: 'json',
				description: 'Format for generated report',
			},
			{
				displayName: 'Async',
				name: 'async',
				type: 'boolean',
				default: false,
				description: 'Whether to generate asynchronously',
			},
			{
				displayName: 'Notify on Complete',
				name: 'notifyOnComplete',
				type: 'boolean',
				default: false,
				description: 'Whether to send notification when complete',
			},
		],
	},

	// ----------------------------------
	//         Update Fields
	// ----------------------------------
	{
		displayName: 'Update Fields',
		name: 'updateFields',
		type: 'collection',
		placeholder: 'Add Field',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['update'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Report Name',
				name: 'name',
				type: 'string',
				default: '',
				description: 'New name for the report',
			},
			{
				displayName: 'Description',
				name: 'description',
				type: 'string',
				default: '',
				description: 'New description for the report',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'Active', value: 'active' },
					{ name: 'Paused', value: 'paused' },
					{ name: 'Archived', value: 'archived' },
				],
				default: 'active',
				description: 'Report status',
			},
			{
				displayName: 'Vault IDs',
				name: 'vaultIds',
				type: 'string',
				default: '',
				description: 'Updated vault IDs',
			},
			{
				displayName: 'Tags',
				name: 'tags',
				type: 'string',
				default: '',
				description: 'Updated tags',
			},
		],
	},

	// ----------------------------------
	//         Get Many Filters
	// ----------------------------------
	{
		displayName: 'Return All',
		name: 'returnAll',
		type: 'boolean',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['getMany', 'getScheduled'],
			},
		},
		default: false,
		description: 'Whether to return all results or only up to a given limit',
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['getMany', 'getScheduled'],
				returnAll: [false],
			},
		},
		typeOptions: {
			minValue: 1,
			maxValue: 100,
		},
		default: 50,
		description: 'Max number of results to return',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		displayOptions: {
			show: {
				resource: ['reporting'],
				operation: ['getMany'],
			},
		},
		default: {},
		options: [
			{
				displayName: 'Report Type',
				name: 'reportType',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Position', value: 'position' },
					{ name: 'Transaction', value: 'transaction' },
					{ name: 'Audit', value: 'audit' },
					{ name: 'Compliance', value: 'compliance' },
					{ name: 'Tax', value: 'tax' },
					{ name: 'Performance', value: 'performance' },
				],
				default: '',
				description: 'Filter by report type',
			},
			{
				displayName: 'Status',
				name: 'status',
				type: 'options',
				options: [
					{ name: 'All', value: '' },
					{ name: 'Active', value: 'active' },
					{ name: 'Paused', value: 'paused' },
					{ name: 'Archived', value: 'archived' },
				],
				default: '',
				description: 'Filter by status',
			},
			{
				displayName: 'Created After',
				name: 'createdAfter',
				type: 'dateTime',
				default: '',
				description: 'Filter by creation date',
			},
			{
				displayName: 'Search',
				name: 'search',
				type: 'string',
				default: '',
				description: 'Search by name or description',
			},
		],
	},
];

export async function execute(
	this: IExecuteFunctions,
	operation: string,
	index: number,
): Promise<IDataObject | IDataObject[]> {
	const client = await createApiClient(this);

	switch (operation) {
		case 'create': {
			const reportType = this.getNodeParameter('reportType', index) as string;
			const reportName = this.getNodeParameter('reportName', index) as string;
			const additionalFields = this.getNodeParameter('additionalFields', index) as IDataObject;

			const body: IDataObject = {
				type: reportType,
				name: reportName,
				...additionalFields,
			};

			if (additionalFields.vaultIds) {
				body.vaultIds = (additionalFields.vaultIds as string).split(',').map((id) => id.trim());
			}
			if (additionalFields.tags) {
				body.tags = (additionalFields.tags as string).split(',').map((tag) => tag.trim());
			}

			return await client.post(ENDPOINTS.REPORTS.BASE, body);
		}

		case 'get': {
			const reportId = this.getNodeParameter('reportId', index) as string;
			return await client.get(ENDPOINTS.REPORTS.BY_ID(reportId));
		}

		case 'getMany': {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const filters = this.getNodeParameter('filters', index) as IDataObject;
			const params: IDataObject = { ...filters };

			if (!returnAll) {
				params.limit = this.getNodeParameter('limit', index) as number;
			}

			const response = await client.get(ENDPOINTS.REPORTS.BASE, params);
			const reports = (response.reports || response.data || response) as IDataObject[];

			if (returnAll) {
				return reports;
			}
			return reports;
		}

		case 'update': {
			const reportId = this.getNodeParameter('reportId', index) as string;
			const updateFields = this.getNodeParameter('updateFields', index) as IDataObject;

			if (updateFields.vaultIds) {
				updateFields.vaultIds = (updateFields.vaultIds as string).split(',').map((id) => id.trim());
			}
			if (updateFields.tags) {
				updateFields.tags = (updateFields.tags as string).split(',').map((tag) => tag.trim());
			}

			return await client.patch(ENDPOINTS.REPORTS.BY_ID(reportId), updateFields);
		}

		case 'delete': {
			const reportId = this.getNodeParameter('reportId', index) as string;
			await client.delete(ENDPOINTS.REPORTS.BY_ID(reportId));
			return { success: true, reportId };
		}

		case 'generate': {
			const reportId = this.getNodeParameter('reportId', index) as string;
			const reportType = this.getNodeParameter('reportType', index) as string;
			const generateOptions = this.getNodeParameter('generateOptions', index) as IDataObject;

			const body: IDataObject = {
				type: reportType,
				...generateOptions,
			};

			return await client.post(ENDPOINTS.REPORTS.GENERATE(reportId), body);
		}

		case 'schedule': {
			const reportId = this.getNodeParameter('reportId', index) as string;
			const frequency = this.getNodeParameter('scheduleFrequency', index) as string;
			const scheduleOptions = this.getNodeParameter('scheduleOptions', index) as IDataObject;

			const body: IDataObject = {
				frequency,
				...scheduleOptions,
			};

			if (scheduleOptions.emailRecipients) {
				body.emailRecipients = (scheduleOptions.emailRecipients as string)
					.split(',')
					.map((email) => email.trim());
			}

			return await client.post(ENDPOINTS.REPORTS.SCHEDULE(reportId), body);
		}

		case 'getScheduled': {
			const returnAll = this.getNodeParameter('returnAll', index) as boolean;
			const params: IDataObject = {};

			if (!returnAll) {
				params.limit = this.getNodeParameter('limit', index) as number;
			}

			const response = await client.get(ENDPOINTS.REPORTS.SCHEDULED, params);
			return (response.schedules || response.data || response) as IDataObject[];
		}

		case 'getData': {
			const reportId = this.getNodeParameter('reportId', index) as string;
			return await client.get(ENDPOINTS.REPORTS.DATA(reportId));
		}

		case 'export': {
			const reportId = this.getNodeParameter('reportId', index) as string;
			const exportFormat = this.getNodeParameter('exportFormat', index) as string;
			const exportOptions = this.getNodeParameter('exportOptions', index) as IDataObject;

			const body: IDataObject = {
				format: exportFormat,
				...exportOptions,
			};

			return await client.post(ENDPOINTS.REPORTS.EXPORT(reportId), body);
		}

		case 'getDashboard': {
			const dashboardType = this.getNodeParameter('dashboardType', index) as string;
			const dashboardOptions = this.getNodeParameter('dashboardOptions', index) as IDataObject;

			const params: IDataObject = {
				type: dashboardType,
				...dashboardOptions,
			};

			if (dashboardOptions.vaultIds) {
				params.vaultIds = (dashboardOptions.vaultIds as string).split(',').map((id) => id.trim());
			}

			return await client.get(ENDPOINTS.REPORTS.DASHBOARD, params);
		}

		default:
			throw new Error(`Unknown operation: ${operation}`);
	}
}
