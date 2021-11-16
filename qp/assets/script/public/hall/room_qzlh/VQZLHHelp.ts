import VBaseUI from "../../../common/base/VBaseUI";
import UHandler from "../../../common/utility/UHandler";
import AppGame from "../../base/AppGame";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventListener from "../../../common/utility/UEventListener";
import UEventHandler from "../../../common/utility/UEventHandler";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
/**
 * 创建:sq
 * 作用:抢庄龙虎的帮助
 */
@ccclass
export default class VQZLHHelp extends VBaseUI {

    
    private close(): void {
        let ac = cc.scaleTo(0.1, 0.1, .1);
        ac.easing(cc.easeInOut(2.0));
        this.node.runAction(cc.sequence(ac, cc.callFunc(() => {
           AppGame.ins.closeUI(this.uiType);
        }, this)));
    }
    private showanima():void{
        this.node.setScale(0.1, 0.1);
        let ac = cc.scaleTo(0.1, 1, 1);
        ac.easing(cc.easeInOut(2.0));
        this.node.runAction(ac);
    }
     /**
     * 初始化 UI创建的时候调用
     */
    init(): void {
        let bg = UNodeHelper.find(this.node, "gf_back");
        UEventListener.get(bg).onClick = new UHandler(this.close, this);
        let close = UNodeHelper.find(this.node, "h_record_close");
        UEventHandler.addClick(close, this.node, "VQZLHHelp", "close");

        let lh_help_bg = UNodeHelper.find(this.node, "lh_help_bg");
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
        this.showanima();
    }
}
