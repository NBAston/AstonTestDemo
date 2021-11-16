import { USerializer } from "../../common/net/USerializer";
import { ProtoMapItem } from "../../common/cmd/UOpcode";
import UMsgCenter from "../../common/net/UMsgCenter";
import { EGameType } from "../../common/base/UAllenum";
import { Game, ZJH } from "../../common/cmd/proto";
import { UGameSerializer } from "../UGameSerializer";

/**
 * 创建:sq
 * 作用:zjh包解析器
 */
export default class CZJHSerializer extends UGameSerializer {
    /** */
    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC]: {
            [ZJH.SUBID.SUB_C_ADD_SCORE]: {
                subId: ZJH.SUBID.SUB_C_ADD_SCORE,
                request: ZJH.CMD_C_AddScore,
                response: null,
                log: "",
                isprint: false

            },
            [ZJH.SUBID.SUB_S_ADD_SCORE]: {
                subId: ZJH.SUBID.SUB_C_ADD_SCORE,
                request: null,
                response: ZJH.CMD_S_AddScore,
                log: "",
                isprint: false

            },
            [ZJH.SUBID.SUB_C_GIVE_UP]: {
                subId: ZJH.SUBID.SUB_C_GIVE_UP,
                request: ZJH.CMD_C_NULL,
                response: null,
                log: "",
                isprint: false

            },
            [ZJH.SUBID.SUB_S_GIVE_UP]: {
                subId: ZJH.SUBID.SUB_S_GIVE_UP,
                request: null,
                response: ZJH.CMD_S_GiveUp,
                log: "",
                isprint: false

            },
            [ZJH.SUBID.SUB_C_COMPARE_CARD]: {
                subId: ZJH.SUBID.SUB_C_COMPARE_CARD,
                request: ZJH.CMD_C_CompareCard,
                response: null,
                log: "",
                isprint: false

            },
            [ZJH.SUBID.SUB_S_COMPARE_CARD]: {
                subId: ZJH.SUBID.SUB_S_COMPARE_CARD,
                request: ZJH.CMD_S_CompareCard,
                response: null,
                log: "",
                isprint: false

            },
            [ZJH.SUBID.SUB_C_LOOK_CARD]: {
                subId: ZJH.SUBID.SUB_C_LOOK_CARD,
                request: ZJH.CMD_C_NULL,
                response: null,
                log: "",
                isprint: false

            },
            [ZJH.SUBID.SUB_S_LOOK_CARD]: {
                subId: null,
                request: null,
                response: ZJH.CMD_S_LookCard,
                log: "",
                isprint: false

            },
            [ZJH.SUBID.SUB_S_COMPARE_CARD]: {
                subId: ZJH.SUBID.SUB_S_COMPARE_CARD,
                request: null,
                response: ZJH.CMD_S_CompareCard,
                log: "",
                isprint: false

            },

            [ZJH.SUBID.SUB_C_ALL_IN]: {
                subId: ZJH.SUBID.SUB_C_ALL_IN,
                request: ZJH.CMD_C_NULL,
                response: null,
                log: "",
                isprint: false

            },
            [ZJH.SUBID.SUB_S_ALL_IN]: {
                subId: ZJH.SUBID.SUB_S_ALL_IN,
                request: null,
                response: ZJH.CMD_S_AllIn,
                log: "",
                isprint: false

            },
            [ZJH.SUBID.SUB_SC_GAMESCENE_FREE]: {
                subId: ZJH.SUBID.SUB_SC_GAMESCENE_FREE,
                request: null,
                response: ZJH.CMD_S_StatusFree,
                log: "",
                isprint: false

            },
            [ZJH.SUBID.SUB_SC_GAMESCENE_PLAY]: {
                subId: ZJH.SUBID.SUB_SC_GAMESCENE_PLAY,
                request: null,
                response: ZJH.CMD_S_StatusPlay,
                log: "",
                isprint: false

            },
            [ZJH.SUBID.SUB_SC_GAMESCENE_END]: {
                subId: ZJH.SUBID.SUB_SC_GAMESCENE_END,
                request: null,
                response: ZJH.CMD_S_StatusEnd,
                log: "",
                isprint: false

            },
            [ZJH.SUBID.SUB_S_GAME_START]: {
                subId: ZJH.SUBID.SUB_S_GAME_START,
                request: null,
                response: ZJH.CMD_S_GameStart,
                log: "",
                isprint: false

            },
            [ZJH.SUBID.SUB_S_GAME_END]: {
                subId: ZJH.SUBID.SUB_S_GAME_END,
                request: null,
                response: ZJH.CMD_S_GameEnd,
                log: "",
                isprint: false
            },
            [ZJH.SUBID.SUB_S_GAME_END]: {
                subId: ZJH.SUBID.SUB_S_GAME_END,
                request: null,
                response: ZJH.CMD_S_GameEnd,
                log: "",
                isprint: false
            },
            [ZJH.SUBID.SUB_C_GIVEUP_TIMEOUT_OP]: {
                subId: ZJH.SUBID.SUB_C_GIVEUP_TIMEOUT_OP,
                request: ZJH.CMD_C_GIVEUP_TIMEOUT_OP,
                response: null,
                log: "",
                isprint: false
            },
            [ZJH.SUBID.SUB_S_GIVEUP_TIMEOUT_OP]: {
                subId: ZJH.SUBID.SUB_S_GIVEUP_TIMEOUT_OP,
                request: null,
                response: ZJH.CMD_S_GIVEUP_TIMEOUT_OP,
                log: "",
                isprint: false
            },

            [ZJH.SUBID.SUB_C_ROUND_END_EXIT]: {
                subId: ZJH.SUBID.SUB_C_ROUND_END_EXIT,
                request: ZJH.CMD_C_RoundEndExit,
                response: null,
                log: "",
                isprint: false
            },
            [ZJH.SUBID.SUB_C_ROUND_END_EXIT_RESULT]: {
                subId: ZJH.SUBID.SUB_C_ROUND_END_EXIT_RESULT,
                request: null,
                response: ZJH.CMD_C_RoundEndExitResult,
                log: "",
                isprint: false
            },
            [ZJH.SUBID.CS_GAMESCENE_FRESH]: {
                subId: ZJH.SUBID.CS_GAMESCENE_FRESH,
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
UMsgCenter.ins.addSerializer(EGameType.ZJH, new CZJHSerializer());
