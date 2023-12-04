'use client'
import React from "react";
import MainLayout from '../../components/homePage/MainLayout';
import s from './Checkout.module.scss';
import { Button, Table, Steps, Space, Input, Checkbox, Spin } from "antd";
import _ from 'lodash'
import { toShowablePrice, getDeliveryName, getPaymentName } from '../../utilities/utilities'
import { UpOutlined } from '@ant-design/icons';
import Section from '../../components/Section';
import useCheckout from '../../utilities/useCheckout';
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import Image from "next/image";
import useWindowSize from '../../utilities/useWindowSize'

const Checkout = () => {

    const {
        isShowCart,
        setIsShowCart,
        cartData,
        dispatch,
        total_price,
        onChangeCheckoutData,
        checkoutData,
        isSameData,
        deliveryMethod,
        paymentMethod,
        isError,
        errorList,
        user,
        router,
        contextHolder,
        isLoading,
        onCheckOut,
        isFreeShipping,
        deliveryFee
    } = useCheckout()

    const windowSize = useWindowSize();

    const columns = [
        {
            title: '商品資料',
            dataIndex: 'title',
            render: (text, record) => (
                <React.Fragment>
                    <Space>
                        <Image
                            width={60}
                            height={60}
                            src={record.image}
                            alt={record.title}
                            sizes="100vw"
                        />
                        <div>
                            <div>{record.product_title}</div>
                            <div>
                                {record.title}
                                {Object.keys(_.get(record, "sub_option", {})).length > 0 && (
                                    " / " + record.sub_option.title
                                )}
                            </div>
                        </div>
                    </Space>
                </React.Fragment>
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
        // {
        //     title: '數量',
        //     dataIndex: 'added_quantity',
        //     render: (text, record) => {
        //         const error = errorList.find((value) => value.id === record.id)
        //         return (
        //             <div>
        //                 <InputNumber
        //                     min={1}
        //                     max={record.quantity}
        //                     defaultValue={text}
        //                     onChange={(num) => dispatch(onchangeCart({ id: record.id, added_quantity: num }))}
        //                 />
        //                 {error && error.message === "not enough stock" && (
        //                     <div style={{ color: "#a94442" }}>您所填寫的商品數量超過庫存</div>
        //                 )}
        //             </div>
        //         )
        //     },
        // },
        {
            title: '小計',
            dataIndex: 'total_price',
            render: (text, record) => (
                <div>{toShowablePrice(record.added_quantity * _.get(record, 'markdown_price', record.original_price))}</div>
            ),
        },
        // {
        //     title: '',
        //     dataIndex: 'action',
        //     render: (text, record) => (
        //         <Button onClick={() => dispatch(removeFromCart(record.id))} type="text" icon={<CloseOutlined />} />
        //     ),
        // },
    ];

    return (
        <>
            {contextHolder}
            <MainLayout>
                <Spin spinning={isLoading}>
                    <div className={`${s.cartContainer} max1500`}>
                        <Steps
                            current={1}
                            onChange={(value) => {
                                if (value === 0) {
                                    router.push('/cart')
                                }
                            }}
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
                        <div className={s.cartData}>
                            <div className={s.title}>合計: {toShowablePrice(total_price + deliveryFee)}</div>
                            <div onClick={() => setIsShowCart(prev => !prev)}>
                                <span style={{ marginRight: '5px' }}>購物車 ({cartData.length}件)</span>
                                <UpOutlined className={isShowCart ? s.rotateDown : s.rotateUp} />
                            </div>
                            {isShowCart && (
                                <>
                                    {windowSize.width < 768 ? (
                                        <Section title={`購物車 (${cartData.length}件)`} style={{ width: '100%', marginTop: '10px' }}>
                                            {cartData.map((value) => {
                                                let error
                                                if (value.id && typeof errorList === "object") {
                                                    error = errorList.find((value) => value.id === record.id)
                                                }
                                                return (
                                                    <div key={value.title}>
                                                        <div className="spaceBetween">
                                                            <div style={{ textAlign: "left" }}>
                                                                <Image
                                                                    width={60}
                                                                    height={60}
                                                                    src={value.image}
                                                                    alt={value.title}
                                                                    sizes="100vw"
                                                                />
                                                                <div >
                                                                    <div className={s.productTitle}>{value.product_title}</div>
                                                                    <div className={s.productOptionTitle}>{value.title}</div>
                                                                </div>
                                                            </div>
                                                            <div>
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
                                                                {error && error.message === "not enough stock" && (
                                                                    <div style={{ color: "#a94442" }}>您所填寫的商品數量超過庫存</div>
                                                                )}
                                                                <div style={{ textAlign: 'right', fontSize: '18px', marginBottom: '10px' }}>
                                                                    {/* <InputNumber
                                                                min={1}
                                                                defaultValue={value.added_quantity}
                                                                onChange={(num) => dispatch(onchangeCart({ id: value.id, added_quantity: num }))}
                                                            /> */}
                                                                    <div>{toShowablePrice(value.added_quantity * _.get(value, 'markdown_price', value.original_price))}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </Section>
                                    ) : (
                                        <>
                                            <Table
                                                columns={columns}
                                                dataSource={cartData}
                                                pagination={false}
                                                style={{ marginTop: '10px' }}
                                                tableLayout='auto'
                                            />
                                            <div className={s.floatRoot}>
                                                <div className={s.checkoutInfo}>
                                                    <div className="spaceBetween" style={{ marginBottom: '10px' }}>
                                                        <div>小計:</div>
                                                        <div>{toShowablePrice(total_price)}</div>
                                                    </div>
                                                    <div className="spaceBetween" style={{ marginBottom: '10px' }}>
                                                        <div>運費:</div>
                                                        <div>{toShowablePrice(deliveryFee)}</div>
                                                    </div>
                                                    <div className="spaceBetween" style={{ marginBottom: '10px' }}>
                                                        <div>合計:</div>
                                                        <div>{toShowablePrice(total_price + deliveryFee)}</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </>
                            )}
                        </div>
                        <div className={s.info}>
                            <div className={s.section}>
                                <Section title='顧客資料' className='marginBottom20'>
                                    {!user && (
                                        <React.Fragment>
                                            <div className="marginBottom15">已經是會員？登入後可以更方便管理訂單！</div>
                                            <Button
                                                className="themeButton marginBottom15"
                                                type="primary"
                                                onClick={() => router.push('/login')}
                                            >
                                                會員登入
                                            </Button>
                                        </React.Fragment>
                                    )}
                                    <div className="marginBottom5">顧客名稱</div>
                                    <Input
                                        maxLength={100}
                                        className={!checkoutData.customer_name && s.emptyInput}
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        onChange={(e) => onChangeCheckoutData('customer_name', e.target.value)}
                                        value={checkoutData.customer_name}
                                    />
                                    {!checkoutData.customer_name && (
                                        <div style={{ color: '#ff0000' }} className="marginBottom5">顧客名稱 是必須的</div>
                                    )}
                                    <div className="marginBottom5">電郵</div>
                                    <Input
                                        maxLength={100}
                                        className={!checkoutData.email && s.emptyInput}
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        onChange={(e) => onChangeCheckoutData('email', e.target.value)}
                                        placeholder="請填入訂單通知Email (訂單資訊將以此E-mail通知您)"
                                        value={checkoutData.email}
                                    />
                                    {!checkoutData.email && (
                                        <div style={{ color: '#ff0000' }} className="marginBottom5">電子信箱 是必須的</div>
                                    )}
                                    <div className="marginBottom5">電話號碼</div>
                                    <PhoneInput
                                        maxLength={20}
                                        country='hk'
                                        className={!checkoutData.phone_number && s.emptyInput}
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        onChange={(phone) => onChangeCheckoutData('phone_number', phone)}
                                        value={checkoutData.phone_number}
                                    />
                                    {!checkoutData.phone_number && (
                                        <div style={{ color: '#ff0000' }} className="marginBottom5">顧客電話號碼 是必須的</div>
                                    )}
                                </Section>
                                <Section title='訂單備註' className='marginBottom20'>
                                    <Input.TextArea
                                        maxLength={500}
                                        style={{ width: '100%' }}
                                        onChange={(e) => onChangeCheckoutData('remarks', e.target.value)}
                                        placeholder="有什麼想告訴賣家嗎？"
                                        value={checkoutData.remarks}
                                    />
                                </Section>
                            </div>
                            <div className={s.section}>
                                <Section title='送貨資料' className='marginBottom20'>
                                    <div className="marginBottom5">已選擇的送貨方式: {getDeliveryName(deliveryMethod)} {!!isFreeShipping && "(免運費)"}</div>
                                    {deliveryMethod.includes("sf") && (
                                        <React.Fragment>
                                            <div className="marginBottom5">收貨地址:</div>
                                            <Input.TextArea
                                                maxLength={100}
                                                className={!checkoutData.address && s.emptyInput}
                                                style={{ width: '100%', marginBottom: '5px' }}
                                                onChange={(e) => onChangeCheckoutData('address', e.target.value)}
                                                value={checkoutData.address}
                                            />
                                            {!checkoutData.address && (
                                                <div style={{ color: '#ff0000' }} className="marginBottom5">收貨地址是必須的</div>
                                            )}
                                        </React.Fragment>
                                    )}
                                    <div className="marginBottom5">
                                        <Checkbox
                                            onChange={(e) => isSameData(e.target.checked)}
                                        />
                                        <span>收件人資料與顧客資料相同</span>
                                    </div>
                                    <div className="marginBottom5">收件人名稱</div>
                                    <Input
                                        maxLength={100}
                                        className={!checkoutData.recipient_name && s.emptyInput}
                                        style={{ width: '100%', marginBottom: '5px' }}
                                        onChange={(e) => onChangeCheckoutData('recipient_name', e.target.value)}
                                        value={checkoutData.recipient_name}
                                    />
                                    {!checkoutData.recipient_name && (
                                        <div style={{ color: '#ff0000' }} className="marginBottom5">請填入收件人真實姓名，以確保順利收件</div>
                                    )}
                                    <div className="marginBottom5">收件人電話號碼</div>
                                    <PhoneInput
                                        maxLength={20}
                                        country='hk'
                                        className={!checkoutData.recipient_phone_number && s.emptyInput}
                                        style={{ width: '100%', marginBottom: '15px' }}
                                        onChange={(phone) => onChangeCheckoutData('recipient_phone_number', phone)}
                                        value={checkoutData.recipient_phone_number}
                                    />
                                    {!checkoutData.recipient_phone_number && (
                                        <div style={{ color: '#ff0000' }} className="marginBottom5">請填入收件人真實姓名，以確保順利收件</div>
                                    )}
                                    <div className="marginBottom5" style={{ borderTop: '1px solid #e1e1e1', paddingTop: '15px' }}>到貨時間</div>
                                    <div>預訂貨品的發貨期可見貨品標題（於訂單email及網站皆可見。）發貨期只供參考，若因供應商遲出貨，或物流延誤，會另行通知客人，但恕不能退款。 關於預訂單品，趕時間者慎拍。</div>
                                </Section>
                                <Section title='付款資料' className='marginBottom20'>
                                    已選擇的付款方式: {getPaymentName(paymentMethod)}
                                </Section>
                            </div>
                        </div>
                        <div className="marginBottom5">
                            <Checkbox
                                style={{ marginRight: '5px' }}
                                checked={checkoutData.is_agree_policy}
                                onChange={(e) => onChangeCheckoutData('is_agree_policy', e.target.checked)}
                            />
                            我同意網站服務條款及隱私權政策
                        </div>
                        {/* <div className="marginBottom5">
                        <Checkbox
                            style={{ marginRight: '5px' }}
                            checked={checkoutData.is_to_member}
                            onChange={(e) => onChangeCheckoutData('is_to_member', e.target.checked)}
                        />
                        成為 Warm home 的會員
                    </div> */}
                        <div className="marginBottom5">
                            <Checkbox
                                style={{ marginRight: '5px' }}
                                checked={checkoutData.is_get_promotion}
                                onChange={(e) => onChangeCheckoutData('is_get_promotion', e.target.checked)}
                            />
                            我願意接收 Warm home 的最新消息、優惠及服務推廣相關資訊
                        </div>
                        <Button onClick={onCheckOut} disabled={isError} className="thirdButton">前往結帳</Button>
                    </div>
                </Spin>
            </MainLayout>
        </>
    )
}

export default Checkout