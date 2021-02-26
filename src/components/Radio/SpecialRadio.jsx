import React from 'react'
import './SpecialRadio.scss'


export const SpecialRadio = ({ label, id, ...rest }) => {
    return (
        <div className='btn-radio-special' >
            <input type="radio" id={id} {...rest} />
            <label htmlFor={id}>
                <h5>{label}</h5>
            </label>
        </div>
    )
}

export default SpecialRadio
