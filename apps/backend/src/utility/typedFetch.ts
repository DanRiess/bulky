export async function typedFetch<T extends unknown>(url: string | URL | globalThis.Request, init?: RequestInit) {
	const response = await fetch(url, init)

	if (!response.ok) {
		throw new Error(response.statusText)
	}

	return (await response.json()) as T
}
