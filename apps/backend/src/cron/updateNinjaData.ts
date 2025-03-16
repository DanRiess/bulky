import { writeFileSync } from 'fs'
import { NinjaArrayItem, NinjaCategory, NinjaDenseDto, ProcessedNinjaCategory } from '../types/ninja.types'
import { PoeLeagueRecordDto, RuthlessRule, SSFRule } from '../types/poeLeagues.types'
import { notEmpty } from '../utility/notEmpty'
import { saveToS3 } from '../utility/saveToS3'
import { typedFetch } from '../utility/typedFetch'
import { brotliCompressSync } from 'zlib'

/**
 * This cron job will periodically fetch economic data from poe.ninja.
 * It processes it to only include necessary values.
 * Then, the processed data will be compressed and uploaded to an S3 bucket.
 * It will then be served from a CloudFront distribution.
 *
 * Private function - MUST NOT be exposed through an API.
 */
export async function updateNinjaData() {
	let leagues: string[] = []

	// Get current leagues and filter them.
	try {
		const leagueData = await typedFetch<PoeLeagueRecordDto[]>('https://pathofexile.com/api/leagues', {
			headers: {
				'User-Agent': 'Oauth bulky/0.0.1 (contact: riess.dan@gmail.com) StrictMode',
			},
		})

		leagues = processLeagues(leagueData)
	} catch (e) {
		// It is not necessary to do anything in case of an error.
		// It will just result in no / fewer leagues being updated.
		console.log('Error fetching leagues.')
	}

	// Hardcode leagues that do not appear in the /leagues endpoint (e. g. Events).
	const HARDCODED_LEAGUES: string[] = []
	leagues = leagues.concat(HARDCODED_LEAGUES)

	// Replace Spaces with '+' signs, that is how ninja encodes league strings
	leagues = leagues.map(league => league.replace(/\s+/g, '+'))

	const processedLeaguePromiseResults = await Promise.allSettled(
		leagues.map(async league => {
			const url = `https://poe.ninja/api/data/DenseOverviews?league=${league}`

			try {
				const data = await typedFetch<NinjaDenseDto>(url)
				return {
					league,
					data: processNinjaResponse(data),
				}
			} catch (e) {
				return undefined
			}
		})
	)

	const compressedLeagues = processedLeaguePromiseResults
		.map(promiseResult => {
			if (promiseResult.status === 'rejected') return undefined
			if (promiseResult.value === undefined) return undefined

			const input = Buffer.from(JSON.stringify(promiseResult.value.data), 'utf-8')
			return { league: promiseResult.value.league, data: brotliCompressSync(input) }
		})
		.filter(notEmpty)

	// writeFileSync('./compressed.json', compressedLeagues[0].data, 'binary')

	console.log({ compressedLeagues: compressedLeagues.map(l => l.league) })

	// Save compressed files to S3.
	await Promise.allSettled(
		compressedLeagues.map(async compressed => {
			return await saveToS3(`${compressed.league}.json`, compressed.data)
		})
	)
}

/**
 * Process ninja categories. Only scan for necessary data for Bulky and save them in the smallest way possible.
 * This is currently an array.
 * The combined categories will be compressed with brotli and returned.
 */
function processNinjaResponse(dto: NinjaDenseDto) {
	// The ninja categories that Bulky uses. Ignore the other ones.
	const NINJA_CATEGORIES: NinjaCategory[] = [
		'Artifact',
		'Beast',
		'Currency',
		'DeliriumOrb',
		'Essence',
		'Fossil',
		'Fragment',
		'Map',
		'Resonator',
		'Scarab',
		'UniqueMap',
	]

	// Process currency and fragment items.
	const currencies = dto.currencyOverviews
		.map(overview => {
			if (!NINJA_CATEGORIES.includes(overview.type)) return

			const processedCategory: ProcessedNinjaCategory = {
				category: overview.type,
				items: overview.lines.map(line => {
					// There are no maps in the currency overviews, so the 3rd parameter can always be set to undefined.
					return [line.name, line.chaos, undefined]
				}),
			}

			return processedCategory
		})
		.filter(notEmpty)

	// Process all other necessary categories.
	const items = dto.itemOverviews
		.map(overview => {
			if (!NINJA_CATEGORIES.includes(overview.type)) return

			const items = overview.lines
				.map((line): NinjaArrayItem | undefined => {
					// If there is no tier on the map, it should not be returned.
					if ((overview.type === 'Map' || overview.type === 'UniqueMap') && !line.variant) return

					const mapTier =
						overview.type === 'Map' || overview.type === 'UniqueMap'
							? Number(line.variant?.split(',')[0].replace('T', '')) || undefined
							: undefined

					return [line.name, line.chaos, mapTier]
				})
				.filter(notEmpty)

			const processedCategory: ProcessedNinjaCategory = {
				category: overview.type,
				items,
			}

			return processedCategory
		})
		.filter(notEmpty)

	return [...currencies, ...items]
}

/**
 * Filter out leagues where bulk trading does not make sense.
 * We don't need data for those.
 */
function processLeagues(leagues: PoeLeagueRecordDto[]) {
	return leagues
		.filter(league => {
			return !!!league.rules.find(rule => rule instanceof SSFRule || rule instanceof RuthlessRule)
		})
		.sort((a, b) => (a.category.current === b.category.current ? 0 : a.category.current ? -1 : 1))
		.map(league => league.id)
}

updateNinjaData()
