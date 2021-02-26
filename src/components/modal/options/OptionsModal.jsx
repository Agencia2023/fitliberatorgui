import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Button from '../../Button'
import Checkbox from '../../Checkbox'
import Divider from '../../Divider'
import Modal from '../Modal'
import { SET_HIGH_QUALITY } from '../../../models/actions/actionTypes'
import Icon from '../../Icon'
import { APÏ_CLEAR_CACHE, updateSettings } from '../../../models/actions/settingsActions'

import './OptionsModal.scss'
import Circle from '../../circle/Circle'


const OptionsModal = props => {

    const [res, setRes] = useState('')
    const [loading, setLoading] = useState(false)
    const highPerformance = useSelector(state => state.highPerformance)
    const workspace = useSelector(state => state.workspace)
    const dispatch = useDispatch()

    const handleQuality = e => {
        let chk = e.target.checked        

        updateSettings({ highPerformance: chk }, () => {

            dispatch(
                { type: SET_HIGH_QUALITY, payload: chk }
            )
        })

    }
    const clearCache = () => {
        setRes('')
        setLoading(true)
        dispatch(
            APÏ_CLEAR_CACHE((res) => {
                setTimeout(() => {

                    setRes(res)
                    setLoading(false)
                }, 500)
            })
        )
    }

    return (
        <Modal {...props} >

            <div className="optionsModal">
                <span className="optionsModal-close" onClick={() => props.closeModal(false)} title="close" ><Icon name="close" /></span>
                <h2><Icon name="tasks item" /> FITS Liberator Options</h2>
                <Divider />
                <h3 className='header'>Advanced </h3>
                {/* <span>
                    <Checkbox name="highPerformance" id="highPerformance" checked={highPerformance} onChange={handleQuality}  >
                        High Performance ( Low Quality Image )
                    </Checkbox>
                </span> */}
                <h5 className='header'>Histogram markers ( Read-only )</h5>
                <span className="header" style={{ display: 'grid', gridTemplateColumns: ' 100px 200px', gap: 10 }}>
                    <div>
                        <Circle color="red" type='box' /> Data Zero
                    </div>
                    <div>
                        <Circle color="green" type='box' /> Scaling Background Level
                    </div>
                    <div>
                        <Circle color="blue" type='box' /> Data Mean
                    </div>
                    <div>
                        <Circle color="pink" type='box' /> Scaling Peak Level

                    </div>
                </span>
                <h5 className='header'>Cache Information </h5>
                <span className="header">
                    <span>
                        <details>
                            <summary><Icon name="folder item large" /> Storage</summary>
                            {workspace?.storage}
                        </details>
                    </span>
                    <span>
                        <details>
                            <summary><Icon name="folder item large" /> Workdir</summary>
                            {workspace?.workdir}
                        </details>
                    </span>

                    <Button type={`red ${loading ? 'loading' : ''}`} style={{ marginTop: 12 }} title='Clear Cache' icon='trash' onClick={clearCache} text="Clear" />
                    <span><small>{res}</small> </span>
                </span>
                {/* <h5 className='header'>CLI  </h5>
                <span className="header">
                        <span>
                            <details>
                                <summary><Icon name="folder item large" /> FITSLiberator CLI</summary>
                                {workspace?.fits_cli}
                            </details>
                        </span>                    
                </span> */}



                <Divider />
            </div>
        </Modal >
    )
}

export default OptionsModal