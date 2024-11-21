import { AuthorizerPayload, AuthorizerSimpleResponse } from './types/auth.types'

/**
 * This function serves as pseudo middleware auth function for protected endpoints.
 * Without a valid JWT, function execution will be blocked.
 */
export function authorize(payload: AuthorizerPayload): AuthorizerSimpleResponse {
	console.log({ payload })
	// Block 50% of requests for fun
	const isAuthorized = Math.random() > 0.5
	console.log({ isAuthorized })

	return { isAuthorized }
}
