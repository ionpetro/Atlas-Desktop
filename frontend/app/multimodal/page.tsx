'use client'

import { LiveAPIProvider } from './contexts/LiveAPIContext'
import MultimodalWindow from '../components/multimodal/MultimodalWindow'

const API_KEY = 'AIzaSyDYh4OKyUWjixwA7fUZ97PpH_owaf-sSPY'
const host = 'generativelanguage.googleapis.com'
const uri = `wss://${host}/ws/google.ai.generativelanguage.v1alpha.GenerativeService.BidiGenerateContent`

export default function Multimodal() {
	return (
		<LiveAPIProvider url={uri} apiKey={API_KEY}>
			<MultimodalWindow />
		</LiveAPIProvider>
	)
}
