// import WebWorker from "react-webworker"

import { getTileName } from './general'
function scale(value, blacklevel, whitelevel) {
    const f = 0xFFFF / (whitelevel - blacklevel);
    const a = -blacklevel * f
    return f * value + a;
}


/**
 * @param {Object} mark_pixels  {black_clip, white_clip}
 * @param {Number} mark_pixels.black_clip  black clip
 * @param {Number} mark_pixels.white_clip  white clip
 * @param {Number} min  Image Statistics
 * @param {Number} max  Image Statistics 
 * @param {Number} bl  black level
 * @param {Number} wl  white level
 * @param {Array} imgrawdata  raw of Image
 * 
 */



// const functionWorker = data => {
//     return new Promise((resolve, reject) => {
//         let myWorker = new Worker('./filterWorker.js', { type: 'module' });

//         myWorker.postMessage(data)


//         myWorker.onmessage = e => {

//             resolve(e.data)
//         };
//         myWorker.onerror = reject
//     })

// }
// functionWorker({
//     mark_pixels, min, max, bl, wl, imgrawdata, imgData: cimgData
// }).then(imgData => {

//     context.putImageData(imgData, 0, 0)
//     callback()

// })
export default (mark_pixels, min, max, bl, wl, imgrawdata) =>
    /**
    * @param {Object} context OSD object
    * @param {Object} context.canvas OSD canvas
    * @param {Function} callback function to end process
     */
    (context, callback) => {

        /**
         * imgRaw
         */
        if (!imgrawdata)
            return callback()

        const imgData = context.getImageData(0, 0, context.canvas.width, context.canvas.height)

        let blacklevel = parseFloat(bl)
        let whitelevel = parseFloat(wl)
        const factor = 0xFFFF / (max - min)
        blacklevel = (blacklevel - min) * factor
        whitelevel = (whitelevel - min) * factor

        let { data: pixels } = imgData
        for (var i = 0; i < pixels.length; i += 4) {

            if (pixels[i + 3] != 0) {
                const original = imgrawdata[i / 4];
                const computed = scale(original, blacklevel, whitelevel);
                const rgb = Math.round((computed / 0xFFFF) * 255);

                if (original < blacklevel && mark_pixels.black_clip) // if mark black clipped
                {
                    pixels[i] = 0;
                    pixels[i + 1] = 0;
                    pixels[i + 2] = 255;
                    pixels[i + 3] = 255;
                }
                else if (original > whitelevel && mark_pixels.white_clip) //if  mark white clipped 
                {
                    pixels[i] = 0;
                    pixels[i + 1] = 255;
                    pixels[i + 2] = 0;
                    pixels[i + 3] = 255;
                }
                else {
                    pixels[i] = rgb;
                    pixels[i + 1] = rgb;
                    pixels[i + 2] = rgb;
                    pixels[i + 3] = 255;
                }

            }
            else if (mark_pixels.undefined) {
                pixels[i] = 255;
                pixels[i + 1] = 0;
                pixels[i + 2] = 0;
                pixels[i + 3] = 255;

            }

            // i += 4
        }
        context.putImageData(imgData, 0, 0)
        return callback()
    }


function getRawPixel(imgData, index) {
    return imgData[index];
}
export function getRawPixelXY(imgData, w, x, y) {
    return getRawPixel(imgData, y * w + x);
}
function setRawPixel(imgData, index, value) {
    imgData[index] = value;
}
function setRawPixelXY(imgData, w, x, y, value) {
    setRawPixel(imgData, y * w + x, value);
}

function getPixel(imgData, index) {
    let i = index * 4, d = imgData.data;
    return [d[i], d[i + 1], d[i + 2], d[i + 3]] // [R,G,B,A]
}

function getPixelXY(imgData, x, y) {
    return getPixel(imgData, y * imgData.width + x);
}

function setPixel(imgData, index, r, g, b, a) {
    let i = index * 4, d = imgData.data;
    d[i] = r;
    d[i + 1] = g;
    d[i + 2] = b;
    d[i + 3] = a;
}
function setPixelXY(imgData, x, y, r, g, b, a) {
    return setPixel(imgData, y * imgData.width + x, r, g, b, a);
}

/**
 * get real pixel
 * @param {*} value 
 * @param {*} min 
 * @param {*} max 
 */
export function descale(value, min, max) {
    const factor = 0xFFFF / (max - min)
    return value / factor + min
}


export const getRealValue = (viewer, e, raw) => {

    const tiledImage = viewer.world.getItemAt(0);
    let tile, tileRight, tileBottom;
    for (let i = 0; i < tiledImage.lastDrawn.length; i++) {
        tile = tiledImage.lastDrawn[i];
        tileRight = tile.position.x + tile.size.x;
        tileBottom = tile.position.y + tile.size.y;
        if (e.position.x >= tile.position.x && e.position.x < tileRight &&
            e.position.y >= tile.position.y && e.position.y < tileBottom) {
            const tile_width = tile.size.x
            const currx = Math.round(e.position.x - tile.position.x)
            const curry = Math.round(e.position.y - tile.position.y)
            const arrpos = Math.round(curry * tile_width + currx);
            // const name = getTileName(tile)

            return raw[arrpos]

        }
    }

}