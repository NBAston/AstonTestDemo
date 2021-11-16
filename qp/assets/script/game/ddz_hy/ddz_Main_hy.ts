
import UGame from "../../public/base/UGame";
import AppGame from "../../public/base/AppGame";
import { ToBattle } from "../../common/base/UAllClass";
import ULanHelper from "../../common/utility/ULanHelper";
import UHandler from "../../common/utility/UHandler";
import UDDZHelper_hy from "./ddz_Helper_hy";
import ddz_Player_hy from "./ddz_Player_hy";
import ddz_ActionPanel_hy from "./ddz_actionPanel_hy";
import { EAgentLevelReqType, ECommonUI, EGameType, ELevelType, EMsgType } from "../../common/base/UAllenum";
import ddz_Card_hy from "./ddz_Card_hy";
import UDebug from "../../common/utility/UDebug";
import ddz_Music_hy from "./ddz_Music_hy";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import ddz_SelectPanel_hy from "./ddz_SelectPanel_hy";
import { Ddz } from "../../common/cmd/proto";
import ddz_RecordPanel_hy from "./ddz_RecordPanel_hy";
import MDDZModel_hy from "./model/MDDZ_hy";
import UStringHelper from "../../common/utility/UStringHelper";
import AppStatus from "../../public/base/AppStatus";
import MRoomModel from "../../public/hall/room_zjh/MRoomModel";
import MHall, { NEWS } from "../../public/hall/lobby/MHall";
import ddz_PlusView_hy from "./ddz_PlusView_hy";
import VGameChatPropManager from "../../public/gamechat/VGameChatPropManager";

/**
 * 作用:斗地主入口
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class ddz_Main_hy extends UGame {
    @property(cc.Node) mask: cc.Node = null;
    @property(cc.Node) menu: cc.Node = null;
    @property(cc.Label) baseScore: cc.Label = null;
    @property(cc.Node) match: cc.Node = null;
    @property(ddz_Player_hy) playerList: ddz_Player_hy[] = [];
    @property(ddz_ActionPanel_hy) action: ddz_ActionPanel_hy = null;
    @property(cc.Label) betLevel: cc.Label = null;
    @property(sp.Skeleton) spCallBanker: sp.Skeleton = null;
    @property(sp.Skeleton) spBomb: sp.Skeleton = null;
    @property(cc.Node) xipai: cc.Node = null;
    @property(cc.Node) trust: cc.Node = null;
    @property(cc.Node) bet: cc.Node = null;
    @property(cc.Label) recordId: cc.Label = null;
    @property(cc.Node) countItem: cc.Node = null;
    @property(cc.Node) cardRecord: cc.Node = null;
    @property(cc.Node) countBox: cc.Node = null;
    @property(cc.Node) lastItem: cc.Node[] = [];

    @property(sp.Skeleton) spWinLost: sp.Skeleton = null;
    @property(sp.Skeleton) spChunTian: sp.Skeleton = null;
    @property(cc.Node) recordPanel: cc.Node = null;
    @property(cc.Node) bottomBar: cc.Node = null
    @property(cc.Node) btnNext: cc.Node = null
    @property(cc.Label) tipMsg: cc.Label = null;
    @property(ddz_SelectPanel_hy) selectType: ddz_SelectPanel_hy = null;
    @property(cc.Node) multipleTipPopup: cc.Node = null;

    @property(cc.Node) gameStatusButtonGroup: cc.Node = null;

    @property(cc.Label) roundLab: cc.Label = null;
    @property(cc.Node) roundView: cc.Node = null;

    @property(cc.Label) timeLab: cc.Label = null;
    @property(cc.Label) roomLabel: cc.Label = null;
    @property(cc.Node) timeView: cc.Node = null;

    @property(cc.Node) dissmiss: cc.Node = null;
    @property(cc.Label) dissmissLabel: cc.Label = null;

    @property(cc.Label) antes0: cc.Label = null;
    @property(cc.Label) antes1: cc.Label = null;
    @property(cc.Node) spine_waiting: cc.Node = null;
    @property(cc.Node) game_charge: cc.Node = null;

    private _is_multiple_open: boolean;
    /**单例 */
    private static _ins: ddz_Main_hy;
    private _enterMinScore: any;
    static get ins(): ddz_Main_hy {
        return ddz_Main_hy._ins;
    }
    public musicMgr: ddz_Music_hy
    private _sys_news: Array<string>;
    private _emergency_announcement: Array<string>;

    public isRoomHost: boolean = false;//是否是房主
    public roomUserId: number = 0;

    leftSeconds: number = -1;
    allSeconds: number = -1;
    gameOver: boolean = false;
    roomInfo: any;

    protected init(): void {
        ddz_Main_hy._ins = this;
        this.musicMgr = new ddz_Music_hy()
        this._is_multiple_open = false;
        //记牌器个数
        for (var i = 0; i < 15; i++) {
            let ins = cc.instantiate(this.countItem);
            ins.setParent(this.countBox)
            // ins.width = i < 2 ? 45 : 27
        }
        this.trust.x = 0;
        this.trust.active = false;
        this.recordId.node.parent.active = false;
        // this.bet.active = false;
        this.menu.scale = 0;
        this.multipleTipPopup.scale = 0;
        this.selectType.node.active = false;
        this.dissmiss.active = false;
        this.game_charge.active = false;
        this.node.getChildByName("lookOnButton").active = false;
    }

    onEnable() {
        super.onEnable();
        AppGame.ins.ddzModel_hy.run();
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_DISSMISS_ROOM, this.onDissMissRoom, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_CHANGE_USER_STATUS, this.onChangeUserStatus, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_GAME_READY_RESULT, this.onGameReadyResult, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_UPDATE_ROOM_INFO, this.onGameSceneFree, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_GAME_LOOKON_RESULT, this.onGameLookOnResult, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_WASH_CARD_RESULT, this.onWashCardHandler, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_GAME_START, this.onGameStart, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_BANKER_INFO, this.onBankerInfo, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_OUT_CARD_RESULT, this.onOutCardResult, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_GAME_BET_LEVEL, this.onBetLevel, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_GAME_END, this.onGameEnd, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_SELF_EVENT.DDZ_SC_TS_START_MATCH, this.onStartMatch, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_SELF_EVENT.DDZ_UPDATE_PLAYERS_EVENT, this.onUpdatePlayers, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_SELF_EVENT.DDZ_RECONNECT_OUT_CARD, this.onUpdateRecordBox, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_AGAIN_ROOM_GAME, this.onAgainRoomGameRes, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_AGAIN_ROOM_GAME_UPDATE, this.onAgainRoomGameResUpdate, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_PLAYERS_CHANGE, this.onPlayerChangeStatus, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_DISSMISS_ROOM_SHOW_RECORE, this.onDissMissRoomSHowRecore, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_ALL_OVER_SHOW_RECORE, this.onAllOverGameShowRecore, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_IDLE_TIMEOUT_RESULT, this.onIdelTimeOutResult, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_CHAT_SETTING, this.onChatSettingHandler, this);
        AppGame.ins.roomModel.on(MRoomModel.CLIENT_RECORD_FRIEND, this.onGetGameRecord, this);
        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        AppGame.ins.hallModel.on(MHall.GET_AGENT_LEVEL_RES, this.onAgentLevelRes, this);

    }

    onDisable() {
        super.onDisable();
        this.musicMgr.stop()
        this.node.stopAllActions()
        AppGame.ins.ddzModel_hy.exit();
        AppGame.ins.roomModel.off(MRoomModel.CLIENT_RECORD_FRIEND, this.onGetGameRecord, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_DISSMISS_ROOM, this.onDissMissRoom, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_CHANGE_USER_STATUS, this.onChangeUserStatus, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_GAME_READY_RESULT, this.onGameReadyResult, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_UPDATE_ROOM_INFO, this.onGameSceneFree, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_GAME_LOOKON_RESULT, this.onGameLookOnResult, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_GAME_START, this.onGameStart, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_WASH_CARD_RESULT, this.onWashCardHandler, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_BANKER_INFO, this.onBankerInfo, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_OUT_CARD_RESULT, this.onOutCardResult, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_GAME_BET_LEVEL, this.onBetLevel, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_GAME_END, this.onGameEnd, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_SELF_EVENT.DDZ_SC_TS_START_MATCH, this.onStartMatch, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_SELF_EVENT.DDZ_UPDATE_PLAYERS_EVENT, this.onUpdatePlayers, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_SELF_EVENT.DDZ_RECONNECT_OUT_CARD, this.onUpdateRecordBox, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_AGAIN_ROOM_GAME, this.onAgainRoomGameRes, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_AGAIN_ROOM_GAME_UPDATE, this.onAgainRoomGameResUpdate, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_PLAYERS_CHANGE, this.onPlayerChangeStatus, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_DISSMISS_ROOM_SHOW_RECORE, this.onDissMissRoomSHowRecore, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_ALL_OVER_SHOW_RECORE, this.onAllOverGameShowRecore, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_IDLE_TIMEOUT_RESULT, this.onIdelTimeOutResult, this);
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        AppGame.ins.hallModel.off(MHall.GET_AGENT_LEVEL_RES, this.onAgentLevelRes, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_CHAT_SETTING, this.onChatSettingHandler, this);
    }

    //场景被打开
    openScene(data: any): void {
        super.openScene(data);
        if (data) {
            let dt = data as ToBattle;
            if (dt) {
                this.mask.active = false
                this.match.active = false
                this.cardRecord.active = false
                this.baseScore.node.active = false
                AppGame.ins.ddzModel_hy.cellScore = dt.roomData.floorScore
                AppGame.ins.ddzModel_hy._roomInfo = dt.roomData;
                this._enterMinScore = data.roomData.enterMinScore;
                this.musicMgr.playGamebg()
            }
        }
    }

    //////////////////////////////////////////////////////////////游戏消息///////////////////////////////////////////////////////
    //显示倍率
    private onBetLevel(data: any) {
        UDebug.Log("倍率消息" + JSON.stringify(data))
        this.recordPanel.getComponent(ddz_RecordPanel_hy).setBetData = data.playerbeilv;
        this.betLevel.string = `${data.playerbeilv[AppGame.ins.ddzModel_hy.gMeChairId].totalbeilv}倍`;
        if (!this.bet.active) {
            this.bet.active = true;
        }
        let selfData: Ddz.playerbeilv = data.playerbeilv[AppGame.ins.ddzModel_hy.gMeChairId]
        this.refreshMultiple(selfData);
    }

    refreshMultiple(selfData: any, isReset?: boolean) {
        let ddz_PlusView_hy = this.multipleTipPopup.getComponent("ddz_PlusView_hy");
        if (isReset) {
            ddz_PlusView_hy.resetView();
            return;
        }
        ddz_PlusView_hy.resetView();
        if (selfData != null) {
            // //基础倍率
            // ddz_PlusView_hy.setBase(selfData.basebeilv);
            //炸弹倍率
            ddz_PlusView_hy.setBomb(selfData.bombbeilv);
            //春天倍率
            ddz_PlusView_hy.setSpring(selfData.springbeilv);
            ddz_PlusView_hy.setCommon(selfData.bombbeilv * selfData.springbeilv * selfData.jdzbeilv);
            //叫地主倍率
            ddz_PlusView_hy.setLandlord(selfData.jdzbeilv);
            //农民加倍倍率
            ddz_PlusView_hy.setFarmer(selfData.jiabeibeilv);
            //总倍率
            ddz_PlusView_hy.setTotal(selfData.totalbeilv);
            ddz_PlusView_hy.setUser(AppGame.ins.roleModel.useId);
        }
    }
    //影藏准备Icon
    hideReadIcon() {
        this.playerList.forEach(player => {
            player.node.getChildByName("readyIcon").active = false;
        })
    }
    //洗牌
    private onWashCardHandler(data: any) {
        this.playerList.forEach(player => {
            player.node.getComponent(ddz_Player_hy).hindAction();
        })
        this.match.active = false;
        this.gameStatusButtonGroup.getChildByName("inviteButton").active = false;
        this.gameStatusButtonGroup.active = false;
        this.node.getChildByName("lookOnButton").active = false;
        this.node.getChildByName("zailaiyilunBtn").active = false;
        this.hideReadIcon();
        this.payXipai()
    }
    //游戏开始
    private onGameStart(data: any) {
        this.dissmiss.active = false;
        this.bottomBar.getChildByName("btn_trust").active = true;
        this.bet.active = true;
        this.dissmissCountDowm = -1;
        this.gameStatusButtonGroup.getChildByName("inviteButton").active = false;
        this.gameStatusButtonGroup.active = false;
        this.node.getChildByName("lookOnButton").active = false;
        this.node.getChildByName("zailaiyilunBtn").active = false;
        this.spine_waiting.active = false;
        this.hideReadIcon()
        this.countBox.active = true
        this.match.active = false
        this.baseScore.string = "底注：" + (AppGame.ins.ddzModel_hy.cellScore).toString()
        this.recordId.string = data.roundid
        this.recordId.node.parent.active = true
        this.cardRecord.active = true
        this.resetRecordCard()
        data.cards.forEach(element => {
            this.updateRecordCard(element)
        })
        for (var i = 0; i < 3; i++) {
            var poker = this.lastItem[i].getComponent(ddz_Card_hy)
            poker.lockFlag = true
            poker.showCardBack(true)
            // poker.showCardCheck(false)
        }
        this.musicMgr.playSendCard()
        //开始游戏后再显示玩家
        this.playerList.forEach(player => {
            player.node.active = true
        })
        this.refreshMultiple(null, true)
        if (this.allSeconds != -1 && this.leftSeconds == -1) {
            this.leftSeconds = this.allSeconds;
        }
    }
    payXipai(){
        this.xipai.active = true;
        this.xipai.getComponent(sp.Skeleton).setCompleteListener((event) => {
            this.xipai.active = false;
        })
        this.xipai.getComponent(sp.Skeleton).setAnimation(0, "xipai_01", false);
    }

    //确定地主
    private onBankerInfo(data: any) {
        if (!data.isreconnect) {
            if (data.dzinfo.dzchairid == AppGame.ins.ddzModel_hy.gMeChairId) {
                data.dzinfo.dicards.forEach(element => {
                    this.updateRecordCard(element)
                })
            }
        }


        for (var i = 0; i < data.dzinfo.dicards.length; i++) {
            var poker = this.lastItem[i].getComponent(ddz_Card_hy)
            poker.showCardBack(false)
            poker.setCardValue(data.dzinfo.dicards[i])
        }
        this.musicMgr.playBankerResult()
    }

    //出牌结果
    private onOutCardResult(data: any) {
        if (data.isreconnect) return
        if (data.lastchairid != AppGame.ins.ddzModel_hy.gMeChairId) {
            data.cards.forEach(element => {
                this.updateRecordCard(element)
            })
        }
        //更新三张底牌透明度
        // for (var i = 0; i < 3; i++) {
        //     var poker = this.lastItem[i].getComponent(ddz_Card_hy)
        //     if (data.cards.includes(poker.value)) {
        //         poker.showCardCheck(true)
        //     }
        // }
    }
    //结束当轮
    onDissMissRoom(data: any) {
        this.gameOver = true;
    }
    //预解散房间倒计时结束 - 解散房间
    onDissMissRoomSHowRecore(data: any) {
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: EMsgType.EOK,
            data: data.retMsg,
            handler: UHandler.create((v: boolean) => {
                AppGame.ins.ddzModel_hy.exitGame();
            })
        })
    }
    //预解散 - 游戏结束-打开战绩 - 解散房间
    onAllOverGameShowRecore(data: any) {
        this.gameOver = true;
        this.gameStatusButtonGroup.active = false;
        this.node.getChildByName("lookOnButton").active = false;
        this.hideReadIcon();
        this.gameStatusButtonGroup.getChildByName("readyButton").active = true;
        this.onRecordPanel();
        if (!ddz_Main_hy.ins.isRoomHost) {
            AppGame.ins.showTips(ULanHelper.GAME_HY.THE_IS_CONSIDERING_WHETHER_TO_COME_AGAIN_PLEASE_WAIT);
        }
    }
    //关闭战绩界面，当游戏结束时候 打开准备界面
    resView(isOpenZaiLaiyici: boolean) {
        if (!this.recordPanel.active && !this.gameStatusButtonGroup.active) {
            this.node.getChildByName("zailaiyilunBtn").active = isOpenZaiLaiyici;
        }
        if (!isOpenZaiLaiyici) {
            this.node.getChildByName("zailaiyilunBtn").active = false;
        }
        if (this.recordPanel.getChildByName("endPanel").getChildByName("likaifangjian").active) {
            this.spine_waiting.active = true;
        }
    }
    //游戏结束
    onGameEnd(data: any) {
        this.playerList.forEach(player => {
            player.node.getComponent(ddz_Player_hy).gameOverHandler();
        })
        this.bottomBar.getChildByName("btn_trust").active = false;
        // this.bet.active = false;
        var result = data.gameresult
        if (data.roomInfo.currentRound != -1) {
            this.node.getChildByName("lookOnButton").getComponent(cc.Button).interactable = false;
            this.gameStatusButtonGroup.getChildByName("readyButton").active = true;
        }
        let ispring = false;
        for (var i = 0; i < result.length; i++) {
            const element = result[i]
            //更新分数
            let seatId = AppGame.ins.ddzModel_hy.getUISeatId(element.chairid)
            this.playerList[seatId].setScore(element.currentsocre)
            for (let key in AppGame.ins.ddzModel_hy.gBattlePlayer) {
                if (AppGame.ins.ddzModel_hy.gBattlePlayer[key].userId == element.userid) {
                    AppGame.ins.ddzModel_hy.gBattlePlayer[key].score = element.currentsocre;
                    break;
                }
            }
            //输赢动画
            if (element.chairid == AppGame.ins.ddzModel_hy.gMeChairId) {
                var banker = AppGame.ins.ddzModel_hy.gMeChairId == AppGame.ins.ddzModel_hy.gBankerIndex ? true : false
                this.playWinOrLostSpine(element.iswin, banker)
                //重置准备、旁观UI状态
            }
            this.playerList[seatId].node.getChildByName("readyIcon").active = false;

            //通知玩家
            if (element.cards.length > 0) {
                this.playerList[seatId].onGameEnd(element)
            }

            //春天动画
            if (element.ispring == 1 && element.iswin == 1) {
                ddz_Main_hy.ins.musicMgr.playChunTian(this.playerList[seatId].sex);
            }
            if (element.ispring) {
                ispring = true;
            }
        }

        if(ispring){
            this.playChunTianSpine();
        }

        this.updateView(data.roomInfo, true);

        for (let i = 0; i < this.playerList.length; i++) {
            this.playerList[i].closeClock();
        }
    }
    //再来一轮
    againGame(event = null): void {
        if(event != null){
            ddz_Main_hy.ins.musicMgr.playClickBtn();
        }
        ddz_Main_hy.ins.gameOver = false;
        this.node.getChildByName("zailaiyilunBtn").active = false;
        for (let i = 0; i < 100000; i++) {
            clearInterval(i);
        }
        // this.countBox.active = false
        this.gameStatusButtonGroup.active = true;
        // this.node.getChildByName("lookOnButton").active = true;
        this.recordPanel.active = false;
        AppGame.ins.ddzModel_hy.sendAgainRoomGame();
    }
    //屏幕截图保存
    screenShootSave(event = null): void {
        if(event != null){
            ddz_Main_hy.ins.musicMgr.playClickBtn();
        }
        let picName = "HYDDZ_" + Date.now();
        UAPIHelper.savePhoto2(this.node, picName, false);
    }
    //设置开关  type 1、点击ip限制 2、点击控制带入 3、点击自动开局 4、聊天开放与否
    sendSettingToggleRequest(type: number, isOpen: boolean): void {
        switch (type) {
            case 1:
                AppGame.ins.ddzModel_hy.sendSetIpLimitResult({ bLimit: isOpen });
                break;
            case 3:
                AppGame.ins.ddzModel_hy.sendSetAutoStartResult({ bLimit: isOpen });
                break;
            case 4:
                AppGame.ins.ddzModel_hy.sendChatResult({ bLimit: isOpen });
                break;
            default:
                break;
        }
    }
    //房间信息 好友
    roomInfoHy(arg): void {
    }
    //离开房间
    levelRoom(): void {

    }
    //重连成功，游戏已经结束,房间信息置空，方便退出
    protected reconnect_in_game_but_no_in_gaming(): void {
        AppGame.ins.ddzModel_hy._roomInfo = null
        //清理玩家
        for (var k in this.playerList){
            this.playerList[k].onClearDesk()
        }
        //清理数据
        AppGame.ins.ddzModel_hy.resetData()
    }

    //////////////////////////////////////////////////////////////本地事件///////////////////////////////////////////////////////
    //播放spine动画
    public playSpine(path: string, animation: string, skeleton: sp.Skeleton, loop: boolean, callback?: Function): void {
        if (AppGame.ins.roomModel.BundleName == "") return
        let bundle = cc.assetManager.getBundle(AppGame.ins.roomModel.BundleName)
        bundle.load(path, sp.SkeletonData, function (err, res: any) {
            if (err) cc.error(err)
            cc.loader.setAutoRelease(res, true)
            skeleton.skeletonData = res
            skeleton.setAnimation(0, animation, loop)
            skeleton.setCompleteListener((event) => {
                if (callback != undefined) callback()
            })
        })
    }

    //播放春天
    playChunTianSpine() {
        this.spChunTian.node.active = true
        ddz_Main_hy.ins.playSpine("ani/gameover/chuntian", "chuntian", this.spChunTian, false, () => {
            this.spChunTian.node.active = false
        })
    }

    //播放输赢动画
    playWinOrLostSpine(isWin: boolean, banker: boolean) {
        this.spWinLost.node.active = true
        var path;
        var action;
        if (isWin) {
            path = "ani/gameover/win"
            action = banker ? "dizhu_win" : "farmer_win"
        } else {
            path = "ani/gameover/lose37"
            action = banker ? "dizhu_lose" : "farmer_lose"
        }
        ddz_Main_hy.ins.playSpine(path, action, this.spWinLost, false, () => {
            this.spWinLost.node.active = false
        })
        this.musicMgr.playIsWin(isWin)
        this.scheduleOnce(() => { this.musicMgr.playGamebg() }, 6.5);
    }

    //更新记牌器
    updateRecordCard(cardValue: number) {
        // var index = 14 - AppGame.ins.ddzModel_hy.pokerLibrary.getCardWeight(cardValue)
        // AppGame.ins.ddzModel_hy.leftCardCount[index] = AppGame.ins.ddzModel_hy.leftCardCount[index] - 1
        // this.countBox.children[index].getComponent(cc.Label).string = AppGame.ins.ddzModel_hy.leftCardCount[index].toString()
        // if (AppGame.ins.ddzModel_hy.leftCardCount[index] == 0){
        //     this.countBox.children[index].getComponent(cc.Label).node.color =   cc.color(113,73,60)
        // }else if (AppGame.ins.ddzModel_hy.leftCardCount[index] == 4){
        //     this.countBox.children[index].getComponent(cc.Label).node.color =   cc.color(201,67,53)
        // }else{
        //     this.countBox.children[index].getComponent(cc.Label).node.color =   cc.color(232,229,209)
        // }
    }

    //显示记牌器
    resetRecordCard() {
        // AppGame.ins.ddzModel_hy.leftCardCount = [1, 1, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4]
        // for (var i = 0; i < this.countBox.childrenCount; i++) {
        //     this.countBox.children[i].getComponent(cc.Label).string = AppGame.ins.ddzModel_hy.leftCardCount[i].toString()
        //     if (AppGame.ins.ddzModel_hy.leftCardCount[i] == 0){
        //         this.countBox.children[i].getComponent(cc.Label).node.color =   cc.color(113,73,60)
        //     }else if (AppGame.ins.ddzModel_hy.leftCardCount[i] == 4){
        //         this.countBox.children[i].getComponent(cc.Label).node.color =   cc.color(201,67,53)
        //     }else{
        //         this.countBox.children[i].getComponent(cc.Label).node.color =   cc.color(232,229,209)
        //     }
        // }
    }

    //点击菜单
    onClickMenu(event = null) {
        this.menu.scale = this.menu.scale == 0 ? 1 : 0;
        if(event != null){
            ddz_Main_hy.ins.musicMgr.playClickBtn();
        }
    }

    //点击玩法介绍
    onClickPayInfo(event = null){
        if(event != null){
            ddz_Main_hy.ins.musicMgr.playClickBtn();
        }
        let view = this.node.getChildByName("playInfoView");
        view.active = !view.active;
        if(view.active && this.roomInfo.extent != null){
            let restraintToggleContainer = view.getChildByName("restraintToggleContainer");
            let modeToggleContainer = view.getChildByName("modeToggleContainer");
            let playToggleContainer = view.getChildByName("playToggleContainer");
            let cappedToggleContainer = view.getChildByName("cappedToggleContainer");
            let shuffleModeToggleContainer = view.getChildByName("shuffleModeToggleContainer");
            let data = JSON.parse(this.roomInfo.extent);
            modeToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = data.JdzMode == 0;
            modeToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = data.JdzMode == 1;
            if(restraintToggleContainer.getChildByName("toggle"+this.roomInfo.allRound) == null){
                restraintToggleContainer.getChildByName("toggle1").getComponent(cc.Label).string = `${this.roomInfo.allRound}局`;
                restraintToggleContainer.getChildByName("restraintLab1").getComponent(cc.Toggle).isChecked = true;
            }else{
                restraintToggleContainer.getChildByName("toggle"+this.roomInfo.allRound).getComponent(cc.Toggle).isChecked = true;
            }
            playToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = data.FistJdzRandom;
            playToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = data.TwoKingMustJdz;
            playToggleContainer.getChildByName("toggle3").getComponent(cc.Toggle).isChecked = data.Four2MustJdz;
            playToggleContainer.getChildByName("toggle4").getComponent(cc.Toggle).isChecked = data.AllowedDouble;
            playToggleContainer.getChildByName("toggle5").getComponent(cc.Toggle).isChecked = data.AllowedFourWithTwo;
            playToggleContainer.getChildByName("toggle6").getComponent(cc.Toggle).isChecked = data.AllowedThreeWithTwo;
            playToggleContainer.getChildByName("toggle7").getComponent(cc.Toggle).isChecked = data.AllowedThree;
            cappedToggleContainer.getChildByName("toggle"+data.MaxBeiLv).getComponent(cc.Toggle).isChecked = true;
            shuffleModeToggleContainer.getChildByName("toggle1").getComponent(cc.Toggle).isChecked = !data.NotShuffle;
            shuffleModeToggleContainer.getChildByName("toggle2").getComponent(cc.Toggle).isChecked = data.NotShuffle;
        }
    }

    //复制牌局编号
    onCopyRecordID() {
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked((this.recordId.string));
    }

    //点击战绩
    onRecordPanel(event = null) {
        if(event != null){
            ddz_Main_hy.ins.musicMgr.playClickBtn();
        }
        ddz_Main_hy.ins.menu.scale = 0;
        AppGame.ins.ddzModel_hy.sendGetGameRecord(this.roomInfo.userGameKindId);
        this.recordPanel.active = true;
    }

    //获取实时战绩
    onGetGameRecord(data: any) {
        // this.closeMultiplePopup();
        this.recordPanel.getComponent(ddz_RecordPanel_hy).showPanel(data);
    }

    //再来一轮 失败 恢复原状
    onAgainRoomGameResUpdate(data: any = null) {
        if (data && data.userId == AppGame.ins.roleModel.useId) {
            if (data.retCode == 2) {
                AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                    type: EMsgType.EOKAndCancel, data: data.errorMsg, handler: UHandler.create((a) => {
                        if (a) {
                            this.onClickCharge();
                        }
                    }, this)
                });
                if (this.recordPanel.active) {
                    this.recordPanel.getChildByName("endPanel").getChildByName("zailaiyilun").active = true;
                    this.gameStatusButtonGroup.active = false;
                    this.node.getChildByName("lookOnButton").active = false;
                }
                if (!this.recordPanel.active) {
                    this.node.getChildByName("zailaiyilunBtn").active = true;
                    this.gameStatusButtonGroup.active = false;
                    this.node.getChildByName("lookOnButton").active = false;
                }
            }
        }
    }
    //再来一轮
    onAgainRoomGameRes(data: any = null) {
        if (data && data.userId == AppGame.ins.roleModel.useId) {
            this.betLevel.string = "1倍";
            this.refreshMultiple(null, true);
            for (let key in AppGame.ins.ddzModel_hy.gBattlePlayer) {
                AppGame.ins.ddzModel_hy.gBattlePlayer[key].score = 0;
            }
        }
        if (!this.isRoomHost) {//打开其他人的在来一轮按钮
            if ((this.recordPanel.active && this.recordPanel.getChildByName("endPanel").getChildByName("zailaiyilun").active) || this.node.getChildByName("zailaiyilunBtn").active) {
                // this.node.getChildByName("zailaiyilunBtn").active = false;
                if (data.userId == this.roomUserId) {
                    AppGame.ins.showTips(ULanHelper.GAME_HY.THE_HOMEOWNER_DECIDES_TO_HAVE_ANOTHER_ROUND);
                }
            } else {//已经打开按钮就不提示
                this.recordPanel.getComponent(ddz_RecordPanel_hy).showAgainButton();
                this.resView(true);
                if (data.userId == this.roomUserId) {
                    AppGame.ins.showTips(ULanHelper.GAME_HY.THE_HOMEOWNER_DECIDES_TO_HAVE_ANOTHER_ROUND);
                }
            }
        }
        this.spine_waiting.active = false;

        if (data != null && data.roomInfo != null && data.roomInfo.currentRound != -1) {
            let isShowRecord = true;
            if (this.recordPanel.active && this.recordPanel.getChildByName("endPanel").getChildByName("zailaiyilun").active) {
                isShowRecord = false;
            }
            if (this.node.getChildByName("zailaiyilunBtn").active) {
                isShowRecord = false;
            }
            if (isShowRecord) {
                this.gameStatusButtonGroup.active = true;
                // this.node.getChildByName("lookOnButton").active = true;
                this.node.getChildByName("lookOnButton").getComponent(cc.Button).interactable = false;
                this.gameStatusButtonGroup.getChildByName("readyButton").active = true;
            }
        }
        if (data != null && data.roomInfo != null && (data.roomInfo.currentRound == -1 || data.roomInfo.leftSeconds == -1)) {
            ddz_Main_hy.ins.gameOver = false;
            this.updateView(data.roomInfo);
        }

        for (let i = 0; i < this.playerList.length; i++) {
            this.playerList[i].setScore(0);
            this.playerList[i].closeClock();
        }
    }

    //点击聊天
    onClickChat(event = null) {
        if(event != null){
            ddz_Main_hy.ins.musicMgr.playClickBtn();
        }
        this.closeMultiplePopup()
        // AppGame.ins.showUI(ECommonUI.UI_CHAT_HY, {
        //     text_click_callback: AppGame.ins.ddzModel_hy.onSendChartMessage,
        //     emoj_click_callback: AppGame.ins.ddzModel_hy.onSendChartMessage,
        //     send_click_callback: AppGame.ins.ddzModel_hy.onSendChartMessage,
        // });
        AppGame.ins.showUI(ECommonUI.UI_CHAT_HY);
    }
    /**通过UserId 获取聊天节点**/
    getChatPropNodeByUserId(userId:number,callback:any = null){
        for (let i=0;i<this.playerList.length;i++){
            let player = this.playerList[i];
            let bindUserId = player.chatProp.getComponent(VGameChatPropManager).getBindUserId();
            if(bindUserId && (userId == bindUserId)){
                callback && callback(player.chatProp);
            }
        }
    }

    //断线重连时更新记牌器
    onUpdateRecordBox(cards: number[]) {
        cards.forEach(element => {
            this.updateRecordCard(element)
        })
    }

    //点击充值
    onClickCharge() {
        ddz_Main_hy.ins.musicMgr.playClickBtn();
        AppGame.ins.hallModel.requestAgentLevel(EAgentLevelReqType.default);
    }

    /**获取到代理等级 */
    onAgentLevelRes(data: any) {
        if (AppGame.ins.hallModel.reqAgentLevelType != EAgentLevelReqType.default) return;
        if (!data || data.retCode != 0 || !data.hasOwnProperty('level')) {
            AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: false, index: 3 });
            return;
        }
        if (data.level >= 5) {
            AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: false, index: 2 });
        } else {
            AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: false, index: 3 });
        }
    }

    //接收准备
    onReady() {
        //重置桌子
        AppGame.ins.ddzModel_hy.emit(UDDZHelper_hy.DDZ_SELF_EVENT.DDZ_CLEAR_DESK2)
        AppGame.ins.ddzModel_hy.sendReady();
        ddz_Main_hy.ins.musicMgr.playClickBtn();
    }
    //请求旁观
    onLookOn() {
        AppGame.ins.ddzModel_hy.sendLookOn();
    }
    //立即结算
    onConcludeResult() {
        ddz_Main_hy.ins.musicMgr.playClickBtn();
        ddz_Main_hy.ins.menu.scale = ddz_Main_hy.ins.menu.scale == 0 ? 1 : 0;
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: 3, data: ULanHelper.GAME_HY.HOST_CHECK_OUT, handler: UHandler.create((a) => {
                if (a) {
                    AppGame.ins.ddzModel_hy.sendConcludeResult();
                }
            }, this)
        });
    }
    //邀请
    onInvite() {
        ddz_Main_hy.ins.musicMgr.playClickBtn();
        ddz_Main_hy.ins.menu.scale = 0;
        let headId = 0;//找不到该玩家使用默认的，例如玩家已退，数据已清洗
        for (const key in AppGame.ins.ddzModel_hy.gBattlePlayer) {
            let element = AppGame.ins.ddzModel_hy.gBattlePlayer[key];
            if (element.userId == this.roomInfo.roomUserId) {
                headId = element.headId;
                break;
            }
        }
        AppGame.ins.showUI(ECommonUI.UI_SHARED_HY, { eGameType: EGameType.DDZ_HY, roomInfo: this.roomInfo, headId: headId });
    }

    findNickName(chairId): any {
        for (const key in AppGame.ins.ddzModel_hy.gBattlePlayer) {
            let element = AppGame.ins.ddzModel_hy.gBattlePlayer[key];
            if (element.chairId == chairId) {
                return element.nickName
            }
        }
        return null;
    }

    findHeadId(chairId): any {
        for (const key in AppGame.ins.ddzModel_hy.gBattlePlayer) {
            let element = AppGame.ins.ddzModel_hy.gBattlePlayer[key];
            if (element.chairId == chairId) {
                return element.headId
            }
        }
        return null;
    }
    findheadImgUrl(chairId): any {
        for (const key in AppGame.ins.ddzModel_hy.gBattlePlayer) {
            let element = AppGame.ins.ddzModel_hy.gBattlePlayer[key];
            if (element.chairId == chairId) {
                return element.headImgUrl
            }
        }
        return null;
    }
    // 显示提示文本
    public onShowTips(content: string) {
        var action1 = cc.fadeIn(0.2);
        var action2 = cc.fadeOut(0.2);
        var actionPlay1 = cc.callFunc(() => {
            this.scheduleOnce(() => {
                this.tipMsg.node.parent.runAction(action2);
            }, 1.5);
        })
        this.tipMsg.string = content;
        this.tipMsg.node.parent.active = true
        this.tipMsg.node.parent.runAction(cc.sequence(action1, actionPlay1));
    }

    //托管
    onClickTrust(event: any, CustomEventData: boolean) {
        if(event != null){
            ddz_Main_hy.ins.musicMgr.playClickBtn();
        }
        this.closeMultiplePopup()
        AppGame.ins.ddzModel_hy.sendTrust(CustomEventData)
    }

    //开始匹配
    private onStartMatch(): void {
        this.match.active = true
        this.betLevel.string = ""
        this.cardRecord.active = false
        this.baseScore.node.active = false
        this.recordId.node.parent.active = false
        this.btnNext.active = false
        //重置桌子
        AppGame.ins.ddzModel_hy.emit(UDDZHelper_hy.DDZ_SELF_EVENT.DDZ_CLEAR_DESK)
        //进入房间
        AppGame.ins.ddzModel_hy.resetData()
        AppGame.ins.roomModel.requestMatch()
    }

    //初始化场景消息
    private onGameSceneFree(data: any): void {
        this.updateView(data.roomInfo);
        if (data.playerinfo != null) {//更新倍率
            for (let i = 0; i < data.playerinfo.length; i++) {
                let playerInfo = data.playerinfo[i];
                if (playerInfo.playerbeilv != null && playerInfo.userId == AppGame.ins.roleModel.useId) {
                    this.betLevel.string = `${playerInfo.playerbeilv.totalbeilv != null ? playerInfo.playerbeilv.totalbeilv : 1}倍`;
                    if (!this.bet.active) {
                        this.bet.active = true;
                    }
                    this.refreshMultiple(playerInfo.playerbeilv);
                    break;
                }
            }
        }
    }
    //复制房间id
    copyRoomId(): void {
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked(`${this.roomInfo.roomId}`);
    }
    //秒转化成 时分秒
    secondToDate(result, isOnlyFS: boolean = true) {
        let h = Math.floor(result / 3600);
        let m = Math.floor((result / 60 % 60));
        let s = Math.floor((result % 60));
        let eh = h.toString().length == 1 ? "0" + h : h;
        let em = m.toString().length == 1 ? "0" + m : m;
        let es = s.toString().length == 1 ? "0" + s : s;
        return isOnlyFS ? eh + ":" + em + ":" + es : em + ":" + es;
    }
    //禁止聊天设置
    onChatSettingHandler(data:any){
        this.bottomBar.getChildByName("btn_chat").active = !data.bLimit;
    }
    updateView(roomInfo, isGameOver = false) {
        this.roomInfo = roomInfo;
        this.isRoomHost = AppGame.ins.roleModel.useId == roomInfo.roomUserId;
        this.game_charge.active = this.isRoomHost;
        this.roomUserId = roomInfo.roomUserId;
        this.menu.getChildByName("menu_node").getChildByName("gf_bg_menu").getChildByName("btn_endGame").active = this.isRoomHost;
        this.roomLabel.string = roomInfo.roomId;
        if(roomInfo.bChatLimit != null){
            this.bottomBar.getChildByName("btn_chat").active = !roomInfo.bChatLimit;
        }
        this.antes0.string = UStringHelper.getMoneyFormat2(roomInfo.floorScore / 100);
        this.antes1.string = UStringHelper.getMoneyFormat2(roomInfo.floorScore / 100);
        if (AppGame.ins.ddzModel_hy.gameStatus == MDDZModel_hy.DDZ_GAMESTATUS.OVER || AppGame.ins.ddzModel_hy.gameStatus == MDDZModel_hy.DDZ_GAMESTATUS.FREE) {
            let isShowRecord = true;
            if (this.recordPanel.active && this.recordPanel.getChildByName("endPanel").getChildByName("zailaiyilun").active) {
                isShowRecord = false;
            }
            if (this.node.getChildByName("zailaiyilunBtn").active) {
                isShowRecord = false;
            }
            this.gameStatusButtonGroup.active = isShowRecord;
            // this.node.getChildByName("lookOnButton").active = isShowRecord;
        }
        if (roomInfo.allRound <= 0) {//以时间为准的房间
            this.allSeconds = roomInfo.allSeconds;
            this.roundView.active = false;
            this.timeView.active = true;
            if (roomInfo.leftSeconds <= 0) {//游戏还没开始
                this.gameOver = false;
                this.leftSeconds = -1;
                this.timeLab.string = ddz_Main_hy.ins.secondToDate(this.allSeconds);//显示时间
            } else {
                if (roomInfo.leftSeconds <= 0) {
                    this.timeLab.string = "0";
                    if (AppGame.ins.ddzModel_hy.gameStatus == MDDZModel_hy.DDZ_GAMESTATUS.OVER && isGameOver) {
                        this.gameStatusButtonGroup.active = false;
                        this.node.getChildByName("lookOnButton").active = false;
                        this.onRecordPanel();
                    }
                } else {//已经开始倒计时
                    this.leftSeconds = roomInfo.leftSeconds;
                }
            }

            if (AppGame.ins.ddzModel_hy.gameStatus == MDDZModel_hy.DDZ_GAMESTATUS.OVER || AppGame.ins.ddzModel_hy.gameStatus == MDDZModel_hy.DDZ_GAMESTATUS.FREE) {

            } else {
                this.leftSeconds = this.allSeconds;
            }

        } else {//以局数为准的
            this.roundView.active = true;
            this.timeView.active = false;
            if (roomInfo.currentRound <= 0) {
                this.gameOver = false;
                this.allSeconds = -1;
                this.leftSeconds = -1;
            }
            let start = roomInfo.currentRound < 0 ? 0 : roomInfo.currentRound;
            this.roundLab.string = start + "/" + roomInfo.allRound;
            if (roomInfo.currentRound == roomInfo.allRound && AppGame.ins.ddzModel_hy.gameStatus == MDDZModel_hy.DDZ_GAMESTATUS.OVER && isGameOver) {
                this.gameStatusButtonGroup.active = false;
                this.node.getChildByName("lookOnButton").active = false;
                this.onRecordPanel();
            }
        }
        if (isGameOver) {
            if (this.gameOver) {//房间解散
                this.gameStatusButtonGroup.active = false;
                this.node.getChildByName("lookOnButton").active = false;
                this.onRecordPanel();
            }

        }
    }
    dissmissCountDowm: number = -1;
    //15分钟超时消息
    onIdelTimeOutResult(data: any) {
        this.dissmissCountDowm = data.idleLeave;
    }

    private _hideTime = -1; //隐藏到后台的时候时间戳
    private m_nBack: number = 0
    private _timeOutSeconds: number = -1; //超时剩余时间


    private m_tmpClockTime1: number = 0
    private m_tmpClockTime2: number = 0

    /**
     * 游戏切换到后台
     * @param isHide 是否切在后台
     */
    onGameToBack(isBack: boolean) {
        //处理自动解散时间
        if (isBack) {
            this._hideTime = new Date().getTime();
            this.m_nBack = new Date().getTime() / 1000
        }
        if (!isBack) {
            let nowTime = new Date().getTime();
            if (this._hideTime > 0) {
                let diffSeconds = (nowTime - this._hideTime) / 1000;
                this._timeOutSeconds -= diffSeconds;
                this._hideTime = -1;
            }
        }

        //倒计时逻辑
        if (this.leftSeconds > 0) {
            this.m_tmpClockTime1 = this.leftSeconds
            let disTime = Math.round(new Date().getTime() / 1000 - this.m_nBack)
            if (disTime > this.m_tmpClockTime1) //如果当前局结束
            {
            } else if (this.m_tmpClockTime1 > disTime) {
                this.leftSeconds = this.m_tmpClockTime1 - disTime
            }
        }

        //倒计时逻辑
        if (this.dissmissCountDowm > 0) {
            this.m_tmpClockTime2 = this.dissmissCountDowm
            let disTime = Math.round(new Date().getTime() / 1000 - this.m_nBack)
            if (disTime > this.m_tmpClockTime2) //如果当前局结束
            {

            } else if (this.m_tmpClockTime2 > disTime) {
                this.dissmissCountDowm = this.m_tmpClockTime2 - disTime
            }
        }
    }

    update(dt: number) {
        if (this.leftSeconds > 0) {
            this.leftSeconds -= dt;
            if (this.timeLab) {
                this.timeLab.string = ddz_Main_hy.ins.secondToDate(this.leftSeconds < 0 ? 0 : this.leftSeconds, false);//显示时间
            }
            if (this.gameOver) {
                this.timeLab.string = `00:00`;
                this.leftSeconds = -1;
            }
        }
        if (this.dissmissCountDowm > 0) {
            this.dissmissCountDowm -= dt;
            if (this.dissmissCountDowm <= 0) {
                this.dissmissLabel.string = `00:00`;
            } else {
                if (this.dissmissCountDowm <= 600) {
                    if (!this.dissmiss.active) {
                        this.dissmiss.active = true;
                    }
                }
                this.dissmissLabel.string = ddz_Main_hy.ins.secondToDate(this.dissmissCountDowm < 0 ? 0 : this.dissmissCountDowm, false);//显示时间
            }
        }
    }
    //游戏准备就绪
    private onGameReadyResult(data: any) {
        let seatId = AppGame.ins.ddzModel_hy.getUISeatId(data.chairId);
        if (AppGame.ins.ddzModel_hy.gMeChairId == data.chairId) {
            this.node.getChildByName("lookOnButton").getComponent(cc.Button).interactable = true;
            this.gameStatusButtonGroup.getChildByName("readyButton").active = false;
            this.cardRecord.active = false;
            if (this.roomInfo.allRound <= 0) {//以时间为准的房间
                if (this.roomInfo.leftSeconds > 0) {//游戏开始过了
                    this.gameStatusButtonGroup.getChildByName("inviteButton").active = false;
                    this.cardRecord.active = false;
                }
            } else {
                if (this.roomInfo.currentRound > 0) {//游戏开始过了
                    this.gameStatusButtonGroup.getChildByName("inviteButton").active = false;
                    this.cardRecord.active = false;
                }
            }
        }
        this.playerList[seatId].node.getChildByName("readyIcon").active = true;

        for (let key in AppGame.ins.ddzModel_hy.gBattlePlayer) {
            let item = AppGame.ins.ddzModel_hy.gBattlePlayer[key];
            for (let i = 0; i < this.playerList.length; i++) {
                if (this.playerList[i].UserID == item.userId) {
                    this.playerList[i].setHeadSpine(false);
                    break;
                }
            }
        }
        //所有人准备就绪 则可以开始播放匹配动画
        let isFull = true;
        for (let i = 0; i < 3; i++) {
            if (!this.playerList[i].node.getChildByName("readyIcon").active) {
                isFull = false;
                break;
            }
        }
        if (isFull) {
            this.match.active = true;
            this.scheduleOnce(() => {
                this.match.active = false;
            }, 2.5)
        }
        this.betLevel.string = "1倍";
        this.refreshMultiple(null, true);
    }
    //一局结束后，玩家状态切换
    private onChangeUserStatus(data: any) {
        this.gameStatusButtonGroup.getChildByName("readyButton").active = true;
        this.node.getChildByName("lookOnButton").getComponent(cc.Button).interactable = false;
    }
    //旁观
    private onGameLookOnResult(data: any) {
        this.match.active = false;
        let seatId = AppGame.ins.ddzModel_hy.getUISeatId(data.chairId);
        if (AppGame.ins.ddzModel_hy.gMeChairId == data.chairId) {
            AppGame.ins.showTips(ULanHelper.GAME_HY.STATUS_LOOK_ON);
            this.node.getChildByName("lookOnButton").getComponent(cc.Button).interactable = false;
            this.gameStatusButtonGroup.getChildByName("readyButton").active = true;
        }
        this.playerList[seatId].node.getChildByName("readyIcon").active = false;
    }
    //玩家狀態更新
    onPlayerChangeStatus(playerData: any) {
        for (let i = 0; i < this.playerList.length; i++) {
            if (this.playerList[i].UserID == Number(playerData.userid)) {
                if (playerData.status == 0) {//离开0
                    this.playerList[i].onClearDesk();
                    delete AppGame.ins.ddzModel_hy.gBattlePlayer[playerData.userid];
                }
            }
        }
    }
    //更新房间玩家信息
    private onUpdatePlayers(data: any) {
        if (!data) return
        UDebug.Log("onUpdatePlayers" + JSON.stringify(data))
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const element = data[key]
                let seatId = AppGame.ins.ddzModel_hy.getUISeatId(element.chairId)
                if (element.userStatus >= 0 && seatId != null) {
                    this.playerList[seatId].setChairId(element.chairId)
                    this.playerList[seatId].setUserID(element.userId)
                    this.playerList[seatId].setNickName(element.nickName)
                    this.playerList[seatId].setScore(element.score)
                    //通过状态显示当前的ui  status                =11; //用户状态  3-坐下  4-准备 5-游戏中  7-旁观
                    let isReady = Number(element.userStatus) == 4;
                    //该入口仅更新一次 准备icon状态，数据未维护
                    if (!this.playerList[seatId].node.getChildByName("readyIcon").active) {
                        this.playerList[seatId].node.getChildByName("readyIcon").active = isReady;
                        if (AppGame.ins.ddzModel_hy.gMeChairId == element.chairId) {
                            this.node.getChildByName("lookOnButton").getComponent(cc.Button).interactable = isReady;
                            this.gameStatusButtonGroup.getChildByName("readyButton").active = !isReady;
                        }
                    }
                    //断线重连
                    if (element.userStatus == 5) {
                        this.playerList[seatId].node.active = true
                    } else {
                        this.playerList[seatId].node.active = true;
                    }
                }
            }
        }
    }

    onMultiplePopBtn(event = null) {
        if(event != null){
            ddz_Main_hy.ins.musicMgr.playClickBtn();
        }
        if (this._is_multiple_open) {
            this.multipleTipPopup.runAction(cc.scaleTo(0.15, 0));
            this.mask.active = false;
        } else {
            this.mask.active = true;
            this.multipleTipPopup.runAction(cc.scaleTo(0.15, 1));
        }
        this._is_multiple_open = !this._is_multiple_open;
    }

    closeMultiplePopup() {
        if (this._is_multiple_open) {
            this.multipleTipPopup.runAction(cc.scaleTo(0.15, 0));
            this._is_multiple_open = !this._is_multiple_open;
        }
    }

    closeAllPop() {
        this.menu.scale = 0;
        this.closeMultiplePopup()
        this.action.setHandCardBack()
        this.selectType.node.active = false
        AppGame.ins.ddzModel_hy.selectPokers = []
    }

    dateFormat(fmt, date) {
        let ret;
        const opt = {
            "Y+": date.getFullYear().toString(),        // 年
            "m+": (date.getMonth() + 1).toString(),     // 月
            "d+": date.getDate().toString(),            // 日
            "H+": date.getHours().toString(),           // 时
            "M+": date.getMinutes().toString(),         // 分
            "S+": date.getSeconds().toString()          // 秒
            // 有其他格式化字符需求可以继续添加，必须转化成字符串
        };
        for (let k in opt) {
            ret = new RegExp("(" + k + ")").exec(fmt);
            if (ret) {
                fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
            };
        };
        return fmt;
    }
}