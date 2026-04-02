import type {
	IDataObject,
	IExecuteFunctions,
	IHttpRequestMethods,
	IHttpRequestOptions,
} from 'n8n-workflow';
import { NodeApiError } from 'n8n-workflow';

interface McpToolResult {
	content: Array<{ type: string; text: string }>;
	isError?: boolean;
}

interface McpResponse {
	result?: McpToolResult;
	error?: { code: number; message: string; data?: unknown };
}

export async function callMcpTool(
	this: IExecuteFunctions,
	toolName: string,
	args: IDataObject,
	itemIndex: number,
): Promise<IDataObject> {
	const options: IHttpRequestOptions = {
		method: 'POST' as IHttpRequestMethods,
		url: '={{$credentials.serverUrl}}/api/mcp',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			jsonrpc: '2.0',
			id: itemIndex + 1,
			method: 'tools/call',
			params: {
				name: toolName,
				arguments: args,
			},
		}),
		returnFullResponse: true,
		json: false,
	};

	const response = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'linkMcpApi',
		options,
	);
	const body: McpResponse =
		typeof response.body === 'string' ? JSON.parse(response.body) : response.body;

	if (body.error) {
		throw new NodeApiError(this.getNode(), {}, {
			message: body.error.message,
			description: `MCP error ${body.error.code}: ${body.error.message}`,
			itemIndex,
		});
	}

	const result = body.result;
	if (!result) {
		throw new NodeApiError(this.getNode(), {}, {
			message: 'Empty response from LinkMCP',
			itemIndex,
		});
	}

	if (result.isError) {
		const errorText = result.content?.[0]?.text ?? 'Unknown tool error';
		throw new NodeApiError(this.getNode(), {}, {
			message: errorText,
			description: `LinkMCP tool "${toolName}" returned an error`,
			itemIndex,
		});
	}

	const text = result.content?.[0]?.text ?? '{}';
	try {
		return JSON.parse(text) as IDataObject;
	} catch {
		return { result: text } as IDataObject;
	}
}
