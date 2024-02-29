import { Chatbox } from '@main/inputs/chatbox'

export function typeInChat(message: string, chatbox: Chatbox) {
	chatbox.type(message)
	return true
}
