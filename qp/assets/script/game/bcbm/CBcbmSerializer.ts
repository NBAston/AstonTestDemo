
import { ProtoMapItem } from "../../common/cmd/UOpcode";
import UMsgCenter from "../../common/net/UMsgCenter";
import { EGameType } from "../../common/base/UAllenum";
import { Game, Bcbm } from "../../common/cmd/proto";
import { UGameSerializer } from "../UGameSerializer";

/**
 * 创建:gss
 * 作用:bj包解析器
 */
export default class CBcbmSerializer extends UGameSerializer {
    /** */

    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC]: {
            [Bcbm.SUBID.SUB_S_GAME_START]: {
                subId: Bcbm.SUBID.SUB_S_GAME_START,
                request: null,
                response: Bcbm.CMD_S_GameStart,
                log: "",
                isprint: false

            },
            [Bcbm.SUBID.SUB_S_GAME_END]: {
                subId: Bcbm.SUBID.SUB_S_GAME_END,
                request: null,
                response: Bcbm.CMD_S_GameEnd,
                log: "",
                isprint: false

            },
            [Bcbm.SUBID.SUB_S_START_PLACE_JETTON]:{
                subId: Bcbm.SUBID.SUB_S_START_PLACE_JETTON,
                request: null,
                response: Bcbm.CMD_S_StartPlaceJetton,
                log: "",
                isprint: false
            },
            [Bcbm.SUBID.SUB_C_PLACE_JETTON]: {
                subId: Bcbm.SUBID.SUB_C_PLACE_JETTON,
                request: Bcbm.CMD_C_PlaceJet,
                response: null,
                log: "",
                isprint: false
            },
            [Bcbm.SUBID.SUB_S_PLACE_JETTON]: {
                subId: Bcbm.SUBID.SUB_S_PLACE_JETTON,
                request: null,
                response: Bcbm.CMD_S_PlaceJetSuccess,
                log: "",
                isprint: false
            },
            [Bcbm.SUBID.SUB_S_PLACE_JET_FAIL]: {
                subId: Bcbm.SUBID.SUB_S_PLACE_JET_FAIL,
                request:null,
                response: Bcbm.CMD_S_PlaceJettonFail,
                log: "",
                isprint: false,
            },
            [Bcbm.SUBID.SUB_C_QUERY_PLAYERLIST]: {
                subId: Bcbm.SUBID.SUB_C_QUERY_PLAYERLIST,
                request: Bcbm.CMD_C_PlayerList,
                response: null,
                log: "",
                isprint: false
            },
            [Bcbm.SUBID.SUB_S_QUERY_PLAYLIST]: {
                subId: Bcbm.SUBID.SUB_S_QUERY_PLAYLIST,
                request: null,
                response: Bcbm.CMD_S_PlayerList,
                log: "",
                isprint: false
            },
            [Bcbm.SUBID.SUB_C_SYNC_TIME]: {
                subId: Bcbm.SUBID.SUB_C_SYNC_TIME,
                request: Bcbm.CMD_C_SyncTime_Req,
                response: null,
                log: "",
                isprint: false
            },
            [Bcbm.SUBID.SUB_S_SYNC_TIME]: {
                subId: Bcbm.SUBID.SUB_S_SYNC_TIME,
                request: null,
                response: Bcbm.CMD_S_SyncTime_Res,
                log: "",
                isprint: false
            },
            [Bcbm.SUBID.CS_GAMESCENE_FRESH]: {  //请求刷新新场景
                subId: Bcbm.SUBID.CS_GAMESCENE_FRESH,
                request: null,
                response: null,
                log: "",
                isprint: false
            },
            [Bcbm.SUBID.CS_GAMESCENE_STATUS_FREE]:{             //游戏空闲状态
                subId: Bcbm.SUBID.CS_GAMESCENE_STATUS_FREE,
                request: null,
                response: Bcbm.CMD_Scene_StatusFree,
                log: "",
                isprint: false
            },
            [Bcbm.SUBID.CS_GAMESCENE_STATUS_JETTON]:{             //游戏下注状态
                subId: Bcbm.SUBID.CS_GAMESCENE_STATUS_JETTON,
                request: null,
                response: Bcbm.CMD_Scene_StatusJetton,
                log: "",
                isprint: false
            },
            [Bcbm.SUBID.CS_GAMESCENE_STATUS_OPEN]:{             //游戏开牌状态
                subId: Bcbm.SUBID.CS_GAMESCENE_STATUS_OPEN,
                request: null,
                response: Bcbm.CMD_Scene_StatusOpen,
                log: "",
                isprint: false
            },
            [Bcbm.SUBID.CS_GAMESCENE_STATUS_END]:{             //游戏结束状态
                subId: Bcbm.SUBID.CS_GAMESCENE_STATUS_END,
                request: null,
                response: Bcbm.CMD_Scene_StatusEnd,
                log: "",
                isprint: false
            },
            [Bcbm.SUBID.SUB_S_OPEN_CARD]:{             //开牌
                subId: Bcbm.SUBID.SUB_S_OPEN_CARD,
                request: null,
                response: Bcbm.CMD_S_OpenCard,
                log: "",
                isprint: false
            },
        }
    };
    protected getProtoMap(mainId: number, subId: number): ProtoMapItem {
        return this.protoMap[mainId][subId];
    }
}
UMsgCenter.ins.addSerializer(EGameType.BCBM, new CBcbmSerializer());