const png = require("upng-js");
const Promise = require('bluebird');
const fs = require('fs')

const rawDecode = async (hasUndefined, imagePath) => {

    const decoded_img = png.decode(await Promise.promisify(fs.readFile)(imagePath));

    const rawDataImage = []
    const area = decoded_img.width * decoded_img.height;
    if (hasUndefined == 1)
        for (let i = 0; i < area * 2; i += 2)
            rawDataImage[i / 2] = (decoded_img.data[i * 2] << 8) | decoded_img.data[i * 2 + 1];

    else
        for (let i = 0; i < area; i++)
            rawDataImage[i] = (decoded_img.data[i * 2] << 8) | decoded_img.data[i * 2 + 1];



    return rawDataImage
}

module.exports = {
    rawDecode
}