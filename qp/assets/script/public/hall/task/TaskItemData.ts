// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

// const {ccclass, property} = cc._decorator;

// @ccclass
export default class TaskItemData {
    userTaskId:string;
    taskId: number;
    sortId : number;
    taskTitle: string;
    gameId: number;
    roomId: number;
    taskType:number;
    taskCycle:number;
    reachNum:string;
    rewardScore:string;
    icon: string;
    createTime:string;
    currentNum:string;
    status:number;  // 任务状态 (0: 未开始任务, 1: 已开始任务，2:任务已完成，未领取金币 3: 
    // constructor(taskId: number,
    //     sortId : number,
    //     taskTitle: string,
    //     gameId: number,
    //     roomId: number,
    //     taskType:number,
    //     taskCycle:number,
    //     reachNum:string,
    //     rewardScore:string,
    //     icon: string,
    //     createTime:string,
    //     currentNum:string,
    //     status:number) {
    //     this.taskId  = taskId;
    //     this.sortId = sortId;
    //     this.size = size;
    // }
}
