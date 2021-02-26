const { clipboard, dialog } = require('electron')
const fs = require('fs')
const log = require('electron-log')
const path = require('path')
const Store = require('./store')
const FitsCLI = require('./fitsCli')
const currentPaths = require('./currentPaths')
const { EXTRA_FILES, PNG_FORMAT, NO_VERBOSE, PROGRESS, HIGH_PERFORMANCE, TIF_FORMAT } = require('./cliConstants')
const Storage = new Store()

const { generateParams, createDirs, fileNamesGenerator } = require('./general')


const isLinearChangeScaledPeakLevel = (parameters) => {

    if (parameters.s === 'linear') {
        parameters['S'] = 1
        parameters['k'] = 0
    }
}

String.prototype.addFlag = function (arg) { return ` ${this.toString()} ${arg} ` }

class FitsLiberator {

    constructor(window, app) {
        this.win = window
        const { workdir, fits_cli, basePathCLI } = currentPaths(app)
        this.fits_cli = fits_cli
        this.workdir = workdir
        this.basePathCLI = basePathCLI
        this.fitsCLI = new FitsCLI(fits_cli, workdir)

    }
    resetProcess = async (event, { filePath, imageSelected }) => {
        const fileName = path.parse(filePath).name
        const { output_png } = await Storage.find(fileName)

        let command = `  --infile "${filePath}" -o "${output_png}"   ${EXTRA_FILES}   ${PNG_FORMAT} ${NO_VERBOSE}  -u 1 -I ${imageSelected.index.I} -z ${imageSelected.index.z} -s none  ${PROGRESS} `
        const { highPerformance } = await Storage.getInitConfig()
        if (highPerformance)
            command = command.addFlag(HIGH_PERFORMANCE)

        this.fitsCLI
            .init(fileName)
            .execute(command, event.sender, { json: true })
            .then(async ({ jsonData }) => {
                Storage.resetImage(fileName, imageSelected)

                const { images } = await Storage.find(fileName)

                event.sender.send("resetImage:return", {
                    images: Object.values(images),
                    histogram: jsonData.histogram,
                    imageSelectedData: {
                        undefined: jsonData.markpixel.undefined,
                        statistics: jsonData.statistics
                    },
                })

            })
    }

    saveFileDialog = async ({ sender }, { parameters, filePath }) => {

        const defaultPath = path.parse(filePath).name

        const fileName = dialog.showSaveDialogSync(this.win, {
            defaultPath,
            filters: [{
                name: 'tiff File',
                extensions: ['tif']
            }]
        })

        if (!fileName) {
            return;
        }
        sender.send('init_process')
        /**
         * save parameters to reload 
         */
        // const fname = path.parse(filePath).name        
        // Storage.updateImage(fname, { parameters })

        // no png

        isLinearChangeScaledPeakLevel(parameters)

        delete parameters.o
        delete parameters.F

        /**
         * invert FLIP
         */
        parameters.f = Number(parameters.f)


        const params = generateParams(parameters)
        const command = `--infile  "${filePath}" ${params} --outfile "${fileName}" `
            .addFlag(PROGRESS)
            .addFlag(TIF_FORMAT)

        /**
         * copy to clipboard
         */
        clipboard.writeText(command)
        console.log("command, ", command)

        this.fitsCLI
            .execute(command, sender)
            .then(() => sender.send('end_process'))

    }
    applyChanges = async (event, { isFlip, parameters, filePath, oldData }) => {

        /**
         * save parameters to restore 
         */
        const fileName = path.parse(filePath).name

        if (isFlip) {
            Storage.updateImage(fileName, { parameters: { f: parameters.f, I: parameters.I, z: parameters.z } }, 1)
            return
            // const { f, I, z, o } = parameters
            // parameters = { f, I, z, o }
        } else
            Storage.updateImage(fileName, { oldData, parameters })



        isLinearChangeScaledPeakLevel(parameters)

        let newParams = { ...parameters }
        delete newParams.w
        delete newParams.b
        delete newParams.o
        delete newParams.f

        const params = generateParams(newParams)

        const { output_png } = await Storage.find(fileName)


        let command = `--infile "${filePath}"  -o "${output_png}"  ${params} ${PNG_FORMAT} -u 1 ${EXTRA_FILES}  ${NO_VERBOSE} ${PROGRESS}`


        const { highPerformance } = await Storage.getInitConfig()
        if (highPerformance)
            command = command.addFlag(HIGH_PERFORMANCE)

        console.log("command, ", command)
        clipboard.writeText(command)

        this.fitsCLI
            .init(fileName)
            .execute(command, event.sender, { json: true })
            .then(async ({ jsonData }) => {



                event.sender.send('end_process', {
                    histogram: jsonData.histogram,
                    imageSelectedData: {
                        undefined: jsonData.markpixel.undefined,
                        statistics: jsonData.statistics
                    },
                })
            })
    }
    openFileDialog = async (event, { fitsPath = '', freezeParams = null }) => {

        /**
         * to allow open file with dialog
         */
        if (!fitsPath) {
            const fp = dialog.showOpenDialogSync(
                this.win,
                {
                    title: "Select a fits file",
                    // isAlwaysOnTop:true,
                    setAlwaysOnTop: true,
                    buttonLabel: "Open fits",
                    properties: ['openFile'],
                    filters: [
                        { name: 'Fits', extensions: ['fits', 'fz', 'fit'] }
                    ]
                })
            if (fp)
                this.openFileProcess(event, { fitsPath: fp[0], freezeParams })
        } else
            this.openFileProcess(event, { fitsPath, freezeParams })
    }
    onChangeImage = async (event, { filePath, image }) => {

        const fileName = path.parse(filePath).name
        const { output_png, basePath } = await Storage.find(fileName)


        Storage.onChangeImage(fileName, image)


        const { highPerformance } = await Storage.getInitConfig()

        let command
        if (image.original)
            command = `  --infile "${filePath}" -o "${output_png}"  ${EXTRA_FILES} ${PNG_FORMAT} ${NO_VERBOSE} -I ${image.index.I} -z ${image.index.z} -u 1  -s none ${PROGRESS}`
        else {
            /**
             * get parameters to generate the image 
             */
            isLinearChangeScaledPeakLevel(image.parameters)

            delete image.parameters.Z
            const params = generateParams(image.parameters)

            command = `  --infile "${filePath}"  ${params} ${EXTRA_FILES} -u 1`
        }

        if (highPerformance)
            command = command.addFlag(HIGH_PERFORMANCE)

        this.fitsCLI
            .init(fileName)
            .execute(command, event.sender, { json: true })
            .then(async ({ jsonData }) => {

                event.sender.send('onChangeImage:return', {
                    histogram: jsonData.histogram,
                    imageSelectedData: {
                        undefined: jsonData.markpixel.undefined,
                        statistics: jsonData.statistics,
                        // raw: rawDataImage
                    },
                })



            })
    }
    openFileProcess = async (event, { fitsPath, freezeParams = null }) => {



        const sender = !event?.send ? event.sender : event

        sender.send('init_process')

        const fileName = path.parse(fitsPath).name
        const store = await Storage.find(fileName)

        const currentDirectory = path.join(this.workdir, fileName)

        /**
         * override parameters if freeze exist
         */
        // if (freezeParams)
        //     await Storage.updateImage(fileName, { parameters: freezeParams })

        console.log("freezeParams", freezeParams)
        let params = ''
        const fitsExist = store && Object.keys(store).length
        let original = store?.last?.original ?? true



        if (fitsExist || freezeParams) {

            let paramts = freezeParams ? { ...freezeParams } : { ...store.last.parameters }


            delete paramts.o
            delete paramts.b
            delete paramts.w
            delete paramts.f

            isLinearChangeScaledPeakLevel(paramts)

            params = generateParams(paramts)

        }


        if (!fs.existsSync(currentDirectory))
            createDirs([currentDirectory])



        const { highPerformance } = await Storage.getInitConfig()

        const useMemory = '' //'-m 16000'
        let command = `--infile "${fitsPath}" -o "${currentDirectory}/${fileName}.png"  -u 1 ${params} ${original && !freezeParams ? '-s none' : ''}  ${useMemory}`
            .addFlag(EXTRA_FILES)
            .addFlag(NO_VERBOSE)
            .addFlag(PNG_FORMAT)
            .addFlag(PROGRESS)

        if (highPerformance) {
            command = command.addFlag(HIGH_PERFORMANCE)
            console.log("highPerformance", highPerformance)
        }
        console.log("command", command)
        /**
         * set current fileName to process
         */

        this.fitsCLI
            .init(fileName)
            .execute(command, sender, { json: true, hdr: true })
            .then(async ({ jsonData, fitsHeaders }) => {

                const output_png = `${currentDirectory}/${fileName}.png`                

                const images = fitsExist ? store.images : fileNamesGenerator(jsonData.num_images, jsonData.num_planes)

                let imageSelected = fitsExist ? store.last : Object.values(images)[0]

                if (freezeParams)
                    imageSelected = { ...imageSelected, parameters: freezeParams }

                const oldData = fitsExist ? store.last.oldData : [{ original: true }]            

                console.log("STORE ACTIVE -- READ IMAGE PNG")

                if (!fitsExist)
                    Storage.save(fileName, {
                        fitsPath,
                        basePath: currentDirectory,
                        output_png,
                        total_images: jsonData.num_images,
                        total_planes: jsonData.num_planes,
                        last: { ...imageSelected, oldData },
                        images,
                    })

                sender.send('image_info_process', {
                    fileName,
                    fitsHeaders,
                    images: Object.values(images),
                    filePath: fitsPath,
                    output_png,
                    imageSelected,
                    size: jsonData.size,
                    imageSelectedData: {
                        undefined: jsonData.markpixel.undefined,
                        statistics: jsonData.statistics,
                        // http_output_png,
                        // raw                        
                    },
                    histogram: jsonData.histogram,
                    oldData
                })




            }) // end process cli
            .catch((error) => {

                log.error(error)
                dialog.showMessageBox({
                    title: 'FitsCLI',
                    type: 'error',
                    message: 'An error occurred when processing Fits file.\r\n '
                });

                sender.send('force_end_process')
            })

    }

    openAbout = (event) =>  event.send('process:openAbout')
    
}


module.exports = FitsLiberator