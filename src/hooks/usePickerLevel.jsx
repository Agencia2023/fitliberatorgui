import React from 'react'
import { updateWhiteLvlPicker, updateBlackLvlPicker } from '../models/actions/fileActions'
import { useSelector, useDispatch } from 'react-redux'
import { OSD_ID } from '../models/actions/viewerActions'
import useSpaceGrab from './useSpaceGrab'


const usePickerLevel = () => {
    const whiteLvlPicker = useSelector(state => state.whiteLvlPicker)
    const blackLvlPicker = useSelector(state => state.blackLvlPicker)
    const dispatch = useDispatch()

    const grabActive = useSpaceGrab()

    const toggleOSDPicker = isActive => {
        const ref = document.getElementById(OSD_ID)
        isActive ? ref.classList.add('osd-picker-active') : ref.classList.remove('osd-picker-active')
    }


    const onChangeWlvl = React.useCallback(() => {

        const currentW = !whiteLvlPicker

        toggleOSDPicker(currentW)

        dispatch(updateWhiteLvlPicker(currentW))
        dispatch(updateBlackLvlPicker(false))

    }, [whiteLvlPicker,grabActive])
    const onChangeBlvl = React.useCallback(() => {

        
        const currentB = !blackLvlPicker

        toggleOSDPicker(currentB)

        dispatch(updateBlackLvlPicker(currentB))
        dispatch(updateWhiteLvlPicker(false))

    }, [blackLvlPicker,grabActive])

    if (grabActive)
        return { whiteLvlPicker: false, blackLvlPicker: false, onChangeBlvl, onChangeWlvl }

    return { whiteLvlPicker, blackLvlPicker, onChangeBlvl, onChangeWlvl }
}

export default usePickerLevel