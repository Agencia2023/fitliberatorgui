import React from 'react'
import PropTypes from 'prop-types'
import './ScalingFunction.scss'

const addActive = (fn, { value }) => fn === value ? 'active' : ''

const ScalingFunction = React.memo(({ updateFunction, fn, options }) => {

    return (
        <section className="wrapper-scalingFunction" >
            <div className="ui top attached tabular menu" >
                {options.map(option => <li className={`item ${addActive(fn, option)}`} key={option.value} onClick={() => updateFunction({ s: option.value })} >
                    {option.value}
                </li>)
                }
            </div>
        </section>
    )
})

ScalingFunction.propTypes = {
    updateFunction: PropTypes.func.isRequired,
    fn: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
}

export default ScalingFunction