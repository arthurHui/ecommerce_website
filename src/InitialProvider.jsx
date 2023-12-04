"use client"
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { updateCart } from './service/cart'
import { setCategory } from './service/category'
import axios from "axios";
import { SERVER_URL } from './constants/constants';
import { setGlobal } from './service/global'

const InitialProvider = (props) => {

    const {
        children
    } = props

    const dispatch = useDispatch()
    const cartData = useSelector(state => state.cart.data) || []
    const user = useSelector(state => state.global.user)
    const category = useSelector((state) => state.category.data)

    useEffect(() => {
        if (typeof window !== 'undefined' && !user) {
            const token = localStorage.getItem('token')
            if (typeof window !== 'undefined' && !!token) {
                axios({
                    url: `${SERVER_URL}/auth/login`,
                    method: "POST",
                    headers: {
                        "Authorization": `token ${token}`
                    }
                })
                    .then((res) => {
                        const data = res.data
                        dispatch(setGlobal({ key: 'user', data: data }))
                        localStorage.setItem('token', data.token)
                    })
                    .catch(() => {
                        localStorage.removeItem("token")
                    })
            }
        }
        if (cartData.length === 0) {
            const cart = typeof window !== 'undefined' && localStorage.getItem('cart')
            dispatch(updateCart({ target: 'data', data: JSON.parse(cart) }))
        }
        if (category.length === 0) {
            axios({
                url: `${SERVER_URL}/product/category`,
                method: "GET",
            })
                .then((res) => {
                    const data = res.data
                    dispatch(setCategory({
                        target: 'data',
                        data: [{
                            id: -1,
                            title: '全部分類'
                        }, ...data]
                    }))
                })
        }
    }, [])

    return (
        <React.Fragment>
            {children}
        </React.Fragment>
    )
}

export default InitialProvider