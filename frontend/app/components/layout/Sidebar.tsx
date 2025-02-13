import styles from './Sidebar.module.css'
import { useState } from 'react'
import Image from 'next/image'
import logo from '@/assets/logo.png'
import { Home, MessageSquare } from 'lucide-react'

export default function Sidebar() {
	const [activeTab, setActiveTab] = useState('home')

	return (
		<div className={styles.sidebar}>
			<div className={styles.header}>
				<Image src={logo.src} alt="Atlas" width={32} height={32} />{' '}
				<h2>Atlas OS</h2>
			</div>

			<nav className={styles.nav}>
				<button
					className={`${styles.tab} ${activeTab === 'home' ? styles.active : ''}`}
					onClick={() => setActiveTab('home')}
				>
					<Home size={16} />
					<span>Home</span>
				</button>
				<button
					className={`${styles.tab} ${activeTab === 'chat' ? styles.active : ''}`}
					onClick={() => setActiveTab('chat')}
				>
					<MessageSquare size={16} />
					<span>Chat</span>
				</button>
			</nav>

			<div className={styles.content}>
				{activeTab === 'home' && (
					<div className={styles.home}>{/* Home content will go here */}</div>
				)}
				{activeTab === 'chat' && <div />}
			</div>
		</div>
	)
}
