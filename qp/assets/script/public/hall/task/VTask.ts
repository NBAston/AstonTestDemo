import VWindow from "../../../common/base/VWindow";
import { HallServer } from "../../../common/cmd/proto";
import { EventManager } from "../../../common/utility/EventManager";
import ListScrollItem from "../../../common/utility/ListScrollItem ";
import ScrollViewPlus from "../../../common/utility/ScrollViewPlus";
import UDebug from "../../../common/utility/UDebug";
import UEventHandler from "../../../common/utility/UEventHandler";
import UEventListener from "../../../common/utility/UEventListener";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import cfg_event from "../../../config/cfg_event";
import AppGame from "../../base/AppGame";
import ErrorLogUtil, { LogLevelType } from "../../errorlog/ErrorLogUtil";
import MTask from "./MTask";
import TaskItemData from "./TaskItemData";
import VTaskItem from "./VTaskItem";

const {ccclass, property} = cc._decorator;

enum taskUIType {
    ACTIVITY= 'activity',
    TASK = 'task',
}

enum taskType {
    TURNOVER= 'turnover',
    VICTORY = 'victory',
    GAME = "game"
}

enum taskTypeId {
    TURNOVER = 1,
    VICTORY = 2,
    GAME= 3,
}

class TaskObj {
	taskId: number;
    com: VTaskItem;
    userTaskId: string;
    constructor(taskId: number,com: VTaskItem ,  userTaskId: string) {
        this.taskId  = taskId;
        this.com = com;
        this.userTaskId = userTaskId;
    }
}

@ccclass
export default class VTask extends VWindow {
    @property (cc.Prefab)
    taskPrefab: cc.Prefab = null;
    // 任务scrollView
    @property(cc.ScrollView)
    taskScrollView: cc.ScrollView = null;
    // scrollView content
    taskContent: cc.Node = null;
    private _back:cc.Node;
    private _left_toggle_btns: Array<cc.Toggle>;
    private _top_toggle_btns: Array<cc.Toggle>;
    private _task_titles: Array<cc.Node>;
    private _task_scrollviews: Array<cc.Node>;
    private _task_type : taskType;
    // private _scroll_content_task: cc.Node;
    private _scroll_content_activity: cc.Node;
    private _taskModel :MTask;
    private _turnover_task_data_list: Array<TaskItemData>;
    private _victory_task_data_list: Array<TaskItemData>;
    private _game_task_data_list: Array<TaskItemData>;
    private _task_data_list: Array<TaskItemData>;

    private _taskObj_list: Array<TaskObj>;
    private _turnoverCount: number;
    private _victoryCount: number;
    private _gameCount: number;
    private scrollItemNodePool: cc.NodePool = new cc.NodePool();
    private _isShow: boolean;
    turnover: cc.Node;
    victory: cc.Node;
    game: cc.Node;
   /* private _turnoverScroll: cc.Node;
    private _victoryScroll: cc.Node;
    private _gameScroll: cc.Node;*/
    _page: number = 0;
    _pageSize: number = 8;
    _pageIndex: number = 0;

    // LIFE-CYCLE CALLBACKS:
    private getInstance(): VTaskItem { 
        let ins = cc.instantiate(this.taskPrefab);
        ins.x = 440;
        let item = ins.getComponent(VTaskItem);
        if (!item) {
            item = ins.addComponent(VTaskItem);
        }
        ins.setParent(this.taskContent);
        return item;
    }
    onLoad () {
    }

    init() {
        //init local 
        super.init();
        this._left_toggle_btns = [];
        this._task_titles = [];
        this._task_scrollviews = [];
        this._taskModel = AppGame.ins.taskModel;
        this._turnover_task_data_list = [];
        this._victory_task_data_list = [];
        this._game_task_data_list = [];
        this._taskObj_list = [];
        this._isShow = false;

        //task title
        let task_title = UNodeHelper.find(this.node, 'root/task/content/task_title');
        let turnover_title =  UNodeHelper.find(task_title, "turnover");
        let activity_title =  UNodeHelper.find(task_title, "victory");
        let game_title =  UNodeHelper.find(task_title, "game");
        this._task_titles.push(turnover_title);
        this._task_titles.push(activity_title);
        this._task_titles.push(game_title);

        //left 
        let left_bar = UNodeHelper.find(this.node, "root/maskbg/left_bar");
        let task_content = UNodeHelper.find(this.node, "root/task");
        let btn_turnover:cc.Toggle = UNodeHelper.getComponent(left_bar, "btn_turnover", cc.Toggle);
        let btn_victory:cc.Toggle = UNodeHelper.getComponent(left_bar, "btn_victory", cc.Toggle);
        let btn_game:cc.Toggle = UNodeHelper.getComponent(left_bar, "btn_game", cc.Toggle);
        this._back = UNodeHelper.find(this.node,"back");
        UEventHandler.addClick(this._back,this.node,"VTask","clickClose");
        // 任务content 
        this.taskContent = UNodeHelper.find(task_content, "content/taskScrollview/view/content");
        //scrollContent
        // this._scroll_content_task = UNodeHelper.find(this.node, 'root/task/content/scrollview/view/content_task') ;

        this._left_toggle_btns.push(btn_turnover);
        this._left_toggle_btns.push(btn_victory);
        this._left_toggle_btns.push(btn_game);
        this.taskScrollView.node.on('scroll-ended',this.onTaskScrollEnd,this) 
        // btn click
        UEventHandler.addToggle(btn_turnover.node, this.node, "VTask", "onLeftBtnClick", taskType.TURNOVER);
        UEventHandler.addToggle(btn_victory.node, this.node, "VTask", "onLeftBtnClick", taskType.VICTORY);
        UEventHandler.addToggle(btn_game.node, this.node, "VTask", "onLeftBtnClick", taskType.GAME);  

        //event
        EventManager.getInstance().addEventListener(cfg_event.TASK_LIST, this.getTaskList, this);
        EventManager.getInstance().addEventListener(cfg_event.TASK_REWARD, this.getTaskReward, this);
        EventManager.getInstance().addEventListener(cfg_event.CLOSE_TASK, this.clickClose, this);
        EventManager.getInstance().addEventListener(cfg_event.GET_TASK, this.getTask, this);
        EventManager.getInstance().addEventListener(cfg_event.REFRESH_TASK_MARK, this.TaskMarkEvent, this);
    }

    start () {

    }

    onLeftBtnClick(event: Event,type: taskType, isFirst?: boolean) {
        this._task_type = type;
        this._task_titles.forEach(element => {
            if (element.name == this._task_type ) {
                element.active = true;
            } else {
                element.active = false;
            }
        });
        this._left_toggle_btns.forEach(element1 => {
            if (element1.node.name.substring(4) == this._task_type) {
                element1.isChecked = true;
            } else {
                element1.isChecked = false;
            }
        });
        
        this._taskModel.sendTaskList(); 

        // if (!isFirst) {
        //     this.initTaskContent();
        // }
    }

    onTaskScrollEnd(){
        let maxoffset = this.taskScrollView.getMaxScrollOffset()
        let offset = this.taskScrollView.getScrollOffset()
        if( Math.abs(maxoffset.y) -  Math.abs(offset.y) <= 100  && this.taskContent.childrenCount > 7){
            this.initRightItem();
        }
    }

    initRightItem() {
        if(this._pageIndex == 0) {
            this.taskContent.removeAllChildren()
            this._page = 0;
            this._pageIndex = -1;
            this.taskScrollView.stopAutoScroll();
            this.taskScrollView.scrollToTop(0.1);
        } else {
            this._page += 1;
        }

        if((this._page * this._pageSize) >= this._task_data_list.length){
            //没有更多元素了
            return;
        }

        if(this._task_data_list.length > 0) {
            for (var j = (this._page * this._pageSize);j < this._task_data_list.length && j < ((this._page + 1) * this._pageSize); j++) {
                const element = this._task_data_list[j];   
                var item = this.getInstance();
                item.show();
                let com = item.getComponent("VTaskItem");
                com.bindData(element); 
                com.setTaskItem();         
                let taskObj = new TaskObj(element.taskId,com,  element.userTaskId);
                this._taskObj_list.push(taskObj);
            }
            if(this._pageIndex == 0) {
                
            }
        }
    }

    private initTaskContent (){
        this.taskContent.removeAllChildren();
        this._pageIndex = 0;
        switch (this._task_type) {
            case taskType.VICTORY:
                this._task_data_list = this._victory_task_data_list;
                break;
            case taskType.TURNOVER:
                this._task_data_list = this._turnover_task_data_list;
                break;
            case taskType.GAME:
                this._task_data_list = this._game_task_data_list;
                break;
            default:
                break;
        }
       
    }

    addObj( line,  taskItemData: TaskItemData, com: VTaskItem) {
        let taskObj = new TaskObj(taskItemData.taskId,com,  taskItemData.userTaskId);
        this._taskObj_list.push(taskObj);
    }

    show(data: any){
        super.show(data);
        this._isShow = true;
        this._turnoverCount = 0;
        this._victoryCount = 0;
        this._gameCount = 0;
        this.taskContent.removeAllChildren();
        
        //默认打开流水任务
        this._task_type = taskType.TURNOVER;
        let isFirst = true;
        this._taskModel.sendTaskList();
        this.onLeftBtnClick(null, taskType.TURNOVER, isFirst);
    }

    getTaskList(event:any, data:any) {
        UDebug.log("getTaskList"+ data);
        if (!this._isShow) {
            return;
        }
        // AppGame.ins.showConnect(false);
        AppGame.ins.taskList = data;
        
        this.taskContent.removeAllChildren();
        this._victory_task_data_list = [];
        this._turnover_task_data_list = [];
        this._game_task_data_list = [];
        this._turnoverCount = 0;
        this._victoryCount = 0;
        this._gameCount =0;
        if(data.length == 0) {
            var str = '每日任务数据长度：' + data.length;
            ErrorLogUtil.ins.addErrorLog(str, LogLevelType.INFO); 
        }
        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            if (element.taskType == taskTypeId.TURNOVER) {
                let taskItemData  = this.setTaskItemData(element);
                this._turnover_task_data_list.push(taskItemData);
                if ((parseFloat(element.currentNum))>=  parseFloat(element.reachNum) && element.status!=3){ 
                    this._turnoverCount ++;
                }   
            } else if(element.taskType == taskTypeId.VICTORY) {
                let taskItemData  = this.setTaskItemData(element);
                this._victory_task_data_list.push(taskItemData);
                if ((parseFloat(element.currentNum))>=  parseFloat(element.reachNum) && element.status!=3){ 
                    this._victoryCount ++;
                }    
            } else if(element.taskType == taskTypeId.GAME) {
                let taskItemData  = this.setTaskItemData(element);
                this._game_task_data_list.push(taskItemData);
                if ((parseFloat(element.currentNum))>=  parseFloat(element.reachNum) && element.status!=3){ 
                    this._gameCount ++;
                }    
            }
        }
        this.initTaskContent();
        /*if (cc.sys.OS_IOS == cc.sys.os) {
        } else {
            this.onFrameLoadItem(this._task_type);
        }*/
        // this.initTaskContent();
        this.initRightItem();
        //更新未领取任务
        this.refreshTaskMark(); 
    }

    setTaskItemData(data: any) : TaskItemData{
        let taskItemData = new TaskItemData();
        taskItemData.userTaskId = data.userTaskId;
        taskItemData.taskId = data.taskId;
        taskItemData.sortId = data.sortId;
        taskItemData.taskTitle = data.taskTitle;
        taskItemData.gameId = data.gameId;
        taskItemData.roomId = data.roomId;
        taskItemData.taskType = data.taskType;
        taskItemData.taskCycle = data.taskCycle;
        taskItemData.reachNum = data.reachNum;
        taskItemData.rewardScore = data.rewardScore;
        taskItemData.icon = data.icon;
        taskItemData.createTime = data.createTime;
        taskItemData.currentNum = data.currentNum;
        taskItemData.status = data.status;
        return taskItemData;
    }

    getTaskReward(event: any, data:HallServer.GetTaskRewardMessageResponse) {
        if (!this._isShow) {
            return;
        }
        UDebug.log("getTaskReward"+ JSON.stringify(data));
        UDebug.log("getTask"+ JSON.stringify(data));
        this._taskObj_list.forEach(element => {
            if (element.userTaskId == data.userTaskId) {
               element.com.setTaskRewardGetted(data.rewardScore); 
            }
        });
    }

    getTask(event: any, data:any) {
        if (!this._isShow) {
            return;
        }
        UDebug.log("getTask"+ JSON.stringify(data));
        this._taskObj_list.forEach(element => {
            if (element.taskId == data.taskId) {
                element.userTaskId = data.userTaskId;
               element.com.setTaskGetted(); 
            }
        });
    }

    hide() {
        super.hide();
        this._isShow = false;
        /*this.turnover.removeAllChildren();
        this.victory.removeAllChildren();
        this.game.removeAllChildren();*/
        this.taskContent.removeAllChildren();
        this._taskModel.sendTaskList();
    }

    onDestroy() {
        EventManager.getInstance().removeEventListener(cfg_event.TASK_LIST, this.getTaskList, this);
        EventManager.getInstance().removeEventListener(cfg_event.TASK_REWARD, this.getTaskReward, this);
        EventManager.getInstance().removeEventListener(cfg_event.CLOSE_TASK, this.clickClose, this);
        EventManager.getInstance().removeEventListener(cfg_event.GET_TASK, this.getTask, this);
        EventManager.getInstance().removeEventListener(cfg_event.REFRESH_TASK_MARK, this.TaskMarkEvent, this);
    }

    onDisable() {
        
    }

    clickClose() {
        super.clickClose();
    }
    // update (dt) {}

    refreshTaskMark() {
        let left_bar = UNodeHelper.find(this.node, "root/maskbg/left_bar");
        let btn_turnover = UNodeHelper.find(left_bar, "btn_turnover");
        let btn_victory = UNodeHelper.find(left_bar, "btn_victory");
        let btn_game = UNodeHelper.find(left_bar, "btn_game");
        let turnoverredicon = UNodeHelper.find(btn_turnover, "redicon");
        let victoryredicon = UNodeHelper.find(btn_victory, "redicon");
        let gameredicon = UNodeHelper.find(btn_game, "redicon");
        turnoverredicon.active = false;
        victoryredicon.active = false;
        gameredicon.active = false;
 
        if (this._turnoverCount > 0) {
            turnoverredicon.active = true;
            let rediconNum = UNodeHelper.getComponent(btn_turnover, "redicon/count", cc.Label);
            if (this._turnoverCount > 99 ) {
                rediconNum.string = "99+";
            } else {
                rediconNum.string = this._turnoverCount+ "";
            }
        }

        if (this._gameCount>0) {
            gameredicon.active = true;
            let rediconNum = UNodeHelper.getComponent(btn_game, "redicon/count", cc.Label);
            if (this._gameCount > 99 ) {
                rediconNum.string = "99+";
            } else {
                rediconNum.string = this._gameCount+ "";
            }
        }
        if (this._victoryCount>0) {
            victoryredicon.active = true;
            let rediconNum = UNodeHelper.getComponent(btn_victory, "redicon/count", cc.Label);
            if (this._victoryCount > 99 ) {
                rediconNum.string = "99+";
            } else {
                rediconNum.string = this._victoryCount+ "";
            }
        }    
    }

    TaskMarkEvent(event: any, taskType: number) {
        if (!this._isShow) {
            return;
        }
        if (taskType == taskTypeId.TURNOVER) {
            this._turnoverCount --;
        } else if(taskType == taskTypeId.VICTORY) {
            this._victoryCount --;
        } else if ( taskType == taskTypeId.GAME) {
            this._gameCount --;
        }
        this.refreshTaskMark();
    }
}