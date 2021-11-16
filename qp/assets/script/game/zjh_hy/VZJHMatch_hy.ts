import UNodeHelper from "../../common/utility/UNodeHelper";
import ULanHelper from "../../common/utility/ULanHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import AppGame from "../../public/base/AppGame";
import UEventListener from "../../common/utility/UEventListener";

/**
 * 创建:sq
 * 作用:匹配界面
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class VZJHMatch_hy extends cc.Component {
    private _content: cc.Label;
    private _idx: number;
    private _time: number;
    init(): void {
        this._content = UNodeHelper.getComponent(this.node, "content", cc.Label);
        // this._time = 0;
        this._idx = 0;
        let btnClos = UNodeHelper.find(this.node, "btn_close");
        UEventHandler.addClick(btnClos, this.node, "VZJHMatch", "closeMatch");
        let bg = UNodeHelper.find(this.node, "bg");
        UEventListener.get(bg).onClick = null;
    }
    private closeMatch(): void {
        this.hide();
        // AppGame.ins.zjhModel.cancleMatch();
    }
    // protected update(dt: number): void {
    //     this._time += dt;
    //     if (this._time > 1) {
    //         this._time = 0;
    //         this.updateContent();
    //     }
    // }
    private updateContent(): void {
        this._idx++;
        if (this._idx >= ULanHelper.QZNN_MATCH_TIP.length) {
            this._idx = 0;
        }
        this._content.string = ULanHelper.QZNN_MATCH_TIP[this._idx];
    }
    show(): void {
        this.node.active = true;
        this._idx = 0;
        this._time = 0;
        this._content.string = ULanHelper.QZNN_MATCH_TIP[this._idx];
    }
    hide(): void {
        this.node.active = false;
    }
}
