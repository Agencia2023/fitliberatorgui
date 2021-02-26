import React from 'react'
import { useSelector } from 'react-redux'
import DarkModeSwitch from './DarkModeSwitch'
import Icon from './Icon'
import { openTerminal } from '../models/actions/fileActions'

const isWin = () => process.platform === 'win32'

const Header = ({ openModal, headerModal }) => {
    const isEnable = useSelector(state => !!state.filePath)

    return (
        <header >
            <div className="ui top attached tabular menu withBorder" style={{ height: 'inherit' }}>
                <li className={`item ${!headerModal && 'active'}`} onClick={() => openModal(false)}>
                    <Icon name="spinner" /> Image Processing {isEnable}
                </li>

                <li className={`item ${headerModal && 'active'}`} onClick={isEnable ? () => openModal(true) : null}>
                    <Icon name="list alternate outline" /> FITS Header
                </li>
                {isWin() && <li className="item" onClick={openTerminal} title="open Terminal">
                    <Icon name="terminal" />
                    {' '} CLI
                </li>}

                <li className="item right">
                    <DarkModeSwitch showIcon />
                </li>
            </div>

        </header >

    )
}

export default Header