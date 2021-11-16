import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import AppGame from "../../base/AppGame";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VGMItem extends cc.Component {

    private _qq: cc.Label;

    private openqq(): void {
        var result = UAPIHelper.openQQ(this._qq.string);
        if (result != "0") {
            AppGame.ins.showTips("请安装QQ");
        }
    }
    init(): void {
        this._qq = UNodeHelper.getComponent(this.node, "tame_bg/qq", cc.Label);
        var btn = UNodeHelper.find(this.node, "charge_records_lxkf");
        UEventHandler.addClick(btn, this.node, "VGMItem", "openqq");
    }
    bind(qq: string): void {
        this.node.active = true;
        this._qq.string = qq;
    }
    hide(): void {
        this.node.active = false;
    }

}
