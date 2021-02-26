const { BrowserWindow } = require('electron')

module.exports = {

    LoadingWindow: () => new BrowserWindow({ show: false, frame: false, transparent: true, resizable: false, width: 150, height: 130 }),

    MainWindow: newProps => {

        const props = {
            show: false,
            backgroundColor: '#2e2c29',            
            width: 1024, height: 680,
            minWidth: 945, minHeight: 670,            
            webPreferences: {
                nodeIntegration: true,
                webSecurity: false,
                backgroundThrottling: false,

            },
            ...newProps
        }

        return new BrowserWindow(props)

    }


}