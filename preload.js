const {contextBridge, ipcRenderer} = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    openFile: () => ipcRenderer.invoke('dialog:openFile'),
    build: (filePath, outfitID) => ipcRenderer.invoke("build", filePath, outfitID),
    log: (callback) => ipcRenderer.on("log", callback),
    openOutputFolder: () => ipcRenderer.invoke("openOutputFolder")
})