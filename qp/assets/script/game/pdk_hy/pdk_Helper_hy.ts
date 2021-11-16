import { RoomPlayerInfo } from "../../public/hall/URoomClass";

export default class UPDKHelper_hy {
    static PDK_CAN_EXIT_GAME = "游戏中禁止退出，请先打完这局哦~";
    static PDK_CAN_CONCLUDE_RESULT_TIP = "房主已对牌局进行结算，本局结束后，牌局将解散。";

    static PDK_EVENT = {
        PDK_GAMESCENE_FREE: "PDK_GAMESCENE_FREE",
        PDK_GAMESCENE_PLAY: "PDK_GAMESCENE_PLAY",
        PDK_GAMESCENE_CALL: "PDK_GAMESCENE_CALL",
        PDK_GAMESCENE_SCORE: "PDK_GAMESCENE_SCORE",
        PDK_GAMESCENE_OPEN: "PDK_GAMESCENE_OPEN",
        PDK_SC_GAMESCENE_PLAY: "PDK_SC_GAMESCENE_PLAY",
        PDK_SC_GAMESCENE_END: "PDK_SC_GAMESCENE_END",

        PDK_GAME_PLAYER_INFO:"PDK_GAME_PLAYER_INFO", // 玩家信息
        PDK_GAME_CLIENT_CFG:"PDK_GAME_CLIENT_CFG",// 通知客户端配置
        PDK_GAME_FAPAI:"PDK_GAME_FAPAI",// 发牌
        PDK_GAME_START: "PDK_GAME_START",
        PDK_GAME_OWNREDPEACH3CHAIR: "PDK_GAME_OWNREDPEACH3CHAIR", // 红桃三
        PDK_GAME_PLAYER_CHUPAI: "PDK_GAME_PLAYER_CHUPAI", // 请玩家出牌
        PDK_GAME_PLAYER_FOLLOWCARD: "PDK_GAME_PLAYER_FOLLOWCARD", // 请玩家跟牌
        PDK_GAME_NOTIFY_CHUPAI_INFO: "PDK_GAME_NOTIFY_CHUPAI_INFO", // 通知玩家出牌信息
        PDK_GAME_NOTIFY_PASS_INFO: "PDK_GAME_NOTIFY_PASS_INFO", // 通知过牌信息
        PDK_GAME_NOTIFY_GAME_RESULT: "PDK_GAME_NOTIFY_GAME_RESULT", // 通知游戏结果
        PDK_GAME_NOTIFY_TUOGUAN: "PDK_GAME_NOTIFY_TUOGUAN", // 通知玩家托管信息
        PDK_NOTIFY_SCORECHANGE: "PDK_NOTIFY_SCORECHANGE", // 通知玩家分数变化
        PDK_NOTIFY_MESSAGE: "PDK_NOTIFY_MESSAGE",// 通知玩家消息
        PDK_NOTIFY_CHAT_MESSAGE:"PDK_NOTIFY_CHAT_MESSAGE",// 通知玩家聊天消息
        PDK_NOTIFY_GAME_READY:"PDK_NOTIFY_GAME_READY",// 通知玩家游戏准备
        PDK_NOTIFY_LOOK_ON:"PDK_NOTIFY_LOOK_ON",// 通知玩家旁观
        PDK_NOTIFY_CHANGE_USER_STATUS:"PDK_NOTIFY_CHANGE_USER_STATUS",// 通知玩家状态改变
        PDK_NOTIFY_GET_GAME_RECORD:"PDK_NOTIFY_GET_GAME_RECORD",// 游戏战绩记录
        PDK_NOTIFY_AGAIN_GAME:"PDK_NOTIFY_AGAIN_GAME",// 再来一轮游戏
        PDK_NOTIFY_DISSMIS_ROOM:"PDK_NOTIFY_DISSMIS_ROOM",// 解散房间
        PDK_NOTIFY_PRE_DISSMIS_ROOM:"PDK_NOTIFY_PRE_DISSMIS_ROOM",// 预解散房间
        PDK_NOTIFY_CLICK_GAME_RECORD:"PDK_NOTIFY_CLICK_GAME_RECORD", // 通知获取游戏记录弹出战绩结算
        PDK_NOTIFY_CONCLUDE_RESULT:"PDK_NOTIFY_CONCLUDE_RESULT", // 提前结算指令消息
        PDK_NOTIFY_SET_CHAT_LIMIT_RESULT:"PDK_NOTIFY_SET_CHAT_LIMIT_RESULT", // 设置聊天限制 
        PDK_NOTIFY_AUTOSTART_MESSAGE_RESULT:"PDK_NOTIFY_AUTOSTART_MESSAGE_RESULT" // 设置自动开局
        
        // PDK_OUT_CARD: "PDK_OUT_CARD",T
        // PDK_SUB_S_GAME_END: "PDK_SUB_S_GAME_END",

    }

    //#region 服务消息拆分
    static PDK_SELF_EVENT = {

        PDK_CLEAR_DESK:"PDK_CLEAR_DESK",// 清理桌子

        PDK_C_SEND_OUT_CARDS: "PDK_C_SEND_OUT_CARDS", // 玩家出牌发送消息

        PDK_SHOW_LEFT_CARDS: "PDK_SHOW_LEFT_CARDS", // 展示玩家剩余的牌
        PDK_SHOW_CONTINUE_GAME: "PDK_SHOW_CONTINUE_GAME", // 展示继续游戏按钮

        PDK_MOVE_NEXT_CMD: "PDK_MOVE_NEXT_CMD",
        //更新房间玩家信息
        PDK_UPDATE_PLAYERS_EVENT: "PDK_UPDATE_PLAYERS_EVENT", 
        /**推送更新当前轮数 */
        PDK_SC_TS_UPDATA_TOTAL_TURN: "PDK_SC_TS_UPDATA_TOTAL_TURN",
        /**推送更新当前总分数*/
        PDK_SC_TS_UPDATA_TOTAL_SCORE: "PDK_SC_TS_UPDATA_TOTAL_SCORE",
        /**推送更新玩家总分数和下注分数 */
        PDK_SC_TS_UPDATA_TOTAL_PLAYER_SCORE: "PDK_SC_TS_UPDATA_TOTAL_PLAYER_SCORE",

        /**推送turn结束 */
        PDK_SC_TS_SET_TURN_OVER: "PDK_SC_TS_SET_TURN_OVER",

        PDK_SC_TS_LEFT: "PDK_SC_TS_LEFT",
        /**推送游戏开始匹配 */
        PDK_SC_TS_START_MATCH: "PDK_SC_TS_START_MATCH",
        /**取消匹配 */
        PDK_SC_TS_CANCLE_MATCH: "PDK_SC_TS_CANCLE_MATCH",
        /**推送游戏开始 */
        PDK_SC_TS_GAME_START: "PDK_SC_TS_GAME_START",
        /**推送某个玩家叫庄结果 */
        PDK_SC_TS_CALL_BANKER: "PDK_SC_TS_CALL_BANKER",
        /**推送所有玩家叫庄结果 */
        PDK_SC_TZ_CALL_BANKER_RESULT: "PDK_SC_TZ_CALL_BANKER_RESULT",
        /**玩家操作结果下注 */
        PDK_SC_CZ_PUT_OUT_CHIP: "PDK_SC_CZ_PUT_OUT_CHIP",
        /**推送发牌 */
        PDK_SC_TS_FAPAI: "PDK_SC_TS_FAPAI",
        /**看牌 */
        PDK_SC_TS_LOOK_PAI: "PDK_SC_TS_LOOK_PAI",
        /**游戏结束 */
        PDK_SC_TS_GAME_END: "PDK_SC_TS_GAME_END",
        /**选庄结束 */
        PDK_CHOOSE_BANKER_COMPLETE: "PDK_CHOOSE_BANKER_COMPLETE",
        /**更新伦的时间  倒计时  */
        PDK_SC_TS_UPDATE_TURN_TIME: "PDK_SC_TS_UPDATE_TURN_TIME",
        /**更新座位上玩家信息 */
        PDK_CC_UPDATA_SEAT_INFO: "PDK_CC_UPDATA_SEAT_INFO",
        /**更新房间 牌局编号 */
        PDK_UPDATE_ROOMID: "PDK_UPDATE_ROOMID",

        /**15分钟倒计时提示 */
        PDK_SHOW_TIME_OUT:"PDK_SHOW_TIME_OUT",

        // 展示再来一局按钮
        PDK_SHOW_AGAIN_GAME:"PDK_SHOW_AGAIN_GAME",

        // 房主点击再来一轮
        PDK_ROOM_USER_CLICK_AGAIN_GAME:"PDK_ROOM_USER_CLICK_AGAIN_GAME",

        PDK_ROOM_CHARGE_ROOM_CARD:"PDK_ROOM_CHARGE_ROOM_CARD",

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
 * 跑得快游戏的状态
 */
export enum EPDKState {

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
export enum EPDKBattlePlayerPaiState {
    none,
    /**闷牌之中 */
    mengPai,
    /**已看牌 */
    kanPai,
    /**已弃牌 */
    qiPai
}


/**三公玩家的战斗数据 */
export class PDKBattlePlayerInfo extends RoomPlayerInfo {
    /**玩家的总过的下注数 */
    userTotal: number = 0;
    /**玩家玩了几轮 */
    playTurn: number = 0;
    /**是否为turn */
    isturn: boolean;
    /**玩家是否为先手 */
    isFirst: boolean = false;
    /**玩家手牌的状态 */
    paiState: EPDKBattlePlayerPaiState = 0;
    /**自动跟注 */
    auto: boolean = false;
    /**玩家的牌 */
    pai: Array<number>;
    // pai:UIPDKPoker;
    paiXing: number = 0;
    /**剩下的cd时间 */
    cdtime: number;
    /**展示的桌面id */
    seatId: number;
    /**下一次下注的count */
    nextXizhuCount: number;
    /**玩家状态 */
    playStatus: number;
}

/**
 * 游戏结束时候的统计
 */
export class UIPDKStaticsItem {
    seatId: number;//**位置id */
    getScore: number;//得分
    lastscore: number;//最后的总分
    // uipoker: UIPDKPoker;//玩家的牌
    iswin: boolean;
}
/**游戏结束的统计 */
export class UIPDKBattleOver {
    endTime: number;
    endType: number;
    statics: { [key: number]: UIPDKStaticsItem };
}

