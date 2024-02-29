import { clipboard } from 'electron'

export class Clipboard {
	private lastEntry: string | undefined

	public read() {
		return clipboard.readText()
	}

	public write(text: string) {
		this.lastEntry = clipboard.readText()
		clipboard.writeText(text)
	}

	public restore() {
		if (!this.lastEntry) return

		clipboard.writeText(this.lastEntry)
		this.lastEntry = undefined
	}
}
