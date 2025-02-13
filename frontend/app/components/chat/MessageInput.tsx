import { useChat } from '@/context/ChatContext'
import styles from './MessageInput.module.css'
import { useState, KeyboardEvent } from 'react'
import { AudioLines, Send } from 'lucide-react'

export default function MessageInput() {
	const [message, setMessage] = useState('')
	const { sendMessage, isLoading } = useChat()

	const handleSubmit = async () => {
		if (message.trim() && !isLoading) {
			const currentMessage = message
			setMessage('')
			await sendMessage(currentMessage)
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
					disabled={isLoading}
				/>
				<button
					className={styles.sendButton}
					onClick={handleSubmit}
					disabled={!message.trim() || isLoading}
				>
					<Send size={16} style={{ color: 'black' }} />
				</button>
				<button
					className={styles.sendButton}
					onClick={() => window.BloopAPI.openMicrophoneWindow()}
					title="Talk to Atlas"
				>
					<AudioLines size={16} style={{ color: 'black' }} />
				</button>
			</div>
		</div>
	)
}
