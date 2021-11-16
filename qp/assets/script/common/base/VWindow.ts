import VBaseUI from "./VBaseUI";
import UNodeHelper from "../utility/UNodeHelper";
import UEventHandler from "../utility/UEventHandler";
import UEventListener from "../utility/UEventListener";
import UHandler from "../utility/UHandler";
import AppGame from "../../public/base/AppGame";

const { ccclass, property } = cc._decorator;

/**
 * 弹出框的基类
 */
@ccclass
export default class VWindow extends VBaseUI {
    /**
     * 根节点
     */
    protected _root: cc.Node;

    init(): void {
        super.init();
        this._root = UNodeHelper.find(this.node, "root");
        let back = UNodeHelper.find(this.node, "back");
        let bg = UNodeHelper.find(this.node, "root/bg");
        let close = UNodeHelper.find(this.node, "root/btn_close");

        UEventListener.get(back).onClick =null; //new UHandler(this.clickClose, this);
        UEventListener.get(bg).onClick = null;
        UEventListener.get(close).onClick = new UHandler(this.clickClose, this);
    }

    /**
     * 点击关闭按钮 
    */
    protected clickClose(): void {
        this.playclick();
        this.closeAnimation(UHandler.create(() => {
            AppGame.ins.closeUI(this.uiType);
        }, this));
    }
    /**关闭的动画 */
    protected closeAnimation(completHandler?: UHandler): void {
        // let ac = cc.scaleTo(0, 0.1, 0.1);
        // // ac.easing(cc.easeBackIn());
        // this._root.runAction(cc.sequence(ac, cc.callFunc(() => {
        //     if (completHandler) completHandler.run();
        // }, this)));

        if (completHandler) completHandler.run();

    }
    /**显示的动画 */
    protected showAnimation(completHandler?: UHandler): void {
        cc.tween(this._root)
            .to(0, { scale: 0.7 })
            .to(0.1, { scale: 1.05 }, { easing: 'sineIn' })
            .to(0.05, { scale: 1 }, { easing: 'sineOut' })
            .call(() =>{
                if (completHandler) completHandler.run();  
            })
            .start();
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
        super.show(data);
        this.showAnimation();
    }
}
