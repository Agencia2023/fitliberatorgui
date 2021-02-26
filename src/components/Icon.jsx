import React from 'react'
import PropTypes from 'prop-types'

const Svg = ({ children, style, ...rest }) => {

    return <svg width="22" height="22" style={{ ...style, verticalAlign: 'middle' }} viewBox="0 0 25 22" {...rest} >
        {children}
    </svg>
}

export const BlackLevelIcon = props => {
    return <Svg   {...props} >
        <path stroke="white" fill="black" d="M 5 0 Q 1 1 1 4 L 1 19 Q 2 22 5 23 L 13 23 L 22 11 L 22 11 L 13 0 L 5 0" ></path>
    </Svg>
}
export const WhiteLevelIcon = props => {
    return <Svg {...props}>
        <path stroke="black" fill="white" d="M 20 0 Q 24 1 24 4 L 24 19 Q 23 22 20 23 L 12 23 L 3 11 L 3 11 L 12 0 L 20 0" ></path>
    </Svg>
}


function Icon({ name, ...rest }) {
    return (
        <i className={`icon ${name}`} {...rest} />
    )
}

Icon.propTypes = {
    name: PropTypes.string.isRequired
}

export default Icon


