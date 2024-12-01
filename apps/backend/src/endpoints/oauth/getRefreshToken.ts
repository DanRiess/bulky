import { decodeJwt } from 'jose'
import { LambdaPayloadEvent } from '../../types/lambda.types'
import { OauthTokenResponse } from '../../types/oauth.types'
import { DynamoDBDocumentClient, GetCommandInput } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { typedGetCommand } from '../../utility/typedGetCommand'
import { UserDbItem } from '../../types/db.types'

const client = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(client)

export async function getRefreshToken(event: LambdaPayloadEvent) {
	try {
		// Get the authorization header.
		// Beware that 'Authorization' will not work. It has to be lowercase.
		const authHeader = event.headers.authorization
		if (!authHeader || typeof authHeader !== 'string') {
			return { status: 400, body: 'Authorization header unavailable.' }
		}

		// Remove the 'Bearer ' from the authorization string.
		const jwt = authHeader.split(' ')[1]
		if (!jwt) {
			return { status: 400, body: 'Authorization header malformed.' }
		}

		// The token itself has already been verified in the authorizer function at this point.
		const claims = decodeJwt<OauthTokenResponse>(jwt)
		console.log({ claims })

		// Define parameters for the search query.
		const params: GetCommandInput = {
			TableName: process.env.USER_TABLE,
			Key: {
				userUuid: claims.sub,
				username: claims.username,
			},
		}

		const item = await typedGetCommand<UserDbItem>(docClient, params)

		if (item?.refreshToken) {
			return { statusCode: 200, body: item.refreshToken }
		}

		return { statusCode: 404, body: 'Not found' }
	} catch (e) {
		return { statusCode: 500, body: 'Error retrieving refresh token' }
	}
}
