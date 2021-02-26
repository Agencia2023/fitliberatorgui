const { join } = require('path')
const fse = require('fs-extra')
const log = require('electron-log')
const isDev = require('electron-is-dev')
/**
 * get fullPath to fits CLI  based on OS
 * @param {string} appPath  path to CLI
 */

const getCliPath = appPath => {

    let res = ''
    if (process.platform === "darwin") {

        res = join(appPath, (isDev ? '' : '..') + '/fitscli/mac/bin/fits')
    }
    else if (process.platform === "win32") {
        res = join(appPath, '/fitscli/win/fits.exe')
    }
    else if (process.platform === 'linux') {
        res = join(appPath, '/fitscli/linux/fits')
    }
    return `"${res}"`
}

const generateParams = parameters => {
    let params = ' '
    for (const key in parameters) {
        params += `-${key} ${parameters[key]} `
    }
    return params
}

const createDirs = folders => {
    try {
        folders.forEach(folder => fse.ensureDirSync(folder))
    } catch (error) {
        log.warn('createDirs: ', error);
    }

}
const fileNamesGenerator = (totalImgs, totalPlanes) => {

    let images = {}

    for (let imageIndex = 1; imageIndex <= totalImgs; imageIndex++)
        for (let planeIndex = 1; planeIndex <= totalPlanes; planeIndex++) {

            const imagePLane = `${imageIndex}_${planeIndex}`

            images[imagePLane] =
            {
                label: `Image ${imageIndex}, Plane ${planeIndex}`,
                value: imagePLane,
                original: true,
                index: {
                    I: imageIndex,
                    z: planeIndex
                },
                parameters: {
                    I: imageIndex,
                    z: planeIndex,
                    f: 1
                }
            }

        }
    return images
}

module.exports = {
    getCliPath,    
    generateParams,
    createDirs,
    fileNamesGenerator
}