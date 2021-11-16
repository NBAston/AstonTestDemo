import { UGameSerializer } from "../UGameSerializer";
import { ProtoMapItem } from "../../common/cmd/UOpcode";
import { Game, FTbnn } from "../../common/cmd/proto";
import UMsgCenter from "../../common/net/UMsgCenter";
import { EGameType } from "../../common/base/UAllenum";



/**
 * 创建:dz
 * 作用:qznn包解析器
 */
export default class CTBNNSerializer_hy extends UGameSerializer {
    /** */
    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND]: {
            [FTbnn.SUBID.CS_GAMESCENE_FRESH]: {
                subId: FTbnn.SUBID.CS_GAMESCENE_FRESH,
                request: null,
                response: null,
                log:"",
                isprint:false
            },
            [FTbnn.SUBID.NN_SUB_S_IDLE_TIMEOUT_RESULT]: {
                subId: FTbnn.SUBID.NN_SUB_S_IDLE_TIMEOUT_RESULT,
                request: null,
                response: FTbnn.NN_CMD_S_IdleTimeoutResult,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.SC_GAMESCENE_FREE]: {
                subId: FTbnn.SUBID.SC_GAMESCENE_FREE,
                request: null,
                response: FTbnn.NN_MSG_GS_FREE,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.SC_GAMESCENE_SCORE]: {
                subId: FTbnn.SUBID.SC_GAMESCENE_SCORE,
                request: null,
                response: FTbnn.NN_MSG_GS_SCORE,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.SC_GAMESCENE_OPEN]: {
                subId: FTbnn.SUBID.SC_GAMESCENE_OPEN,
                request: null,
                response: FTbnn.NN_MSG_GS_OPEN,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_S_GAME_START]: {
                subId: FTbnn.SUBID.NN_SUB_S_GAME_START,
                request: null,
                response: FTbnn.NN_CMD_S_GameStart,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_S_ADD_SCORE_RESULT]: {
                subId: FTbnn.SUBID.NN_SUB_S_ADD_SCORE_RESULT,
                request: null,
                response: FTbnn.NN_CMD_S_AddScoreResult,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_S_SEND_CARD]: {
                subId: FTbnn.SUBID.NN_SUB_S_SEND_CARD,
                request: null,
                response: FTbnn.NN_CMD_S_SendCard,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_S_OPEN_CARD_RESULT]: {
                subId: FTbnn.SUBID.NN_SUB_S_OPEN_CARD_RESULT,
                request: null,
                response: FTbnn.NN_CMD_S_OpenCardResult,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_S_GAME_END]: {
                subId: FTbnn.SUBID.NN_SUB_S_GAME_END,
                request: null,
                response: FTbnn.NN_CMD_S_GameEnd,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_C_ADD_SCORE]: {
                subId: FTbnn.SUBID.NN_SUB_C_ADD_SCORE,
                request: FTbnn.NN_CMD_C_AddScore,
                response: null,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_C_OPEN_CARD]: {
                subId: FTbnn.SUBID.NN_SUB_C_OPEN_CARD,
                request: null,
                response: null,
                log: "",
                isprint: false
            },

            [FTbnn.SUBID.NN_SUB_C_READY]: {
                subId: FTbnn.SUBID.NN_SUB_C_READY,
                request: FTbnn.NN_CMD_C_Ready,
                response: null,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_S_READY_RESULT]: {
                subId: FTbnn.SUBID.NN_SUB_S_READY_RESULT,
                request: null,
                response: FTbnn.NN_CMD_S_ReadyResult,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_C_LOOKON]: {
                subId: FTbnn.SUBID.NN_SUB_C_LOOKON,
                request: FTbnn.NN_CMD_C_Lookon,
                response: null,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_S_LOOKON_RESULT]: {
                subId: FTbnn.SUBID.NN_SUB_S_LOOKON_RESULT,
                request: null,
                response: FTbnn.NN_CMD_S_LookonResult,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_C_NEXT_LOOKON]: {
                subId: FTbnn.SUBID.NN_SUB_C_LOOKON,
                request: FTbnn.NN_CMD_C_NextLookon,
                response: null,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_S_NEXT_LOOKON_RESULT]: {
                subId: FTbnn.SUBID.NN_SUB_S_LOOKON_RESULT,
                request: null,
                response: FTbnn.NN_CMD_S_NextLookonResult,
                log: "",
                isprint: false
            },
            
            [FTbnn.SUBID.NN_SUB_S_DISSMIS_RESULT]: {
                subId: FTbnn.SUBID.NN_SUB_S_DISSMIS_RESULT,
                request: null,
                response: FTbnn.NN_CMD_S_DissmisResult,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_C_AGAIN]: {
                subId: FTbnn.SUBID.NN_SUB_C_AGAIN,
                request: FTbnn.NN_CMD_C_Again,
                response: null,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_S_AGAIN_RESULT]: {
                subId: FTbnn.SUBID.NN_SUB_S_AGAIN_RESULT,
                request: null,
                response: FTbnn.NN_CMD_S_AgainResult,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_C_MESSAGE]: {
                subId: FTbnn.SUBID.NN_SUB_C_MESSAGE,
                request: FTbnn.NN_CMD_C_Message,
                response: null,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_S_MESSAGE_RESULT]: {
                subId: FTbnn.SUBID.NN_SUB_S_MESSAGE_RESULT,
                request: null,
                response: FTbnn.NN_CMD_S_MessageResult,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_C_CONCLUDE]: {
                subId: FTbnn.SUBID.NN_SUB_C_CONCLUDE,
                request: FTbnn.NN_CMD_C_Conclude,
                response: null,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_S_CONCLUDE_RESULT]: {
                subId: FTbnn.SUBID.NN_SUB_S_CONCLUDE_RESULT,
                request: null,
                response: FTbnn.NN_CMD_S_ConcludeResult,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_S_CHANGE_USER_STATUS]: {
                subId: FTbnn.SUBID.NN_SUB_S_CHANGE_USER_STATUS,
                request: null,
                response: FTbnn.NN_CMD_S_EndChangeUserStatus,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_S_PRE_DISSMIS_RESULT]: {
                subId: FTbnn.SUBID.NN_SUB_S_PRE_DISSMIS_RESULT,
                request: null,
                response: FTbnn.NN_CMD_C_PreDissmisResult,
                log: "",
                isprint: false
            },

            [FTbnn.SUBID.NN_SUB_C_SET_IP_LIMIT]: {
                subId: FTbnn.SUBID.NN_SUB_C_SET_IP_LIMIT,
                request: FTbnn.NN_CMD_C_IPLimitMessage,
                response: null,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_S_SET_IP_LIMIT_RESULT]: {
                subId: FTbnn.SUBID.NN_SUB_S_SET_IP_LIMIT_RESULT,
                request: null,
                response: FTbnn.NN_CMD_S_IPLimitMessageResult,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_C_SET_SCORE_LIMIT]: {
                subId: FTbnn.SUBID.NN_SUB_C_SET_SCORE_LIMIT,
                request: FTbnn.NN_CMD_C_ScoreLimitMessage,
                response: null,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_S_SET_SCORE_LIMIT_RESULT]: {
                subId: FTbnn.SUBID.NN_SUB_S_SET_SCORE_LIMIT_RESULT,
                request: null,
                response: FTbnn.NN_CMD_S_ScoreLimitMessageResult,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_C_SET_AUTO_START]: {
                subId: FTbnn.SUBID.NN_SUB_C_SET_AUTO_START,
                request: FTbnn.NN_CMD_C_AutoStartMessage,
                response: null,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_S_SET_AUTO_START_RESULT]: {
                subId: FTbnn.SUBID.NN_SUB_S_SET_AUTO_START_RESULT,
                request: null,
                response: FTbnn.NN_CMD_S_AutoStartMessageResult,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_C_GET_USER_SCORE]: {
                subId: FTbnn.SUBID.NN_SUB_C_GET_USER_SCORE,
                request: FTbnn.NN_CMD_C_GetUserScoreMessage,
                response: null,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_S_GET_USER_SCORE_RESULT]: {
                subId: FTbnn.SUBID.NN_SUB_S_GET_USER_SCORE_RESULT,
                request: null,
                response: FTbnn.NN_CMD_S_GetUserScoreMessageResponse,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.SC_GAMESCENE_END]: {
                subId: FTbnn.SUBID.SC_GAMESCENE_END,
                request: null,
                response: FTbnn.NN_MSG_GS_END,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_C_SET_CHAT_LIMIT]: {
                subId: FTbnn.SUBID.NN_SUB_C_SET_CHAT_LIMIT,
                request: FTbnn.NN_CMD_C_ChatLimitMessage,
                response: null,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_C_SET_CHAT_LIMIT_RESULT]: {
                subId: FTbnn.SUBID.NN_SUB_C_SET_CHAT_LIMIT_RESULT,
                request: null,
                response: FTbnn.NN_CMD_S_ChatLimitMessageResult,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_C_SET_PLAYER_NUM_LIMIT]: {
                subId: FTbnn.SUBID.NN_SUB_C_SET_PLAYER_NUM_LIMIT,
                request: FTbnn.NN_CMD_C_PlayerNumLimitMessage,
                response: null,
                log: "",
                isprint: false
            },
            [FTbnn.SUBID.NN_SUB_S_SET_PLAYER_NUM_LIMIT_RESULT]: {
                subId: FTbnn.SUBID.NN_SUB_S_SET_PLAYER_NUM_LIMIT_RESULT,
                request: null,
                response: FTbnn.NN_CMD_C_PlayerNumLimitMessageResult,
                log: "",
                isprint: false
            },
        }
    };
    protected getProtoMap(mainId: number, subId: number): ProtoMapItem {
        return this.protoMap[mainId][subId];
    }
}
UMsgCenter.ins.addSerializer(EGameType.TBNN_HY, new CTBNNSerializer_hy());
