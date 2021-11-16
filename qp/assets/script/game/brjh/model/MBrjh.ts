import Model from "../../../common/base/Model";
import UMsgCenter from "../../../common/net/UMsgCenter";
import UHandler from "../../../common/utility/UHandler";
import { EGameType, ELevelType, ECommonUI, ELeftType, ETipType } from "../../../common/base/UAllenum";
import { Game, Brjh, GameServer } from "../../../common/cmd/proto";
import AppGame from "../../../public/base/AppGame";
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
/**
 * 创建： 朱武
 * 作用： 百人牛牛逻辑模块
 */
const { ccclass, property } = cc._decorator;

enum GAME_STATUS {
    BRJH_GAME_START = 1,   // 开始下注
    BRJH_GAME_STOP = 2,       // 停止下注
    BRJH_GAME_FREE = 3,  // 开始开牌
}

export default class MBrjh extends Model {
    static S_SYNC_TIME = 'S_SYNC_TIME';
    static S_GAME_START = 'S_GAME_START';
    static S_SEND_RECORD = 'S_SEND_RECORD';         // 游戏记录
    static S_START_PLACE_JETTON = 'S_START_PLACE_JETTON';  // 开始下注
    static S_GAME_END = 'S_GAME_END';           // 游戏结算
    static S_PLACE_JETTON = 'S_PLACE_JETTON';               // 玩家下注 （所有玩家）
    static S_PLACE_JET_FAIL = 'S_PLACE_JET_FAIL';               // 下注失败
    static S_JETTON_BROADCAST = 'S_JETTON_BROADCAST';               //
    static TO_BACK_CLEAR = 'TO_BACK_CLEAR';               //
    static TO_BACK_CLEAR_AFTER = 'TO_BACK_CLEAR_AFTER';

    static GAMESCENE_STATUS_FREE = 'GAMESCENE_STATUS_FREE';
    static GAMESCENE_STATUS_JETTON = 'GAMESCENE_STATUS_JETTON';
    static GAMESCENE_STATUS_OPEN = 'GAMESCENE_STATUS_OPEN';
    static GAMESCENE_STATUS_END = 'GAMESCENE_STATUS_END';
    static OPEN_CARD = 'OPEN_CARD';

    _game_record: Brjh.GameOpenRecord = new Brjh.GameOpenRecord();   // 游戏记录
    _desk_info: Brjh.GameDeskInfo = new Brjh.GameDeskInfo();
    _game_status: GAME_STATUS = GAME_STATUS.BRJH_GAME_START;
    private _lefting: boolean = false;
    private _isBack: boolean = false;//当前是否在后台

    recordData: any = [];
    private _canHandleMsg: boolean = true;    //能否处理消息

    init() {
        this.regesterMsg(Brjh.SUBID.SUB_S_SYNC_TIME, new UHandler(this.onSyncTime, this));
        this.regesterMsg(Brjh.SUBID.SUB_S_GAME_START, new UHandler(this.onGameStart, this));
        this.regesterMsg(Brjh.SUBID.SUB_S_PLACE_JETTON, new UHandler(this.onPlaceJetton, this));  // 用户下注
        this.regesterMsg(Brjh.SUBID.SUB_S_APPLY_BANKER, new UHandler(this.bankerSucceed, this)); //申请上庄成功
        this.regesterMsg(Brjh.SUBID.SUB_S_APPLY_BANKER_FAIL, new UHandler(this.bankerFail, this)); //申请上庄失败
        this.regesterMsg(Brjh.SUBID.SUB_S_CANCEL_BANKER, new UHandler(this.cancelSucceed, this)); //取消申请上庄成功
        this.regesterMsg(Brjh.SUBID.SUB_S_CANCEL_BANKER_FAIL, new UHandler(this.cancelFail, this)); //取消申请上庄失败
        this.regesterMsg(Brjh.SUBID.SUB_S_GET_OFF_BANKER, new UHandler(this.downBankerSucceed, this)); //申请下庄成功
        this.regesterMsg(Brjh.SUBID.SUB_S_GET_OFF_BANKER_FAIL, new UHandler(this.downBankerFail, this)); //申请下庄失败
        this.regesterMsg(Brjh.SUBID.SUB_S_CHANGE_BANKER, new UHandler(this.changeBanke, this));//切换庄家
        this.regesterMsg(Brjh.SUBID.SUB_S_GAME_END, new UHandler(this.onGameEnd, this));
        this.regesterMsg(Brjh.SUBID.SUB_S_PLACE_JET_FAIL, new UHandler(this.onPlaceJettonFail, this));
        this.regesterMsg(Brjh.SUBID.SUB_S_QUERY_PLAYLIST, new UHandler(this.onQueryPlaylist, this));
        this.regesterMsg(Brjh.SUBID.SUB_S_START_PLACE_JETTON, new UHandler(this.onStartPlaceJetton, this));  // 开始下注
        this.regesterMsg(Brjh.SUBID.SUB_S_JETTON_BROADCAST, new UHandler(this.onJettonBroadcast, this));  //

        this.regesterMsg(Brjh.SUBID.CS_GAMESCENE_STATUS_FREE, new UHandler(this.onGameSceneStatusFree, this));
        this.regesterMsg(Brjh.SUBID.CS_GAMESCENE_STATUS_JETTON, new UHandler(this.onGameSceneStatusJetton, this));
        this.regesterMsg(Brjh.SUBID.CS_GAMESCENE_STATUS_OPEN, new UHandler(this.onGameSceneStatusOpen, this));
        this.regesterMsg(Brjh.SUBID.CS_GAMESCENE_STATUS_END, new UHandler(this.onGameSceneStatusEnd, this));
        this.regesterMsg(Brjh.SUBID.SUB_S_OPEN_CARD, new UHandler(this.onOpenCard, this));
    }

    /**注册百人龙虎网络消息事件 */
    regesterMsg(subId: number, handler: UHandler) {
        UMsgCenter.ins.regester(EGameType.BRJH,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId,
            handler);
    }

    unregesterMsg(subId: number, handler: UHandler) {
        UMsgCenter.ins.unregester(EGameType.BRJH,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId,
            handler);
    }

    /** 发送网络消息*/
    sendMsg(subId: number, data: any, handler: UHandler = null, unlock: boolean = false) {
        UMsgCenter.ins.sendPkg(EGameType.BRJH,
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
        this.resetData();
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.onRoomInfo, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.onLeftGame, this);
        AppGame.ins.appStatus.off(AppStatus.RECONNECT_IN_GAME_BUT_NO_IN_GAMING, this.onGameReconnect, this);
        AppGame.ins.appStatus.off(AppStatus.GAME_TO_BACK, this.onGameToBack, this);

        this.unregesterMsg(Brjh.SUBID.SUB_S_SYNC_TIME, new UHandler(this.onSyncTime, this));
        this.unregesterMsg(Brjh.SUBID.SUB_S_GAME_START, new UHandler(this.onGameStart, this));
        this.unregesterMsg(Brjh.SUBID.SUB_S_PLACE_JETTON, new UHandler(this.onPlaceJetton, this));  // 用户下注
        this.unregesterMsg(Brjh.SUBID.SUB_S_APPLY_BANKER, new UHandler(this.bankerSucceed, this));  //申请上庄成功
        this.unregesterMsg(Brjh.SUBID.SUB_S_APPLY_BANKER_FAIL, new UHandler(this.bankerFail, this)); //申请上庄失败
        this.unregesterMsg(Brjh.SUBID.SUB_S_CANCEL_BANKER, new UHandler(this.cancelSucceed, this)); //取消申请上庄成功
        this.unregesterMsg(Brjh.SUBID.SUB_S_CANCEL_BANKER_FAIL, new UHandler(this.cancelFail, this)); //取消申请上庄失败
        this.unregesterMsg(Brjh.SUBID.SUB_S_GET_OFF_BANKER, new UHandler(this.downBankerSucceed, this)); //申请下庄成功
        this.unregesterMsg(Brjh.SUBID.SUB_S_GET_OFF_BANKER_FAIL, new UHandler(this.downBankerFail, this)); //申请下庄失败
        this.unregesterMsg(Brjh.SUBID.SUB_S_CHANGE_BANKER, new UHandler(this.changeBanke, this));//切换庄家
        this.unregesterMsg(Brjh.SUBID.SUB_S_GAME_END, new UHandler(this.onGameEnd, this));
        this.unregesterMsg(Brjh.SUBID.SUB_S_PLACE_JET_FAIL, new UHandler(this.onPlaceJettonFail, this));
        this.unregesterMsg(Brjh.SUBID.SUB_S_QUERY_PLAYLIST, new UHandler(this.onQueryPlaylist, this));
        this.unregesterMsg(Brjh.SUBID.SUB_S_START_PLACE_JETTON, new UHandler(this.onStartPlaceJetton, this));  // 开始下注
        this.unregesterMsg(Brjh.SUBID.SUB_S_JETTON_BROADCAST, new UHandler(this.onJettonBroadcast, this));  // 

        this.unregesterMsg(Brjh.SUBID.CS_GAMESCENE_STATUS_FREE, new UHandler(this.onGameSceneStatusFree, this));
        this.unregesterMsg(Brjh.SUBID.CS_GAMESCENE_STATUS_JETTON, new UHandler(this.onGameSceneStatusJetton, this));
        this.unregesterMsg(Brjh.SUBID.CS_GAMESCENE_STATUS_OPEN, new UHandler(this.onGameSceneStatusOpen, this));
        this.unregesterMsg(Brjh.SUBID.CS_GAMESCENE_STATUS_END, new UHandler(this.onGameSceneStatusEnd, this));
        this.unregesterMsg(Brjh.SUBID.SUB_S_OPEN_CARD, new UHandler(this.onOpenCard, this));
    }

    resetData() {
        this.recordData = [];
    }

    update(dt: number) { }

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
        this.sendMsg(Brjh.SUBID.SUB_C_SYNC_TIME, null);
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
            this.sendMsg(Brjh.SUBID.SUB_C_PLACE_JETTON, data);
        }
    }

    // 申请上庄
    sendBanker() {
        var data = {
            applyUserId: AppGame.ins.roleModel.useId,
        }
        this.sendMsg(Brjh.SUBID.SUB_C_APPLY_BANKER, data);
    }

    // 申请上庄成功
    bankerSucceed(data: Brjh.CMD_S_ApplyBanker) {
        AppGame.ins.bankerBurrent = data.currentBankerInfo;
        AppGame.ins.bankerApply = data.applyBankerInfo;
        this.judgeBanke(data.currentBankerInfo);
        this.emit(MRole.S_BANKERSUCCEED, data);
        if (CommVillage.ins != null) {
            CommVillage.ins.bankerSucceed();
        }
    }

    // 申请上庄失败
    bankerFail(data: Brjh.CMD_S_ApplyBankerFail) {
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
        this.sendMsg(Brjh.SUBID.SUB_C_CANCEL_BANKER, data);
    }

    // 取消排队成功
    cancelSucceed(data: Brjh.CMD_S_CancelBanker) {
        AppGame.ins.bankerBurrent = data.currentBankerInfo;
        AppGame.ins.bankerApply = data.applyBankerInfo;
        this.judgeBanke(data.currentBankerInfo);
        this.emit(MRole.S_CANCELSUCCEED, data);
        if (CommVillage.ins != null) {
            CommVillage.ins.cancelSucceed();
        }
    }

    // 取消排队失败
    cancelFail(data: Brjh.CMD_S_CancelBankerFail) {
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
        this.sendMsg(Brjh.SUBID.SUB_C_GET_OFF_BANKER, data);
    }

    // 申请下庄成功
    downBankerSucceed(data: Brjh.CMD_CS_GetOffBanker) {
        if (data.bankerUserId == AppGame.ins.roleModel.useId) {
            MRole.bankerBool = false;//庄家是别人
        }
        this.emit(MRole.S_DOWNSUCCEED, data);
        if (CommVillage.ins != null) {
            CommVillage.ins.downBankerSucceed();
        }
    }

    // 申请下庄失败
    downBankerFail(data: Brjh.CMD_S_GetOffBankerFail) {
        AppGame.ins.showTips({ data: data.errMsg, type: ETipType.onlyone });
        this.emit(MRole.S_DOWNERFAILL, data);
        if (CommVillage.ins != null) {
            CommVillage.ins.downBankerFail();
        }
    }

    // 切换庄家
    changeBanke(data: Brjh.CMD_S_ChangeBanker) {
        AppGame.ins.bankerBurrent = data.currentBankerInfo;
        AppGame.ins.bankerApply = data.applyBankerInfo;
        this.judgeBanke(data.currentBankerInfo);//判断自己是否是庄家
        this.emit(MRole.S_CHANGEBANKER, data);// 切换庄家
        if (CommVillage.ins != null) {
            CommVillage.ins.changeBanke();
        }
        AppGame.ins.showTips({ data: data.msg, type: ETipType.onlyone });
    }

    /**
     * 判断自己是否是庄家
     * @param tempCurrent 
     */
    judgeBanke(tempCurrent: Brjh.ICurrentBankerInfo) {
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
    updateBanker(data: Brjh.IGameDeskInfo, isRufView = true) {
        if (isRufView) {
            AppGame.ins.bankerInfo = data.bankerInfo;
            if (data.bankerInfo != null) {
                if (data.bankerInfo.currentBankerInfo != null) {
                    AppGame.ins.bankerBurrent = data.bankerInfo.currentBankerInfo;
                }

                if (data.bankerInfo.applyBankerInfo != null) {
                    AppGame.ins.bankerApply = data.bankerInfo.applyBankerInfo;
                }
            }
            AppGame.ins.brjhModel.emit(MRole.BANKERINFO, data);
        }
        if (isRufView && CommVillage.ins != null) {
            CommVillage.ins.updateInfo();
        }

        if (data.bankerInfo != null) {
            if (data.bankerInfo.currentBankerInfo != null) {
                this.judgeBanke(data.bankerInfo.currentBankerInfo);//判断自己是否是庄家
                if (data.bankerInfo.currentBankerInfo.banker.userId == AppGame.ins.roleModel.useId) {
                    this.emit(MRole.S_CHANGEBANKER2);// 切换庄家
                }
            }
        }
    }

    onSyncTime(data: Brjh.CMD_S_SyncTime_Res) {
        UDebug.log(data);
        this.emit(MBrjh.S_SYNC_TIME, data);
    }

    onGameStart(data: Brjh.CMD_S_GameStart) {
        if (!this._canHandleMsg) return;
        UDebug.log('onGameStart11' + data);
        this._game_status = GAME_STATUS.BRJH_GAME_START;
        this.updateBanker(data.deskData);
        this.emit(MBrjh.S_GAME_START, data);

        if (data.deskData.gameOpenRecord) {
            this.resetRecordDatas(data.deskData.gameOpenRecord.record);
            this.emit(MBrjh.S_SEND_RECORD, this.recordData);
        }
    }
    /**
     * 开始下注
     * @param data 
     */
    onStartPlaceJetton(data: Brjh.CMD_S_StartPlaceJetton) {
        if (!this._canHandleMsg) return;
        UDebug.log('onStartPlaceJetton22' + data);
        this.updateBanker(data.deskData);
        this.emit(MBrjh.S_START_PLACE_JETTON, data);

        if (data.deskData.gameOpenRecord) {
            this.resetRecordDatas(data.deskData.gameOpenRecord.record);
            this.emit(MBrjh.S_SEND_RECORD, this.recordData);
        }
    }

    onGameEnd(data: Brjh.CMD_S_GameEnd) {
        if (!this._canHandleMsg) return;
        UDebug.log('onGameEnd' + data);
        let win_tag = this.getWinTag(data.deskData.winTag)
        this.recordData.push(win_tag);
        this.updateBanker(data.deskData, false);

        this.emit(MBrjh.S_GAME_END, data);
        this.emit(MBrjh.S_SEND_RECORD, this.recordData);
    }

    onPlaceJetton(data: Brjh.CMD_S_PlaceJetSuccess) {
        if (!this._canHandleMsg) return;
        UDebug.log('onPlaceJetton' + data);
        this.emit(MBrjh.S_PLACE_JETTON, data);
    }

    onPlaceJettonFail(data: Brjh.CMD_S_PlaceJettonFail) {
        if (!this._canHandleMsg) return;
        UDebug.log('onPlaceJettonFail' + data);
        this.emit(MBrjh.S_PLACE_JET_FAIL, data);
    }

    onQueryPlaylist(data: Brjh.CMD_S_PlayerList) {
        if (!this._canHandleMsg) return;
        UDebug.log('onQueryPlaylist' + data);
    }

    onJettonBroadcast(data: any) {
        if (!this._canHandleMsg) return;
        UDebug.log('onJettonBroadcast' + data);
        this.emit(MBrjh.S_JETTON_BROADCAST, data);
    }

    /**游戏空闲状态 */
    onGameSceneStatusFree(data: Brjh.CMD_Scene_StatusFree) {
        UDebug.log('游戏场景状态-空闲 ' + data);
        this._canHandleMsg = true;
        this.emit(MBrjh.GAMESCENE_STATUS_FREE, data);

        if (data.deskData.gameOpenRecord) {
            this.resetRecordDatas(data.deskData.gameOpenRecord.record);
            this.emit(MBrjh.S_SEND_RECORD, this.recordData);
        }
    }

    /**游戏下注状态 */
    onGameSceneStatusJetton(data: Brjh.CMD_Scene_StatusJetton) {
        UDebug.log('游戏场景状态-下注 ' + data);
        this._canHandleMsg = true;
        this.emit(MBrjh.GAMESCENE_STATUS_JETTON, data);

        if (data.deskData.gameOpenRecord) {
            this.resetRecordDatas(data.deskData.gameOpenRecord.record);
            this.emit(MBrjh.S_SEND_RECORD, this.recordData);
        }

        this.onStartPlaceJetton(data);
    }

    /**游戏开牌状态 */
    onGameSceneStatusOpen(data: Brjh.CMD_Scene_StatusOpen) {
        UDebug.log('游戏场景状态-开牌 ' + data);
        this._canHandleMsg = true;
        this.emit(MBrjh.GAMESCENE_STATUS_OPEN, data);

        if (data.deskData.gameOpenRecord) {
            this.resetRecordDatas(data.deskData.gameOpenRecord.record);
            this.emit(MBrjh.S_SEND_RECORD, this.recordData);
        }
    }

    /**游戏结束状态 */
    onGameSceneStatusEnd(data: Brjh.CMD_Scene_StatusEnd) {
        UDebug.log('游戏场景状态-结束 ' + data);
        this._canHandleMsg = true;
        this.emit(MBrjh.GAMESCENE_STATUS_END, data);

        if (data.deskData.gameOpenRecord) {
            this.resetRecordDatas(data.deskData.gameOpenRecord.record);
            this.emit(MBrjh.S_SEND_RECORD, this.recordData);
        }
    }

    /**开牌 */
    onOpenCard(data: Brjh.CMD_S_OpenCard) {
        if (!this._canHandleMsg) return;
        UDebug.log('开牌 ' + data);
        this.emit(MBrjh.OPEN_CARD, data);
    }

    /************/
    onRoomInfo(data: any) {

    }

    onLeftGame(data: GameServer.MSG_C2S_UserLeftMessageResponse) {
        UDebug.log(data);
        if (data.retCode == 0) {
            if (!this._lefting) {
                this._lefting = true;
                AppGame.ins.loadLevel(ELevelType.Hall, EGameType.BRJH);
            }
        } else {
            if (AppGame.ins.bankerBurrent && AppGame.ins.bankerBurrent.banker && AppGame.ins.bankerBurrent.banker.userId == AppGame.ins.roleModel.useId) {
                AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME2);
            } else {
                AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
            }
        }
    }

    onGameReconnect(data: any): any {
        // AppGame.ins.roomModel.requestMatch();
    }

    // 前后台切换  true 切到后台，false 切到前台
    onGameToBack(data: any) {
        this._isBack = data;
        UDebug.log(data);
        if (!data) {
            this.sendMsg(Brjh.SUBID.CS_GAMESCENE_FRESH, null);
            this.sendSyncTime();  // 同步系统时间
            this.emit(MBrjh.TO_BACK_CLEAR_AFTER);
        } else {
            this._canHandleMsg = false;
            this.emit(MBrjh.TO_BACK_CLEAR);
        }
    }

    onCloseCharge(msgName: any) {
    }

    getWinTag(code: number): any {
        let tian = (code & 1) != 0;
        let di = (code & 2) != 0;
        let xuan = (code & 4) != 0;
        let huang = (code & 8) != 0;
        return { [1]: tian, [2]: di, [3]: xuan, [4]: huang };
    }

    /**重置录单数据 */
    resetRecordDatas(record: any) {
        let datas = [];
        for (let i = 0; i < record.length; i++) {
            let data_item = this.getWinTag(record[i]);
            datas.push(data_item);
        }
        this.recordData = [];
        this.recordData = JSON.parse(JSON.stringify(datas));
        while (this.recordData.length > 10) {
            this.recordData.shift();
        }
    }
}
