import { ECommonUI } from "../../../../common/base/UAllenum";
import VWindow from "../../../../common/base/VWindow";
import UEventHandler from "../../../../common/utility/UEventHandler";
import UNodeHelper from "../../../../common/utility/UNodeHelper";
import AppGame from "../../../base/AppGame";
const { ccclass, property } = cc._decorator;

@ccclass
export default class VChargeCancelConfirmBox extends VWindow {
   

    init(): void {
        super.init();
        var confirmBtn = UNodeHelper.find(this._root, "confirm_btn");
        UEventHandler.addClick(confirmBtn, this.node, "VChargeCancelConfirmBox", "onclickConfirmBtn");
    }

    /**
    * 显示
    */
    show(data: any): void {
        super.show(data);
    }

    private onclickConfirmBtn(): void {
        // AppGame.ins.closeUI(ECommonUI.CHARGE_CONFIRM_BOX);
        AppGame.ins.roleModel.confirm_order_cancel_click();
    }

  
}
