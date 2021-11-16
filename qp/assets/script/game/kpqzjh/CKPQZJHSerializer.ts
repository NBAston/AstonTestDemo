import { UGameSerializer } from "../UGameSerializer";
import { ProtoMapItem } from "../../common/cmd/UOpcode";
import { Game, KPQzjh } from "../../common/cmd/proto";
import UMsgCenter from "../../common/net/UMsgCenter";
import { EGameType } from "../../common/base/UAllenum";


/**
 * 创建:dz
 * 作用:qznn包解析器
 */
export default class CKPQZJHSerializer extends UGameSerializer {
    /** */
    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC]: {
            [KPQzjh.SUBID.SC_GAMESCENE_FREE]: {
                subId: KPQzjh.SUBID.SC_GAMESCENE_FREE,
                request: null,
                response: KPQzjh.NN_MSG_GS_FREE,
                log:"",
                isprint:false
            },
            [KPQzjh.SUBID.SC_GAMESCENE_CALL]: {
                subId: KPQzjh.SUBID.SC_GAMESCENE_CALL,
                request: null,
                response: KPQzjh.NN_MSG_GS_CALL,
                log:"",
                isprint:false
            },
            [KPQzjh.SUBID.SC_GAMESCENE_SCORE]: {
                subId: KPQzjh.SUBID.SC_GAMESCENE_SCORE,
                request: null,
                response: KPQzjh.NN_MSG_GS_SCORE,
                log:"",
                isprint:false
            },
            [KPQzjh.SUBID.SC_GAMESCENE_OPEN]: {
                subId: KPQzjh.SUBID.SC_GAMESCENE_OPEN,
                request: null,
                response: KPQzjh.NN_MSG_GS_OPEN,
                log:"",
                isprint:false
            },
            [KPQzjh.SUBID.NN_SUB_S_GAME_START]: {
                subId: KPQzjh.SUBID.NN_SUB_S_GAME_START,
                request:  KPQzjh.NN_CMD_S_GameStart,
                response: KPQzjh.NN_CMD_S_GameStart,
                log:"",
                isprint:false
            },
            [KPQzjh.SUBID.NN_SUB_S_CALL_BANKER]: {
                subId: KPQzjh.SUBID.NN_SUB_S_CALL_BANKER,
                request: null,
                response: KPQzjh.NN_CMD_S_CallBanker,
                log:"",
                isprint:false
            },
            [KPQzjh.SUBID.NN_SUB_S_CALL_BANKER_RESULT]: {
                subId: KPQzjh.SUBID.NN_SUB_S_CALL_BANKER_RESULT,
                request: null,
                response: KPQzjh.NN_CMD_S_CallBankerResult,
                log:"",
                isprint:false
            },
            [KPQzjh.SUBID.NN_SUB_S_ADD_SCORE_RESULT]: {
                subId: KPQzjh.SUBID.NN_SUB_S_ADD_SCORE_RESULT,
                request: null,
                response: KPQzjh.NN_CMD_S_AddScoreResult,
                log:"",
                isprint:false
            },
            [KPQzjh.SUBID.NN_SUB_S_SEND_CARD]: {
                subId: KPQzjh.SUBID.NN_SUB_S_SEND_CARD,
                request: null,
                response: KPQzjh.NN_CMD_S_SendCard,
                log:"",
                isprint:false
            },
            [KPQzjh.SUBID.NN_SUB_S_OPEN_CARD_RESULT]: {
                subId: KPQzjh.SUBID.NN_SUB_S_OPEN_CARD_RESULT,
                request: null,
                response: KPQzjh.NN_CMD_S_OpenCardResult,
                log:"",
                isprint:false
            },
            [KPQzjh.SUBID.NN_SUB_S_GAME_END]: {
                subId: KPQzjh.SUBID.NN_SUB_S_GAME_END,
                request: null,
                response: KPQzjh.NN_CMD_S_GameEnd,
                log:"",
                isprint:false
            },
            [KPQzjh.SUBID.NN_SUB_C_CALL_BANKER]: {
                subId: KPQzjh.SUBID.NN_SUB_C_CALL_BANKER,
                request: KPQzjh.NN_CMD_C_CallBanker,
                response: null,
                log:"",
                isprint:false
            },
            [KPQzjh.SUBID.NN_SUB_C_ADD_SCORE]: {
                subId: KPQzjh.SUBID.NN_SUB_C_ADD_SCORE,
                request: KPQzjh.NN_CMD_C_AddScore,
                response: null,
                log:"",
                isprint:false
            },
            [KPQzjh.SUBID.NN_SUB_C_OPEN_CARD]: {
                subId: KPQzjh.SUBID.NN_SUB_C_OPEN_CARD,
                request: null,
                response: null,
                log:"",
                isprint:false
            },
            [KPQzjh.SUBID.NN_SUB_C_ROUND_END_EXIT]: {
                subId: KPQzjh.SUBID.NN_SUB_C_ROUND_END_EXIT,
                request: KPQzjh.NN_CMD_C_RoundEndExit,
                response: null,
                log:"",
                isprint:false
            },
            [KPQzjh.SUBID.NN_SUB_C_ROUND_END_EXIT_RESULT]: {
                subId: KPQzjh.SUBID.NN_SUB_C_ROUND_END_EXIT_RESULT,
                request: null,
                response: KPQzjh.NN_CMD_C_RoundEndExitResult,
                log:"",
                isprint:false
            },
        }
    };
    protected getProtoMap(mainId: number, subId: number): ProtoMapItem {
        return this.protoMap[mainId][subId];
    }
}
UMsgCenter.ins.addSerializer(EGameType.KPQZJH, new CKPQZJHSerializer());
