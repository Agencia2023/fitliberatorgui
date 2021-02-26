import React from 'react'

const CurrentPointDataTable = (props) => {
    return (
        <React.Fragment>
            <div style={{ display: "grid", gap: 10, justifyContent: 'space-between', gridAutoFlow: 'column', padding: 7 }}>
                <b className=" header">X</b>
                <div className='text' id="cPoint-x">{props.x}px</div>
                <b className=" header">Y</b>
                <div id="cPoint-y" className='text'>{props.y}px</div>
                <b className=" header"  >Value</b>
                <div id="cPoint-value" className='text'>{props.value}</div>
            </div>
            {/* <table className="ui  selectable  table very basic  collapsing " style={{ width: '100%', paddingLeft: 10 }}>
                <tbody >
                    <tr>
                        <th className=" header">X</th>
                        <td id="cPoint-x">{props.x}px</td>
                        <th className=" header">Y</th>
                        <td id="cPoint-y">{props.y}px</td>

                    </tr>
                    <tr >
                    <th className=" header"  >Value</th>
                        <td id="cPoint-value" >{props.value}</td>                                                
                        <th className=" header">
                             Processed 
                        </th>
                        <td>
                             {props.processed} 
                        </td>
                    </tr>
                </tbody>
            </table> */}

            <div className="extra content extra-btns" >
                <div>Width   {props.imageSize.original_width}px</div>
                <div>Height {props.imageSize.original_height}px</div>
            </div>
        </React.Fragment>
    )
}

export default CurrentPointDataTable