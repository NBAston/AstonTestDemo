import Model from "../../../common/base/Model";
import { UZJHRoomItem, UZJHRecords, ToBattle } from "../../../common/base/UAllClass";
import { EGameType, ELevelType, ECommonUI, EAppStatus, ETipType, ERoomKind, EMsgType } from "../../../common/base/UAllenum";
import cfg_game, { gameitem } from "../../../config/cfg_game";
import AppGame from "../../base/AppGame";
import { HallServer, Game, GameServer, GameFriendServer, HallFriendServer, ClubGameServer, ClubHallServer } from "../../../common/cmd/proto";
import UHandler from "../../../common/utility/UHandler";
import UDebug from "../../../common/utility/UDebug";
import UMsgCenter from "../../../common/net/UMsgCenter";
import UDateHelper from "../../../common/utility/UDateHelper";
import { GameRecords, RoomInfo, GameRecordsItem } from "../URoomClass";
import ULanHelper from "../../../common/utility/ULanHelper";
import UAudioManager from "../../../common/base/UAudioManager";
import URandomHelper from "../../../common/utility/URandomHelper";
import cfg_friends from "../../../config/cfg_friends";
import MClubHall from "../club/hall/MClubHall";
import CarryingAmount from "../../../game/common/CarryingAmount";
import RsaKey from "../../../common/utility/RsaKey";
import MBaseGameModel from "../MBaseGameModel";


/**
 * 创建:sq
 * 作用:房间数据逻辑处理
 */
export default class MRoomModel extends Model {
    //游戏记录
    static UPDATA_GAME_RECORDS = "UPDATA_GAME_RECORDS";
    /**获取游戏服信息失败 */
    static SC_GET_GAMESERVER_FAIL = "SC_GET_GAMESERVER_FAIL";
    /**进入房间信息失败 */
    static SC_ENTER_ROOM_FAIL = "SC_ENTER_ROOM_FAIL";
    /**实时战绩 */
    static CLIENT_RECORD_FRIEND = "CLIENT_RECORD_FRIEND";
    //约战记录
    static UPDATA_FRIEND_GAME_RECORDS = "UPDATA_FRIEND_GAME_RECORDS"
    //约战记录明细
    static UPDATA_FRIEND_RECORDS_DETAIL = "UPDATA_FRIEND_RECORDS_DETAIL"
    //开房记录
    static UPDATA_FRIEND_CREATE_RECORDS = "UPDATA_FRIEND_CREATE_RECORDS"
    //房卡不足
    static NO_ENOUGH_ROOM_CARD = "NO_ENOUGH_ROOM_CARD"
    /**游戏广播消息 */
    static GAME_INFORM_MESSAGE = 'GAME_INFORM_MESSAGE';
    //收到好友房游戏列表数据
    static FRIEND_GAME_LIST = "FRIEND_GAME_LIST";
    /**
     * 房间信息
     */
    private _roomInfo: { [key: number]: { [key1: number]: RoomInfo } };
    static ROOM_ID = 0;
    /**
     * 
     */
    private _gameRecords: { [key: number]: GameRecords };

    public _enterGameId: number = -1;
    public _enterRoomId: number = -1;
    public _enterClubId: number = -1;
    public _enterTableId: number = -1;
    public _enterBundleName: string;
    public _enterRoomKind: number = 0;
    public _originalClubId: number = 0;
    
    public _isInGame: boolean = false;

    private _changeNewTable: boolean = false; //换新桌子
    private _exceptTableId: number = -1; //排除掉的桌子id


    //好友房间信息
    public _friendRoomInfo: { [key: number]: { [key1: number]: RoomInfo } };

    resetData(): void {
        this._enterGameId = 0;
        this._enterRoomKind = 0
        this._enterRoomId = 0;
        this._roomInfo = {};
        this._friendRoomInfo = {};
        this._gameRecords = {};
    }

    get GameID(): number {
        return this._enterGameId;
    }

    get BundleName(): string {
        return this._enterBundleName;
    }

    update(dt: number): void {
    }

    /**存储的临时进游戏的数据 等待服务器返回 requestid */
    // private _tempGameId: EGameType = 0;
    init(): void {
        this._roomInfo = {};
        this._gameRecords = {};
        this._friendRoomInfo = {};
        this._enterRoomKind = 0
        //普通房
        UMsgCenter.ins.regester(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PLAY_RECORD_RES,
            new UHandler(this.get_play_record_res, this));
        UMsgCenter.ins.regester(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_PLAY_RECORD_RES,
            new UHandler(this.get_play_club_record_res, this));
        UMsgCenter.ins.regester(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_GAME_SERVER_MESSAGE_RES,
            new UHandler(this.get_game_server_message_res, this));
        UMsgCenter.ins.regester(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER,
            GameServer.SUBID.SUB_S2C_ENTER_ROOM_RES,
            new UHandler(this.enter_room_res, this));

        //好友房
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_GAMES_MESSAGE_RES,
            new UHandler(this.get_game_list_res_friend, this));
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_CREATE_ROOM_MESSAGE_RES,
            new UHandler(this.creat_room_res, this));
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_GAME_SERVER_MESSAGE_RES,
            new UHandler(this.get_game_server_message_res_friend, this));
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER_FRIEND,
            GameFriendServer.SUBID.SUB_S2C_ENTER_ROOM_RES,
            new UHandler(this.enter_room_res_friend, this));

        //实时战绩
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_REAL_TIME_GAME_RECORD_MESSAGE_RES,
            new UHandler(this.record_friend, this));

        //约牌记录
        UMsgCenter.ins.regester(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_MAIN_GAME_RECORD_MESSAGE_RES,
            new UHandler(this.get_friend_play_record_res, this));

        //约牌记录明细
        UMsgCenter.ins.regester(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_DETAIL_GAME_RECORD_MESSAGE_RES,
            new UHandler(this.get_friend_play_record_detail_res, this));

        //开房记录
        UMsgCenter.ins.regester(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_CREATE_ROOM_MESSAGE_RES,
            new UHandler(this.get_create_room_record_res, this));

        /**俱乐部  服务器ip信息*/
        UMsgCenter.ins.regester(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_GAME_SERVER_MESSAGE_RES,
            new UHandler(this.onResClubGameServer, this));

        /**游戏服通道消息  */
        UMsgCenter.ins.regester(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
            GameServer.SUBID.SUB_S2C_MESSAGE_RES,
            new UHandler(this.onResInformMessage, this));

        /**游戏服通道消息 好友房 */
        UMsgCenter.ins.regester(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
            GameServer.SUBID.SUB_S2C_MESSAGE_RES,
            new UHandler(this.onResInformMessage, this));
    }

    /**响应游戏服通道消息 */
    private onResInformMessage(data: any) {
        // AppGame.ins.showConnect(false); 
        let parseData = new RsaKey().Uint8ArrayToString(data.passData);
        UDebug.log('响应游戏服通道消息 parseData => ', JSON.stringify(JSON.parse(parseData)))
        this.emit(MRoomModel.GAME_INFORM_MESSAGE, JSON.parse(parseData));
    }

    /**请求游戏服通道消息 */
    requestInformMessage(str: string) {
        // cc.warn(' 请求游戏服通道消息 param => ', str)
        // AppGame.ins.showConnect(true);
        var data = new GameServer.MSG_CSC_Passageway();
        let passData = new RsaKey().stringToUint8Array(str);
        data.passData = passData;
        if (AppGame.ins.currRoomKind == ERoomKind.Friend) {
            UMsgCenter.ins.sendPkg(0,
                Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND,
                GameServer.SUBID.SUB_C2S_MESSAGE_REQ, data);
        } else {
            UMsgCenter.ins.sendPkg(0,
                Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC,
                GameServer.SUBID.SUB_C2S_MESSAGE_REQ, data);
        }
        
    }

    private enter_room_res(caller: GameServer.MSG_S2C_UserEnterMessageResponse): void {
        let cfg = cfg_game[this._enterGameId];
        if (caller.retCode == 0) {
            AppGame.ins.gamebaseModel.alreadyEnterGame();
            if (cfg == null) return;
            if (cfg.gameName !== "炸金花") {
                UAudioManager.ins.preload(this._enterGameId);
            }
        } else {
            UDebug.Log(caller.errorMsg);
            this.emit(MRoomModel.SC_ENTER_ROOM_FAIL, caller.retCode, caller.errorMsg);
        }
    }

    private get_play_record_res(caller: HallServer.GetPlayRecordMessageResponse) {
        cc.log("请求金币场游戏记录返回：", caller);
        if (caller.retCode == 0) {
            let item = this._gameRecords[caller.gameId];

            if (!item) {
                item = new GameRecords();
                this._gameRecords[caller.gameId] = item;
            }
            item.canRequest = false;

            let ar = [];
            caller.detailInfo.forEach(element => {
                let item = new GameRecordsItem();
                item.gameNo = element.gameRoundNo;
                item.gameendtime = element.gameEndTime;
                item.roomtypeid = element.roomId;
                item.winlosescore = element.winLoseScore;
                ar.push(item);
            });
            item.records = ar;
            this.emit(MRoomModel.UPDATA_GAME_RECORDS);
        } else {

        }
    }

    /**
     * @description  请求游戏记录返回 俱乐部
     * @param caller 
     */
    private get_play_club_record_res(caller: ClubHallServer.GetPlayRecordMessageResponse) {
        cc.log("请求游戏记录返回俱乐部:", caller);
        if (caller.retCode == 0) {
            let item = this._gameRecords[caller.gameId];
            if (!item) {
                item = new GameRecords();
                this._gameRecords[caller.gameId] = item;
            }
            item.canRequest = false;
            let ar = [];
            caller.detailInfo.forEach(element => {
                let item = new GameRecordsItem();
                item.gameNo = element.gameRoundNo;
                item.gameendtime = element.gameEndTime;
                item.roomtypeid = element.roomId;
                item.winlosescore = element.winLoseScore;
                ar.push(item);
            });
            item.records = ar;
            this.emit(MRoomModel.UPDATA_GAME_RECORDS, caller);
        } else {

        }
    }

    /**
     * 保存房间数据
     * @param gameId 
     * @param rooms 
     */
    saveRoomData(gameId: number, rooms: Array<HallServer.IGameRoomMessage>): void {
        let gameRoom = this._roomInfo[gameId];
        if (!gameRoom) {
            gameRoom = {};
            this._roomInfo[gameId] = gameRoom;
        }
        rooms.forEach(element => {
            let item = new RoomInfo();
            for (const key in element) {
                if (element.hasOwnProperty(key)) {
                    item[key] = element[key];
                }
            }
            item.gameId = gameId
            gameRoom[item.roomId] = item;
        });
    }

    /**
     * 保存好友房间数据
     * @param gameId 
     * @param rooms 
     */
    saveFriendRoomData(gameId: number, room: HallFriendServer.IGameMessage): void {
        let gameRoom = this._friendRoomInfo[gameId];
        if (!gameRoom) {
            gameRoom = {};
            this._friendRoomInfo[gameId] = gameRoom;
        }

        let item = new RoomInfo();
        for (const key in room) {
            if (room.hasOwnProperty(key)) {
                item[key] = room[key];
            }
        }
        item.gameId = gameId
        gameRoom[item.roomId] = item;
    }

    GetGameOnline(gameId: number): number {
        let gameRoom = this._roomInfo[gameId];
        let count = 0;
        if (gameRoom) {
            for (const key in gameRoom) {
                if (gameRoom.hasOwnProperty(key)) {
                    let el = gameRoom[key];
                    el.online = URandomHelper.randomBetween(50, 150);
                    count += el.online;
                }
            }
        } else {
            count = URandomHelper.randomBetween(50, 150);;
        }
        return count;
    }
    /**
     * 根据游戏id和房间id获取房间数据
     * @param gameId 
     * @param roomId 
     */
    getRoomData(gameId: number, roomId): RoomInfo {
        return this._roomInfo[gameId][roomId];
    }

    /**
     * 获取游戏房间id列表数据
     * @param gameId 游戏id
     * @returns 对应游戏房间id列表数据
     */
    getRoomIdList(gameId: number): Array<number> {
        let arr = [];
        let infos = this._roomInfo[gameId];
        if (infos) {
            for (const key in infos) {
                if (Object.prototype.hasOwnProperty.call(infos, key)) {
                    arr.push(Number(key));
                }
            }
        }
        return arr;
    }

    /**
     * 获取房间信息
     */
    getRoomListInfo(gameId: EGameType): Array<UZJHRoomItem> {
        let roomInfo = this._roomInfo[gameId];
        if (!roomInfo) {
            /**兼顾 那些服务器没有实现的房间*/
            let cfg = cfg_game[gameId];
            let data = new Array<UZJHRoomItem>();
            for (const key in cfg.rooms) {
                if (cfg.rooms.hasOwnProperty(key)) {
                    const element = cfg.rooms[key];
                    let a = new UZJHRoomItem();
                    a.dizu = 30;
                    a.zhunru = 100;
                    a.type = element.roomId;
                    a.minScore = 40;
                    a.maxScore = 40;
                    a.status = 1;
                    a.online = 100;
                    data.push(a);
                }
            }
            return data;
        } else {
            let data = new Array<UZJHRoomItem>();
            for (const key in roomInfo) {
                if (roomInfo.hasOwnProperty(key)) {
                    const element = roomInfo[key]; 
                    let item = new UZJHRoomItem();
                    item.dizu = element.floorScore;//ceilScore
                    item.zhunru = element.enterMinScore;
                    item.type = element.roomId;
                    item.status = element.status;
                    item.minScore = element.enterMinScore;
                    item.maxScore = element.enterMaxScore;//最大进入金额的
                    item.online = element.online;
                    item.jettons = element.jettons;
                    item.maxJettonScore = element.maxJettonScore;
                    data.push(item);
                }
            }
            return data;
        }
    }
    /**
     * 获取记录信息
     */
    requestGameRecords(gameType: EGameType): void {
        let data = new HallServer.GetPlayRecordMessage();
        data.gameId = gameType;
        let records = this._gameRecords[gameType];
        if (!records) {
            records = new GameRecords();
            this._gameRecords[gameType] = records;
        }
        records.canRequest = true;/** 测试阶段 先全部请求*/
        if (records.canRequest) {
            UMsgCenter.ins.sendPkg(0,
                Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
                Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PLAY_RECORD_REQ, data);
        } else {
            /**如果有数据 那么先 */
            this.emit(MRoomModel.UPDATA_GAME_RECORDS);
        }
        // this.emit(MRoomModel.UPDATA_GAME_RECORDS);
    };

    /**
     * @description 请求俱乐部游戏记录
     * @param gameType 
     */
    requestClubGameRecords(gameType: EGameType) {
        let data = new ClubHallServer.GetPlayRecordMessage();
        data.gameId = gameType;
        data.lastGameEndTime = "";
        data.clubId = AppGame.ins.currClubId;
        let records = this._gameRecords[gameType];
        if (!records) {
            records = new GameRecords();
            this._gameRecords[gameType] = records;
        }
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_PLAY_RECORD_REQ, data);
    };
    /**
     * 进入房间
     * @param roomType 
     */
    requestEnterRoom(roomType: number, gameType: EGameType, fromReconnet: boolean = false, roomKind: ERoomKind = ERoomKind.Normal, clubId: number = 0, tableId: number = -1, originalClubId: number = 0): void {
        let cfg = cfg_game[gameType];
        if (!cfg) {
            throw new Error("没有对用的游戏配置->" + gameType);
        }
        let roomdata: any = {};
        roomdata = this.getRoomData(gameType, roomType);
        if (!roomdata) {
            AppGame.ins.showTips({ data: ULanHelper.GAME_NOT_OPEN, type: ETipType.onlyone });
            return;
        }
        if (!fromReconnet) {
            if (roomdata.enterMinScore > 0 && roomdata.enterMinScore > AppGame.ins.roleModel.score) {
                AppGame.ins.showUI(ECommonUI.NewMsgBox, { type: 1, data: ULanHelper.PLAYER_FENSHU_BUZU });
                return;
            }
        }

        /**进入房间的时候先加载 资源，然后再发送进入游戏的信息 */
        this._enterGameId = gameType;
        this._enterRoomId = roomType;
        this._enterClubId = clubId;
        this._enterTableId = tableId;
        this._originalClubId = originalClubId;
        if (this._originalClubId) {
            this._enterClubId = this._originalClubId;
        }
        this._enterBundleName = cfg.bundleName;
        this._enterRoomKind = roomKind;
        let data = new ToBattle();
        data.roomData = roomdata;
        data.roomData.roomKind = roomKind;
        data.fromReconnet = fromReconnet;
        AppGame.ins.loadGameScene(gameType, data, UHandler.create(() => {
            AppGame.ins.appStatus.status = EAppStatus.Game;
            AppGame.ins.currRoomKind = roomKind;
            AppGame.ins.currClubId = this._enterClubId;
            AppGame.ins.currClubTableId = tableId;
            if (roomKind == ERoomKind.Club) {
                AppGame.ins.clubHallModel.lastClubGameId = gameType;
                AppGame.ins.clubHallModel.lastClubId = this._enterClubId;
                AppGame.ins.closeUI(ECommonUI.CLUB_ROOMINFO);
                AppGame.ins.closeUI(ECommonUI.CLUB_HALL);
            }
           
        }, this));
    }

   /**
    * 匹配 金币场 请求游戏服务信息
    * @param changeNewTable 是否需要换桌
    * @param exceptTableId 排除的桌子id（上一局桌子id）
    */
    requestMatch(changeNewTable: boolean = false, exceptTableId: number = -1): void {
        this._changeNewTable = changeNewTable;
        this._exceptTableId = exceptTableId;
        if (AppGame.ins.currRoomKind == ERoomKind.Normal) {
            AppGame.ins.gamebaseModel.alreadExitGame();
            let data = new HallServer.GetGameServerMessage();
            data.gameId = this._enterGameId;
            data.roomId = this._enterRoomId;
            UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
                Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_GAME_SERVER_MESSAGE_REQ,
                data);
        } else if (AppGame.ins.currRoomKind == ERoomKind.Club) {
            AppGame.ins.roomModel.requestClubGameServer(true);
        }
    }

    /**金币场 响应游戏服务信息 */
    private get_game_server_message_res(caller: HallServer.GetGameServerMessageResponse): void {
        if (caller.retCode == 0) {
            MRoomModel.ROOM_ID=caller.roomId;
            UMsgCenter.ins.setRunGame(this._enterGameId);
            let request = new GameServer.MSG_C2S_UserEnterMessage();
            request.gameId = caller.gameId;
            request.roomId = caller.roomId;
            request.dynamicPassword = AppGame.ins.LoginModel.gamePass;
            request.clubId = 0;
            request.tableId = -1;
            request.exceptTableId = this._exceptTableId;
            if (caller.gameId == 420 || caller.gameId == 450) {
                request.curTakeScore = CarryingAmount.curTakeScore;
                request.bAutoSetScore = CarryingAmount.bAutoSetScore;
            }
            UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER, GameServer.SUBID.SUB_C2S_ENTER_ROOM_REQ, request);
        } else {
            this.emit(MRoomModel.SC_GET_GAMESERVER_FAIL, caller);
        }
    }


    /**
     * 获取游戏的records
     * @param gameType 
     */
    getRecords(gameType: EGameType): Array<UZJHRecords> {
        let data = this._gameRecords[gameType];
        if (data) {
            let cfg = cfg_game[gameType];
            let ar = [];
            let idx = 0;
            let len = data.records.length;
            const maxLen = 10;
            for (let i = 0; i < len; i++) {
                if (i >= maxLen) break;
                const element = data.records[i];
                let item = new UZJHRecords();
                item.biaohao = element.gameNo;
                item.rank = i + 1;
                item.room = cfg.rooms[element.roomtypeid].roomName;
                item.time = element.gameendtime;
                item.yinli = element.winlosescore;
                ar.push(item);
            }
            return ar;
        }
        return [];
    }

    /////////////////////////////////////////////////////好友房//////////////////////////////////////////

    /**实时战绩返回 */
    private record_friend(caller: HallFriendServer.GetFriendRoomRTGameRecordMessageResponse) {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MRoomModel.CLIENT_RECORD_FRIEND, caller)
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }

    //接收好友房列表
    private get_game_list_res_friend(caller: HallFriendServer.GameListMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            caller.gameMessages.forEach(el => {
                this.saveFriendRoomData(el.gameId, el);
            });
             //通知成功收到列表
            this.emit(MRoomModel.FRIEND_GAME_LIST);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }

    /**
     * 创建房间返回
     */
    private creat_room_res(caller: HallFriendServer.CreateRoomMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            AppGame.ins.roleModel.saveRoomCard(caller.afterRoomCard);
            this.requestEnterRoomFriend(caller.roomId);
        } else if (caller.retCode == 2) {
            this.emit(MRoomModel.NO_ENOUGH_ROOM_CARD, caller.errorMsg);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }

    /**
     * 请求进入房间返回
     */
    private enter_room_res_friend(caller: GameFriendServer.MSG_S2C_UserEnterMessageResponse): void {
        if (caller.retCode == 0) {

        } else {
            this.emit(MRoomModel.SC_ENTER_ROOM_FAIL, caller.retCode, caller.errorMsg);
        }
    }

    /**
     * 请求游戏服务信息返回
     */
    private get_game_server_message_res_friend(caller: HallFriendServer.GetGameServerMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            MRoomModel.ROOM_ID=caller.roomId;
            AppGame.ins.roomModel._enterGameId = caller.gameId;
            AppGame.ins.roomModel._enterRoomId = caller.roomId;
            AppGame.ins.roomModel._enterBundleName = cfg_friends[caller.gameId].bundleName
            let data = new ToBattle();
            if (AppGame.ins.roomModel._friendRoomInfo[caller.gameId] == undefined || AppGame.ins.roomModel._friendRoomInfo[caller.gameId][0] == undefined) {
                throw new Error(`sorry,房间信息缺失，请检查相关配置，请求进入房间返回 gameid:${caller.gameId}`)
            }
            data.roomData = AppGame.ins.roomModel._friendRoomInfo[caller.gameId][0];
            data.roomData.roomKind = ERoomKind.Friend
            data.roomData.roomId = caller.roomId;
            data.fromReconnet = false;
            AppGame.ins.closeUI(ECommonUI.UI_CREAT_ROOM);
            AppGame.ins.closeUI(ECommonUI.UI_ENTER_ROOM);
            AppGame.ins.loadGameScene(caller.gameId, data, UHandler.create(() => {
                AppGame.ins.appStatus.status = EAppStatus.Game;
                AppGame.ins.currRoomKind = ERoomKind.Friend;
                //发送登录包
                UMsgCenter.ins.setRunGame(caller.gameId);
                let request = new GameFriendServer.MSG_C2S_UserEnterMessage();
                request.gameId = caller.gameId;
                request.roomId = caller.roomId;
                if (caller.gameId == 420 || caller.gameId == 450) {//梭哈、德州使用当前携带金币
                    request.curTakeScore = CarryingAmount.curTakeScore;
                    request.bAutoSetScore = CarryingAmount.bAutoSetScore;
                }
                request.dynamicPassword = AppGame.ins.LoginModel.gamePass;
                UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER_FRIEND, GameFriendServer.SUBID.SUB_C2S_ENTER_ROOM_REQ, request);
            }, this));
        } else {
            let str = caller.errorMsg;
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: 1, data: str, handler: UHandler.create((() => {
                }))
            });
        }
    }

    /**请求实时战绩 */
    requestRecord(userGameKindId: string) {
        AppGame.ins.showConnect(true);
        var data = new HallFriendServer.GetFriendRoomRTGameRecordMessage();
        data.userGameKindId = userGameKindId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_REAL_TIME_GAME_RECORD_MESSAGE_REQ, data);
    }

    /**
     * 请求创建房间
     */
    requestCreatRoom(gameId, gameName, roundNum, playDuration, autoStart, playerNumLimit, ipLimit, addScoreLimit, floorScore, ceilScore, chatLimit, extent = null): boolean {
        AppGame.ins.showConnect(true);
        var data = new HallFriendServer.CreateRoomMessage();
        data.userId = AppGame.ins.roleModel.useId;
        data.roomMessage = new HallFriendServer.RoomMessage();
        data.roomMessage.gameId = gameId;
        data.roomMessage.gameName = gameName;
        data.roomMessage.roundNum = roundNum;
        data.roomMessage.playDuration = playDuration * 60;
        data.roomMessage.autoStart = autoStart;
        data.roomMessage.playerNumLimit = playerNumLimit;
        data.roomMessage.ipLimit = ipLimit;
        data.roomMessage.addScoreLimit = addScoreLimit;
        data.roomMessage.floorScore = floorScore * 100;
        data.roomMessage.ceilScore = ceilScore * 100;
        data.roomMessage.chatLimit = chatLimit;

        if (extent) {
            data.roomMessage.extent = JSON.stringify(extent);
        }
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_CREATE_ROOM_MESSAGE_REQ, data);
        return true;
    }

    //请求好友房间信息
    requestEnterRoomFriend(roomId: number) {
        AppGame.ins.showConnect(true);
        var data = new HallFriendServer.GetGameServerMessage();
        data.roomId = roomId
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_GAME_SERVER_MESSAGE_REQ, data);
    }

    //请求好友房间列表
    requestGameFriendList(): boolean {
        AppGame.ins.showConnect(true);
        var data = new HallFriendServer.GameListMessage();
        data.userId = AppGame.ins.roleModel.useId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_GAMES_MESSAGE_REQ, data);
        return true;
    }

    //请求约牌记录
    requestFriendRcord(startDate: string, endDate: string, gameId: number, lastGameEndTime: string): boolean {
        AppGame.ins.showConnect(true);
        var data = new HallFriendServer.GetFriendRoomMainGameRecordMessage();
        data.startDate = startDate
        data.endDate = endDate
        data.gameId = gameId
        data.lastGameEndTime = lastGameEndTime
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_MAIN_GAME_RECORD_MESSAGE_REQ, data);
        return true;
    }

    //请求约牌记录详情
    requestFriendRcordDetail(mainId: string): boolean {
        AppGame.ins.showConnect(true);
        var data = new HallFriendServer.GetFriendRoomDetailGameRecordMessage();
        data.mainId = mainId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_DETAIL_GAME_RECORD_MESSAGE_REQ, data);
        return true;
    }

    //请求创建房间记录
    requestCreateRoomRcord() {
        AppGame.ins.showConnect(true);
        var data = new HallFriendServer.GetFriendRoomCreateRoomMessage();
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_CREATE_ROOM_MESSAGE_REQ, data);
        return true;
    }

    //收到创建房间记录
    get_create_room_record_res(caller: HallFriendServer.GetFriendRoomCreateRoomMessageResponse) {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MRoomModel.UPDATA_FRIEND_CREATE_RECORDS, caller.roomRecordInfo);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }


    //收到约牌记录
    get_friend_play_record_res(caller: HallFriendServer.GetFriendRoomMainGameRecordMessageResponse) {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MRoomModel.UPDATA_FRIEND_GAME_RECORDS, caller.detailInfo);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }

    //收到约牌记录明细
    get_friend_play_record_detail_res(caller: HallFriendServer.GetFriendRoomDetailGameRecordMessageResponse) {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MRoomModel.UPDATA_FRIEND_RECORDS_DETAIL, caller.detailInfo);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }

    ////******************************俱乐部************************************////

    /**俱乐部 响应游戏服务器IP */
    private onResClubGameServer(data: ClubHallServer.GetGameServerMessageResponse) {
        AppGame.ins.showConnect(false);
        if (data.retCode == 0) {
            if (this._isInGame) {
                UMsgCenter.ins.setRunGame(data.gameId);
                let request = new GameServer.MSG_C2S_UserEnterMessage();
                request.gameId = data.gameId;
                request.roomId = data.roomId;
                request.clubId = data.clubId;
                request.tableId = this._enterTableId;
                request.exceptTableId = -1;
                request.originalClubId = data.originalClubId;
                request.dynamicPassword = AppGame.ins.LoginModel.gamePass;
                MRoomModel.ROOM_ID=data.roomId;
                if (data.gameId == 420 || data.gameId == 450) {//梭哈、德州使用当前携带金币
                    request.curTakeScore = CarryingAmount.curTakeScore;
                    request.bAutoSetScore = CarryingAmount.bAutoSetScore;
                }
                UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER, GameServer.SUBID.SUB_C2S_ENTER_ROOM_REQ, request);
            } else {
                AppGame.ins.clubHallModel.requestClubRoomInfo(data.gameId, data.roomId, data.clubId);
            }
        } else {
            if (AppGame.ins.clubHallModel.isShowTip) {
                AppGame.ins.showTips(data.errorMsg);
            }
            if (!this._isInGame) {
                AppGame.ins.clubHallModel.emit(MClubHall.CLUB_CLEAR_TABLE);
            }
        }
        AppGame.ins.clubHallModel.isShowTip = true;
    }

    /**俱乐部 请求游戏服务器IP */
    requestClubGameServer(isInGame: boolean = false, gameId: number = -1, roomId: number = -1, clubId: number = -1) {
        this._isInGame = isInGame;
        let data = new ClubHallServer.GetGameServerMessage;
        if (isInGame) {
            data.gameId = this._enterGameId;
            data.roomId = this._enterRoomId;
            data.clubId = this._enterClubId;
        } else {
            data.gameId = gameId;
            data.roomId = roomId;
            data.clubId = clubId;
        }
        AppGame.ins.showConnect(true);
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_GAME_SERVER_MESSAGE_REQ, data);
    }


}
