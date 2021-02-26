import React from 'react'
import './Animation.scss'

export default function Animation({ children, type }) {
    return (
        <div className={`mini animation-fn ${type}`}>
            {children}
        </div>

    )
}
