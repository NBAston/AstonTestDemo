import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import UEventListener from "../../common/utility/UEventListener";
import MSSS from "./MSSS";
import ULanHelper from "../../common/utility/ULanHelper";
import AppGame from "../../public/base/AppGame";


/**
 * 创建:gss
 * 作用:匹配界面
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class VMatch extends cc.Component {
    private _idx: number;
    private _time: number;
    private _erro: boolean
    init(): void {
        this._time = 0;
        this._idx = 0;
        this._erro = false;
        let bg = UNodeHelper.find(this.node, "bg");
        UEventListener.get(bg).onClick = null;
    }

    protected update(dt: number): void {
        if (!this._erro) {
            this._time += dt;
            if (this._time > 1) {
                this._time = 0;
                this.updateContent();
            }
        }
    }
    private updateContent(): void {
        this._idx++;
        if (this._idx >= ULanHelper.QZNN_MATCH_TIP.length) {
            this._idx = 0;
        }
    }
    mathFail(): void {
        this._erro = true;
    }
    show(): void {
        AppGame.ins.sssModel.updateSeatInfo();
        this.node.active = true;
        this._idx = 0;
        this._time = 0;
        this._erro = false;
    }
    hide(): void {
        this.node.active = false;
    }
}
