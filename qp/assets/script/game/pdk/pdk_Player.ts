
import UNodeHelper from "../../common/utility/UNodeHelper";
import AppGame from "../../public/base/AppGame";
import UStringHelper from "../../common/utility/UStringHelper";
import UDebug from "../../common/utility/UDebug";
import pdk_Main from "./pdk_Main";
import { PDK_SCALE, PDK_SCALE_100 } from "./model/MPdk";
import UClock from "../../common/utility/UClock";
import UResManager from "../../common/base/UResManager";
import pdk_Card from "./pdk_Card";
import {CardType, ChatMsgType, PDKCardDataUtil } from "./poker/PDKEnum";
import pdk_Music from "./pdk_Music";
import UPDKHelper from "./pdk_Helper";
import { EAppStatus, ECommonUI, ERoomKind } from "../../common/base/UAllenum";
import USpriteFrames from "../../common/base/USpriteFrames";
import { chatMsgItem } from "../../common/utility/ULocalStorage";

const { ccclass, property } = cc._decorator;
/**
 * 作用:处理单个玩家相关逻辑
 */
@ccclass

export default class pdk_Player extends cc.Component {
    @property(sp.Skeleton) headSpine: sp.Skeleton = null;
    @property(sp.Skeleton) cardTypeSpine: sp.Skeleton = null;
    @property(sp.Skeleton) warningSpine: sp.Skeleton = null;
    @property(cc.Node) handbox: cc.Node = null;
    @property(cc.Node) outbox: cc.Node = null;
    @property(cc.Node) tuoguan: cc.Node = null;
    @property(cc.Label) handcount: cc.Label = null;
    @property(cc.Label) selfHandCardCount: cc.Label = null;
    @property(cc.Label) winScore: cc.Label = null;
    @property(cc.Label) loseScore: cc.Label = null;
    @property(cc.Prefab) card: cc.Prefab = null;
    @property(cc.Prefab) emojItem: cc.Prefab = null;
    @property(cc.Prefab) textItem: cc.Prefab = null;
    @property(cc.Label) userid: cc.Label = null;
    @property(cc.Label) score: cc.Label = null;
    @property(cc.Label) clock: cc.Label = null;
    @property(cc.Sprite) cdTime: cc.Sprite = null;
    @property(cc.Node) callTip: cc.Node = null;
    @property(cc.Node) banker: cc.Node = null;
    // @property(cc.Node) tuoguanBtn: cc.Node = null;
    // @property(cc.Node) chatBtn: cc.Node = null;
    @property(cc.Node) bottomRight: cc.Node = null;

    @property(cc.Node) firstOutTip: cc.Node = null;
    @property(cc.Node) spine_lock: cc.Node = null;
    @property(cc.Node) chat: cc.Node = null;
    @property(cc.Node) prop: cc.Node = null;
    @property(cc.Node) chatProp: cc.Node = null;

    //扑克牌缓存池
    private cardPool: Array<pdk_Card>= [];
    private cardRun: Array<pdk_Card> = [];
    //当前玩家的椅子ID
    public chairId: number = 0;
    //发牌手牌个数
    static HAND_COUNT_MAX:number = 16;
    //时钟序号
    private clockId:any = null;
    //自己的手牌数据
    private handCardData: number[] = [];
    private isTrust: boolean = false; // 用户是否托管
    //
    private totalTurnTime = 0
    onLoad(){
        this.node.active = false
        AppGame.ins.pdkModel.on(UPDKHelper.PDK_EVENT.PDK_GAME_START, this.onGamestart, this);
        AppGame.ins.pdkModel.on(UPDKHelper.PDK_EVENT.PDK_GAMESCENE_FREE, this.onSenceGameFree, this);
        AppGame.ins.pdkModel.on(UPDKHelper.PDK_EVENT.PDK_GAME_PLAYER_CHUPAI, this.onOutCard, this);
        AppGame.ins.pdkModel.on(UPDKHelper.PDK_EVENT.PDK_GAME_PLAYER_FOLLOWCARD, this.onPlayerFollowCard, this);
        AppGame.ins.pdkModel.on(UPDKHelper.PDK_EVENT.PDK_GAME_NOTIFY_CHUPAI_INFO, this.onPlayerOutCardInfo, this);
        AppGame.ins.pdkModel.on(UPDKHelper.PDK_EVENT.PDK_GAME_NOTIFY_PASS_INFO, this.onPassCardInfo, this);
        AppGame.ins.pdkModel.on(UPDKHelper.PDK_EVENT.PDK_GAME_NOTIFY_GAME_RESULT, this.onGameResultInfo, this);
        AppGame.ins.pdkModel.on(UPDKHelper.PDK_EVENT.PDK_GAME_NOTIFY_TUOGUAN, this.onTuoGuanInfo, this);
        AppGame.ins.pdkModel.on(UPDKHelper.PDK_EVENT.PDK_NOTIFY_SCORECHANGE, this.onSoreChange, this);
        AppGame.ins.pdkModel.on(UPDKHelper.PDK_EVENT.PDK_NOTIFY_MESSAGE, this.onNotifyMessage, this);
        // AppGame.ins.pdkModel.on(UPDKHelper.PDK_SELF_EVENT.PDK_C_SEND_OUT_CARDS, this.onSendOutCards, this);
        // AppGame.ins.pdkModel.on(UPDKHelper.PDK_SELF_EVENT.PDK_SHOW_LEFT_CARDS, this.onShowLeftCards, this);
        //清理桌面
        // AppGame.ins.pdkModel.on(UPDKHelper.PDK_EVENT.PDK_NOTIFY_CHAT_MESSAGE, this.onNotifyChatInfo, this);
        AppGame.ins.pdkModel.on(UPDKHelper.PDK_SELF_EVENT.PDK_CLEAR_DESK, this.onClearDesk, this);
          //绑定滑动事件
          if (this.chairId == AppGame.ins.pdkModel.gMeChairId){
            this.onTouchEvent();
         }

        // var data ={ 
        //     cards:[42,23,11,24,28,6,19,46,18,44,7,35,15,8,13,47,6,19]
        // }
        // AppGame.ins.pdkModel.otherOutPokers = [0]
        // this.onGamestart(data)
    }

    onEnable(){
        // this.setHeadSpine(AppGame.ins.pdkModel.getUISeatId(this.chairId), "daiji", true); 
        if(this.chairId != AppGame.ins.pdkModel.gMeChairId) {
            this.setHeadSpine(this.chairId, "daiming_02", true); 
        } else {
            this.setHeadSpine(this.chairId, "daiming_01", true); 
        }
    }

    onDestroy() {
        AppGame.ins.pdkModel.off(UPDKHelper.PDK_EVENT.PDK_GAME_START, this.onGamestart, this);
        AppGame.ins.pdkModel.off(UPDKHelper.PDK_EVENT.PDK_GAMESCENE_FREE, this.onSenceGameFree, this);
        AppGame.ins.pdkModel.off(UPDKHelper.PDK_EVENT.PDK_GAME_PLAYER_CHUPAI, this.onOutCard, this);
        AppGame.ins.pdkModel.off(UPDKHelper.PDK_EVENT.PDK_GAME_PLAYER_FOLLOWCARD, this.onPlayerFollowCard, this);
        AppGame.ins.pdkModel.off(UPDKHelper.PDK_EVENT.PDK_GAME_NOTIFY_CHUPAI_INFO, this.onPlayerOutCardInfo, this);
        AppGame.ins.pdkModel.off(UPDKHelper.PDK_EVENT.PDK_GAME_NOTIFY_PASS_INFO, this.onPassCardInfo, this);
        AppGame.ins.pdkModel.off(UPDKHelper.PDK_EVENT.PDK_GAME_NOTIFY_GAME_RESULT, this.onGameResultInfo, this);
        AppGame.ins.pdkModel.off(UPDKHelper.PDK_EVENT.PDK_GAME_NOTIFY_TUOGUAN, this.onTuoGuanInfo, this);
        AppGame.ins.pdkModel.off(UPDKHelper.PDK_EVENT.PDK_NOTIFY_SCORECHANGE, this.onSoreChange, this);
        AppGame.ins.pdkModel.off(UPDKHelper.PDK_EVENT.PDK_NOTIFY_MESSAGE, this.onNotifyMessage, this);
        // AppGame.ins.pdkModel.off(UPDKHelper.PDK_SELF_EVENT.PDK_SHOW_LEFT_CARDS, this.onShowLeftCards, this);
        // AppGame.ins.pdkModel.off(UPDKHelper.PDK_EVENT.PDK_NOTIFY_CHAT_MESSAGE, this.onNotifyChatInfo, this);
        AppGame.ins.pdkModel.off(UPDKHelper.PDK_SELF_EVENT.PDK_CLEAR_DESK, this.onClearDesk, this);
        if (this.chairId == AppGame.ins.pdkModel.gMeChairId){
            this.cancelTouchEvent();
        }
    }
 
    onDisable(){
        
        // if (this.chairId == AppGame.ins.pdkModel.gMeChairId){
        //     this.cancelTouchEvent();
        // }
        // AppGame.ins.pdkModel.off(UPDKHelper.PDK_SELF_EVENT.PDK_C_SEND_OUT_CARDS, this.onSendOutCards, this);
    }

    onTouchEvent() {
        this.handbox.on("touchstart", this.touchCardStart,this)
        this.handbox.on("touchmove", this.touchCardMove,this)
        this.handbox.on("touchcancel", this.touchCardCancel ,this)
        this.handbox.on("touchend", this.touchCardEnd,this)
    }

    cancelTouchEvent() {
        this.handbox.off("touchstart", this.touchCardStart,this)
        this.handbox.off("touchmove", this.touchCardMove,this)
        this.handbox.off("touchcancel", this.touchCardCancel ,this)
        this.handbox.off("touchend", this.touchCardEnd,this)
    }
    
    /********************************************************************** 本地 event **********************************************/
    setChairId(chairId:number){
        this.chairId = chairId
    }

    setUserID(id: string) {
        this.userid.string = id
    }

    setScore(score: number) {
        this.score.string = UStringHelper.formatPlayerCoin(score / 100);
    }

     //开始滑动
     touchCardStart(event:any) {
        var location = event.getTouches()[0].getLocation()
        var cardList = this.handbox.children
        for (var k = cardList.length - 1; k >= 0; k--) {
            if (!this.handbox.children[k].active) continue
            var box = cardList[k].getBoundingBoxToWorld();
            box.width = 40
            cardList[k].getComponent(pdk_Card).isStart = false
            if (box.contains(location)) {
                cardList[k].getComponent(pdk_Card).isStart = true
            }
        }
    }

    //滑动中
    touchCardMove(event:any) {
        var location = event.getTouches()[0].getLocation()
        var cardList = this.handbox.children
        for (var k = cardList.length - 1; k >= 0; k--) {
            if (!this.handbox.children[k].active) continue
            var box = cardList[k].getBoundingBoxToWorld();
            box.width = 40
            if (box.contains(location)) {
                cardList[k].getComponent(pdk_Card).showCardCheck(true)
                cardList[k].getComponent(pdk_Card).isCheck = true
            }
        }
    }

    //从左向右滑动结束
    touchCardEnd(){
        pdk_Main.ins._music_mgr.playCardClick();
        var cardList = this.handbox.children 
        for (var k in cardList) {
            if (!this.handbox.children[k].active) continue
            if (cardList[k].getComponent(pdk_Card).isCheck == true) {
                //过滤掉第一张的点击事件
                cardList[k].getComponent(pdk_Card).isCheck = false
                if (!cardList[k].getComponent(pdk_Card).isStart){
                    cardList[k].getComponent(pdk_Card).onClick(false)
                }
            }
        }
    }

    //从右向左滑动结束
    touchCardCancel(){ 
        pdk_Main.ins._music_mgr.playCardClick();
        var cardList = this.handbox.children 
        for (var k in cardList) {
            if (!this.handbox.children[k].active) continue
            if (cardList[k].getComponent(pdk_Card).isCheck == true) {
                cardList[k].getComponent(pdk_Card).onClick(false)
                cardList[k].getComponent(pdk_Card).isCheck = false
            }
        }
    }

    //从缓存池中获得一张牌
    private getOnePoker():pdk_Card {
        if (this.cardPool.length > 0) {
            var card = this.cardPool.shift()
            card.node.active = true
            this.cardRun.push(card);
            return card;
        }
        let ins = cc.instantiate(this.card);
        card = ins.getComponent(pdk_Card);
        ins.setParent(this.handbox)
        this.cardRun.push(card);
        return card;
    }
     //回收使用的牌到缓存池
     private reclaimAll(): void {
        if (!this.cardRun) return
        let len = this.cardRun.length;
        for (let index = 0; index < len; index++) {
            let element = this.cardRun[index];
            element.hide();
            this.cardPool.push(element);
        }
        this.cardRun = [];
    }
    //回收指定的牌到缓存池
    /*public reclaimOneCard(value:number): void {
        let len = this.cardRun.length
        for (let index = 0; index < len; index++) {
            let element = this.cardRun[index]
            if (element._cardValue == value){
                element.hide()
                this.cardPool.push(element)
                this.cardRun.splice(index,1)
                break
            }
        }
        }*/

    //播放spine动画 
    playSpine(path:string,animation:string,skeleton:sp.Skeleton,loop:boolean,callback?:Function): void {
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

    /**
     * 设置玩家动画
     * @param seatId 座位号 0，1，2
     * @param chairId  0，1，2
     * @param anim 播放的动画
     * @param isLoop 是否循环播放
     */
    setHeadSpine(chairid: number, anim: string, isLoop: boolean, isbeiguan: boolean = false, isplaydj: boolean = false){
        var path = "";
        var aniStr = "";
        if (chairid == 0) {
            path = "ani/new_hand/pdk_boy_01";
            aniStr = "boy_01_";
        } else if (chairid == 1) {
            path = "ani/new_hand/pdk_girl_01";
            aniStr = "girl_01_";
        } else if (chairid == 2) {
            path = "ani/new_hand/pdk_girl_02";
            aniStr = "girl_02_";
        }
        this.playSpine(path, aniStr+anim, this.headSpine, isLoop, () => {
            if (!isLoop) {
                if(isbeiguan) {
                    this.setHeadSpine(chairid,"shu", false);
                } else if(isplaydj) {
                    this.setHeadSpine(chairid,"daiming_01", true);
                } else {
                    this.setHeadSpine(chairid,  parseInt(this.handcount.string)>2?"daiming_02":"daiming_03", true);
                }
            }
        });
        this.headSpine.node.active = true
    }

     //打开闹钟
     showClock(time:number){
        pdk_Main.ins.playerList[1].closeClock();
        pdk_Main.ins.playerList[2].closeClock();
        
        if(this.clock) {
            this.clock.node.parent.active = true
            UDebug.log(this.clock+"time = "+time);
            this.totalTurnTime = time;
            this.clock.string = time.toString()
            this.clockId = UClock.setClockNew(time,
                function () {
                    time = time - 0.1;
                    this.cdTime.fillRange = time / this.totalTurnTime
                }.bind(this),
                function(time){
                    this.clock.string = time.toString()
                    if (time <= 3){
                        pdk_Main.ins._music_mgr.playDjs();
                    }  
                }.bind(this),
                function(){
                    this.clock.node.parent.active = false
                }.bind(this),true)     
        }
    }

     //关闭闹钟
     closeClock(){
        clearInterval(this.clockId)
        if (this.chairId != AppGame.ins.pdkModel.gMeChairId) 
        this.clock.node.parent.active = false
    }
           
    //跑得快动画
    /********************************************************************** 协议 接收event **********************************************/
    //场景消息
    onSenceGameFree(data:any){
        UDebug.Log("onSenceGameFree:" + JSON.stringify(data));
        pdk_Main.ins.baseScore.string = "底注: " + (data.discore / PDK_SCALE_100)
    }

    //游戏开始
    private onGamestart(data: any) {
        var waitTime = (data.hasOwnProperty('isReconnect') && data.isReconnect) ? 0 : 2000
        setTimeout(()=>{
            if (AppGame.ins.appStatus.status != EAppStatus.Game) return;
            this.callTip.active = false
            this.resetGuanPosition();
            this.showInfo();
            this.onTouchEvent();
            AppGame.ins.pdkModel.clearSelectPokers();
            if (this.chairId == AppGame.ins.pdkModel.gMeChairId) {
                pdk_Main.ins.onMainNodeTouch();
                // pdk_Main.playerList[0].node.active = true
                // this.chatBtn.getComponent(cc.Button).interactable = true;
                // this.tuoguanBtn.getComponent(cc.Button).interactable = true;
                this.bottomRight.active = true;
                pdk_Main.ins.continueGame.active = false;
                let timePart = 70;
                if(data.isReconnect) {
                    timePart = 0;
                } 
                // this.tuoguanBtn.active = true;
                this.handbox.removeAllChildren();
                UDebug.Log("onGamestart:" + JSON.stringify(data) )
                var handCardData = pdk_Card.sortCardList(data.cards) 
                this.reclaimAll()
                for (var i = 0; i < handCardData.length;i++){
                    setTimeout(function(i) {
                        pdk_Main.ins._music_mgr.playSendCard();
                        var poker = this.getOnePoker()
                        poker.setCardValue(handCardData[i], true)
                        // poker.showCardFirstOut(false)
                        PDKCardDataUtil.logOneCard(handCardData[i]);
                        this.selfHandCardCount.string = i + 1;
                    }.bind(this,i), i * timePart);
                }
                this.setHeadSpine(this.chairId,"daiming_02",true); 
                AppGame.ins.pdkModel.handPokers = handCardData;
                pdk_Main.ins.recordId.node.parent.active = true; 
                this.selfHandCardCount.node.parent.active = true;
                pdk_Main.ins.baseScore.node.active = true;
                pdk_Main.ins.recordId.string = `牌局编号:`+data.roundid||"";
                pdk_Main.ins.recordid = data.roundid+``;
                pdk_Main.ins.baseScore.string = "底注："+ (AppGame.ins.pdkModel.currentDizhu / PDK_SCALE_100);
            }else{
                this.handbox.active = true
                pdk_Main.ins.playerList[1].setHeadSpine(pdk_Main.ins.playerList[1].chairId, "daiming_02",true)
                pdk_Main.ins.playerList[2].setHeadSpine(pdk_Main.ins.playerList[2].chairId, "daiming_02",true)
                this.outbox.getComponent(cc.Layout).type = cc.Layout.Type.HORIZONTAL;
                this.outbox.setContentSize(120, 162);
                if(data.isReconnect) {
                } else {
                    for (var i =0; i< pdk_Player.HAND_COUNT_MAX;i++){
                        setTimeout(function(i) {
                            if(this.handcount) {
                                this.handcount.string = i + 1
                            }
                        }.bind(this,i), i * 70);
                    }
                }
            }
        }, waitTime);
        
    }

    // 请玩家跟牌通知
    private onPlayerFollowCard(data: any) {
        if (this.chairId != AppGame.ins.pdkModel.gMeChairId){
            this.closeClock()
        }
        if (data.chairid != this.chairId) return;
        this.callTip.active = false;
        AppGame.ins.pdkModel._lastDealChairId = data.lastdealchairid;
        if(this.chairId == AppGame.ins.pdkModel.gMeChairId) {
            this.outbox.removeAllChildren();
            if(!this.isTrust) {
                if(AppGame.ins.pdkModel.selectPokers.length == 0) {
                    pdk_Main.ins.action.cardOut.getComponent(cc.Button).interactable = false;
                }
                pdk_Main.ins.action.show(data);
                //自动提示跟牌
                pdk_Main.ins.action.onClickPrompt()
            }
        } else {
            if(data.hasOwnProperty('isReconnect') && data.isReconnect) {
                for (let index = 0; index < 3; index++) {
                    const element = pdk_Main.ins.playerList[index];
                    if(element.chairId == data.chairid) {
                        element.handcount.string = data.leftnum + "";
                    }
                    }
            }
            for (let index = 0; index < 3; index++) {
                const element = pdk_Main.ins.playerList[index];
                if(element.chairId == data.chairid) {
                    element.outbox.removeAllChildren();
                }
                }
            UDebug.log("展示倒计时--玩家"+data.chairid+" 我的chairid="+AppGame.ins.pdkModel.gMeChairId +"this.chariId = "+this.chairId);
            this.showClock(data.waittime);  
        }
    }
    
    // 玩家出牌信息通知
    private onPlayerOutCardInfo(data: any) {
        if (data.chairid != this.chairId) return
        var outPokers = data.cards;
        if (this.chairId  == AppGame.ins.pdkModel.gMeChairId) {
            pdk_Main.ins.offMainNodeTouch();
            this.selfHandCardCount.string = data.leftnum + "";
            if(data.leftnum > 0 && data.leftnum <= 2) {
                if(data.leftnum == 1) {
                    this.scheduleOnce(()=>{
                        pdk_Main.ins._music_mgr.playLastOne(this.chairId == 0 ?true:false);
                    },0.8);
                }
                pdk_Main.ins._music_mgr.playWarning();
                this.warningSpine.node.active = true;
                var path = "ani/hand/pdk_alart";
                this.playSpine(path,"alart",this.warningSpine,true,()=>{
                    // this.playSpine(path,"idle",this.warningSpine,false,()=>{
                        
                    // })
                })
            } else {
                this.warningSpine.node.active = false
            }
            // 隐藏打出去的牌
            let tempData = AppGame.ins.pdkModel.handPokers;
            if(outPokers.length > 0) {
                pdk_Main.ins.action.node.active = false;
                clearInterval(pdk_Main.ins.clockActionId);
                // this.closeClock();
            }
            for (let index = 0; index < data.cards.length; index++) {
                let card1 = data.cards[index];
                for (let t = 0; t < tempData.length; t++) {
                    let card2 = tempData[t];
                    if(card1 == card2) {
                        if(this.handbox && this.handbox.childrenCount > t) {
                            this.handbox.children[t].removeFromParent();
                            tempData = tempData.filter(item => item !== card2);
                            UDebug.Log("出牌：");
                            PDKCardDataUtil.logOneCard(card2);
                        }
                        break;
                    }
                }
            }
           /* if(pdk_Main.ins.black3Charid == data.chairid) {
                for (var i =0; i< this.handbox.childrenCount; i++){
                    //最后一张牌加上角标
                    var bankerFlag = (i == this.handbox.childrenCount - 1) ? true : false
                    this.handbox.children[this.handbox.childrenCount-1].getComponent(pdk_Card).showCardFirstOut(bankerFlag)
                }
            }*/
            this.playCardTypeAnimation(data.cardtype, 0, data.cards, data.chairid);
            AppGame.ins.pdkModel.handPokers = tempData;
            UDebug.Log("本次出牌为：");
            this.outboxCards(this.outbox, data)
            AppGame.ins.pdkModel.clearSelectPokers();
        } else {
            AppGame.ins.pdkModel.otherOutPokers = outPokers;
            for (let index = 0; index < 3; index++) {
                const element = pdk_Main.ins.playerList[index];
                if(element.chairId == data.chairid) {
                    this.playCardTypeAnimation(data.cardtype, index, data.cards, data.chairid);
                    this.setHeadSpine(element.chairId, data.leftnum <= 2?"chupai_02":"chupai_01", false);
                    element.handcount.string = data.leftnum + "";
                    this.outboxCards(element.outbox, data);
                    if(data.leftnum > 0 && data.leftnum <= 2) {
                        pdk_Main.ins._music_mgr.playWarning();
                        if(data.leftnum == 1) {
                            this.scheduleOnce(()=>{
                                if(data.chairid == 0) {
                                    pdk_Main.ins._music_mgr.playLastOne(true);
                                } else {
                                    pdk_Main.ins._music_mgr.playLastOne(false);
                                }
                            },0.8);
                        }
                        pdk_Main.ins.playerList[index].warningSpine.node.active = true;
                        var path = "ani/hand/pdk_alart";
                        this.playSpine(path,"alart",pdk_Main.ins.playerList[index].warningSpine,true,()=>{
                        })
                    } else {
                        pdk_Main.ins.playerList[index].warningSpine.node.active = false  
                    }
                }
            }
        }
        this.closeClock();

        //保存当前轮出牌的牌型
        if (data.chairid == AppGame.ins.pdkModel.firstOutChairId)
        {
            AppGame.ins.pdkModel.firstOutCardType = data.cardtype
        }
        
    }

    // 播放牌型动画
    playCardTypeAnimation(cardType: CardType, index: number, cards?: any, chairid?:number) {
        UDebug.Log("########-----cards = "+JSON.stringify(cards));
        // pdk_Main.ins._music_mgr.playDapai();
        var path = "ani/new_card_type/pdk_px";
        switch(cardType) {
            case CardType.PDKTYPE_SINGLE: {
                UDebug.Log("PDKCardDataUtil.getCardNumStr(cards[0]) = "+PDKCardDataUtil.getCardNumStr(cards[0]));
                if(chairid == 0) {
                    pdk_Main.ins._music_mgr.playSingle(true, PDKCardDataUtil.getCardNumStr(cards[0]));
                } else {
                    pdk_Main.ins._music_mgr.playSingle(false, PDKCardDataUtil.getCardNumStr(cards[0]));
                }
            }
            break;
            case CardType.PDKTYPE_PAIR: {
                this.playSpine(path, "duizi", pdk_Main.ins.playerList[index].cardTypeSpine, false);
                if(chairid == 0) {
                    pdk_Main.ins._music_mgr.playPair(true, PDKCardDataUtil.getCardNumStr(cards[0]));
                } else {
                    pdk_Main.ins._music_mgr.playPair(false, PDKCardDataUtil.getCardNumStr(cards[0]));
                }
            }
            break;
            case CardType.PDKTYPE_THREE: {
                if(chairid == 0) {
                    pdk_Main.ins._music_mgr.playThreeAndNum(true, 0);
                } else {
                    pdk_Main.ins._music_mgr.playThreeAndNum(false, 0);
                }
            }
            break;
            case CardType.PDKTYPE_ONE_STRAIGHT: {
                this.playSpine(path, "shunzi", pdk_Main.ins.playerList[index].cardTypeSpine, false);
                if(chairid == 0) {
                    pdk_Main.ins._music_mgr.playStraight(true);
                } else {
                    pdk_Main.ins._music_mgr.playStraight(false);
                }
            }
            break;
            case CardType.PDKTYPE_TWO_STRAIGHT: {
                this.playSpine(path, "liandui", pdk_Main.ins.playerList[index].cardTypeSpine, false);
                if(chairid == 0) {
                    pdk_Main.ins._music_mgr.playStraightPair(true);
                } else {
                    pdk_Main.ins._music_mgr.playStraightPair(false);
                }

            }
            break;
            case CardType.PDKTYPE_THREE_ONE:{
                this.playSpine(path, "sandaiyi", pdk_Main.ins.playerList[index].cardTypeSpine, false);
                if(chairid == 0) {
                    pdk_Main.ins._music_mgr.playThreeAndNum(true, 1);
                } else {
                    pdk_Main.ins._music_mgr.playThreeAndNum(false, 1);
                }
            }
            break;
            case CardType.PDKTYPE_THREE_TWO: {
                this.playSpine(path, "sandaier", pdk_Main.ins.playerList[index].cardTypeSpine, false);
                if(chairid == 0) {
                    pdk_Main.ins._music_mgr.playThreeAndNum(true, 2);
                } else {
                    pdk_Main.ins._music_mgr.playThreeAndNum(false, 2);
                }
            }
            break;
            case CardType.PDKTYPE_WING_ZERO:
            case CardType.PDKTYPE_WING_ONE: 
            case CardType.PDKTYPE_WING_TWO: {
                var path2 = "ani/new_hand/feiji";
                this.playSpine(path2, "feiji",pdk_Main.ins.Spine, false)
                pdk_Main.ins._music_mgr.playEffectPlane();
                if(chairid == 0) {
                    pdk_Main.ins._music_mgr.playPlane(true);
                } else {
                    pdk_Main.ins._music_mgr.playPlane(false);
                }
                
            }
            break;
            case CardType.PDKTYPE_FOUR_ONE: {
                if(chairid == 0) {
                    pdk_Main.ins._music_mgr.playFourAndNum(true,1);
                } else {
                    pdk_Main.ins._music_mgr.playFourAndNum(false,1);
                }
            }
            break;
            case CardType.PDKTYPE_FOUR_TWO: {
                if(chairid == 0) {
                    pdk_Main.ins._music_mgr.playFourAndNum(true,2);
                } else {
                    pdk_Main.ins._music_mgr.playFourAndNum(false,2);
                }
            }
            break;
            case CardType.PDKTYPE_FOUR_THREE: {
                if(chairid == 0) {
                    pdk_Main.ins._music_mgr.playFourAndNum(true,3);
                } else {
                    pdk_Main.ins._music_mgr.playFourAndNum(false,3);
                }
            }
            break;
            case CardType.PDKTYPE_BOMB:{
                var path1 = "ani/new_card_type/ddz_zhadan";
                if(chairid == 0) {
                    pdk_Main.ins._music_mgr.playBomb(true);
                } else {
                    pdk_Main.ins._music_mgr.playBomb(false);
                }

                var callBackFunction = ()=>{
                    pdk_Main.ins.Spine.node.scale = 0.8;
                    this.playSpine(path1, "zha",pdk_Main.ins.Spine, false,()=>{
                        pdk_Main.ins.Spine.node.scale = 1;
                    })
                }

                if(index == 0) {// 自己
                    this.playSpine(path1, "lujingzhu", pdk_Main.ins.Spine, false, callBackFunction);
                } else if(index == 1) { // 右边玩家
                    this.playSpine(path1, "lujingyou", pdk_Main.ins.Spine, false, callBackFunction);
                } else if(index == 2) { // 左边玩家
                    this.playSpine(path1, "lujingzuo", pdk_Main.ins.Spine, false, callBackFunction);
                }
                pdk_Main.ins._music_mgr.playBombEffect();
            }
            break;
        }
    }

    outboxCards(outbox: cc.Node, data: any, isShowLeftCards?: boolean) {
        if(outbox) {
            if(!isShowLeftCards || data.cards.length != 0 ) {
                outbox.removeAllChildren();
            } 
        }
        if(isShowLeftCards) {
            if(data.cards.length > 10) {
                outbox.getComponent(cc.Layout).type = cc.Layout.Type.GRID;
                outbox.getComponent(cc.Layout).spacingY = 10;
                outbox.setContentSize(500, 200);
            }
        }
        let cardData = data.cards;
        for (let j = 0; j < cardData.length; j++) {

            const element = cardData[j];
            let ins = cc.instantiate(this.card);
            let card = ins.getComponent(pdk_Card);
            ins.setParent(outbox); 
            card.setCardValue(cardData[j], false);
            // if(j == cardData.length - 1 && pdk_Main.ins.black3Charid == data.chairid) {
            //     card.showCardFirstOut(true);
            // } else {
            //     card.showCardFirstOut(false);
            // }
            PDKCardDataUtil.logOneCard(element)
        }
    }

    // 玩家过牌通知
    private onPassCardInfo(data: any) {
        
        if(data.chairid != this.chairId) return;
        if (this.chairId  == AppGame.ins.pdkModel.gMeChairId) {
            pdk_Main.ins.action.actionCard.active = false;
            pdk_Main.ins.onShowTips("您没有牌大过上家");
            /*AppGame.ins.pdkModel.clearSelectPokers()
             // 把选择的牌都拉下来
             for(var i=0; i < this.handbox.childrenCount; i++){
                 const poker:pdk_Card = this.handbox.children[i].getComponent(pdk_Card)
                 poker.lockFlag = false
                 poker.setCardDown();
             }*/
             pdk_Main.ins.offMainNodeTouch();
        }
        for (let index = 0; index < 3; index++) {
            const playerNode = pdk_Main.ins.playerList[index];
            if(playerNode.chairId == data.chairid) {
                playerNode.outbox.removeAllChildren();
                if(index == 1 || index == 2) {
                    if(data.leftnum) {
                        this.handcount.string = data.leftnum+"";
                    }
                }
                if(data.chairid == 0) {
                    pdk_Main.ins._music_mgr.playYaobuqi(true);
                } else {
                    pdk_Main.ins._music_mgr.playYaobuqi(false);
                }
            }
        }
        
        var url = "texture/yaobuqi"
        UResManager.loadUrlByBundle(AppGame.ins.roomModel.BundleName,url, this.callTip.getComponent(cc.Sprite))
        this.callTip.active = true;
        this.scheduleOnce(()=>{
            this.callTip.active = false;
        },1.5);
        this.closeClock()
    }
   
    // 托管通知
    private onTuoGuanInfo(data: any) {
        if(data.chairid != this.chairId) return;
        this.isTrust = data.istuoguan == 1 ? true : false;
        if(data.chairid == AppGame.ins.pdkModel.gMeChairId) {
            pdk_Main.ins.tuoguanPanel.active = data.istuoguan == 1?true:false;
            if(data.istuoguan == 1) {
                AppGame.ins.closeUI(ECommonUI.UI_CHAT_HY)
                AppGame.ins.closeUI(ECommonUI.UI_GAME_PROP)
            }
            UDebug.Log("AppGame.ins.pdkModel.gMeChairId = "+data.chairid +" ###istuoguan = "+data.istuoguan);
        } else {
            // pdk_Main.ins.tuoguanPanel.active = false;
            // for (let index = 0; index < 3; index++) {
            //     const element = pdk_Main.ins.playerList[index];
            //     if(element.chairId == data.chairid) {
            //         element.tuoguan.active = data.istuoguan == 1 ? true : false;
            //     }
            // }
        }
        this.tuoguan.active = data.istuoguan == 1 ? true : false;
    }

    // 通知玩家分数变化
    private onSoreChange(data: any) {
        let dataArr = data.scorechangeinfo||[];
        if(dataArr.length > 0) { 
            for (let index = 0; index < dataArr.length; index++) {
                const dataItem = dataArr[index];
                for (let index = 0; index < 3; index++) {
                    const element = pdk_Main.ins.playerList[index];
                    if(element.chairId == dataItem.chairid) {
                        element.score.string = dataItem.scorechange==0?`0`:UStringHelper.getMoneyFormat(dataItem.currscore/100) //(dataItem.currscore / PDK_SCALE_100).toFixed(3).slice(0,-1); 
                        var action1 = cc.fadeIn(0.2);
                        var actionPlay1 = cc.callFunc(()=>{
                            this.scheduleOnce(()=>{
                                element.winScore.node.opacity = 0;
                                element.loseScore.node.opacity = 0;
                                element.winScore.node.parent.opacity = 0;
                                element.loseScore.node.parent.opacity = 0;
                            },2);
                        })
                        if(dataItem.scorechange > 0) {
                            element.winScore.string = "+" +(dataItem.scorechange / PDK_SCALE_100).toFixed(3).slice(0,-1); 
                            element.winScore.node.runAction(cc.sequence(action1,actionPlay1));
                            element.winScore.node.parent.opacity = 255;
                        } else {
                            element.loseScore.string = dataItem.scorechange==0?`0`:(dataItem.scorechange / PDK_SCALE_100).toFixed(3).slice(0,-1);
                            element.loseScore.node.runAction(cc.sequence(action1,actionPlay1))
                            element.loseScore.node.parent.opacity = 255;

                        }
                    }
                }
            }
        }

    }

    // 展示玩家剩余的牌
    private onShowLeftCards(data: any) {
        if(this.chairId == AppGame.ins.pdkModel.gMeChairId) {
            for (let index = 0; index < data.length; index++) {
                const element = data[index];
                for (let t = 1; t < 3; t++) {
                    const player = pdk_Main.ins.playerList[t];
                    if(element.chairid == player.chairId && element.cards) {
                        let cardsArr = {cards:null,chairid: element.chairid}
                        cardsArr.cards = pdk_Card.sortCardList(element.cards);
                        this.outboxCards(player.outbox, cardsArr, true); 
                        break;
                    }
                }
            }
        }
    }

    // 设置用户手牌不能点击
    setHandCardNotClick() { 
        this.cancelTouchEvent();
        for (let index = 0; index < this.handbox.children.length; index++) {
            const element = this.handbox.children[index];
            element.getComponent("pdk_Card").lockFlag = true;
        }
    }

    // 通知游戏结果
    private onGameResultInfo(data: any) {
        if(this.chairId  == AppGame.ins.pdkModel.gMeChairId) {
            for (let index = 0; index < 3; index++) {
                pdk_Main.ins.playerList[index].warningSpine.node.active = false
            }

            pdk_Main.ins.offMainNodeTouch();
            AppGame.ins.pdkModel.clearSelectPokers();
            this.setHandCardNotClick();
            // this.chatBtn.getComponent(cc.Button).interactable = false;
            // this.tuoguanBtn.getComponent(cc.Button).interactable = false;
            this.bottomRight.active = false;
            UDebug.Log("游戏结果通知-----"+JSON.stringify(data));
            if(data.allgreatestchair != -1) { // 有领出者全大的玩家
                AppGame.ins.showTips("有领出者全大的玩家，游戏结束");
            } 
            // pdk_Main.ins.clockShowResult = setTimeout(() => {
            //         pdk_Main.ins.result.show(data.gameresult);
            //     },2500)
            if(data.gameresult != null && data.gameresult.length > 0) {
                this.onShowLeftCards(data.gameresult);
                for(let i = 0; i < data.gameresult.length; i++) {
                    let dataItem = data.gameresult[i];
                    if(pdk_Main.ins.black3Charid == dataItem.chairid) {
                        this.playGuanAnimation(dataItem.winstat);
                    }
                    for (let index = 0; index < 3; index++) {
                        const element = pdk_Main.ins.playerList[index];
                        
                        var action1 = cc.fadeIn(0.2);
                        var actionPlay1 = cc.callFunc(()=>{
                            this.scheduleOnce(()=>{
                                element.winScore.node.opacity = 0;
                                element.loseScore.node.opacity = 0;
                                element.winScore.node.parent.opacity = 0;
                                element.loseScore.node.parent.opacity = 0;
                            },2)
                        })
                        if(element.chairId == dataItem.chairid) {
                            // if(dataItem.winstat == 1) { // 被关
                            //     // element.spine_lock.active = true;
                            //     element.setHeadSpine(element.chairId, "beiguan", false);
                            // } else {
                            //     // element.spine_lock.active = false;
                            // }

                            if(dataItem.iswin == 1) {
                                if(dataItem.chairid == AppGame.ins.pdkModel.gMeChairId) {
                                    pdk_Main.ins._music_mgr.playWinOrLose(dataItem.chairid == 0?true:false, true);
                                }
                                element.setHeadSpine(dataItem.chairid, "ying", false,false,true);
                                element.winScore.node.parent.opacity = 255;
                                element.handcount.string = `0`;
                                element.winScore.string = dataItem.scorechange==0?`0`: "+"+(dataItem.scorechange / PDK_SCALE_100).toFixed(3).slice(0,-1); 
                                element.winScore.node.runAction(cc.sequence(action1,actionPlay1))
                            } else {
                                if(dataItem.chairid == AppGame.ins.pdkModel.gMeChairId) {
                                    pdk_Main.ins._music_mgr.playWinOrLose(dataItem.chairid== 0?true:false, false);
                                }
                                element.loseScore.node.parent.opacity = 255;
                                element.loseScore.string = dataItem.scorechange==0?`0`:""+(dataItem.scorechange / PDK_SCALE_100).toFixed(3).slice(0,-1);
                                element.loseScore.node.runAction(cc.sequence(action1,actionPlay1))
                                element.setHeadSpine(dataItem.chairid, dataItem.winstat == 1?"beiguan":"shu", false,false,true);
                            }
                        }
                    }
                }

            }
    }
    }

     // 播放全关反关动画
     playGuanAnimation(winstat: number): void {
        if (winstat > 0 && winstat < 5) {
            pdk_Main.ins.mainLock.node.active = true;
            let path = "ani/new_hand/pdk_guan";
            switch(winstat) {
                case 1: { // 被关
                    this.playSpine(path, "beiguan", pdk_Main.ins.mainLock, false);
                }
                break;
                case 2: { // 反关
                    this.playSpine(path, "fanguan", pdk_Main.ins.mainLock, false);
                }
                break;
                case 3: { // 全关
                    this.playSpine(path, "quanguan", pdk_Main.ins.mainLock, false);
                }
                break;
                case 4: { // 单关
                    this.playSpine(path, "danguan", pdk_Main.ins.mainLock, false);
                }
                break;
            }
        }
    }

    // 重置全关动画
    resetGuanPosition(): void {
        pdk_Main.ins.mainLock.node.active = false;
    }

    // 通知玩家消息
    private onNotifyMessage(data: any) {
        if (this.chairId  == AppGame.ins.pdkModel.gMeChairId) {
            pdk_Main.ins.onShowTips(data ? data.msg : "持有的牌有大于上家出的牌，请重新出牌");
            // pdk_Main.ins.action.onClickPrompt();
        }
    }

    //出牌通知
    private onOutCard(data:any) {
        if (this.chairId != AppGame.ins.pdkModel.gMeChairId){
            this.closeClock()
        }
        if (data.chairid != this.chairId) return
        this.callTip.active = false;
        UDebug.Log("onOutCard    :" + JSON.stringify(data))
        AppGame.ins.pdkModel.otherOutPokers = [];
        if (this.chairId  == AppGame.ins.pdkModel.gMeChairId){
            this.outbox.removeAllChildren();
            // pdk_Main.ins.offMainNodeTouch();
            /*for(var i=0; i<this.handbox.childrenCount; i++){
                const poker:pdk_Card = this.handbox.children[i].getComponent(pdk_Card)
                poker.lockFlag = false
                poker.setCardDown();
            }*/
            // AppGame.ins.pdkModel.clearSelectPokers();// 自己出牌 则直接 清除选中的牌
            if(!this.isTrust) {
                pdk_Main.ins.action.show(data);
            }
        } else {
            if(data.hasOwnProperty('isReconnect') && data.isReconnect) {
                for (let index = 0; index < 3; index++) {
                    const element = pdk_Main.ins.playerList[index];
                    if(element.chairId == data.chairid) {
                        element.handcount.string = data.leftnum + "";
                    }
                    }
            }
            for (let index = 0; index < 3; index++) {
                const element = pdk_Main.ins.playerList[index];
                if(element.chairId == data.chairid) {
                    element.outbox.removeAllChildren();
                }
                }
            this.showClock(data.waittime);  
        }
        //保存当前轮出牌的ID
        AppGame.ins.pdkModel.firstOutChairId = data.chairid
    }  

    private intoCharge():void {
        pdk_Main.ins._music_mgr.playClick();
        AppGame.ins.showUI(ECommonUI.LB_Charge);
    }

    showInfo() {
        this.handbox.active = true;
        this.outbox.active = true;
    }

     //清理桌面
     onClearDesk(){
        UDebug.Log("清理桌面")
        this.cardPool = []
        this.cardRun = []
        this.callTip.active = false 
        this.resetGuanPosition();
        pdk_Main.ins.peach3Node.setPosition(cc.v2(0,0));
        pdk_Main.ins.peach3Node.scale = 1;
        this.headSpine.node.active = false
        this.node.active = false;
        this.warningSpine.node.active = false  

        for (let index = 0; index < 3; index++) {
            const element = pdk_Main.ins.playerList[index];
            element.spine_lock.active = false;
            if(index == 0) {
                // element.tuoguanBtn.active = false;
                element.bottomRight.active = false;
                element.selfHandCardCount.node.parent.active = false;
                element.handbox.removeAllChildren();
                continue;
            }
                
            element.handcount.string = "0";
        }
        if(AppGame.ins.currRoomKind == ERoomKind.Club) {
            if(this.chairId == AppGame.ins.pdkModel.gMeChairId) {
                this.headSpine.node.active = true;
                this.node.active = true;
            }
        }
        this.outbox.removeAllChildren();
    }

}


