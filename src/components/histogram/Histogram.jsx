import React from 'react'
import './histogram.scss'
import HistogramChart from '../../utils/Histogram'
import BlackWhiteLevel from '../BlackWhiteLevel'
import initialGuess from '../../utils/initial_guess'
import { singleScale } from '../../utils/scaledFunctions'
import { transformNumber } from '../../utils/general'



const generateLines = ({ mean, max, min, peakLevel, backgroundLevel }, props) => {

	const w = max - min

	const { old_parameters, imageSelected } = props

	if (!imageSelected.original) {
		peakLevel = singleScale(peakLevel, old_parameters[1])
		backgroundLevel = singleScale(backgroundLevel, old_parameters[1])

	}

	return [
		{ color: 'blue', val: ((mean - min) / w) * 1000 },
		{ color: 'pink', val: ((peakLevel - min) / w) * 1000 },
		{ color: 'green', val: ((backgroundLevel - min) / w) * 1000 },
		{ color: 'red', val: min < 0 ? 0 : min },
	]
}

const hs = {
	scaleValue: ({ sizeHS = 0, statistics, currentBlackLevel, currentWhiteLevel }) => {

		const { min, max } = statistics

		const k = (max - min) / sizeHS
		const b = parseFloat(min + k * currentBlackLevel)
		const w = parseFloat(min + k * currentWhiteLevel)
		return { w, b }
	}
}

class Histogram extends React.PureComponent {
	constructor(props) {
		super(props)
		this.parentRef = React.createRef()
		this.hs2
		this.hs

		this.safeToApply = true
		this.drawTimer = null

	}
	componentDidMount() {

		const data = this.props.histogramData || [0]

		const bl = document.querySelector('#blacklvl')
		const wl = document.querySelector('#whitelvl')

		const dat = data.map((z, index) => ({ x: index, y: parseFloat(z) }))

		const { height, width } = this.getResponsiveSize()

		let isOnchangeActive = false

		this.hs2 = new HistogramChart({
			id: '#histogram',
			height,
			width,
			data: dat
		})
			.render()
			.onchangeFilter((currentBlackLevel, currentWhiteLevel) => {

				/**
				 * scale Histogram  values 
				 */
				return new Promise(resolve => {

					const { imageSelectedData, histogramData, onChange } = this.props

					if (imageSelectedData.statistics) {

						const sizeHS = histogramData.length
						const { statistics } = imageSelectedData

						const { b, w } = hs.scaleValue({ sizeHS, statistics, currentBlackLevel, currentWhiteLevel })

						onChange({ w, b })

						if (!isOnchangeActive) {

							bl.value = transformNumber(b)
							wl.value = transformNumber(w)
						}

						if (this.safeToApply)
							this.props.applyFilterOSD()

						isOnchangeActive = false

						resolve()
					}
				}).then(x => x)

			})


		/**
		 * mouse release 
		 */
		document.getElementById('histogram').addEventListener('mousedown', this.handleMouseDown, true)

		if (dat.length > 1) {

			let f = this.calcLevel(dat.length)
			setTimeout(() => {
				this.hs2
					.getChart()
					.replaceFilter([f.bl, f.wl])
					.redrawGroup()

			}, 100)

		}
		/**
		 * onCahnge Black Level
		 */
		bl.addEventListener('change', () => {
			isOnchangeActive = true

			const wlvl = parseFloat(wl.value)
			const blvl = parseFloat(bl.value)

			if (blvl >= wlvl)
				bl.value = transformNumber(wlvl + (wlvl - blvl) / 1e3)


			const { min } = this.props.imageSelectedData?.statistics


			if (bl.value < min)
				bl.value = transformNumber(min)

			const { newBl, newWl } = this.getFilterValues(bl.value, wl.value)

			this.hs2
				.getChart()
				.replaceFilter([newBl, newWl])
				.redrawGroup()


		})
		/**
		 * onCahnge White Level
		 */
		wl.addEventListener('change', () => {

			isOnchangeActive = true

			const wlvl = parseFloat(wl.value)
			const blvl = parseFloat(bl.value)

			if (wlvl <= blvl) {
				console.log(bl.value)
				wl.value = transformNumber(blvl + (blvl - wlvl) / 1e3)

				console.log(bl.value)

			}


			const { max } = this.props.imageSelectedData?.statistics

			if (wl.value > max)
				wl.value = transformNumber(max)

			const { newBl, newWl } = this.getFilterValues(bl.value, wl.value)

			this.hs2
				.getChart()
				.replaceFilter([newBl, newWl])
				.redrawGroup()


		})

		dc.renderAll()

		/**
		 * responsive design Histogram
		 */
		window.addEventListener('resize', this.handleResize)
	}
	handleMouseDown = e => {
		this.safeToApply = false
		window.addEventListener('mouseup', this.handleMouseUp, true)
	}
	handleMouseUp = (e) => {
		console.log('handleMouseUp - remove Listeners')
		this.safeToApply = true

		console.log(this.safeToApply)
		window.removeEventListener('mouseup', this.handleMouseUp, true);
	}
	componentWillUnmount() {
		window.removeEventListener('resize', this.handleResize)
		document.getElementById('histogram').removeEventListener('mousedown', this.handleMouseDown)
		document.getElementById('histogram').removeEventListener('mouseup', this.handleMouseUp)

		clearTimeout(this.drawTimer)
	}
	getFilterValues = (bl, wl) => {
		const { statistics: s } = this.props.imageSelectedData
		if (s) {
			const max = parseFloat(s.max)
			const min = parseFloat(s.min)

			const sizeHS = this.props.histogramData.length
			/**
			 * real value for HS filter
			 */
			const k = (max - min) / sizeHS

			const newBl = (bl - min) / k
			const newWl = (wl - min) / k

			return { newBl, newWl }
		}

		return { newBl: 0, newWl: 0 }
	}
	getResponsiveSize = () => {
		const { offsetHeight, offsetWidth } = this.parentRef.current;

		// INPUT_HEIGHT -> 32
		// MINI_CHART   -> 52
		// const h = offsetHeight - 52 - 32
		const height = offsetHeight - 32 - 2
		const width = offsetWidth

		return { width, height }
	}
	handleResize = () => {

		const { height, width } = this.getResponsiveSize()

		// ignore fullScreen
		if (height <= 0)
			return


		this.hs2
			.setWidth(width)
			.setHeight(height)
		// this.hs
		// 	.setWidth(w)

		dc.renderAll();

	}

	calcLevel = sizeHS => {

		const { new_parameters, old_parameters, imageSelectedData: { statistics }, imageSelected: { original } } = this.props

		return initialGuess(
			statistics,
			original,
			new_parameters,
			old_parameters?.[0],
			this.props.histogramData
		)

	}

	componentDidUpdate(prevProps, prevState) {

		const { shouldComponentUpdateHash, histogramData, imageSelectedData: { statistics }, onChange } = prevProps

		if (!this.props.histogramData) {
			// this.forceUpdate()
			this.componentDidMount()
		}

		if (this.props.shouldComponentUpdateHash === shouldComponentUpdateHash || !this.props.histogramData)
			return

		const data = histogramData.map((z, index) => ({ x: index, y: parseFloat(z) }))

		let { wl, bl } = this.calcLevel(data.length)

		let peakLevel = this.props.new_parameters.p

		if (this.props.imageSelected?.original && !this.props.freezeSettings) {
			const { w } = hs.scaleValue({ sizeHS: data.length, statistics, currentBlackLevel: bl, currentWhiteLevel: wl })
			peakLevel = w
			onChange({ p: transformNumber(w) })
		}

		this.hs2.setStatistics(this.props.imageSelectedData?.statistics)
		this.hs2.setData(data,
			generateLines(
				{
					...statistics,
					backgroundLevel: this.props.new_parameters.k,
					peakLevel
				},
				this.props
			),

		)
			.render()
		// update the last size
		const { height, width } = this.getResponsiveSize()
		this.hs2
			.setWidth(width)
			.setHeight(height)

		// this.hs.setWidth(w)

		this.hs2.getChart().replaceFilter([0, 0])
		if (this.props.freezeSettings && this.props.isFirstOpen) {

			const { w, b } = this.props.new_parameters

			let { newBl, newWl } = this.getFilterValues(b, w)
			this.hs2.getChart().replaceFilter([newBl, newWl])
		} else
			this.hs2.getChart().replaceFilter([bl, wl])
		// .redrawGroup()

		this.drawTimer = setTimeout(() => dc.renderAll(), 100)

	}

	render() {

		return (
			<div className="histogram" ref={this.parentRef} >
				<BlackWhiteLevel />
				<div id="histogram" />
			</div>
		)

	}
}

export default Histogram
