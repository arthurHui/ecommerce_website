import React from "react";
import s from './TopThreeProduct.module.scss';
import ProductCard from '../productGrid/ProductCard';
import { Row, Col } from 'antd';
import useWindowSize from '../../utilities/useWindowSize'
import Image from "next/image";
import FadeUp from "../FadeUp/FadeUp";
import { prefix } from "../../constants/constants";

const TopThreeProduct = ({
    product = []
}) => {

    const windowSize = useWindowSize();

    return (
        <FadeUp className={s.topThreeProductContainer} style={{ textAlign: 'center', marginTop: "10px" }}>
            <div className="promoTitle">
                🔥今期熱賣🔥
            </div>
            <Row gutter={windowSize.width < 768 ? 8 : 16}>
                {product.map((value) => {
                    return (
                        <Col key={value.title} xs={8} sm={8} md={8} lg={8} span={6}>
                            <ProductCard
                                product={value}
                            />
                        </Col>
                    )
                })}
            </Row >
            <Row gutter={windowSize.width < 768 ? 8 : 16} style={{ textAlign: 'center', alignItems: 'flex-end' }}>
                <Col xs={8} sm={8} md={8} lg={8} span={6}>
                    <Image
                        src={`images/1st.png`}
                        alt="top one"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: windowSize.width < 768 ? '40px' : 'auto', height: 'auto' }}
                    />
                </Col>
                <Col xs={8} sm={8} md={8} lg={8} span={6}>
                    <Image
                        src={`images/2nd.png`}
                        alt="top two"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: windowSize.width < 768 ? '40px' : 'auto', height: 'auto' }}
                    />
                </Col>
                <Col xs={8} sm={8} md={8} lg={8} span={6}>
                    <Image
                        src={`images/3rd.png`}
                        alt="top three"
                        width={0}
                        height={0}
                        sizes="100vw"
                        style={{ width: windowSize.width < 768 ? '40px' : 'auto', height: 'auto' }}
                    />
                </Col>
            </Row>
        </FadeUp>
    )
}

export default TopThreeProduct