import React, { useEffect, useState } from 'react'
import s from './FixedComponent.module.scss';
import { ChervonDown } from '../Icons';

const FixedComponent = () => {

    const [height, setHight] = useState<number>(0);

    const getScrollHeight = (event: Event) => {
        setHight(document.body.scrollTop)
    }

    const scrollToTop = () => {
        document.body.scrollTo({ top: 0, behavior: 'smooth' });
    }

    useEffect(() => {
        document.body.addEventListener('scroll', getScrollHeight)

        return () => document.body.removeEventListener('scroll', getScrollHeight)
    }, [])

    return (
        <>
            {height > 100 && (
                <div className={s.scrollToTop} onClick={scrollToTop}>
                    <ChervonDown
                        height={24}
                        width={24}
                        style={{ transform: 'translateY(3px)' }}
                    />
                </div>
            )}
        </>

    )
}

export default FixedComponent