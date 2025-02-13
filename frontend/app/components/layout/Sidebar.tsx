import styles from './Sidebar.module.css'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import logo from '@/assets/logo.png'
import { Home, MessageSquare } from 'lucide-react'

export default function Sidebar() {
	const pathname = usePathname()

	return (
		<div className={styles.sidebar}>
			<div className={styles.header}>
				<Image src={logo.src} alt="Atlas" width={32} height={32} />{' '}
				<h2>Atlas OS</h2>
			</div>

			<nav className={styles.nav}>
				<Link
					href="/"
					className={`${styles.tab} ${pathname === '/' ? styles.active : ''}`}
				>
					<Home size={16} />
					<span className={styles.tabText}>Home</span>
				</Link>
				<Link
					href="/chat"
					className={`${styles.tab} ${pathname === '/chat' ? styles.active : ''}`}
				>
					<MessageSquare size={16} />
					<span className={styles.tabText}>Chat</span>
				</Link>
			</nav>

			<div className={styles.content}>
				{pathname === '/' && (
					<div className={styles.home}>{/* Home content will go here */}</div>
				)}
				{pathname === '/chat' && <div />}
			</div>
		</div>
	)
}
