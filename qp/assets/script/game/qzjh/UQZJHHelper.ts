import { RoomPlayerInfo } from "../../public/hall/URoomClass";

// const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:抢庄牛牛 帮助文件
 */
// @ccclass
export default class UQZJHHelper {

    static QZJH_SELF_EVENT = {
        QZJH_SC_TS_CANCLE_MATCH: "QZJH_SC_TS_CANCLE_MATCH",//取消匹配
        QZJH_CONTINUE_ACTIVE: "QZJH_CONTINUE_ACTIVE",//继续按钮显示
        QZJH_GAMEINFO_ACTIVE: "QZJH_GAMEINFO_ACTIVE",//房间信息显示

        QZJH_SC_TS_START_MATCH: "QZJH_SC_TS_START_MATCH",
        QZJH_SC_TS_SHOW_MATCH: "QZJH_SC_TS_SHOW_MATCH",
        //开牌场景 不播发牌动画 易出问题
        QZJH_SCENE_OPEN_NOT_SEND_CARD: "QZJH_SCENE_OPEN_NOT_SEND_CARD",
        /**通知下一个命令 */
        QZJH_MOVE_NEXT_CMD: "QZJH_MOVE_NEXT_CMD",
        /**更新房间 牌局编号 */
        QZJH_UPDATE_ROOMID: "QZJH_UPDATE_ROOMID",
        /**更新角色信息 */
        QZJH_UPDATE_ROLEINFO : "QZJH_UPDATE_ROLEINFO",
        /**发牌动画播放完 */
        QZJH_FAPAI_COMPLETE : "QZJH_FAPAI_COMPLETE",
        /**重置场景 */
        QZJH_RESET_SCENE : "QZJH_RESET_SCENE",
        /**抢庄界面打开 创个参数控制显示*/
        QZJH_OPEN_QIANGZHUANG : "QZJH_OPEN_QIANGZHUANG",
        /**倒计时事件 */
        QZJH_DJS_EVENT : "QZJH_DJS_EVENT",
        /**选庄结束事件 */
        QZJH_XUAN_ZHUANG_END_EVENT : "QZJH_XUAN_ZHUANG_END_EVENT",
        /**结算分数赋值事件 */
        QZJH_TOTALSCORE_EVENT : "QZJH_TOTALSCORE_EVENT",

        /**更新房间玩家信息 */
        QZJH_UPDATE_PLAYERS_EVENT : "QZJH_UPDATE_PLAYERS_EVENT",
        /**游戏开始动画播完 */
        QZJH_START_ANI_COMPLETE :"QZJH_START_ANI_COMPLETE",
        /*************scene*************/
        /**游戏开始 1次*/
        QZJH_SUB_S_GAME_START : "QZJH_SUB_S_GAME_START",
        /**叫庄 4次*/
        QZJH_SUB_S_CALL_BANKER : "QZJH_SUB_S_CALL_BANKER",
        /**叫庄结果 1次*/
        QZJH_SUB_S_CALL_BANKER_RESULT : "QZJH_SUB_S_CALL_BANKER_RESULT",
        /**下注结果 1次*/
        QZJH_SUB_S_ADD_SCORE_RESULT : "QZJH_SUB_S_ADD_SCORE_RESULT",
        /**发牌消息 1次*/
        QZJH_SUB_S_SEND_CARD : "QZJH_SUB_S_SEND_CARD",
        /**开牌结果 4次*/
        QZJH_SUB_S_OPEN_CARD_RESULT : "QZJH_SUB_S_OPEN_CARD_RESULT",
        /**游戏结算 1次*/
        QZJH_SUB_S_GAME_END : "QZJH_SUB_S_GAME_END",

        

        /**空闲场景 */
        QZJH_SC_GAMESCENE_FREE : "QZJH_SC_GAMESCENE_FREE",

        /**叫庄场景 */
        QZJH_SC_GAMESCENE_CALL : "QZJH_SC_GAMESCENE_CALL",
        /**下注场景 */
        QZJH_SC_GAMESCENE_SCORE : "QZJH_SC_GAMESCENE_SCORE",
        /**开牌场景 */
        QZJH_SC_GAMESCENE_OPEN : "QZJH_SC_GAMESCENE_OPEN",
        /**游戏结束场景 not use  服务端会发空闲 */
        //QZJH_SC_GAMESCENE_END : "QZJH_SC_GAMESCENE_END",
        /********* hide *********/
        /**拼牌加 */
        QZJH_PINPAI_ADD : "QZJH_PINPAI_ADD",
        /**拼牌减 */
        QZJH_PINPAI_DEL : "QZJH_PINPAI_DEL",
        /**拼牌点击按钮完成 事件 */
        QZJH_PINCARD_DONE : "QZJH_PINCARD_DONE",
        /**打开说明界面 */
        QZJH_SM_OPEN : "QZJH_SM_OPEN",
        /**测试流程 匹配 */
        QZJH_PIPEI : "QZJH_PIPEI",
        /**下注界面打开 创个参数控制显示*/
        //QZJH_OPEN_XIAZHU = "QZJH_OPEN_XIAZHU";
        
        /**庄家通杀事件 */
        // QZJH_TONGSHA_EVENT : "QZJH_TONGSHA_EVENT",
        /**庄家通赔事件 */
        QZJH_TONGPEI_EVENT : "QZJH_TONGPEI_EVENT",
        QZJH_NEXT_EXIT : "QZJH_NEXT_EXIT",
    };
    static QZJH_EVENT = {
        QZJH_GAMESCENE_FREE: "QZJH_GAMESCENE_FREE",
        QZJH_GAMESCENE_CALL: "QZJH_GAMESCENE_CALL",
        QZJH_GAMESCENE_SCORE: "QZJH_GAMESCENE_SCORE",
        QZJH_GAMESCENE_OPEN: "QZJH_GAMESCENE_OPEN",

        QZJH_GAME_START: "QZJH_GAME_START",
        QZJH_CALL_BANKER: "QZJH_CALL_BANKER",
        QZJH_CALL_BANKER_RESULT: "QZJH_CALL_BANKER_RESULT",
        QZJH_ADD_SCORE_RESULT: "QZJH_ADD_SCORE_RESULT",
        QZJH_SEND_CARD: "QZJH_SEND_CARD",
        QZJH_OPEN_CARD_RESULT: "QZJH_OPEN_CARD_RESULT",
        QZJH_GAME_END: "QZJH_GAME_END",
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
        [0]: "danzhang",
        [1]: "duizi",
        [2]: "shunzi",
        [3]: "jinhua",
        [4]: "shunjin",
        [5]: "baozi",
        [6]: "danzhang",
    };

}

/**
 * 创建:dz
 * 作用:抢庄牛牛 ui层级索引
 */
export enum EQZJHUIzIndex {
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
export enum EQZJHUITipType {
    Zero = 0,
    One = 1,
    Two = 2,
    Three = 3
}

/**抢庄牛牛玩家的战斗数据 */
export class QZJHBattlePlayerInfo extends RoomPlayerInfo {
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

    /**是否退出 */
    isExit: boolean =false;
}

/**ui命令 */
export class UQZJHCmd {
    cmd: string;
    needwait: boolean;
    data: any
}


/**
 * 抢庄牛牛游戏的状态
 */
export enum EQZJHState {

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





