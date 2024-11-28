import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { LambdaPayloadEvent } from '../../types/lambda.types'
import { DynamoDBDocumentClient, PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb'
import { assertBulkyOfferDto } from '../../utility/assertBulkyOfferDto'

const client = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(client)

/**
 * Handle put requests for the offer endpoint.
 * If the request provides a valid body and credentials, save it to DynamoDB.
 *
 * Requires Authorization - handled in the lambdaAuthorizer function.
 */
export async function putOffer(event: LambdaPayloadEvent) {
	try {
		// Get and assert the body
		const bodyString = event.body
		if (bodyString === undefined) {
			return { statusCode: 400, body: 'No body provided.' }
		}

		const offer = JSON.parse(bodyString)

		if (!assertBulkyOfferDto(offer)) {
			return { statusCode: 400, body: 'Body invalid.' }
		}

		// The offer cannot be older than now.
		if (offer.timestamp > Date.now()) {
			offer.timestamp = Date.now()
		}

		// If the offer was created more than 10 minutes ago, something probably went wrong.
		if (offer.timestamp < Date.now() - 600000) {
			return { statusCode: 400, body: 'Offer is too old' }
		}

		// Define primary and sort keys for the query.
		const categoryLeague = `${offer.category}_${offer.league}`
		const timestampUuid = `${offer.timestamp}_${offer.uuid}`

		// Calculate the time to live: timestamp age in seconds plus 11 minutes
		const ttlTimestamp = Math.floor(offer.timestamp / 1000) + 660

		// Define the query.
		const params: PutCommandInput = {
			TableName: process.env.OFFER_TABLE,
			Item: {
				categoryLeague,
				timestampUuid,
				ttlTimestamp,
				...offer,
			},
		}

		// Execute the query.
		const command = new PutCommand(params)
		await docClient.send(command)

		return { statusCode: 200, body: JSON.stringify(params.Item) }
	} catch (e) {
		console.log({ e })
		return { statusCode: 500, body: 'Error saving token state.' }
	}
}
