import React from "react";
import s from './SideMenu.module.scss';
import { Menu } from 'antd';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation'

const SideMenu = () => {

    const category = useSelector((state) => state.category.data)
    const router = useRouter()

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

    const onClickMenu = ({ item, key, keyPath, domEvent }) => {
        router.push(`/category/${key}`)
    }

    return (
        <React.Fragment>
            <Menu
                className={s.customMenu}
                style={{ border: 'none' }}
                mode="inline"
                items={items}
                onClick={(info) => onClickMenu(info)}
            />
        </React.Fragment>
    )
}

export default SideMenu