'use client'

import { memo, ReactNode, RefObject, useEffect, useRef, useState } from 'react'
import { useLiveAPIContext } from '../../contexts/LiveAPIContext'
import { UseMediaStreamResult } from '../hooks/use-media-stream-mux'
import { useScreenCapture } from '../hooks/use-screen-capture'
import { useWebcam } from '../hooks/use-webcam'
import { AudioRecorder } from '../../lib/audio-recorder'
import {
	PlayIcon,
	PauseIcon,
	MicIcon,
	MicOffIcon,
	ScreenShareIcon,
	ScreenShareOffIcon,
	CameraOffIcon,
	CameraIcon,
	XIcon,
} from 'lucide-react'
import styles from './ControlTray.module.css'
export type ControlTrayProps = {
	videoRef: RefObject<HTMLVideoElement>
	children?: ReactNode
	supportsVideo: boolean
	onVideoStreamChange?: (stream: MediaStream | null) => void
	handleCancel: () => void
}

type MediaStreamButtonProps = {
	isStreaming: boolean
	onIcon: ReactNode
	offIcon: ReactNode
	start: () => Promise<any>
	stop: () => any
}

/**
 * button used for triggering webcam or screen-capture
 */
const MediaStreamButton = memo(
	({ isStreaming, onIcon, offIcon, start, stop }: MediaStreamButtonProps) =>
		isStreaming ? (
			<button className={styles.actionButton} onClick={stop}>
				<span className={styles.materialSymbolsOutlined}>{onIcon}</span>
			</button>
		) : (
			<button className={styles.actionButton} onClick={start}>
				<span className={styles.materialSymbolsOutlined}>{offIcon}</span>
			</button>
		)
)

MediaStreamButton.displayName = 'MediaStreamButton'

function ControlTray({
	videoRef,
	children,
	onVideoStreamChange = () => {},
	supportsVideo,
	handleCancel,
}: ControlTrayProps) {
	const videoStreams = [useWebcam(), useScreenCapture()]
	const [activeVideoStream, setActiveVideoStream] =
		useState<MediaStream | null>(null)
	const [webcam, screenCapture] = videoStreams
	const [inVolume, setInVolume] = useState(0)
	const [audioRecorder] = useState(() => new AudioRecorder())
	const [muted, setMuted] = useState(false)
	const renderCanvasRef = useRef<HTMLCanvasElement>(null)
	const connectButtonRef = useRef<HTMLButtonElement>(null)

	const { client, connected, connect, disconnect, volume } = useLiveAPIContext()

	useEffect(() => {
		if (!connected && connectButtonRef.current) {
			connectButtonRef.current.focus()
		}
	}, [connected])
	useEffect(() => {
		document.documentElement.style.setProperty(
			'--volume',
			`${Math.max(5, Math.min(inVolume * 200, 8))}px`
		)
	}, [inVolume])

	useEffect(() => {
		const onData = (base64: string) => {
			client.sendRealtimeInput([
				{
					mimeType: 'audio/pcm;rate=16000',
					data: base64,
				},
			])
		}
		if (connected && !muted && audioRecorder) {
			audioRecorder.on('data', onData).on('volume', setInVolume).start()
		} else {
			audioRecorder.stop()
		}
		return () => {
			audioRecorder.off('data', onData).off('volume', setInVolume)
		}
	}, [connected, client, muted, audioRecorder])

	useEffect(() => {
		if (videoRef.current) {
			videoRef.current.srcObject = activeVideoStream
		}

		let timeoutId = -1

		function sendVideoFrame() {
			const video = videoRef.current
			const canvas = renderCanvasRef.current

			if (!video || !canvas) {
				return
			}

			const ctx = canvas.getContext('2d')!
			canvas.width = video.videoWidth * 0.25
			canvas.height = video.videoHeight * 0.25
			if (canvas.width + canvas.height > 0) {
				ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
				const base64 = canvas.toDataURL('image/jpeg', 1.0)
				const data = base64.slice(base64.indexOf(',') + 1, Infinity)
				client.sendRealtimeInput([{ mimeType: 'image/jpeg', data }])
			}
			if (connected) {
				timeoutId = window.setTimeout(sendVideoFrame, 1000 / 0.5)
			}
		}
		if (connected && activeVideoStream !== null) {
			requestAnimationFrame(sendVideoFrame)
		}
		return () => {
			clearTimeout(timeoutId)
		}
	}, [connected, activeVideoStream, client, videoRef])

	//handler for swapping from one video-stream to the next
	const changeStreams = (next?: UseMediaStreamResult) => async () => {
		if (next) {
			const mediaStream = await next.start()
			setActiveVideoStream(mediaStream)
			onVideoStreamChange(mediaStream)
		} else {
			setActiveVideoStream(null)
			onVideoStreamChange(null)
		}

		videoStreams.filter(msr => msr !== next).forEach(msr => msr.stop())
	}

	return (
		<section className={styles.controlTray}>
			<canvas style={{ display: 'none' }} ref={renderCanvasRef} />
			<nav className={`${styles.actionsNav}`}>
				<button
					className={`${styles.actionButton} ${
						connected ? styles.recording : ''
					}`}
					onClick={connected ? disconnect : connect}
				>
					<span className={styles.materialSymbolsOutlined}>
						{connected ? <PauseIcon /> : <PlayIcon />}
					</span>
				</button>
				<button
					className={`${styles.actionButton} ${muted ? styles.recording : ''}`}
					onClick={() => setMuted(!muted)}
				>
					{!muted ? (
						<span className={styles.materialSymbolsOutlined}>
							<MicIcon />
						</span>
					) : (
						<span className={styles.materialSymbolsOutlined}>
							<MicOffIcon />
						</span>
					)}
				</button>
				{supportsVideo && (
					<>
						<MediaStreamButton
							isStreaming={screenCapture.isStreaming}
							start={changeStreams(screenCapture)}
							stop={changeStreams()}
							onIcon={<ScreenShareIcon />}
							offIcon={<ScreenShareOffIcon />}
						/>
						<MediaStreamButton
							isStreaming={webcam.isStreaming}
							start={changeStreams(webcam)}
							stop={changeStreams()}
							onIcon={<CameraOffIcon />}
							offIcon={<CameraIcon />}
						/>
					</>
				)}
				{children}
			</nav>
			<nav className={styles.actionsNav}>
				<button className={styles.actionButton} onClick={handleCancel}>
					<XIcon />
				</button>
			</nav>
		</section>
	)
}

export default memo(ControlTray)
