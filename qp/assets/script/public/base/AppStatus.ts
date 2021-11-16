import { EAppStatus, ECommonUI, EGameType, ELevelType, EMsgType, ERoomKind } from "../../common/base/UAllenum";
import AppGame from "./AppGame";
import MRoomModel from "../hall/room_zjh/MRoomModel";
import MHall from "../hall/lobby/MHall";
import UHandler from "../../common/utility/UHandler";
import MLogin from "../login/MLogin";
import ULanHelper from "../../common/utility/ULanHelper";
import UMsgCenter from "../../common/net/UMsgCenter";
import UDebug from "../../common/utility/UDebug";
import { cfg_friendGameIds } from "../../config/cfg_friends";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import { SysEvent } from "../../common/base/UAllClass";
import CarryingAmount from "../../game/common/CarryingAmount";

const connectTimes = 4;
const restarTime = 600000;
/**
 * 创建:sq
 * 作用:玩家所在游戏状态维护，并且维护断线重连
 */
export default class AppStatus extends cc.EventTarget {
    /**重连之后再游戏场景中，但是不再玩游戏 */
    static RECONNECT_IN_GAME_BUT_NO_IN_GAMING = "RECONNECT_IN_GAME_BUT_NO_IN_GAMING";
    static GAME_TO_BACK = "GAME_TO_BACK";
    private _status: EAppStatus = EAppStatus.Login;
    private _connectCount: number = 0;
    private _hidetime: number;
    //是否被服务器踢掉
    private _kickByServer: boolean = false;
    //是否在后台支行
    private _isInBack: boolean = false;
    //时钟ID
    private _timeId: any
 


    get status(): EAppStatus {
        return this._status;
    }
    set status(value: EAppStatus) {
        this._status = value;
    }
    private showTips(): boolean {
        if (this._status == EAppStatus.Hall || this._status == EAppStatus.Room) {
            return true;
        }
        return false;
    }
    private updata_gameinfo(sucess: boolean, arg: string): void {
        if (sucess) {
            this._connectCount = 0;
            if (this._status == EAppStatus.Game) {
                AppGame.ins.hallModel.requsetHasLastGame();
            }
        }
    }
    private has_playing_game_info(data: any): void {
        // UDebug.Log('是否有正在玩的游戏？ data => ' + JSON.stringify(data))
        
        /**有正在玩的游戏 */
        if (data.retCode == 0) {
            let gameId = data.gameId;
            let roomId = data.roomId;
            let clubId = data.clubId || 0;   // 俱乐部Id  金币场：0  好友房：0，俱乐部：N>0
            let originalClubId = data.originalClubId || 0;   // 当全局匹配时，此为原始clubId，非全局匹配时为0与或没有此字段
            let type = data.type || 1;       // 1-金币场    2-好友房  3-俱乐部
            if(this.showTips()){
                if (type != 2) {
                    let tempRooms = AppGame.ins.roomModel.getRoomListInfo(data.gameId);
                    //携带金额断线重连获取房间信息
                    if (data.gameId == EGameType.DZPK || data.gameId == EGameType.SH) {
                        for (let i = 0; i < tempRooms.length; i++) {
                            if (tempRooms[i].type == data.roomId) {
                                CarryingAmount.roomData.gameId = data.gameId;
                                CarryingAmount.roomData.type = tempRooms[i].type;
                                CarryingAmount.roomData.minScore = tempRooms[i].minScore;
                                CarryingAmount.roomData.maxScore = tempRooms[i].maxScore;
                                CarryingAmount.roomData.clubId = clubId;
                                CarryingAmount.roomData.tableId = originalClubId;
                            }
                        }
                    }
                }

                AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: EMsgType.EOKAndCancel, data: "有正在进行的游戏，是否进入?", handler: UHandler.create((a) => {
                        if (a) {
                            this.enterGame(gameId, roomId, clubId, type, originalClubId);
                        }
                    }, this)
                });
            }else{
                //在游戏场景重连时，先清空上局场景
                this.emit("RECONNECT_IN_GAME_BUT_NO_IN_GAMING")
                setTimeout(() => {
                    this.enterGame(gameId, roomId, clubId, type, originalClubId);
                }, 100);
            }
            AppGame.ins.openFriendRoomId = 0;
        }else{
            AppGame.ins.announceModel.requestGameAnnounceListData();
            /**没有正在玩的游戏*/
            if (this._status == EAppStatus.Game) {
                AppGame.ins.loadLevel(ELevelType.Hall,"",new UHandler(this.showGameOverTip, this))
            }
            AppGame.ins.hallModel.emit(MHall.OPEN_ENTER_FRIEND_ROOM);
        }
    }

    //重连后游戏结束提示
    showGameOverTip(){
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {type: EMsgType.EOK, data: "游戏已经结束，你可以在投注记录中查看游戏结算结果。"});
    }
    
    private enterGame(gameId: number, roomId: number, clubId: number, type: number, originalClubId: number): void {
        UDebug.Log('_status=> ' + this._status + 'gameId=> ' + gameId + ' roomId=> ' + roomId + ' clubId=> ' + clubId + ' type=> ' + type + ' originalClubId=> ' + originalClubId)
        switch (this._status) {
            case EAppStatus.Hall:
            case EAppStatus.Room:
                if (cfg_friendGameIds.includes(gameId) || type == 2) {
                    UDebug.Log('1进入游戏-好友房')
                    AppGame.ins.roomModel.requestEnterRoomFriend(roomId);
                } else if (type == 3) {
                    UDebug.Log('1进入游戏-俱乐部')
                    let roomIdList = AppGame.ins.roomModel.getRoomIdList(gameId);
                    if (roomIdList.indexOf(roomId) != -1) {
                        AppGame.ins.clubHallModel.lastRoomIndex = roomIdList.indexOf(roomId);
                    }
                    AppGame.ins.roomModel.requestEnterRoom(roomId, gameId, true, ERoomKind.Club, clubId, -2, originalClubId);
                } else {
                    UDebug.Log('1进入游戏-金币场')
                    AppGame.ins.roomModel.requestEnterRoom(roomId, gameId, true);
                }
                break;
            case EAppStatus.Game:
                if (cfg_friendGameIds.includes(gameId) || type == 2) {
                    UDebug.Log('2进入游戏-好友房')
                    AppGame.ins.currRoomKind = ERoomKind.Friend;
                    AppGame.ins.roomModel.requestEnterRoomFriend(roomId);
                } else if (type == 3) {
                    UDebug.Log('2进入游戏-俱乐部')
                    AppGame.ins.currRoomKind = ERoomKind.Club;
                    AppGame.ins.roomModel.requestClubGameServer(true);
                } else {
                    UDebug.Log('2进入游戏-金币场')
                    AppGame.ins.currRoomKind = ERoomKind.Normal;
                    AppGame.ins.roomModel.requestMatch();
                }
                break;
            default:
                break;
        }
    }

    private relogin()  //刷新游戏
    {
        AppGame.ins.jumpToLogin(true);
    }
    private login_error(msg: string): void {
        switch (this._status) {
            case EAppStatus.Login:
                {
                    AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                        data: msg, type: 1, handler: UHandler.create(() => {

                        }, this)
                    });
                }
                break;
            case EAppStatus.Hall:
            case EAppStatus.Room:
                {
                    AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                        data: msg, type: 1, handler: UHandler.create(() => {
                            this.relogin();
                        }, this)
                    });
                }
                break;
            case EAppStatus.Game:
                {
                    AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                        data: msg, type: 1, handler: UHandler.create(() => {
                            this.relogin();
                        }, this)
                    });
                }
                break;
        }

    }
    /**短线 */
    private connect_close(): void {
        UDebug.Log("断开连接了 " + " 在后台：" + this._isInBack + " APP 状态：" + this.status + " 重连次数：" + this._connectCount + " 被踢：" + this._kickByServer)
        //如果是被服务器踢掉了的，不用自动重连
        if (this._kickByServer) return
        //登录场景，遍历了所有通道都连接失败时，提示网络失败
        UMsgCenter.ins._connectErrorCount++
        if (this.status == EAppStatus.Login){
            if (UMsgCenter.ins._peerList.length > 0 && UMsgCenter.ins._peerList.length == UMsgCenter.ins._connectErrorCount){
                UMsgCenter.ins._connectErrorCount = 0
                AppGame.ins.showConnect(false);
                AppGame.ins.showUI(ECommonUI.NewMsgBox, {type: 1, data: "连接失败，请检查网络后重试。"})
            }
        }
        //大厅或者游戏场景时
        else{
            //在前台时，自动重连几次
            this._connectCount++;
            //在前台时
            if(!this._isInBack){
                if (this._connectCount < connectTimes) {
                    //重连之前，重置是否成功标记
                    AppGame.ins.showConnect(true);
                    UMsgCenter.ins._connectOk = false
                    UMsgCenter.ins._peer.reConnect()
                    UDebug.log("断线重连")
                }
                //重连几次还是连接不上，弹窗提示网络失败
                else{
                    this._connectCount = 0;
                    AppGame.ins.showConnect(false);
                    AppGame.ins.closeUI(ECommonUI.UI_GAME_MIPAI);
                    AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                        type: 1, data: "当前网络较差，请检查网络后重试。", handler: UHandler.create(() => {
                            UMsgCenter.ins._connectOk = false
                            AppGame.ins.showConnect(true);
                            UMsgCenter.ins._peer.reConnect()
                        }, this)
                    })
                }
            }
        }
    }

    private game_hide(): void {
        UDebug.Log("APP 切换到后台")
        this.emit(AppStatus.GAME_TO_BACK, true);
        if (this._timeId) {
            clearTimeout(this._timeId);
        }
        this._hidetime = (new Date()).getTime();
        this._isInBack = true
    }

    private game_show(): void {
        UDebug.Log("APP 切换到前台")
        this.emit(AppStatus.GAME_TO_BACK, false);
        //做个延时，兼容原生先收到断线消息的情况
        this._timeId = setTimeout(() => {
            this._isInBack = false
            clearTimeout(this._timeId);
            if(this._status != EAppStatus.Login && !UMsgCenter.ins._peer.isConnect){
                UDebug.Log("APP 切换到前台，发现网络断开，自动重连")
                AppGame.ins.closeUI(ECommonUI.NewMsgBox)
                AppGame.ins.showConnect(true);
                UMsgCenter.ins._connectOk = false
                UMsgCenter.ins._peer.reConnect()
            }
        }, 150)

        //UDebug.log("game_show->" + (new Date()).getTime());
        //var now = (new Date()).getTime();
        /**切到后台 在切回来 时间超过10分钟 那么重启游戏 */
        //if (now - this._hidetime > restarTime) {
        //    UDebug.Log("APP 重启")
        //    cc.audioEngine.stopAll();
        //    cc.game.restart();
        //}

    }
    private http_login_error(): void {
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: 1, data: ULanHelper.HTTP_ERROR, handler: UHandler.create(() => {
                this.relogin();
            }, this)
        })
    }
    private connect_sucess(): void {
        //重置是否被踢标志
        this._kickByServer = false;
        if (AppGame.ins.appStatus.status != EAppStatus.Login) {
            AppGame.ins.LoginModel.autoLogin();
        }
        if(this._status == EAppStatus.Hall || this._status == EAppStatus.Room) {
            UDebug.log('重连了  this._status=> ', this._status)
            AppGame.ins.hallModel.emit(MHall.HALL_RECONNECT);
        }
    }
    private repeat_login(): void {
        this._kickByServer = true;
        switch (this._status) {
            case EAppStatus.Login:
            case EAppStatus.Hall:
            case EAppStatus.Room:
                {
                    AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                        type: 1, data: ULanHelper.LOGIN_REPEAT, handler: UHandler.create(() => {
                            this.relogin();
                        }, this)
                    })
                }
                break;
            case EAppStatus.Game:
                {
                    AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                        type: 1, data: ULanHelper.LOGIN_REPEAT, handler: UHandler.create(() => {
                            this.relogin();
                        }, this)
                    })
                }
                break;
        }
    }
    regester(): void {
        AppGame.ins.hallModel.on(MHall.HAS_PLAYING_GAME_INFO, this.has_playing_game_info, this);
        AppGame.ins.LoginModel.on(MLogin.REPEAT_LOGIN, this.repeat_login, this);
        AppGame.ins.hallModel.on(MHall.UPDATA_GAMEINFO, this.updata_gameinfo, this);
        AppGame.ins.LoginModel.on(MLogin.CONNECT_CLOSE, this.connect_close, this);
        AppGame.ins.LoginModel.on(MLogin.LOGIN_ERROR, this.login_error, this);
        //AppGame.ins.LoginModel.on(MLogin.LOGIN_ERROR, this.login_error, this);
        AppGame.ins.LoginModel.on(MLogin.CONNECT_SUCESS, this.connect_sucess, this);

        cc.game.on(cc.game.EVENT_HIDE, this.game_hide, this);
        cc.game.on(cc.game.EVENT_SHOW, this.game_show, this);
    }
    unregest(): void {
        AppGame.ins.LoginModel.off(MLogin.CONNECT_CLOSE, this.connect_close, this);
        AppGame.ins.LoginModel.off(MLogin.REPEAT_LOGIN, this.repeat_login, this);
        AppGame.ins.hallModel.off(MHall.HAS_PLAYING_GAME_INFO, this.has_playing_game_info, this);
        AppGame.ins.hallModel.off(MHall.UPDATA_GAMEINFO, this.updata_gameinfo, this);
        AppGame.ins.LoginModel.off(MLogin.HTTP_ERROR, this.http_login_error, this);
        AppGame.ins.LoginModel.off(MLogin.LOGIN_ERROR, this.login_error, this);
        AppGame.ins.LoginModel.off(MLogin.CONNECT_SUCESS, this.connect_sucess, this);

        cc.game.off(cc.game.EVENT_HIDE, this.game_hide, this);
        cc.game.off(cc.game.EVENT_SHOW, this.game_show, this);
    }
}
