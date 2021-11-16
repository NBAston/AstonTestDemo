import Model from "../../../../common/base/Model";
import { ClubGameServer, ClubHallServer, Game } from "../../../../common/cmd/proto";
import UMsgCenter from "../../../../common/net/UMsgCenter";
import UDebug from "../../../../common/utility/UDebug";
import UHandler from "../../../../common/utility/UHandler";
import AppGame from "../../../base/AppGame";
import club_mysuperior_info from "../myClub/club_mysuperior_info";
import { signInner } from "../../../../common/net/USerializer";
import CarryingAmount from "../../../../game/common/CarryingAmount";
import { BrGameList } from "../../../../config/cfg_common";

export default class MClubHall extends Model {

    static MY_CLUB_RES = 'MY_CLUB_RES';
    static CLUB_ROOM_INFO_RES = 'CLUB_ROOM_INFO_RES';
    static CLUB_BRC_ROOM_INFO_RES = 'CLUB_BRC_ROOM_INFO_RES';
    static CLUB_APPLY_QQ_RES = 'CLUB_APPLY_QQ_RES';
    static CLUB_MYSUPERIORINFO_RES = 'CLUB_MYSUPERIORINFO_RES';
    static CLUB_CLEAR_TABLE = 'CLUB_CLEAR_TABLE';
    static CLUB_REWARD_RECORD = 'CLUB_REWARD_RECORD';

    /**最后玩的俱乐部游戏id */
    public lastClubGameId: number = -1;
    /**最后进入的俱乐部id */
    public lastClubId: number = -1;
    /**最后进入的房间类型下标 */
    public lastRoomIndex: number = 0;
    /**是否展示我的俱乐部响应错误提示 */
    public isShowTip: boolean = true;
    /**我的俱乐部响应后继续请求 */
    public myClubReqTag: boolean = false;
    /**上庄需要 */
    public applyBankerScoreTemp: number = 200000;
    /**是否自动刷新桌子 */
    public isAutoRefreshTable: boolean = true;

    init(): void {
        /**我的俱乐部 */
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_GAME_MESSAGE_RES,
            new UHandler(this.onResMyClub, this));

        /**俱乐部房间信息 */
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER_CLUB,
            ClubGameServer.SUBID.SUB_S2C_GET_ROOM_INFO_RES,
            new UHandler(this.onResClubRoomInfo, this));

        /**响应俱乐部百人场房间信息 */
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER_CLUB,
            ClubGameServer.SUBID.SUB_S2C_GET_GAME_INFO_RES,
            new UHandler(this.onResClubBrcRoomInfo, this));

        /**俱乐部申请QQ */
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_APPLY_CLUB_INFO_RES,
            new UHandler(this.onResApplyQQ, this));

        /**我的俱乐部*我的上级信息 */
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_CLUB_PROMOTER_RES,
            new UHandler(this.onMySuperiorInfo, this));

        /**俱乐部活动奖励记录 */
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_ACTIVITY_REWARD_RES,
            new UHandler(this.onResRewardRecord, this));
    }

    resetData(): void {

    }

    update(dt: number): void {
    }

    /**响应俱乐部活动奖励记录 */
    onResRewardRecord(data: ClubHallServer.GetClubActivityRewardMessageResponse) {
        AppGame.ins.showConnect(false);
        this.emit(MClubHall.CLUB_REWARD_RECORD, data);
        if (data.retCode == 0) {

        } else {
            AppGame.ins.showTips(data.errorMsg);
        }
    }

    /**响应俱乐部房间信息 */
    onResClubRoomInfo(data: ClubGameServer.MSG_S2C_GetRoomInfoResponse) {
        AppGame.ins.showConnect(false);
        if (data.retCode == 0) {
            this.emit(MClubHall.CLUB_ROOM_INFO_RES, data);
        } else {
            this.isShowTip && AppGame.ins.showTips(data.errorMsg);
            this.emit(MClubHall.CLUB_CLEAR_TABLE);
        }
    }

    /**响应俱乐部百人场房间信息 */
    onResClubBrcRoomInfo(data: ClubGameServer.MSG_S2C_GetGameInfoResponse) {
        AppGame.ins.showConnect(false);
        if (data.retCode == 0) {
            this.emit(MClubHall.CLUB_BRC_ROOM_INFO_RES, data);
        } else {
            this.isShowTip && AppGame.ins.showTips(data.errorMsg);
        }
    }

    /**响应我的俱乐部 */
    onResMyClub(data: ClubHallServer.GetMyClubGameMessageResponse) {
        AppGame.ins.showConnect(false);
        if (data.retCode == 0) {
            this.emit(MClubHall.MY_CLUB_RES, data);
        } else {
            this.isShowTip && AppGame.ins.showTips(data.errorMsg);
        }
    }

    /**响应俱乐部申请QQ  */
    onResApplyQQ(data: ClubHallServer.GetApplyClubInfoMessageResponse) {
        if (data.retCode == 0) {
            this.emit(MClubHall.CLUB_APPLY_QQ_RES, data);
        } else {
            AppGame.ins.showTips(data.errorMsg);
        }
    }

    /** 我的上级信息  */
    onMySuperiorInfo(data: ClubHallServer.GetClubPromoterInfoMessageResponse) {
        AppGame.ins.showConnect(false);
        if (data.retCode == 0) {
            this.emit(MClubHall.CLUB_MYSUPERIORINFO_RES, data);
        } else {
            AppGame.ins.showTips(data.errorMsg);
        }
    }

    /**************************request******************************/

    /**请求俱乐部活动奖励记录 */
    requestRewardRecord() {
        AppGame.ins.showConnect(true);
        let data = new ClubHallServer.GetClubActivityRewardMessage();
        data.userId = AppGame.ins.roleModel.useId;
        data.rewardType = 27; // 奖励类型 27:俱乐部活动奖励
        data.activityId = 0; // 活动Id 0-所有活动
        UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_ACTIVITY_REWARD_REQ,
            data);
    }

    /**请求我的俱乐部 */
    requestMyClub(isShowTip: boolean = true, myClubReqTag: boolean = false) {
        AppGame.ins.showConnect(true);
        this.isShowTip = isShowTip;
        this.myClubReqTag = myClubReqTag;
        let data = new ClubHallServer.GetMyClubGameMessage();
        UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_GAME_MESSAGE_REQ,
            data);
    }

    /**请求俱乐部房间信息 */
    requestClubRoomInfo(gameId: number, roomId: number, clubId: number) {
        AppGame.ins.showConnect(true);
        if (BrGameList.includes(gameId)) {
            let roomIds = [];
            let roomListInfo = AppGame.ins.roomModel.getRoomListInfo(gameId);
            roomListInfo.forEach(roomInfo => {
                roomIds.push(roomInfo.type);
            });
            let data = new ClubGameServer.MSG_C2S_GetGameInfoMessage;
            data.gameId = gameId;
            data.roomIds = roomIds;
            data.clubId = clubId;
            data.dynamicPassword = AppGame.ins.LoginModel.gamePass;
            UMsgCenter.ins.sendPkg(0,
                Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER_CLUB,
                ClubGameServer.SUBID.SUB_C2S_GET_GAME_INFO_REQ, data);
        } else {
            let data = new ClubGameServer.MSG_C2S_GetRoomInfoMessage;
            data.gameId = gameId;
            data.roomId = roomId;
            data.clubId = clubId;
            data.dynamicPassword = AppGame.ins.LoginModel.gamePass;
            UMsgCenter.ins.sendPkg(0,
                Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER_CLUB,
                ClubGameServer.SUBID.SUB_C2S_GET_ROOM_INFO_REQ, data);
        }
    }

    /**请求俱乐部申请QQ */
    requestApplyQQ() {
        let data = new ClubHallServer.GetApplyClubInfoMessage();
        UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_APPLY_CLUB_INFO_REQ,
            data);
    }

    //俱乐部我的上级
    requestMyClubMySuperior(clubId: number, clubName: string) {
        AppGame.ins.showConnect(true);
        let data = new ClubHallServer.GetClubPromoterInfoMessage();
        data.clubId = clubId;
        data.clubName = clubName;
        UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_CLUB_PROMOTER_REQ,
            data);
    }
}
