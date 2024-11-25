import { DynamoDBDocumentClient, QueryCommand, QueryCommandInput } from '@aws-sdk/lib-dynamodb'
import { LambdaPayloadEvent } from '../../types/lambda.types'
import { BulkyOfferGetQueryParams } from '../../types/offer.types'
import { assertBulkyCategory } from '../../utility/assertBulkyCategory'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(client)

/**
 * Get all items of the provided category and league.
 * Only return items that are older than 20 minutes.
 */
export async function getByCategoryAndLeague(event: LambdaPayloadEvent) {
	try {
		// Get the query params
		const queryParams = event.queryStringParameters

		if (!assertQueryParams(queryParams)) {
			return { statusCode: 400, body: 'Parameters are wrong or not present.' }
		}

		// Get the timestamp from the query parameters
		const timestamp = parseInt(queryParams.timestamp)
		if (Number.isNaN(timestamp)) {
			return { statusCode: 400, body: 'Invalid timestamp.' }
		}

		// Return if the table name is not properly defined.
		const tableName = process.env.OFFER_TABLE
		if (!tableName) {
			return { statusCode: 400, body: 'Invalid table name.' }
		}

		const categoryLeague = `${queryParams.category}_${queryParams.league}`
		const sortKeyPrefix = `${timestamp}_`

		// Update the database entry with the received code
		const params: QueryCommandInput = {
			TableName: tableName,
			KeyConditionExpression: '#pk = :categoryLeague AND #sk > :sortKeyPrefix',
			ExpressionAttributeNames: {
				'#pk': 'categoryLeague',
				'#sk': 'timestampUuid',
			},
			ExpressionAttributeValues: {
				':categoryLeague': categoryLeague,
				':sortKeyPrefix': sortKeyPrefix,
			},
		}

		const command = new QueryCommand(params)
		const result = await docClient.send(command)

		return { statusCode: 200, body: JSON.stringify(result.Items) }
	} catch (e) {
		console.log({ e })
		return { statusCode: 500, body: 'Error during query.' }
	}
}

/**
 * Assert that the correct query parameters are present in the request.
 */
function assertQueryParams(obj: any): obj is BulkyOfferGetQueryParams {
	return (
		obj &&
		'category' in obj &&
		assertBulkyCategory(obj.category) &&
		'league' in obj &&
		typeof obj.league === 'string' &&
		'timestamp' in obj &&
		parseInt(obj.timestamp)
	)
}
