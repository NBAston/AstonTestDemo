import { UAPIHelper } from "../../../../common/utility/UAPIHelper";
import UDebug from "../../../../common/utility/UDebug";
import UEventHandler from "../../../../common/utility/UEventHandler";
import ULanHelper from "../../../../common/utility/ULanHelper";
import UNodeHelper from "../../../../common/utility/UNodeHelper";
import AppGame from "../../../base/AppGame";
import { UIChargeOffLineDataItem, UIChargeOrderListDataItem } from "../ChargeData";
import VChargeOrderList from "./VChargeOrderList";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VChargeOrderListItem extends cc.Component {
    _order_time: cc.Label = null;
    _order_type: cc.Label = null;
    _order_money: cc.Label = null;
    _order_detail: cc.Node = null;
    _order_detail_label: cc.Label = null;
    // _order_node: cc.Node = null;
    _status: cc.Label = null;
    _manager: any;
    _index: number;
    _orderItem: UIChargeOrderListDataItem;
    _cancel_order_btn: cc.Node; // 取消订单按钮

    // onLoad () {}

    init(): void {
        // this._order_node = UNodeHelper.find(this.node, "order_no");
        // UEventHandler.addClick(this._order_node, this.node, "VChargeOrderListItem", "onCopyOrderNo");
        // this._order_time = UNodeHelper.find(this.node, "order_time").getComponent(cc.Label);
        // this._order_type = UNodeHelper.find(this.node, "order_type").getComponent(cc.Label);
        // this._order_money = UNodeHelper.find(this.node, "order_money").getComponent(cc.Label);
        // this._order_no = UNodeHelper.find(this.node, "order_no").getComponent(cc.Label);
        // this._status = UNodeHelper.find(this.node, "status").getComponent(cc.Label);
        // this._cancel_order_btn = UNodeHelper.find(this.node, "cancel_order");
        // // UEventHandler.addClick(this._cancel_order_btn, this.node, "VChargeOrderListItem", "onclickCancelOrderBtn");
        // UEventHandler.addClick(this.node, this.node, "VChargeOrderListItem", "onclickOrderDetail");

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
     */
    initItemInfo(index: number, orderItem: UIChargeOrderListDataItem, manager: any): void {
        // this._order_node = UNodeHelper.find(this.node, "order_no");
        // UEventHandler.addClick(this._order_node, this.node, "VChargeOrderListItem", "onCopyOrderNo");
        this._order_time = UNodeHelper.find(this.node, "order_time").getComponent(cc.Label);
        this._order_type = UNodeHelper.find(this.node, "order_type").getComponent(cc.Label);
        this._order_money = UNodeHelper.find(this.node, "order_money").getComponent(cc.Label);
        this._order_detail = UNodeHelper.find(this.node, "detail");
        this._order_detail_label = UNodeHelper.find(this.node, "detail/detail_btn").getComponent(cc.Label);
        this._status = UNodeHelper.find(this.node, "status").getComponent(cc.Label);
        this._cancel_order_btn = UNodeHelper.find(this.node, "cancel_order");
        // UEventHandler.addClick(this._cancel_order_btn, this.node, "VChargeOrderListItem", "onclickCancelOrderBtn");
        UEventHandler.addClick(this._order_detail, this.node, "VChargeOrderListItem", "onclickOrderDetail");

        this._manager = manager;
        this._index = index;
        this._orderItem = orderItem;
        this._order_time.string = orderItem.createTime;
        this._order_type.string = orderItem.sp;
        if(orderItem.sp == "补发金币") {
            var color2 = new cc.Color(95, 81, 68);
            this._order_detail_label.node.color = color2;
        } else {
            var color = new cc.Color(164, 116, 51);
            this._order_detail_label.node.color = color;
        }
        this._order_money.string = orderItem.rechargeMoney+"";
        // this._order_no.string = orderItem.orderId;
        /*if(orderItem.status == 1) { // 审核中显示取消订单按钮
            this._cancel_order_btn.active = true;
        } else {
            this._cancel_order_btn.active = false;
        }*/
        if(orderItem.status == 1) {
            this._status.string = "未支付";
        } else if(orderItem.status == 2) {
            this._status.string = "待确认";
        } else if(orderItem.status == 3) {
            this._status.string = "已补发";
        } else if(orderItem.status == 4) {
            this._status.string = "已完成";
        } else if(orderItem.status == 5) {
            this._status.string = "已取消";
        } else if(orderItem.status == 6) {
            this._status.string = "超时取消";
        }
        this._order_money.string = orderItem.rechargeMoney+"";
    }
    // 取消订单按钮点击
    onclickCancelOrderBtn(): void {
        this._manager.onclickCancelOrderBtn(this._index);
    // AppGame.ins.showUI(ECommonUI.CHARGE_CANCEL_CONFIRM_BOX);
    }

    onclickOrderDetail(): void {
        if(this._orderItem.sp.startsWith("线上")) {
            // AppGame.ins.roleModel.requestPayOnlineOrder(this._orderItem.rechargeTypeId, this._orderItem.rechargeMoney, this._orderItem.orderId);
            this._manager.onclickOrderDetail(this._orderItem.orderId, 1); 
        } else {
            this._manager.onclickOrderDetail(this._orderItem.orderId, 2); 
        }
        // this._manager.onclickOrderDetail(this._orderItem.orderId); 
    }

    // 复制订单编号
    onCopyOrderNo() {
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked(this._orderItem.orderId);
    }

}
