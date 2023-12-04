'use client'
import React, { useEffect, useState } from "react";
import s from './User.module.scss';
import { useSelector, useDispatch } from "react-redux";
import { Button, Input, Space, Tabs, notification, Modal } from 'antd';
import { UserOutlined, EditOutlined, KeyOutlined } from '@ant-design/icons';
import _ from 'lodash';
import moment from 'moment'
import axios from "axios";
import { SERVER_URL, error_code } from '../../constants/constants';
import { useRouter } from 'next/navigation'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import MainLayout from "../../components/homePage/MainLayout";
import { setGlobal } from '../../service/global'
import { sleep } from '../../utilities/utilities';

const User = () => {

    const user = useSelector(state => state.global.user)
    const dispatch = useDispatch()
    const router = useRouter()
    const [api, contextHolder] = notification.useNotification();

    const [tabKey, setTabkey] = useState(1)
    const [userData, setUserData] = useState(user)
    const [isOpenModal, setIsOpenModal] = useState(false)
    const [password, setPassword] = useState({
        old_password: "",
        new_password: "",
        new_password2: ""
    })

    const onChangeUserData = (key, value) => {
        let newUserData = { ...userData }
        newUserData[key] = value
        setUserData(newUserData)
    }

    const onChangePassword = (key, value) => {
        let newPassword = { ...password }
        newPassword[key] = value
        setPassword(newPassword)
    }

    const onLogout = () => {
        axios({
            url: `${SERVER_URL}/auth/login/${userData.id}`,
            method: "POST",
            headers: {
                "Authorization": `token ${userData.token}`
            }
        })
            .then(async (res) => {
                if (typeof window !== 'undefined') {
                    localStorage.removeItem('token')
                }
                api.success({
                    message: '成功登出',
                    duration: 3
                })
                await sleep(0.5)
                dispatch(setGlobal({ key: 'user', data: null }))
                router.push('/login')
            })
            .catch((error) => {
                console.log('error', error)
                api.error({
                    message: "登出失敗",
                    duration: 3
                })
            })
    }

    const onSave = () => {
        axios({
            url: `${SERVER_URL}/auth/user/${userData.id}`,
            method: "POST",
            data: {
                ...userData
            },
            headers: {
                "Authorization": `token ${userData.token}`
            }
        })
            .then((res) => {
                const data = res.data
                api.success({
                    message: '成功更新',
                    duration: 3
                })
            })
            .catch((error) => {
                api.error({
                    message: "更新失敗",
                    duration: 3
                })
            })
    }

    const onSavePassword = () => {
        if (password.new_password !== password.new_password2) {
            api.info({
                message: '密碼不相同',
                duration: 3
            })
            return
        }
        if (password.new_password.length < 8) {
            api.info({
                message: '密碼長度過短',
                duration: 3
            })
            return
        }
        axios({
            url: `${SERVER_URL}/auth/user/${userData.id}`,
            method: "POST",
            data: {
                old_password: password.old_password,
                password: password.new_password
            },
            headers: {
                "Authorization": `token ${userData.token}`
            }
        })
            .then((res) => {
                const data = res.data
                api.success({
                    message: '成功更新',
                    duration: 3
                })
            })
            .catch((error) => {
                let errorList = ""
                if (typeof error.response.data === "object") {
                    Object.entries(error.response.data).forEach(([key, value]) => {
                        if (key !== 'username') {
                            errorList += `${error_code[key]}${error_code[value]}\n`
                        }
                    })
                    api.error({
                        message: errorList,
                        duration: 3
                    })
                } else if (error.response.data === "old password not match") {
                    api.error({
                        message: "舊密碼不相符",
                        duration: 3
                    })
                } else {
                    api.error({
                        message: "更新失敗",
                        duration: 3
                    })
                }
            })
    }

    useEffect(() => {
        setUserData(user)
    }, [user])

    const items = [
        {
            key: 1,
            label: `個人資訊`,
            children: (
                <div>
                    <div className="marginBottom15">
                        <Space>
                            <UserOutlined className={s.bold} />
                            <div className={s.bold}>{_.get(userData, 'last_name', '')}</div>
                        </Space>
                    </div>
                    <div className="marginBottom15">
                        <Space>
                            <EditOutlined className={s.bold} />
                            <div className={s.bold}>編輯會員資料</div>
                        </Space>
                    </div>
                    <div className="marginBottom15">
                        <div className={s.inputField}>
                            <div className={s.title}>姓名</div>
                            <Input
                                maxLength={100}
                                value={_.get(userData, 'last_name', '')}
                                onChange={(e) => onChangeUserData('last_name', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="marginBottom15">
                        <div className={s.inputField}>
                            <div className={s.title}>電郵</div>
                            <Input
                                maxLength={100}
                                value={_.get(userData, 'email', '')}
                                onChange={(e) => onChangeUserData('email', e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="marginBottom15">
                        <div className={s.inputField}>
                            <div className={s.title}>手機號碼</div>
                            <PhoneInput
                                maxLength={20}
                                country='hk'
                                value={_.get(userData, 'phone', '')}
                                onChange={(phone) => onChangeUserData('phone', phone)}
                            />
                        </div>
                    </div>
                    <div className="marginBottom15">
                        <div className={s.inputField}>
                            <div className={s.title}>密碼</div>
                            <Button type="primary" onClick={() => setIsOpenModal(true)}>設定新的密碼</Button>
                        </div>
                    </div>
                    <div className="marginBottom15">
                        <div className={s.inputField}>
                            <div className={s.title}>生日日期</div>
                            <div>{moment(_.get(userData, 'birthday', '') * 1000).format('YYYY/MM/DD')}</div>
                        </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <Space>
                            <Button onClick={onLogout}>登出</Button>
                            <Button onClick={onSave} type="primary">儲存變更</Button>
                        </Space>
                    </div>
                </div>
            ),
        },
    ];

    return (
        <MainLayout>
            <div className={`${s.UserContainer} max1500`}>
                {contextHolder}
                <Modal title="編輯密碼" open={isOpenModal} onOk={onSavePassword} onCancel={() => setIsOpenModal(false)}>
                    <div className={s.changePasswordInput}>
                        <KeyOutlined />
                        <Input
                            maxLength={100}
                            type="password"
                            placeholder="舊密碼"
                            onChange={(e) => onChangePassword('old_password', e.target.value)}
                            value={password.old_password}
                            minLength={8}
                        />
                    </div>
                    <div className={s.changePasswordInput}>
                        <KeyOutlined />
                        <Input
                            maxLength={100}
                            type="password"
                            placeholder="新密碼 (最少8個字元)"
                            onChange={(e) => onChangePassword('new_password', e.target.value)}
                            value={password.new_password}
                            minLength={8}
                        />
                    </div>
                    <div className={s.changePasswordInput}>
                        <KeyOutlined />
                        <Input
                            maxLength={100}
                            type="password"
                            placeholder="確認新密碼"
                            onChange={(e) => onChangePassword('new_password2', e.target.value)}
                            value={password.new_password2}
                            minLength={8}
                        />
                    </div>
                    {password.new_password !== password.new_password2 && (
                        <div style={{ color: '#ff0000' }}>密碼不相同</div>
                    )}
                </Modal>
                <Tabs activeKey={tabKey} items={items} />
            </div>
        </MainLayout>
    )
}

export default User