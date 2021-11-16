import { ProtoMapItem } from "../../common/cmd/UOpcode";
import UMsgCenter from "../../common/net/UMsgCenter";
import { EGameType } from "../../common/base/UAllenum";
import { Game, Qznn } from "../../common/cmd/proto";
import { UGameSerializer } from "../UGameSerializer";

/**
 * 创建:dz
 * 作用:qznn包解析器
 */
export default class CQZNNSerializer extends UGameSerializer {
    /** */
    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC]: {
            [Qznn.SUBID.SC_GAMESCENE_FREE]: {
                subId: Qznn.SUBID.SC_GAMESCENE_FREE,
                request: null,
                response: Qznn.NN_MSG_GS_FREE,
                log:"",
                isprint:false
            },
            [Qznn.SUBID.SC_GAMESCENE_CALL]: {
                subId: Qznn.SUBID.SC_GAMESCENE_CALL,
                request: null,
                response: Qznn.NN_MSG_GS_CALL,
                log:"",
                isprint:false
            },
            [Qznn.SUBID.SC_GAMESCENE_SCORE]: {
                subId: Qznn.SUBID.SC_GAMESCENE_SCORE,
                request: null,
                response: Qznn.NN_MSG_GS_SCORE,
                log:"",
                isprint:false
            },
            [Qznn.SUBID.SC_GAMESCENE_OPEN]: {
                subId: Qznn.SUBID.SC_GAMESCENE_OPEN,
                request: null,
                response: Qznn.NN_MSG_GS_OPEN,
                log:"",
                isprint:false
            },
             [Qznn.SUBID.SC_GAMESCENE_END]: {
                 subId: Qznn.SUBID.SC_GAMESCENE_END,
                 request: null,
                 response: Qznn.NN_MSG_GS_END,
                 log:"",
                 isprint:false
             },
            [Qznn.SUBID.NN_SUB_S_GAME_START]: {
                subId: Qznn.SUBID.NN_SUB_S_GAME_START,
                request:  Qznn.NN_CMD_S_GameStart,
                response: Qznn.NN_CMD_S_GameStart,
                log:"",
                isprint:false
            },
            [Qznn.SUBID.NN_SUB_S_CALL_BANKER]: {
                subId: Qznn.SUBID.NN_SUB_S_CALL_BANKER,
                request: null,
                response: Qznn.NN_CMD_S_CallBanker,
                log:"",
                isprint:false
            },
            [Qznn.SUBID.NN_SUB_S_CALL_BANKER_RESULT]: {
                subId: Qznn.SUBID.NN_SUB_S_CALL_BANKER_RESULT,
                request: null,
                response: Qznn.NN_CMD_S_CallBankerResult,
                log:"",
                isprint:false
            },
            [Qznn.SUBID.NN_SUB_S_ADD_SCORE_RESULT]: {
                subId: Qznn.SUBID.NN_SUB_S_ADD_SCORE_RESULT,
                request: null,
                response: Qznn.NN_CMD_S_AddScoreResult,
                log:"",
                isprint:false
            },
            [Qznn.SUBID.NN_SUB_S_SEND_CARD]: {
                subId: Qznn.SUBID.NN_SUB_S_SEND_CARD,
                request: null,
                response: Qznn.NN_CMD_S_SendCard,
                log:"",
                isprint:false
            },
            [Qznn.SUBID.NN_SUB_S_OPEN_CARD_RESULT]: {
                subId: Qznn.SUBID.NN_SUB_S_OPEN_CARD_RESULT,
                request: null,
                response: Qznn.NN_CMD_S_OpenCardResult,
                log:"",
                isprint:false
            },
            [Qznn.SUBID.NN_SUB_S_GAME_END]: {
                subId: Qznn.SUBID.NN_SUB_S_GAME_END,
                request: null,
                response: Qznn.NN_CMD_S_GameEnd,
                log:"",
                isprint:false
            },
            // [qznn.SUBID.NN_SUB_S_OPERATE_FAIL]: {
            //     subId: qznn.SUBID.NN_SUB_S_OPERATE_FAIL,
            //     request: null,
            //     response: qznn.,
            //     log:"",
            //     isprint:false
            // },
            [Qznn.SUBID.NN_SUB_C_CALL_BANKER]: {
                subId: Qznn.SUBID.NN_SUB_C_CALL_BANKER,
                request: Qznn.NN_CMD_C_CallBanker,
                response: null,
                log:"",
                isprint:false
            },
            [Qznn.SUBID.NN_SUB_C_ADD_SCORE]: {
                subId: Qznn.SUBID.NN_SUB_C_ADD_SCORE,
                request: Qznn.NN_CMD_C_AddScore,
                response: null,
                log:"",
                isprint:false
            },
            [Qznn.SUBID.NN_SUB_C_OPEN_CARD]: {
                subId: Qznn.SUBID.NN_SUB_C_OPEN_CARD,
                request: null,
                response: null,
                log:"",
                isprint:false
            },
            [Qznn.SUBID.CS_GAMESCENE_FRESH]: {
                subId: Qznn.SUBID.CS_GAMESCENE_FRESH,
                request: null,
                response: null,
                log:"",
                isprint:false
            },
            [Qznn.SUBID.NN_SUB_C_ROUND_END_EXIT]: {
                subId: Qznn.SUBID.NN_SUB_C_ROUND_END_EXIT,
                request: Qznn.NN_CMD_C_RoundEndExit,
                response: null,
                log:"",
                isprint:false
            },
            [Qznn.SUBID.NN_SUB_C_ROUND_END_EXIT_RESULT]: {
                subId: Qznn.SUBID.NN_SUB_C_ROUND_END_EXIT_RESULT,
                request: null,
                response: Qznn.NN_CMD_C_RoundEndExitResult,
                log:"",
                isprint:false
            },

        }
    };
    protected getProtoMap(mainId: number, subId: number): ProtoMapItem {
        return this.protoMap[mainId][subId];
    }
}
UMsgCenter.ins.addSerializer(EGameType.QZNN, new CQZNNSerializer());
