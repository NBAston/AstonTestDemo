
/**
 * 创建：gj
 * 作用：存放使用的枚举
 */

/**
 * 场景的枚举
 */
export enum ELevelType {
    Login = 1,
    /**
     * 大厅
     */
    Hall = 2,
    /**
     * 扎金花
     */
    ZJH = 3,
    /**
     * 抢庄牛牛
     */
    QZNN = 4,

    /**
     * 百人龙虎
     */
    BRLH = 5,
    /**
     * BlackJack 21dian
     */
    BJ = 6,
    /**
     * 百人牛牛
     */
    BRNN = 7,
    /**
     * 百人二八杠
     */
    BREBG = 8,
    /**
     * 红黑大战
     */
    BRHH = 9,
    /**
     * 三公
     */
    SG = 10,
    KPQZNN = 11,
    TBNN = 12,
    ZZWZ = 13,
    BRJH = 14,

    QZJH = 15,
    KPQZJH = 16,
    TBJH = 17,
    XPJH = 18,

    //选牌抢庄牛牛
    XPQZNN = 19,
    //奔驰宝马
    BCBM = 20,
    DDZ = 21,
    PDK = 22,
    //十三水
    SSS = 23,

    //好友房
    TBNN_HY = 24,
    PDK_HY = 25,
    KPQZNN_HY = 26,
    ZJH_HY = 27,
    DDZ_HY = 28,

    BJL = 29,
    SH = 30,
    DZPK = 31,
}

/**
 * 共有UI的类型
 */
export enum ECommonUI {
    None,
    /**
     * 进度条
     */
    Loading = 1,
    /**
     * 同用弹出框
     */
    MsgBox = 2,


    LB_Head = 3,
    LB_Setting = 4,
    LB_Record = 5,
    LB_Personal = 6,
    LB_ReName = 7,
    LB_Regester = 8,
    LB_Bank = 9,
    LB_BANK_RECORD = 55,
    LB_EXCHANGE = 10,
    LB_BindAli = 11,
    LB_BindBank = 12,
    LB_Head_Image_From = 13,


    LB_RegesterPopu = 15,
    LB_Rank = 16,
    LB_Announce = 17,
    LB_AnnounceDetail = 18,
    LB_Charge = 19,
    LB_VIP = 20,
    LB_Awards = 21,
    LB_Proxy = 22,
    LB_ChargeRecords = 23,
    LB_ExChargeRecords = 24,
    // GM_Setting = 25,
    LB_WithdrawCommission = 26,
    LB_PerformanceQuery = 27,
    LB_Service_Mail = 28,
    LB_Chat = 29,
    LB_SELECT_POSTER = 30,
    LB_COMMISSION_CONTRIBUTION = 31,
    LB_SET_COMMISSION = 32,
    LB_Mail_Detail = 33,

    UI_CUSTOM_CHARGE = 34,
    UI_CUSTOM_ORDERLIST = 35,
    UI_CUSTOM_ORDERINFO = 36,

    UI_MANDATORY_POPUP = 37,
    LB_TASK = 38,
    LB_ACTIVITY = 39,
    LB_Village = 40,
    UI_APPONINTMENT_RECORD = 41,
    UI_CREAT_ROOM = 42,
    UI_RESOURCE_LOADING = 43,
    UI_SETTING_HY = 44,
    UI_REAL_TIME_RECORD = 45,
    UI_ENTER_ROOM = 46,
    UI_BRING_POINTS = 47,
    UI_CHAT_HY = 48,
   
    /***
     * 邀请初始化
     * @param data.eGameType 游戏 id EGameType.xxx
     * @param data.roomInfo 房间信息 必须包含 roomId 、 roomUserId 、 allRound、currentRound 、ceilScore 键值对
     * @param data.headId 用户头像id， SC_TS_ROOM_PLAYERINFO 协议 对比自己userid 取值
     * **/
    UI_SHARED_HY = 49,

    ZJH_Room = 50,
    ZJH_Help = 51,
    UI_RECORD_DETAIL = 52,
    UI_CREATE_ROOM_RECORD = 53,
    UI_TIP_HY = 54,

    UI_TRANSFER = 60,
    UI_TRANSFER_POP = 70,

    UI_AWARD_ROOM_CARD = 62,
    UI_CARRYING = 63,
    UI_BIND_WECHAT_VERIFY = 64,
    UI_GAME_PROP = 65,
    UI_GAME_MIPAI = 66,
    /**qznn 菜单 */
    QZNN_Menu = 100,
    /**qznn 帮助界面 */
    QZNN_Help = 101,
    /**开始说明 */
    QZNN_SM = 102,
    /**提示界面 */
    QZNN_Tip = 103,
    QZNN_Record = 104,
    QZNN_Room = 105,

    /**选牌抢庄 */
    XPQZNN_Room = 1050,
    /**牌型界面 */
    QZNN_PX = 106,
    /**设置界面 */
    QZNN_Setting = 107,
    /**反馈界面 */
    QZNN_FanKui = 108,

    BRLH_Room = 200,
    BRLH_Help = 201,
    BRLH_Records = 202,
    BRLH_Setting = 203,
    BRLH_Feedback = 204,
    BRLH_Ludan = 205,

    SG_Room = 300,
    SG_Help = 301,
    SG_Records = 302,

    BJ_Room = 400,
    BJ_Help = 401,
    BJ_Records = 402,

    BRNN_Room = 500,
    BRNN_Help = 501,
    BRNN_Record = 502,
    BRNN_Ludan = 503,


    EBG_Room = 600,
    EBG_Help = 601,
    EBG_Record = 602,
    EBG_Ludan = 603,

    BRHH_Room = 700,
    BRHH_Help = 701,
    BRHH_Record = 702,
    BRHH_Ludan = 703,



    KPQZNN_Room = 800,
    KPQZNN_Help = 801,

    TBNN_Room = 900,
    TBNN_Help = 901,
    TBNN_Menu = 902,
    /**开始说明 */
    TBNN_SM = 903,
    /**提示界面 */
    TBNN_Tip = 904,
    TBNN_Record = 905,
    /**牌型界面 */
    TBNN_PX = 906,
    /**设置界面 */
    TBNN_Setting = 907,
    /**反馈界面 */
    TBNN_FanKui = 908,
    /**充值确认提示界面 */
    CHARGE_CONFIRM_BOX = 909,
    /**充值订单取消确认框 */
    CHARGE_CANCEL_CONFIRM_BOX = 910,
    /**绑定银行卡 */
    EXCHANGE_BIND_BANK_CARD = 911,
    /**绑定支付宝 */
    EXCHANGE_BIND_ALIPAY = 912,
    /**绑定USDT */
    EXCHANGE_BIND_USDT = 913,
    /**绑定真实姓名 */
    EXCHANGE_BIND_USERNAME = 914,
    /**取消绑定银行卡弹框 */
    EXCHANGE_CANCEL_BIND_BOX = 915,
    /**USDT帮助 */
    UI_USDT_HELP = 916,
    /**充值订单详情弹框 */
    UI_CHARGE_ORDER_DETAIL_BOX = 917,
    UI_CHARGE_USDT_QRCODE = 918,
    UI_EXCHANGE_ORDER_LIST = 919,
    UI_EXCHANGE_ORDER_TIP = 920,

    NewMsgBox = 1000,

    SUOHA_Room = 2000,
    // ZZWZ_Help = 2001,

    BRJH_Room = 2100,
    BRJH_Ludan = 2101,

    QZJH_Room = 2110,
    KPQZJH_Room = 2120,
    TBJH_Room = 2130,
    XPJH_Room = 2140,
    DDZ_Room = 2150,
    PDK_Room = 2160,
    BJL_Room = 2170,
    BJL_Ludan = 2171,

    //奔驰宝马
    BCBM_Help = 2200,
    BCBM_Record = 2201,
    BCBM_Ludan = 2202,
    BCBM_RecordItem = 2203,

    TBJH_Record = 2210,

    UI_ERROR_LOG = 2220,

    //十三水
    SSS_Help = 2300,
    SSS_Room = 2301,

    //梭哈
    SH_Help = 4200,
    SH_Room = 4201,
    Game_SH = 4202,

    //德州扑克
    DZPK_Help = 4500,
    DZPK_Room = 4501,
    Game_DZPK = 4502,

    //game
    GAME_Bcbm = 3001,
    GAME_bj = 3002,
    GAME_brebg = 3003,
    GAME_brhh = 3004,
    GAME_brjh = 3005,
    GAME_brlh = 3006,
    GAME_brnn = 3007,
    GAME_ddz = 3008,
    Game_kpqzjh = 3009,
    Game_kpqznn = 3010,
    Game_pdk = 3011,
    Game_qzjh = 3012,
    Game_qznn = 3013,
    Game_sg = 3014,
    Game_sss = 3015,
    Game_tbjh = 3016,
    Game_tbnn = 3017,
    Game_xpjh = 3018,
    Game_xpqznn = 3019,
    Game_zjh = 3020,
    Game_zzwz = 3021,

    //好友房游戏
    Game_zjh_hy = 1101,
    Game_ddz_hy = 1201,
    Game_pdk_hy = 1301,
    Game_kpqznn_hy = 1401,
    Game_tbnn_hy = 1501,

    Game_record_kpqznn_hy = 1402,
    Game_record_tbnn_hy = 1502,

    Game_bjl = 3022,
    Game_suoha = 3023,

    /**俱乐部*/
    CLUB_HALL = 5000,
    UI_CREATE_CLUB = 5001,
    UI_CLUB = 5002,
    CLUB_ROOMINFO = 5003,//房间信息
    CLUB_ABS_MONEY = 5004,//提起佣金
    CLUB_UP_PARTNER = 5005,//升级合伙人
    CLUB_PERF_QUERY = 5008,//俱乐部业绩详情
    CLUB_CHANGE_SCALE = 5009,//直属合伙人修改比例
    CLUB_LEVEL_UP = 5010,//普通会员升级为合伙人
    CLUB_CHANGE_INFO = 5011,//盟主查看非直属合伙人或会员的信息
    CLUB_HALL_JOIN = 5012,   // 大厅加入俱乐部
    CLUB_HALL_ACTIVITY = 5013,   // 俱乐部大厅活动
    Game_dzpk = 3024,

}
export enum EUIPos {
    None,
    /**
     * 普通
     */
    Normal,
    /**
     * 弹出框
     */
    Window,
}
export enum EGameHot {
    Normal = 0,
    Hot = 1,
    New = 2,
}
/** 游戏状态 -1:关停 0:暂未开放 1：正常*/
export enum EGameStatus {
    /**
     * 关服
     */
    Close = -1,
    /**
     * 暂未开放
     */
    WaitOpen = 2,
    Open = 1,
}

/** 房间类型 1:普通房间 2：好友房间 3：俱乐部*/
export enum ERoomKind {
    Normal = 0,
    Friend = 1,
    Club = 2,

}
/**進入游戲失敗錯誤碼 */
export enum EEnterRoomErrCode {
    ERROR_ENTERROOM_NOSESSION = 1,      // 对不起,连接会话丢失,请稍后重试.
    ERROR_ENTERROOM_GAMENOTEXIST,       // 对不起,当前游戏服务不存在,请稍后重试.
    ERROR_ENTERROOM_TABLE_FULL,         // 对不起,当前房间已满,请稍后重试.
    ERROR_ENTERROOM_SEAT_FULL,          // 对不起,当前桌台已满,请稍后重试.
    ERROR_ENTERROOM_USERNOTEXIST,       // 对不起,查询玩家信息失败,请稍后重试.
    ERROR_ENTERROOM_SCORENOENOUGH,      // 对不起,您的金币不足,请充值后重试.         
    ERROR_ENTERROOM_ALREAY_START,       // 对不起,当前游戏已经开始,请耐心等待下一局.
    ERROR_ENTERROOM_SCORELIMIT,         // 对不起,您的金币过多,无法进入当前房间.
    ERROR_ENTERROOM_USERINGAME,         // 对不起,您当前正在别的游戏中,无法进入当前房间.
    ERROR_ENTERROOM_SERVERSTOP,         // 对不起,当前游戏服务器正在维护,请稍后重试.
    ERROR_ENTERROOM_LONGTIME_NOOP,      // 对不起,您长时间没有操作,已被请出当前房间.
    ERROR_ENTERROOM_SWITCHTABLEFAIL,    // 对不起,当前游戏已经开始,请在游戏结束后换桌.
    ERROR_ENTERROOM_GAME_IS_END,        // 对不起,断线重连，游戏已结束
    ERROR_ENTERROOM_PASSWORD_ERROR,     //对不起，游戏登录密码错.
    ERROR_ENTERROOM_STOP_CUR_USER,      // 账号已封，请联系客服.             
    ERROR_ENTERROOM_USER_AUTO_EXIT,     // 本局结束后退出.
    ERROR_ENTERROOM_OTHER               // 其它错误情况，错误后面会带上 错误消息
};

/**
 * 游戏类型
 */
export enum EGameType {
    /**
     * 百人牛牛
     */

    BRNN = 930,
    /**
     *二十一点
     */
    BJ = 600,
    /**
     * 百人龙虎
     */
    QZLH = 900,
    /**
     * 红黑(万人扎金花)
     */
    BRHH = 210,
    /**
     * 百人金花
     */
    BRJH = 920,
    /**
     * 抢庄牛牛
     */
    QZNN = 830,
    /**
    * 选牌抢庄牛牛
    */
    XPQZNN = 810,
    /**
     * 扎金花
     */
    ZJH = 220,
    /**
     * 二八杠
     */
    BREBG = 720,
    /**
     * 三公
     */
    SG = 860,
    /**
     * 看牌抢庄牛牛
     */
    KPQZNN = 890,
    /**
    * 通比牛牛
    */
    TBNN = 870,
    /**
     * 梭哈
     */
    SH = 420,

    /**
    * 德州扑克
    */
    DZPK = 450,

    QZJH = 840,
    KPQZJH = 820,
    TBJH = 850,
    XPJH = 880,
    /**
     * 奔驰宝马
     */
    BCBM = 950,
    DDZ = 100,
    // 跑得快
    PDK = 300,
    //十三水
    SSS = 550,
    BJL = 910,

    //好友房
    ZJH_HY = 11,
    DDZ_HY = 12,
    PDK_HY = 13,
    KPQZNN_HY = 14,
    TBNN_HY = 15,
}
export enum EGameState {
    /**
     * 普通
     */
    Normal = 0,
    /**
     * 新游戏
     */
    New = 1,
    /**
     * 火热游戏
     */
    Hot = 2,
    /**
     * 维护中
     */
    WeiHu = 3,
    /**
     * 关闭
     */
    Close = 4,
}

/**
 * Icon图片资源
 */
export enum EIconType {
    Head,
    Frame,
    chatHead,
}
/**
 * 扑克牌花色
 */
export enum EPokerType {
    /**黑 */
    Spade,
    /**红 */
    Heart,
    /**梅 */
    Club,
    /**方 */
    Diamond,
    /**鬼 */
    Joker
}
/**状态位置 */
export enum EAppStatus {
    /**登陆中 */
    Login,
    /**在大厅 */
    Hall,
    /**在房间*/
    Room,
    /**在游戏中 */
    Game,
}
export enum ELeftType {
    ReturnToRoom = 1,
    CancleMatch = 2,
    LeftGame = 3,
}
/**Msg弹框类型 */
export enum EMsgType {
    EOK = 1,
    EExitGame = 2,
    EOKAndCancel = 3
}
export enum ETipType {
    /**重复显示 */
    repeat,
    /**
     * 只有一个
     */
    onlyone,
}

export enum ELoginType {
    Browser = 1,
    Webview,
    NativeApp,
}
/**
 * 兑换类型
 */
export enum EExchareType {
    alipay = 2, // 阿里支付
    bank = 3, // 银行卡
    usdt = 4, // usdt
}
/**
 * 充值类型
 */
export enum EChargeType {
    BankPay = 1, // 银行卡
    Alipay = 2,  // 支付宝
    WechatPay = 3, // 微信支付
    UsdtPay = 5, // USDT
    OtherPay = 20,// 其他类型
}

/**取消兑换订单类型 */
export enum CancelExchangeType {
    BankPay = 3, // 银行
    Alipay = 2, // 支付宝
    UsdtPay = 4, // USDT
}

/**
 * 子游戏更新状态
 */
export enum EGameUpdateStatus {
    /**
     * 需要更新
     */
    Update,
    /**
     * 更新中
     */
    Updating,
    /**
     * 已更新
     */
    Updated,
}

/**
 * 提示框的类型
 */
export enum ConfirmTipBoxType {
    ConfirmHadChargeType = 1, // 已转账信息弹框
    ConfirmExchangeType = 2, // 确认兑换弹框
}

//登录方式
export enum ELoginType {
    autoLogin = 1,
    fastLogin = 2,
    accountLogin = 3,
    forgetPsw = 4,
    weChat = 5,
    weChatBind = 6,
    regesterAccount = 7,
}

//更新提示
export enum EMsgType {
    clear = 0,   //清空缓存
    failed = 1,  // 下载配置文件失败
    downapp = 2, //下载APP
    kefu = 3,  // 客服 
}

//代理等级请求类型
export enum EAgentLevelReqType {
    default = 0,     //纯获取数据(房卡转账界面)
    hall = 1,       //大厅
    recharge = 2,   //账户充值
    promotion = 3,   //月入百万 
    creatRoom = 4,   //创建房间
    enterRoom = 5,   //创建房间
}

/**广播消息类型 */
export enum InformMessageType {
    gameProp = 1,
    gameChatProp = 2, // 聊天消息
}


