
import { ProtoMapItem } from "../../common/cmd/UOpcode";
import UMsgCenter from "../../common/net/UMsgCenter";
import { EGameType } from "../../common/base/UAllenum";
import { Game, Blackjack } from "../../common/cmd/proto";
import { UGameSerializer } from "../UGameSerializer";

/**
 * 创建:gss
 * 作用:bj包解析器
 */
export default class CBJSerializer extends UGameSerializer {
    /** */

    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC]: {
            [Blackjack.SUBID.SUB_C_ADD_SCORE]: {
                subId: Blackjack.SUBID.SUB_C_ADD_SCORE,
                request: Blackjack.CMD_C_AddScore,
                response: null,
                log: "",
                isprint: false

            },
            [Blackjack.SUBID.SUB_C_INSURE]: {
                subId: Blackjack.SUBID.SUB_C_INSURE,
                request: Blackjack.CMD_C_Insure,
                response: null,
                log: "",
                isprint: false

            },
            [Blackjack.SUBID.SUB_C_OPERATE]: {
                subId: Blackjack.SUBID.SUB_C_OPERATE,
                request: Blackjack.CMD_C_Operate,
                response: null,
                log: "",
                isprint: false

            },

            [Blackjack.SUBID.SUB_C_END_SCORE]: {
                subId: Blackjack.SUBID.SUB_C_END_SCORE,
                request: null,
                response: null,
                log: "",
                isprint: false

            },



            [Blackjack.SUBID.SUB_S_ERROR_INFO]: {
                subId: Blackjack.SUBID.SUB_S_ERROR_INFO,
                request: null,
                log: "",
                isprint: false,
                response: Blackjack.CMD_S_ErrorInfo,
            },



            [Blackjack.SUBID.SUB_S_END_SCORE]: {
                subId: Blackjack.SUBID.SUB_S_END_SCORE,
                request: null,
                log: "",
                isprint: false,
                response: Blackjack.CMD_S_EndScore,
            },




            [Blackjack.SUBID.SUB_SC_GAMESCENE_FREE]: {
                subId: Blackjack.SUBID.SUB_SC_GAMESCENE_FREE,
                request: null,
                response: Blackjack.CMD_S_StatusFree,
                log: "",
                isprint: false

            },
            [Blackjack.SUBID.SUB_SC_GAMESCENE_SCORE]: {
                subId: Blackjack.SUBID.SUB_SC_GAMESCENE_SCORE,
                request: null,
                response: Blackjack.CMD_S_StatusScore,
                log: "",
                isprint: false

            },
            [Blackjack.SUBID.SUB_SC_GAMESCENE_INSURE]: {
                subId: Blackjack.SUBID.SUB_SC_GAMESCENE_INSURE,
                request: null,
                response: Blackjack.CMD_S_StatusInsure,
                log: "",
                isprint: false

            },

            [Blackjack.SUBID.SUB_SC_GAMESCENE_PLAY]: {
                subId: Blackjack.SUBID.SUB_SC_GAMESCENE_PLAY,
                request: null,
                response: Blackjack.CMD_S_StatusPlay,
                log: "",
                isprint: false

            },
            [Blackjack.SUBID.SUB_SC_GAMESCENE_END]: {
                subId: Blackjack.SUBID.SUB_SC_GAMESCENE_END,
                request: null,
                response: Blackjack.CMD_S_StatusEnd,
                log: "",
                isprint: false

            },


            [Blackjack.SUBID.SUB_S_GAME_START]: {
                subId: Blackjack.SUBID.SUB_S_GAME_START,
                request: null,
                response: Blackjack.CMD_S_GameStart,
                log: "",
                isprint: false

            },
            [Blackjack.SUBID.SUB_S_ADD_SCORE]: {
                subId: Blackjack.SUBID.SUB_C_ADD_SCORE,
                request: null,
                response: Blackjack.CMD_S_AddScore,
                log: "",
                isprint: false

            },
            [Blackjack.SUBID.SUB_S_DEAL_CARD]: {
                subId: Blackjack.SUBID.SUB_S_DEAL_CARD,
                request: null,
                response: Blackjack.CMD_S_DealCard,
                log: "",
                isprint: false

            },
            [Blackjack.SUBID.SUB_S_INSURE]: {
                subId: Blackjack.SUBID.SUB_S_INSURE,
                request: null,
                response: Blackjack.CMD_S_Insure,
                log: "",
                isprint: false

            },
            [Blackjack.SUBID.SUB_S_INSURE_RESULT]: {
                subId: Blackjack.SUBID.SUB_S_INSURE_RESULT,
                request: null,
                response: Blackjack.CMD_S_Insure_Result,
                log: "",
                isprint: false

            },

            [Blackjack.SUBID.SUB_S_GAME_END]: {
                subId: Blackjack.SUBID.SUB_S_GAME_END,
                request: null,
                response: Blackjack.CMD_S_GameEnd,
                log: "",
                isprint: false
            },
            [Blackjack.SUBID.SUB_S_OPERATE]: {
                subId: Blackjack.SUBID.SUB_S_OPERATE,
                request: null,
                response: Blackjack.CMD_S_Operate,
                log: "",
                isprint: false
            },
            [Blackjack.SUBID.SUB_S_OPER_RESULT]: {
                subId: Blackjack.SUBID.SUB_S_OPER_RESULT,
                request: null,
                response: Blackjack.CMD_S_Oper_Result,
                log: "",
                isprint: false
            },
            [Blackjack.SUBID.SUB_S_BANKER_DEAL]: {
                subId: Blackjack.SUBID.SUB_S_BANKER_DEAL,
                request: null,
                response: Blackjack.CMD_S_Banker_Deal,
                log: "",
                isprint: false
            },
            [Blackjack.SUBID.SUB_S_GAME_START_AI]: {
                subId: Blackjack.SUBID.SUB_S_GAME_START_AI,
                request: null,
                response: Blackjack.CMD_S_GameStartAi,
                log: "",
                isprint: false
            },
            [Blackjack.SUBID.SUB_C_ROUND_END_EXIT]: {
                subId: Blackjack.SUBID.SUB_C_ROUND_END_EXIT,
                request: Blackjack.CMD_C_RoundEndExit,
                response: null,
                log: "",
                isprint: false
            },
            [Blackjack.SUBID.SUB_C_ROUND_END_EXIT_RESULT]: {
                subId: Blackjack.SUBID.SUB_C_ROUND_END_EXIT_RESULT,
                request: null,
                response: Blackjack.CMD_C_RoundEndExitResult,
                log: "",
                isprint: false
            },
            [Blackjack.SUBID.CS_GAMESCENE_FRESH]: {
                subId: Blackjack.SUBID.CS_GAMESCENE_FRESH,
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
UMsgCenter.ins.addSerializer(EGameType.BJ, new CBJSerializer());
