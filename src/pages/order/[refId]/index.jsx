'use client'
import React, { useState, useMemo, useEffect } from "react";
import { Button, Table, Steps, Space, Col, Row, Spin, Modal, Input, Upload, notification, Rate } from "antd";
import { useRouter } from 'next/router'
import { SERVER_URL } from '../../../constants/constants';
import axios from "axios";
import { toShowablePrice, getOrderStatus, getDeliveryStatus, getPaymentStatus, getDeliveryDescription, getPaymentName, getDeliveryName, getDeliveryLocation } from '../../../utilities/utilities'
import s from './Order.module.scss';
import { UpOutlined, CheckCircleTwoTone, UploadOutlined, FormOutlined, PlusOutlined } from '@ant-design/icons';
import _ from 'lodash'
import moment from "moment";
import MainLayout from "../../../components/homePage/MainLayout";
import Image from "next/image";
import useWindowSize from '../../../utilities/useWindowSize';
import Section from '../../../components/Section';
import { useSelector } from "react-redux";

const Order = () => {

    const ROWGAP = 8

    const [api, contextHolder] = notification.useNotification();
    const router = useRouter()
    const windowSize = useWindowSize();
    const [isShowCart, setIsShowCart] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [isCreatingComment, setIsCreatingComment] = useState(false)
    const [commentProduct, setCommentProduct] = useState(null)
    const [fileList, setFileList] = useState([])
    const [orderData, setOrderData] = useState([])
    const [cartData, setCartData] = useState([])
    const [orderDetail, setOrderDetail] = useState([])

    const user = useSelector(state => state.global.user)
    console.log('router', router.query)
    const refId = router?.query?.refId

    const [commentData, setCommentData] = useState({
        content: "",
        rate: 5
    })

    const isAvailableComment = !!user && orderDetail.status === 3

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
                        <div>{record.product_title}</div>
                        <div>
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
            render: (text, record) => (
                <>
                    <div>{text}</div>
                    {!!record.pre_order && (
                        <div className="preOrder">
                            {Math.abs(record.pre_order)}件預購
                        </div>
                    )}
                </>
            ),
        },
        {
            title: '小計',
            dataIndex: 'total_price',
            render: (text, record) => (
                <div>{toShowablePrice(_.get(record, 'markdown_price', record.original_price) * record.added_quantity)}</div>
            ),
        },
        {
            title: '',
            dataIndex: 'action',
            render: (text, record) => (
                <>
                    {isAvailableComment && (
                        <Button
                            onClick={() => handleCommentProduct(record)}>
                            <FormOutlined />
                            建立評價
                        </Button>
                    )}
                </>
            ),
        },
    ];

    const submitComment = () => {
        const token = user.token
        let axiosData = {
            url: `${SERVER_URL}/product/review`,
            method: "POST",
            data: {
                content: commentData.content,
                product_option_id: commentProduct.product_option_id,
                review_images_data: fileList.flatMap((value) => _.get(value, 'response', []).map((e) => e.refId)),
                rate: commentData.rate,
                order_id: orderDetail.refId
            }
        }
        if (!!token) {
            axiosData.headers = {
                "Authorization": `token ${token}`
            }
        }
        axios(axiosData)
            .then((res) => {
                api.info({
                    message: '評價成功',
                    duration: 2
                })
                setIsCreatingComment(false)
            })
            .catch((err) => {
                api.info({
                    message: '評價失敗',
                    duration: 2
                })
                console.log('err', err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const onCreditCardPayment = () => {
        let payment_method
        switch (orderData.payment_method) {
            case "credit_card":
                payment_method = "card"
                break;
            default:
                payment_method = orderData.payment_method
                break;
        }
        setIsLoading(true)
        axios({
            url: `${SERVER_URL}/order/payment/stripe`,
            method: "POST",
            data: {
                url: window.location.href.split('?')[0],
                order: orderData,
                refId,
                is_user: is_user,
                payment_method,
                delivery_method: orderData.delivery_method
            }
        })
            .then((res) => {
                router.push(res.data.url)
            })
            .catch((err) => {
                console.log('err', err)
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const payment_status = useMemo(() => (
        getPaymentStatus(orderDetail.payment_status)
    ), [orderDetail])

    const is_user = useMemo(() => {
        return !!orderDetail.user
    }, [orderDetail])

    const handleChangeUpload = ({ fileList: newFileList }) => {
        setFileList(newFileList)
    };

    const handleCommentData = (key, value) => {
        let newCommentData = { ...commentData }
        newCommentData[key] = value
        setCommentData(newCommentData)
    }

    const uploadButton = (
        <div>
            <PlusOutlined />
            <div
                style={{
                    marginTop: 8,
                }}
            >
                Upload
            </div>
        </div>
    );

    const handleCommentProduct = (product) => {
        setIsCreatingComment(true)
        setCommentProduct(product)
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
                    setCartData(data.order)
                    setOrderDetail(res.data)
                })
                .finally(() => {
                    setIsLoading(false)
                })
        }
    }, [refId])

    return (
        <MainLayout>
            {contextHolder}
            {!!commentProduct && (
                <Modal
                    open={isCreatingComment}
                    onCancel={() => setIsCreatingComment(false)}
                    onOk={submitComment}
                    style={{
                        top: 10,
                    }}
                    okText="確認"
                    cancelText="取消"
                >
                    <Space className="marginBottom10" gutter={8} style={{ marginTop: "10px" }}>
                        <Image
                            width={60}
                            height={60}
                            src={commentProduct.image}
                            alt={commentProduct.title}
                            sizes="100vw"
                        />
                        <div >
                            <div className={s.productTitle}>{commentProduct.product_title}</div>
                            <div className={s.productOptionTitle}>{commentProduct.title}</div>
                        </div>
                    </Space>
                    <Space className="marginBottom10" gutter={8} style={{ marginTop: "10px" }}>
                        <div className={s.rowLeft}>分數</div>
                        <Rate
                            onChange={(value) => handleCommentData("rate", value)}
                            value={commentData.rate}
                        />
                    </Space>
                    <Space.Compact className="marginBottom10" align="start" style={{ width: "100%", gap: "8px" }}>
                        <div className={s.rowLeft}>評價</div>
                        <Input.TextArea
                            style={{ width: "90%" }}
                            value={commentData.content}
                            onChange={(e) => handleCommentData("content", e.target.value)}
                        />
                    </Space.Compact >
                    <Space className="marginBottom10" align="start" gutter={8}>
                        <div className={s.rowLeft}>上傳圖片</div>
                        <Upload
                            listType="picture-card"
                            fileList={fileList}
                            onChange={handleChangeUpload}
                            action={`${SERVER_URL}/image/image`}
                            onPreview={(file) => {
                                console.log('file', file)
                                window.open(file.response[0].high_resolution)
                            }}
                        >
                            {fileList.length >= 5 ? null : uploadButton}
                        </Upload>
                    </Space>
                </Modal>
            )}
            <Spin spinning={isLoading}>
                <div className="max1500">
                    <Steps
                        current={3}
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
                        <div className={s.title}>合計: {toShowablePrice(orderData.total_price + _.get(orderData, 'delivery_fee', 0))}</div>
                        <div onClick={() => setIsShowCart(prev => !prev)}>
                            <span style={{ marginRight: '5px' }}>購物車 ({cartData.length}件)</span>
                            <UpOutlined className={isShowCart ? s.rotateDown : s.rotateUp} />
                        </div>
                        {isShowCart && (
                            <>
                                {windowSize.width < 768 ? (
                                    <Section title={`購物車 (${cartData.length}件)`} style={{ width: '100%', marginTop: '10px' }}>
                                        {cartData.map((value) => {
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
                                                        <div className={s.cartRight}>
                                                            <div>
                                                                {!!_.get(value, 'markdown_price', null) ? (
                                                                    <React.Fragment>
                                                                        <div className="SellingPrice">{toShowablePrice(value.markdown_price)}</div>
                                                                        <div className="originalPrice">{toShowablePrice(value.original_price)}</div>
                                                                    </React.Fragment>
                                                                ) : (
                                                                    <div className="onlyOriginalPrice">{value.original_price}</div>
                                                                )}
                                                            </div>
                                                            <div style={{ fontSize: '18px', marginBottom: '10px' }}>
                                                                <div>{toShowablePrice(value.added_quantity * _.get(value, 'markdown_price', value.original_price))}</div>
                                                            </div>
                                                            {!!value.pre_order && (
                                                                <div className="preOrder">
                                                                    {Math.abs(value.pre_order)}件預購
                                                                </div>
                                                            )}
                                                            {isAvailableComment && (
                                                                <Button
                                                                    onClick={() => handleCommentProduct(value)}>
                                                                    <FormOutlined />
                                                                    建立評價
                                                                </Button>
                                                            )}
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
                                            dataSource={[...cartData]}
                                            pagination={false}
                                            style={{ marginTop: '10px' }}
                                        />
                                        <div className={s.floatRoot}>
                                            <div className={s.checkoutInfo}>
                                                <div className="spaceBetween" style={{ marginBottom: '10px' }}>
                                                    <div>小計:</div>
                                                    <div>{toShowablePrice(orderData.total_price)}</div>
                                                </div>
                                                <div className="spaceBetween" style={{ marginBottom: '10px' }}>
                                                    <div>運費:</div>
                                                    <div>{toShowablePrice(_.get(orderData, 'delivery_fee', 0))}</div>
                                                </div>
                                                <div className="spaceBetween" style={{ marginBottom: '10px' }}>
                                                    <div>合計:</div>
                                                    <div>{toShowablePrice(orderData.total_price + _.get(orderData, 'delivery_fee', 0))}</div>
                                                </div>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </>
                        )}
                        <div className={s.orderData}>
                            <Space align="start">
                                <CheckCircleTwoTone style={{ fontSize: '48px' }} twoToneColor="#52c41a" />
                                <div style={{ textAlign: 'left' }}>
                                    <div className={s.orderTitle}>謝謝您！您的訂單已經成立！</div>
                                    <div className="marginBottom15">訂單號碼 {orderDetail.order_id}</div>
                                    <div>訂單確認電郵已經發送到您的電子郵箱:</div>
                                    <div className="marginBottom5">{orderData.email}</div>
                                    {orderData.payment_method === "credit_card" ? (
                                        <Button
                                            onClick={onCreditCardPayment}
                                        >
                                            <UploadOutlined />
                                            前往付款
                                        </Button>
                                    ) : (
                                        <Button
                                            onClick={() =>
                                                router.push(`/order/${orderDetail.refId}/order_payment`)
                                            }>
                                            <UploadOutlined />
                                            付款並上傳明細
                                        </Button>
                                    )}
                                </div>
                            </Space>
                            <div className={s.spaceBewteen} style={{ width: '100%', marginTop: '20px' }}>
                                <div className={s.section}>
                                    <div className={s.title}>訂單資訊</div>
                                    <Row gutter={ROWGAP} >
                                        <Col sm={8}>訂單日期:</Col >
                                        <Col sm={8}>{moment(orderDetail.created).format('YYYY-MM-DD h:mm:ss a')}</Col >
                                    </Row >
                                    <Row gutter={ROWGAP} >
                                        <Col sm={8}>訂單狀態:</Col >
                                        <Col sm={8}>{getOrderStatus(orderDetail.status)}</Col >
                                    </Row >
                                </div>
                                <div className={s.section}>
                                    <div className={s.title}>顧客資訊</div>
                                    <Row gutter={ROWGAP} >
                                        <Col sm={8}>名稱:</Col >
                                        <Col sm={8}>{orderData.customer_name}</Col >
                                    </Row >
                                    <Row gutter={ROWGAP} >
                                        <Col sm={8}>電話號碼:</Col >
                                        <Col sm={8}>{orderData.phone_number}</Col >
                                    </Row >
                                </div>
                            </div>
                            <div className={s.spaceBewteen} style={{ width: '100%', marginTop: '20px' }}>
                                <div className={s.section}>
                                    <div className={s.title}>送貨資訊</div>
                                    <Row gutter={ROWGAP} >
                                        <Col sm={8}>收件人名稱:</Col >
                                        <Col sm={8}>{orderData.recipient_name}</Col >
                                    </Row >
                                    <Row gutter={ROWGAP} >
                                        <Col sm={8}>收件人電話號碼:</Col >
                                        <Col sm={8}>{orderData.recipient_phone_number}</Col >
                                    </Row >
                                    <Row gutter={ROWGAP} >
                                        <Col sm={8}>送貨方式:</Col >
                                        <Col sm={8}>{getDeliveryName(orderData.delivery_method)}</Col >
                                    </Row >
                                    <Row gutter={ROWGAP} >
                                        <Col sm={8}>送貨狀態:</Col >
                                        <Col sm={8}>{getDeliveryStatus(orderDetail.delivery_status)}</Col >
                                    </Row >
                                    <Row gutter={ROWGAP} >
                                        <Col sm={8}>送貨地點:</Col >
                                        <Col sm={8}>{getDeliveryLocation(_.get(orderData, "delivery_location", "hk"))}</Col >
                                    </Row >
                                    <Row gutter={ROWGAP} >
                                        <Col sm={8}>送貨地址:</Col >
                                        <Col sm={8}>{orderData.address}</Col >
                                    </Row >
                                    <Row gutter={ROWGAP} >
                                        <Col sm={8}>送貨方式簡介:</Col >
                                        <Col sm={8}>{getDeliveryDescription(orderData.delivery_method)}</Col >
                                    </Row >
                                </div>
                                <div className={s.section}>
                                    <div className={s.title}>付款資訊</div>
                                    <Row gutter={ROWGAP} >
                                        <Col sm={8}>付款方式:</Col >
                                        <Col sm={8}>{getPaymentName(orderData.payment_method)}</Col >
                                    </Row >
                                    <Row gutter={ROWGAP} >
                                        <Col sm={8}>付款狀態:</Col >
                                        <Col sm={8} style={{ color: payment_status === "已付款" ? "#52c41a" : "initial" }}>{payment_status}</Col >
                                    </Row >
                                    <Row gutter={ROWGAP} >
                                        <Col sm={8}>付款指示:</Col >
                                        <Col sm={12}>
                                            {{
                                                "fps": (
                                                    <div>
                                                        <div>轉數快(FPS) ID : 161195847</div>
                                                        <div>轉數快(FPS) 電話號碼: 56235664</div>
                                                        <div>戶口名稱: HUI H*** C***</div>
                                                        <div>收到付款後我地將按訂單給您發貨。溫馨提示：如貨存緊張，我們公司是以入數先後次序寄貨給客人</div>
                                                        <br />
                                                    </div>
                                                ),
                                                "payme": (
                                                    <div>
                                                        <div>按付款後掃code付款</div>
                                                        <div>付款後在訂單備註上傳付款証明[截圖]即可。</div>
                                                        <br />
                                                    </div>
                                                ),
                                                "credit_card": (
                                                    <div>
                                                        <div>按付款後用信用卡付款</div>
                                                        <br />
                                                    </div>
                                                )
                                            }[orderData.payment_method]}
                                            <div>📍包裝盒問題</div>
                                            <div>本店寄出之所有產品確保為全新產品，並不會拆盒檢查。</div>
                                            <div>若產品包裝盒出現刮花/凹陷均為物流過程問題，故不能為包裝問題提供退換服務，敬請體諒。</div>
                                            <div>本店會為產品包上泡泡紙以作物流保護，惟物流依然有機會令包裝盒有損傷，故若有介意，請盡量到面交。</div>
                                            <br />
                                            <div>⚠️其他注意事項:</div>
                                            <div>一經下單付款，訂單不能取消。（請客人下單前先確認訂單內容&一切資料無誤；本店不設任何更改/取消訂單服務)</div>
                                            <div>由客人付款落單起，小店便已向供應商落單並付清貨款。故恕不會因供應商船期 / 貨期延誤而退款（所有預訂貨品到貨日期只供參考，亦有機會延遲出貨，並不會因此理由而退款🙏🏻）</div>
                                            <div>發貨日按工作天計算 (不包括星期六日及公眾假期)</div>
                                            <div>若產品表面有輕微出廠瑕疵，而其瑕疵不影響使用，恕不能退換 。</div>
                                            <div>如需退換貨，請確保商品及其包裝完整。</div>
                                            <div>現時到貨日期或受疫情影響而有所延遲，敬請留意。</div>
                                        </Col >
                                    </Row >
                                </div>
                            </div>
                            {orderDetail.payment_date && (
                                <div className={s.spaceBewteen} style={{ width: '100%', marginTop: '20px' }}>
                                    <div className={s.section}>
                                        <div className={s.title}>已上傳資料</div>
                                        <Row gutter={ROWGAP} >
                                            <Col sm={8}>付款證明: </Col >
                                            <Col sm={8}>
                                                <Image
                                                    alt="payment image"
                                                    src={orderDetail.payment_image[0].low_resolution}
                                                    width={0}
                                                    height={0}
                                                    sizes="100vw"
                                                    style={{ width: "auto", height: 'auto' }}
                                                />
                                            </Col >
                                        </Row >
                                        <Row gutter={ROWGAP} >
                                            <Col sm={8}>付款備註:</Col >
                                            <Col sm={8}>{orderDetail.payment_remark}</Col >
                                        </Row >
                                        <Row gutter={ROWGAP} >
                                            <Col sm={8}>付款時間:</Col >
                                            <Col sm={8}>{moment(orderDetail.payment_date).format('YYYY-MM-DD')}</Col >
                                        </Row >
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Spin>
        </MainLayout>
    )
}

export default Order