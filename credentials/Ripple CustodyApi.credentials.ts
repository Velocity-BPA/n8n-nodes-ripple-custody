import {
	ICredentialType,
	INodeProperties,
} from 'n8n-workflow';

export class RippleCustodyApi implements ICredentialType {
	name = 'rippleCustodyApi';
	displayName = 'Ripple Custody API';
	documentationUrl = 'https://docs.custody.ripple.com';
	properties: INodeProperties[] = [
		{
			displayName: 'API Key',
			name: 'apiKey',
			type: 'string',
			typeOptions: {
				password: true,
			},
			default: '',
			required: true,
			description: 'API Key for Ripple Custody. Generate this through the Ripple Custody dashboard.',
		},
		{
			displayName: 'API Base URL',
			name: 'baseUrl',
			type: 'string',
			default: 'https://api.custody.ripple.com/v1',
			required: true,
			description: 'Base URL for the Ripple Custody API',
		},
	];
}