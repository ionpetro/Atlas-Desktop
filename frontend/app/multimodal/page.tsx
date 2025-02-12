'use client'

import { useRef, useState } from 'react'
import { LiveAPIProvider } from './contexts/LiveAPIContext'
import ControlTray from './components/control-tray/ControlTray'

const API_KEY = 'AIzaSyDYh4OKyUWjixwA7fUZ97PpH_owaf-sSPY' //WE WILL REVOKE THIS KEY JUST FOR THE DEMO

const host = 'generativelanguage.googleapis.com'
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`

export default function Multimodal() {
	// this video reference is used for displaying the active stream, whether that is the webcam or screen capture
	// feel free to style as you see fit
	const videoRef = useRef<HTMLVideoElement>(null)
	// either the screen capture, the video or null, if null we hide it
	const [videoStream, setVideoStream] = useState<MediaStream | null>(null)

	return (
		<div className="App">
			<LiveAPIProvider url={uri} apiKey={API_KEY}>
				<div className="streaming-console">
					<main>
						<div className="main-app-area flex flex-row justify-center items-center">
							{/* APP goes here */}
							<video
								className={`stream ${!videoRef.current || !videoStream ? 'hidden' : ''}`}
								ref={videoRef}
								autoPlay
								playsInline
							/>
						</div>

						<ControlTray
							videoRef={videoRef}
							supportsVideo={true}
							onVideoStreamChange={setVideoStream}
						>
							{/* put your own buttons here */}
						</ControlTray>
					</main>
				</div>
			</LiveAPIProvider>
		</div>
	)
}
