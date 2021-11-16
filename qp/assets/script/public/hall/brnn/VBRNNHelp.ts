import VBaseUI from "../../../common/base/VBaseUI";
import UHandler from "../../../common/utility/UHandler";
import UEventListener from "../../../common/utility/UEventListener";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import AppGame from "../../base/AppGame";


const { ccclass, property } = cc._decorator;
/**
 * 创建:sq
 * 作用:百人牛牛
 */
@ccclass
export default class VBRNNHelp extends VBaseUI {
    private close(): void {
        let ac = cc.scaleTo(0.2, 0.1, .1);
        this.node.runAction(cc.sequence(ac, cc.callFunc(() => {
            AppGame.ins.closeUI(this.uiType);
        }, this)));
    }
    /**
       * 初始化 UI创建的时候调用
       */
    init(): void {

        let bg = UNodeHelper.find(this.node, "back");
        UEventListener.get(bg).onClick = new UHandler(this.close, this);
        let close = UNodeHelper.find(this.node, "btn_close");
        UEventHandler.addClick(close, this.node, "VBRNNHelp", "close");

        let lh_help_bg = UNodeHelper.find(this.node, "bg");
        UEventListener.get(lh_help_bg).onClick = null;
    }
    /**
     *  隐藏
     */
    hide(handler?: UHandler): void {
        this.node.active = false;
    }
    /**
     * 显示
     */
    show(data: any): void {
        this.node.active = true;
        let ac = cc.scaleTo(0.1, 1, 1);
        this.node.runAction(ac);
    }
}
