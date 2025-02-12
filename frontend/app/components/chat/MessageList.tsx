import styles from './MessageList.module.css'
import { useRef, useEffect } from 'react'

interface Message {
	id: string
	content: string
	sender: 'user' | 'ai'
	timestamp: Date
}

// Temporary mock data
const mockMessages: Message[] = [
	{
		id: '1',
		content: 'Hello! How can I help you today?',
		sender: 'ai',
		timestamp: new Date(),
	},
	{
		id: '2',
		content: 'I need help with a coding problem.',
		sender: 'user',
		timestamp: new Date(),
	},
]

export default function MessageList() {
	const bottomRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [mockMessages])

	return (
		<div className={styles.messageList}>
			{mockMessages.map(message => (
				<div
					key={message.id}
					className={`${styles.message} ${
						message.sender === 'user' ? styles.userMessage : styles.aiMessage
					}`}
				>
					<div className={styles.messageContent}>{message.content}</div>
					<div className={styles.messageTime}>
						{message.timestamp.toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit',
						})}
					</div>
				</div>
			))}
			<div ref={bottomRef} />
		</div>
	)
}
