export type ObjectValues<T> = T[keyof T]
export type OptionalRecord = Record<string, unknown> | undefined
export type Uuid<T extends OptionalRecord = undefined> = string & { __uuidBrand: T }
