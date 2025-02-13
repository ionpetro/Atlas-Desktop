import { useChat } from '@/context/ChatContext'
import styles from './MessageList.module.css'
import { useRef, useEffect } from 'react'

export default function MessageList() {
	const bottomRef = useRef<HTMLDivElement>(null)
	const { messages, isLoading } = useChat()

	useEffect(() => {
		bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
	}, [messages])

	return (
		<div className={styles.messageList}>
			{messages.map(message => (
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
			{isLoading && (
				<div className={`${styles.message} ${styles.aiMessage}`}>
					<div className={styles.messageContent}>
						<div className={styles.typingIndicator}>
							<span></span>
							<span></span>
							<span></span>
						</div>
					</div>
				</div>
			)}
			<div ref={bottomRef} />
		</div>
	)
}
