import styles from './MicrophoneWindow.module.css'
import { useState, useEffect, useRef } from 'react'

export default function MicrophoneWindow() {
	const [isRecording, setIsRecording] = useState(false)
	const [hasPermission, setHasPermission] = useState<boolean | null>(null)
	const [stream, setStream] = useState<MediaStream | null>(null)
	const mediaRecorder = useRef<MediaRecorder | null>(null)
	const audioChunks = useRef<Blob[]>([])

	useEffect(() => {
		// Check permission on component mount
		const checkPermission = async () => {
			const permitted = await window.BloopAPI.checkMicrophonePermission()
			setHasPermission(permitted)
		}
		checkPermission()
	}, [])

	const requestPermission = async () => {}

	const handleStartRecording = async () => {}

	const handleStopRecording = () => {}

	const handleCancel = () => {}

	return (
		<div className={styles.container}>
			<div className={styles.microphoneWrapper}>
				<button
					className={`${styles.microphoneButton} ${isRecording ? styles.recording : ''}`}
					onClick={isRecording ? handleStopRecording : handleStartRecording}
				>
					🎤
				</button>
				{hasPermission === false && (
					<div className={styles.permissionError}>
						Microphone access denied. Please grant permission to use this
						feature.
					</div>
				)}
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
