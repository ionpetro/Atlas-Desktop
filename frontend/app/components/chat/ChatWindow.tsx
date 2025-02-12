import styles from './ChatWindow.module.css'
import MessageList from '@/components/chat/MessageList'
import MessageInput from '@/components/chat/MessageInput'

export default function ChatWindow() {
	return (
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
	)
}
