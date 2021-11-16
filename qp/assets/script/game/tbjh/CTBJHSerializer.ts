import { UGameSerializer } from "../UGameSerializer";
import { ProtoMapItem } from "../../common/cmd/UOpcode";
import { Game, Tbjh } from "../../common/cmd/proto";
import UMsgCenter from "../../common/net/UMsgCenter";
import { EGameType } from "../../common/base/UAllenum";



/**
 * 创建:dz
 * 作用:qznn包解析器
 */
export default class CTBJHSerializer extends UGameSerializer {
    /** */
    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC]: {
            [Tbjh.SUBID.SC_GAMESCENE_FREE]: {
                subId: Tbjh.SUBID.SC_GAMESCENE_FREE,
                request: null,
                response: Tbjh.NN_MSG_GS_FREE,
                log:"",
                isprint:false
            },
            // [Tbjh.SUBID.SC_GAMESCENE_CALL]: {
            //     subId: Tbjh.SUBID.SC_GAMESCENE_CALL,
            //     request: null,
            //     response: Tbjh.NN_MSG_GS_CALL,
            //     log:"",
            //     isprint:false
            // },
            [Tbjh.SUBID.SC_GAMESCENE_SCORE]: {
                subId: Tbjh.SUBID.SC_GAMESCENE_SCORE,
                request: null,
                response: Tbjh.NN_MSG_GS_SCORE,
                log:"",
                isprint:false
            },
            [Tbjh.SUBID.SC_GAMESCENE_OPEN]: {
                subId: Tbjh.SUBID.SC_GAMESCENE_OPEN,
                request: null,
                response: Tbjh.NN_MSG_GS_OPEN,
                log:"",
                isprint:false
            },
            [Tbjh.SUBID.NN_SUB_S_GAME_START]: {
                subId: Tbjh.SUBID.NN_SUB_S_GAME_START,
                request:  Tbjh.NN_CMD_S_GameStart,
                response: Tbjh.NN_CMD_S_GameStart,
                log:"",
                isprint:false
            },
            // [Tbjh.SUBID.NN_SUB_S_CALL_BANKER]: {
            //     subId: Tbjh.SUBID.NN_SUB_S_CALL_BANKER,
            //     request: null,
            //     response: Tbjh.NN_CMD_S_CallBanker,
            //     log:"",
            //     isprint:false
            // },
            // [Tbjh.SUBID.NN_SUB_S_CALL_BANKER_RESULT]: {
            //     subId: Tbjh.SUBID.NN_SUB_S_CALL_BANKER_RESULT,
            //     request: null,
            //     response: Tbjh.NN_CMD_S_CallBankerResult,
            //     log:"",
            //     isprint:false
            // },
            [Tbjh.SUBID.NN_SUB_S_ADD_SCORE_RESULT]: {
                subId: Tbjh.SUBID.NN_SUB_S_ADD_SCORE_RESULT,
                request: null,
                response: Tbjh.NN_CMD_S_AddScoreResult,
                log:"",
                isprint:false
            },
            [Tbjh.SUBID.NN_SUB_S_SEND_CARD]: {
                subId: Tbjh.SUBID.NN_SUB_S_SEND_CARD,
                request: null,
                response: Tbjh.NN_CMD_S_SendCard,
                log:"",
                isprint:false
            },
            [Tbjh.SUBID.NN_SUB_S_OPEN_CARD_RESULT]: {
                subId: Tbjh.SUBID.NN_SUB_S_OPEN_CARD_RESULT,
                request: null,
                response: Tbjh.NN_CMD_S_OpenCardResult,
                log:"",
                isprint:false
            },
            [Tbjh.SUBID.NN_SUB_S_GAME_END]: {
                subId: Tbjh.SUBID.NN_SUB_S_GAME_END,
                request: null,
                response: Tbjh.NN_CMD_S_GameEnd,
                log:"",
                isprint:false
            },
            [Tbjh.SUBID.NN_SUB_C_ADD_SCORE]: {
                subId: Tbjh.SUBID.NN_SUB_C_ADD_SCORE,
                request: Tbjh.NN_CMD_C_AddScore,
                response: null,
                log:"",
                isprint:false
            },
            [Tbjh.SUBID.NN_SUB_C_OPEN_CARD]: {
                subId: Tbjh.SUBID.NN_SUB_C_OPEN_CARD,
                request: null,
                response: null,
                log:"",
                isprint:false
            },

            [Tbjh.SUBID.NN_SUB_C_ROUND_END_EXIT]: {
                subId: Tbjh.SUBID.NN_SUB_C_ROUND_END_EXIT,
                request: Tbjh.NN_CMD_C_RoundEndExit,
                response: null,
                log:"",
                isprint:false
            },[Tbjh.SUBID.NN_SUB_C_ROUND_END_EXIT_RESULT]: {
                subId: Tbjh.SUBID.NN_SUB_C_ROUND_END_EXIT_RESULT,
                request: null,
                response: Tbjh.NN_CMD_C_RoundEndExitResult,
                log:"",
                isprint:false
            },

        }
    };
    protected getProtoMap(mainId: number, subId: number): ProtoMapItem {
        return this.protoMap[mainId][subId];
    }
}
UMsgCenter.ins.addSerializer(EGameType.TBJH, new CTBJHSerializer());
