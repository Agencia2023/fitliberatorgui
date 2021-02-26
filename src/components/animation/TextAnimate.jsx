import React from 'react'
import './textAnimate.scss'

export default function TextAnimate({ children, time }) {
    const ref = React.useRef()
    let char = 0
    let timer

    const onSpan = size => () => {
        const span = ref.current.querySelectorAll('span')[char]
        span.classList.add('fade')
        char++

        if (char === size) {
            clearInterval(timer)
            timer = null
            return
        }

    }
    const makeAnimation = () => {

        const { current } = ref
        const spltText = current.textContent.split('')
        current.textContent = ''

        for (const text of spltText) {
            current.innerHTML += `<span>${text}</span>`
        }
        timer = setInterval(onSpan(spltText.length), time ? time : 60)
    }
    React.useLayoutEffect(() => {

        makeAnimation()

        return () => {
            clearInterval(timer)
            timer = null
        }

    }, [])

    return (<p className='textAnimate' ref={ref}> {children}</p>)
}
