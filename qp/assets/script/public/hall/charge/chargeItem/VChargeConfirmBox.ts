
import { ConfirmTipBoxType } from "../../../../common/base/UAllenum";
import VWindow from "../../../../common/base/VWindow";
import UEventHandler from "../../../../common/utility/UEventHandler";
import ULanHelper from "../../../../common/utility/ULanHelper";
import UNodeHelper from "../../../../common/utility/UNodeHelper";
import AppGame from "../../../base/AppGame";
const { ccclass, property } = cc._decorator;

@ccclass
export default class VChargeConfirmBox extends VWindow {
   

    _confirmTipBoxType: ConfirmTipBoxType = ConfirmTipBoxType.ConfirmHadChargeType;// 弹出框的类型
    _label: cc.Label = null;
    _richText: cc.RichText = null;
     
    init(): void {
        super.init();
        var confirmBtn = UNodeHelper.find(this._root, "confirm_btn");
        // var cancelBtn = UNodeHelper.find(this._root, "cancel_btn");
        this._label = UNodeHelper.find(this._root, "label").getComponent(cc.Label);
        this._richText = UNodeHelper.find(this._root, "usdt").getComponent(cc.RichText);
        UEventHandler.addClick(confirmBtn, this.node, "VChargeConfirmBox", "onclickConfirmBtn");
        // UEventHandler.addClick(cancelBtn, this.node, "VChargeConfirmBox", "onclickCancelBtn");
    }

    /**
    * 显示
    */
    show(data: any): void {
        super.show(data); 
        // data = {};
        if(data.constructor == Number) {
            this._confirmTipBoxType = parseInt(data+"");
            this._label.node.active = true;
            this._richText.node.active = false;
            if(data == ConfirmTipBoxType.ConfirmHadChargeType) {
                this._label.string = ULanHelper.CONFIRM_TIP_BOX_TYPE[1];
            } else if(data == ConfirmTipBoxType.ConfirmExchangeType) {
                this._label.string = ULanHelper.CONFIRM_TIP_BOX_TYPE[2];
            }
        } else { // usdt
            this._confirmTipBoxType = data.ConfirmExchangeType;
            this._richText.string = this._richText.string.replace("rmb","¥"+data.money).replace("usdt", data.usdtAmount+"USDT");
            this._richText.node.active = true;
            this._label.node.active = false;
        }

    } 

    private onclickConfirmBtn(): void {
        if(this._confirmTipBoxType == ConfirmTipBoxType.ConfirmHadChargeType) {
            AppGame.ins.roleModel.confirm_had_charge_click();
        } else if(this._confirmTipBoxType == ConfirmTipBoxType.ConfirmExchangeType) {
            AppGame.ins.roleModel.confirm_exchange_click();
        }
    }

    private onclickCancelBtn(): void {
        AppGame.ins.closeUI(this.uiType);
    }

    protected onEnable(): void {
       
    }

    protected onDisable(): void {
        this._richText.string = "确定要用<color=#CC5516> rmb </c>兑换<color=#CC5516> usdt </color>吗？兑换过程中，存在价格波动，请以实际兑换币数为准";
    }

  
}
