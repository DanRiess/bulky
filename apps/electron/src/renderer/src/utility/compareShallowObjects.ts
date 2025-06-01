export function compareShallowObjects(a: object, b: object): boolean {
	const keysA = Object.keys(a)
	const keysB = Object.keys(b)

	if (keysA.length !== keysB.length) {
		return false
	}

	for (const key of keysA) {
		if (!b.hasOwnProperty(key) || a[key] !== b[key]) {
			return false
		}
	}

	return true
}
