import { USerializer } from "../../common/net/USerializer";
import { ProtoMapItem } from "../../common/cmd/UOpcode";
import UMsgCenter from "../../common/net/UMsgCenter";
import { EGameType } from "../../common/base/UAllenum";
import { UGameSerializer } from "../UGameSerializer";
import { Ebg, Game } from "../../common/cmd/proto";

/**
 * 创建:朱武
 * 作用:brlh包解析器
 */
export default class CBrebgSerializer extends UGameSerializer {
    /** */
    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC]: {

            [Ebg.SUBID.SUB_S_GAME_START]: {             // 请求下注
                subId: Ebg.SUBID.SUB_S_GAME_START,
                request: null,
                response: Ebg.CMD_S_GameStart,
                log: "",
                isprint: false
            },
            [Ebg.SUBID.SUB_C_APPLY_BANKER]: {             // 申请上庄
                subId: Ebg.SUBID.SUB_C_APPLY_BANKER,
                request: Ebg.CMD_C_ApplyBanker,
                response: null,
                log: "",
                isprint: false
            },
            [Ebg.SUBID.SUB_S_APPLY_BANKER]: {             // 申请上庄成功
                subId: Ebg.SUBID.SUB_S_APPLY_BANKER,
                request: null,
                response: Ebg.CMD_S_ApplyBanker,
                log: "",
                isprint: false
            },
            [Ebg.SUBID.SUB_S_APPLY_BANKER_FAIL]: {             // 申请上庄失败
                subId: Ebg.SUBID.SUB_S_APPLY_BANKER_FAIL,
                request: null,
                response: Ebg.CMD_S_ApplyBankerFail,
                log: "",
                isprint: false
            },
            [Ebg.SUBID.SUB_C_CANCEL_BANKER]: {             // 取消申请上庄
                subId: Ebg.SUBID.SUB_C_CANCEL_BANKER,
                request: Ebg.CMD_C_CancelBanker,
                response: null,
                log: "",
                isprint: false
            },
            [Ebg.SUBID.SUB_S_CANCEL_BANKER]: {             // 取消申请上庄成功
                subId: Ebg.SUBID.SUB_S_CANCEL_BANKER,
                request: null,
                response: Ebg.CMD_S_CancelBanker,
                log: "",
                isprint: false
            },
            [Ebg.SUBID.SUB_S_CANCEL_BANKER_FAIL]: {             // 取消申请上庄失败
                subId: Ebg.SUBID.SUB_S_CANCEL_BANKER_FAIL,
                request: null,
                response: Ebg.CMD_S_CancelBankerFail,
                log: "",
                isprint: false
            },
            [Ebg.SUBID.SUB_C_GET_OFF_BANKER]: {             // 申请下庄
                subId: Ebg.SUBID.SUB_C_GET_OFF_BANKER,
                request: Ebg.CMD_CS_GetOffBanker,
                response: null,
                log: "",
                isprint: false
            },
            [Ebg.SUBID.SUB_S_GET_OFF_BANKER]: {             // 申请下庄成功
                subId: Ebg.SUBID.SUB_S_GET_OFF_BANKER,
                request: null,
                response: Ebg.CMD_CS_GetOffBanker,
                log: "",
                isprint: false
            },
            [Ebg.SUBID.SUB_S_GET_OFF_BANKER_FAIL]: {             // 申请下庄失败
                subId: Ebg.SUBID.SUB_S_GET_OFF_BANKER_FAIL,
                request: null,
                response: Ebg.CMD_S_GetOffBankerFail,
                log: "",
                isprint: false
            },
            [Ebg.SUBID.SUB_S_CHANGE_BANKER]: {             // 切换庄家
                subId: Ebg.SUBID.SUB_S_CHANGE_BANKER,
                request: null,
                response: Ebg.CMD_S_ChangeBanker,
                log: "",
                isprint: false
            },
            [Ebg.SUBID.SUB_S_GAME_END]: {             // 获取玩家在线列表
                subId: Ebg.SUBID.SUB_S_GAME_END,
                request: null,
                response: Ebg.CMD_S_GameEnd,
                log: "",
                isprint: false
            },
            [Ebg.SUBID.SUB_S_START_PLACE_JETTON]: {             // 开始下注
                subId: Ebg.SUBID.SUB_S_START_PLACE_JETTON,
                request: null,
                response: Ebg.CMD_S_StartPlaceJetton,
                log: "",
                isprint: false
            },
            // [Ebg.SUBID.SUB_S_SCENE_END]: {             // 游戏开始
            //     subId: Ebg.SUBID.SUB_S_SCENE_END,
            //     request: null,
            //     response: Ebg.CMD_S_Scene_GameEnd,
            //     log: "",
            //     isprint: false
            // },
            // ---------------------------------
            // [Ebg.SUBID.SUB_S_SEND_RECORD]: {             // 游戏记录
            //     subId: Ebg.SUBID.SUB_S_SEND_RECORD,
            //     request: null,
            //     response: Ebg.CMD_S_GameRecord,
            //     log: "",
            //     isprint: false
            // },

            [Ebg.SUBID.SUB_S_PLACE_JET_FAIL]: {             // 下注失败
                subId: Ebg.SUBID.SUB_S_PLACE_JET_FAIL,
                request: null,
                response: Ebg.CMD_S_PlaceJettonFail,
                log: "",
                isprint: false
            },


            [Ebg.SUBID.SUB_S_QUERY_PLAYLIST]: {             // 开始下注
                subId: Ebg.SUBID.SUB_S_QUERY_PLAYLIST,
                request: null,
                response: Ebg.CMD_S_PlayerList,
                log: "",
                isprint: false
            },
            [Ebg.SUBID.SUB_S_PLACE_JETTON]: {             // 玩家下注
                subId: Ebg.SUBID.SUB_S_PLACE_JETTON,
                request: null,
                response: Ebg.CMD_S_PlaceJetSuccess,
                log: "",
                isprint: false
            },

            [Ebg.SUBID.SUB_C_PLACE_JETTON]: {             // 玩家下注
                subId: Ebg.SUBID.SUB_C_PLACE_JETTON,
                request: Ebg.CMD_C_PlaceJet,
                response: null,
                log: "",
                isprint: false
            },

            // [Ebg.SUBID.SUB_C_USER_ASKLIST]: {             // 玩家申請列表
            //     subId: Ebg.SUBID.SUB_C_USER_ASKLIST,
            //     request: Ebg.CMD_C_AskList,
            //     response: null,
            //     log: "",
            //     isprint: false
            // },
            // [Ebg.SUBID.SUB_C_REJETTON]: {             // 玩家重复下注
            //     subId: Ebg.SUBID.SUB_C_REJETTON,
            //     request: Ebg.CMD_C_ReJetton,
            //     response: null,
            //     log: "",
            //     isprint: false
            // },

            // [Ebg.SUBID.SUB_S_JETTON_BROADCAST]: {             // 玩家重复下注
            //     subId: Ebg.SUBID.SUB_S_JETTON_BROADCAST,
            //     request: null,
            //     response: Ebg.CMD_S_Jetton_Broadcast,
            //     log: "",
            //     isprint: false
            // },
        }
    };
    protected getProtoMap(mainId: number, subId: number): ProtoMapItem {
        return this.protoMap[mainId][subId];
    }
}
UMsgCenter.ins.addSerializer(EGameType.BREBG, new CBrebgSerializer());
