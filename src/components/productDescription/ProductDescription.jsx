"use client"
import React, { useEffect, useState, useMemo } from 'react'
import s from './ProductDescription.module.scss';
import { Avatar, Button, InputNumber, Pagination, Rate, Space, Tabs, notification } from 'antd';
import { UserOutlined } from "@ant-design/icons";
import _ from 'lodash'
import MainLayout from '../homePage/MainLayout';
import { toShowablePrice } from '../../utilities/utilities'
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../service/cart'
import useWindowSize from '../../utilities/useWindowSize'
import { useRouter } from 'next/navigation'
import Image from "next/image";
import moment from 'moment';
import axios from "axios";
import { SERVER_URL } from '../../constants/constants';

const ProductDescription = ({
    product = {}
}) => {

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
    const paymentOption = ['FPS轉數快', 'Payme', '信用卡', 'Alipay']

    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedOption, setSelectedOption] = useState(0)
    const [selectedSubOption, setSelectedSubOption] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [showImage, setShowImage] = useState("")
    const [review, setReview] = useState([])
    const [reviewTotal, setReviewTotal] = useState(0)
    const [reviewPage, setReviewPage] = useState(1)
    const [totalRate, setTotalRate] = useState(5)

    const dispatch = useDispatch()
    const windowSize = useWindowSize();
    const router = useRouter()
    const [api, contextHolder] = notification.useNotification();
    const cartData = useSelector(state => state.cart.data)

    const option = useMemo(() => _.get(product, `option[${selectedOption}]`, {}), [product, selectedOption])
    const subOption = useMemo(() => _.get(option, `sub_product_option[${selectedSubOption}]`, {}), [option, selectedSubOption])
    const price = useMemo(() => option.markdown_price || option.original_price || product.markdown_price || product.original_price, [option, product])

    // const availableQuantity = useMemo(() => {
    //     if (cartData) {
    //         const d = cartData.find(() => option.id)
    //         if (d) {
    //             const addedQuantity = d.added_quantity
    //             return option.total_quantity - addedQuantity - quantity
    //         }
    //     }
    //     return option.total_quantity - quantity
    // }, [cartData, quantity, product, option])

    useEffect(() => {
        axios({
            url: `${SERVER_URL}/product/review`,
            method: "GET",
            params: {
                product_title: decodeURI(product.title),
                page: reviewPage
            }
        })
            .then((res) => {
                setReview(res.data.results)
                setReviewTotal(res.data.count)
                setTotalRate(res.data.total_rate)
            })
    }, [reviewPage])

    const items = [
        {
            key: '1',
            label: `商品描述`,
            children: (
                <div className={s.productDescription} dangerouslySetInnerHTML={{ __html: product.description }}></div>
            ),
        },
        {
            key: '2',
            label: `送貨及付款方式`,
            children: (
                <div className={s.paymentDelivery}>
                    <div className={s.chlid}>
                        <div className={s.title}>送貨方式</div>
                        {deliveryOption.map((value) => (
                            <div key={value.value}>{value.label}</div>
                        ))}
                    </div>
                    <div className={s.chlid}>
                        <div className={s.title}>付款方式</div>
                        {paymentOption.map((value) => (
                            <div key={value}>{value}</div>
                        ))}
                    </div>
                </div>
            ),
        },
        {
            key: '3',
            label: `顧客評價`,
            children: (
                <>
                    {review.length > 0 ? (
                        <>
                            <div className={s.rateView}>
                                <div>{Math.round(totalRate * 2) / 2} / 5</div>
                                <Rate
                                    disabled
                                    defaultValue={totalRate}
                                />
                            </div>
                            <div className={s.reviewContainer} >
                                {review.map((value) => {
                                    return (
                                        <Space key={value.user.username} align='start' className={s.card}>
                                            <Avatar size="large" icon={<UserOutlined />} />
                                            <div>
                                                <div>{value.user.username.substring(0, 3)}***</div>
                                                <Rate
                                                    disabled
                                                    defaultValue={value.rate}
                                                />
                                                <div className={s.productOptionTitle}>
                                                    {moment(value.updated).format("YYYY-MM-DD h:mm:ss a")} | {value.product_option_title}
                                                </div>
                                                <div>{value.content}</div>
                                                <Space>
                                                    {value.review_image.map((value) => {
                                                        return (
                                                            <Image
                                                                key={value.low_resolution}
                                                                src={value.low_resolution}
                                                                alt={value.product_option_title}
                                                                sizes="100vw"
                                                                width={0}
                                                                height={0}
                                                                style={{ width: '100%', maxHeight: '200px', height: 'auto' }}
                                                                priority={true}
                                                            />
                                                        )
                                                    })}
                                                </Space>
                                            </div>
                                        </Space>
                                    )
                                })}
                            </div>
                            <Pagination
                                style={{ textAlign: 'right' }}
                                total={reviewTotal}
                                onChange={(page) => setReviewPage(page)}
                                pageSize={28}
                            />
                        </>
                    ) : (
                        "尚未有任何評價"
                    )}
                </>
            ),
        },
    ];

    const onAddToCart = () => {
        let newOption = { ...option }
        newOption.added_quantity = quantity;
        newOption.image = product.product_images[0].low_resolution
        newOption.product_title = product.title
        newOption.sub_option = subOption
        dispatch(addToCart(newOption))
        api.success({
            message: '成功加入購物車',
            duration: 3
        })
    }

    useEffect(() => {
        if (selectedImage !== -1) {
            if (!!_.get(product, `product_images[${selectedImage}].low_resolution`, null)) {
                setShowImage(_.get(product, `product_images[${selectedImage}].low_resolution`))
            }
        }
    }, [product, selectedImage])

    useEffect(() => {
        if (!!_.get(product, 'product_video.url', null)) {
            setSelectedImage(-1)
        }
    }, [product])

    return (
        <React.Fragment>
            <MainLayout>
                {Object.keys(product).length !== 0 && (
                    <React.Fragment>
                        {contextHolder}
                        {windowSize.width < 1000 ? (
                            <div className={s.productDescriptionContainer}>
                                <div style={{ textAlign: 'center' }}>
                                    {showImage === product.product_video.url ? (
                                        <video width={350} height={350} autoPlay muted loop controls >
                                            <source src={showImage} type="video/mp4" />
                                        </video>
                                    ) : (
                                        <Image
                                            src={showImage}
                                            alt={product.title}
                                            sizes="100vw"
                                            width={0}
                                            height={0}
                                            style={{ width: '100%', maxHeight: '800px', height: 'auto' }}
                                            priority={true}
                                        />
                                    )}

                                </div>
                                <Space align="start" className={s.imageFlex}>
                                    {_.get(product, 'product_video.url', null) && (
                                        <div
                                            key={`${product.title}video`}
                                            onClick={() => setSelectedImage(-1)}
                                            className={selectedImage === -1 && s.selectedImage}
                                        >
                                            <video width={72} height={72} autoplay>
                                                <source src={product.product_video.url} type="video/mp4" />
                                            </video>
                                        </div>
                                    )}
                                    {product.product_images.map((value, index) => (
                                        <div
                                            key={`${product.title}${index}`}
                                            onClick={() => setSelectedImage(index)}
                                            className={selectedImage === index && s.selectedImage}
                                        >
                                            <Image
                                                src={value.low_resolution}
                                                alt={product.title}
                                                width={72}
                                                height={72}
                                                sizes="100vw"
                                                priority={true}
                                            />
                                        </div>
                                    ))}
                                </Space>
                                <div className={s.productDetail}>
                                    <h1 className={s.title}>{product.title}</h1>
                                    <Space>
                                        <div className={s.SellingPrice}>{toShowablePrice(price)}</div>
                                        {!!_.get(option, 'markdown_price', null) &&
                                            parseFloat(option.markdown_price) < parseFloat(option.original_price) && (
                                                <div className={s.originalPrice}>{toShowablePrice(option.original_price)}</div>
                                            )}
                                    </Space>
                                    <div className={s.variationTitle}>款式 : {option.title}</div>
                                    <Space className={s.optionList} wrap>
                                        {product.option.map((value, index) => {
                                            return (
                                                <Button
                                                    key={`${value.title}${index}`}
                                                    onClick={() => {
                                                        if (_.get(value, 'product_option_image.low_resolution', null)) {
                                                            setSelectedImage(-1)
                                                            setShowImage(_.get(value, 'product_option_image.low_resolution', ""))
                                                        }
                                                        setSelectedOption(index)
                                                    }
                                                    }
                                                    className={selectedOption === index && s.selectedButton}
                                                >
                                                    {value.title}
                                                </Button>
                                            )
                                        })}
                                    </Space>
                                    {!!option.sub_product_option && option.sub_product_option.length > 0 && (
                                        <React.Fragment>
                                            <div className={s.variationTitle}>款式 : {subOption.title}</div>
                                            <Space className={s.optionList} wrap>
                                                {option.sub_product_option.map((value, index) => {
                                                    return (
                                                        <Button
                                                            key={`${value.title}${index}`}
                                                            onClick={() => {
                                                                setSelectedSubOption(index)
                                                            }
                                                            }
                                                            className={selectedSubOption === index && s.selectedButton}
                                                        >
                                                            {value.title}
                                                        </Button>
                                                    )
                                                })}
                                            </Space>
                                        </React.Fragment>
                                    )}
                                    <div className={s.count}>數量</div>
                                    <div>
                                        <InputNumber
                                            min={1}
                                            max={option.quantity}
                                            value={quantity}
                                            onChange={(value) => setQuantity(value)}
                                            style={{ width: '100%' }}
                                        />
                                        {/* {availableQuantity < 0 && (
                                            <div style={{ marginTop: '10px' }} className='preOrder'>{Math.abs(availableQuantity)}件預購</div>
                                        )} */}
                                    </div>
                                    <Space className={s.Space}>
                                        <Button
                                            className={s.checkOutButton}
                                            danger
                                            type='primary'
                                            onClick={onAddToCart}
                                        >加入購物車</Button>
                                        <Button
                                            className={s.checkOutButton}
                                            type='primary'
                                            onClick={() => {
                                                onAddToCart()
                                                router.push("/cart")
                                            }}
                                        >
                                            立即購買
                                        </Button>
                                    </Space>
                                </div>
                                <Tabs
                                    defaultActiveKey="1"
                                    centered
                                    items={items}
                                />
                            </div>
                        ) : (
                            <div className={s.productDescriptionContainer}>
                                <Space align="start" style={{ marginBottom: '30px' }}>
                                    <div className={s.imageList}>
                                        {_.get(product, 'product_video.url', null) && (
                                            <div
                                                id={`${product.title}video`}
                                                onClick={() => setSelectedImage(-1)}
                                                className={selectedImage === -1 && s.selectedImage}
                                            >
                                                <video width={72} height={72} autoplay>
                                                    <source src={product.product_video.url} type="video/mp4" />
                                                </video>
                                            </div>
                                        )}
                                        {product.product_images.map((value, index) => (
                                            <div
                                                key={`${product.title}${index}`}
                                                onClick={() => setSelectedImage(index)}
                                                className={selectedImage === index && s.selectedImage}
                                            >
                                                <Image
                                                    src={value.low_resolution}
                                                    alt={product.title}
                                                    width={72}
                                                    height={72}
                                                    sizes="100vw"
                                                    priority={true}
                                                />
                                            </div>
                                        ))}
                                    </div>
                                    <div>
                                        {showImage === product.product_video.url ? (
                                            <video width={425} height={425} autoPlay muted loop controls >
                                                <source src={showImage} type="video/mp4" />
                                            </video>
                                        ) : (
                                            <Image
                                                src={showImage}
                                                alt={product.title}
                                                width={425}
                                                height={425}
                                                sizes="100vw"
                                                priority={true}
                                            />
                                        )}
                                    </div>
                                    <div className={s.productDetail}>
                                        <h1 className={s.title}>{product.title}</h1>
                                        <Space>
                                            <div className={s.SellingPrice}>{toShowablePrice(price)}</div>
                                            {!!_.get(option, 'markdown_price', null) &&
                                                parseFloat(option.markdown_price) < parseFloat(option.original_price) && (
                                                    <div className={s.originalPrice}>{toShowablePrice(option.original_price)}</div>
                                                )}
                                        </Space>
                                        <div className={s.variationTitle}>款式 : {option.title}</div>
                                        <Space className={s.optionList} wrap>
                                            {product.option.map((value, index) => {
                                                return (
                                                    <Button
                                                        key={`${value.title}${index}`}
                                                        onClick={() => {
                                                            if (_.get(value, 'product_option_image.low_resolution', null)) {
                                                                setSelectedImage(-1)
                                                                setShowImage(_.get(value, 'product_option_image.low_resolution', ""))
                                                            }
                                                            setSelectedOption(index)
                                                        }
                                                        }
                                                        className={selectedOption === index && s.selectedButton}
                                                    >
                                                        {value.title}
                                                    </Button>
                                                )
                                            })}
                                        </Space>
                                        {!!option.sub_product_option && option.sub_product_option.length > 0 && (
                                            <React.Fragment>
                                                <div className={s.variationTitle}>款式 : {subOption.title}</div>
                                                <Space className={s.optionList} wrap>
                                                    {option.sub_product_option.map((value, index) => {
                                                        return (
                                                            <Button
                                                                key={`${value.title}${index}`}
                                                                onClick={() => {
                                                                    setSelectedSubOption(index)
                                                                }
                                                                }
                                                                className={selectedSubOption === index && s.selectedButton}
                                                            >
                                                                {value.title}
                                                            </Button>
                                                        )
                                                    })}
                                                </Space>
                                            </React.Fragment>
                                        )}
                                        <div className={s.count}>數量</div>
                                        <div>
                                            <InputNumber
                                                min={1}
                                                max={option.quantity}
                                                value={quantity}
                                                onChange={(value) => setQuantity(value)}
                                            />
                                            {/* {availableQuantity < 0 && (
                                                <div style={{ marginTop: '10px' }} className='preOrder'>{Math.abs(availableQuantity)}件預購</div>
                                            )} */}
                                        </div>
                                        <Space style={{ marginTop: '10px' }}>
                                            <Button
                                                className={s.checkOutButton}
                                                danger
                                                type='primary'
                                                onClick={onAddToCart}
                                            >加入購物車</Button>
                                            <Button
                                                className={s.checkOutButton}
                                                type='primary'
                                                onClick={() => {
                                                    onAddToCart()
                                                    router.push("/cart")
                                                }}
                                            >
                                                立即購買
                                            </Button>
                                        </Space>
                                    </div>
                                </Space>
                                <Tabs
                                    defaultActiveKey="1"
                                    centered
                                    items={items}
                                    tabBarGutter={300}
                                />
                            </div>
                        )}
                    </React.Fragment>
                )}
            </MainLayout>
        </React.Fragment>
    )
}

export default ProductDescription
