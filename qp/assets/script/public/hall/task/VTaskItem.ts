import { SysEvent } from "../../../common/base/UAllClass";
import { ECommonUI } from "../../../common/base/UAllenum";
import UResManager from "../../../common/base/UResManager";
import BaseCell from "../../../common/utility/BaseCell ";
import { EventManager } from "../../../common/utility/EventManager";
import UDebug from "../../../common/utility/UDebug";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UStringHelper from "../../../common/utility/UStringHelper";
import cfg_event from "../../../config/cfg_event";
import cfg_game from "../../../config/cfg_game";
import { ZJH_SCALE } from "../../../game/zjh/MZJH";
import AppGame from "../../base/AppGame";
import UIManager from "../../base/UIManager";
import TaskItemData from "./TaskItemData";

const {ccclass, property} = cc._decorator;
const task_img_game_path : string = "common/hall/texture/task/";
enum taskTypeId {
    TURNOVER = 1,
    VICTORY = 2,
    GAME= 3,
}

@ccclass
export default class VTaskItem extends cc.Component {

    private _btn_get_task: cc.Button;
    private _btn_go_task: cc.Button;
    private _btn_get_task_reward: cc.Button;
    private _btn_get_task_reward_getted: cc.Button;
    private _daily_task: cc.Node;
    private _once_task: cc.Node;
    public __itemID: number = 0;
    // LIFE-CYCLE CALLBACKS:

    private _task_item_data: TaskItemData;

    hide(): void {
        this.node.active = false;
    }

    show(): void {
        this.node.active = true;
    }

    /**
	 * 加载并展示图片
	 */
     setTaskItem() {
        this._daily_task = UNodeHelper.find(this.node, "daily_task");
        this._once_task = UNodeHelper.find(this.node, "once_task");
        // this._btn_get_task = UNodeHelper.getComponent(this.node, "btn_get_task", cc.Button);
        // this._btn_go_task = UNodeHelper.getComponent(this.node, "btn_go_task", cc.Button);
        // this._btn_get_task_reward = UNodeHelper.getComponent(this.node, "btn_get_task_reward", cc.Button);
        // this._btn_get_task_reward_getted = UNodeHelper.getComponent(this.node, "btn_get_task_reward_getted", cc.Button);
        this.initBtns();
        this._btn_get_task_reward_getted.node.active = false;
        this._btn_get_task_reward.interactable = true;
        let lb_task_info = UNodeHelper.getComponent(this.node, "task_info", cc.Label);
        let lb_task_percent = UNodeHelper.getComponent(this.node, "task_percent", cc.Label);
        let lb_task_reward = UNodeHelper.getComponent(this.node, "task_reward", cc.Label); 
        let img_game = UNodeHelper.getComponent(this.node, "game_icon", cc.Sprite);
        let redicon =  UNodeHelper.find(this.node, "redicon");
        if (this._task_item_data.taskCycle == 1) {
            this._once_task.active = true;
        } else if(this._task_item_data.taskCycle == 2){
            this._daily_task.active = true;
        }   
        // let btn_task =  UNodeHelper.find(this.node, "btn_task");
        // UEventHandler.addClick(btn_task, this.node, "VTaskItem", "onClickTask");
        lb_task_info.string = this._task_item_data.taskTitle;
        if (parseFloat(this._task_item_data.currentNum)>=  parseFloat(this._task_item_data.reachNum)) {
            this._task_item_data.currentNum = this._task_item_data.reachNum;
        }
        if (this._task_item_data.taskType == taskTypeId.TURNOVER) {
            let scale = 100;
            lb_task_percent.string = UStringHelper.getMoneyFormat(parseFloat(this._task_item_data.currentNum)/scale)+ "/"+ parseInt(this._task_item_data.reachNum)/100;
        } else {
            lb_task_percent.string = this._task_item_data.currentNum + "/" + this._task_item_data.reachNum ;
        }
        
        if (this._task_item_data.currentNum >= this._task_item_data.reachNum && this._task_item_data.status!=3) {
            this._task_item_data.status = 2;
            this._task_item_data = this._task_item_data;
        }
        // lb_task_reward.string = UStringHelper.getMoneyFormat(parseFloat(taskItemData.rewardScore)/100) ;
        lb_task_reward.string =  ""+ parseInt(this._task_item_data.rewardScore)/100 ;
        let game_str = cfg_game[this._task_item_data.gameId].abbreviateName;
        let game_icon_str = task_img_game_path+"task_img_"+game_str;
        UResManager.loadUrl(game_icon_str, img_game);
         // 任务状态 (0: 未开始任务, 1: 已开始任务，2:任务已完成，未领取金币 3: 
        switch (this._task_item_data.status) { 
            case 0:
                this._btn_get_task.node.active = true;
                this._btn_go_task.node.active = false;
                this._btn_get_task_reward.node.active = false;
                redicon.active = false;
                break;
            case 1:
                this._btn_get_task.node.active = false;
                this._btn_go_task.node.active = true;
                this._btn_get_task_reward.node.active = false;
                redicon.active = false;
                break;
            case 2:
                this._btn_get_task.node.active = false;
                this._btn_go_task.node.active = false;
                this._btn_get_task_reward.node.active = true;
                redicon.active = true;
                break;
            case 3:
                this._btn_get_task.node.active = false;
                this._btn_go_task.node.active = false;
                this._btn_get_task_reward.node.active = false;
                this._btn_get_task_reward_getted.node.active = true;
                redicon.active = false;
                break;
            default:
                break;
        }
		// this.picSprite.spriteFrame = await ResourcesLoader.loadSpriteFrameFromResources(this._data.picPath);
		// this.descLabel.string = `${this._data.index}: ${this._data.picPath}`;
		// this._hidePlaceHolder();
	}

    bindData(taskItemData: TaskItemData) {
        this._task_item_data = taskItemData;
    }

    onClickGetTask() {
        let _taskModel = AppGame.ins.taskModel;
        _taskModel.sendGetTask(this._task_item_data.taskId);
    }

    onClickTaskReward() {
        // let self = this;
        let _taskModel = AppGame.ins.taskModel;
        _taskModel.sendTaskReward(this._task_item_data.userTaskId);
    }

    onClickGoTask() {
        AppGame.ins.closeUI(ECommonUI.LB_TASK);
        if(cc.sys.isNative && AppGame.ins.hallModel.gameAllList.getHotsList().findIndex((value, index, arr)=>{return (value.gameId == this._task_item_data.gameId && value.isupdated == true)})==-1) {
            AppGame.ins.showTips("该游戏未更新，请先在大厅更新该游戏后再试");
            return;
        } 
        AppGame.ins.roomModel.requestEnterRoom(this._task_item_data.roomId, this._task_item_data.gameId, false);
    }

    initBtns() {
        this._btn_get_task = UNodeHelper.getComponent(this.node, "btn_get_task", cc.Button);
        this._btn_go_task = UNodeHelper.getComponent(this.node, "btn_go_task", cc.Button);
        this._btn_get_task_reward = UNodeHelper.getComponent(this.node, "btn_get_task_reward", cc.Button);
        this._btn_get_task_reward_getted = UNodeHelper.getComponent(this.node, "btn_get_task_reward_getted", cc.Button);
    }

    setTaskGetted() {
        this.initBtns();
        this._btn_get_task.node.active = false;
        this._btn_go_task.node.active = true;
        this._btn_get_task_reward.node.active = false;
        
    }

    setTaskRewardGetted(rewardScore :number) {
        this.initBtns();
        this._btn_get_task.node.active = false;
        this._btn_go_task.node.active = false;
        this._btn_get_task_reward.node.active = false;
        this._btn_get_task_reward_getted.node.active = true;
        cc.systemEvent.emit(SysEvent.SHOW_AWARDS, 0, "任务奖励"+rewardScore*ZJH_SCALE+"金币");
        AppGame.ins.roleModel.requestUpdateScore();
        EventManager.getInstance().raiseEvent(cfg_event.REFRESH_TASK_MARK, this._task_item_data.taskType);
        let redicon =  UNodeHelper.find(this.node, "redicon");
        redicon.active = false;
    }
    // update (dt) {}
}
