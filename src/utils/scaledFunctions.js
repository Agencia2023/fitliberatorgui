

function isEqual(new_params, old_params) {
    return new_params.s === old_params.s &&
        new_params.k === old_params.k &&
        new_params.S === old_params.S &&
        new_params.p === old_params.p
    
}
export const saveScale = (new_params, old_params, imageSelected) => {


    if (isEqual(new_params, imageSelected.parameters)) {

        const { w, b } = new_params
        return { newWhitelvl: w, newBlacklvl: b }
    }

    if (imageSelected?.original || old_params?.original) {

        return scale(new_params)
    } else {

        return descaleAndScale(new_params, old_params)
    }
}

/**
 * 
 * @param {*} new_params 
 * @param {*} old_params 
 * k background level
 * p peak level
 * S scaled peak level
 */
export const descaleAndScale = (new_params, old_params) => {

    const { w, b } = new_params

    let wl, bl

    if (old_params.s === 'pow') {

        wl = descale_pow(w, old_params.k, old_params.p, old_params.e)
        bl = descale_pow(b, old_params.k, old_params.p, old_params.e)

    } else if (old_params.s === 'asinh') {
        wl = descale_asinh(w, old_params.k, old_params.p, old_params.S)
        bl = descale_asinh(b, old_params.k, old_params.p, old_params.S)
    } else {
        wl = descale_linear(w, old_params.p)
        bl = descale_linear(b, old_params.p)

    }



    return scale({ ...new_params, w: wl, b: bl })

}
export const pureDescale = (new_params, old_params) => {

    const { w, b } = new_params

    let wl, bl

    if (old_params.s === 'pow') {

        wl = descale_pow(w, old_params.k, old_params.p, old_params.e)
        bl = descale_pow(b, old_params.k, old_params.p, old_params.e)

    } else if (old_params.s === 'asinh') {
        wl = descale_asinh(w, old_params.k, old_params.p, old_params.S)
        bl = descale_asinh(b, old_params.k, old_params.p, old_params.S)
    } else {
        wl = descale_linear(w, old_params.p)
        bl = descale_linear(b, old_params.p)

    }

    return { newWhitelvl: wl, newBlacklvl: bl }

}
export const singleDescale = (value, old_params) => {

    if (old_params.s === 'pow') {

        value = descale_pow(value, old_params.k, old_params.p, old_params.e)


    } else if (old_params.s === 'asinh') {
        value = descale_asinh(value, old_params.k, old_params.p, old_params.S)
    } else {
        
        value = descale_linear(value, old_params.p)

    }

    return value

}
export const singleScale = (value, { s, k, p, e, S, w, b }) => {

    if (s === 'pow') {
        value = scale_pow(value, k, p, e)
    } else if (s === 'asinh') {

        value = scale_asinh(value, k, p, S)

    }
    else {
        value = scale_linear(value, p)
    }
    return value
}
export const scale = ({ s, k, p, e, S, w, b }) => {

    let wl, bl

    if (s === 'pow') {
        wl = scale_pow(w, k, p, e)
        bl = scale_pow(b, k, p, e)
    } else if (s === 'asinh') {

        wl = scale_asinh(w, k, p, S)
        bl = scale_asinh(b, k, p, S)
    }
    else {
        wl = scale_linear(w, p)
        bl = scale_linear(b, p)
    }


    return { newWhitelvl: wl, newBlacklvl: bl }
}

export const scale_pow = (value, bglevel, peaklevel, exp) => {
    const factor = peaklevel / (peaklevel - bglevel);
    const a = -1 * factor * bglevel;
    value = value * factor + a;
    const retvalue = Math.sign(value) * Math.pow(Math.abs(value), exp);
    return retvalue;
}

export function descale_pow(value, bglevel, peaklevel, exp) {
    let factor = peaklevel / (peaklevel - bglevel);
    let retvalue = Math.sign(value) * Math.pow(Math.abs(value), 1 / exp);
    let a = -1 * factor * bglevel;
    retvalue = (retvalue - a) / factor;
    return retvalue;
}
export function scale_asinh(value, bglevel, peaklevel, scaled) {
    let factor = scaled / (peaklevel - bglevel);
    let a = -1 * factor * bglevel;
    value = value * factor + a;
    let retvalue = Math.log(value + Math.sqrt(1 + value * value));
    return retvalue;
}
export function descale_asinh(value, bglevel, peaklevel, scaled) {
    let factor = scaled / (peaklevel - bglevel);
    let a = -1 * factor * bglevel;
    let temp = Math.exp(value);
    let retvalue = (temp * temp - 1) / (2 * temp);
    retvalue = (retvalue - a) / factor;
    return retvalue;
}
export function scale_linear(value, peaklevel) {
    let retvalue = value / peaklevel;
    return retvalue;
}
function descale_linear(value, peaklevel) {
    let retvalue = value * peaklevel;
    return retvalue;
}