import React from 'react'
import { BlackLevelIcon, WhiteLevelIcon } from './Icon'

export const BlackWhiteLevel = () => {
    return (
        <div className='histogram-opt'>
            <div className="field">
                <label>
                    <BlackLevelIcon style={{ marginRight: 5 }} />
                Black level
            </label>
                <div className="ui action labeled input mini left floated" style={{ width: 90 }}>
                    <input type="number" name="b" id="blacklvl"  placeholder="..." />
                </div>
            </div>
            <div className="field">

                <div className="ui action labeled input mini right floated" style={{ width: 90 }}>
                    <input type="number" name="w" id="whitelvl"  placeholder="..." />
                </div>
                <label style={{ marginLeft: 8 }} >
                    White level
                    <WhiteLevelIcon style={{ marginLeft: 5 }} />
                </label>
            </div>
        </div>
    )
}



export default BlackWhiteLevel
