import styles from './MultimodalWindow.module.css'
import { useRef, useState, useEffect } from 'react'
import { useLiveAPIContext } from '../../../app/multimodal/contexts/LiveAPIContext'
import { useWebcam } from '../../../app/multimodal/components/hooks/use-webcam'
import { useScreenCapture } from '../../../app/multimodal/components/hooks/use-screen-capture'
import { AudioRecorder } from '../../../app/multimodal/lib/audio-recorder'

export default function MultimodalWindow() {
	const [isRecording, setIsRecording] = useState(false)
	const [hasPermission, setHasPermission] = useState<boolean | null>(null)
	const [inVolume, setInVolume] = useState(0)
	const [audioRecorder] = useState(() => new AudioRecorder())
	const [activeVideoStream, setActiveVideoStream] =
		useState<MediaStream | null>(null)
	const videoRef = useRef<HTMLVideoElement>(null)
	const webcam = useWebcam()
	const screenCapture = useScreenCapture()

	const { client, connected, connect, disconnect } = useLiveAPIContext()

	useEffect(() => {
		const checkPermission = async () => {
			const permitted = await window.BloopAPI.checkMicrophonePermission()
			setHasPermission(permitted)
		}
		checkPermission()
	}, [])

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.srcObject = activeVideoStream
		}
	}, [activeVideoStream])

	useEffect(() => {
		const onData = (base64: string) => {
			if (connected) {
				client.sendRealtimeInput([
					{
						mimeType: 'audio/pcm;rate=16000',
						data: base64,
					},
				])
			}
		}

		if (isRecording && hasPermission) {
			audioRecorder.on('data', onData).on('volume', setInVolume).start()
		} else {
			audioRecorder.stop()
		}

		return () => {
			audioRecorder.off('data', onData).off('volume', setInVolume)
		}
	}, [isRecording, hasPermission, connected, client, audioRecorder])

	const handleStartRecording = async () => {
		if (!connected) {
			await connect()
		}
		setIsRecording(true)
	}

	const handleStopRecording = () => {
		disconnect()
		setIsRecording(false)
		if (activeVideoStream) {
			activeVideoStream.getTracks().forEach(track => track.stop())
			setActiveVideoStream(null)
		}
	}

	const handleCancel = () => {
		handleStopRecording()
		window.close()
	}

	const toggleWebcam = async () => {
		if (webcam.isStreaming) {
			webcam.stop()
			setActiveVideoStream(null)
		} else {
			const stream = await webcam.start()
			setActiveVideoStream(stream)
			screenCapture.stop()
		}
	}

	const toggleScreenShare = async () => {
		if (screenCapture.isStreaming) {
			screenCapture.stop()
			setActiveVideoStream(null)
		} else {
			const stream = await screenCapture.start()
			setActiveVideoStream(stream)
			webcam.stop()
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.videoWrapper}>
				<video
					ref={videoRef}
					autoPlay
					playsInline
					className={`${styles.video} ${!activeVideoStream ? styles.hidden : ''}`}
				/>
			</div>

			<div className={styles.controlsWrapper}>
				<div className={styles.mainControls}>
					<button
						className={`${styles.recordButton} ${isRecording ? styles.recording : ''}`}
						onClick={isRecording ? handleStopRecording : handleStartRecording}
					>
						{isRecording ? '⏹' : '🎤'}
					</button>

					<button
						className={`${styles.mediaButton} ${webcam.isStreaming ? styles.active : ''}`}
						onClick={toggleWebcam}
					>
						📹
					</button>

					<button
						className={`${styles.mediaButton} ${screenCapture.isStreaming ? styles.active : ''}`}
						onClick={toggleScreenShare}
					>
						🖥️
					</button>
				</div>

				{hasPermission === false && (
					<div className={styles.permissionError}>
						Microphone access denied. Please grant permission to use this
						feature.
					</div>
				)}

				<div className={styles.actions}>
					<button className={styles.cancelButton} onClick={handleCancel}>
						Cancel
					</button>
				</div>
			</div>
		</div>
	)
}
