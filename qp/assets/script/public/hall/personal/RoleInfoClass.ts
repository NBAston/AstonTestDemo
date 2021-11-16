

/**
 * 验证码类型
 */
export enum EVerifyCodeType {
    VERIFYCODE_BIND_WECHAT = 0,//绑定微信
    VERIFYCODE_REGISTERMOBILE = 1,//绑定手机
    VERIFYCODE_RESETPASSWORD = 2,//重置密码
    VERIFYCODE_MODIFYALIBANK = 3,//修改银行卡
    VERIFYCODE_BINDUSDT = 4, // 绑定USDT
}

export class UIPersonalData {
    headId: number;
    headBoxId: number;
    vipLv: number;
    exp: number;
    max: number;
    nickName: string;
    accountId: number;
    gold: number;
    istempAccount: boolean;
    trueName: string;
}