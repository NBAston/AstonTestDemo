import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import { UIZJHChips } from "./UZJHClass_hy";
import VZJH from "./VZJH_hy";
import AppGame from "../../public/base/AppGame";
import { ZJH_SCALE } from "./MZJH_hy";
import UEventListener from "../../common/utility/UEventListener";
import UHandler from "../../common/utility/UHandler";
import VZJHOperate from "./VZJHOperate_hy";


const { ccclass, property } = cc._decorator;
/**
 * 创建:sq
 * 加注面板
 */
@ccclass
export default class VZJHAddChips_hy extends cc.Component {
    closeHandler: UHandler;
    /**
     * chip的btn节点
     */
    private _chips: Array<cc.Button>;
    /**
     * chip的数值
     */
    private _chipsNum: Array<cc.Label>;
    /**
     * 
     */
    private _data: Array<UIZJHChips>;
    
    @property(cc.Toggle)
    cuopai_toggle:cc.Toggle = null;

    private _op: any;
    init(op): void {
        this._op = op;
        this._chips = [];
        this._chipsNum = [];
        let chip_node = UNodeHelper.find(this.node, "chip_node");
        let chip_label = UNodeHelper.find(this.node, "chip_label");
        let len1 = chip_node.childrenCount;
        for (let i = 0; i < len1; i++) {
            let cnd = chip_node.children[i];
            UEventHandler.addClick(cnd, this.node, "VZJHAddChips_hy", "onselectchip", i)
            this._chips.push(cnd.getComponent(cc.Button));
            let clb = chip_label.children[i];
            this._chipsNum.push(clb.getComponent(cc.Label));
        }
        let bg = UNodeHelper.find(this.node, "bg");
        UEventListener.get(bg).onClick = new UHandler(this.clickhandler, this);
        let bg2 = UNodeHelper.find(this.node, "zjh_chip_bg");
        UEventListener.get(bg2).onClick = null;
    }
    private clickhandler(): void {
        this.setactive(false);
        this.cuopai_toggle.node.active = true;
        if (this.closeHandler) this.closeHandler.run();
    }
    private onselectchip(evt: any, idx: number): void {
        if (!this._data && this._data.length <= idx) {
            return;
        }
        let dt = this._data[idx];
        if (dt.canUse) {
            AppGame.ins.fzjhModel.requestJiaZhu(idx);
        }
        this._op.clickmusic();
        this.node.active = false;
    }
    /**
     * 绑定数据
     * @param data 
     */
    bind(data: Array<UIZJHChips>): void {
        this._data = data;
        let len = data.length;
        let len2 = this._chips.length;
        for (let i = 0; i < len; i++) {
            const element = data[i];
            if (i < len2) {
                this._chips[i].interactable = element.canUse;
                this._chipsNum[i].string = (element.count * ZJH_SCALE).toString();
                // if(!element.canUse){
                //     this._chipsNum[i].node.color = cc.color(175,175,175,255);
                // }else{
                //     if(i == 0){
                //         this._chipsNum[i].node.color = cc.color(185,134,61,255);
                //     }else if(i == 1){
                //         this._chipsNum[i].node.color = cc.color(59,149,175,255);
                //     }else if(i == 2){
                //         this._chipsNum[i].node.color = cc.color(111,98,216,255);
                //     }else if(i == 3){
                //         this._chipsNum[i].node.color = cc.color(191,107,60,255);
                //     }
                // }
            }
        }
    }
    /**
     * 设置
     * @param value 
     */
    setactive(value: boolean): void {
        this.node.active = value;
    }
    onDestroy() {
        if (this.closeHandler) {
            this.closeHandler.clear();
            this.closeHandler = null;
        }
    }
}
