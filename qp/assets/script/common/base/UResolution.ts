import { FiniteStateMachine } from "./UStateMachine";


const { ccclass, property } = cc._decorator;

@ccclass
export default class UResolution extends cc.Component {

    private _radio: boolean;
    private _temp: string;
    private _change: boolean;
    private _delayTime: number;
    start() {
        this.sizeCallback();
        cc.view.setResizeCallback(() => {
            this.sizeCallback();
            cc.game.emit('resize');
            cc.game.emit('resize_bg');
        });
        if (cc.sys.isBrowser && !this.isMobile()) {
            this._resizeCallback();
            window.addEventListener("resize", this._resizeCallback);
        }
        cc.debug.setDisplayStats(false);// 帧率false 后 left 报错会顺带消失
        this._change = false;
        this._delayTime = 0.2;

    }
    private _resizeCallback(): void {
        //H5的调试模式下，使用原始设计，方便调试
        if (CC_DEBUG){
            cc.view.setFrameSize(1280, 720)
        }
        else{
            cc.view.setFrameSize(document.body.clientWidth, document.body.clientHeight)
        }
        cc.game.emit("resize_bg");
    }
    private sizeCallback(): void {
        if (this.isMobile()) {
            this._delayTime = 0.5;
            this._change = true;
        } else {
            this.refresh();
        }
    }
    private refresh(): void {
        let size = cc.view.getFrameSize();
        if (size.width > 0 && size.height > 0) {
            if (this.isMobile()) {
                if (size.width > size.height) {
                    let rd = 1.6;//**这个值可以根据机型灵活调 */
                    this._radio = size.width / size.height > rd;
                    let policy = this._radio ? cc.ResolutionPolicy.FIXED_HEIGHT : cc.ResolutionPolicy.FIXED_WIDTH;
                    cc.view.setResolutionPolicy(policy);
                    cc.game.emit("resize_window", policy);
                }
            } else {
                let rd = 1280 / 720;//**这个值可以根据机型灵活调 */
                this._radio = size.width / size.height > rd;
                let policy = this._radio ? cc.ResolutionPolicy.FIXED_HEIGHT : cc.ResolutionPolicy.FIXED_WIDTH;
                cc.view.setResolutionPolicy(policy);
                cc.game.emit("resize_window", policy);
            }

        }
    }
    private isMobile() {
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array("Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod");
        var flag = false;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) {
                flag = true;
                break;
            }
        }
        return flag;
    }
    protected update(dt: number): void {
        if (this._change) {
            this._delayTime -= dt;
            if (this._delayTime < 0) {
                this._change = false;
                this._delayTime = 0;
                this.refresh();
            }
        }
    }
}
