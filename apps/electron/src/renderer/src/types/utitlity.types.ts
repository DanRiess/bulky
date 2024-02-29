import { Ref } from 'vue'

export type ObjectValues<T> = T[keyof T]
export type OptionalRecord = Record<string, unknown> | undefined
export type PartialRecord<K extends keyof any, T> = Partial<Record<K, T>>

export type Uuid<T extends OptionalRecord = undefined> = string & { __uuidBrand: T }

export const ASYNC_STATUS = {
	IDLE: 'IDLE',
	PENDING: 'PENDING',
	SUCCESS: 'SUCCESS',
	ERROR: 'ERROR',
} as const

export type AsyncStatus = ObjectValues<typeof ASYNC_STATUS>

/**
 * hidden type assertion for Object.keys
 * only use this if you know the object won't change its shape
 */
export const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>

export type MaybeRef<T> = T | Ref<T>

export type ButtonBackgroundColorScheme = 'dark' | 'light'
