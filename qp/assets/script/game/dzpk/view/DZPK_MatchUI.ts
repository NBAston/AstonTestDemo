import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventListener from "../../../common/utility/UEventListener";

/**
 * 匹配界面
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class DZPK_MatchUI extends cc.Component {
    init(): void {
        let bg = UNodeHelper.find(this.node, "bg");
        UEventListener.get(bg).onClick = null;
    }

    show(): void {
        this.node.active = true;
    }

    hide(): void {
        this.node.active = false;
    }
}
