import { BulkyItem } from '@shared/types/bulky.types'
import { StashTab } from '@shared/types/stash.types'
import { openDB, DBSchema, IDBPDatabase } from 'idb'

interface BulkyDB extends DBSchema {
	stash: {
		key: StashTab['id'] // stash id
		value: StashTab
	}
	item: {
		key: BulkyItem['id']
		value: BulkyItem
		indexes: { 'by-tab': StashTab['id']; 'by-basetype': BulkyItem['baseType'] }
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
				db.createObjectStore('stash', {
					keyPath: 'id',
				})

				const itemStore = db.createObjectStore('item', {
					keyPath: 'id',
				})
				itemStore.createIndex('by-tab', 'stashId')
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
				tx.store.put(stashTab)
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
	async function getStashTabs() {
		let db: IDBPDatabase<BulkyDB> | undefined
		const stashTabs: StashTab[] = []

		try {
			db = await initDB()
			stashTabs.push(...(await db.getAll('stash')))
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
	async function deleteStashTabs(stashTabs: StashTab[]) {
		let db: IDBPDatabase<BulkyDB> | undefined

		try {
			db = await initDB()
			const tx = db.transaction('stash', 'readwrite')

			const ops = stashTabs.map(stashTab => tx.store.delete(stashTab.id))
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
				tx.store.put(item)
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
	async function getItemsByStashTab(stashTabId: string) {
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
	async function deleteItems(items: BulkyItem[]) {
		let db: IDBPDatabase<BulkyDB> | undefined

		try {
			db = await initDB()
			const tx = db.transaction('item', 'readwrite')

			const ops = items.map(item => tx.store.delete(item.id))
			await Promise.all([...ops, tx.done])
		} catch (e) {
			console.log(e)
		} finally {
			db?.close()
		}
	}

	return {
		putStashTabs,
		getStashTabs,
		deleteStashTabs,
		putItems,
		getItemsByBaseType,
		getItemsByStashTab,
		deleteItems,
	}
}
