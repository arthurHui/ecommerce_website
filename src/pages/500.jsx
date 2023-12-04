import React from "react"
import MainLayout from "../components/homePage/MainLayout";
import Image from "next/image";
import { prefix } from "../constants/constants";

const ErrorPage = () => {
    return (
        <MainLayout>
            <div className="max1500" style={{ textAlign: "center", color: "#4096ff" }}>
                <Image
                    src={`images/500.jpg`}
                    alt="網站出現異常"
                    width={0}
                    height={0}
                    sizes="100vw"
                    style={{ width: "100%", height: 'auto' }}
                />
            </div>
        </MainLayout>
    )
}

export default ErrorPage