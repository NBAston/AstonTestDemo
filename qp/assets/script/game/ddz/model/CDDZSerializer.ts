import { EGameType } from "../../../common/base/UAllenum";
import { Ddz, Game } from "../../../common/cmd/proto";
import { ProtoMapItem } from "../../../common/cmd/UOpcode";
import UMsgCenter from "../../../common/net/UMsgCenter";
import { UGameSerializer } from "../../UGameSerializer";

/**
 * 作用:zdd包解析器
 */
export default class CDdzSerializer extends UGameSerializer {
    /** */
    private protoMap: { [key: number]: { [key2: number]: ProtoMapItem } } = {
        [Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC]: {
            /*****************************************************    接受   ********************************************************/
            //---------------------------------------场景消息
            //叫地主状态
            [Ddz.SUBID.SC_GAMESCENE_JDZ]: {
                subId: Ddz.SUBID.SC_GAMESCENE_JDZ,
                request: null,
                response: Ddz.CMD_S_StatusJdz,
                log: "",
                isprint: false
            },
            [Ddz.SUBID.SC_GAMESCENE_FREE]: {
                subId: Ddz.SUBID.SC_GAMESCENE_FREE,
                request: null,
                response: Ddz.CMD_S_StatusFree,
                log: "",
                isprint: false
            },
            //加倍状态
            [Ddz.SUBID.SC_GAMESCENE_DOUBLE]: {
                subId: Ddz.SUBID.SC_GAMESCENE_DOUBLE,
                request: null,
                response: Ddz.CMD_S_StatusDouble,
                log: "",
                isprint: false
            },
            //游戏状态
            [Ddz.SUBID.SC_GAMESCENE_PLAY]: {
                subId: Ddz.SUBID.SC_GAMESCENE_PLAY,
                request: null,
                response: Ddz.CMD_S_StatusPlay,
                log: "",
                isprint: false
            },
            //---------------------------------------游戏消息
            //游戏开始
            [Ddz.SUBID.SUB_S_GAME_FAPAI]: {
                subId: Ddz.SUBID.SUB_S_GAME_FAPAI,
                request: null,
                response: Ddz.CMD_S_FaPai,
                log: "",
                isprint: false
            },
            //游戏倍数
            [Ddz.SUBID.SUB_S_NOTIFY_BEILV]: {
                subId: Ddz.SUBID.SUB_S_NOTIFY_BEILV,
                request: null,
                response: Ddz.CMD_S_NotifyBeiLv,
                log: "",
                isprint: false
            },
            //叫分通知
            [Ddz.SUBID.SUB_S_CALL_SCORE]: {
                subId: Ddz.SUBID.SUB_S_CALL_SCORE,
                request: null,
                response: Ddz.CMD_S_CallScore,
                log: "",
                isprint: false
            },
             //叫分结果
             [Ddz.SUBID.SUB_S_CALL_SCOR_RESULT]: {
                subId: Ddz.SUBID.SUB_S_CALL_SCOR_RESULT,
                request: null,
                response: Ddz.CMD_S_CallScoreResult,
                log: "",
                isprint: false
            },
            //地主信息
            [Ddz.SUBID.SUB_S_DZ_INFO]: {
                subId: Ddz.SUBID.SUB_S_DZ_INFO,
                request: null,
                response: Ddz.CMD_S_DzInfo,
                log: "",
                isprint: false
            },
            //加倍通知
            [Ddz.SUBID.SUB_S_JIABEI]: {
                subId: Ddz.SUBID.SUB_S_JIABEI,
                request: null,
                response: Ddz.CMD_S_JiaBei,
                log: "",
                isprint: false
            },
            //加倍结果
            [Ddz.SUBID.SUB_S_JIABEI_RESULT]: {
                subId: Ddz.SUBID.SUB_S_JIABEI_RESULT,
                request: null,
                response: Ddz.CMD_S_JiaBeiResult,
                log: "",
                isprint: false
            },
            //出牌通知
            [Ddz.SUBID.SUB_S_CHUPAI]: {
                subId: Ddz.SUBID.SUB_S_CHUPAI,
                request: null,
                response: Ddz.CMD_S_ChuPai,
                log: "",
                isprint: false
            },
            //跟牌通知
            [Ddz.SUBID.SUB_S_FOLLOW]: {
                subId: Ddz.SUBID.SUB_S_FOLLOW,
                request: null,
                response: Ddz.CMD_S_Follow,
                log: "",
                isprint: false
            },
            //出牌结果
            [Ddz.SUBID.SUB_S_NOTIFY_CHUPAI_INFO]: {
                subId: Ddz.SUBID.SUB_S_NOTIFY_CHUPAI_INFO,
                request: null,
                response: Ddz.CMD_S_NotifyChuPaiInfo,
                log: "",
                isprint: false
            },
            //过牌结果
            [Ddz.SUBID.SUB_S_NOTIFY_PASS_INFO]: {
                subId: Ddz.SUBID.SUB_S_NOTIFY_PASS_INFO,
                request: null,
                response: Ddz.CMD_S_NotifyPassInfo,
                log: "",
                isprint: false
            },
            //托管
            [Ddz.SUBID.SUB_S_NOTIFY_TUOGUAN]: {
                subId: Ddz.SUBID.SUB_S_NOTIFY_TUOGUAN,
                request: null,
                response: Ddz.CMD_S_NotifyTuoGuan,
                log: "",
                isprint: false
            },
            //游戏结束
            [Ddz.SUBID.SUB_S_NOTIFY_GAME_RESULT]: {
                subId: Ddz.SUBID.SUB_S_NOTIFY_GAME_RESULT,
                request: null,
                response: Ddz.CMD_S_NotifyGameResult,
                log: "",
                isprint: false
            },
            //聊天信息
            [Ddz.SUBID.SUB_S_NOTIFY_CHART_MESSAGE]: {
                subId: Ddz.SUBID.SUB_S_NOTIFY_CHART_MESSAGE,
                request: null,
                response: Ddz.CMD_S_NotifyChartMessage,
                log: "",
                isprint: false
            },
            //通知消息
            [Ddz.SUBID.SUB_S_NOTIFY_MESSAGE]: {
                subId: Ddz.SUBID.SUB_S_NOTIFY_MESSAGE,
                request: null,
                response: Ddz.CMD_S_NotifyMessage,
                log: "",
                isprint: false
            },
            /*****************************************************    发送   ********************************************************/
            //叫庄
            [Ddz.SUBID.SUB_C_CALL_SCORE]: {
                subId: Ddz.SUBID.SUB_C_CALL_SCORE,
                request: Ddz.CMD_C_CallScore,
                response: null,
                log: "",
                isprint: false
            },
            //加倍
            [Ddz.SUBID.SUB_C_JIABEI]: {
                subId: Ddz.SUBID.SUB_C_JIABEI,
                request: Ddz.CMD_C_JiaBei,
                response: null,
                log: "",
                isprint: false
            },
            //出牌
            [Ddz.SUBID.SUB_C_CHUPAI]: {
                subId: Ddz.SUBID.SUB_C_CHUPAI,
                request: Ddz.CMD_C_ChuPai,
                response: null,
                log: "",
                isprint: false
            },
            //过牌
            [Ddz.SUBID.SUB_C_PASS]: {
                subId: Ddz.SUBID.SUB_C_PASS,
                request: Ddz.CMD_C_Pass,
                response: null,
                log: "",
                isprint: false
            },
            //托管
            [Ddz.SUBID.SUB_C_TUOGUAN]: {
                subId: Ddz.SUBID.SUB_C_TUOGUAN,
                request: Ddz.CMD_C_TuoGuan,
                response: null,
                log: "",
                isprint: false
            },
            //聊天信息
            [Ddz.SUBID.SUB_C_CHART_MESSAGE]: {
                subId: Ddz.SUBID.SUB_C_CHART_MESSAGE,
                request: Ddz.CMD_C_ChartMessage,
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
UMsgCenter.ins.addSerializer(EGameType.DDZ, new CDdzSerializer());
