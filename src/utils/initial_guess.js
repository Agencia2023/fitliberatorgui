import { descaleAndScale, scale, pureDescale, scale_linear } from "./scaledFunctions"

const initialGuess = (sizeHS, statistics, isOriginal, new_params, old_parameters) => {

    let wl, bl
    
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
        }
        else {

            /**
             * ORIGINAL IMAGE
             */
            const preBl = (mean - stdev)
            bl = preBl < min ? min : preBl

            const preWl = mean + stdev
            wl = preWl > max ? max : preWl
            

        }
        /**
         * real value for HS filter
         */


        const k = (max - min) / sizeHS
        wl = (wl - min) / k
        bl = (bl - min) / k
        
        return { wl, bl }
    }

    return { wl: 0, bl: 0 }
}
export const descaled_White_Black_Level = (isOriginal, new_params, old_parameters) => {

    let { w: wl, b: bl } = new_params
    
    if (!isOriginal) {    

        if (!old_parameters?.original) {

            const { newWhitelvl, newBlacklvl } = pureDescale(new_params, old_parameters)
            wl = newWhitelvl
            bl = newBlacklvl
        }
    }

    return { wl, bl }
}


export default initialGuess