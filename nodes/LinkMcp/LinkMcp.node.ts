import type {
	IDataObject,
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeConnectionTypes } from 'n8n-workflow';

import { callMcpTool } from './transport';

import { profileOperations, profileFields } from './descriptions/ProfileDescription';
import { companyOperations, companyFields } from './descriptions/CompanyDescription';
import { postOperations, postFields } from './descriptions/PostDescription';
import { searchOperations, searchFields } from './descriptions/SearchDescription';
import { connectionOperations, connectionFields } from './descriptions/ConnectionDescription';
import { messageOperations, messageFields } from './descriptions/MessageDescription';
import { enrichmentOperations, enrichmentFields } from './descriptions/EnrichmentDescription';
import { accountOperations, accountFields } from './descriptions/AccountDescription';

function splitCsv(value: string): string[] {
	return value
		.split(',')
		.map((s) => s.trim())
		.filter(Boolean);
}

function buildToolCall(
	resource: string,
	operation: string,
	params: IExecuteFunctions,
	i: number,
): { toolName: string; args: IDataObject } {
	switch (`${resource}.${operation}`) {
		// ── Profile ──
		case 'profile.get':
			return {
				toolName: 'linkedin_get_profile',
				args: {
					identifier: params.getNodeParameter('identifier', i) as string,
					include_main_company_details: params.getNodeParameter(
						'includeMainCompanyDetails',
						i,
					) as boolean,
				},
			};

		case 'profile.bulkGet':
			return {
				toolName: 'linkedin_bulk_get_profiles',
				args: {
					identifiers: splitCsv(params.getNodeParameter('identifiers', i) as string),
				},
			};

		// ── Company ──
		case 'company.get':
			return {
				toolName: 'linkedin_get_company',
				args: { identifier: params.getNodeParameter('identifier', i) as string },
			};

		case 'company.bulkGet':
			return {
				toolName: 'linkedin_bulk_get_companies',
				args: {
					identifiers: splitCsv(params.getNodeParameter('identifiers', i) as string),
				},
			};

		case 'company.getPosts': {
			const args: IDataObject = {
				identifier: params.getNodeParameter('identifier', i) as string,
			};
			const cursor = params.getNodeParameter('cursor', i, '') as string;
			if (cursor) args.cursor = cursor;
			return { toolName: 'linkedin_get_company_posts', args };
		}

		// ── Post ──
		case 'post.getPersonPosts': {
			const args: IDataObject = {
				identifier: params.getNodeParameter('identifier', i) as string,
			};
			const cursor = params.getNodeParameter('cursor', i, '') as string;
			if (cursor) args.cursor = cursor;
			return { toolName: 'linkedin_get_person_posts', args };
		}

		case 'post.getComments': {
			const args: IDataObject = {};
			const postUrl = params.getNodeParameter('postUrl', i, '') as string;
			const activityUrn = params.getNodeParameter('activityUrn', i, '') as string;
			if (activityUrn) args.activityUrn = activityUrn;
			else if (postUrl) args.postUrl = postUrl;
			const cursor = params.getNodeParameter('cursor', i, '') as string;
			if (cursor) args.cursor = cursor;
			return { toolName: 'linkedin_get_post_comments', args };
		}

		case 'post.getReactions': {
			const args: IDataObject = {};
			const postUrl = params.getNodeParameter('postUrl', i, '') as string;
			const activityUrn = params.getNodeParameter('activityUrn', i, '') as string;
			if (activityUrn) args.activityUrn = activityUrn;
			else if (postUrl) args.postUrl = postUrl;
			const cursor = params.getNodeParameter('cursor', i, '') as string;
			if (cursor) args.cursor = cursor;
			return { toolName: 'linkedin_get_post_reactions', args };
		}

		case 'post.create': {
			const args: IDataObject = {
				text: params.getNodeParameter('text', i) as string,
			};
			const additional = params.getNodeParameter('additionalFields', i, {}) as IDataObject;
			if (additional.imageUrls) {
				args.image_urls = splitCsv(additional.imageUrls as string);
			}
			if (additional.externalLink) args.external_link = additional.externalLink;
			if (additional.repost) args.repost = additional.repost;
			if (additional.contentCheck) args.content_check = additional.contentCheck;
			if (additional.mentions) {
				try {
					args.mentions = JSON.parse(additional.mentions as string);
				} catch {
					args.mentions = [];
				}
			}
			return { toolName: 'linkedin_create_post', args };
		}

		case 'post.comment': {
			const args: IDataObject = {
				text: params.getNodeParameter('commentText', i) as string,
			};
			const postUrl = params.getNodeParameter('postUrl', i, '') as string;
			const postId = params.getNodeParameter('postId', i, '') as string;
			if (postUrl) args.post_url = postUrl;
			if (postId) args.post_id = postId;
			const additional = params.getNodeParameter(
				'commentAdditionalFields',
				i,
				{},
			) as IDataObject;
			if (additional.commentId) args.comment_id = additional.commentId;
			if (additional.contentCheck) args.content_check = additional.contentCheck;
			if (additional.mentions) {
				try {
					args.mentions = JSON.parse(additional.mentions as string);
				} catch {
					args.mentions = [];
				}
			}
			return { toolName: 'linkedin_comment_on_post', args };
		}

		case 'post.react': {
			const args: IDataObject = {
				reaction_type: params.getNodeParameter('reactionType', i) as string,
			};
			const postUrl = params.getNodeParameter('postUrl', i, '') as string;
			const postId = params.getNodeParameter('postId', i, '') as string;
			if (postUrl) args.post_url = postUrl;
			if (postId) args.post_id = postId;
			const commentId = params.getNodeParameter('reactCommentId', i, '') as string;
			if (commentId) args.comment_id = commentId;
			return { toolName: 'linkedin_react_to_post', args };
		}

		// ── Search ──
		case 'search.searchPeople':
		case 'search.searchSalesNavigator': {
			const args: IDataObject = {};
			const keywords = params.getNodeParameter('keywords', i, '') as string;
			const url = params.getNodeParameter('url', i, '') as string;
			if (url) {
				args.url = url;
			} else if (keywords) {
				args.keywords = keywords;
			}
			const filters = params.getNodeParameter('filters', i, {}) as IDataObject;
			if (filters.location) args.location = splitCsv(filters.location as string);
			if (filters.industry) args.industry = splitCsv(filters.industry as string);
			if ((filters.seniority as number[])?.length) args.seniority = filters.seniority;
			if ((filters.networkDistance as number[])?.length) {
				args.network_distance = filters.networkDistance;
			}
			if (filters.profileLanguage) {
				args.profile_language = splitCsv(filters.profileLanguage as string);
			}
			const cursor = params.getNodeParameter('cursor', i, '') as string;
			if (cursor) args.cursor = cursor;
			// Sales Navigator-only filters
			if (operation === 'searchSalesNavigator') {
				const fn = params.getNodeParameter('function', i, []) as number[];
				if (fn.length) args.function = fn;
				const tenure = params.getNodeParameter('tenure', i, '') as string;
				if (tenure) {
					try {
						args.tenure = JSON.parse(tenure);
					} catch {
						// ignore invalid JSON
					}
				}
			}
			const toolName =
				operation === 'searchSalesNavigator'
					? 'linkedin_search_sales_navigator'
					: 'linkedin_search_people';
			return { toolName, args };
		}

		// ── Connection ──
		case 'connection.getAll': {
			const args: IDataObject = {
				limit: params.getNodeParameter('limit', i) as number,
			};
			const cursor = params.getNodeParameter('cursor', i, '') as string;
			if (cursor) args.cursor = cursor;
			return { toolName: 'linkedin_get_connections', args };
		}

		case 'connection.listRequests': {
			const args: IDataObject = {
				direction: params.getNodeParameter('direction', i) as string,
				limit: params.getNodeParameter('limit', i) as number,
			};
			const cursor = params.getNodeParameter('cursor', i, '') as string;
			if (cursor) args.cursor = cursor;
			return { toolName: 'linkedin_list_connection_requests', args };
		}

		case 'connection.sendRequest': {
			const args: IDataObject = {
				identifier: params.getNodeParameter('identifier', i) as string,
			};
			const message = params.getNodeParameter('message', i, '') as string;
			if (message) args.message = message;
			return { toolName: 'linkedin_send_connection_request', args };
		}

		case 'connection.respondToRequest':
			return {
				toolName: 'linkedin_respond_connection_request',
				args: {
					connection_request_id: params.getNodeParameter(
						'connectionRequestId',
						i,
					) as string,
					shared_secret: params.getNodeParameter('sharedSecret', i) as string,
					action: params.getNodeParameter('action', i) as string,
				},
			};

		// ── Message ──
		case 'message.listConversations': {
			const args: IDataObject = {
				limit: params.getNodeParameter('limit', i) as number,
			};
			const filters = params.getNodeParameter('conversationFilters', i, {}) as IDataObject;
			if (filters.participant) args.participant = filters.participant;
			if (filters.unreadOnly !== undefined) args.unread_only = filters.unreadOnly;
			if (filters.after) args.after = filters.after;
			if (filters.before) args.before = filters.before;
			const cursor = params.getNodeParameter('cursor', i, '') as string;
			if (cursor) args.cursor = cursor;
			return { toolName: 'linkedin_list_conversations', args };
		}

		case 'message.getMessages': {
			const args: IDataObject = {
				chat_id: params.getNodeParameter('chatId', i) as string,
				limit: params.getNodeParameter('limit', i) as number,
			};
			const cursor = params.getNodeParameter('cursor', i, '') as string;
			if (cursor) args.cursor = cursor;
			return { toolName: 'linkedin_get_conversation_messages', args };
		}

		case 'message.send': {
			const sendTo = params.getNodeParameter('sendTo', i) as string;
			const args: IDataObject = {
				text: params.getNodeParameter('text', i) as string,
			};
			if (sendTo === 'new') {
				args.recipient_identifier = params.getNodeParameter(
					'recipientIdentifier',
					i,
				) as string;
				const inmail = params.getNodeParameter('inmail', i, false) as boolean;
				if (inmail) args.inmail = true;
				const linkedinApi = params.getNodeParameter('linkedinApi', i, 'classic') as string;
				if (linkedinApi !== 'classic') args.linkedin_api = linkedinApi;
			} else {
				args.chat_id = params.getNodeParameter('chatId', i) as string;
			}
			return { toolName: 'linkedin_send_message', args };
		}

		// ── Enrichment ──
		case 'enrichment.findEmail': {
			const args: IDataObject = {
				first_name: params.getNodeParameter('firstName', i) as string,
				last_name: params.getNodeParameter('lastName', i) as string,
			};
			const domain = params.getNodeParameter('companyDomain', i, '') as string;
			const company = params.getNodeParameter('companyName', i, '') as string;
			if (domain) args.company_domain = domain;
			if (company) args.company_name = company;
			return { toolName: 'find_email', args };
		}

		case 'enrichment.findMobile': {
			const args: IDataObject = {};
			const profile = params.getNodeParameter('linkedinProfile', i, '') as string;
			const email = params.getNodeParameter('email', i, '') as string;
			if (profile) args.linkedin_profile = profile;
			if (email) args.email = email;
			return { toolName: 'find_mobile', args };
		}

		case 'enrichment.validateEmail':
			return {
				toolName: 'validate_email',
				args: { email: params.getNodeParameter('email', i) as string },
			};

		// ── Account ──
		case 'account.whoAmI':
			return { toolName: 'linkedin_who_am_i', args: {} };

		default:
			throw new Error(`Unknown resource/operation: ${resource}.${operation}`);
	}
}

export class LinkMcp implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'LinkMCP for LinkedIn',
		name: 'linkMcp',
		icon: 'file:../../icons/linkmcp.svg',
		group: ['output'],
		version: 1,
		subtitle: '={{$parameter["operation"] + ": " + $parameter["resource"]}}',
		description: 'Search, message, enrich, and post on LinkedIn with AI-powered automation',
		defaults: { name: 'LinkMCP' },
		usableAsTool: true,
		inputs: [NodeConnectionTypes.Main],
		outputs: [NodeConnectionTypes.Main],
		credentials: [{ name: 'linkMcpApi', required: true }],
		properties: [
			{
				displayName: 'Resource',
				name: 'resource',
				type: 'options',
				noDataExpression: true,
				options: [
					{ name: 'Account', value: 'account' },
					{ name: 'Company', value: 'company' },
					{ name: 'Connection', value: 'connection' },
					{ name: 'Enrichment', value: 'enrichment' },
					{ name: 'Message', value: 'message' },
					{ name: 'Post', value: 'post' },
					{ name: 'Profile', value: 'profile' },
					{ name: 'Search', value: 'search' },
				],
				default: 'profile',
			},

			// Operation pickers
			profileOperations,
			companyOperations,
			postOperations,
			searchOperations,
			connectionOperations,
			messageOperations,
			enrichmentOperations,
			accountOperations,

			// Fields
			...profileFields,
			...companyFields,
			...postFields,
			...searchFields,
			...connectionFields,
			...messageFields,
			...enrichmentFields,
			...accountFields,
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const resource = this.getNodeParameter('resource', i) as string;
				const operation = this.getNodeParameter('operation', i) as string;

				const { toolName, args } = buildToolCall(resource, operation, this, i);
				const result = await callMcpTool.call(this, toolName, args, i);

				returnData.push({ json: result });
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: { error: (error as Error).message },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
