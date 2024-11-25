import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { LambdaPayloadEvent } from '../../types/lambda.types'
import { DynamoDBDocumentClient, PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb'
import { assertBulkyOfferDto } from '../../utility/assertBulkyOfferDto'
import { BulkyItemDto, DynamoDBBulkyItem, DynamoDBBulkyOffer } from '../../types/offer.types'

const client = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(client)

// TODO: figure out how to handle updates to offers.
// The sort key cannot be changed.
// Either delete or modify with an expired flag and use that in the query maybe

/**
 * Upload an offer to the backend and save it to DynamoDB.
 * This function evaluates the body, converts it the necessary DynamoDB format and uploads it.
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

		// If the offer was created more than 20 minutes ago, something probably went wrong.
		if (offer.timestamp < Date.now() - 1200000) {
			return { statusCode: 400, body: 'Offer is too old' }
		}

		// Compute the keys
		const categoryLeague = `${offer.category}_${offer.league}`
		const timestampUuid = `${offer.timestamp}_${offer.uuid}`

		// Calculate the time to live: timestamp age in seconds plus 20 minutes in seconds
		const ttlTimestamp = Math.floor(offer.timestamp / 1000) + 1200

		// Prepare the item
		const item: DynamoDBBulkyOffer = {
			categoryLeague: { S: categoryLeague },
			timestampUuid: { S: timestampUuid },
			uuid: { S: offer.uuid },
			version: { N: offer.version.toString() },
			timestamp: { N: offer.timestamp.toString() },
			ttlTimestamp: { N: ttlTimestamp.toString() },
			account: { S: offer.account },
			ign: { S: offer.ign },
			chaosPerDiv: { N: offer.chaosPerDiv.toString() },
			multiplier: offer.multiplier ? { N: offer.multiplier.toString() } : { NULL: true },
			fullPrice: offer.fullPrice ? { N: offer.fullPrice.toString() } : { NULL: true },
			minimumBuyout: { N: offer.minimumBuyout.toString() },
			fullBuyout: offer.fullBuyout ? { BOOL: offer.fullBuyout } : { NULL: true },
			items: { L: offer.items.map(item => ({ M: mapBulkyItemDtoToDynamoDB(item) })) },
		}

		const params: PutCommandInput = {
			TableName: process.env.OFFER_TABLE,
			Item: {
				categoryLeague,
				timestampUuid,
				ttlTimestamp,
				...offer,
			},
		}

		const command = new PutCommand(params)
		await docClient.send(command)

		return { statusCode: 200, body: JSON.stringify(params.Item) }
	} catch (e) {
		console.log({ e })
		return { statusCode: 500, body: 'Error saving token state.' }
	}
}

/**
 * Map a bulky bazaar item to its respective dynamo db input type.
 */
function mapBulkyItemDtoToDynamoDB(item: BulkyItemDto): DynamoDBBulkyItem {
	return {
		type: { N: item.type.toString() },
		tier: { N: item.tier.toString() },
		quantity: { N: item.qnt.toString() },
		price: { N: item.prc.toString() },
		perItemAttributes: item.pia
			? {
					L: item.pia.map(attr => ({
						M: {
							mods: attr.mods ? { L: attr.mods.map(mod => ({ N: mod.toString() })) } : { NULL: true },
							props: attr.props
								? {
										M: {
											iQnt: attr.props.iQnt ? { N: attr.props.iQnt.toString() } : { NULL: true },
											iRar: attr.props.iRar ? { N: attr.props.iRar.toString() } : { NULL: true },
											pckSz: attr.props.pckSz ? { N: attr.props.pckSz.toString() } : { NULL: true },
										},
								  }
								: { NULL: true },
							logbookMods: attr.logbookMods
								? { L: attr.logbookMods.map(mod => ({ N: mod.toString() })) }
								: { NULL: true },
						},
					})),
			  }
			: { NULL: true },
		regex: item.rgx
			? {
					M: {
						avd: item.rgx.avd ? { N: item.rgx.avd.toString() } : { NULL: true },
						wnt: item.rgx.wnt ? { N: item.rgx.wnt.toString() } : { NULL: true },
						qnt: item.rgx.qnt
							? {
									L: item.rgx.qnt.map(([quantity, addedPrice]) => ({
										L: [{ N: quantity.toString() }, { N: addedPrice.toString() }],
									})),
							  }
							: { NULL: true },
						pckSz: item.rgx.pckSz
							? {
									L: item.rgx.pckSz.map(([packsize, addedPrice]) => ({
										L: [{ N: packsize.toString() }, { N: addedPrice.toString() }],
									})),
							  }
							: { NULL: true },
					},
			  }
			: { NULL: true },
	}
}
