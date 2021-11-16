
export default class UDDZHelper {
    static DDZ_CAN_EXIT_GAME = "游戏中禁止退出，请先打完这局哦~";
    
    //服务器消息
    static DDZ_EVENT = {
        //场景消息
        DDZ_GAMESCENE_CALL: "DDZ_GAMESCENE_CALL",
        DDZ_GAMESCENE_SCORE: "DDZ_GAMESCENE_SCORE",
        DDZ_GAMESCENE_OPEN: "DDZ_GAMESCENE_OPEN",
        //游戏消息
        DDZ_GAME_START: "DDZ_GAME_START",
        DDZ_GAME_BET_LEVEL: "DDZ_GAME_BET_LEVEL",
        DDZ_CALL_BANKER: "DDZ_CALL_BANKER",
        DDZ_CALL_BANKER_RESULT: "DDZ_CALL_BANKER_RESULT",
        DDZ_BANKER_INFO: "DDZ_BANKER_INFO",
        DDZ_ADD_SCORE: "DDZ_ADD_SCORE",
        DDZ_ADD_SCORE_RESULT: "DDZ_ADD_SCORE_RESULT",
        DDZ_OUT_CARD: "DDZ_OUT_CARD",
        DDZ_OUT_CARD_RESULT: "DDZ_OUT_CARD_RESULT",
        DDZ_FOLLOW_CARD: "DDZ_FOLLOW_CARD",
        DDZ_PASS_RESLUT: "DDZ_PASS_RESLUT",
        DDZ_TRUST_RESULT: "DDZ_TRUST_RESULT",
        DDZ_NOTIFY_CHAT_MESSAGE: "DDZ_NOTIFY_CHAT_MESSAGE",
        DDZ_GAME_END: "DDZ_GAME_END",
    }
    
    //客户端消息
    static DDZ_SELF_EVENT = {
        DDZ_CLEAR_DESK: "DDZ_CLEAR_DESK",
        DDZ_UPDATE_PLAYERS_EVENT: "DDZ_UPDATE_PLAYERS_EVENT", 
        DDZ_SC_TS_START_MATCH: "DDZ_SC_TS_START_MATCH",
        DDZ_SC_TS_CANCLE_MATCH: "DDZ_SC_TS_CANCLE_MATCH",
        //重连时已经打出的牌
        DDZ_RECONNECT_OUT_CARD: "DDZ_RECONNECT_OUT_CARD",      
    }
   
}

export enum EDDZState {
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

/**聊天消息内容类型 */
export enum ChatMsgType {
    DDZ_CHAT_TYPE_TEXT = 1, // 文本
    DDZ_CHAT_TYPE_EMOJ = 2, // 图片表情
}

/**聊天接收座位id类型 */
export enum ReceiveChairidType {
    DDZ_CHAT_RECEIVE_CHAIRID_0 = 0, // chariid = 0 玩家
    DDZ_CHAT_RECEIVE_CHAIRID_1 = 1, // chariid = 1 玩家
    DDZ_CHAT_RECEIVE_CHAIRID_2 = 2, // chariid = 2 玩家
    DDZ_CHAT_RECEIVE_CHAIRID_ALL = -1 , // chariid = -1 所有玩家
}

