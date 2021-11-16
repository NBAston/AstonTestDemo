import { ProtoMapItem } from "../../common/cmd/UOpcode";
import UMsgCenter from "../../common/net/UMsgCenter";
import { EGameType } from "../../common/base/UAllenum";
import { Game, SanGong } from "../../common/cmd/proto";
import { UGameSerializer } from "../UGameSerializer";

/**
 * 创建:dz
 * 作用:sg包解析器
 */
export default class CSGSerializer extends UGameSerializer {
    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC]: {
            [SanGong.SUBID.SC_GAMESCENE_FREE]: {
                subId: SanGong.SUBID.SC_GAMESCENE_FREE,
                request: null,
                response: SanGong.NN_MSG_GS_FREE,
                log: "",
                isprint: false
            },
            [SanGong.SUBID.SC_GAMESCENE_CALL]: {
                subId: SanGong.SUBID.SC_GAMESCENE_CALL,
                request: null,
                response: SanGong.NN_MSG_GS_CALL,
                log: "",
                isprint: false
            },
            [SanGong.SUBID.SC_GAMESCENE_SCORE]: {
                subId: SanGong.SUBID.SC_GAMESCENE_SCORE,
                request: null,
                response: SanGong.NN_MSG_GS_SCORE,
                log: "",
                isprint: false
            },
            [SanGong.SUBID.SC_GAMESCENE_OPEN]: {
                subId: SanGong.SUBID.SC_GAMESCENE_OPEN,
                request: null,
                response: SanGong.NN_MSG_GS_OPEN,
                log: "",
                isprint: false
            },
            [SanGong.SUBID.SC_GAMESCENE_END]: {
                subId: SanGong.SUBID.SC_GAMESCENE_END,
                request: null,
                response: SanGong.NN_MSG_GS_END,
                log: "",
                isprint: false
            },
            [SanGong.SUBID.NN_SUB_S_GAME_START]: {
                subId: SanGong.SUBID.NN_SUB_S_GAME_START,
                request: null,
                response: SanGong.NN_CMD_S_GameStart,
                log: "",
                isprint: false
            },
            [SanGong.SUBID.NN_SUB_S_CALL_BANKER]: {
                subId: SanGong.SUBID.NN_SUB_S_CALL_BANKER,
                request: null,
                response: SanGong.NN_CMD_S_CallBanker,
                log: "",
                isprint: false
            },
            [SanGong.SUBID.NN_SUB_S_CALL_BANKER_RESULT]: {
                subId: SanGong.SUBID.NN_SUB_S_CALL_BANKER_RESULT,
                request: null,
                response: SanGong.NN_CMD_S_CallBankerResult,
                log: "",
                isprint: false
            },
            [SanGong.SUBID.NN_SUB_S_ADD_SCORE_RESULT]: {
                subId: SanGong.SUBID.NN_SUB_S_ADD_SCORE_RESULT,
                request: null,
                response: SanGong.NN_CMD_S_AddScoreResult,
                log: "",
                isprint: false
            },
            [SanGong.SUBID.NN_SUB_S_SEND_CARD]: {
                subId: SanGong.SUBID.NN_SUB_S_SEND_CARD,
                request: null,
                response: SanGong.NN_CMD_S_SendCard,
                log: "",
                isprint: false
            },
            [SanGong.SUBID.NN_SUB_S_OPEN_CARD_RESULT]: {
                subId: SanGong.SUBID.NN_SUB_S_OPEN_CARD_RESULT,
                request: null,
                response: SanGong.NN_CMD_S_OpenCardResult,
                log: "",
                isprint: false
            },
            [SanGong.SUBID.NN_SUB_S_GAME_END]: {
                subId: SanGong.SUBID.NN_SUB_S_GAME_END,
                request: null,
                response: SanGong.NN_CMD_S_GameEnd,
                log: "",
                isprint: false
            },

            // [SanGong.SUBID.NN_SUB_S_OPERATE_FAIL]: {
            //     subId: SanGong.SUBID.NN_SUB_S_OPERATE_FAIL,
            //     request: null,
            //     response: SanGong.,
            //     log:"",
            //     isprint:false
            // },
            [SanGong.SUBID.NN_SUB_C_CALL_BANKER]: {
                subId: SanGong.SUBID.NN_SUB_C_CALL_BANKER,
                request: SanGong.NN_CMD_C_CallBanker,
                response: null,
                log: "",
                isprint: false
            },
            [SanGong.SUBID.NN_SUB_C_ADD_SCORE]: {
                subId: SanGong.SUBID.NN_SUB_C_ADD_SCORE,
                request: SanGong.NN_CMD_C_AddScore,
                response: null,
                log: "",
                isprint: false
            },
            [SanGong.SUBID.NN_SUB_C_OPEN_CARD]: {
                subId: SanGong.SUBID.NN_SUB_C_OPEN_CARD,
                request: null,
                response: null,
                log: "",
                isprint: false
            },
            [SanGong.SUBID.NN_SUB_C_ROUND_END_EXIT]: {
                subId: SanGong.SUBID.NN_SUB_C_ROUND_END_EXIT,
                request: SanGong.NN_CMD_C_RoundEndExit,
                response: null,
                log: "",
                isprint: false
            },
            [SanGong.SUBID.NN_SUB_C_ROUND_END_EXIT_RESULT]: {
                subId: SanGong.SUBID.NN_SUB_C_ROUND_END_EXIT_RESULT,
                request: null,
                response: SanGong.NN_CMD_C_RoundEndExitResult,
                log: "",
                isprint: false
            },
            [SanGong.SUBID.CS_GAMESCENE_FRESH]: {
                subId: SanGong.SUBID.CS_GAMESCENE_FRESH,
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
UMsgCenter.ins.addSerializer(EGameType.SG, new CSGSerializer());

