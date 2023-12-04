'use client'
import React, { useEffect, useMemo, useState } from "react";
import s from './Header.module.scss'
import { useSelector, useDispatch } from 'react-redux';
import { toShowablePrice } from '../../utilities/utilities'
import { DeleteOutlined, MenuOutlined, FileTextOutlined, SearchOutlined, UserOutlined, ShoppingOutlined, MoreOutlined } from '@ant-design/icons'
import { removeFromCart } from '../../service/cart'
import { Button, Menu, Drawer, Input, Dropdown, Modal } from 'antd';
import _ from 'lodash'
import useWindowSize from '../../utilities/useWindowSize'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from "next/image";
import { prefix } from "../../constants/constants"

const Header = () => {

    const [isOpenCart, setIsOpenCart] = useState(false)
    const [isOpenMenu, setIsOpenMenu] = useState(false)
    const [isSearching, setIsSearching] = useState(false)
    const [keyword, setKeyword] = useState("")
    const cart = useSelector((state) => state.cart.data) || []
    const category = useSelector((state) => state.category.data)
    const user = useSelector((state) => state.global.user)
    const dispatch = useDispatch()
    const router = useRouter()
    const windowSize = useWindowSize();

    function getItem(label, key, icon, children, type) {
        return {
            key,
            icon,
            children,
            label,
            type,
        };
    }

    const items = [
        getItem('分類', 'category', null, category.map((value) => getItem(value.title, value.title)), 'group'),
    ];

    const pageItems = [
        getItem('頁面', 'pages', null, [{
            key: 'main_page',
            icon: null,
            children: null,
            label: '主頁',
            type: null
        }], 'group'),
    ];

    const memberItems = useMemo(() => {
        if (!!user) {
            return [
                getItem('帳戶', 'account', null,
                    [{
                        key: 'login',
                        icon: <UserOutlined className={s.icon} />,
                        children: null,
                        label: '會員',
                        type: null
                    }, {
                        key: 'order',
                        icon: <FileTextOutlined className={s.icon} />,
                        children: null,
                        label: '訂單',
                        type: null
                    }]
                    , 'group'),
            ];
        }
        return [
            getItem('帳戶', 'account', null,
                [{
                    key: 'login',
                    icon: <UserOutlined className={s.icon} />,
                    children: null,
                    label: '會員',
                    type: null
                }]
                , 'group'),
        ];
    }, [user])

    const onClickMenu = ({ item, key, keyPath, domEvent }) => {
        setIsOpenMenu(false)
        router.push(`/category/${key}`)
    }

    const onClickPageMenu = ({ item, key, keyPath, domEvent }) => {
        setIsOpenMenu(false)
        if (key === 'main_page') {
            router.push(`/`)
        }
    }

    const onClickMemberMenu = ({ item, key, keyPath, domEvent }) => {
        let path = key
        if (key === 'login' && !!user) {
            path = 'user'
        }
        setIsOpenMenu(false)
        router.push(`/${path}`)
    }

    const handleSearchProduct = () => {
        router.push(`/category/全部分類?keyword=${keyword}`)
    }

    useEffect(() => {
        if (windowSize.width < 768) {
            if (isOpenCart) {
                document.body.style.overflowY = 'hidden';
            } else {
                document.body.style.overflowY = 'unset';
            }
        }
    }, [isOpenCart])

    return (
        <React.Fragment>
            <Modal
                open={isSearching}
                onOk={() => {
                    handleSearchProduct()
                    setIsSearching(false)
                }}
                onCancel={() => setIsSearching(false)}
                closeIcon={false}
                okText="確認"
                cancelText="取消"
            >
                <Input
                    maxLength={100}
                    placeholder="找商品"
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearchProduct()
                        }
                    }}
                />
            </Modal>
            {
                windowSize.width < 768 ? (
                    <div
                        className={s.container}
                    >
                        <div className={s.menu}>
                            <div className={s.shopName}>
                                <Link href='/'>
                                    <Image src={`images/logo.png`} sizes="100vw" width={0} height={0} style={{ width: '40px', height: 'auto' }} alt="warm home logo" />
                                </Link>
                            </div>
                            <div className={s.action}>
                                <div onClick={() => setIsSearching(prev => !prev)}>
                                    <SearchOutlined
                                        className={s.icon}
                                    />
                                </div>
                                {/* <Heart
                                    width={28}
                                    height={28}
                                /> */}
                                <div style={{ userSelect: 'none', height: '28px' }} onClick={() => setIsOpenCart(prev => !prev)}>
                                    <ShoppingOutlined
                                        className={s.icon}
                                    />
                                </div>
                                <MenuOutlined
                                    className={s.icon}
                                    onClick={() => setIsOpenMenu(true)}
                                />
                            </div>
                        </div>
                        <Drawer
                            open={isOpenCart}
                            onClose={() => setIsOpenCart(false)}
                        >
                            {cart.length === 0 ? (
                                <div className={s.center}>你的購物車是空的</div>
                            ) : (
                                <React.Fragment>
                                    <div className={s.cartList}>
                                        {cart.map((value, index) => {
                                            const price = _.get(value, 'markdown_price', value.original_price)
                                            return (
                                                <div key={value.title} className={s.card} style={{ borderBottom: index > 0 ? '1px solid #f1f1f1' : 'none' }}>
                                                    <div><Image height={50} width={50} src={value.image} alt={value.title} /></div>
                                                    <div>
                                                        <div className={s.productTitle}>{value.product_title}</div>
                                                        <div className={s.title}>
                                                            {value.title}
                                                            {Object.keys(_.get(value, "sub_option", {})).length > 0 && (
                                                                " / " + value.sub_option.title
                                                            )}
                                                        </div>
                                                        <div className={s.price}>
                                                            <div>{value.added_quantity} x {toShowablePrice(price)}</div>
                                                            <div className={s.delete} onClick={() => dispatch(removeFromCart(value.id))}><DeleteOutlined /></div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                    <div style={{ textAlign: 'center', marginTop: '15px' }}>
                                        <Button
                                            className={s.checkOutButton}
                                            type="primary"
                                            onClick={() => router.push('/cart')}
                                        >訂單結帳</Button>
                                    </div>
                                </React.Fragment>

                            )}
                        </Drawer>
                        <div
                            className={`${isOpenMenu && s.mobilePlugin} ${s.mobilePluginHidden}`}
                            style={{ padding: 'initial' }}
                        >
                            <Menu
                                mode="inline"
                                items={pageItems}
                                onClick={(info) => onClickPageMenu(info)}
                            />
                            <Menu
                                mode="inline"
                                items={items}
                                onClick={(info) => onClickMenu(info)}
                            />
                            <Menu
                                mode="inline"
                                items={memberItems}
                                onClick={(info) => onClickMemberMenu(info)}
                            />
                        </div>
                        {isOpenMenu && (
                            <div className={s.mark} onClick={() => setIsOpenMenu(false)} />
                        )}
                    </div>
                ) : (
                    <div
                        className={s.container}
                    >
                        <div className={s.menu}>
                            <div className={s.shopName}>
                                <Link href='/'>
                                    <Image src={`images/logo.png`} sizes="100vw" width={0} height={0} style={{ width: '70px', height: 'auto' }} alt="warm home logo" />
                                </Link>
                            </div>
                            <div className={s.category}>
                                <Link key="main_page" href={`/`}>
                                    主頁
                                </Link>
                                {category.map((value) => (
                                    <Link key={value.title} href={`/category/${value.title}`}>
                                        {value.title}
                                    </Link>
                                ))}
                            </div>
                            <div className={s.action}>
                                <div onClick={() => setIsSearching(prev => !prev)}>
                                    <SearchOutlined
                                        className={s.icon}
                                    />
                                </div>
                                <div>
                                    <Link href={!!user ? '/user' : '/login'}>
                                        <UserOutlined
                                            className={s.icon}
                                        />
                                    </Link>
                                </div>
                                {!!user && (
                                    <div>
                                        <Link href='/order'>
                                            <FileTextOutlined
                                                className={s.icon}
                                            />
                                        </Link>
                                    </div>
                                )}
                                {/* <Heart
                                    width={28}
                                    height={28}
                                /> */}
                                <div style={{ userSelect: 'none' }} onClick={() => setIsOpenCart(prev => !prev)}>
                                    <ShoppingOutlined
                                        className={s.icon}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className={`${isOpenCart && s.plugin} ${s.pluginHidden}`}>
                            {cart.length === 0 ? (
                                <div className={s.center}>你的購物車是空的</div>
                            ) : (
                                <React.Fragment>
                                    {cart.map((value, index) => {
                                        const price = _.get(value, 'markdown_price', value.original_price)
                                        return (
                                            <div key={value.title} className={s.card} style={{ borderBottom: index > 0 ? '1px solid #f1f1f1' : 'none' }}>
                                                <div><Image height={50} width={50} src={value.image} alt={value.title} /></div>
                                                <div>
                                                    <div className={s.productTitle}>{value.product_title}</div>
                                                    <div className={s.title}>
                                                        {value.title}
                                                        {Object.keys(_.get(value, "sub_option", {})).length > 0 && (
                                                            " / " + value.sub_option.title
                                                        )}
                                                    </div>
                                                    <div className={s.price}>
                                                        <div>{value.added_quantity} x {toShowablePrice(price)}</div>
                                                        <div className={s.delete} onClick={() => dispatch(removeFromCart(value.id))}><DeleteOutlined /></div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                    <div style={{ textAlign: 'center', marginTop: '15px' }}>
                                        <Button
                                            className={s.checkOutButton}
                                            type="primary"
                                            onClick={() => router.push('/cart')}
                                        >訂單結帳</Button>
                                    </div>
                                </React.Fragment>
                            )}
                        </div>
                    </div>
                )
            }
        </React.Fragment >
    )
}

export default Header