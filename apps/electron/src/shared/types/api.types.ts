export type BulkyApiResponse = {
	statusCode: number
	body: string
}

export type OfferRequestTimestamps = Record<
	string,
	| {
			lastSuccessfulFetch: number
			lastFetchAttempt: number
	  }
	| undefined
>
