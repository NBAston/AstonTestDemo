import { RoomPlayerInfo } from "../../public/hall/URoomClass";



// const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:抢庄牛牛 帮助文件
 */
// @ccclass
export default class UKPQZJHHelper {

    static QZNN_SELF_EVENT = {
        QZNN_SC_TS_CANCLE_MATCH: "KPQZJH_SC_TS_CANCLE_MATCH",//取消匹配
        QZNN_CONTINUE_ACTIVE: "KPQZJH_CONTINUE_ACTIVE",//继续按钮显示
        QZNN_GAMEINFO_ACTIVE: "KPQZJH_GAMEINFO_ACTIVE",//房间信息显示

        QZNN_SC_TS_START_MATCH: "KPQZJH_SC_TS_START_MATCH",
        QZNN_SC_TS_SHOW_MATCH: "KPQZJH_SC_TS_SHOW_MATCH",
        //开牌场景 不播发牌动画 易出问题
        QZNN_SCENE_OPEN_NOT_SEND_CARD: "KPQZJH_SCENE_OPEN_NOT_SEND_CARD",
        /**通知下一个命令 */
        QZNN_MOVE_NEXT_CMD: "KPQZJH_MOVE_NEXT_CMD",
        /**更新房间 牌局编号 */
        QZNN_UPDATE_ROOMID: "KPQZJH_UPDATE_ROOMID",
        /**更新角色信息 */
        QZNN_UPDATE_ROLEINFO : "KPQZJH_UPDATE_ROLEINFO",
        /**发牌动画播放完 */
        QZNN_FAPAI_COMPLETE : "KPQZJH_FAPAI_COMPLETE",
        /**重置场景 */
        QZNN_RESET_SCENE : "KPQZJH_RESET_SCENE",
        /**抢庄界面打开 创个参数控制显示*/
        QZNN_OPEN_QIANGZHUANG : "KPQZJH_OPEN_QIANGZHUANG",
        /**倒计时事件 */
        QZNN_DJS_EVENT : "KPQZJH_DJS_EVENT",
        /**选庄结束事件 */
        QZNN_XUAN_ZHUANG_END_EVENT : "KPQZJH_XUAN_ZHUANG_END_EVENT",
        /**结算分数赋值事件 */
        QZNN_TOTALSCORE_EVENT : "KPQZJH_TOTALSCORE_EVENT",

        /**更新房间玩家信息 */
        QZNN_UPDATE_PLAYERS_EVENT : "KPQZJH_UPDATE_PLAYERS_EVENT",
        /**游戏开始动画播完 */
        QZNN_START_ANI_COMPLETE :"KPQZJH_START_ANI_COMPLETE",
        /*************scene*************/
        /**游戏开始 1次*/
        QZNN_SUB_S_GAME_START : "KPQZJH_SUB_S_GAME_START",
        /**叫庄 4次*/
        QZNN_SUB_S_CALL_BANKER : "KPQZJH_SUB_S_CALL_BANKER",
        /**叫庄结果 1次*/
        QZNN_SUB_S_CALL_BANKER_RESULT : "KPQZJH_SUB_S_CALL_BANKER_RESULT",
        /**下注结果 1次*/
        QZNN_SUB_S_ADD_SCORE_RESULT : "KPQZJH_SUB_S_ADD_SCORE_RESULT",
        /**发牌消息 1次*/
        QZNN_SUB_S_SEND_CARD : "KPQZJH_SUB_S_SEND_CARD",
        /**开牌结果 4次*/
        QZNN_SUB_S_OPEN_CARD_RESULT : "KPQZJH_SUB_S_OPEN_CARD_RESULT",
        /**游戏结算 1次*/
        QZNN_SUB_S_GAME_END : "KPQZJH_SUB_S_GAME_END",

        

        /**空闲场景 */
        QZNN_SC_GAMESCENE_FREE : "KPQZJH_SC_GAMESCENE_FREE",

        /**叫庄场景 */
        QZNN_SC_GAMESCENE_CALL : "KPQZJH_SC_GAMESCENE_CALL",
        /**下注场景 */
        QZNN_SC_GAMESCENE_SCORE : "KPQZJH_SC_GAMESCENE_SCORE",
        /**开牌场景 */
        QZNN_SC_GAMESCENE_OPEN : "KPQZJH_SC_GAMESCENE_OPEN",
        /**游戏结束场景 not use  服务端会发空闲 */
        //QZNN_SC_GAMESCENE_END : "KPQZJH_SC_GAMESCENE_END",
        /********* hide *********/
        /**拼牌加 */
        QZNN_PINPAI_ADD : "KPQZJH_PINPAI_ADD",
        /**拼牌减 */
        QZNN_PINPAI_DEL : "KPQZJH_PINPAI_DEL",
        /**拼牌点击按钮完成 事件 */
        QZNN_PINCARD_DONE : "KPQZJH_PINCARD_DONE",
        /**打开说明界面 */
        QZNN_SM_OPEN : "KPQZJH_SM_OPEN",
        /**测试流程 匹配 */
        QZNN_PIPEI : "KPQZJH_PIPEI",
        /**下注界面打开 创个参数控制显示*/
        //QZNN_OPEN_XIAZHU = "KPQZJH_OPEN_XIAZHU";
        
        /**庄家通杀事件 */
        // QZNN_TONGSHA_EVENT : "KPQZJH_TONGSHA_EVENT",
        /**庄家通赔事件 */
        QZNN_TONGPEI_EVENT : "KPQZJH_TONGPEI_EVENT",

        /**下局离场 */
        QZNN_NEXT_EXIT: "QZNN_NEXT_EXIT",
    };
    static QZNN_EVENT = {
        QZNN_GAMESCENE_FREE: "KPQZJH_GAMESCENE_FREE",
        QZNN_GAMESCENE_CALL: "KPQZJH_GAMESCENE_CALL",
        QZNN_GAMESCENE_SCORE: "KPQZJH_GAMESCENE_SCORE",
        QZNN_GAMESCENE_OPEN: "KPQZJH_GAMESCENE_OPEN",

        QZNN_GAME_START: "KPQZJH_GAME_START",
        QZNN_CALL_BANKER: "KPQZJH_CALL_BANKER",
        QZNN_CALL_BANKER_RESULT: "KPQZJH_CALL_BANKER_RESULT",
        QZNN_ADD_SCORE_RESULT: "KPQZJH_ADD_SCORE_RESULT",
        QZNN_SEND_CARD: "KPQZJH_SEND_CARD",
        QZNN_OPEN_CARD_RESULT: "KPQZJH_OPEN_CARD_RESULT",
        QZNN_GAME_END: "KPQZJH_GAME_END",
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
export enum EQZNNUIzIndex {
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
export enum EQZNNUITipType {
    Zero = 0,
    One = 1,
    Two = 2,
    Three = 3
}

/**抢庄牛牛玩家的战斗数据 */
export class QZNNBattlePlayerInfo extends RoomPlayerInfo {
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
    isExit :boolean = false;
}

/**ui命令 */
export class UKPQZJHCmd {
    cmd: string;
    needwait: boolean;
    data: any
}


/**
 * 抢庄牛牛游戏的状态
 */
export enum EQZNNState {

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





