import { AuthorizerPayload, AuthorizerSimpleResponse } from '../types/authorizer.types'
import { verifyWithKms } from './signAndVerify'

/**
 * This function serves as pseudo middleware auth function for protected endpoints.
 * Without a valid JWT, function execution will be blocked.
 */
export async function authorize(payload: AuthorizerPayload): Promise<AuthorizerSimpleResponse> {
	const response: AuthorizerSimpleResponse = {
		isAuthorized: false,
	}

	// Get the authorization header.
	// Beware that 'Authorization' will not work. It has to be lowercase.
	const authHeader = payload.headers.authorization
	if (!authHeader || typeof authHeader !== 'string') return response

	// Remove the 'Bearer ' from the authorization string.
	const jwt = authHeader.split(' ')[1]
	if (!jwt) return response

	// Verify the jwt.
	const isAuthorized = await verifyWithKms(jwt)

	return { isAuthorized }
}
