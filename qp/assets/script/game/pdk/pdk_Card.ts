
import { isMainThread } from "worker_threads";
import USpriteFrames from "../../common/base/USpriteFrames";
import UDebug from "../../common/utility/UDebug";
import UEventListener from "../../common/utility/UEventListener";
import UHandler from "../../common/utility/UHandler";
import AppGame from "../../public/base/AppGame";
import MPdk from "./model/MPdk";
import { UIPDKBattleOver } from "./pdk_Helper";
import pdk_Main from "./pdk_Main";

const { ccclass, property } = cc._decorator;
@ccclass
export default class pdk_Card extends cc.Component {
    @property(cc.Sprite) poker: cc.Sprite = null;
    @property(cc.Node) back: cc.Node = null;
    @property(cc.Node) check: cc.Node = null;
    // @property(cc.Node) firstOut: cc.Node = null;
   //是否滑动选中
   public isCheck:boolean = false
   //是否是滑动的起点
   public isStart:boolean = false
   //是否弹起
   public upFlag:boolean = false
   public lockFlag:boolean = false
    _cardValue: number = 0;

    hide(){
        this.node.active = false
    }

    //从大到小排序
    static sortCardList(data:any){
        data = data.sort((n1, n2) => n2-n1);
        for (var i=0; i <data.length-1; i++){
            for (var j=0; j <data.length-i-1; j++){
                var left = (data[j] == 52 || data[j] == 53) ? data[j] : data[j] % 13
                var right = (data[j+1] == 52 || data[j+1] == 53) ? data[j+1] : data[j+1] % 13
                if (right > left){
                    var swap = data[j+1];
                    data[j+1] = data[j];
                    data[j] = swap;
                }
            }
        }
        return data
    }

    //设置扑克的值
    setCardValue(value :number, isCanClick?:boolean){
        this.poker.spriteFrame = this.node.getComponent(USpriteFrames).frames[value];
        this._cardValue = value;
        if(isCanClick) {
            UEventListener.get(this.node).onClick = new UHandler(this.onClick, this, true);
        }
    }

    onClick(isPlayClick: boolean){
        if(this.lockFlag) return;
        var index = AppGame.ins.pdkModel.selectPokers.findIndex(item => item == this._cardValue)
        UDebug.Log("播放剩余");
        if(isPlayClick) {
            pdk_Main.ins._music_mgr.playCardClick();
        }
        if (index === -1) {
            AppGame.ins.pdkModel.selectPokers.push(this._cardValue)
            this.setCardUp()
            if (pdk_Main.ins.action.node.active){
                //选中两张后，检测是否有顺子
                if (AppGame.ins.pdkModel.selectPokers.length == 2 && AppGame.ins.pdkModel.gameStatus == MPdk.PDK_GAMESTATUS.CARD){
                    this.checkByShunZi()
                }
            }
            UDebug.Log("选中的牌数组为:"+ AppGame.ins.pdkModel.selectPokers.toString());
        } else {
            AppGame.ins.pdkModel.selectPokers = AppGame.ins.pdkModel.selectPokers.filter(item => item !== this._cardValue);
            this.setCardDown()
            UDebug.Log("删除后牌数组为:"+AppGame.ins.pdkModel.selectPokers.toString());
        }
        this.showCardCheck(false)
    }

    setCardUp() {
        // if(pdk_Main.ins.action.checkOutCardBtn()) {
        //     pdk_Main.ins.action.cardOut.getComponent(cc.Button).interactable = true;
        // } else {
        //     pdk_Main.ins.action.cardOut.getComponent(cc.Button).interactable = false;
        // }
        pdk_Main.ins.action.cardOut.getComponent(cc.Button).interactable = true; 
        pdk_Main.ins.action.cardOut.getChildByName('title').getComponent(cc.Sprite).setMaterial(0, cc.Material.createWithBuiltin("2d-sprite", 0))

        if(this.upFlag == false) {
            this.node.y = this.node.y += 25
            this.upFlag = true
        }
    }

    setCardDown() {
        if(AppGame.ins.pdkModel.selectPokers.length == 0) {
                pdk_Main.ins.action.cardOut.getComponent(cc.Button).interactable = false;
                pdk_Main.ins.action.cardOut.getChildByName('title').getComponent(cc.Sprite).setMaterial(0, cc.Material.createWithBuiltin("2d-gray-sprite", 0))
        } 
        // if(AppGame.ins.pdkModel.selectPokers.length == 0) {
        //     pdk_Main.ins.action.cardOut.getComponent(cc.Button).interactable = false;
        // } else {
        //     if(pdk_Main.ins.action.checkOutCardBtn()) {
        //         pdk_Main.ins.action.cardOut.getComponent(cc.Button).interactable = true;
        //     } else {
        //         pdk_Main.ins.action.cardOut.getComponent(cc.Button).interactable = false;
        //     }
        // }
        if(this.upFlag == true) {
            this.node.y = this.node.y -= 25
            this.upFlag = false
        }
    }

    showCardBack(flag:boolean){
        this.back.active = flag
    }

    showCardCheck(flag:boolean){
        this.check.active = flag
    }

    // showCardFirstOut(flag:boolean){
    //     // this.firstOut.active = flag
    // }

    //点击两张牌弹出顺子
    checkByShunZi(){
        var beginValue = AppGame.ins.pdkModel.pokerLibrary.getPokerValue(AppGame.ins.pdkModel.selectPokers[0])
        var endValue = AppGame.ins.pdkModel.pokerLibrary.getPokerValue(AppGame.ins.pdkModel.selectPokers[1])
        if (endValue - beginValue == 1){
            var data = AppGame.ins.pdkModel.pokerLibrary.searchArowHandler(1,endValue,AppGame.ins.pdkModel.handPokers)
            if (data.length >= 3){
                UDebug.Log("自动弹出顺子" + data)
                AppGame.ins.pdkModel.selectPokers = AppGame.ins.pdkModel.selectPokers.concat(data)
                var handbox = pdk_Main.ins.playerList[0].handbox.children
                handbox.forEach(element => {
                    const poker = element.getComponent(pdk_Card)
                    if (AppGame.ins.pdkModel.selectPokers.includes(poker._cardValue)){
                        poker.setCardUp()
                    }
                })
            }
        }
    }

}
