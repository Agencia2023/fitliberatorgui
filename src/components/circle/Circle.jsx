import React from 'react'
import PropTypes from 'prop-types'
import './Circle.scss'


function Circle({ color, type='' }) {
    return (<span>
        <i className={`circle ${color} ${type}`} />        
    </span>
    )
}

Circle.propTypes = {
    color: PropTypes.string.isRequired
}

export default Circle