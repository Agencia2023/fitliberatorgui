import React from 'react'
import Icon from '../Icon'

const OSDMenuItem = ({ id, icon }) => {
    return <li>
        <div id={id}>
            <Icon name={icon} />
        </div>
    </li>
}


export default OSDMenuItem