import { validate } from 'uuid'
import { LambdaPayloadEvent } from '../../types/lambda.types'
import { GGGProfileErrorResponse, GGGProfileSuccessResponse, OauthTokenResponse } from '../../types/oauth.types'
import { signWithKMS } from '../../utility/signAndVerify'
import { DynamoDBDocumentClient, UpdateCommand, UpdateCommandInput } from '@aws-sdk/lib-dynamodb'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(client)

/**
 * Use this endpoint if GGG does not allow a server redirect URL.
 * Consume the oauth token response the user receives in his app.
 * To make sure that the token payload is valid, use it to make a /profile request to GGG.
 * If the metadata matches, sign the token and return it.
 * Save the refresh token to a DynamoDB table.
 */
export async function signGGGTokenResponse(event: LambdaPayloadEvent) {
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

		// Make a profile request to the GGG servers.
		const url = process.env.POE_SERVER_ENDPOINT + '/profile'
		const response = await fetch(url, {
			headers: {
				Authorization: `Bearer ${body.accessToken}`,
			},
		})
		const profile = (await response.json()) as GGGProfileSuccessResponse | GGGProfileErrorResponse

		// Handle profile error.
		if ('error' in profile) {
			return { statusCode: response.status, body: profile.error_description }
		}

		// Handle profile success.
		else if ('name' in profile) {
			// Compare the profile data to the provided token data.
			// If it matches, sign the provided token and return it.
			// Also save the refresh token to DynamoDB.
			if (profile.uuid === body.sub && profile.name === body.username) {
				// Sign the ggg token response.
				const { refreshToken, ...toSign } = body

				// If the exp is larger than 10 hours (+ 10 minutes for potentially different server time),
				// the token response was probably tampered with. Reject.
				if (body.exp > Math.floor(Date.now() / 1000) + 36000 + 600) {
					return { statusCode: 400, body: 'Invalid token exp.' }
				}

				const signedToken = await signWithKMS(toSign)

				// Save the refresh token
				// TODO: If GGG does not have their own token reuse detection, it has to be implemented here.
				// This seems unlikely, but I haven't confirmed it yet.
				try {
					const params: UpdateCommandInput = {
						TableName: process.env.USER_TABLE,
						Key: {
							userUuid: profile.uuid,
							username: profile.name,
						},
						UpdateExpression: 'SET refreshToken = :refreshTokenValue',
						ExpressionAttributeValues: {
							':refreshTokenValue': refreshToken,
						},
					}

					// We don't really care if this succeeds or not.
					// When a user requests a refresh token later, he will either find it or get logged out.
					const command = new UpdateCommand(params)
					await docClient.send(command)
				} catch (e) {
					console.log({ refreshTokenSavingError: e })

					// In case of an error during the refresh token save, just return the signed token.
					return { statusCode: 200, body: signedToken }
				}

				return { statusCode: 200, body: signedToken }
			}
		}

		return { statusCode: 500, body: 'Error signing token.' }
	} catch (e) {
		return { statusCode: 500, body: 'Error signing token.' }
	}
}

/**
 * Assert that the correct body was passed in the request.
 */
function assertBody(obj: any): obj is OauthTokenResponse {
	return (
		obj &&
		'accessToken' in obj &&
		typeof obj.accessToken === 'string' &&
		'refreshToken' in obj &&
		typeof obj.refreshToken === 'string' &&
		'exp' in obj &&
		typeof obj.exp === 'number' &&
		'scope' in obj &&
		Array.isArray(obj.scope) &&
		'username' in obj &&
		typeof obj.username === 'string' &&
		'sub' in obj &&
		validate(obj.sub)
	)
}
