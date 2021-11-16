import { Game, ProxyServer, HallServer } from "./proto";

/**
 * 创建:gj
 * 作用:用于proto的解析结构存储
 */

/**
 * 用于解析proto的
 */
export class ProtoMapItem {
    /**
     * 子命令
     */
    subId: number;
    /**
     * 请求结构体
     */
    request: any;
    /**
     * 返回
     */
    response: any;
    /**
     * 输出日志
     */
    log: string;
    /**
     * true不打印
     */
    isprint: boolean;
    
}


export var protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
    /**c to hall */
    [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL]: {
        [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_LOGIN_MESSAGE_REQ]: {
            subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_LOGIN_MESSAGE_REQ,
            request: HallServer.LoginMessage,
            response: null,
            log: "",
            isprint: false
        },
        [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_LOGIN_MESSAGE_RES]: {
            subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_LOGIN_MESSAGE_RES,
            request: null,
            response: HallServer.LoginMessageResponse,
            log: "",
            isprint:
                false
        },
        [Game.Common.MESSAGE_CLIENT_TO_SERVER_SUBID.KEEP_ALIVE_REQ]: {
            subId: Game.Common.MESSAGE_CLIENT_TO_SERVER_SUBID.KEEP_ALIVE_REQ,
            request: Game.Common.KeepAliveMessage,
            response: null,
            log: "",
            isprint:
                true
        },
        [Game.Common.MESSAGE_CLIENT_TO_SERVER_SUBID.KEEP_ALIVE_RES]: {
            subId: Game.Common.MESSAGE_CLIENT_TO_SERVER_SUBID.KEEP_ALIVE_RES,
            request: null,
            response: Game.Common.KeepAliveMessageResponse,
            log: "",
            isprint:
            true
        },
        [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_GAME_ROOM_INFO_RES]: {
            subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_GAME_ROOM_INFO_RES,
            request: null,
            response: HallServer.GetGameMessageResponse,
            log: "",
            isprint:
                false
        }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_GAME_ROOM_INFO_REQ]: {
            subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_GAME_ROOM_INFO_REQ,
            request: HallServer.GetGameMessage,
            response: null,
            log: "",
            isprint:
                false
        },
        [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_GAME_SERVER_MESSAGE_REQ]: {
            subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_GAME_SERVER_MESSAGE_REQ,
            request: HallServer.GetGameServerMessage,
            response: null,
            log: "",
            isprint:
                false
        }, [Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_GAME_SERVER_MESSAGE_RES]: {
            subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_GAME_SERVER_MESSAGE_RES,
            request: null,
            response: HallServer.GetGameServerMessageResponse,
            log: "",
            isprint:
                false
        },

    },
}
export default protoMap;
