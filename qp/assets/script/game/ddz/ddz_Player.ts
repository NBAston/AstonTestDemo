

import AppGame from "../../public/base/AppGame";
import UStringHelper from "../../common/utility/UStringHelper";
import UDebug from "../../common/utility/UDebug";
import UDDZHelper, { ChatMsgType } from "./ddz_Helper";
import ddz_Main from "./ddz_Main";
import UClock from "../../common/utility/UClock";
import UResManager from "../../common/base/UResManager";
import ddz_Card from "./ddz_Card";
import { CardType } from "./ddz_Library";
import UNodeHelper from "../../common/utility/UNodeHelper";
import { EAppStatus, ECommonUI, ERoomKind } from "../../common/base/UAllenum";
import MDDZModel from "./model/MDDZ";
import GamePropManager from "../../public/GameProp/GamePropManager";
import VGameChatPropManager from "../../public/gamechat/VGameChatPropManager";
import { appendFile } from "fs";

const { ccclass, property } = cc._decorator;
/**
 * 作用:处理单个玩家相关逻辑
 */

//发牌手牌个数
const HAND_COUNT_MAX:number = 17;

@ccclass
export default class ddz_Player extends cc.Component {
    @property(sp.Skeleton) headSpine: sp.Skeleton = null;
    @property(sp.Skeleton) bankerSpine: sp.Skeleton = null;
    @property(cc.Node) handbox: cc.Node = null;
    @property(cc.Node) outbox: cc.Node = null;
    @property(cc.Label) handcount: cc.Label = null;
    @property(cc.Prefab) card: cc.Prefab = null;
    @property(cc.Prefab) emojItem: cc.Prefab = null;
    @property(cc.Prefab) textItem: cc.Prefab = null;
    @property(cc.Label) userid: cc.Label = null;
    @property(cc.Label) score: cc.Label = null;
    @property(cc.Label) clock: cc.Label = null;
    @property(cc.Node) actionTip: cc.Node = null ;
    @property(cc.Node) trust: cc.Node = null;
    @property(sp.Skeleton) spCardType: sp.Skeleton = null;
    @property(sp.Skeleton) spWarn: sp.Skeleton = null;
    @property(cc.Node) chat: cc.Node = null;
    @property(cc.Sprite) cdTime: cc.Sprite = null;
    @property(cc.Node) prop: cc.Node = null;
    @property(cc.Node) chatProp: cc.Node = null;


    //扑克牌缓存池
    private cardPool: Array<ddz_Card>= [];
    private cardRun: Array<ddz_Card> = [];
    //当前玩家的椅子ID
    private chairId: number = -1;
    //时钟序号
    private clockId:any = null;    
    //是否托管
    public isTrust:boolean = false;
    //操作的总时长
    private totalTurnTime = 0 
    //人物性别
    private playerSex:string ="";



    onLoad(){
        AppGame.ins.ddzModel.on(UDDZHelper.DDZ_EVENT.DDZ_GAME_START, this.onGamestart, this)
        AppGame.ins.ddzModel.on(UDDZHelper.DDZ_EVENT.DDZ_CALL_BANKER, this.onCallBanker, this);
        AppGame.ins.ddzModel.on(UDDZHelper.DDZ_EVENT.DDZ_CALL_BANKER_RESULT, this.onCallBankerResult, this);
        AppGame.ins.ddzModel.on(UDDZHelper.DDZ_EVENT.DDZ_ADD_SCORE, this.onAddScore, this);
        AppGame.ins.ddzModel.on(UDDZHelper.DDZ_EVENT.DDZ_ADD_SCORE_RESULT, this.onAddScoreResult, this);
        AppGame.ins.ddzModel.on(UDDZHelper.DDZ_EVENT.DDZ_BANKER_INFO, this.onBankerInfo, this);
        AppGame.ins.ddzModel.on(UDDZHelper.DDZ_EVENT.DDZ_OUT_CARD, this.onOutCard, this);
        AppGame.ins.ddzModel.on(UDDZHelper.DDZ_EVENT.DDZ_OUT_CARD_RESULT, this.onOutCardResult, this);
        AppGame.ins.ddzModel.on(UDDZHelper.DDZ_EVENT.DDZ_FOLLOW_CARD, this.onFollowCard, this);
        AppGame.ins.ddzModel.on(UDDZHelper.DDZ_EVENT.DDZ_PASS_RESLUT, this.onPassReslut, this);
        AppGame.ins.ddzModel.on(UDDZHelper.DDZ_EVENT.DDZ_TRUST_RESULT, this.onTrustReslut, this);
        //AppGame.ins.ddzModel.on(UDDZHelper.DDZ_EVENT.DDZ_NOTIFY_CHAT_MESSAGE, this.onNotifyChatInfo, this);
        AppGame.ins.ddzModel.on(UDDZHelper.DDZ_SELF_EVENT.DDZ_CLEAR_DESK, this.onClearDesk, this);

        this.node.active = false
        this.cardPool = []
        this.cardRun = []


        //var data ={ 
        //    cards:[2,3,16,29,4,17,30,43 , 7,20,33,8,21,34,10,23,36,1,14]
        //}
        //AppGame.ins.ddzModel.otherOutPokers = [0,13,26,39, 1,14,27,40]
        //this.onGamestart(data)
    }

    onEnable(){
        if (this.chairId == 0) this.playerSex = "boy_01"
        else if (this.chairId == 1) this.playerSex = "girl_01"
        else if (this.chairId == 2) this.playerSex = "girl_02"
        this.playHeadSpine("_daiming_01")
    }

    onDisable(){
        clearInterval(this.clockId)
    }

    onDestroy(){
        AppGame.ins.ddzModel.off(UDDZHelper.DDZ_EVENT.DDZ_GAME_START, this.onGamestart, this); 
        AppGame.ins.ddzModel.off(UDDZHelper.DDZ_EVENT.DDZ_CALL_BANKER, this.onCallBanker, this);
        AppGame.ins.ddzModel.off(UDDZHelper.DDZ_EVENT.DDZ_CALL_BANKER_RESULT, this.onCallBankerResult, this);
        AppGame.ins.ddzModel.off(UDDZHelper.DDZ_EVENT.DDZ_ADD_SCORE, this.onAddScore, this);
        AppGame.ins.ddzModel.off(UDDZHelper.DDZ_EVENT.DDZ_ADD_SCORE_RESULT, this.onAddScoreResult, this);
        AppGame.ins.ddzModel.off(UDDZHelper.DDZ_EVENT.DDZ_BANKER_INFO, this.onBankerInfo, this);
        AppGame.ins.ddzModel.off(UDDZHelper.DDZ_EVENT.DDZ_OUT_CARD, this.onOutCard, this);
        AppGame.ins.ddzModel.off(UDDZHelper.DDZ_EVENT.DDZ_OUT_CARD_RESULT, this.onOutCardResult, this);
        AppGame.ins.ddzModel.off(UDDZHelper.DDZ_EVENT.DDZ_FOLLOW_CARD, this.onFollowCard, this);
        AppGame.ins.ddzModel.off(UDDZHelper.DDZ_EVENT.DDZ_PASS_RESLUT, this.onPassReslut, this);
        AppGame.ins.ddzModel.off(UDDZHelper.DDZ_EVENT.DDZ_TRUST_RESULT, this.onTrustReslut, this);
        //AppGame.ins.ddzModel.off(UDDZHelper.DDZ_EVENT.DDZ_NOTIFY_CHAT_MESSAGE, this.onNotifyChatInfo, this);
        AppGame.ins.ddzModel.off(UDDZHelper.DDZ_SELF_EVENT.DDZ_CLEAR_DESK, this.onClearDesk, this);
    }

    /********************************************************************** 本地 event **********************************************/

    //绑定滑动事件
    onBindTouchMove(){
        if (this.chairId == AppGame.ins.ddzModel.gMeChairId){
            this.handbox.on("touchstart", this.touchCardStart,this)
            this.handbox.on("touchmove", this.touchCardMove,this)
            this.handbox.on("touchcancel", this.touchCardCancel ,this)
            this.handbox.on("touchend", this.touchCardEnd,this)
        }
    }

    //取消滑动事件
    onCancelTouchMove(){
        if (this.chairId == AppGame.ins.ddzModel.gMeChairId){
            this.handbox.off("touchstart", this.touchCardStart,this)
            this.handbox.off("touchmove", this.touchCardMove,this)
            this.handbox.off("touchcancel", this.touchCardCancel ,this)
            this.handbox.off("touchend", this.touchCardEnd,this)
        }
    }

    setChairId(chairId:number){
        this.chairId = chairId
    }

    setUserID(id: string) {
        if (this.chairId != AppGame.ins.ddzModel.gMeChairId  && AppGame.ins.currRoomKind != ERoomKind.Club)
            this.userid.string = UStringHelper.coverName(id + "")
        else
            this.userid.string = id
    }

    /**绑定道具和聊天节点userId */
    setPlayerPropUserId(userId: number) {
        this.prop.getComponent(GamePropManager).bindUserId(userId);
        this.chatProp.getComponent(VGameChatPropManager).bindUserId(userId);

    }

    setScore(score: number) {
        this.score.string = UStringHelper.formatPlayerCoin(score/100);
    }

    //开始滑动
    touchCardStart(event:any) {
        var location = event.getTouches()[0].getLocation()
        var cardList = this.handbox.children
        for (var k = cardList.length - 1; k >= 0; k--) {
            if (!this.handbox.children[k].active) continue
            var box = cardList[k].getBoundingBoxToWorld();
            box.width = 40
            cardList[k].getComponent(ddz_Card).isStart = false
            if (box.contains(location)) {
                cardList[k].getComponent(ddz_Card).isStart = true
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
                cardList[k].getComponent(ddz_Card).showCardCheck(true)
                cardList[k].getComponent(ddz_Card).isCheck = true
            }
        }
    }

    //从左向右滑动结束
    touchCardEnd(){
        var cardList = this.handbox.children 
        for (var k in cardList) {
            if (!this.handbox.children[k].active) continue
            if (cardList[k].getComponent(ddz_Card).isCheck == true) {
                //过滤掉第一张的点击事件
                cardList[k].getComponent(ddz_Card).isCheck = false
                if (!cardList[k].getComponent(ddz_Card).isStart){
                    cardList[k].getComponent(ddz_Card).onClick()
                }
            }
        }
    }

    //从右向左滑动结束
    touchCardCancel(){ 
        var cardList = this.handbox.children 
        for (var k in cardList) {
            if (!this.handbox.children[k].active) continue
            if (cardList[k].getComponent(ddz_Card).isCheck == true) {
                cardList[k].getComponent(ddz_Card).onClick()
                cardList[k].getComponent(ddz_Card).isCheck = false
            }
        }
    }

    //获得一张牌(优先从缓存池取，如果没有再创建)
    private getOnePoker(parent:cc.Node):ddz_Card {
        if (this.cardPool.length > 0) {
            var card = this.cardPool.shift()
            card.node.active = true
            card.node.parent = parent
            this.cardRun.push(card);
            UDebug.Log("获得一张牌【来自缓存池】")
            return card;
        }
        UDebug.Log("获得一张牌【来自重新创建】")
        let ins = cc.instantiate(this.card);
        card = ins.getComponent(ddz_Card);
        ins.setParent(parent)
        this.cardRun.push(card);
        return card;
    }

    //回收使用的牌到缓存池
    private removeAllCard(): void {
        if (!this.cardRun) return
        let len = this.cardRun.length;
        for (let index = 0; index < len; index++) {
            let element = this.cardRun[index];
            element.hide();
            this.cardPool.push(element);
        }
        this.cardRun = []
    }

    //设置头像动画
    playHeadSpine(type:string){
        this.headSpine.node.active = true
        ddz_Main.ins.playSpine("ani/ddz_"+ this.playerSex,this.playerSex + type,this.headSpine,true, ()=>{
            if (AppGame.ins.ddzModel.gameStatus == MDDZModel.DDZ_GAMESTATUS.OVER)
               ddz_Main.ins.playSpine("ani/ddz_"+ this.playerSex,this.playerSex + "_daiming_01",this.headSpine,true)
            else if (type != "_daiming_01")
               ddz_Main.ins.playSpine("ani/ddz_"+ this.playerSex,this.playerSex + "_daiming_02",this.headSpine,true)
        })
    }

    //地主三张手牌插入动画
    playCardMoveAction(poker:ddz_Card){
        poker.setCardUp()
        setTimeout(() =>{
            if (AppGame.ins.appStatus.status == EAppStatus.Game){
                poker.onClick()
            }
        },1000);
    }

    //剩余手牌提示
    playWarnSpine(count:number){
        this.spWarn.node.active = true
        var path = "ani/ddz_alart" 
        ddz_Main.ins.playSpine(path,"alart",this.spWarn,true)
        ddz_Main.ins.musicMgr.playWarn(count,this.chairId == 0 ? "" : "Woman_")
    }

    //抢地主动画
    playCallbankerSpine(){
        this.bankerSpine.node.active = true
        var path = "ani/ddz_dizhu"
        ddz_Main.ins.playSpine(path,"dizhu_01",this.bankerSpine,false,()=>{
            ddz_Main.ins.playSpine(path,"dizhu_02",this.bankerSpine,true)
        })
    }

    //牌型动画
    playCardTypeSpine(data:any){
        var key = 0 
        const cardType = data.cardtype
        switch (cardType) {
            //单张，对子，三张
            case CardType.TYPE_SINGLE:
            case CardType.TYPE_PAIR:
            case CardType.TYPE_THREE:
                key = AppGame.ins.ddzModel.pokerLibrary.getCardWeight(data.cards[0])
                break
            //连对   
            case CardType.TYPE_TWO_STRAIGHT:  
                var path = "ani/px"
                ddz_Main.ins.playSpine(path,"liandui",this.spCardType,false)
                break
            //飞机
            case CardType.TYPE_WING_ZERO: 
            case CardType.TYPE_WING_ONE: 
            case CardType.TYPE_WING_PAIR:  
                var path = "ani/feiji"
                ddz_Main.ins.playSpine(path,"feiji",ddz_Main.ins.spBomb,false)
                ddz_Main.ins.musicMgr.playfeiji(this.chairId == 0 ? "" : "Woman_")
                break
            //顺子
            case CardType.TYPE_ONE_STRAIGHT:  
                var path = "ani/px"
                ddz_Main.ins.playSpine(path,"shunzi",this.spCardType,false)
                break
            //王炸
            case CardType.TYPE_PAIR_KING:  
                var path = "ani/zhadan_wangzha"
                ddz_Main.ins.playSpine(path,"wangzha",ddz_Main.ins.spBomb,false)
                ddz_Main.ins.musicMgr.playBombBg()
                break
            //炸弹
            case CardType.TYPE_BOMB:       
                path = "ani/ddz_zhadan"
                if (this.node.name == "player_0") var action = "lujingzhu"
                else if (this.node.name == "player_1")  action= "lujingyou"
                else if (this.node.name == "player_2")  action = "lujingzuo"
                ddz_Main.ins.playSpine(path,action, ddz_Main.ins.spBomb,false,()=>{
                ddz_Main.ins.playSpine(path,"zha", ddz_Main.ins.spBomb,false)
                })
                ddz_Main.ins.musicMgr.playBombBg()
                break
        }
        ddz_Main.ins.musicMgr.playCardType(cardType,key,this.chairId == 0 ? "" : "Woman_")

    }

    //打开闹钟
    showClock(time:number){
        this.clock.node.parent.active = true
        this.clock.string = time.toString()
        this.totalTurnTime = time
        this.cdTime.fillRange = 1
        this.clockId = UClock.setClockNew(time,
            function(){
                time = time - 0.1
                this.cdTime.fillRange = time / this.totalTurnTime
            }.bind(this),
            function(time){
                this.clock.string = time.toString()
                if (time <= 3){
                    ddz_Main.ins.musicMgr.playClock()
                }  
            }.bind(this),
            function(){
                this.clock.node.parent.active = false
            }.bind(this),true)   
               
    }

    //关闭闹钟
    closeClock(){
        clearInterval(this.clockId)
        if (this.chairId != AppGame.ins.ddzModel.gMeChairId)
        this.clock.node.parent.active = false
    }

    /********************************************************************** 协议 接收event **********************************************/
    //游戏开始
    private onGamestart(data: any) {
        var waitTime = data.isreconnect ? 0 : 2000
        this.actionTip.active = false
        this.handbox.active = false
        if (this.chairId == AppGame.ins.ddzModel.gMeChairId){
            var handPokers = ddz_Card.sortCardList(data.cards)
            AppGame.ins.ddzModel.handPokers = handPokers 
        }
        setTimeout(()=>{
            if (AppGame.ins.appStatus.status == EAppStatus.Game){
                this.handbox.active = true
                if (this.chairId == AppGame.ins.ddzModel.gMeChairId){
                    //注册滑动事件
                    this.onBindTouchMove()
                    this.removeAllCard()
                    UDebug.Log("onGamestart:" + handPokers)
                    for (var i =0; i<handPokers.length;i++){
                        if (data.isreconnect){
                            var poker = this.getOnePoker(this.handbox)
                            poker.lockFlag = false
                            poker.setCardValue(handPokers[i])
                            poker.setCardDown()
                            poker.showCardCheck(false)
                            poker.showCardBanker(false)
                        }else{
                            setTimeout(function(i) {
                                if (AppGame.ins.appStatus.status = EAppStatus.Game){
                                    var poker = this.getOnePoker(this.handbox)
                                    poker.lockFlag = false
                                    poker.setCardValue(handPokers[i])
                                    poker.setCardDown()
                                    poker.showCardCheck(false)
                                    poker.showCardBanker(false)
                                    ddz_Main.ins.musicMgr.playSendCard()
                                }
                            }.bind(this,i), i * 50);
                        }
                    }
                }else{
                    //非断线时，显示动画
                    if  (!data.isreconnect){
                        for (var i =0; i< HAND_COUNT_MAX;i++){
                            setTimeout(function(i) {
                                if (AppGame.ins.appStatus.status = EAppStatus.Game){
                                    this.handcount.string = i + 1
                                    if ( i == HAND_COUNT_MAX -1){
                                        ddz_Main.ins.cardRecord.active = AppGame.ins.currRoomKind == ERoomKind.Club ? false : true
                                        ddz_Main.ins.lastThreecard.active = AppGame.ins.currRoomKind == ERoomKind.Club ? true : false
                                    }
                                }
                            }.bind(this,i), i * 50);
                        }
                    }else{
                        ddz_Main.ins.cardRecord.active = AppGame.ins.currRoomKind == ERoomKind.Club ? false : true
                        ddz_Main.ins.lastThreecard.active = AppGame.ins.currRoomKind == ERoomKind.Club ? true : false
                    }
                }
            }
        },waitTime)
    }

    //叫庄通知
    private onCallBanker(data:any) {
        this.playHeadSpine("_daiming_02")  
        if (data.chairid != this.chairId) return
        UDebug.Log("onCallBanker:" + JSON.stringify(data))
        if (this.chairId == AppGame.ins.ddzModel.gMeChairId){
            ddz_Main.ins.action.show(data)
        }else{
            this.showClock(data.waittime)
        }
    }

    //叫庄结果
    private onCallBankerResult(data:any) {
        if (data.chairid != this.chairId) return
        UDebug.Log("onCallBankerResult:" + JSON.stringify(data))
        var url = "texture/call" + data.score
        UResManager.loadUrlByBundle(AppGame.ins.roomModel.BundleName,url, this.actionTip.getComponent(cc.Sprite),()=>{
            this.actionTip.active = true
        })
        if (this.chairId != AppGame.ins.ddzModel.gMeChairId){
             this.closeClock()
        }
    
        ddz_Main.ins.musicMgr.playCallScore(data.score,this.chairId == 0 ? "" : "Woman_")
    }

    //确定地主
    private onBankerInfo(data:any){
        this.actionTip.active = false
        if (data.dzinfo.dzchairid != this.chairId) return
        UDebug.Log("onBankerInfo:" + JSON.stringify(data))
        AppGame.ins.ddzModel.sBankerIndex = data.dzinfo.dzchairid
        //播放抢地主动画
        this.playCallbankerSpine()
        //更换头像
        if (data.isreconnect) return
        if (this.chairId == AppGame.ins.ddzModel.gMeChairId){
            //把之前发的牌放入缓存池中
            this.removeAllCard()
            //更新手牌
            var handPokers = AppGame.ins.ddzModel.handPokers
            handPokers =handPokers.concat(data.dzinfo.dicards)
            AppGame.ins.ddzModel.handPokers = handPokers
            //自动抬起最后三张手牌
            AppGame.ins.ddzModel.selectPokers = data.dzinfo.dicards
            ddz_Card.sortCardList(handPokers)
            for (var i =0; i< handPokers.length; i++){
                var poker = this.getOnePoker(this.handbox)
                poker.setCardValue(handPokers[i])
                poker.showCardCheck(false)
                poker.lockFlag = false
                data.dzinfo.dicards.includes(poker.value) ?  this.playCardMoveAction(poker) : poker.setCardDown()
                //最后一张牌加上角标
                var bankerFlag = (i == handPokers.length - 1) ? true : false
                poker.showCardBanker(bankerFlag)
            }
        }else{
            var bankerHandCount = HAND_COUNT_MAX + data.dzinfo.dicards.length
            this.handcount.string = bankerHandCount
        }
    }

    //农民加倍通知
    private onAddScore(data:any) {
        if (data.chairid != this.chairId) return
        UDebug.Log("onAddScore    :" + JSON.stringify(data))
        if (this.chairId  == AppGame.ins.ddzModel.gMeChairId){
            ddz_Main.ins.action.show(data)
        }else{
            this.showClock(data.waittime)  
        }
        
    }

    //农民加倍结果
    private onAddScoreResult(data:any) {
        if (data.chairid != this.chairId) return
        if (this.chairId != AppGame.ins.ddzModel.gBankerIndex){
            UDebug.Log("onAddScoreResult:" + JSON.stringify(data))
            var url = "texture/bet" + data.jiabei
            UResManager.loadUrlByBundle(AppGame.ins.roomModel.BundleName,url, this.actionTip.getComponent(cc.Sprite),()=>{
                this.actionTip.active = true
            })
            setTimeout(()=>{
                if (AppGame.ins.appStatus.status = EAppStatus.Game)
                this.actionTip.active = false
            }, 5000)
            ddz_Main.ins.musicMgr.playAddScore(data.jiabei,this.chairId == 0 ? "" : "Woman_")
        }
        if (this.chairId != AppGame.ins.ddzModel.gMeChairId){
             this.closeClock()
        }
    }

    //出牌通知
    private onOutCard(data:any) {
        if (this.chairId != AppGame.ins.ddzModel.gMeChairId){
            this.closeClock()
       }
        if (data.chairid != this.chairId) return
        this.actionTip.active = false
        this.outbox.active = false
        if (this.chairId  == AppGame.ins.ddzModel.gMeChairId){
            for(var i=0; i<this.handbox.childrenCount; i++){
                const poker:ddz_Card = this.handbox.children[i].getComponent(ddz_Card)
            }
            if (!this.isTrust) ddz_Main.ins.action.show(data)
        }else{
            if (data.isreconnect){
                this.handcount.string = data.leftcardnum.toString()
            }
            this.showClock(data.waittime)  
        }
        //保存当前轮出牌的ID
        AppGame.ins.ddzModel.firstOutChairId = data.chairid
    }

    //跟牌通知，只处理跟牌玩家的数据
    private onFollowCard(data:any){
        if (this.chairId != AppGame.ins.ddzModel.gMeChairId){
            this.closeClock()
       }
        if (data.chairid != this.chairId) return
        this.actionTip.active = false
        this.outbox.active = false
        
        if (this.chairId  == AppGame.ins.ddzModel.gMeChairId){
            for(var i=0; i<this.handbox.childrenCount; i++){
                const poker:ddz_Card = this.handbox.children[i].getComponent(ddz_Card)
            }  
            if (!this.isTrust){
                //保留预加载选中的牌
                var selectPokersOld = AppGame.ins.ddzModel.selectPokers
                //要不起
                var selectPokers = AppGame.ins.ddzModel.getPrompt()
                if (selectPokers.length == 0){
                     ddz_Main.ins.action.showPassPanel()
                     ddz_Main.ins.onShowTipImage()
                }
                else{
                    AppGame.ins.ddzModel.clearSelectPokers()
                    //还原预加载的牌
                    AppGame.ins.ddzModel.selectPokers = selectPokersOld
                    ddz_Main.ins.action.show(data)
                }
            }
        }else{
            if (data.isreconnect){
                this.handcount.string = data.leftcardnum.toString()
            }
            this.showClock(data.waittime)  
        }
    }

    //出牌结果，只处理出牌玩家的数据
    private onOutCardResult(data:any) {
        if (data.lastchairid != this.chairId) return
        //播放动画
        var banker = AppGame.ins.ddzModel.gBankerIndex == this.chairId ? true : false
        this.playCardTypeSpine(data)
        ddz_Main.ins.musicMgr.playOutCard()
        var outPokers = data.cards
        //隐藏上次打出的牌
        this.outbox.children.forEach(element => { element.active = false})
        if (this.chairId == AppGame.ins.ddzModel.gMeChairId){
            //更新手牌显示
            var outCardListTemp = []
            this.handbox.children.forEach(item=>{
                const poker = item.getComponent(ddz_Card)
                poker.setCardDown()
                //先隐藏
                if (outPokers.includes(poker.value)){
                    poker.node.active = false
                    outCardListTemp.push(poker)
                }
            })
                
            //挂到出牌节点下
            for(var i = 0;i<outCardListTemp.length;i++){
                var poker = outCardListTemp[i]
                poker.node.parent = this.outbox
                poker.node.active = true
                poker.lockFlag = true
                //最后一张牌加上角标
                if (i == outPokers.length - 1 && banker){
                    poker.showCardBanker(true)
                }else{
                    poker.showCardBanker(false)
                }
            }

            //更新手牌数据
            var dataCopy = AppGame.ins.ddzModel.handPokers
            AppGame.ins.ddzModel.handPokers = []
            for(var i=0;i<dataCopy.length;i++){
                if (!outPokers.includes(dataCopy[i])){
                    AppGame.ins.ddzModel.handPokers.push(dataCopy[i])
                }
            }
            ddz_Main.ins.action.node.active = false
            AppGame.ins.ddzModel.clearSelectPokers()
            //警告
            var count = AppGame.ins.ddzModel.handPokers.length
            if (count <= 2 && count > 0){
                ddz_Main.ins.musicMgr.playWarnSelf(count,this.chairId == 0 ? "" : "Woman_")
            }
            //最后一张牌手牌加上角标
            if (banker){
                this.handbox.children.forEach(element => {
                    const poker = element.getComponent(ddz_Card)
                    if (poker.value == AppGame.ins.ddzModel.handPokers[count-1]){
                        poker.showCardBanker(true)
                    }
                })
            }
            ddz_Main.ins.selectType.hide()
            //播放人物出牌动画
            if (this.handbox.childrenCount == 0) this.playHeadSpine("_daiming_01")
            else this.playHeadSpine("_chupai_01")
        }
        else{
            this.closeClock()
            AppGame.ins.ddzModel.otherOutPokers = outPokers
            //更新手牌数量
            if (data.isreconnect){
                this.handcount.string = data.leftcardnum.toString()
            }else{
                this.handcount.string = data.leftnum.toString()
            }
            //警告
            let count = parseInt(this.handcount.string)
            if (count <= 2 && count > 0){
                this.playWarnSpine(count)
            }else{
                this.spWarn.node.active = false
            }
            //播放人物出牌动画
            if (this.handcount.string == "0") this.playHeadSpine("_daiming_01")
            else this.playHeadSpine("_chupai_01")

            //显示本次出牌
            for (var i =0; i< outPokers.length;i++){
                var poker:any= this.getOnePoker(this.outbox)
                poker.setCardValue(outPokers[i])
                poker.lockFlag = true
                //最后一张牌加上角标
                if (i == outPokers.length - 1 && banker){
                    poker.showCardBanker(true)
                }else{
                    poker.showCardBanker(false)
                }
            }
        }
        //显示打出的牌
        this.outbox.active = true
        //保存当前轮出牌的牌型
        if (data.lastchairid == AppGame.ins.ddzModel.firstOutChairId){
            AppGame.ins.ddzModel.firstOutCardType = data.cardtype
            UDebug.log("首出玩家 " +data.chairid + "牌型："  +AppGame.ins.ddzModel.firstOutCardType)
        }
    }

    //过牌结果
    private onPassReslut(data:any){
        if (data.chairid != this.chairId) return
        var url = "texture/pass"
        UResManager.loadUrlByBundle(AppGame.ins.roomModel.BundleName,url, this.actionTip.getComponent(cc.Sprite),()=>{
            this.actionTip.active = true
        })
        //关闭倒计时
        if (this.chairId == AppGame.ins.ddzModel.gMeChairId){
            ddz_Main.ins.action.node.active = false
            AppGame.ins.ddzModel.clearSelectPokers()
        }else{
            if (data.isreconnect){
                this.handcount.string = data.leftcardnum.toString()
            }
            this.closeClock()
        }
        ddz_Main.ins.musicMgr.playPass(this.chairId == 0 ? "" : "Woman_")
    }

    //托管结果
    private onTrustReslut(data:any){
        AppGame.ins.closeUI(ECommonUI.UI_GAME_PROP);
        AppGame.ins.closeUI(ECommonUI.UI_CHAT_HY)
        if (data.chairid != this.chairId) return
        this.isTrust = data.istuoguan ?　true : false
        if (this.chairId == AppGame.ins.ddzModel.gMeChairId){
            ddz_Main.ins.trust.active = this.isTrust
            AppGame.ins.ddzModel.selectPokers = []
        }else{
            this.trust.active = this.isTrust
        }
    }

    //游戏结束
    onGameEnd(data:any){
        this.actionTip.active = false
        if (data.chairid == AppGame.ins.ddzModel.gMeChairId){
            this.onCancelTouchMove()
            for(var i=0; i<this.handbox.childrenCount; i++){
                const poker:ddz_Card = this.handbox.children[i].getComponent(ddz_Card)
                poker.setCardDown()
                poker.showCardCheck(false)
                poker.lockFlag = true
            }
        }else{
            var cardList =this.outbox.children
            cardList.forEach(element => { element.active = false})
            data.cards = ddz_Card.sortCardList(data.cards)
            for (var j in data.cards){
                var poker = this.getOnePoker(this.outbox)
                poker.setCardValue(data.cards[j])
                poker.lockFlag = true
                var banker = AppGame.ins.ddzModel.gBankerIndex == this.chairId ? true : false
                poker.showCardBanker(banker)
            }
            this.outbox.active = true
        }
    }

    
    //清理桌面
    onClearDesk(){
        UDebug.Log("清理桌面")
        this.removeAllCard()
        this.actionTip.active = false
        this.bankerSpine.node.active = false
        this.handbox.active = false
        this.headSpine.node.active = false
        this.node.active = false
        if (this.spWarn)
        this.spWarn.node.active = false
        //俱乐部，保留自己的头像
        if (AppGame.ins.currRoomKind == ERoomKind.Club){
            if (this.chairId == AppGame.ins.ddzModel.gMeChairId){
                this.handbox.active = true
                this.playHeadSpine("_daiming_01")
                this.node.active = true
            }
        }
    }
}


