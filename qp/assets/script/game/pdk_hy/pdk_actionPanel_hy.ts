import { setUncaughtExceptionCaptureCallback } from "process";
import UMsgCenter from "../../common/net/UMsgCenter";
import UClock from "../../common/utility/UClock";
import UDebug from "../../common/utility/UDebug";
import UHandler from "../../common/utility/UHandler";
import AppGame from "../../public/base/AppGame";
import UPdkHelper from "./pdk_Helper_hy";
import MPdkModel from "./model/MPdk_hy";
import pdk_Main_hy from "./pdk_Main_hy";
import pdk_Card_hy from "./pdk_Card_hy";
import { CardType } from "./poker/PDKEnum_hy";
import MPdk_hy from "./model/MPdk_hy";
import MBaseGameModel from "../../public/hall/MBaseGameModel";

const { ccclass, property } = cc._decorator;
@ccclass
export default class pdk_actionPanel_hy extends cc.Component {
  
    @property(cc.Node) actionCard: cc.Node = null;
    @property(cc.Label) cardClock: cc.Label = null;
    @property(cc.Node) cardPass: cc.Node = null;
    @property(cc.Node) cardHint: cc.Node = null;
    @property(cc.Node) cardOut: cc.Node = null;
    @property(cc.Sprite) cardCdTime: cc.Sprite = null;

    //时钟序号
    private clockId:any = null;
    private totalTurnTime:number = 0

    show(data:any){
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SET_CLOCK_RED_COLOR, this.setClockColor, this)
        this.node.active = true 
        this.totalTurnTime = data.waittime
        var status = AppGame.ins.fPdkModel.gameStatus
        this.cardCdTime.fillRange = 1
        //显示倒计时
        this.showDjs(status,data.waittime)
        // this.cardClock.node.color = cc.color(252,121,0);
        if(data.waittime >= 100) {
            this.cardClock.fontSize = 30;
        } else {
            if(data.waittime == 0) { 
                // this.cardClock.node.color = cc.color(255,0,0);
            }
            this.cardClock.fontSize = 40;
        }
        if(data.waittime > 0) {
            pdk_Main_hy.ins.clockActionId = UClock.setClockNew(data.waittime,
                function(){
                    if(this.cardCdTime) {
                        data.waittime = data.waittime - 0.1
                        this.cardCdTime.fillRange = data.waittime / this.totalTurnTime 
                    }
                }.bind(this),
                function(time){
                    // this.clock.string = time.toString()
                    this.showDjs(status,time)
                    if (data.waittime <= 3){
                        pdk_Main_hy.ins._music_mgr.playDjs();
                    }  
                }.bind(this),
                function(){
                    if(MPdk_hy.ins.gameCfgInfo && MPdk_hy.ins.gameCfgInfo.ChuPaiTime != 0) {
                        clearInterval(pdk_Main_hy.ins.clockActionId);
                        this.node.active = false
                    } else {
                        // this.cardClock.string = "0";
                    }
                    // this.cardClock.node.color = cc.color(255,0,0);
                }.bind(this),true)
        }

      
    }

    showDjs(status:number,time:number){
        // if(time <=3 ) {
        //     pdk_Main_hy.ins._music_mgr.playDjs();
        // }
        UDebug.Log("#####Status = "+status);
        
        if (status == MPdkModel.PDK_GAMESTATUS.CALL){
           
        }
        else if(status == MPdkModel.PDK_GAMESTATUS.SEND){
          
            this.actionCard.active = true
            this.cardClock.string = time.toString()
        }
        else if(status == MPdkModel.PDK_GAMESTATUS.CARD){
            
            this.actionCard.active = true
            this.cardHint.active = false
            this.cardPass.active = false
            this.cardClock.string = time.toString()
        }
        else if(status == MPdkModel.PDK_GAMESTATUS.FOLLOW_CARD) {
           
            this.actionCard.active = true
            this.cardPass.active = MPdk_hy.ins.gameCfgInfo?MPdk_hy.ins.gameCfgInfo.AllowedPass:false
            this.cardHint.active = true
            this.cardClock.string = time.toString()

        }
    }

    setClockColor() {
        // this.cardClock.node.color = cc.color(255,0,0);
    }

    onDisable() {
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SET_CLOCK_RED_COLOR, this.setClockColor, this)
        clearInterval(pdk_Main_hy.ins.clockActionId);
    }

    // 出牌
    onClickOutCard(event: Event) {
        if (AppGame.ins.fPdkModel.selectPokers.length === 0) {
            pdk_Main_hy.ins.onShowTips("请选择要出的牌");
            return; 
       }
       var cardTypeData = AppGame.ins.fPdkModel.pokerLibrary.getCardType(AppGame.ins.fPdkModel.selectPokers) 
       if (cardTypeData == undefined) {
            pdk_Main_hy.ins.onShowTips("您选择的牌不符合规则");
            return; 
       }else{
            if (AppGame.ins.fPdkModel.gameCfgInfo && !AppGame.ins.fPdkModel.gameCfgInfo["AllowedFourWithTwo"] && cardTypeData.type == CardType.PDKTYPE_FOUR_TWO){
                return pdk_Main_hy.ins.onShowTips("不支持四带二牌型")
            }
            if (AppGame.ins.fPdkModel.gameCfgInfo && !AppGame.ins.fPdkModel.gameCfgInfo["AllowedFourWithThree"] && cardTypeData.type == CardType.PDKTYPE_FOUR_THREE){
                return pdk_Main_hy.ins.onShowTips("不支持四带三牌型")
            }
       }
       //特殊情况，改变牌型
        if (AppGame.ins.fPdkModel.gameStatus == MPdkModel.PDK_GAMESTATUS.FOLLOW_CARD){
            //跟牌时飞机不带可以压飞机带单 
            if (cardTypeData.type == CardType.PDKTYPE_WING_ZERO && AppGame.ins.fPdkModel.firstOutCardType == CardType.PDKTYPE_WING_ONE){
                cardTypeData.type = CardType.PDKTYPE_WING_ONE
            }
        }

        //三A算炸弹
        var bThreeAIsBomb = AppGame.ins.fPdkModel.gameCfgInfo?AppGame.ins.fPdkModel.gameCfgInfo["ThreeAIsBomb"]:null
        if (bThreeAIsBomb && cardTypeData.type == CardType.PDKTYPE_THREE && AppGame.ins.fPdkModel.selectPokers[0] == 11){
            cardTypeData.type = CardType.PDKTYPE_BOMB
        }

        pdk_Main_hy.ins.playerList[0].setHeadSpine(pdk_Main_hy.ins.playerList[0].chairId,  parseInt(pdk_Main_hy.ins.playerList[0].handcount.string)!=2?"chupai_01":"chupai_02", false);
        AppGame.ins.fPdkModel.onSendOutCards(cardTypeData.type);
        // this.node.active = false; 
    }

    // 过牌
    onClickPass(event: Event) {
        pdk_Main_hy.ins._music_mgr.playClick();
        AppGame.ins.fPdkModel.onSendPass();
        this.node.active = false;
        //clearInterval(this.clockId);
    }

    //提示
    onClickPrompt(){
       
        pdk_Main_hy.ins._music_mgr.playClick();
        var handbox = pdk_Main_hy.ins.playerList[0].handbox.children
        handbox.forEach(element => {
            const poker = element.getComponent(pdk_Card_hy)
                if(poker.upFlag) {
                    poker.setCardDown();
                } 
        })
        // AppGame.ins.fPdkModel.clearSelectPokers();
        var promptData = AppGame.ins.fPdkModel.getPrompt();
        handbox.forEach(element => {
            const poker = element.getComponent(pdk_Card_hy)
            if (promptData.includes(poker._cardValue)){
                poker.setCardUp()
            } else {
                if(poker.upFlag) {
                    poker.setCardDown();
                } 
            }
        })

        if(promptData.length == 0 && AppGame.ins.fPdkModel.pokerLibrary.getCardType(AppGame.ins.fPdkModel.handPokers) == undefined) {
            AppGame.ins.fPdkModel.onSendPass();
            clearInterval(pdk_Main_hy.ins.clockActionId);
        }
    }

    //播放spine动画
    playSpine(path:string,animation:string,skeleton:sp.Skeleton,callback:Function): void {
        if (AppGame.ins.roomModel.BundleName == "") return
            UDebug.Log("name: " + AppGame.ins.roomModel.BundleName)
            let bundle = cc.assetManager.getBundle(AppGame.ins.roomModel.BundleName)
            bundle.load(path, sp.SkeletonData, function(err, res:any){
                if(err) cc.error(err)
                cc.loader.setAutoRelease(res, true)
                skeleton.skeletonData = res
                skeleton.setAnimation(0, animation, false)
                skeleton.setCompleteListener((event) =>{
                    if (callback != undefined ) callback()
                })
            })
    }

    setHeadSpine(isBanker: boolean): void {
        var path = isBanker ? "game/ddz/ani/hand/doudizhu_nongmin" : "game/ddz/ani/hand/nongmin1"
        if (AppGame.ins.roomModel.BundleName == "") return
            UDebug.Log("name: " + AppGame.ins.roomModel.BundleName)
            let bundle = cc.assetManager.getBundle(AppGame.ins.roomModel.BundleName)
            bundle.load(path, sp.SkeletonData, function(err, res:any){
                if(err) cc.error(err)
                cc.loader.setAutoRelease(res, true)
                this.headSpine.skeletonData = res
                this.headSpine.setAnimation(0, 'animation1', true)
            })
    }
}
