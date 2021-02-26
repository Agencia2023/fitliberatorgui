// import PNG from 'yapd'
import UPNG from 'upng-js'


export const rawDecode =  (buffer, isTransparent) => {

    let imgrawdata = [];        
    // let decoded_img = await PNG.decode(new Uint8Array(buffer))
    let decoded_img = UPNG.decode(buffer);
    
        let area = decoded_img.width * decoded_img.height;
        if (isTransparent) {
            for (let i = 0; i < area * 2; i += 2) {
                imgrawdata[i / 2] = (decoded_img.data[i * 2] << 8) | decoded_img.data[i * 2 + 1];

            }

        }
        else {
            for (let i = 0; i < area; i++) {
                imgrawdata[i] = (decoded_img.data[i * 2] << 8) | decoded_img.data[i * 2 + 1];
            }
        }
        return imgrawdata;
}

// export const rawDecode = (buffer, isTransparent) => {

//     let imgrawdata = []
//     const { width, height, data } = UPNG.decode(buffer)
//     const area = width * height
//     if (isTransparent) {
//         for (let i = 0; i < area * 2; i += 2)
//             imgrawdata[i / 2] = (data[i * 2] << 8) | data[i * 2 + 1]

//     }
//     else {
//         for (let i = 0; i < area; i++)
//             imgrawdata[i] = (data[i * 2] << 8) | data[i * 2 + 1];

//     }
//     return imgrawdata;
// }

