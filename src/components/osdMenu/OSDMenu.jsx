import React from 'react'
import './osdmenu.scss'
import { BlackLevelIcon, FullScreenIcon, WhiteLevelIcon } from '../Icon'
import usePickerLevel from '../../hooks/usePickerLevel'
import OSDMenuItem from './OSDMenuItem'

const OSD_MENU_IDENTIFIER = 'toolbarDiv'

const isActive = s => s ? 'active' : ''

const style = {
    position: 'absolute',
    top: -16,
    left: 0,
    width: 12
}
const OSDMenu = () => {

    const { whiteLvlPicker, blackLvlPicker, onChangeBlvl, onChangeWlvl } = usePickerLevel()

    return (
        <nav className="sidebar-navigation " id={OSD_MENU_IDENTIFIER}>
            <ul>
                <OSDMenuItem id="full-page" icon={FullScreenIcon} />
            </ul>
            <ul>
                <OSDMenuItem id="home" icon="home" />
                <OSDMenuItem id="zoom-in" icon="search plus" />
                <OSDMenuItem id="zoom-out" icon="search minus" />
            </ul>
            {/* <li title="Background Level Sampler Tool" className={`${blackLvlPicker && 'active'}`} onClick={onChangeBlvl}>
                    <i className="eye dropper icon" style={{ color: 'black', display: 'inline-block' }}></i>
                </li>
                <li title="Peak Level Sampler Tool" className={`${whiteLvlPicker && 'active'}`} onClick={onChangeWlvl}>
                    <i className="eye dropper icon" style={{ display: 'inline-block' }}></i>
                </li> */}
            <ul>
                <li title="Black Level Picker Tool" className={isActive(blackLvlPicker)} onClick={onChangeBlvl}>
                    <div >
                        <i className="eye dropper icon picker" >
                            <BlackLevelIcon style={style} />
                        </i>
                    </div>
                </li>
                <li title="White Level Picker Tool" className={isActive(whiteLvlPicker)} onClick={onChangeWlvl}>
                    <div>
                        <i className="eye dropper icon picker" >
                            <WhiteLevelIcon style={style} />
                        </i>
                    </div>
                </li>
            </ul>
        </nav>
    )
}
export default OSDMenu