import VWindow from "../../../common/base/VWindow";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import UStringHelper from "../../../common/utility/UStringHelper";
import AppGame from "../../base/AppGame";
import ULanHelper from "../../../common/utility/ULanHelper";
import { ECommonUI } from "../../../common/base/UAllenum";
import { UserBindInfoData } from "../charge/ChargeData";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VBlindAlipayAccount extends VWindow {
    @property(cc.SpriteFrame)
    normalImg:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    inputImg:cc.SpriteFrame = null;
    private _name_editbox: cc.EditBox; // 姓名
    private _account_editbox: cc.EditBox; // 账号
    private _confirm_account_editbox: cc.EditBox;// 确认账号
    // private _bank_name_editbox: cc.EditBox;// 开户行名称
    private _add_bind_btn: cc.Node;// 添加绑定
    _bindType: number = 1; // 1 为绑定 2 为修改绑定
    _userBindInfo: UserBindInfoData;
    // private _back:cc.Node;

    init(): void {
        super.init();
        this._name_editbox = UNodeHelper.getComponent(this._root, "name_editbox", cc.EditBox);
        this._account_editbox = UNodeHelper.getComponent(this._root, "account_editbox", cc.EditBox);
        this._confirm_account_editbox = UNodeHelper.getComponent(this._root, "confirm_account_editbox", cc.EditBox);
        // this._bank_name_editbox = UNodeHelper.getComponent(this._root, "bank_name_editbox", cc.EditBox);
        this._add_bind_btn = UNodeHelper.find(this._root, "add_bind_btn");
        UEventHandler.addClick(this._add_bind_btn, this.node, "VBlindAlipayAccount", "onclickAddBindBtn");
        this._name_editbox.node.on('editing-did-began', this.editDidBegan, this);
        this._name_editbox.node.on('editing-did-ended', this.editDidEnded, this);  
        this._account_editbox.node.on('editing-did-began', this.editDidBegan2, this);
        this._account_editbox.node.on('editing-did-ended', this.editDidEnded2, this);  
        this._confirm_account_editbox.node.on('editing-did-began', this.editDidBegan3, this);
        this._confirm_account_editbox.node.on('editing-did-ended', this.editDidEnded3, this);  
        // this._back = UNodeHelper.find(this.node,"back");
        // UEventHandler.addClick(this._back,this.node,"VBlindAlipayAccount","closeUI");
    }

    editDidBegan(): void {
        super.playclick();
        this._name_editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.inputImg;
    }

    editDidEnded(): void {
        this._name_editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.normalImg;
    }
    editDidBegan2(): void {
        super.playclick();
        this._account_editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.inputImg;
    }

    editDidEnded2(): void {
        this._account_editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.normalImg;
    }
    editDidBegan3(): void {
        super.playclick();
        this._confirm_account_editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.inputImg;
    }

    editDidEnded3(): void {
        this._confirm_account_editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.normalImg;
    }

    /**
   * 显示
   */
    show(data: any): void {
        super.show(data);
        this._bindType = data;
        this.setBindBankAccountUI();
    }

    setBindBankAccountUI() {
        this._userBindInfo = AppGame.ins.roleModel.getBindInfoData();
        if(!UStringHelper.isEmptyString(this._userBindInfo.trueName)) {
            this._name_editbox.string = this._userBindInfo.trueName;
            this._name_editbox.enabled = false;
        } else {
            this._name_editbox.string = "";
        }

        this._account_editbox.string = "";
        this._confirm_account_editbox.string = "";
    }

    // 添加绑定
    onclickAddBindBtn(): void {
        super.playclick();
        if(this.checkBindParam()) {
            AppGame.ins.roleModel.requestAlpayCard(this._account_editbox.string, this._name_editbox.string, this._bindType);
        }
    }

    // 核对绑定的参数
    checkBindParam(): boolean {
        if( UStringHelper.isEmptyString(this._name_editbox.string)) {
            AppGame.ins.showTips("请输入姓名");
            this._name_editbox.focus();
            return false;
        }

        if(!UStringHelper.isGbOrEn(this._name_editbox.string)) {
            AppGame.ins.showTips("姓名只能是中文或者英文");
            // this._name_editbox.string = "";
            this._name_editbox.focus();
            return false;
        } 

        if( UStringHelper.isEmptyString(this._account_editbox.string)) {
            AppGame.ins.showTips("请输入支付宝账号");
            this._account_editbox.focus();
            return false;
        }

        if(!UStringHelper.checkAlipay(this._account_editbox.string)) {
            AppGame.ins.showTips("请输入正确的支付宝账号");
            this._account_editbox.focus();
            return false;
        }

        if( UStringHelper.isEmptyString(this._confirm_account_editbox.string)) {
            AppGame.ins.showTips("请输入确认支付宝账号");
            this._confirm_account_editbox.focus();
            return false;
        }

        if(this._account_editbox.string != this._confirm_account_editbox.string) {
            AppGame.ins.showTips("两次输入的支付宝账号不一致");
            this._confirm_account_editbox.focus();
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
}
