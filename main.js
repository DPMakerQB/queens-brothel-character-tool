const {app, BrowserWindow, ipcMain, dialog, shell} = require('electron')
const path = require('path')
const PSD = require('psd')
const Jimp = require('jimp')
const fs = require('fs')

let win = null;

const tempFolderPath = path.join(app.getPath('userData'), "temp")
const tempFilePath = path.join(app.getPath('userData'), "temp", "temp.png")
const outputFolderPath = path.join(app.getPath('userData'), "output")
const previewFolderPath = path.join(outputFolderPath, "Outfits")

// Create temp directory
if (!fs.existsSync(tempFolderPath)) fs.mkdirSync(tempFolderPath)

// Create temp directory
if (!fs.existsSync(outputFolderPath)) fs.mkdirSync(outputFolderPath)


async function handleFileOpen() {
    const {canceled, filePaths} = await dialog.showOpenDialog({
        properties: ["multiSelections", "openFile"],
        "filters": [{"name": "PSD Files (.psd)", "extensions": ["psd"]}]
    })
    if (canceled) {
        return false
    } else {
        for (let fp of filePaths) {
            // Save Character ID
            const characterID = path.parse(fp).name;
            const characterOutputPath = path.join(outputFolderPath, characterID)

            // Create character output directory
            removeAndMakeDirectory(characterOutputPath)

            // Initialize PSD with chosen file
            let psd = PSD.fromFile(fp)
            psd.parse()

            // For each outfit
            for (let outfit of psd.tree().children()) {
                if (outfit.get('name') !== "ignore") {
                    const outfitID = outfit.get('name')
                    win.webContents.send("log", "Exporting outfit: " + outfitID)

                    // Create outfit output directory
                    const characterOutfitPath = path.join(characterOutputPath, outfit.get('name'))
                    removeAndMakeDirectory(characterOutfitPath)

                    // Export each variant
                    for (let variant of outfit.childrenAtPath("Variants")[0].children()) {
                        if (variant.get('name') === "Default") {
                            await exportLayer(variant, path.join(characterOutfitPath, characterID + "-Clothes-" + outfitID + ".png"))
                        } else {
                            await exportLayer(variant, path.join(characterOutfitPath, characterID + "-Clothes-" + outfitID + "-" + variant.get('name') + ".png"))
                        }
                    }

                    // Cum layers
                    // Pussy - 3
                    await exportLayer(outfit.childrenAtPath("Cum/Pussy")[0].children()[0], path.join(characterOutfitPath, characterID + "-Cum-Pussy-3-" + outfitID + ".png"))
                    // Pussy - 2
                    await exportLayer(outfit.childrenAtPath("Cum/Pussy")[0].children()[1], path.join(characterOutfitPath, characterID + "-Cum-Pussy-2-" + outfitID + ".png"))
                    // Pussy - 1
                    await exportLayer(outfit.childrenAtPath("Cum/Pussy")[0].children()[2], path.join(characterOutfitPath, characterID + "-Cum-Pussy-1-" + outfitID + ".png"))

                    // Chest - 3
                    await exportLayer(outfit.childrenAtPath("Cum/Chest")[0].children()[0], path.join(characterOutfitPath, characterID + "-Cum-Tits-3-" + outfitID + ".png"))
                    // Chest - 2
                    await exportLayer(outfit.childrenAtPath("Cum/Chest")[0].children()[1], path.join(characterOutfitPath, characterID + "-Cum-Tits-2-" + outfitID + ".png"))
                    // Chest - 1
                    await exportLayer(outfit.childrenAtPath("Cum/Chest")[0].children()[2], path.join(characterOutfitPath, characterID + "-Cum-Tits-1-" + outfitID + ".png"))

                    // Face - 3
                    await exportLayer(outfit.childrenAtPath("Cum/Face")[0].children()[0], path.join(characterOutfitPath, characterID + "-Cum-Throat-3-" + outfitID + ".png"))
                    // Face - 2
                    await exportLayer(outfit.childrenAtPath("Cum/Face")[0].children()[1], path.join(characterOutfitPath, characterID + "-Cum-Throat-2-" + outfitID + ".png"))
                    // Face - 1
                    await exportLayer(outfit.childrenAtPath("Cum/Face")[0].children()[2], path.join(characterOutfitPath, characterID + "-Cum-Throat-1-" + outfitID + ".png"))

                    // Messy Hair
                    await exportLayer(outfit.childrenAtPath("Messy Hair")[0], path.join(characterOutfitPath, characterID + "-MessyHair-" + outfitID + ".png"))

                    // Dick
                    await exportLayer(outfit.childrenAtPath("Dick/Cum")[0], path.join(characterOutfitPath, characterID + "-Cum-Dick-" + outfitID + ".png"))
                    await exportLayer(outfit.childrenAtPath("Dick/Dick")[0], path.join(characterOutfitPath, characterID + "-Dick-" + outfitID + ".png"))

                    // Hair Bangs
                    await exportLayer(outfit.childrenAtPath("Hair Bangs")[0], path.join(characterOutfitPath, characterID + "-HairBangs-" + outfitID + ".png"))

                    // Faces
                    for (let expression of ["Seduce", "Unimpressed", "Disgust", "Orgasm", "Surprise", "Angry", "Sad", "Happy", "Neutral"]) {
                        await exportLayer(outfit.childrenAtPath("Faces/" + expression)[0], path.join(characterOutfitPath, characterID + "-Face-" + expression + "-" + outfitID + ".png"))

                    }
                    await exportLayer(outfit.childrenAtPath("Faces/Seduce")[0], path.join(characterOutfitPath, characterID + "-Face-Seduce-" + outfitID + ".png"))
                    await exportLayer(outfit.childrenAtPath("Faces/Seduce")[0], path.join(characterOutfitPath, characterID + "-Face-Seduce-" + outfitID + ".png"))


                    // Makeup Smears
                    await exportLayer(outfit.childrenAtPath("Makeup Smears")[0], path.join(characterOutfitPath, characterID + "-Face-MakeupSmears-" + outfitID + ".png"))

                    // Blush
                    await exportLayer(outfit.childrenAtPath("Blush")[0], path.join(characterOutfitPath, characterID + "-Face-Blush-" + outfitID + ".png"))

                    // Body
                    await exportLayer(outfit.childrenAtPath("Body")[0], path.join(characterOutfitPath, characterID + "-Body-" + outfitID + ".png"))

                    // Preview
                    // Combine images in order: Body, Faces/Neutral, Hair Bangs, Variants/Default
                    await exportLayer(outfit.childrenAtPath("Body")[0], path.join(tempFolderPath, "Body.png"))
                    await exportLayer(outfit.childrenAtPath("Faces/Neutral")[0], path.join(tempFolderPath, "Face.png"))
                    await exportLayer(outfit.childrenAtPath("Hair Bangs")[0], path.join(tempFolderPath, "HairBangs.png"))
                    await exportLayer(outfit.childrenAtPath("Variants/Default")[0], path.join(tempFolderPath, "Outfit.png"))

                    await (() => {
                        return new Promise((resolve) => {
                            new Jimp(1000, 1080, (err, image) => {
                                if (err) throw err

                                new Jimp(path.join(tempFolderPath, "Body.png"), (err, bodyImage) => {
                                    if (err) throw err

                                    new Jimp(path.join(tempFolderPath, "Face.png"), (err, faceImage) => {
                                        if (err) throw err

                                        new Jimp(path.join(tempFolderPath, "HairBangs.png"), (err, hairBangsImage) => {
                                            if (err) throw err

                                            new Jimp(path.join(tempFolderPath, "Outfit.png"), (err, outfitImage) => {
                                                if (err) throw err

                                                image.composite(bodyImage, 0, 0)
                                                image.composite(faceImage, 0, 0)
                                                image.composite(hairBangsImage, 0, 0)
                                                image.composite(outfitImage, 0, 0)
                                                image.write(path.join(previewFolderPath, characterID + "-Clothes-" + outfitID + "-Preview.png"))

                                                resolve()
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })()

                }
            }
        }

        await shell.openPath(outputFolderPath)

        return true
    }
}

function exportLayer(layer, outputPath) {
    return new Promise((resolve) => {
        win.webContents.send("log", "Exporting layer: " + path.basename(outputPath))

        let layerTop = parseInt(layer.get('top'))
        let layerLeft = parseInt(layer.get('left'))

        layer.saveAsPng(tempFilePath).then(() => {
            new Jimp(1000, 1080, (err, image) => {
                if (err) throw err

                new Jimp(tempFilePath, (err, layerImage) => {
                    if (err) throw err
                    image.composite(layerImage, layerLeft, layerTop)
                    image.write(outputPath)

                    resolve()
                })
            })
        })
            .catch(() => {
                // Most likely an empty layer
                new Jimp(1000, 1080, (err, image) => {
                    if (err) throw err

                    image.write(outputPath)
                    resolve()
                })
            })
    })
}

function removeAndMakeDirectory(path) {
    if (fs.existsSync(path)) fs.rmSync(path, {recursive: true, force: true})
    fs.mkdirSync(path)
}


function createWindow() {
    win = new BrowserWindow({
        width: 800,
        height: 600,
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