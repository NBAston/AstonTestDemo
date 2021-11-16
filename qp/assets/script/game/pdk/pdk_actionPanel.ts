import { setUncaughtExceptionCaptureCallback } from "process";
import { EGameType } from "../../common/base/UAllenum";
import { Ddz, Game } from "../../common/cmd/proto";
import UMsgCenter from "../../common/net/UMsgCenter";
import UClock from "../../common/utility/UClock";
import UDebug from "../../common/utility/UDebug";
import UHandler from "../../common/utility/UHandler";
import AppGame from "../../public/base/AppGame";
import UPdkHelper from "./pdk_Helper";
import MPdkModel from "./model/MPdk";
import pdk_Main from "./pdk_Main";
import pdk_Card from "./pdk_Card";
import { CardType } from "./poker/PDKEnum";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ddz_ActionPanel extends cc.Component {
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
        this.node.active = true 
        var status = AppGame.ins.pdkModel.gameStatus
        this.totalTurnTime = data.waittime
        //显示倒计时
        this.showDjs(status,data.waittime)
        this.cardPass.active = pdk_Main.ins.isShowBuchuBtn;
        pdk_Main.ins.clockActionId = UClock.setClockNew(data.waittime,
            function(){
                data.waittime = data.waittime - 0.1
                this.cardCdTime.fillRange = data.waittime / this.totalTurnTime 
            }.bind(this),
            function(time){
                this.showDjs(status,time)
                if (data.waittime <= 3){
                    pdk_Main.ins._music_mgr.playDjs();
                }                  
            }.bind(this),
            function(){
                this.node.active = false
            }.bind(this), true)
    }

    showDjs(status:number,time:number){
        
        UDebug.Log("#####Status = "+status);
        if (status == MPdkModel.PDK_GAMESTATUS.CALL){
            this.actionCard.active = false
        }
        else if(status == MPdkModel.PDK_GAMESTATUS.SEND){
            this.actionCard.active = true
            this.cardClock.string = time.toString()
        }
        else if(status == MPdkModel.PDK_GAMESTATUS.CARD){
            this.actionCard.active = true
            this.cardHint.active = false
            this.cardClock.string = time.toString()
        }
        else if(status == MPdkModel.PDK_GAMESTATUS.FOLLOW_CARD) {
            this.actionCard.active = true
            this.cardHint.active = true
            this.cardClock.string = time.toString()

        }
    }

    onDisable() {
        clearInterval(pdk_Main.ins.clockActionId);
    }

    // 出牌
    onClickOutCard(event: Event) {
        if (AppGame.ins.pdkModel.selectPokers.length === 0) {
            pdk_Main.ins.onShowTips("请选择要出的牌");
            return; 
       }
        var cardTypeData = AppGame.ins.pdkModel.pokerLibrary.getCardType(AppGame.ins.pdkModel.selectPokers)
       if (cardTypeData == undefined) {
            pdk_Main.ins.onShowTips("您选择的牌型不符合规则");
            return; 
       }

        //跟牌时
        if (AppGame.ins.pdkModel.gameStatus == MPdkModel.PDK_GAMESTATUS.FOLLOW_CARD){
            //飞机不带可以压飞机带单 
            if (cardTypeData.type == CardType.PDKTYPE_WING_ZERO && AppGame.ins.pdkModel.firstOutCardType == CardType.PDKTYPE_WING_ONE)
            cardTypeData.type = CardType.PDKTYPE_WING_ONE
        }

        pdk_Main.ins.playerList[0].setHeadSpine(pdk_Main.ins.playerList[0].chairId, parseInt(pdk_Main.ins.playerList[0].handcount.string)<=2?"chupai_02":"chupai_01", false);
        AppGame.ins.pdkModel.onSendOutCards(cardTypeData.type);
        // this.node.active = false;
        // clearInterval(pdk_Main.ins.clockActionId);
    }


    // 过牌
    onClickPass(event: Event) {
        pdk_Main.ins._music_mgr.playClick();
        UDebug.log("---------------------点击过牌消息22222-------过牌消息发送-----");

        AppGame.ins.pdkModel.onSendPass();
        this.node.active = false;
        //clearInterval(this.clockId);
    }

    //提示
    onClickPrompt(){
        pdk_Main.ins._music_mgr.playClick();
        var handbox = pdk_Main.ins.playerList[0].handbox.children
        handbox.forEach(element => {
            const poker = element.getComponent(pdk_Card)
                if(poker.upFlag) {
                    poker.setCardDown();
                } 
        })
        // AppGame.ins.pdkModel.clearSelectPokers();
        var promptData = AppGame.ins.pdkModel.getPrompt();
        handbox.forEach(element => {
            const poker = element.getComponent(pdk_Card)
            if (promptData.includes(poker._cardValue)){
                poker.setCardUp()
            } else {
                if(poker.upFlag) {
                    poker.setCardDown();
                } 
            }
        })

        if(promptData.length == 0 && AppGame.ins.pdkModel.pokerLibrary.getCardType(AppGame.ins.pdkModel.handPokers)==undefined) {
            // UDebug.log("---------------------提示方法----过牌消息发送-----");
            AppGame.ins.pdkModel.onSendPass();
            clearInterval(pdk_Main.ins.clockActionId);
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
