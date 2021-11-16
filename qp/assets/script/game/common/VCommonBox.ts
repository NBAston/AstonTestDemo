import VBaseUI from "../../common/base/VBaseUI";
import AppGame from "../../public/base/AppGame";
import UHandler from "../../common/utility/UHandler";
import UNodeHelper from "../../common/utility/UNodeHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VCommonBox extends VBaseUI {

    @property(cc.Node)
    node_bg: cc.Node = null;

    @property(cc.Node)
    node_mask: cc.Node = null;

    @property(cc.Toggle)
    cur_toggle: cc.Toggle = null;

    onClose() {
        let ac = cc.scaleTo(0.2, 0.8, .8);
        ac.easing(cc.easeInOut(2.0));
        let ac2 = cc.fadeOut(0.2);

        let spa = cc.spawn(ac, ac2);

        this.node_mask.runAction(cc.fadeOut(0.1));
        this.node_bg.stopAllActions();
        this.node_bg.runAction(cc.sequence(spa, cc.callFunc(() => {
            AppGame.ins.closeUI(this.uiType);
        }, this)));

    }

    onEnable() {
        if (this.cur_toggle) {
            this.cur_toggle.isChecked = true;
        }
    }



    hide(handler?: UHandler) {
        this.node.active = false;
    }

    show(data: any): void {
        this.node.active = true;
        this.node_bg.opacity = 255;
        this.node_bg.scale = 0.01;
        let ac = cc.scaleTo(0.2, 1.1, 1.1);
        let ac2 = cc.scaleTo(0.1, 1, 1);
        let seq = cc.sequence(ac, ac2);
        ac.easing(cc.easeInOut(2.0));
        this.node_bg.runAction(seq);

        this.node_mask.opacity = 0.1;
        this.node_mask.runAction(cc.fadeTo(0.5, 120));
    }

    onClickToggle(data: cc.Toggle) {
        // UDebug.Log(data);

        let scroll_view = UNodeHelper.getComponent(data.checkMark.node, 'scroll_view', cc.ScrollView);
        if (scroll_view) {
            this.topScrollView(scroll_view);
        }
    }

    topScrollView(view: cc.ScrollView) {
        view.stopAutoScroll();
        view.scrollToTop();
    }
}
