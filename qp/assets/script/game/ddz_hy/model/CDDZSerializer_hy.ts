import { EGameType } from "../../../common/base/UAllenum";
import { FDdz, Game } from "../../../common/cmd/proto";
import { ProtoMapItem } from "../../../common/cmd/UOpcode";
import UMsgCenter from "../../../common/net/UMsgCenter";
import { UGameSerializer } from "../../UGameSerializer";

/**
 * 作用:zdd包解析器
 */
export default class CDdzSerializer_hy extends UGameSerializer {
    /** */
    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND]: {
            /*****************************************************    接受   ********************************************************/
            //---------------------------------------场景消息
            //叫地主状态
            [FDdz.SUBID.SC_GAMESCENE_JDZ]: {
                subId: FDdz.SUBID.SC_GAMESCENE_JDZ,
                request: null,
                response: FDdz.CMD_S_StatusJdz,
                log: "",
                isprint: false
            },
            [FDdz.SUBID.SC_GAMESCENE_FREE]: {
                subId: FDdz.SUBID.SC_GAMESCENE_FREE,
                request: null,
                response: FDdz.CMD_S_StatusFree,
                log: "",
                isprint: false
            },
            //加倍状态
            [FDdz.SUBID.SC_GAMESCENE_DOUBLE]: {
                subId: FDdz.SUBID.SC_GAMESCENE_DOUBLE,
                request: null,
                response: FDdz.CMD_S_StatusDouble,
                log: "",
                isprint: false
            },
            //游戏状态
            [FDdz.SUBID.SC_GAMESCENE_PLAY]: {
                subId: FDdz.SUBID.SC_GAMESCENE_PLAY,
                request: null,
                response: FDdz.CMD_S_StatusPlay,
                log: "",
                isprint: false
            },
            //---------------------------------------游戏消息
            //通知客户端配置
            [FDdz.SUBID.SUB_S_NOTIFY_CLIENT_CFG]: {
                subId: FDdz.SUBID.SUB_S_NOTIFY_CLIENT_CFG,
                request: null,
                response: FDdz.CMD_S_NotifyClientCfg,
                log: "",
                isprint: false
            },
            //游戏发牌
            [FDdz.SUBID.SUB_S_SHUFFLE_CARDS]: {
                subId: FDdz.SUBID.SUB_S_SHUFFLE_CARDS,
                request: null,
                response: FDdz.CMD_S_ShuffleCards,
                log: "",
                isprint: false
            },
            //游戏开始
            [FDdz.SUBID.SUB_S_GAME_START]: {
                subId: FDdz.SUBID.SUB_S_GAME_START,
                request: null,
                response: FDdz.CMD_S_GameStart,
                log: "",
                isprint: false
            },
            //游戏开始，发牌
            [FDdz.SUBID.SUB_S_GAME_FAPAI]: {
                subId: FDdz.SUBID.SUB_S_GAME_FAPAI,
                request: null,
                response: FDdz.CMD_S_FaPai,
                log: "",
                isprint: false
            },
            //游戏倍数
            [FDdz.SUBID.SUB_S_NOTIFY_BEILV]: {
                subId: FDdz.SUBID.SUB_S_NOTIFY_BEILV,
                request: null,
                response: FDdz.CMD_S_NotifyBeiLv,
                log: "",
                isprint: false
            },
            //叫分通知
            [FDdz.SUBID.SUB_S_CALL_SCORE]: {
                subId: FDdz.SUBID.SUB_S_CALL_SCORE,
                request: null,
                response: FDdz.CMD_S_CallScore,
                log: "",
                isprint: false
            },
             //叫分结果
            [FDdz.SUBID.SUB_S_CALL_SCOR_RESULT]: {
                subId: FDdz.SUBID.SUB_S_CALL_SCOR_RESULT,
                request: null,
                response: FDdz.CMD_S_CallScoreResult,
                log: "",
                isprint: false
            },
            //叫抢地主通知
            [FDdz.SUBID.SUB_S_CALL_FIGHT]: {
                subId: FDdz.SUBID.SUB_S_CALL_FIGHT,
                request: null,
                response: FDdz.CMD_S_CallFight,
                log: "",
                isprint: false
            },
            //叫抢地主结果
             [FDdz.SUBID.SUB_S_CALL_FIGHT_RESULT]: {
                subId: FDdz.SUBID.SUB_S_CALL_FIGHT_RESULT,
                request: null,
                response: FDdz.CMD_S_CallFightResult,
                log: "",
                isprint: false
            },
            //地主信息
            [FDdz.SUBID.SUB_S_DZ_INFO]: {
                subId: FDdz.SUBID.SUB_S_DZ_INFO,
                request: null,
                response: FDdz.CMD_S_DzInfo,
                log: "",
                isprint: false
            },
            //加倍通知
            [FDdz.SUBID.SUB_S_JIABEI]: {
                subId: FDdz.SUBID.SUB_S_JIABEI,
                request: null,
                response: FDdz.CMD_S_JiaBei,
                log: "",
                isprint: false
            },
            //加倍结果
            [FDdz.SUBID.SUB_S_JIABEI_RESULT]: {
                subId: FDdz.SUBID.SUB_S_JIABEI_RESULT,
                request: null,
                response: FDdz.CMD_S_JiaBeiResult,
                log: "",
                isprint: false
            },
            //出牌通知
            [FDdz.SUBID.SUB_S_CHUPAI]: {
                subId: FDdz.SUBID.SUB_S_CHUPAI,
                request: null,
                response: FDdz.CMD_S_ChuPai,
                log: "",
                isprint: false
            },
            //跟牌通知
            [FDdz.SUBID.SUB_S_FOLLOW]: {
                subId: FDdz.SUBID.SUB_S_FOLLOW,
                request: null,
                response: FDdz.CMD_S_Follow,
                log: "",
                isprint: false
            },
            //出牌结果
            [FDdz.SUBID.SUB_S_NOTIFY_CHUPAI_INFO]: {
                subId: FDdz.SUBID.SUB_S_NOTIFY_CHUPAI_INFO,
                request: null,
                response: FDdz.CMD_S_NotifyChuPaiInfo,
                log: "",
                isprint: false
            },
            //过牌结果
            [FDdz.SUBID.SUB_S_NOTIFY_PASS_INFO]: {
                subId: FDdz.SUBID.SUB_S_NOTIFY_PASS_INFO,
                request: null,
                response: FDdz.CMD_S_NotifyPassInfo,
                log: "",
                isprint: false
            },
            //托管
            [FDdz.SUBID.SUB_S_NOTIFY_TUOGUAN]: {
                subId: FDdz.SUBID.SUB_S_NOTIFY_TUOGUAN,
                request: null,
                response: FDdz.CMD_S_NotifyTuoGuan,
                log: "",
                isprint: false
            },
            //游戏结束
            [FDdz.SUBID.SUB_S_NOTIFY_GAME_RESULT]: {
                subId: FDdz.SUBID.SUB_S_NOTIFY_GAME_RESULT,
                request: null,
                response: FDdz.CMD_S_NotifyGameResult,
                log: "",
                isprint: false
            },
            //聊天信息
            [FDdz.SUBID.SUB_S_MESSAGE_RESULT]: {
                subId: FDdz.SUBID.SUB_S_MESSAGE_RESULT,
                request: null,
                response: FDdz.CMD_S_MessageResult,
                log: "",
                isprint: false
            },
            //预解散房间
            [FDdz.SUBID.SUB_S_PRE_DISSMIS_RESULT]: {
                subId: FDdz.SUBID.SUB_S_PRE_DISSMIS_RESULT,
                request: null,
                response: FDdz.CMD_S_PreDissmisResult,
                log: "",
                isprint: false
            },
            //解散房间
            [FDdz.SUBID.SUB_S_DISSMIS_RESULT]: {
                subId: FDdz.SUBID.SUB_S_DISSMIS_RESULT,
                request: null,
                response: FDdz.CMD_S_DissmisResult,
                log: "",
                isprint: false
            },
            //准备
            [FDdz.SUBID.SUB_S_READY_RESULT]: {
                subId: FDdz.SUBID.SUB_S_READY_RESULT,
                request: null,
                response: FDdz.CMD_S_ReadyResult,
                log: "",
                isprint: false
            },
            //旁观
            [FDdz.SUBID.SUB_S_LOOKON_RESULT]: {
                subId: FDdz.SUBID.SUB_S_LOOKON_RESULT,
                request: null,
                response: FDdz.CMD_S_LookonResult,
                log: "",
                isprint: false
            },
            //提前结算
            [FDdz.SUBID.SUB_S_CONCLUDE_RESULT]: {
                subId: FDdz.SUBID.SUB_S_CONCLUDE_RESULT,
                request: null,
                response: FDdz.CMD_S_ConcludeResult,
                log: "",
                isprint: false
            },
            //一局结算后，玩家状态切换
            [FDdz.SUBID.SUB_S_CHANGE_USER_STATUS]: {
                subId: FDdz.SUBID.SUB_S_CHANGE_USER_STATUS,
                request: null,
                response: FDdz.CMD_S_EndChangeUserStatus,
                log: "",
                isprint: false
            },
            //获取实时战绩
            [FDdz.SUBID.SUB_S_GET_GAME_REOCRD]: {
                subId: FDdz.SUBID.SUB_S_GET_GAME_REOCRD,
                request: null,
                response: FDdz.CMD_S_GetGameRecord,
                log: "",
                isprint: false
            },
            //再来一轮
            [FDdz.SUBID.SUB_S_AGAIN_RESULT]: {
                subId: FDdz.SUBID.SUB_S_AGAIN_RESULT,
                request: null,
                response: FDdz.CMD_S_AgainResult,
                log: "",
                isprint: false
            },
            //通知消息
            [FDdz.SUBID.SUB_S_NOTIFY_MESSAGE]: {
                subId: FDdz.SUBID.SUB_S_NOTIFY_MESSAGE,
                request: null,
                response: FDdz.CMD_S_NotifyMessage,
                log: "",
                isprint: false
            },
            /*****************************************************    发送   ********************************************************/
            //叫抢地主请求
            [FDdz.SUBID.SUB_C_CALL_FIGHT]: {
                subId: FDdz.SUBID.SUB_C_CALL_FIGHT,
                request: FDdz.CMD_C_CallFight,
                response: null,
                log: "",
                isprint: false
            },
            //准备
            [FDdz.SUBID.SUB_C_READY]: {
                subId: FDdz.SUBID.SUB_C_READY,
                request: FDdz.CMD_C_Ready,
                response: null,
                log: "",
                isprint: false
            },
            //旁观
            [FDdz.SUBID.SUB_C_LOOKON]: {
                subId: FDdz.SUBID.SUB_C_LOOKON,
                request: FDdz.CMD_C_Lookon,
                response: null,
                log: "",
                isprint: false
            },
            //提前结算
            [FDdz.SUBID.SUB_C_CONCLUDE]: {
                subId: FDdz.SUBID.SUB_C_CONCLUDE,
                request: FDdz.CMD_C_Conclude,
                response: null,
                log: "",
                isprint: false
            },
            //获取实时战绩
            [FDdz.SUBID.SUB_C_GET_GAME_REOCRD]: {
                subId: FDdz.SUBID.SUB_C_GET_GAME_REOCRD,
                request: null,
                response: FDdz.CMD_C_GetGameRecord,
                log: "",
                isprint: false
            },
            //再来一轮
            [FDdz.SUBID.SUB_C_AGAIN]: {
                subId: FDdz.SUBID.SUB_C_AGAIN,
                request: null,
                response: FDdz.CMD_C_Again,
                log: "",
                isprint: false
            },
            //叫庄
            [FDdz.SUBID.SUB_C_CALL_SCORE]: {
                subId: FDdz.SUBID.SUB_C_CALL_SCORE,
                request: FDdz.CMD_C_CallScore,
                response: null,
                log: "",
                isprint: false
            },
            //加倍
            [FDdz.SUBID.SUB_C_JIABEI]: {
                subId: FDdz.SUBID.SUB_C_JIABEI,
                request: FDdz.CMD_C_JiaBei,
                response: null,
                log: "",
                isprint: false
            },
            //出牌
            [FDdz.SUBID.SUB_C_CHUPAI]: {
                subId: FDdz.SUBID.SUB_C_CHUPAI,
                request: FDdz.CMD_C_ChuPai,
                response: null,
                log: "",
                isprint: false
            },
            //过牌
            [FDdz.SUBID.SUB_C_PASS]: {
                subId: FDdz.SUBID.SUB_C_PASS,
                request: FDdz.CMD_C_Pass,
                response: null,
                log: "",
                isprint: false
            },
            //托管
            [FDdz.SUBID.SUB_C_TUOGUAN]: {
                subId: FDdz.SUBID.SUB_C_TUOGUAN,
                request: FDdz.CMD_C_TuoGuan,
                response: null,
                log: "",
                isprint: false
            },
            //聊天信息
            [FDdz.SUBID.SUB_C_MESSAGE]: {
                subId: FDdz.SUBID.SUB_C_MESSAGE,
                request: FDdz.CMD_C_Message,
                response: null,
                log: "",
                isprint: false
            },
            //设置聊天限制
            [FDdz.SUBID.SUB_C_SET_CHAT_LIMIT]: {
                subId: FDdz.SUBID.SUB_C_SET_CHAT_LIMIT,
                request: FDdz.CMD_C_ChatLimitMessage,
                response: null,
                log: "",
                isprint: false
            },
            //设置自动开局
            [FDdz.SUBID.SUB_C_SET_AUTO_START]: {
                subId: FDdz.SUBID.SUB_C_SET_AUTO_START,
                request: FDdz.CMD_C_AutoStartMessage,
                response: null,
                log: "",
                isprint: false
            },
            //通知玩家信息
            [FDdz.SUBID.SUB_S_NOTIFY_USER_INFO]: {
                subId: FDdz.SUBID.SUB_S_NOTIFY_USER_INFO,
                request: null,
                response: FDdz.CMD_S_NotifyUserInfo,
                log: "",
                isprint: false
            },
            //15分钟超时消息
            [FDdz.SUBID.SUB_S_IDLE_TIMEOUT_RESULT]: {
                subId: FDdz.SUBID.SUB_S_IDLE_TIMEOUT_RESULT,
                request: null,
                response: FDdz.CMD_S_IdleTimeoutResult,
                log: "",
                isprint: false
            },
            //设置同桌IP限制
            [FDdz.SUBID.SUB_C_SET_IP_LIMIT]: {
                subId: FDdz.SUBID.SUB_C_SET_IP_LIMIT,
                request: FDdz.CMD_C_IPLimitMessage,
                response: null,
                log: "",
                isprint: false
            },
            //设置同桌IP限制
            [FDdz.SUBID.SUB_S_SET_IP_LIMIT_RESULT]: {
                subId: FDdz.SUBID.SUB_S_SET_IP_LIMIT_RESULT,
                request: null,
                response: FDdz.CMD_S_IPLimitMessageResult,
                log: "",
                isprint: false
            },
            //设置自动开局
            [FDdz.SUBID.SUB_C_SET_AUTO_START]: {
                subId: FDdz.SUBID.SUB_C_SET_AUTO_START,
                request: null,
                response: FDdz.CMD_C_AutoStartMessage,
                log: "",
                isprint: false
            },
            //设置自动开局
            [FDdz.SUBID.SUB_S_SET_AUTO_START_RESULT]: {
                subId: FDdz.SUBID.SUB_S_SET_AUTO_START_RESULT,
                request: null,
                response: FDdz.CMD_S_AutoStartMessageResult,
                log: "",
                isprint: false
            },
            //设置聊天限制
            [FDdz.SUBID.SUB_S_SET_CHAT_LIMIT_RESULT]: {
                subId: FDdz.SUBID.SUB_S_SET_CHAT_LIMIT_RESULT,
                request: null,
                response: FDdz.CMD_S_ChatLimitMessageResult,
                log: "",
                isprint: false
            },
            //设置自动开局
            [FDdz.SUBID.SUB_S_SET_AUTO_START_RESULT]: {
                subId: FDdz.SUBID.SUB_S_SET_AUTO_START_RESULT,
                request: null,
                response: FDdz.CMD_S_AutoStartMessageResult,
                log: "",
                isprint: false
            },
        }
    };
    protected getProtoMap(mainId: number, subId: number): ProtoMapItem {
        return this.protoMap[mainId][subId];
    }
}
UMsgCenter.ins.addSerializer(EGameType.DDZ_HY, new CDdzSerializer_hy());
