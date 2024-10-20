/**
 * Use this type guard function as filter callback for filtering out null | undefined values.
 * Instead of .filter(Boolean), use .filter(notEmpty).
 * .filter(Boolean) is sometimes not enough for the vue-tsc typecheck.
 */
export function notEmpty<TValue>(value: TValue | null | undefined): value is TValue {
	return value !== null && value !== undefined
}
