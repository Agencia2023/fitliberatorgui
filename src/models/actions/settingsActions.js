import { ipcRenderer } from 'electron'
import { TOGGLE_FREEZE_SETTING, CLEAR_AND_RESET_APP, UPDATE_HASH } from '../actions/actionTypes'


export const APÏ_CLEAR_CACHE = cb => (dispatch, getState) => {

	const { viewer } = getState()
	viewer.open('')
	ipcRenderer.send('clearCache')
	dispatch({ type: CLEAR_AND_RESET_APP })	
	ipcRenderer.once('clearCache::response', (e, stdout) => cb(stdout))

}
export const updateSettings = (data, cb) => {

	ipcRenderer.send('update_Settings', data)
	ipcRenderer.once('update_Settings::response', (e, stdout) => cb(stdout))
}

export const toggleFreezeSettings = () => dispatch => dispatch({ type: TOGGLE_FREEZE_SETTING })
