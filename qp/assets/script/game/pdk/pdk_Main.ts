
import UGame from "../../public/base/UGame";
import USpriteFrames from "../../common/base/USpriteFrames";
import MBaseGameModel from "../../public/hall/MBaseGameModel";
import VFyxbdNode from "../common/VFyxbdNode";
import AppGame from "../../public/base/AppGame";
import UNodeHelper from "../../common/utility/UNodeHelper";
import ULocalStorage from "../../common/utility/ULocalStorage";
import { ToBattle } from "../../common/base/UAllClass";
import ULanHelper from "../../common/utility/ULanHelper";
import { EEnterRoomErrCode, ECommonUI, ELevelType, EGameType, ETipType, ERoomKind, EAppStatus } from "../../common/base/UAllenum";
import UHandler from "../../common/utility/UHandler";
import UDebug from "../../common/utility/UDebug";
import { Ddz } from "../../common/cmd/proto";
import UAudioManager from "../../common/base/UAudioManager";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import VPDKMenu from "./pdk_MenuPanel";
import UPDKHelper, { EPDKState } from "./pdk_Helper";
import pdk_MatchPanel from "./pdk_MatchPanel";
import pdk_ResultPanel from "./pdk_resultPanel";
import pdk_Player from "./pdk_Player";
import pdk_ActionPanel from "./pdk_actionPanel";
import { CFG_NoticeItem } from "../../config/cfg_notice";
import pdk_Music from "./pdk_Music";
import UAudioRes from "../../common/base/UAudioRes";
import { ChatMsgType, ReceiveChairidType } from "./poker/PDKEnum";
import pdk_Card from "./pdk_Card";
import MRoomModel from "../../public/hall/room_zjh/MRoomModel";
import UDDZHelper from "../ddz/ddz_Helper";
import UStringHelper from "../../common/utility/UStringHelper";
import MPdk, { PDK_SCALE } from "./model/MPdk";
import { ZJH_SCALE } from "../../public/hall/lobby/VHall";
import GamePropManager from "../../public/GameProp/GamePropManager";
import VGameChatPropManager from "../../public/gamechat/VGameChatPropManager";
import { NEWS } from "../../public/hall/lobby/MHall";



/**
 * 作用:斗地主入口逻辑,处理框架，公共类逻辑
 */

const { ccclass, property } = cc._decorator;

@ccclass
export default class pdk_Main extends UGame {
    @property(cc.Node) menu: cc.Node = null;
    @property(cc.Label) baseScore: cc.Label = null;
    @property(pdk_MatchPanel) match: pdk_MatchPanel = null;
    @property(cc.Node) tuoguanPanel: cc.Node = null;
    @property(pdk_Player) playerList: pdk_Player[] = [];
    @property(pdk_ActionPanel) action: pdk_ActionPanel = null;
    @property(sp.Skeleton) Spine: sp.Skeleton = null;
    @property(sp.Skeleton) spWashCard: sp.Skeleton = null;
    @property(cc.Node) peach3Node: cc.Node = null;
    @property(pdk_ResultPanel) result: pdk_ResultPanel = null;
    @property(cc.Label) recordId: cc.Label = null;
    @property(cc.Node) countItem: cc.Node = null;
    @property(cc.Node) cardRecord: cc.Node = null;
    @property(cc.Node) countBox_1: cc.Node = null;

    @property(sp.Skeleton) mainLock: sp.Skeleton = null;
    // @property(cc.Prefab) chatPrefab: cc.Prefab = null;
    // @property(cc.Node) chatPanel: cc.Node = null;
    @property(cc.Node) touchNode: cc.Node = null;
    @property(cc.Node) continueGame: cc.Node = null;
    @property(cc.Node) tips: cc.Node = null;
    public playerDataList: any;//用户数据信息
    private _touchTag: number = 0;
    private _lastTouchTime: number = 0;
    private _enterMinScore: number = 0;


    /**单例 */
    private static _ins: pdk_Main;
    static get ins(): pdk_Main {
        return pdk_Main._ins;
    }

    baseGameModel: MBaseGameModel = null;
    /**重连不在游戏房间内 */
    fromeDisconnect: boolean = false;
    _music_mgr: pdk_Music = null;
    black3Charid: number = 0;
    isShowBuchuBtn: boolean = false;
    exceptTableId: number = -1;
    _chatMain: cc.Node = null;
    recordid:any;
    clockShowResult: any;
    clockStartMatch: any;
    clockActionId: any;

    protected init(): void {
        pdk_Main._ins = this;
        this._music_mgr = new pdk_Music(this.node.getComponent(UAudioRes));
        this.menu.active = false;
        this.fromeDisconnect = false;
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
        //AppGame.ins.pdkModel.setPlayerInfo(roleinfo);
        if (data) {
            let dt = data as ToBattle;
            AppGame.ins.pdkModel.saveRoomInfo(dt.roomData);

            if (dt) {
                AppGame.ins.pdkModel.currentDizhu = dt.roomData.floorScore;
                if (!dt.fromReconnet) {
                    this.waitbattle();
                }
                else {
                    // AppGame.ins.pdkModel.emit(UPDKHelper.PDK_SELF_EVENT.PDK_RESET_SCENE);
                }
            }
        }
    }

    // // 进入房间失败消息
    // protected enter_room_fail(errorCode: number, errMsg?:string): void {
    //     let msg = errMsg;
    //     if(errorCode == 7){
    //         msg =  "您的金币不足，该房间需要" + this._enterMinScore*PDK_SCALE + "金币以上才可以下注";
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

    protected enter_room_fail(errorCode: number, errMsg?: string): void {
        let msg = errMsg
        if (!msg) {
            msg = ULanHelper.GAME_INFO_ERRO;
        }
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: 1, data: msg, handler: UHandler.create(() => {
                clearInterval(pdk_Main.ins.clockShowResult);
                clearInterval(pdk_Main.ins.clockStartMatch);
                AppGame.ins.loadLevel(ELevelType.Hall, AppGame.ins.roomModel.GameID);
            }, this)
        });
    }

    start() {
        this._music_mgr.playGamebg();
        // this.initChatPanel();

    }

    onEnable() {
        super.onEnable();
        AppGame.ins.pdkModel.run();
        AppGame.ins.pdkModel.on(UPDKHelper.PDK_SELF_EVENT.PDK_SC_TS_START_MATCH, this.onStartMatch, this);
        AppGame.ins.pdkModel.on(UPDKHelper.PDK_SELF_EVENT.PDK_SC_TS_CANCLE_MATCH, this.onStopMatch, this);
        AppGame.ins.pdkModel.on(UPDKHelper.PDK_EVENT.PDK_GAME_START, this.onGamestart, this);
        AppGame.ins.pdkModel.on(UPDKHelper.PDK_EVENT.PDK_GAME_OWNREDPEACH3CHAIR, this.onPeach3Chair, this);
        AppGame.ins.pdkModel.on(UPDKHelper.PDK_EVENT.PDK_GAMESCENE_FREE, this.onSenceGameFree, this);
        AppGame.ins.pdkModel.on(UPDKHelper.PDK_EVENT.PDK_GAMESCENE_PLAY, this.onSenceGamePlay, this);
        AppGame.ins.pdkModel.on(UPDKHelper.PDK_EVENT.PDK_GAME_NOTIFY_CHUPAI_INFO, this.onPlayerOutCardInfo, this);

        AppGame.ins.pdkModel.on(UPDKHelper.PDK_SELF_EVENT.PDK_UPDATE_PLAYERS_EVENT, this.onUpdatePlayers, this);
        AppGame.ins.pdkModel.on(UPDKHelper.PDK_SELF_EVENT.PDK_SHOW_CONTINUE_GAME, this.onShowContinueGame, this);
        AppGame.ins.pdkModel.on(UPDKHelper.PDK_EVENT.PDK_GAME_NOTIFY_GAME_RESULT, this.onGameResultInfo, this);
        cc.game.on(cc.game.EVENT_SHOW, this.game_show, this);

    }

    onDisable() {
        super.onDisable();
        this._music_mgr.stop();
        AppGame.ins.pdkModel.exit();
        AppGame.ins.pdkModel.off(UPDKHelper.PDK_SELF_EVENT.PDK_SC_TS_START_MATCH, this.onStartMatch, this);
        AppGame.ins.pdkModel.off(UPDKHelper.PDK_SELF_EVENT.PDK_SC_TS_CANCLE_MATCH, this.onStopMatch, this);
        AppGame.ins.pdkModel.off(UPDKHelper.PDK_EVENT.PDK_GAME_START, this.onGamestart, this);
        AppGame.ins.pdkModel.off(UPDKHelper.PDK_EVENT.PDK_GAME_OWNREDPEACH3CHAIR, this.onPeach3Chair, this);
        AppGame.ins.pdkModel.off(UPDKHelper.PDK_EVENT.PDK_GAMESCENE_FREE, this.onSenceGameFree, this);
        AppGame.ins.pdkModel.off(UPDKHelper.PDK_EVENT.PDK_GAMESCENE_PLAY, this.onSenceGamePlay, this);
        AppGame.ins.pdkModel.off(UPDKHelper.PDK_EVENT.PDK_GAME_NOTIFY_CHUPAI_INFO, this.onPlayerOutCardInfo, this);
        AppGame.ins.pdkModel.off(UPDKHelper.PDK_SELF_EVENT.PDK_UPDATE_PLAYERS_EVENT, this.onUpdatePlayers, this);
        AppGame.ins.pdkModel.off(UPDKHelper.PDK_SELF_EVENT.PDK_SHOW_CONTINUE_GAME, this.onShowContinueGame, this);
        AppGame.ins.pdkModel.off(UPDKHelper.PDK_EVENT.PDK_GAME_NOTIFY_GAME_RESULT, this.onGameResultInfo, this);
        cc.game.off(cc.game.EVENT_SHOW, this.game_show, this);

    }

    /*******************  **************************/
    /** 等待游戏开始*/
    waitbattle(): void {
        this.setMatch(true);
    }

    //重连成功，游戏已经结束,房间信息置空，方便退出
    protected reconnect_in_game_but_no_in_gaming(): void {
        this.match.node.active = false
        this.onShowContinueGame(false);
        pdk_Main.ins.action.node.active = false;
        for (var k in this.playerList) {
            this.playerList[k].onClearDesk();
        }
        AppGame.ins.pdkModel.resetData();
    }

    public setMatch(b: boolean) {
        if (this.match)
            this.match.node.active = b
    }

    private onStartMatch(data: any): void {
        this.cardRecord.active = false;
        this.recordId.node.parent.active = false;
        UDebug.log("清理桌子");
        // setTimeout(() => {
        //     //重置桌子
        //     UDebug.log("清理桌子-------------------2222222222");
        // },AppGame.ins.currRoomKind == ERoomKind.Club?3000:0)
        this.match.node.active = true
        AppGame.ins.pdkModel.emit(UPDKHelper.PDK_SELF_EVENT.PDK_CLEAR_DESK)

        //进入房间
        AppGame.ins.pdkModel.resetData()
        if (AppGame.ins.currRoomKind != ERoomKind.Club) {
            AppGame.ins.roomModel.requestMatch(true, pdk_Main.ins.exceptTableId)
        }
    }

    private onStopMatch(data: any): void {
        if (data == true) {
            // AppGame.ins.pdkModel.emit(UPDKHelper.PDK_SELF_EVENT.PDK_RESET_SCENE);
            // AppGame.ins.pdkModel.emit(UPDKHelper.PDK_SELF_EVENT.PDK_CONTINUE_ACTIVE, true);
            this.setMatch(false);
        } else {
            this.setMatch(true);
        }
    }

    private onSenceGameFree(data: any) {
        if (AppGame.ins.currRoomKind == ERoomKind.Club) {
            this.match.node.active = true
        }
        pdk_Main.ins.exceptTableId = data.hasOwnProperty("tableid") ? data.hasOwnProperty("tableid") : -1;
    }

    private onSenceGamePlay(data: any) {
        pdk_Main.ins.exceptTableId = data.hasOwnProperty("tableid") ? data.hasOwnProperty("tableid") : -1;

    }


    private onPeach3Chair(data: any) {
        pdk_Main.ins.black3Charid = data.chairid;
        setTimeout(()=>{
            if (AppGame.ins.appStatus.status != EAppStatus.Game) return;
                this.playBlack3Animation(data.chairid);
        },3000)
    }
    // 黑桃3动画
    playBlack3Animation(chairid: number) {
        for (let index = 0; index < 3; index++) {
            const element = pdk_Main.ins.playerList[index];
            if (element.chairId == chairid) {
                var worldPos = element.banker.convertToWorldSpaceAR(cc.Vec2.ZERO);
                var nodePos = pdk_Main.ins.peach3Node.convertToNodeSpaceAR(worldPos)
                cc.warn("动画播放-----------");
                var action1 = cc.fadeIn(0.2);
                var actionMove = cc.moveTo(1, nodePos)
                var actionScale = cc.scaleTo(0.2, 0.5);
                var actionOut = cc.fadeOut(0.3);
                pdk_Main.ins._music_mgr.playFirstOut(chairid == 0 ? true : false);
                var actionPlay1 = cc.callFunc(() => {
                    element.firstOutTip.active = true;
                    this.scheduleOnce(() => {
                        element.firstOutTip.active = false;
                        /*if(chairid == AppGame.ins.pdkModel.gMeChairId) {
                            for (var i =0; i< element.handbox.childrenCount; i++){
                                //最后一张牌加上角标
                                var bankerFlag = (i == element.handbox.childrenCount - 1) ? true : false
                                element.handbox.children[element.handbox.childrenCount-1].getComponent(pdk_Card).showCardFirstOut(bankerFlag)
                            } 
                        }*/

                    }, 2.5)
                })
                pdk_Main.ins.peach3Node.runAction(cc.sequence(action1, actionMove,actionScale, actionOut, actionPlay1));
            }

        }
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

    private onGamestart(data: any) {
        AppGame.ins.closeUI(ECommonUI.UI_CHAT_HY);
        this.playerList.forEach(element => {
            element.node.active = true;
        });

        this.setCardRecordUI();
        pdk_Main.ins.isShowBuchuBtn = data.hasOwnProperty('allowedpass')?data.allowedpass:false;
        this.cardRecord.active = AppGame.ins.currRoomKind == ERoomKind.Club? false : true; 
        this.resetRecordCard();
        this.countBox_1.active = false;
        //播放洗牌动画
        if (!data.isReconnect){
            pdk_Main.ins.setMatch(false)
            this.playWashCardSpine()  
        }
        this.scheduleOnce(() => {
            this.countBox_1.active = true;
            data.cards.forEach(element => {
                this.updateRecordCard(element)
            })
        }, data.hasOwnProperty("isReconnect") ? 0 : 3)

        // 发完牌之后
        if (data.hasOwnProperty("isReconnect")) {
            if (data.hasOwnProperty("outcarddatas")) {
                data.outcarddatas.forEach(element => {
                    this.updateRecordCard(element)
                })
            }
        }

    }

    setCardRecordUI() {
        //记牌器个数
        this.countBox_1.removeAllChildren();
        for (var i = 0; i < 13; i++) {
            let ins = cc.instantiate(this.countItem);
            ins.setParent(this.countBox_1)
            ins.width = 33
        }
    }

    //显示记牌器
    resetRecordCard() {
        AppGame.ins.pdkModel.leftCardCount = [1, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4];
        for (var i = 0; i < this.countBox_1.childrenCount; i++) {
            this.countBox_1.children[i].getComponent(cc.Label).string = AppGame.ins.pdkModel.leftCardCount[i].toString()
            this.countBox_1.children[i].getComponent(cc.Label).node.color = AppGame.ins.pdkModel.leftCardCount[i] == 4 ? cc.color(201, 67, 53) : cc.color(232, 229, 209)
        }
    }

    //更新记牌器
    updateRecordCard(cardValue: number) {
        var index = 12 - AppGame.ins.pdkModel.pokerLibrary.getPokerValue(cardValue);

        // UDebug.log("index == "+index+"-----cardValue = "+cardValue);
        AppGame.ins.pdkModel.leftCardCount[index] = (AppGame.ins.pdkModel.leftCardCount[index] - 1 < 0) ? 0 : (AppGame.ins.pdkModel.leftCardCount[index] - 1);
        if (this.countBox_1.childrenCount > index) {
            if (AppGame.ins.pdkModel.leftCardCount[index] == 0) {
                this.countBox_1.children[index].getComponent(cc.Label).node.color = cc.color(113, 73, 60)
            } else if (AppGame.ins.pdkModel.leftCardCount[index] > 0 && AppGame.ins.pdkModel.leftCardCount[index] < 4) {
                this.countBox_1.children[index].getComponent(cc.Label).node.color = cc.color(232, 229, 209)
            } else if (AppGame.ins.pdkModel.leftCardCount[index] == 4) {
                this.countBox_1.children[index].getComponent(cc.Label).node.color = cc.color(201, 67, 53)
            }
            this.countBox_1.children[index].getComponent(cc.Label).string = AppGame.ins.pdkModel.leftCardCount[index].toString();
        }

    }


    // 玩家出牌信息通知，更新记牌器
    onPlayerOutCardInfo(data: any) {
        // 断线重连不计算在内
        if (data.chairid != AppGame.ins.pdkModel.gMeChairId && !data.hasOwnProperty("isReconnect")) {
            data.cards.forEach(element => {
                this.updateRecordCard(element)
            })
        }
    }


    /**
     * 更新房间玩家信息
     * @param data 
     */
    private onUpdatePlayers(data: any) {
        if (!data) return
        this.playerDataList = data;
        for (const key in data) { 
            if (data.hasOwnProperty(key)) {
                const element = data[key]
                let seatId = AppGame.ins.pdkModel.getUISeatId(element.chairId)
                if (element.userStatus >= 0 && seatId != null) {
                    this.playerList[seatId].setChairId(element.chairId)
                    if (seatId != 0) {
                        // nickName
                        if(AppGame.ins.currRoomKind == ERoomKind.Normal) {
                            this.playerList[seatId].setUserID(UStringHelper.coverName(element.userId.toString()))
                        } else {
                            this.playerList[seatId].setUserID(element.nickName)
                        }
                    } else {
                        if(AppGame.ins.currRoomKind == ERoomKind.Normal) {
                            this.playerList[seatId].setUserID(element.userId)
                        } else {
                            this.playerList[seatId].setUserID(element.nickName)
                        }
                    }
                    this.playerList[seatId].setScore(element.score)
                    this.setPlayerPropUserId(seatId, element.userId);
                    // 断线重连执行逻辑
                    if (element.userStatus == 5) {
                        this.playerList[seatId].node.active = true;
                    } else {
                        this.playerList[seatId].node.active = seatId == 0 ? true : false
                    }
                }
            }
        }
    }

    /**绑定道具,聊天节点userId */
    setPlayerPropUserId(index: number, userId: number) {
        this.playerList[index].prop.getComponent(GamePropManager).bindUserId(userId);
        this.playerList[index].chatProp.getComponent(VGameChatPropManager).bindUserId(userId);
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
    
    // 游戏结果通知
    private onGameResultInfo(data: any) {
        AppGame.ins.closeUI(ECommonUI.UI_GAME_PROP)
        AppGame.ins.closeUI(ECommonUI.UI_CHAT_HY)
    
        var result = data.gameresult
        for (var i = 0; i < result.length; i++) {
            const element = result[i]
            //更新分数
            this.setUserScore(element.chairid, element.currentscore);
        }

        this.clockShowResult = setTimeout(() => {
            if (this.node) {
                pdk_Main.ins.result.show(data.gameresult, data.allgreatestchair);
            }
        }, 2500)
        this.clockStartMatch = setTimeout(() => {
            if (AppGame.ins.currRoomKind == ERoomKind.Club && this.node) {
                UDebug.Log("自动开始匹配")
                AppGame.ins.pdkModel.emit(UPDKHelper.PDK_SELF_EVENT.PDK_SC_TS_START_MATCH);
            }
        }, 9000);


    }

    // 设置更新
    setUserScore(chairid: number, score: number) {
        let seatId = AppGame.ins.pdkModel.getUISeatId(chairid);
        this.playerList[seatId].setScore(score);
    }

    // 点击托管
    onClickTuoguan(event: Event, index: number) {
        // this.tuoguanPanel.active = !this.tuoguanPanel.active;
        pdk_Main.ins._music_mgr.playClick();
        if (index == 0) { // 取消托管
            AppGame.ins.pdkModel.sendTrust(0);
            // this.tuoguanPanel.active = false;
        } else if (index == 1) { // 托管
            AppGame.ins.pdkModel.sendTrust(1);
        }
    }

    // 复制牌局编号
    copyRecordID() {
        pdk_Main.ins._music_mgr.playClick();
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked(pdk_Main.ins.recordid);
    }

    //点击菜单
    onClickMenu() {
        pdk_Main.ins._music_mgr.playClick();
        this.menu.active = !this.menu.active
    }

    // 点击聊天
    onClickChat() {
        pdk_Main.ins._music_mgr.playClick();
        AppGame.ins.showUI(ECommonUI.UI_CHAT_HY);
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
        let playerItem = pdk_Main.ins.playerList[0].handbox;
        if (playerItem.childrenCount == 0) return;
        AppGame.ins.pdkModel.clearSelectPokers();// 清除选中的牌
        for (var i = 0; i < playerItem.childrenCount; i++) {
            const poker: pdk_Card = playerItem.children[i].getComponent(pdk_Card)
            poker.lockFlag = false
            poker.setCardDown();
            poker.showCardCheck(false)
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

    //切到前台，停止可能正在播放的动画
    game_show(){
        this.spWashCard.node.stopAllActions()
        this.spWashCard.node.active = false
    }

}