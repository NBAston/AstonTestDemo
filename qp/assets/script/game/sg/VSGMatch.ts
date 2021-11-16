import UNodeHelper from "../../common/utility/UNodeHelper";
import ULanHelper from "../../common/utility/ULanHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import AppGame from "../../public/base/AppGame";
import UEventListener from "../../common/utility/UEventListener";
import VSG from "./VSG";

/**
 * 创建:dz
 * 作用:sg匹配界面
 */
const { ccclass, property } = cc._decorator;
@ccclass
export default class VSGMatch extends cc.Component {
    private _idx: number;
    // private _time: number;

    private _vsg: VSG;
    init(sg: VSG): void {
        this._vsg = sg;
        this._idx = 0;
        let btnClos = UNodeHelper.find(this.node, "btn_close");
        UEventHandler.addClick(btnClos, this.node, "VSGMatch", "closeMatch");
        let bg = UNodeHelper.find(this.node, "bg");
        UEventListener.get(bg).onClick = null;
    }
    private closeMatch(): void {
        this.hide();
        this._vsg.playClick();
        // AppGame.ins.sgModel.cancleMatch();
        AppGame.ins.sgModel.exitGame();
    }


    show(): void {
        // AppGame.ins.sgModel.setStateMatch();
        AppGame.ins.sgModel.updateSeatInfo();
        this.node.active = true;
        this._idx = 0;
    }
    hide(): void {
        this.node.active = false;
    }

    onDestroy() {
        this._vsg = null;
    }
}
