import type { INodeProperties } from 'n8n-workflow';

export const companyOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['company'] } },
	options: [
		{
			name: 'Get',
			value: 'get',
			action: 'Get a company profile',
			description: 'Retrieve a LinkedIn company page by URL, slug, or numeric ID',
		},
		{
			name: 'Bulk Get',
			value: 'bulkGet',
			action: 'Get multiple company profiles',
			description: 'Retrieve up to 10 company profiles in a single call',
		},
		{
			name: 'Get Posts',
			value: 'getPosts',
			action: 'Get company posts',
			description: 'Retrieve a company\'s recent LinkedIn posts (~30)',
		},
	],
	default: 'get',
};

export const companyFields: INodeProperties[] = [
	// --- Get ---
	{
		displayName: 'Identifier',
		name: 'identifier',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://linkedin.com/company/acme-corp',
		description: 'LinkedIn company URL, slug, or numeric ID',
		displayOptions: { show: { resource: ['company'], operation: ['get'] } },
	},

	// --- Bulk Get ---
	{
		displayName: 'Identifiers',
		name: 'identifiers',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://linkedin.com/company/acme, https://linkedin.com/company/globex',
		description: 'Comma-separated LinkedIn company URLs, slugs, or IDs (max 10)',
		displayOptions: { show: { resource: ['company'], operation: ['bulkGet'] } },
	},

	// --- Get Posts ---
	{
		displayName: 'Identifier',
		name: 'identifier',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://linkedin.com/company/acme-corp',
		description: 'LinkedIn company URL, slug, or numeric ID',
		displayOptions: { show: { resource: ['company'], operation: ['getPosts'] } },
	},
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		description: 'Pagination cursor from a previous response',
		displayOptions: { show: { resource: ['company'], operation: ['getPosts'] } },
	},
];
