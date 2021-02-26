import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import * as types from '../models/actions/actionTypes'

const updateSg = payload => ({ type: types.SET_SPACE_GRAB, payload })

const useSpaceGrab = () => {


    const spaceGrab = useSelector(state => state.spaceGrab)
    const dispatch = useDispatch()


    const _handleKeyUp = ({ keyCode }) => {
        if (keyCode === 32) {
            dispatch(updateSg(false)
            )

        }
    }
    const _handleKeyDown = (({ keyCode }) => {

        if (keyCode === 32) {
            dispatch(
                updateSg(true)
            )

        }

    })

    useEffect(() => {

        document.removeEventListener("keydown", debounce(_handleKeyDown,200));
        document.removeEventListener("keyup", _handleKeyUp);


        return () => {

            document.addEventListener("keydown", _handleKeyDown);
            document.addEventListener("keyup", _handleKeyUp);
        }
    })



    return spaceGrab
}

export default useSpaceGrab

// Returns a function, that, as long as it continues to be invoked, will not
// be triggered. The function will be called after it stops being called for
// `wait` milliseconds.
const debounce = (func, wait) => {
    let timeout;
  
    // This is the function that is returned and will be executed many times
    // We spread (...args) to capture any number of parameters we want to pass
    return function executedFunction(...args) {
  
      // The callback function to be executed after 
      // the debounce time has elapsed
      const later = () => {
        // null timeout to indicate the debounce ended
        timeout = null;
        
        // Execute the callback
        func(...args);
      };
      // This will reset the waiting every function execution.
      // This is the step that prevents the function from
      // being executed because it will never reach the 
      // inside of the previous setTimeout  
      clearTimeout(timeout);
      
      // Restart the debounce waiting period.
      // setTimeout returns a truthy value (it differs in web vs Node)
      timeout = setTimeout(later, wait);
    };
  };