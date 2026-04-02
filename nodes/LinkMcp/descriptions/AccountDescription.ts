import type { INodeProperties } from 'n8n-workflow';

export const accountOperations: INodeProperties = {
	displayName: 'Operation',
	name: 'operation',
	type: 'options',
	noDataExpression: true,
	displayOptions: { show: { resource: ['account'] } },
	options: [
		{
			name: 'Who Am I',
			value: 'whoAmI',
			action: 'Get account info',
			description: 'Get your connected LinkedIn account details',
		},
	],
	default: 'whoAmI',
};

export const accountFields: INodeProperties[] = [];
