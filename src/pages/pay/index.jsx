'use client'
import React, { useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation'
import { SERVER_URL } from '../../constants/constants';
import axios from "axios";

const Pay = () => {

    const searchParams = useSearchParams()
    const router = useRouter()

    useEffect(() => {
        console.log('searchParams', searchParams)
        const orderData = {
            product_title: "補價",
            price: searchParams.get('price')
        }

        axios({
            url: `${SERVER_URL}/order/payment/stripe?action=direct_payment`,
            method: "POST",
            data: {
                url: window.location.origin,
                order: orderData
            },
        })
            .then((res) => {
                router.push(res.data.url)
            })
            .catch((err) => {
                console.log('err', err)
            })
    }, [])

    return null
}

export default Pay