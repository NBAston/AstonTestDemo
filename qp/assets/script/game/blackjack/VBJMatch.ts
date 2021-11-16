import UNodeHelper from "../../common/utility/UNodeHelper";
import ULanHelper from "../../common/utility/ULanHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import AppGame from "../../public/base/AppGame";
import UEventListener from "../../common/utility/UEventListener";

/**
 * 创建:gss
 * 作用:匹配界面
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class VMatch extends cc.Component {
    private _content: cc.Label;
    private _idx: number;
    private _time: number;
    private _erro: boolean
    init(): void {
        this._content = UNodeHelper.getComponent(this.node, "content", cc.Label);
        this._time = 0;
        this._idx = 0;
        this._erro = false;
        let btnClos = UNodeHelper.find(this.node, "btn_close");
        UEventHandler.addClick(btnClos, this.node, "VBJMatch", "closeMatch");
        let bg = UNodeHelper.find(this.node, "bg");
        UEventListener.get(bg).onClick = null;
    }
    private closeMatch(): void {
        this.hide();
        AppGame.ins.bjModel.cancleMatch();
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
        //this._content.string = ULanHelper.QZNN_MATCH_TIP[this._idx];
    }
    mathFail(): void {
        this._erro = true;
        //this._content.string = ULanHelper.ROOM_INFO_ERRO;
    }
    show(): void {
        this.node.active = true;
        this._idx = 0;
        this._time = 0;
        //this._content.string = ULanHelper.QZNN_MATCH_TIP[this._idx];
        this._erro = false;
    }
    hide(): void {
        this.node.active = false;
    }
}
