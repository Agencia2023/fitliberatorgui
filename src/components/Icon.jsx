import React from 'react'
import PropTypes from 'prop-types'

const Svg = ({ children, style, ...rest }) => {

    return <svg width="22" height="22" style={{ ...style, verticalAlign: 'middle' }} viewBox="0 0 25 22" {...rest} >
        {children}
    </svg>
}

export const BlackLevelIcon = props => {
    return <Svg   {...props} >
        <path stroke="white" fill="black" d="M 5 0 Q 1 1 1 4 L 1 19 Q 2 22 5 23 L 13 23 L 22 11 L 22 11 L 13 0 L 5 0" ></path>
    </Svg>
}
export const WhiteLevelIcon = props => {
    return <Svg {...props}>
        <path stroke="black" fill="white" d="M 20 0 Q 24 1 24 4 L 24 19 Q 23 22 20 23 L 12 23 L 3 11 L 3 11 L 12 0 L 20 0" ></path>
    </Svg>
}
export const FullScreenIcon = () =>
    <svg viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg"  >
        <g>
            <title>Layer 1</title>
            <g id="svg_4">
                <g id="svg_5">
                    <polygon id="svg_6" points="126.533,102.4 199.111,102.4 199.111,68.267 68.267,68.267 68.267,199.111 102.4,199.111 102.4,126.538     198.422,222.558 222.556,198.423   " />
                </g>
            </g>
            <g id="svg_7">
                <g id="svg_8">
                    <polygon id="svg_9" points="222.557,313.581 198.422,289.445 102.4,385.467 102.4,312.889 68.267,312.889 68.267,443.733 199.111,443.733     199.111,409.6 126.538,409.6   " />
                </g>
            </g>
            <g id="svg_10">
                <g id="svg_11">
                    <polygon id="svg_12" points="409.6,312.889 409.6,385.467 313.578,289.444 289.444,313.578 385.462,409.6 312.889,409.6 312.889,443.733     443.733,443.733 443.733,312.889   " />
                </g>
            </g>
            <g id="svg_13">
                <g id="svg_14">
                    <polygon id="svg_15" points="312.889,68.267 312.889,102.4 385.467,102.4 289.444,198.423 313.578,222.558 409.6,126.538 409.6,199.111     443.733,199.111 443.733,68.267   " />
                </g>
            </g>
            <g id="svg_16" />
            <g id="svg_17" />
            <g id="svg_18" />
            <g id="svg_19" />
            <g id="svg_20" />
            <g id="svg_21" />
            <g id="svg_22" />
            <g id="svg_23" />
            <g id="svg_24" />
            <g id="svg_25" />
            <g id="svg_26" />
            <g id="svg_27" />
            <g id="svg_28" />
            <g id="svg_29" />
            <g id="svg_30" />
        </g>
    </svg>

function Icon({ name, ...rest }) {
    return (
        <i className={`icon ${name}`} {...rest} />
    )
}

Icon.propTypes = {
    name: PropTypes.string.isRequired
}

export default Icon


