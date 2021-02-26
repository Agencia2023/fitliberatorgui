const Storage = require('electron-json-storage')
const rimraf = require('rimraf')
const log = require('electron-log')
const { app } = require('electron')
const version = app.getVersion()
const findRemoveSync = require('find-remove')



const GLOBAL_SETTING = 'GLOBAL_SETTING'

class Store {

    getGlobalNameConfig = () => `${GLOBAL_SETTING}_${version}`.replace(/\./g, '_')
    removeImagesConfig = () => {

        try {
            const key = this.getGlobalNameConfig()            
            const defaultDataPath = Storage.getDefaultDataPath()

           return findRemoveSync(defaultDataPath, { ignore: `${key}.json`, files: '*.*' })            
            // Storage.getAll((error, data) => {
            //     // if (error) throw error; 

            //     console.log(key)

            //     for (const file in data) {
            //         console.log(file)

            //         if (file !== key) {
            //             Storage.remove(file, function (error) {
            //                 if (error) throw error;
            //             });
            //         }
            //     }
            // });
        } catch (error) {

        }

    }
    getInitConfig = async () => {

        const key = this.getGlobalNameConfig()
        return await this.find(key)
    }
    updateSettings = async prop => {

        const key = this.getGlobalNameConfig()

        const settings = await this.find(key)

        this.save(key, {
            ...settings,
            ...prop
        })

    }
    initConfig = async (workdir, fits_cli) => {

        /**
         *  Cleanup
         *  Free up space workdir 
         */
        rimraf.sync(`${workdir}/*`)

        /**
         * default options
         */
        const storage = Storage.getDefaultDataPath()

        let defaultProps = {
            highPerformance: true,
            workspace: {
                appName: app.name,
                version,
                workdir,
                storage,
                fits_cli,
                bins: 1000
            }

        }
        const key = this.getGlobalNameConfig()
        const settings = await this.find(key)

        if (!Object.keys(settings).length) {

            rimraf.sync(`${storage}/*`)

            this.save(key, {
                ...defaultProps
            })
            log.info('fits_cli', fits_cli)
            log.info('workdir', workdir)
            log.info('Storage', storage)
            console.log("Set Settings successful")
        } else
            console.log("settings already exist.")

    }

    resetImage = async (key, imageSelected) => {

        const current = await this.find(key)

        const last = {
            ...imageSelected,
            original: true,
            parameters: {
                ...imageSelected.index,
                f: 1
            },
            oldData: [{ original: true }]
        }

        this.save(key, {
            ...current,
            last,
            images: {
                ...current.images,
                [imageSelected.value]: last
            }
        })

    }
    /**
     * save 
     * @param {string} key
     * @param {Object} value
     */
    save = (key, value) => Storage.set(key, value)


    /**
     * save 
     * @param {string} key
     * @param {Object} value  { key:value } to spread update
     */
    updateImage = async (key, value, optionalFlip = null) => {

        const current = await this.find(key)

        const { I, z } = value.parameters
        const keyImg = `${I}_${z}`


        let last = {
            ...current.images[keyImg],
            parameters: {
                ...current.last.parameters,
                ...value.parameters
            }
        }
        if (optionalFlip === null)
            last['original'] = false

        if (value?.oldData) {
            last['oldData'] = value.oldData
        }

        console.log(last)

        // Storage.set({
        //     [`${key}.last`]: last,
        //     [`${key}.images.${keyImg}.parameters`]: value.parameters
        // })
        this.save(key, {
            ...current,
            last,
            images: {
                ...current.images,
                [keyImg]: last
            }
        })
    }
    onChangeImage = async (key, lastImage) => {
        const current = await this.find(key)

        this.save(key, {
            ...current,
            last: { ...current.images[lastImage.value] }
        })
    }
    /**
     * Read
     * @param {string} key
     * @return {Promise} 
     * */
    find = key => {
        return new Promise((resolve, reject) => {
            Storage.get(key, function (error, data) {
                if (error) reject(error)

                resolve(data);
            });
        })
    }

}
// const os = require('os');
// const storage = require('electron-json-storage');
// storage.setDataPath(os.tmpdir());
module.exports = Store

// app.getPath('userData')