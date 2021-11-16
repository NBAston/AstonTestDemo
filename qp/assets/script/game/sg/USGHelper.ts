import { RoomPlayerInfo } from "../../public/hall/URoomClass";

export default class USGHelper {
    static SG_EVENT = {
        SG_GAMESCENE_FREE: "SG_GAMESCENE_FREE",
        SG_GAMESCENE_CALL: "SG_GAMESCENE_CALL",
        SG_GAMESCENE_SCORE: "SG_GAMESCENE_SCORE",
        SG_GAMESCENE_OPEN: "SG_GAMESCENE_OPEN",
        SG_GAMESCENE_END: "SG_GAMESCENE_END",
        SG_SUB_S_GAME_START: "SG_SUB_S_GAME_START",
        SG_SUB_S_CALL_BANKER: "SG_SUB_S_CALL_BANKER",
        SG_SUB_S_CALL_BANKER_RESULT: "SG_SUB_S_CALL_BANKER_RESULT",
        SG_SUB_S_ADD_SCORE_RESULT: "SG_SUB_S_ADD_SCORE_RESULT",
        SG_SUB_S_SEND_CARD: "SG_SUB_S_SEND_CARD",
        SG_SUB_S_OPEN_CARD_RESULT: "SG_SUB_S_OPEN_CARD_RESULT",
        SG_SUB_S_GAME_END: "SG_SUB_S_GAME_END",
        SG_HIDE_SEAT: "SG_HIDE_SEAT",

    }
    //#region 服务消息拆分
    static SG_SELF_EVENT = {

        SG_MOVE_NEXT_CMD: "SG_MOVE_NEXT_CMD",


        /**推送更新当前轮数 */
        SG_SC_TS_UPDATA_TOTAL_TURN: "SG_SC_TS_UPDATA_TOTAL_TURN",
        /**推送更新当前总分数*/
        SG_SC_TS_UPDATA_TOTAL_SCORE: "SG_SC_TS_UPDATA_TOTAL_SCORE",
        /**推送更新玩家总分数和下注分数 */
        SG_SC_TS_UPDATA_TOTAL_PLAYER_SCORE: "SG_SC_TS_UPDATA_TOTAL_PLAYER_SCORE",

        /**推送turn结束 */
        SG_SC_TS_SET_TURN_OVER: "SG_SC_TS_SET_TURN_OVER",

        SG_SC_TS_LEFT: "SG_SC_TS_LEFT",
        /**推送游戏开始匹配 */
        SG_SC_TS_START_MATCH: "SG_SC_TS_START_MATCH",
        /**取消匹配 */
        SG_SC_TS_CANCLE_MATCH: "SG_SC_TS_CANCLE_MATCH",
        /**推送游戏开始 */
        SG_SC_TS_GAME_START: "SG_SC_TS_GAME_START",
        /**推送某个玩家叫庄结果 */
        SG_SC_TS_CALL_BANKER: "SG_SC_TS_CALL_BANKER",
        /**推送所有玩家叫庄结果 */
        SG_SC_TZ_CALL_BANKER_RESULT: "SG_SC_TZ_CALL_BANKER_RESULT",
        /**玩家操作结果下注 */
        SG_SC_CZ_PUT_OUT_CHIP: "SG_SC_CZ_PUT_OUT_CHIP",
        /**推送发牌 */
        SG_SC_TS_FAPAI: "SG_SC_TS_FAPAI",
        /**看牌 */
        SG_SC_TS_LOOK_PAI: "SG_SC_TS_LOOK_PAI",
        /**游戏结束 */
        SG_SC_TS_GAME_END: "SG_SC_TS_GAME_END",
        /**选庄结束 */
        SG_CHOOSE_BANKER_COMPLETE: "SG_CHOOSE_BANKER_COMPLETE",
        /**更新伦的时间  倒计时  */
        SG_SC_TS_UPDATE_TURN_TIME: "SG_SC_TS_UPDATE_TURN_TIME",
        /**更新座位上玩家信息 */
        SG_CC_UPDATA_SEAT_INFO: "SG_CC_UPDATA_SEAT_INFO",
        /**更新房间 牌局编号 */
        SG_UPDATE_ROOMID: "SG_UPDATE_ROOMID",

        QZNN_NEXT_EXIT: "QZNN_NEXT_EXIT",

    }
    //#endregion

    static GAME_TYPE = {
        [0]: "0",
        [1]: "1",
        [2]: "2",
        [3]: "3",
        [4]: "4",
        [5]: "5",
        [6]: "6",
        [7]: "7",
        [8]: "8",
        [9]: "9",
        [10]: "sangong",
        [11]: "zhadan",
        [12]: "baojiu"
    }
}

/**
 * 三公游戏的状态
 */
export enum ESGState {

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
    Watching,
    /**
     * 取消匹配中
     */
    LeftGame,
    AlreadyLeft,
}


/**
 *战斗玩家牌的状态
 */
export enum ESGBattlePlayerPaiState {
    none,
    /**闷牌之中 */
    mengPai,
    /**已看牌 */
    kanPai,
    /**已弃牌 */
    qiPai
}
/**ui命令 */
export class USGCmd {
    cmd: string;
    needwait: boolean;
    data: any
}

/**
 * 扑克牌显示数据
 */
export class UISGPoker {
    pokerType: string;
    cardtype: number;
    pokerIcons: Array<string>
}
/**看牌 */
export class UISGLookPai {
    seatId: number;
    poker: UISGPoker;
}


/**下一个人 的turn的数据 */
export class UISGNextTurn {
    /**当前伦turn的玩家 */
    seatId: number;
    /**是否自动 */
    auto: boolean;
    /**是否可以比牌 */
    canBiPai: boolean;
    /**cd时间 */
    cdtime: number;
}


/**三公玩家的战斗数据 */
export class SGBattlePlayerInfo extends RoomPlayerInfo {
    /**玩家的总过的下注数 */
    userTotal: number = 0;
    /**玩家玩了几轮 */
    playTurn: number = 0;
    /**是否为turn */
    isturn: boolean;
    /**玩家是否为先手 */
    isFirst: boolean = false;
    /**玩家手牌的状态 */
    paiState: ESGBattlePlayerPaiState = 0;
    /**自动跟注 */
    auto: boolean = false;
    /**玩家的牌 */
    pai: Array<number>;
    // pai:UISGPoker;
    paiXing: number = 0;
    /**剩下的cd时间 */
    cdtime: number;
    /**展示的桌面id */
    seatId: number;
    /**下一次下注的count */
    nextXizhuCount: number;
    /**玩家状态 */
    playStatus: number;
    /**是否退出 */
    isExit: boolean = false;
}
/**更新玩家的turn时间 */
export class UISGUpdateTurnTime {
    seatId: number;
    leftTime: number;
}
/**更新玩家的基础数据 */
export class UISGUpdateSeatRoleInfo {
    seatId: number;
    score: number;
    usetotal: number;
}
/**更新玩家的基础数据 */
export class UISGOverTurn {
    seatId: number;
    auto: boolean;
}
/**
 * 游戏结束时候的统计
 */
export class UISGStaticsItem {
    seatId: number;//**位置id */
    getScore: number;//得分
    lastscore: number;//最后的总分
    uipoker: UISGPoker;//玩家的牌
    iswin: boolean;
}
/**游戏结束的统计 */
export class UISGBattleOver {
    endTime: number;
    endType: number;
    statics: { [key: number]: UISGStaticsItem };
}
export class UISGSetZHU {
    seatId: number;
    state: number;
}


//#region  not use
/**
 * 筹码
 */
// export class UIChips {
//     canUse: boolean;
//     count: number;
// }



/**比牌数据 */
// export class UICompare {

//     leftSeatId: number;
//     leftName: string;
//     leftGold: number;

//     rightSeatId: number;
//     rightName: string;
//     rightGold: number;

//     winseat: number;
// // }
// export class UISGChipItem {
//     chipType: string;
//     objId: number;
//     gold: number;
//     seatId: number;
// }
/**筹码的数据 */
// export class UISGChip {
//     items: Array<UISGChipItem>;
//     /**
//      * 出筹码的状态
//      *（0：没有,1:跟注 2 加注）
//      */
//     chipState: number;
// }
//#endregion
