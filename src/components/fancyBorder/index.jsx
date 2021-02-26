import React from 'react'
import './facyBorder.scss'

const FancyBorder = props => {

    return (
        <div className="bar-wrapper" {...props}>
            <div className="bar-line" />
        </div>
    )
}


export default FancyBorder