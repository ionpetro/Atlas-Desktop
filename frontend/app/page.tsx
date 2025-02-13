'use client'

import Image from 'next/image'
import Backpack from '@/assets/back.png'
import styles from './page.module.css'

export default function Home() {
	return (
		<div className={styles.container}>
			<Image
				className={styles.background}
				src={Backpack.src}
				alt="background"
				width={400}
				height={300}
			/>
			<div className={styles.header}>
				<h1 className={styles.headerText}>Hi, I'm Atlas</h1>
				<h2 className={styles.headerSubText}>
					Your personal AI <strong>Co-worker</strong> and{' '}
					<em>Business Superintelligence</em>.
				</h2>

				<div className={styles.note}>
					<span>●</span> Available 24/7
				</div>
			</div>
		</div>
	)
}
