import UHandler from "../../../common/utility/UHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import VWindow from "../../../common/base/VWindow";
import V_Transfer_Left_Select, { ETransferBtnType } from "./v_transfer_left_select";

const { ccclass, property } = cc._decorator;
/**
 *作用:房卡转帐主界面
 */
@ccclass
export default class V_Transfer_Main extends VWindow {

    private _selectBtns: { [key: number]: V_Transfer_Left_Select };

    init(): void {
        super.init();
        this._selectBtns = {};
        let transfer = UNodeHelper.getComponent(this._root, "left_bar/btn_center", V_Transfer_Left_Select);
        transfer.init();
        this._selectBtns[transfer.type] = transfer;

        let record = UNodeHelper.getComponent(this._root, "left_bar/btn_record", V_Transfer_Left_Select)
        record.init()
        this._selectBtns[record.type] = record;

        for (const key in this._selectBtns) {
            if (this._selectBtns.hasOwnProperty(key)) { 
                const element = this._selectBtns[key];
                element.clickHandler = new UHandler(this.onCheckClick, this, element.type);
            }
        }
    }

    private onCheckClick(type: ETransferBtnType): void {
        super.playclick();
        for (const key in this._selectBtns) {
            if (this._selectBtns.hasOwnProperty(key)) {
                const element = this._selectBtns[key];
                if (element.type != type) {
                    element.IsOn = false;
                }
                if(element.IsOn){
                    var color = new cc.Color(255, 255, 255);
                    UNodeHelper.find(element.node,"title").color = color;
                }else{
                    color = new cc.Color(164, 116, 51);
                    UNodeHelper.find(element.node,"title").color = color;
                }
            }
        }
    }

    hide(hander?: UHandler): void {
        super.hide(hander);
        for (const key in this._selectBtns) {
            if (this._selectBtns.hasOwnProperty(key)) {
                let element = this._selectBtns[key];
                element.hide();
            }
        }
    }
 
    show(data: any): void {
        super.show(data);
        data = data || { type: ETransferBtnType.transfer, data: "" }
        this._selectBtns[data.type].IsOn = true;
        this._selectBtns[data.type].bindData(data.data);
        this.onCheckClick(data.type);
    }
}
