const main = document.getElementById('main')
const btn = document.getElementById('openFileBtn')
const filePathElement = document.getElementById('filePath')
const previewContainer = document.getElementById('previewContainer')

btn.addEventListener('click', async () => {
    const result = await window.electronAPI.openFile()
    if (result) {
        filePathElement.innerText = result.location
        previewContainer.appendChild(result.preview)
    }
})

main.addEventListener('drop', async (ev) => {
    console.log(ev)
})