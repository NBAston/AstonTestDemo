import UNodeHelper from "../../common/utility/UNodeHelper";
import { SysEvent } from "../../common/base/UAllClass";
import UStringHelper from "../../common/utility/UStringHelper";
import { ZJH_SCALE } from "../../game/zjh/MZJH";
import UAudioManager from "../../common/base/UAudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VAwarsShow extends cc.Component {
    private _p: cc.Node;
    private _label: cc.Label;
    private _init: boolean;
    private _isshow: boolean;
    private _showtime: number;
    private _nodebg: cc.Node;
    private init(): void {
        if (this._init) return;
        this._init = true;
        this._p = UNodeHelper.find(this.node, "gold_p");
        this._nodebg = UNodeHelper.find(this.node, "toast_bg");
        this._label = UNodeHelper.getComponent(this.node, "toast_bg/show", cc.Label);
    }
    protected start(): void {
        this.init();
    }

    protected onEnable(): void {
        cc.systemEvent.on(SysEvent.SHOW_AWARDS, this.show_awards, this);
    }
    protected onDisable(): void {
        cc.systemEvent.off(SysEvent.SHOW_AWARDS, this.show_awards, this);
        this._nodebg.active = false;
        this._isshow = false;
    }
    private show_awards(awards: number, info:string): void {
        UAudioManager.ins.playSound("audio_get_coin");
        this.init();
        this._isshow = true;
        var node = cc.instantiate(this._p);
        node.active = true;
        node.parent = this.node;
        this._nodebg.active = true;
        this._showtime = 2;
        // this._label.string = `恭喜您获得${UStringHelper.getMoneyFormat(awards * ZJH_SCALE)}金币`;
        this._label.string = info;
    }
    protected update(dt: number): void {
        if (this._isshow) {
            this._showtime -= dt;
            if (this._showtime < 0) {
                this._isshow = false;
                this._nodebg.active = false;
            }
        }
    }
}
