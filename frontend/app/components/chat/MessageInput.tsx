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
				<button
					className={styles.sendButton}
					onClick={() => window.BloopAPI.openMicrophoneWindow()}
					title="Talk to Atlas"
				>
					🎤
				</button>
			</div>
		</div>
	)
}
