
import UClock from "../../common/utility/UClock";
import UDebug from "../../common/utility/UDebug";
import AppGame from "../../public/base/AppGame";
import ddz_Card from "./ddz_Card";
import { CardType } from "./ddz_Library";
import ddz_Main from "./ddz_Main";
import MDDZ from "./model/MDDZ";
import MDDZModel from "./model/MDDZ";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ddz_ActionPanel extends cc.Component {
    @property(cc.Node) actionCall: cc.Node = null;
    @property(cc.Node) CallScore: cc.Node[] = [];
    @property(cc.Sprite) callScoreSprite: cc.Sprite[] = [];
    @property(cc.Node) actionCard: cc.Node = null;
    @property(cc.Node) actionScore: cc.Node = null;
    @property(cc.Label) callClock: cc.Label = null;
    @property(cc.Label) scoreClock: cc.Label = null;
    @property(cc.Label) cardClock: cc.Label = null;
    @property(cc.Node) cardPass: cc.Node = null;
    @property(cc.Node) cardHint: cc.Node = null;
    @property(cc.Node) actionPass: cc.Node = null;
    @property(cc.Label) passClock: cc.Label = null;
    @property(cc.Sprite) callCdTime: cc.Sprite = null;
    @property(cc.Sprite) scoreCdTime: cc.Sprite = null;
    @property(cc.Sprite) cardCdTime: cc.Sprite = null;
    @property(cc.Sprite) passCdTime: cc.Sprite = null;
    

    //时钟序号
    private clockId:any = null
    private totalTurnTime:number = 0

    show(data:any){
        var status = AppGame.ins.ddzModel.gameStatus
        //显示倒计时
        this.totalTurnTime = data.waittime
        this.showAction(status,data.waittime)
        this.callCdTime.fillRange = 1
        this.scoreCdTime.fillRange = 1
        this.cardCdTime.fillRange = 1
        clearInterval(this.clockId)
        this.clockId = UClock.setClockNew(data.waittime,
            function(){
                data.waittime = data.waittime - 0.1
                this.refreshClockRound(status,data.waittime)
            }.bind(this),
            function(time){
                this.showAction(status,time)
                if (data.waittime <= 3){
                    ddz_Main.ins.musicMgr.playClock()
                }  
            }.bind(this),
            function(){
                this.node.active = false
            }.bind(this),true)
        if (status == MDDZModel.DDZ_GAMESTATUS.CALL){
            for(var i=0;i<this.CallScore.length;i++){
                this.CallScore[i].getComponent(cc.Button).interactable = !data.callscorestat[i]
                if (this.CallScore[i].getComponent(cc.Button).interactable){
                    this.callScoreSprite[i].setMaterial(0, cc.Material.createWithBuiltin("2d-sprite", 0));
                }else{
                    this.callScoreSprite[i].setMaterial(0, cc.Material.createWithBuiltin("2d-gray-sprite", 0));
                }
            }
        }
        this.node.active = true 
    }

    showPassPanel(){
        //显示倒计时
        var waittime = 10
        this.passClock.string = waittime.toString()
        this.passCdTime.fillRange = 1
        this.clockId = UClock.setClockNew(waittime,
            function(){
                waittime = waittime - 0.1
                this.passCdTime.fillRange = waittime / 10
            }.bind(this),
            function(time){
                if (time >= 0)
                this.passClock.string = time.toString()
                if (time <= 3){
                    ddz_Main.ins.musicMgr.playClock()
                }  
            }.bind(this),
            function(){
                this.onClickPass()
            }.bind(this),true)
        this.actionCall.active = false
        this.actionScore.active = false
        this.actionCard.active = false
        this.actionPass.active = true
        this.node.active = true 
    }

    onDisable(){
        clearInterval(this.clockId)
    }

    showAction(status:number,time:number){
        if (status == MDDZModel.DDZ_GAMESTATUS.CALL){
            this.actionCall.active = true
            this.actionScore.active = false
            this.actionCard.active = false
            this.actionPass.active = false
            if (time >= 0)
            this.callClock.string = time.toString()
        }
        else if(status == MDDZModel.DDZ_GAMESTATUS.SCORE){
            this.actionCall.active = false
            this.actionScore.active = true
            this.actionCard.active = false
            this.actionPass.active = false
            if (time >= 0)
            this.scoreClock.string = time.toString()
        }
        else if(status == MDDZModel.DDZ_GAMESTATUS.OUT){
            this.actionCall.active = false
            this.actionScore.active = false
            this.actionPass.active = false
            this.actionCard.active = true
            this.cardPass.active = false
            this.cardHint.active = false
            if (time >= 0)
            this.cardClock.string = time.toString()
        }
        else if(status == MDDZModel.DDZ_GAMESTATUS.FOLLOW){
            this.actionCall.active = false
            this.actionScore.active = false
            this.actionPass.active = false
            this.actionCard.active = true
            this.cardPass.active = true
            this.cardHint.active = true
            if (time >= 0)
            this.cardClock.string = time.toString()
        }
    }

    //刷新时钟圆圈
    refreshClockRound(status:number,time:number){
        if (status == MDDZModel.DDZ_GAMESTATUS.CALL){
            this.callCdTime.fillRange = time / this.totalTurnTime 
        }
        else if(status == MDDZModel.DDZ_GAMESTATUS.SCORE){
            this.scoreCdTime.fillRange = time / this.totalTurnTime 
        }
        else if(status == MDDZModel.DDZ_GAMESTATUS.OUT){
            this.cardCdTime.fillRange = time / this.totalTurnTime 
        }
        else if(status == MDDZModel.DDZ_GAMESTATUS.FOLLOW){
            this.cardCdTime.fillRange = time / this.totalTurnTime 
        }
    }

    //叫分
    onClickCallSore(event:Event, CustomEventData:number){
        AppGame.ins.ddzModel.sendCallBanker(CustomEventData)
        this.node.active = false
    }

    //加倍
    onClickAddScore(event:Event, CustomEventData:boolean){
        AppGame.ins.ddzModel.sendAddScore(CustomEventData)
        this.node.active = false
    }

    //出牌
    onClickOutCard(){
       if (AppGame.ins.ddzModel.selectPokers.length === 0) {
            return ddz_Main.ins.onShowTips("请选择要出的牌")
       }

       AppGame.ins.ddzModel.pokerLibrary.splitToPlane = true
       //提示存在多个牌型
        if (AppGame.ins.ddzModel.pokerLibrary.CheckNeedSelectType(AppGame.ins.ddzModel.selectPokers)){
            var time = parseInt(this.cardClock.string)
            ddz_Main.ins.selectType.show(AppGame.ins.ddzModel.selectPokers,time)
            return
        }

       var cardTypeData = AppGame.ins.ddzModel.pokerLibrary.getCardType(AppGame.ins.ddzModel.selectPokers)
       if (cardTypeData == undefined) {
            return ddz_Main.ins.onShowTips("请选择正确的牌型")
       }

        //跟牌时，飞机不带可以压飞机带单张
        if (AppGame.ins.ddzModel.gameStatus == MDDZ.DDZ_GAMESTATUS.FOLLOW){
            if (cardTypeData.type == CardType.TYPE_WING_ZERO && AppGame.ins.ddzModel.firstOutCardType == CardType.TYPE_WING_ONE){
                cardTypeData.type = CardType.TYPE_WING_ONE
            }
            
        }
        AppGame.ins.ddzModel.sendOutCard(cardTypeData.type)
    }

    //过牌
    onClickPass(){
        AppGame.ins.ddzModel.sendPassCard()
        this.node.active = false
        this.setHandCardBack()
    }

    //提示
    onClickPrompt(){
        this.setHandCardBack()
        var selectPokers =AppGame.ins.ddzModel.getPrompt()
        if (selectPokers.length == 0){
            return ddz_Main.ins.onShowTipImage()
        }
        var handbox = ddz_Main.ins.playerList[0].handbox.children
        handbox.forEach(element => {
            const poker = element.getComponent(ddz_Card)
            if (selectPokers.includes(poker.value)){
                poker.setCardUp()
            }
        })
    }

    //还原手牌位置
    setHandCardBack(){
        var handbox = ddz_Main.ins.playerList[0].handbox.children
        handbox.forEach(element => {
            const poker = element.getComponent(ddz_Card)
            poker.setCardDown()
            poker.showCardCheck(false)
        })
    }
}
