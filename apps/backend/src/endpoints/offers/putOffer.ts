import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { LambdaPayloadEvent } from '../../types/lambda.types'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'
import { assertBulkyOfferDto } from '../../utility/assertBulkyOfferDto'
import { BulkyItemDto, DynamoDBBulkyItem, DynamoDBBulkyOffer } from '../../types/offer.types'

const client = new DynamoDBClient()
const docClient = DynamoDBDocumentClient.from(client)

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

		// Further assertions
		if (offer.timestamp > Date.now()) {
			offer.timestamp = Date.now()
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

		// const params: PutCommandInput = {
		// 	TableName: process.env.OAUTH_TABLE,
		// 	Item: {
		// 		state: body.state,
		// 		code_challenge: body.code_challenge,
		// 		used: false,
		// 	},
		// }

		// const command = new PutCommand(params)
		// await docClient.send(command)

		// return { statusCode: 200, body: JSON.stringify(params.Item) }
	} catch (e) {
		return { statusCode: 500, body: 'Error saving token state.' }
	}
}

function mapBulkyItemDtoToDynamoDB(item: BulkyItemDto): DynamoDBBulkyItem {
	return {
		Type: { N: item.type.toString() },
		Tier: { N: item.tier.toString() },
		Quantity: { N: item.qnt.toString() },
		Price: { N: item.prc.toString() },
		PerItemAttributes: item.pia
			? {
					L: item.pia.map(attr => ({
						M: {
							Mods: attr.mods ? { L: attr.mods.map(mod => ({ N: mod.toString() })) } : { NULL: true },
							Props: attr.props
								? {
										M: {
											IQnt: attr.props.iQnt ? { N: attr.props.iQnt.toString() } : { NULL: true },
											IRar: attr.props.iRar ? { N: attr.props.iRar.toString() } : { NULL: true },
											PckSz: attr.props.pckSz ? { N: attr.props.pckSz.toString() } : { NULL: true },
										},
								  }
								: { NULL: true },
							LogbookMods: attr.logbookMods
								? { L: attr.logbookMods.map(mod => ({ N: mod.toString() })) }
								: { NULL: true },
						},
					})),
			  }
			: { NULL: true },
		Regex: item.rgx
			? {
					M: {
						AVD: item.rgx.avd ? { N: item.rgx.avd.toString() } : { NULL: true },
						WNT: item.rgx.wnt ? { N: item.rgx.wnt.toString() } : { NULL: true },
						QNT: item.rgx.qnt
							? {
									L: item.rgx.qnt.map(([quantity, addedPrice]) => ({
										L: [{ N: quantity.toString() }, { N: addedPrice.toString() }],
									})),
							  }
							: { NULL: true },
						PckSz: item.rgx.pckSz
							? {
									L: item.rgx.pckSz.map(([quantity, size]) => ({
										L: [{ N: quantity.toString() }, { N: size.toString() }],
									})),
							  }
							: { NULL: true },
					},
			  }
			: { NULL: true },
	}
}
