"use client"
import React, { useMemo } from "react";
import ProductDescription from "../../components/productDescription/ProductDescription"
import { SERVER_URL } from '../../constants/constants';
import axios from "axios";
import { NextSeo, ProductJsonLd } from 'next-seo';
import { getTextFromHTML } from '../../utilities/utilities';
import _ from 'lodash'

const Product = ({
    product,
}) => {

    const textDescription = useMemo(
        () => getTextFromHTML(product.description),
        [product]
    );

    const prices = useMemo(
        () => Object.keys(product).length !== 0 ? product.option.map(
            (value) => _.get(value, 'markdown_price', value.original_price)
        ) : [],
        [product]
    );

    return (
        <>
            <h1 style={{ display: "none" }}>{product.title}</h1>
            <h2 style={{ display: "none" }}>{textDescription}</h2>
            <NextSeo
                title={product.title}
                description={textDescription}
                openGraph={{
                    url: `https://hkwarmhome.com/product/${product.title}`,
                    title: product.title,
                    description: textDescription,
                    images: product.product_images.map((value) => {
                        return {
                            url: value.low_resolution,
                            alt: product.title
                        }
                    }),
                    siteName: 'hkwarmhome',
                }}
            />
            <ProductJsonLd
                productName={product.title}
                description={textDescription}
                images={product.product_images.map((value) => value.low_resolution)}
                lowPrice={Math.min(...prices)}
                highPrice={Math.max(...prices)}
                productionDate={product.created}
                purchaseDate={product.created}
                offerCount={prices.length}
                offers={product.option.map((value) => {
                    return {
                        price: _.get(value, 'markdown_price', value.original_price),
                        availability: "In stock",
                        priceCurrency: 'HKD',
                        priceValidUntil: '2030-11-05',
                        itemCondition: 'https://schema.org/UsedCondition',
                        availability: 'https://schema.org/InStock',
                        url: `https://hkwarmhome.com/product/${product.title}`,
                        seller: {
                            name: 'dev',
                        },
                    }
                })}
            />
            <ProductDescription
                product={product}
            />
        </>
    )
}

export default Product

export async function getStaticPaths() {
    const res = await axios({
        url: `${SERVER_URL}/product/product?action=all_product_title`,
        method: "GET"
    })
    const paths = res.data.map((value) => ({
        params: { title: value },
    }))

    return { paths, fallback: false };
}

export const getStaticProps = async ({
    params,
}) => {
    const res = await axios({
        url: `${SERVER_URL}/product/product/${decodeURI(params.title)}`,
        method: "GET"
    })

    return {
        props: {
            product: res.data || null,
        }
    };
};