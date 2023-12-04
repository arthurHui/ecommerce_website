"use client"
import React, { useMemo } from "react";
import ProductCard from './ProductCard';
import useWindowSize from '../../utilities/useWindowSize'
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from "swiper";
import { LeftOutlined, RightOutlined } from "@ant-design/icons"
import FadeUp from "../FadeUp/FadeUp";

const ProductGridSwiper = ({
    product = [],
}) => {

    const windowSize = useWindowSize();

    const slidesPerView = useMemo(() => {
        return 3
    }, [windowSize.width])

    return (
        <FadeUp className="max1500" style={{ marginBottom: '10px', textAlign: 'center' }}>
            <div className="promoTitle">
                🔥現貨區🔥
            </div>
            <Swiper
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                navigation={{
                    prevEl: '.prev',
                    nextEl: '.next',
                }}
                className="mySwiper"
                modules={[Navigation, Autoplay]}
                slidesPerView={slidesPerView}
                spaceBetween={20}
            >
                {product.map((value) => {
                    return (
                        <SwiperSlide key={value.title}>
                            <ProductCard
                                product={value}
                            />
                        </SwiperSlide>
                    )
                })}
                <div className="prev">
                    <LeftOutlined />
                </div>
                <div className="next">
                    <RightOutlined />
                </div>
            </Swiper>
        </FadeUp>
    )
}


export default ProductGridSwiper