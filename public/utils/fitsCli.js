const Promise = require('bluebird')
const { exec } = require('child_process')
const log = require('electron-log')
const rimraf = require("rimraf")
const { readFileSync } = require('fs')


/**
 * 
 * @param {String} str output CLI
 * @returns {String} percent  
 */
const getPercentFromString = str => str.match(/\s{1}\d+%{1}?/g)
/**
 * 
 * @param {String} str output CLI
 * @returns {String} get fase  
 */
const getFaseFromString = data => data.match(/\[{1}[a-zA-z]+]{1}?/g)

class FitsCLI {
    /**
     * 
     * @param {string} cliPath current path
     * @param {string} workdir current path
     */
    constructor(cliPath, workdir) {
        this.cliPath = cliPath
        this.workdir = workdir
        this.fileName = ''
    }

    init = fileName => {

        this.fileName = fileName
        return this
    }
    /**
     *  clear current Folder    
     */
    clearCache = () => rimraf.sync(`${this.workdir}/${this.fileName}/*`)

    /**
     * @typedef CLIResponse create a JSON file  ${workdir}/${fileName}/${fileName}.png.json
     * @property {Object} jsonData about contain histogram,markpixel.
     * @property {String} fitsHeaders info about image     
     */
    /**
     * 
     * @param {String} params CLI args      
     * @param {Event} sender CLI args      
     * @param {Boolean} withHeaders bool extract headers 
     *  
     * @returns {Promise<CLIResponse>}
     */
    execute = async (params, sender, extra) => {

        console.log(extra)
        return new Promise((resolve, reject) => {

            /**
             * clear current Folder
             */
            // this.clearCache()

            let proc = exec(`${this.cliPath}   ${params}`)
            let beforeNumb = 0
            let fase = 0
            proc.stdout.on('data', function (data) {

                const f = getFaseFromString(data)
                if (f)
                    sender.send('progress:fase', f[0].substr(1, f[0].length - 2))

                const per = getPercentFromString(data)
                if (per) {
                    let perFull = per.slice(-1).pop()
                    let res = Number(perFull.replace('%', ''))
                    
                    beforeNumb = res
                    // console.log(per.slice(-1).pop())
                    sender.send('progress:val', perFull)
                }
            });
            proc.on('close', async code => {

                if (code == 0)
                    console.log('child process complete.');
                else
                    console.log('child process exited with code ' + code);

                try {

                    const file = `${this.workdir}/${this.fileName}/${this.fileName}.png`
                    const jsonData = extra?.json ? JSON.parse(readFileSync(`${file}.json`, 'utf-8')) : null
                    const fitsHeaders = extra?.hdr ? readFileSync(`${file}.hdr`, 'utf-8') : null
                 

                    resolve(
                        {
                            code,
                            jsonData,
                            fitsHeaders
                         
                        }
                    )
                } catch (error) {
                    reject(error)
                }



            })

        })

    }
}


module.exports = FitsCLI