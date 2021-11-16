import USpriteFrames from "../../common/base/USpriteFrames";
import UNodeHelper from "../../common/utility/UNodeHelper";
import AppGame from "./AppGame";

const { ccclass, property } = cc._decorator;

/**
 * 创建:sq
 * 功能:显示网络延迟
 */
@ccclass
export default class VPing extends cc.Component {
    /**
     * 资源
     */
    private _res: USpriteFrames;
    /**
     * 延迟图片
     */
    private _lv: cc.Sprite;
    /**
     * 延迟文字
     */
    private _delay: cc.Label;

    private _refreshtime: number;

    start() {
        this._res = this.node.getComponent(USpriteFrames);
        this._lv = UNodeHelper.getComponent(this.node, "lv", cc.Sprite);
        this._delay = UNodeHelper.getComponent(this.node, "yanchi", cc.Label);
        this._refreshtime = 0;
    }
    protected update(dt: number): void {
        this._refreshtime -= dt;
        if (this._refreshtime) {
            let ping = AppGame.ins.LoginModel.ping;
            if (ping > 300) {
                this._lv.spriteFrame = this._res.getFrameIdx(4);
                if (this._delay)
                this._delay.node.color = cc.Color.GRAY;
                
            } else if (ping > 200) {
                this._lv.spriteFrame = this._res.getFrameIdx(3);
                if (this._delay)
                this._delay.node.color = cc.Color.RED;
            } else if (ping > 100) {
                this._lv.spriteFrame = this._res.getFrameIdx(2);
                if (this._delay)
                this._delay.node.color = cc.Color.ORANGE;

            } else if (ping > 50) {
                this._lv.spriteFrame = this._res.getFrameIdx(1);
                if (this._delay)
                this._delay.node.color = cc.Color.YELLOW;
            } else {
                this._lv.spriteFrame = this._res.getFrameIdx(0);
                if (this._delay)
                this._delay.node.color = cc.Color.GREEN;

            }
            this._refreshtime = 5;
            if (this._delay)
            this._delay.string = "延迟 " + ping;
        }
    }
    onEnable() {
        this._refreshtime = 0;
    }
}
