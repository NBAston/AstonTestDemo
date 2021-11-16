import Model from "../../common/base/Model";
import { RoomPlayerInfo, EUSER_STATUS } from "./URoomClass";
import UMsgCenter from "../../common/net/UMsgCenter";
import { Game, GameFriendServer, GameServer } from "../../common/cmd/proto";
import UHandler from "../../common/utility/UHandler";
import AppGame from "../base/AppGame";
import { ELeftType, ECommonUI, ELevelType, EAppStatus, ERoomKind, InformMessageType } from "../../common/base/UAllenum";
import cfg_head from "../../config/cfg_head";
import UPingPong from "../../common/net/UPingPong";
import UDebug from "../../common/utility/UDebug";
import MRoomModel from "./room_zjh/MRoomModel";

/**
 * 创建:sq
 * 处理房间单个房间的数据信息和逻辑
 */
export default class MBaseGameModel extends Model {

    /**服务器推送的玩家信息 */
    static SC_TS_ROOM_PLAYERINFO = "SC_TS_ROOM_PLAYERINFO";
    /**服务器推送玩家状态变化 */
    static SC_TS_PLAYER_STATE_CHANGE = "SC_TS_PLAYER_STATE_CHANGE";
    /** */
    static SC_TS_PLAYER_LEFT_ROOM = "SC_TS_PLAYER_LEFT_ROOM";

    static CC_LONG_TIME_NO_PONG = "CC_LONG_TIME_NO_PONG";

    static SC_TS_ENTER_GAME = "SC_TS_ENTER_GAME";

    static SC_UPDATE_SETTING_PANEL = "SC_UPDATE_SETTING_PANEL";
    /**好友房聊天消息监听 */
    static SC_UPDATE_CHAT_MESSAGE = "SC_UPDATE_CHAT_MESSAGE";

    /**更新好友房聊天房间ID */
    static SC_UPDATE_CHAT_ROOM_ID = "SC_UPDATE_CHAT_ROOM_ID";
    static SET_CLOCK_RED_COLOR = "SET_CLOCK_RED_COLOR";

    /**
     * 房间里面玩家的信息
     */
    private _players: { [key: number]: RoomPlayerInfo };
    _chatMessages:Array<chatData> = [];
    _friendRoomId:number = 0;
    private _ping: UPingPong;
    private _enterGame: boolean;
    init(): void {
        this._players = {};
        this._ping = new UPingPong(this.send_gameserver_ping, 5, 20);
        this._ping.on("longNoPong", this.long_Time_No_Pong, this);
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER, GameServer.SUBID.SUB_S2C_USER_ENTER_NOTIFY,
            new UHandler(this.user_enter_notify, this));
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER, GameServer.SUBID.SUB_S2C_USER_STATUS_NOTIFY,
            new UHandler(this.user_status_notify, this));
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER, GameServer.SUBID.SUB_S2C_USER_LEFT_RES,
            new UHandler(this.user_left_res, this));
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER, Game.Common.MESSAGE_CLIENT_TO_SERVER_SUBID.KEEP_ALIVE_RES, new UHandler(this.keep_alive_res, this));

        /**服务器还没搞 不是这个 */
        /**公告 */
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER, GameServer.SUBID.SUB_GF_SYSTEM_MESSAGE, new UHandler(this.gf_system_message, this));
        
        /**好友房 */
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER_FRIEND, GameFriendServer.SUBID.SUB_S2C_USER_ENTER_NOTIFY,
            new UHandler(this.user_enter_notify, this));
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER_FRIEND, GameFriendServer.SUBID.SUB_S2C_USER_STATUS_NOTIFY,
            new UHandler(this.user_status_notify, this));
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER_FRIEND, GameFriendServer.SUBID.SUB_S2C_USER_LEFT_RES,
            new UHandler(this.user_left_res, this));
        AppGame.ins.roomModel.on(MRoomModel.GAME_INFORM_MESSAGE, this.saveChatMessageInfo, this);

    }
    resetData(): void {
        this._players = {};
    }
    update(dt: number): void {
        if (this._ping) this._ping.update(dt);
    }
    private keep_alive_res(): void {
        this._ping.recivePong();
    }
    private long_Time_No_Pong(): void {
        this.emit(MBaseGameModel.CC_LONG_TIME_NO_PONG);
        // AppGame.ins.showUI(ECommonUI.MsgBox, {
        //     type: 1, data: ULanHelper.BATTLE_DISSCONNECT, handler: UHandler.create(() => {
        //         if (AppGame.ins.appStatus.status == EAppStatus.Game)
        //             AppGame.ins.loadLevel(ELevelType.Hall, AppGame.ins.roomModel.GameID);
        //     }, this)
        // });
    }
    private send_gameserver_ping(data: any): void {
        UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER, Game.Common.MESSAGE_CLIENT_TO_SERVER_SUBID.KEEP_ALIVE_REQ, data)
    }
    private user_left_res(caller: GameServer.MSG_C2S_UserLeftMessageResponse): void {
        this.emit(MBaseGameModel.SC_TS_PLAYER_LEFT_ROOM, caller);
        if (caller.retCode == 0) {
            this._players = {};
            if (caller.type == ELeftType.ReturnToRoom) {
                this._ping.stopHeart();
            }
        }
    }
    /**进入房间 */
    private user_enter_notify(caller: GameServer.MSG_S2C_UserBaseInfo): void {
        let player = this._players[caller.userId];
        if (!player) {
            player = new RoomPlayerInfo();
            this._players[caller.userId] = player;
        }
        player.account = caller.account || "";
        player.chairId = caller.chairId || 0;
        player.headId = caller.headId || 0;
        player.headImgUrl = caller.headImgUrl || "";
        player.location = caller.location || "";
        player.nickName = caller.nickName || "";
        player.score = caller.score || 0;
        player.tableId = caller.tableId || 0;
        player.userId = caller.userId || 0;
        player.userStatus = caller.userStatus || 0;
        player.vipLevel = caller.vip || 0;
        player.headboxId = caller.headboxId || 0;
        let cfg = cfg_head[caller.headId];
        if (cfg)
            player.sex = cfg.sex;
        else
            player.sex = 0;
        
        this.emit(MBaseGameModel.SC_TS_ROOM_PLAYERINFO, player);
    }
    /**进入房间 */
    private user_status_notify(caller: GameServer.MSG_S2C_GameUserStatus): void {
        let player = this._players[caller.userId];
        if (!player) {
            player = new RoomPlayerInfo();
            this._players[caller.userId] = player;
        }
        player.userStatus = caller.usStatus;
        this.emit(MBaseGameModel.SC_TS_PLAYER_STATE_CHANGE, caller.userId, caller.usStatus,caller);
    }

    /**请求玩家状态准备 */
    requestuser_ready(handler?: UHandler): void {

        let data = new GameServer.MSG_C2S_UserReadyMessage();
        UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER,
            GameServer.SUBID.SUB_C2S_USER_READY_REQ,
            data);
    }
    /**请求 */
    requestLeft(gameId: number, roomId: number, useId: number, leftPos: ELeftType): void {
        let data = new GameServer.MSG_C2S_UserLeftMessage();
        data.gameId = gameId;
        data.userId = useId;
        data.roomId = roomId;
        data.type = leftPos;
        if (leftPos == ELeftType.ReturnToRoom && !this._enterGame) {
            return;
        }
        UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER,
            GameServer.SUBID.SUB_C2S_USER_LEFT_REQ,
            data);
    }

     /**好友房请求离开 */
     requestLeftHy(gameId: number, roomId: number, useId: number, leftPos: ELeftType): void {
        let data = new GameFriendServer.MSG_C2S_UserLeftMessage();
        data.gameId = gameId;
        data.userId = useId;
        data.roomId = roomId;
        data.type = leftPos;
        // if (leftPos == ELeftType.ReturnToRoom && !this._enterGame) {
        //     return;
        // }
        UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER_FRIEND,
            GameFriendServer.SUBID.SUB_C2S_USER_LEFT_REQ,
            data);
    }

    /**已经进入游戏 */
    alreadyEnterGame(): void {
        this._enterGame = true;
        this.resetData();
        this._ping.startHeart(AppGame.ins.LoginModel.session);
        this.emit(MBaseGameModel.SC_TS_ENTER_GAME);
    }
    alreadExitGame(): void {
        this._enterGame = false;
        this._ping.stopHeart();
    }
    /**
     * 根据玩家id获取房间玩家信息
     * @param userId 
     */
    getRoomPlayerInfo(userId: number): RoomPlayerInfo {
        return this._players[userId];
    }
    /**
     * 获取玩家信息 
     * 不要做修改
     */
    getAllPlayerInfo(): { [key: number]: RoomPlayerInfo } {
        return this._players;
    }

    /**服务器还没搞 不是这个 */
    private gf_system_message(caller: GameServer.MSG_S2C_SystemMessage) {

    }

    // 保存用户发送的聊天信息
    private saveChatMessageInfo(jsonData: any) {
        if(jsonData && jsonData.hasOwnProperty('type') && jsonData.type == InformMessageType.gameChatProp && AppGame.ins.currRoomKind == ERoomKind.Friend) {
            var data = jsonData.msg;
            var infoData = new chatData();
            infoData.sendUserNickName = `${data.hasOwnProperty('sendUserNickName')?data.sendUserNickName:""}`
            infoData.sendUserId = `${data.sendUserId}`;
            infoData.message = `${data.message}`;
            infoData.faceId = data.faceId;
            infoData.sendUserHeadId = data.sendUserHeadId;
            infoData.sendUserHeadImgUrl = data.sendUserHeadImgUrl;
            infoData.friendRoomId = AppGame.ins.gamebaseModel._friendRoomId;
            this._chatMessages.push(infoData);
        }
    }

    getFriendRoomChatMessage(roomId: number) {
        if(this._chatMessages.length > 0) {
            return this._chatMessages.filter(x=>x.friendRoomId == roomId);
        }
        return [];
    }
}

export class chatData {
    sendUserId: string;
    sendUserNickName: string;
    message: string;
    faceId: number;
    type: number;
    sendUserHeadId: number;
    friendRoomId: number;
    sendUserHeadImgUrl:string;
}
