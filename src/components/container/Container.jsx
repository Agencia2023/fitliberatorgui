import React from 'react'
import PropTypes from 'prop-types'
import './Container.scss'

const Container =  ({ children }) => {

    return <div className="container-root">
        {children}
    </div>
}


Container.propTypes = {
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ]).isRequired
}
export default Container
