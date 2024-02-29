export class InvalidUuidError extends Error {
	constructor(message?: string) {
		super(message ?? 'Error: Invalid UUID!')

		Object.setPrototypeOf(this, InvalidUuidError.prototype)
	}
}
