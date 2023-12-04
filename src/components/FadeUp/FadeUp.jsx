import React from 'react';
import { useInView } from 'react-intersection-observer';

const FadeUp = (props) => {

    const {
        style = {},
        className,
        children
    } = props

    const [viewRef, inView] = useInView();

    return (
        <div
            id='FadeUp'
            ref={viewRef}
            className={`${className} ${inView ? "fadeUp" : "waitFadeUp"}`}
            style={{ ...style }}
        >
            {children}
        </div>
    )
}

const tiggerAnimation = () => {
    const element = document.getElementById("FadeUp")
    element.classList.toggle('fadeUp')
}

export default FadeUp

export {
    tiggerAnimation
}