import React from "react";
import s from './AnnouncementBar.module.scss';
import { Alert } from 'antd';
import Marquee from 'react-fast-marquee';

const AnnouncementBar = () => {

    return (
        <div className={s.container}>
            <Alert
                banner
                icon={(
                    <div className={s.icon}>Notice</div>
                )}
                message={
                    <Marquee style={{ width: "100%" }} pauseOnHover autoFill gradient={false}>
                        現在申請成為會員可即享有
                        <spin style={{ color: '#ff0000' }}>95折</spin>
                        優惠, 加入會員即享更多優惠 ,仲唔即刻申請?
                        買滿
                        <spin style={{ color: '#ff0000' }}>$500</spin>
                        可享有
                        <spin style={{ color: '#ff0000' }}>免運費</spin>
                        優惠!
                    </Marquee>
                }
            />
        </div>
    )
}

export default AnnouncementBar