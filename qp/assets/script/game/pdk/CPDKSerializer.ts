import { EGameType } from "../../common/base/UAllenum";
import { Game, Pdk } from "../../common/cmd/proto";
import { ProtoMapItem } from "../../common/cmd/UOpcode";
import UMsgCenter from "../../common/net/UMsgCenter";
import { UGameSerializer } from "../UGameSerializer";


/**
 * 作用:pdk包解析器
 */
export default class CPDKSerializer extends UGameSerializer {
    /** */
    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC]: {
            ///-------------------------------------------------场景消息
            //空闲状态
            [Pdk.SUBID.SC_GAMESCENE_FREE]: {
                subId: Pdk.SUBID.SC_GAMESCENE_FREE,
                request: null,
                response: Pdk.CMD_S_StatusFree,
                log: "",
                isprint: false
            },
        
            //游戏中场景消息
            [Pdk.SUBID.SC_GAMESCENE_PLAY]: {
                subId: Pdk.SUBID.SC_GAMESCENE_PLAY,
                request: null,
                response: Pdk.CMD_S_StatusPlay,
                log: "",
                isprint: false
            },
        
            //-------------------------------------------------游戏消息
            //游戏结束
            [Pdk.SUBID.SC_GAMESCENE_END]: {
                subId: Pdk.SUBID.SC_GAMESCENE_END,
                request: null,
                response: Pdk.CMD_S_StatusEND,
                log: "",
                isprint: false
            },

            //游戏开始 发牌
            [Pdk.SUBID.SUB_S_GAME_FAPAI]: {
                subId: Pdk.SUBID.SUB_S_GAME_FAPAI,
                request: null,
                response: Pdk.CMD_S_FaPai,
                log: "",
                isprint: false
            },
           
            //红桃三玩家的座位
            [Pdk.SUBID.SUB_S_OWNREDPEACH3CHAIR]: {
                subId: Pdk.SUBID.SUB_S_OWNREDPEACH3CHAIR,
                request: null,
                response: Pdk.CMD_S_OwnreDpeach3Chair,
                log: "",
                isprint: false
            },

            //请玩家出牌
            [Pdk.SUBID.SUB_S_CHUPAI]: {
                subId: Pdk.SUBID.SUB_S_CHUPAI,
                request: null,
                response: Pdk.CMD_S_ChuPai,
                log: "",
                isprint: false
            },

            //请玩家跟牌
            [Pdk.SUBID.SUB_S_FOLLOW]: {
                subId: Pdk.SUBID.SUB_S_FOLLOW,
                request: null,
                response: Pdk.CMD_S_Follow,
                log: "",
                isprint: false
            },

            // 玩家出牌
            [Pdk.SUBID.SUB_C_CHUPAI]: {
                subId: Pdk.SUBID.SUB_C_CHUPAI,
                request: Pdk.CMD_C_ChuPai,
                response: null,
                log: "",
                isprint: false
            },

            //通知玩家出牌信息
            [Pdk.SUBID.SUB_S_NOTIFY_CHUPAI_INFO]: {
                subId: Pdk.SUBID.SUB_S_NOTIFY_CHUPAI_INFO,
                request: null,
                response: Pdk.CMD_S_NotifyChuPaiInfo,
                log: "",
                isprint: false
            },

            // 过 不出牌
            [Pdk.SUBID.SUB_C_PASS]: {
                subId: Pdk.SUBID.SUB_C_PASS,
                request: null,
                response: null,
                log: "",
                isprint: false
            },

             //通知玩家过牌信息
            [Pdk.SUBID.SUB_S_NOTIFY_PASS_INFO]: {
                subId: Pdk.SUBID.SUB_S_NOTIFY_PASS_INFO,
                request: null,
                response: Pdk.CMD_S_NotifyPassInfo,
                log: "",
                isprint: false
            },

             //通知游戏结果
            [Pdk.SUBID.SUB_S_NOTIFY_GAME_RESULT]: {
                subId: Pdk.SUBID.SUB_S_NOTIFY_GAME_RESULT,
                request: null,
                response: Pdk.CMD_S_NotifyGameResult,
                log: "",
                isprint: false
            },

             //玩家上报托管
            [Pdk.SUBID.SUB_C_TUOGUAN]: {
                subId: Pdk.SUBID.SUB_C_TUOGUAN,
                request: Pdk.CMD_C_TuoGuan,
                response: null,
                log: "",
                isprint: false
            },

             //通知玩家托管信息
            [Pdk.SUBID.SUB_S_NOTIFY_TUOGUAN]: {
                subId: Pdk.SUBID.SUB_S_NOTIFY_TUOGUAN,
                request: null,
                response: Pdk.CMD_S_NotifyTuoGuan,
                log: "",
                isprint: false
            },

             //通知玩家分数变化
            [Pdk.SUBID.SUB_S_NOTIFY_SCORECHANGE]: {
                subId: Pdk.SUBID.SUB_S_NOTIFY_SCORECHANGE,
                request: null,
                response: Pdk.CMD_S_NotifyScoreChange,
                log: "",
                isprint: false
            },

            // 通知消息
            [Pdk.SUBID.SUB_S_NOTIFY_MESSAGE]: {
                subId: Pdk.SUBID.SUB_S_NOTIFY_MESSAGE,
                request: null,
                response: Pdk.CMD_S_NotifyMessage,
                log: "",
                isprint: false
            },

            // 发送聊天消息	
            [Pdk.SUBID.SUB_C_CHART_MESSAGE]: {
                subId: Pdk.SUBID.SUB_C_CHART_MESSAGE,
                request: Pdk.CMD_C_ChartMessage,
                response: null,
                log: "",
                isprint: false
            },
            
            // 通知聊天消息
            [Pdk.SUBID.SUB_S_NOTIFY_CHART_MESSAGE]: {
                subId: Pdk.SUBID.SUB_S_NOTIFY_CHART_MESSAGE,
                request: null,
                response: Pdk.CMD_S_NotifyChartMessage,
                log: "",
                isprint: false
            },




           
        }
    };
    protected getProtoMap(mainId: number, subId: number): ProtoMapItem {
        return this.protoMap[mainId][subId];
    }
}
UMsgCenter.ins.addSerializer(EGameType.PDK, new CPDKSerializer());
