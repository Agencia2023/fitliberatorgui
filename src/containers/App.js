
import React, { useState, useCallback, useEffect } from 'react'
import FitsMenu from '../components/FitsMenu'
import Header from '../components/Header'
import Processing from './Processing'
import Container from '../components/container/Container'
import FooterBar from '../components/footer/FooterBar'
import { ipcRenderer } from 'electron'

const AppContainer = () => {

    const [headerModal, setHeaderModal] = useState(false)
    const [aboutModal, setAboutModal] = useState(false)
    const [optionsModal, setOptionsModal] = useState(false)

    const toggleHeaderModal = useCallback((state) => setHeaderModal(state))
    const toggleAboutModal = useCallback((state) => { setOptionsModal(false); setAboutModal(state); })
    const toggleOptionsModal = useCallback((state) => { setAboutModal(false); setOptionsModal(state) })

    useEffect(() => {

        ipcRenderer.on('process:openAbout', () => toggleAboutModal(true))


        /**
        * animation trigger
        */
        document.body.classList.add('endload')


        return () => {
            ipcRenderer.removeListener('process:openAbout')
        }
    }, [])

    return (
        <Container >
            <Header openModal={toggleHeaderModal} headerModal={headerModal} />
            <Processing openModal={headerModal} aboutModal={aboutModal} closeModal={toggleAboutModal} optionsModal={{ state: optionsModal, closeModal: toggleOptionsModal }} />
            <FitsMenu openModal={toggleAboutModal} openOptionsModal={toggleOptionsModal} />
            <FooterBar />
        </Container>
    )
}

export default AppContainer

