const isDev = require('electron-is-dev')
const { existsSync } = require('fs')
const { join, dirname } = require('path')
const { getCliPath, createDirs } = require('./general')


module.exports = function getCurrentDirectories(app) {

    const appPath = app.getAppPath()

    const userData = (process.platform === 'darwin') ? '/tmp' : app.getPath('userData')
    const workdir = join(userData, '/workdir')
    const appFolder = dirname(process.execPath)


    /**
    *  CLI filepath 
    */
    const basePath = isDev ? appPath : appFolder
    const fits_cli = getCliPath(basePath)

    /**
     * remove first quote  "
     */
    const basePathCLI = dirname(fits_cli).substr(1)

    /**
     * create workdir directory if it doesn't exist    
     */
    if (!existsSync(workdir))
        createDirs([workdir])


    return {
        workdir,
        fits_cli,
        basePathCLI
    }
}


