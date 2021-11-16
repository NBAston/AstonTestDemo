
import UClock from "../../common/utility/UClock";
import UDebug from "../../common/utility/UDebug";
import AppGame from "../../public/base/AppGame";
import ddz_Card from "./ddz_Card";
import ddz_Main from "./ddz_Main";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ddz_SelectPanel extends cc.Component {

    @property(cc.Label) callClock: cc.Label = null;
    @property(cc.Node) threeCardList: cc.Node[] = []
    @property(cc.Node) fourCardList: cc.Node[] = []

    private clockId = 0 
    
    show(data:number[],waittime:number){
        //倒计时
        this.callClock.string = waittime.toString()
        this.clockId = UClock.setClock(waittime,
            function(){
                waittime--
                if (waittime <= 3){
                    ddz_Main.ins.musicMgr.playClock()
                }
                this.callClock.string = waittime.toString()
            }.bind(this),
            function(){
                this.node.active = false
            }.bind(this)
        )
        //牌型
        this.mergerCardData(data)
        this.node.active = true 
    }

    public mergerCardData(originCards: number[]) {
        var list = []
        for (let i = 0; i < originCards.length; i++) {
            const originCard = originCards[i];
            list.push({
                origin: originCard,
                value: AppGame.ins.ddzModel.pokerLibrary.getCardWeight(originCard)
            })
        }
        
        //四带二
        list = list.sort((a: any, b: any) => b.value - a.value)
        for (let i = 0; i< list.length; i++) {
            this.fourCardList[i].getComponent(ddz_Card).setCardValue(list[i].origin)
            this.fourCardList[i].getComponent(ddz_Card).lockFlag = true
        }
        //飞机
        list = list.sort((a: any, b: any) => a.value - b.value)
        list.push(list.splice(3, 1)[0])
        list.push(list.splice(6, 1)[0])
        for (let i = 0; i< list.length; i++) {
            this.threeCardList[i].getComponent(ddz_Card).setCardValue(list[i].origin)
            this.threeCardList[i].getComponent(ddz_Card).lockFlag = true
        }
    }

    //出牌
    onClickOutCard(event:any, typePlane:string){
        AppGame.ins.ddzModel.selectPokers = [] 
        if (parseInt(typePlane)){
            for (let i = 0; i< this.threeCardList.length; i++) {
                AppGame.ins.ddzModel.selectPokers.push(this.threeCardList[i].getComponent(ddz_Card).value)
            }
            AppGame.ins.ddzModel.pokerLibrary.splitToPlane = true
        }else{
            for (let i = 0; i< this.fourCardList.length; i++) {
                AppGame.ins.ddzModel.selectPokers.push(this.threeCardList[i].getComponent(ddz_Card).value)
            }
            AppGame.ins.ddzModel.pokerLibrary.splitToPlane = false
        }

        var cardTypeData = AppGame.ins.ddzModel.pokerLibrary.getCardType(AppGame.ins.ddzModel.selectPokers)
        if (cardTypeData == undefined) {
             UDebug.Log("请选择正确的牌型" + AppGame.ins.ddzModel.selectPokers)
             return ddz_Main.ins.onShowTips("请选择正确的牌型" )
        }
        AppGame.ins.ddzModel.sendOutCard(cardTypeData.type)
        this.node.active = false
     }

    onDisable(){
        clearInterval(this.clockId)
    }

    hide(){
        this.node.active = false 
    }

}
