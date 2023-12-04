import React, { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import _ from 'lodash'
import { SERVER_URL } from '../constants/constants';
import axios from "axios";
import { useRouter } from 'next/navigation'
import { notification } from "antd";
import { getTotalPrice } from "./utilities";
import { clearData } from "../service/cart";
import { getDeliveryFee } from '../utilities/utilities';

const useCheckout = () => {
    const [isShowCart, setIsShowCart] = useState(false)
    const [checkoutData, setCheckoutData] = useState({
        customer_name: '',
        email: '',
        phone_number: '',
        recipient_name: '',
        recipient_phone_number: '',
        remarks: '',
        is_agree_policy: false,
        is_to_member: true,
        is_get_promotion: false,
        address: ""
    })

    const [isError, setIsError] = useState(false)
    const [errorList, setErrorList] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const cartData = useSelector(state => state.cart.data)
    const user = useSelector(state => state.global.user)
    const deliveryMethod = useSelector(state => state.cart.deliveryMethod) || typeof window !== 'undefined' && JSON.parse(localStorage.getItem('deliveryMethod')) || ""
    const deliveryLocation = useSelector(state => state.cart.deliveryLocation) || typeof window !== 'undefined' && JSON.parse(localStorage.getItem('deliveryLocation')) || ""
    const paymentMethod = useSelector(state => state.cart.paymentMethod) || typeof window !== 'undefined' && JSON.parse(localStorage.getItem('paymentMethod')) || ""
    const isFreeShipping = useSelector(state => state.cart.isFreeShipping) || typeof window !== 'undefined' && JSON.parse(localStorage.getItem('isFreeShipping')) || false

    const dispatch = useDispatch()
    const router = useRouter()
    const [api, contextHolder] = notification.useNotification();

    const total_price = useMemo(() => getTotalPrice(cartData), [cartData])
    const deliveryFee = useMemo(() => {
        if (total_price >= 500) {
            return 0
        } else {
            return getDeliveryFee(deliveryMethod)
        }
    }, [deliveryMethod, total_price])

    const onChangeCheckoutData = (type, value) => {
        let newCheckoutData = { ...checkoutData }
        newCheckoutData[type] = value
        setCheckoutData(newCheckoutData)
    }

    const isSameData = (checked) => {
        if (checked) {
            let newCheckoutData = { ...checkoutData }
            newCheckoutData.recipient_name = newCheckoutData.customer_name
            newCheckoutData.recipient_phone_number = newCheckoutData.phone_number
            setCheckoutData(newCheckoutData)
        }
    }

    const onCheckOut = () => {
        if (!/\S+@\S+\.\S+/.test(checkoutData.email)) {
            api.info({
                message: '電郵格式錯誤',
                duration: 3
            })
            return
        } else if (!checkoutData.email) {
            api.warning({
                message: '電郵不能為空',
                duration: 3
            })
            return
        } else if (!checkoutData.customer_name) {
            api.warning({
                message: '顧客名稱不能為空',
                duration: 3
            })
            return
        } else if (!checkoutData.phone_number) {
            api.warning({
                message: '電話號碼不能為空',
                duration: 3
            })
            return
        } else if (!checkoutData.recipient_name) {
            api.warning({
                message: '收件人名稱不能為空',
                duration: 3
            })
            return
        } else if (!checkoutData.recipient_phone_number) {
            api.warning({
                message: '收件人電話號碼不能為空',
                duration: 3
            })
            return
        } else if (!checkoutData.is_agree_policy) {
            api.warning({
                message: '你必須同意細則和私隱條款',
                duration: 3
            })
            return
        }
        if (deliveryMethod.includes("順豐寄付") && !checkoutData.address) {
            api.warning({
                message: '地址不能為空',
                duration: 3
            })
            return
        }
        setIsLoading(true)
        const token = user?.token
        let axiosData = {
            url: `${SERVER_URL}/order/order`,
            method: "POST",
            data: {
                ...checkoutData,
                total_price: total_price,
                order: cartData,
                delivery_method: deliveryMethod,
                payment_method: paymentMethod,
                delivery_fee: deliveryFee,
                delivery_location: deliveryLocation
            }
        }
        if (!!token) {
            axiosData.headers = {
                "Authorization": `token ${token}`
            }
        }
        axios(axiosData)
            .then((res) => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('cart')
                    localStorage.removeItem('deliveryLocation')
                    localStorage.removeItem('deliveryMethod')
                    localStorage.removeItem('paymentMethod')
                }
                dispatch(clearData())
                const data = res.data
                router.push(`/order/${data.refId}`)
            })
            .catch((error) => {
                api.error({
                    message: "下單失敗",
                    duration: 3
                })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    useEffect(() => {
        axios({
            url: `${SERVER_URL}/order/check`,
            method: "POST",
            data: {
                order: cartData
            }
        })
            .then((res) => {
                setErrorList([])
                setIsError(false)
            })
            .catch((error) => {
                setErrorList(error.response.data)
                setIsError(true)
            })
    }, [cartData])

    return {
        isShowCart,
        setIsShowCart,
        cartData,
        dispatch,
        total_price,
        checkoutData,
        onChangeCheckoutData,
        isSameData,
        deliveryMethod,
        paymentMethod,
        isError,
        errorList,
        user,
        contextHolder,
        isLoading,
        onCheckOut,
        isFreeShipping,
        router,
        deliveryFee
    }
}

export default useCheckout