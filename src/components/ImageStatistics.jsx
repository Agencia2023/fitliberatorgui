import React from 'react'
import Card from './card/Card'
import { StatisticsCardLoader } from './loader/Loading'

export default function ImageStatistics({ data, showStats, onClick, loading }) {

    return (

        <Card title="Image Statistics" isToggle icon="chart bar outline" show={showStats} onClick={onClick}>

            {loading ? <StatisticsCardLoader /> :
                data &&
                <table className="ui  selectable  table very basic  compact center aligned">              
                    <tbody>
                        <tr>
                            <td className="ui header left aligned"><strong>Min</strong></td>
                            <td>{data.min}</td>
                            <td className="ui header left aligned"><strong>Mean</strong></td>
                            <td>{data.mean}</td>
                        </tr>
                        <tr>
                            <td className="ui header left aligned"><strong>Max</strong></td>
                            <td>{data.max}</td>
                            <td className="ui header left aligned"><strong>Stdev</strong></td>
                            <td>{data.stdev}</td>
                        </tr>                      

                    </tbody>
                </table>
            }
        </Card>
    )
}
