import type { INodeProperties } from 'n8n-workflow';

export const connectionOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['connection'] } },
	options: [
		{
			name: 'Get Many',
			value: 'getAll',
			action: 'Get connections',
			description: 'List your 1st-degree LinkedIn connections',
		},
		{
			name: 'List Requests',
			value: 'listRequests',
			action: 'List connection requests',
			description: 'List pending connection requests (sent or received)',
		},
		{
			name: 'Send Request',
			value: 'sendRequest',
			action: 'Send a connection request',
			description: 'Send a LinkedIn connection request',
		},
		{
			name: 'Respond to Request',
			value: 'respondToRequest',
			action: 'Respond to a connection request',
			description: 'Accept or decline a pending connection request',
		},
	],
	default: 'getAll',
};

export const connectionFields: INodeProperties[] = [
	// --- Get All ---
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
		description: 'Max number of connections to return',
		displayOptions: { show: { resource: ['connection'], operation: ['getAll'] } },
	},
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		description: 'Pagination cursor from a previous response',
		displayOptions: { show: { resource: ['connection'], operation: ['getAll'] } },
	},

	// --- List Requests ---
	{
		displayName: 'Direction',
		name: 'direction',
		type: 'options',
		options: [
			{ name: 'Sent', value: 'sent' },
			{ name: 'Received', value: 'received' },
		],
		default: 'sent',
		description: 'Whether to list sent or received requests',
		displayOptions: { show: { resource: ['connection'], operation: ['listRequests'] } },
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 100 },
		default: 50,
		description: 'Max number of requests to return',
		displayOptions: { show: { resource: ['connection'], operation: ['listRequests'] } },
	},
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		description: 'Pagination cursor from a previous response',
		displayOptions: { show: { resource: ['connection'], operation: ['listRequests'] } },
	},

	// --- Send Request ---
	{
		displayName: 'Identifier',
		name: 'identifier',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://linkedin.com/in/john-doe',
		description: 'LinkedIn profile URL, slug, or URN of the person to connect with',
		displayOptions: { show: { resource: ['connection'], operation: ['sendRequest'] } },
	},
	{
		displayName: 'Message',
		name: 'message',
		type: 'string',
		typeOptions: { rows: 3 },
		default: '',
		description: 'Optional personalized note (max 300 characters)',
		displayOptions: { show: { resource: ['connection'], operation: ['sendRequest'] } },
	},

	// --- Respond to Request ---
	{
		displayName: 'Connection Request ID',
		name: 'connectionRequestId',
		type: 'string',
		required: true,
		default: '',
		description: 'ID from the "List Requests" operation',
		displayOptions: { show: { resource: ['connection'], operation: ['respondToRequest'] } },
	},
	{
		displayName: 'Shared Secret',
		name: 'sharedSecret',
		type: 'string',
		required: true,
		default: '',
		description: 'Shared secret from the "List Requests" operation',
		displayOptions: { show: { resource: ['connection'], operation: ['respondToRequest'] } },
	},
	{
		displayName: 'Action',
		name: 'action',
		type: 'options',
		options: [
			{ name: 'Accept', value: 'accept' },
			{ name: 'Decline', value: 'decline' },
		],
		required: true,
		default: 'accept',
		displayOptions: { show: { resource: ['connection'], operation: ['respondToRequest'] } },
	},
];
