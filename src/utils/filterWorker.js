function scale(value, blacklevel, whitelevel) {
    const f = 0xFFFF / (whitelevel - blacklevel);
    const a = -blacklevel * f
    return f * value + a;
}

onmessage = (e) => {    
    let { imgData, mark_pixels, min, max, bl, wl, imgrawdata  } = e.data;

 
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
    }
    postMessage(imgData)
};