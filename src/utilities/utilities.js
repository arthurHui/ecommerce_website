import _ from 'lodash'
import { Tag } from "antd";
import {
    CheckCircleOutlined,
    CloseCircleOutlined,
    SyncOutlined,
} from '@ant-design/icons';

export const toShowablePrice = (price) => {
    return `HK$${(Math.round(price * 100) / 100).toFixed(2)}`
}

export const getTotalPrice = (data, getOriginal = false) => {
    const token = typeof window !== 'undefined' && localStorage.getItem('token')
    if (token && !getOriginal) {
        return data.reduce((a, b) => a + b.added_quantity * _.get(b, 'markdown_price', b.original_price), 0) * 0.95
    } else {
        return data.reduce((a, b) => a + b.added_quantity * _.get(b, 'markdown_price', b.original_price), 0)
    }
}

export const getOrderStatus = (status) => {
    switch (status) {
        case 1:
            return <Tag icon={<SyncOutlined spin />} color="processing">訂單處理中</Tag>
        case 2:
            return <Tag icon={<CheckCircleOutlined />} color="warning">訂單已確認</Tag>
        case 3:
            return <Tag icon={<CheckCircleOutlined />} color="success">訂單已完成</Tag>
        case 4:
            return <Tag icon={<CloseCircleOutlined />} color="error">訂單已拒絕</Tag>
    }
}

export const getDeliveryStatus = (status) => {
    switch (status) {
        case 1:
            return "備貨中"
        case 2:
            return "送貨中"
        case 3:
            return "已送達"
        case 4:
            return "訂單出現問題"
    }
}

export const getPaymentStatus = (status) => {
    switch (status) {
        case 1:
            return "未付款"
        case 2:
            return "已付款"
        case 3:
            return "付款已拒絕"
    }
}

export const getDeliveryDescription = (method) => {
    switch (method) {
        case "荔枝角地鐵站面交":
            return `到貨會通知到「已到達」，收到通知即可安排時間進行交收。`
        case "彩虹地鐵站面交":
            return `到貨會通知到「已到達」，收到通知即可安排時間進行交收。`
        case "順豐寄付":
            return "出貨會通知到「送貨中」，客人可以在順豐找到單號查看送貨情況"
    }
}

export const getPaymentDescription = (method) => {
    const common = `收到付款後我地將按訂單給您發貨。
    溫馨提示：如貨存緊張，我們公司是以入數先後次序寄貨給客人
    
    📍[包裝盒問題] 
    本店寄出之所有產品確保為全新產品，並不會拆盒檢查。
    🚚若產品包裝盒出現刮花/凹陷均為物流過程問題，故不能為包裝問題提供退換服務，敬請體諒。
    🚪本店會為產品包上泡泡紙以作物流保護，惟物流依然有機會令包裝盒有損傷，故若有介意，請盡量到門店自取。
    ✈️但韓國/台灣段物流亦有機會造成包裝盒損壞問題，此問題則無法避免🙏
    
    ⚠️ 其他注意事項:
    📍一經下單付款，訂單不能取消。（請客人下單前先確認訂單內容&一切資料無誤；本店不設任何更改/取消訂單服務)
    📍由客人付款落單起，小店便已向供應商落單並付清貨款。故恕不會因供應商船期 / 貨期延誤而退款（所有預訂貨品到貨日期只供參考，亦有機會延遲出貨，並不會因此理由而退款🙏🏻）
    📍發貨日按工作天計算 (不包括星期六日及公眾假期)
    📍除有保養期貨品外，所有產品7日後恕不退換。
    📍退換貨品每單只限1次。
    📍若產品表面有輕微出廠瑕疵，而其瑕疵不影響使用，恕不能退換 。
    📍如需退換貨，請確保商品及其包裝完整。
    📍現時到貨日期或受疫情影響而有所延遲，敬請留意。`
    switch (method) {
        case "FPS轉數快":
            return `先按「前往結賬」，在付款後按指示將轉賬憑証上傳，
            並於付款備註填上「轉賬人英文全名」以核對入數紀錄
            轉數快(FPS) ID : 161195847
            轉數快(FPS) 電話號碼: 56235664
            戶口名稱: HUI H*** C***` + common
        case "Payme":
            return `先按「前往結賬」，在付款後按指示將轉賬憑証上傳` + common
    }
}

export const getTextFromHTML = (html = '') => {
    return html.replace(/<[^>]*>/g, '');
}

export const getDeliveryLocation = (deliveryLocation) => {
    switch (deliveryLocation) {
        case "hk":
            return "香港"
        case "macau":
            return "澳門"
    }
}

export const getDeliveryName = (deliveryMethod) => {
    switch (deliveryMethod) {
        case "sf_pay_in_arrive":
            return "順豐到付"
        case "sf_pay_in_store":
            return "順豐自取點自取"
        case "sf_pay_in_home":
            return "順豐住宅地址直送"
    }
}

export const getDeliveryFee = (deliveryMethod) => {
    switch (deliveryMethod) {
        case "sf_pay_in_arrive":
            return 0
        case "sf_pay_in_store":
            return 25
        case "sf_pay_in_home":
            return 30
    }
}

export const getPaymentName = (paymentMethod) => {
    switch (paymentMethod) {
        case "fps":
            return "FPS轉數快"
        case "payme":
            return "Payme"
        case "credit_card":
            return "信用卡"
        case "alipay":
            return "Alipay"
        case "wechat_pay":
            return "WechatPay"
    }
}

export const sleep = async (time) => {
    await new Promise((resolve, reject) => {
        setTimeout(resolve, time * 1000)
    })
}