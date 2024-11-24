import { DynamoDBDocumentClient, PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb'
import { LambdaPayloadEvent } from '../../types/lambda.types'
import { OauthStateTransfer } from '../../types/oauth.types'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { validate } from 'uuid'

const client = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(client)

/**
 * Part of the GGG oauth flow.
 * Allows a user to upload their generated state and code challenge.
 * They will be saved in a table and used for the token exchange when the redirect url is invoked.
 * Afterwards, they will be invalidated and marked for deletion.
 * DO NOT mistake the code challenge for the code verifier, this should not be uploaded at this point.
 */
export async function transferState(event: LambdaPayloadEvent) {
	try {
		// Get and assert the body
		const bodyString = event.body
		if (bodyString === undefined) {
			return { statusCode: 400, body: 'No body provided.' }
		}

		const body = JSON.parse(bodyString)

		if (!assertBody(body)) {
			return { statusCode: 400, body: 'Body invalid.' }
		}

		const params: PutCommandInput = {
			TableName: process.env.OAUTH_TABLE,
			Item: {
				state: body.state,
				code_challenge: body.code_challenge,
				used: false,
			},
		}

		const command = new PutCommand(params)
		await docClient.send(command)

		return { statusCode: 200, body: JSON.stringify(params.Item) }
	} catch (e) {
		return { statusCode: 500, body: 'Error saving token state.' }
	}
}

/**
 * Assert that the correct body was passed in the request.
 */
function assertBody(obj: any): obj is OauthStateTransfer {
	return (
		obj &&
		'state' in obj &&
		typeof obj.state === 'string' &&
		validate(obj.state) &&
		'code_challenge' in obj &&
		typeof obj.code_challenge === 'string'
	)
}
