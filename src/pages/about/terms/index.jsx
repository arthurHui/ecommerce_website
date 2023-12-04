import React from "react";
import s from '../About.module.scss';
import MainLayout from "../../../components/homePage/MainLayout";

const Terms = () => {

    return (
        <MainLayout>
            <div className={s.container}>
                <h1 className={s.title}>條款與細則</h1>
                <div className={s.subTitle}>小店貨品分為 現貨 及 預訂貨品</div>
                <div className={s.subTitle}>現貨</div>
                <div>出貨時間為3-5工作天，按付款先後次序出貨。</div>
                <div>若客人購買時現貨已售罄，而網站未能及時更新，小店將另行whatsapp通知客人，並為客人預訂貨品，恕不另行退款。</div>
                <br />
                <div className={s.subTitle}>預訂貨品</div>
                <div>預訂貨品會在每周星期六23:59分進行截單。</div>
                <div>出貨時間為7-14工作天或14-21工作天。出貨時間只供參考，恕未能保証到貨時間。</div>
                <div>實際出貨時間需視乎供應商出貨時間及物流情況而定。</div>
                <div>若貨品早到，必定提早寄出</div>
                <div>由客人付款落單起，小店便已向供應商落單並付清貨款。</div>
                <div>因此，恕不會因供應商船期 / 貨期延誤而退款。</div>
                <br />
                <div className={s.subTitle}>⚠️其他注意事項</div>
                <div>訂單一經確定收款，如非本店無法提供貨品，否則無法取消及退款</div>
                <div>本店只作退換，不設退款</div>
                <div>若產品表面有輕微出廠瑕疵，而其瑕疵不影響使用，恕不能退換</div>
                <div>如需退換貨，請確保商品及其包裝完整</div>
                <br />
                <br />
                <div>Warm Home保留一切修訂條款及細則之權利，毋須另行通知。</div>
                <div>如有任何爭議，將以Warm Home之決定為最終裁判。</div>
            </div>
        </MainLayout>
    )
}

export default Terms