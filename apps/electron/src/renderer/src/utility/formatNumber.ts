/**
 * Format large numbers into a human-readable format.
 * E. g. 50000 will become 50k.
 */
export function formatNumber(num: number): string {
	if (num === null || num === undefined || isNaN(num)) {
		throw new Error('Invalid input: please provide a valid number.')
	}

	const suffixes: string[] = ['', 'k', 'm', 'b', 't'] // k for thousand, m for million, etc.
	const tier: number = Math.floor(Math.log10(Math.abs(num)) / 3) // Determines the tier based on the number's magnitude

	if (tier === 0) return num.toString() // No abbreviation needed

	const suffix: string = suffixes[tier] || '' // Get the suffix for the tier
	const scale: number = Math.pow(10, tier * 3) // Calculate the scale (e.g., 1k = 10^3)

	const abbreviated: number = num / scale // Scale the number down
	return `${abbreviated.toFixed(1).replace(/\.0$/, '')}${suffix}` // Format to one decimal, removing ".0" if unnecessary
}
