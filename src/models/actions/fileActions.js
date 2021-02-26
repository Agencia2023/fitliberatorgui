import * as types from './actionTypes'
import { loadImage } from './viewerActions'
import { ipcRenderer } from 'electron'
import { rawDecode } from '../../utils/rawDecode'
import { getTileName } from '../../utils/general'
import { saveScale } from '../../utils/scaledFunctions'
// dispatch({
// 	type: types.SET_HIGH_QUALITY, payload: data.highPerformance
// })
const isLinearChangeScaledPeakLevel = (parameters) => {

	if (parameters.s === 'linear') {
		parameters['S'] = 1
	}
}

export const openTerminal = () => ipcRenderer.send('openTerminal')

export const openFileEventEmitter = () => (dispatch, state) => {


	ipcRenderer.on('progress:val', (e, stdout) => {

		document.getElementById('progress-value').textContent = stdout
	})
	ipcRenderer.on('progress:fase', (e, stdout) => {

		document.getElementById('progress-fase').textContent = stdout
	})

	/**
	 * global settings 
	 */
	ipcRenderer.send('initial_Settings')
	ipcRenderer.on('loadSetting', (e, stdout) => {

		dispatch({
			type: types.SET_INIT, payload: stdout
		})

	})


	ipcRenderer.on('init_process', (e, stdout) => dispatch(setLoading()))
	ipcRenderer.on('force_end_process', (e, stdout) => dispatch(clearLoading()))
	ipcRenderer.on('image_info_process', (e, stdout) => {

		if (stdout) {
			const { viewer } = state()			
			dispatch({ type: types.RESET_PARAMETERS })
			initialProcess(dispatch, stdout, viewer)
		}

	})
}
export const setOriginalRawImage = buffer => (dispatch, state) => {

	const { imageSelectedData } = state()

	const raw = rawDecode(buffer, imageSelectedData.undefined)


	// let pngCache = { ...imageSelectedData.pngCache }

	// const name = getTileName(tile)
	// const { level, x, y, } = tile
	// pngCache[name] = raw;

	// window.pngCache[name] = raw
	// window.pngCache = pngCache

	dispatch(setImgSelectedData({ ...imageSelectedData, raw }))
}
export const openFile = (fitsPath = '') => (dispatch, state) => {

	const { freezeSettings, parameters } = state()

	delete parameters.o
	// delete parameters.b
	// delete parameters.w	

	if (fitsPath)
		dispatch(setLoading())

	ipcRenderer.send('openFile_process', { fitsPath, freezeParams: freezeSettings ? parameters : null })
}


export const applyChanges = (isFlip = false) => (dispatch, getState) => {

	dispatch(setLoading())
	const { parameters, filePath, imageSelected, output_png, viewer } = getState()

	if (!isFlip)
		dispatch(updateOldData(parameters))

	const { oldData } = getState()

	ipcRenderer.send('apply:changes',
		{
			isFlip,
			filePath,
			oldData,
			parameters: {
				...parameters,
				...imageSelected.index,
				o: output_png,
			}
		}
	)

	if (isFlip) {
		viewer.viewport.setFlip(!parameters.f)
		viewer.viewport.setRotation(!parameters.f ? 180 : 0)
		dispatch(clearLoading())

	} else {
		/*
		 * get current location OSD
		 */
		window.box = viewer.viewport.getBounds()

		ipcRenderer.once('end_process', (e, stdout) => {			


			dispatch(setHistogram(stdout.histogram))
			dispatch(setImgSelectedData(stdout.imageSelectedData))
			dispatch(onChangeImageSelected({
				...imageSelected,
				original: false,
				parameters
			}
			))
			dispatch(loadImage())
			dispatch(updateHash())
		})
	}

}

export const saveFile = () => (dispatch, getState) => {

	let { parameters, filePath, oldData, imageSelected } = getState()

	// if (imageSelected.original) {

	const old_parameters = oldData?.[0]
	const new_parameters = { ...parameters }
	if (imageSelected.original) {

		const { newWhitelvl, newBlacklvl } = saveScale(new_parameters, old_parameters, imageSelected)

		new_parameters.w = newWhitelvl
		new_parameters.b = newBlacklvl
	}

	// }



	// isLinearChangeScaledPeakLevel(parameters)

	ipcRenderer.send('saveFile_process', { parameters: new_parameters, filePath })
	ipcRenderer.once('end_process', (e, stdout) => {
		dispatch(closeLoading())
	})

}
// export const saveFile = () => (dispatch, getState) => {
// 	const { parameters, filePath } = getState()

// 	// isLinearChangeScaledPeakLevel(parameters)

// 	ipcRenderer.send('saveFile_process', { parameters, filePath })
// 	ipcRenderer.once('end_process', (e, stdout) => {
// 		dispatch(closeLoading())
// 	})
// }
export const changeImage = (image) => (dispatch, getState) => {
	dispatch(setLoading())
	dispatch(onChangeImageSelected(image))

	const { filePath, viewer } = getState()

	ipcRenderer.send('change::image', { filePath, image })
	ipcRenderer.once("onChangeImage:return", (e, stdout) => {
		dispatch(setHistogram(stdout.histogram))
		dispatch(setImgSelectedData(stdout.imageSelectedData))
		dispatch(loadImage())

		viewer.viewport.setFlip(!image.parameters.f)
		viewer.viewport.setRotation(!image.parameters.f ? 180 : 0)
	})
}
export const resetParameters = () => (dispatch, getState) => {

	dispatch(setLoading())
	const { filePath, imageSelected } = getState()

	ipcRenderer.send('reset_process', { filePath, imageSelected })
	ipcRenderer.once("resetImage:return", (e, data) => {


		dispatch({ type: types.RESET_PARAMETERS })
		dispatch(
			onChangeImageSelected({
				...imageSelected,
				original: true,
				parameters: {
					...imageSelected.index
				}
			}
			))
		dispatch(setFitsImages(data.images))
		dispatch(setHistogram(data.histogram))
		dispatch(setImgSelectedData(data.imageSelectedData))
		dispatch(loadImage())
		dispatch(setOldData([{ original: true }]))
		dispatch(updateHash())

		// dispatch(clearLoading())
	})
}
export const clearLoading = () => {
	return { type: types.CLEAR_FILE_LOADING }
}
export const updateWhiteLvlPicker = payload => {
	return { type: types.UPDATE_WHITELVL_PICKER, payload }
}
export const updateBlackLvlPicker = payload => {
	return { type: types.UPDATE_BLACKLVL_PICKER, payload }
}

export const setParameters = payload => dispatch => {
	dispatch({ type: types.SET_PARAMETERS, payload })
}

export const closeLoading = () => dispatch => {
	dispatch(clearLoading())

}

export const setMarkPixel = (data) => dispatch => {
	dispatch({ type: types.SET_MARKPIXEL, payload: data })
}

/**
 *  utils
 */


const setFilePath = payload => dispatch => {
	dispatch({ type: types.SET_FILEPATH, payload })
}
const setFitsHeaders = data => dispatch => {
	dispatch({ type: types.SET_FITSHEADERS, payload: data })
}
const setFitsImages = Images => dispatch => {
	dispatch(
		{ type: types.SET_FITS_IMAGES, payload: Images }
	)
}
const setImageSize = size => dispatch => {
	dispatch(
		{ type: types.SET_IMAGE_SIZE, payload: size }
	)
}

const setHistogram = payload => dispatch => {
	dispatch(
		{ type: types.SET_HISTOGRAM_DATA, payload }
	)
}
const onChangeImageSelected = image => (dispatch, getState) => {

	const { freezeSettings } = getState()
	dispatch({ type: types.SET_IMAGE_SELECTED, payload: image })
	if (!image.original || freezeSettings) {
		dispatch(setParameters(image.parameters))
	}
}
const setImgSelectedData = payload => dispatch => {

	dispatch({ type: types.SET_IMAGE_SELECTED_DATA, payload })
}

const updateHash = () => {

	return { type: types.UPDATE_HASH, payload: Date.now() }
}
const setOldData = payload => {

	return { type: types.SET_OLD_DATA, payload }
}
const updateOldData = payload => {

	return { type: types.UPDATE_OLD_DATA, payload }
}

const setOutput_png = url => {
	return { type: types.SET_OUTPUT_PNG, payload: url }
}


const setLoading = () => {
	return { type: types.SET_FILE_LOADING }
}

const initialProcess = (dispatch, stdout, viewer) => {

	/**
	 * clear cache PNG
	 */
	window.pngCache = {}

	document.title = `NOIRLab/IPAC/ESA/STScI/CfA  FITS Liberator - ${stdout.fileName} `

	dispatch(setOutput_png(stdout.output_png))
	dispatch(setImgSelectedData(stdout.imageSelectedData))
	dispatch(setImageSize(stdout.size))
	dispatch(setFilePath(stdout.filePath))
	dispatch(setFitsHeaders(stdout.fitsHeaders))
	dispatch(setFitsImages(stdout.images))
	dispatch(setHistogram(stdout.histogram))
	dispatch(onChangeImageSelected(stdout.imageSelected))
	dispatch(loadImage(true))


	/**
	 * restore parameters for scale/descale
	 */	
	// if (stdout.imageSelected.original)
	// 	dispatch(setOldData({ original: true }))
	// else
	// 	dispatch(setOldData(stdout.imageSelected.parameters))

	dispatch(setOldData(stdout.oldData))

	/**
	 * Flip process with OSD
	 */
	viewer.viewport.setFlip(!stdout.imageSelected.parameters.f)
	viewer.viewport.setRotation(!stdout.imageSelected.parameters.f ? 180 : 0)

	dispatch(updateHash())
}