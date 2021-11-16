
import UGame from "../../public/base/UGame";
import USpriteFrames from "../../common/base/USpriteFrames";
import MBaseGameModel from "../../public/hall/MBaseGameModel";
import VFyxbdNode from "../common/VFyxbdNode";
import AppGame from "../../public/base/AppGame";
import UNodeHelper from "../../common/utility/UNodeHelper";
import ULocalStorage from "../../common/utility/ULocalStorage";
import { ToBattle } from "../../common/base/UAllClass";
import ULanHelper from "../../common/utility/ULanHelper";
import { EEnterRoomErrCode, ECommonUI, ELevelType, EGameType, ETipType, EAgentLevelReqType, EMsgType, ERoomKind, EAppStatus } from "../../common/base/UAllenum";
import UHandler from "../../common/utility/UHandler";
import UDebug from "../../common/utility/UDebug";
import UAudioManager from "../../common/base/UAudioManager";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import VPDKMenu from "./pdk_MenuPanel_hy";
import UPDKHelper_hy, { EPDKState } from "./pdk_Helper_hy";
import pdk_MatchPanel_hy from "./pdk_MatchPanel_hy";
import pdk_ResultPanel_hy from "./pdk_resultPanel_hy";
import pdk_Player from "./pdk_Player_hy";
import pdk_ActionPanel from "./pdk_actionPanel_hy";
import { CFG_NoticeItem } from "../../config/cfg_notice";
import pdk_Music_hy from "./pdk_Music_hy";
import UAudioRes from "../../common/base/UAudioRes";
import { ChatMsgType, ReceiveChairidType } from "./poker/PDKEnum_hy";
import pdk_Card_hy from "./pdk_Card_hy";
import MRoomModel from "../../public/hall/room_zjh/MRoomModel";
import UStringHelper from "../../common/utility/UStringHelper";
import MPdk_hy, { PDK_SCALE, PDK_SCALE_100 } from "./model/MPdk_hy";
import UDateHelper from "../../common/utility/UDateHelper";
import { ZJH_SCALE } from "../../public/hall/lobby/VHall";
import AppStatus from "../../public/base/AppStatus";
import MHall, { NEWS } from "../../public/hall/lobby/MHall";
import GamePropManager from "../../public/GameProp/GamePropManager";
import VGameChatPropManager from "../../public/gamechat/VGameChatPropManager";


/**
 * 作用:斗地主入口逻辑,处理框架，公共类逻辑
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class pdk_Main_hy extends UGame {
    @property(cc.Node) menu: cc.Node = null;
    @property(cc.Node) menuCheckout: cc.Node = null;
    @property(cc.Label) roomNo: cc.Label = null; // 房号
    @property(cc.Node) time_base: cc.Node = null; //
    @property(cc.Label) baseScore: cc.Label = null;
    @property(cc.Label) timeOutLbl: cc.Label = null; // 超时提示
    // @property(cc.Label) check_out_tip: cc.Label = null;// 提前清算提示语
    @property(cc.Label) time_round: cc.Label = null;
    @property(pdk_MatchPanel_hy) match: pdk_MatchPanel_hy = null;
    @property(cc.Node) waitAgain: cc.Node = null;
    @property(cc.Node) tuoguanPanel: cc.Node = null;
    @property(pdk_Player) playerList: pdk_Player[] = [];
    @property(pdk_ActionPanel) action: pdk_ActionPanel = null;
    @property(cc.Label) betLevel: cc.Label = null;
    @property(sp.Skeleton) Spine: sp.Skeleton = null;
    @property(sp.Skeleton) spWashCard: sp.Skeleton = null;
    @property(cc.Node) peach3Node: cc.Node = null;
    @property(pdk_ResultPanel_hy) result: pdk_ResultPanel_hy = null;
    @property(cc.Label) recordId: cc.Label = null;
    @property(cc.Node) countItem: cc.Node = null;
    @property(cc.Node) cardRecord: cc.Node = null;
    @property(cc.Node) lastItem: cc.Node[] = [];
    @property(cc.Node) cardType_1: cc.Node = null;
    @property(cc.Node) cardType_2: cc.Node = null;
    @property(cc.Node) countBox_1: cc.Node = null;
    @property(cc.Node) countBox_2: cc.Node = null;
    @property(sp.Skeleton) mainLock: sp.Skeleton = null;
    @property(cc.Node) recordPanel: cc.Node = null;
    @property(cc.Node) playCfgPanel: cc.Node = null;
    @property(cc.Node) touchNode: cc.Node = null;
    @property(cc.Node) continueGame: cc.Node = null;
    @property(cc.Node) tips: cc.Node = null;
    @property(cc.Node) againOneGame: cc.Node = null;
    @property(cc.Node) invite_btn: cc.Node = null;
    @property(cc.Node) ready_btn: cc.Node = null;
    @property(cc.Node) zanji_btn: cc.Node = null;
    @property(cc.Node) tuoguan_btn: cc.Node = null;
    @property(cc.Node) chat_btn: cc.Node = null;
    @property(cc.Node) charge_btn: cc.Node = null;
    @property(cc.Toggle) lookOn_toggle: cc.Toggle = null;
    private m_nBack: number = 0
    private m_tmpClockTime: number = 0
    private _hideTime = -1; //隐藏到后台的时候时间戳
    private _touchTag: number = 0;
    private _lastTouchTime: number = 0;
    private _enterMinScore: number = 0;
    public playerDataList: any;//用户数据信息
    public _timeOutSeconds: number = -1; //15分超时剩余时间
    private _leftSeconds: number = -1; //房间剩余时间
    _isTimeRoom: boolean = false;

    /**单例 */
    private static _ins: pdk_Main_hy;
    static get ins(): pdk_Main_hy {
        return pdk_Main_hy._ins;
    }

    baseGameModel: MBaseGameModel = null;
    /**重连不在游戏房间内 */
    fromeDisconnect: boolean = false;
    _music_mgr: pdk_Music_hy = null;
    Spades3ChairId: number = 0; // 拥有黑桃3 id
    Hearts3ChairId: number = 0;// 红桃3 id
    firstOutChairId: number = 0; // 首出牌的玩家
    outCharid: number = 0;
    isAdvanceCheckOut: boolean = false;
    _chatMain: cc.Node = null;
    recordid:any;
    clockActionId: any;


    protected init(): void {
        pdk_Main_hy._ins = this;
        this._music_mgr = new pdk_Music_hy(this.node.getComponent(UAudioRes));
        this.menu.active = false;
        this.fromeDisconnect = false;
        
    }

    update(dt: number) {
        //超时时间倒计时 const element = pdk_Main_hy.ins.playerList[index];
        if (this._timeOutSeconds > 0) {
            this._timeOutSeconds -= dt;
            if (this._timeOutSeconds < 0) {
                this._timeOutSeconds = 0;
            }
            let second = Math.ceil(this._timeOutSeconds);
            this.setTimeOutTime(second);
        }

        if(this._leftSeconds == 0 && this._isTimeRoom) {
            this.time_round.string = "剩余" + UDateHelper.secondsToTime(this._leftSeconds);
        }
        if (this._leftSeconds > 0 && this._isTimeRoom) {
            this._leftSeconds -= dt;
            if (this._leftSeconds < 0) {
                this._leftSeconds = 0;
            }
            let second = Math.ceil(this._leftSeconds);
            this.time_round.string = "剩余" + UDateHelper.secondsToTime(second);
        }

        /*if (this.chairId != AppGame.ins.fPdkModel.gMeChairId) {
            if(this._waittime > 0) {
                this._waittime -= dt;
                this.timeSprite.fillRange = this._waittime / this._timeNum;
                if (this._waittime < 0) {
                    this._waittime = 0;
                    this.timeSprite.fillRange = 0;
                }
                let second = Math.ceil(this._waittime);
                if(second <=3 ) {
                    pdk_Main_hy.ins._music_mgr.playDjs();
                }
                this.clock.string = second.toString();
            } else if(this._waittime == 0) {
                if(MPdk_hy.ins.gameCfgInfo && MPdk_hy.ins.gameCfgInfo.ChuPaiTime != 0) {
                    // this.node.active = false
                    this.closeClock();
                }
                this.timeSprite.fillRange = 0;
                this.clock.string = '0';
                this.clock.node.color = cc.color(255,0,0);
            }
        }*/

    }

    /**
     * 场景被打开 
     * @param data 
     *//**sq 修改 需要是否是断线重连进来的 data:ToBattle */
    openScene(data: any): void {
        super.openScene(data);
        var roleinfo = {
            touxiang: null,
            nickname: null,
            coin: null,
            userid: null
        };
        roleinfo.touxiang = AppGame.ins.roleModel.headId;
        roleinfo.nickname = AppGame.ins.roleModel.nickName;
        roleinfo.coin = AppGame.ins.roleModel.score;
        roleinfo.userid = AppGame.ins.roleModel.useId;
        this._enterMinScore = data.roomData.enterMinScore;
        //AppGame.ins.fPdkModel.setPlayerInfo(roleinfo);
        if (data) {
            let dt = data as ToBattle;
            AppGame.ins.fPdkModel.saveRoomInfo(dt.roomData);

            if (dt) {
                AppGame.ins.fPdkModel.currentDizhu = dt.roomData.floorScore;
                if (!dt.fromReconnet) {
                    this.waitbattle();
                }
                else {
                    // AppGame.ins.fPdkModel.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_RESET_SCENE);
                }
            }
        }
    }

    // // 进入房间失败消息
    // protected enter_room_fail(errorCode: number, errMsg?: string): void {
    //     let msg = errMsg;
    //     if (errorCode == 7) {
    //         msg = "您的金币不足，该房间需要" + this._enterMinScore * PDK_SCALE + "金币以上才可以下注";
    //     } else {
    //         if (!msg) {
    //             msg = ULanHelper.ENTERROOM_ERROR[errorCode];
    //         }
    //     }

    //     AppGame.ins.showUI(ECommonUI.NewMsgBox, {
    //         type: 1, data: msg, handler: UHandler.create(() => {
    //             AppGame.ins.loadLevel(ELevelType.Hall, EGameType.PDK);
    //         }, this)
    //     });
    // }

    start() {
        this._music_mgr.playGamebg();
    }

    onEnable() {
        super.onEnable();
        AppGame.ins.fPdkModel.run();
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_EVENT.PDK_GAME_START, this.onGamestart, this);
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_EVENT.PDK_GAMESCENE_FREE, this.onSenceGameFree, this);
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_EVENT.PDK_GAMESCENE_PLAY, this.onSenceGamePlay, this);
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_SELF_EVENT.PDK_SC_TS_START_MATCH, this.onStartMatch, this);
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_SELF_EVENT.PDK_SC_TS_CANCLE_MATCH, this.onStopMatch, this);
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_EVENT.PDK_GAME_OWNREDPEACH3CHAIR, this.onPeach3Chair, this);
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_EVENT.PDK_GAME_FAPAI, this.onGameFapai, this);
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_EVENT.PDK_GAME_NOTIFY_CHUPAI_INFO, this.onPlayerOutCardInfo, this);
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_EVENT.PDK_GAME_NOTIFY_CHUPAI_INFO, this.onHideTimeOutSeconds, this);
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_EVENT.PDK_GAME_NOTIFY_PASS_INFO, this.onHideTimeOutSeconds, this);
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_EVENT.PDK_GAME_NOTIFY_GAME_RESULT, this.onGameResultInfo, this);
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_SELF_EVENT.PDK_UPDATE_PLAYERS_EVENT, this.onUpdatePlayers, this);
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_SELF_EVENT.PDK_SHOW_CONTINUE_GAME, this.onShowContinueGame, this);
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_CLICK_GAME_RECORD, this.onClickZhanji, this);
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_PRE_DISSMIS_ROOM, this.preDissmissRoom, this);
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_DISSMIS_ROOM, this.onDissmisRoom, this); // 解散房间弹出战绩
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_CONCLUDE_RESULT, this.showConcludeTip, this); // 提示结算信息
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_AGAIN_GAME, this.onAgainOneGame, this); // 再来一轮
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_SELF_EVENT.PDK_SHOW_TIME_OUT, this.onShowTimeOut, this); // 显示超时提示
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_SELF_EVENT.PDK_SHOW_AGAIN_GAME, this.onShowAgainGame, this); // 再来一轮按钮是否显示
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_SELF_EVENT.PDK_ROOM_USER_CLICK_AGAIN_GAME, this.onRoomUserClickAgainGame, this);
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_SELF_EVENT.PDK_ROOM_CHARGE_ROOM_CARD, this.intoCharge, this);
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_SET_CHAT_LIMIT_RESULT, this.setChatBtn, this);
        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        AppGame.ins.hallModel.on(MHall.GET_AGENT_LEVEL_RES, this.onAgentLevelRes, this);

    }

    onDisable() {
        super.onDisable(); 
        this._music_mgr.stop();
        AppGame.ins.fPdkModel.exit();
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_EVENT.PDK_GAME_START, this.onGamestart, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_EVENT.PDK_GAMESCENE_FREE, this.onSenceGameFree, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_EVENT.PDK_GAMESCENE_PLAY, this.onSenceGamePlay, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_SELF_EVENT.PDK_SC_TS_START_MATCH, this.onStartMatch, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_SELF_EVENT.PDK_SC_TS_CANCLE_MATCH, this.onStopMatch, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_EVENT.PDK_GAME_OWNREDPEACH3CHAIR, this.onPeach3Chair, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_EVENT.PDK_GAME_FAPAI, this.onGameFapai, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_EVENT.PDK_GAME_NOTIFY_CHUPAI_INFO, this.onPlayerOutCardInfo, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_EVENT.PDK_GAME_NOTIFY_CHUPAI_INFO, this.onHideTimeOutSeconds, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_EVENT.PDK_GAME_NOTIFY_PASS_INFO, this.onHideTimeOutSeconds, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_EVENT.PDK_GAME_NOTIFY_GAME_RESULT, this.onGameResultInfo, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_SELF_EVENT.PDK_UPDATE_PLAYERS_EVENT, this.onUpdatePlayers, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_SELF_EVENT.PDK_SHOW_CONTINUE_GAME, this.onShowContinueGame, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_CLICK_GAME_RECORD, this.onClickZhanji, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_DISSMIS_ROOM, this.onDissmisRoom, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_PRE_DISSMIS_ROOM, this.preDissmissRoom, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_CONCLUDE_RESULT, this.showConcludeTip, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_AGAIN_GAME, this.onAgainOneGame, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_SELF_EVENT.PDK_SHOW_TIME_OUT, this.onShowTimeOut, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_SELF_EVENT.PDK_SHOW_AGAIN_GAME, this.onShowAgainGame, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_SELF_EVENT.PDK_ROOM_USER_CLICK_AGAIN_GAME, this.onRoomUserClickAgainGame, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_SELF_EVENT.PDK_ROOM_CHARGE_ROOM_CARD, this.intoCharge, this);
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_SET_CHAT_LIMIT_RESULT, this.setChatBtn, this);
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        AppGame.ins.hallModel.off(MHall.GET_AGENT_LEVEL_RES, this.onAgentLevelRes, this);
        pdk_Main_hy.ins.action.show({});
    }

    /**
     * 游戏切换到后台
     * @param isHide 是否切在后台
     */
     onGameToBack(isBack: boolean) {
        //处理自动解散时间
        if (isBack) {
            this._hideTime = new Date().getTime();
        }
        if (!isBack) {
            this.spWashCard.node.stopAllActions()
            this.spWashCard.node.active = false
            let nowTime = new Date().getTime();
            if (this._hideTime > 0) {
                let diffSeconds = (nowTime - this._hideTime) / 1000;
                this._timeOutSeconds -= diffSeconds;
                this._hideTime = -1;
            }
        }
    }

    /*******************  **************************/
    /** 等待游戏开始*/
    waitbattle(): void {
        // this.setMatch(true);

    }

    //重连成功，游戏已经结束,房间信息置空，方便退出
    protected reconnect_in_game_but_no_in_gaming(): void {
        AppGame.ins.fPdkModel._roomInfoHy = null
        pdk_Main_hy.ins.action.node.active = false;
        // 清理玩家
        for (var k in this.playerList ) {
           this.playerList[k].onClearDesk();
        }
        AppGame.ins.fPdkModel.resetData();
    }

    public setMatch(b: boolean) {
        // if (this.match)
        //     this.match.node.active = b
    }

    private onHideTimeOutSeconds(data: any) {
        this.timeOutLbl.node.parent.opacity = 0;
        this._timeOutSeconds = -1;
    }


    //播放洗牌动画
    playWashCardSpine(){
        this.spWashCard.node.active = true
        this.playSpine("ani/xipai","xipai_01",this.spWashCard,false,()=>{
        this.spWashCard.node.active = false})
    }

    public playSpine(path:string,animation:string,skeleton:sp.Skeleton,loop:boolean,callback?:Function): void {
        if (AppGame.ins.roomModel.BundleName == "") return
        let bundle = cc.assetManager.getBundle(AppGame.ins.roomModel.BundleName)
        bundle.load(path, sp.SkeletonData, function(err, res:any){
            if(err) cc.error(err)
            cc.loader.setAutoRelease(res, true)
            skeleton.skeletonData = res
            skeleton.setAnimation(0, animation, loop)
            skeleton.setCompleteListener((event) =>{
                if (callback != undefined ) callback()
            })
        })
    }

    // 游戏开始---
    private onGamestart(data: any) {
        UDebug.log("游戏开始----- 执行代码逻辑----data = " + JSON.stringify(data));
        this.setBottomActive(true, true, !MPdk_hy.ins.roomInfoHy.bChatLimit);
        let roomData = data.roomInfo;
        if (roomData.allRound <= 0) {// 时间为标准
            this._isTimeRoom = true;
            if (roomData.leftSeconds < 0) { // 第一次开始游戏 开启倒计时
                this._leftSeconds = roomData.allSeconds;
            }
        } else {
            this._isTimeRoom = false;
        }
        this.setRoomDataInfo(data);
        this.timeOutLbl.node.parent.opacity = 0;
        this._timeOutSeconds = -1;
        //播放洗牌动画
        if (!data.isReconnect){
            pdk_Main_hy.ins.setMatch(false)
            this.playWashCardSpine()  
        }
        this.setCardRecordUI();

    }

    setCardRecordUI() {
        //记牌器个数
        this.countBox_1.removeAllChildren();
        this.countBox_2.removeAllChildren();
        for (var i=0;i<13;i++){
            let ins = cc.instantiate(this.countItem);
            if(MPdk_hy.ins.gameCfgInfo && MPdk_hy.ins.gameCfgInfo.hasOwnProperty("Mode") && MPdk_hy.ins.gameCfgInfo["Mode"] == 2) {
                ins.setParent(this.countBox_1)
            } else {
                ins.setParent(this.countBox_2)
            }
            ins.width = 32.5
        }
    }

    setChatBtn() {
        this.chat_btn.active = !MPdk_hy.ins.roomInfoHy.bChatLimit;
    }

    setBottomActive(zjShow: boolean, tgShow: boolean, chatShow: boolean) {
        // this.zanji_btn.active = zjShow;
        this.tuoguan_btn.active = tgShow;
        this.chat_btn.active = chatShow;
    }

    // 游戏场景空闲场景消息
    private onSenceGameFree(data: any) {
        this.setBottomActive(data.roomInfo.currentRound > 0 ?true:false, false, !MPdk_hy.ins.roomInfoHy.bChatLimit);
        this.baseScore.string = "底分: " + (data.discore / PDK_SCALE_100);
        this.setCheckoutMenu(data.roomInfo.roomUserId);
        for (var i = 0; i < data.playerinfo.length; i++) {
            const element = data.playerinfo[i]
            this.setUserScore(element.chairID, element.score);
        }
        this.setRoomDataInfo(data);
    }

    private  onSenceGamePlay(data: any) {
        this.setCheckoutMenu(data.roomInfo.roomUserId);
        this.setBottomActive(data.roomInfo.currentRound > 0 ?true:false, false, !MPdk_hy.ins.roomInfoHy.bChatLimit);

    }

    setCheckoutMenu(data: any): void {
        if (this.playerList[0].userId != data) {
            this.menuCheckout.active = false; // 房主才有立即结算
            this.charge_btn.active = false;
        } else {
            this.charge_btn.active = true;
            this.menuCheckout.active = true;
        }
    }

    // 设置更新玩家分数
    setUserScore(chairid: number, score: number) {
        let seatId = AppGame.ins.fPdkModel.getUISeatId(chairid);
        this.playerList[seatId].setScore(score);
    }

    setRoomDataInfo(data: any) {
        if (data && data.roomInfo) {
            let roomData = data.roomInfo;
            this.baseScore.string = "底分: " + (roomData.floorScore / PDK_SCALE_100);
            this.roomNo.node.parent.active = true;
            this.roomNo.string = "" + roomData.roomId;
            this.time_base.active = true;
            if (roomData.allRound <= 0) { // 时间为标准
                this._isTimeRoom = true;
                if (roomData.leftSeconds < 0) { // 游戏未开始
                    this.time_round.string = "剩余" + UDateHelper.secondsToTime(roomData.allSeconds);//+ this.addZero(hour)+":"+this.addZero(minute)+":"+this.addZero(second);
                } else {
                    this._leftSeconds = roomData.leftSeconds;
                }
            } else { // 以局数为标准
                this._isTimeRoom = false;
                this.time_round.string = "第" + (roomData.currentRound < 0 ? "0" : roomData.currentRound) + "/" + roomData.allRound + "局";
            }
        }
    }

    private onStartMatch(data: any): void {
        // this.match.node.active = true
        this.betLevel.string = ""
        //重置桌子
        AppGame.ins.fPdkModel.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_CLEAR_DESK)
        //进入房间
        AppGame.ins.fPdkModel.resetData()
        AppGame.ins.roomModel.requestMatch()
    }

    private onStopMatch(data: any): void {
        // if (data == true) {
        //     // AppGame.ins.fPdkModel.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_RESET_SCENE);
        //     // AppGame.ins.fPdkModel.emit(UPDKHelper_hy.PDK_SELF_EVENT.PDK_CONTINUE_ACTIVE, true);
        //     this.setMatch(false);
        // } else {
        //     this.setMatch(true);
        // }
    }
     // 通知谁拥有特殊牌
     private onPeach3Chair(data: any) {
        pdk_Main_hy.ins.Spades3ChairId = data.Spades3ChairId//拥有黑桃3的玩家座位号
        pdk_Main_hy.ins.Hearts3ChairId = data.Hearts3ChairId//拥有红桃3的玩家座位号
        if(MPdk_hy.ins.gameCfgInfo) {
            setTimeout(()=>{
                if(this.node) {
                    if(MPdk_hy.ins.gameCfgInfo.WhoFistChuPai == 0) {
                        pdk_Main_hy.ins.peach3Node.getComponent(cc.Sprite).spriteFrame = pdk_Main_hy.ins.peach3Node.getComponent('USpriteFrames').getFrames('poker_51');
                        this.playBlack3Animation(data.Spades3ChairId);
                    } else if(MPdk_hy.ins.gameCfgInfo.WhoFistChuPai == 2) {
                        pdk_Main_hy.ins.peach3Node.getComponent(cc.Sprite).spriteFrame = pdk_Main_hy.ins.peach3Node.getComponent('USpriteFrames').getFrames('poker_35');
                        this.playBlack3Animation(data.Hearts3ChairId);
                    }
                }
            },3000)
        }
    }

    // 黑桃3动画
    playBlack3Animation(chairid: number ) {
        for (let index = 0; index < 3; index++) {
            const element = pdk_Main_hy.ins.playerList[index];
            if(element.chairId == chairid) {
                var worldPos = element.banker.convertToWorldSpaceAR(cc.Vec2.ZERO);
                var nodePos = pdk_Main_hy.ins.peach3Node.convertToNodeSpaceAR(worldPos)
                var action1 = cc.fadeIn(0.2);
                var actionMove = cc.moveTo(1, nodePos)
                var actionScale = cc.scaleTo(0.2, 0.5);
                var actionOut = cc.fadeOut(0.1);
                pdk_Main_hy.ins._music_mgr.playFirstOut(chairid == 0 ? true : false);
                var actionPlay1 = cc.callFunc(() => {
                    element.firstOutTip.active = true;
                    if(MPdk_hy.ins.gameCfgInfo["WhoFistChuPai"] == 0) {
                        element.firstOutTip.getComponent(cc.Sprite).spriteFrame = element.firstOutTip.getComponent("USpriteFrames").getFrames('black3_tip');
                       /* if(chairid == AppGame.ins.fPdkModel.gMeChairId) {
                            for (var i =0; i< element.handbox.childrenCount; i++){
                                //最后一张牌加上角标
                                var bankerFlag = (i == element.handbox.childrenCount - 1) ? true : false
                                element.handbox.children[element.handbox.childrenCount-1].getComponent(pdk_Card_hy).showCardFirstOut(bankerFlag)
                            } 
                        }*/
                    } else if(MPdk_hy.ins.gameCfgInfo["WhoFistChuPai"] == 2) {
                        element.firstOutTip.getComponent(cc.Sprite).spriteFrame = element.firstOutTip.getComponent("USpriteFrames").getFrames('hongtao');
                        /*if(chairid == AppGame.ins.fPdkModel.gMeChairId) {
                            for (var i =0; i< element.handbox.childrenCount; i++){
                                //最后一张牌加上角标
                                var bankerFlag = (i == element.handbox.childrenCount - 1) ? true : false
                                element.handbox.children[element.handbox.childrenCount-1].getComponent(pdk_Card_hy).showCardFirstOut(bankerFlag)
                            } 
                        }*/
                    } else {
                        // this.type_toggle_6.isChecked = true;
                    }
                    this.scheduleOnce(() => {
                        element.firstOutTip.active = false;
                    }, 2.5)
                })
                pdk_Main_hy.ins.peach3Node.runAction(cc.sequence(action1, actionMove,actionScale, actionOut, actionPlay1))
                return;
            }
            
        }
    }

    private onGameFapai(data: any) {
        this.playerList.forEach(element => {
            element.node.active = true;
            element.ready_ok.active = false;
        });
        this.cardRecord.active = true;
        this.resetRecordCard();
        this.countBox_1.active = false;
        this.countBox_2.active = false;
        this.setCardTypeActive(false, false);
        setTimeout(()=>{
            if (AppGame.ins.appStatus.status != EAppStatus.Game) return;
            this.scheduleOnce(()=>{
                // this.countBox_1.active = true;
                // this.countBox_2.active = true;
                data.cards.forEach(element => {
                    this.updateRecordCard(element)
                })
            },data.hasOwnProperty("isReconnect")?0:2)
        
            
            if(MPdk_hy.ins.gameCfgInfo && MPdk_hy.ins.gameCfgInfo.hasOwnProperty("Mode") && MPdk_hy.ins.gameCfgInfo["Mode"] == 2) {
                this.setCardTypeActive(true, false);
                for (var i =0; i<4;i++){
                    var poker = this.lastItem[i].getComponent(pdk_Card_hy)
                    poker.lockFlag = true
                    poker.showCardBack(true)
                    poker.showCardCheck(false)
                }
    
                // 发完牌之后
                if(data.hasOwnProperty("isReconnect")) {
                    if(data.hasOwnProperty("removecards")) {
                        this.setLastItems(data);
                        data.removecards.forEach(element => {
                            this.updateRecordCard(element)
                        })
                    }
                    if(data.hasOwnProperty("outcarddatas")) {
                        data.outcarddatas.forEach(element => {
                            this.updateRecordCard(element)
                        })
                    }
    
                } else {
                    this.scheduleOnce(()=>{
                        if(data.hasOwnProperty("removecards")) {
                            this.setLastItems(data);
                            this.scheduleOnce(()=>{
                                data.removecards.forEach(element => {
                                    this.updateRecordCard(element)
                                })
                            },0.5)
                        }
                    },2)
                }
    
            } else {
                // this.setCardTypeActive(false, true);/
                this.setCardTypeActive(false, false);
            }
        },data.hasOwnProperty("isReconnect")?0:2000)
    }

    setLastItems(data: any) {
        pdk_Main_hy.ins._music_mgr.playFanpai();
        for (var i =0; i<data.removecards.length;i++){
            var poker = this.lastItem[i].getComponent(pdk_Card_hy)
            poker.showCardBack(false)
            poker.setCardValue(data.removecards[i])
        }
    }

    setCardTypeActive(isShowType1:boolean, isShowType2:boolean) {
        this.cardType_1.active = isShowType1;
        this.cardType_2.active = isShowType2;
    }

    // 玩家出牌信息通知，更新记牌器
    onPlayerOutCardInfo(data: any) {
        // 断线重连不计算在内
        if (data.chairid != AppGame.ins.fPdkModel.gMeChairId && !data.hasOwnProperty("isReconnect")){
            data.cards.forEach(element => {
                this.updateRecordCard(element)
            })
        }
        //更新四张张底牌透明度
        if(MPdk_hy.ins.gameCfgInfo && MPdk_hy.ins.gameCfgInfo.hasOwnProperty("Mode") && MPdk_hy.ins.gameCfgInfo["Mode"] == 2) {
            for (var i =0; i<4;i++){
                var poker = this.lastItem[i].getComponent(pdk_Card_hy)
                if (data.cards.includes(poker._cardValue)){
                    poker.showCardCheck(true)
                }
            }
        }
    }

    /**
     * 更新房间玩家信息 
     * @param data 
     */
    private onUpdatePlayers(data: any) {
        UDebug.log("更新房间玩家信息---data" + JSON.stringify(data));
        if (!data) return
        this.playerDataList = data;
        for (const key in data) {
            if (data.hasOwnProperty(key)) {
                const element = data[key]
                let seatId = AppGame.ins.fPdkModel.getUISeatId(element.chairId)
                if (element.userStatus >= 0 && seatId != null) {
                    this.playerList[seatId].setChairId(element.chairId)
                    this.playerList[seatId].userId = element.userId;
                    if(AppGame.ins.currRoomKind == ERoomKind.Normal) {
                        this.playerList[seatId].setUserID(element.userId)
                    } else {
                        this.playerList[seatId].setUserID(element.nickName)
                    }
                    this.playerList[seatId].setScore((element.hasOwnProperty('score') && element.score) || 0)

                    // 断线重连执行逻辑
                    /* if(element.userStatus == 5) {
                        this.playerList[seatId].node.active = true;
                    } else {
                        this.playerList[seatId].node.active = seatId == 0? true:false
                    }*/
                    this.setPlayerPropUserId(seatId, element.userId);
                    if (element.userStatus == 0) {
                        if(MPdk_hy.ins.state != EPDKState.Gameing) {
                            if(MPdk_hy.ins.isFreeScene) {
                                this.playerList[seatId].node.getComponent("pdk_Player_hy").outbox.removeAllChildren();
                            }
                            this.playerList[seatId].node.active = false;
                            this.playerList[seatId].node.getComponent("pdk_Player_hy").headSpine.node.active = false;
                            MPdk_hy.ins.isFreeScene = false;
                            this.closePropPanelByUserId(seatId, element.userId);
                        }
                    } else {
                        this.playerList[seatId].node.active = true;
                        this.playerList[seatId].node.getComponent("pdk_Player_hy").headSpine.node.active = true;
                        this.playerList[seatId].node.getComponent("pdk_Player_hy").ready_ok.active = element.userStatus == 4?true:false;
                    }
                }
            }
        }
    }
    /**绑定道具节点userId聊天节点userID  */
    setPlayerPropUserId(index: number, userId: number) {
        this.playerList[index].prop.getComponent(GamePropManager).bindUserId(userId);
        this.playerList[index].chatProp.getComponent(VGameChatPropManager).bindUserId(userId);
    }
     /**通过userId获取道具节点 */
     getPropNodeByUserId(userId: number, callback: any = null) {
        for (let i = 0; i < this.playerList.length; i++) {
            let player = this.playerList[i];
            let bindUserId = player.prop.getComponent(GamePropManager).getBindUserId();
            if (bindUserId && (userId == bindUserId)) {
                callback && callback(player.prop);
            }
        }
    }

     /**通过userId获取聊天节点 */
     getChatPropNodeByUserId(userId: number, callback: any = null) {
        for (let i = 0; i < this.playerList.length; i++) {
            let player = this.playerList[i];
            let bindUserId = player.chatProp.getComponent(VGameChatPropManager).getBindUserId();
            if (bindUserId && (userId == bindUserId)) {
                callback && callback(player.chatProp);
            }
        }
    }
    
    /**关闭对应道具面板 */
    closePropPanelByUserId(index: number, userId: number) {
        this.playerList[index].prop.getComponent(GamePropManager).closePropPanelByUserId(userId);
    }
    // 游戏结果通知
    private onGameResultInfo(data: any) {
        UDebug.log("游戏结束------更新分数------data=" + JSON.stringify(data)); 
        AppGame.ins.closeUI(ECommonUI.UI_GAME_PROP)
        this.setBottomActive(true, false, !MPdk_hy.ins.roomInfoHy.bChatLimit);
        var result = data.gameresult
        for (var i = 0; i < result.length; i++) {
            const element = result[i]
            //更新分数
            this.setUserScore(element.chairid, element.currentscore);
        }
    }

    // 展示提示信息
    private showConcludeTip(data: any) {
        if(data.retCode == 0) {
            if(AppGame.ins.roleModel.useId != MPdk_hy.ins.roomInfoHy.roomUserId) {
                AppGame.ins.showTips(ULanHelper.GAME_HY.CHECK_OUT_TIP);
            }
        } else {
            if(this.menuCheckout.active) {
                AppGame.ins.showTips(data.errorMsg);
            }
        }
    }

    // 解散房间
    private onDissmisRoom(data: any) {
        if(data.retCode == 0) {
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type:EMsgType.EOK, data: data.retMsg, handler: UHandler.create((a) => {
                        AppGame.ins.fPdkModel.exitGame(); 
                }, this)
            });
        } 
        //this.onClickZhanji();
    }

    // 预解散房间
    private preDissmissRoom(data: any) {
        // this.onClickZhanji();
        if(data.retCode == 0) {
            let paramData = {
                leaveTime:data.dissmissTimeLeave,
                isPreDissRoom:true,
            }
            this.recordPanel.getComponent("pdk_recordPanel_hy").show(paramData);
        } 
        this._leftSeconds = 0; // 设置房间倒计时为0
    }

    // 再来一轮
    private onAgainOneGame(data: any) {

        if(data.hasOwnProperty("userId") && data.userId == AppGame.ins.roleModel.useId) {
            for (let index = 0; index < 3; index++) {
                const element = pdk_Main_hy.ins.playerList[index];
                element.spine_lock.active = false;
                if(index == 0) {
                    pdk_Main_hy.ins.tuoguan_btn.active = false;
                    element.selfHandCardCount.node.parent.active = false;
                    element.handbox.removeAllChildren();
                } 
                element.outbox.removeAllChildren();
                if(MPdk_hy.ins.gameCfgInfo && MPdk_hy.ins.gameCfgInfo.ShowCardNum || index == 0) {
                    element.handcount.string = "0";
                } else {
                    element.handcount.string = "";
                }
            }

            this.recordPanel.active && this.recordPanel.getComponent("pdk_recordPanel_hy").hide();
            this.againOneGame.active = false;
            this.ready_btn.active = true;
        }
    }

    // 房主点击再来一轮的监听
    onRoomUserClickAgainGame(data: any) {
        if(data.hasOwnProperty("roomInfo")) {
            if(data.roomInfo.roomUserId != AppGame.ins.roleModel.useId) {
                this.againOneGame.active = true;
                this.ready_btn.active = false;
            } else {
                this.resetGuanPosition(); 
            }
        }
    }
 
    // 展示再来一轮监听
    onShowAgainGame(data: any) {
        if(data.isShowBtn) {
            this.againOneGame.active = data.flag;
            this.ready_btn.active = !data.flag;
        } else {
            this.againOneGame.active = false;
            this.ready_btn.active = false;
        }
    }

    // 重置全关动画
    resetGuanPosition(): void {
        pdk_Main_hy.ins.mainLock.node.active = false;
    }

    //更新记牌器
    updateRecordCard(cardValue:number){
        var index = 12 - AppGame.ins.fPdkModel.pokerLibrary.getPokerValue(cardValue);
        AppGame.ins.fPdkModel.leftCardCount[index] = AppGame.ins.fPdkModel.leftCardCount[index] - 1;
        if(MPdk_hy.ins.gameCfgInfo && MPdk_hy.ins.gameCfgInfo.hasOwnProperty("Mode") && MPdk_hy.ins.gameCfgInfo["Mode"] == 2) {
            this.countBox_1.children[index].getComponent(cc.Label).string = AppGame.ins.fPdkModel.leftCardCount[index].toString();
            if(AppGame.ins.fPdkModel.leftCardCount[index] == 0) {
                this.countBox_1.children[index].getComponent(cc.Label).node.color = cc.color(113, 73, 60)
            } else if(AppGame.ins.fPdkModel.leftCardCount[index] > 0 && AppGame.ins.fPdkModel.leftCardCount[index] < 4) {
                this.countBox_1.children[index].getComponent(cc.Label).node.color = cc.color(232, 229, 209)
            } else if(AppGame.ins.fPdkModel.leftCardCount[index] == 4) {
                this.countBox_1.children[index].getComponent(cc.Label).node.color = cc.color(201, 67, 53)
            }

        } else {
            this.countBox_2.children[index].getComponent(cc.Label).string = AppGame.ins.fPdkModel.leftCardCount[index].toString();
            if(AppGame.ins.fPdkModel.leftCardCount[index] == 0) {
                this.countBox_2.children[index].getComponent(cc.Label).node.color = cc.color(113, 73, 60)
            } else if(AppGame.ins.fPdkModel.leftCardCount[index] > 0 && AppGame.ins.fPdkModel.leftCardCount[index] < 4) {
                this.countBox_2.children[index].getComponent(cc.Label).node.color = cc.color(232, 229, 209)
            } else if(AppGame.ins.fPdkModel.leftCardCount[index] == 4) {
                this.countBox_2.children[index].getComponent(cc.Label).node.color = cc.color(201, 67, 53)
            }

        }
    }

    //显示记牌器
    resetRecordCard(){
        if(MPdk_hy.ins.gameCfgInfo && MPdk_hy.ins.gameCfgInfo.hasOwnProperty("Mode")) {
            if(MPdk_hy.ins.gameCfgInfo["Mode"] == 2) {
                AppGame.ins.fPdkModel.leftCardCount = [4,4,4,4,4,4,4,4,4,4,4,4,4];
                this.setCountBoxContent(this.countBox_1);
            } else if(MPdk_hy.ins.gameCfgInfo["Mode"] == 1) {
                AppGame.ins.fPdkModel.leftCardCount = [1,3,4,4,4,4,4,4,4,4,4,4,4];
                this.setCountBoxContent(this.countBox_2);
            } else if(MPdk_hy.ins.gameCfgInfo["Mode"] == 0) {
                AppGame.ins.fPdkModel.leftCardCount = [1,1,3,4,4,4,4,4,4,4,4,4,4];
                this.setCountBoxContent(this.countBox_2);
            }
        }
    }

    setCountBoxContent(boxNode: cc.Node) {
        for(var i = 0 ;i<boxNode.childrenCount ;i++){
            boxNode.children[i].getComponent(cc.Label).string = AppGame.ins.fPdkModel.leftCardCount[i].toString()
            boxNode.children[i].getComponent(cc.Label).node.color = AppGame.ins.fPdkModel.leftCardCount[i] == 4? cc.color(201, 67, 53) : cc.color(232, 229, 209)
        }
    }

    // 点击再来一轮
    onClickAgainGame() {
        this._music_mgr.playClick();
        AppGame.ins.fPdkModel.sendAgain();
        this.resetGuanPosition(); 
    }

     /**超时消息 */
     onShowTimeOut(data: any) {
        this.setTimeOutTime(data.idleLeave);
        // this.timeOutLbl.node.parent.active = true;
        this.timeOutLbl.node.parent.opacity = 0;
        this._timeOutSeconds = data.idleLeave;
    }

     /**设置超时时间 */
     setTimeOutTime(seconds: number) {
         if(seconds <= 600) {
            this.timeOutLbl.node.parent.opacity = 255;
         }
        this.timeOutLbl.string = '自动解散:' +(UDateHelper.secondsToTime(seconds).length == 8?UDateHelper.secondsToTime(seconds).substr(3,5):"00:00");
    }

    // 点击战绩
    onClickZhanji() {
        this._music_mgr.playClick();
        let paramData = {
            leaveTime:15,
            isPreDissRoom:false,
        }
        this.recordPanel.getComponent("pdk_recordPanel_hy").show(paramData);
    }

    // 点击托管
    onClickTuoguan(event: Event, index: number) {
        // this.tuoguanPanel.active = !this.tuoguanPanel.active;
        pdk_Main_hy.ins._music_mgr.playClick();
        if (index == 0) { // 取消托管
            AppGame.ins.fPdkModel.sendTrust(0);
            // this.tuoguanPanel.active = false;
        } else if (index == 1) { // 托管
            AppGame.ins.fPdkModel.sendTrust(1);
        }
    }

    onPlayCfgBtn() {
        if(AppGame.ins.fPdkModel.gameCfgInfo) {
            pdk_Main_hy.ins._music_mgr.playClick();
            this.playCfgPanel.getComponent("pdk_playPanel_hy").setPlayPanelInfo();
        } else {
            AppGame.ins.showTips("服务器连接出错，请稍后再试");
        }
    }

    private intoCharge(): void {
        AppGame.ins.hallModel.requestAgentLevel(EAgentLevelReqType.default);
    }


    /**获取到代理等级 */ 
    onAgentLevelRes(data: any) {
        if(AppGame.ins.hallModel.reqAgentLevelType != EAgentLevelReqType.default) return;
        if(!data || data.retCode != 0 || !data.hasOwnProperty('level')) {
            AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: false, index: 3 });        
            return ;
        }
        if(data.level >= 5) {
            AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: false, index: 2 });
        } else {
            AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: false, index: 3 });        
        }
    }
    // 复制牌局编号
    copyRecordID() {
        pdk_Main_hy.ins._music_mgr.playClick();
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked(pdk_Main_hy.ins.recordid);
    }

    copyRoomID() {
        pdk_Main_hy.ins._music_mgr.playClick();
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked(`${MPdk_hy.ins.roomInfoHy.roomId}`);
    }


    //点击菜单
    onClickMenu() {
        pdk_Main_hy.ins._music_mgr.playClick();
        this.menu.active = !this.menu.active
    }

    /*
        data.headerId = this.findHeadId(pdk_Main_hy.ins.playerList[i].chairId); 
                data.nickName = this.findHeadId(pdk_Main_hy.ins.playerList[i].chairId, true, true);
                data.headImgUrl =  this.findHeadId(pdk_Main_hy.ins.playerList[i].chairId, true);
                AppGame.ins.gamebaseModel.emit(MBaseGameModel.SC_UPDATE_CHAT_MESSAGE, data);
    */ 
    findHeadId(chairId:number, isGetHeadUrl: boolean = false, isGetNickName: boolean = false): any {
        for (const key in pdk_Main_hy.ins.playerDataList) {
            let element = pdk_Main_hy.ins.playerDataList[key];
            if (element.userId == chairId) {
                if(isGetHeadUrl) {
                    if(isGetNickName) {
                        return element.nickName;
                    }
                    return element.headImgUrl;
                } else {
                    return element.headId
                }
            }
        }
        return null;
    }


    // 点击聊天
    onClickChat() {
        pdk_Main_hy.ins._music_mgr.playClick();
        AppGame.ins.showUI(ECommonUI.UI_CHAT_HY);
    }

    /**邀请 */
    onClickInvite() {
        pdk_Main_hy.ins._music_mgr.playClick();
        let headId = 1;
        for (const key in pdk_Main_hy.ins.playerDataList){
            let element =  pdk_Main_hy.ins.playerDataList[key];
            if (element.userId == MPdk_hy.ins.roomInfoHy.roomUserId) {
                headId = element.headId;
                break;
            }
        }
        AppGame.ins.showUI(ECommonUI.UI_SHARED_HY,{eGameType:EGameType.PDK_HY,roomInfo:MPdk_hy.ins.roomInfoHy,headId:headId});
    }

    /**准备 */
    onClickReady() {
        pdk_Main_hy.ins._music_mgr.playClick();
        AppGame.ins.fPdkModel.sendReady();
    }

    /**旁观 */
    onClickLookOn() {
        // AppGame.ins.fPdkModel.sendLookOn();
        // MPdk_hy.ins.sendLookOn();
    }

    /**下局旁观 */
    onClickLookOnNext() {
        // MTBNNModel_hy.ins.sendLookOnNext(this.lookOnNext_toggle.isChecked);
    }

    /**设置旁观 */
    setLookOn(show: boolean) {
        // this.lookOn_toggle.isChecked = show;
        // this.lookOn_toggle.interactable = show;
    }

    /**显示下局旁观 */
    showLookOnNext(show: boolean) {
        // this.lookOn_toggle.node.active = !show;
    }

    /**设置准备 */
    showReady(show: boolean) {
        this.ready_btn.active = show;
    }

    onShowContinueGame(isShow: boolean) {
        this.continueGame.active = isShow;
    }

    // 显示提示文本
    onShowTips(content: string) {
        var action1 = cc.fadeIn(0.2);
        var action2 = cc.fadeOut(0.2);
        var actionPlay1 = cc.callFunc(() => {
            this.scheduleOnce(() => {
                this.tips.runAction(action2);
            }, 1.5);
        })
        UNodeHelper.getComponent(this.tips, "content", cc.Label).string = content;
        this.tips.runAction(cc.sequence(action1, actionPlay1));
    }

    onShowTipsBlack3(content: string = '',isShow: boolean = false) {
        var action1 = cc.fadeIn(0.2);
        var action2 = cc.fadeOut(0.2);
        UNodeHelper.getComponent(this.tips, "content", cc.Label).string = content;
        if(isShow) {
            this.tips.runAction(action1);
        } else {
            this.tips.runAction(action2);
        }
    }

    //双击收回选中的牌
    onMainNodeTouch() {
        this._touchTag = 0;
        this._lastTouchTime = new Date().getTime();
        this.touchNode.on(cc.Node.EventType.TOUCH_END, this.touchEndMainNode, this)
    }

    offMainNodeTouch() {
        // this.touchNode.off(cc.Node.EventType.TOUCH_END, this.touchEndMainNode, this)
        // 把选择的牌都拉下来
        this.cardDown();
    }

    cardDown() {
        let playerItem = pdk_Main_hy.ins.playerList[0].handbox;
        if (playerItem.childrenCount == 0) return;
        AppGame.ins.fPdkModel.clearSelectPokers();// 清除选中的牌
        for (var i = 0; i < playerItem.childrenCount; i++) {
            const poker: pdk_Card_hy = playerItem.children[i].getComponent(pdk_Card_hy)
            poker.lockFlag = false
            poker.setCardDown();
        }
    }

    touchEndMainNode() {
        var self = this;
        var nowTime = new Date().getTime();
        if (nowTime - self._lastTouchTime > 500) {
            self._touchTag = 0;
        } else {
            self._touchTag += 1;
            if (self._touchTag >= 1) {
                self._touchTag = 0;
                // 把选择的牌都拉下来
                self.cardDown();
            }
        }
        self._lastTouchTime = nowTime;
    }

}