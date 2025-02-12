import styles from './ChatLayout.module.css'
import Sidebar from '@/components/layout/Sidebar'
import ChatWindow from '@/components/chat/ChatWindow'

export default function ChatLayout() {
	return (
		<div className={styles.layout}>
			<Sidebar />
			<ChatWindow />
		</div>
	)
}
