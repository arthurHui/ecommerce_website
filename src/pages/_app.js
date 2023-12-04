import React, { useEffect, useState } from 'react';
import '../app/globals.css'
import 'antd/dist/reset.css';
import 'swiper/css/bundle';
import { store } from '../service/store'
import { Provider } from 'react-redux'
import { ConfigProvider, Spin } from 'antd';
import InitialProvider from '../InitialProvider';
import Script from 'next/script';
import Head from 'next/head'
import NextNProgress from 'nextjs-progressbar';
import { useRouter } from 'next/router'
import { Analytics } from '@vercel/analytics/react';
import { prefix } from '../constants/constants';
const MyApp = ({ Component, pageProps }) => {

    const [isLoading, setIsLoading] = useState(true)
    const router = useRouter()
    useEffect(() => {
        router.isReady && setIsLoading(false)
    }, [router])

    if (typeof document === 'undefined') {
        React.useLayoutEffect = React.useEffect;
    }

    return (
        <>
            <title>dev</title>
            <meta content="width=device-width, initial-scale=1" name="viewport" />
            <meta name="description" content="dev" />
            <Head>
                <link rel="shortcut icon" href={`images/favicon.ico`} />
                <link rel="apple-touch-icon" sizes="180x180" href={`images/favicon.ico`} />
                <link rel="icon" sizes="32x32" href={`images/favicon.ico`} />
                <link rel="icon" sizes="16x16" href={`images/favicon.ico`} />
                <link rel="preconnect" href="https://www.google-analytics.com" />
                <link rel="preconnect" href="https://www.googletagmanager.com" />
            </Head>
            <NextNProgress color='#4096ff' />
            <Provider store={store}>
                <ConfigProvider theme={{
                    token: {
                        borderRadius: 3,
                    },
                }}>
                    <InitialProvider>
                        {/* <Script src="https://www.googletagmanager.com/gtag/js?id=G-W9CCD2XQ6S" />
                        <Script id="google-analytics">
                            {` 
                            window.dataLayer = window.dataLayer || [];
                            function gtag(){dataLayer.push(arguments);}
                            gtag('js', new Date());
                    
                            gtag('config', 'G-W9CCD2XQ6S');
                        `}
                        </Script>
                        <Script id="fb-pixel">
                            {`!function(f,b,e,v,n,t,s)
                            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                            n.queue=[];t=b.createElement(e);t.async=!0;
                            t.src=v;s=b.getElementsByTagName(e)[0];
                            s.parentNode.insertBefore(t,s)}(window, document,'script',
                            'https://connect.facebook.net/en_US/fbevents.js');
                            fbq('init', '1757767458011815');
                            fbq('track', 'PageView');`}
                        </Script> */}
                        {isLoading ? (
                            <Spin className='loading' />
                        ) : (
                            <Component id='mainLayout' {...pageProps} />
                        )}
                        <Analytics />
                    </InitialProvider>
                </ConfigProvider>
            </Provider>
        </>
    )
};

export default MyApp