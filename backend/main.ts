import path from 'node:path'
import { app, BrowserWindow, ipcMain } from 'electron'
import log from 'electron-log'
import electronUpdater from 'electron-updater'
import electronIsDev from 'electron-is-dev'
import ElectronStore from 'electron-store'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const { autoUpdater } = electronUpdater
let appWindow: BrowserWindow | null = null
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const store = new ElectronStore()

class AppUpdater {
	constructor() {
		log.transports.file.level = 'info'
		autoUpdater.logger = log
		autoUpdater.checkForUpdatesAndNotify()
	}
}

const installExtensions = async () => {
	/**
	 * NOTE:
	 * As of writing this comment, Electron does not support the `scripting` API,
	 * which causes errors in the REACT_DEVELOPER_TOOLS extension.
	 * A possible workaround could be to downgrade the extension but you're on your own with that.
	 */
	/*
	const {
		default: electronDevtoolsInstaller,
		//REACT_DEVELOPER_TOOLS,
		REDUX_DEVTOOLS,
	} = await import('electron-devtools-installer')
	// @ts-expect-error Weird behaviour
	electronDevtoolsInstaller.default([REDUX_DEVTOOLS]).catch(console.log)
	*/
}

const spawnAppWindow = async () => {
	if (electronIsDev) await installExtensions()

	const RESOURCES_PATH = electronIsDev
		? path.join(__dirname, '../../assets')
		: path.join(process.resourcesPath, 'assets')

	const getAssetPath = (...paths: string[]): string => {
		return path.join(RESOURCES_PATH, ...paths)
	}

	const PRELOAD_PATH = path.join(__dirname, 'preload.js')

	appWindow = new BrowserWindow({
		width: 800,
		height: 600,
		icon: getAssetPath('icon.png'),
		show: false,
		webPreferences: {
			preload: PRELOAD_PATH,
		},
	})

	appWindow.loadURL(
		electronIsDev
			? 'http://localhost:3000'
			: `file://${path.join(__dirname, '../../frontend/build/index.html')}`
	)
	appWindow.maximize()
	appWindow.setMenu(null)
	appWindow.show()

	if (electronIsDev) appWindow.webContents.openDevTools({ mode: 'right' })

	appWindow.on('closed', () => {
		appWindow = null
	})
}

const createMicrophoneWindow = async () => {
	if (electronIsDev) await installExtensions()

	const RESOURCES_PATH = electronIsDev
		? path.join(__dirname, '../../assets')
		: path.join(process.resourcesPath, 'assets')

	const getAssetPath = (...paths: string[]): string => {
		return path.join(RESOURCES_PATH, ...paths)
	}

	const PRELOAD_PATH = path.join(__dirname, 'preload.js')

	const micWindow = new BrowserWindow({
		width: 300,
		height: 400,
		icon: getAssetPath('icon.png'),
		show: false,
		resizable: false,
		webPreferences: {
			preload: PRELOAD_PATH,
			nodeIntegration: false,
			contextIsolation: true,
			webSecurity: true,
		},
	})

	micWindow.webContents.session.setPermissionRequestHandler(
		(webContents, permission, callback) => {
			const allowedPermissions = ['media', 'microphone']
			if (allowedPermissions.includes(permission)) {
				callback(true)
			} else {
				callback(false)
			}
		}
	)

	micWindow.webContents.session.setPermissionCheckHandler(
		(webContents, permission) => {
			const allowedPermissions = ['media', 'microphone']
			return allowedPermissions.includes(permission)
		}
	)

	micWindow.loadURL(
		electronIsDev
			? 'http://localhost:3000/microphone'
			: `file://${path.join(__dirname, '../../frontend/build/microphone.html')}`
	)

	micWindow.setMenu(null)
	micWindow.show()
}

app.on('ready', () => {
	new AppUpdater()
	spawnAppWindow()
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

/*
 * ======================================================================================
 *                                IPC Main Events
 * ======================================================================================
 */

ipcMain.handle('sample:ping', () => {
	return 'pong'
})

ipcMain.handle('window:microphone', () => {
	createMicrophoneWindow()
})

ipcMain.handle('permission:check-microphone', async event => {
	return true // Permissions are handled by setPermissionRequestHandler
})

ipcMain.handle('permission:microphone', async event => {
	try {
		// Request is automatically handled by setPermissionRequestHandler
		return true
	} catch (error) {
		console.error('Error requesting microphone permission:', error)
		return false
	}
})
