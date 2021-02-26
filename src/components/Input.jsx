import React from 'react'
import PropTypes from 'prop-types'

const Input = ({ label, editing, children, ...rest }) => {
    return (
        <div className="field">
            <label>{label}</label>
            <div className={`ui ${children && 'action'} input big ${editing && 'davo editing'}`}>
                <input {...rest} />
                {children}
            </div>
        </div>

    )
}
Input.propTypes = {
    label: PropTypes.string.isRequired,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
}

export default Input