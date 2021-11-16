import { ProtoMapItem } from "../../common/cmd/UOpcode";
import UMsgCenter from "../../common/net/UMsgCenter";
import { EGameType } from "../../common/base/UAllenum";
import { Game, XPQzjh } from "../../common/cmd/proto";
import { UGameSerializer } from "../UGameSerializer";

/**
 * 创建:dz
 * 作用:qznn包解析器
 */
export default class CXPJHSerializer extends UGameSerializer {
    /** */
    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC]: {
            [XPQzjh.SUBID.SC_GAMESCENE_FREE]: {
                subId: XPQzjh.SUBID.SC_GAMESCENE_FREE,
                request: null,
                response: XPQzjh.NN_MSG_GS_FREE,
                log:"",
                isprint:false
            },
            [XPQzjh.SUBID.SC_GAMESCENE_CALL]: {
                subId: XPQzjh.SUBID.SC_GAMESCENE_CALL,
                request: null,
                response: XPQzjh.NN_MSG_GS_CALL,
                log:"",
                isprint:false
            },
            [XPQzjh.SUBID.SC_GAMESCENE_SCORE]: {
                subId: XPQzjh.SUBID.SC_GAMESCENE_SCORE,
                request: null,
                response: XPQzjh.NN_MSG_GS_SCORE,
                log:"",
                isprint:false
            },
            [XPQzjh.SUBID.SC_GAMESCENE_SELCARD]: {
                subId: XPQzjh.SUBID.SC_GAMESCENE_SELCARD,
                request: null,
                response: XPQzjh.NN_MSG_GS_SELCARD,
                log:"",
                isprint:false
            },
            [XPQzjh.SUBID.SC_GAMESCENE_OPEN]: {
                subId: XPQzjh.SUBID.SC_GAMESCENE_OPEN,
                request: null,
                response: XPQzjh.NN_MSG_GS_OPEN,
                log:"",
                isprint:false
            },
            [XPQzjh.SUBID.NN_SUB_S_GAME_START]: {
                subId: XPQzjh.SUBID.NN_SUB_S_GAME_START,
                request:  XPQzjh.NN_CMD_S_GameStart,
                response: XPQzjh.NN_CMD_S_GameStart,
                log:"",
                isprint:false
            },
            [XPQzjh.SUBID.NN_SUB_S_CALL_BANKER]: {
                subId: XPQzjh.SUBID.NN_SUB_S_CALL_BANKER,
                request: null,
                response: XPQzjh.NN_CMD_S_CallBanker,
                log:"",
                isprint:false
            },
            [XPQzjh.SUBID.NN_SUB_S_CALL_BANKER_RESULT]: {
                subId: XPQzjh.SUBID.NN_SUB_S_CALL_BANKER_RESULT,
                request: null,
                response: XPQzjh.NN_CMD_S_CallBankerResult,
                log:"",
                isprint:false
            },
            [XPQzjh.SUBID.NN_SUB_S_ADD_SCORE_RESULT]: {
                subId: XPQzjh.SUBID.NN_SUB_S_ADD_SCORE_RESULT,
                request: null,
                response: XPQzjh.NN_CMD_S_AddScoreResult,
                log:"",
                isprint:false
            },
            [XPQzjh.SUBID.NN_SUB_S_SEND_CARD]: {
                subId: XPQzjh.SUBID.NN_SUB_S_SEND_CARD,
                request: null,
                response: XPQzjh.NN_CMD_S_SendCard,
                log:"",
                isprint:false
            },
            [XPQzjh.SUBID.NN_SUB_S_OPEN_CARD_RESULT]: {
                subId: XPQzjh.SUBID.NN_SUB_S_OPEN_CARD_RESULT,
                request: null,
                response: XPQzjh.NN_CMD_S_OpenCardResult,
                log:"",
                isprint:false
            },
            [XPQzjh.SUBID.NN_SUB_S_GAME_END]: {
                subId: XPQzjh.SUBID.NN_SUB_S_GAME_END,
                request: null,
                response: XPQzjh.NN_CMD_S_GameEnd,
                log:"",
                isprint:false
            },
            [XPQzjh.SUBID.NN_SUB_C_CALL_BANKER]: {
                subId: XPQzjh.SUBID.NN_SUB_C_CALL_BANKER,
                request: XPQzjh.NN_CMD_C_CallBanker,
                response: null,
                log:"",
                isprint:false
            },
            [XPQzjh.SUBID.NN_SUB_C_ADD_SCORE]: {
                subId: XPQzjh.SUBID.NN_SUB_C_ADD_SCORE,
                request: XPQzjh.NN_CMD_C_AddScore,
                response: null,
                log:"",
                isprint:false
            },
            [XPQzjh.SUBID.NN_SUB_C_OPEN_CARD]: {
                subId: XPQzjh.SUBID.NN_SUB_C_OPEN_CARD,
                request: null,
                response: null,
                log:"",
                isprint:false
            },

           
            [XPQzjh.SUBID.NN_SUB_C_SEL_CARD]: {
                subId: XPQzjh.SUBID.NN_SUB_C_SEL_CARD,
                request: XPQzjh.NN_CMD_C_SelCard,
                response: null,
                log:"",
                isprint:false
            },
            [XPQzjh.SUBID.NN_SUB_S_SEND_SELECT_CARDS]: {
                subId: XPQzjh.SUBID.NN_SUB_S_SEND_SELECT_CARDS,
                request: null,
                response: XPQzjh.NN_CMD_S_SendSelCard,
                log:"",
                isprint:false
            },
            [XPQzjh.SUBID.NN_SUB_S_SEL_CARD_RESULT]: {
                subId: XPQzjh.SUBID.NN_SUB_S_SEL_CARD_RESULT,
                request: null,
                response: XPQzjh.NN_CMD_S_SelCardResult,
                log:"",
                isprint:false
            },

            [XPQzjh.SUBID.NN_SUB_C_ROUND_END_EXIT]: {
                subId: XPQzjh.SUBID.NN_SUB_C_ROUND_END_EXIT,
                request: XPQzjh.NN_CMD_C_RoundEndExit,
                response: null,
                log:"",
                isprint:false
            },
            [XPQzjh.SUBID.NN_SUB_C_ROUND_END_EXIT_RESULT]: {
                subId: XPQzjh.SUBID.NN_SUB_C_ROUND_END_EXIT_RESULT,
                request: null,
                response: XPQzjh.NN_CMD_C_RoundEndExitResult,
                log:"",
                isprint:false
            },
        }
    };
    protected getProtoMap(mainId: number, subId: number): ProtoMapItem {
        return this.protoMap[mainId][subId];
    }
}
UMsgCenter.ins.addSerializer(EGameType.XPJH, new CXPJHSerializer());
