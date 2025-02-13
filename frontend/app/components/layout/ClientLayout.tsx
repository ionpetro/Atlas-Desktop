'use client'

import Sidebar from '@/components/layout/Sidebar'
import styles from '@/layout.module.css'
import { usePathname } from 'next/navigation'

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode
}) {
	const pathname = usePathname()
	const isMultimodal = pathname === '/multimodal'

	return (
		<div className={styles.layout}>
			{!isMultimodal && <Sidebar />}
			<main
				className={`${styles.main} ${isMultimodal ? styles.fullWidth : ''}`}
			>
				{children}
			</main>
		</div>
	)
}
