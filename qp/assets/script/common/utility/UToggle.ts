import UEventListener from "./UEventListener";
import UHandler from "./UHandler";

// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
/**
 * 创建:sq
 * UToggle
 */
@ccclass
export default class UToggle extends cc.Component {
    clickHandler: UHandler;
    @property(cc.SpriteFrame)
    onNormal: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    onPress: cc.SpriteFrame = null;
    @property(cc.Boolean)
    private _isOn: boolean = true;
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
        let on = !this._isOn;
        this.IsOn = on;
        if (this.clickHandler) this.clickHandler.runWith(this._isOn);
    }
    onDestroy() {
        if (this.clickHandler) {
            this.clickHandler.clear();
            this.clickHandler = null;
        }
    }
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        this._sprite = this.node.getComponent(cc.Sprite);
        UEventListener.get(this.node).onClick = new UHandler(this.onclick, this);
    }
    start() {
        this.IsOn = this._isOn;
    }
    // update (dt) {}
}
