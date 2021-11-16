import { error } from "console";
import { ECommonUI, ConfirmTipBoxType } from "../../../common/base/UAllenum";
import VWindow from "../../../common/base/VWindow";
import { EventManager } from "../../../common/utility/EventManager";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import UDebug from "../../../common/utility/UDebug";
import UEventHandler from "../../../common/utility/UEventHandler";
import ULanHelper from "../../../common/utility/ULanHelper";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import cfg_event from "../../../config/cfg_event";
import AppGame from "../../base/AppGame";
import MRole from "../lobby/MRole";

const {ccclass, property} = cc._decorator;
const CHARGE_SCALE_100 = 100

@ccclass
export default class Vcustom_charge_order extends VWindow {

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}
    private _charge_score: cc.Label;
    private _recieve_account: cc.Label;
    private _create_time: cc.Label;
    private _recieve_account_no: cc.Label;
    private _user_id: cc.Label;
    private _bank: cc.Label;
    private _order_no: cc.Label;

    private lbArr :Array<cc.Label>;
    private _charge_confirm_btn : cc.Node;
    private _orderId: string;
    private _orderData: any;

    start () {

    }

     /**
  * 显示
  */
    show(data: any): void {
        super.show(data);
        // AppGame.ins.roleModel.on(MRole.UPDATE_OFFLINE_CREATE_ORDER, this.onCreateOrder, this);
        this.updateData(data);
    }

    init(): void {
        super.init();
        this.lbArr = [];
        let root = UNodeHelper.find(this.node, "root");
        this._charge_score = UNodeHelper.getComponent(root, "LbLayout2/charge_score", cc.Label);
        this._recieve_account = UNodeHelper.getComponent(root, "LbLayout2/recieve_account", cc.Label);
        this._create_time = UNodeHelper.getComponent(root, "LbLayout2/create_time", cc.Label);
        this._recieve_account_no = UNodeHelper.getComponent(root, "LbLayout2/recieve_account_no", cc.Label);
        this._user_id = UNodeHelper.getComponent(root, "LbLayout2/user_id", cc.Label);
        this._order_no = UNodeHelper.getComponent(root, "LbLayout2/order_no", cc.Label);
        this.lbArr.push(this._recieve_account);
        this.lbArr.push(this._recieve_account_no);
        this.lbArr.push(this._order_no);
        this.lbArr.push(this._charge_score);

        this._charge_confirm_btn = UNodeHelper.find(root, "charge_confirm");

        let _recieve_account_copy = UNodeHelper.find(root, "LbLayout3/recieve_account_copy");
        let _recieve_account_no_copy = UNodeHelper.find(root, "LbLayout3/recieve_account_no_copy");
        let _order_no_copy = UNodeHelper.find(root, "LbLayout3/order_no_copy");
        let _charge_score_copy = UNodeHelper.find(root, "LbLayout3/charge_score_copy");

        UEventHandler.addClick(_recieve_account_copy, this.node, "Vcustom_charge_order", "onCopy");
        UEventHandler.addClick(_recieve_account_no_copy, this.node, "Vcustom_charge_order", "onCopy");
        UEventHandler.addClick(_order_no_copy, this.node, "Vcustom_charge_order", "onCopy");
        UEventHandler.addClick(_charge_score_copy, this.node, "Vcustom_charge_order", "onCopy");

        UEventHandler.addClick(this._charge_confirm_btn, this.node, "Vcustom_charge_order", "onChargeConfirm");
    }

    onCopy(event: TouchEvent) {
        let eve = event;
        this.lbArr.forEach(element => {
            let eventTargeName = event.target["name"].substr(0,event.target["name"].length-5);
            if(element.node.name == eventTargeName) {
                AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
                UAPIHelper.onCopyClicked((element.string));
                UDebug.Log(""+element.string)
            }
        });
    }

    updateData(data: any) {
        UDebug.Log("更新页面数据"+ data);
        if (!data || data == {}) {
            console.error("订单数据为空");
        }
        this._orderId = data.orderId;
        this._charge_score.string = data.amount + "";
        this._recieve_account.string = data.name;
        this._create_time.string = data.createTime;
        this._recieve_account_no.string = data.accountNo;
        this._user_id.string = data.userId + "";
        this._order_no.string =  data.orderId;
        this._orderData = data;
    }

    onChargeConfirm(event: TouchEvent) {
        AppGame.ins.showUI(ECommonUI.CHARGE_CONFIRM_BOX, ConfirmTipBoxType.ConfirmHadChargeType);
        EventManager.getInstance().raiseEvent(cfg_event.SEND_ORDER_MESSAGE, this._orderData)
    }

    private confirm_had_charge(isClose: boolean): void {
        if(isClose) {
            AppGame.ins.closeUI(ECommonUI.CHARGE_CONFIRM_BOX);
            AppGame.ins.roleModel.requestConfirmOrderInfo(this._orderId);
        } 
    }

     // 确认订单消息
     confirm_order_info(success: boolean, msg: string): void {
        AppGame.ins.showTips(msg)
        if(success) {
            AppGame.ins.roleModel.requestOrderList();
            super.clickClose();
        } 
    }

 // 监听用户金币改动消息
    protected onEnable(): void {
        AppGame.ins.roleModel.on(MRole.COMFIRM_HAD_CHARGE, this.confirm_had_charge, this);
        AppGame.ins.roleModel.on(MRole.COMFIRM_ORDER_INFO, this.confirm_order_info, this);
    }

    protected onDisable(): void {
        AppGame.ins.roleModel.off(MRole.COMFIRM_HAD_CHARGE, this.confirm_had_charge, this);
        AppGame.ins.roleModel.off(MRole.COMFIRM_ORDER_INFO, this.confirm_order_info, this);


    }
    // update (dt) {}
}
