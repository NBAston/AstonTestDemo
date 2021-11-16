import VWindow from "../../../common/base/VWindow";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UDebug from "../../../common/utility/UDebug";
import VChargeItem from "./VChargeItem";
import UEventHandler from "../../../common/utility/UEventHandler";
import AppGame from "../../base/AppGame"; 
import { ConfirmTipBoxType, ECommonUI, EUIPos } from "../../../common/base/UAllenum";
import ULanHelper from "../../../common/utility/ULanHelper";
import MRole, { CHARGE_SCALE } from "../lobby/MRole";
import UNodePool from "../../../common/utility/UNodePool";
import { UIChargeOffLineData, UIChargeOffLineDataItem, UIChargeOffLineOrderItem, UIChargeOnLineDataItem, UIChargeOrderDetailItem } from "./ChargeData";
import VChargeConstants from "./chargeItem/VChargeConstants";
import VCharge from "./VCharge";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import { EBtnType } from "../lb_service_mail/MailServiceData";
const { ccclass, property } = cc._decorator;

@ccclass
export default class VChargeOrderDetail extends VWindow {
    _online_orderDetail: cc.Node = null;
    _online_orderNoLabel: cc.Label = null;
    _online_payTypeLabel: cc.Label = null;
    _online_statusLabel: cc.Label = null;
    _online_moneyLabel: cc.Label = null;
    _online_bzuidLabel: cc.Label = null;
    _online_createTimeLabel: cc.Label = null;


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
    _orderDetail: cc.Node = null;
    _page_two: cc.Node = null;
    private _qrcord: cc.Node = null;
    private _qr_code_btn: cc.Node = null;
    _lab_order_number: cc.Label = null;
    _lab_wallet_agreement: cc.Node = null;
    _lab_transfer_address: cc.Label = null;
    _lab_recharge_type: cc.Node = null;
    _lab_transfer_amount: cc.Label = null;
    _lab_transfer_rate: cc.Label = null;
    _lab_transfer_rate_usdt: cc.Label = null;
    _lab_time_limit: cc.Label = null;
    _copy_order_number_btn: cc.Node = null;
    _copy_address_btn: cc.Node = null;
    _reflesh_address_btn: cc.Node = null;
    _copy_usdt_btn: cc.Node = null;
    _cancel_order_btn: cc.Node = null;
    _transferred_btn: cc.Node = null;
    _contact_btn: cc.Node = null;
    _online_contactKefuBtn: cc.Node = null;
    _contactKefuBtn: cc.Node = null;
    _onlineCancelOrderBtn: cc.Node = null;
    _manager: any;
    _index: number;
    _money: number;// 选中的金额
    _orderId: string; // 订单编号
    _orderItem: UIChargeOrderDetailItem;
    _djs_minus: number = 25; // 倒计时分钟
    _djs_seconds: number = 59; // 倒计时秒
    _djs_interval: any = null; // 倒计时计时器
    private _back:cc.Node;
    private _service_data_item: any = null;
    _usdt_address: string = "";
    init(): void {
        super.init();
        this._online_orderDetail = UNodeHelper.find(this._root, "mask_bg/order_online_detail");
        this._online_orderNoLabel = UNodeHelper.find(this._root, "mask_bg/order_online_detail/detail/orderNo/label").getComponent(cc.Label);
        this._online_payTypeLabel = UNodeHelper.find(this._root, "mask_bg/order_online_detail/detail/skName/label").getComponent(cc.Label);// 支付通道
        this._online_statusLabel = UNodeHelper.find(this._root, "mask_bg/order_online_detail/detail/skAccount/label").getComponent(cc.Label);// 交易状态
        this._online_moneyLabel = UNodeHelper.find(this._root, "mask_bg/order_online_detail/detail/money/label").getComponent(cc.Label);
        this._online_bzuidLabel = UNodeHelper.find(this._root, "mask_bg/order_online_detail/detail/bzUID/label").getComponent(cc.Label);
        this._online_createTimeLabel = UNodeHelper.find(this._root, "mask_bg/order_online_detail/detail/createTime/label").getComponent(cc.Label);
        
        var online_copyOrderNoBtn = UNodeHelper.find(this._root, "mask_bg/order_online_detail/detail/orderNo/copyBtn");
        var online_copyNameBtn = UNodeHelper.find(this._root, "mask_bg/order_online_detail/detail/skName/copyBtn");
        var online_copyMoneyBtn = UNodeHelper.find(this._root, "mask_bg/order_online_detail/detail/money/copyBtn");
        var online_copyUidBtn = UNodeHelper.find(this._root, "mask_bg/order_online_detail/detail/bzUID/copyBtn");
        this._onlineCancelOrderBtn = UNodeHelper.find(this._root, "mask_bg/order_online_detail/detail/bottom_btn/cancelOrderBtn");
        this._online_contactKefuBtn = UNodeHelper.find(this._root, "mask_bg/order_online_detail/detail/bottom_btn/contactServiceBtn");

        UEventHandler.addClick(online_copyOrderNoBtn, this.node, "VChargeOrderDetail", "onclickCopyBtn", 1);
        // UEventHandler.addClick(copyNameBtn, this.node, "VChargeOrderDetail", "onclickCopyBtn", 2);
        // UEventHandler.addClick(online_copyMoneyBtn, this.node, "VChargeOrderDetail", "onclickCopyBtn",3);
        UEventHandler.addClick(online_copyMoneyBtn, this.node, "VChargeOrderDetail", "onclickCopyBtn", 4);
        UEventHandler.addClick(online_copyUidBtn, this.node, "VChargeOrderDetail", "onclickCopyBtn", 5);
        UEventHandler.addClick(this._online_contactKefuBtn, this.node, "VChargeOrderDetail", "onclickContactKefu");
        UEventHandler.addClick(this._onlineCancelOrderBtn, this.node, "VChargeOrderDetail", "onclickCancelOrder");
        this._orderDetail = UNodeHelper.find(this._root, "mask_bg/order_detail");
        this._cancelOrderBtn = UNodeHelper.find(this._root, "mask_bg/order_detail/detail/bottom_btn/cancelOrderBtn");
        this._hadChargeBtn = UNodeHelper.find(this._root, "mask_bg/order_detail/detail/bottom_btn/hadChargeBtn");
        this._contactKefuBtn = UNodeHelper.find(this._root, "mask_bg/order_detail/detail/bottom_btn/contactServiceBtn");
        var copyOrderNoBtn = UNodeHelper.find(this._root, "mask_bg/order_detail/detail/orderNo/copyBtn");
        var copyNameBtn = UNodeHelper.find(this._root, "mask_bg/order_detail/detail/skName/copyBtn");
        var copyAccountNoBtn = UNodeHelper.find(this._root, "mask_bg/order_detail/detail/skAccount/copyBtn");
        var copyMoneyBtn = UNodeHelper.find(this._root, "mask_bg/order_detail/detail/money/copyBtn");
        var copyUidBtn = UNodeHelper.find(this._root, "mask_bg/order_detail/detail/bzUID/copyBtn");

        this._orderNoLabel = UNodeHelper.find(this._root, "mask_bg/order_detail/detail/orderNo/label").getComponent(cc.Label);
        this._skNameLabel = UNodeHelper.find(this._root, "mask_bg/order_detail/detail/skName/label").getComponent(cc.Label);
        this._skAccountLabel = UNodeHelper.find(this._root, "mask_bg/order_detail/detail/skAccount/label").getComponent(cc.Label);
        this._moneyLabel = UNodeHelper.find(this._root, "mask_bg/order_detail/detail/money/label").getComponent(cc.Label);
        this._bzuidLabel = UNodeHelper.find(this._root, "mask_bg/order_detail/detail/bzUID/label").getComponent(cc.Label);
        this._createTimeLabel = UNodeHelper.find(this._root, "mask_bg/order_detail/detail/createTime/label").getComponent(cc.Label);
        this._chargeTimeLabel = UNodeHelper.find(this._root, "mask_bg/order_detail/detail/chargeTime/label").getComponent(cc.Label);

        UEventHandler.addClick(this._cancelOrderBtn, this.node, "VChargeOrderDetail", "onclickCancelOrder");
        UEventHandler.addClick(this._hadChargeBtn, this.node, "VChargeOrderDetail", "onclickHadChargeBtn");
        UEventHandler.addClick(this._contactKefuBtn, this.node, "VChargeOrderDetail", "onclickContactKefu");
        UEventHandler.addClick(copyOrderNoBtn, this.node, "VChargeOrderDetail", "onclickCopyBtn", 1);
        UEventHandler.addClick(copyNameBtn, this.node, "VChargeOrderDetail", "onclickCopyBtn", 2);
        UEventHandler.addClick(copyAccountNoBtn, this.node, "VChargeOrderDetail", "onclickCopyBtn",3);
        UEventHandler.addClick(copyMoneyBtn, this.node, "VChargeOrderDetail", "onclickCopyBtn", 4);
        UEventHandler.addClick(copyUidBtn, this.node, "VChargeOrderDetail", "onclickCopyBtn", 5);

        this._page_two = UNodeHelper.find(this._root, "mask_bg/page_two");
        this._qrcord = UNodeHelper.find(this._root, "mask_bg/page_two/address/qr_code");
        this._qr_code_btn = UNodeHelper.find(this._root, "mask_bg/page_two/address/qr_code_btn");
        UEventHandler.addClick(this._qrcord, this.node, "VChargeOrderDetail", "openQrcodeUI");
        UEventHandler.addClick(this._qr_code_btn, this.node, "VChargeOrderDetail", "openQrcodeUI");
        this._lab_order_number = UNodeHelper.find(this._root, "mask_bg/page_two/orderNo/lab_order_number").getComponent(cc.Label);
        this._lab_wallet_agreement = UNodeHelper.find(this._root, "mask_bg/page_two/lab_wallet_agreement");
        this._lab_transfer_address = UNodeHelper.find(this._root, "mask_bg/page_two/address/lab_transfer_address").getComponent(cc.Label);
        this._lab_recharge_type = UNodeHelper.find(this._root, "mask_bg/page_two/lab_recharge_type");
        this._lab_transfer_amount = UNodeHelper.find(this._root, "mask_bg/page_two/lab_transfer_amount").getComponent(cc.Label);
        this._lab_transfer_rate = UNodeHelper.find(this._root, "mask_bg/page_two/lab_transfer_rate").getComponent(cc.Label);
        this._lab_transfer_rate_usdt = UNodeHelper.find(this._root, "mask_bg/page_two/amount/lab_transfer_rate_usdt").getComponent(cc.Label);
        this._lab_time_limit = UNodeHelper.find(this._root, "mask_bg/page_two/djs_time/lab_time_limit").getComponent(cc.Label);
        
        this._copy_order_number_btn = UNodeHelper.find(this._root, "mask_bg/page_two/orderNo/copy_order_number_btn");
        this._copy_address_btn = UNodeHelper.find(this._root, "mask_bg/page_two/address/copy_address_btn");
        this._reflesh_address_btn = UNodeHelper.find(this._root, "mask_bg/page_two/address/reflesh_address_btn");
        this._copy_usdt_btn = UNodeHelper.find(this._root, "mask_bg/page_two/amount/copy_usdt_btn");
        this._cancel_order_btn = UNodeHelper.find(this._root, "mask_bg/page_two/bottom_btn/cancel_order_btn");
        this._transferred_btn = UNodeHelper.find(this._root, "mask_bg/page_two/bottom_btn/transferred_btn");
        this._contact_btn = UNodeHelper.find(this._root, "mask_bg/page_two/bottom_btn/contact_btn");
        UEventHandler.addClick(this._reflesh_address_btn, this.node, "VChargeOrderDetail", "onRefleshAddressBtn");
        UEventHandler.addClick(this._cancel_order_btn, this.node, "VChargeOrderDetail", "onclickCancelOrder");
        UEventHandler.addClick(this._transferred_btn, this.node, "VChargeOrderDetail", "onclickHadChargeBtn");
        UEventHandler.addClick(this._contact_btn, this.node, "VChargeOrderDetail", "onclickContactKefu");

        UEventHandler.addClick(this._copy_order_number_btn, this.node, "VChargeOrderDetail", "onclickUsdtCopyBtn" , 1);
        UEventHandler.addClick(this._copy_address_btn, this.node, "VChargeOrderDetail", "onclickUsdtCopyBtn" , 2);
        UEventHandler.addClick(this._copy_usdt_btn, this.node, "VChargeOrderDetail", "onclickUsdtCopyBtn" , 3);

        this._back = UNodeHelper.find(this.node,"back");
        UEventHandler.addClick(this._back,this.node,"VChargeOrderDetail","closeUI");
        
    }

    initItemInfo(orderItem: UIChargeOrderDetailItem, manager: any, isShowKefu: boolean): void { 
        this._manager = manager;
        this._orderItem = orderItem;
        this._orderId = orderItem.orderId;
        this._djs_minus = orderItem.minus;
        this._djs_seconds = orderItem.seconds;
        
        if(!isShowKefu) {
            this._online_contactKefuBtn.getComponent(cc.Button).interactable = false;
            this._contactKefuBtn.getComponent(cc.Button).interactable = false;
            this._contact_btn.getComponent(cc.Button).interactable = false;
        } else {
            this._online_contactKefuBtn.getComponent(cc.Button).interactable = true;
            this._contactKefuBtn.getComponent(cc.Button).interactable = true;
            this._contact_btn.getComponent(cc.Button).interactable = true;
        }

        if(orderItem.payType == 1) { // 线上支付
            this._orderDetail.active = false;
            this._page_two.active = false;
            this._online_orderDetail.active = true;
            this._online_orderNoLabel.string = orderItem.orderId;
            this._online_payTypeLabel.string = orderItem.rechargeTypeName;
            if(orderItem.status == 1) {
                this._onlineCancelOrderBtn.getComponent(cc.Button).interactable = true;
            } else {
                this._onlineCancelOrderBtn.getComponent(cc.Button).interactable = false;
            }
            if(orderItem.status == 1) {
                this._online_statusLabel.string = "未支付";
            } else if(orderItem.status == 2) {
                this._online_statusLabel.string = "待确认";
            } else if(orderItem.status == 3) {
                this._online_statusLabel.string = "已补发";
            } else if(orderItem.status == 4) {
                this._online_statusLabel.string = "已完成";
            } else if(orderItem.status == 5) {
                this._online_statusLabel.string = "已取消";
            } else if(orderItem.status == 6) {
                this._online_statusLabel.string = "超时取消";
            }
            this._online_moneyLabel.string = orderItem.amount;
            this._online_bzuidLabel.string = orderItem.userId+"";
            this._online_createTimeLabel.string = orderItem.createTime;
        } else { // 线下支付
            this._online_orderDetail.active = false;
            if(orderItem.usdtRate != 0 && orderItem.usdtAmount != 0) {
                this._orderDetail.active = false;
                this._page_two.active = true;
                this._lab_order_number.string = orderItem.orderId;
                this._lab_transfer_address.string = orderItem.accountNo;
                this._usdt_address = orderItem.accountNo;
                // this._skNameLabel.string = orderItem.name;
                this._lab_transfer_amount.string = orderItem.amount+"";
                this._lab_transfer_rate_usdt.string = orderItem.usdtAmount +"";
                this._lab_transfer_rate.string = orderItem.usdtRate +"";
                // this._createTimeLabel.string = orderItem.createTime;
                // this._bzuidLabel.string = orderItem.userId+"";
                if(orderItem.status == 1 && (orderItem.minus > 0 || orderItem.seconds > 0)) {
                    this._cancel_order_btn.getComponent(cc.Button).interactable = true;
                    this._transferred_btn.getComponent(cc.Button).interactable = true;
                    // this._reflesh_address_btn.getComponent(cc.Button).interactable = true;
                    this.initChargeUsdtTimeStick();
                } else {
                    // this._reflesh_address_btn.getComponent(cc.Button).interactable = false;
                    this._cancel_order_btn.getComponent(cc.Button).interactable = false;
                    this._transferred_btn.getComponent(cc.Button).interactable = false;
                    this._lab_time_limit.string = "00分00秒";
                }
               
            } else {
                this._orderDetail.active = true;
                this._page_two.active = false;
                this._skAccountLabel.string = orderItem.accountNo;
                this._skNameLabel.string = orderItem.name;
                this._moneyLabel.string = orderItem.amount;
                this._createTimeLabel.string = orderItem.createTime;
                this._orderNoLabel.string = orderItem.orderId;
                this._bzuidLabel.string = orderItem.userId+"";
                if(orderItem.status == 1 && (orderItem.minus > 0 || orderItem.seconds > 0)) {
                    this._cancelOrderBtn.getComponent(cc.Button).interactable = true;
                    this._hadChargeBtn.getComponent(cc.Button).interactable = true;
                    this.initChargeTimeStick();
                } else {
                    this._cancelOrderBtn.getComponent(cc.Button).interactable = false;
                    this._hadChargeBtn.getComponent(cc.Button).interactable = false;
                    this._chargeTimeLabel.string = "00分00秒";
                }
            }
        }


        
    }
    /**
    * 显示
    */
    show(data: any): void {
        super.show(data);
        this._service_data_item = null;
        this.initItemInfo(data.orderItem, data.manager, data.isShowKefu); 
    }

    // 补位0
    addZero(param: number) {
        return param < 10 ? ("0" + param) : (param + "");
    }

    // 开启定时器非usDT
    initChargeTimeStick():void {
        this._chargeTimeLabel.string = this.addZero(this._djs_minus) + "分" + this.addZero(this._djs_seconds) + "秒";
        this.scheduleOnce(()=>{
            this.runTimeStick();
        },0.8); 
        this._djs_interval = setInterval(()=>{
            this.runTimeStick();
        }, 1000);
    }

    runTimeStick(): void {
        this._chargeTimeLabel.string = this.addZero(this._djs_minus) + "分" + this.addZero(this._djs_seconds) + "秒"; 
        if(this._djs_minus == 0 && this._djs_seconds == 0) { // 倒计时结束自动取消订单
            this._cancelOrderBtn.getComponent(cc.Button).interactable = false;
            this._hadChargeBtn.getComponent(cc.Button).interactable = false;
            clearInterval(this._djs_interval);
            AppGame.ins.roleModel.requestCancelOffLineChargeOrder(this._orderItem.orderId, true);
        } else if(this._djs_minus >= 0) {
            if(this._djs_seconds > 0) {
                this._djs_seconds--;
            } else if(this._djs_seconds == 0) {
                this._djs_minus--;
                this._djs_seconds = 59;
            }
        }
    }

    runTimeUsdtStick(): void {
        this._lab_time_limit.string = this.addZero(this._djs_minus) + "分" + this.addZero(this._djs_seconds) + "秒"; 
        if(this._djs_minus == 0 && this._djs_seconds == 0) { // 倒计时结束自动取消订单
            // this._reflesh_address_btn.getComponent(cc.Button).interactable = false;
            this._cancel_order_btn.getComponent(cc.Button).interactable = false;
            this._transferred_btn.getComponent(cc.Button).interactable = false;
            clearInterval(this._djs_interval);
            AppGame.ins.roleModel.requestCancelOffLineChargeOrder(this._orderItem.orderId, true);
        } else if(this._djs_minus >= 0) {
            if(this._djs_seconds > 0) {
                this._djs_seconds--;
            } else if(this._djs_seconds == 0) {
                this._djs_minus--;
                this._djs_seconds = 59;
            }
        }
    }

    initChargeUsdtTimeStick():void {
        this._lab_time_limit.string = this.addZero(this._djs_minus) + "分" + this.addZero(this._djs_seconds) + "秒"; 
        this.scheduleOnce(()=>{
            this.runTimeUsdtStick();
        },0.8); 
        this._djs_interval = setInterval(()=>{
            this.runTimeUsdtStick();
        }, 1000);
    }

    // 刷新USDT收款地址
    onRefleshAddressBtn(): void {
        super.playclick();
        if(this._lab_time_limit.string =="00分00秒") {
            AppGame.ins.showTips("该状态无法重新获取收款地址");
            return;
        } 
        AppGame.ins.roleModel.requestRefleshUsdtAddress(1);
    }
    // 打开USDT 二维码界面
    openQrcodeUI(): void {
        AppGame.ins.showUI(ECommonUI.UI_CHARGE_USDT_QRCODE, this._usdt_address);
    }
    // 复制点击事件
    onclickCopyBtn(event: any, index: number) {
        super.playclick();
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

    onclickUsdtCopyBtn(event: any, index: number) {
        super.playclick();
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        if(index == 1) {
            UAPIHelper.onCopyClicked(this._orderItem.orderId);
        } else if(index == 2) {
            UAPIHelper.onCopyClicked(this._orderItem.accountNo);
        } else if(index == 3) {
            UAPIHelper.onCopyClicked(this._orderItem.amount);
        } 
    }

    // 取消订单 
    onclickCancelOrder() {
        // 直接弹框
        // this._manager.onclickCancelOrder();
        super.playclick();
        AppGame.ins.showUI(ECommonUI.CHARGE_CANCEL_CONFIRM_BOX);
    }

    // 联系客服
    onclickContactKefu() {
        super.playclick();
        AppGame.ins.closeUI(ECommonUI.UI_CHARGE_ORDER_DETAIL_BOX);
        if (this._service_data_item) {
            AppGame.ins.showUI(ECommonUI.LB_Chat, this._service_data_item);
        } else {
            AppGame.ins.showUI(ECommonUI.LB_Service_Mail,{ type: EBtnType.service, data: "" });
        }
    }

    // 点击对应的moneyItem
    onClickMoneyItem(index: number, money: number) {
        super.playclick();
        UDebug.log("点击金币+index"+index+"money = "+money);
    }


    // 已转账
    onclickHadChargeBtn() {
        super.playclick();
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
            AppGame.ins.roleModel.requestConfirmOrderInfo(this._orderItem.orderId);
            AppGame.ins.showUI(ECommonUI.LB_Chat, this._service_data_item);
        }
    }

    // 确认订单消息
    confirm_order_info(success: boolean, msg: string): void {
        if(success) {
            AppGame.ins.closeUI(ECommonUI.UI_CHARGE_ORDER_DETAIL_BOX);
        } else {
            AppGame.ins.showTips(msg);
        }
    }

    // 刷新USDT 地址
    reflesh_usdt_address(success: boolean, address: string): void {
        if(success) {
            AppGame.ins.showTips("刷新成功");
            this._lab_transfer_address.string = address;
            this._usdt_address = address;
        } else {
            AppGame.ins.showTips("刷新失败，请重新再试");
        }
    }

    confirm_cancel_order(isClose: boolean) {
        if(isClose) {
            AppGame.ins.closeUI(ECommonUI.CHARGE_CANCEL_CONFIRM_BOX);
            AppGame.ins.closeUI(ECommonUI.UI_CHARGE_ORDER_DETAIL_BOX);
            AppGame.ins.roleModel.requestCancelOffLineChargeOrder(this._orderItem.orderId, true);
        }
    }

    closeUI(){
        super.playclick();
        super.clickClose();
    }

    protected onEnable(): void {
        AppGame.ins.roleModel.on(MRole.COMFIRM_HAD_CHARGE, this.confirm_had_charge, this);
        AppGame.ins.roleModel.on(MRole.CHARGE_CANCEL_CONFIRM_BOX, this.confirm_cancel_order, this);
        AppGame.ins.roleModel.on(MRole.COMFIRM_ORDER_INFO, this.confirm_order_info, this);
        AppGame.ins.roleModel.on(MRole.REFLESH_USDT_ADDRESS, this.reflesh_usdt_address, this);
    }

    protected onDisable(): void {
        clearInterval(this._djs_interval);
        AppGame.ins.roleModel.off(MRole.COMFIRM_HAD_CHARGE, this.confirm_had_charge, this);
        AppGame.ins.roleModel.off(MRole.CHARGE_CANCEL_CONFIRM_BOX, this.confirm_cancel_order, this);
        AppGame.ins.roleModel.off(MRole.COMFIRM_ORDER_INFO, this.confirm_order_info, this);
        AppGame.ins.roleModel.off(MRole.REFLESH_USDT_ADDRESS, this.reflesh_usdt_address, this);
    }

   
}
