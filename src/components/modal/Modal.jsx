import React from 'react'
import './Modal.scss'

const ESC = 27
const Modal = ({ openModal, children, closeModal ,style }) => {

    const close = React.useCallback((e) => {
        if (e.keyCode === ESC) {
            closeModal && closeModal(false)
        }
    }, [])
    React.useEffect(() => {

        document.addEventListener("keydown", close, false)

        return () => {
            document.removeEventListener("keydown", close, false)
        }
    })


    const verifyClose = e => {

        if (e.target.classList.contains('header-modal'))
            closeModal(false)
    }

    if (!openModal)
        return null


    return (
        <div className={`header-modal open`} onClick={verifyClose} style={style}>
            {children}
        </div>
    )
}

export default Modal