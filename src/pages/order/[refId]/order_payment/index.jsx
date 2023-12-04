'use client'
import React, { useState, useEffect } from "react";
import s from './OrderPayment.module.scss';
import { useRouter } from 'next/router'
import { SERVER_URL, prefix } from '../../../../constants/constants';
import axios from "axios";
import { toShowablePrice, getPaymentName } from '../../../../utilities/utilities'
import { Upload, message, Spin, DatePicker, Input, Button, notification } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import Image from "next/image";

const OrderPayment = () => {

    const router = useRouter()
    const { Dragger } = Upload;
    const [api, contextHolder] = notification.useNotification();
    const [uploadedImage, setUploadedImage] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [uploadData, setUploadData] = useState({
        payment_image: "",
        payment_date: "",
        payment_remark: ""
    })
    const [orderData, setOrderData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const refId = router?.query?.refId

    const onChangeUploadData = (key, value) => {
        let newUploadData = { ...uploadData }
        newUploadData[key] = value
        setUploadData(newUploadData)
    }

    const onSubmit = () => {
        if (!uploadData.payment_image) {
            api.warning({
                message: '圖片不能為空',
                duration: 3
            })
            return
        } else if (!uploadData.payment_date) {
            api.warning({
                message: '付款時間不能為空',
                duration: 3
            })
            return
        }
        setIsUploading(true)
        axios({
            url: `${SERVER_URL}/order/order/${refId}`,
            method: "POST",
            data: {
                payment_remark: uploadData.payment_remark,
                payment_image: [uploadData.payment_image],
                payment_date: uploadData.payment_date.unix()
            }
        })
            .then((res) => {
                api.success({
                    message: '已成功上傳明細',
                    duration: 3
                })
                router.push(`/order/${refId}`)
            })
            .catch((res) => {
                api.error({
                    message: '上傳失敗',
                    duration: 3
                })
            })
            .finally(() => {
                setIsUploading(false)
            })
    }

    useEffect(() => {
        if (!!refId) {
            setIsLoading(true)
            axios({
                url: `${SERVER_URL}/order/order/${refId}`,
                method: "GET"
            })
                .then((res) => {
                    const data = JSON.parse(res.data.data)
                    setOrderData(data)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }, [refId])

    return (
        <Spin className={s.root} spinning={isLoading}>
            {contextHolder}
            <Spin spinning={isUploading}>
                <div className={s.paymentView}>
                    <div className={s.header}>
                        <Image
                            alt="logo"
                            className={s.logo}
                            src={`images/logo.png`}
                            width={0}
                            height={0}
                            sizes="100vw"
                            style={{ width: "auto", height: 'auto' }}
                        />
                    </div>
                    <div className={s.flex}>
                        <div className={s.row} style={{ borderRight: "1px solid #ddd" }}>
                            <div className={s.amount}>
                                訂單金額
                                {toShowablePrice(orderData.total_price + _.get(orderData, 'delivery_fee', 0))}
                            </div>
                            <div className={s.title}>付款方式</div>
                            <div className="marginBottom15">{getPaymentName(orderData.payment_method)}</div>
                            <div className={s.title}>付款說明</div>
                            {{
                                "fps": (
                                    <React.Fragment>
                                        <div>轉數快(FPS) ID : 161195847</div>
                                        <div>轉數快(FPS) 電話號碼: 56235664</div>
                                        <div>戶口名稱: HUI H*** C***</div>
                                    </React.Fragment>
                                ),
                                "payme": (
                                    <React.Fragment>
                                        <div>
                                            <Image
                                                alt="payme code"
                                                src={`images/payme.jpg`}
                                                width={0}
                                                height={0}
                                                sizes="100vw"
                                                style={{ width: "100%", height: 'auto' }}
                                            />
                                        </div>
                                    </React.Fragment>
                                ),
                                "alipay": (
                                    <React.Fragment>
                                        <div>
                                            <Image
                                                alt="alipay code"
                                                src={`images/alipay.jpeg`}
                                                width={0}
                                                height={0}
                                                sizes="100vw"
                                                style={{ width: "100%", height: 'auto' }}
                                            />
                                        </div>
                                    </React.Fragment>
                                )
                            }[orderData.payment_method]}
                        </div>
                        <div className={s.row}>
                            <div className={s.title}>
                                完成轉帳後，請上傳轉帳明細
                            </div>
                            <Dragger
                                style={{ padding: '5px 10px' }}
                                className="marginBottom15"
                                action={`${SERVER_URL}/image/image`}
                                onChange={(info) => {
                                    const { status } = info.file
                                    if (status === 'uploading') {
                                        message.info('上傳中');
                                        setIsUploading(true)
                                    }
                                    if (status === 'done') {
                                        message.success('成功上傳');
                                        setUploadedImage(info.file)
                                        setIsUploading(false)
                                        onChangeUploadData('payment_image', info.file.response[0].refId)
                                    }
                                    if (status === 'error') {
                                        message.error('上傳失敗');
                                        setIsUploading(false)
                                    }
                                }}
                                showUploadList={false}
                            >
                                <p className="ant-upload-drag-icon">
                                    <UploadOutlined />
                                </p>
                                <p className="ant-upload-text">上傳轉帳明細</p>
                                <p className="ant-upload-hint">
                                    請確認圖片清晰，並包含轉帳後五碼、轉帳時間、轉帳金額
                                </p>
                            </Dragger>
                            {uploadedImage && (
                                <div className={s.title} style={{ marginBottom: '15px' }}>
                                    <div className="marginBottom5">已上傳圖片</div>
                                    <Image
                                        alt="payment image"
                                        src={uploadedImage.response[0].low_resolution}
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                        style={{ width: "100%", height: 'auto' }}
                                    />
                                </div>
                            )}
                            <div style={{ width: '100%' }} className="marginBottom15">
                                <DatePicker
                                    placeholder="選擇付款時間"
                                    value={uploadData.payment_date}
                                    onChange={(value) => {
                                        onChangeUploadData('payment_date', value)
                                    }}
                                />
                            </div>
                            <div style={{ width: '100%' }} className="marginBottom15">
                                <Input.TextArea
                                    maxLength={500}
                                    value={uploadData.payment_remark}
                                    placeholder="填寫付款備註"
                                    onChange={(e) => onChangeUploadData('payment_remark', e.target.value)}
                                />
                            </div>
                            <div style={{ width: '100%' }} className="marginBottom15">
                                <Button className="thirdButton" onClick={onSubmit}>
                                    發送明細給商家
                                </Button>
                            </div>
                            <div>確認款項後，我們將盡速安排發貨！</div>
                            <div>想取得最新訂單資訊，請訂閱</div>
                        </div>
                    </div>
                </div>
            </Spin>
        </Spin>
    )
}

export default OrderPayment