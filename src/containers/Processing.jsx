import React from 'react'
/** 
 * 🔨 Redux
 * Action creators
 */
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { setParameters, closeLoading, applyChanges, changeImage, updateWhiteLvlPicker, updateBlackLvlPicker, openFileEventEmitter, setOriginalRawImage } from '../models/actions/fileActions'
import { applyFilterOSD, createViewer, OSD_ID } from '../models/actions/viewerActions'

import Histogram from '../components/histogram/Histogram'
import Card from '../components/card/Card'
import Scaling from '../components/scaling/Scaling'
import { CardLoader } from '../components/loader/Loading'
import CurrentPointDataTable from '../components/CurrentPointDataTable';
import ImageStatistics from '../components/ImageStatistics';
import Select from '../components/Select'
import Preview from '../components/Preview'
import ErrorBoundary from '../components/error/ErrorBoundary'
import ImageHeadersModal from '../components/modal/ImageHeadersModal'
import OSDMenu from '../components/osdMenu/OSDMenu'

import { descale, getRawPixelXY, getRealValue } from '../utils/filter'
import About from '../components/modal/about/About'
import OptionsModal from '../components/modal/options/OptionsModal'
import KeyboardShortcuts from '../components/KeyboardShortcuts'

const space = 32
class Processing extends React.Component {

    state = {
        showCurrentPointData: true,
        showStats: true,
        cPointData: {
            x: 0,
            y: 705,
            value: 0,
            processed: 0.0,
        }
    }
    spaceKeyPress = false

    _handleKeyDown = ({ keyCode }) => {

        this.spaceKeyPress = keyCode === space
    }

    componentDidMount() {



        const { actions } = this.props
        /**
         * create GLOBAL viewer
         */
        const viewer = actions.createViewer()
        /**
         *  openFile EventEmitter
         */
        actions.openFileEventEmitter()

        viewer.addHandler('canvas-key-down', e => {

        })
        /**
         * Background Level Sampler OSD Tool
         * Peak Level Sampler OSD Tool
         */
        viewer.addHandler('canvas-click', e => {


            const { whiteLvlPicker, blackLvlPicker, spaceGrab } = this.props

            if (whiteLvlPicker || blackLvlPicker && !spaceGrab) {
                //OSD clickToZoom                                 
                // viewer.gestureSettingsMouse.clickToZoom = false


                const updatePicker = whiteLvlPicker ? actions.updateWhiteLvlPicker : actions.updateBlackLvlPicker
                const param = whiteLvlPicker ? 'w' : 'b'
                const fieldId = whiteLvlPicker ? 'whitelvl' : 'blacklvl'

                const viewportPoint = viewer.viewport.pointFromPixel(e.position);
                const imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint);

                const { value } = this.internalDescale(imagePoint)
                // const value = this.pixel(getRealValue(viewer, e))

                actions.setParameters({ [param]: value })
                // updatePicker(false)

                document.getElementById(fieldId).value = value
                document.getElementById(fieldId).dispatchEvent(new Event("change"))
                // actions.applyFilterOSD()
                // document.getElementById('whitelvl').value = w
                /**
                 * Restore normal OSD functionality
                 */
                // document.getElementById(OSD_ID).classList.remove('osd-picker-active')
                // return setImmediate(() => viewer.gestureSettingsMouse.clickToZoom = true)



            }

        });

        /**
         * event move handle
         */
        viewer.addHandler('canvas-press', e => {
            document.getElementById(OSD_ID).classList.add('osd-picker-moving')
        })
        viewer.addHandler('canvas-release', e => {
            document.getElementById(OSD_ID).classList.remove('osd-picker-moving')
        })

        let tracker
        viewer.addHandler('tile-loaded', async ({ tileRequest, tile }) => {

            /**
             * PNG buffer 
             */
            const buffer = tileRequest.response;

            actions.setOriginalRawImage(buffer)
            actions.applyFilterOSD()

            // const name = getTileName(tile)
            // window.pngCache[name] = rawDecode(buffer, this.props.imageSelectedData.undefined)

            // close loading 
            actions.closeLoading()
            // viewer.viewport.goHome(true)
            /**
             * Current Point Data
             * X, Y, Value
             */
            tracker = new OpenSeadragon.MouseTracker({
                element: viewer.container,
                moveHandler: e => {
                    const viewportPoint = viewer.viewport.pointFromPixel(e.position);
                    const imagePoint = viewer.viewport.viewportToImageCoordinates(viewportPoint)

                    if (!viewer.world.getItemAt(0))
                        tracker.setTracking(false);

                    const { value, x, y } = this.internalDescale(imagePoint)

                    const cPointX = document.getElementById('cPoint-x')
                    const cPointY = document.getElementById('cPoint-y')
                    const cPointValue = document.getElementById('cPoint-value')
                    if (cPointX?.textContent)
                        cPointX.textContent = `${x}px`
                    if (cPointY?.textContent)
                        cPointY.textContent = `${y}px`
                    if (cPointValue?.textContent)
                        cPointValue.textContent = value
                    // cPointValue.textContent = this.pixel(viewer, e)
                }
            });

            //     tracker.setTracking(true);
            // viewer.addHandler('animation', updateZoom);
        })

        /**
         * clear buffer
         */
        viewer.addHandler("tile-unloaded", ({ tile }) => tracker.setTracking(false))

    }

    pixel = (viewer, e) => {

        const realValue = getRealValue(viewer, e, raw)

        const { statistics: { min, max }, raw } = this.props.imageSelectedData


        return descale(realValue, min, max).toFixed(2)

    }
    /**
     * 
     * @param {Object} obj - An object.
     * @param {Number} obj.x - X coord.
     * @param {Number} obj.y - Y coord.
     * @return {Object} obj      
     */
    // internalDescale = (realValue) => {
    internalDescale = ({ x, y }) => {
        // const { raw, statistics: { min, max } } = this.props.imageSelectedData
        let { statistics: { min, max }, raw } = this.props.imageSelectedData
        const { original_width, width, original_height, height } = this.props.imageSize

        x = x < 0 ? 0 : x > width ? width : Math.round(x)
        y = y < 0 ? 0 : y > height ? height : Math.round(y)

        const realX = x * original_width / width
        const realY = y * original_height / height

        return {
            x: realX.toFixed(0),
            y: realY.toFixed(0),
            value: descale(getRawPixelXY(raw, width, x, y), min, max).toFixed(1)
        }
    }

    onChangeBW = d => this.props.actions.setParameters(d)
    onChange = e => this.props.actions.setParameters({ [e.target.name]: e.target.value })
    arrowUpFN = () => {
        const I = this.props.images.findIndex(image => this.props.imageSelected.value === image.value)

        if (I === this.props.images.length - 1)
            return

        const nextImage = this.props.images[I + 1]
        this.props.actions.changeImage(nextImage)

    }
    arrowDownFN = () => {
        const I = this.props.images.findIndex(image => this.props.imageSelected.value === image.value)
        if (I === 0)
            return

        const nextImage = this.props.images[I - 1]
        this.props.actions.changeImage(nextImage)
    }
    render() {
        const { showStats, showCurrentPointData, cPointData } = this.state

        const { s, k, p, S, e } = this.props.parameters
        const { actions, shouldComponentUpdateHash } = this.props


        return (
            <main>
                <KeyboardShortcuts arrowUpFN={this.arrowUpFN} arrowDownFN={this.arrowDownFN} />
                <ErrorBoundary>
                    <OSDMenu />
                </ErrorBoundary>
                <div className="op-preview">
                    <div className="view-hs" >
                        <ErrorBoundary>
                            <Preview />
                        </ErrorBoundary>
                        <ErrorBoundary>
                            <Histogram
                                isFirstOpen={this.props.isFirstOpen}
                                freezeSettings={this.props.freezeSettings}
                                old_parameters={this.props.oldData}
                                new_parameters={this.props.parameters}
                                shouldComponentUpdateHash={shouldComponentUpdateHash}
                                applyFilterOSD={actions.applyFilterOSD}
                                onChange={this.onChangeBW}
                                histogramData={this.props.histogram}
                                imageSelectedData={this.props.imageSelectedData}
                                imageSelected={this.props.imageSelected}

                            />
                        </ErrorBoundary>
                    </div>
                    <div className="op-data">

                        <Card title="Current Point Data " isToggle icon="align justify" up show={showCurrentPointData} onClick={() => this.setState({ showCurrentPointData: !showCurrentPointData })}>
                            {this.props.loading ? <CardLoader /> : <div>
                                <Select
                                    placeholder="Select Fits"
                                    name="image"
                                    value={this.props.imageSelected}
                                    onChange={imageSelected => {

                                        if (this.props.imageSelected.value === imageSelected.value)
                                            return

                                        actions.changeImage(imageSelected)
                                    }}
                                    options={this.props.images}
                                />
                                <ErrorBoundary>
                                    <CurrentPointDataTable  {...cPointData} imageSize={this.props.imageSize} />
                                </ErrorBoundary>
                            </div>}
                        </Card>
                        <ErrorBoundary>
                            <ImageStatistics
                                loading={this.props.loading}
                                data={this.props.imageSelectedData.statistics}
                                showStats={showStats}
                                onClick={() => this.setState({ showStats: !showStats })}
                            /></ErrorBoundary>
                        <ErrorBoundary>
                            <Scaling
                                old_parameters={this.props.oldData}
                                new_parameters={this.props.parameters}
                                imageSelected={this.props.imageSelected}

                                loading={this.props.loading}
                                updateParameters={actions.setParameters}
                                {...{ s, k, p, S, e }}
                                applyChanges={actions.applyChanges}
                            />
                        </ErrorBoundary>
                    </div>
                </div>
                {
                    /**
                     * Modals
                     */
                }
                <ImageHeadersModal openModal={this.props.openModal} />
                <About openModal={this.props.aboutModal} closeModal={this.props.closeModal} />
                <OptionsModal openModal={this.props.optionsModal.state} closeModal={this.props.optionsModal.closeModal} />
            </main >
        );
    }
}
const mapStateToProps = state => {
    return {
        loading: state.loading,
        parameters: state.parameters,
        images: state.images,
        imageSelected: state.imageSelected,
        histogram: state.histogram,
        imageSelectedData: state.imageSelectedData,
        imageSize: state.size,
        whiteLvlPicker: state.whiteLvlPicker,
        blackLvlPicker: state.blackLvlPicker,
        shouldComponentUpdateHash: state.shouldComponentUpdateHash,
        oldData: state.oldData,
        freezeSettings: state.freezeSettings,
        spaceGrab: state.spaceGrab,
        isFirstOpen: state.isFirstOpen,
        // show_menu_options: state.show_menu_options,
    }
}
const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                //fileActions
                setParameters, closeLoading, applyChanges, changeImage, updateWhiteLvlPicker, updateBlackLvlPicker, openFileEventEmitter, setOriginalRawImage,
                //viewerActions
                applyFilterOSD, createViewer
            }, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Processing)
