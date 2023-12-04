'use client';
import React from "react";
import ProductGrid from '../productGrid/ProductGrid';
import TopThreeProduct from '../topThreeProduct/TopThreeProduct';
import ProductGridSwiper from '../productGrid/ProductGridSwiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Autoplay } from "swiper";
import Image from "next/image";
import { prefix } from "../../constants/constants";

const Layout = ({
    product,
    total,
    topThereProduct,
    isStockProduct
}) => {

    return (
        <div>
            <Swiper
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                }}
                className="mySwiper"
                modules={[Pagination, Autoplay]}
            // onSlideChange={() => console.log('slide change')}
            // onSwiper={(swiper) => console.log(swiper)}
            >
                <SwiperSlide>
                    <Image priority={true} loading="eager" sizes="100vw" width={0} height={0} className="banner" src={`images/banner/banner2.webp`} alt="member promotion" />
                </SwiperSlide>
                <SwiperSlide>
                    <Image priority={true} loading="eager" sizes="100vw" width={0} height={0} className="banner" src={`images/banner/memberOnly.webp`} alt="member promotion" />
                </SwiperSlide>
                <SwiperSlide>
                    <Image priority={true} loading="eager" sizes="100vw" width={0} height={0} className="banner" src={`images/banner/freeShipping.webp`} alt="buy $500 free shipping" />
                </SwiperSlide>
                <SwiperSlide>
                    <Image priority={true} loading="eager" sizes="100vw" width={0} height={0} className="banner" src={`images/banner/banner0.webp`} alt="product banner" />
                </SwiperSlide>
            </Swiper>
            <TopThreeProduct
                product={topThereProduct}
            />
            <ProductGridSwiper
                product={isStockProduct}
            />
            <ProductGrid
                product={product}
                totalSize={total}
                isMainPage
            />
        </div>
    )
}

export default Layout