import {
	createContext,
	useContext,
	useState,
	useCallback,
	ReactNode,
} from 'react'
import { getGeminiService } from '../services/gemini'

interface Message {
	id: string
	content: string
	sender: 'user' | 'ai'
	timestamp: Date
}

interface ChatContextType {
	messages: Message[]
	sendMessage: (content: string) => Promise<void>
	isLoading: boolean
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
	const [messages, setMessages] = useState<Message[]>([])
	const [isLoading, setIsLoading] = useState(false)

	const sendMessage = useCallback(async (content: string) => {
		try {
			setIsLoading(true)

			// Add user message
			const userMessage: Message = {
				id: Date.now().toString(),
				content,
				sender: 'user',
				timestamp: new Date(),
			}
			setMessages(prev => [...prev, userMessage])

			// Get AI response
			const geminiService = getGeminiService()
			const response = await geminiService.sendMessage(content)

			// Add AI message
			const aiMessage: Message = {
				id: (Date.now() + 1).toString(),
				content: response,
				sender: 'ai',
				timestamp: new Date(),
			}
			setMessages(prev => [...prev, aiMessage])
		} catch (error) {
			console.error('Error in chat:', error)
			// Add error message
			const errorMessage: Message = {
				id: (Date.now() + 1).toString(),
				content: 'Sorry, I encountered an error. Please try again.',
				sender: 'ai',
				timestamp: new Date(),
			}
			setMessages(prev => [...prev, errorMessage])
		} finally {
			setIsLoading(false)
		}
	}, [])

	return (
		<ChatContext.Provider value={{ messages, sendMessage, isLoading }}>
			{children}
		</ChatContext.Provider>
	)
}

export function useChat() {
	const context = useContext(ChatContext)
	if (context === undefined) {
		throw new Error('useChat must be used within a ChatProvider')
	}
	return context
}
