import React from 'react'
import PropTypes from 'prop-types'
import Icon from '../Icon'
import './Card.scss'

const Card = ({ children, isToggle = false, title, show = false, up, icon = "", ...rest }) => {

    const toggleIcon = show ? 'up' : 'down'

    const animate = show ? 'animate' : 'na'

    return (
        <div className={`ui card ${animate} fluid`} style={rest.style}>
            <div className="content">
                <div className="header text-accent" {...rest} >
                    <Icon name={icon} /> <span style={{ cursor: isToggle ? 'pointer' : 'default' }}> {title} </span>
                    {isToggle && <Icon name={`angle ${toggleIcon}`} style={{ float: 'right', cursor: 'pointer' }} />}
                </div>
            </div>

            <div className={`content ${isToggle ? 'toggleCardContent' : ''}`} style={{ zIndex: up && 1 }}>{children}</div>
        </div >
    )
}
Card.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]),
    isToggle: PropTypes.bool,
    title: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node,
        PropTypes.string
    ]).isRequired,
    show: PropTypes.bool,
    icon: PropTypes.string
}

export default Card