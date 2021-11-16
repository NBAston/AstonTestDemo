import { UIGameItem } from "../../../common/base/UAllClass";
import cfg_game, { gameitem } from "../../../config/cfg_game";
import { EGameState, EGameType, EGameStatus, EGameHot, EAppStatus, ETipType, ECommonUI, EGameUpdateStatus, EAgentLevelReqType } from "../../../common/base/UAllenum";
import Model from "../../../common/base/Model";
import UDebug from "../../../common/utility/UDebug";
import AppGame from "../../base/AppGame";
import { Game, HallServer, ProxyServer } from "../../../common/cmd/proto";
import UHandler from "../../../common/utility/UHandler";
import UMsgCenter from "../../../common/net/UMsgCenter";
import ULanHelper from "../../../common/utility/ULanHelper";
import UIRankData, { UIRankDataItem } from "../rank/RankData";
import { UIActivityItemData, UIActivityCopyData, UIActivityQRCodeData } from "../activity/ActivityData";
import { UHotManager } from "../../hot/UHotManager";
import UStringHelper from "../../../common/utility/UStringHelper";
import MMailModel from "../lb_service_mail/Mmail_Model";
import VGameList from "./VGameList";
import UCommon from "../../../common/utility/UCommon";
import { COIN_RATE } from "../../../config/cfg_common";

/**
 * 游戏信息数据
 */
export class GameInfo {
    gameId: number
    gameName: string;
    gameSortId: number;
    gameStyle: number;
    gameIsHot: EGameHot;
    gameStatus: EGameStatus;
}

export const NEWS = [];

/**
 * 创建:gj
 * 作用:大厅的业务逻辑数据处理中心
 */
export default class MHall extends Model {

    static UPDATA_GAMEINFO = "UPDATA_GAMEINFO";
    static HAS_PLAYING_GAME_INFO = "HAS_PLAYING_GAME_INFO";
    static HALL_NOTICE_NOTIFY = "HALL_NOTICE_NOTIFY";
    static UPDATA_RANK_DATA = "UPDATA_RANK_DATA";
    static HALL_MAIL_NOTIFY = "HALL_MAIL_NOTIFY";
    static GETSCROLLERMSG = "GETSCROLLERMSG";
    static OPEN_ENTER_FRIEND_ROOM = "OPEN_ENTER_FRIEND_ROOM";
    static GET_AGENT_LEVEL_RES = "GET_AGENT_LEVEL_RES";
    static UPDATE_GAME_FINISHED_CLUB = "UPDATE_GAME_FINISHED_CLUB";
    static UPDATE_GAME_FINISHED_HALL = "UPDATE_GAME_FINISHED_HALL";
    static HALL_RECONNECT = "HALL_RECONNECT";

    /**更新中的游戏id列表 */
    public updatingGameIdList: Array<number> = [];

    /**
     * 游戏数据
     */
    private _gamesInfo: Array<GameInfo>;

    private _canSendNotice: boolean = false;

    private _gameAllList: VGameList;

    public get gameAllList() {
        return this._gameAllList
    }

    public set gameAllList(v: VGameList) {
        this._gameAllList = v;
    }



    private _notice: Array<any>;

    /**代理等级请求类型 */
    private _reqAgentLevelType: EAgentLevelReqType = EAgentLevelReqType.default;
    get reqAgentLevelType() {
        return this._reqAgentLevelType;
    }
    set reqAgentLevelType(v: EAgentLevelReqType) {
        this._reqAgentLevelType = v;
    }

    //#region   实现Model的抽象方法
    /**
     * 初始化
     */
    init(): void {
        this._gamesInfo = [];
        this._notice = [];

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_GAME_ROOM_INFO_RES
            , new UHandler(this.get_game_room_info_res, this));
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PLAYING_GAME_INFO_MESSAGE_RES
            , new UHandler(this.get_playing_game_info_message_res, this));
        // UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_PROXY,
        //     Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_PUBLIC_NOTICE_MESSAGE_NOTIFY
        //     , new UHandler(this.proxy_notify_public_notice_message_notify, this));//公告
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_PROXY,
            Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_NEW_EMAIL_MESSAGE_NOTIFY
            , new UHandler(this.proxy_notify_public_mail_message_notify, this));//邮件       
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_PROXY,
            Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_PUBLIC_NOTICE_MESSAGE_NOTIFY
            , new UHandler(this.get_scroll_msg, this));

        /**获取代理级别 */
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_PROMOTER_LEVEL_RES
            , new UHandler(this.onAgentLevelRes, this));
    }

    /**
     * 重置数据
     */
    resetData(): void {
        this._gamesInfo = [];
        this._canSendNotice = false;
        this._notice = [];
    }
    /**
     * 帧更新
     * @param dt 
     */
    update(dt: number): void {

    }
    /***********公告相关***************/
    /**可收公告了 */
    setCanSend(b: boolean) {
        this._canSendNotice = b;
    }
    /**未能收公告时,采用获取已存起来的 */
    getNoticeNotify(): any {
        return this._notice;
    }
    resetNotices() {
        this._notice = [];
    }

    /**大厅 */
    private proxy_notify_public_notice_message_notify(caller: any) {
        // this._notice.push(caller);

        // console.info(JSON.stringify(caller));

        // if (this._canSendNotice) {
        // this.emit(MHall.HALL_NOTICE_NOTIFY, caller.title, caller.message);
        // }
    }

    /**获取我的代理级别信息返回 */
    onAgentLevelRes(caller: HallServer.GetMyPromoterLevelMessageResponse) {
        AppGame.ins.showConnect(false);
        this.emit(MHall.GET_AGENT_LEVEL_RES, caller);
    }

    /*邮件 */
    private proxy_notify_public_mail_message_notify(caller: ProxyServer.Message.ProxyNotifyNewMailMessage) {
        this.emit(MHall.HALL_MAIL_NOTIFY, caller.userId);
    }
    /*******************************/

    private get_playing_game_info_message_res(caller: HallServer.GetPlayingGameInfoMessageResponse) {
        this.emit(MHall.HAS_PLAYING_GAME_INFO, caller);
    }

    private get_game_room_info_res(caller: HallServer.GetGameMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this._gamesInfo = [];
            caller.gameMessage.forEach(el => {
                let item = new GameInfo();
                item.gameId = el.gameId;
                item.gameIsHot = el.gameIsHot;
                item.gameName = el.gameName;
                item.gameSortId = el.gameSortId;
                item.gameStatus = el.gameStatus;
                item.gameStyle = el.gameType;
                this._gamesInfo.push(item);
                AppGame.ins.roomModel.saveRoomData(el.gameId, el.gameRoomMsg);
            });
            this._gamesInfo.sort((a, b) => {
                if (a.gameSortId > b.gameSortId)
                    return 1;
                else if (a.gameSortId < b.gameSortId)
                    return -1;
                else
                    return 0;
            });
            this.emit(MHall.UPDATA_GAMEINFO, true, "");
            AppGame.ins.mailModel.requestPullMail();
        } else {
            UDebug.Log(caller.errorMsg);
            this.emit(MHall.UPDATA_GAMEINFO, false, caller.errorMsg);
        }
    }

    private get_scroll_msg(data: ProxyServer.Message.NotifyPublicNoticeMessage): void {
        // this.emit(MHall.GETSCROLLERMSG, caller)

        let message = JSON.parse(data.message);
        if (message.type == 0) {
            AppGame.ins.roleModel.requestUpdateScore();
        } else if (message.type == 1) {
            let msg = message.msg;
            for (var i = 0; i < msg.length; i++) {
                NEWS.push(msg[i]["title"] + ":" + msg[i]["content"]);
            }
        } else if (message.type == 2) {
            let roomName = message.roomName;
            if (message.gameType == 3 && message.gameId && message.roomId) {
                let name = UCommon.getClubRoomName(message.gameId, message.roomId,false);
                name && (roomName = name);
            }
            if (message.vip == 0) {
                var b = "恭喜玩家" +
                    UStringHelper.coverName(message.nickName) +
                    "在<color=#fed752>" +
                    roomName +
                    "</color>中<color=#fed752>" +
                    message.cardType +
                    "</color>一把赢得<color=#fed752>" +
                    UStringHelper.getMoneyFormat(message.winScore / COIN_RATE) +
                    "</color>金币";
            } else {
                var b = "恭喜<color=#fed752>VIP" +
                    message.vip +
                    "</color>玩家" +
                    UStringHelper.coverName(message.nickName) +
                    "在" +
                    roomName +
                    "中<color=#fed752>" +
                    message.cardType +
                    "</color>一把赢得<color=#fed752>" +
                    UStringHelper.getMoneyFormat(message.winScore / COIN_RATE) +
                    "</color>金币";
            }
            NEWS.push(b);
        } else if (message.type == 3) {
            let msg = JSON.parse(data.message);
            var title = msg["title"];
            var content = msg["content"];
            AppGame.ins.showUI(ECommonUI.UI_MANDATORY_POPUP, { title, content });
        }

    }

    /**
     * 请求大厅信息
     */
    requestGameHallMessage(): void {
        let msg = new HallServer.GetGameMessage();
        UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL, Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_GAME_ROOM_INFO_REQ, msg);
    }

    /**
     * 根据游戏ID获取游戏信息
     * @param gameType 
     */
    getGameInfo(gameId: EGameType): GameInfo {
        let len = this._gamesInfo.length;
        for (let i = 0; i < len; i++) {
            if (this._gamesInfo[i].gameId == gameId) {
                return this._gamesInfo[i];
            }
        }
        return null;
    }
    //#endregion
    /**
     * 获取游戏入口界面数据
     */
    getGameList(): Array<UIGameItem> {

        let result = [];
        for (const key in cfg_game) {
            if (cfg_game.hasOwnProperty(key)) {
                const element = cfg_game[key];
                let info = this.getGameInfo(element.gametype);
                // if (!info || info.gameStatus == EGameStatus.Close) {
                //     continue;
                // }

                if (!info || info.gameStatus == EGameStatus.Close) {
                    continue;
                }
                let item = new UIGameItem();
                item.gameType = element.gametype;
                item.gameIcon = element.prefabIcon;
                item.gameSpine = element.gameSpineRes;
                item.clubGameSpine = element.clubGameSpineRes;
                item.isBig = element.isFirst;
                item.sort = info['gameSortId'];
                item.onlineNum = AppGame.ins.roomModel.GetGameOnline(item.gameType);
                // if (info&& info['gameStatus'] == EGameStatus.WaitOpen) {
                //     item.gameState =  EGameStatus.WaitOpen;
                // } else {
                //     item.gameState = EGameStatus.Open;
                // }
                // item.gameState = info['gameStatus'];
                item.abbreviateName = element.abbreviateName;
                if (info) {
                    item.isOnline = true;
                    if (info.gameStatus == EGameStatus.WaitOpen) {
                        item.gameState = EGameState.WeiHu;
                    } else {
                        switch (info.gameIsHot) {
                            case EGameHot.Hot:
                                item.gameState = EGameState.Hot;
                                break;
                            case EGameHot.New:
                                item.gameState = EGameState.New;
                                break;
                            case EGameHot.Normal:
                                item.gameState = EGameState.Normal;
                                break;
                        }
                    }

                } else {
                    item.isOnline = false;
                    item.gameState = EGameState.WeiHu;
                }
                result.push(item);
            }
        }
        result.sort((a, b) => {
            let pa = a.sort;
            let pb = b.sort;
            if (a.sort > b.sort)
                return 1;
            else if (pa < pb)
                return -1;
            else {
                return 0;
            }
        });
        return result;
    }

    /**
     * 进入房间
     */
    enterRoomLobby(gameType: EGameType): void {
        UDebug.log("enterRoomLobby-->");
        let cfg = cfg_game[gameType];
        if (!cfg) {
            UDebug.Log("客户端没有对应的游戏->" + gameType)
            return;
        }
        if (!AppGame.ins.offline) {
            let game = this.getGameInfo(gameType);
            if (!game || game.gameStatus == EGameStatus.WaitOpen) {
                AppGame.ins.showTips({ data: ULanHelper.GAME_NOT_OPEN, type: ETipType.onlyone });
                return;
            }
        }
        /**没有房间界面 那么选择游戏配置的第一个房间进入 */
        if (cfg.roomUI == ECommonUI.None) {
            AppGame.ins.roomModel.requestEnterRoom(cfg.defaultRoom, gameType, false);
        } else {
            if (gameType == EGameType.ZJH) {
                AppGame.ins.showUI(cfg.roomUI, gameType, true);
            } else {
                AppGame.ins.showBundleUI(cfg.roomUI, gameType, gameType, true);
            }
        }
    }
    /**请求是否有未完成的游戏 */
    requsetHasLastGame(): void {
        let data = new HallServer.GetPlayingGameInfoMessage();
        UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PLAYING_GAME_INFO_MESSAGE_REQ
            , data);
    }
    /**请求排行榜数据 */
    requestRandData(): void {
        this.emit(MHall.UPDATA_RANK_DATA);
    }
    getActivityData(): { [key: number]: UIActivityItemData } {
        var dt = {};
        dt[0] = new UIActivityItemData();
        dt[0].type = 0;
        dt[0].data = new UIActivityCopyData();
        dt[0].data.url = "http://www.163.com";

        dt[1] = new UIActivityItemData();
        dt[1].type = 1;
        dt[1].data = new UIActivityQRCodeData();
        dt[1].data.url = AppGame.ins.roleModel.spreadUrl;

        return dt;
    }
    /**
    * 获取游戏的更新状态
    */
    getGameUpdateStatus(gameType: EGameType): EGameUpdateStatus {
        return EGameUpdateStatus.Updated;
        var gameHot = UHotManager.Ins.getgameHot(gameType);
        /**没有gamehot认为不需要更新 状态设置为已经更新 */
        if (gameHot) {
            if (gameHot.isupdated) {
                return EGameUpdateStatus.Updated;
            } else if (gameHot.isupdating) {
                return EGameUpdateStatus.Updating;
            } else {
                return EGameUpdateStatus.Update;
            }
        } else {
            return EGameUpdateStatus.Updated;
        }
    }
    /**
     * 游戏更新
     * @param gameType 
     */
    gameUpdate(gameType: EGameType): boolean {
        var gameHot = UHotManager.Ins.getgameHot(gameType);
        if (gameHot) {
            gameHot.hotUpdate();
            return true;
        } else {
            return false;
        }
    }


    /** 发送网络消息*/
    sendMsg(subId: number, data: any, handler: UHandler = null, unlock: boolean = false) {
        UMsgCenter.ins.sendPkg(EGameType.QZLH,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            subId, data, handler, unlock);
    }

    // 申请上庄,取消排队
    sendBanker(tempID: number) {
        var data = {
            applyUserId: AppGame.ins.roleModel.useId,
        }
        this.sendMsg(tempID, data);
    }

    //取消排队
    cancelBanker(tempID: number) {
        var data = {
            cancelUserId: AppGame.ins.roleModel.useId,
        }
        this.sendMsg(tempID, data);
    }

    /**
     * 请求代理等级信息
     * @param reqAgentLevelType 请求类型
     */
    requestAgentLevel(reqAgentLevelType: EAgentLevelReqType = EAgentLevelReqType.default) {
        this._reqAgentLevelType = reqAgentLevelType;
        AppGame.ins.showConnect(true);
        var data = new HallServer.GetMyPromoterLevelMessage();
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_PROMOTER_LEVEL_REQ, data);
    }
}
