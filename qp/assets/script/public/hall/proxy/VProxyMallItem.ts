import { EAgentLevelReqType, ECommonUI } from "../../../common/base/UAllenum";
import { HallFriendServer } from "../../../common/cmd/proto";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../base/AppGame";
import VChargeRoomCardItem from "../charge/chargeItem/VChargeRoomCardItem";
import MFriendsRoomCardModel from "../friends/friends_room_card/MFriendsRoomCardModel";
import MHall from "../lobby/MHall";
import MRole from "../lobby/MRole";
import MProxy from "./MProxy";
import VProxyItem from "./VProxyItem";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VProxyMallItem extends VProxyItem {

    @property(cc.Node) roomCardContent: cc.Node = null;
    @property(cc.ScrollView) roomCardScrollview: cc.ScrollView = null;
    @property(cc.Prefab) roomCardPrefab: cc.Prefab = null;
    @property(cc.Node) noneData: cc.Node = null;
    @property(cc.Label) proxyLevel: cc.Label = null;

    init(): void {
        super.init();
    };

    protected isOnafter(): void {
        super.isOnafter();
        if (this.IsOn) {
            this.node.active = true;
            super.playclick();
            this.node.children[2].color = cc.color(255, 255, 255, 255)
            AppGame.ins.roleModel.requestRoomCardsList();
            let hedIcon = UNodeHelper.find(this.node, "chat_img_redpoint");
            hedIcon.active = false;
            AppGame.ins.friendsRoomCardModel.requestGetRoomCardList(false);
            cc.sys.localStorage.setItem('PROXY_MALL_BTN_HED_ICON', "1");
            AppGame.ins.hallModel.requestAgentLevel();
        } else {
            this.node.children[2].color = cc.color(164, 116, 51, 255)
        }
    }

    update_room_card_list(caller: HallFriendServer.GetFriendRechargeRoomCardListResponse) {
        cc.log("update_room_card_list:", caller)
        let rechargeCardInfo = caller.rechargeCardInfo;
        if (rechargeCardInfo.length > 0) {

            this.noneData.active = false;
            let items = this.roomCardContent.children;
            for (let index = 0; index < rechargeCardInfo.length; index++) {
                const element = rechargeCardInfo[index];
                let item = items[index];
                if (!item) {
                    item = cc.instantiate(this.roomCardPrefab);
                    this.roomCardContent.addChild(item);
                };
                item.active = true;
                item.getComponent(VChargeRoomCardItem).initItemInfo(
                    index,
                    element,
                    caller.bShopMall
                );
            }
        } else {
            this.noneData.active = true;
            this.roomCardContent.removeAllChildren();
        }
        this.roomCardScrollview.scrollToTop(0.1);
    }

    update_recharge_room_card_message(data: any) {
        if (data && data.hasOwnProperty('rechargeCardInfo')) {
            AppGame.ins.showUI(ECommonUI.UI_AWARD_ROOM_CARD, { roomCardNum: data.rechargeCardInfo.cardNum / 100 });
        }
    }

    /**
     * @description  跟心代理等级
     * @param data 
     * @returns 
     */
    updateProxyLevel(data: any) {
        if (AppGame.ins.hallModel.reqAgentLevelType != EAgentLevelReqType.default) return;
        if (!data || data.retCode != 0 || !data.hasOwnProperty('level')) {
            return;
        }
        this.proxyLevel.string = data.level;

    };


    protected onEnable(): void {
        AppGame.ins.friendsRoomCardModel.on(MFriendsRoomCardModel.UPDATE_ROOM_CARD_LIST, this.update_room_card_list, this);
        AppGame.ins.friendsRoomCardModel.on(MFriendsRoomCardModel.UPDATE_RECHARGE_ROOMCARD_MESSAGE, this.update_recharge_room_card_message, this);
        AppGame.ins.hallModel.on(MHall.GET_AGENT_LEVEL_RES, this.updateProxyLevel, this);
    };

    protected onDisable(): void {
        AppGame.ins.friendsRoomCardModel.off(MFriendsRoomCardModel.UPDATE_RECHARGE_ROOMCARD_MESSAGE, this.update_recharge_room_card_message, this);
        AppGame.ins.friendsRoomCardModel.off(MFriendsRoomCardModel.UPDATE_ROOM_CARD_LIST, this.update_room_card_list, this);
        AppGame.ins.hallModel.off(MHall.GET_AGENT_LEVEL_RES, this.updateProxyLevel, this);
        let items = this.roomCardContent.children;
        for (let i = 0; i < items.length; i++) {
            items[i].active = false;
        };
    }

    // update (dt) {}
}
