import styles from './MicrophoneWindow.module.css'
import { useState } from 'react'

export default function MicrophoneWindow() {
	const [isRecording, setIsRecording] = useState(false)

	const handleStartRecording = () => {
		setIsRecording(true)
		// TODO: Implement recording logic
	}

	const handleStopRecording = () => {
		setIsRecording(false)
		// TODO: Implement stop recording logic
	}

	const handleCancel = () => {
		window.close()
	}

	return (
		<div className={styles.container}>
			<div className={styles.microphoneWrapper}>
				<button
					className={`${styles.microphoneButton} ${isRecording ? styles.recording : ''}`}
					onClick={isRecording ? handleStopRecording : handleStartRecording}
				>
					🎤
				</button>
			</div>
			<div className={styles.actions}>
				<button className={styles.cancelButton} onClick={handleCancel}>
					Cancel
				</button>
				{isRecording && (
					<button className={styles.sendButton} onClick={handleStopRecording}>
						Send
					</button>
				)}
			</div>
		</div>
	)
}
