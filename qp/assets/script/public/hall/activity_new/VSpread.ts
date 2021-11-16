import { SysEvent } from "../../../common/base/UAllClass";
import { ECommonUI } from "../../../common/base/UAllenum";
import UAudioManager from "../../../common/base/UAudioManager";
import { HallServer } from "../../../common/cmd/proto";
import { EventManager } from "../../../common/utility/EventManager";
import UDebug from "../../../common/utility/UDebug";
import UEventHandler from "../../../common/utility/UEventHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import cfg_event from "../../../config/cfg_event";
import AppGame from "../../base/AppGame";
import { ZJH_SCALE } from "../lobby/VHall";

class VSpreadData {
	userId: number;
    registerTime: string;
    charge: number;
    bet: number;
    rang:number;
    constructor(userId: number,registerTime: string ,  charge: number, bet: number, rang: number) {
        this.userId  = userId;
        this.registerTime = registerTime;
        this.charge = charge;
        this.bet = bet;
        this.rang = rang;
    }
}
const {ccclass, property} = cc._decorator;

@ccclass
export default class VSpread extends cc.Component {
    @property(cc.Prefab)
    spreadItem:cc.Prefab = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    start () {

    }

    show(activityId: number) {
        let id = "";
        this.requestActivity(activityId, id);
    }
    
    initView(data: HallServer.GetActivityListMessageResponse) {
        let content = UNodeHelper.find(this.node, "scrollview/view/content")
        content.removeAllChildren();
        let datas = data.promotionActivity.item;
        for (let index = 0; index < datas.length; index++) {
            const element: HallServer.IPromotionActivityItem = datas[index];
            let rebateItem = cc.instantiate(this.spreadItem);
            UNodeHelper.getComponent(rebateItem, "lb_userid", cc.Label).string = element.userId + "";
            UNodeHelper.getComponent(rebateItem, "lb_time", cc.Label).string = element.registerDate + "";
            UNodeHelper.getComponent(rebateItem, "lb_charge", cc.Label).string = (element.rechargeAmount*ZJH_SCALE).toFixed(2);
            UNodeHelper.getComponent(rebateItem, "lb_bet", cc.Label).string = (element.allBet*ZJH_SCALE).toFixed(2);
            UEventHandler.addClick(rebateItem.getChildByName("btn_canget"),this.node,"VSpread","getReward",element.userId.toString());
            let btn_canget = UNodeHelper.find(rebateItem, "btn_canget");
            let btn_finished = UNodeHelper.find(rebateItem, "btn_finished");
            let btn_ungetted = UNodeHelper.find(rebateItem, "btn_ungetted");
            // let isReached = 
            rebateItem.parent = content;
            if (element.bGotReward ==1) {
                btn_finished.active = true;
                btn_canget.active = false;
                btn_ungetted.active = false;
            } else if(element.rechargeAmount * ZJH_SCALE>=1000 && element.allBet * ZJH_SCALE>=5000){
                btn_finished.active = false;
                btn_canget.active = true;
                btn_ungetted.active = false;
            } else {
                btn_finished.active = false;
                btn_canget.active = false;
                btn_ungetted.active = true;
            }
        }
    }

    goToSpread() {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.closeUI(ECommonUI.LB_ACTIVITY);
        AppGame.ins.showUI(ECommonUI.LB_Proxy);
        
    }

    getActivityData(eventName: string, data: HallServer.GetActivityListMessageResponse ) {
        AppGame.ins.showConnect(false);
        this.initView(data);
    }

    getActivityRewardData(eventName: string,data:HallServer.GetActivityRewardMessageResponse){
        if(data.retCode == 0){
            AppGame.ins.showConnect(false);

            let content = UNodeHelper.find(this.node, "scrollview/view/content")
            for(var i = 0;i < content.childrenCount;i++){
                if(content.children[i].getChildByName("lb_userid").getComponent(cc.Label).string == data.dirPlayUserId){
                    content.children[i].getChildByName("btn_canget").active = false;
                    content.children[i].getChildByName("btn_finished").active = true;
                    content.children[i].getChildByName("btn_ungetted").active = false;
                }
            }
            AppGame.ins.roleModel.requestUpdateScore();
            cc.systemEvent.emit(SysEvent.SHOW_AWARDS, 0, "推广彩金奖励"+data.rewardScore*ZJH_SCALE+"金币");
        }else{
            AppGame.ins.showTips(data.errorMsg);
        }

        



    }

    onEnable() {
        UDebug.log("");
        EventManager.getInstance().addEventListener(cfg_event.ACTIVITY_LIST, this.getActivityData, this);
        EventManager.getInstance().addEventListener(cfg_event.ACTIVITY_REWARD, this.getActivityRewardData, this);
    }

    onDisable() {
        UDebug.log("");
        EventManager.getInstance().removeEventListener(cfg_event.ACTIVITY_LIST, this.getActivityData, this);
        EventManager.getInstance().removeEventListener(cfg_event.ACTIVITY_REWARD, this.getActivityRewardData, this);
    }

    requestActivity(activityId: number, id: string) {
        AppGame.ins.showConnect(true);
        AppGame.ins.activityModel.sendActivityList(activityId, id);
    }

    private getReward(event, i:string):void{
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.activityModel.requestActivityReward(i);
    }
    // update (dt) {}
}
