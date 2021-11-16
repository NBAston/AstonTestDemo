import Vlb_left_select from "./Vlb_left_select";

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends Vlb_left_select {

    @property(cc.ScrollView)
    scrollView: cc.ScrollView = null;

    protected isOnafter(): void {
        super.isOnafter();
        this.node.active = true;
        if (this.IsOn) {
            this.scrollView.stopAutoScroll();
            this.scrollView.scrollToTop();
        }
    }
}
