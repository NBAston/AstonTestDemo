import { stat } from "fs";

const { ccclass, property } = cc._decorator;

/**
 * 创建:gj
 * 作用:语言帮助类
 */
export default class ULanHelper {
    static CONNECT_SERVER = "网络连接中...";
    static CONNECT_LOGIN = "服务器连接成功，登录中...";
    static CONNECT_CLOSE = "服务器连接断开！";
    static LOGIN_SUCESS = "服务器连接成功，登录中...";
    static BATTLE_DISSCONNECT = "游戏服务器连接断开，点击返回大厅!";
    static GAME_INIT = "游戏初始化中，请稍后！";
    static ZJH_CAN_EXIT_GAME = "游戏中禁止退出，请先打完这局哦~";
    static SG_CANT_EXIT_GAME = "游戏中禁止退出，请先打完这局哦~";
    static SG_CANT_EXIT_GAME2 = "您现在在上庄娱乐，下庄后才能退出哦。";
    static ZJH_EXIT_GAME = "确定要退出游戏吗?";
    static ROOM_INFO_ERRO = "获取房间数据异常，请重新进入!";
    static GAME_INFO_ERRO = "游戏服务器未开，请重新进入!";
    static PLAYER_FENSHU_BUZU = "金币不足，进入房间失败。";
    static ACCOUNT_STOP = "账号已封，请联系客服";
    static BATTLE_OVER = "本局游戏已结束，请重新匹配!";
    static GAME_NUMBER = "牌局编号:";
    static NET_ERROR = "网络连接断开!";
    static LOGIN_REPEAT = "您在其他地方登录!";
    static OWER_LEFT = "房主已解散房间，即将返回大厅！";

    static LOGIN_GUOQI = "登录过期，请重新登录!";
    static UPLOAD_HEAD_SUCCESS = "头像上传成功";
    static UPLOAD_HEAD_FAIL = "头像上传失败";
    static HEAD_CHANGE_SUCESS = "头像修改成功!";
    static HEAD_CHANGE_FAIL = "头像修改失败!";
    static CONTACT_CUSTOMER_SERVICE = "请联系客服咨询具体详情"
    static DOWNLOAD_APP = "请点击资源修复按钮修复游戏"


    static FRAME_CHANGE_SUCESS = "头像框修改成功!";
    static FRAME_CHANGE_FAIL = "头像框修改失败!";

    static NICKNAME_CHANGE_FAIL = "昵称修改失败!";
    static NICKNAME_CHANGE_SUCESS = "昵称改成功!";

    static INPUT_POSITIVE_INTEGER = "请输入正确的金额!";
    static INPUT_NUMBER = "请输入正确的数字";
    static INPUT_PHONE_NUMBER = "请输入正确的手机号码";
    static UPDATE_VIP_LEVEL = "请升级VIP等级！";
    static COMMISSION_LACK = "佣金余额不足！";

    static LOGION_FAIL = "重连失败!";
    static REQUEST_SESSION_FAIL = "登录失败，请重新登录游戏!";
    static HTTP_ERROR = "服务器信息获取失败，请稍后再试";
    static GAME_NOT_OPEN = "游戏暂未开放，请耐心等待!";
    static QZNN_MATCH_TIP = [
        "正在为您匹配牌桌\n\n游戏即将开始，请耐心等待.\n",
        "正在为您匹配牌桌\n\n游戏即将开始，请耐心等待..\n",
        "正在为您匹配牌桌\n\n游戏即将开始，请耐心等待...\n"
    ];
    static LOADING_MSG = [
        "正在努力加载中.",
        "正在努力加载中..",
        "正在努力加载中...",
        "正在努力加载中...."
    ];
    static HOTUPDATE_MSG = [
        "资源解压中.",
        "资源解压中..",
        "资源解压中...",
        "资源解压中...."
    ];
    static HOTDOWNLOAD_MSG = [
        "正在更新,请稍后.",
        "正在更新,请稍后..",
        "正在更新,请稍后...",
        "正在更新,请稍后...."
    ];
    static HOTUPDATE_RESTART = "资源重载中...";
    static WAIT_CALL_BANKER = "请等待其他玩家抢庄";
    static WAIT_XIA_ZHU = "您是庄家,请等待其他闲家下注";
    static WAIT_O_XIA_ZHU = "请等待其他闲家下注";
    static WAIT_PIN_CARD = "您已亮牌,请等待其他玩家亮牌";
    static WAIT_SELECT_CARD = "请您选一张牌,在倒计时中可以随意变更";

    static WAIT_CALL_BANKER1 = "请您开始抢庄";
    static WAIT_XIA_ZHU2 = "请您开始下注";
    static WAIT_PIN_CARD3 = "选牌结束,现在可以亮牌";
    static WAIT_SHOW_CARD = "下注结束,现在可以亮牌";

    static ENTERROOM_ERROR = {
        [1]: "对不起, 连接会话丢失, 请稍后重试.！",
        [2]: "对不起, 当前游戏服务不存在, 请稍后重试！",
        [3]: "对不起, 当前房间已满, 请稍后重试！",
        [4]: "对不起, 当前桌台已满, 请稍后重试！",
        [5]: "对不起, 查询玩家信息失败, 请稍后重试！",
        [6]: "对不起, 当前游戏已经开始, 请耐心等待下一局！",
        [7]: "对不起, 您的金币不足, 请充值后重试！",
        [8]: "对不起, 您的金币过多, 无法进入当前房间！",
        [9]: "对不起, 您当前正在别的游戏中, 无法进入当前房间！",
        [10]: "对不起, 当前游戏服务器正在维护, 请稍后重试！",
        [11]: "对不起, 您长时间没有操作, 已被请出当前房间！",
        [12]: "对不起, 当前游戏已经开始, 请在游戏结束后换桌！",
        [13]: "对不起, 断线重连，游戏已结束！",
        [14]: "对不起，游戏登录密码错！",
        [15]: "对不起，您的账号已停用，请联系客服!",
        [16]: "本局结束后退出!"
    };

    static OFF_FANG_CHAOSHI = "防超时弃牌已取消，超时将自动弃牌！";
    static ON_FANG_CHAOSHI = "防超时弃牌已勾选，看牌后顺子及以上牌型超时未操作，系统将自动为您进行跟注或比牌操作！";
    static IP_EMPTY = "IP地址不能为空!";
    static PORT_EMPTY = "端口号不能为空!";
    static ACCOUNT_EMPTY = "账号不能为空!";
    static PSW_EMPTY = "密码不能为空";

    static PHONE_EMPTY = "手机号码不能为空";
    static PHONE_ILLEGAL = "请输入正确的手机号码";
    static CODE_EMPTY = "验证码不能为空";
    static PSW_NO_SAME = "两次输入的密码不一致";
    static PSW_ERROR_LENGTH = "请输入5-12位的密码且不能有空格";
    static CHANGE_PASSWORD_SUCCESS = "修改密码成功！";
    static MINCOMMISSION = "最小兑换金额为50元";
    static GETCOMMISSIONSUCCESS = "提取佣金成功";
    static CHANGE_COMMISSION_SUCCESS = "修改返佣比例成功";
    static CHANGE_COMMISSION_FAIL = "修改返佣比例失败";

    static LIMIT_ONE_ACCOUNT = "至少要存储一个账号信息!";
    static DELETE_ACCOUNT_FAILED = "删除账号信息失败！";
    static NAME_CANT_EMPTY = "名字不能为空！";
    static NAME_TOO_LONG = "最大6位汉字或12位英文数字";

    static NO_BIND_BANK = "未绑定银行卡";
    static NO_BIND_ALI = "未绑定支付宝";
    static ERROR_GOLD = "请输入正确的金额";
    static GOLD_BUZU = "金币不足，无法兑换！";
    static EXCHANGE_ACCOUNT = "兑换账号不能为空";
    static EMPTY_CHI_KAR_REN = "持卡人姓名不能为空";
    static LOGOUT = "确定要登出吗？";
    static CHANGE = "确定要更换吗？";
    static BIND_MOBILE_SUCESS = "正式账号注册成功!";
    static CHARGE_DELAY_TIP = "充值可能发生延迟。如果您已成功扣款，请耐心等待1-5分钟即可到账。5分钟若还未到账，请您联系客服";

    static CHARGE_LIMITED = "请输入100~30000以内的整数";
    static COMMON_EDITBOX_TIPS = "输入错误";
    // static ACCOUNT_LIMITED = "请输入汉字";

    static EXCHARGE_RESULT = {
        [0]: "兑换成功请等待审核打款！",
        [1]: "在游戏中不能进行兑换！",
        [2]: "还没有绑定支付宝！",
        [3]: "还没有绑定银行卡！",
        [4]: "金币不足够,无法兑换！",
        [5]: "账号已冻结，无法兑换！",
        [6]: "临时用户，不能兑换，请您先正式注册！",
        [7]: "金额超过限制,无法兑换！",
        [8]: "超过当日最大兑换次数，无法兑换！",
    };


    static CHARGE_TYPE = {
        [0]: "",
        [1]: "招商银行",
        [2]: "支付宝",
        [3]: "民生银行",
        [4]: "建设银行",
        [5]: "微信",
        [6]: "邮政银行",
        [7]: "",
        [8]: "",
        [9]: "USDT",
        [10]: "",
        [11]: "微信",
        [12]: "支付宝",
        [13]: "网银充值",
        [14]: "京东金融",
        [15]: "",
        [16]: "",
        [17]: "",
    }

    static PAY_TYPE = {
        [1]: "支付宝",
        [2]: "微信支付",
        [3]: "银行卡支付",
        [4]: "云闪付",
        [5]: "支付宝定额",
        [6]: "专享闪付",
    };
    static PAY_STATUS = {
        [1]: "未支付",
        [2]: "已支付",
        [3]: "已补发",
        [4]: "自动审核",
        [6]: "人工审核",
        [8]: "审核中",
        [9]: "已驳回",
        [10]: "准备兑换",
        [15]: "兑换失败",
        [17]: "兑换中",
        [18]: "兑换成功",
        [20]: "已拒绝",
        [24]: "退款成功",
        [25]: "退款中",
        [26]: "退款失败",
        [30]: "订单已取消",
    };
    static GET_MAILE_FAIL = "公告拉取失败，请稍后再试";
    static COPY_SUCESS = "复制成功";
    static GET_SERVERLIST_FAIL = "获取客服列表失败，请选择其他方式充值！";
    static CHECK_SUBGAME_UPDATE = "检查子游戏更新!";
    static FOURCE_EXIT = "长时间未操作，强制退出游戏!";
    static NO_BIND_PHONE = "没有绑定手机，有账号丢失的风险，点击确认继续充值，点击取消前去绑定手机！";
    static WAIT_TB_XIA_ZHU = "请等待其他玩家下注";
    static TBNN_MATCH_TIP = [
        "正在为您匹配牌桌\n\n游戏即将开始，请您耐心等待.\n",
        "正在为您匹配牌桌\n\n游戏即将开始，请您耐心等待..\n",
        "正在为您匹配牌桌\n\n游戏即将开始，请您耐心等待...\n"
    ];

    static CONFIRM_TIP_BOX_TYPE = {
        [1]: "已将转账信息传递给客服请稍后",
        [2]: "您确定申请兑换吗？",
        [3]: "您确认更换已绑定的银行卡吗？",
        [4]: "您确认更换已绑定的支付宝吗？",
        [5]: "您确认更换已绑定的USDT吗？",
    }

    static GAME_HY = {
        HOST_EXIT: "现在退出会导致牌局解散，确定要退出房间？",
        HOST_EXIT_GUEST: "牌局还没有结束，确认要退出吗？",
        HOST_CHECK_OUT: "确定要终止剩余牌局，提前结算？",
        TIME_OUT: "对不起，您长时间没有操作，已被请出当前房间！",
        STATUS_READY: "已进入准备状态，点击旁观可切换状态",
        STATUS_LOOK_ON: "已进入旁观状态，点击准备可切换状态",
        STATUS_ERROR: "游戏状态错误，请重新进入",
        CHECK_OUT_TIP: "房主已对牌局进行结算，本局结算后，牌局将解散",
        EXIT_OFF_TIP: "游戏中禁止退出,请先打完这局哦~",
        THE_HOMEOWNER_DECIDES_TO_HAVE_ANOTHER_ROUND: "房主决定再来一轮",
        THE_IS_CONSIDERING_WHETHER_TO_COME_AGAIN_PLEASE_WAIT: "房主在考虑是否再来一轮，请等待……",
        CHAT_MORE_TIPS: "您发送的太频繁了，歇一会吧",
    }

    static GAME_HELP_TIP_HY = {
        ZHJ_MIN_SCORE: "最小带入积分：单次最少要带入的积分（筹码），底分*倍数=最小带入积分。",
        ZHJ_MAX_SCORE: "最大带入积分：单次最多可带入的积分（筹码），底分*倍数=最大带入积分。",
        ZHJ_IP_LIMIT_SCORE: "IP限制：禁止相同IP段玩家一起游戏。",
        ZHJ_AUTO_READY: "自动准备：每局结束后，自动点击准备按钮。",
        ZHJ_CTR_SCORE: "控制带入积分：玩家每次带入积分，都需要房主审批。",
        ZHJ_AUTO_START: "开局人数：准备人数达到房主配置的人数后，系统才会开局。途中可修改。",
        ZHJ_FORBID_CHAT: "禁止聊天：功能开启后，聊天按钮消失，游戏过程中可打开或关闭。",
    }

    static GAME_PROP_LIMIT = '您丢的东西太多了，稍微休息一下吧'
    static COM_BR_QUIT_GAME = '您现在在上庄娱乐，下庄后才能退出哦。';
}
