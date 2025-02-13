/* ********************************************************************
 *   Declaration file for the API exposed over the context bridge
 *********************************************************************/

export interface IBloopAPI {
	foo: string
	ping: () => Promise<string>
	openMicrophoneWindow: () => Promise<void>
	requestMicrophonePermission: () => Promise<boolean>
	checkMicrophonePermission: () => Promise<boolean>
	getScreenSources: () => Promise<
		{
			id: string
			name: string
			thumbnail: Electron.NativeImage
			display_id: string
			appIcon: Electron.NativeImage | null
		}[]
	>
}

declare global {
	interface Window {
		BloopAPI: IBloopAPI
	}
}
