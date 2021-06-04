import React from 'react'
import useKeyboardShortcut from 'use-keyboard-shortcut'

const KeyboardShortcuts = ({ arrowUpFN, arrowDownFN }) => {
    useKeyboardShortcut(['Shift', 'ArrowUp'], () => arrowUpFN(), { overrideSystem: false })
    useKeyboardShortcut(['Shift', 'ArrowDown'], () => arrowDownFN(), { overrideSystem: false })

    return (<></>)
}

export default KeyboardShortcuts