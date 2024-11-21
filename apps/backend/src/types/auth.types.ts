export type AuthorizerSimpleResponse<T = Record<string, any>> = {
	isAuthorized: boolean
	context?: T
}

export type AuthorizerPayload = {
	version: '2.0'
	type: 'REQUEST'
	routeArn: string
	identitySource: string[]
	routeKey: '$default'
	rawPath: string
	rawQueryString: string
	cookies: string[]
	headers: Record<string, string>
	queryStringParameters: Record<string, string>
	requestContext: {
		accountId: string
		apiId: string
		authentication: {
			clientCert: {
				clientCertPem: string
				subjectDN: string
				issuerDN: string
				serialNumber: string
				validity: {
					notBefore: string
					notAfter: string
				}
			}
		}
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
		routeKey: '$default'
		stage: '$default'
		time: string
		timeEpoch: number
	}
	pathParameters: Record<string, string>
	stageVariables: Record<string, string>
}
