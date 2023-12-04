import React from "react";
import s from '../About.module.scss';
import MainLayout from "../../../components/homePage/MainLayout";

const Policy = () => {

    return (
        <MainLayout>
            <div className={s.container}>
                <h1 className={s.title}>退換貨政策</h1>
                <div className={s.subTitle}>退換貨流程:</div>
                <div>退換貨品必須保留原包裝</div>
                <div>當客戶收到商品後發現商品有問題時，可以聯繫網店客服提交退換貨申請，客服會要求客戶提供訂單號碼、商品編號等信息，以便進行核對。</div>
                <div>在收到貨物的7天通過電郵/Whatsapp客服提交退換貨申請</div>
                <div>確認貨品符合退貨政策後，客服會跟進客人相關問題</div>
                <div>若有現貨，我們會在7個工作日內為客人補回貨品</div>
                <div>若沒有現貨，我們將會為客人訂購貨品</div>
                <br />
                <div className={s.special}>*若客人未能於收到貨品的7天內提出退貨要求，將不能進行退換</div>
                <br />
                <div className={s.subTitle}>退換貨守則:</div>
                <div>請於退貨期限內進行申請及退換</div>
                <div>已開封使用或因個人原因而造成任何損壞的貨品將不作退換</div>
                <div>運送期間如有損毀或遺失，客人需自行承擔損失</div>
            </div>
        </MainLayout>
    )
}

export default Policy