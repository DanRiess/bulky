import { MaybeRefOrGetter, Ref, isRef } from 'vue'

export type ObjectValues<T> = T[keyof T]
export type OptionalRecord = Record<string, unknown> | undefined
export type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

export type Uuid<T extends OptionalRecord = undefined> = string & { __uuidBrand: T }

/**
 * type assertions for Object.keys
 * only use this if you know the object won't change its shape
 */
export const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>

/**
 * type assertions for Object.entries
 * only use this if you know the object won't change its shape
 */
export function getEntries<OBJ_T extends ObjectType>(obj: OBJ_T): ObjectEntries<OBJ_T> {
	return Object.entries(obj) as ObjectEntries<OBJ_T>
}

/**
 * type assertions for Object.fromEntries
 * only use this if you know the object won't change its shape
 */
export function typedFromEntries<ARR_T extends EntriesType>(arr: ARR_T): EntriesToObject<ARR_T> {
	return Object.fromEntries(arr) as EntriesToObject<ARR_T>
}

export type MaybeRef<T> = T | Ref<T>

/** make some properties of an object required */
export type RequireSome<T, K extends keyof T> = T & { [P in K]-?: T[P] }

export type ButtonBackgroundColorScheme = 'dark' | 'light'

export type RefOrGetter<T> = Ref<T> | (() => T)

/** Utility function to check if a variable can be used in a Vue watcher */
export function isWatchable<T>(value: MaybeRefOrGetter<T>): value is RefOrGetter<T> {
	return isRef(value) || typeof value === 'function'
}

/** ------------------------------------------------------------------------------------------------------------------------------
 * Utility for typed Object.fromEntries
 * This stuff is some serious black magic.
 * https://stackoverflow.com/questions/69019873/how-can-i-get-typed-object-entries-and-object-fromentries-in-typescript
 */

type EntriesType = [PropertyKey, unknown][] | ReadonlyArray<readonly [PropertyKey, unknown]>
type DeepWritable<OBJ_T> = { -readonly [P in keyof OBJ_T]: DeepWritable<OBJ_T[P]> }
// From https://stackoverflow.com/a/50375286
type UnionToIntersection<UNION_T> = (UNION_T extends any ? (k: UNION_T) => void : never) extends (k: infer I) => void ? I : never
type UnionObjectFromArrayOfPairs<ARR_T extends EntriesType> = DeepWritable<ARR_T> extends (infer R)[]
	? R extends [infer key, infer val]
		? { [prop in key & PropertyKey]: val }
		: never
	: never
type MergeIntersectingObjects<ObjT> = { [key in keyof ObjT]: ObjT[key] }
type EntriesToObject<ARR_T extends EntriesType> = MergeIntersectingObjects<
	UnionToIntersection<UnionObjectFromArrayOfPairs<ARR_T>>
>

/** Utility for Object.entries */

type ObjectType = Record<PropertyKey, unknown>
type PickByValue<OBJ_T, VALUE_T> = // From https://stackoverflow.com/a/55153000
	Pick<OBJ_T, { [K in keyof OBJ_T]: OBJ_T[K] extends VALUE_T ? K : never }[keyof OBJ_T]>
type ObjectEntries<OBJ_T> = // From https://stackoverflow.com/a/60142095
	{ [K in keyof OBJ_T]: [keyof PickByValue<OBJ_T, OBJ_T[K]>, OBJ_T[K]] }[keyof OBJ_T][]
