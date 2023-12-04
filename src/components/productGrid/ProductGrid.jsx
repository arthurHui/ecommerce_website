"use client"
import React, { useEffect } from "react";
import ProductCard from './ProductCard';
import s from './ProductGrid.module.scss';
import { Pagination, Row, Col, Button } from 'antd';
import { useRouter } from 'next/navigation'
import useWindowSize from '../../utilities/useWindowSize'
import Link from 'next/link'
import FadeUp, { tiggerAnimation } from "../FadeUp/FadeUp";

const ProductGrid = ({
    product = [],
    totalSize,
    title = '全部商品',
    isMainPage = false
}) => {

    // const [isShowPageSize, setIsShowPageSize] = useState(false);
    // const [pageSize, setPageSize] = useState(24);
    const router = useRouter()
    const windowSize = useWindowSize();

    useEffect(() => {
        tiggerAnimation()
    }, [product])

    return (
        <FadeUp>
            {title === "全部商品" ? (
                <div className={s.headerBar} style={{ justifyContent: 'center' }}>
                    <div className="promoTitle">
                        💎全部商品💎
                    </div>
                </div>
            ) : (
                <div className={s.headerBar}>
                    <div className={s.title}>
                        💎{title}💎
                    </div>
                </div>
            )}
            <div className="max1500" style={{ textAlign: "center" }} >
                <Row gutter={windowSize.width < 768 ? 8 : 16} >
                    {product.map((value) => {
                        return (
                            <Col key={value.title} xs={12} sm={12} md={8} lg={6} span={6}>
                                <ProductCard
                                    product={value}
                                />
                            </Col>
                        )
                    })}
                </Row >
                {isMainPage ? (
                    <Link href={`/category/全部分類`}>
                        <Button style={{ marginTop: "20px" }} type="primary" className="themeButton">
                            查看更多
                        </Button>
                    </Link>
                ) : (
                    <div className={s.pagination}>
                        <Pagination current={router?.query?.page || 1} total={totalSize} pageSize={24} onChange={(page) => router.push(`${router.pathname}/page=${page}`)} />
                    </div>
                )}
            </div>
        </FadeUp>
    )
}


export default ProductGrid