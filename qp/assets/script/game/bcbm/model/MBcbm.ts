import Model from "../../../common/base/Model";
import { EGameType, ELeftType, ELevelType } from "../../../common/base/UAllenum";
import { Bcbm, Game, GameServer } from "../../../common/cmd/proto";
import UMsgCenter from "../../../common/net/UMsgCenter";
import UDebug from "../../../common/utility/UDebug";
import UHandler from "../../../common/utility/UHandler";
import ULanHelper from "../../../common/utility/ULanHelper";
import AppGame from "../../../public/base/AppGame";
import AppStatus from "../../../public/base/AppStatus";
import MBaseGameModel from "../../../public/hall/MBaseGameModel";
import { RoomPlayerInfo } from "../../../public/hall/URoomClass";
import { GAME_STATUS } from "../cfg_bcbm"

const { ccclass, property } = cc._decorator;

const SEAT_COUNT = 6;   // 座位数量，0神算子 ， 12345 富豪榜
const MAX_RECORD = 7;

@ccclass
export default class MBcbm extends Model {

    static S_GAME_START = "S_GAME_START";
    static S_GAME_END = "S_GAME_END";
    static S_START_PLACE_JETTON = "S_START_PLACE_JETTON";
    static S_PLACE_JETTON = "S_PLACE_JETTON";
    static S_PLACE_JET_FAIL = "S_PLACE_JET_FAIL";
    static S_SEND_RECORD = "S_SEND_RECORD";
    static S_QUERY_PLAYLIST = "S_QUERY_PLAYLIST";
    static S_SYNC_TIME = "S_SYNC_TIME";
    static TO_BACK_CLEAR = "To_Back_Clear";
    static TO_BACK_CLEAR_AFTER = 'TO_BACK_CLEAR_AFTER';               //
    static S_LEFT_ROOM = 'S_LEFT_ROOM';   // 离开游戏
    static FREE_TIME = 2;
    static INSERT_RECORD = "INSERT_RECORD";

    static GAMESCENE_STATUS_FREE = 'GAMESCENE_STATUS_FREE';
    static GAMESCENE_STATUS_JETTON = 'GAMESCENE_STATUS_JETTON';
    static GAMESCENE_STATUS_OPEN = 'GAMESCENE_STATUS_OPEN';
    static GAMESCENE_STATUS_END = 'GAMESCENE_STATUS_END';
    static OPEN_CARD = 'OPEN_CARD';

    _leave_time: number = 0;        // 当前状态剩余时间
    _game_record: Bcbm.IGameOpenRecord = new Bcbm.GameOpenRecord();   // 游戏记录
    _game_status: GAME_STATUS = GAME_STATUS.BCBM_GAME_FREE;   //
    _desk_info: Bcbm.IGameDeskInfo = new Bcbm.GameDeskInfo();
    _userMaxScore: number = 0;
    _userScore: number = 0;
    private _lefting: boolean = false;
    private _isBack: boolean = false;//当前是否在后台
    private _curBlinkNodePos = 0;

    private _canHandleMsg: boolean = true;    //能否处理消息

    init(): void {
        this.regesterMsg(Bcbm.SUBID.SUB_S_GAME_START, new UHandler(this.onGameStart, this));
        this.regesterMsg(Bcbm.SUBID.SUB_S_GAME_END, new UHandler(this.onGameEnd, this));
        this.regesterMsg(Bcbm.SUBID.SUB_S_START_PLACE_JETTON, new UHandler(this.onStartPlaceJetton, this));
        this.regesterMsg(Bcbm.SUBID.SUB_S_PLACE_JETTON, new UHandler(this.onPlaceJetton, this));
        this.regesterMsg(Bcbm.SUBID.SUB_S_PLACE_JET_FAIL, new UHandler(this.onPlaceJettonFail, this));
        this.regesterMsg(Bcbm.SUBID.SUB_S_QUERY_PLAYLIST, new UHandler(this.onQueryPlaylist, this));
        this.regesterMsg(Bcbm.SUBID.SUB_S_SYNC_TIME, new UHandler(this.onSyncTime, this));

        this.regesterMsg(Bcbm.SUBID.CS_GAMESCENE_STATUS_FREE, new UHandler(this.onGameSceneStatusFree, this));
        this.regesterMsg(Bcbm.SUBID.CS_GAMESCENE_STATUS_JETTON, new UHandler(this.onGameSceneStatusJetton, this));
        this.regesterMsg(Bcbm.SUBID.CS_GAMESCENE_STATUS_OPEN, new UHandler(this.onGameSceneStatusOpen, this));
        this.regesterMsg(Bcbm.SUBID.CS_GAMESCENE_STATUS_END, new UHandler(this.onGameSceneStatusEnd, this));
        this.regesterMsg(Bcbm.SUBID.SUB_S_OPEN_CARD, new UHandler(this.onOpenCard, this));
    }

    /**注册奔驰宝马网络消息事件 */
    regesterMsg(subId: number, handler: UHandler) {
        UMsgCenter.ins.regester(EGameType.BCBM,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId,
            handler);
    }

    unregesterMsg(subId: number, handler: UHandler) {
        UMsgCenter.ins.unregester(EGameType.BCBM,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId,
            handler);
    }

    /** 发送网络消息*/
    sendMsg(subId: number, data: any, handler: UHandler = null, unlock: boolean = false) {
        UMsgCenter.ins.sendPkg(EGameType.BCBM,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId, data, handler, unlock);
    }

    run() {
        super.run();
        this._lefting = false;
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.onRoomInfo, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.onLeftGame, this);
        AppGame.ins.appStatus.on(AppStatus.RECONNECT_IN_GAME_BUT_NO_IN_GAMING, this.onGameReconnect, this);
        AppGame.ins.appStatus.on(AppStatus.GAME_TO_BACK, this.onGameToBack, this);
    }

    exit() {
        super.exit();
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.onRoomInfo, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.onLeftGame, this);
        AppGame.ins.appStatus.off(AppStatus.RECONNECT_IN_GAME_BUT_NO_IN_GAMING, this.onGameReconnect, this);
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);

        this.unregesterMsg(Bcbm.SUBID.SUB_S_GAME_START, new UHandler(this.onGameStart, this));
        this.unregesterMsg(Bcbm.SUBID.SUB_S_GAME_END, new UHandler(this.onGameEnd, this));
        this.unregesterMsg(Bcbm.SUBID.SUB_S_START_PLACE_JETTON, new UHandler(this.onStartPlaceJetton, this));
        this.unregesterMsg(Bcbm.SUBID.SUB_S_PLACE_JETTON, new UHandler(this.onPlaceJetton, this));
        this.unregesterMsg(Bcbm.SUBID.SUB_S_PLACE_JET_FAIL, new UHandler(this.onPlaceJettonFail, this));
        this.unregesterMsg(Bcbm.SUBID.SUB_S_QUERY_PLAYLIST, new UHandler(this.onQueryPlaylist, this));
        this.unregesterMsg(Bcbm.SUBID.SUB_S_SYNC_TIME, new UHandler(this.onSyncTime, this));

        this.unregesterMsg(Bcbm.SUBID.CS_GAMESCENE_STATUS_FREE, new UHandler(this.onGameSceneStatusFree, this));
        this.unregesterMsg(Bcbm.SUBID.CS_GAMESCENE_STATUS_JETTON, new UHandler(this.onGameSceneStatusJetton, this));
        this.unregesterMsg(Bcbm.SUBID.CS_GAMESCENE_STATUS_OPEN, new UHandler(this.onGameSceneStatusOpen, this));
        this.unregesterMsg(Bcbm.SUBID.CS_GAMESCENE_STATUS_END, new UHandler(this.onGameSceneStatusEnd, this));
        this.unregesterMsg(Bcbm.SUBID.SUB_S_OPEN_CARD, new UHandler(this.onOpenCard, this));
    }


    resetData(): void {
        this._leave_time = 0;
        delete this._game_record;
        this._game_record = null;
        this._game_record = new Bcbm.GameOpenRecord();
        delete this._desk_info;
        this._desk_info = null;
        this._desk_info = new Bcbm.GameDeskInfo();
    }

    update(dt: number) {

    }

    // LIFE-CYCLE CALLBACKS:
    // onLoad () {}
    start() {

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

    /*发送网络消息......................... start .......................................*/
    /**
     * 下注
     * @param jettonArea  下注区域
     * @param jettonScore  下注分数
     */
    sendBet(jettonArea: number, jettonScore: number) {
        var data = {
            jettonArea: jettonArea,
            jettonScore: jettonScore,
        }
        this.sendMsg(Bcbm.SUBID.SUB_C_PLACE_JETTON, data);
    }

    /**
     * 续投
     * @param jettonArea  下注区域
     */
    sendReJetton(userId: NumberConstructor) {
        var data = {
            userId: userId,
        }
        // this.sendMsg(Bcbm.SUBID.SUB_C_REJETTON, data);
    }

    /**
     * @param beginIndex //起始下标 从0开始
     * @param limitCount //获取数量
     */
    sendPlayerList(beginIndex: number, limitCount: number) {
        var data = {
            beginIndex: beginIndex,
            limitCount: limitCount,
        }
        this.sendMsg(Bcbm.SUBID.SUB_C_QUERY_PLAYERLIST, data);
    }

    onCloseCharge(msgName: any) {
    }

    /**
     * 发送离开游戏
     * @param gameid 游戏id
     * @param roomid 房间id
     */
    sendLeftGame(gameid: number, roomid: number) {
        AppGame.ins.gamebaseModel.requestLeft(gameid, roomid, AppGame.ins.roleModel.useId, ELeftType.ReturnToRoom);
    }

    /**
     * 同步系统时间
     */
    sendSyncTime() {
        if (this._isBack) return;
        this.sendMsg(Bcbm.SUBID.SUB_C_SYNC_TIME, null);
    }
    /*发送网络消息......................... end .......................................*/


    /*网络消息回调  游戏内......................... start .......................................*/

    /**游戏空闲状态 */
    onGameSceneStatusFree(data: Bcbm.CMD_Scene_StatusFree) {
        UDebug.log('游戏场景状态-空闲 ' + data);
        this._canHandleMsg = true;
        this.emit(MBcbm.GAMESCENE_STATUS_FREE, data);
        
        if (data.deskData.gameOpenRecord) {
            this.onSendRecord(data.deskData.gameOpenRecord);
        }
    }

    /**游戏下注状态 */
    onGameSceneStatusJetton(data: Bcbm.CMD_Scene_StatusJetton) {
        UDebug.log('游戏场景状态-下注 ' + data);
        this._canHandleMsg = true;
        this.emit(MBcbm.GAMESCENE_STATUS_JETTON, data);

        if (data.deskData.gameOpenRecord) {
            this.onSendRecord(data.deskData.gameOpenRecord);
        }
        this.onStartPlaceJetton(data);
    }

    /**游戏开牌状态 */
    onGameSceneStatusOpen(data: Bcbm.CMD_Scene_StatusOpen) {
        UDebug.log('游戏场景状态-开牌 ' + data);
        this._canHandleMsg = true;
        this.emit(MBcbm.GAMESCENE_STATUS_OPEN, data);

        if (data.deskData.gameOpenRecord) {
            this.onSendRecord(data.deskData.gameOpenRecord);
        }
    }

    /**游戏结束状态 */
    onGameSceneStatusEnd(data: Bcbm.CMD_Scene_StatusEnd) {
        UDebug.log('游戏场景状态-结束 ' + data);
        this._canHandleMsg = true;
        this.emit(MBcbm.GAMESCENE_STATUS_END, data);

        if (data.deskData.gameOpenRecord) {
            this.onSendRecord(data.deskData.gameOpenRecord);
        }
    }

    /**开牌 */
    onOpenCard(data: Bcbm.CMD_S_OpenCard) {
        if (!this._canHandleMsg) return;
        UDebug.log('开牌 ');
        this.emit(MBcbm.OPEN_CARD, data);
    }

    onGameStart(data: Bcbm.CMD_S_GameStart) {
        if (!this._canHandleMsg) return;
        UDebug.log('MBcbm:onGameStart' + data);
        this._game_status = GAME_STATUS.BCBM_GAME_START;
        this.emit(MBcbm.S_GAME_START, data);
        if (data.deskData.gameOpenRecord) {
            this.onSendRecord(data.deskData.gameOpenRecord);
        }
    }

    onGameEnd(data: Bcbm.CMD_S_GameEnd) {
        if (!this._canHandleMsg) return;
        UDebug.log('MBcbm:onGameEnd---------------------------------------------' + data, data.timeLeave);
        if (data.deskData.gameOpenRecord) {
            this.onSendRecord(data.deskData.gameOpenRecord);
        }
        this._game_status = GAME_STATUS.BCBM_GAME_END;
        this._game_record.record.push(data.deskData.winTag);
        while (this._game_record.record.length > MAX_RECORD) {
            this._game_record.record.shift();
        }
        this._desk_info = data.deskData;
        this.emit(MBcbm.S_GAME_END, data);
    }

    onStartPlaceJetton(data: Bcbm.CMD_S_StartPlaceJetton) {
        if (!this._canHandleMsg) return;
        if (data.deskData.gameOpenRecord) {
            this.onSendRecord(data.deskData.gameOpenRecord);
        }
        this._leave_time = data.timeLeave;
        this._game_status = GAME_STATUS.BCBM_GAME_BET;
        this._desk_info = data.deskData;
        this.emit(MBcbm.S_START_PLACE_JETTON, data);
    }

    onPlaceJetton(data: Bcbm.CMD_S_PlaceJetSuccess) {
        if (!this._canHandleMsg) return;
        this._desk_info.selfJettonScore = data.selfJettonScore;
        this._desk_info.allJettonScore = data.allJettonScore;
        let a = new Bcbm.PlaceJetInfo();
        a.jettonArea = data.jettonArea;
        a.jettonCount = 1;
        a.jettonType = data.jettonScore;
        this._desk_info.jetInfo.push(a);
        this.emit(MBcbm.S_PLACE_JETTON, data);
    }

    onPlaceJettonFail(data: Bcbm.CMD_S_PlaceJettonFail) {
        if (!this._canHandleMsg) return;
        UDebug.log('MBcbm:onPlaceJettonFail' + data);
        this.emit(MBcbm.S_PLACE_JET_FAIL, data);
    }

    /**
     * 游戏开奖记录
     * @param data 
     */
    onSendRecord(data: Bcbm.IGameOpenRecord) {
        if (!this._canHandleMsg) return;
        UDebug.log('MBcbm:onSendRecord' + data);
        this._game_record = data;
        while (this._game_record.record.length > MAX_RECORD) {
            this._game_record.record.shift();
        }
        this.emit(MBcbm.S_SEND_RECORD, data);
    }

    onQueryPlaylist(data: Bcbm.CMD_S_PlayerList) {
        if (!this._canHandleMsg) return;
        UDebug.log('MBcbm:onQueryPlaylist' + data);
        this.emit(MBcbm.S_QUERY_PLAYLIST, data);
    }
    onSyncTime(data: Bcbm.CMD_S_SyncTime_Res) {
        UDebug.log('MBcbm:onSyncTime' + data);
        this.emit(MBcbm.S_SYNC_TIME, data);
    }
    /*网络消息回调  游戏内......................... end .......................................*/

    /*网络消息回调  游戏公用......................... start .......................................*/
    onRoomInfo(data: RoomPlayerInfo) {
        UDebug.log('MBcbm:onRoomInfo' + data);
    }
    onLeftGame(data: GameServer.MSG_C2S_UserLeftMessageResponse) {
        if (!this._canHandleMsg) return;
        UDebug.log('MBcbm:onLeftGame' + data);
        if (data.retCode == 0) {
            if (!this._lefting) {
                this._lefting = true;
                AppGame.ins.loadLevel(ELevelType.Hall, EGameType.BCBM);
            }
        } else {
            AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
        }
    }
    onGameReconnect(data: any) {
        if (!this._canHandleMsg) return;
        UDebug.log('MBcbm:onGameReconnect' + data);
        // AppGame.ins.roomModel.requestMatch();
    }
    //前后台切换 true 切到后台，false 切到前台
    onGameToBack(data: boolean) {
        this._isBack = data;
        UDebug.log('MBcbm:onGameToBack _game_status ' + this._game_status);
        if (!data) {
            this.sendMsg(Bcbm.SUBID.CS_GAMESCENE_FRESH, null);
            this.sendSyncTime();  // 同步系统时间
            this.emit(MBcbm.TO_BACK_CLEAR_AFTER);
        } else {
            this.emit(MBcbm.TO_BACK_CLEAR);
            this._canHandleMsg = false;
        }
    }    /*网络消息回调  游戏公用......................... end .......................................*/
}
