
import UClock from "../../common/utility/UClock";
import UDebug from "../../common/utility/UDebug";
import AppGame from "../../public/base/AppGame";
import ddz_Card_hy from "./ddz_Card_hy";
import { CardType } from "./ddz_Library_hy";
import ddz_Main_hy from "./ddz_Main_hy";
import MDDZModel_hy from "./model/MDDZ_hy";
// import MDDZModel_hy from "./model/MDDZ";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ddz_ActionPanel_hy extends cc.Component {
    @property(cc.Node) actionCall: cc.Node = null;
    @property(cc.Node) actionCall2: cc.Node = null;
    @property(cc.Node) CallScore: cc.Node[] = [];
    @property(cc.Node) actionCard: cc.Node = null;
    @property(cc.Node) actionScore: cc.Node = null;
    @property(cc.Label) callClock: cc.Label = null;
    @property(cc.Label) callClock2: cc.Label = null;
    @property(cc.Label) scoreClock: cc.Label = null;
    @property(cc.Label) cardClock: cc.Label = null;
    @property(cc.Node) cardPass: cc.Node = null;
    @property(cc.Node) cardHint: cc.Node = null;
    @property(cc.Node) actionPass: cc.Node = null;
    @property(cc.Label) passClock: cc.Label = null;
    @property(cc.Node) mask: cc.Node = null;
    @property(cc.Node) tipMsg: cc.Node = null;


    //时钟序号
    private clockTime:number = -1
    private clockTime2:number = -1
    private playClockTime:number = -1
    private playClockTime2:number = -1
    private isqdz:number = -1// =0  按钮显示 叫地主，=1 按钮显示 抢地主
    private isqdz2:number = -1// =0  按钮显示 叫地主，=1 按钮显示 抢地主

    private clockMaxTime:number = -1;
    private fillRangeGAP:number = -1;
    private timeMask:cc.Node;
    private clockLab:cc.Label;

    closeTipMsg(){
        this.tipMsg.active = false;
    }
    show(data:any,showMsg:string = null){
        var status = AppGame.ins.ddzModel_hy.gameStatus;
        this.isqdz2 = data.isqdz;
        if(showMsg != null){
            this.tipMsg.active = true;
            this.tipMsg.getChildByName("context").getComponent(cc.Label).string = showMsg;
        }
        //显示倒计时
        if(data.fistjdz != null){
            let isqdz = data.fistjdz == -1 ? 0 : data.fistjdz;
            this.showAction(status,data.waittime,isqdz)
        }else{
            this.showAction(status,data.waittime,data.isqdz)
        }

        this.clockTime = data.waittime
        this.clockMaxTime = data.waittime

        let gameModel = AppGame.ins.ddzModel_hy.gGameConfig["JdzMode"];//0:叫抢模式(叫地主，抢地主，抢地主)  1：叫分模式（1分，2分，3分，分数最高的是本局的地主）
        if(gameModel == 1) {//1 2 3倍 叫分模式
            if (status == MDDZModel_hy.DDZ_GAMESTATUS.CALL){
                for(var i=0;i<this.CallScore.length;i++){
                    this.CallScore[i].getComponent(cc.Button).interactable = !data.callscorestat[i]
                }
            }
        }
        this.node.active = true 
    }

    protected update(dt: number) {
        if(this.clockTime > -1){
            this.clockTime -= dt;

            if(this.playClockTime == -1){
                if (this.clockTime > 0 && this.clockTime <= 3){
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
                this.showAction(AppGame.ins.ddzModel_hy.gameStatus,Math.ceil(this.clockTime),this.isqdz2)
                this.clockLab.string = `${Math.ceil(this.clockTime)}`
                let end = (this.clockTime/this.clockMaxTime);
                if(end > -1){
                    this.timeMask.getComponent(cc.Sprite).fillRange = end;
                }
            }
            if(this.clockTime < 0){
                this.clockTime = -1;
                this.mask.active = false;
                this.node.active = false;
            }
        }
        if(this.clockTime2 > -1){
            this.clockTime2 -= dt;
            if(this.playClockTime2 == -1){
                if (this.clockTime2 > 0 && this.clockTime2 <= 4){
                    this.playClockTime2 = 1;
                }
            }
            if(this.playClockTime2 > -1){
                this.playClockTime2 -= dt;
                if(this.playClockTime2 <= 0){
                    ddz_Main_hy.ins.musicMgr.playClock();
                    this.playClockTime2 = -1;
                }
            }

            if(this.clockTime2 > 0){
                this.passClock.string = `${Math.ceil(this.clockTime2)}`
                this.clockLab.string = `${Math.ceil(this.clockTime2)}`
                let end = (this.clockTime2/this.clockMaxTime);
                if(end > -1){
                    this.timeMask.getComponent(cc.Sprite).fillRange = end;
                }
            }
            if(this.clockTime2 < 0){
                this.clockTime2 = -1;
                this.onClickPass();
            }
        }
    }

    showPassPanel(){
        //显示倒计时
        this.passClock.string = `${Math.ceil(this.clockTime2)}`
        this.actionCall.active = false
        this.actionCall2.active = false
        this.actionScore.active = false
        this.actionCard.active = false
        this.actionPass.active = true
        this.timeMask = this.actionPass.getChildByName("clock").getChildByName("timeMask");
        this.clockLab = this.actionPass.getChildByName("clock").getChildByName("timeBG").getChildByName("lab").getComponent(cc.Label);
        this.node.active = true
        this.clockTime2 = 10
        this.clockMaxTime = 10
    }

    onDisable(){
        this.clockTime = -1;
        this.clockTime2 = -1;
    }

    showAction(status:number,time:number,isqdz = null){
        if (status == MDDZModel_hy.DDZ_GAMESTATUS.CALL || status == MDDZModel_hy.DDZ_GAMESTATUS.LANDLORD){
            this.mask.active = true
            let isMustGrab = true;
            //是否必须抢地主
            if(AppGame.ins.ddzModel_hy.gGameConfig["TwoKingMustJdz"] && AppGame.ins.ddzModel_hy.pokerLibrary.CheckMustGrab() == 0 && isqdz == 0){//双王必叫地主
                isMustGrab = false;
            }
            if(AppGame.ins.ddzModel_hy.gGameConfig["Four2MustJdz"] && AppGame.ins.ddzModel_hy.pokerLibrary.CheckMustGrab() == 1 && isqdz == 0){//四个2必叫地主
                isMustGrab = false;
            }
            this.actionCall2.getChildByName("pass").getComponent(cc.Button).interactable = isMustGrab;
            this.actionCall.getChildByName("pass").getComponent(cc.Button).interactable = isMustGrab;
            this.actionCall2.getChildByName("pass2").getComponent(cc.Button).interactable = isMustGrab;

            let gameModel = AppGame.ins.ddzModel_hy.gGameConfig["JdzMode"];//0:叫抢模式(叫地主，抢地主，抢地主)  1：叫分模式（1分，2分，3分，分数最高的是本局的地主）
            if(gameModel == 1){//改变游戏模式
                this.actionCall.active = true
                this.callClock.string = time.toString()
                this.timeMask = this.actionCall.getChildByName("clock").getChildByName("timeMask");
                this.clockLab = this.actionCall.getChildByName("clock").getChildByName("timeBG").getChildByName("lab").getComponent(cc.Label);
            }else{
                this.callClock2.string = time.toString()
                if(isqdz != null){
                    this.isqdz = isqdz;
                    this.actionCall2.getChildByName("score1").getChildByName("lab").active = isqdz == 0;
                    let labAct = this.actionCall2.getChildByName("score1").getChildByName("lab").active;
                    this.actionCall2.getChildByName("score1").getChildByName("lab2").active = !labAct;

                    this.actionCall2.getChildByName("pass").active = isqdz == 0;
                    let passAct = this.actionCall2.getChildByName("pass").active;
                    this.actionCall2.getChildByName("pass2").active = !passAct;
                }else{
                    this.actionCall2.getChildByName("score1").getChildByName("lab").active = false;
                    let labAct = this.actionCall2.getChildByName("score1").getChildByName("lab").active;
                    this.actionCall2.getChildByName("score1").getChildByName("lab2").active = !labAct;

                    this.actionCall2.getChildByName("pass").active = true;
                    let passAct = this.actionCall2.getChildByName("pass").active;
                    this.actionCall2.getChildByName("pass2").active = !passAct;
                }
                this.actionCall2.active = true
                this.timeMask = this.actionCall2.getChildByName("clock").getChildByName("timeMask");
                this.clockLab = this.actionCall2.getChildByName("clock").getChildByName("timeBG").getChildByName("lab").getComponent(cc.Label);
            }

            this.actionScore.active = false
            this.actionCard.active = false
            this.actionPass.active = false
        }
        else if(status == MDDZModel_hy.DDZ_GAMESTATUS.SCORE){
            this.actionCall.active = false
            this.actionCall2.active = false
            this.actionScore.active = true
            this.timeMask = this.actionScore.getChildByName("clock").getChildByName("timeMask");
            this.clockLab = this.actionScore.getChildByName("clock").getChildByName("timeBG").getChildByName("lab").getComponent(cc.Label);
            this.actionCard.active = false
            this.actionPass.active = false
            this.scoreClock.string = time.toString()
        }
        else if(status == MDDZModel_hy.DDZ_GAMESTATUS.OUT){
            this.actionCall.active = false
            this.actionCall2.active = false
            this.actionScore.active = false
            this.actionPass.active = false
            this.actionCard.active = true
            this.timeMask = this.actionCard.getChildByName("clock").getChildByName("timeMask");
            this.clockLab = this.actionCard.getChildByName("clock").getChildByName("timeBG").getChildByName("lab").getComponent(cc.Label);
            this.cardPass.active = false
            this.cardHint.active = false
            this.cardClock.string = time.toString()
        }
        else if(status == MDDZModel_hy.DDZ_GAMESTATUS.FOLLOW){
            this.actionCall.active = false
            this.actionCall2.active = false
            this.actionScore.active = false
            this.actionPass.active = false
            this.actionCard.active = true
            this.cardPass.active = true
            this.timeMask = this.cardPass.parent.getChildByName("clock").getChildByName("timeMask");
            this.clockLab = this.cardPass.parent.getChildByName("clock").getChildByName("timeBG").getChildByName("lab").getComponent(cc.Label);
            this.cardHint.active = true
            this.cardClock.string = time.toString()
        }
        this.fillRangeGAP = this.clockMaxTime/10;
        this.timeMask.getComponent(cc.Sprite).fillRange = 0;
    }

    //叫分 1-3 是 叫分模式：1分，2分，3分，分数最高的是本局的地主。  4 是 叫抢模式：叫地主，抢地主，抢地主模式 。 5 不抢地主
    onClickCallSore(event:Event, CustomEventData:number){
        if(event != null){
            ddz_Main_hy.ins.musicMgr.playClickBtn();
        }
        if(CustomEventData == 4 || CustomEventData == 5){
            if(this.tipMsg.active){
                this.tipMsg.active = false;
            }
            if(CustomEventData == 5){
                if(this.isqdz == 0){
                    AppGame.ins.ddzModel_hy.sendCallBanker2(2);// 1：叫 2：不叫 3：抢 4：不抢
                }else if(this.isqdz == 1){
                    AppGame.ins.ddzModel_hy.sendCallBanker2(4);// 1：叫 2：不叫 3：抢 4：不抢
                }
            }else{
                if(this.isqdz == 0){
                    AppGame.ins.ddzModel_hy.sendCallBanker2(1);// 1：叫 2：不叫 3：抢 4：不抢
                }else if(this.isqdz == 1){
                    AppGame.ins.ddzModel_hy.sendCallBanker2(3);// 1：叫 2：不叫 3：抢 4：不抢
                }
            }
            this.mask.active = false
            this.node.active = false
        }else{
            AppGame.ins.ddzModel_hy.sendCallBanker(CustomEventData)
            this.mask.active = false
            this.node.active = false
        }
    }

    //加倍
    onClickAddScore(event:Event, CustomEventData:boolean){
        if(event != null){
            ddz_Main_hy.ins.musicMgr.playClickBtn();
        }
        AppGame.ins.ddzModel_hy.sendAddScore(CustomEventData)
        this.mask.active = false
        this.node.active = false
    }

    //出牌
    onClickOutCard(){
       if (AppGame.ins.ddzModel_hy.selectPokers.length === 0) {
            return ddz_Main_hy.ins.onShowTips("请选择要出的牌")
       }
       AppGame.ins.ddzModel_hy.pokerLibrary.splitToPlane = true
       //提示存在多个牌型
       if (AppGame.ins.ddzModel_hy.pokerLibrary.CheckNeedSelectType(AppGame.ins.ddzModel_hy.selectPokers)) {
           var time = parseInt(this.cardClock.string)
           ddz_Main_hy.ins.selectType.show(AppGame.ins.ddzModel_hy.selectPokers,time)
           return
       }

       var cardTypeData = AppGame.ins.ddzModel_hy.pokerLibrary.getCardType(AppGame.ins.ddzModel_hy.selectPokers)
       if (cardTypeData == undefined) {
            return ddz_Main_hy.ins.onShowTips("请选择正确的牌型" )
       }else{
            if (!AppGame.ins.ddzModel_hy.gGameConfig["AllowedFourWithTwo"] && (cardTypeData.type == CardType.TYPE_FOUR_TWO_ONE || cardTypeData.type == CardType.TYPE_FOUR_TWO_PAIR)){
                return ddz_Main_hy.ins.onShowTips("不支持四带二牌型")
            }
            if (!AppGame.ins.ddzModel_hy.gGameConfig["AllowedThreeWithTwo"] && cardTypeData.type == CardType.TYPE_THREE_PAIR){
                return ddz_Main_hy.ins.onShowTips("不支持三带二牌型")
            }
            if (!AppGame.ins.ddzModel_hy.gGameConfig["AllowedThree"] && cardTypeData.type == CardType.TYPE_THREE){
                return ddz_Main_hy.ins.onShowTips("不支持三张牌型")
            }
       }

        //跟牌时，飞机不带可以压飞机带单张
        if (AppGame.ins.ddzModel_hy.gameStatus == MDDZModel_hy.DDZ_GAMESTATUS.FOLLOW){
            if (cardTypeData.type == CardType.TYPE_WING_ZERO && AppGame.ins.ddzModel_hy.firstOutCardType == CardType.TYPE_WING_ONE)
            cardTypeData.type = CardType.TYPE_WING_ONE
        }
        AppGame.ins.ddzModel_hy.sendOutCard(cardTypeData.type)
        //this.mask.active = false
        //this.node.active = false
        this.clockTime2 = -1;
    }


    //过牌
    onClickPass(event = null){
        if(event != null){
            ddz_Main_hy.ins.musicMgr.playClickBtn();
        }
        AppGame.ins.ddzModel_hy.sendPassCard()
        this.mask.active = false
        this.node.active = false
        this.setHandCardBack()
        this.clockTime2 = -1;
    }

    //提示
    onClickPrompt(){
        this.setHandCardBack()
        var selectPokers =AppGame.ins.ddzModel_hy.getPrompt()
        if (selectPokers.length == 0){
            return ddz_Main_hy.ins.onShowTips("没有大过对方的牌")
        }
        var handbox = ddz_Main_hy.ins.playerList[0].handbox.children
        handbox.forEach(element => {
            const poker = element.getComponent(ddz_Card_hy)
            if (selectPokers.includes(poker.value)){
                poker.setCardUp()
            }
        })
    }

    //还原手牌位置
    setHandCardBack(){
        this.isqdz = -1;
        this.isqdz2 = -1;
        var handbox = ddz_Main_hy.ins.playerList[0].handbox.children
        handbox.forEach(element => {
            const poker = element.getComponent(ddz_Card_hy)
            poker.setCardDown()
            poker.showCardCheck(false)
        })
    }
}
