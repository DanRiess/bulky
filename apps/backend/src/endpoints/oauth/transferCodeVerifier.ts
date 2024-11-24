import { validate } from 'uuid'
import { LambdaPayloadEvent } from '../../types/lambda.types'
import { AccountScope, OauthCodeVerifierTransfer, OauthTokenResponse } from '../../types/oauth.types'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommandInput } from '@aws-sdk/lib-dynamodb'
import { typedGetCommand } from '../../utility/typedGetCommand'
import { OauthDbItem } from '../../types/db.types'
import { signWithKMS } from '../../utility/signWithKms'

const client = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(client)

export async function transferCodeVerifier(event: LambdaPayloadEvent) {
	try {
		// Get and assert the body.
		const bodyString = event.body
		if (bodyString === undefined) {
			return { statusCode: 400, body: 'No body provided.' }
		}

		const body = JSON.parse(bodyString)

		if (!assertBody(body)) {
			return { statusCode: 400, body: 'Body invalid.' }
		}

		const params: GetCommandInput = {
			TableName: process.env.OAUTH_TABLE,
			Key: {
				state: body.state,
			},
		}

		// Retrieve the user's state.
		const item = await typedGetCommand<OauthDbItem>(docClient, params)

		if (!item || item.used === true) {
			return { statusCode: 400, body: 'State not found or expired.' }
		}

		if (!item.code) {
			return { statusCode: 400, body: 'No code in state.' }
		}

		// Exchange the code.
		const tokenExchangeUrl = process.env.POE_OAUTH_TOKEN_URL
		const scopes: AccountScope[] = ['account:profile', 'account:stashes']
		const payload = new URLSearchParams({
			client_id: process.env.OAUTH_CLIENT_ID ?? '',
			grant_type: 'authorization_code',
			code: item.code,
			redirect_uri: process.env.VITE_BASE_REDIRECT_URL ?? '',
			scope: scopes.join(' '),
			code_verifier: body.code_verifier,
		})

		const config = {
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				'User-Agent': process.env.USER_AGENT ?? '',
			},
		}

		// const tokenResponse = await fetch(tokenExchangeUrl ?? '', {
		// 	method: 'POST',
		// 	body: payload,
		// 	headers: config.headers,
		// })

		// const tokens = await tokenResponse.json()

		// MOCK
		const tokens: OauthTokenResponse = {
			access_token: 'fawefsaw894235rls',
			refresh_token: 'afweoijq9231adsf',
			expires_in: 174320981723,
			scope: scopes.join(' '),
			username: 'Chavincar',
			sub: '12345',
		}
		console.log({ tokens })

		const signedTokens = await signWithKMS(tokens)
		console.log(signedTokens)

		return { statusCode: 200, body: signedTokens }
	} catch (e) {
		return { statusCode: 500, body: 'Error exchanging code.' }
	}
}

/**
 * Assert that the correct body was passed in the request.
 */
function assertBody(obj: any): obj is OauthCodeVerifierTransfer {
	return (
		obj &&
		'state' in obj &&
		typeof obj.state === 'string' &&
		validate(obj.state) &&
		'code_verifier' in obj &&
		typeof obj.code_verifier === 'string'
	)
}
