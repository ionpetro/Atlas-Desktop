/* eslint-disable @typescript-eslint/no-var-requires */
// Electron doesnt support ESM for renderer process. Alternatively, pass this file
// through a bundler but that feels like an overkill
const { contextBridge, ipcRenderer, desktopCapturer } = require('electron')

contextBridge.exposeInMainWorld('BloopAPI', {
	foo: 'bar',
	ping: () => ipcRenderer.invoke('sample:ping'),
	openMicrophoneWindow: () => ipcRenderer.invoke('window:microphone'),
	requestMicrophonePermission: () =>
		ipcRenderer.invoke('permission:microphone'),
	checkMicrophonePermission: () =>
		ipcRenderer.invoke('permission:check-microphone'),
	getScreenSources: () =>
		desktopCapturer.getSources({
			types: ['window', 'screen'],
			thumbnailSize: { width: 150, height: 150 },
		}),
})
