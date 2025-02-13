import { GoogleGenerativeAI } from '@google/generative-ai'

export class GeminiService {
	private genAI: GoogleGenerativeAI
	private chat: any

	constructor(apiKey: string) {
		this.genAI = new GoogleGenerativeAI(apiKey)
		this.initChat()
	}

	private initChat() {
		const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
		this.chat = model.startChat({
			history: [
				{
					role: 'user',
					parts: [{ text: 'Hello' }],
				},
				{
					role: 'model',
					parts: [{ text: 'Hello! How can I help you today?' }],
				},
			],
		})
	}

	async sendMessage(message: string): Promise<string> {
		try {
			const result = await this.chat.sendMessage(message)
			return result.response.text()
		} catch (error) {
			console.error('Error sending message to Gemini:', error)
			throw error
		}
	}

	resetChat() {
		this.initChat()
	}
}

// Create a singleton instance
let geminiInstance: GeminiService | null = null

export const initGeminiService = (apiKey: string) => {
	geminiInstance = new GeminiService(apiKey)
	return geminiInstance
}

export const getGeminiService = () => {
	if (!geminiInstance) {
		throw new Error(
			'Gemini service not initialized. Call initGeminiService first.'
		)
	}
	return geminiInstance
}
