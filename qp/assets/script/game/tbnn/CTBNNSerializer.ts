import { UGameSerializer } from "../UGameSerializer";
import { ProtoMapItem } from "../../common/cmd/UOpcode";
import { Game, Tbnn } from "../../common/cmd/proto";
import UMsgCenter from "../../common/net/UMsgCenter";
import { EGameType } from "../../common/base/UAllenum";



/**
 * 创建:dz
 * 作用:qznn包解析器
 */
export default class CTBNNSerializer extends UGameSerializer {
    /** */
    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC]: {
            [Tbnn.SUBID.SC_GAMESCENE_FREE]: {
                subId: Tbnn.SUBID.SC_GAMESCENE_FREE,
                request: null,
                response: Tbnn.NN_MSG_GS_FREE,
                log:"",
                isprint:false
            },
            // [Tbnn.SUBID.SC_GAMESCENE_CALL]: {
            //     subId: Tbnn.SUBID.SC_GAMESCENE_CALL,
            //     request: null,
            //     response: Tbnn.NN_MSG_GS_CALL,
            //     log:"",
            //     isprint:false
            // },
            [Tbnn.SUBID.SC_GAMESCENE_SCORE]: {
                subId: Tbnn.SUBID.SC_GAMESCENE_SCORE,
                request: null,
                response: Tbnn.NN_MSG_GS_SCORE,
                log:"",
                isprint:false
            },
            [Tbnn.SUBID.SC_GAMESCENE_OPEN]: {
                subId: Tbnn.SUBID.SC_GAMESCENE_OPEN,
                request: null,
                response: Tbnn.NN_MSG_GS_OPEN,
                log:"",
                isprint:false
            },
            [Tbnn.SUBID.SC_GAMESCENE_END]: {
                subId: Tbnn.SUBID.SC_GAMESCENE_END,
                request: null,
                response: Tbnn.NN_MSG_GS_END,
                log:"",
                isprint:false
            },
            [Tbnn.SUBID.NN_SUB_S_GAME_START]: {
                subId: Tbnn.SUBID.NN_SUB_S_GAME_START,
                request:  Tbnn.NN_CMD_S_GameStart,
                response: Tbnn.NN_CMD_S_GameStart,
                log:"",
                isprint:false
            },
            // [Tbnn.SUBID.NN_SUB_S_CALL_BANKER]: {
            //     subId: Tbnn.SUBID.NN_SUB_S_CALL_BANKER,
            //     request: null,
            //     response: Tbnn.NN_CMD_S_CallBanker,
            //     log:"",
            //     isprint:false
            // },
            // [Tbnn.SUBID.NN_SUB_S_CALL_BANKER_RESULT]: {
            //     subId: Tbnn.SUBID.NN_SUB_S_CALL_BANKER_RESULT,
            //     request: null,
            //     response: Tbnn.NN_CMD_S_CallBankerResult,
            //     log:"",
            //     isprint:false
            // },
            [Tbnn.SUBID.NN_SUB_S_ADD_SCORE_RESULT]: {
                subId: Tbnn.SUBID.NN_SUB_S_ADD_SCORE_RESULT,
                request: null,
                response: Tbnn.NN_CMD_S_AddScoreResult,
                log:"",
                isprint:false
            },
            [Tbnn.SUBID.NN_SUB_S_SEND_CARD]: {
                subId: Tbnn.SUBID.NN_SUB_S_SEND_CARD,
                request: null,
                response: Tbnn.NN_CMD_S_SendCard,
                log:"",
                isprint:false
            },
            [Tbnn.SUBID.NN_SUB_S_OPEN_CARD_RESULT]: {
                subId: Tbnn.SUBID.NN_SUB_S_OPEN_CARD_RESULT,
                request: null,
                response: Tbnn.NN_CMD_S_OpenCardResult,
                log:"",
                isprint:false
            },
            [Tbnn.SUBID.NN_SUB_S_GAME_END]: {
                subId: Tbnn.SUBID.NN_SUB_S_GAME_END,
                request: null,
                response: Tbnn.NN_CMD_S_GameEnd,
                log:"",
                isprint:false
            },
            [Tbnn.SUBID.NN_SUB_C_ADD_SCORE]: {
                subId: Tbnn.SUBID.NN_SUB_C_ADD_SCORE,
                request: Tbnn.NN_CMD_C_AddScore,
                response: null,
                log:"",
                isprint:false
            },
            [Tbnn.SUBID.NN_SUB_C_OPEN_CARD]: {
                subId: Tbnn.SUBID.NN_SUB_C_OPEN_CARD,
                request: null,
                response: null,
                log:"",
                isprint:false
            },
            [Tbnn.SUBID.CS_GAMESCENE_FRESH]: {
                subId: Tbnn.SUBID.CS_GAMESCENE_FRESH,
                request: null,
                response: null,
                log:"",
                isprint:false
            },
            [Tbnn.SUBID.NN_SUB_C_ROUND_END_EXIT]: {
                subId: Tbnn.SUBID.NN_SUB_C_ROUND_END_EXIT,
                request: Tbnn.NN_CMD_C_RoundEndExit,
                response: null,
                log:"",
                isprint:false
            },[Tbnn.SUBID.NN_SUB_C_ROUND_END_EXIT_RESULT]: {
                subId: Tbnn.SUBID.NN_SUB_C_ROUND_END_EXIT_RESULT,
                request: null,
                response: Tbnn.NN_CMD_C_RoundEndExitResult,
                log:"",
                isprint:false
            },

        }
    };
    protected getProtoMap(mainId: number, subId: number): ProtoMapItem {
        return this.protoMap[mainId][subId];
    }
}
UMsgCenter.ins.addSerializer(EGameType.TBNN, new CTBNNSerializer());
