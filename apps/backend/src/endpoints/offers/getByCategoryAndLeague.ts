import { DynamoDBDocumentClient, QueryCommand, QueryCommandInput, QueryCommandOutput } from '@aws-sdk/lib-dynamodb'
import { LambdaPayloadEvent } from '../../types/lambda.types'
import { BulkyOfferGetQueryParams, DynamoDBBulkyOffer, OfferDto } from '../../types/offer.types'
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
		// Get the query params.
		const queryParams = event.queryStringParameters

		if (!assertQueryParams(queryParams)) {
			return { statusCode: 400, body: 'Parameters are wrong or not present.' }
		}

		// Get the timestamp from the query parameters.
		let timestamp = parseInt(queryParams.timestamp)
		if (Number.isNaN(timestamp)) {
			return { statusCode: 400, body: 'Invalid timestamp.' }
		}

		// Assert that the timestamp is at most 10 minutes 30 seconds in the past.
		if (timestamp > Date.now() - 600000) {
			timestamp = Date.now() - 600000
		}

		// Return if the table name is not properly defined.
		const tableName = process.env.OFFER_TABLE
		if (!tableName) {
			return { statusCode: 400, body: 'Invalid table name.' }
		}

		// Define attribute values for the query.
		const categoryLeague = `${queryParams.category}_${queryParams.league}`
		const sortKeyPrefix = `${timestamp}_`

		// Define the query.
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

		// Execute the query.
		const command = new QueryCommand(params)
		const queryOutput = (await docClient.send(command)) as Omit<QueryCommandOutput, 'Items'> & {
			Items?: DynamoDBBulkyOffer[]
		}

		// Make sure to filter out old versions of updated offers.
		const uniqueOffers =
			queryOutput.Items?.reduce((uniqueRecord, currentItem) => {
				if (!uniqueRecord[currentItem.uuid] || uniqueRecord[currentItem.uuid].timestamp < currentItem.timestamp) {
					uniqueRecord[currentItem.uuid] = currentItem
				}
				return uniqueRecord
			}, {} as Record<DynamoDBBulkyOffer['uuid'], DynamoDBBulkyOffer>) ?? {}

		// Turn the result back into an array.
		const result = Object.values(uniqueOffers)

		return { statusCode: 200, body: JSON.stringify(result) }
	} catch (e) {
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
		Number.isInteger(parseInt(obj.timestamp))
	)
}
