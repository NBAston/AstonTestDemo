import Model from "../../../common/base/Model";
import { Game, HallServer } from "../../../common/cmd/proto";
import UMsgCenter from "../../../common/net/UMsgCenter";
import { EventManager } from "../../../common/utility/EventManager";
import UDebug from "../../../common/utility/UDebug";
import UHandler from "../../../common/utility/UHandler";
import cfg_event from "../../../config/cfg_event";
import AppGame from "../../base/AppGame";

export default class MActivity extends Model {
    
    resetData(): void {
        throw new Error("Method not implemented.");
    }

    init(): void {
        this.regesterMsg(Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_ACTIVITY_LIST_MESSAGE_RES, new UHandler(this.onActivityList, this));
        this.regesterMsg(Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_ACTIVITY_REWARD_MESSAGE_RES, new UHandler(this.onActivityReward, this));
    }

    /**注册活动网络消息事件 */
    regesterMsg(subId: number, handler: UHandler) {
        UMsgCenter.ins.regester(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            subId,
            handler);
    }

    unregesterMsg(subId: number, handler: UHandler) {
        UMsgCenter.ins.unregester(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            subId,
            handler);
    }

    /** 发送网络消息*/
    sendMsg(subId: number, data: any, handler: UHandler = null, unlock: boolean = false) {
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            subId, data, handler, unlock);
    }

    run() {
        super.run();
    }

    exit() {
        super.exit();
        this.unregesterMsg(Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_ACTIVITY_LIST_MESSAGE_RES, new UHandler(this.onActivityList, this));
        this.unregesterMsg(Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_ACTIVITY_REWARD_MESSAGE_RES, new UHandler(this.onActivityReward, this));
    }

    update(dt: number): void {

    }
    
    /**
     * 请求活动列表
     */
    sendActivityList(activityId: number, id: string) {
        let data = new HallServer.GetActivityListMessage();
        data.userId = AppGame.ins.roleModel.useId;
        data.activityId = activityId;
        data.Id = id;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_ACTIVITY_LIST_MESSAGE_REQ,data);
    }

    requestActivityReward(a:string):void{
        let data = new HallServer.GetActivityRewardMessage();
        data.userId = AppGame.ins.roleModel.useId;
        data.activityId = 104;
        data.dirPlayUserId = a;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_ACTIVITY_REWARD_MESSAGE_REQ,data);
    }

    /**
     * 获取活动列表回调
     * @param data 
     */
    onActivityList(data: HallServer.GetActivityListMessageResponse) {
        UDebug.log("获取活动列表"+ JSON.stringify(data));
        if (data.retCode == 0) {
            EventManager.getInstance().raiseEvent(cfg_event.ACTIVITY_LIST, data);
        } else {
            AppGame.ins.showTips(data.errorMsg);
        }
    }

    onActivityReward(data:HallServer.GetActivityRewardMessageResponse){
        // UDebug.log("获取活动奖励"+ JSON.stringify(data));
        if (data.retCode == 0) {
            EventManager.getInstance().raiseEvent(cfg_event.ACTIVITY_REWARD, data);
        } else {
            AppGame.ins.showTips(data.errorMsg);
        }
    }

}
