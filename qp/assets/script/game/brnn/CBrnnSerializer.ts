import { ProtoMapItem } from "../../common/cmd/UOpcode";
import UMsgCenter from "../../common/net/UMsgCenter";
import { EGameType } from "../../common/base/UAllenum";
import { Game, Brnn } from "../../common/cmd/proto";
import { UGameSerializer } from "../UGameSerializer";

/**
 * 创建:朱武
 * 作用:brnn包解析器
 */
export default class CBrnnSerializer extends UGameSerializer {
    /** */
    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC]: {
            [Brnn.SUBID.SUB_C_PLACE_JETTON]:{             // 请求下注
                subId: Brnn.SUBID.SUB_C_PLACE_JETTON,
                request: Brnn.CMD_C_PlaceJet,
                response: null,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.SUB_C_APPLY_BANKER]:{             // 申请上庄
                subId: Brnn.SUBID.SUB_C_APPLY_BANKER,
                request: Brnn.CMD_C_ApplyBanker,
                response: null,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.SUB_S_APPLY_BANKER]:{             // 申请上庄成功
                subId: Brnn.SUBID.SUB_S_APPLY_BANKER,
                request: null,
                response: Brnn.CMD_S_ApplyBanker,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.SUB_S_APPLY_BANKER_FAIL]:{             // 申请上庄失败
                subId: Brnn.SUBID.SUB_S_APPLY_BANKER_FAIL,
                request: null,
                response: Brnn.CMD_S_ApplyBankerFail,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.SUB_C_CANCEL_BANKER]:{             // 取消申请上庄
                subId: Brnn.SUBID.SUB_C_CANCEL_BANKER,
                request: Brnn.CMD_C_CancelBanker,
                response: null,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.SUB_S_CANCEL_BANKER]:{             // 取消申请上庄成功
                subId: Brnn.SUBID.SUB_S_CANCEL_BANKER,
                request: null,
                response: Brnn.CMD_S_CancelBanker,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.SUB_S_CANCEL_BANKER_FAIL]:{             // 取消申请上庄失败
                subId: Brnn.SUBID.SUB_S_CANCEL_BANKER_FAIL,
                request: null,
                response: Brnn.CMD_S_CancelBankerFail,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.SUB_C_GET_OFF_BANKER]:{             // 申请下庄
                subId: Brnn.SUBID.SUB_C_GET_OFF_BANKER,
                request: Brnn.CMD_CS_GetOffBanker,
                response: null,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.SUB_S_GET_OFF_BANKER]:{             // 申请下庄成功
                subId: Brnn.SUBID.SUB_S_GET_OFF_BANKER,
                request: null,
                response: Brnn.CMD_CS_GetOffBanker,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.SUB_S_GET_OFF_BANKER_FAIL]:{             // 申请下庄失败
                subId: Brnn.SUBID.SUB_S_GET_OFF_BANKER_FAIL,
                request: null,
                response: Brnn.CMD_S_GetOffBankerFail,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.SUB_S_CHANGE_BANKER]:{             // 切换庄家
                subId: Brnn.SUBID.SUB_S_CHANGE_BANKER,
                request: null,
                response: Brnn.CMD_S_ChangeBanker,
                log: "",
                isprint: false
            },

            [Brnn.SUBID.SUB_C_QUERY_PLAYERLIST]:{             // 获取玩家在线列表
                subId: Brnn.SUBID.SUB_C_QUERY_PLAYERLIST,
                request: Brnn.CMD_C_PlayerList,
                response: null,
                log: "",
                isprint: false
            },

            [Brnn.SUBID.SUB_C_SYNC_TIME]:{             // 获取系统状态剩余时间
                subId: Brnn.SUBID.SUB_C_SYNC_TIME,
                request: Brnn.CMD_C_SyncTime_Req,
                response: null,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.SUB_S_SYNC_TIME]:{             // 返回系统状态剩余时间
                subId: Brnn.SUBID.SUB_S_SYNC_TIME,
                request: null,
                response: Brnn.CMD_S_SyncTime_Res,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.SUB_S_GAME_START]:{             // 游戏开始
                subId: Brnn.SUBID.SUB_S_GAME_START,
                request: null,
                response: Brnn.CMD_S_GameStart,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.SUB_S_PLACE_JETTON]:{             // 用户下注
                subId: Brnn.SUBID.SUB_S_PLACE_JETTON,
                request: null,
                response: Brnn.CMD_S_PlaceJetSuccess,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.SUB_S_GAME_END]:{             // 当局游戏结束
                subId: Brnn.SUBID.SUB_S_GAME_END,
                request: null,
                response: Brnn.CMD_S_GameEnd,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.SUB_S_PLACE_JET_FAIL]:{             // 下注失败
                subId: Brnn.SUBID.SUB_S_PLACE_JET_FAIL,
                request: null,
                response: Brnn.CMD_S_PlaceJettonFail,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.SUB_S_QUERY_PLAYLIST]:{             // 玩家在线列表返回
                subId: Brnn.SUBID.SUB_S_QUERY_PLAYLIST,
                request: null,
                response: Brnn.CMD_S_PlayerList,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.SUB_S_START_PLACE_JETTON]:{             // 开始下注
                subId: Brnn.SUBID.SUB_S_START_PLACE_JETTON,
                request: null,
                response: Brnn.CMD_S_StartPlaceJetton,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.CS_GAMESCENE_FRESH]:{             // 请求刷新场景
                subId: Brnn.SUBID.CS_GAMESCENE_FRESH,
                request: null,
                response: null,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.CS_GAMESCENE_STATUS_FREE]:{             //游戏空闲状态
                subId: Brnn.SUBID.CS_GAMESCENE_STATUS_FREE,
                request: null,
                response: Brnn.CMD_Scene_StatusFree,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.CS_GAMESCENE_STATUS_JETTON]:{             //游戏下注状态
                subId: Brnn.SUBID.CS_GAMESCENE_STATUS_JETTON,
                request: null,
                response: Brnn.CMD_Scene_StatusJetton,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.CS_GAMESCENE_STATUS_OPEN]:{             //游戏开牌状态
                subId: Brnn.SUBID.CS_GAMESCENE_STATUS_OPEN,
                request: null,
                response: Brnn.CMD_Scene_StatusOpen,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.CS_GAMESCENE_STATUS_END]:{             //游戏结束状态
                subId: Brnn.SUBID.CS_GAMESCENE_STATUS_END,
                request: null,
                response: Brnn.CMD_Scene_StatusEnd,
                log: "",
                isprint: false
            },
            [Brnn.SUBID.SUB_S_OPEN_CARD]:{             //开牌
                subId: Brnn.SUBID.SUB_S_OPEN_CARD,
                request: null,
                response: Brnn.CMD_S_OpenCard,
                log: "",
                isprint: false
            },
        }
    };
    protected getProtoMap(mainId: number, subId: number): ProtoMapItem {
        return this.protoMap[mainId][subId];
    }
}
UMsgCenter.ins.addSerializer(EGameType.BRNN, new CBrnnSerializer());
