import type { INodeProperties } from 'n8n-workflow';

export const enrichmentOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['enrichment'] } },
	options: [
		{
			name: 'Find Email',
			value: 'findEmail',
			action: 'Find a work email',
			description: 'Find a person\'s work email address',
		},
		{
			name: 'Find Mobile',
			value: 'findMobile',
			action: 'Find a mobile number',
			description: 'Find a person\'s mobile phone number',
		},
		{
			name: 'Validate Email',
			value: 'validateEmail',
			action: 'Validate an email',
			description: 'Check if an email address is deliverable',
		},
	],
	default: 'findEmail',
};

export const enrichmentFields: INodeProperties[] = [
	// --- Find Email ---
	{
		displayName: 'First Name',
		name: 'firstName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['enrichment'], operation: ['findEmail'] } },
	},
	{
		displayName: 'Last Name',
		name: 'lastName',
		type: 'string',
		required: true,
		default: '',
		displayOptions: { show: { resource: ['enrichment'], operation: ['findEmail'] } },
	},
	{
		displayName: 'Company Domain',
		name: 'companyDomain',
		type: 'string',
		default: '',
		placeholder: 'acme.com',
		description: 'Company domain (recommended for accuracy)',
		displayOptions: { show: { resource: ['enrichment'], operation: ['findEmail'] } },
	},
	{
		displayName: 'Company Name',
		name: 'companyName',
		type: 'string',
		default: '',
		description: 'Company name (use domain if available for better results)',
		displayOptions: { show: { resource: ['enrichment'], operation: ['findEmail'] } },
	},

	// --- Find Mobile ---
	{
		displayName: 'LinkedIn Profile',
		name: 'linkedinProfile',
		type: 'string',
		default: '',
		placeholder: 'https://linkedin.com/in/john-doe',
		description: 'LinkedIn profile URL, slug, or URN (provide this or Email)',
		displayOptions: { show: { resource: ['enrichment'], operation: ['findMobile'] } },
	},
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		default: '',
		placeholder: 'john@acme.com',
		description: 'Email address (provide this or LinkedIn Profile)',
		displayOptions: { show: { resource: ['enrichment'], operation: ['findMobile'] } },
	},

	// --- Validate Email ---
	{
		displayName: 'Email',
		name: 'email',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'john@acme.com',
		description: 'Email address to validate',
		displayOptions: { show: { resource: ['enrichment'], operation: ['validateEmail'] } },
	},
];
