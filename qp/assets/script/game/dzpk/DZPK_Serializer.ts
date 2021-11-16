import { UGameSerializer } from "../UGameSerializer";
import { ProtoMapItem } from "../../common/cmd/UOpcode";
import { Game, texas } from "../../common/cmd/proto";
import UMsgCenter from "../../common/net/UMsgCenter";
import { EGameType } from "../../common/base/UAllenum";

/**
 * 解析器
 * request发
 * response收
 */
export default class DZPK_Serializer extends UGameSerializer {
    /** */
    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC]: {
            [texas.SUBID.SUB_C_ADD_SCORE]: {//用户跟注/加注
                subId: texas.SUBID.SUB_C_ADD_SCORE,
                request: texas.CMD_C_AddScore,
                response: null,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_C_GIVE_UP]: {//用户弃牌
                subId: texas.SUBID.SUB_C_GIVE_UP,
                request: texas.CMD_C_NULL,
                response: null,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_C_PASS_SCORE]: {//用户过牌
                subId: texas.SUBID.SUB_C_PASS_SCORE,
                request: texas.CMD_C_NULL,
                response: null,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_C_LOOK_CARD]: {//用户看牌
                subId: texas.SUBID.SUB_C_LOOK_CARD,
                request: texas.CMD_C_NULL,
                response: null,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_C_ALL_IN]: {//孤注一掷 梭哈
                subId: texas.SUBID.SUB_C_ALL_IN,
                request: texas.CMD_C_NULL,
                response: null,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_C_ROUND_END_EXIT]: {//本局结束后退出
                subId: texas.SUBID.SUB_C_ROUND_END_EXIT,
                request: texas.CMD_C_RoundEndExit,
                response: null,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_SC_GAMESCENE_FREE]: {//空闲场景消息
                subId: texas.SUBID.SUB_SC_GAMESCENE_FREE,
                request: null,
                response: texas.CMD_S_StatusFree,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_SC_GAMESCENE_PLAY]: {//游戏中场景消息
                subId: texas.SUBID.SUB_SC_GAMESCENE_PLAY,
                request: null,
                response: texas.CMD_S_StatusPlay,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_SC_GAMESCENE_END]: {//游戏结束场景
                subId: texas.SUBID.SUB_SC_GAMESCENE_END,
                request: null,
                response: texas.CMD_S_StatusEnd,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_S_GAME_START]: {//游戏开始
                subId: texas.SUBID.SUB_S_GAME_START,
                request: null,
                response: texas.CMD_S_GameStart,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_S_ADD_SCORE]: {//用户跟注/加注
                subId: texas.SUBID.SUB_S_ADD_SCORE,
                request: null,
                response: texas.CMD_S_AddScore,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_S_GIVE_UP]: {//用户弃牌
                subId: texas.SUBID.SUB_S_GIVE_UP,
                request: null,
                response: texas.CMD_S_GiveUp,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_S_PASS_SCORE]: {//用户过牌
                subId: texas.SUBID.SUB_S_PASS_SCORE,
                request: null,
                response: texas.CMD_S_PassScore,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_S_LOOK_CARD]: {//用户看牌
                subId: texas.SUBID.SUB_S_LOOK_CARD,
                request: null,
                response: texas.CMD_S_LookCard,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_S_ALL_IN]: {//孤注一掷 梭哈
                subId: texas.SUBID.SUB_S_ALL_IN,
                request: null,
                response: texas.CMD_S_AllIn,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_S_GAME_END]: {//游戏结束
                subId: texas.SUBID.SUB_S_GAME_END,
                request: null,
                response: texas.CMD_S_GameEnd,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_S_SEND_CARD]: {//发牌
                subId: texas.SUBID.SUB_S_SEND_CARD,
                request: null,
                response: texas.CMD_S_SendCard,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_S_ANDROID_CARD]: {//机器人消息
                subId: texas.SUBID.SUB_S_ANDROID_CARD,
                request: null,
                response: texas.CMD_S_AndroidCard,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_S_OPERATE_NOTIFY]: {//操作失败通知
                subId: texas.SUBID.SUB_S_OPERATE_NOTIFY,
                request: null,
                response: texas.CMD_S_Operate_Notify,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_S_ROUND_END_EXIT_RESULT]: {//本局结束后退出
                subId: texas.SUBID.SUB_S_ROUND_END_EXIT_RESULT,
                request: null,
                response: texas.CMD_S_RoundEndExitResult,
                log: "",
                isprint: false
            },
            [texas.SUBID.NN_SUB_C_MESSAGE]: {//发送消息
                subId: texas.SUBID.NN_SUB_C_MESSAGE,
                request: texas.NN_CMD_C_Message,
                response: null,
                log: "",
                isprint: false
            },
            [texas.SUBID.NN_SUB_S_MESSAGE_RESULT]: {//聊天消息接收
                subId: texas.SUBID.NN_SUB_S_MESSAGE_RESULT,
                request: null,
                response: texas.NN_CMD_S_MessageResult,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_C_SHOW_CARD]: {//亮牌
                subId: texas.SUBID.SUB_C_SHOW_CARD,
                request: texas.CMD_C_ShowCardSwitch,
                response: null,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_S_SHOW_CARD]: {//亮牌消息接收
                subId: texas.SUBID.SUB_S_SHOW_CARD,
                request: null,
                response: texas.CMD_S_ShowCardSwitch,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_C_TAKESCORE]: {//设置携带
                subId: texas.SUBID.SUB_C_TAKESCORE,
                request: texas.CMD_C_TakeScore,
                response: null,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_S_TAKESCORE]: {//设置携带返回
                subId: texas.SUBID.SUB_S_TAKESCORE,
                request: null,
                response: texas.CMD_S_TakeScore,
                log: "",
                isprint: false
            },
            [texas.SUBID.SUB_S_BROADCASTTAKESCORE]: {//广播携带分
                subId: texas.SUBID.SUB_S_BROADCASTTAKESCORE,
                request: null,
                response: texas.CMD_S_BroadcastTakeScore,
                log: "",
                isprint: false
            },
            [texas.SUBID.CS_GAMESCENE_FRESH]:{// 请求刷新场景
                subId: texas.SUBID.CS_GAMESCENE_FRESH,
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
UMsgCenter.ins.addSerializer(EGameType.DZPK, new DZPK_Serializer());
