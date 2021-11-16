import Model from "../../../common/base/Model";
import UHandler from "../../../common/utility/UHandler";
import { EGameType, ELevelType, ECommonUI, ELeftType, ETipType } from "../../../common/base/UAllenum";
import UMsgCenter from "../../../common/net/UMsgCenter";
import { Game, Ebg, GameServer } from "../../../common/cmd/proto";
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
 * 创建：朱武
 * 作用：百人二八杠游戏逻辑模块  
 * （目前已改成进场景完成之后在发进游戏消息，所以不需要逻辑模块初始场景数据给view）
 * 当前模块功能只做数据转发。。。
 */

enum GAME_STATUS {
    EBG_GAME_START = 1,   // 开始游戏  （摇塞子 发牌）
    EBG_GAME_BET = 2,       // 开始下注
    EBG_GAME_STOP = 3,       // 停止下注
    EBG_GAME_END = 4,  // 正在结算
}


const { ccclass, property } = cc._decorator;


export default class MBrebg extends Model {


    static S_SCENE_START = 'S_SCENE_START';
    static S_SCENE_END = 'S_SCENE_END';
    static S_SCENE_Jetton = 'S_SCENE_Jetton';
    static S_GameStart = 'S_GameStart';
    static S_GameEnd = 'S_GameEnd';
    static S_GameJetton = 'S_GameJetton';  // 开始下注
    static S_Jetton_Success = 'S_Jetton_Success';
    static S_Jetton_Fail = 'S_Jetton_Fail';
    static S_JETTON_BROADCAST = 'S_JETTON_BROADCAST';

    static S_GameRecord = 'S_GameRecord';

    _leave_time = 10;   // 状态倒计时
    _game_status = GAME_STATUS.EBG_GAME_START;
    private _lefting: boolean = false;
    private _isXiaZhuang: boolean = false; //是否下庄

    init() {

        this.regesterMsg(Ebg.SUBID.SUB_S_GAME_START, new UHandler(this.onGameStart, this));
        this.regesterMsg(Ebg.SUBID.SUB_S_GAME_END, new UHandler(this.onGameEnd, this));
        // this.regesterMsg(Ebg.SUBID.SUB_S_SCENE_START, new UHandler(this.onGameSceneStart, this));  // 开始场景
        // this.regesterMsg(Ebg.SUBID.SUB_S_SCENE_END, new UHandler(this.onGameSceneEnd, this));  // 结算场景
        // this.regesterMsg(Ebg.SUBID.SUB_S_PLAYERLIST, new UHandler(this.onGamePlayerList, this));
        this.regesterMsg(Ebg.SUBID.SUB_S_PLACE_JETTON, new UHandler(this.onJettonSuccess, this));
        this.regesterMsg(Ebg.SUBID.SUB_S_PLACE_JET_FAIL, new UHandler(this.onJettonFail, this));
        this.regesterMsg(Ebg.SUBID.SUB_S_START_PLACE_JETTON, new UHandler(this.onGameJetton, this));  // 开始下注
        this.regesterMsg(Ebg.SUBID.SUB_S_APPLY_BANKER, new UHandler(this.bankerSucceed, this)); //申请上庄成功
        this.regesterMsg(Ebg.SUBID.SUB_S_APPLY_BANKER_FAIL, new UHandler(this.bankerFail, this)); //申请上庄失败
        this.regesterMsg(Ebg.SUBID.SUB_S_CANCEL_BANKER, new UHandler(this.cancelSucceed, this)); //取消申请上庄成功
        this.regesterMsg(Ebg.SUBID.SUB_S_CANCEL_BANKER_FAIL, new UHandler(this.cancelFail, this)); //取消申请上庄失败
        this.regesterMsg(Ebg.SUBID.SUB_S_GET_OFF_BANKER, new UHandler(this.downBankerSucceed, this)); //申请下庄成功
        this.regesterMsg(Ebg.SUBID.SUB_S_GET_OFF_BANKER_FAIL, new UHandler(this.downBankerFail, this)); //申请下庄失败
        this.regesterMsg(Ebg.SUBID.SUB_S_CHANGE_BANKER, new UHandler(this.changeBanke, this));//切换庄家
        // this.regesterMsg(Ebg.SUBID.SUB_S_SCENE_Jetton, new UHandler(this.onSceneJetton, this));  // 下注场景
        // this.regesterMsg(Ebg.SUBID.SUB_S_SEND_RECORD, new UHandler(this.onSendRecord, this));-----------------
        // this.regesterMsg(Ebg.SUBID.SUB_S_JETTON_BROADCAST, new UHandler(this.onJettonBroadcast, this));
        this.regesterMsg(Ebg.SUBID.SUB_S_QUERY_PLAYLIST, new UHandler(this.onQueryPlaylist, this));  // 
    }


    /**注册网络消息事件 */
    regesterMsg(subId: number, handler: UHandler) {
        UMsgCenter.ins.regester(EGameType.BREBG,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId,
            handler);
    }

    unregesterMsg(subId: number, handler: UHandler) {
        UMsgCenter.ins.unregester(EGameType.BREBG,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId,
            handler);
    }


    /** 发送网络消息*/
    sendMsg(subId: number, data: any, handler: UHandler = null, unlock: boolean = false) {
        UMsgCenter.ins.sendPkg(EGameType.BREBG,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId, data, handler, unlock);
    }


    run() {
        super.run();
        this._lefting = false;
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.onRoomInfo, this);
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.onLeftGame, this);
        AppGame.ins.appStatus.on(AppStatus.RECONNECT_IN_GAME_BUT_NO_IN_GAMING, this.onGameReconnect, this);

        // AppGame.ins.roomModel.on(MRoomModel.SC_ENTER_ROOM_FAIL, this.onEnterRoomFail, this);
        // EventManager.getInstance().addEventListener(cfg_event.CLOSE_CHARGE, this.onCloseCharge, this);
    }



    exit() {
        super.exit();
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, this.onRoomInfo, this);
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, this.onLeftGame, this);
        AppGame.ins.appStatus.off(AppStatus.RECONNECT_IN_GAME_BUT_NO_IN_GAMING, this.onGameReconnect, this);
        // EventManager.getInstance().removeEventListener(cfg_event.CLOSE_CHARGE, this.onCloseCharge, this);
        // AppGame.ins.roomModel.off(MRoomModel.SC_ENTER_ROOM_FAIL, this.onEnterRoomFail, this);
        this.unregesterMsg(Ebg.SUBID.SUB_S_GAME_START, new UHandler(this.onGameStart, this));
        this.unregesterMsg(Ebg.SUBID.SUB_S_GAME_END, new UHandler(this.onGameEnd, this));
        // this.regesterMsg(Ebg.SUBID.SUB_S_SCENE_START, new UHandler(this.onGameSceneStart, this));  // 开始场景
        // this.regesterMsg(Ebg.SUBID.SUB_S_SCENE_END, new UHandler(this.onGameSceneEnd, this));  // 结算场景
        // this.regesterMsg(Ebg.SUBID.SUB_S_PLAYERLIST, new UHandler(this.onGamePlayerList, this));
        this.unregesterMsg(Ebg.SUBID.SUB_S_PLACE_JETTON, new UHandler(this.onJettonSuccess, this));
        this.unregesterMsg(Ebg.SUBID.SUB_S_PLACE_JET_FAIL, new UHandler(this.onJettonFail, this));
        this.unregesterMsg(Ebg.SUBID.SUB_S_START_PLACE_JETTON, new UHandler(this.onGameJetton, this));  // 开始下注
        this.unregesterMsg(Ebg.SUBID.SUB_S_APPLY_BANKER, new UHandler(this.bankerSucceed, this));  //申请上庄成功
        this.unregesterMsg(Ebg.SUBID.SUB_S_APPLY_BANKER_FAIL, new UHandler(this.bankerFail, this)); //申请上庄失败
        this.unregesterMsg(Ebg.SUBID.SUB_S_CANCEL_BANKER, new UHandler(this.cancelSucceed, this)); //取消申请上庄成功
        this.unregesterMsg(Ebg.SUBID.SUB_S_CANCEL_BANKER_FAIL, new UHandler(this.cancelFail, this)); //取消申请上庄失败
        this.unregesterMsg(Ebg.SUBID.SUB_S_GET_OFF_BANKER, new UHandler(this.downBankerSucceed, this)); //申请下庄成功
        this.unregesterMsg(Ebg.SUBID.SUB_S_GET_OFF_BANKER_FAIL, new UHandler(this.downBankerFail, this)); //申请下庄失败
        this.unregesterMsg(Ebg.SUBID.SUB_S_CHANGE_BANKER, new UHandler(this.changeBanke, this));//切换庄家
        // this.regesterMsg(Ebg.SUBID.SUB_S_SCENE_Jetton, new UHandler(this.onSceneJetton, this));  // 下注场景
        // this.unregesterMsg(Ebg.SUBID.SUB_S_SEND_RECORD, new UHandler(this.onSendRecord, this));------------------
        // this.regesterMsg(Ebg.SUBID.SUB_S_JETTON_BROADCAST, new UHandler(this.onJettonBroadcast, this));
        this.unregesterMsg(Ebg.SUBID.SUB_S_QUERY_PLAYLIST, new UHandler(this.onQueryPlaylist, this));  // 

    }



    /*********************************************************/
    /********************      *******************************/


    findSeatId(userid: number) {

    }


    update(dt) { }



    resetData() {

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
     * 发送下注消息
     * @param area 下注区域
     * @param score 下注分数
     */
    sendJetton(area: number, score: number) {
        if (MRole.bankerBool) {
            AppGame.ins.showTips({ data: "自己是庄家时,不能下注!", type: ETipType.onlyone });
        }
        else {
            var data = {
                jettonArea: area,
                jettonScore: score
            }
            this.sendMsg(Ebg.SUBID.SUB_C_PLACE_JETTON, data);
        }
    }

    // 申请上庄
    sendBanker() {
        var data = {
            applyUserId: AppGame.ins.roleModel.useId,
        }
        this.sendMsg(Ebg.SUBID.SUB_C_APPLY_BANKER, data);
    }

    // 申请上庄成功
    bankerSucceed(data: Ebg.CMD_S_ApplyBanker) {
        AppGame.ins.bankerBurrent = data.currentBankerInfo;
        AppGame.ins.bankerApply = data.applyBankerInfo;
        this.judgeBanke(data.currentBankerInfo);
        this.emit(MRole.S_BANKERSUCCEED, data);
        if (CommVillage.ins != null) {
            CommVillage.ins.bankerSucceed();
        }
    }

    // 申请上庄失败
    bankerFail(data: Ebg.CMD_S_ApplyBankerFail) {
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
        this.sendMsg(Ebg.SUBID.SUB_C_CANCEL_BANKER, data);
    }

    // 取消排队成功
    cancelSucceed(data: Ebg.CMD_S_CancelBanker) {
        AppGame.ins.bankerBurrent = data.currentBankerInfo;
        AppGame.ins.bankerApply = data.applyBankerInfo;
        this.judgeBanke(data.currentBankerInfo);
        this.emit(MRole.S_CANCELSUCCEED, data);
        if (CommVillage.ins != null) {
            CommVillage.ins.cancelSucceed();
        }
    }

    // 取消排队失败
    cancelFail(data: Ebg.CMD_S_CancelBankerFail) {
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
        this.sendMsg(Ebg.SUBID.SUB_C_GET_OFF_BANKER, data);
    }

    // 申请下庄成功
    downBankerSucceed(data: Ebg.CMD_CS_GetOffBanker) {
        if (data.bankerUserId == AppGame.ins.roleModel.useId) {
            this._isXiaZhuang = true;
        }
        this.emit(MRole.S_DOWNSUCCEED, data);
        if (CommVillage.ins != null) {
            CommVillage.ins.downBankerSucceed();
        }
    }

    // 申请下庄失败
    downBankerFail(data: Ebg.CMD_S_GetOffBankerFail) {
        AppGame.ins.showTips({ data: data.errMsg, type: ETipType.onlyone });
        this.emit(MRole.S_DOWNERFAILL, data);
        if (CommVillage.ins != null) {
            CommVillage.ins.downBankerFail();
        }
    }

    // 切换庄家
    changeBanke(data: Ebg.CMD_S_ChangeBanker) {
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
    judgeBanke(tempCurrent: Ebg.ICurrentBankerInfo) {
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
    updateBanker(data: Ebg.IGameDeskInfo) {
        AppGame.ins.bankerInfo = data.bankerInfo;
        if (data.bankerInfo != null) {
            if (data.bankerInfo.currentBankerInfo != null) {
                AppGame.ins.bankerBurrent = data.bankerInfo.currentBankerInfo;
            }

            if (data.bankerInfo.applyBankerInfo != null) {
                AppGame.ins.bankerApply = data.bankerInfo.applyBankerInfo;
            }
        }
        AppGame.ins.brebgModel.emit(MRole.BANKERINFO, data);
        if (CommVillage.ins != null) {
            CommVillage.ins.updateInfo();
        }
    }

    /**
     * 请求玩家列表
     * @param index 
     */

    sendAskPlayerlist(index: number) {
        var data = {
            index: index,
        }

        // this.sendMsg(Ebg.SUBID.SUB_C_USER_ASKLIST, data);
    }


    /**
     * 请求重复下注
     * @param user_id 
     */
    sendRepeatJetton(user_id: number) {
        var data = {
            dwUserID: user_id,
        }
        // this.sendMsg(Ebg.SUBID.SUB_C_USER_REPEAT_JETTON, data);
    }


    /**
     * 请求玩家列表
     * @param limit_count 
     * @param begin_index
     */
    sendQueryPlayerList(limit_count: number, begin_index: number) {
        var data = {
            nLimitCount: limit_count,
            nBeginIndex: begin_index
        }

        this.sendMsg(Ebg.SUBID.SUB_C_QUERY_PLAYERLIST, data);
    }

    /*****************************************************/
    /**
     * 开始场景消息 (重连或者开始进去的时候收到的消息)
     * @param data 
     */
    onGameSceneStart(data: any) {
        UDebug.log(data);

        this.emit(MBrebg.S_SCENE_START, data);

    }


    /**
     * 结算场景消息 (重连或者开始进去的时候收到的消息)
     * @param data 
     */
    onGameSceneEnd(data: any) {
        UDebug.log(data);
        this.emit(MBrebg.S_SCENE_END, data);
    }


    /**
     * 下注场景消息  (重连或者开始进去的时候收到的消息)
     * @param data 
     */
    onSceneJetton(data: any) {
        UDebug.log(data);
        this.emit(MBrebg.S_SCENE_Jetton, data);
    }

    /**
     * 游戏玩家列表
     * @param data 
     */
    onGamePlayerList(data: any) {
        UDebug.log(data);
    }


    /**
     * 下注成功 (目前所有玩家下注成功都是发的这个消息)
     * @param data 
     */
    onJettonSuccess(data: any) {
        UDebug.log(data);
        this.emit(MBrebg.S_Jetton_Success, data);
    }


    /**
     * 下注失败
     * @param data 
     */
    onJettonFail(data: Ebg.CMD_S_PlaceJettonFail) {
        UDebug.log(data);
        this.emit(MBrebg.S_Jetton_Fail, data);
    }


    /**
     * 开始下注 （玩家下注）
     * @param data 
     */
    onGameJetton(data: Ebg.CMD_S_StartPlaceJetton) {
        let gameOpenRecord = data.deskData.gameOpenRecord;
        if (gameOpenRecord) {
            this.onSendRecord(gameOpenRecord);
        };
        UDebug.log(data);
        this.emit(MBrebg.S_GameJetton, data);
        this.updateBanker(data.deskData);
    }

    // // -------------------------
    onSendRecord(data: Ebg.IGameOpenRecord) {
        UDebug.log(data);
        this.emit(MBrebg.S_GameRecord, data);
    }


    /**
     * 开始游戏 （清理，发牌）
     * @param data
     */
    onGameStart(data: any) {
        UDebug.log(data);
        let gameOpenRecord = data.deskData.gameOpenRecord;
        if (gameOpenRecord) {
            this.onSendRecord(gameOpenRecord);
        };
        this.emit(MBrebg.S_GameStart, data);
        this.updateBanker(data.deskData);
    }

    /**
     * 停止下注 （开牌，结算）
     * @param data 
     */
    onGameEnd(data: any) {
        UDebug.log(data);
        let gameOpenRecord = data.deskData.gameOpenRecord;
        if (gameOpenRecord) {
            this.onSendRecord(gameOpenRecord);
        };
        if (this._isXiaZhuang) {
            MRole.bankerBool = false;//庄家是别人
            this._isXiaZhuang = false;
        }
        this.emit(MBrebg.S_GameEnd, data);
        this.updateBanker(data.deskData);
    }


    /**
     * 返回玩家列表
     * @param data 
     */
    onQueryPlaylist(data: Ebg.CMD_S_PlayerList) {
        UDebug.log(data);
    }


    /**
     * 下注广播 （其他玩家的下注收集一起，隔秒广播）
     * @param data 
     */
    onJettonBroadcast(data: any) {
        UDebug.log(data);
        this.emit(MBrebg.S_JETTON_BROADCAST, data);
    }




    /*****************************************************************
     *  
     **************************************************************************/

    onRoomInfo(data: any) {

    }


    onLeftGame(data: GameServer.MSG_C2S_UserLeftMessageResponse) {
        UDebug.log(data);

        if (data.retCode == 0) {
            if (!this._lefting) {
                this._lefting = true;
                // EventManager.getInstance().raiseEvent(cfg_event.CLOSE_CHARGE);
                // AppGame.ins.checkEnterMinScore(AppGame.ins.game_watch_limit_score + 1);
                AppGame.ins.loadLevel(ELevelType.Hall, EGameType.BREBG);
            }
        } else {
            if (MRole.bankerBool) {
                AppGame.ins.showTips(ULanHelper.COM_BR_QUIT_GAME);
            } else {
                AppGame.ins.showTips(ULanHelper.SG_CANT_EXIT_GAME);
            };
        }

        // this.emit(MBrlh.S_LEFT_ROOM, data);
    }

    onGameReconnect(data: any): any {
        // AppGame.ins.roomModel.requestMatch();
    }

    // onEnterRoomFail(data: any): any {

    //     if (data == 13) {//断线重连上来的时候
    //         AppGame.ins.roomModel.requestMatch();
    //         return;
    //     }
    //     let err_code = data;    // 错误码
    //     let err_chat = cfg_error.enter_game[err_code] || '进入游戏失败，请稍后在试';
    //     AppGame.ins.showUI(ECommonUI.NewMsgBox, {
    //         type: 1, data: err_chat, handler: UHandler.create((() => {

    //             AppGame.ins.loadLevel(ELevelType.Hall, EGameType.BREBG);
    //         }))
    //     });
    // }



    private onCloseCharge(): void {
        // AppGame.ins.checkEnterMinScore(AppGame.ins.roleModel.score);
    }

}
