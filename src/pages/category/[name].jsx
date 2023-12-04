"use client"
import React, { useEffect, useState } from "react";
import s from './Category.module.scss';
import ProductGrid from "../../components/productGrid/ProductGrid";
import SideMenu from '../../components/sideMenu/SideMenu';
import useWindowSize from '../../utilities/useWindowSize'
import axios from "axios";
import { SERVER_URL } from '../../constants/constants';
import { useRouter } from 'next/router'
import MainLayout from "../../components/homePage/MainLayout";
import { useSearchParams } from 'next/navigation'
import { NextSeo } from 'next-seo';
import { Spin } from "antd";

const Category = ({
}) => {

    const windowSize = useWindowSize();
    const router = useRouter()
    const searchParams = useSearchParams()

    const [product, setProduct] = useState([])
    const [count, setCount] = useState(0)
    const [isLoading, seIsLoading] = useState(false)

    const name = router?.query?.name
    const page = searchParams.get("page") || 1
    const keyword = searchParams.get("keyword")

    useEffect(() => {
        if (name === "全部分類") {
            let p = {
                page,
                action: "product"
            }
            if (keyword) {
                p.keyword = keyword
            }
            seIsLoading(true)
            axios({
                url: `${SERVER_URL}/product/category`,
                method: "GET",
                params: p
            })
                .then((res) => {
                    setProduct(res.data.results)
                    setCount(res.data.count)
                })
                .finally(() => {
                    seIsLoading(false)
                })
        } else {
            seIsLoading(true)
            axios({
                url: `${SERVER_URL}/product/category/${name}?action=product&page=${page}`,
                method: "GET"
            })
                .then((res) => {
                    setProduct(res.data.results)
                    setCount(res.data.count)
                })
                .finally(() => {
                    seIsLoading(false)
                })
        }
    }, [keyword, page, name])

    return (
        <>
            <h1 style={{ display: "none" }}>dev category</h1>
            <h2 style={{ display: "none" }}>{router?.query?.name || ""}</h2>
            <NextSeo
                title="dev"
                description={router?.query?.name || ""}
                openGraph={{
                    url: `https://hkwarmhome.com/category/${router?.query?.name || ""}`,
                    title: router?.query?.name || "",
                    description: router?.query?.name || "",
                    siteName: 'hkwarmhome',
                }}
            />
            <MainLayout>
                <Spin spinning={isLoading}>
                    <div className="spaceBetween max1500">
                        {windowSize.width > 1200 && (
                            <div style={{ width: '20%' }}>
                                <SideMenu />
                            </div>
                        )}
                        <div style={{ width: '100%' }}>
                            {product.length !== 0 ? (
                                <ProductGrid
                                    product={product}
                                    totalSize={count}
                                    title={router?.query?.name || ""}
                                />
                            ) : product.length === 0 && isLoading ? (
                                <div></div>
                            ) : (
                                <div className={s.emptyProduct}>
                                    <div className={s.title}>抱歉，找不到您所查詢的{searchParams.get('keyword')}相關商品</div>
                                    <div>建議您，檢查輸入字詞是否有誤或使用其他相關的字詞再搜尋</div>
                                </div>
                            )}
                        </div>
                    </div>
                </Spin>
            </MainLayout>
        </>
    )
}

export default Category

// export const getServerSideProps = async ({
//     params,
//     query
// }) => {

//     const name = params.name
//     const page = query.page || 1
//     const keyword = query.keyword

//     let res
//     if (name === "全部分類") {
//         let p = {
//             page,
//             action: "product"
//         }
//         if (keyword) {
//             p.keyword = keyword
//         }
//         res = await axios({
//             url: `${SERVER_URL}/product/category`,
//             method: "GET",
//             params: p
//         })
//     } else {
//         res = await axios({
//             url: `${SERVER_URL}/product/category/${name}?action=product&page=${page}`,
//             method: "GET"
//         })
//     }

//     return {
//         props: {
//             product: res.data.results || null,
//             total: res.data.count || null,
//         },

//     };
// };