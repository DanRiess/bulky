export type LambdaPayloadEvent = {
	version: '2.0'
	routeKey: string
	rawPath: string
	rawQueryString: string
	queryStringParameters?: Record<string, string>
	headers: Record<string, string>
	requestContext: {
		accountId: string
		apiId: string
		domainName: string
		domainPrefix: string
		http: {
			method: 'GET' | 'POST' | 'PUT' | 'DELETE'
			path: string
			protocol: 'HTTP/1.1'
			sourceIp: string
			userAgent: string
		}
		requestId: string
		routeKey: string
		stage: string
		time: string
		timeEpoch: number
	}
	body?: string
	isBase64Encoded: boolean
}
