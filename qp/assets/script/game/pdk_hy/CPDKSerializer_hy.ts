import { EGameType } from "../../common/base/UAllenum";
import { FPdk, Game } from "../../common/cmd/proto";
import { ProtoMapItem } from "../../common/cmd/UOpcode";
import UMsgCenter from "../../common/net/UMsgCenter";
import { UGameSerializer } from "../UGameSerializer";


/**
 * 作用:FPdk包解析器
 */
export default class CFPdkSerializer_hy extends UGameSerializer {
    /** */
    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND]: {
            ///-------------------------------------------------场景消息
            //空闲状态
            [FPdk.SUBID.SC_GAMESCENE_FREE]: {
                subId: FPdk.SUBID.SC_GAMESCENE_FREE,
                request: null,
                response: FPdk.CMD_S_StatusFree,
                log: "",
                isprint: false
            },
        
            //游戏中场景消息
            [FPdk.SUBID.SC_GAMESCENE_PLAY]: {
                subId: FPdk.SUBID.SC_GAMESCENE_PLAY,
                request: null,
                response: FPdk.CMD_S_StatusPlay,
                log: "",
                isprint: false
            },
        
            //-------------------------------------------------游戏消息

            //通知客户端配置
            [FPdk.SUBID.SUB_S_NOTIFY_CLIENT_CFG]: {
                subId: FPdk.SUBID.SUB_S_NOTIFY_CLIENT_CFG,
                request: null,
                response: FPdk.CMD_S_NotifyClientCfg,
                log: "",
                isprint: false
            },

            // 游戏开始
            [FPdk.SUBID.SUB_S_GAME_START]: {
                subId: FPdk.SUBID.SUB_S_GAME_START,
                request: null,
                response: FPdk.CMD_S_GameStart,
                log: "",
                isprint: false
            },

            //游戏结束
            [FPdk.SUBID.SC_GAMESCENE_END]: {
                subId: FPdk.SUBID.SC_GAMESCENE_END,
                request: null,
                response: FPdk.CMD_S_StatusEND,
                log: "",
                isprint: false
            },

            //游戏 发牌
            [FPdk.SUBID.SUB_S_GAME_FAPAI]: {
                subId: FPdk.SUBID.SUB_S_GAME_FAPAI,
                request: null,
                response: FPdk.CMD_S_FaPai,
                log: "",
                isprint: false
            },
           
            //通知谁拥有特殊牌
            [FPdk.SUBID.SUB_S_NOTIFY_SPECIALCARD]: {
                subId: FPdk.SUBID.SUB_S_NOTIFY_SPECIALCARD,
                request: null,
                response: FPdk.CMD_S_NotifySpecialCard,
                log: "",
                isprint: false
            },

            //请玩家出牌
            [FPdk.SUBID.SUB_S_CHUPAI]: {
                subId: FPdk.SUBID.SUB_S_CHUPAI,
                request: null,
                response: FPdk.CMD_S_ChuPai,
                log: "",
                isprint: false
            },

            //请玩家跟牌
            [FPdk.SUBID.SUB_S_FOLLOW]: {
                subId: FPdk.SUBID.SUB_S_FOLLOW,
                request: null,
                response: FPdk.CMD_S_Follow,
                log: "",
                isprint: false
            },

            // 玩家出牌
            [FPdk.SUBID.SUB_C_CHUPAI]: {
                subId: FPdk.SUBID.SUB_C_CHUPAI,
                request: FPdk.CMD_C_ChuPai,
                response: null,
                log: "",
                isprint: false
            },

            //通知玩家出牌信息
            [FPdk.SUBID.SUB_S_NOTIFY_CHUPAI_INFO]: {
                subId: FPdk.SUBID.SUB_S_NOTIFY_CHUPAI_INFO,
                request: null,
                response: FPdk.CMD_S_NotifyChuPaiInfo,
                log: "",
                isprint: false
            },

            // 过 不出牌
            [FPdk.SUBID.SUB_C_PASS]: {
                subId: FPdk.SUBID.SUB_C_PASS,
                request: null,
                response: null,
                log: "",
                isprint: false
            },

             //通知玩家过牌信息
            [FPdk.SUBID.SUB_S_NOTIFY_PASS_INFO]: {
                subId: FPdk.SUBID.SUB_S_NOTIFY_PASS_INFO,
                request: null,
                response: FPdk.CMD_S_NotifyPassInfo,
                log: "",
                isprint: false
            },

             //通知游戏结果
            [FPdk.SUBID.SUB_S_NOTIFY_GAME_RESULT]: {
                subId: FPdk.SUBID.SUB_S_NOTIFY_GAME_RESULT,
                request: null,
                response: FPdk.CMD_S_NotifyGameResult,
                log: "",
                isprint: false
            },

             //玩家上报托管
            [FPdk.SUBID.SUB_C_TUOGUAN]: {
                subId: FPdk.SUBID.SUB_C_TUOGUAN,
                request: FPdk.CMD_C_TuoGuan,
                response: null,
                log: "",
                isprint: false
            },

             //通知玩家托管信息
            [FPdk.SUBID.SUB_S_NOTIFY_TUOGUAN]: {
                subId: FPdk.SUBID.SUB_S_NOTIFY_TUOGUAN,
                request: null,
                response: FPdk.CMD_S_NotifyTuoGuan,
                log: "",
                isprint: false
            },

             //通知玩家分数变化
            [FPdk.SUBID.SUB_S_NOTIFY_SCORECHANGE]: {
                subId: FPdk.SUBID.SUB_S_NOTIFY_SCORECHANGE,
                request: null,
                response: FPdk.CMD_S_NotifyScoreChange,
                log: "",
                isprint: false
            },

            // 通知消息
            [FPdk.SUBID.SUB_S_NOTIFY_MESSAGE]: {
                subId: FPdk.SUBID.SUB_S_NOTIFY_MESSAGE,
                request: null,
                response: FPdk.CMD_S_NotifyMessage,
                log: "",
                isprint: false
            },

            // 发送聊天消息	
            [FPdk.SUBID.SUB_C_MESSAGE]: {
                subId: FPdk.SUBID.SUB_C_MESSAGE,
                request: FPdk.CMD_C_Message,
                response: null,
                log: "",
                isprint: false
            },
            
            // 通知聊天消息
            [FPdk.SUBID.SUB_S_MESSAGE_RESULT]: {
                subId: FPdk.SUBID.SUB_S_MESSAGE_RESULT,
                request: null,
                response: FPdk.CMD_S_MessageResult,
                log: "",
                isprint: false
            },

            // 通知玩家信息消息
            [FPdk.SUBID.SUB_S_NOTIFY_USER_INFO]: {
                subId: FPdk.SUBID.SUB_S_NOTIFY_USER_INFO,
                request: null,
                response: FPdk.CMD_S_NotifyUserInfo,
                log: "",
                isprint: false
            },

            // // 解散房间消息请求
            // [FPdk.SUBID.SUB_C_DISSMIS]: {
            //     subId: FPdk.SUBID.SUB_C_DISSMIS,
            //     request: FPdk.CMD_C_Dissmis,
            //     response: null,
            //     log: "",
            //     isprint: false
            // },

            // 预解散房间消息返回
            [FPdk.SUBID.SUB_S_PRE_DISSMIS_RESULT]: {
                subId: FPdk.SUBID.SUB_S_PRE_DISSMIS_RESULT,
                request: null,
                response: FPdk.CMD_S_PreDissmisResult,
                log: "",
                isprint: false
            },
            // 解散房间消息返回
            [FPdk.SUBID.SUB_S_DISSMIS_RESULT]: {
                subId: FPdk.SUBID.SUB_S_DISSMIS_RESULT,
                request: null,
                response: FPdk.CMD_S_DissmisResult,
                log: "",
                isprint: false
            },


            // 准备SUB_C_READY
            [FPdk.SUBID.SUB_C_READY]: {
                subId: FPdk.SUBID.SUB_C_READY,
                request: FPdk.CMD_C_Ready,
                response: null,
                log: "",
                isprint: false
            },
        
            // 准备返回
            [FPdk.SUBID.SUB_S_READY_RESULT]: {
                subId: FPdk.SUBID.SUB_S_READY_RESULT,
                request: null,
                response: FPdk.CMD_S_ReadyResult,
                log: "",
                isprint: false
            },

            // 旁观
            [FPdk.SUBID.SUB_C_LOOKON]: {
                subId: FPdk.SUBID.SUB_C_LOOKON,
                request: FPdk.CMD_C_Lookon,
                response: null,
                log: "",
                isprint: false
            },

            // 旁观返回
            [FPdk.SUBID.SUB_S_LOOKON_RESULT]: {
                subId: FPdk.SUBID.SUB_S_LOOKON_RESULT,
                request: null,
                response: FPdk.CMD_S_LookonResult,
                log: "",
                isprint: false
            },

            // 提前结算消息
            [FPdk.SUBID.SUB_C_CONCLUDE]: {
                subId: FPdk.SUBID.SUB_C_CONCLUDE,
                request: FPdk.CMD_C_Conclude,
                response: null,
                log: "",
                isprint: false
            },

            // 提前结算消息返回
            [FPdk.SUBID.SUB_S_CONCLUDE_RESULT]: {
                subId: FPdk.SUBID.SUB_S_CONCLUDE_RESULT,
                request: null,
                response: FPdk.CMD_S_ConcludeResult,
                log: "",
                isprint: false
            },

            // 一局结束之后，玩家状态切换
            [FPdk.SUBID.SUB_S_CHANGE_USER_STATUS]: {
                subId: FPdk.SUBID.SUB_S_CHANGE_USER_STATUS,
                request: null,
                response: FPdk.CMD_S_EndChangeUserStatus,
                log: "",
                isprint: false
            },

            // 获取实时战绩
            [FPdk.SUBID.SUB_C_GET_GAME_REOCRD]: {
                subId: FPdk.SUBID.SUB_C_GET_GAME_REOCRD,
                request: FPdk.CMD_C_GetGameRecord,
                response: null,
                log: "",
                isprint: false
            },

            // 获取实时战绩 返回
            [FPdk.SUBID.SUB_S_GET_GAME_REOCRD]: {
                subId: FPdk.SUBID.SUB_S_GET_GAME_REOCRD,
                request: null,
                response: FPdk.CMD_S_GetGameRecord,
                log: "",
                isprint: false
            },

            // 再来一轮
            [FPdk.SUBID.SUB_C_AGAIN]: {
                subId: FPdk.SUBID.SUB_C_AGAIN,
                request: FPdk.CMD_C_Again,
                response: null,
                log: "",
                isprint: false
            },
            // 再来一轮返回
            [FPdk.SUBID.SUB_S_AGAIN_RESULT]: {
                subId: FPdk.SUBID.SUB_S_AGAIN_RESULT,
                request: null,
                response: FPdk.CMD_S_AgainResult,
                log: "",
                isprint: false
            },
            
            // 15分钟超时消息
            [FPdk.SUBID.SUB_S_IDLE_TIMEOUT_RESULT]: {
                subId: FPdk.SUBID.SUB_S_IDLE_TIMEOUT_RESULT,
                request: null,
                response: FPdk.CMD_S_IdleTimeoutResult,
                log: "",
                isprint: false
            },
            // 设置同桌IP限制
            [FPdk.SUBID.SUB_C_SET_IP_LIMIT]: {
                subId: FPdk.SUBID.SUB_C_SET_IP_LIMIT,
                request: FPdk.CMD_C_IPLimitMessage,
                response: null,
                log: "",
                isprint: false
            },
            // 设置同桌IP限制返回
            [FPdk.SUBID.SUB_S_SET_IP_LIMIT_RESULT]: {
                subId: FPdk.SUBID.SUB_S_SET_IP_LIMIT_RESULT,
                request: null,
                response: FPdk.CMD_S_IPLimitMessageResult,
                log: "",
                isprint: false
            },



            // 设置聊天限制 
            [FPdk.SUBID.SUB_C_SET_CHAT_LIMIT]: {
                subId: FPdk.SUBID.SUB_C_SET_CHAT_LIMIT,
                request: FPdk.CMD_C_ChatLimitMessage,
                response: null,
                log: "",
                isprint: false
            },

            // 设置聊天限制 返回
            [FPdk.SUBID.SUB_S_SET_CHAT_LIMIT_RESULT]: {
                subId: FPdk.SUBID.SUB_S_SET_CHAT_LIMIT_RESULT,
                request: null,
                response: FPdk.CMD_S_ChatLimitMessageResult,
                log: "",
                isprint: false
            },

            // 设置自动开局
            [FPdk.SUBID.SUB_C_SET_AUTO_START]: {
                subId: FPdk.SUBID.SUB_C_SET_AUTO_START,
                request: FPdk.CMD_C_AutoStartMessage,
                response: null,
                log: "",
                isprint: false
            },

            // 设置自动开局返回
            [FPdk.SUBID.SUB_S_SET_AUTO_START_RESULT]: {
                subId: FPdk.SUBID.SUB_S_SET_AUTO_START_RESULT,
                request: null,
                response: FPdk.CMD_S_AutoStartMessageResult,
                log: "",
                isprint: false
            },

        }
    };
    protected getProtoMap(mainId: number, subId: number): ProtoMapItem {
        return this.protoMap[mainId][subId];
    }
}
UMsgCenter.ins.addSerializer(EGameType.PDK_HY, new CFPdkSerializer_hy());
