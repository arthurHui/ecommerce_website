'use client'
import React, { useEffect, useMemo, useState } from "react";
import MainLayout from '../../components/homePage/MainLayout';
import s from './Cart.module.scss';
import { InputNumber, Button, Table, Steps, Space, Select } from "antd";
import { useDispatch, useSelector } from "react-redux";
import _ from 'lodash'
import { toShowablePrice, getTotalPrice, getDeliveryName, getDeliveryFee } from '../../utilities/utilities'
import { CloseOutlined } from '@ant-design/icons';
import { removeFromCart, onchangeCart, updateCart } from '../../service/cart'
import Section from '../../components/Section';
import useWindowSize from '../../utilities/useWindowSize'
import { SERVER_URL } from '../../constants/constants';
import axios from "axios";
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Image from "next/image";

const Cart = () => {

    const cartData = useSelector(state => state.cart.data)
    const user = useSelector(state => state.global.user)
    const deliveryMethod = useSelector(state => state.cart.deliveryMethod) || typeof window !== 'undefined' && JSON.parse(localStorage.getItem('deliveryMethod')) || ""
    const dispatch = useDispatch()
    const router = useRouter()
    const windowSize = useWindowSize();

    const [errorList, setErrorList] = useState([])
    const [preOrderList, setPreOrderList] = useState([])
    const [deliveryFee, setDeliveryFee] = useState(0)
    const token = typeof window !== 'undefined' && localStorage.getItem('token')

    const deliveryOption = [{
        label: '順豐到付',
        value: 'sf_pay_in_arrive'
    }, {
        label: '順豐自取點自取',
        value: 'sf_pay_in_store'
    }, {
        label: '順豐住宅地址直送',
        value: 'sf_pay_in_home'
    }]
    const deliveryLocationOption = [
        {
            value: 'hk',
            label: '香港',
        }, {
            value: 'macau',
            label: '澳門',
        },
    ]
    const paymentOption = [{
        value: "fps",
        label: "FPS轉數快"
    }, {
        value: "payme",
        label: "Payme"
    }, {
        value: "credit_card",
        label: "信用卡"
    }, {
        value: "alipay",
        label: "Alipay"
    }]

    const columns = [
        {
            title: '商品資料',
            dataIndex: 'title',
            render: (text, record) => (
                <Space>
                    <Image
                        width={60}
                        height={60}
                        src={record.image}
                        alt={record.title}
                        sizes="100vw"
                    />
                    <div>
                        <div className={s.productTitle}>{record.product_title}</div>
                        <div className={s.productOptionTitle}>
                            {record.title}
                            {Object.keys(_.get(record, "sub_option", {})).length > 0 && (
                                " / " + record.sub_option.title
                            )}
                        </div>
                    </div>
                </Space>
            ),
        },
        {
            title: '單件價格',
            dataIndex: 'address',
            render: (text, record) => (
                <div>
                    {!!_.get(record, 'markdown_price', null) ? (
                        <React.Fragment>
                            <div style={{ textAlign: 'left' }} className="SellingPrice">{toShowablePrice(record.markdown_price)}</div>
                            <div style={{ textAlign: 'left' }} className="originalPrice">{toShowablePrice(record.original_price)}</div>
                        </React.Fragment>
                    ) : (
                        <div style={{ textAlign: 'left' }} className="onlyOriginalPrice">{record.original_price}</div>
                    )}
                </div>
            ),
        },
        {
            title: '數量',
            dataIndex: 'added_quantity',
            render: (text, record) => {
                let error = null
                let preOrder = null
                if (record.id && typeof errorList === "object") {
                    error = errorList.find((value) => value.id === record.id)
                }
                if (record.id && typeof preOrderList === "object") {
                    preOrder = preOrderList.find((value) => value.id === record.id)
                }
                return (
                    <div>
                        <InputNumber
                            min={1}
                            max={record.quantity}
                            defaultValue={text}
                            onChange={(num) => dispatch(onchangeCart({ id: record.id, added_quantity: num }))}
                        />
                        {preOrder && (
                            <div style={{ marginTop: '10px' }} className='preOrder'>{Math.abs(preOrder.pre_order)}件預購</div>
                        )}
                    </div>
                )
            },
        },
        {
            title: '小計',
            dataIndex: 'total_price',
            render: (text, record) => (
                <div>{toShowablePrice(record.added_quantity * _.get(record, 'markdown_price', record.original_price))}</div>
            ),
        },
        {
            title: '',
            dataIndex: 'action',
            render: (text, record) => (
                <Button onClick={() => dispatch(removeFromCart(record.id))} type="text" icon={<CloseOutlined />} />
            ),
        },
    ];

    const total_price = useMemo(() => getTotalPrice(cartData), [cartData])
    const original_total_price = useMemo(() => getTotalPrice(cartData, true), [cartData])

    useEffect(() => {
        dispatch(updateCart({ target: 'deliveryLocation', data: deliveryLocationOption[0].value }))
        dispatch(updateCart({ target: 'deliveryMethod', data: deliveryOption[0].value }))
        dispatch(updateCart({ target: 'paymentMethod', data: paymentOption[0].value }))
    }, [])

    useEffect(() => {
        axios({
            url: `${SERVER_URL}/order/check`,
            method: "POST",
            data: {
                order: cartData
            }
        })
            .then((res) => {
                setErrorList(res.data.error_list)
                setPreOrderList(res.data.pre_order_list)
            })
    }, [cartData])

    useEffect(() => {
        dispatch(updateCart({ target: 'isFreeShipping', data: total_price >= 500 }))
    }, [total_price])

    useEffect(() => {
        if (total_price >= 500) {
            setDeliveryFee(0)
        } else {
            setDeliveryFee(getDeliveryFee(deliveryMethod))
        }
    }, [deliveryMethod, total_price])

    return (
        <>
            <MainLayout>
                <div className={s.cartContainer}>
                    <Steps
                        className="max1500"
                        current={0}
                        items={[
                            {
                                title: '購物車',
                            },
                            {
                                title: '填寫資料',
                            },
                            {
                                title: '訂單確認',
                            },
                        ]}
                    />
                    {/* {isError && (
                        <div className={s.cartError}>
                            <div>對不起，你的購物車中有無法購買的商品，請先於結帳前調整商品數量或移除有問題的商品項目，或試著重新整理頁面。</div>
                        </div>
                    )} */}
                    {!user && (
                        <div className={s.memberLogin}>
                            <div>已經是會員？登入後可以更方便管理訂單！</div>
                            <Link href="/login">
                                <Button className="themeButton" type="primary">會員登入</Button>
                            </Link>
                        </div>
                    )}
                    {windowSize.width < 768 ? (
                        <Section title={`購物車 (${cartData.length}件)`} style={{ width: '100%', marginBottom: '30px' }}>
                            {cartData.map((value) => {
                                let error
                                let preOrder
                                if (value.id && typeof errorList === "object") {
                                    error = errorList.find((element) => element.id === value.id)
                                }
                                if (value.id && typeof preOrderList === "object") {
                                    preOrder = preOrderList.find((element) => element.id === value.id)
                                }
                                return (
                                    <div key={value.title}>
                                        <Space align="start">
                                            <Image
                                                width={60}
                                                height={60}
                                                src={value.image}
                                                alt={value.title}
                                                sizes="100vw"
                                            />
                                            <div>
                                                <div className={s.productTitle}>{value.product_title}</div>
                                                <div className={s.productOptionTitle}>{value.title}</div>
                                            </div>
                                        </Space>
                                        <div >
                                            {!!_.get(value, 'markdown_price', null) ? (
                                                <React.Fragment>
                                                    <div style={{ textAlign: 'right' }} className="SellingPrice">{toShowablePrice(value.markdown_price)}</div>
                                                    <div style={{ textAlign: 'right' }} className="originalPrice">{toShowablePrice(value.original_price)}</div>
                                                </React.Fragment>
                                            ) : (
                                                <div style={{ textAlign: 'right' }} className="onlyOriginalPrice">{value.original_price}</div>
                                            )}
                                        </div>
                                        <div className="spaceBetween" style={{ alignItems: 'center', fontSize: '18px', marginBottom: '10px' }}>
                                            <InputNumber
                                                min={1}
                                                defaultValue={value.added_quantity}
                                                onChange={(num) => dispatch(onchangeCart({ id: value.id, added_quantity: num }))}
                                            />
                                            <div>{toShowablePrice(value.added_quantity * _.get(value, 'markdown_price', value.original_price))}</div>
                                        </div>
                                        {preOrder && (
                                            <div style={{ marginBottom: '10px' }} className='preOrder'>{Math.abs(preOrder.pre_order)}件預購</div>
                                        )}
                                    </div>
                                )
                            })}
                        </Section>
                    ) : (
                        <Table
                            columns={columns}
                            dataSource={[...cartData]}
                            title={() => (
                                <div className={s.tableTitle}>購物車 ({cartData.length}件)</div>
                            )}
                            pagination={false}
                            style={{ marginBottom: '20px' }}
                        />
                    )}
                    <div className='spaceBetween' style={{ display: windowSize.width < 768 ? 'block' : 'flex' }}>
                        <Section title='選擇送貨及付款方式' className={s.deliveryPayment}>
                            <div className="marginBottom5">送貨地點</div>
                            <Select
                                defaultValue="hk"
                                style={{ width: '100%', marginBottom: '15px' }}
                                options={deliveryLocationOption}
                                onChange={(value) => {
                                    dispatch(updateCart({ target: 'deliveryLocation', data: value }))
                                }}
                            />
                            <div className="marginBottom5">送貨方式</div>
                            <Select
                                defaultValue={deliveryOption[0].value}
                                style={{ width: '100%', marginBottom: '15px' }}
                                options={deliveryOption.map((value) => ({
                                    value: value.value,
                                    label: value.label,
                                }))}
                                onChange={(value) => {
                                    dispatch(updateCart({ target: 'deliveryMethod', data: value }))
                                }}
                            />
                            <div className="marginBottom5">付款方式</div>
                            <Select
                                defaultValue={paymentOption[0].value}
                                style={{ width: '100%', marginBottom: '15px' }}
                                options={paymentOption.map((value) => ({
                                    value: value.value,
                                    label: value.label,
                                }))}
                                onChange={(value) => {
                                    dispatch(updateCart({ target: 'paymentMethod', data: value }))
                                }}
                            />
                        </Section>
                        <Section title='訂單資訊' className={s.orderInfo}>
                            <div className="spaceBetweencolumn">
                                <div className='spaceBetween'>
                                    <div>
                                        <div>小計:</div>
                                    </div>
                                    <div>{toShowablePrice(original_total_price)}</div>
                                </div>
                                {token && (
                                    <React.Fragment>
                                        <div className="spaceBetween" style={{ width: '100%' }}>
                                            <div>已套用會員優惠:</div>
                                            <div>-{toShowablePrice(original_total_price - total_price)}</div>
                                        </div>
                                        <div style={{ color: "#4096ff" }}>全單可獲 95% 優惠</div>
                                    </React.Fragment>
                                )}
                                {total_price >= 500 && (
                                    <div className="spaceBetween" style={{ width: '100%' }}>
                                        <div>已套用免運費優惠</div>
                                        <div>{toShowablePrice(0)}</div>
                                    </div>
                                )}
                                <div className="spaceBetween" style={{ width: '100%' }}>
                                    <div>{getDeliveryName(deliveryMethod)}</div>
                                    <div>{toShowablePrice(deliveryFee)}</div>
                                </div>
                                <div className={s.conclusion}>
                                    <div className='spaceBetween' style={{ marginBottom: '10px' }}>
                                        <div>合計:</div>
                                        <div>{toShowablePrice(total_price + deliveryFee)}</div>
                                    </div>
                                    {/* {!!user && (
                                        <div className='spaceBetween' style={{ marginBottom: '10px' }}>
                                            <div>可賺取購物金:</div>
                                            <div>{Math.floor(total_price / POINT_PROPORTION)}</div>
                                        </div>
                                    )} */}
                                    <Button className="thirdButton" onClick={() => router.push('/checkout')}>前往結帳</Button>
                                </div>
                            </div>
                        </Section>
                    </div>
                </div>
            </MainLayout>
        </>
    )
}

export default Cart