import React from 'react'
import './about.scss'
import Modal from '../Modal'
import Divider from '../../Divider'
import TextAnimate from '../../animation/TextAnimate'
import Icon from '../../Icon'
import { useSelector } from 'react-redux'
/**
 * images
 */
import logo from '../../../assets/images/fl4.png'
import es from '../../../assets/images/es.png'
import bitpointer from '../../../assets/images/bitp.png'
import harvard from '../../../assets/images/harvard.jpg'
import nasa from '../../../assets/images/nasa-logo.png'
import esa from '../../../assets/images/esa_logo.png'
import stsci from '../../../assets/images/stsci.png'
import ipac from '../../../assets/images/ipac.png'
import noirlab from '../../../assets/images/noirlab.png'

/**
 * developers
 */
const developer_team = [
    'Juan Fajardo Barrero',
    'David Zambrano Lizarazo'
]

const AboutItem = ({ desc, value }) => {
    return (
        <div>
            <strong>{desc}:</strong> <TextAnimate time={20}>{value} </TextAnimate>
        </div>
    )
}
const About = props => {

    const rnd = Math.round(Math.random() * 1)
    const { version } = useSelector(state => state.workspace)

    return (
        <Modal {...props}>
            <div className="about">
                <span className="header-modal-close" onClick={() => props.closeModal(false)} title="Close" ><Icon name="close" /></span>
                <div className="about-logo">
                    <div>
                        <img src={logo} title={`FITS Liberator 4.0`} width="150" />
                        <h4>FITS Liberator</h4>
                    </div>
                </div>

                <div className="about-team">
                    <AboutItem desc="Developers" value={`${developer_team[rnd]} & ${developer_team[Number(!rnd)]}`} />
                    <AboutItem desc="Technical & scientific support and testing" value="Robert Hurt" />
                    <AboutItem desc="Project Executive" value="Lars Lindberg Christensen" />

                    <small className="about-version"><TextAnimate> Version {version} </TextAnimate></small>
                    <Divider />

                    <footer className="about-footer">
                        <div className="logos">
                            <img title="NATIONALASTRO, NOIRLAB" className="g2" src={noirlab} width="95" />
                            <img title="Infrared Processing and Analysis Center" src={ipac} width="40" />
                            <img title="European Space Agency" src={esa} width="70" />
                            <img title="Space Telescope Science Institute" src={stsci} width="40" />
                            <img title="CENTER FOR ASTROPHYSICS HARVARD & SMITHSONIAN" className="g3" src={harvard} width="135" />
                            {/* <img title="NASA" src={nasa} width="40" /> */}
                        </div>
                        <div style={{ display: 'grid', justifyContent: 'right', gridAutoFlow: 'column', gap: 5, marginTop: 10 }}>
                            <img title="BitPointer" src={bitpointer} width="40" />
                            <img title="Enciso Systems" src={es} width="40" style={{ alignSelf: 'flex-end' }} />
                        </div>
                        <div>
                            <b>
                                NOIRLab/IPAC/ESA/STScI/CfA<br />                                
                            </b>
                        </div>
                    </footer>
                </div>
            </div>
        </Modal>
    )
}

export default About
