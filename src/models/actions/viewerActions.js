import * as types from './actionTypes'
import filter from '../../utils/filter'

export const OSD_ID = 'openseadragonViewer'

const config = {
    id: OSD_ID,
    crossOriginPolicy: "Anonymous",
    toolbar: "toolbarDiv",
    zoomInButton: "zoom-in",
    zoomOutButton: "zoom-out",
    homeButton: "home",
    maxZoomLevel: 100,
    fullPageButton: "full-page",
    loadTilesWithAjax: true,
    debugMode: false,
    // immediateRender:true
}

export const createViewer = () => dispatch => {
    /**
     * OSD init
     */
    const viewer = OpenSeadragon(config)
    /**
     * disabled zoom
     */
    viewer.gestureSettingsMouse.clickToZoom = false
    /**
     * preserve Zoom
     */
    viewer.preserveViewport = true
    window.viewer = viewer
    dispatch({ type: types.SET_VIEWER, payload: viewer })

    return viewer
}

/**
*  OSDFiltering (with custom mod)
*/
export const applyFilterOSD = () => (dispatch, getState) => {
    // dispatch({ type: types.SET_FILE_LOADING })
    const { imageSelectedData, viewer, parameters, markPixel } = getState()
    const { statistics: { min, max }, raw} = imageSelectedData

    // b -> blackLevel, w -> whiteLevel
    const { b, w } = parameters
  
    // viewer.world.resetItems()
    viewer.setFilterOptions({
        loadMode: 'sync',
        filters: {
            // items: viewer.world.getItemAt(0),
            processors: filter(markPixel, min, max, b, w, raw )
        

        }
    })    

}


/**
* force to reload the image
*/
export const loadImage = (firstTime = false) => (dispatch, getState) => {
    const noCache = Math.random()
    let { viewer, output_png } = getState()

    const url = `file:///${output_png}?noCache=${noCache}`

    viewer.open({
        type: 'image',
        url,    
        buildPyramid: false,
        crossOriginPolicy: 'Anonymous'
    })

    if (firstTime)
        setTimeout(() => viewer.viewport.goHome(true), 500)
}