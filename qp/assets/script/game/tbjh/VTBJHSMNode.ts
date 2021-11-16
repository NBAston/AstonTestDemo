import VBaseUI from "../../common/base/VBaseUI";
import { ETBJHUIzIndex } from "./UTBJHHelper";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import AppGame from "../../public/base/AppGame";
import { ECommonUI } from "../../common/base/UAllenum";
import MTBJHModel from "./model/MTBJHModel";


const {ccclass, property} = cc._decorator;
/**
 * 创建:dz
 * 作用:抢庄牛牛开始时显示的说明
 */
@ccclass
export default class VTBJHSMNode extends VBaseUI {

    start () {
        this.setZIndex(ETBJHUIzIndex.Top); //显示在最上层
        let sm_bg = UNodeHelper.find(this.node,"qznn_sm_bg");
        let btn_close = UNodeHelper.find(this.node,"qznn_sm_bg/qznn_sm_btn");

        UEventHandler.addClick(btn_close, this.node, "VTBJHSMNode", "onBtnCloseClick");
        // sm_bg.on(cc.Node.EventType.MOUSE_UP,this.onBtnCloseClick, this);//没用框架时用的

        sm_bg.on(cc.Node.EventType.MOUSE_UP,(event)=>
        {
            event.stopPropagation();
            // this.node["_touchListener"].setSwallowTouches(true);
        });
    }

    onBtnCloseClick(event){
        // this.node.active = false;
        AppGame.ins.closeUI(ECommonUI.TBNN_SM);
    }

    /**重写是因为省得再赋父节点 */
    show(data:any){
        this.node.setParent(data);

        MTBJHModel.ins.sIsOpenSM = true;
    }
    setParent(parent: cc.Node): void {
        this.node.parent = parent;
    }
}
