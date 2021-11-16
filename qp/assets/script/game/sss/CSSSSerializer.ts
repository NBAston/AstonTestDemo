import { UGameSerializer } from "../UGameSerializer";
import { ProtoMapItem } from "../../common/cmd/UOpcode";
import { Game, s13s } from "../../common/cmd/proto";
import UMsgCenter from "../../common/net/UMsgCenter";
import { EGameType } from "../../common/base/UAllenum";




/**
 * 创建:gss
 * 作用:sss包解析器
 */
export default class CSSSSerializer extends UGameSerializer {
    /** */
    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC]: {
            [s13s.SUBID.SUB_C_MANUALCARDS]: {
                subId: s13s.SUBID.SUB_C_MANUALCARDS,
                request: s13s.CMD_C_ManualCards,
                response: null,
                log: "",
                isprint: false
            },
            [s13s.SUBID.SUB_C_CANCELCARDS]: {
                subId: s13s.SUBID.SUB_C_CANCELCARDS,
                request: s13s.CMD_C_CancelCards,
                response: null,
                log: "",
                isprint: false
            },

            [s13s.SUBID.SUB_C_MAKESUREDUNHANDTY]: {
                subId: s13s.SUBID.SUB_C_MAKESUREDUNHANDTY,
                request: s13s.CMD_C_MakesureDunHandTy,
                response: null,
                log: "",
                isprint: false
            },

            //----收

            [s13s.SUBID.SUB_S_GAME_START]: {
                subId: s13s.SUBID.SUB_S_GAME_START,
                request: null,
                response: s13s.CMD_S_GameStart,
                log: "",
                isprint: false
            },

            [s13s.SUBID.SUB_S_MANUALCARDS]: {
                subId: s13s.SUBID.SUB_S_MANUALCARDS,
                request: null,
                response: s13s.CMD_S_ManualCards,
                log: "",
                isprint: false
            },

            [s13s.SUBID.SUB_S_GAME_END]: {
                subId: s13s.SUBID.SUB_S_GAME_END,
                request: null,
                response: s13s.CMD_S_GameEnd,
                log: "",
                isprint: false
            },
            [s13s.SUBID.SUB_S_MAKESUREDUNHANDTY]: {
                subId: s13s.SUBID.SUB_S_MAKESUREDUNHANDTY,
                request: null,
                response: s13s.CMD_S_MakesureDunHandTy,
                log: "",
                isprint: false
            },
            [s13s.SUBID.SUB_S_COMPARECARDS]: {
                subId: s13s.SUBID.SUB_S_COMPARECARDS,
                request: null,
                response: s13s.CMD_S_CompareCards,
                log: "",
                isprint: false
            },
            [s13s.SUBID.SUB_S_GAME_END]: {
                subId: s13s.SUBID.SUB_S_GAME_END,
                request: null,
                response: s13s.CMD_S_GameEnd,
                log: "",
                isprint: false
            },
            [s13s.SUBID.SUB_SC_GAMESCENE_FREE]: {
                subId: s13s.SUBID.SUB_SC_GAMESCENE_FREE,
                request: null,
                response: s13s.CMD_S_StatusFree,
                log: "",
                isprint: false
            },
            [s13s.SUBID.SUB_SC_GAMESCENE_GROUP]: {
                subId: s13s.SUBID.SUB_SC_GAMESCENE_GROUP,
                request: null,
                response: s13s.CMD_S_StatusGroup,
                log: "",
                isprint: false
            },
            [s13s.SUBID.SUB_SC_GAMESCENE_OPEN]: {
                subId: s13s.SUBID.SUB_SC_GAMESCENE_OPEN,
                request: null,
                response: s13s.CMD_S_StatusOpen,
                log: "",
                isprint: false
            },
            [s13s.SUBID.SUB_SC_GAMESCENE_END]: {
                subId: s13s.SUBID.SUB_SC_GAMESCENE_END,
                request: null,
                response: s13s.CMD_S_StatusEnd,
                log: "",
                isprint: false
            },
            [s13s.SUBID.SUB_S_CANCELCARDS]: {
                subId: s13s.SUBID.SUB_S_CANCELCARDS,
                request: null,
                response: s13s.CMD_S_CancelCards,
                log: "",
                isprint: false
            },

            [s13s.SUBID.SUB_C_ROUND_END_EXIT]: {
                subId: s13s.SUBID.SUB_C_ROUND_END_EXIT,
                request: s13s.CMD_C_RoundEndExit,
                response: null,
                log: "",
                isprint: false
            },

            [s13s.SUBID.SUB_C_ROUND_END_EXIT_RESULT]: {
                subId: s13s.SUBID.SUB_C_ROUND_END_EXIT_RESULT,
                request: null,
                response: s13s.CMD_C_RoundEndExitResult,
                log: "",
                isprint: false
            },
            [s13s.SUBID.CS_GAMESCENE_FRESH]: {
                subId: s13s.SUBID.CS_GAMESCENE_FRESH,
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
UMsgCenter.ins.addSerializer(EGameType.SSS, new CSSSSerializer());
