'use client'
import React, { useState, useMemo, useEffect } from "react";
import { Button, Table, Steps, Space, Col, Row, Spin } from "antd";
import { useRouter } from 'next/navigation'
import { SERVER_URL } from '../../constants/constants';
import axios from "axios";
import { toShowablePrice, getOrderStatus, getDeliveryStatus, getPaymentStatus } from '../../utilities/utilities'
import _ from 'lodash'
import MainLayout from "../../components/homePage/MainLayout";
import useWindowSize from '../../utilities/useWindowSize';
import moment from "moment";
import Link from "next/link";

const Order = ({

}) => {

    const router = useRouter()
    const windowSize = useWindowSize();
    const [orders, setOrders] = useState([])
    const [page, setPage] = useState(1)
    const [count, setCount] = useState(0)

    const columns = [
        {
            title: '訂單號碼',
            dataIndex: 'refId',
            render: (text, record) => (
                <Link style={{ textDecoration: 'underline' }} href={`/order/${text}`}>{text}</Link>
            ),
        },
        {
            title: '總計',
            dataIndex: 'total_price',
            render: (text, record) => (
                <div>{toShowablePrice(text)}</div>
            ),
        },
        {
            title: '狀態',
            dataIndex: 'status',
            render: (text, record) => (
                <div>{getOrderStatus(text)}</div>
            ),
        },
        {
            title: '發貨進度',
            dataIndex: 'delivery_status',
            render: (text, record) => (
                <div>{getDeliveryStatus(text)}</div>
            ),
        }, {
            title: '付款狀態',
            dataIndex: 'payment_status',
            render: (text, record) => (
                <div>{getPaymentStatus(text)}</div>
            ),
        }, {
            title: '提交時間',
            dataIndex: 'created',
            render: (text, record) => (
                <div>{moment(text).format('YYYY-MM-DD h:mm:ss a')}</div>
            ),
        },
    ];

    const phoneColumns = [
        {
            title: '訂單號碼',
            dataIndex: 'refId',
            render: (text, record) => (
                <Link style={{ textDecoration: 'underline' }} href={`/order/${text}`}>{text}</Link>
            ),
        },
        {
            title: '總計',
            dataIndex: 'total_price',
            render: (text, record) => (
                <div>{toShowablePrice(text)}</div>
            ),
        },
        {
            title: '狀態',
            dataIndex: 'status',
            width: 120,
            render: (text, record) => (
                <div>{getOrderStatus(text)}</div>
            ),
        }
    ];

    useEffect(() => {
        const token = typeof window !== 'undefined' && localStorage.getItem('token')
        let axiosData = {
            url: `${SERVER_URL}/order/order?action=lite`,
            method: "GET",
            params: {
                page
            }
        }
        if (!!token) {
            axiosData.headers = {
                "Authorization": `token ${token}`
            }
        } else {
            router.push('/login')
        }
        axios(axiosData)
            .then((res) => {
                setOrders(res.data.results)
                setCount(res.data.count)
            })
            .catch(() => {
                router.push('/login')
            })
    }, [])

    return (
        <MainLayout>
            <div className="max1500" style={{ minHeight: windowSize.width < 768 ? 'auto' : '400px' }}>
                <h1>訂單管理</h1>
                {windowSize.width < 768 ? (
                    <Table
                        columns={phoneColumns}
                        dataSource={[...orders]}
                        pagination={{
                            current: page,
                            pageSize: 28,
                            onChange: (page) => { setPage(page) },
                            total: count
                        }}
                    />
                ) : (
                    <Table
                        columns={columns}
                        dataSource={[...orders]}
                        pagination={{
                            current: page,
                            pageSize: 28,
                            onChange: (page) => { setPage(page) },
                            total: count
                        }}
                    />
                )}
            </div>
        </MainLayout>
    )
}

export default Order