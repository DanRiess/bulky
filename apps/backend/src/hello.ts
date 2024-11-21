export async function hello() {
	return {
		statusCode: 200,
		body: JSON.stringify({
			message: 'first ts lambda, yay! and it works in ts',
		}),
	}
}
