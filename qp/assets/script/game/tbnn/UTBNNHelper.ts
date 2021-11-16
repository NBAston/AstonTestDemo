import { RoomPlayerInfo } from "../../public/hall/URoomClass";



// const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:抢庄牛牛 帮助文件
 */
// @ccclass
export default class UTBNNHelper {

    static TBNN_SELF_EVENT = {
        TBNN_GAME_TO_SHOW:"TBNN_GAME_TO_SHOW",//切后台，刷新场景
        TBNN_SC_TS_CANCLE_MATCH: "TBNN_SC_TS_CANCLE_MATCH",//取消匹配
        TBNN_CONTINUE_ACTIVE: "TBNN_CONTINUE_ACTIVE",//继续按钮显示
        TBNN_GAMEINFO_ACTIVE: "TBNN_GAMEINFO_ACTIVE",//房间信息显示

        TBNN_SC_TS_START_MATCH: "TBNN_SC_TS_START_MATCH",
        TBZNN_SC_TS_SHOW_MATCH: "TBNN_SC_TS_SHOW_MATCH",
        //开牌场景 不播发牌动画 易出问题
        TBNN_SCENE_OPEN_NOT_SEND_CARD: "TBNN_SCENE_OPEN_NOT_SEND_CARD",
        /**通知下一个命令 */
        TBNN_MOVE_NEXT_CMD: "TBNN_MOVE_NEXT_CMD",
        /**更新房间 牌局编号 */
        TBNN_UPDATE_ROOMID: "TBNN_UPDATE_ROOMID",
        /**更新角色信息 */
        TBNN_UPDATE_ROLEINFO : "TBNN_UPDATE_ROLEINFO",
        /**发牌动画播放完 */
        TBNN_FAPAI_COMPLETE : "TBNN_FAPAI_COMPLETE",
        /**重置场景 */
        TBNN_RESET_SCENE : "TBNN_RESET_SCENE",
        /**抢庄界面打开 创个参数控制显示*/
        TBNN_OPEN_QIANGZHUANG : "TBNN_OPEN_QIANGZHUANG",
        /**倒计时事件 */
        TBNN_DJS_EVENT : "TBNN_DJS_EVENT",
        /**选庄结束事件 */
        TBNN_XUAN_ZHUANG_END_EVENT : "TBNN_XUAN_ZHUANG_END_EVENT",
        /**结算分数赋值事件 */
        TBNN_TOTALSCORE_EVENT : "TBNN_TOTALSCORE_EVENT",

        /**更新房间玩家信息 */
        TBNN_UPDATE_PLAYERS_EVENT : "TBNN_UPDATE_PLAYERS_EVENT",
        /**游戏开始动画播完 */
        TBNN_START_ANI_COMPLETE :"TBNN_START_ANI_COMPLETE",
        /*************scene*************/
        /**游戏开始 1次*/
        TBNN_SUB_S_GAME_START : "TBNN_SUB_S_GAME_START",
        /**叫庄 4次*/
        TBNN_SUB_S_CALL_BANKER : "TBNN_SUB_S_CALL_BANKER",
        /**叫庄结果 1次*/
        TBZNN_SUB_S_CALL_BANKER_RESULT : "TBNN_SUB_S_CALL_BANKER_RESULT",
        /**下注结果 1次*/
        TBNN_SUB_S_ADD_SCORE_RESULT : "TBNN_SUB_S_ADD_SCORE_RESULT",
        /**发牌消息 1次*/
        TBNN_SUB_S_SEND_CARD : "TBNN_SUB_S_SEND_CARD",
        /**开牌结果 4次*/
        TBNN_SUB_S_OPEN_CARD_RESULT : "TBNN_SUB_S_OPEN_CARD_RESULT",
        /**游戏结算 1次*/
        TBNN_SUB_S_GAME_END : "TBNN_SUB_S_GAME_END",

        

        /**空闲场景 */
        TBNN_SC_GAMESCENE_FREE : "TBNN_SC_GAMESCENE_FREE",

        /**叫庄场景 */
        TBNN_SC_GAMESCENE_CALL : "TBNN_SC_GAMESCENE_CALL",
        /**下注场景 */
        TBNN_SC_GAMESCENE_SCORE : "TBNN_SC_GAMESCENE_SCORE",
        /**开牌场景 */
        TBNN_SC_GAMESCENE_OPEN : "TBNN_SC_GAMESCENE_OPEN",
        /**游戏断线重连显示下注按钮*/
        TBNN_SC_GAMESCENE_RELINE: "TBNN_SC_GAMESCENE_RELINE",
        /**游戏结束场景 not use  服务端会发空闲 */
        //TBNN_SC_GAMESCENE_END : "TBNN_SC_GAMESCENE_END",
        /********* hide *********/
        /**拼牌加 */
        TBNN_PINPAI_ADD : "TBNN_PINPAI_ADD",
        /**拼牌减 */
        TBNN_PINPAI_DEL : "TBNN_PINPAI_DEL",
        /**拼牌点击按钮完成 事件 */
        TBNN_PINCARD_DONE : "TBNN_PINCARD_DONE",
        /**打开说明界面 */
        TBNN_SM_OPEN : "TBNN_SM_OPEN",
        /**测试流程 匹配 */
        TBNN_PIPEI : "TBNN_PIPEI",
        /**下注界面打开 创个参数控制显示*/
        //TBNN_OPEN_XIAZHU = "TBNN_OPEN_XIAZHU";
        
        /**庄家通杀事件 */
        // TBNN_TONGSHA_EVENT : "TBNN_TONGSHA_EVENT",
        /**庄家通赔事件 */
        TBNN_TONGPEI_EVENT : "TBNN_TONGPEI_EVENT",

        TBNN_NEXT_EXIT : "TBNN_NEXT_EXIT",

    };
    static TBNN_EVENT = {
        TBNN_GAMESCENE_FREE: "TBNN_GAMESCENE_FREE",
        TBNN_GAMESCENE_CALL: "TBNN_GAMESCENE_CALL",
        TBNN_GAMESCENE_SCORE: "TBNN_GAMESCENE_SCORE",
        TBNN_GAMESCENE_OPEN: "TBNN_GAMESCENE_OPEN",
        TBNN_GAMESCENE_END: "TBNN_GAMESCENE_END",

        TBNN_GAME_START: "TBNN_GAME_START",
        TBNN_CALL_BANKER: "TBNN_CALL_BANKER",
        TBNN_CALL_BANKER_RESULT: "TBNN_CALL_BANKER_RESULT",
        TBNN_ADD_SCORE_RESULT: "TBNN_ADD_SCORE_RESULT",
        TBNN_SEND_CARD: "TBNN_SEND_CARD",
        TBNN_OPEN_CARD_RESULT: "TBNN_OPEN_CARD_RESULT",
        TBNN_GAME_END: "TBNN_GAME_END",
    };
    /**not use */
    static CARD_TYPE = {
        [0]: "nobull",
        [1]: "bull1",
        [2]: "bull2",
        [3]: "bull3",
        [4]: "bull4",
        [5]: "bull5",
        [6]: "bull6",
        [7]: "bull7",
        [8]: "bull8",
        [9]: "bull9",
        [10]: "bullbull",
        [11]: "sihuabull",
        [12]: "wuhuabull",
        [13]: "bomb",
        [14]: "wuxiaobull"
    };


    static CARD_TYPE2 = {
        [0]: "mnlose",
        [1]: "n1win",
        [2]: "n2win",
        [3]: "n3win",
        [4]: "n4win",
        [5]: "n5win",
        [6]: "n6win",
        [7]: "n7win",
        [8]: "n8win",
        [9]: "n9win",
        [10]: "nnwin",
        [11]: "shnwin",
        [12]: "whnwin",
        [13]: "szwin",
        [14]: "wxnwin"
    };

}

/**
 * 创建:dz
 * 作用:抢庄牛牛 ui层级索引
 */
export enum ETBNNUIzIndex {
    /**底层/main界面 */
    Bottom = 1,
    /**玩家界面*/
    PlayerNode = 2,
    /**牌界面 */
    CardsNode = 3,
    /**结算界面 */
    ResultNode = 4,
    /**动画 */
    AniNode = 5,
    /**比较特殊的 */
    Special = 6,
    /**金币层 */
    CoinNode = 7,
    /**帮助/弹出框界面 */
    SetNode = 8,
    /**最上层 */
    Top = 1000
}
/**
 * 创建:dz
 * 作用:提示面板类型 数值代表按钮数
 */
export enum ETBNNUITipType {
    Zero = 0,
    One = 1,
    Two = 2,
    Three = 3
}

/**抢庄牛牛玩家的战斗数据 */
export class TBNNBattlePlayerInfo extends RoomPlayerInfo {
    /**玩家的总过的下注数 */
    userTotal: number = 0;
    /**玩家玩了几轮 */
    playTurn: number = 0;
    /**是否为turn */
    isturn: boolean;
    /**玩家是否为先手 */
    // isFirst: boolean = false;
    /**玩家手牌的状态 */
    // paiState: ESGBattlePlayerPaiState = 0;
    /**自动跟注 */
    // auto: boolean = false;
    /**玩家的牌 */
    pai: Array<number>;
    paiXing: number = 0;
    /**剩下的cd时间 */
    cdtime: number;
    /**展示的桌面id */
    seatId: number;

    /**玩家状态 */
    playStatus: number;
    userId: number;
     /**是否退出 */
     isExit :boolean = false;
}

/**ui命令 */
export class UTBNNCmd {
    cmd: string;
    needwait: boolean;
    data: any
}


/**
 * 抢庄牛牛游戏的状态
 */
export enum ETBNNState {

    /**
     * 等待状态
     */
    Wait,
    /**
     * 匹配状态
     */
    Match,
    /**
     * 游戏状态
     */
    Gameing,
    /**
     * 
     */
    Watching,
    /**
     * 取消匹配中
     */
    LeftGame,

    AlreadyLeft,
}

/**抢庄牛牛最多牌数 */
export const MAX_COUNT = 5;

/**无牛 */
export const OX_VALUE0 = 0;
/**牛牛 */
export const OX_OX = 10;
/**银牛 */
export const OX_SILVERY_BULL = 11;
/**炸弹（四梅） */
export const OX_BOMB = 12;
/**五花牛（金牛） */
export const OX_GOLDEN_BULL = 13;
/**五小牛 */
export const OX_FIVE_SMALL = 14;





