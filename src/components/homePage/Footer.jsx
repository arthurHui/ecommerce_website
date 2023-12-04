'use client'

import React from "react";
import s from './Footer.module.scss';
import Link from 'next/link'
import { CopyrightOutlined, InstagramOutlined } from "@ant-design/icons"
import { Space } from "antd";

const Footer = () => {
    return (
        <div className={s.FooterContainer}>
            <div className={s.list}>
                <div>
                    <div className={s.title}>
                        關於我們
                    </div>
                    <div>
                        品牌故事
                    </div>
                </div>
                <div>
                    <div className={s.title}>
                        顧客服務
                    </div>
                    <div>
                        <Link href="/about/terms">
                            條款與細則
                        </Link>
                    </div>
                    {/* <div>
                    付款服務
                </div> */}
                    <div>
                        <Link href="/about/policy">
                            退換貨政策
                        </Link>
                    </div>
                </div>
                <div>
                    <div className={s.title}>
                        聯絡我們
                    </div>
                    <div>
                        Email: dev@dev.com
                    </div>
                    <div>
                        WhatsApp: +852 12345678
                    </div>
                    <Space className={s.socialMedia}>
                        <a href="https://www.instagram.com/instagram/" target="_blank" >
                            <InstagramOutlined className={s.icon} />
                        </a>
                    </Space>
                </div>
            </div>
            <div className={s.copyRight}>
                dev
                <CopyrightOutlined />
                2023
            </div>
        </div>
    )
}

export default Footer