import Model from "../../../common/base/Model";
import { EGameType } from "../../../common/base/UAllenum";
import { Game, HallServer } from "../../../common/cmd/proto";
import UMsgCenter from "../../../common/net/UMsgCenter";
import { EventManager } from "../../../common/utility/EventManager";
import UDebug from "../../../common/utility/UDebug";
import UHandler from "../../../common/utility/UHandler";
import cfg_event from "../../../config/cfg_event";
import AppGame from "../../base/AppGame";
import MRannk from "../rank/MRank";
import UIRankData, { UIRankDataItem } from "../rank/RankData";

export default class MTask extends Model {
    _lefting: boolean;
    onGameStart: Function;
    onGameEnd: Function;
    onStartPlaceJetton: Function;
    onPlaceJetton: Function;
    onPlaceJettonFail: Function;
    onSendRecord: Function;
    onQueryPlaylist: Function;
    onSyncTime: Function;
    resetData(): void {
        throw new Error("Method not implemented.");
    }

    init(): void {
        this.regesterMsg(Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TASK_LIST_MESSAGE_RES, new UHandler(this.onTaskList, this));
        this.regesterMsg(Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TASK_REWARD_MESSAGE_RES, new UHandler(this.onTaskReward, this));
        this.regesterMsg(Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_START_TASK_MESSAGE_RES, new UHandler(this.onGetTask, this));
    }

    /**注册奔驰宝马网络消息事件 */
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
        this.unregesterMsg(Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TASK_LIST_MESSAGE_RES, new UHandler(this.onTaskList, this));
        this.unregesterMsg(Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TASK_REWARD_MESSAGE_RES, new UHandler(this.onTaskReward, this));
        this.unregesterMsg(Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_START_TASK_MESSAGE_RES, new UHandler(this.onGetTask, this));
    }

    update(dt: number): void {

    }
    
    /**
     * 请求任务列表
     */
    sendTaskList() {
        let data = new HallServer.GetTaskListMessage();
        data.userId = AppGame.ins.roleModel.useId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TASK_LIST_MESSAGE_REQ,data);
    }

    /**
     * 
     * @param data 请求任务奖励
     */
    sendTaskReward(userTaskId: string) {
        let data = new HallServer.GetTaskRewardMessage();
        data.userId = AppGame.ins.roleModel.useId;
        data.userTaskId = userTaskId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TASK_REWARD_MESSAGE_REQ,data);
    }

    /**
     * 
     * @param data 请求领取任务
     */
    sendGetTask(taskId: number) {
        let data = new HallServer.StartTaskMessage();
        data.userId = AppGame.ins.roleModel.useId;
        data.taskId = taskId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_START_TASK_MESSAGE_REQ,data);
    }

    /**
     * 获取任务列表回调
     * @param data 
     */
    onTaskList(data: HallServer.GetTaskListMessageResponse) {
        // UDebug.log("获取任务列表"+ JSON.stringify(data));
        if (data.retCode == 0) {
            EventManager.getInstance().raiseEvent(cfg_event.TASK_LIST, data.taskList);
        } else {
            AppGame.ins.showTips(data.errorMsg);
        }
    }

    /**
     * 领取任务回调
     * @param data 
     */
    onGetTask(data: HallServer.StartTaskMessageResponse) {
        UDebug.log("获取任务"+ JSON.stringify(data));
        if (data.retCode == 0) {
            EventManager.getInstance().raiseEvent(cfg_event.GET_TASK, data);
        } else {
            AppGame.ins.showTips(data.errorMsg);
        }
    }

    /**
     * 获取任务奖励回调
     * @param data 
     */
    onTaskReward(data: HallServer.GetTaskRewardMessageResponse) {
        UDebug.log("获取任务奖励回调"+ JSON.stringify(data));
        EventManager.getInstance().raiseEvent(cfg_event.TASK_REWARD, data);
    }

}
