import VBaseUI from "../../common/base/VBaseUI";
import AppGame from "../../public/base/AppGame";
import { ECommonUI } from "../../common/base/UAllenum";
import UNodeHelper from "../../common/utility/UNodeHelper";



// import UEventListener from "../../common/utility/UEventListener";
// import UHandler from "../../common/utility/UHandler";

const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:抢庄牛牛 牌型界面
 */
@ccclass
export default class VKPQZJHPXNode extends VBaseUI {

    private _qznn_paixingbg :cc.Node = null;
    // private _qznn_paixing :cc.Node = null;

    // start() {
        
    init(): void {
        //点击背景关闭
        this.node.on(cc.Node.EventType.MOUSE_UP, () => {
            AppGame.ins.closeUI(ECommonUI.QZNN_PX);
        });
        //点击px界面不关闭
        this._qznn_paixingbg = UNodeHelper.find(this.node,"qznn_paixingbg");
        this._qznn_paixingbg.on(cc.Node.EventType.MOUSE_UP, (event) => {
            event.stopPropagation();
        });

        ////////以下方法 not work
        // UEventListener.get(this.node).onClick = new UHandler(() => {
        //     AppGame.ins.closeUI(ECommonUI.QZNN_PX);
        // }, this);

        // this._qznn_paixing.on(cc.Node.EventType.MOUSE_UP, (event) => {
        //     event.stopPropagation();
        // });

        // UEventListener.get(this._qznn_paixingbg).onClick = new UHandler(() => {
        //     // this._qznn_paixingbg["_touchListener"].setSwallowTouches(true);
        //     event.stopPropagation();
        // }, this);

        // UEventListener.get(this._qznn_paixing).onClick = new UHandler((event: Event) => {
        //     // this._qznn_paixing["_touchListener"].setSwallowTouches(true);
        //     // event.stopPropagation();
        // }, this);
    }

    // show(data:any){
    //     super.show(data);
    // }

}
