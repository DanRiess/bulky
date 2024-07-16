import { BulkyItemOverrideInstance, BulkyShopOffer, Category } from '@shared/types/bulky.types'
import { NinjaPriceCollection, NinjaCategory } from '@shared/types/ninja.types'
import { PoeItem, PoeStashTab } from '@shared/types/poe.types'
import { Id } from '@shared/types/utility.types'
import { useConfigStore } from '@web/stores/configStore'
import { deepToRaw } from '@web/utility/deepToRaw'
import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface BulkyDB extends DBSchema {
	stash: {
		key: PoeStashTab['id'] // stash id
		value: PoeStashTab
		indexes: { 'by-league': PoeStashTab['league'] }
	}
	item: {
		key: PoeItem['id']
		value: PoeItem
		indexes: { 'by-tab': PoeStashTab['id']; 'by-basetype': PoeItem['baseType'] }
	}
	ninja_price: {
		key: [NinjaCategory, NinjaPriceCollection['league']]
		value: NinjaPriceCollection
	}
	item_override: {
		key: [BulkyItemOverrideInstance['type'], BulkyItemOverrideInstance['tier'], BulkyItemOverrideInstance['league'], Category]
		value: BulkyItemOverrideInstance
		indexes: { 'by-category': [Category, BulkyItemOverrideInstance['league']] }
	}
	shop_offer: {
		key: [BulkyShopOffer['uuid'], BulkyShopOffer['league']]
		value: BulkyShopOffer
		indexes: { 'by-league': [BulkyShopOffer['league']] }
	}
}

/**
 * API for IndexedDB. Exposes necessary functions to persist stash and item data locally.
 *
 * Each function always opens and closes its own db instance.
 * The init function should not be called directly.
 * While this is more verbose, it avoids potential conflicts with multiple open instances.
 *
 * This can be used in web workers as well.
 */
export function useBulkyIdb() {
	async function initDB() {
		return await openDB<BulkyDB>('BulkyIdb', 1, {
			upgrade(db) {
				const stashStore = db.createObjectStore('stash', {
					keyPath: 'id',
				})
				stashStore.createIndex('by-league', 'league')

				const itemStore = db.createObjectStore('item', {
					keyPath: 'id',
				})
				itemStore.createIndex('by-tab', 'stashTabId')

				db.createObjectStore('ninja_price', {
					keyPath: ['category', 'league'],
				})

				const priceOverrideStore = db.createObjectStore('item_override', {
					keyPath: ['type', 'tier', 'league'],
				})

				priceOverrideStore.createIndex('by-category', ['category', 'league'])

				const shopOfferStore = db.createObjectStore('shop_offer', {
					keyPath: ['uuid', 'league'],
				})

				shopOfferStore.createIndex('by-league', ['league'])
			},
			blocked(currentVersion, blockedVersion, event) {
				console.log(currentVersion, blockedVersion, event)
				console.log('blocked')
			},
		})
	}

	// API

	/**
	 * Add / Put an array of stash tabs to the stash store.
	 */
	async function putStashTabs(stashTabs: PoeStashTab[]) {
		let db: IDBPDatabase<BulkyDB> | undefined

		try {
			db = await initDB()
			const tx = db.transaction('stash', 'readwrite')

			const ops = stashTabs.map(stashTab => {
				tx.store.put(deepToRaw(stashTab))
			})

			await Promise.all([...ops, tx.done])
		} catch (e) {
			console.log(e)
		} finally {
			db?.close()
		}
	}

	/**
	 * Get all stash tabs
	 */
	async function getStashTabsByLeague(league: string) {
		let db: IDBPDatabase<BulkyDB> | undefined
		const stashTabs: PoeStashTab[] = []

		try {
			db = await initDB()
			stashTabs.push(...(await db.getAllFromIndex('stash', 'by-league', league)))
		} catch (e) {
			console.log(e)
		} finally {
			db?.close()
			return stashTabs
		}
	}

	/**
	 * Delete an array of stash tabs
	 */
	async function deleteStashTabs(stashTabIds: Id<PoeStashTab>[]) {
		let db: IDBPDatabase<BulkyDB> | undefined

		try {
			db = await initDB()
			const tx = db.transaction('stash', 'readwrite')

			const ops = stashTabIds.map(id => tx.store.delete(id))
			await Promise.all([...ops, tx.done])
		} catch (e) {
			console.log(e)
		} finally {
			db?.close()
		}
	}

	/**
	 * Add an array of items to the item store
	 */
	async function putItems(items: PoeItem[]) {
		let db: IDBPDatabase<BulkyDB> | undefined

		try {
			db = await initDB()
			const tx = db.transaction('item', 'readwrite')

			const ops = items.map(item => {
				tx.store.put(deepToRaw(item))
			})

			await Promise.all([...ops, tx.done])
		} catch (e) {
			console.log(e)
		} finally {
			db?.close()
		}
	}

	/**
	 * Get all items of a stash tab.
	 */
	async function getItemsByStashTab(stashTabId: Id<PoeStashTab>) {
		let db: IDBPDatabase<BulkyDB> | undefined
		const items: PoeItem[] = []

		try {
			db = await initDB()
			items.push(...(await db.getAllFromIndex('item', 'by-tab', stashTabId)))
		} catch (e) {
			console.log(e)
		} finally {
			db?.close
			return items
		}
	}

	/**
	 * Get all items of a base type.
	 */
	async function getItemsByBaseType(baseType: string) {
		let db: IDBPDatabase<BulkyDB> | undefined
		const items: PoeItem[] = []

		try {
			db = await initDB()
			items.push(...(await db.getAllFromIndex('item', 'by-basetype', baseType)))
		} catch (e) {
			console.log(e)
		} finally {
			db?.close()
			return items
		}
	}

	/**
	 * Delete an array of items
	 */
	async function deleteItems(itemIds: Id<PoeItem>[]) {
		let db: IDBPDatabase<BulkyDB> | undefined

		try {
			db = await initDB()
			const tx = db.transaction('item', 'readwrite')

			const ops = itemIds.map(id => tx.store.delete(id))
			await Promise.all([...ops, tx.done])
		} catch (e) {
			console.log(e)
		} finally {
			db?.close()
		}
	}

	/**
	 * Add a new price item to the price store
	 */
	async function putPriceCollection(ninjaPrice: NinjaPriceCollection) {
		let db: IDBPDatabase<BulkyDB> | undefined

		try {
			db = await initDB()
			await db.put('ninja_price', deepToRaw(ninjaPrice))
		} catch (e) {
			console.log(e)
		} finally {
			db?.close()
		}
	}

	/**
	 * Get prices for a category
	 */
	async function getPriceCollectionByCategory(category: NinjaCategory) {
		const configStore = useConfigStore()
		let db: IDBPDatabase<BulkyDB> | undefined
		let price: NinjaPriceCollection | undefined

		try {
			db = await initDB()
			price = await db.get('ninja_price', [category, configStore.config.league])
		} catch (e) {
			console.log(e)
		} finally {
			db?.close()
			return price
		}
	}

	/**
	 * Add a new price override to the store
	 */
	async function putItemOverride(overrideItem: BulkyItemOverrideInstance) {
		let db: IDBPDatabase<BulkyDB> | undefined

		try {
			db = await initDB()
			await db.put('item_override', deepToRaw(overrideItem))
		} catch (e) {
			console.log(e)
		} finally {
			db?.close()
		}
	}

	/**
	 * Get price overrides for a category
	 */
	async function getItemOverrideByCategory(category: Category) {
		const configStore = useConfigStore()
		let db: IDBPDatabase<BulkyDB> | undefined
		const price: BulkyItemOverrideInstance[] = []

		try {
			db = await initDB()
			price.push(...(await db.getAllFromIndex('item_override', 'by-category', [category, configStore.config.league])))
		} catch (e) {
			console.log(e)
		} finally {
			db?.close()
			return price
		}
	}

	/**
	 * Get all shop offers for the current league.
	 */
	async function getShopOffersByLeague() {
		const configStore = useConfigStore()
		let db: IDBPDatabase<BulkyDB> | undefined
		const offers: BulkyShopOffer[] = []

		try {
			db = await initDB()
			offers.push(...(await db.getAllFromIndex('shop_offer', 'by-league', [configStore.config.league])))
		} catch (e) {
			console.log(e)
		} finally {
			db?.close()
			return offers
		}
	}

	/**
	 * Put an offer to the store.
	 */
	async function putShopOffer(offer: BulkyShopOffer) {
		let db: IDBPDatabase<BulkyDB> | undefined

		try {
			db = await initDB()
			await db.put('shop_offer', deepToRaw(offer))
		} catch (e) {
			console.log(e)
		} finally {
			db?.close()
		}
	}

	/**
	 * Delete an offer from the store
	 */
	async function deleteShopOffer(uuid: BulkyShopOffer['uuid'], league: BulkyShopOffer['league']) {
		let db: IDBPDatabase<BulkyDB> | undefined

		try {
			db = await initDB()
			await db.delete('shop_offer', [uuid, league])
		} catch (e) {
			console.log(e)
		} finally {
			db?.close()
		}
	}

	return {
		putStashTabs,
		getStashTabsByLeague,
		deleteStashTabs,
		putItems,
		getItemsByBaseType,
		getItemsByStashTab,
		deleteItems,
		putPriceCollection,
		getPriceCollectionByCategory,
		putItemOverride,
		getItemOverrideByCategory,
		getShopOffersByLeague,
		putShopOffer,
		deleteShopOffer,
	}
}
