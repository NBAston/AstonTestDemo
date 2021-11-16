import { EChargeType } from "../../../common/base/UAllenum";

export default class UIChargeData {
    chargetype: number;
    chargeurl: string;
    charges: Array<number>;
    maxmoneylimit: number;
    minmoneylimit: number;
}

/**线下充值列表Item */
export class UIChargeOffLineDataItem {
    inputSw: number; // 0 不允许自定义输入金额  1 允许自定义输入金额
    maxMoneyLimit: number; // 最大充值金额
    minMoneyLimit: number; // 最小充值金额
    rechargeMoney: string; // 充值金额范围
    rechargeTypeIcon: string; // 充值图片
    rechargeTypeId: number; // 充值类型ID
    rechargeTypeName: string; // 充值类型名称
    type: EChargeType; // 支付类型
}

/**线上充值列表Item */
export class UIChargeOnLineDataItem {
    inputSw: number; // 0 不允许自定义输入金额  1 允许自定义输入金额
    maxMoneyLimit: number; // 最大充值金额
    minMoneyLimit: number; // 最小充值金额
    rechargeMoney: string; // 充值金额范围
    rechargeTypeIcon: string; // 充值图片
    rechargeTypeId: number; // 充值类型ID
    rechargeTypeName: string; // 充值类型名称
    type: EChargeType; // 支付类型
}



/**订单列表Item */
export class UIChargeOrderListDataItem {
    createTime: string; // 创建时间
    orderId: string; // 订单ID
    rechargeMoney: number; // 订单金额
    rechargeTypeId: number; // 充值类型ID
    status: number;// 订单状态
    sp: string; // 线上线下支付类型
}

/**线下充值订单Item */
export class UIChargeOffLineOrderItem {
    accountNo: string; // 充值账号
    name: string; // 收款人姓名
    amount: string; //  充值金额
    createTime: string; // 创建时间
    orderId: string; // 订单ID
    uid: string;// uid
    userId: number; // 用户id
    timeSurplus: number; // 订单倒计时
}
/**订单详情Item */
export class UIChargeOrderDetailItem {
    accountNo: string; // 充值账号
    name: string; // 收款人姓名
    amount: string; //  充值金额
    createTime: string; // 创建时间
    orderId: string; // 订单ID
    uid: string;// uid
    status: number; // 订单状态status 充值订单状态      1-未支付 2-待确认 3-已补发 4-已完成 5-已取消
    userId: number; // 用户id
    minus: number; // 订单倒计分钟
    seconds: number; // 订单倒计秒
    usdtRate: number = 0; // USdt汇率
    usdtAmount: number = 0;// usdt 数量
    payType: number = 2; // 1为线上支付 2 为线下支付
    rechargeTypeName: string; // 支付通道
}

/**线上充值订单Item */
export class UIChargeOnLineOrderItem {
    actionUrl: string; // 跳转链接
    actionUrl2: string; // 跳转链接
    submitParam: any; // 提交的参数

}


/**线下充值列表数据*/
export class UIChargeOffLineData {
    datas: Array<UIChargeOffLineDataItem>;
}

/**线上充值列表数据*/
export class UIChargeOnLineData {
    datas: Array<UIChargeOnLineDataItem>;
}



/**订单列表数据 */
export class UIChargeOrderListData {
    datas: Array<UIChargeOrderListDataItem>;
}
/**兑换金币限额数据 */
export class ExchangeLimitMoneyInfoData {
    exchangeTimesOneDay:number;// 每天最大兑换次数
    exchangeInterval: number;// 两次提交兑换最小时间间隔
    exchangeMinMoneyBank: number;
    exchangeMaxMoneyBank: number;
    exchangeMinMoneyAlipay: number;
    exchangeMaxMoneyAlipay: number;
    exchangeMinLeftMoney: number;
    exchangeMinMoneyUsdt: number;
    exchangeMaxMoneyUsdt: number;

}

/**用户绑定信息 */
export class UserBindInfoData {
    trueName: string; // 真实姓名
    bankCardName: string; // 银行卡真实姓名
    usdtAddress: string; // USDT地址
    bankCardNum: string; // 银行卡号
    bankCardType: string; // 银行卡类型
    alipayName: string; // 支付宝姓名
    alipayAccount: string; // 支付宝账号
    mobileNum: string; // 电话号码
    exchangeRate: number; // USDT汇率
}

export class UIHttpChargeData {
    isopen: boolean;
    payurl: string;
    order: number;
    rechargetype: EChargeType;
    rechargemoney: Array<number>;
    maxmoneylimit: number;
    minmoneylimit: number;
}
export class UIChargeRecordsItem {
    chargeType: number;
    chargetime: string;
    listNum: string;
    status: number;
    gold: number;
}
