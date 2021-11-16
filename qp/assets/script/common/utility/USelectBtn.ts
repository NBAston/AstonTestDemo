import UHandler from "./UHandler";
import UEventListener from "./UEventListener";

const { ccclass, property } = cc._decorator;

/**
 * 创建:旋转按钮
 */
@ccclass
export default class USelectBtn extends cc.Component {
    clickHandler: UHandler;
    @property(cc.SpriteFrame)
    onNormal: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    onPress: cc.SpriteFrame = null;

    private _isOn: boolean = false;
    get IsOn(): boolean {
        return this._isOn;
    }
    set IsOn(value: boolean) {
        this._isOn = value;
        if (!this._sprite) {
            this._sprite = this.node.getComponent(cc.Sprite);
        }
        this._sprite.spriteFrame = value ? this.onPress : this.onNormal;
    }
    private _sprite: cc.Sprite;

    private onclick(): void {
        if (this._isOn) return;
        this.IsOn = true;
        if (this.clickHandler) this.clickHandler.runWith(this._isOn);
    }
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this._sprite = this.node.getComponent(cc.Sprite);
        UEventListener.get(this.node).onClick = new UHandler(this.onclick, this);
    }
    start() {
        this.IsOn = this._isOn;
    }
}
