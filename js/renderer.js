const btn = document.getElementById('openFileBtn')
const spinner = document.getElementById('spinner')
const logs = document.getElementById('logs')

// Collect logs from main.js
window.electronAPI.log((_event, value) => {
    logs.value += "\n" + value
    logs.scrollTop = logs.scrollHeight
})

// On upload button click
btn.addEventListener('click', async () => {
    spinner.classList.remove("invisible")
    btn.classList.add("invisible")

    const result = await window.electronAPI.openFile()

    spinner.classList.add("invisible")
    btn.classList.remove("invisible")

    if (result) {
        alert("Done!")
    }
})