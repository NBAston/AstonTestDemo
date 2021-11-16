import { EventManager } from "../../../common/utility/EventManager";
import cfg_event from "../../../config/cfg_event";
import AppGame from "../../base/AppGame";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VContinuous_login extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {

    }

    // update (dt) {}

    show(activityId: number) {
        this.requestActivity(activityId);
    }

    hide() {
        EventManager.getInstance().addEventListener(cfg_event.ACTIVITY_LIST, this.getActivityData, this);
    }

    getActivityData(eventName: string, data: any) {
        AppGame.ins.showConnect(false);
    }

    setBetAccount() {
        let isReach1 :boolean = true;
        let isReach2: boolean = true;
        if (isReach1 && isReach2) {
            
        }
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
}
