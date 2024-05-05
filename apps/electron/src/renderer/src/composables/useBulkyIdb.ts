import { BulkyItem } from '@shared/types/bulky.types'
import { BulkyNinjaPriceBlock, PoeNinjaCategory } from '@shared/types/ninja.types'
import { StashTab } from '@shared/types/stash.types'
import { Id } from '@shared/types/utility.types'
import { deepToRaw } from '@web/utility/deepToRaw'
import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface BulkyDB extends DBSchema {
	stash: {
		key: StashTab['id'] // stash id
		value: StashTab
		indexes: { 'by-league': StashTab['league'] }
	}
	item: {
		key: BulkyItem['id']
		value: BulkyItem
		indexes: { 'by-tab': StashTab['id']; 'by-basetype': BulkyItem['baseType'] }
	}
	price: {
		key: BulkyNinjaPriceBlock['category']
		value: BulkyNinjaPriceBlock
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

				db.createObjectStore('price', {
					keyPath: 'category',
				})
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
	async function putStashTabs(stashTabs: StashTab[]) {
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
		const stashTabs: StashTab[] = []

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
	async function deleteStashTabs(stashTabIds: Id<StashTab>[]) {
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
	async function putItems(items: BulkyItem[]) {
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
	async function getItemsByStashTab(stashTabId: Id<StashTab>) {
		let db: IDBPDatabase<BulkyDB> | undefined
		const items: BulkyItem[] = []

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
		const items: BulkyItem[] = []

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
	async function deleteItems(itemIds: Id<BulkyItem>[]) {
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
	async function putPriceBlock(ninjaPrice: BulkyNinjaPriceBlock) {
		let db: IDBPDatabase<BulkyDB> | undefined

		try {
			db = await initDB()
			await db.put('price', deepToRaw(ninjaPrice))
		} catch (e) {
			console.log(e)
		} finally {
			db?.close()
		}
	}

	/**
	 * Get prices for a category
	 */
	async function getPriceBlockByCategory(category: PoeNinjaCategory) {
		let db: IDBPDatabase<BulkyDB> | undefined
		let price: BulkyNinjaPriceBlock | undefined

		try {
			db = await initDB()
			price = await db.get('price', category)
		} catch (e) {
			console.log(e)
		} finally {
			db?.close()
			return price
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
		putPriceBlock,
		getPriceBlockByCategory,
	}
}
