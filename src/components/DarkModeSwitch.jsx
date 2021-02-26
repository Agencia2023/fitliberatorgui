import React from 'react'
import Icon from './Icon'
export default function DarkModeSwitch({ showIcon }) {

    const [dm, setDm] = React.useState(Number(localStorage.getItem('darkmode')))

    const darkMode = () => document.body.classList.toggle('dark-mode')

    const darkModeProcess = () => {
        darkMode()
        setDm(Number(!dm))
        localStorage.setItem('darkmode', Number(!dm))
    }

    React.useEffect(() => {
        if (dm)
            darkMode()

    }, [])


    return (
        <div className="ui toggle checkbox">
            <input type="checkbox" onChange={darkModeProcess} checked={dm} />
            <label style={{fontWeight:600}}>Dark Mode {showIcon && <Icon name="moon" />}</label>
        </div>
    )
}
