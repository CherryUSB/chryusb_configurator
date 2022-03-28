import { app, BrowserWindow, ipcMain, shell } from 'electron'
import { release } from 'os'
import { join } from 'path'

// Disable GPU Acceleration for Windows 7
if (release().startsWith('6.1')) app.disableHardwareAcceleration()

// Set application name for Windows 10+ notifications
if (process.platform === 'win32') app.setAppUserModelId(app.getName())

if (!app.requestSingleInstanceLock()) {
    app.quit()
    process.exit(0)
}
process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

let win: BrowserWindow | null = null

async function createWindow() {
    win = new BrowserWindow({
        minWidth: 1024,
        minHeight: 720,
        width: 1024,
        height: 720,
        resizable: true,
        frame: false,
        show:false,
        transparent: false,
        useContentSize: true,
        webPreferences: {
            preload: join(__dirname, '../preload/index.cjs'),
            nodeIntegration: true,
            contextIsolation: false,
            devTools: true,
            webSecurity: true
        },
    })

    if (app.isPackaged) {
        win.loadFile(join(__dirname, '../renderer/index.html'))
    } else {
        // 🚧 Use ['ENV_NAME'] avoid vite:define plugin
        const url = `http://${process.env['VITE_DEV_SERVER_HOST']}:${process.env['VITE_DEV_SERVER_PORT']}`

        win.loadURL(url)
        win.webContents.openDevTools()
    }

    win.once('ready-to-show', ()=>{
        if (win){
            win.show()
        }
    })


    // Communicate with the Renderer-process.
    win.webContents.on('ipc-message', (_, channel, ...args) => {
        switch (channel) {
            case 'app.getPath':
                win?.webContents.send('app.getPath', app.getPath(args[0]))
                break
            default:
                break
        }
    })

    // Test active push message to Renderer-process
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', new Date().toLocaleString())
    })

    // Make all links open with the browser, not with the application
    win.webContents.setWindowOpenHandler(({ url }) => {
        if (url.startsWith('https:')) shell.openExternal(url)
        return { action: 'deny' }
    })
}

app.whenReady().then(createWindow)

app.on('window-all-closed', () => {
    win = null
    if (process.platform !== 'darwin') app.quit()
})

app.on('second-instance', () => {
    if (win) {
        // Focus on the main window if the user tried to open another
        if (win.isMinimized()) win.restore()
        win.focus()
    }
})

app.on('activate', () => {
    const allWindows = BrowserWindow.getAllWindows()
    if (allWindows.length) {
        allWindows[0].focus()
    } else {
        createWindow()
    }
})


ipcMain.on('main.window.min', () => {
    if (win) {
        win.minimize()
    }
})

let main_window_is_max:boolean = false
ipcMain.on('main.window.max', () => {
    if (win) {
        if (main_window_is_max){
            win.unmaximize()
            main_window_is_max = false
        }
        else {
            win.maximize()
            main_window_is_max = true;
        }
    }
})

ipcMain.on('main.window.close', ()=>{
    if (win){
        win.close()
    }
})

