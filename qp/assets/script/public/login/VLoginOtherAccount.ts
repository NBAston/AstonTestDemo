import VWindow from "../../common/base/VWindow";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import AppGame from "../base/AppGame";
import VPopuWindow from "../base/VPopuWindow";
import ULanHelper from "../../common/utility/ULanHelper";
import UStringHelper from "../../common/utility/UStringHelper";
import { MD5 } from "../../common/utility/UMD5";
import MLogin from "./MLogin";
import { ECommonUI, ELoginType } from "../../common/base/UAllenum";
import { AccountInfo } from "../../common/utility/ULocalStorage";
import UDebug from "../../common/utility/UDebug";
import VResetPsw from "./VResetPsw";

const { ccclass, property } = cc._decorator;
/**
 * 登陆其他账号
 */
@ccclass
export default class VLoginOtherAccount extends VPopuWindow {

    @property(cc.SpriteFrame)
    editbox_img_normal: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    editbox_img_input: cc.SpriteFrame = null;

    private _account: cc.EditBox;
    private _psw: cc.EditBox;
    private _isUserPwd: boolean = false;
    private _localPwd: string = "";
    /**
     * 初始化
     */
    init(): void {
        super.init();
        this._account = UNodeHelper.getComponent(this._root, "account", cc.EditBox);
        this._psw = UNodeHelper.getComponent(this._root, "password", cc.EditBox);
        var login = UNodeHelper.find(this._root, "btn_login");
        var register = UNodeHelper.find(this._root, "btn_resister");
        let resetPwd = UNodeHelper.find(this._root, "resetPwd");
        let mobileReg = UNodeHelper.find(this._root, "mobileReg");
        UEventHandler.addClick(login, this.node, "VLoginOtherAccount", "onClickLogin");
        UEventHandler.addClick(register, this.node, "VLoginOtherAccount", "onClickRegister");
        UEventHandler.addClick(resetPwd, this.node, "VLoginOtherAccount", "resetPwd")
        UEventHandler.addClick(mobileReg, this.node, "VLoginOtherAccount", "onClickRegister")
        this.hide();
        this._account.node.on("editing-did-began", this.startInput, this);
        this._account.node.on("editing-did-ended", this.isPhoneNumber, this);
        this._psw.node.on("editing-did-began", this.inputBegin, this);
        this._psw.node.on("editing-did-ended", this.inputEnd, this)
        this._psw.node.on("text-changed", this.pwTextChanged, this)
        this._isUserPwd = false;
        let acc = null;
        var account = AppGame.ins.LoginModel.getAccount((a: AccountInfo) => {
            UDebug.log("账号。。。。" + a);
            acc = a;
        });
        if (!acc) {

        } else if (acc.mobilenum && acc.mobilenum != "") {
            login.x = 0;
            register.active = false;
        }
        UDebug.log("账号。。。。" + acc);
    }

    onEnable() {
        AppGame.ins.LoginModel.on(MLogin.CONNECT_SUCESS, this.connectsucess, this);
    }

    onDisable(): void {
        AppGame.ins.LoginModel.off(MLogin.CONNECT_SUCESS, this.connectsucess, this);
    }

    connectsucess() {
        if (AppGame.ins.LoginModel._loginType == ELoginType.accountLogin) { 
            if (this._localPwd == this._psw.node["_psw"]) {
                AppGame.ins.LoginModel.accountlogin(this._account.string,  this._psw.node["_psw"].length==32?this._psw.node["_psw"]:MD5(this._psw.node["_psw"]), this._psw.string); 
            } else {
                AppGame.ins.LoginModel.accountlogin(this._account.string, MD5(this._psw.node["_psw"]),  this._psw.string);
            }
            // AppGame.ins.LoginModel.accountlogin(this._account.string, this._psw.string);
        }
    }


    private onClickLogin(): void {
        super.playclick();
        AppGame.ins.isJudge = false;
        if (UStringHelper.isEmptyString(this._account.string)) {
            AppGame.ins.showTips(ULanHelper.PHONE_EMPTY);
            return;
        }
        if (UStringHelper.isEmptyString(this._psw.string)) {
            AppGame.ins.showTips(ULanHelper.PSW_EMPTY);
            return;
        }
        //请示建立链接
        AppGame.ins.LoginModel._loginType = ELoginType.accountLogin
        AppGame.ins.LoginModel.requestLoginData(); 
    }

    private onClickRegister(): void {
        AppGame.ins.showUI(ECommonUI.LB_Regester, {isRegister: true});
        AppGame.ins.LoginModel._loginType = ELoginType.regesterAccount; 
        AppGame.ins.LoginModel.requestLoginData();
    }

    private inputBegin(): void {
        super.playclick();
        this._psw.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_input;
    }

    private pwTextChanged() {
        cc.log("asssss", this._psw.string);
        this._psw.node["_psw"] = this._psw.string;
    };

    private inputEnd(): void {
        this._psw.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_normal;
        // this._psw.string = MD5(this._psw.string);

    }

    private startInput(): void {
        super.playclick();
        this._account.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_input;
    }

    private isPhoneNumber(data: any): void {
        this._account.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_normal;
        var a = /^([1][3,4,5,6,7,8,9])\d{9}$/;
        // var b = /^[A-Za-z0-9]+$/;
        if (a.test(this._account.string)) {

        } else if (this._account.string == "") {

        } else {
            AppGame.ins.showTips(ULanHelper.INPUT_PHONE_NUMBER);
            this._account.string = "";
        }
    }
    /**
     * 显示
     * @param data 
     */
    show(data: any): void {
        super.show(data);
        let acc: AccountInfo = null;
        var account = AppGame.ins.LoginModel.getAccount((a: AccountInfo) => {
            UDebug.log("账号。。。。" + JSON.stringify(a));
            acc = a;
        }, 1);  
        if (acc && acc.mobilenum != "") {
            this._account.string = acc.mobilenum;
            this._localPwd = acc.psw;
            this._psw.string = acc.truePsw==""?"00000000":acc.truePsw;
            this._psw.node["_psw"] = acc.psw;
        } else {
            this._account.string = "";
            this._psw.string = "";
        }
    }

    hide() {
        super.hide();
    }

    resetPwd() {
        this.hide();
        let _resetPsw = UNodeHelper.getComponent(this.node.parent, "loginResetPsw", VResetPsw);
        _resetPsw.init();
        _resetPsw.show(null);
        AppGame.ins.LoginModel._loginType = ELoginType.accountLogin
        AppGame.ins.LoginModel.requestLoginData(); 
    }
}
