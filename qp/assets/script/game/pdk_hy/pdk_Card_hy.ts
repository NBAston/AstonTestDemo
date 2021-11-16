
import { isMainThread } from "worker_threads";
import USpriteFrames from "../../common/base/USpriteFrames";
import UDebug from "../../common/utility/UDebug";
import UEventListener from "../../common/utility/UEventListener";
import UHandler from "../../common/utility/UHandler";
import AppGame from "../../public/base/AppGame";
import MPdk_hy from "./model/MPdk_hy";
import pdk_actionPanel_hy from "./pdk_actionPanel_hy";
import { UIPDKBattleOver } from "./pdk_Helper_hy";
import pdk_Main_hy from "./pdk_Main_hy";

const { ccclass, property } = cc._decorator;
@ccclass
export default class pdk_Card_hy extends cc.Component {
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
        var index = AppGame.ins.fPdkModel.selectPokers.findIndex(item => item == this._cardValue)
        UDebug.Log("播放剩余");
        if(isPlayClick) {
            pdk_Main_hy.ins._music_mgr.playCardClick();
        }
        if (index === -1) {
            AppGame.ins.fPdkModel.selectPokers.push(this._cardValue)
            this.setCardUp()
            if (pdk_Main_hy.ins.action.node.active){
                //选中两张后，检测是否有顺子
                if (AppGame.ins.fPdkModel.selectPokers.length == 2 && AppGame.ins.fPdkModel.gameStatus == MPdk_hy.PDK_GAMESTATUS.CARD){
                    this.checkByShunZi()
                }
            }
            UDebug.Log("选中的牌数组为:"+ AppGame.ins.fPdkModel.selectPokers.toString());
        } else {
            AppGame.ins.fPdkModel.selectPokers = AppGame.ins.fPdkModel.selectPokers.filter(item => item !== this._cardValue);
            this.setCardDown()
            UDebug.Log("删除后牌数组为:"+AppGame.ins.fPdkModel.selectPokers.toString());
        }
        this.showCardCheck(false)
    }

    setCardUp() {
        // if(pdk_Main_hy.ins.action.checkOutCardBtn()) {
        //     pdk_Main_hy.ins.action.cardOut.getComponent(cc.Button).interactable = true;
        // } else {
        //     pdk_Main_hy.ins.action.cardOut.getComponent(cc.Button).interactable = false;
        // }AppGame.ins.fPdkModel.gMeChairId
        
        this.setBlack3Show();
        if(this.upFlag == false) {
            this.node.y = this.node.y += 25
            this.upFlag = true
        }
    }

    setCardDown() {
        if(AppGame.ins.fPdkModel.selectPokers.length == 0) {
                pdk_Main_hy.ins.action.cardOut.getComponent(cc.Button).interactable = false;
        } 
        this.setBlack3Show();
        // if(AppGame.ins.fPdkModel.selectPokers.length == 0) {
        //     pdk_Main_hy.ins.action.cardOut.getComponent(cc.Button).interactable = false;
        // } else {
        //     if(pdk_Main_hy.ins.action.checkOutCardBtn()) {
        //         pdk_Main_hy.ins.action.cardOut.getComponent(cc.Button).interactable = true;
        //     } else {
        //         pdk_Main_hy.ins.action.cardOut.getComponent(cc.Button).interactable = false;
        //     }
        // }
        if(this.upFlag == true) {
            this.node.y = this.node.y -= 25
            this.upFlag = false
        }
    }

    setBlack3Show() {
        if(AppGame.ins.fPdkModel.gameCfgInfo && AppGame.ins.fPdkModel.gameCfgInfo.hasOwnProperty('MustSpades3') && AppGame.ins.fPdkModel.gameCfgInfo.MustSpades3 && pdk_Main_hy.ins.Spades3ChairId == AppGame.ins.fPdkModel.gMeChairId && pdk_Main_hy.ins.outCharid == AppGame.ins.fPdkModel.gMeChairId && !pdk_Main_hy.ins.action.cardPass.active && AppGame.ins.fPdkModel.handPokers.length == (AppGame.ins.fPdkModel.gameCfgInfo.Mode==0?15:16) && AppGame.ins.fPdkModel.selectPokers.findIndex((value, index, arr)=>{return value==39})==-1) {
            pdk_Main_hy.ins.onShowTipsBlack3("首次出牌必须带有黑桃3", true);
            pdk_Main_hy.ins.action.cardOut.getComponent(cc.Button).interactable = false;
            pdk_Main_hy.ins.action.cardOut.getChildByName('title').getComponent(cc.Sprite).setMaterial(0, cc.Material.createWithBuiltin("2d-gray-sprite", 0))

        } else if(AppGame.ins.fPdkModel.gameCfgInfo && AppGame.ins.fPdkModel.gameCfgInfo.hasOwnProperty('MustHearts3') && AppGame.ins.fPdkModel.gameCfgInfo.MustHearts3 && pdk_Main_hy.ins.Hearts3ChairId == AppGame.ins.fPdkModel.gMeChairId && pdk_Main_hy.ins.outCharid == AppGame.ins.fPdkModel.gMeChairId && !pdk_Main_hy.ins.action.cardPass.active && AppGame.ins.fPdkModel.handPokers.length == (AppGame.ins.fPdkModel.gameCfgInfo.Mode==0?15:16) && AppGame.ins.fPdkModel.selectPokers.findIndex((value, index, arr)=>{return value==26})==-1){
            pdk_Main_hy.ins.onShowTipsBlack3("首次出牌必须带有红桃3", true);
            pdk_Main_hy.ins.action.cardOut.getComponent(cc.Button).interactable = false;
            pdk_Main_hy.ins.action.cardOut.getChildByName('title').getComponent(cc.Sprite).setMaterial(0, cc.Material.createWithBuiltin("2d-gray-sprite", 0))

        } else {
            pdk_Main_hy.ins.onShowTipsBlack3("", false);
            pdk_Main_hy.ins.action.cardOut.getComponent(cc.Button).interactable = true;
            pdk_Main_hy.ins.action.cardOut.getChildByName('title').getComponent(cc.Sprite).setMaterial(0, cc.Material.createWithBuiltin("2d-sprite", 0))

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
        var beginValue = AppGame.ins.fPdkModel.pokerLibrary.getPokerValue(AppGame.ins.fPdkModel.selectPokers[0])
        var endValue = AppGame.ins.fPdkModel.pokerLibrary.getPokerValue(AppGame.ins.fPdkModel.selectPokers[1])
        if (endValue - beginValue == 1){
            var data = AppGame.ins.fPdkModel.pokerLibrary.searchArowHandler(1,endValue,AppGame.ins.fPdkModel.handPokers)
            if (data.length >= 3){
                UDebug.Log("自动弹出顺子" + data)
                AppGame.ins.fPdkModel.selectPokers = AppGame.ins.fPdkModel.selectPokers.concat(data)
                var handbox = pdk_Main_hy.ins.playerList[0].handbox.children
                handbox.forEach(element => {
                    const poker = element.getComponent(pdk_Card_hy)
                    if (AppGame.ins.fPdkModel.selectPokers.includes(poker._cardValue)){
                        poker.setCardUp()
                    }
                })
            }
        }
    }

}
