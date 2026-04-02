import type { INodeProperties } from 'n8n-workflow';

export const profileOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['profile'] } },
	options: [
		{
			name: 'Get',
			value: 'get',
			action: 'Get a LinkedIn profile',
			description: 'Retrieve a person\'s full LinkedIn profile by URL, slug, or URN',
		},
		{
			name: 'Bulk Get',
			value: 'bulkGet',
			action: 'Get multiple LinkedIn profiles',
			description: 'Retrieve up to 10 profiles in a single call',
		},
	],
	default: 'get',
};

export const profileFields: INodeProperties[] = [
	// --- Get ---
	{
		displayName: 'Identifier',
		name: 'identifier',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://linkedin.com/in/john-doe',
		description: 'LinkedIn profile URL, public ID (slug), or URN',
		displayOptions: { show: { resource: ['profile'], operation: ['get'] } },
	},
	{
		displayName: 'Include Company Details',
		name: 'includeMainCompanyDetails',
		type: 'boolean',
		default: true,
		description: 'Whether to fetch organization details from most recent experience',
		displayOptions: { show: { resource: ['profile'], operation: ['get'] } },
	},

	// --- Bulk Get ---
	{
		displayName: 'Identifiers',
		name: 'identifiers',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://linkedin.com/in/john-doe, https://linkedin.com/in/jane-smith',
		description: 'Comma-separated LinkedIn profile URLs, slugs, or URNs (max 10)',
		displayOptions: { show: { resource: ['profile'], operation: ['bulkGet'] } },
	},
];
