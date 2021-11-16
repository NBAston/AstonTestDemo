import Model from "../../../common/base/Model";
import AppGame from "../../../public/base/AppGame";
import { Game, HongHei, HallServer, GameServer } from "../../../common/cmd/proto";
import UHandler from "../../../common/utility/UHandler";
import protoMap from "../../../common/cmd/UOpcode";
import UMsgCenter from "../../../common/net/UMsgCenter";
import { EGameType, ELeftType, ECommonUI, ELevelType, ETipType } from "../../../common/base/UAllenum";
import MBaseGameModel from "../../../public/hall/MBaseGameModel";
import AppStatus from "../../../public/base/AppStatus";
import MRoomModel from "../../../public/hall/room_zjh/MRoomModel";
import cfg_error from "../../common/cfg_error";
import UDebug from "../../../common/utility/UDebug";
import ULanHelper from "../../../common/utility/ULanHelper";
import { EventManager } from "../../../common/utility/EventManager";
import cfg_event from "../../../config/cfg_event";
import MRole from "../../../public/hall/lobby/MRole";
import CommVillage from "../../common/CommVillage";

const { ccclass, property } = cc._decorator;

/**
 * 创建： 朱武
 * 作用： 百人龙虎游戏模块
 */


// protoMap[Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER][Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_LOGIN_MESSAGE_REQ]={ 
//     subId: Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_LOGIN_MESSAGE_REQ,
//     request: HallServer.LoginMessage,
//     response: null,
//     log: "",
//     isprint: false};

enum GAME_STATUS {
    LH_GAME_START = 1,   // 游戏开始
    LH_GAME_END = 2,       // 游戏结束
    LH_GAME_FREE = 3,  // 开始开牌
    LH_GAME_START_TIPS = 4,   // 开始时间快结束了
    LH_GAME_OPEN = 5, // 开牌
    LH_GAME_BET = 6, // 开始下注
    LH_GAME_SCENE_FREE = 7,   // 空闲场景

}

const SEAT_COUNT = 6;   // 座位数量，0神算子 ， 12345 富豪榜
const MAX_RECORD = 100;

export default class MBrhh extends Model {
    static S_SYNC_TIME = 'S_SYNC_TIME';

    static S_GAME_FREE = 'S_GAME_FREE';         // 游戏空闲状态
    static S_GAME_START = 'S_GAME_START';           // 游戏开始状态
    static S_PLACE_JETTON = 'S_PLACE_JETTON';       // 玩家下注推送
    static S_GAME_END = 'S_GAME_END';               // 游戏结算
    static S_GAME_OPEN_CARD = 'S_GAME_OPEN_CARD';               // 游戏开牌
    static S_GAME_FREE_SCENE = 'S_GAME_FREE_SCENE';               // 游戏空闲场景消息
    static S_GAME_START_JETTON_SCENE = 'S_GAME_OPEN_SCENE'; // 游戏下注场景消息
    static S_GAME_OPEN_SCENE = 'S_GAME_OPEN_SCENE'; // 游戏开牌场景消息
    static S_GAME_END_SCENE = 'S_GAME_END_SCENE'; // 游戏结束场景消息

    static S_SEND_RECORD = 'S_SEND_RECORD';
    static S_PLACE_JET_FAIL = 'S_PLACE_JET_FAIL';      // 下注失败
    static S_QUERY_PLAYLIST = 'S_QUERY_PLAYLIST';
    static S_START_PLACE_JETTON = 'S_START_PLACE_JETTON';   // 开始下注
    static S_JETTON_BROADCAST = 'S_JETTON_BROADCAST';   // 下注推送

    static S_LEFT_ROOM = 'S_LEFT_ROOM';   // 离开游戏

    static FREE_TIME = 2;


    _leave_time: number = 0;        // 当前状态剩余时间

    _game_record: HongHei.GameOpenRecord = new HongHei.GameOpenRecord();   // 游戏记录
    _open_cards: HongHei.CMD_S_OpenCard = new HongHei.CMD_S_OpenCard();// 游戏开牌

    _game_status: GAME_STATUS = GAME_STATUS.LH_GAME_FREE;   // 

    _desk_info: HongHei.IGameDeskInfo = new HongHei.GameDeskInfo();
    _isShowFlag: boolean = false;

    _userMaxScore: number = 0;
    _canHandleMsg: boolean = true;

    _userScore: number = 0;
    private _timerId: any = null;

    private _isLefting: boolean = false;
    get leaveTime() {
        return this._leave_time;
    }

    get gameStatus() {
        return this._game_status;
    }


    get gameRecord() {
        return this._game_record;
    }

    haveSeat(playerid: number): number {

        // for (let index = 0; index < this._desk_info.players.length; index++) {
        for (let index = 0; index < SEAT_COUNT; index++) {
            const element = this._desk_info.players[index];
            if (element && element.user.userId == playerid) {
                return index;
            }
        }

        return -1;
    }

    resetData() {
        this._leave_time = 0;

        delete this._game_record;
        this._game_record = new HongHei.GameOpenRecord();
        delete this._desk_info;
        this._desk_info = null;
        this._desk_info = new HongHei.GameDeskInfo();
    }

    init() {

        this.regesterMsg(HongHei.SUBID.SUB_S_SYNC_TIME, new UHandler(this.onSyncTime, this));
        // this.regesterMsg(HongHei.SUBID.SUB_S_GAME_FREE, new UHandler(this.onGameFree, this));/
        this.regesterMsg(HongHei.SUBID.SUB_S_GAME_START, new UHandler(this.onGameStart, this));
        this.regesterMsg(HongHei.SUBID.SUB_S_PLACE_JETTON, new UHandler(this.onPlaceJetton, this));  // 用户下注
        this.regesterMsg(HongHei.SUBID.SUB_S_APPLY_BANKER, new UHandler(this.bankerSucceed, this)); //申请上庄成功
        this.regesterMsg(HongHei.SUBID.SUB_S_APPLY_BANKER_FAIL, new UHandler(this.bankerFail, this)); //申请上庄失败
        this.regesterMsg(HongHei.SUBID.SUB_S_CANCEL_BANKER, new UHandler(this.cancelSucceed, this)); //取消申请上庄成功
        this.regesterMsg(HongHei.SUBID.SUB_S_CANCEL_BANKER_FAIL, new UHandler(this.cancelFail, this)); //取消申请上庄失败
        this.regesterMsg(HongHei.SUBID.SUB_S_GET_OFF_BANKER, new UHandler(this.downBankerSucceed, this)); //申请下庄成功
        this.regesterMsg(HongHei.SUBID.SUB_S_GET_OFF_BANKER_FAIL, new UHandler(this.downBankerFail, this)); //申请下庄失败
        this.regesterMsg(HongHei.SUBID.SUB_S_CHANGE_BANKER, new UHandler(this.changeBanke, this));//切换庄家
        this.regesterMsg(HongHei.SUBID.SUB_S_GAME_END, new UHandler(this.onGameEnd, this));
        // this.regesterMsg(HongHei.SUBID.SUB_S_SEND_RECORD, new UHandler(this.onSendRecord, this));   // 游戏记录
        this.regesterMsg(HongHei.SUBID.SUB_S_PLACE_JET_FAIL, new UHandler(this.onPlaceJettonFail, this));
        this.regesterMsg(HongHei.SUBID.SUB_S_QUERY_PLAYLIST, new UHandler(this.onQueryPlaylist, this));
        this.regesterMsg(HongHei.SUBID.SUB_S_START_PLACE_JETTON, new UHandler(this.onStartPlaceJetton, this));  // 开始下注
        this.regesterMsg(HongHei.SUBID.SUB_S_JETTON_BROADCAST, new UHandler(this.onJettonBroadcast, this));  // 下注推送
        this.regesterMsg(HongHei.SUBID.SUB_S_OPEN_CARD, new UHandler(this.onOpenCard, this));  // 开牌消息
        this.regesterMsg(HongHei.SUBID.CS_GAMESCENE_STATUS_FREE, new UHandler(this.onGameSceneStatusFree, this));  // 空闲场景消息
        this.regesterMsg(HongHei.SUBID.CS_GAMESCENE_STATUS_JETTON, new UHandler(this.onGameSceneStatusJetton, this));  // 开始下注场景消息
        this.regesterMsg(HongHei.SUBID.CS_GAMESCENE_STATUS_OPEN, new UHandler(this.onGameSceneStatusOpen, this));  // 开牌场景消息
        this.regesterMsg(HongHei.SUBID.CS_GAMESCENE_STATUS_END, new UHandler(this.onGameSceneStatusEnd, this));  // 游戏结束场景消息

        MRole.bankerID = HongHei.SUBID.SUB_C_APPLY_BANKER;
        MRole.downBankerID = HongHei.SUBID.SUB_C_CANCEL_BANKER;
    }


    /**注册百人龙虎网络消息事件 */
    regesterMsg(subId: number, handler: UHandler) {
        UMsgCenter.ins.regester(EGameType.BRHH,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId,
            handler);
    }

    unregesterMsg(subId: number, handler: UHandler) {
        UMsgCenter.ins.unregester(EGameType.BRHH,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId,
            handler);
    }


    /** 发送网络消息*/
    sendMsg(subId: number, data: any, handler: UHandler = null, unlock: boolean = false) {
        UMsgCenter.ins.sendPkg(EGameType.BRHH,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId, data, handler, unlock);
    }



    run() {
        super.run();
        this._isLefting = false;
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.onRoomInfo, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.onLeftGame, this);
        AppGame.ins.appStatus.on(AppStatus.RECONNECT_IN_GAME_BUT_NO_IN_GAMING, this.onGameReconnect, this);
        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        // AppGame.ins.roomModel.on(MRoomModel.SC_ENTER_ROOM_FAIL, this.onEnterRoomFail, this);
        // EventManager.getInstance().addEventListener(cfg_event.CLOSE_CHARGE, this.onCloseCharge, this);
    }



    exit() {
        super.exit();
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.onRoomInfo, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.onLeftGame, this);
        AppGame.ins.appStatus.off(AppStatus.RECONNECT_IN_GAME_BUT_NO_IN_GAMING, this.onGameReconnect, this);
        this.unregesterMsg(HongHei.SUBID.SUB_S_SYNC_TIME, new UHandler(this.onSyncTime, this));
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);

        // AppGame.ins.roomModel.off(MRoomModel.SC_ENTER_ROOM_FAIL, this.onEnterRoomFail, this);
        // EventManager.getInstance().removeEventListener(cfg_event.CLOSE_CHARGE, this.onCloseCharge, this);
        // this.unregesterMsg(HongHei.SUBID.SUB_S_GAME_FREE, new UHandler(this.onGameFree, this));
        this.unregesterMsg(HongHei.SUBID.SUB_S_GAME_START, new UHandler(this.onGameStart, this));
        this.unregesterMsg(HongHei.SUBID.SUB_S_PLACE_JETTON, new UHandler(this.onPlaceJetton, this));  // 用户下注
        this.unregesterMsg(HongHei.SUBID.SUB_S_APPLY_BANKER, new UHandler(this.bankerSucceed, this));  //申请上庄成功
        this.unregesterMsg(HongHei.SUBID.SUB_S_APPLY_BANKER_FAIL, new UHandler(this.bankerFail, this)); //申请上庄失败
        this.unregesterMsg(HongHei.SUBID.SUB_S_CANCEL_BANKER, new UHandler(this.cancelSucceed, this)); //取消申请上庄成功
        this.unregesterMsg(HongHei.SUBID.SUB_S_CANCEL_BANKER_FAIL, new UHandler(this.cancelFail, this)); //取消申请上庄失败
        this.unregesterMsg(HongHei.SUBID.SUB_S_GET_OFF_BANKER, new UHandler(this.downBankerSucceed, this)); //申请下庄成功
        this.unregesterMsg(HongHei.SUBID.SUB_S_GET_OFF_BANKER_FAIL, new UHandler(this.downBankerFail, this)); //申请下庄失败
        this.unregesterMsg(HongHei.SUBID.SUB_S_CHANGE_BANKER, new UHandler(this.changeBanke, this));//切换庄家
        this.unregesterMsg(HongHei.SUBID.SUB_S_GAME_END, new UHandler(this.onGameEnd, this));
        // this.unregesterMsg(HongHei.SUBID.SUB_S_SEND_RECORD, new UHandler(this.onSendRecord, this));   // 游戏记录
        this.unregesterMsg(HongHei.SUBID.SUB_S_PLACE_JET_FAIL, new UHandler(this.onPlaceJettonFail, this));
        this.unregesterMsg(HongHei.SUBID.SUB_S_QUERY_PLAYLIST, new UHandler(this.onQueryPlaylist, this));
        this.unregesterMsg(HongHei.SUBID.SUB_S_START_PLACE_JETTON, new UHandler(this.onStartPlaceJetton, this));  // 开始下注
        this.unregesterMsg(HongHei.SUBID.SUB_S_JETTON_BROADCAST, new UHandler(this.onJettonBroadcast, this));  // 下注推送
        this.unregesterMsg(HongHei.SUBID.SUB_S_OPEN_CARD, new UHandler(this.onOpenCard, this));  // 开牌消息
        this.unregesterMsg(HongHei.SUBID.CS_GAMESCENE_STATUS_FREE, new UHandler(this.onGameSceneStatusFree, this));  // 空闲场景消息
        this.unregesterMsg(HongHei.SUBID.CS_GAMESCENE_STATUS_JETTON, new UHandler(this.onGameSceneStatusJetton, this));  // 开始下注场景消息
        this.unregesterMsg(HongHei.SUBID.CS_GAMESCENE_STATUS_OPEN, new UHandler(this.onGameSceneStatusOpen, this));  // 开牌场景消息
        this.unregesterMsg(HongHei.SUBID.CS_GAMESCENE_STATUS_END, new UHandler(this.onGameSceneStatusEnd, this));  // 游戏结束场景消息
    }







    update(dt: number) {

    }


    /*********************** send ***************/

    /**
     * 发送离开游戏
     * @param gameid 游戏id
     * @param roomid 房间id
     */
    sendLeftGame(gameid: number, roomid: number) {
        AppGame.ins.gamebaseModel.requestLeft(gameid, roomid, AppGame.ins.roleModel.useId, ELeftType.ReturnToRoom);
    }




    /**
     * 请求下注
     * @param area 
     * @param jetton 
     */
    sendBet(area: number, jetton: number) {
        if (MRole.bankerBool) {
            AppGame.ins.showTips({ data: "自己是庄家时,不能下注!", type: ETipType.onlyone });
        }
        else {
            var data = {
                jettonArea: area,
                jettonScore: jetton,
            }
            this.sendMsg(HongHei.SUBID.SUB_C_PLACE_JETTON, data);
        }
    }

    // 申请上庄
    sendBanker() {
        var data = {
            applyUserId: AppGame.ins.roleModel.useId,
        }
        this.sendMsg(HongHei.SUBID.SUB_C_APPLY_BANKER, data);
    }

    // 申请上庄成功
    bankerSucceed(data: HongHei.CMD_S_ApplyBanker) {
        AppGame.ins.bankerBurrent = data.currentBankerInfo;
        AppGame.ins.bankerApply = data.applyBankerInfo;
        this.changeBanke_Brhh(data.currentBankerInfo);
        this.emit(MRole.S_BANKERSUCCEED, data);
        if (CommVillage.ins != null) {
            CommVillage.ins.bankerSucceed();
        }
    }

    // 申请上庄失败
    bankerFail(data: HongHei.CMD_S_ApplyBankerFail) {
        AppGame.ins.showTips({ data: data.errMsg, type: ETipType.onlyone });
        this.emit(MRole.S_BANKERFAILL, data);
        if (CommVillage.ins != null) {
            CommVillage.ins.bankerFail();
        }
    }

    //取消排队
    cancelBanker() {
        var data = {
            cancelUserId: AppGame.ins.roleModel.useId,
        }
        this.sendMsg(HongHei.SUBID.SUB_C_CANCEL_BANKER, data);
    }

    // 取消排队成功
    cancelSucceed(data: HongHei.CMD_S_CancelBanker) {
        AppGame.ins.bankerBurrent = data.currentBankerInfo;
        AppGame.ins.bankerApply = data.applyBankerInfo;
        this.changeBanke_Brhh(data.currentBankerInfo);
        this.emit(MRole.S_CANCELSUCCEED, data);
        if (CommVillage.ins != null) {
            CommVillage.ins.cancelSucceed();
        }
    }

    // 取消排队失败
    cancelFail(data: HongHei.CMD_S_CancelBankerFail) {
        AppGame.ins.showTips({ data: data.errMsg, type: ETipType.onlyone });
        this.emit(MRole.S_CANCELFAILL, data);
        if (CommVillage.ins != null) {
            CommVillage.ins.cancelFail();
        }
    }

    //申请下庄
    downBanker() {
        var data = {
            bankerUserId: AppGame.ins.roleModel.useId,
        }
        this.sendMsg(HongHei.SUBID.SUB_C_GET_OFF_BANKER, data);
    }

    // 申请下庄成功
    downBankerSucceed(data: HongHei.CMD_CS_GetOffBanker) {
        if (data.bankerUserId == AppGame.ins.roleModel.useId) {
            MRole.bankerBool = false;//庄家是别人
        }
        this.emit(MRole.S_DOWNSUCCEED, data);
        if (CommVillage.ins != null) {
            CommVillage.ins.downBankerSucceed();
        }
    }

    // 申请下庄失败
    downBankerFail(data: HongHei.CMD_S_GetOffBankerFail) {
        AppGame.ins.showTips({ data: data.errMsg, type: ETipType.onlyone });
        this.emit(MRole.S_DOWNERFAILL, data);
        if (CommVillage.ins != null) {
            CommVillage.ins.downBankerFail();
        }
    }

    // 切换庄家
    changeBanke(data: HongHei.CMD_S_ChangeBanker) {
        AppGame.ins.bankerBurrent = data.currentBankerInfo;
        AppGame.ins.bankerApply = data.applyBankerInfo;
        this.changeBanke_Brhh(data.currentBankerInfo);
        this.emit(MRole.S_CHANGEBANKER, data);
        if (CommVillage.ins != null) {
            CommVillage.ins.changeBanke();
        }
        AppGame.ins.showTips({ data: data.msg, type: ETipType.onlyone });
    }

    /**
     * 判断自己是否是庄家
     * @param tempCurrent 
     */
    changeBanke_Brhh(tempCurrent: HongHei.ICurrentBankerInfo) {
        if (tempCurrent != null) {
            if (tempCurrent.banker.userId == AppGame.ins.roleModel.useId) {
                MRole.bankerBool = true;//庄家是自己
            }
            else {
                MRole.bankerBool = false;//庄家是别人
            }
        }
        else {
            MRole.bankerBool = false;//庄家是别人
        }
    }

    //更新庄家信息
    updateBanker(data: HongHei.IGameDeskInfo, delaySeconds: number = 0) {
        AppGame.ins.bankerInfo = data.bankerInfo;
        if (data.bankerInfo != null) {
            if (data.bankerInfo.currentBankerInfo != null) {
                AppGame.ins.bankerBurrent = data.bankerInfo.currentBankerInfo;
            }

            if (data.bankerInfo.applyBankerInfo != null) {
                AppGame.ins.bankerApply = data.bankerInfo.applyBankerInfo;
            }
        }
        AppGame.ins.brhhModel.emit(MRole.BANKERINFO, data, delaySeconds);
        this._timerId = setTimeout(() => {
            if (CommVillage.ins != null) {
                CommVillage.ins.updateInfo();
            }
        }, delaySeconds * 1000)
    }

    sendRebet() {
        var data = {
            dwUserID: AppGame.ins.roleModel.useId,
        }
        // this.sendMsg(HongHei.SUBID.SUB_C_REJETTON, data);
    }

    /**
     * 请求在线玩家列表
     */
    sendPlayerList() {
        var data = {
            nLimitCount: 20,
            nBeginIndex: 1,
        }
        this.sendMsg(HongHei.SUBID.SUB_C_QUERY_PLAYERLIST, data);
    }

    /**
     * 请求同步分值
     */
    sendSyncDesk() {

        this.sendMsg(HongHei.SUBID.SUB_C_SYNC_DESK, null);
    }

    onSyncTime(data: HongHei.CMD_S_SyncTime_Res) {
        this.emit(MBrhh.S_SYNC_TIME, data);
    }


    /***************************************event *****************/
    /**
     * 游戏空闲 (弃用)
     * @param data 
     */
    onGameFree(data: any) {
        UDebug.Log('onGameFree' + data);
        this._isShowFlag = false;
        this._game_status = GAME_STATUS.LH_GAME_END;
        this.emit(MBrhh.S_GAME_FREE);
    }

    /**
     * 游戏开始 （开始下注）
     * @param data 
     */
    onGameStart(data: HongHei.CMD_S_GameStart) {
        if(!this._canHandleMsg) return;
        this._isShowFlag = false;
        UDebug.Log('onGameStart' + data);
        this.updateBanker(data.deskData);
        this._game_status = GAME_STATUS.LH_GAME_START;
        this.emit(MBrhh.S_GAME_START, data);
        if(data.deskData.hasOwnProperty("gameOpenRecord")) {
            this._game_record.record = data.deskData.gameOpenRecord.record;
            this._game_record.allCount = data.deskData.gameOpenRecord.allCount;
            this._game_record.heiCount = data.deskData.gameOpenRecord.heiCount;
            this._game_record.hongCount = data.deskData.gameOpenRecord.hongCount;
            this.emit(MBrhh.S_SEND_RECORD, data.deskData.gameOpenRecord);
        }
    }
 
    /**
     * 游戏结算 (停止下注)
     * @param data 
     */
    onGameEnd(data: HongHei.CMD_S_GameEnd) {
        UDebug.Log('onGameEnd' + data);
        if(!this._canHandleMsg) return;
        if(data.deskData.hasOwnProperty("gameOpenRecord")) {
            this._game_record.record = data.deskData.gameOpenRecord.record;
            this._game_record.allCount = data.deskData.gameOpenRecord.allCount;
            this._game_record.heiCount = data.deskData.gameOpenRecord.heiCount;
            this._game_record.hongCount = data.deskData.gameOpenRecord.hongCount;
            this.emit(MBrhh.S_SEND_RECORD, data.deskData.gameOpenRecord);
        }
        this.updateBanker(data.deskData, 6.5);
        if (data.timeLeave > MBrhh.FREE_TIME) {
            this._game_status = GAME_STATUS.LH_GAME_END;
            this._leave_time = data.timeLeave - MBrhh.FREE_TIME; 
        } else {
            this._leave_time = data.timeLeave;
            this._game_status = GAME_STATUS.LH_GAME_FREE;
        }

        let record = new (HongHei.HongHeiGameRecord);
        record.cardGroupType = data.deskData.winCardGroupType;
        record.winArea = data.deskData.winTag;

        // if(!this._isShowFlag) {
        //     if(!data.deskData.hasOwnProperty("gameOpenRecord")) {
        //     }
        //     this._isShowFlag = false;
        // }
        this._game_record.record.push(record); 
        // while (this._game_record.record.length > MAX_RECORD) {
        //     this._game_record.record.shift();
        // }
        if (data.deskData.winTag == HongHei.JET_AREA.RED_AREA) {
            this._game_record.hongCount += 1;
        } else if (data.deskData.winTag == HongHei.JET_AREA.SPECIAL_AREA) {
            this._game_record.allCount += 1;
        } else if (data.deskData.winTag == HongHei.JET_AREA.BLACK_AREA) {
            this._game_record.heiCount += 1;
        }

        this._desk_info = data.deskData;
        this.emit(MBrhh.S_GAME_END, data);
    }


    // 游戏开牌
    onOpenCard(data: HongHei.CMD_S_OpenCard) {
        if(!this._canHandleMsg) return;
        this._game_status = GAME_STATUS.LH_GAME_OPEN;
        this.emit(MBrhh.S_GAME_OPEN_CARD, data);

    }

    // 空闲场景消息
    onGameSceneStatusFree(data: HongHei.CMD_Scene_StatusFree) {
        this._canHandleMsg = true;
        this._desk_info = data.deskData;
        this._leave_time = data.timeLeave;
        this._game_status = GAME_STATUS.LH_GAME_SCENE_FREE;
        this.updateBanker(data.deskData);
        if (data.deskData.hasOwnProperty("gameOpenRecord")) {
            this._game_record.record = data.deskData.gameOpenRecord.record;
            this._game_record.allCount = data.deskData.gameOpenRecord.allCount;
            this._game_record.heiCount = data.deskData.gameOpenRecord.heiCount;
            this._game_record.hongCount = data.deskData.gameOpenRecord.hongCount;
            this.emit(MBrhh.S_SEND_RECORD, data.deskData.gameOpenRecord);
        }
        this.emit(MBrhh.S_GAME_FREE_SCENE, data);
    }
    // 游戏开始下注场景消息
    onGameSceneStatusJetton(data: HongHei.CMD_Scene_StatusJetton) {
        this._canHandleMsg = true;
        this._desk_info = data.deskData;
        this._leave_time = data.timeLeave;
        this._game_status = GAME_STATUS.LH_GAME_BET;
        this.updateBanker(data.deskData);
        if (data.deskData.hasOwnProperty("gameOpenRecord")) {
            this._game_record.record = data.deskData.gameOpenRecord.record;
            this._game_record.allCount = data.deskData.gameOpenRecord.allCount;
            this._game_record.heiCount = data.deskData.gameOpenRecord.heiCount;
            this._game_record.hongCount = data.deskData.gameOpenRecord.hongCount;
            this.emit(MBrhh.S_SEND_RECORD, data.deskData.gameOpenRecord);
        }
        this.emit(MBrhh.S_GAME_START_JETTON_SCENE, data);
    
    }

    // 开牌场景消息
    onGameSceneStatusOpen(data: HongHei.CMD_Scene_StatusOpen) {
        this._canHandleMsg = true;
        this._leave_time = data.timeLeave;
        this._game_status = GAME_STATUS.LH_GAME_OPEN;
        this._desk_info = data.deskData;
        if(data.deskData.hasOwnProperty("gameOpenRecord")) {
            this._game_record.record = data.deskData.gameOpenRecord.record;
            this._game_record.allCount = data.deskData.gameOpenRecord.allCount;
            this._game_record.heiCount = data.deskData.gameOpenRecord.heiCount;
            this._game_record.hongCount = data.deskData.gameOpenRecord.hongCount;
            this.emit(MBrhh.S_SEND_RECORD, data.deskData.gameOpenRecord);
        }
        this.updateBanker(data.deskData);
        this.emit(MBrhh.S_GAME_OPEN_SCENE, data);
        if(data.deskData.hasOwnProperty('cards')) {
           this._open_cards.cards = data.deskData.cards;
           this._open_cards.roundId = data.roundId;
           this._open_cards.timeLeave = data.timeLeave;
            this.onOpenCard(this._open_cards);
        }
    }



    // 游戏结束场景消息
    onGameSceneStatusEnd(data: HongHei.CMD_Scene_StatusEnd) {
        this._canHandleMsg = true;
        this._desk_info = data.deskData;
        if(data.deskData.hasOwnProperty("gameOpenRecord")) {
            this._game_record.record = data.deskData.gameOpenRecord.record;
            this._game_record.allCount = data.deskData.gameOpenRecord.allCount;
            this._game_record.heiCount = data.deskData.gameOpenRecord.heiCount;
            this._game_record.hongCount = data.deskData.gameOpenRecord.hongCount;
            this.emit(MBrhh.S_SEND_RECORD, data.deskData.gameOpenRecord);
        }
        this.updateBanker(data.deskData);
        this.emit(MBrhh.S_GAME_END_SCENE, data);

    }


    /**
     * 用户下注推送 （所有用户下注的推送）
     * @param data 
     */
    onPlaceJetton(data: HongHei.CMD_S_PlaceJetSuccess) {
        // UDebug.Log('onPlaceJetton' + data);
        if(!this._canHandleMsg) return;

        this._desk_info.selfJettonScore = data.selfJettonScore;
        this._desk_info.allJettonScore = data.allJettonScore;
        let a = new HongHei.PlaceJetInfo();
        a.jettonArea = data.jettonArea;
        a.jettonCount = 1;
        a.jettonType = data.jettonScore;
        this._desk_info.jetInfo.push(a);

        this.emit(MBrhh.S_PLACE_JETTON, data);
    }

    /**
     * 玩家下注失败
     * @param data 
     */
    onPlaceJettonFail(data: HongHei.CMD_S_PlaceJettonFail) {
        UDebug.Log('onPlaceJettonFail' + data);
        this.emit(MBrhh.S_PLACE_JET_FAIL, data);
    }

    // /**
    //  * 游戏开奖记录
    //  * @param data 
    //  */
    // onSendRecord(data: HongHei.CMD_S_GameRecord) {
    //     UDebug.Log('onSendRecord' + data);
    //     this._game_record = data;
    //     this.emit(MBrhh.S_SEND_RECORD, data);
    // }

    /**
     * 同步系统时间
     */
    sendSyncTime() {
        this.sendMsg(HongHei.SUBID.SUB_C_SYNC_TIME, null);
    }


    onQueryPlaylist(data: any) {
        UDebug.Log('onQueryPlaylist' + data);
    }

    onStartPlaceJetton(data: HongHei.CMD_S_StartPlaceJetton) {
        if(!this._canHandleMsg) return;
        this._isShowFlag = false;
        this.updateBanker(data.deskData);
        this._leave_time = data.timeLeave;
        this._game_status = GAME_STATUS.LH_GAME_BET;
        this._desk_info = data.deskData;
        UDebug.Log('onStartPlaceJetton' + data);
        this.emit(MBrhh.S_START_PLACE_JETTON, data);
        if(data.deskData.hasOwnProperty("gameOpenRecord")) {
            this._game_record.record = data.deskData.gameOpenRecord.record;
            this._game_record.allCount = data.deskData.gameOpenRecord.allCount;
            this._game_record.heiCount = data.deskData.gameOpenRecord.heiCount;
            this._game_record.hongCount = data.deskData.gameOpenRecord.hongCount;
            this.emit(MBrhh.S_SEND_RECORD, data.deskData.gameOpenRecord);
        }
    }

    onJettonBroadcast(data: any) {
        // onJettonBroadcast(data: HongHei.CMD_S_Jetton_Broadcast) {
        this.emit(MBrhh.S_JETTON_BROADCAST, data);
    }


    /*****************************************************************
     *  
     **************************************************************************/

    onRoomInfo(data: any) {

    }


    onLeftGame(data: GameServer.MSG_C2S_UserLeftMessageResponse) {
        UDebug.Log(data);

        if (data.retCode == 0) {
            if (!this._isLefting) {
                this._isLefting = true;
                // EventManager.getInstance().raiseEvent(cfg_event.CLOSE_CHARGE);
                // AppGame.ins.checkEnterMinScore(AppGame.ins.game_watch_limit_score + 1);
                clearInterval(this._timerId)
                AppGame.ins.loadLevel(ELevelType.Hall, EGameType.BRHH);
            }
        } else {
            if (AppGame.ins.bankerBurrent && AppGame.ins.bankerBurrent.banker && AppGame.ins.bankerBurrent.banker.userId == AppGame.ins.roleModel.useId) {
                AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME2);
            } else {
                AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
            }
        }

        // this.emit(MBrhh.S_LEFT_ROOM, data);
    }

    /**请求刷新场景消息 */
    sendFreshGameScene() {
        this.sendMsg(HongHei.SUBID.CS_GAMESCENE_FRESH,{});
    }

    onGameReconnect(data: any): any {
        // AppGame.ins.roomModel.requestMatch();
    }

    onGameToBack(data: any) {
        UDebug.Log(data);
        if (!data) {
            this.sendSyncTime();  // 同步系统时间
            this.sendFreshGameScene(); // 切换到前台的时候刷新场景消息
            this._isShowFlag = true;
        }
    }



    // onEnterRoomFail(data: any): any {

    //     if (data == 13) {
    //         AppGame.ins.roomModel.requestMatch();
    //         return;
    //     }
    //     let str = cfg_error.enter_game[data] || '进入游戏失败，请稍后在试';
    //     AppGame.ins.showUI(ECommonUI.NewMsgBox, {
    //         type: 1, data: str, handler: UHandler.create((() => {

    //             AppGame.ins.loadLevel(ELevelType.Hall, EGameType.BRHH);
    //         }))
    //     });
    // }

    private onCloseCharge(): void {
        // AppGame.ins.checkEnterMinScore(AppGame.ins.roleModel.score);
    }
}
