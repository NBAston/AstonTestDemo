import UEventHandler from "../../../../common/utility/UEventHandler";
import UNodeHelper from "../../../../common/utility/UNodeHelper";
import { CHARGE_SCALE } from "../../lobby/MRole";
import VChargeListDetailItem from "./VChargeListDetailItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VChargeMoneyItem extends cc.Component {

   
    _money_label: cc.Label = null;
    _manager: VChargeListDetailItem;
    _check_bg: cc.Node;
    _money: number;
    _index: number;
    _payType:number;

    /**
     * @param index 索引
     * @param payType 支付类型
     * @param manager Vcharge
     */
    initItemInfo(index: number, money: number, manager: VChargeListDetailItem): void {
        UEventHandler.addClick(this.node, this.node, "VChargeMoneyItem", "onclickItem")
        this._money_label = UNodeHelper.find(this.node, "label").getComponent(cc.Label);
        this._check_bg = UNodeHelper.find(this.node, "check_bg");
        this._money = money * CHARGE_SCALE;
        this._manager = manager;
        this._index = index;
        this._money_label.string = this._money+"元";
    }

    // 选中
    isCheckBg(isCheck: boolean): void {
        this._check_bg.active = isCheck;
        if(isCheck) {
            this._money_label.node.color = new cc.Color(255, 255, 255);
        } else {
            this._money_label.node.color = new cc.Color(164, 116, 51);
        }
    }

    onclickItem() {
        this._manager.onClickMoneyItem(this._index, this._money);
    }

}
