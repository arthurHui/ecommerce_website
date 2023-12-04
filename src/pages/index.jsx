"use client"
import React, { useEffect, useState } from 'react'
import Layout from '../components/homePage/Layout';
import MainLayout from '../components/homePage/MainLayout';
import { SERVER_URL } from '../constants/constants';
import axios from "axios";
import { NextSeo } from 'next-seo';
import { Spin } from "antd"

export default function Home({
    // topThereProduct,
    // product,
    // total,
    // isStockProduct
}) {

    const [topThereProduct, setTopThereProduct] = useState([])
    const [product, setProduct] = useState([])
    const [isStockProduct, setIsStockProduct] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        try {
            setIsLoading(true)
            axios({
                url: `${SERVER_URL}/product/product?action=top3`,
                method: "GET"
            })
                .then((res) => {
                    setTopThereProduct(res.data.results)
                })

            axios({
                url: `${SERVER_URL}/product/product`,
                method: "GET"
            })
                .then((res) => {
                    setProduct(res.data.results)
                })

            axios({
                url: `${SERVER_URL}/product/product?action=in_stock`,
                method: "GET"
            })
                .then((res) => {
                    setIsStockProduct(res.data)
                })
        }
        catch (err) {
            console.log(err)
        }
        finally {
            setIsLoading(false)
        }

    }, [])

    return (
        <div id='mainLayout' className="main">
            <NextSeo
                title="dev"
                description="dev為你收集世界各地熱門產品，提供各種時尚、實用和高品質的家居用品和日常用品，讓您的生活變得更加溫馨和舒適。"
                openGraph={{
                    url: `https://hkwarmhome.com`,
                    title: "dev",
                    description: "dev為你收集世界各地熱門產品，提供各種時尚、實用和高品質的家居用品和日常用品，讓您的生活變得更加溫馨和舒適。",
                    siteName: 'hkwarmhome',
                }}
            />
            <MainLayout>
                <Spin spinning={isLoading}>
                    <Layout
                        topThereProduct={topThereProduct}
                        isStockProduct={isStockProduct}
                        product={product}
                        total={0}
                    />
                </Spin>
            </MainLayout>
        </div>
    )
}

// export const getServerSideProps = async ({
//     query,
// }) => {
//     const topThereRes = await axios({
//         url: `${SERVER_URL}/product/product?action=top3`,
//         method: "GET"
//     })

//     const page = query.page || 1
//     const allProductRes = await axios({
//         url: `${SERVER_URL}/product/product?page=${page}`,
//         method: "GET"
//     })

//     const inStockProductRes = await axios({
//         url: `${SERVER_URL}/product/product?action=in_stock`,
//         method: "GET"
//     })

//     return {
//         props: {
//             topThereProduct: topThereRes.data.results || null,
//             product: allProductRes.data.results || null,
//             total: allProductRes.data.count || null,
//             isStockProduct: inStockProductRes.data || null,
//         },
//     };
// };