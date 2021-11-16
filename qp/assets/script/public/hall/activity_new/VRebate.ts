import { HookCallbacks } from "async_hooks";
import { HallServer } from "../../../common/cmd/proto";
import { EventManager } from "../../../common/utility/EventManager";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import cfg_event from "../../../config/cfg_event";
import AppGame from "../../base/AppGame";
import { ZJH_SCALE } from "../lobby/VHall";

const {ccclass, property} = cc._decorator;
class VRebateData {
	userId: number;
    registerTime: string;
    charge: number;
    constructor(userId: number,registerTime: string ,  charge: number) {
        this.userId  = userId;
        this.registerTime = registerTime;
        this.charge = charge;
    }
}

@ccclass
export default class VRebate extends cc.Component {

    // LIFE-CYCLE CALLBACKS:
    @property(cc.Prefab)
    rebateItem:cc.Prefab = null;

    onLoad () {
    }

    start () {

    }

    show(activityId: number) {
        EventManager.getInstance().addEventListener(cfg_event.ACTIVITY_LIST, this.getActivityData, this);
        this.requestActivity(activityId);
    }

    initView(data: HallServer.GetActivityListMessageResponse) {
        let content = UNodeHelper.find(this.node, "scrollview/view/content")
        content.removeAllChildren();
        // let dataNum = 10;
        let datas : HallServer.IDirectPlayerRechargeActivity= data.directPlayerRechargeActivity;
        // for (let index = 0; index < dataNum; index++) {
        //     let data = new VRebateData(2123123, "2012-02-01", 22);
        //     datas.push(data);
        // }
        for (let index = 0; index < datas.item.length; index++) {
            const element = datas.item[index];
            let rebateItem = cc.instantiate(this.rebateItem);
            UNodeHelper.getComponent(rebateItem, "lb_userid", cc.Label).string = element.userId + "";
            UNodeHelper.getComponent(rebateItem, "lb_time", cc.Label).string = element.registerDate + "";
            UNodeHelper.getComponent(rebateItem, "lb_charge", cc.Label).string = (element.rechargeAmount*ZJH_SCALE).toFixed(2);
            rebateItem.parent = content;
        }
    }

    getActivityData(eventName: string, data: HallServer.GetActivityListMessageResponse) {
        AppGame.ins.showConnect(false);
        this.initView(data);
    }

    onDisable() {
        EventManager.getInstance().removeEventListener(cfg_event.ACTIVITY_LIST, this.getActivityData, this);
    }

    onEnable() {
        EventManager.getInstance().addEventListener(cfg_event.ACTIVITY_LIST, this.getActivityData, this);
    }

    requestActivity(activityId: number) {
        AppGame.ins.showConnect(true);
        AppGame.ins.activityModel.sendActivityList(activityId);
    }

    // update (dt) {}
}
