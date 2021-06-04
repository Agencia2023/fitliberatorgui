import { transformNumber } from "./general";

/**
   * clone
   * @param {string} selector 
   * @returns {node}
   */
function clone(selector) {
    var node = d3.select(selector).node();
    return d3.select(node.parentNode.insertBefore(node.cloneNode(true), node.nextSibling));
}

function addMinMaxLabel(chart, { min, max }) {

}

/**
 * class Histogram
 * define histogram using DC.js, crossfilter and D3.js
 */
class HistogramChart {

    constructor(customProps) {

        const defaultProps = { id: 'hs', data: [], width: 300, height: 100, margins: { left: 20, top: 15, right: 20, bottom: 5 } }

        const props = { ...defaultProps, ...customProps }

        const { id, data, width, height, margins } = props

        this.id = id
        this.chart = dc.barChart(this.id)
        this.data = data

        this.margins = margins

        const ndx = crossfilter(data)

        this.dimension = ndx.dimension(d => parseFloat(d.x))
        this.group = this.dimension.group().reduceSum(d => parseFloat(d.y));
        this.min = parseFloat(this.dimension.bottom(1)[0].x);
        this.max = parseFloat(this.dimension.top(1)[0].x)

        this.width = width
        this.height = height

        this.currentLines = []

    }

    setStatistics = s => this.statistics = s

    setWidth = w => {
        this.width = w
        this.chart.width(w); return this
    }
    setHeight = h => {
        this.height = h
        this.chart.height(h); return this
    }
    /**
    * set DataSource for histogram
    * @param {Array<{x: string|Number,y:Number}>} data datasource
    * @return {HistogramChart}
    */
    setData = (data, lines) => {
        this.data = data
        this.currentLines = lines
        /**
         * Crossfilter is a JavaScript library for exploring large multivariate datasets in the browser.
         */
        const ndx = crossfilter(data)
        this.dimension = ndx.dimension(d => d.x)
        this.group = this.dimension.group().reduceSum(d => parseFloat(d.y).toFixed(0));
        this.min = (this.dimension.bottom(1)[0].x)
        this.max = (this.dimension.top(1)[0].x)
        this.minY = (this.dimension.bottom(1)[0].y)
        this.maxY = (this.dimension.top(1)[0].y)

        return this

    }

    getChart() {
        return this.chart
    }
    render() {
        const x = d3.scaleLinear().domain([this.min, this.max]).range([0, this.width])
        this.chart
            .width(this.width)
            .height(this.height)
            .margins(this.margins)
            .dimension(this.dimension)
            .group(this.group)
            .x(x)
            .xUnits(dc.units.fp.precision(0.5))
            // .colors(["darkblue"])            
            //.brushOn(true)
            .elasticY(true)



        this.chart.filterHandler((dimension, filters) => {
            if (filters.length === 0) {

                this.chart.replaceFilter([this.min, this.max])
                dc.renderAll()
                return
            }

            /*
            if (filters.length === 0) {
                // the empty case (no filtering)
                dimension.filter(null);
            } else if (filters.length === 1 && !filters[0].isFiltered) {
                // single value and not a function-based filter
                dimension.filterExact(filters[0]);
            } else if (filters.length === 1 && filters[0].filterType === 'RangedFilter') {
                // single range-based filter
                dimension.filterRange(filters[0]);
            } else {
                // an array of values, or an array of filter objects
                dimension.filterFunction(function (d) {
                    for (var i = 0; i < filters.length; i++) {
                        var filter = filters[i];
                        if (filter.isFiltered && filter.isFiltered(d)) {
                            return true;
                        } else if (filter <= d && filter >= d) {
                            return true;
                        }
                    }
                    return false;
                });
            }
            return filters;
            */
        });
        this.chart.on('pretransition', chart => {
            /**
             * lines
             */
            if (this.data.length > 1) {

                this.currentLines.forEach(({ color, val }) => this.addLine(chart, val, color))
            }


            /**
             *  linear gradient [SVG]
             */
            const linearGradient = d3.select('svg > defs  linearGradient')
            if (linearGradient.empty()) {
                const mainGradient = d3.select('svg > defs').append('linearGradient')
                    .attr('id', 'ramp')

                // Create the stops of the main gradient. Each stop will be assigned a style
                mainGradient.append('stop')
                    .attr('style', 'stop-color:#000')
                    .attr('offset', '30%');

                mainGradient.append('stop')
                    .attr('style', 'stop-color:#fff')
                    .attr('offset', '60%')
                mainGradient.append('stop')
                    .attr('style', 'stop-color:#fff')
                    .attr('offset', '100%')

            }

            /**
             * Add a little gradient ramp at the top of the selector 
             */
            if (d3.selectAll("#histogram svg .selection").size() == 1)
                clone("#histogram svg .selection")

            // when the gradient is created we add it to the selection class
            d3.selectAll("svg .selection")
                .attr("fill", "url(#ramp)")

            /**
             * Text min - max
             */
            if (this.statistics) {
                const { min, max } = this.statistics

                let brushBegin = [], brushEnd = [];
                if (chart.filter()) {
                    brushBegin = [this.min];
                    brushEnd = [this.max];
                    // brushBegin = [chart.filter()[0]];
                    // brushEnd = [chart.filter()[1]];
                }
                let beginLabel = chart.select('g.brush')
                    .selectAll('text.brush-begin')
                    .data(brushBegin);
                beginLabel.exit().remove();
                beginLabel = beginLabel.enter()
                    .append('text')
                    .attr('class', 'brush-begin')
                    .attr('text-anchor', 'begin')
                    .attr('dominant-baseline', 'text-top')
                    .attr('fill', 'grey')
                    .attr('font-size', '12px')
                    .attr('y', -8)
                    // .attr('y', chart.margins().top -15 )
                    .attr('dy', 4)
                    .merge(beginLabel);
                beginLabel
                    .attr('x', 0)
                    // .attr('x', d => chart.x()(d) + 38)
                    .text(parseFloat(min).toPrecision(5));


                let endLabel = chart.select('g.brush')
                    .selectAll('text.brush-end')
                    .data(brushEnd);
                endLabel.exit().remove();
                endLabel = endLabel.enter()
                    .append('text')
                    .attr('class', 'brush-end')
                    .attr('text-anchor', 'start')
                    .attr('dominant-baseline', 'text-top')
                    .attr('direction', 'rtl')
                    .attr('fill', 'grey')
                    .attr('font-size', '12px')
                    // .attr('y', chart.margins().top - 15 )
                    .attr('y', -8)
                    .attr('dy', 4)
                    .merge(endLabel);
                endLabel
                    .attr('x', d => chart.x()(d))
                    .attr("viewBox", "0 0 200 400")
                    .text(parseFloat(max).toPrecision(5));

            }

        }); // end pretransition event    



        this.chart
            .yAxis().ticks(0)
        this.chart
            .xAxis().tickFormat(d3.format('.3s'))




        return this

    }
    createLines = currentLines => currentLines.forEach(({ color, val }) => this.addLine(this.chart, val, color))

    addLine(chart, position, color) {
        const x_vert = position
        let extra_data = [
            { x: chart.x()(x_vert), y: this.margins.top + 10 },
            { x: chart.x()(x_vert), y: chart.effectiveHeight() + 15 }
        ];
        let line = d3.line()
            .x((d) => { return d.x + this.margins.left; })
            .y(function (d) { return d.y; })
            .curve(d3.curveLinear);
        let chartBody = chart.select('g');
        let path = chartBody.selectAll('path.extra').data([extra_data]);

        const idElement = 'line-' + color

        if (chart.select(`path#${idElement}`).size() !== 1) {

            path = path.enter()
                .append('path')
                .attr('class', 'oeExtra')
                .attr('stroke', color)
                .attr('id', idElement)
                .attr("stroke-width", 1)
                // .style("stroke-dasharray", ("10,3"))
                .merge(path);
        }

        path.attr('d', line);
    }
    newFilterRange = (min, max, w) => {
        this.chart.x(d3.scaleLinear().domain([min, max]).range([0, w]))
        this.chart.replaceFilter([min, max]).redrawGroup()
        return this
    }
    onchangeFilter = (filterCallback) => {
        this.chart.filterPrinter(filters => {

            const filter = filters[0];
            const min = transformNumber(filter[0])
            const max = transformNumber(filter[1])

            filterCallback(min, max)
        })

        return this
    }
    redraw = () => {

        dc.redrawAll();
    }


    filter = filter => {
        this.chart.filter(filter)
        this.redraw()
        return this
    }

}


export default HistogramChart