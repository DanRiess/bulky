import { writeFileSync } from 'fs'
import { v4 } from 'uuid'

function generate8ModMapMocks() {
	const offers: any[] = []
	for (let i = 0; i < 100; ++i) {
		const offer = generateOffer()
		offers.push(offer)
	}

	writeFileSync('./apps/electron/src/renderer/src/mocks/offersMap8Mod.json', JSON.stringify(offers))
}

function generateOffer() {
	const uuid = v4()
	const amount = Math.round(Math.random() * 100)
	const pia: any[] = []

	for (let i = 0; i < amount; ++i) {
		const mods = new Set<number>()
		while (mods.size < 8) {
			const mod = Math.floor(Math.random() * 78)
			mods.add(mod)
		}
		const attributes = {
			mods: Array.from(mods),
			props: {
				iQnt: Math.floor(Math.max(85, Math.min(130, Math.random() * 210))),
				iRar: 60,
				pckSz: Math.floor(Math.max(25, Math.min(50, Math.random() * 75))),
			},
		}

		pia.push(attributes)
	}

	return {
		version: 1,
		uuid,
		timestamp: 1721917430328,
		account: 'Chavincar',
		ign: 'Chav',
		category: 'MAP_8_MOD',
		league: 'Standard',
		chaosPerDiv: 123.48,
		fullPrice: 35,
		minimumBuyout: 0,
		items: [
			{
				type: 17,
				tier: 15,
				qnt: amount,
				prc: 10,
				pia,
				rgx: {
					avd: 3,
					wnt: 4,
					qnt: [
						[110, 5],
						[120, 11],
					],
					pckSz: [
						[35, 4],
						[40, 10],
					],
				},
			},
		],
	}
}

generate8ModMapMocks()
