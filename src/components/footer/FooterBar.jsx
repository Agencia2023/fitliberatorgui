import React from 'react'
import './FooterBar.scss'
import { useSelector } from 'react-redux'
import Icon from '../Icon'
import { clearParams } from '../../utils/general'


export const FooterBar = () => {
    const imageSelected = useSelector(state => state.imageSelected)
    // const original = imageSelected?.original
    const parameters = clearParams(imageSelected)

    return (
        <div className="footer-params">
            <div className="footer-params-item">
                {imageSelected &&
                    <div>
                        <Icon name='tag' /> {parameters}
                    </div>
                }
            </div>
        </div>
    )
}


export default FooterBar
