import { ConfirmTipBoxType, ECommonUI } from "../../../../common/base/UAllenum";
import UResManager from "../../../../common/base/UResManager";
import { UAPIHelper } from "../../../../common/utility/UAPIHelper";
import UDebug from "../../../../common/utility/UDebug";
import UEventHandler from "../../../../common/utility/UEventHandler";
import ULanHelper from "../../../../common/utility/ULanHelper";
import UNodeHelper from "../../../../common/utility/UNodeHelper";
import UNodePool from "../../../../common/utility/UNodePool";
import UStringHelper from "../../../../common/utility/UStringHelper";
import cfg_avatar from "../../../../config/cfg_avatar";
import AppGame from "../../../base/AppGame";
import MRole from "../../lobby/MRole";
import { UIChargeOffLineOrderItem } from "../ChargeData";
import VCharge from "../VCharge";
import VChargeConstants from "./VChargeConstants";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VChargeOrderDetailItem extends cc.Component {

    _orderNoLabel: cc.Label = null;
    _skNameLabel: cc.Label = null;
    _skAccountLabel: cc.Label = null;
    _moneyLabel: cc.Label = null;
    _bzuidLabel: cc.Label = null;
    _createTimeLabel: cc.Label = null;
    _chargeTimeLabel: cc.Label = null;
    _detailNode: cc.Node = null;
    _had_chargeNode: cc.Node = null;
    _cancelOrderBtn: cc.Node = null;
    _hadChargeBtn: cc.Node = null;
    _manager: VCharge;
    _index: number;
    _money: number;// 选中的金额
    _orderId: string; // 订单编号
    _orderItem: UIChargeOffLineOrderItem;
    _djs_minus: number = 25; // 倒计时分钟
    _djs_seconds: number = 59; // 倒计时秒
    _djs_interval: any = null; // 倒计时计时器
    _service_data_item:any = null;

    /**
     * @param index 索引
     * @param payType 支付类型
     * @param manager Vcharge
     */
    initItemInfo(orderItem: UIChargeOffLineOrderItem, manager: VCharge): void {
       
        this._detailNode = UNodeHelper.find(this.node, "detail");
        this._had_chargeNode = UNodeHelper.find(this.node, "had_charge");
        this._cancelOrderBtn = UNodeHelper.find(this.node, "detail/cancelOrderBtn");
        this._hadChargeBtn = UNodeHelper.find(this.node, "detail/hadChargeBtn");
        var contactKefuBtn = UNodeHelper.find(this.node, "detail/contactServiceBtn");
        var copyOrderNoBtn = UNodeHelper.find(this.node, "detail/orderNo/copyBtn");
        var copyNameBtn = UNodeHelper.find(this.node, "detail/skName/copyBtn");
        var copyAccountNoBtn = UNodeHelper.find(this.node, "detail/skAccount/copyBtn");
        var copyMoneyBtn = UNodeHelper.find(this.node, "detail/money/copyBtn");
        var copyUidBtn = UNodeHelper.find(this.node, "detail/bzUID/copyBtn");
        var server_btn = UNodeHelper.find(this.node, "had_charge/tip_bg/server_btn");
        this._orderNoLabel = UNodeHelper.find(this.node, "detail/orderNo/label").getComponent(cc.Label);
        this._skNameLabel = UNodeHelper.find(this.node, "detail/skName/label").getComponent(cc.Label);
        this._skAccountLabel = UNodeHelper.find(this.node, "detail/skAccount/label").getComponent(cc.Label);
        this._moneyLabel = UNodeHelper.find(this.node, "detail/money/label").getComponent(cc.Label);
        this._bzuidLabel = UNodeHelper.find(this.node, "detail/bzUID/label").getComponent(cc.Label);
        this._createTimeLabel = UNodeHelper.find(this.node, "detail/createTime/label").getComponent(cc.Label);
        this._chargeTimeLabel = UNodeHelper.find(this.node, "detail/chargeTime/label").getComponent(cc.Label);

        UEventHandler.addClick(this._cancelOrderBtn, this.node, "VChargeOrderDetailItem", "onclickCancelOrder");
        UEventHandler.addClick(this._hadChargeBtn, this.node, "VChargeOrderDetailItem", "onclickHadChargeBtn");
        UEventHandler.addClick(contactKefuBtn, this.node, "VChargeOrderDetailItem", "onclickContactKefu");
        UEventHandler.addClick(server_btn, this.node, "VChargeOrderDetailItem", "onclickContactKefu");
        UEventHandler.addClick(copyOrderNoBtn, this.node, "VChargeOrderDetailItem", "onclickCopyBtn", 1);
        UEventHandler.addClick(copyNameBtn, this.node, "VChargeOrderDetailItem", "onclickCopyBtn", 2);
        UEventHandler.addClick(copyAccountNoBtn, this.node, "VChargeOrderDetailItem", "onclickCopyBtn",3);
        UEventHandler.addClick(copyMoneyBtn, this.node, "VChargeOrderDetailItem", "onclickCopyBtn", 4);
        UEventHandler.addClick(copyUidBtn, this.node, "VChargeOrderDetailItem", "onclickCopyBtn", 5);

        this._orderItem = orderItem;
        this._detailNode.active = true;
        this._had_chargeNode.active = false;
        this._manager = manager;
        this._orderId = orderItem.orderId;
        this._skAccountLabel.string = orderItem.accountNo;
        this._skNameLabel.string = orderItem.name;
        this._moneyLabel.string = orderItem.amount;
        this._createTimeLabel.string = orderItem.createTime;
        this._orderNoLabel.string = orderItem.orderId;
        this._bzuidLabel.string = orderItem.userId+"";
        this._djs_minus = orderItem.timeSurplus - 1;
        this._djs_seconds = 59;
        this.initChargeTimeStick()
        
    }

    // 补位0
    addZero(param: number) {
        return param < 10 ? ("0" + param) : (param + "");
    }

    // 开启定时器
    initChargeTimeStick():void {
        this._chargeTimeLabel.string = this.addZero(this._djs_minus+1) + "分" + this.addZero(0) + "秒"; 
        this._djs_interval = setInterval(()=>{
        this._chargeTimeLabel.string = this.addZero(this._djs_minus) + "分" + this.addZero(this._djs_seconds) + "秒"; 
        if(this._djs_minus == 0 && this._djs_seconds == 0) { // 倒计时结束自动取消订单
            this._hadChargeBtn.getComponent(cc.Button).interactable = false;
            this._cancelOrderBtn.getComponent(cc.Button).interactable = false;
            clearInterval(this._djs_interval);
            this._manager.onclickCancelOrder(this._orderId);
        } else if(this._djs_minus >= 0) {
            if(this._djs_seconds > 0) {
                this._djs_seconds--;
            } else if(this._djs_seconds == 0) {
                this._djs_minus--;
                this._djs_seconds = 59;
            }
        }
        }, 1000);
    }

    // 复制点击事件 
    onclickCopyBtn(event: any, index: number) {
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        if(index == 1) {
            UAPIHelper.onCopyClicked(this._orderItem.orderId);
        } else if(index == 2) {
            UAPIHelper.onCopyClicked(this._orderItem.name);
        } else if(index == 3) {
            UAPIHelper.onCopyClicked(this._orderItem.accountNo);
        } else if(index == 4) {
            UAPIHelper.onCopyClicked(this._orderItem.amount);
        } else if(index == 5) {
            UAPIHelper.onCopyClicked(this._orderItem.userId+"");
        }
    }

    // 取消订单 
    onclickCancelOrder() {
        // 直接弹框
        // this._manager.onclickCancelOrder();
        AppGame.ins.showUI(ECommonUI.CHARGE_CANCEL_CONFIRM_BOX);
    }

    // 联系客服
    onclickContactKefu() {
        
        if (this._service_data_item) {
            AppGame.ins.showUI(ECommonUI.LB_Chat, this._service_data_item);
        } else {
            this._manager.onclickContactKefu();
        }
        
    }

    // 点击对应的moneyItem
    onClickMoneyItem(index: number, money: number) {
        UDebug.log("点击金币+index"+index+"money = "+money);
    }


    // 已转账
    onclickHadChargeBtn() {
        let serviceNum = AppGame.ins.charge_service_items.length;
        let randServiceItem = Math.floor(Math.random()*serviceNum+1)
        let randService = AppGame.ins.charge_service_items[randServiceItem -1];
        let datainfo = '用户id：'+ this._bzuidLabel.string + "\n" + '订单编号：' +this._orderNoLabel.string + "\n" + '创建时间：' + this._createTimeLabel.string
        +"\n"+ "转账金额：" + this._moneyLabel.string +"\n" + "收款姓名：" + this._skNameLabel.string + '\n' + '收款账号：' + this._skAccountLabel.string 
        this._service_data_item = randService;
        AppGame.ins.showUI(ECommonUI.CHARGE_CONFIRM_BOX, ConfirmTipBoxType.ConfirmHadChargeType);
        if(randService) {
            AppGame.ins.sendChargeMsg(datainfo, randService);
        }
    }

    // 确认已经转账
    confirm_had_charge(isClose: boolean) {
        if(isClose) {
            AppGame.ins.closeUI(ECommonUI.CHARGE_CONFIRM_BOX);
            this._detailNode.active = false;
            AppGame.ins.roleModel.requestConfirmOrderInfo(this._orderId);
            //打开聊天界面
            if(this._service_data_item) {
                AppGame.ins.showUI(ECommonUI.LB_Chat, this._service_data_item);
            }
        }
    }

    confirm_cancel_order(isClose: boolean) {
        if(isClose) {
            AppGame.ins.closeUI(ECommonUI.CHARGE_CANCEL_CONFIRM_BOX);
            this._manager.onclickCancelOrder(this._orderId);
        }
    }

    
    // 确认订单消息
    confirm_order_info(success: boolean, msg: string): void {
        AppGame.ins.showTips(msg)
        if(success) {
            //更新客服信息
            let lbName = UNodeHelper.getComponent(this._had_chargeNode, "tip_bg/lb_name", cc.Label);
            let avatar  = UNodeHelper.getComponent(this._had_chargeNode, "tip_bg/sp_avator", cc.Sprite);
            if(this._service_data_item) {
                lbName.string = this._service_data_item.nickname;
                let reverUrl = UStringHelper.charAtReverse(this._service_data_item.avatar);
                let url = cfg_avatar[parseInt(reverUrl[4])-1];
                UResManager.loadUrl(url,  avatar);
            }
            this._had_chargeNode.active = true; 
        }
    }

    protected onEnable(): void {
        AppGame.ins.roleModel.on(MRole.COMFIRM_HAD_CHARGE, this.confirm_had_charge, this);
        AppGame.ins.roleModel.on(MRole.CHARGE_CANCEL_CONFIRM_BOX, this.confirm_cancel_order, this);
        AppGame.ins.roleModel.on(MRole.COMFIRM_ORDER_INFO, this.confirm_order_info, this);
    }

    protected onDisable(): void {
        clearInterval(this._djs_interval);
        AppGame.ins.roleModel.off(MRole.COMFIRM_HAD_CHARGE, this.confirm_had_charge, this);
        AppGame.ins.roleModel.off(MRole.CHARGE_CANCEL_CONFIRM_BOX, this.confirm_cancel_order, this);
        AppGame.ins.roleModel.off(MRole.COMFIRM_ORDER_INFO, this.confirm_order_info, this);
    }

    // update (dt) {}
}
