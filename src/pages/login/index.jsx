import React, { useState, useCallback, useEffect } from "react";
import MainLayout from '../../components/homePage/MainLayout';
import s from './Login.module.scss';
import { Input, Button, notification, DatePicker, Spin } from "antd";
import axios from "axios";
import { SERVER_URL, error_code, prefix } from '../../constants/constants';
import { useDispatch } from "react-redux";
import { setGlobal } from '../../service/global'
import { useRouter } from 'next/navigation'
import Image from "next/image";
import { sleep } from '../../utilities/utilities';

const Login = () => {

    const [api, contextHolder] = notification.useNotification();
    const dispatch = useDispatch()
    const router = useRouter()

    const [isRegister, setIsRegister] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [loginData, setLoginData] = useState({
        email: "",
        password: ""
    })
    const [registerData, setRegisterData] = useState({
        email: "",
        password: "",
        password2: "",
        birthday: null,
        lastName: "",
    })

    const onChangeLoginData = (key, value) => {
        let newLoginData = { ...loginData }
        newLoginData[key] = value
        setLoginData(newLoginData)
    }

    const onChangeRegisterData = (key, value) => {
        let newRegisterData = { ...registerData }
        newRegisterData[key] = value
        setRegisterData(newRegisterData)
    }

    const handleLogin = () => {
        setIsLoading(true)
        axios({
            url: `${SERVER_URL}/auth/login`,
            method: "POST",
            data: {
                ...loginData
            }
        })
            .then(async (res) => {
                const data = res.data
                dispatch(setGlobal({ key: 'user', data: data }))
                if (typeof window !== 'undefined') {
                    localStorage.setItem('token', data.token)
                }
                api.success({
                    message: '成功登入',
                    duration: 3
                })
                await sleep(0.5)
                router.push('/user')
            })
            .catch((error) => {
                api.error({
                    message: "登入失敗",
                    duration: 3
                })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handleRegister = () => {
        if (registerData.password !== registerData.password2) {
            api.warning({
                message: '密碼不同',
                duration: 3
            })
            return
        } else if (registerData.password.length < 8) {
            api.info({
                message: '密碼長度過短',
                duration: 3
            })
            return
        } else if (!registerData.email) {
            api.warning({
                message: '電郵不能為空',
                duration: 3
            })
            return
        } else if (!registerData.password) {
            api.warning({
                message: '密碼不能為空',
                duration: 3
            })
            return
        } else if (!registerData.birthday) {
            api.warning({
                message: '生日不能為空',
                duration: 3
            })
            return
        }
        setIsLoading(true)
        axios({
            url: `${SERVER_URL}/auth/user`,
            method: "POST",
            data: {
                email: registerData.email,
                username: registerData.email,
                password: registerData.password,
                birthday: registerData.birthday.unix(),
                last_name: registerData.lastName
            }
        })
            .then((res) => {
                const data = res.data
                dispatch(setGlobal({ key: 'user', data: data }))
                if (typeof window !== 'undefined') {
                    localStorage.setItem('token', data.token)
                }
                api.success({
                    message: '成功註冊',
                    duration: 3
                })
                router.push('/')
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
                }
                api.error({
                    message: "註冊失敗",
                    duration: 3
                })
            })
            .finally(() => {
                setIsLoading(false)
            })
    }

    const handleKeyPress = useCallback((e) => {
        if (e.key === 'Enter') {
            if (isRegister) {
                handleRegister()
            } else {
                handleLogin()
            }
        }
    }, [isRegister, loginData, registerData]);

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);

        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        };
    }, [handleKeyPress]);

    return (
        <>
            {contextHolder}
            <MainLayout>
                <Spin spinning={isLoading}>
                    <div className={s.LoginContainer}>
                        {isRegister ? (
                            <div className={s.leftSide}>
                                <div className={s.Info}>
                                    <div className={s.title}>註冊會員</div>
                                </div>
                                <div className={s.InputField}>
                                    <div className={s.BtnLabel}>姓名</div>
                                    <Input
                                        maxLength={100}
                                        type="lastName"
                                        value={registerData.lastName}
                                        onChange={(e) => onChangeRegisterData('lastName', e.target.value)}
                                    />
                                </div>
                                <div className={s.InputField}>
                                    <div className={s.BtnLabel}>電郵</div>
                                    <Input
                                        maxLength={100}
                                        type="email"
                                        value={registerData.email}
                                        onChange={(e) => onChangeRegisterData('email', e.target.value)}
                                    />
                                </div>
                                <div className={s.InputField}>
                                    <div className={s.PasswordField}>
                                        <div className={s.BtnLabel}>密碼</div>
                                    </div>
                                    <Input
                                        maxLength={100}
                                        type="password"
                                        value={registerData.password}
                                        onChange={(e) => onChangeRegisterData('password', e.target.value)}
                                        placeholder="最少8個字元"
                                        minLength={8}
                                    />
                                </div>
                                <div className={s.InputField}>
                                    <div className={s.PasswordField}>
                                        <div className={s.BtnLabel}>確認密碼</div>
                                    </div>
                                    <Input
                                        maxLength={100}
                                        type="password"
                                        value={registerData.password2}
                                        onChange={(e) => onChangeRegisterData('password2', e.target.value)}
                                    />
                                    {registerData.password !== registerData.password2 && (
                                        <div className={s.BtnLabel} style={{ color: '#ff0000' }}>密碼不相同</div>
                                    )}
                                </div>
                                <div className={s.InputField}>
                                    <div className={s.PasswordField}>
                                        <div className={s.BtnLabel}>生日</div>
                                    </div>
                                    <DatePicker
                                        placeholder="選擇生日"
                                        value={registerData.birthday}
                                        onChange={(date) => onChangeRegisterData('birthday', date)}
                                    />
                                </div>
                                <div className={s.InputField}>
                                    <Button
                                        type="primary"
                                        className="themeButton"
                                        style={{ width: '100%' }}
                                        onClick={handleRegister}
                                    >
                                        註冊會員
                                    </Button>
                                </div>
                                <div className={s.InputField}>
                                    <div className={s.title}>已經有帳號？</div>
                                    <Button onClick={() => setIsRegister(false)} className="themeButton" style={{ width: '100%' }}>登入</Button>
                                </div>
                            </div>
                        ) : (
                            <div className={s.leftSide}>
                                <div className={s.Info}>
                                    <div className={s.title}>很高興再次見到你！</div>
                                </div>
                                <div className={s.InputField}>
                                    <div className={s.BtnLabel}>電郵</div>
                                    <Input
                                        maxLength={100}
                                        value={loginData.email}
                                        onChange={(e) => onChangeLoginData('email', e.target.value)}
                                    />
                                </div>
                                <div className={s.InputField}>
                                    <div className={s.PasswordField}>
                                        <div className={s.BtnLabel}>密碼</div>
                                        {/* <div className={s.forgotPassword}>忘記密碼?</div> */}
                                    </div>
                                    <Input
                                        maxLength={100}
                                        type="password"
                                        value={loginData.password}
                                        onChange={(e) => onChangeLoginData('password', e.target.value)}
                                    />
                                </div>
                                <div className={s.InputField}>
                                    <Button
                                        type="primary"
                                        className="themeButton"
                                        style={{ width: '100%' }}
                                        onClick={handleLogin}
                                    >
                                        登入
                                    </Button>
                                </div>
                                <div className={s.InputField}>
                                    <div className={s.title}>還不是會員？</div>
                                    <Button onClick={() => setIsRegister(true)} className="themeButton" style={{ width: '100%' }}>註冊會員</Button>
                                </div>
                            </div>
                        )}
                        <div className={s.rightSide}>
                            <div className={s.Info}>
                                <div className={s.title}>第一次在Warm Home?</div>
                            </div>
                            <div className={s.registerInfo}>
                                <div>
                                    <Image
                                        sizes="100vw"
                                        src={`images/logo.png`}
                                        width={70}
                                        height={70}
                                    />
                                    <div>從今天開始加入會員！</div>
                                </div>
                                <div>
                                    <Image
                                        sizes="100vw"
                                        src={`images/login-1.jpg`}
                                        width={100}
                                        height={70}
                                    />
                                    <div>訂單符合條件免費送貨！</div>
                                </div>
                                <div>
                                    <Image
                                        sizes="100vw"
                                        src={`images/login-3.jpg`}
                                        width={100}
                                        height={70}
                                    />
                                    <div>聯繫我們！</div>
                                </div>
                                <div>
                                    <Image
                                        sizes="100vw"
                                        src={`images/login-4.jpg`}
                                        width={100}
                                        height={70}
                                    />
                                    <div>本地符合條件訂單退貨！</div>
                                </div>
                                {/* <div>
                                    <Image
                                                            sizes="100vw"
                        style={{ width: "auto", height: 'auto' }}
                                        src='/images/login-5.jpg'
                                        width='100px'
                                        height='70px'
                                    />
                                    <div>心願單</div>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </Spin>
            </MainLayout>
        </>
    )
}

export default Login