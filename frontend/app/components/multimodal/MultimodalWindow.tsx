import styles from './MultimodalWindow.module.css'
import { useRef, useState, useEffect } from 'react'
import { useLiveAPIContext } from '../../../app/multimodal/contexts/LiveAPIContext'
import { useWebcam } from '../../../app/multimodal/components/hooks/use-webcam'
import { useScreenCapture } from '../../../app/multimodal/components/hooks/use-screen-capture'
import { AudioRecorder } from '../../../app/multimodal/lib/audio-recorder'
import ControlTray from '@/multimodal/components/control-tray/ControlTray'

export default function MultimodalWindow() {
	const [hasPermission, setHasPermission] = useState<boolean | null>(null)
	const videoRef = useRef<HTMLVideoElement>(null)

	useEffect(() => {
		const checkPermission = async () => {
			const permitted = await window.BloopAPI.checkMicrophonePermission()
			setHasPermission(permitted)
		}
		checkPermission()
	}, [])

	const handleCancel = () => {
		window.close()
	}

	return (
		<div className={styles.container}>
			<div className={styles.videoWrapper}>
				<video ref={videoRef} autoPlay playsInline className={styles.video} />
			</div>

			<div className={styles.controlsWrapper}>
				<ControlTray videoRef={videoRef} supportsVideo={true} />

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
