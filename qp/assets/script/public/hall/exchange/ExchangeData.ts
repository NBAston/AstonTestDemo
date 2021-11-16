import { clearScreenDown } from "readline";


export default class UIExchangeData {
    aliCount: string;
    bankCount: string;
    gold: number;
}
export class UIExchargeRecordsItem {
    id: string; // id
    orderId: string; // 订单编号
    num: string; // 订单流水号
    type: number; // 类型2: 支付宝 3:银行 4:USDT
    fee: number; // 手续费
    usdtRate: number; // usdt 汇率
    usdt: string; // usdt 个数
    gold: number; // 兑换的积分
    time: string;   // 时间
    status: number; //  状态：自动审核(4), 人工审核(6), 审核中(8), 已驳回(9), 准备兑换(10), 兑换失败(15), 兑换成功(18), 已拒绝(20), 退款成功(24), 退款中(25), 退款失败(26)
    op: string; // 失败的原因
}
