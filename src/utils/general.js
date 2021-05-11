const val = v => v.toString().length > 5 ? Number(v).toPrecision(3) : v

export const getTileName = ({ level, x, y }) => `${level}_${x}_${y}`

export const clearParams = imageSelected => {
    /**
     * empty image | not parameters
     */
    const parameters = imageSelected?.parameters
    if (!parameters)
        return

    const { s, k, p, e, S } = parameters

    /**
     *  original image 
     */
    if (!s)
        return 'Original Image'

    const common = `background = ${val(k)}, peak = ${val(p)}`

    let res = ''
    if (s === 'linear')
        res = `Linear(${common})`
    else if (s === 'pow')
        res = `Power(${common}, exponent =${val(e)}`
    else
        res = `Asinh(${common}, scaled peak = ${val(S)})`

    return res
}

// export const transformNumber = a => a + ''.length > 8 ? parseFloat(a).toExponential(4) : parseFloat(a).toPrecision(4)
export const transformNumber = a => parseFloat(a).toPrecision(6)
export const dotNumber = x => x.toString().replace(/,/g, '.')
export const commaNumber = x => x.toString().replace(/\./g, ',')