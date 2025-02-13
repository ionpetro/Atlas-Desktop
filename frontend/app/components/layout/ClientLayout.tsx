'use client'

import Sidebar from '@/components/layout/Sidebar'
import styles from '@/layout.module.css'

export default function ClientLayout({
	children,
}: {
	children: React.ReactNode
}) {
	return (
		<div className={styles.layout}>
			<Sidebar />
			<main className={styles.main}>{children}</main>
		</div>
	)
}
