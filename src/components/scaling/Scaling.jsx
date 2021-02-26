import React, { PureComponent } from 'react'
import ScalingFunction from './ScalingFunction'
import Card from '../card/Card'
import { ScalingCardLoader } from '../loader/Loading'
import Button from '../Button'
import Input from '../Input'
import  { BlackLevelIcon, WhiteLevelIcon } from '../Icon'

import { connect } from 'react-redux'
import Animation from '../animation/Animation'
import { descaled_White_Black_Level } from '../../utils/initial_guess'
import Checkbox from '../Checkbox'
import Circle from '../circle/Circle'
import { transformNumber } from '../../utils/general'

const animate = animate => animate ? 'run' : ''
const disabledEvents = disabled => ({ overflow: 'hidden', pointerEvents: disabled ? 'none' : 'all' })

class Scaling extends PureComponent {

    state = {
        autoApply: false
    }

    onChangeHandler = ({ target }) => {

        if (target.name === 'e') {
            const e = target.value > 10 ? 10 : target.value
            this.props.updateParameters({ e })
        } else
            this.props.updateParameters({ [target.name]: target.value })
    }
    onChangeHandlerFunction = data => {
        this.props.updateParameters(data)


        this.props.applyChanges()
        /**
         * auto apply 
         */
        // this.runAutoApply()
    }



    onBlur = e => {
        if (e.target.name === 'p' && Number(e.target.value) <= this.props.parameters.k)
            this.props.updateParameters({ p: Number(this.props.parameters.k) + .1 })



        /**
         * auto apply 
         */
        this.runAutoApply()

    }

    insertBlackLvl_As_BackgroundLvl = () => {        

        const { new_parameters, old_parameters, imageSelected } = this.props
        const { bl } = descaled_White_Black_Level(imageSelected.original, new_parameters, old_parameters[1])

        this.props.updateParameters({ k: transformNumber(bl) })

        this.runAutoApply()
    }
    insertWhiteLvl_As_PeakLvl = () => {

        const { new_parameters, old_parameters, imageSelected } = this.props

        const { wl } = descaled_White_Black_Level(imageSelected.original, new_parameters, old_parameters[1])

        this.props.updateParameters({ p: transformNumber(wl) })

        this.runAutoApply()
    }

    runAutoApply = () => {
        if (this.state.autoApply)
            this.props.applyChanges()
    }

    _handleKeyDown = e => {
        if (e.key === 'Enter') {
            if (this.state.autoApply)
                this.props.applyChanges()
        }
    }

    render() {
        const { s, k, p, S, e } = this.props.parameters

        const asinh = s === 'asinh'
        const pow = s === 'pow'

        const options = [
            { label: 'Linear', value: 'linear' },
            { label: 'Arsinh', value: 'asinh' },
            { label: 'Power', value: 'pow' }
        ]
        return (
            <Card title="Scaling (Dynamic Range)" icon="sliders horizontal" style={disabledEvents(this.props.disabled)} >
                <div className={`ui form pos-relative`} style={{ paddingBottom: 20 }} >
                    <ScalingFunction fn={s} updateFunction={this.onChangeHandlerFunction} options={options} />
                    {this.props.loading ? <ScalingCardLoader /> :
                        <React.Fragment>
                            <Animation type={`rtl ${animate(pow || asinh)}`}>
                                <Input onChange={this.onChangeHandler} name='k' value={k} onBlur={this.onBlur} onKeyDown={this._handleKeyDown} type="number" label="Background level" >
                                    <Button type='icon' onClick={this.insertBlackLvl_As_BackgroundLvl} title="Insert Black Level as Background Level" text={<BlackLevelIcon width="18" />} />
                                </Input>
                            </Animation>
                            <Input onChange={this.onChangeHandler} onBlur={this.onBlur} onKeyDown={this._handleKeyDown} name='p' value={p} type="number" min={k} label="Peak level" >
                                <Button type='icon' onClick={this.insertWhiteLvl_As_PeakLvl} title="Insert White Level as Peak Level" text={<WhiteLevelIcon width="18" />} />
                            </Input>
                            <Animation type={`ltr ${animate(asinh)}`}>
                                <Input onChange={this.onChangeHandler} name='S' value={S} type="number" label="Scaled peak level" onBlur={this.onBlur} onKeyDown={this._handleKeyDown} />
                            </Animation>

                            <Animation type={`rtl ${animate(pow)}`}>
                                <Input onChange={this.onChangeHandler} name='e' value={e} type="number" label="Exponent" max='10' onBlur={this.onBlur} onKeyDown={this._handleKeyDown} />
                            </Animation>

                            <div style={{ textAlign: 'center', marginTop: 5, display: '', justifyContent: "space-evenly" }}>
                                <Button text="Apply to Image" type={"basic primary " + (this.state.autoApply ? 'disabled' : '')} disabled={this.props.disabled} onClick={() => this.props.applyChanges()} style={{ marginBottom: 5 }} />

                                <div className="ui  checkbox" style={{ position: '', bottom: 0, right: 0, verticalAlign: 'middle', marginLeft: 7 }} title='Auto Apply'>
                                    <input type="checkbox" id="autoApply" name="autoApply" onChange={e => this.setState({ [e.target.name]: e.target.checked })} checked={this.state.autoApply} />
                                    <label htmlFor="autoApply" style={{ fontWeight: 600, fontSize: 12, width: 56 }}>Auto Apply</label>
                                </div>

                            </div>

                        </React.Fragment>
                    }
                </div>
            </Card>

        )
    }
}

const mapStateToProps = state => {
    return {
        parameters: state.parameters,
        disabled: !state.filePath,
        whiteLvlPicker: state.whiteLvlPicker,
        blackLvlPicker: state.blackLvlPicker,

    }
}

export default connect(mapStateToProps)(Scaling)