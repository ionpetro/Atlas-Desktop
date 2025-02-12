import styles from './Sidebar.module.css'
import { useState } from 'react'
import Image from 'next/image'
import logo from '@/assets/logo.png'

export default function Sidebar() {
	const [activeTab, setActiveTab] = useState('chat')

	return (
		<div className={styles.sidebar}>
			<div className={styles.header}>
				<Image src={logo.src} alt="Atlas" width={32} height={32} />{' '}
				<h2>Atlas OS</h2>
			</div>

			<nav className={styles.nav}>
				<button
					className={`${styles.tab} ${activeTab === 'chat' ? styles.active : ''}`}
					onClick={() => setActiveTab('chat')}
				>
					Chat
				</button>
				<button
					className={`${styles.tab} ${activeTab === 'settings' ? styles.active : ''}`}
					onClick={() => setActiveTab('settings')}
				>
					Settings
				</button>
			</nav>

			<div className={styles.content}>
				{activeTab === 'chat' && (
					<div className={styles.conversations}>
						<div className={styles.newChat}>New Chat</div>
						{/* Conversation list will go here */}
					</div>
				)}
				{activeTab === 'settings' && (
					<div className={styles.settings}>
						{/* Settings content will go here */}
					</div>
				)}
			</div>
		</div>
	)
}
