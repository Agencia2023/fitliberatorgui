import React from 'react'
import PropTypes from 'prop-types'
import Icon from './Icon'


const Button = ({ text, type, style, disabled, icon, children, ...rest }) => {
    return (
        <button className={`ui button tiny ${type}`} style={{ pointerEvents: disabled && 'none', ...style }}  {...rest}>
            {icon && <Icon name={icon} />}{text}{children}
        </button>

    )
}

Button.propTypes = {
    text: PropTypes.oneOfType([
        PropTypes.node,
        PropTypes.string
    ]),
    type: PropTypes.string,
    icon: PropTypes.string,
    style: PropTypes.object,
    disabled: PropTypes.bool
}

export default Button