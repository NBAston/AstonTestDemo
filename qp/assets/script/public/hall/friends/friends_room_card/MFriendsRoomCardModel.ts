import Model from "../../../../common/base/Model";
import { Game, HallFriendServer } from "../../../../common/cmd/proto";
import UMsgCenter from "../../../../common/net/UMsgCenter";
import UHandler from "../../../../common/utility/UHandler";
import AppGame from "../../../base/AppGame";

/**
 * 创建:
 * 处理房卡的数据信息和逻辑
 */
export default class MFriendsRoomCardModel extends Model {
    resetData(): void {
    }

    update(dt: number): void {
    }

    /**服务器推送的玩家信息 */
    static UPDATE_ROOM_CARD_LIST = "UPDATE_ROOM_CARD_LIST";

    /*要转账的玩家信息 */
    static OTHER_USER_INFO = "OTHER_USER_INFO";

    /**更新房卡信息 */
    static UPDATE_RECHARGE_ROOMCARD_MESSAGE = "UPDATE_RECHARGE_ROOMCARD_MESSAGE";
    /**金币不足 */
    static FRIEND_ROOM_CARD_GOLD_NO_ENOUGH = "FRIEND_ROOM_CARD_GOLD_NO_ENOUGH";

    //房卡明细
    static FRIENDS_DETAIL = "FRIEDNS_DETAIL"
    /*转账的结果 */
    static TRANSFER_RESLUT = "TRANSFER_RESLUT";
    /*转账记录 */
    static TRANSFER_RECORD = "TRANSFER_RECORD";

    //当前转账用户的信息
    public transferUserInfo:any 

    /**
     * 房间里面玩家的信息
    */

    init(): void {
        /**购买房卡列表 */
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_LIST_MESSAGE_RES,
            new UHandler(this.get_room_card_list_message, this));
        /** 购买房卡*/
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_RECHARGE_ROOM_CARD_MESSAGE_RES,
            new UHandler(this.recharge_room_card_message, this));
        /**获取玩家信息 */
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_USER_INFO_MESSAGE_RES,
            new UHandler(this.get_user_info_message, this));
        /**转房卡给玩家 */
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_TRANSFER_ROOM_CARD_MESSAGE_RES,
            new UHandler(this.transfer_room_card_message, this));
        /**房卡转帐记录 */
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_IN_OUT_MESSAGE_RES,
            new UHandler(this.get_room_card_in_out_message, this));
        /**个人中心 房卡明细 */
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_CHANGE_MESSAGE_RES,
            new UHandler(this.get_room_card_change_message, this));
    }

    private get_room_card_list_message(caller: HallFriendServer.GetFriendRechargeRoomCardListResponse) {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MFriendsRoomCardModel.UPDATE_ROOM_CARD_LIST, caller);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }

    private recharge_room_card_message(caller: HallFriendServer.RechargeRoomCardResponse) {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            AppGame.ins.roleModel.saveGold(caller.score);
            AppGame.ins.roleModel.saveRoomCard(caller.roomCard);
            this.emit(MFriendsRoomCardModel.UPDATE_RECHARGE_ROOMCARD_MESSAGE, caller);
        } else if (caller.retCode == 2) { // 金币不足
            this.emit(MFriendsRoomCardModel.FRIEND_ROOM_CARD_GOLD_NO_ENOUGH);
        } else {
            AppGame.ins.showTips(caller.errorMsg);

        }
    }

    //获得玩家信息
    private get_user_info_message(caller: HallFriendServer.GetUserInfoResponse) {
        AppGame.ins.showConnect(false);
        this.emit(MFriendsRoomCardModel.OTHER_USER_INFO, caller);
    }

    //房卡转账结果
    private transfer_room_card_message(caller:HallFriendServer.TransferRoomCardResponse) {
        AppGame.ins.showConnect(false);
        this.emit(MFriendsRoomCardModel.TRANSFER_RESLUT,caller);
    }

    //房卡转账记录
    private get_room_card_in_out_message(caller: HallFriendServer.GetRoomCardInOutRecordResponse) {
        AppGame.ins.showConnect(false);
        this.emit(MFriendsRoomCardModel.TRANSFER_RECORD,caller);
    }

    private get_room_card_change_message(caller: HallFriendServer.GetRoomCardChangeRecordResponse) {
        if (caller.retCode == 0) {
            this.emit(MFriendsRoomCardModel.FRIENDS_DETAIL, caller);
        } else {
            this.emit(MFriendsRoomCardModel.FRIENDS_DETAIL, caller.errorMsg);
        }
        AppGame.ins.showConnect(false);
    }

    // 请求购买房卡列表
    requestGetRoomCardList(isBShopMall: boolean = true) {
        AppGame.ins.showConnect(true);
        var data = new HallFriendServer.GetFriendRechargeRoomCardListMessage();
        data.bShopMall = isBShopMall;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_LIST_MESSAGE_REQ, data);
    }

    requestRechargeRoomCard(rechargeCardInfo: HallFriendServer.IRechargeCardInfo, isShopMall: boolean = true) {
        AppGame.ins.showConnect(true);
        var data = new HallFriendServer.RechargeRoomCardMessage();
        data.bShopMall = isShopMall;
        data.rechargeCardInfo = rechargeCardInfo;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_RECHARGE_ROOM_CARD_MESSAGE_REQ, data);
    }

    //请求玩家信息
    requestOtherUserInfo(userId:number){
        AppGame.ins.showConnect(true);
        var data = new HallFriendServer.GetUserInfoMessage();
        data.userId = userId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_USER_INFO_MESSAGE_REQ, data);
    }

    //请求玩家房卡变化记录列表
    requestFriendsDetails(startDate: string, endDate: string, changeType: number, id: string): boolean {
        var data = new HallFriendServer.GetRoomCardChangeRecordMessage();
        data.startDate = startDate;
        data.endDate = endDate;
        data.changeType = changeType;
        data.lastRecordTime = id;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_CHANGE_MESSAGE_REQ,
            data);
        return true;
    }

    //请求转账
    requestTransfer(recvUserId:number, cardNum:number){
        AppGame.ins.showConnect(true);
        var data = new HallFriendServer.TransferRoomCardMessage();
        data.recvUserId = recvUserId;
        data.cardNum = cardNum;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_TRANSFER_ROOM_CARD_MESSAGE_REQ,data);
    }

    //请求房卡转账记录
    requestTransferRecord(startTime:string,endTime:string,lastRecordTime:string){
        AppGame.ins.showConnect(true);
        var data = new HallFriendServer.GetRoomCardInOutRecordMessage();
        data.lastRecordTime = lastRecordTime;
        data.startDate = startTime;
        data.endDate = endTime;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND,
            Game.Common.MESSAGE_CLIENT_TO_HALL_FRIEND_SUBID.CLIENT_TO_HALL_FRIEND_GET_ROOM_CARD_IN_OUT_MESSAGE_REQ,data);
    }
}

