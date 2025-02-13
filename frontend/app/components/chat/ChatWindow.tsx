import styles from './ChatWindow.module.css'
import MessageList from '@/components/chat/MessageList'
import MessageInput from '@/components/chat/MessageInput'
import { useEffect } from 'react'
import { ChatProvider } from '@/context/ChatContext'
import { initGeminiService } from '@/services/gemini'

export default function ChatWindow() {
	useEffect(() => {
		// Initialize Gemini service with API key from environment variable
		const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
		if (!apiKey) {
			console.error('NEXT_PUBLIC_GEMINI_API_KEY is not set')
			return
		}
		initGeminiService(apiKey)
	}, [])

	return (
		<ChatProvider>
			<div className={styles.chatWindow}>
				<div className={styles.header}>
					<div className={styles.status}>
						<span className={styles.statusDot} />
						Online
					</div>
				</div>

				<MessageList />
				<MessageInput />
			</div>
		</ChatProvider>
	)
}
