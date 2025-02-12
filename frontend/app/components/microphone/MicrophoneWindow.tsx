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

	const requestPermission = async () => {
		const permitted = await window.BloopAPI.requestMicrophonePermission()
		setHasPermission(permitted)
		if (permitted) {
			try {
				const audioStream = await navigator.mediaDevices.getUserMedia({
					audio: true,
					video: false,
				})
				setStream(audioStream)
			} catch (err) {
				console.error('Error accessing microphone:', err)
				setHasPermission(false)
			}
		}
	}

	const handleStartRecording = async () => {
		if (!hasPermission) {
			await requestPermission()
			return
		}

		try {
			const audioStream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: false,
			})
			setStream(audioStream)

			audioChunks.current = []
			mediaRecorder.current = new MediaRecorder(audioStream, {
				mimeType: 'audio/webm',
			})

			mediaRecorder.current.ondataavailable = async event => {
				if (event.data.size > 0) {
					// Instead of collecting chunks, send them immediately
					try {
						await window.BloopAPI.streamAudioToGemini(event.data)
					} catch (err) {
						console.error('Error streaming audio:', err)
					}
				}
			}

			mediaRecorder.current.start(250)
			setIsRecording(true)
		} catch (err) {
			console.error('Error accessing microphone:', err)
			return
		}
	}

	const handleStopRecording = () => {
		if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
			mediaRecorder.current.stop()
			mediaRecorder.current.onstop = () => {
				const audioBlob = new Blob(audioChunks.current, { type: 'audio/webm' })
				// TODO: Send audioBlob to Gemini
				console.log('Recording stopped, blob size:', audioBlob.size)
			}
		}
		setIsRecording(false)
	}

	const handleCancel = () => {
		if (mediaRecorder.current && mediaRecorder.current.state === 'recording') {
			mediaRecorder.current.stop()
		}
		if (stream) {
			stream.getTracks().forEach(track => track.stop())
			setStream(null)
		}
		setIsRecording(false)
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
