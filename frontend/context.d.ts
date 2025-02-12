/* ********************************************************************
 *   Declaration file for the API exposed over the context bridge
 *********************************************************************/

export interface IBloopAPI {
	foo: string
	ping: () => Promise<string>
	openMicrophoneWindow: () => Promise<void>
	requestMicrophonePermission: () => Promise<boolean>
	checkMicrophonePermission: () => Promise<boolean>
}

declare global {
	interface Window {
		BloopAPI: IBloopAPI
	}
}
