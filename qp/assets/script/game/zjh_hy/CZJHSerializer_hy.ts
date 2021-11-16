import { USerializer } from "../../common/net/USerializer";
import { ProtoMapItem } from "../../common/cmd/UOpcode";
import UMsgCenter from "../../common/net/UMsgCenter";
import { EGameType } from "../../common/base/UAllenum";
import { Game, FZJH } from "../../common/cmd/proto";
import { UGameSerializer } from "../UGameSerializer";
import UDebug from "../../common/utility/UDebug";

/**
 * 创建:sq
 * 作用:FZJH包解析器
 */
export default class CFZJHSerializer_hy extends UGameSerializer {
    /** */
    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND]: {
            [FZJH.SUBID.SUB_C_ADD_SCORE]: {
                subId: FZJH.SUBID.SUB_C_ADD_SCORE,
                request: FZJH.CMD_C_AddScore,
                response: null,
                log: "",
                isprint: false

            },
            [FZJH.SUBID.SUB_S_ADD_SCORE]: {
                subId: FZJH.SUBID.SUB_C_ADD_SCORE,
                request: null,
                response: FZJH.CMD_S_AddScore,
                log: "",
                isprint: false

            },
            [FZJH.SUBID.SUB_C_GIVE_UP]: {
                subId: FZJH.SUBID.SUB_C_GIVE_UP,
                request: FZJH.CMD_C_NULL,
                response: null,
                log: "",
                isprint: false

            },
            [FZJH.SUBID.SUB_S_GIVE_UP]: {
                subId: FZJH.SUBID.SUB_S_GIVE_UP,
                request: null,
                response: FZJH.CMD_S_GiveUp,
                log: "",
                isprint: false

            },
            [FZJH.SUBID.SUB_C_COMPARE_CARD]: {
                subId: FZJH.SUBID.SUB_C_COMPARE_CARD,
                request: FZJH.CMD_C_CompareCard,
                response: null,
                log: "",
                isprint: false

            },
            [FZJH.SUBID.SUB_S_COMPARE_CARD]: {
                subId: FZJH.SUBID.SUB_S_COMPARE_CARD,
                request: FZJH.CMD_S_CompareCard,
                response: null,
                log: "",
                isprint: false

            },
            [FZJH.SUBID.SUB_C_LOOK_CARD]: {
                subId: FZJH.SUBID.SUB_C_LOOK_CARD,
                request: FZJH.CMD_C_NULL,
                response: null,
                log: "",
                isprint: false

            },
            [FZJH.SUBID.SUB_S_LOOK_CARD]: {
                subId: null,
                request: null,
                response: FZJH.CMD_S_LookCard,
                log: "",
                isprint: false

            },
            [FZJH.SUBID.SUB_S_COMPARE_CARD]: {
                subId: FZJH.SUBID.SUB_S_COMPARE_CARD,
                request: null,
                response: FZJH.CMD_S_CompareCard,
                log: "",
                isprint: false

            },

            [FZJH.SUBID.SUB_C_ALL_IN]: {
                subId: FZJH.SUBID.SUB_C_ALL_IN,
                request: FZJH.CMD_C_NULL,
                response: null,
                log: "",
                isprint: false

            },
            [FZJH.SUBID.SUB_S_ALL_IN]: {
                subId: FZJH.SUBID.SUB_S_ALL_IN,
                request: null,
                response: FZJH.CMD_S_AllIn,
                log: "",
                isprint: false

            },
            [FZJH.SUBID.SUB_SC_GAMESCENE_FREE]: {
                subId: FZJH.SUBID.SUB_SC_GAMESCENE_FREE,
                request: null,
                response: FZJH.CMD_S_StatusFree,
                log: "",
                isprint: false

            },
            [FZJH.SUBID.SUB_SC_GAMESCENE_PLAY]: {
                subId: FZJH.SUBID.SUB_SC_GAMESCENE_PLAY,
                request: null,
                response: FZJH.CMD_S_StatusPlay,
                log: "",
                isprint: false

            },
            [FZJH.SUBID.SUB_SC_GAMESCENE_END]: {
                subId: FZJH.SUBID.SUB_SC_GAMESCENE_END,
                request: null,
                response: FZJH.CMD_S_StatusEnd,
                log: "",
                isprint: false

            },
            [FZJH.SUBID.SUB_S_GAME_START]: {
                subId: FZJH.SUBID.SUB_S_GAME_START,
                request: null,
                response: FZJH.CMD_S_GameStart,
                log: "",
                isprint: false

            },
            [FZJH.SUBID.SUB_S_GAME_END]: {
                subId: FZJH.SUBID.SUB_S_GAME_END,
                request: null,
                response: FZJH.CMD_S_GameEnd,
                log: "",
                isprint: false
            },
            [FZJH.SUBID.SUB_S_GAME_END]: {
                subId: FZJH.SUBID.SUB_S_GAME_END,
                request: null,
                response: FZJH.CMD_S_GameEnd,
                log: "",
                isprint: false
            },
            [FZJH.SUBID.SUB_C_GIVEUP_TIMEOUT_OP]: {
                subId: FZJH.SUBID.SUB_C_GIVEUP_TIMEOUT_OP,
                request: FZJH.CMD_C_GIVEUP_TIMEOUT_OP,
                response: null,
                log: "",
                isprint: false
            },  
             [FZJH.SUBID.SUB_S_GIVEUP_TIMEOUT_OP]: {
                subId: FZJH.SUBID.SUB_S_GIVEUP_TIMEOUT_OP,
                request: null,
                response: FZJH.CMD_S_GIVEUP_TIMEOUT_OP,
                log: "",
                isprint: false
            },
            [FZJH.SUBID.NN_SUB_C_READY]: {
                subId: FZJH.SUBID.NN_SUB_C_READY,
                request: FZJH.NN_CMD_C_Ready,
                response: null,
                log: "",
                isprint: false
            },  
             [FZJH.SUBID.NN_SUB_S_READY_RESULT]: {
                subId: FZJH.SUBID.NN_SUB_S_READY_RESULT,
                request: null,
                response: FZJH.NN_CMD_S_ReadyResult,
                log: "",
                isprint: false
            },
            [FZJH.SUBID.NN_SUB_C_LOOKON]: {
                subId: FZJH.SUBID.NN_SUB_C_LOOKON,
                request: FZJH.NN_CMD_C_Lookon,
                response: null,
                log: "",
                isprint: false
            },  
             [FZJH.SUBID.NN_SUB_S_LOOKON_RESULT]: {
                subId: FZJH.SUBID.NN_SUB_S_LOOKON_RESULT,
                request: null,
                response: FZJH.NN_CMD_S_LookonResult,
                log: "",
                isprint: false
            },
            [FZJH.SUBID.NN_SUB_S_PRE_DISSMIS_RESULT]: {
                subId: FZJH.SUBID.NN_SUB_S_PRE_DISSMIS_RESULT,
                request: null,
                response: FZJH.NN_CMD_S_PreDissmisResult,
                log: "",
                isprint: false
            },  
             [FZJH.SUBID.NN_SUB_S_DISSMIS_RESULT]: {
                subId: FZJH.SUBID.NN_SUB_S_DISSMIS_RESULT,
                request: null,
                response: FZJH.NN_CMD_S_DissmisResult,
                log: "",
                isprint: false
            },
            [FZJH.SUBID.NN_SUB_C_NEXT_LOOKON]: {
                subId: FZJH.SUBID.NN_SUB_C_NEXT_LOOKON,
                request: FZJH.NN_CMD_C_NextLookon,
                response: null,
                log: "",
                isprint: false
            },  
             [FZJH.SUBID.NN_SUB_S_NEXT_LOOKON_RESULT]: {
                subId: FZJH.SUBID.NN_SUB_S_NEXT_LOOKON_RESULT,
                request: null,
                response: FZJH.NN_CMD_S_NextLookonResult,
                log: "",
                isprint: false
            },
            [FZJH.SUBID.NN_SUB_C_CONCLUDE]: {
                subId: FZJH.SUBID.NN_SUB_C_CONCLUDE,
                request: FZJH.NN_CMD_C_Conclude,
                response: null,
                log: "",
                isprint: false
            },  
            [FZJH.SUBID.NN_SUB_S_CONCLUDE_RESULT]: {
                subId: FZJH.SUBID.NN_SUB_S_CONCLUDE_RESULT,
                request: null,
                response: FZJH.NN_CMD_S_ConcludeResult,
                log: "",
                isprint: false
            },
            [FZJH.SUBID.NN_SUB_S_CHANGE_USER_STATUS]: {
                subId: FZJH.SUBID.NN_SUB_S_CHANGE_USER_STATUS,
                request: null,
                response: FZJH.NN_CMD_S_EndChangeUserStatus,
                log: "",
                isprint: false
            },
            [FZJH.SUBID.NN_SUB_C_RECHARGE]: {
                subId: FZJH.SUBID.NN_SUB_C_RECHARGE,
                request: FZJH.NN_CMD_C_Recharge,
                response: null,
                log: "",
                isprint: false
            },  
            [FZJH.SUBID.NN_SUB_S2H_RECHARGE]: {
                subId: FZJH.SUBID.NN_SUB_S2H_RECHARGE,
                request: null,
                response: FZJH.NN_CMD_S2H_Recharge,
                log: "",
                isprint: false
            }, 
            [FZJH.SUBID.NN_SUB_H2C_RECHARGE_RESULT]: {
                subId: FZJH.SUBID.NN_SUB_H2C_RECHARGE_RESULT,
                request: FZJH.NN_CMD_H2C_RechargeResult,
                response: FZJH.NN_CMD_H2C_RechargeResult,
                log: "",
                isprint: false
            },
            [FZJH.SUBID.NN_SUB_C_AGAIN]: {
                subId: FZJH.SUBID.NN_SUB_C_AGAIN,
                request: FZJH.NN_CMD_C_Again,
                response: null,
                log: "",
                isprint: false
            },  
            [FZJH.SUBID.NN_SUB_S_AGAIN_RESULT]: {
                subId: FZJH.SUBID.NN_SUB_S_AGAIN_RESULT,
                request: null,
                response: FZJH.NN_CMD_S_AgainResult,
                log: "",
                isprint: false
            },
            [FZJH.SUBID.NN_SUB_C_MESSAGE]: {
                subId: FZJH.SUBID.NN_SUB_C_MESSAGE,
                request: FZJH.NN_CMD_C_Message,
                response: null,
                log: "",
                isprint: false
            },  
            [FZJH.SUBID.NN_SUB_S_MESSAGE_RESULT]: {
                subId: FZJH.SUBID.NN_SUB_S_MESSAGE_RESULT,
                request: null,
                response: FZJH.NN_CMD_S_MessageResult,
                log: "",
                isprint: false
            },
            [FZJH.SUBID.NN_SUB_C_SET_IP_LIMIT]: {
                subId: FZJH.SUBID.NN_SUB_C_SET_IP_LIMIT,
                request: FZJH.NN_CMD_C_IPLimitMessage,
                response: null,
                log: "",
                isprint: false
            },  
            [FZJH.SUBID.NN_SUB_S_SET_IP_LIMIT_RESULT]: {
                subId: FZJH.SUBID.NN_SUB_S_SET_IP_LIMIT_RESULT,
                request: null,
                response: FZJH.NN_CMD_S_IPLimitMessageResult,
                log: "",
                isprint: false
            },
            [FZJH.SUBID.NN_SUB_C_SET_SCORE_LIMIT]: {
                subId: FZJH.SUBID.NN_SUB_C_SET_SCORE_LIMIT,
                request: FZJH.NN_CMD_C_ScoreLimitMessage,
                response: null,
                log: "",
                isprint: false
            },  
            [FZJH.SUBID.NN_SUB_S_SET_SCORE_LIMIT_RESULT]: {
                subId: FZJH.SUBID.NN_SUB_S_SET_SCORE_LIMIT_RESULT,
                request: null,
                response: FZJH.NN_CMD_S_ScoreLimitMessageResult,
                log: "",
                isprint: false
            },
            [FZJH.SUBID.NN_SUB_C_SET_AUTO_START]: {
                subId: FZJH.SUBID.NN_SUB_C_SET_AUTO_START,
                request: FZJH.NN_CMD_C_AutoStartMessage,
                response: null,
                log: "",
                isprint: false
            },  
            [FZJH.SUBID.NN_SUB_S_SET_AUTO_START_RESULT]: {
                subId: FZJH.SUBID.NN_SUB_S_SET_AUTO_START_RESULT,
                request: null,
                response: FZJH.NN_CMD_S_AutoStartMessageResult,
                log: "",
                isprint: false
            },
            [FZJH.SUBID.NN_SUB_C_SET_PLAYER_NUM_LIMIT]: {
                subId: FZJH.SUBID.NN_SUB_C_SET_PLAYER_NUM_LIMIT,
                request: FZJH.NN_CMD_C_PlayerNumLimitMessage,
                response: null,
                log: "",
                isprint: false
            },  
            [FZJH.SUBID.NN_SUB_S_SET_PLAYER_NUM_LIMIT_RESULT]: {
                subId: FZJH.SUBID.NN_SUB_S_SET_PLAYER_NUM_LIMIT_RESULT,
                request: null,
                response: FZJH.NN_CMD_S_PlayerNumLimitMessageResult,
                log: "",
                isprint: false
            },
            [FZJH.SUBID.NN_SUB_C_GET_USER_SCORE]: {
                subId: FZJH.SUBID.NN_SUB_C_GET_USER_SCORE,
                request: FZJH.NN_CMD_C_GetUserScoreMessage,
                response: null,
                log: "",
                isprint: false
            },  
            [FZJH.SUBID.NN_SUB_S_GET_USER_SCORE_RESULT]: {
                subId: FZJH.SUBID.NN_SUB_S_GET_USER_SCORE_RESULT,
                request: null,
                response: FZJH.NN_CMD_S_GetUserScoreMessageResponse,
                log: "",
                isprint: false
            },
            [FZJH.SUBID.NN_SUB_S_IDLE_TIMEOUT_RESULT]: {
                subId: FZJH.SUBID.NN_SUB_S_IDLE_TIMEOUT_RESULT,
                request: null,
                response: FZJH.NN_CMD_S_IdleTimeoutResult,
                log: "",
                isprint: false
            },
            [FZJH.SUBID.NN_SUB_C_SET_CHAT_LIMIT]: {
                subId: FZJH.SUBID.NN_SUB_C_SET_CHAT_LIMIT,
                request: FZJH.NN_CMD_C_ChatLimitMessage,
                response: null,
                log: "",
                isprint: false
            },  
            [FZJH.SUBID.NN_SUB_C_SET_CHAT_LIMIT_RESULT]: {
                subId: FZJH.SUBID.NN_SUB_C_SET_CHAT_LIMIT_RESULT,
                request: null,
                response: FZJH.NN_CMD_S_ChatLimitMessageResult,
                log: "",
                isprint: false
            },
            [FZJH.SUBID.CS_GAMESCENE_FRESH]: {
                subId: FZJH.SUBID.CS_GAMESCENE_FRESH,
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
UMsgCenter.ins.addSerializer(EGameType.ZJH_HY, new CFZJHSerializer_hy());
