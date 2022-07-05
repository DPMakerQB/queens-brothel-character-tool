const {app, BrowserWindow, ipcMain, dialog} = require('electron')
const path = require('path')
const PSD = require('psd')

async function handleFileOpen() {
    const {canceled, filePaths} = await dialog.showOpenDialog({
        "filters": [{"name": "PSD Files (.psd)", "extensions": ["psd"]}]
    })
    if (canceled) {
        return
    } else {
        let psd = PSD.fromFile(filePaths[0])
        psd.parse()

        return {
            location: filePaths[0],
            preview: psd.image.toPng()
        }
    }
}


function createWindow() {
    const win = new BrowserWindow({
        width: 1280,
        height: 720,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        },
        autoHideMenuBar: true
    })

    win.loadFile('index.html')
}

app.whenReady().then(() => {
    ipcMain.handle('dialog:openFile', handleFileOpen)
    createWindow()
    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
})