'use client'
import React from 'react'
import Header from './Header';
import Footer from './Footer';
import AnnouncementBar from './AnnouncementBar';
import { FloatButton } from 'antd';
import { WhatsAppOutlined } from '@ant-design/icons'

const MainLayout = ({ children }) => {

    return (
        <div className='mainLayout'>
            <AnnouncementBar />
            <Header />
            <div className='main'>
                {children}
            </div>
            <FloatButton.Group
                shape="circle"
                style={{
                    right: 24,
                    color: "#00a884"
                }}
            >
                <FloatButton
                    href='https://api.whatsapp.com/send?phone=85256962695'
                    target='_blank'
                    icon={
                        <WhatsAppOutlined
                            style={{
                                color: "#00a884"
                            }}
                        />
                    }
                />
            </FloatButton.Group>
            <Footer />
        </div>
    )
}

export default MainLayout;