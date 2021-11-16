import UHandler from "./UHandler";
import UEventListener from "./UEventListener";
import VBaseUI from "../base/VBaseUI";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UImgBtn extends VBaseUI {
    clickHandler: UHandler;
    @property(cc.Node)
    onNormal: cc.Node = null;
    @property(cc.Node)
    onPress: cc.Node = null;

    protected _isOn: boolean = false;
    get IsOn(): boolean {
        return this._isOn;
    }
    set IsOn(value: boolean) {
        this._isOn = value;
        this.onPress.active = value;
        this.onNormal.active = !value;
        this.isOnafter();
    }
    private onclick(): void {
        if(this.IsOn) return;
        this.IsOn = !this.IsOn;
        if (this.clickHandler) this.clickHandler.runWith(this._isOn);
    }
    protected isOnafter():void{

    }
    // LIFE-CYCLE CALLBACKS:
    onLoad() {
        UEventListener.get(this.node).onClick = new UHandler(this.onclick, this);
    }
    start() {
       // this.IsOn = this._isOn;
    }
}
