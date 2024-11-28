import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { LambdaPayloadEvent } from '../../types/lambda.types'
import {
	BatchWriteCommand,
	BatchWriteCommandInput,
	DeleteCommand,
	DeleteCommandInput,
	DynamoDBDocumentClient,
	GetCommand,
} from '@aws-sdk/lib-dynamodb'
import { BulkyOfferDeleteQueryParams } from '../../types/offer.types'
import { assertBulkyCategory } from '../../utility/assertBulkyCategory'
import { validate } from 'uuid'

const client = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(client)

/**
 * Handle delete requests for the offer endpoint.
 * If the request provides a uuid and credentials, remove it from DynamoDB.
 *
 * Requires Authorization - handled in the lambdaAuthorizer function.
 */
export async function deleteOffer(event: LambdaPayloadEvent) {
	try {
		// Get the query params.
		const queryParams = event.queryStringParameters

		if (!assertQueryParams(queryParams)) {
			return { statusCode: 400, body: 'Parameters are wrong or not present.' }
		}

		// Define 10 minutes ago.
		const tenMinutesAgo = Date.now() - 600000

		// Convert the timestamp string into an array.
		// Filter out all timestamps that are older than 10 minutes.
		const timestamps = queryParams.timestamps
			.split(',')
			.map(timestamp => parseInt(timestamp))
			.filter(timestamp => timestamp > tenMinutesAgo)

		// Don't allow deleting more than 5 timestamps.
		// An offer cannot be updated more than once every 3 minutes, so something must be wrong here.
		if (timestamps.length > 5) {
			return { statusCode: 400, body: 'Bad request.' }
		}

		// Define primary and sort keys for the query.
		const categoryLeague = `${queryParams.category}_${queryParams.league}`
		const timestampUuid = `${tenMinutesAgo}_${queryParams.uuid}`

		// Prepare the batch request
		const deleteRequests = timestamps.map(timestamp => {
			const timestampUuid = `${timestamp}_${queryParams.uuid}`

			return {
				DeleteRequest: {
					Key: {
						categoryLeague: categoryLeague,
						timestampUuid: timestampUuid,
					},
				},
			}
		})

		// Return if the table name is not properly defined.
		const tableName = process.env.OFFER_TABLE
		if (!tableName) {
			return { statusCode: 400, body: 'Invalid table name.' }
		}

		// Define the query.
		const params: BatchWriteCommandInput = {
			RequestItems: {
				[tableName]: deleteRequests,
			},
		}

		// Execute the query.
		const command = new BatchWriteCommand(params)
		const batchWriteResult = await docClient.send(command)

		if (batchWriteResult.UnprocessedItems?.[tableName]) {
			console.log({ unprocessedItems: batchWriteResult.UnprocessedItems?.[tableName] })
		}

		return { statusCode: 200, body: 'Offer removed' }
	} catch (e) {
		console.log({ e })
		return { statusCode: 500, body: 'Error removing offer.' }
	}
}

/**
 * Assert that the correct query parameters are present in the request.
 */
function assertQueryParams(obj: any): obj is BulkyOfferDeleteQueryParams {
	if (!('timestamps' in obj)) return false
	const timestampArray = obj['timestamps'].split(',')
	if (!Array.isArray(timestampArray)) return false
	if (!timestampArray.every(uuid => parseInt(uuid))) return false

	return (
		obj &&
		'category' in obj &&
		assertBulkyCategory(obj.category) &&
		'league' in obj &&
		typeof obj.league === 'string' &&
		'uuid' in obj &&
		validate(obj.uuid)
	)
}
