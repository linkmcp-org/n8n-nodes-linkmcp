import type { INodeProperties } from 'n8n-workflow';

export const messageOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['message'] } },
	options: [
		{
			name: 'List Conversations',
			value: 'listConversations',
			action: 'List conversations',
			description: 'Browse your LinkedIn DM inbox',
		},
		{
			name: 'Get Messages',
			value: 'getMessages',
			action: 'Get conversation messages',
			description: 'Read messages in a specific conversation',
		},
		{
			name: 'Send',
			value: 'send',
			action: 'Send a message',
			description: 'Send a LinkedIn message or InMail',
		},
	],
	default: 'listConversations',
};

export const messageFields: INodeProperties[] = [
	// --- List Conversations ---
	{
		displayName: 'Filters',
		name: 'conversationFilters',
		type: 'collection',
		placeholder: 'Add Filter',
		default: {},
		displayOptions: { show: { resource: ['message'], operation: ['listConversations'] } },
		options: [
			{
				displayName: 'Participant',
				name: 'participant',
				type: 'string',
				default: '',
				description: 'Find conversations with a specific person (URL, slug, or URN)',
			},
			{
				displayName: 'Unread Only',
				name: 'unreadOnly',
				type: 'boolean',
				default: false,
				description: 'Whether to only return unread conversations',
			},
			{
				displayName: 'After',
				name: 'after',
				type: 'dateTime',
				default: '',
				description: 'Only return conversations after this date',
			},
			{
				displayName: 'Before',
				name: 'before',
				type: 'dateTime',
				default: '',
				description: 'Only return conversations before this date',
			},
		],
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 250 },
		default: 20,
		description: 'Max number of conversations to return',
		displayOptions: { show: { resource: ['message'], operation: ['listConversations'] } },
	},
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		description: 'Pagination cursor from a previous response',
		displayOptions: { show: { resource: ['message'], operation: ['listConversations'] } },
	},

	// --- Get Messages ---
	{
		displayName: 'Chat ID',
		name: 'chatId',
		type: 'string',
		required: true,
		default: '',
		description: 'Conversation ID from the "List Conversations" operation',
		displayOptions: { show: { resource: ['message'], operation: ['getMessages'] } },
	},
	{
		displayName: 'Limit',
		name: 'limit',
		type: 'number',
		typeOptions: { minValue: 1, maxValue: 250 },
		default: 50,
		description: 'Max number of messages to return',
		displayOptions: { show: { resource: ['message'], operation: ['getMessages'] } },
	},
	{
		displayName: 'Cursor',
		name: 'cursor',
		type: 'string',
		default: '',
		description: 'Pagination cursor from a previous response',
		displayOptions: { show: { resource: ['message'], operation: ['getMessages'] } },
	},

	// --- Send ---
	{
		displayName: 'Send To',
		name: 'sendTo',
		type: 'options',
		options: [
			{
				name: 'New Conversation',
				value: 'new',
				description: 'Start a new conversation with someone',
			},
			{
				name: 'Existing Conversation',
				value: 'existing',
				description: 'Reply in an existing conversation',
			},
		],
		default: 'new',
		displayOptions: { show: { resource: ['message'], operation: ['send'] } },
	},
	{
		displayName: 'Recipient',
		name: 'recipientIdentifier',
		type: 'string',
		required: true,
		default: '',
		placeholder: 'https://linkedin.com/in/john-doe',
		description: 'LinkedIn profile URL, slug, or URN of the recipient',
		displayOptions: { show: { resource: ['message'], operation: ['send'], sendTo: ['new'] } },
	},
	{
		displayName: 'Chat ID',
		name: 'chatId',
		type: 'string',
		required: true,
		default: '',
		description: 'Conversation ID to reply to',
		displayOptions: {
			show: { resource: ['message'], operation: ['send'], sendTo: ['existing'] },
		},
	},
	{
		displayName: 'Message Text',
		name: 'text',
		type: 'string',
		typeOptions: { rows: 4 },
		required: true,
		default: '',
		description: 'The message to send',
		displayOptions: { show: { resource: ['message'], operation: ['send'] } },
	},
	{
		displayName: 'Send as InMail',
		name: 'inmail',
		type: 'boolean',
		default: false,
		description: 'Whether to send as InMail (for non-connections, requires Premium)',
		displayOptions: { show: { resource: ['message'], operation: ['send'], sendTo: ['new'] } },
	},
	{
		displayName: 'LinkedIn API',
		name: 'linkedinApi',
		type: 'options',
		options: [
			{ name: 'Classic', value: 'classic' },
			{ name: 'Sales Navigator', value: 'sales_navigator' },
			{ name: 'Recruiter', value: 'recruiter' },
		],
		default: 'classic',
		description: 'Which LinkedIn API to use for sending',
		displayOptions: { show: { resource: ['message'], operation: ['send'], sendTo: ['new'] } },
	},
];
