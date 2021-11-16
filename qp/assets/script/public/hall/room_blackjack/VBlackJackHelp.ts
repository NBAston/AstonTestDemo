import VBaseUI from "../../../common/base/VBaseUI";
import UHandler from "../../../common/utility/UHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventListener from "../../../common/utility/UEventListener";
import UEventHandler from "../../../common/utility/UEventHandler";
import VWindow from "../../../common/base/VWindow";
import AppGame from "../../base/AppGame";
import { ECommonUI, EGameType } from "../../../common/base/UAllenum";
import UAudioManager from "../../../common/base/UAudioManager";

const { ccclass, property } = cc._decorator;
/**
 * 创建:gss
 * 作用:21点的房间UI
 */
@ccclass
export default class VUHelp_BJ extends VWindow {

    private _init: boolean;
    private _firstBtn: cc.Toggle;
    init(): void {
        if (this._init) return;
        super.init();
        this._init = true;
        let contain = UNodeHelper.find(this.node, "root/btnroot");
        UEventHandler.addToggleContainer(contain, this.node, "VUHelp_BJ", "onclick");
    }
    private onclick(): void {
        this.playclick();
    }
    start() {
        this.init();
        this.show(null);
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
        super.show(data);
    }



}
