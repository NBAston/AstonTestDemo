import VWindow from "../../../common/base/VWindow";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import UStringHelper from "../../../common/utility/UStringHelper";
import AppGame from "../../base/AppGame";
import ULanHelper from "../../../common/utility/ULanHelper";
import { ECommonUI } from "../../../common/base/UAllenum";
import { UserBindInfoData } from "../charge/ChargeData";
import UHandler from "../../../common/utility/UHandler";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VBlindUserName extends VWindow {
    @property(cc.SpriteFrame)
    normalImg:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    inputImg:cc.SpriteFrame = null;
    private _name_editbox: cc.EditBox; // 姓名
    private _add_bind_btn: cc.Node;// 添加绑定
    _bindType: number = 1; // 1 为绑定 2 为修改绑定
    _userBindInfo: UserBindInfoData;
    // private _back:cc.Node;

    init(): void {
        super.init();
        this._name_editbox = UNodeHelper.getComponent(this._root, "name_editbox", cc.EditBox);
        this._add_bind_btn = UNodeHelper.find(this._root, "add_bind_btn");
        this._name_editbox.node.on('editing-did-began', this.editDidBegan, this);
        this._name_editbox.node.on('editing-did-ended', this.editDidEnded, this);  
        UEventHandler.addClick(this._add_bind_btn, this.node, "VBlindUserName", "onclickAddBindBtn");
        // this._back = UNodeHelper.find(this.node,"back");
        // UEventHandler.addClick(this._back,this.node,"VBlindUserName","closeUI");
    }

    editDidBegan(): void {
        super.playclick();
        this._name_editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.inputImg;
    }

    editDidEnded(): void {
        this._name_editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.normalImg;
    }
    /**
   * 显示
   */
    show(data: any): void {
        super.show(data);
        this._bindType = data;
       
    }

    // 添加绑定
    onclickAddBindBtn(): void {
        super.playclick();
        if(this.checkBindParam()) {
            AppGame.ins.roleModel.requestBindUserName(this._name_editbox.string, this._bindType);
            // AppGame.ins.closeUI(ECommonUI.EXCHANGE_BIND_USERNAME)
        }
    }

    // 核对绑定的参数
    checkBindParam(): boolean {
        if(UStringHelper.isEmptyString(this._name_editbox.string)) {
            AppGame.ins.showTips("请输入姓名");
            this._name_editbox.focus();
            return false;
        } 

        if(!UStringHelper.isGbOrEn(this._name_editbox.string)) {
            AppGame.ins.showTips("姓名只能是中文或者英文");
            this._name_editbox.string = "";
            this._name_editbox.focus();
            return false;
        } 
        return true;
    }

//     closeUI(){
//         this.playclick();
//         super.clickClose();
//     }

    protected onEnable(): void {
       
        // AppGame.ins.roleModel.on(MRole.UPDATA_SCORE, this.update_score, this);
        // AppGame.ins.roleModel.on(MRole.ON_CHARGE, this.on_charge, this);
    }
    protected onDisable(): void {
        
        // AppGame.ins.roleModel.off(MRole.UPDATA_SCORE, this.update_score, this);
        // AppGame.ins.roleModel.off(MRole.ON_CHARGE, this.on_charge, this);
    }
    
    hide(handler?: UHandler): void {
        this.node.active = false;
        this._name_editbox.string = "";
    }
}
