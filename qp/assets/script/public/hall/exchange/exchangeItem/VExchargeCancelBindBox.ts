import { ECommonUI, EExchareType } from "../../../../common/base/UAllenum";
import VWindow from "../../../../common/base/VWindow";
import UEventHandler from "../../../../common/utility/UEventHandler";
import ULanHelper from "../../../../common/utility/ULanHelper";
import UNodeHelper from "../../../../common/utility/UNodeHelper";
import AppGame from "../../../base/AppGame";
const { ccclass, property } = cc._decorator;

@ccclass
export default class VExchargeCancelBindBox extends VWindow {
   
    _type: EExchareType = EExchareType.bank;
    _label: cc.Label = null;
    
    init(): void {
        super.init();
        this._label = UNodeHelper.find(this._root,"label").getComponent(cc.Label);
        var confirmBtn = UNodeHelper.find(this._root, "confirm_btn");
        UEventHandler.addClick(confirmBtn, this.node, "VExchargeCancelBindBox", "onclickConfirmBtn");
    }

    /**
    * 显示
    */
    show(data: any): void {
        super.show(data);
        this._type = data;
        if(this._type == EExchareType.bank) {
            this._label.string = ULanHelper.CONFIRM_TIP_BOX_TYPE[3];
        } else if(this._type == EExchareType.alipay) {
            this._label.string = ULanHelper.CONFIRM_TIP_BOX_TYPE[4];
        }
    }

    private onclickConfirmBtn(): void {
        AppGame.ins.closeUI(ECommonUI.EXCHANGE_CANCEL_BIND_BOX);
        AppGame.ins.roleModel.confirm_cancel_bindcard_click();
    }

  
}
