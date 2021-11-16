import { ConfirmTipBoxType, ECommonUI } from "../../../../common/base/UAllenum";
import UResManager from "../../../../common/base/UResManager";
import { UAPIHelper } from "../../../../common/utility/UAPIHelper";
import UDebug from "../../../../common/utility/UDebug";
import UEventHandler from "../../../../common/utility/UEventHandler";
import ULanHelper from "../../../../common/utility/ULanHelper";
import UNodeHelper from "../../../../common/utility/UNodeHelper";
import UQRCode from "../../../../common/utility/UQRCode";
import UStringHelper from "../../../../common/utility/UStringHelper";
import cfg_avatar from "../../../../config/cfg_avatar";
import AppGame from "../../../base/AppGame";
import MRole, { CHARGE_SCALE } from "../../lobby/MRole";
import { UIChargeOffLineDataItem, UIChargeOffLineOrderItem } from "../ChargeData";
import VCharge from "../VCharge";
import VChargeConstants from "./VChargeConstants";
import VChargeMoneyItem from "./VChargeMoneyItem";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VChargeListUsdtDetailItem extends cc.Component {
    private _qrcord: cc.Node = null;
    private _qr_code_btn: cc.Node = null;
    @property(cc.SpriteFrame)
    normalImg:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    inputImg:cc.SpriteFrame = null;
    _coin_label: cc.Label = null;
    _money_editBox: cc.EditBox = null;
    _scroll_content: cc.Node = null;
    _manager: VCharge;
    _index:number;
    _payType:number;
    _money:number;// 选中的金额
    _moneyBtnArr: Array<VChargeMoneyItem> = [];
    _offLineItem: UIChargeOffLineDataItem;
    _page_one: cc.Node = null;
    _protocol_lab: cc.Node = null;
    _usdt_label: cc.Label = null;
    _exchange_rate: cc.Label = null;
    _agreement_description_btn: cc.Node = null;
    _refresh_btn: cc.Node = null;
    _usdt_description_btn: cc.Node = null;
    _page_two: cc.Node = null;
    _lab_order_number: cc.Label = null;
    _lab_wallet_agreement: cc.Node = null;
    _lab_transfer_address: cc.Label = null;
    _reflesh_address_btn:cc.Node = null;
    _lab_recharge_type: cc.Node = null;
    _lab_transfer_amount: cc.Label = null;
    _lab_transfer_rate: cc.Label = null;
    _lab_transfer_rate_usdt: cc.Label = null;
    _lab_time_limit: cc.Label = null;
    _copy_order_number_btn: cc.Node = null;
    _copy_address_btn: cc.Node = null;
    _copy_usdt_btn: cc.Node = null;
    _cancel_order_btn: cc.Node = null;
    _transferred_btn: cc.Node = null;
    _contact_btn: cc.Node = null;
    _page_three: cc.Node = null;
    _contact_btn3: cc.Node = null;
    _orderId: string = "";
    _orderItem: UIChargeOffLineOrderItem;
    _djs_minus: number = 25; // 倒计时分钟
    _djs_seconds: number = 59; // 倒计时秒
    _djs_interval: any = null; // 倒计时计时器
    _service_data_item:any = null;
    _usdt_address: string = "";
    _isShow:boolean = false;
    // onLoad () {}
    /**
     * @param index 索引
     * @param payType 支付类型
     * @param manager Vcharge
     */
    initItemInfo(index: number, offLineItem: UIChargeOffLineDataItem, manager: VCharge): void { 
        
        // pageone
        this._page_one = UNodeHelper.find(this.node, "page_one");
        var createOrderBtn = UNodeHelper.find(this.node, "page_one/create_order_btn");
        var contactKefuBtn = UNodeHelper.find(this.node, "page_one/contact_btn");
        var clearBtn = UNodeHelper.find(this.node, "page_one/btn_clear");
        this._coin_label = UNodeHelper.find(this.node, "page_one/coin_num").getComponent(cc.Label);
        this._usdt_label = UNodeHelper.find(this.node, "page_one/moneyEditbox/usdt_num").getComponent(cc.Label);
        this._protocol_lab = UNodeHelper.find(this.node, "page_one/protocol_lab");
        this._exchange_rate = UNodeHelper.find(this.node, "page_one/exchange_rate").getComponent(cc.Label);
        this._money_editBox = UNodeHelper.find(this.node, "page_one/moneyEditbox").getComponent(cc.EditBox);
        this._agreement_description_btn = UNodeHelper.find(this.node, "page_one/agreement_description_btn");
        this._refresh_btn = UNodeHelper.find(this.node, "page_one/refresh_btn");
        this._usdt_description_btn = UNodeHelper.find(this.node, "page_one/usdt_description_btn");

        UEventHandler.addClick(this._usdt_description_btn, this.node, "VChargeListUsdtDetailItem", "onClickUsdtXyBtn");
        UEventHandler.addClick(this._agreement_description_btn, this.node, "VChargeListUsdtDetailItem", "onClickwallAgreementBtn");
        UEventHandler.addClick(this._refresh_btn, this.node, "VChargeListUsdtDetailItem", "refleshUsdtRate");
        UEventHandler.addClick(createOrderBtn, this.node, "VChargeListUsdtDetailItem", "onclickCreateOrder");
        UEventHandler.addClick(contactKefuBtn, this.node, "VChargeListUsdtDetailItem", "onclickContactKefu");
        UEventHandler.addClick(clearBtn, this.node, "VChargeListUsdtDetailItem", "clearMoney");

        // pagetwo 
        this._page_two = UNodeHelper.find(this.node, "page_two");
        this._lab_order_number = UNodeHelper.find(this.node, "page_two/order_no/lab_order_number").getComponent(cc.Label);
        this._lab_wallet_agreement = UNodeHelper.find(this.node, "page_two/lab_wallet_agreement");
        this._lab_transfer_address = UNodeHelper.find(this.node, "page_two/address/lab_transfer_address").getComponent(cc.Label);
        this._lab_recharge_type = UNodeHelper.find(this.node, "page_two/lab_recharge_type");
        this._lab_transfer_amount = UNodeHelper.find(this.node, "page_two/lab_transfer_amount").getComponent(cc.Label);
        this._lab_transfer_rate = UNodeHelper.find(this.node, "page_two/lab_transfer_rate").getComponent(cc.Label);
        this._lab_transfer_rate_usdt = UNodeHelper.find(this.node, "page_two/amount/lab_transfer_rate_usdt").getComponent(cc.Label);
        this._lab_time_limit = UNodeHelper.find(this.node, "page_two/djs_time/lab_time_limit").getComponent(cc.Label);
        this._qrcord = UNodeHelper.find(this.node, "page_two/address/qr_code");
        this._qr_code_btn = UNodeHelper.find(this.node, "page_two/address/qr_code_btn");
        UEventHandler.addClick(this._qrcord, this.node, "VChargeListUsdtDetailItem", "openQrcodeUI");
        UEventHandler.addClick(this._qr_code_btn, this.node, "VChargeListUsdtDetailItem", "openQrcodeUI");
       
        this._copy_order_number_btn = UNodeHelper.find(this.node, "page_two/order_no/copy_order_number_btn");
        this._copy_address_btn = UNodeHelper.find(this.node, "page_two/address/copy_address_btn");
        this._reflesh_address_btn = UNodeHelper.find(this.node, "page_two/address/reflesh_address_btn");
        this._copy_usdt_btn = UNodeHelper.find(this.node, "page_two/amount/copy_usdt_btn");
        this._cancel_order_btn = UNodeHelper.find(this.node, "page_two/cancel_order_btn");
        this._transferred_btn = UNodeHelper.find(this.node, "page_two/transferred_btn");
        this._contact_btn = UNodeHelper.find(this.node, "page_two/contact_btn");
        
        this._page_three = UNodeHelper.find(this.node, "page_three");
        this._contact_btn3 = UNodeHelper.find(this.node, "page_three/tip_bg/contact_btn");
        UEventHandler.addClick(this._reflesh_address_btn, this.node, "VChargeListUsdtDetailItem", "onRefleshAddressBtn");
        UEventHandler.addClick(this._copy_order_number_btn, this.node, "VChargeListUsdtDetailItem", "onclickCopyBtn" , 1);
        UEventHandler.addClick(this._copy_address_btn, this.node, "VChargeListUsdtDetailItem", "onclickCopyBtn" , 2);
        UEventHandler.addClick(this._copy_usdt_btn, this.node, "VChargeListUsdtDetailItem", "onclickCopyBtn" , 3);

        UEventHandler.addClick(this._cancel_order_btn, this.node, "VChargeListUsdtDetailItem", "onclickCancelOrderBtn");
        UEventHandler.addClick(this._transferred_btn, this.node, "VChargeListUsdtDetailItem", "onclickHadChargeBtn");
        UEventHandler.addClick(this._contact_btn, this.node, "VChargeListUsdtDetailItem", "onclickContactKefu");
        UEventHandler.addClick(this._contact_btn3, this.node, "VChargeListUsdtDetailItem", "onclickContactKefu");

        this.updata_score(AppGame.ins.roleModel.getRoleGold());
        this._money_editBox.enabled = false;
        this._money_editBox.placeholderLabel.string = "请输入充值金额，限额"+offLineItem.minMoneyLimit+"~"+offLineItem.maxMoneyLimit;
        this._money_editBox.node.on("text-changed", this.setUsdtAmount, this);
        this._money_editBox.node.on('editing-did-began', this.editDidBegan, this);
        this._money_editBox.node.on('editing-did-ended', this.editDidEnded, this);  

        //初始化usdt充值客服
        let serviceNum = AppGame.ins.charge_service_items.length;
        let randServiceItem = Math.floor(Math.random()*serviceNum+1)
        let randService:any = AppGame.ins.charge_service_items[randServiceItem -1];
        if(randService) {
            let serviceName = UNodeHelper.getComponent(this.node, "page_three/tip_bg/kefu_name", cc.Label);
            let icon = UNodeHelper.find(this.node, "page_three/tip_bg/kefu_icon");
            serviceName.string = randService.nickname;
            let reverUrl = UStringHelper.charAtReverse(randService.avatar);
            let url = cfg_avatar[parseInt(reverUrl[4])-1];
            UResManager.loadUrl(url,  icon.getComponent(cc.Sprite));
        }

        /*if(offLineItem.inputSw == 0) {
            this._money_editBox.enabled = false;
            this._money_editBox.placeholderLabel.string = "请选择以下固定充值金额";
        } else {
            this._money_editBox.placeholderLabel.string = "请输入充值金额，限额"+offLineItem.minMoneyLimit+"~"+offLineItem.maxMoneyLimit;
        }*/

        AppGame.ins.roleModel.requestGetUsdtExchangeRate();
        this.setShowPage(true, false, false);
        this._manager = manager;
        this._offLineItem = offLineItem;
        this._index = index;
        this._payType = offLineItem.type;
    }

    start () {

    }

    setShowPage(pageOne: boolean, pageTwo: boolean, pageThree: boolean) {
        this._page_one.active = pageOne;
        this._page_two.active = pageTwo;
        this._page_three.active = pageThree;
    }
    editDidBegan(): void {
        this._money_editBox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.inputImg;
    }

    editDidEnded(): void {
        if(this.checkMoney()) {
        this._money_editBox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.normalImg;
    }
    }
    setUsdtAmount(): void {
        if(this._money_editBox.string == "") {
            this._money_editBox.string  = "";
            this._usdt_label.string = "0";
        } else {
            let money = parseFloat(this._money_editBox.string == ""?"0":this._money_editBox.string);
            let rate = parseFloat(this._exchange_rate.string);
            this._usdt_label.string = parseFloat((money/rate)+"").toFixed(3).slice(0,-1);
        }
    }
    
    // 打开USDT 二维码界面
    openQrcodeUI(): void {
        AppGame.ins.showUI(ECommonUI.UI_CHARGE_USDT_QRCODE, this._usdt_address);
    }

    // 刷新USDT费率
    refleshUsdtRate(): void {
        AppGame.ins.roleModel.requestGetUsdtExchangeRate();
    }

    // 钱包协议
    onClickwallAgreementBtn() {
        AppGame.ins.showUI(ECommonUI.UI_USDT_HELP, 1);
    }

    // 什么是usdt协议点击
    onClickUsdtXyBtn() {
        AppGame.ins.showUI(ECommonUI.UI_USDT_HELP, 0);
    }

    // 点击复制按钮
    onclickCopyBtn(event: any, index: number): void {
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        if(index == 1) {
            UAPIHelper.onCopyClicked(this._orderItem.orderId);
        } else if(index == 2) {
            UAPIHelper.onCopyClicked(this._orderItem.accountNo);
        } else if(index == 3) {
            UAPIHelper.onCopyClicked(this._orderItem.amount);
        } 
    }

    // 刷新USDT收款地址
    onRefleshAddressBtn(): void {
        if(this._djs_minus == 0 && this._djs_seconds == 0) {
            AppGame.ins.showTips("该状态无法重新获取收款地址");
            return;
        } 
        AppGame.ins.roleModel.requestRefleshUsdtAddress(1);
    }
    // 取消订单
    onclickCancelOrderBtn() { 
        AppGame.ins.showUI(ECommonUI.CHARGE_CANCEL_CONFIRM_BOX);
    }

    // 创建订单
    onclickCreateOrder() {
        // 核对充值金额是否在范围内
        if(this.checkMoney()) {
            AppGame.ins.roleModel.requestCreateOffLineChargeOrder(this._offLineItem.rechargeTypeId, parseFloat(this._money_editBox.string), true, 1,  parseFloat(this._exchange_rate.string), parseFloat(this._usdt_label.string) );
        }
    }

    checkMoney(): boolean {

        if(UStringHelper.isEmptyString(this._money_editBox.string)) {
            /*if(this._offLineItem.inputSw == 0) {
                AppGame.ins.showTips("请选择固定充值金额"); 
            } else {
                AppGame.ins.showTips("请输入充值金额"); 
            }*/
            AppGame.ins.showTips("请输入充值金额"); 
            return false;
        }

        if(!UStringHelper.isFloat(this._money_editBox.string)) {
            AppGame.ins.showTips("充值金额请输入数字");
            this.clearMoney();   
            return false;
        }
        if(!UStringHelper.checkPointTwoData(this._money_editBox.string)) {
            AppGame.ins.showTips("充值金额最多只能输入两位小数");
            this.clearMoney();
            return false;
        }
        let orderAmount = parseFloat(this._money_editBox.string);
        if(parseFloat(this._money_editBox.string) < this._offLineItem.minMoneyLimit) {
            AppGame.ins.showTips("充值金额不能小于" + this._offLineItem.minMoneyLimit +"元"); 
            // this.clearMoney();
            this._money_editBox.string = this._offLineItem.minMoneyLimit+"";
            return false;
        }
        if(orderAmount > this._offLineItem.maxMoneyLimit) {
            AppGame.ins.showTips("充值金额不能大于" + this._offLineItem.maxMoneyLimit +"元"); 
            // this.clearMoney();
            this._money_editBox.string = this._offLineItem.maxMoneyLimit+"";
            return false;
        }
        return true;
    }

    // 联系客服
    onclickContactKefu() {
        if (this._service_data_item) { 
            AppGame.ins.showUI(ECommonUI.LB_Chat, this._service_data_item);
        } else {
            this._manager.onclickContactKefu();
        }
    }

      // 已转账
    onclickHadChargeBtn() {
        let serviceNum = AppGame.ins.charge_service_items.length;
        let randServiceItem = Math.floor(Math.random()*serviceNum+1)
        let randService = AppGame.ins.charge_service_items[randServiceItem -1];
        let datainfo = '用户id：'+ this._orderItem.userId + "\n" + '订单编号：' +this._orderItem.orderId + "\n" + '创建时间：' + this._orderItem.createTime
        +"\n"+ "转账金额：" + this._orderItem.amount +"\n" + '收款地址：' + this._orderItem.accountNo 
        this._service_data_item = randService;
        AppGame.ins.showUI(ECommonUI.CHARGE_CONFIRM_BOX, ConfirmTipBoxType.ConfirmHadChargeType);
        if(randService) {
            AppGame.ins.sendChargeMsg(datainfo, randService);
        }
    }

    // 点击对应的moneyItem
    onClickMoneyItem(tIndex: number, money: number) {
        let count = this._scroll_content.childrenCount;
        let moneyArr = this._scroll_content.children;
        if(count > 0) {
           for (let index = 0; index < count; index++) {
               const element = moneyArr[index];
               if(tIndex == index) {
                   UNodeHelper.find(element, "check_bg").active = true;
                   UNodeHelper.find(element, "label").color = new cc.Color(255, 255, 255);
               } else {
                   UNodeHelper.find(element, "check_bg").active = false;
                   UNodeHelper.find(element, "label").color = new cc.Color(164, 116, 51);
               } 
           }  
        }
        this._money = money;
        this._money_editBox.string = money +""; //+ "元";
    }
     // 补位0
     addZero(param: number) {
        return param < 10 ? ("0" + param) : (param + "");
    }

    // 初始化page2页面数据
    initPageTwoUI(orderItem: UIChargeOffLineOrderItem) {
        this._orderItem = orderItem;
        this._orderId = orderItem.orderId;
        this._lab_order_number.string = orderItem.orderId;
        this._lab_transfer_address.string = orderItem.accountNo;
        this._usdt_address = orderItem.accountNo;
        // this._skNameLabel.string = orderItem.name;
        this._lab_transfer_amount.string = orderItem.amount;
        this._lab_transfer_rate_usdt.string = this._usdt_label.string;
        // this._createTimeLabel.string = orderItem.createTime;
        // this._bzuidLabel.string = orderItem.userId+"";
        this._djs_minus = orderItem.timeSurplus - 1;
        this._djs_seconds = 59;
        this.initChargeTimeStick()
    }

    // 开启定时器
    initChargeTimeStick():void {
        // this._reflesh_address_btn.getComponent(cc.Button).interactable = true;
        this._lab_time_limit.string = this.addZero(this._djs_minus+1) + "分" + this.addZero(0) + "秒"; 
        this._djs_interval = setInterval(()=>{
        this._lab_time_limit.string = this.addZero(this._djs_minus) + "分" + this.addZero(this._djs_seconds) + "秒"; 
        if(this._djs_minus == 0 && this._djs_seconds == 0) { // 倒计时结束自动取消订单
            // this._reflesh_address_btn.getComponent(cc.Button).interactable = false;
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

    // 清空充值金额
    clearMoney() {
        this._money_editBox.string = "";
        this._usdt_label.string = "0";
        // this._money_editBox.focus();
    }

    private create_offline_charge_order(orderItem: UIChargeOffLineOrderItem, isSuccess: boolean, errMsg: string, isUsdt: boolean) :void {
        if(isSuccess && isUsdt) { // 创建订单成功
            AppGame.ins.showTips("创建成功");
            this.setShowPage(false, true, false);
            this.initPageTwoUI(orderItem);
        } else {
            AppGame.ins.showTips(errMsg);
        }
    }

     // 更新USDT费率消息监听
     private update_usdt_rate(isSuccess: boolean, usdeRate: number, errMsg: string) {
        if(isSuccess) {
            if(this._isShow) {
                AppGame.ins.showTips("刷新成功");
            }
            this._isShow = true;
            this._exchange_rate.string = usdeRate+"";
            this._lab_transfer_rate.string = usdeRate+"";
            this._money_editBox.enabled = true;
        } else {
            AppGame.ins.showTips("刷新失败，请重新再试");
        }
    }

    // 确认已经转账
    confirm_had_charge(isClose: boolean) {
        if(isClose) {

            AppGame.ins.closeUI(ECommonUI.CHARGE_CONFIRM_BOX);
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
    private updata_score(score: number): void {
        this._coin_label.string = UStringHelper.getMoneyFormat(score * CHARGE_SCALE, -1,false,true).toString();
    }

     // 确认订单消息
     confirm_order_info(success: boolean, msg: string): void {
        AppGame.ins.showTips(msg)
        if(success) {
            this.setShowPage(false, false, true);
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

    // 监听用户金币改动消息
    protected onEnable(): void {
        AppGame.ins.roleModel.on(MRole.UPDATA_SCORE, this.updata_score, this);
        AppGame.ins.roleModel.on(MRole.UPDATE_OFFLINE_CREATE_ORDER, this.create_offline_charge_order, this);
        AppGame.ins.roleModel.on(MRole.CHARGE_CANCEL_CONFIRM_BOX, this.confirm_cancel_order, this);
        AppGame.ins.roleModel.on(MRole.COMFIRM_HAD_CHARGE, this.confirm_had_charge, this);
        AppGame.ins.roleModel.on(MRole.UPDATE_USDT_RATE, this.update_usdt_rate, this);
        AppGame.ins.roleModel.on(MRole.COMFIRM_ORDER_INFO, this.confirm_order_info, this);
        AppGame.ins.roleModel.on(MRole.REFLESH_USDT_ADDRESS, this.reflesh_usdt_address, this);
    }

    protected onDisable(): void {
        this._isShow = false;
        clearInterval(this._djs_interval);
        AppGame.ins.roleModel.off(MRole.UPDATA_SCORE, this.updata_score, this);
        AppGame.ins.roleModel.off(MRole.UPDATE_OFFLINE_CREATE_ORDER, this.create_offline_charge_order, this);
        AppGame.ins.roleModel.off(MRole.CHARGE_CANCEL_CONFIRM_BOX, this.confirm_cancel_order, this);
        AppGame.ins.roleModel.off(MRole.COMFIRM_HAD_CHARGE, this.confirm_had_charge, this);
        AppGame.ins.roleModel.off(MRole.UPDATE_USDT_RATE, this.update_usdt_rate, this);
        AppGame.ins.roleModel.off(MRole.COMFIRM_ORDER_INFO, this.confirm_order_info, this);
        AppGame.ins.roleModel.off(MRole.REFLESH_USDT_ADDRESS, this.reflesh_usdt_address, this);

    }

}


