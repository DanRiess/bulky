import { BulkyBazaarOffer } from '@shared/types/bulky.types'
import { debounce } from 'lodash-es'
import { computed, readonly, type Ref, type ComputedRef, shallowRef } from 'vue'

type MapOperation<K, V> = { type: 'set'; key: K; value: V } | { type: 'delete'; key: K } | { type: 'clear' }

interface UseDebouncedReactiveMapOptions {
	/** Debounce wait time in milliseconds */
	debounceMs?: number
	id?: string
}

interface UseDebouncedReactiveMapReturnType<K, V> {
	/**
	 * The internal mutable reactive Map.
	 * This should be returned by the Pinia store to comply with Pinia's state requirements
	 * for devtools, SSR, etc. Use naming conventions (e.g., prefix with '_') in the store
	 * to discourage direct external mutation.
	 */
	_offers: Ref<Map<K, V>>
	/**
	 * A computed property providing a readonly version of the Map for safe consumption.
	 */
	offers: ComputedRef<ReadonlyMap<K, V>>
	/**
	 * Queues a 'set' operation for the Map.
	 * The actual update to the reactive Map is debounced.
	 */
	queueSet: (key: K, value: V) => void
	/**
	 * Queues a 'delete' operation for the Map.
	 * The actual update to the reactive Map is debounced.
	 */
	queueDelete: (key: K) => void
	/**
	 * Queues a 'clear' operation for the Map.
	 * The actual update to the reactive Map is debounced.
	 */
	queueClear: () => void
	/**
	 * Immediately processes any pending operations in the queue,
	 * cancelling any scheduled debounced execution.
	 */
	forceProcessQueue: () => void
}

/**
 * Creates a reactive Map with debounced updates.
 * Modifications are queued and then applied in a batch after a debounce period.
 *
 * @param initialEntries Optional initial entries for the Map, or a Ref to an existing Map.
 * @param options Configuration options like debounceMs.
 * @returns An object with the reactive map, readonly access, and queueing functions.
 */
export function useDebouncedReactiveMap<K = BulkyBazaarOffer['uuid'], V = BulkyBazaarOffer>(
	options?: UseDebouncedReactiveMapOptions
): UseDebouncedReactiveMapReturnType<K, V> {
	const debounceMs = options?.debounceMs ?? 300

	// 1. The internal actual reactive Map.
	//    `toValue` handles if `initialEntries` is already a ref.
	const _offers = shallowRef<Map<K, V>>(new Map())

	// 2. Internal queue for pending operations.
	let _queuedOperations: MapOperation<K, V>[] = []

	// 3. Internal function to process the queue.
	const _processQueue = () => {
		if (_queuedOperations.length === 0) {
			return
		}
		// console.log(`processing ${_queuedOperations.length} items for id ${options?.id}...`)

		// Create a new Map based on the current _offers value.
		// This ensures we're applying changes to the latest committed state
		// and that the final assignment will be a new Map instance for reactivity.
		const newMap = new Map(_offers.value)

		for (const operation of _queuedOperations) {
			switch (operation.type) {
				case 'set':
					newMap.set(operation.key, operation.value)
					break
				case 'delete':
					newMap.delete(operation.key)
					break
				case 'clear':
					newMap.clear()
					break
			}
		}

		_offers.value = newMap // This single assignment triggers reactivity
		_queuedOperations = [] // Clear the queue
	}

	// 4. Debounced version of the processor.
	const debouncedProcessQueue = debounce(_processQueue, debounceMs, { leading: false, trailing: true })

	// 5. Actions to queue modifications
	function queueSet(key: K, value: V): void {
		_queuedOperations.push({ type: 'set', key, value })
		debouncedProcessQueue()
	}

	function queueDelete(key: K): void {
		_queuedOperations.push({ type: 'delete', key })
		debouncedProcessQueue()
	}

	function queueClear(): void {
		_queuedOperations.push({ type: 'clear' })
		debouncedProcessQueue()
	}

	function forceProcessQueue(): void {
		debouncedProcessQueue.cancel() // Cancel any pending debounced call
		_processQueue() // Process immediately
	}

	// 6. Exported read-only access to the map data.
	const offers = computed(() => readonly(_offers.value))

	return {
		_offers,
		offers: offers as ComputedRef<ReadonlyMap<K, V>>,
		queueSet,
		queueDelete,
		queueClear,
		forceProcessQueue,
	}
}
