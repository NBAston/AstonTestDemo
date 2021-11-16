
import USpriteFrames from "../../common/base/USpriteFrames";
import UDebug from "../../common/utility/UDebug";
import UEventListener from "../../common/utility/UEventListener";
import UHandler from "../../common/utility/UHandler";
import AppGame from "../../public/base/AppGame";
import ddz_Main_hy from "./ddz_Main_hy";
import MDDZModel_hy from "./model/MDDZ_hy";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ddz_Card_hy extends cc.Component {
    @property(cc.Sprite) poker: cc.Sprite = null;
    @property(cc.Node) back: cc.Node = null;
    @property(cc.Node) check: cc.Node = null;
    @property(cc.Node) banker: cc.Node = null;


    //是否滑动选中
    public isCheck:boolean = false
    //是否是滑动的起点
    public isStart:boolean = false
    //是否弹起
    public upFlag:boolean = false

    public lockFlag:boolean = false
    public value:number = 0

    hide(){
        this.lockFlag = false
        this.node.parent = null
    }

    //从大到小排序
    static sortCardList(data:any){
        //排大小
        for (var i=0; i <data.length-1; i++){
            for (var j=0; j <data.length-i-1; j++){
                var left = (data[j] == 52 || data[j] == 53) ? data[j] : data[j] % 13
                var right = (data[j+1] == 52 || data[j+1] == 53) ? data[j+1] : data[j+1] % 13
                if (right > left ){
                    var swap = data[j+1];
                    data[j+1] = data[j];
                    data[j] = swap;
                }
            }
        }
        //排花色
        for (var i=0; i <data.length-1; i++){
            for (var j=0; j <data.length-i-1; j++){
                if ( (data[j]%13 == data[j+1]%13)  && (data[j]/13 < data[j+1]/13) ){
                    var swap = data[j+1];
                    data[j+1] = data[j];
                    data[j] = swap;
                }
            }
        }
        return data
    }

    //设置扑克的值,返回权重大小
    setCardValue(value :number){
        this.value = value
        this.poker.spriteFrame = this.node.getComponent(USpriteFrames).frames[value]
        UEventListener.get(this.node).onClick = new UHandler(this.onClick, this);
        return 
    }

    onClick(){
        if (this.lockFlag) return
        var index = AppGame.ins.ddzModel_hy.selectPokers.findIndex(item => item == this.value)
        if (index === -1) {
            this.setCardUp()
            AppGame.ins.ddzModel_hy.selectPokers.push(this.value)
            if (ddz_Main_hy.ins.action.node.active){
                if (AppGame.ins.ddzModel_hy.selectPokers.length == 2 && AppGame.ins.ddzModel_hy.gameStatus == MDDZModel_hy.DDZ_GAMESTATUS.OUT){
                    this.checkByShunZi()
                }else if (AppGame.ins.ddzModel_hy.selectPokers.length == 4 && AppGame.ins.ddzModel_hy.gameStatus == MDDZModel_hy.DDZ_GAMESTATUS.OUT){
                    this.checkByLianDui()
                }
            }
        } else {
            this.setCardDown()
            AppGame.ins.ddzModel_hy.selectPokers.splice(index, 1)
        }
        this.showCardCheck(false)
        ddz_Main_hy.ins.musicMgr.playClickCard()
    }

    //点击两张牌弹出顺子
    checkByShunZi(){
        var beginValue = AppGame.ins.ddzModel_hy.pokerLibrary.getCardWeight(AppGame.ins.ddzModel_hy.selectPokers[0])
        var endValue = AppGame.ins.ddzModel_hy.pokerLibrary.getCardWeight(AppGame.ins.ddzModel_hy.selectPokers[1])
        if (endValue - beginValue == 1){
            var data = AppGame.ins.ddzModel_hy.pokerLibrary.searchArowHandler(1,endValue,AppGame.ins.ddzModel_hy.handPokers)
            if (data.length >= 3){
                UDebug.Log("自动弹出顺子" + data)
                AppGame.ins.ddzModel_hy.selectPokers = AppGame.ins.ddzModel_hy.selectPokers.concat(data)
                var handbox = ddz_Main_hy.ins.playerList[0].handbox.children
                handbox.forEach(element => {
                    const poker = element.getComponent(ddz_Card_hy)
                    if (AppGame.ins.ddzModel_hy.selectPokers.includes(poker.value)){
                        poker.setCardUp()
                    }
                })
            }
        }
    }

    //点击两对弹出连对
    checkByLianDui(){
        var beginPair0 = AppGame.ins.ddzModel_hy.pokerLibrary.getCardWeight(AppGame.ins.ddzModel_hy.selectPokers[0])
        var beginPair1 = AppGame.ins.ddzModel_hy.pokerLibrary.getCardWeight(AppGame.ins.ddzModel_hy.selectPokers[1])
        var endPair0 = AppGame.ins.ddzModel_hy.pokerLibrary.getCardWeight(AppGame.ins.ddzModel_hy.selectPokers[2])
        var endPair1 = AppGame.ins.ddzModel_hy.pokerLibrary.getCardWeight(AppGame.ins.ddzModel_hy.selectPokers[3])
        if (beginPair0 == beginPair1 && endPair0 == endPair1 && endPair0 - beginPair0 == 1){
            var data = AppGame.ins.ddzModel_hy.pokerLibrary.searchArowHandler(2,endPair0,AppGame.ins.ddzModel_hy.handPokers)
            if (data.length >= 2){
                UDebug.Log("自动弹出连对" + data)
                AppGame.ins.ddzModel_hy.selectPokers = AppGame.ins.ddzModel_hy.selectPokers.concat(data)
                var handbox = ddz_Main_hy.ins.playerList[0].handbox.children
                handbox.forEach(element => {
                    const poker = element.getComponent(ddz_Card_hy)
                    if (AppGame.ins.ddzModel_hy.selectPokers.includes(poker.value)){
                        poker.setCardUp()
                    }
                })
            }
        }
    }

    setCardUp(){
        if (this.upFlag) return
        this.node.y = this.node.y += 25
        this.upFlag = true
    }

    setCardDown(){
        if (!this.upFlag) return
        this.node.y = this.node.y -= 25
        this.upFlag = false
    }

    showCardBack(flag:boolean){
        this.back.active = flag
    }

    showCardCheck(flag:boolean){
        this.check.active = flag
    }

    showCardBanker(flag:boolean){
        this.banker.active = flag
    }

}
