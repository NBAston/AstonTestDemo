import { ECommonUI } from "../../../common/base/UAllenum";
import { HallFriendServer } from "../../../common/cmd/proto";
import AppGame from "../../base/AppGame";
import MFriendsRoomCardModel from "../friends/friends_room_card/MFriendsRoomCardModel";
import MRole from "../lobby/MRole";
import VCharge from "./VCharge";


const {ccclass, property} = cc._decorator;

@ccclass
export default class VChargeRoomCard extends cc.Component {

    @property(cc.Node) roomCardContent: cc.Node = null;
    @property(cc.ScrollView) roomCardScrollview: cc.ScrollView = null;
    @property(cc.Prefab) roomCardPrefab: cc.Prefab = null;
    @property(cc.Node) noneData: cc.Node = null;
    // @property(cc.Node) roomCardItem: cc.Node = null; // item: cc.Node = null;
    
    _manager: VCharge;
    _index: number;
    _roomCardNum: number = 0;

    protected onEnable(): void {
        AppGame.ins.friendsRoomCardModel.on(MFriendsRoomCardModel.UPDATE_ROOM_CARD_LIST, this.update_room_card_list, this);
        AppGame.ins.friendsRoomCardModel.on(MFriendsRoomCardModel.UPDATE_RECHARGE_ROOMCARD_MESSAGE, this.update_recharge_room_card_message, this);
        // AppGame.ins.friendsRoomCardModel.requestGetRoomCardList(true);
    }

    protected onDisable(): void {
        AppGame.ins.roleModel.off(MRole.UPDATE_GOLD_ROOMCARDS_LIST, this.update_room_card_list, this);

    }

    // 更新房卡列表
    update_room_card_list(data: any) {
        // if(data && !data.bShopMall) return;
        this.roomCardContent.removeAllChildren(); 
        if(data && data.hasOwnProperty('rechargeCardInfo') && data.rechargeCardInfo.length > 0) {
            let cardData = data.rechargeCardInfo;
            this.noneData.active = false;
            for (let index = 0; index < cardData.length; index++) {
                const element = cardData[index];
                let item = cc.instantiate(this.roomCardPrefab);
                item.parent = this.roomCardContent;
                item.getComponent('VChargeRoomCardItem').initItemInfo(
                    index, 
                    element,
                    data.bShopMall,
                    );
            }
        } else {
            this.noneData.active = true;
        }
        this.roomCardScrollview.scrollToTop(0.1);
    }

    update_recharge_room_card_message(data: any) {
        if(data && data.hasOwnProperty('rechargeCardInfo')) {
            let zs = data.rechargeCardInfo.rewardNum;
            let allNum = 0;
            if(data.bShopMall) {
                allNum = (data.rechargeCardInfo.cardNum + data.rechargeCardInfo.rewardNum) / 100
            } else {
                allNum = data.rechargeCardInfo.cardNum / 100;
            }
            AppGame.ins.showUI(ECommonUI.UI_AWARD_ROOM_CARD, { roomCardNum: allNum});
        }
    }

   

}
