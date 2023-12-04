"use client"

import React, { useCallback, useEffect, useMemo, useState } from 'react'
import s from './ProductCard.module.scss';
import { Button, Modal, Space, InputNumber, notification } from 'antd';
import _ from 'lodash'
import { toShowablePrice } from '../../utilities/utilities'
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../../service/cart'
import useWindowSize from '../../utilities/useWindowSize'
import { SERVER_URL } from '../../constants/constants';
import axios from "axios";
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from "next/image";

const ProductCard = ({
    product,
}) => {

    const [isOnhover, setIsOnhover] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(0)
    const [quantity, setQuantity] = useState(1)
    const [selectedOption, setSelectedOption] = useState(0)
    const [selectedSubOption, setSelectedSubOption] = useState(0)
    const [modalProduct, setModalProduct] = useState({})
    const [showImage, setShowImage] = useState("")

    const [api, contextHolder] = notification.useNotification();

    const dispatch = useDispatch()
    const router = useRouter()
    const windowSize = useWindowSize();
    const cartData = useSelector(state => state.cart.data) | []

    const option = useMemo(() => _.get(modalProduct, `option[${selectedOption}]`, {}), [modalProduct, selectedOption])
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

    const onAddToCart = useCallback(() => {
        let newOption = { ...option }
        newOption.added_quantity = quantity;
        newOption.image = modalProduct.product_images[0].low_resolution
        newOption.product_title = modalProduct.title
        newOption.sub_option = subOption
        dispatch(addToCart(newOption))
        api.success({
            message: '成功加入購物車',
            duration: 3
        })
    }, [option, modalProduct, quantity])

    useEffect(() => {
        if (isModalOpen && Object.keys(modalProduct).length === 0) {
            axios({
                url: `${SERVER_URL}/product/product/${product.title}`,
                method: "GET"
            })
                .then((res) => {
                    setModalProduct(res.data)
                })
        }
    }, [isModalOpen])

    useEffect(() => {
        if (selectedImage !== -1) {
            if (!!_.get(modalProduct, `product_images[${selectedImage}].low_resolution`, null)) {
                setShowImage(_.get(modalProduct, `product_images[${selectedImage}].low_resolution`))
            }
        }
    }, [modalProduct, selectedImage])

    useEffect(() => {
        if (!!_.get(option, 'product_option_image.low_resolution', null)) {
            setShowImage(_.get(option, 'product_option_image.low_resolution', ""))
            setSelectedImage(-1)
        }
    }, [option])

    useEffect(() => {
        let images = document.getElementsByClassName("autoRatioImage")
        for (let i = 0; i < images.length; i++) {
            images[i].style.height = `${images[i].clientWidth}px`
        }
    }, [windowSize.width, selectedImage])

    return (
        <React.Fragment>
            {contextHolder}
            {isModalOpen && Object.keys(modalProduct).length !== 0 && (
                <Modal
                    open={isModalOpen}
                    footer={null}
                    onCancel={() => setIsModalOpen(false)}
                    width={700}
                    closeIcon={false}
                    className={s.modal}
                >
                    {windowSize.width < 768 ? (
                        <div>
                            <div className='spaceBetween' style={{ marginBottom: "10px", gap: "8px" }}>
                                <div style={{ width: '50%' }}>
                                    <Image
                                        src={showImage}
                                        alt={modalProduct.title}
                                        style={{ width: '100%', height: 'auto' }}
                                        className='autoRatioImage'
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                    />
                                </div>
                                <div style={{ width: '50%' }}>
                                    <h2>{modalProduct.title}</h2>
                                    <div className={s.SellingPrice}>{toShowablePrice(price)}</div>
                                    {!!_.get(option, 'markdown_price', null) &&
                                        parseFloat(option.markdown_price) < parseFloat(option.original_price) && (
                                            <div className={s.originalPrice}>{toShowablePrice(option.original_price)}</div>
                                        )}
                                </div>
                            </div>
                            <div className={s.productDetail}>
                                <div className={s.variationTitle}>款式 : {option.title}</div>
                                <Space className={s.optionList} wrap>
                                    {modalProduct.option.map((value, index) => {
                                        return (
                                            <Button key={`${value.title}${index}`} onClick={() => setSelectedOption(index)} className={selectedOption === index && s.selectedButton}>{value.title}</Button>
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
                                <div className="spaceBetween" style={{ marginTop: "10px" }}>
                                    <Button
                                        className={s.checkOutButton}
                                        style={{ width: "49%" }}
                                        danger
                                        type='primary'
                                        onClick={onAddToCart}
                                    >加入購物車</Button>
                                    <Button
                                        className={s.checkOutButton}
                                        style={{ width: "49%" }}
                                        type='primary'
                                        onClick={() => {
                                            onAddToCart()
                                            router.push("/cart")
                                        }}
                                    >
                                        立即購買
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className='spaceBetween'>
                            <div>
                                <div style={{ marginBottom: "10px" }}>
                                    <Image
                                        src={showImage}
                                        alt={modalProduct.title}
                                        style={{ width: '265px', height: 'auto' }}
                                        className='autoRatioImage'
                                        width={0}
                                        height={0}
                                        sizes="100vw"
                                    />
                                </div>
                                <Space wrap>
                                    {modalProduct.product_images.map((value, index) => (
                                        <div
                                            key={`${value.title}${index}`}
                                            onClick={() => setSelectedImage(index)}
                                            className={selectedImage === index && s.selectedImage}
                                        >
                                            <Image
                                                src={value.low_resolution}
                                                alt={modalProduct.title}
                                                width={72}
                                                height={72}
                                                sizes="100vw"
                                            />
                                        </div>
                                    ))}
                                </Space>
                            </div>
                            <div className={s.productDetail}>
                                <h1 className={s.title}>{modalProduct.title}</h1>
                                <Space>
                                    <div className={s.SellingPrice}>{toShowablePrice(price)}</div>
                                    {!!_.get(option, 'markdown_price', null) &&
                                        parseFloat(option.markdown_price) < parseFloat(option.original_price) && (
                                            <div className={s.originalPrice}>{toShowablePrice(option.original_price)}</div>
                                        )}
                                </Space>
                                <div className={s.variationTitle}>款式 : {option.title}</div>
                                <Space className={s.optionList} wrap>
                                    {modalProduct.option.map((value, index) => {
                                        return (
                                            <Button key={`${value.title}${index}`} onClick={() => setSelectedOption(index)} className={selectedOption === index && s.selectedButton}>{value.title}</Button>
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
                        </div>
                    )}
                </Modal>
            )}
            <Link href={`/product/${product.title}`} className={s.ProductCardContainer} style={{ width: `100%`, height: "293.2px" }}>
                <div
                    onMouseEnter={() => setIsOnhover(true)}
                    onMouseLeave={() => setIsOnhover(false)}
                    style={{ position: 'relative' }}
                >
                    {windowSize.width > 768 && isOnhover && (
                        <Button
                            className={s.add_to_cartButton}
                            onClick={(e) => {
                                e.preventDefault()
                                setIsModalOpen(true)
                            }}
                        >
                            加入購物車
                        </Button>
                    )}
                    <Image
                        alt={product.title}
                        style={{ width: "100%", height: 'auto' }}
                        className='autoRatioImage'
                        src={isOnhover && product.product_images.length > 1 ? product.product_images[1].low_resolution : product.product_images[0].low_resolution || '/product_images/nope-not-here.jpg'}
                        width={0}
                        height={0}
                        sizes="100vw"
                    />
                </div>
                <div className={s.title}>{product.title}</div>
                <div className='SellingPrice'>{toShowablePrice(price)}</div>
                {!!_.get(product, 'markdown_price', null) &&
                    _.get(product, 'markdown_price', null) < product.original_price && (
                        <div className='originalPrice'>{toShowablePrice(product.original_price)}</div>
                    )}
            </Link>
            {windowSize.width < 768 && (
                <Button
                    className={s.add_to_cartButton}
                    onClick={(e) => {
                        e.preventDefault()
                        setIsModalOpen(true)
                    }}
                    type='primary'
                >
                    加入購物車
                </Button>
            )}
        </React.Fragment>
    )
}

export default ProductCard