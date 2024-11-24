import { validate } from 'uuid'
import { LambdaPayloadEvent } from '../../types/lambda.types'
import { OauthRedirectQueryParameters } from '../../types/oauth.types'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb'

const client = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(client)

export async function handleRedirect(event: LambdaPayloadEvent) {
	try {
		// Get the query params
		const queryParams = event.queryStringParameters

		if (!assertQueryParams(queryParams)) {
			return { statusCode: 400, body: 'Parameters are wrong or not present.' }
		}

		// Update the database entry with the received code
		const params: UpdateCommandInput = {
			TableName: process.env.OAUTH_TABLE,
			Key: {
				state: queryParams.state,
			},
			UpdateExpression: 'SET code = :codeValue',
			ExpressionAttributeValues: {
				':codeValue': queryParams.code,
			},
			// ConditionExpression: 'attribute_exists(state)', // prevent creating a new item
		}

		const command = new UpdateCommand(params)
		const result = await docClient.send(command)

		console.log({ result })
		return { statusCode: 200, body: JSON.stringify(result) }

		// Redirect to localhost, which should trigger sending of the code verifier.
		// If that doesn't work, use polling instead.
	} catch (e) {
		console.log({ e })
		return { statusCode: 500, body: 'Error in redirect handler.' }
	}
}

/**
 * Assert that the correct query parameters are present in the request.
 */
function assertQueryParams(obj: any): obj is OauthRedirectQueryParameters {
	return (
		obj &&
		'state' in obj &&
		typeof obj.state === 'string' &&
		validate(obj.state) &&
		'code' in obj &&
		typeof obj.code === 'string'
	)
}
