import VWindow from "../../../common/base/VWindow";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import AppGame from "../../base/AppGame";
import { ECommonUI } from "../../../common/base/UAllenum";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VRegesterPopu extends VWindow {

    init(): void {
        super.init();
        var btnregester = UNodeHelper.find(this._root, "btn_reg");
        UEventHandler.addClick(btnregester, this.node, "VRegesterPopu", "onopenregester");
    }
    private onopenregester(): void {
        AppGame.ins.showUI(ECommonUI.LB_Regester);
        AppGame.ins.closeUI(this.uiType);
        this.playclick();
    }
    /**
   * 显示
   */
    show(data: any): void {
        super.show(data);
        this.showAnimation();
    }
}
