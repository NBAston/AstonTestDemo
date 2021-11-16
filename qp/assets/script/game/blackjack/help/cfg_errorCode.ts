
/**错误码对应的文字 */

/*
     ERR_CODE_DEFAULT            0//默认的错误码,未知错误
ERR_CODE_SCORE_SEAT         1//下注位置错误
ERR_CODE_LACK_MONEY         2//余额不足
ERR_CODE_SEAT_CANT_BET      3//此位置不能下注
ERR_CODE_BETSELF            4//先给自己的位置下注
ERR_CODE_PARAM              5//参数错误
ERR_CODE_BETED              6//重复下注
ERR_CODE_INSURE_SEAT        7//下注位置错误
ERR_CODE_INSURED            8//重复保险
ERR_CODE_WRONG_OPER         9//操作错误
ERR_CODE_P_STATUS           10//玩家状态错误
ERR_CODE_DATA               11//数据错误
ERR_CODE_G_STATUS           12//游戏状态错误
ERR_CODE_TURN               13//不是当前操作玩家
ERR_CODE_OPER               14//操作错误
[15]: "当前还没有下注",
    [16]: "已经停止下注了",
    [17]: "您的余额不足,购买失败,请充值",

*/
var cfg_errorCode: { [key: number]: string } =
{
    [0]: "状态错误",
    [1]: "您的下注位置错误",
    [2]: "您的余额不足,请充值",
    [3]: "此位置有人咯",
    [4]: "请先给自己的位置下注",
    [5]: "状态错误",
    [6]: "重复下注",
    [7]: "下注位置错误",
    [8]: "重复保险",
    [9]: "您的操作错误",
    [10]: "游戏操作不是正常状态",
    [11]: "数据异常",
    [12]: "游戏操作不是正常状态",
    [13]: "不是当前操作玩家",
    [14]: "游戏操作不是正常状态",
    [15]: "当前还没有下注",
    [16]: "已经停止下注了",
    [17]: "您的余额不足,购买失败,请充值",
    [18]: "超过房间下注上限,系统已默认下最大注",
}
export default cfg_errorCode;
