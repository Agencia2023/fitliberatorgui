import React from 'react'
import Icon from '../Icon'

const OSDMenuItem = ({ id, icon: IconAsParam }) => {


    return <li>
        <div id={id}>
            {typeof IconAsParam === 'string' ? <Icon name={IconAsParam} /> : <IconAsParam />}
        </div>
    </li>
}


export default OSDMenuItem