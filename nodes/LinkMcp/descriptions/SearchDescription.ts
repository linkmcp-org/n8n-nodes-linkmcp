import type { INodeProperties } from 'n8n-workflow';

export const searchOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['search'] } },
	options: [
		{
			name: 'Search People',
			value: 'searchPeople',
			action: 'Search LinkedIn for people',
			description: 'Search for people by keywords and filters',
		},
		{
			name: 'Search Sales Navigator',
			value: 'searchSalesNavigator',
			action: 'Search via Sales Navigator',
			description: 'Advanced search using LinkedIn Sales Navigator (requires subscription)',
		},
	],
	default: 'searchPeople',
};

const sharedSearchFields: INodeProperties[] = [
	{
		displayName: 'Keywords',
		name: 'keywords',
		type: 'string',
		default: '',
		description: 'Search keywords (mutually exclusive with Search URL)',
	},
	{
		displayName: 'Search URL',
		name: 'url',
		type: 'string',
		default: '',
		description: 'Full LinkedIn search URL (mutually exclusive with Keywords)',
	},
	{
		displayName: 'Filters',
		name: 'filters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		options: [
			{
				displayName: 'Location',
				name: 'location',
				type: 'string',
				default: '',
				description: 'Comma-separated location names',
			},
			{
				displayName: 'Industry',
				name: 'industry',
				type: 'string',
				default: '',
				description: 'Comma-separated industry names',
			},
			{
				displayName: 'Seniority',
				name: 'seniority',
				type: 'multiOptions',
				options: [
					{ name: 'Unpaid', value: 1 },
					{ name: 'Training', value: 2 },
					{ name: 'Entry', value: 3 },
					{ name: 'Senior', value: 4 },
					{ name: 'Manager', value: 5 },
					{ name: 'Director', value: 6 },
					{ name: 'VP', value: 7 },
					{ name: 'CXO', value: 8 },
					{ name: 'Partner', value: 9 },
					{ name: 'Owner', value: 10 },
				],
				default: [],
				description: 'Seniority levels to filter by',
			},
			{
				displayName: 'Network Distance',
				name: 'networkDistance',
				type: 'multiOptions',
				options: [
					{ name: '1st Degree', value: 1 },
					{ name: '2nd Degree', value: 2 },
					{ name: '3rd+ Degree', value: 3 },
				],
				default: [],
				description: 'Connection degree to filter by',
			},
			{
				displayName: 'Profile Language',
				name: 'profileLanguage',
				type: 'string',
				default: '',
				description: 'Comma-separated ISO language codes (e.g., en, de, fr)',
			},
		],
	},
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		description: 'Pagination cursor from a previous response',
	},
];

export const searchFields: INodeProperties[] = [
	// Search People fields
	...sharedSearchFields.map((field) => ({
		...field,
		displayOptions: { show: { resource: ['search'], operation: ['searchPeople'] } },
	})),

	// Sales Navigator fields (same + extra filters)
	...sharedSearchFields.map((field) => ({
		...field,
		displayOptions: { show: { resource: ['search'], operation: ['searchSalesNavigator'] } },
	})),

	// Sales Navigator-only filters
	{
		displayName: 'Job Function',
		name: 'function',
		type: 'multiOptions',
		options: [
			{ name: 'Accounting', value: 1 },
			{ name: 'Administrative', value: 2 },
			{ name: 'Arts and Design', value: 3 },
			{ name: 'Business Development', value: 4 },
			{ name: 'Community and Social Services', value: 5 },
			{ name: 'Consulting', value: 6 },
			{ name: 'Education', value: 7 },
			{ name: 'Engineering', value: 8 },
			{ name: 'Entrepreneurship', value: 9 },
			{ name: 'Finance', value: 10 },
			{ name: 'Healthcare Services', value: 11 },
			{ name: 'Human Resources', value: 12 },
			{ name: 'Information Technology', value: 13 },
			{ name: 'Legal', value: 14 },
			{ name: 'Marketing', value: 15 },
			{ name: 'Media and Communication', value: 16 },
			{ name: 'Military and Protective Services', value: 17 },
			{ name: 'Operations', value: 18 },
			{ name: 'Product Management', value: 19 },
			{ name: 'Program and Project Management', value: 20 },
			{ name: 'Purchasing', value: 21 },
			{ name: 'Quality Assurance', value: 22 },
			{ name: 'Real Estate', value: 23 },
			{ name: 'Research', value: 24 },
			{ name: 'Sales', value: 25 },
			{ name: 'Support', value: 26 },
		],
		default: [],
		description: 'Filter by job function (Sales Navigator only)',
		displayOptions: { show: { resource: ['search'], operation: ['searchSalesNavigator'] } },
	},
	{
		displayName: 'Tenure (JSON)',
		name: 'tenure',
		type: 'string',
		default: '',
		description:
			'JSON array of tenure ranges, e.g. [{"min":1,"max":3}] for 1-3 years at current company',
		displayOptions: { show: { resource: ['search'], operation: ['searchSalesNavigator'] } },
	},
];
