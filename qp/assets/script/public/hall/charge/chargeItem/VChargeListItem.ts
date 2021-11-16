import UResManager from "../../../../common/base/UResManager";
import UEventHandler from "../../../../common/utility/UEventHandler";
import UNodeHelper from "../../../../common/utility/UNodeHelper";
import { UIChargeOffLineDataItem, UIChargeOnLineDataItem } from "../ChargeData";
import VCharge from "../VCharge";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VChargeListItem extends cc.Component {

    _icon: cc.Sprite = null;
    _title: cc.Label = null;
    _range: cc.Label = null;
    _manager: VCharge;
    _index: number;
    _payType: number;
    _offLineItem: UIChargeOffLineDataItem;
    _onLineItem: UIChargeOnLineDataItem;
    _chargeType: number;

    /**
     * @param index 索引
     * @param payType 支付类型
     * @param manager Vcharge
     * @param chargeType 支付类型 1 为线上支付 2 为线下支付 
     */
    initItemInfo(index: number, offLineItem: UIChargeOffLineDataItem, manager: VCharge, chargeType?: number): void {
       
        UEventHandler.addClick(this.node, this.node, "VChargeListItem", "onclickItem");
        this._icon = UNodeHelper.find(this.node, "icon").getComponent(cc.Sprite);
        this._title = UNodeHelper.find(this.node, "title").getComponent(cc.Label);
        this._range = UNodeHelper.find(this.node, "range").getComponent(cc.Label);
        this._chargeType = chargeType;
        this._manager = manager;
        this._index = index;
        this.node.active = true;
        this._offLineItem = offLineItem;
        this._payType = offLineItem.type;
        this._title.string = offLineItem.rechargeTypeName;
        this._range.string = "充值限额："+offLineItem.minMoneyLimit +"~"+offLineItem.maxMoneyLimit;
        UResManager.loadRemote(offLineItem.rechargeTypeIcon, this._icon);
    }

    hide(): void {
        this.node.active = false;
    }

    show(): void {
        this.node.active = true;
    }
    /**
     * @param index 索引
     * @param payType 支付类型
     * @param manager Vcharge
     * @param chargeType 支付类型 1 为线上支付 2 为线下支付 
     */
    initOnLineItemInfo(index: number, onLineItem: UIChargeOnLineDataItem, manager: VCharge, chargeType?: number): void {
       
        UEventHandler.addClick(this.node, this.node, "VChargeListItem", "onclickItem");
        this._icon = UNodeHelper.find(this.node, "icon").getComponent(cc.Sprite);
        this._title = UNodeHelper.find(this.node, "title").getComponent(cc.Label);
        this._range = UNodeHelper.find(this.node, "range").getComponent(cc.Label);
        this._chargeType = chargeType;
        this._manager = manager;
        this._index = index;
        this._onLineItem = onLineItem;
        this._payType = onLineItem.type;
        this._title.string = onLineItem.rechargeTypeName;
        this._range.string = "充值限额："+onLineItem.minMoneyLimit +"~"+onLineItem.maxMoneyLimit;
        UResManager.loadRemote(onLineItem.rechargeTypeIcon, this._icon);
    }



    onclickItem() {
        if(this._chargeType == 1) {
            this._manager.onClickOnLineItem(this._index, this._onLineItem);
        } else if(this._chargeType == 2) {
            this._manager.onClickOffLineItem(this._index, this._offLineItem);
        }
    }

}
