import React from 'react'
import './osdmenu.scss'
import { BlackLevelIcon, WhiteLevelIcon } from '../Icon'
import usePickerLevel from '../../hooks/usePickerLevel'
import OSDMenuItem from './OSDMenuItem'

const OSD_MENU_IDENTIFIER = 'toolbarDiv'

const OSDNormalOptions = ({ options }) => options.map((option, i) => <OSDMenuItem {...option} key={i} />)


const isActive = s => s ? 'active' : ''

const OSDMenu = () => {

    const { whiteLvlPicker, blackLvlPicker, onChangeBlvl, onChangeWlvl } = usePickerLevel()

    const style = {
        position: 'absolute',
        top: -16,
        left: 0,
        width: 12
    }
    const options = [
        { id: 'home', icon: "home" },
        { id: 'full-page', icon: "expand" },
        { id: 'zoom-in', icon: "search plus" },
        { id: 'zoom-out', icon: "search minus" }
    ]

    return (
        <nav className="sidebar-navigation " id={OSD_MENU_IDENTIFIER}>
            <ul>
                <OSDNormalOptions options={options} />
                {/* <li title="Background Level Sampler Tool" className={`${blackLvlPicker && 'active'}`} onClick={onChangeBlvl}>
                    <i className="eye dropper icon" style={{ color: 'black', display: 'inline-block' }}></i>
                </li>
                <li title="Peak Level Sampler Tool" className={`${whiteLvlPicker && 'active'}`} onClick={onChangeWlvl}>
                    <i className="eye dropper icon" style={{ display: 'inline-block' }}></i>
                </li> */}
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