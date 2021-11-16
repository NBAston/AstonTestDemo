import { CancelExchangeType, ECommonUI } from "../../../../common/base/UAllenum";
import UAudioManager from "../../../../common/base/UAudioManager";
import { UAPIHelper } from "../../../../common/utility/UAPIHelper";
import UDebug from "../../../../common/utility/UDebug";
import UEventHandler from "../../../../common/utility/UEventHandler";
import ULanHelper from "../../../../common/utility/ULanHelper";
import UNodeHelper from "../../../../common/utility/UNodeHelper";
import AppGame from "../../../base/AppGame";
import MRole, { CHARGE_SCALE } from "../../lobby/MRole";
import { UIExchargeRecordsItem } from "../ExchangeData";
import VExchange from "../VExchange";
import VExchargeRecordList from "./VExchargeRecordList";


const {ccclass, property} = cc._decorator;

@ccclass
export default class VExchargeRecordListItem extends cc.Component {
    _order_time: cc.Label = null;
    _order_type: cc.Label = null;
    _order_money: cc.Label = null;
    _order_no: cc.Label = null;
    _order_node: cc.Node = null;
    _copy_node: cc.Node = null;
    _status_btn: cc.Node = null;
    _order_btn: cc.Node = null;
    _status: cc.Label = null;
    _manager: VExchargeRecordList;
    _index: number = 0;
    _orderItem: UIExchargeRecordsItem;
    _cancel_order_btn: cc.Node; // 取消订单按钮
    _order_usdt_node: cc.Node;
    _order_tip_node: cc.Node; // 提示节点
    _tip_btn: cc.Node; // 提示按钮节点
    _order_tip_label: cc.Label; // 提示文本内容
    _red_tip_label: cc.Label; // 提示文本内容
    _order_usdt_money: cc.Label;
    _order_usdt_amount: cc.Label;
    _order_usdt_rate: cc.Label;

    _statuType: number = 0;
    _reason: string = "";
    // onLoad () {}

    init(): void {
        this._order_node = UNodeHelper.find(this.node, "order_no");
        this._copy_node = UNodeHelper.find(this.node, "order_no/copy");
        this._tip_btn = UNodeHelper.find(this.node, "tip_btn");
        this._order_btn = UNodeHelper.find(this.node, "order_btn");
        this._order_time = UNodeHelper.find(this.node, "order_time").getComponent(cc.Label);
        this._order_type = UNodeHelper.find(this.node, "order_type").getComponent(cc.Label);
        this._order_money = UNodeHelper.find(this.node, "order_money").getComponent(cc.Label);
        this._order_no = UNodeHelper.find(this.node, "order_no").getComponent(cc.Label);
        this._status = UNodeHelper.find(this.node, "status").getComponent(cc.Label);
        this._order_usdt_node = UNodeHelper.find(this.node, "order_usdt_money");
        this._order_tip_node = UNodeHelper.find(this.node, "tip_bg");
        this._order_tip_label = UNodeHelper.find(this.node, "tip_bg/lb_text").getComponent(cc.Label);
        this._red_tip_label = UNodeHelper.find(this.node, "tip_text").getComponent(cc.Label);
        this._order_usdt_money = UNodeHelper.find(this.node, "order_usdt_money/money").getComponent(cc.Label);
        this._order_usdt_amount = UNodeHelper.find(this.node, "order_usdt_money/rate").getComponent(cc.Label);
        this._order_usdt_rate = UNodeHelper.find(this.node, "order_usdt_money/icon_1/rate").getComponent(cc.Label);
        this._cancel_order_btn = UNodeHelper.find(this.node, "cancel_order");
        this._status_btn = UNodeHelper.find(this.node, "status");
        UEventHandler.addClick(this._order_node, this.node, "VExchargeRecordListItem", "onCopyOrderNo");
        UEventHandler.addClick(this._copy_node, this.node, "VExchargeRecordListItem", "onCopyOrderNo");
        UEventHandler.addClick(this._cancel_order_btn, this.node, "VExchargeRecordListItem", "onclickCancelOrderBtn");
        UEventHandler.addClick(this._status_btn, this.node, "VExchargeRecordListItem", "rejectOrderBtn");
        UEventHandler.addClick(this._tip_btn, this.node, "VExchargeRecordListItem", "rejectOrderBtn");
        UEventHandler.addClick(this._order_btn, this.node, "VExchargeRecordListItem", "onclickItem");

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
    initItemInfo(index: number, orderItem: UIExchargeRecordsItem, manager: any): void {
        this._manager = manager;
        this._index = index;
        this._orderItem = orderItem;
        this._order_time.string = orderItem.time;
        // this._order_usdt_node.active = false;
        if(orderItem.type == 3) {
            this._order_type.string = "银行卡";
        } else if(orderItem.type == 2){
            this._order_type.string = "支付宝";
        } else if(orderItem.type == 4) {
            this._order_type.string = "USDT";
            this._order_money.node.active = false;
            this._order_usdt_node.active = true;
            this._order_usdt_money.string = orderItem.gold+""; 
            this._order_usdt_amount.string = orderItem.usdt;
            this._order_usdt_rate.string = (orderItem.usdtRate * CHARGE_SCALE).toFixed(2);
        }
        // this._order_type.string = CancelExchangeType orderItem.type;
        this._order_money.string = orderItem.gold+"";
        this._order_no.string = orderItem.orderId;
        this._status.string = ULanHelper.PAY_STATUS[orderItem.status];
        var color1 = new cc.Color(95, 81, 68);
        var color2 = new cc.Color(164, 116, 51);
        // UNodeHelper.find(element,"title").color = color2;
        this._statuType = orderItem.status;
        this._reason = orderItem.op;
        if(orderItem.status == 9) {
            this._tip_btn.active = true;
            this._red_tip_label.node.active = true;
            this._red_tip_label.string = "驳回原因："+orderItem.op;
        } else {
            this._red_tip_label.node.active = false;
            this._tip_btn.active = false;
        }
        if(orderItem.status == 8 || orderItem.status == 9) {
            this._status.node.color = color2;
        } else {
            this._status.node.color = color1;
        }
        if(orderItem.status == 8) { // 审核中显示取消订单按钮
            this._cancel_order_btn.active = true;
        } else {
            this._cancel_order_btn.active = false;
        }

        
    }


    // 取消订单按钮点击
    onclickCancelOrderBtn(): void { 
        this._manager.onclickCancelOrderBtn(this._index);
        // AppGame.ins.showUI(ECommonUI.CHARGE_CANCEL_CONFIRM_BOX);
    }

    // 驳回订单按钮
    rejectOrderBtn(): void {
        if(this._statuType == 9) {
            UAudioManager.ins.playSound("audio_click");
            this._order_tip_node.active = !this._order_tip_node.active;
            this._order_tip_label.string = this._reason;
            this.onclickItem(this._index);
            // AppGame.ins.showUI(ECommonUI.UI_EXCHANGE_ORDER_TIP, this._reason); 
        }
    }

    onclickItem(index: number) {
        this._manager.onclickItem(index);
    }

    hideTip(): void {
        this._order_tip_node.active = false;
    }

    setTipActive(): void {
        this._order_tip_node.active = !this._order_tip_node.active;
    }



    // 复制订单编号
    onCopyOrderNo() {
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked(this._orderItem.orderId);
    }

}
