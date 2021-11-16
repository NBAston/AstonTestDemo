import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventListener from "../../../common/utility/UEventListener";

/**
 * 匹配界面
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class SHMatchUI extends cc.Component {
    @property(cc.Node)
    toggle_xjlc: cc.Node = null;
    init(): void {
        let bg = UNodeHelper.find(this.node, "bg");
        UEventListener.get(bg).onClick = null;
    }

    show(): void {
        this.node.active = true;
        this.toggle_xjlc.active=false;
    }
    
    hide(): void {
        this.toggle_xjlc.active=true;
        this.node.active = false;
    }
}
