const { app, BrowserWindow, ipcMain, globalShortcut } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')
const FitsLiberator = require('./utils/FitsLiberator')
const openTerminal = require('./utils/terminal')
const { LoadingWindow, MainWindow } = require('./utils/createWindows')
const Store = require('./utils/store')
const Menu = require('./utils/Menu')
let filepath
let ready = false
let win

const Storage = new Store()
const fltor = new FitsLiberator(win, app)

/**
 * setting  initial GLOBAL APP
 */
Storage.initConfig(fltor.workdir, fltor.fits_cli)

/**
 * ipcMain process
 */
ipcMain
    .on('openFile_process', fltor.openFileDialog)
    .on('apply:changes', fltor.applyChanges)
    .on('saveFile_process', fltor.saveFileDialog)
    .on('reset_process', fltor.resetProcess)
    .on('change::image', fltor.onChangeImage)
    .on('openTerminal', () => openTerminal(fltor.basePathCLI))
    /**
     * internal config
     */
    .on('initial_Settings', async (event, data) => event.sender.send('loadSetting', await Storage.getInitConfig()))
    .on('update_Settings', (event, data) => {
        Storage.updateSettings(data)
        event.sender.send('update_Settings::response', 'Success')
    })
    .on('clearCache', async event => {

        Storage.removeImagesConfig()
        event.sender.send('clearCache::response', 'Success')        
    })

const createWindow = () => {

    let loading = LoadingWindow()
    loading.on('closed', () => loading = null)
    loading.once('show', () => {

        win = MainWindow({
            icon: path.join(__dirname, './images/fl4.png')
        })

        win.loadURL(isDev ? 'http://localhost:9000/' : `file://${path.join(__dirname, '../build/index.html')}`)

        win.once('ready-to-show', () => {
            console.log('FIST Liberator v4........................... [loaded]')
            // process.argv[1]
            /**
             * open fits with double click
             */
            if (process.platform === "win32") {

                const fitsPath = process.argv[1]

                if (fitsPath && fitsPath !== '.')
                    fltor.openFileProcess(win.webContents, { fitsPath })
            }

            /**
             * mac
             */
            if (filepath) {
                fltor.openFileProcess(win.webContents, { fitsPath: filepath })
                filepath = null
            }

            win.show()
            loading.hide()
            loading.close()
        })

        ready = true
        /*
         * Dev TOOLS
         */
        if (isDev)
            win.webContents.openDevTools()

        /**
        * disable normal menu
        */
        Menu(win, fltor.openFileDialog, fltor.openAbout)

    })

    const loadingPath = isDev ? './loading.html' : '../build/loading.html'
    loading.loadURL(`file://${path.join(__dirname, loadingPath)}`)
    loading.show()

    // Create the browser window.    
    // win.setOverlayIcon('fitslogo.png', 'FITS Liberator')

    globalShortcut.register('f5', function () {
        console.log('f5 is pressed')
        win.reload()
    })
    globalShortcut.register('CommandOrControl+R', function () {
        console.log('CommandOrControl+R is pressed')
        win.reload()
    })

    /**
     * MacOSX
     */
    if (process.platform === 'darwin') {
        globalShortcut.register('Command+Q', () => {
            app.quit();
        })
    }

}
app.allowRendererProcessReuse = true

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
    createWindow()
    Storage.getInitConfig()
})
app.on("open-file", function (event, path) {
    event?.preventDefault()
    filepath = path;

    if (ready) {
        // win.webContents.send('open-file', filepath);
        fltor.openFileProcess(win.webContents, { fitsPath: filepath })
        filepath = null;

        return;
    }
})
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', (e) => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    // const choice = dialog.showMessageBoxSync(
    //     {
    //         type: 'question',
    //         buttons: ['Yes', 'No'],
    //         title: 'Confirm',
    //         message: 'Are you sure you want to quit?'
    //     });
    // if (choice) {
    //     e.preventDefault();
    // }
    // if (process.platform !== 'darwin') {
    app.quit()
    // }
})
app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

