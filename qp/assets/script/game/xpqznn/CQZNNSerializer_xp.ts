import { ProtoMapItem } from "../../common/cmd/UOpcode";
import UMsgCenter from "../../common/net/UMsgCenter";
import { EGameType } from "../../common/base/UAllenum";
import { Game, XPQznn } from "../../common/cmd/proto";
import { UGameSerializer } from "../UGameSerializer";

/**
 * 创建:dz
 * 作用:qznn包解析器
 */
export default class CXPQZNNSerializer extends UGameSerializer {
    /** */
    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC]: {
            [XPQznn.SUBID.SC_GAMESCENE_FREE]: {
                subId: XPQznn.SUBID.SC_GAMESCENE_FREE,
                request: null,
                response: XPQznn.NN_MSG_GS_FREE,
                log:"",
                isprint:false
            },
            [XPQznn.SUBID.SC_GAMESCENE_CALL]: {
                subId: XPQznn.SUBID.SC_GAMESCENE_CALL,
                request: null,
                response: XPQznn.NN_MSG_GS_CALL,
                log:"",
                isprint:false
            },
            [XPQznn.SUBID.SC_GAMESCENE_SCORE]: {
                subId: XPQznn.SUBID.SC_GAMESCENE_SCORE,
                request: null,
                response: XPQznn.NN_MSG_GS_SCORE,
                log:"",
                isprint:false
            },
            [XPQznn.SUBID.SC_GAMESCENE_SELCARD]: {
                subId: XPQznn.SUBID.SC_GAMESCENE_SELCARD,
                request: null,
                response: XPQznn.NN_MSG_GS_SELCARD,
                log:"",
                isprint:false
            },
            [XPQznn.SUBID.SC_GAMESCENE_OPEN]: {
                subId: XPQznn.SUBID.SC_GAMESCENE_OPEN,
                request: null,
                response: XPQznn.NN_MSG_GS_OPEN,
                log:"",
                isprint:false
            },
            [XPQznn.SUBID.NN_SUB_S_GAME_START]: {
                subId: XPQznn.SUBID.NN_SUB_S_GAME_START,
                request:  XPQznn.NN_CMD_S_GameStart,
                response: XPQznn.NN_CMD_S_GameStart,
                log:"",
                isprint:false
            },
            [XPQznn.SUBID.NN_SUB_S_CALL_BANKER]: {
                subId: XPQznn.SUBID.NN_SUB_S_CALL_BANKER,
                request: null,
                response: XPQznn.NN_CMD_S_CallBanker,
                log:"",
                isprint:false
            },
            [XPQznn.SUBID.NN_SUB_S_CALL_BANKER_RESULT]: {
                subId: XPQznn.SUBID.NN_SUB_S_CALL_BANKER_RESULT,
                request: null,
                response: XPQznn.NN_CMD_S_CallBankerResult,
                log:"",
                isprint:false
            },
            [XPQznn.SUBID.NN_SUB_S_ADD_SCORE_RESULT]: {
                subId: XPQznn.SUBID.NN_SUB_S_ADD_SCORE_RESULT,
                request: null,
                response: XPQznn.NN_CMD_S_AddScoreResult,
                log:"",
                isprint:false
            },
            [XPQznn.SUBID.NN_SUB_S_SEND_CARD]: {
                subId: XPQznn.SUBID.NN_SUB_S_SEND_CARD,
                request: null,
                response: XPQznn.NN_CMD_S_SendCard,
                log:"",
                isprint:false
            },
            [XPQznn.SUBID.NN_SUB_S_OPEN_CARD_RESULT]: {
                subId: XPQznn.SUBID.NN_SUB_S_OPEN_CARD_RESULT,
                request: null,
                response: XPQznn.NN_CMD_S_OpenCardResult,
                log:"",
                isprint:false
            },
            [XPQznn.SUBID.NN_SUB_S_GAME_END]: {
                subId: XPQznn.SUBID.NN_SUB_S_GAME_END,
                request: null,
                response: XPQznn.NN_CMD_S_GameEnd,
                log:"",
                isprint:false
            },
            [XPQznn.SUBID.NN_SUB_C_CALL_BANKER]: {
                subId: XPQznn.SUBID.NN_SUB_C_CALL_BANKER,
                request: XPQznn.NN_CMD_C_CallBanker,
                response: null,
                log:"",
                isprint:false
            },
            [XPQznn.SUBID.NN_SUB_C_ADD_SCORE]: {
                subId: XPQznn.SUBID.NN_SUB_C_ADD_SCORE,
                request: XPQznn.NN_CMD_C_AddScore,
                response: null,
                log:"",
                isprint:false
            },
            [XPQznn.SUBID.NN_SUB_C_OPEN_CARD]: {
                subId: XPQznn.SUBID.NN_SUB_C_OPEN_CARD,
                request: null,
                response: null,
                log:"",
                isprint:false
            },

           
            [XPQznn.SUBID.NN_SUB_C_SEL_CARD]: {
                subId: XPQznn.SUBID.NN_SUB_C_SEL_CARD,
                request: XPQznn.NN_CMD_C_SelCard,
                response: null,
                log:"",
                isprint:false
            },
            [XPQznn.SUBID.NN_SUB_S_SEND_SELECT_CARDS]: {
                subId: XPQznn.SUBID.NN_SUB_S_SEND_SELECT_CARDS,
                request: null,
                response: XPQznn.NN_CMD_S_SendSelCard,
                log:"",
                isprint:false
            },
            [XPQznn.SUBID.NN_SUB_S_SEL_CARD_RESULT]: {
                subId: XPQznn.SUBID.NN_SUB_S_SEL_CARD_RESULT,
                request: null,
                response: XPQznn.NN_CMD_S_SelCardResult,
                log:"",
                isprint:false
            },

            [XPQznn.SUBID.NN_SUB_C_ROUND_END_EXIT]: {
                subId: XPQznn.SUBID.NN_SUB_C_ROUND_END_EXIT,
                request: XPQznn.NN_CMD_C_RoundEndExit,
                response: null,
                log:"",
                isprint:false
            },
            [XPQznn.SUBID.NN_SUB_C_ROUND_END_EXIT_RESULT]: {
                subId: XPQznn.SUBID.NN_SUB_C_ROUND_END_EXIT_RESULT,
                request: null,
                response: XPQznn.NN_CMD_C_RoundEndExitResult,
                log:"",
                isprint:false
            },
        }
    };
    protected getProtoMap(mainId: number, subId: number): ProtoMapItem {
        return this.protoMap[mainId][subId];
    }
}
UMsgCenter.ins.addSerializer(EGameType.XPQZNN, new CXPQZNNSerializer());
