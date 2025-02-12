import styles from './MessageInput.module.css'
import { useState, KeyboardEvent } from 'react'

export default function MessageInput() {
	const [message, setMessage] = useState('')

	const handleSubmit = () => {
		if (message.trim()) {
			// TODO: Handle message sending
			console.log('Sending message:', message)
			setMessage('')
		}
	}

	const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === 'Enter' && !e.shiftKey) {
			e.preventDefault()
			handleSubmit()
		}
	}

	return (
		<div className={styles.inputWrapper}>
			<div className={styles.mediaButtons}>
				<button className={styles.mediaButton}>🎤</button>
				<button className={styles.mediaButton}>📷</button>
			</div>
			<div className={styles.inputContainer}>
				<textarea
					className={styles.input}
					value={message}
					onChange={e => setMessage(e.target.value)}
					onKeyDown={handleKeyPress}
					placeholder="Type a message..."
					rows={1}
				/>
				<button
					className={styles.sendButton}
					onClick={handleSubmit}
					disabled={!message.trim()}
				>
					Send
				</button>
			</div>
		</div>
	)
}
