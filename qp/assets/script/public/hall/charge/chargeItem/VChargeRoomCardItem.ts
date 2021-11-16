import { ECommonUI } from "../../../../common/base/UAllenum";
import UResManager from "../../../../common/base/UResManager";
import { HallFriendServer } from "../../../../common/cmd/proto";
import UEventHandler from "../../../../common/utility/UEventHandler";
import UHandler from "../../../../common/utility/UHandler";
import UNodeHelper from "../../../../common/utility/UNodeHelper";
import AppGame from "../../../base/AppGame";
import { UIChargeOffLineDataItem, UIChargeOnLineDataItem } from "../ChargeData";
import VCharge from "../VCharge";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VChargeRoomCardItem extends cc.Component {


    @property(cc.Label) title_lab: cc.Label = null;
    @property(cc.Node) hot_icon: cc.Node = null;
    @property(cc.Node) zs_node: cc.Node = null;
    @property(cc.Label) zs_lab: cc.Label = null;
    @property(cc.Node) room_card_icon: cc.Node = null;
    @property(cc.Label) money_lab: cc.Label = null;
    _manager: VCharge;
    _index: number;
    _roomCardNum: number = 0;
    _bShopMall: boolean = true; // 0代理购买 1:商城购买
    _rechargeCardInfo: HallFriendServer.IRechargeCardInfo;

    /**
     * @param index 索引
     * @param payType 支付类型
     * @param manager Vcharge
     * @param chargeType 支付类型 1 为线上支付 2 为线下支付 
     */
    initItemInfo(index: number, rechargeCardInfo: HallFriendServer.IRechargeCardInfo, bShopMall: boolean): void {
        this._index = index;
        this._rechargeCardInfo = rechargeCardInfo;

        this._bShopMall = bShopMall;
        this.hot_icon.opacity = rechargeCardInfo.isHot ? 255 : 0;
        this.title_lab.string = `${rechargeCardInfo.cardNum / 100}` + `张房卡`;
        this.zs_node.opacity = rechargeCardInfo.rewardNum / 100 > 0 && !bShopMall ? 255 : 0;
        if (bShopMall) {
            this.zs_node.opacity = rechargeCardInfo.rewardNum / 100 > 0 ? 255 : 0;
        } else {
            this.zs_node.opacity = (rechargeCardInfo.rewardNum / 100 == 100 || rechargeCardInfo.rewardNum / 100 == 1) ? 0 : 255;
        }
        this.zs_lab.string = bShopMall ? `多送` + `${rechargeCardInfo.rewardNum / 100}` + `张` : `${rechargeCardInfo.rewardNum}折`;
        this.money_lab.string = `${rechargeCardInfo.wantScore / 100}`;

        let cardNum = rechargeCardInfo.cardNum / 100;
        if (cardNum <= 10) {
            this.setRoomCardSpriteFrames('10fk');
        } else if (cardNum > 10 && cardNum <= 30) {
            this.setRoomCardSpriteFrames('30fk');
        } else if (cardNum > 30 && cardNum <= 60) {
            this.setRoomCardSpriteFrames('60fk');
        } else if (cardNum > 60 && cardNum <= 100) {
            this.setRoomCardSpriteFrames('100fk');
        } else if (cardNum > 100 && cardNum <= 200) {
            this.setRoomCardSpriteFrames('200fk');
        } else if (cardNum > 200 && cardNum <= 500) {
            this.setRoomCardSpriteFrames('500fk');
        } else if (cardNum > 500 && cardNum <= 1000) {
            this.setRoomCardSpriteFrames('1000fk');
        } else if (cardNum > 1000) {
            this.setRoomCardSpriteFrames('2000fk');
        } 
    }

    setRoomCardSpriteFrames(spriteStr: string) {
        this.room_card_icon.getComponent(cc.Sprite).spriteFrame = this.node.getComponent('USpriteFrames').getFrames(spriteStr);
    }

    hide(): void {
        this.node.active = false;
    }

    show(): void {
        this.node.active = true;
    }

    onclickItem() {
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            
            type: 3, data: `确定要用金币购买` + this._rechargeCardInfo.cardNum /100 + ((this._bShopMall && this._rechargeCardInfo.rewardNum > 0) ?`(额外赠送`+ ((this._rechargeCardInfo.rewardNum) / 100)+`)张房卡`:`张房卡`), handler: UHandler.create((a) => {
                if (a) {
                    AppGame.ins.friendsRoomCardModel.requestRechargeRoomCard(this._rechargeCardInfo, this._bShopMall);
                }
            }, this)
        });

    }

}
