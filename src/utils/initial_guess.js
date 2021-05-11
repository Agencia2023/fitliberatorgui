import { descaleAndScale, scale, pureDescale, scale_linear } from "./scaledFunctions"


const initialGuess = (statistics, isOriginal, new_params, old_parameters, histogramData) => {

    let wl, bl
    const sizeHS = histogramData.length


    if (statistics) {

        let { max, min, mean, stdev } = statistics

        max = parseFloat(max)
        min = parseFloat(min)

        if (!isOriginal) {

            if (!old_parameters?.original) {

                const { newWhitelvl, newBlacklvl } = descaleAndScale(new_params, old_parameters)
                wl = newWhitelvl
                bl = newBlacklvl
            } else {

                const { newWhitelvl, newBlacklvl } = scale(new_params)
                wl = newWhitelvl
                bl = newBlacklvl
            }


            // real value for HS filter      
            const k = (max - min) / sizeHS
            wl = (wl - min) / k
            bl = (bl - min) / k
        }
        else {


            let numPoints = 0
            for (let i = 0; i < sizeHS; i++) {
                numPoints += histogramData[i]
            }
            const left = Math.floor(numPoints * 0.05)
            const right = Math.floor(numPoints * 0.9)

            let posleft = -1
            let posright = -1
            let sum = 0
            for (let i = 0; i < sizeHS; i++) {
                sum += histogramData[i]
                if (sum >= left && posleft < 0) {
                    posleft = i
                }
                if (sum >= right && posright < 0) {
                    posright = i
                }
            }

            // ORIGINAL IMAGE
            const factor = (max - min) / sizeHS

            bl = posleft
            wl = posright

        }

        return { wl, bl }
    }

    return { wl: 0, bl: 0 }
}
const stdMeanGuess = (mean, stdev, min, max) => {

    const preBl = (mean - stdev)
    bl = preBl < min ? min : preBl

    const preWl = mean + stdev
    wl = preWl > max ? max : preWl

    return [wl, bl]
}
/*
const initialGuess = (sizeHS, statistics, isOriginal, new_params, old_parameters) => {

    let wl, bl
    console.log("initial guests ------ ")
    if (statistics) {

        console.log("gues initial")
        let { max, min, mean, stdev } = statistics

        max = parseFloat(max)
        min = parseFloat(min)

        if (!isOriginal) {

            console.log("gues initial::isOrignal false")
            if (!old_parameters?.original) {

                const { newWhitelvl, newBlacklvl } = descaleAndScale(new_params, old_parameters)
                wl = newWhitelvl
                bl = newBlacklvl
            } else {

                const { newWhitelvl, newBlacklvl } = scale(new_params)
                wl = newWhitelvl
                bl = newBlacklvl
            }
        }
        else {
          // ORIGINAL IMAGE
            const preBl = (mean - stdev)
            bl = preBl < min ? min : preBl

            const preWl = mean + stdev
            wl = preWl > max ? max : preWl
            // bl =   .05           

            // console.log("wl", scale_linear(wl, wl))
            // console.log("bl", scale_linear(bl, wl))
            // wl = scale_linear(wl, wl)
            // bl = scale_linear(bl, wl)
            // return { wl, bl }


        }
        // real value for HS filter
      
        const k = (max - min) / sizeHS
        wl = (wl - min) / k
        bl = (bl - min) / k

        console.log("gues initial::fina final", wl, bl)
        return { wl, bl }
    }

    return { wl: 0, bl: 0 }
}*/
export const descaled_White_Black_Level = (isOriginal, new_params, old_parameters) => {

    let { w: wl, b: bl } = new_params

    console.log("new_params", new_params)

    if (!isOriginal) {

        console.log("no original")

        if (!old_parameters?.original) {

            const { newWhitelvl, newBlacklvl } = pureDescale(new_params, old_parameters)
            wl = newWhitelvl
            bl = newBlacklvl
        }
    }

    return { wl, bl }
}


export default initialGuess