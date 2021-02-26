const { Menu } = require('electron')

const isMac = process.platform === 'darwin'

module.exports = (win, openFileDialog, openAbout = () => null) => {


    const template = [
        {
            label: 'File',
            submenu: [

                {
                    label: 'About FITS Liberator',
                    click: () => openAbout(win.webContents)
                },
                {
                    label: 'Open',
                    click: () => openFileDialog(win.webContents, {}),
                    accelerator: isMac ? 'CommandOrControl+o' : 'ctrl+o'
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Exit',
                    role: isMac ? 'close' : 'quit'
                }
            ]
        }
    ]
    if (isMac) {
        template.push({
            label: "Edit",
            submenu: [
                { type: "separator" },
                { label: "Copy", accelerator: "CmdOrCtrl+C", selector: "copy:" },
                { label: "Paste", accelerator: "CmdOrCtrl+V", selector: "paste:" }
            ]
        })
    }
    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)


}