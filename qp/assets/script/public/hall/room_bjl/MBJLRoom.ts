import Model from "../../../common/base/Model";
import { Bjl, Game, HallServer, ProxyServer } from "../../../common/cmd/proto";
import UMsgCenter from "../../../common/net/UMsgCenter";
import { EventManager } from "../../../common/utility/EventManager";
import UDebug from "../../../common/utility/UDebug";
import UHandler from "../../../common/utility/UHandler";
import cfg_event from "../../../config/cfg_event";
import BrbjlSummaryData from "../../../game/bjl/BrbjlSummaryData";
import AppGame from "../../base/AppGame";

export default class MBJLRoom extends Model {
    static GET_BJL_SUMMARY_MESSAGE = 'GET_BJL_SUMMARY_MESSAGE' // 获取金币场百家乐牌路消息
    static UPDATE_SUMMARY_MESSAGE = 'UPDATE_SUMMARY_MESSAGE' // 更新牌路信息

    _brbjlSummaryArrData: Array<BrbjlSummaryData> = [];
    _game_record: any = null;//Bjl.CMD_S_GameRecord = new Bjl.CMD_S_GameRecord;//CMD_S_GetGameRecord();   // 游戏记录
    
    get gameRecord() {
        return this._game_record;
    }

    get brbjlSummaryArrData() {
        return this._brbjlSummaryArrData;
    }

    getBrbjlSummaryDataOfRoomId(roomId: number) {
        let index = this._brbjlSummaryArrData.findIndex(item => item.roomId == roomId);
        if(index != -1) {
            return this._brbjlSummaryArrData[index];
        }
        return null;
    }

    resetData(): void {
        // throw new Error("Method not implemented.");
        delete this._game_record;
        this._game_record = null;
        // this._game_record = new Bjl.CMD_S_GameRecord();
        
        delete this._brbjlSummaryArrData;
        this._brbjlSummaryArrData = [];
    }

    init(): void {
        this.regesterMsg(Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_BJL_SUMMARY_MESSAGE_RES, new UHandler(this.onGetBjlSummaryMessage, this));
        // this.regesterMsg(Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_BJL_SUMMARY_MESSAGE_RES, new UHandler(this.onGetBjlSummaryMessage, this));
        // 注销百家乐选场界面 推送消息
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_PROXY,
            Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.CLIENT_TO_PROXY_UNREGISTER_BJL_SUMMARY_MESSAGE_RES,
            new UHandler(this.onUnRegisterBjlSummaryMessage, this));

            // 服务器推送百家乐选场界面消息
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_PROXY,
            Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_BJL_SUMMARY_MESSAGE_NOTIFY,
            new UHandler(this.onNotifyBjlSummaryMessage, this));
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
        this.unregesterMsg(Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_BJL_SUMMARY_MESSAGE_RES, new UHandler(this.onGetBjlSummaryMessage, this));
    }

    update(dt: number): void {

    }

    // 发送获取百家乐选场界面数据消息
    sendGetBjlSummaryMessage() {
        let data = new HallServer.GetBJLSummaryMessage();
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_BJL_SUMMARY_MESSAGE_REQ,data);
    }

    // 百家乐选场界面 注消推送消息
    sendUnregisterBJLSummaryMessage() {
        let data = new ProxyServer.Message.UnregisterBJLSummaryMessage();
        UMsgCenter.ins.sendPkg( 0,
             Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_PROXY ,
              Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.CLIENT_TO_PROXY_UNREGISTER_BJL_SUMMARY_MESSAGE_REQ, data)

    }

    // 百家乐选场界面信息数据
    onGetBjlSummaryMessage(data: HallServer.GetBJLSummaryMessageResponse) {
        cc.warn(`获取百家乐选场界面信息数据----`+JSON.stringify(data));
        if(data.retCode == 0) {
            if(data.BJLSummary && data.BJLSummary.length > 0) {
               this.resetData();
                for (let index = 0; index < data.BJLSummary.length; index++) {
                    const element = data.BJLSummary[index];
                    this._brbjlSummaryArrData.push(this.initRoomGameRecordItem(JSON.parse(element), parseInt(data.currentServerTime)));
                    
                }
            } 
            this.emit(MBJLRoom.GET_BJL_SUMMARY_MESSAGE, this._brbjlSummaryArrData)
        }
    }

    getGameRecordItem(recordItem: number) {
        let gameRecord = new Bjl.GameRecord();
        /*设置任意值 模拟百家乐开牌记录数据*/
        gameRecord.playerCount = 2; 
        gameRecord.bankerCount = 2;
        gameRecord.playerCardCount = 0;
        gameRecord.bankerCardCount = 0;
        switch (recordItem) {
            case 0:
                {
                    gameRecord.playerTwoPair = false;
                    gameRecord.bankerTwoPair = false;
                    gameRecord.winArea = 4;
                }
                break;
            case 1:
                {
                    gameRecord.playerTwoPair = true;
                    gameRecord.bankerTwoPair = false;
                    gameRecord.winArea = 4;
                }
                break;
            case 2:
                {
                    gameRecord.playerTwoPair = false;
                    gameRecord.bankerTwoPair = true;
                    gameRecord.winArea = 4;                
                }
                break;
            case 3:
                {
                    gameRecord.playerTwoPair = true;
                    gameRecord.bankerTwoPair = true;
                    gameRecord.winArea = 4;                
                }
                break;
            case 4:
                {
                    gameRecord.playerTwoPair = false;
                    gameRecord.bankerTwoPair = false;
                    gameRecord.winArea = 3;     
                }
                break;
            case 5:
                {
                    gameRecord.playerTwoPair = true;
                    gameRecord.bankerTwoPair = false;
                    gameRecord.winArea = 3;     
                }
                break;
            case 6:
                {
                    gameRecord.playerTwoPair = false;
                    gameRecord.bankerTwoPair = true;
                    gameRecord.winArea = 3;     
                }
                break;
            case 7:
                {
                    gameRecord.playerTwoPair = true;
                    gameRecord.bankerTwoPair = true;
                    gameRecord.winArea = 3;     
                }
                break;
            case 8:
                {
                    gameRecord.playerTwoPair = false;
                    gameRecord.bankerTwoPair = false;
                    gameRecord.winArea = 2;   
                }
                break;
            case 9:
                {
                    gameRecord.playerTwoPair = true;
                    gameRecord.bankerTwoPair = false;
                    gameRecord.winArea = 2;   
                }
                break;
            case 10:
                {
                    gameRecord.playerTwoPair = false;
                    gameRecord.bankerTwoPair = true;
                    gameRecord.winArea = 2;   
                }
                break;
            case 11:
                {
                    gameRecord.playerTwoPair = true;
                    gameRecord.bankerTwoPair = true;
                    gameRecord.winArea = 2;   
                }
                break;
            default:
                break;
        }
        return gameRecord;
    }

    initRoomGameRecordItem(dataItem: any, currentServerTime: number) {
        let summaryItem = new BrbjlSummaryData();
        summaryItem.gameId = dataItem.gameId; 
        summaryItem.roomId = dataItem.roomId;
        summaryItem.status = dataItem.status;
        summaryItem.updateTime = dataItem.updateTime;
        summaryItem.statusTime = dataItem.statusTime;
        summaryItem.currentServerTime = currentServerTime;
        summaryItem.recordList = dataItem.recordList;
        let cmd_gameRecord = new Bjl.GameOpenRecord();
        if(dataItem.recordList.length > 0) {
            let xianCount = 0;
            let zhuangCount = 0;
            let heCount = 0;
            for (let index = 0; index < dataItem.recordList.length; index++) {
                const recordItem = dataItem.recordList[index];
                // summaryItem.game_record.record.push(this.getGameRecordItem(recordItem));    
                cmd_gameRecord.record.push(this.getGameRecordItem(recordItem));
                switch (recordItem) {
                    case 0: 
                    case 1:
                    case 2: 
                    case 3:
                        heCount++;
                        break;
                    case 4:      
                    case 5:    
                    case 6:
                    case 7:
                        zhuangCount++;
                        break;
                    case 8:                                       
                    case 9:                                     
                    case 10:                                     
                    case 11:  
                    xianCount++;                                   
                        break;
                    default:
                        break;
                    }
            }
            cmd_gameRecord.heCount = heCount;
            cmd_gameRecord.zhuangCount = zhuangCount;
            cmd_gameRecord.xianCount = xianCount;
        }  
        summaryItem.game_record = cmd_gameRecord;
        return summaryItem;
    }

    onUnRegisterBjlSummaryMessage(data: any) {
        cc.warn(`百家乐选场界面 注销推送消息---`+JSON.stringify(data));
    }

    onNotifyBjlSummaryMessage(data: any) {
        cc.warn(`百家乐选场界面 推送消息---`+JSON.stringify(data));
        if(data && data.hasOwnProperty('BJLSummary')) {
            let dataItem = this.initRoomGameRecordItem(JSON.parse(data.BJLSummary), 0);
            this.emit(MBJLRoom.UPDATE_SUMMARY_MESSAGE, dataItem);
        }

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
