import Model from "../../../common/base/Model";
import AppGame from "../../../public/base/AppGame";
import { Game, Bjl, HallServer, GameServer } from "../../../common/cmd/proto";
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
import { RoomPlayerInfo } from "../../../public/hall/URoomClass";

const { ccclass, property } = cc._decorator;

enum GAME_STATUS {
    BJL_GAME_START = 1, // 游戏开始Ready状态
    BJL_GAME_BET = 2,   // 开始下注
    BJL_GAME_END = 3,  // 停止下注
    BJL_GAME_FREE = 4,  // 开始开牌
    BJL_GAME_START_TIPS = 5,   // 开始时间快结束了
    BJL_GAME_SHUFFLE_CARDS = 6, // 洗牌中
    BJL_GAME_OPEN = 7, // 开牌
    BJL_GAME_SCENE_FREE = 8, // 空闲场景

}

const SEAT_COUNT = 6;   // 座位数量，0神算子 ， 12345 富豪榜
const MAX_RECORD = 100;

export default class MBrbjl extends Model {

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
    static S_SEND_RECORD = 'S_SEND_RECORD';         // 游戏记录
    static S_PLACE_JET_FAIL = 'S_PLACE_JET_FAIL';      // 下注失败
    static S_QUERY_PLAYLIST = 'S_QUERY_PLAYLIST';       // 在线玩家列表
    static S_START_PLACE_JETTON = 'S_START_PLACE_JETTON';   // 开始下注
    static S_JETTON_BROADCAST = 'S_JETTON_BROADCAST';
    static S_LEFT_ROOM = 'S_LEFT_ROOM';   // 离开游戏
    static S_SHUFFLE_CARDS = 'S_SHUFFLE_CARDS';   // 洗牌


    static FREE_TIME = 2;


    _leave_time: number = 0;        // 当前状态剩余时间

    _game_record: Bjl.GameOpenRecord = new Bjl.GameOpenRecord;// 游戏记录
    _open_cards: Bjl.CMD_S_OpenCard = new Bjl.CMD_S_OpenCard();// 游戏开牌

    _game_status: GAME_STATUS = GAME_STATUS.BJL_GAME_FREE;   // 

    _desk_info: Bjl.IGameDeskInfo = new Bjl.GameDeskInfo();

    _userMaxScore: number = 0;

    _userScore: number = 0;
    _maxJettonScore: number = 0;
    _isShowFlag: boolean = false;
    _canHandleMsg: boolean = true;
    _isAutoOpenRecord: boolean = true;

    get isAutoOpenRecord() {
        return this._isAutoOpenRecord;
    }

    set isAutoOpenRecord(v: boolean) {
        this._isAutoOpenRecord = v;
    }


    get leaveTime() {
        return this._leave_time;
    }

    get gameStatus() {
        return this._game_status;
    }


    get gameRecord() {
        return this._game_record;
    }
    private _lefting: boolean = false;

    /**本局的玩家 */
    private _battleplayer: { [key: number]: RoomPlayerInfo } = {};

    get gBattlePlayer(): { [key: number]: RoomPlayerInfo } {
        return this._battleplayer;
    }

    haveSeat(playerid: number): number {
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
        this._game_record = new Bjl.GameOpenRecord();
        delete this._desk_info;
        this._desk_info = null;
        this._desk_info = new Bjl.GameDeskInfo();
    }

    init() {

        this.regesterMsg(Bjl.SUBID.SUB_S_SYNC_TIME, new UHandler(this.onSyncTime, this));
        this.regesterMsg(Bjl.SUBID.SUB_S_GAME_START, new UHandler(this.onGameStart, this));
        this.regesterMsg(Bjl.SUBID.SUB_S_START_PLACE_JETTON, new UHandler(this.onStartPlaceJetton, this)); // 开始下注
        this.regesterMsg(Bjl.SUBID.SUB_S_JETTON_BROADCAST, new UHandler(this.onJettonBroadcast, this));  // 开始下注top 10 palyer jetton broadcast in 0.5s gap
        this.regesterMsg(Bjl.SUBID.SUB_S_PLACE_JETTON, new UHandler(this.onPlaceJetton, this));  // 用户下注
        this.regesterMsg(Bjl.SUBID.SUB_S_PLACE_JET_FAIL, new UHandler(this.onPlaceJettonFail, this));  // 用户下注失败
        this.regesterMsg(Bjl.SUBID.SUB_S_GAME_END, new UHandler(this.onGameEndM, this)); // 当局游戏结束
        // this.regesterMsg(Bjl.SUBID.SUB_S_SEND_RECORD, new UHandler(this.onSendRecord, this));   // 游戏记录
        this.regesterMsg(Bjl.SUBID.SUB_S_QUERY_PLAYLIST, new UHandler(this.onQueryPlaylist, this));   // 获取玩家在线列表
        this.regesterMsg(Bjl.SUBID.SUB_S_SHUFFLE_CARDS, new UHandler(this.onShuffleCards, this));   // 洗牌
        this.regesterMsg(Bjl.SUBID.SUB_S_OPEN_CARD, new UHandler(this.onOpenCard, this));  // 开牌消息
        this.regesterMsg(Bjl.SUBID.CS_GAMESCENE_STATUS_FREE, new UHandler(this.onGameSceneStatusFree, this));
        this.regesterMsg(Bjl.SUBID.CS_GAMESCENE_STATUS_JETTON, new UHandler(this.onGameSceneStatusJetton, this));  // 开始下注场景消息
        this.regesterMsg(Bjl.SUBID.CS_GAMESCENE_STATUS_OPEN, new UHandler(this.onGameSceneStatusOpen, this));  // 开牌场景消息
        this.regesterMsg(Bjl.SUBID.CS_GAMESCENE_STATUS_END, new UHandler(this.onGameSceneStatusEnd, this));  // 游戏结束场景消息

    }


    /**注册百人百家乐网络消息事件 */
    regesterMsg(subId: number, handler: UHandler) {
        UMsgCenter.ins.regester(EGameType.BJL,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId,
            handler);
    }

    unregester(subId: number, handler: UHandler) {
        UMsgCenter.ins.unregester(EGameType.BJL,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId,
            handler);
    }


    /** 发送网络消息*/
    sendMsg(subId: number, data: any, handler: UHandler = null, unlock: boolean = false) {
        UMsgCenter.ins.sendPkg(EGameType.BJL,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId, data, handler, unlock);
    }



    run() {
        super.run();
        this._lefting = false;
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.onRoomInfo, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.onLeftGame, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.user_status_notify, this);

        AppGame.ins.appStatus.on(AppStatus.RECONNECT_IN_GAME_BUT_NO_IN_GAMING, this.onGameReconnect, this);
        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        // AppGame.ins.roomModel.on(MRoomModel.SC_ENTER_ROOM_FAIL, this.onEnterRoomFail, this);
        // EventManager.getInstance().addEventListener(cfg_event.CLOSE_CHARGE, this.onCloseCharge, this);
    }



    exit() {
        super.exit();

        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.onRoomInfo, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.onLeftGame, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, this.user_status_notify, this);

        AppGame.ins.appStatus.off(AppStatus.RECONNECT_IN_GAME_BUT_NO_IN_GAMING, this.onGameReconnect, this);
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
        this.unregester(Bjl.SUBID.SUB_S_GAME_START, new UHandler(this.onGameStart, this)); // 游戏开始
        this.unregester(Bjl.SUBID.SUB_S_SYNC_TIME, new UHandler(this.onSyncTime, this));
        // EventManager.getInstance().removeEventListener(cfg_event.CLOSE_CHARGE, this.onCloseCharge, this);
        // AppGame.ins.roomModel.off(MRoomModel.SC_ENTER_ROOM_FAIL, this.onEnterRoomFail, this);
        this.unregester(Bjl.SUBID.SUB_S_START_PLACE_JETTON, new UHandler(this.onStartPlaceJetton, this)); // 开始下注
        this.unregester(Bjl.SUBID.SUB_S_JETTON_BROADCAST, new UHandler(this.onJettonBroadcast, this));  // 开始下注
        this.unregester(Bjl.SUBID.SUB_S_PLACE_JETTON, new UHandler(this.onPlaceJetton, this));  // 用户下注
        this.unregester(Bjl.SUBID.SUB_S_PLACE_JET_FAIL, new UHandler(this.onPlaceJettonFail, this));  // 用户下注失败
        this.unregester(Bjl.SUBID.SUB_S_GAME_END, new UHandler(this.onGameEndM, this)); // 当局游戏结束
        // this.unregester(Bjl.SUBID.SUB_S_SEND_RECORD, new UHandler(this.onSendRecord, this));   // 游戏记录
        this.unregester(Bjl.SUBID.SUB_S_QUERY_PLAYLIST, new UHandler(this.onQueryPlaylist, this));   // 获取玩家在线列表
        // this.unregester(Bjl.SUBID.SUB_S_NOTIFYOPENTIME, new UHandler(this.onNotifyOpenTime, this));   // 通知客户端开奖时间 
        this.unregester(Bjl.SUBID.SUB_S_SHUFFLE_CARDS, new UHandler(this.onShuffleCards, this));   // 洗牌
        this.unregester(Bjl.SUBID.SUB_S_OPEN_CARD, new UHandler(this.onOpenCard, this));  // 开牌消息
        this.unregester(Bjl.SUBID.CS_GAMESCENE_STATUS_FREE, new UHandler(this.onGameSceneStatusFree, this)); // 空闲场景
        this.unregester(Bjl.SUBID.CS_GAMESCENE_STATUS_JETTON, new UHandler(this.onGameSceneStatusJetton, this));  // 开始下注场景消息
        this.unregester(Bjl.SUBID.CS_GAMESCENE_STATUS_OPEN, new UHandler(this.onGameSceneStatusOpen, this));  // 开牌场景消息
        this.unregester(Bjl.SUBID.CS_GAMESCENE_STATUS_END, new UHandler(this.onGameSceneStatusEnd, this));  // 游戏结束场景消息

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
        AppGame.ins.gamebaseModel.requestLeft(gameid, roomid, AppGame.ins.roleModel.useId, ELeftType.LeftGame);
    }

    /**
     * 同步系统时间
     */
    sendSyncTime() {
        this.sendMsg(Bjl.SUBID.SUB_C_SYNC_TIME, null);
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
            this.sendMsg(Bjl.SUBID.SUB_C_PLACE_JETTON, data);
        }
    }

    /**
     * 请求在线玩家列表
     */
    sendPlayerList() {
        var data = {
            nLimitCount: 20,
            nBeginIndex: 1,
        }
        this.sendMsg(Bjl.SUBID.SUB_C_QUERY_PLAYERLIST, data);
    }

    /**
     * 请求同步分值
     */
    sendSyncDesk() {
        this.sendMsg(Bjl.SUBID.SUB_C_SYNC_DESK, null);
    }


    /***************************************event *****************/

    onSyncTime(data: Bjl.CMD_S_SyncTime_Res) {
        UDebug.Log(data);
        this.emit(MBrbjl.S_SYNC_TIME, data);
    }


    /**
     * 游戏空闲 (弃用)
     * @param data 
     */
    onGameFree(data: any) {
        UDebug.Log('onGameFree' + data);
        this._isShowFlag = false;
        this._game_status = GAME_STATUS.BJL_GAME_END;
        this.emit(MBrbjl.S_GAME_FREE);
    }

    /**
     * 游戏开始
     * @param data 
     */
    onGameStart(data: Bjl.CMD_S_GameStart) {
        if(!this._canHandleMsg) return;
        UDebug.Log('onGameStart' + data);
        this._isShowFlag = false;
        // this.updateBanker(data.deskData);
        this._game_status = GAME_STATUS.BJL_GAME_START;
        this.emit(MBrbjl.S_GAME_START, data);
        if (data.deskData.hasOwnProperty("gameOpenRecord")) {
            this._game_record.record = data.deskData.gameOpenRecord.record;
            this._game_record.maxJettonScore = data.deskData.gameOpenRecord.maxJettonScore;
            this._game_record.xianCount = data.deskData.gameOpenRecord.xianCount;
            this._game_record.zhuangCount = data.deskData.gameOpenRecord.zhuangCount;
            this._game_record.heCount = data.deskData.gameOpenRecord.heCount;
            this._maxJettonScore = data.deskData.gameOpenRecord.maxJettonScore;
            this.emit(MBrbjl.S_SEND_RECORD, data.deskData.gameOpenRecord);
        }
    }

    // 开始下注
    onStartPlaceJetton(data: Bjl.CMD_S_StartPlaceJetton) {
        if(!this._canHandleMsg) return;
        this._leave_time = data.timeLeave;
        this._game_status = GAME_STATUS.BJL_GAME_BET;
        this._isShowFlag = false;
        // this._desk_info = data.deskData;
        // this.updateBanker(data.deskData);
        this.emit(MBrbjl.S_START_PLACE_JETTON, data);
        // if (data.deskData.hasOwnProperty("gameOpenRecord")) {
        //     this._game_record.record = data.deskData.gameOpenRecord.record;
        //     this._game_record.maxJettonScore = data.deskData.gameOpenRecord.maxJettonScore;
        //     this._game_record.xianCount = data.deskData.gameOpenRecord.xianCount;
        //     this._game_record.zhuangCount = data.deskData.gameOpenRecord.zhuangCount;
        //     this._game_record.heCount = data.deskData.gameOpenRecord.heCount;
        //     this._maxJettonScore = data.deskData.gameOpenRecord.maxJettonScore;
        //     this.emit(MBrbjl.S_SEND_RECORD, data.deskData.gameOpenRecord);
        // }
    }

    /**
     * 游戏结算 (停止下注)
     * @param data 
     */
    onGameEndM(data: Bjl.CMD_S_GameEnd) {
        if(!this._canHandleMsg) return;
        if (data.deskData.hasOwnProperty("gameOpenRecord")) {
            this._game_record.record = data.deskData.gameOpenRecord.record;
            this._game_record.maxJettonScore = data.deskData.gameOpenRecord.maxJettonScore;
            this._game_record.xianCount = data.deskData.gameOpenRecord.xianCount;
            this._game_record.zhuangCount = data.deskData.gameOpenRecord.zhuangCount;
            this._game_record.heCount = data.deskData.gameOpenRecord.heCount;
            this._maxJettonScore = data.deskData.gameOpenRecord.maxJettonScore;
            this.emit(MBrbjl.S_SEND_RECORD, data.deskData.gameOpenRecord);
        }
        if (data.timeLeave > MBrbjl.FREE_TIME) {
            this._game_status = GAME_STATUS.BJL_GAME_END;
            this._leave_time = data.timeLeave - MBrbjl.FREE_TIME;
        } else {
            this._leave_time = data.timeLeave;
            this._game_status = GAME_STATUS.BJL_GAME_FREE;
        }

        if (data.winArea == Bjl.JET_AREA.XIAN_AREA) { 
            this._game_record.xianCount += 1;
        } else if (data.winArea == Bjl.JET_AREA.ZHUANG_AREA) {
            this._game_record.zhuangCount += 1;
        } else if (data.winArea == Bjl.JET_AREA.HE_AREA) {
            this._game_record.heCount += 1;
        }
        this._game_record.record.push(data.lastRecord);
        this._desk_info = data.deskData;
        this.emit(MBrbjl.S_GAME_END, data);
    }

    // 游戏开牌
    onOpenCard(data: Bjl.CMD_S_OpenCard, isPlayAni = true) {
        if(!this._canHandleMsg) return;
        this._game_status = GAME_STATUS.BJL_GAME_OPEN;
        this.emit(MBrbjl.S_GAME_OPEN_CARD, data, isPlayAni);

    }

    onGameSceneStatusFree(data: Bjl.CMD_Scene_StatusFree) {
        this._canHandleMsg = true;
        this._desk_info = data.deskData;
        this._leave_time = data.timeLeave;
        this._game_status = GAME_STATUS.BJL_GAME_SCENE_FREE;
        if (data.deskData.hasOwnProperty("gameOpenRecord")) {
            this._game_record.record = data.deskData.gameOpenRecord.record;
            this._game_record.maxJettonScore = data.deskData.gameOpenRecord.maxJettonScore;
            this._game_record.xianCount = data.deskData.gameOpenRecord.xianCount;
            this._game_record.zhuangCount = data.deskData.gameOpenRecord.zhuangCount;
            this._game_record.heCount = data.deskData.gameOpenRecord.heCount;
            this.emit(MBrbjl.S_SEND_RECORD, data.deskData.gameOpenRecord);
        }
        this.emit(MBrbjl.S_GAME_FREE_SCENE, data);
    }

    // 游戏开始下注场景消息
    onGameSceneStatusJetton(data: Bjl.CMD_Scene_StatusJetton) {
        this._canHandleMsg = true;
        this._leave_time = data.timeLeave;
        this._desk_info = data.deskData;
        this._game_status = GAME_STATUS.BJL_GAME_BET;
        if (data.deskData.hasOwnProperty("gameOpenRecord")) {
            this._game_record.record = data.deskData.gameOpenRecord.record;
            this._game_record.maxJettonScore = data.deskData.gameOpenRecord.maxJettonScore;
            this._game_record.xianCount = data.deskData.gameOpenRecord.xianCount;
            this._game_record.zhuangCount = data.deskData.gameOpenRecord.zhuangCount;
            this._game_record.heCount = data.deskData.gameOpenRecord.heCount;
            this.emit(MBrbjl.S_SEND_RECORD, data.deskData.gameOpenRecord);
        }
        this.emit(MBrbjl.S_GAME_START_JETTON_SCENE, data);
    }

    // 开牌场景消息
    onGameSceneStatusOpen(data: Bjl.CMD_Scene_StatusOpen) {
        this._canHandleMsg = true;
        this._leave_time = data.timeLeave;
        this._game_status = GAME_STATUS.BJL_GAME_OPEN;
        if (data.deskData.hasOwnProperty("gameOpenRecord")) {
            this._game_record.record = data.deskData.gameOpenRecord.record;
            this._game_record.maxJettonScore = data.deskData.gameOpenRecord.maxJettonScore;
            this._game_record.xianCount = data.deskData.gameOpenRecord.xianCount;
            this._game_record.zhuangCount = data.deskData.gameOpenRecord.zhuangCount;
            this._game_record.heCount = data.deskData.gameOpenRecord.heCount;
            this.emit(MBrbjl.S_SEND_RECORD, data.deskData.gameOpenRecord);
        }
        this._desk_info = data.deskData;
        this.emit(MBrbjl.S_GAME_OPEN_SCENE, data);

        if(data.deskData.hasOwnProperty('cards')) {
           this._open_cards.cards = data.deskData.cards;
           this._open_cards.roundId = data.roundId;
           this._open_cards.timeLeave = data.timeLeave;
            this.onOpenCard(this._open_cards, false);
        }

    }

    // 游戏结束场景消息
    onGameSceneStatusEnd(data: Bjl.CMD_Scene_StatusEnd) {
        this._canHandleMsg = true;
        this._desk_info = data.deskData;
        if (data.deskData.hasOwnProperty("gameOpenRecord")) {
            this._game_record.record = data.deskData.gameOpenRecord.record;
            this._game_record.maxJettonScore = data.deskData.gameOpenRecord.maxJettonScore;
            this._game_record.xianCount = data.deskData.gameOpenRecord.xianCount;
            this._game_record.zhuangCount = data.deskData.gameOpenRecord.zhuangCount;
            this._game_record.heCount = data.deskData.gameOpenRecord.heCount;
            this.emit(MBrbjl.S_SEND_RECORD, data.deskData.gameOpenRecord);
        }
        this.emit(MBrbjl.S_GAME_END_SCENE, data);
    }


    /**
     * 用户下注推送 （所有用户下注的推送）
     * @param data 
     */
    onPlaceJetton(data: Bjl.CMD_S_PlaceJetSuccess) {
        // UDebug.Log('onPlaceJetton' + data);
        if(!this._canHandleMsg) return;
        this._desk_info.selfJettonScore = data.selfJettonScore;
        this._desk_info.allJettonScore = data.allJettonScore;
        let a = new Bjl.PlaceJetInfo();
        a.jettonArea = data.jettonArea;
        a.jettonCount = 1;
        a.jettonType = data.jettonScore;
        this._desk_info.jetInfo.push(a);

        this.emit(MBrbjl.S_PLACE_JETTON, data);
    }


    onPlaceJettonFail(data: Bjl.CMD_S_PlaceJettonFail) {
        this.emit(MBrbjl.S_PLACE_JET_FAIL, data);
    }

    /**
     * 游戏开奖记录
     * @param data 
     */
    // onSendRecord(data: Bjl.CMD_S_GameRecord) {
    //     UDebug.Log('onSendRecord' + data);
    //     // let data2 = JSON.parse(`{"record":[{"playerTwoPair":true,"bankerTwoPair":true,"playerCount":7,"bankerCount":4,"playerCardCount":2,"bankerCardCount":3,"winArea":2},{"playerTwoPair":false,"bankerTwoPair":false,"playerCount":5,"bankerCount":8,"playerCardCount":2,"bankerCardCount":2,"winArea":3},{"playerTwoPair":false,"bankerTwoPair":false,"playerCount":1,"bankerCount":3,"playerCardCount":3,"bankerCardCount":3,"winArea":3},{"playerTwoPair":false,"bankerTwoPair":true,"playerCount":3,"bankerCount":6,"playerCardCount":3,"bankerCardCount":3,"winArea":3},{"playerTwoPair":true,"bankerTwoPair":false,"playerCount":6,"bankerCount":3,"playerCardCount":2,"bankerCardCount":3,"winArea":2},{"playerTwoPair":false,"bankerTwoPair":false,"playerCount":9,"bankerCount":8,"playerCardCount":3,"bankerCardCount":3,"winArea":2},{"playerTwoPair":false,"bankerTwoPair":false,"playerCount":7,"bankerCount":7,"playerCardCount":2,"bankerCardCount":3,"winArea":4},{"playerTwoPair":true,"bankerTwoPair":true,"playerCount":2,"bankerCount":6,"playerCardCount":3,"bankerCardCount":3,"winArea":3},{"playerTwoPair":false,"bankerTwoPair":false,"playerCount":5,"bankerCount":8,"playerCardCount":3,"bankerCardCount":3,"winArea":3},{"playerTwoPair":false,"bankerTwoPair":false,"playerCount":1,"bankerCount":2,"playerCardCount":3,"bankerCardCount":3,"winArea":3},{"playerTwoPair":false,"bankerTwoPair":false,"playerCount":6,"bankerCount":5,"playerCardCount":3,"bankerCardCount":2,"winArea":2},{"playerTwoPair":true,"bankerTwoPair":true,"playerCount":1,"bankerCount":7,"playerCardCount":3,"bankerCardCount":3,"winArea":3},{"playerTwoPair":false,"bankerTwoPair":false,"playerCount":3,"bankerCount":9,"playerCardCount":2,"bankerCardCount":2,"winArea":3},{"playerTwoPair":false,"bankerTwoPair":false,"playerCount":6,"bankerCount":7,"playerCardCount":2,"bankerCardCount":2,"winArea":3},{"playerTwoPair":false,"bankerTwoPair":false,"playerCount":1,"bankerCount":6,"playerCardCount":3,"bankerCardCount":2,"winArea":3},{"playerTwoPair":true,"bankerTwoPair":false,"playerCount":4,"bankerCount":7,"playerCardCount":3,"bankerCardCount":2,"winArea":3},{"playerTwoPair":false,"bankerTwoPair":false,"playerCount":0,"bankerCount":7,"playerCardCount":3,"bankerCardCount":2,"winArea":3},{"playerTwoPair":false,"bankerTwoPair":false,"playerCount":8,"bankerCount":0,"playerCardCount":2,"bankerCardCount":2,"winArea":2},{"playerTwoPair":false,"bankerTwoPair":false,"playerCount":3,"bankerCount":4,"playerCardCount":3,"bankerCardCount":2,"winArea":3},{"playerTwoPair":false,"bankerTwoPair":true,"playerCount":9,"bankerCount":9,"playerCardCount":2,"bankerCardCount":2,"winArea":4},{"playerTwoPair":false,"bankerTwoPair":false,"playerCount":9,"bankerCount":7,"playerCardCount":2,"bankerCardCount":2,"winArea":2},{"playerTwoPair":true,"bankerTwoPair":true,"playerCount":2,"bankerCount":2,"playerCardCount":3,"bankerCardCount":3,"winArea":4},{"playerTwoPair":false,"bankerTwoPair":false,"playerCount":6,"bankerCount":0,"playerCardCount":3,"bankerCardCount":3,"winArea":2},{"playerTwoPair":false,"bankerTwoPair":false,"playerCount":7,"bankerCount":7,"playerCardCount":2,"bankerCardCount":2,"winArea":4},{"playerTwoPair":false,"bankerTwoPair":false,"playerCount":5,"bankerCount":8,"playerCardCount":2,"bankerCardCount":2,"winArea":3},{"playerTwoPair":false,"bankerTwoPair":false,"playerCount":2,"bankerCount":6,"playerCardCount":3,"bankerCardCount":2,"winArea":3}],"xianCount":7,"zhuangCount":15,"heCount":4}`)
    //     this._game_record = data;
    //     this._maxJettonScore = data.maxJettonScore;
    //     this.emit(MBrbjl.S_SEND_RECORD, data);
    // }

    onQueryPlaylist(data: any) {
        UDebug.Log('在线 列表   onQueryPlaylist' + data);
    }

    // 洗牌监听
    onShuffleCards(data: Bjl.CMD_S_ShuffleCards) {
        this.emit(MBrbjl.S_SHUFFLE_CARDS, data);
    }


    onJettonBroadcast(data: any) {

        this.emit(MBrbjl.S_JETTON_BROADCAST, data);
    }


    /*****************************************************************
     *  
     **************************************************************************/

    onRoomInfo(data: any) {
        UDebug.log("玩家进入房间" + JSON.stringify(data));
        var element: RoomPlayerInfo = data
        this._battleplayer[element.userId] = element

    }

    /**玩家状态 */
    private user_status_notify(userid: number, usstatus: number) { //data: GameServer.MSG_S2C_GameUserStatus
        //UDebug.Log("更新玩家状态------------------------" + userid + "   " + usstatus);

        var userId = userid;
        var usStatus = usstatus;
        if (usStatus == null || usStatus == 0) {
            if (this._battleplayer && this._battleplayer[userId]) {
                this._battleplayer[userId].userStatus = 0;
                if (userId != AppGame.ins.roleModel.useId) {
                }
            }
        }
    }

    onLeftGame(data: GameServer.MSG_C2S_UserLeftMessageResponse) {
        UDebug.Log(data);
        if (data.retCode == 0) {
            if (!this._lefting) {
                this._lefting = true;
                // EventManager.getInstance().raiseEvent(cfg_event.CLOSE_CHARGE);
                // AppGame.ins.checkEnterMinScore(AppGame.ins.game_watch_limit_score + 1);
                AppGame.ins.loadLevel(ELevelType.Hall, EGameType.BJL);
            }
        } else {
            AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
        }

        this.emit(MBrbjl.S_LEFT_ROOM, data);
    }
    /**请求刷新场景消息 */
    sendFreshGameScene() {
        this.sendMsg(Bjl.SUBID.CS_GAMESCENE_FRESH, {});
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
        } else {
            this._canHandleMsg = false;
        }
    }

    onEnterRoomFail(data: any): any {

        if (data == 13) {
            AppGame.ins.roomModel.requestMatch();
            return;
        }

        let str = cfg_error.enter_game[data] || '进入游戏失败';
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: 1, data: str, handler: UHandler.create((() => {

                AppGame.ins.loadLevel(ELevelType.Hall, EGameType.BJL);
            }))
        });
    }

    private onCloseCharge(): void {
        // AppGame.ins.checkEnterMinScore(AppGame.ins.roleModel.score);
    }
}
