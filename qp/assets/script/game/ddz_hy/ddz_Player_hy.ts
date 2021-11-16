

import AppGame from "../../public/base/AppGame";
import UStringHelper from "../../common/utility/UStringHelper";
import UDebug from "../../common/utility/UDebug";
import UDDZHelper_hy, { ChatMsgType } from "./ddz_Helper_hy";
import ddz_Main_hy from "./ddz_Main_hy";
import UResManager from "../../common/base/UResManager";
import ddz_Card_hy from "./ddz_Card_hy";
import { CardType } from "./ddz_Library_hy";
import GamePropManager from "../../public/GameProp/GamePropManager";
import VGameChatPropManager from "../../public/gamechat/VGameChatPropManager";

const { ccclass, property } = cc._decorator;
/**
 * 作用:处理单个玩家相关逻辑
 */

//发牌手牌个数
const HAND_COUNT_MAX:number = 17;

@ccclass
export default class ddz_Player_hy extends cc.Component {
    @property(sp.Skeleton) bankerSpine: sp.Skeleton = null;
    @property(sp.Skeleton) headSpine: sp.Skeleton = null;
    @property(cc.Node) handbox: cc.Node = null;
    @property(cc.Node) prop: cc.Node = null;
    @property(cc.Node) outbox: cc.Node = null;
    @property(cc.Label) handcount: cc.Label = null;
    @property(cc.Prefab) card: cc.Prefab = null;
    @property(cc.Prefab) emojItem: cc.Prefab = null;
    @property(cc.Prefab) textItem: cc.Prefab = null;
    @property(cc.Label) userid: cc.Label = null;
    @property(cc.Label) score: cc.Label = null;
    @property(cc.Node) actionTip: cc.Node = null ;
    @property(cc.Node) banker: cc.Node = null;
    @property(cc.Node) trust: cc.Node = null;
    @property(sp.Skeleton) spCardType: sp.Skeleton = null;
    @property(sp.Skeleton) spWarn: sp.Skeleton = null;
    @property(cc.Node) notCardTip: cc.Node = null;
    @property(cc.Node) chatProp: cc.Node = null;

    //扑克牌缓存池
    private cardPool: Array<ddz_Card_hy>= [];
    private cardRun: Array<ddz_Card_hy> = [];
    //当前玩家的椅子ID
    private chairId: number = 0;
    private _userid: number = 0;
    private _nickName: string = "";
    private clockTime:number = -1;
    private clockMaxTime:number = -1;
    private fillRangeGAP:number = -1;
    private timeMask:cc.Node;
    private playClockTime:number = -1;
    private scoreResTinme:any;
    private clock:cc.Node;
    private clockLab:cc.Label;
    //是否托管
    public isTrust:boolean = false;
    private isMan = true;//性别 默认男

    onLoad(){
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_GAME_START, this.onGamestart, this)
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_CALL_BANKER, this.onCallBanker, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_CALL_BANKER_RESULT, this.onCallBankerResult, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_ADD_SCORE, this.onAddScore, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_ADD_SCORE_RESULT, this.onAddScoreResult, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_BANKER_INFO, this.onBankerInfo, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_OUT_CARD, this.onOutCard, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_OUT_CARD_RESULT, this.onOutCardResult, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_FOLLOW_CARD, this.onFollowCard, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_PASS_RESLUT, this.onPassReslut, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_EVENT.DDZ_TRUST_RESULT, this.onTrustReslut, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_SELF_EVENT.DDZ_CLEAR_DESK, this.onClearDesk, this);
        AppGame.ins.ddzModel_hy.on(UDDZHelper_hy.DDZ_SELF_EVENT.DDZ_CLEAR_DESK2, this.onClearDesk2, this);

        this.clock = this.node.getChildByName("clock") || null;
        if(this.clock){
            this.clockLab = this.clock.getChildByName("timeBG").getChildByName("lab").getComponent(cc.Label);
            this.timeMask = this.clock.getChildByName("timeMask");
        }
        this.node.active = false
        this.cardPool = []
        this.cardRun = []

        var data ={ 
            cards:[2,3,16,29,4,17,30,43 , 7,20,33,8,21,34,10,23,36,1,14]
        }
    }

    onEnable(){
        var isbanker = this.chairId == AppGame.ins.ddzModel_hy.gBankerIndex ? true : false
        this.setHeadSpine(isbanker)
    }

    onDestroy(){
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_GAME_START, this.onGamestart, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_CALL_BANKER, this.onCallBanker, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_CALL_BANKER_RESULT, this.onCallBankerResult, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_ADD_SCORE, this.onAddScore, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_ADD_SCORE_RESULT, this.onAddScoreResult, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_BANKER_INFO, this.onBankerInfo, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_OUT_CARD, this.onOutCard, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_OUT_CARD_RESULT, this.onOutCardResult, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_FOLLOW_CARD, this.onFollowCard, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_PASS_RESLUT, this.onPassReslut, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_EVENT.DDZ_TRUST_RESULT, this.onTrustReslut, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_SELF_EVENT.DDZ_CLEAR_DESK, this.onClearDesk, this);
        AppGame.ins.ddzModel_hy.off(UDDZHelper_hy.DDZ_SELF_EVENT.DDZ_CLEAR_DESK2, this.onClearDesk2, this);
    }

    /********************************************************************** 本地 event **********************************************/

    //绑定滑动事件
    onBindTouchMove(){
        if (this.chairId == AppGame.ins.ddzModel_hy.gMeChairId){
            this.handbox.on("touchstart", this.touchCardStart,this)
            this.handbox.on("touchmove", this.touchCardMove,this)
            this.handbox.on("touchcancel", this.touchCardCancel ,this)
            this.handbox.on("touchend", this.touchCardEnd,this)
        }
    }

    //取消滑动事件
    onCancelTouchMove(){
        if (this.chairId == AppGame.ins.ddzModel_hy.gMeChairId){
            this.handbox.off("touchstart", this.touchCardStart,this)
            this.handbox.off("touchmove", this.touchCardMove,this)
            this.handbox.off("touchcancel", this.touchCardCancel ,this)
            this.handbox.off("touchend", this.touchCardEnd,this)
        }
    }

    setChairId(chairId:number){
        this.chairId = chairId
    }

    get ChairId(){
        return this.chairId;
    }

    setNickName(nickName: string) {
        this._nickName = nickName;
        this.userid.string = this._nickName
    }
    setUserID(id: string) {
        this._userid = Number(id);
        this.prop.getComponent(GamePropManager).bindUserId(this._userid);
        this.chatProp.getComponent(VGameChatPropManager).bindUserId(this._userid);
    }

    get UserID():number {
        return this._userid;
    }

    get sex():boolean {
        return this.isMan;
    }

    get nickName():string {
        return this._nickName;
    }

    setScore(score: number) {
        this.score.string = UStringHelper.getMoneyFormat2(score/100);
    }

    //开始滑动
    touchCardStart(event:any) {
        var location = event.getTouches()[0].getLocation()
        var cardList = this.handbox.children
        for (var k = cardList.length - 1; k >= 0; k--) {
            if (!this.handbox.children[k].active) continue
            var box = cardList[k].getBoundingBoxToWorld();
            box.width = 40
            cardList[k].getComponent(ddz_Card_hy).isStart = false
            if (box.contains(location)) {
                cardList[k].getComponent(ddz_Card_hy).isStart = true
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
                cardList[k].getComponent(ddz_Card_hy).showCardCheck(true)
                cardList[k].getComponent(ddz_Card_hy).isCheck = true
            }
        }
    }

    //从左向右滑动结束
    touchCardEnd(){
        var cardList = this.handbox.children 
        for (var k in cardList) {
            if (!this.handbox.children[k].active) continue
            if (cardList[k].getComponent(ddz_Card_hy).isCheck == true) {
                //过滤掉第一张的点击事件
                cardList[k].getComponent(ddz_Card_hy).isCheck = false
                if (!cardList[k].getComponent(ddz_Card_hy).isStart){
                    cardList[k].getComponent(ddz_Card_hy).onClick()
                }
            }
        }
    }

    //从右向左滑动结束
    touchCardCancel(){ 
        var cardList = this.handbox.children 
        for (var k in cardList) {
            if (!this.handbox.children[k].active) continue
            if (cardList[k].getComponent(ddz_Card_hy).isCheck == true) {
                cardList[k].getComponent(ddz_Card_hy).onClick()
                cardList[k].getComponent(ddz_Card_hy).isCheck = false
            }
        }
    }

    //从缓存池中获得一张牌
    private getOnePoker(parent:cc.Node):ddz_Card_hy {
        if (this.cardPool.length > 0) {
            var card = this.cardPool.shift()
            card.node.active = true
            card.node.parent = parent
            this.cardRun.push(card);
            UDebug.Log("使用缓存池中的图片")
            return card;
        }
        let ins = cc.instantiate(this.card);
        card = ins.getComponent(ddz_Card_hy);
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
    setHeadSpine(banker:boolean){
        // var path = banker ? "ani/doudizhu_nongmin" : "ani/nongmin1"
        let path;
        switch (this.chairId){
            case 0 :
                path = "ani/newPresion/boy_01/boy_01"
                this.isMan = true;
                break;
            case 1 :
                path = "ani/newPresion/girl_01/girl_01"
                this.isMan = false;
                break;
            case 2 :
                path = "ani/newPresion/girl_02/girl_02"
                this.isMan = false;
                break;
        }
        this.headSpine.node.active = true;
        ddz_Main_hy.ins.playSpine(path,"animation1",this.headSpine,true)
        // this.headSpine.setAnimation(0, "animation1", true);
    }

    //头像出牌动画
    playOutCardSpine(banker:boolean){
        // var path = banker ? "ani/doudizhu_nongmin" : "ani/nongmin1"
        // ddz_Main_hy.ins.playSpine(path,"animation2",this.headSpine,false,()=>{
        //     this.setHeadSpine(banker)
        // })
        this.headSpine.node.active = true;
        this.headSpine.setCompleteListener((event) => {
            this.setHeadSpine(banker)
        });
        this.headSpine.setAnimation(0, "animation2", false);
        ddz_Main_hy.ins.musicMgr.playOutCard();
    }

    //地主三张手牌插入动画
    playCardMoveAction(poker:ddz_Card_hy){
        var startPos = poker.node.getPosition()
        poker.setCardUp()
        this.scheduleOnce(() =>{
            if(poker){
                poker.onClick()
            }
        },1);
    }

    //剩余手牌提示
    playWarnSpine(count:number){
        this.spWarn.node.active = true
        var path = "ani/pdk_alart"
        ddz_Main_hy.ins.playSpine(path,"alart",this.spWarn,true,()=>{
        })
        ddz_Main_hy.ins.musicMgr.playWarn(count,this.isMan)
    }

    //抢地主动画
    playCallbankerSpine(){
        this.bankerSpine.node.active = true
        var path = "ani/ddz_dizhu"
        ddz_Main_hy.ins.playSpine(path,"dizhu_01",this.bankerSpine,false,()=>{
            ddz_Main_hy.ins.playSpine(path,"dizhu_02",this.bankerSpine,true)
        })
        // var path = "ani/ddz_dizhu")
        // ddz_Main_hy.ins.playSpine(path,"choose_activate",ddz_Main_hy.ins.spCallBanker,false,()=>{
        //     var worldPos = this.banker.convertToWorldSpaceAR(cc.Vec2.ZERO)
        //     var nodePos = ddz_Main_hy.ins.spCallBanker.node.convertToNodeSpaceAR(worldPos)
        //     var actionMove =  cc.moveTo(0.2,nodePos)
        //     var actionPlay1 = cc.callFunc(()=>{ ddz_Main_hy.ins.playSpine(path,"activate",ddz_Main_hy.ins.spCallBanker,false,()=>{
        //                                         ddz_Main_hy.ins.playSpine(path,"idle",ddz_Main_hy.ins.spCallBanker,false,()=>{
        //                                             ddz_Main_hy.ins.spCallBanker.node.active = false
        //                                             this.banker.active = true
        //                                         })} )})
        //     ddz_Main_hy.ins.spCallBanker.node.runAction(cc.sequence(actionMove,actionPlay1))
        // })
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
                key = AppGame.ins.ddzModel_hy.pokerLibrary.getCardWeight(data.cards[0])
                break
            //连对   
            case CardType.TYPE_TWO_STRAIGHT:
                var path = "ani/px"
                ddz_Main_hy.ins.playSpine(path,"liandui",this.spCardType,false)
                break
            //飞机
            case CardType.TYPE_WING_ZERO: 
            case CardType.TYPE_WING_ONE: 
            case CardType.TYPE_WING_PAIR:
                var path = "ani/feiji/feiji"
                ddz_Main_hy.ins.playSpine(path,"feiji",ddz_Main_hy.ins.spBomb,false)
                ddz_Main_hy.ins.musicMgr.playfeiji(this.isMan)
                break
            //顺子
            case CardType.TYPE_ONE_STRAIGHT:
                var path = "ani/px"
                ddz_Main_hy.ins.playSpine(path,"shunzi",this.spCardType,false)
                break
            //王炸
            case CardType.TYPE_PAIR_KING:  
                var path = "ani/cardtype/wangzha"
                ddz_Main_hy.ins.playSpine(path,"animation",ddz_Main_hy.ins.spBomb,false)
                this.scheduleOnce(()=>{
                    if(ddz_Main_hy.ins.musicMgr){
                        ddz_Main_hy.ins.musicMgr.playBombBg();
                    }
                },1);
                break
            //炸弹
            case CardType.TYPE_BOMB:       
                path = "ani/cardtype/ddz_zhadan"
                if (this.node.name == "player_0") var action = "lujingzhu"
                else if (this.node.name == "player_1")  action= "lujingyou"
                else if (this.node.name == "player_2")  action = "lujingzuo"
                ddz_Main_hy.ins.playSpine(path,action, ddz_Main_hy.ins.spBomb,false,()=>{
                ddz_Main_hy.ins.playSpine(path,"zha", ddz_Main_hy.ins.spBomb,false)
                })
                this.scheduleOnce(()=>{
                    if(ddz_Main_hy.ins.musicMgr){
                        ddz_Main_hy.ins.musicMgr.playBombBg();
                    }
                },1);
                break
        }
        ddz_Main_hy.ins.musicMgr.playCardType(cardType,key,this.isMan)

    }

    //打开闹钟
    showClock(time:number){
        if(time > 0){
            this.actionTip.active = false;
            this.clockTime = time;
            this.clockMaxTime = Number(time + "");
            this.fillRangeGAP = this.clockMaxTime/10;
            this.timeMask.getComponent(cc.Sprite).fillRange = 0;
            this.clockLab.string = `${Math.ceil(this.clockTime)}`
            this.clock.active = true;
        }
    }

    protected update(dt: number) {
        if(this.clockTime > -1){
            this.clockTime -= dt;

            if(this.playClockTime == -1){
                if (this.clockTime > 0 && this.clockTime <= 4){
                    this.playClockTime = 1;
                }
            }

            if(this.playClockTime > -1){
                this.playClockTime -= dt;
                if(this.playClockTime <= 0){
                    ddz_Main_hy.ins.musicMgr.playClock();
                    this.playClockTime = -1;
                }
            }

            if(this.clockTime > 0){
                this.clockLab.string = `${Math.ceil(this.clockTime)}`
                this.timeMask.getComponent(cc.Sprite).fillRange = this.clockTime/this.clockMaxTime;
            }
            if(this.clockTime < 0){
                this.clockTime = -1;
                this.clock.active = false;
                this.timeMask.getComponent(cc.Sprite).fillRange = -1;
            }
        }
    }

    //关闭闹钟
    closeClock(){
        this.clockTime = -1;
        if (this.chairId != AppGame.ins.ddzModel_hy.gMeChairId)
        this.clock.active = false;
    }

    /********************************************************************** 协议 接收event **********************************************/
    private onGamestart(data: any) {
        //洗牌动画需求
        this.actionTip.active = false
        this.handbox.active = true
        if (this.chairId == AppGame.ins.ddzModel_hy.gMeChairId){
            //注册滑动事件
            this.onBindTouchMove()
            this.removeAllCard()
            var handPokers = ddz_Card_hy.sortCardList(data.cards)
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
                    this.scheduleOnce(function(i) {
                        var poker = this.getOnePoker(this.handbox)
                        poker.lockFlag = false
                        poker.setCardValue(handPokers[i])
                        poker.setCardDown()
                        poker.showCardCheck(false)
                        poker.showCardBanker(false)
                        ddz_Main_hy.ins.musicMgr.playSendCard()
                    }.bind(this,i), i * 0.056);
                }
            }
            AppGame.ins.ddzModel_hy.handPokers = handPokers 
        }else{
            for (var i =0; i< HAND_COUNT_MAX;i++){
                if  (data.isreconnect){
                    this.handcount.string = HAND_COUNT_MAX.toString()
                }else{
                    this.scheduleOnce(function(i) {
                        this.handcount.string = i + 1
                    }.bind(this,i), i * 0.056);
                }
            }
        }
    }

    //叫庄通知
    private onCallBanker(data:any) {
        if (data.chairid != this.chairId) return
        UDebug.Log("onCallBanker :" + JSON.stringify(data))
        if (this.chairId == AppGame.ins.ddzModel_hy.gMeChairId){
            if(AppGame.ins.ddzModel_hy.gGameConfig["JdzMode"] == 0){
                this.actionTip.active = false
            }
            let showMsg = null;
            let isCoint = 0;
            if((data.isqdz != null && data.isqdz == 0) || (data.fistjdz != null && data.fistjdz == -1)){
                if(AppGame.ins.ddzModel_hy.gGameConfig["TwoKingMustJdz"] && AppGame.ins.ddzModel_hy.pokerLibrary.CheckMustGrab() == 0){//双王必叫地主
                    showMsg = "双王必叫地主";
                    data.isqdz = 0;
                    isCoint++;
                }
                if(AppGame.ins.ddzModel_hy.gGameConfig["Four2MustJdz"] && AppGame.ins.ddzModel_hy.pokerLibrary.CheckMustGrab() == 1){//四个2必叫地主
                    showMsg = "四个二必叫地主";
                    data.isqdz = 0;
                    isCoint++;
                }
                if(isCoint == 2){//双王必叫地主 四个2必叫地主
                    showMsg = "双王,四个二必叫地主";
                    data.isqdz = 0;
                }
            }
            //洗牌动画需求
            // this.scheduleOnce(function (data,showMsg){
                ddz_Main_hy.ins.action.show(data,showMsg)
            // }.bind(this,data,showMsg),2);
        }else{
            this.showClock(data.waittime)
        }
    }

    //叫庄结果
    private onCallBankerResult(data:any) {
        ddz_Main_hy.ins.action.closeTipMsg();
        let url;
        //0:叫抢模式(叫地主，抢地主，抢地主)  1：叫分模式（1分，2分，3分，分数最高的是本局的地主）
        if(AppGame.ins.ddzModel_hy.gGameConfig["JdzMode"] == 1) {//1 2 3倍 叫分模式
            if (data.chairid != this.chairId) return
            UDebug.Log("onCallBankerResult:" + JSON.stringify(data))
            url = "texture/call" + data.score
            this.showTip(url);
            if (this.chairId != AppGame.ins.ddzModel_hy.gMeChairId){
                this.closeClock()
            }
            ddz_Main_hy.ins.musicMgr.playCallScore(data.score,this.isMan)
        }else{//叫抢地主 模式
            this.actionTip.active = false
            if (data.chairid != this.chairId){
                return
            }
            switch (data.jdz){ //1：叫 2：不叫 3：抢 4：不抢
                case 1:
                    ddz_Main_hy.ins.musicMgr.play_Order(this.isMan)
                    url = "texture/jiaodizhu";
                    break;
                case 2:
                    ddz_Main_hy.ins.musicMgr.play_BuJiao(this.isMan)
                    url = "texture/bujiao3";
                    break;
                case 3:
                    ddz_Main_hy.ins.musicMgr.play_Rob1(this.isMan)
                    url = "texture/qiangdizhu";
                    break;
                case 4:
                    ddz_Main_hy.ins.musicMgr.play_NoRob(this.isMan)
                    url = "texture/buqiang";
                    break;
            }
            this.showTip(url);
            if (this.chairId != AppGame.ins.ddzModel_hy.gMeChairId){
                this.closeClock()
            }

        }
    }
    //显示tip
    showTip(url,closeTime = -1){
        if(url != null){
            UResManager.loadUrlByBundle(AppGame.ins.roomModel.BundleName,url, this.actionTip.getComponent(cc.Sprite),()=>{
                this.actionTip.active = true
                if(closeTime > -1){
                    clearTimeout(this.scoreResTinme);
                    this.scoreResTinme = setTimeout(()=>{
                        if(this.actionTip)this.actionTip.active = false
                    }, 5000);
                }
            })
        }

    }
    //确定地主
    private onBankerInfo(data:any){
        this.actionTip.active = false
        if (data.dzinfo.dzchairid != this.chairId) {
            return
        }
        UDebug.Log("onBankerInfo:" + JSON.stringify(data))
        AppGame.ins.ddzModel_hy.sBankerIndex = data.dzinfo.dzchairid
        //更换头像
        this.setHeadSpine(true)
        //播放抢地主动画
        this.playCallbankerSpine()
        if (data.isreconnect) {
            return
        }
        if (this.chairId == AppGame.ins.ddzModel_hy.gMeChairId){
            // this.banker.active = true;
            let handPokers = AppGame.ins.ddzModel_hy.handPokers
            if(handPokers.length < 20){//防止重复添加公共牌，最多20张牌
                //更新手牌
                this.removeAllCard()
                handPokers = handPokers.concat(data.dzinfo.dicards)
                AppGame.ins.ddzModel_hy.handPokers = handPokers
                //自动抬起最后三张手牌
                AppGame.ins.ddzModel_hy.selectPokers = data.dzinfo.dicards
                ddz_Card_hy.sortCardList(handPokers)
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
        if (this.chairId  == AppGame.ins.ddzModel_hy.gMeChairId){
            if(AppGame.ins.ddzModel_hy.gGameConfig["JdzMode"] == 0){
                this.actionTip.active = false
            }
            ddz_Main_hy.ins.action.show(data)
        }else{
            this.showClock(data.waittime)  
        }
        
    }

    //农民加倍结果
    private onAddScoreResult(data:any) {
        this.actionTip.active = false;
        if (data.chairid != this.chairId){
            return
        }
        if(data.jiabei == 0){//1：加倍  0：不加倍
            ddz_Main_hy.ins.musicMgr.play_bujiabei(this.isMan)
        }else{
            ddz_Main_hy.ins.musicMgr.play_jiabei(this.isMan)
        }
        if (this.chairId != AppGame.ins.ddzModel_hy.gBankerIndex){
            this.closeClock()
            this.showTip("texture/bet" + data.jiabei,5000);
        }
    }

    //出牌通知
    private onOutCard(data:any) {
        if (data.chairid != this.chairId) {
            this.closeClock();
            return
        }
        this.actionTip.active = false
        this.outbox.active = false
        if (this.chairId  == AppGame.ins.ddzModel_hy.gMeChairId){
            for(var i=0; i<this.handbox.childrenCount; i++){
                const poker:ddz_Card_hy = this.handbox.children[i].getComponent(ddz_Card_hy)
            }
            if (!this.isTrust) {
                if(AppGame.ins.ddzModel_hy.gGameConfig["JdzMode"] == 0){
                    this.actionTip.active = false
                }
                ddz_Main_hy.ins.action.show(data)
            }
        }else{
            if (data.isreconnect){
                this.handcount.string = data.leftcardnum.toString()
            }
            this.showClock(data.waittime)  
        }
        //保存当前轮出牌的ID
        AppGame.ins.ddzModel_hy.firstOutChairId = data.chairid
    }

    //跟牌通知，只处理跟牌玩家的数据
    private onFollowCard(data:any){
        if (data.chairid != this.chairId){
            this.closeClock();
            return
        }
        this.actionTip.active = false
        this.outbox.active = false
        if (this.chairId  == AppGame.ins.ddzModel_hy.gMeChairId){
            for(var i=0; i<this.handbox.childrenCount; i++){
                const poker:ddz_Card_hy = this.handbox.children[i].getComponent(ddz_Card_hy)
            }  
            if (!this.isTrust){
                //保留预加载选中的牌
                var selectPokersOld = AppGame.ins.ddzModel_hy.selectPokers
                //要不起
                var selectPokers = AppGame.ins.ddzModel_hy.getPrompt()
                if (selectPokers.length == 0){
                     ddz_Main_hy.ins.action.showPassPanel()
                     this.notCardTip.active = true;
                     this.scheduleOnce(()=>{
                        if(this.notCardTip != null)this.notCardTip.active = false;
                     },3);
                }
                else{
                    AppGame.ins.ddzModel_hy.clearSelectPokers()
                    //还原预加载的牌
                    AppGame.ins.ddzModel_hy.selectPokers = selectPokersOld
                    if(AppGame.ins.ddzModel_hy.gGameConfig["JdzMode"] == 0){
                        this.actionTip.active = false
                    }
                    ddz_Main_hy.ins.action.show(data)
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
        this.actionTip.active = false;
        if (data.lastchairid != this.chairId)return
        //播放动画
        let banker = AppGame.ins.ddzModel_hy.gBankerIndex == this.chairId ? true : false
        this.playOutCardSpine(banker)
        this.playCardTypeSpine(data)
        var outPokers = data.cards
        //隐藏上次打出的牌
        this.outbox.children.forEach(element => { element.active = false})
        if (this.chairId == AppGame.ins.ddzModel_hy.gMeChairId){
            //更新手牌显示
            var outCardListTemp = []
            var cardList =this.handbox.children
            cardList.forEach(element => {
                const poker = element.getComponent(ddz_Card_hy)
                poker.setCardDown()
                //先隐藏
                if (outPokers.includes(poker.value)){
                    element.active = false
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
            var dataCopy = AppGame.ins.ddzModel_hy.handPokers
            AppGame.ins.ddzModel_hy.handPokers = []
            for(var i=0;i<dataCopy.length;i++){
                if (!outPokers.includes(dataCopy[i])){
                    AppGame.ins.ddzModel_hy.handPokers.push(dataCopy[i])
                }
            }
            ddz_Main_hy.ins.action.node.active = false
            AppGame.ins.ddzModel_hy.clearSelectPokers()
            //警告
            let count = AppGame.ins.ddzModel_hy.handPokers.length
            if (count <= 2 && count > 0){
                this.playWarnSpine(count)
            }
            //最后一张牌手牌加上角标
            cardList.forEach(element => {
                const poker = element.getComponent(ddz_Card_hy)
                if (poker.value == AppGame.ins.ddzModel_hy.handPokers[count-1]){
                    poker.showCardBanker(banker)
                }
            })
            ddz_Main_hy.ins.selectType.hide()
        }
        else{
            this.closeClock()
            AppGame.ins.ddzModel_hy.otherOutPokers = outPokers
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
            }

            //显示本次出牌
            for (var i =0; i< outPokers.length;i++){
                var poker:any = this.getOnePoker(this.outbox)
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

        this.outbox.active = true
        //保存当前轮出牌的牌型
        if (data.lastchairid == AppGame.ins.ddzModel_hy.firstOutChairId) {
            AppGame.ins.ddzModel_hy.firstOutCardType = data.cardtype
        }
    }

    //过牌结果
    private onPassReslut(data:any){
        if (data.chairid != this.chairId) return
        this.showTip("texture/pass");
        //关闭倒计时
        if (this.chairId == AppGame.ins.ddzModel_hy.gMeChairId){
            ddz_Main_hy.ins.action.node.active = false
            AppGame.ins.ddzModel_hy.clearSelectPokers()
        }else{
            if (data.isreconnect){
                this.handcount.string = data.leftcardnum.toString()
            }
        }
        this.closeClock()
        ddz_Main_hy.ins.musicMgr.playPass(this.isMan)
    }

    //托管结果
    private onTrustReslut(data:any){
        if (data.chairid != this.chairId) return
        this.isTrust = data.istuoguan ?　true : false
        if (this.chairId == AppGame.ins.ddzModel_hy.gMeChairId){
            ddz_Main_hy.ins.trust.active = this.isTrust
            AppGame.ins.ddzModel_hy.selectPokers = []
        }else{
            this.trust.active = this.isTrust
        }
    }

    hindAction(){
        clearTimeout(this.scoreResTinme);
        this.actionTip.active = false;
        this.handbox.active = false;
    }
    gameOverHandler(){
        if(this.spWarn){
            this.spWarn.node.active = false
        }
    }

    //游戏结束
    onGameEnd(data:any){
        if(this.bankerSpine){
            this.bankerSpine.node.active = false
        }
        this.actionTip.active = false
        if (data.chairid == AppGame.ins.ddzModel_hy.gMeChairId){
            this.onCancelTouchMove()
            for(var i=0; i<this.handbox.childrenCount; i++){
                const poker:ddz_Card_hy = this.handbox.children[i].getComponent(ddz_Card_hy)
                poker.setCardDown()
                poker.showCardCheck(false)
                poker.lockFlag = true
            }
        }else{
            var cardList =this.outbox.children
            cardList.forEach(element => { element.active = false})
            data.cards = ddz_Card_hy.sortCardList(data.cards)
            for (var j in data.cards){
                var poker = this.getOnePoker(this.outbox)
                poker.setCardValue(data.cards[j])
                poker.showCardBanker(data.chairid == AppGame.ins.ddzModel_hy.gBankerIndex)
                poker.lockFlag = true
            }
            this.outbox.active = true
        }
    }


    //清理一部分桌面
    onClearDesk2(){
        UDebug.Log("清理部分桌面")
        this.prop.getComponent(GamePropManager).closePropPanelByUserId(this._userid);
        this.removeAllCard()
        this.bankerSpine.node.active = false
        this.actionTip.active = false
        // this.banker.active = false
        this.handbox.active = false
        clearTimeout(this.scoreResTinme);
        if(this.spWarn){
            this.spWarn.node.active = false
        }
    }
    //清理桌面
    onClearDesk(){
        UDebug.Log("清理桌面")
        this.prop.getComponent(GamePropManager).closePropPanelByUserId(this._userid);
        this.removeAllCard()
        clearTimeout(this.scoreResTinme);
        this.bankerSpine.node.active = false
        this.actionTip.active = false
        // this.banker.active = false
        this.handbox.active = false
        this.headSpine.node.active = false
        this.node.getChildByName("readyIcon").active = false
        this.node.active = false
        this._nickName = ""
        this._userid = 0
        this.userid.string = ""
    }
}


