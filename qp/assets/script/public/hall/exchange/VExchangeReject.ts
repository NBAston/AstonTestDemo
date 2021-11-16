import { ECommonUI } from "../../../common/base/UAllenum";
import VWindow from "../../../common/base/VWindow";
import UEventHandler from "../../../common/utility/UEventHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../base/AppGame";
import { EBtnType } from "../lb_service_mail/MailServiceData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VExchangeReject extends VWindow {
    private _back:cc.Node;
    private _known:cc.Node;
    private _kefu:cc.Node;
    private _tipLabel:cc.Label;

    init(): void {
        super.init();
        this._back = UNodeHelper.find(this.node,"back");
        this._known = UNodeHelper.find(this._root,"confirm_btn");
        this._kefu = UNodeHelper.find(this._root,"contactServiceBtn");
        this._tipLabel = UNodeHelper.find(this._root,"tip_label").getComponent(cc.Label);
        UEventHandler.addClick(this._back,this.node, "VExchangeReject","closeUI");
        UEventHandler.addClick(this._known, this.node, "VExchangeReject", "closeUI");
        UEventHandler.addClick(this._kefu, this.node, "VExchangeReject", "onclickKefuBtn");
    }

    /**
    * 显示
    */
    show(data: any): void {
        super.show(data);
        if(data != null) {
            this._tipLabel.string = data;
        }
    }

    // 客服兑换
    onclickKefuBtn(): void {
        this.closeUI();
        AppGame.ins.showUI(ECommonUI.LB_Service_Mail,{ type: EBtnType.service, data: {service_type:2} });
    }

    closeUI() {
        super.clickClose();
    }
   

  
}
