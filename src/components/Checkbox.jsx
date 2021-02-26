import React from 'react'
import PropTypes from 'prop-types'

 function Checkbox({ id, children, ...rest }) {
    return (
        <div className="ui checkbox">
            <input type="checkbox" id={id}  {...rest} />
            <label htmlFor={id}>{children}</label>
        </div>
    )
}
Checkbox.propTypes = {
    id: PropTypes.string,
    children: PropTypes.oneOfType([
        PropTypes.arrayOf(PropTypes.node),
        PropTypes.node
    ])
}

export default  Checkbox