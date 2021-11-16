import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventListener from "../../common/utility/UEventListener";
import UHandler from "../../common/utility/UHandler";
import AppGame from "./AppGame";
import { triggerAsyncId } from "async_hooks";
import UAudioManager from "../../common/base/UAudioManager";


const {ccclass, property} = cc._decorator;

@ccclass
export default class VPopuWindow extends cc.Component {

     /**
     * 根节点
     */
    protected _root: cc.Node;

    init(): void {
        this._root = UNodeHelper.find(this.node, "root");
        let back = UNodeHelper.find(this.node, "back");
        let bg = UNodeHelper.find(this.node, "root/bg");
        let close = UNodeHelper.find(this.node, "root/btn_close");

        UEventListener.get(back).onClick = null;//new UHandler(this.clickClose, this);
        UEventListener.get(bg).onClick = null;
        UEventListener.get(close).onClick = new UHandler(this.clickClose, this);
    }
    /**
     * 点击关闭按钮 
    */
    protected clickClose(): void {
        this.playclick();
        this.closeAnimation(UHandler.create(() => {
           this.hide();
        }, this));
    }
    /**关闭的动画 */
    protected closeAnimation(completHandler?: UHandler): void {
        let ac = cc.scaleTo(0.1, 0.1, .1);
        ac.easing(cc.easeBackIn());
        this._root.runAction(cc.sequence(ac, cc.callFunc(() => {
            if (completHandler) completHandler.run();
        }, this)));

    }
    /**显示的动画 */
    protected showAnimation(completHandler?: UHandler): void {
        this._root.setScale(0.1, 0.1);
        let ac = cc.scaleTo(0.1, 1, 1);
        ac.easing(cc.easeBackInOut());
        this._root.runAction(cc.sequence(ac, cc.callFunc(() => {
            if (completHandler) completHandler.run();
        }, this)));
    }
    protected playclick(): void {
        UAudioManager.ins.playSound("audio_click");
    }
    /**
    * 显示
    */
    show(data: any): void {
        this.node.active=true;
        this.showAnimation();
    }
  
    /**
   *  隐藏
   */
    hide(handler?: UHandler): void {
        this.node.active = false;
    }
}
