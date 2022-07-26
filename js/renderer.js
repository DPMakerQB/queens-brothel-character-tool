const openFileBtn = document.getElementById('openFileBtn')
const spinner = document.getElementById('spinner')
const logs = document.getElementById('logs')
const filePath = document.getElementById("filePath")
const exportBtn = document.getElementById("exportBtn")
const exportMenu = document.getElementById("exportMenu")
const outfitMenu = document.getElementById("outfitMenu")
const openOutputFolder = document.getElementById("openOutputFolder")

let selectedFile = "";
let outfits = [];

// Collect logs from main.js
window.electronAPI.log((_event, value) => {
    logs.value += "\n" + value
    logs.scrollTop = logs.scrollHeight
})

// On upload button click
openFileBtn.addEventListener('click', async () => {
    openFileBtn.classList.add("invisible")

    const result = await window.electronAPI.openFile()

    openFileBtn.classList.remove("invisible")

    if (result) {
        filePath.innerText = result.filePath
        selectedFile = result.filePath
        outfits = result.outfits
        exportMenu.classList.add("visible")
        exportMenu.classList.remove("invisible")
        updateOutfits()
    }
})

exportBtn.addEventListener("click", async () => {
    spinner.classList.remove("invisible")

    const result = await window.electronAPI.build(selectedFile, "")

    spinner.classList.add("invisible")

    if (result) {
        alert("Success")
    }
})

function updateOutfits() {
    outfitMenu.innerHTML = ""

    for (let outfit of outfits) {
        let li = document.createElement("li")
        let button = document.createElement("button")
        button.classList.add("dropdown-item")
        button.type = "button"
        button.innerText = outfit
        button.addEventListener("click", async () => {
            spinner.classList.remove("invisible")

            const result = await window.electronAPI.build(selectedFile, outfit)

            spinner.classList.add("invisible")

            if (result) {
                alert("Success")
            }
        })
        li.appendChild(button)
        outfitMenu.appendChild(li)
    }
}

openOutputFolder.addEventListener("click", async () => {
    await window.electronAPI.openOutputFolder()
})