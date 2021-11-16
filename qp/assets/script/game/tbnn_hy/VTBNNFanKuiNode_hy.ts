import VBaseUI from "../../common/base/VBaseUI";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventListener from "../../common/utility/UEventListener";
import UHandler from "../../common/utility/UHandler";
import UEventHandler from "../../common/utility/UEventHandler";
import AppGame from "../../public/base/AppGame";



const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:qznn 反馈界面 not use
 */
@ccclass
export default class VTBNNFanKuiNode_hy extends VBaseUI {

    placeholder: cc.Label = null;
    editbox: cc.EditBox = null;
    _back:cc.Node = null;
    // init 
    start() {
        //背景拦截 
        this._back = UNodeHelper.find(this.node, "back");
        UEventListener.get(this._back).onClick = new UHandler(() => {
            this._back["_touchListener"].setSwallowTouches(true);
        }, this);

        let close = UNodeHelper.find(this.node, "btn_close");
        UEventHandler.addClick(close, this.node, "VTBNNFanKuiNode_hy", "close");

        let btn_yes = UNodeHelper.find(this.node, "qznn_tips_btn2");
        UEventHandler.addClick(btn_yes, this.node, "VTBNNFanKuiNode_hy", "onBtnYesClick");

        this.editbox = UNodeHelper.getComponent(this.node,"qznnEditBox",cc.EditBox);
        // this.editbox.placeholderFontSize = 25;
        // this.editbox.lineHeight = 30;
        //有问题，代码设置 这个占位符的行高也没用
        this.placeholder = UNodeHelper.getComponent(this.node,"qznnEditBox/PLACEHOLDER_LABELqqq",cc.Label);
        this.placeholder.lineHeight = 30;

        //占位符 要填个空格,才不会
    }

    show(data: any) {
        super.show(data);

        // this.node.active = true;

        this.node.setScale(0.1, 0.1);
        let ac = cc.scaleTo(0.1, 1, 1);
        ac.easing(cc.easeInOut(2.0));
        this.node.runAction(ac);
    }

    private close(): void {
        let ac = cc.scaleTo(0.1, 0.1, .1);
        ac.easing(cc.easeInOut(2.0));
        this.node.runAction(cc.sequence(ac, cc.callFunc(() => {
            AppGame.ins.closeUI(this.uiType);
        }, this)));
    }

    private onBtnYesClick():void
    {
        cc.log("反馈确定按钮");
    }

    private onEditBoxBegan() {
        this.placeholder.node.active = false;
    }

    private onEditBoxEnded() {
        
        this.placeholder.node.active = false;

        if (this.editbox.string == ''){
            this.placeholder.node.active = true;   
        }
    }

    private onEditBoxChanged() {
        
    }
    private onEditBoxReturn() {
        this.placeholder.node.active = false;
        if (this.editbox.string == ''){
            this.placeholder.node.active = true;   
        }    
    }
}
