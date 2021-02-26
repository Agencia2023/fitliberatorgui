import initialState from './initialState';
import * as types from '../actions/actionTypes'


export default (state = initialState, { type, payload }) => {

    switch (type) {

        /**
         * change quality of images 
         */
        case types.SET_HIGH_QUALITY:
            console.log('\n SET_HIGH_QUALITY')
            return { ...state, highPerformance: payload }

        /**
         * show modal options 
         */
        case types.SET_SHOW_OPTIONS_MODAL:
            console.log('\n SET_SHOW_OPTIONS_MODAL', payload)
            return { ...state, show_menu_options: payload }

        case types.SET_INIT:
            console.log('\n SET_INIT', payload)
            return { ...state, ...payload }
        case types.SET_VIEWER:
            console.log('\n SET_VIEWER')
            return { ...state, viewer: payload }
        case types.SET_MARKPIXEL:
            console.log('\n SET_MARKPIXEL')
            return { ...state, markPixel: payload }

        case types.SET_FLIP_IMAGE:
            console.log('\n SET_FLIP_IMAGE')
            return { ...state, flipImage: payload }

        case types.SET_FILE_LOADING:
            console.log('\n SET_FILE_LOADING')
            return { ...state, loading: true }

        case types.CLEAR_FILE_LOADING:
            console.log('\n CLEAR_FILE_LOADING')
            return { ...state, loading: false }

        /**
         * parameters
         */
        case types.SET_PARAMETERS:
            console.log('\n SET_PARAMETERS')
            return { ...state, parameters: { ...state.parameters, ...payload } }
        case types.RESET_PARAMETERS:
            console.log('\n RESET_PARAMETERS')
            return { ...state, parameters: initialState.parameters, isFirstOpen: false }
        case types.CLEAR_AND_RESET_APP:
            console.log('\n CLEAR_AND_RESET_APP', initialState)
            return { ...initialState, viewer: state.viewer }

        case types.SET_FILEPATH:
            console.log('\n SET_FILEPATH')
            return { ...state, filePath: payload, isFirstOpen: true }

        case types.SET_OUTPUT_PNG:
            console.log('\n SET_OUTPUT_PNG')
            return { ...state, output_png: payload }

        case types.SET_FITSHEADERS:
            console.log('\n SET_FITSHEADERS')
            return { ...state, fitsheaders: payload }

        case types.SET_FITS_IMAGES:
            console.log('\n SET_FITS_IMAGES')
            return { ...state, images: payload }

        case types.SET_IMAGE_SELECTED:
            console.log('\n SET_IMAGE_SELECTED')
            return { ...state, imageSelected: payload }
        case types.SET_IMAGE_SIZE:
            console.log('\n SET_IMAGE_SIZE')
            return { ...state, size: payload }

        case types.SET_HISTOGRAM_DATA:
            console.log('\n SET_HISTOGRAM_DATA')
            return { ...state, histogram: payload }

        case types.SET_DRAG_DROP:
            console.log('\n SET_DRAG_DROP')
            return { ...state, dragAndDrop: payload }

        case types.SET_IMAGE_SELECTED_DATA:
            console.log('\n SET_IMAGE_SELECTED_DATA')
            return { ...state, imageSelectedData: payload }


        /**
         * UPDATE_WHITELVL_PICKER, UPDATE_BLACKLVL_PICKER 
         */
        case types.UPDATE_WHITELVL_PICKER:
            console.log('\n UPDATE_WHITELVL_PICKER')
            return { ...state, whiteLvlPicker: payload }
        case types.UPDATE_BLACKLVL_PICKER:
            console.log('\n UPDATE_BLACKLVL_PICKER')
            return { ...state, blackLvlPicker: payload }
        case types.UPDATE_BACKGROUND_LVL_PICKER:
            console.log('\n UPDATE_BACKGROUND_LVL_PICKER')
            return { ...state, backgroundLvlPicker: payload }
        case types.UPDATE_PEAK_LVL_PICKER:
            console.log('\n UPDATE_PEAK_LVL_PICKER')
            return { ...state, peakLvlPicker: payload }


        case types.UPDATE_HASH:
            console.log('\n UPDATE_HASH', state)
            return { ...state, shouldComponentUpdateHash: payload }

        case types.SET_OLD_DATA:
            console.log('\n SET_OLD_DATA')
            return { ...state, oldData: payload }

        case types.UPDATE_OLD_DATA:
            console.log('\n UPDATE_OLD_DATA')
            let newOldData = state.oldData
            if (newOldData.length === 1)
                newOldData.push(payload)
            else
                newOldData = [state.oldData[1], payload]


            console.log("newOldData", newOldData)

            return { ...state, oldData: newOldData }

        case types.TOGGLE_FREEZE_SETTING:
            console.log('\n TOGGLE_FREEZE_SETTING')
            return { ...state, freezeSettings: !state.freezeSettings }

        case types.SET_SPACE_GRAB:
            return { ...state, spaceGrab: payload }

        default: return state;
    }
}
