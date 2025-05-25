import { Stats, createReadStream } from 'fs'
import * as readline from 'node:readline/promises'
import * as chokidar from 'chokidar'
import { WebContents } from 'electron'
import { SplitClientTxtLine } from '@shared/types/general.types'
import { mainToRendererEvents } from '@main/events/mainToRenderer'

export class ClientDotTxt {
	private watcher: chokidar.FSWatcher
	private streamOffset: number
	private debugClientIgnoreRegex: RegExp
	private infoClientIgnoreRegex: RegExp

	constructor(private path: string, webContents: WebContents) {
		// Define regexes for client events that are unimportant and can be ignored.
		this.debugClientIgnoreRegex = new RegExp(
			/\[(DEBUG|WARN) Client [0-9]*\]|ALTERNATE TREE JEWEL|Doodad hash: [0-9]+|Tile hash: [0-9]+|\[D3D[0-9]+\]|Connecting to instance server at [0-9]*/gm
		)
		this.infoClientIgnoreRegex = new RegExp(
			/\[INFO Client [0-9]*\] (\[SHADER\]|\[ENGINE\]|\[ENTITY\]|\[RENDER\]|\[RESOURCE\]|\[PARTICLE\]|\[GRAPH\]|\[TEXTURE\]|\[MAT\]|\[BUNDLE\]|\[JOB\]|\[SOUND\]|\[Item Filter\]|\[TRAILS\]|\[VIDEO\]|Enumerated|(Backup )?Web root)/m
		)

		// The stream offset. This is the last character of the file after it was processed.
		this.streamOffset = 0

		// Initialize the file watcher.
		this.watcher = chokidar.watch(path, {
			persistent: true,
			alwaysStat: true,
			usePolling: true,
		})

		// Watcher callbacks.
		this.watcher.on('add', (_, stats) => {
			this.onAdd(stats)
		})

		this.watcher.on('change', (_, stats) => {
			this.onChange(stats, webContents)
		})
	}

	private onAdd(stats: Stats | undefined) {
		if (!stats) return
		this.streamOffset = stats.size
	}

	private async onChange(stats: Stats | undefined, webContents: WebContents) {
		const stream = createReadStream(this.path, {
			encoding: 'utf-8',
			start: this.streamOffset,
		})

		const rl = readline.createInterface({
			input: stream,
			crlfDelay: Infinity,
		})

		for await (const line of rl) {
			const splitLine = this.splitLine(line)
			if (!splitLine) continue

			const shouldSend = this.shouldSendLineToRenderer(splitLine)

			if (shouldSend) {
				// Get the league from the message.
				const league = extractString(splitLine.message, 'chaos in ', '. B-MTN')
				if (!league) return

				mainToRendererEvents.sendNotification(webContents, {
					type: 'trade',
					ign: splitLine.sender,
					message: splitLine.message.split('B-MTN ')[1],
					league,
				})
			}
		}

		if (stats) {
			this.streamOffset = stats.size
		}
	}

	/**
	 * Split a line that might be relevant for Bulky to use and return the result.
	 * If it is not, return false.
	 */
	private splitLine(line: string): SplitClientTxtLine | false {
		if (line === '') return false

		// Filter this line out if it matches any of the ignore regexes.
		if (line.match(this.debugClientIgnoreRegex)) return false
		if (line.match(this.infoClientIgnoreRegex)) return false

		const splitLine = line.split(' ')

		const date = splitLine[0]
		const time = splitLine[1]
		const code = splitLine.slice(4, 7).join(' ') // e. g. [DEBUG Client 23100]

		const senderAndMessage = splitLine.slice(7).join(' ')
		const [unsanitizedSender, message] = senderAndMessage.split(': ')

		// Relevant client messages always have ': '. If the message is undefined, there was no colon.
		// Similarly, some messages don't have a sender. These are also not important for us.
		if (!unsanitizedSender || !message) return false
		if (!unsanitizedSender.startsWith('@From')) return false

		// The Array can't be empty, so this assertion is ok.
		const sender = unsanitizedSender.split(' ').pop()!

		// console.log({ date, time, code, senderAndMessage, unsanitizedSender, message, sender })

		return { date, time, code, sender, message }
	}

	/**
	 * Determine if a line is something that Bulky should display in its notification bar.
	 */
	private shouldSendLineToRenderer(line: SplitClientTxtLine) {
		if (line.message.match(/B-MTN /)) return true
		return false
	}
}
