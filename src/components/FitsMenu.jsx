import React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { openFile, saveFile, setParameters, resetParameters, applyChanges, setMarkPixel } from '../models/actions/fileActions'
import { applyFilterOSD } from '../models/actions/viewerActions'
import Checkbox from './Checkbox'
import Circle from './circle/Circle'
import Button from './Button'
import Divider from './Divider'
import { useSelector } from 'react-redux'
import { toggleFreezeSettings } from '../models/actions/settingsActions'
// import { SET_SHOW_OPTIONS_MODAL } from '../models/actions/actionTypes'


const FitsMenu = ({ actions, openModal, openOptionsModal }) => {

    const loading = useSelector(state => state.loading)
    const parameters = useSelector(state => state.parameters)
    const freezeSettings = useSelector(state => state.freezeSettings)
    const markPixel = useSelector(state => state.markPixel)
    const disabled = useSelector(state => !state.filePath)

    const saveFile = () => actions.saveFile()

    const onChange = e => {
        actions.setParameters({
            [e.target.name]: Number(e.target.value),
        })

    }
    const onChangeChck = e => {

        actions.setParameters({
            [e.target.name]: Number(e.target.checked)
        })
    }
    const flipImage = e => {
        onChangeChck(e)


        actions.applyChanges(true)

    }
    const toggleMarkPixel = e => {

        actions.setMarkPixel({
            ...markPixel,
            [e.target.name]: e.target.checked
        })
        actions.applyFilterOSD()

    }

    return (
        <nav className="menuOptions">
            <div className="btns-options">

                <Button type={`basic davo ${loading ? 'loading' : ''}`} text="Open FITS File" icon="folder open outline" onClick={() => actions.openFile()} />
                <Button type={`basic `} text="Save" icon="save" onClick={saveFile} disabled={disabled} />


                <label className="small-fns left floated ">Bit Depth</label>
                <div className="left floated " style={{ marginLeft: 3 }}>

                    <span>
                        <input id="d1" type="radio" name="d" checked={parameters.d === 16} value={16} onChange={onChange} />
                        <label htmlFor="d1" style={{ fontSize: 12, marginRight: 4 }} >16-bit</label>
                    </span>
                    <span>
                        <input id="d2" type="radio" name="d" checked={parameters.d === 32} value={32} onChange={onChange} />
                        <label htmlFor="d2" style={{ fontSize: 12 }} >32-bit</label>
                    </span>

                </div>

                <label className="small-fns  right floated" >Alpha Channel</label>
                <div className="right floated " style={{ marginLeft: 3 }}>

                    <input id="u1" type="radio" name="u" checked={parameters.u === 0} value={0} onChange={onChange} />
                    <label htmlFor="u1" style={{ fontSize: 12, marginRight: 4 }}>Black</label>

                    <input id="u2" type="radio" name="u" value={1} checked={parameters.u === 1} onChange={onChange} />
                    <label htmlFor="u2" style={{ fontSize: 12 }}>Transparent</label>

                </div>

                {/* <Button type="basic" text="Save & Edit" icon="save outline" /> */}

                <Button type="basic" text="Options" icon="cog" onClick={() => openOptionsModal(true)} />
                <Button type="basic" text="About" icon="info" onClick={() => openModal(true)} />
                {!disabled && <Button text="Reset parameters" icon="redo" onClick={() => actions.resetParameters()} disabled={disabled} />}

            </div>
            <Divider />
            <br />

            <Checkbox name="f" id="flipImage" checked={parameters.f} onChange={flipImage} disabled={disabled}>
                Flip Image
            </Checkbox>
            <Checkbox name="freezeSettings" id="freezeSettings" checked={freezeSettings} onChange={() => actions.toggleFreezeSettings()} disabled={disabled}>
                Freeze Settings
            </Checkbox>

            <Divider />

            <h5>Mark pixels in preview</h5>

            <Checkbox name="undefined" id="undefined" checked={markPixel.undefined} onChange={toggleMarkPixel} >
                <Circle color="red" />   Undefined
            </Checkbox>
            <Checkbox name="white_clip" id="white_clip" checked={markPixel.white_clip} onChange={toggleMarkPixel} >
                <Circle color="green" /> White clipping
            </Checkbox>
            <Checkbox name="black_clip" id="black_clip" checked={markPixel.black_clip} onChange={toggleMarkPixel} >
                <Circle color="blue" /> Black clipping
            </Checkbox>

            <br />
            <br />
            <br />

            <Divider />

            {/* 
            <div className="content-logos">
                <div className="logos">
                    <img title="CFA" className="g3" src="https://www.cfa.harvard.edu/sites/all/themes/cfa_theme/images/cfa_theme_logo_black.png" width="125" />
                    <img title="NATIONALASTRO" className="g2" src="https://nationalastro.org//wp-content/uploads/2020/04/NOIRLab-NSF-Logo-small-dark.png" width="80" />
                    <img title="NASA" src="https://baxuanballahjeoqoj.files.wordpress.com/2014/09/nasa-logo.png?w=584" width="40" />
                    <img title="ESA" src="https://www.logolynx.com/images/logolynx/5a/5a1f3af3a6564abf3d5ce863660ece19.png" width="40" />                    
                    <img title="STSCI" src="http://www.stsci.edu/modules/stsci-www-assets/assets/favicons/android-chrome-256x256.png" width="40" />
                    <img title="CFA" src="https://encrypted-tbn0.gstatic.com/images?q=tbn%3AANd9GcQ4WJHXpWFZ2hoN1vj6s37KYaWQgGTHqiZz3TEkI9CbCzkNf-yq&usqp=CAU" width="40" />
                    <img title="IPAC" src="https://www.ipac.caltech.edu/assets/main_ipac_logo-ea4b4e2692a00c68ff2f446d8d468f85.png" width="40" />                    
                </div>
            </div> */}

        </nav>
    )
}



const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                openFile, saveFile, setParameters, resetParameters, applyChanges, setMarkPixel, applyFilterOSD,
                toggleFreezeSettings
            }, dispatch)
    }
}
export default connect(null, mapDispatchToProps)(React.memo(FitsMenu))


