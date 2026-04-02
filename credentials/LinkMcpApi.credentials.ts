import type {
	IAuthenticateGeneric,
	Icon,
	ICredentialTestRequest,
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class LinkMcpApi implements ICredentialType {
	name = 'linkMcpApi';

	displayName = 'LinkMCP API';

	icon: Icon = 'file:../icons/linkmcp.svg';

	properties: INodeProperties[] = [
		{
			displayName:
				'1. <a href="https://app.linkmcp.io/login?from=n8n" target="_blank">Create a free account</a> &nbsp;&nbsp;→&nbsp;&nbsp; 2. Connect your LinkedIn &nbsp;&nbsp;→&nbsp;&nbsp; 3. Settings → API Tokens → Create',
			name: 'notice',
			type: 'notice',
			default: '',
		},
		{
			displayName: 'Personal Access Token',
			name: 'apiKey',
			type: 'string',
			typeOptions: { password: true },
			default: '',
			required: true,
			placeholder: 'lmcp_...',
			description:
				'Paste the token you created in LinkMCP Settings → API Tokens',
		},
		{
			displayName: 'Server URL',
			name: 'serverUrl',
			type: 'hidden',
			default: 'https://app.linkmcp.io',
		},
	];

	authenticate: IAuthenticateGeneric = {
		type: 'generic',
		properties: {
			headers: {
				Authorization: '=Bearer {{$credentials.apiKey}}',
			},
		},
	};

	test: ICredentialTestRequest = {
		request: {
			method: 'POST',
			baseURL: '={{$credentials.serverUrl}}',
			url: '/api/mcp',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				jsonrpc: '2.0',
				id: 1,
				method: 'tools/call',
				params: {
					name: 'linkedin_who_am_i',
					arguments: {},
				},
			}),
		},
	};
}
