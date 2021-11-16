import { ProtoMapItem } from "../../common/cmd/UOpcode";
import UMsgCenter from "../../common/net/UMsgCenter";
import { EGameType } from "../../common/base/UAllenum";
import { Bjl, Game } from "../../common/cmd/proto";
import { UGameSerializer } from "../UGameSerializer";

/**
 * 作用:brbjl包解析器
 */
export default class CBrbjlSerializer extends UGameSerializer {
    /** */
    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC]: { 
        
            // [Bjl.SUBID.SUB_S_GAME_FREE]:{             // 场景消息-场景空闲
            //     subId: Bjl.SUBID.SUB_S_GAME_FREE,
            //     request: null,
            //     response: Bjl.CMD_Scene_StatusFree,
            //     log: "",
            //     isprint: false
            // },
        
            [Bjl.SUBID.SUB_S_GAME_START]:{             // 游戏开始
                subId: Bjl.SUBID.SUB_S_GAME_START,
                request: null,
                response: Bjl.CMD_S_GameStart,
                log: "",
                isprint: false
            },



            [Bjl.SUBID.SUB_S_START_PLACE_JETTON]:{             // 开始下注
                subId: Bjl.SUBID.SUB_S_START_PLACE_JETTON,
                request: null,
                response: Bjl.CMD_S_StartPlaceJetton,
                log: "",
                isprint: false
            },

            [Bjl.SUBID.SUB_C_PLACE_JETTON]:{             // 玩家下注
                subId: Bjl.SUBID.SUB_C_PLACE_JETTON,
                request: Bjl.CMD_C_PlaceJet,
                response: null,
                log: "",
                isprint: false
            },

            [Bjl.SUBID.SUB_S_PLACE_JETTON]:{              // 用户下注
                subId: Bjl.SUBID.SUB_S_PLACE_JETTON,
                request: null,
                response: Bjl.CMD_S_PlaceJetSuccess,
                log: "",
                isprint: false
            },

            
            // [Bjl.SUBID.SUB_S_JETTON_BROADCAST]:{             // push top 10 palyer jetton broadcast in 0.5s gap
            //     subId: Bjl.SUBID.SUB_S_JETTON_BROADCAST,
            //     request: Bjl.CMD_C_GetGameRecord,
            //     response: null,
            //     log: "",
            //     isprint: false
            // },

            [Bjl.SUBID.SUB_S_PLACE_JET_FAIL]:{             // 下注失败
                subId: Bjl.SUBID.SUB_S_PLACE_JET_FAIL,
                request: null,
                response: Bjl.CMD_S_PlaceJettonFail,
                log: "",
                isprint: false
            },

            [Bjl.SUBID.SUB_S_GAME_END]:{             // 当局游戏结束
                subId: Bjl.SUBID.SUB_S_GAME_END,
                request: null,
                response: Bjl.CMD_S_GameEnd,
                log: "",
                isprint: false
            },

            // [Bjl.SUBID.SUB_S_SEND_RECORD]:{             // 游戏记录
            //     subId: Bjl.SUBID.SUB_S_SEND_RECORD,
            //     request: null,
            //     response: Bjl.CMD_S_GameRecord,
            //     log: "",
            //     isprint: false
            // },

            [Bjl.SUBID.SUB_C_QUERY_PLAYERLIST]:{             // 获取玩家在线列表
                subId: Bjl.SUBID.SUB_C_QUERY_PLAYERLIST,
                request: Bjl.CMD_C_PlayerList,
                response: null,
                log: "",
                isprint: false
            },

            [Bjl.SUBID.SUB_S_QUERY_PLAYLIST]:{             // 玩家在线列表返回
                subId: Bjl.SUBID.SUB_S_QUERY_PLAYLIST,
                request: null,
                response: Bjl.CMD_S_PlayerList,
                log: "",
                isprint: false
            },

            [Bjl.SUBID.SUB_C_SYNC_TIME]:{             // 同步TIME
                subId: Bjl.SUBID.SUB_C_SYNC_TIME,
                request: Bjl.CMD_C_SyncTime_Req,
                response: null,
                log: "",
                isprint: false
            },
            [Bjl.SUBID.SUB_S_SYNC_TIME]:{             // 同步TIME返回
                subId: Bjl.SUBID.SUB_S_SYNC_TIME,
                request: null,
                response: Bjl.CMD_S_SyncTime_Res,
                log: "",
                isprint: false
            },

            [Bjl.SUBID.SUB_S_SHUFFLE_CARDS]:{             // 洗牌
                subId: Bjl.SUBID.SUB_S_SHUFFLE_CARDS,
                request: null,
                response: Bjl.CMD_S_ShuffleCards,
                log: "",
                isprint: false
            },

            [Bjl.SUBID.SUB_S_OPEN_CARD]:{             // 游戏开牌
                subId: Bjl.SUBID.SUB_S_OPEN_CARD,
                request: null,
                response: Bjl.CMD_S_OpenCard,
                log: "",
                isprint: false
            },


            [Bjl.SUBID.CS_GAMESCENE_STATUS_FREE]:{             // 空闲场景消息
                subId: Bjl.SUBID.CS_GAMESCENE_STATUS_FREE,
                request: null,
                response: Bjl.CMD_Scene_StatusFree,
                log: "",
                isprint: false
            },
            [Bjl.SUBID.CS_GAMESCENE_STATUS_JETTON]:{             // 下注状态场景消息
                subId: Bjl.SUBID.CS_GAMESCENE_STATUS_JETTON,
                request: null,
                response: Bjl.CMD_Scene_StatusJetton,
                log: "",
                isprint: false
            },
            [Bjl.SUBID.CS_GAMESCENE_STATUS_OPEN]:{             // 开牌状态场景消息
                subId: Bjl.SUBID.CS_GAMESCENE_STATUS_OPEN,
                request: null,
                response: Bjl.CMD_Scene_StatusOpen,
                log: "",
                isprint: false
            },
            [Bjl.SUBID.CS_GAMESCENE_STATUS_END]:{             // 游戏结束状态场景消息
                subId: Bjl.SUBID.CS_GAMESCENE_STATUS_END,
                request: null,
                response: Bjl.CMD_Scene_StatusEnd,
                log: "",
                isprint: false
            },

            [Bjl.SUBID.CS_GAMESCENE_FRESH]:{             // 请求刷新场景
                subId: Bjl.SUBID.CS_GAMESCENE_FRESH,
                request: null,
                response: null,
                log: "",
                isprint: false
            },      
           


        }
    };
    protected getProtoMap(mainId: number, subId: number): ProtoMapItem {
        return this.protoMap[mainId][subId];
    }
}
UMsgCenter.ins.addSerializer(EGameType.BJL, new CBrbjlSerializer());
