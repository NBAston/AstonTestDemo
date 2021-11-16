import VWindow from "../../../common/base/VWindow";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import UStringHelper from "../../../common/utility/UStringHelper";
import AppGame from "../../base/AppGame";
import ULanHelper from "../../../common/utility/ULanHelper";
import { ECommonUI } from "../../../common/base/UAllenum";
import { UserBindInfoData } from "../charge/ChargeData";
import { EVerifyCodeType } from "../personal/RoleInfoClass";
import MRole from "../lobby/MRole";
import MLogin from "../../login/MLogin";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VBlindUsdtAccount extends VWindow {
    @property(cc.SpriteFrame)
    normalImg:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    inputImg:cc.SpriteFrame = null;
    private _wallet_agreement_btn: cc.Node = null; // 钱包协议按钮
    private _erc_btn: cc.Node = null; // erc20协议按钮
    private _usdt_address_editbox: cc.EditBox = null;// usdt账号地址
    private _description_btn: cc.Node = null; // usde 钱包充值兑换描述按钮
    private _phone_num_editbox: cc.EditBox = null; // 验证手机号码EditBox
    private _code_editbox: cc.EditBox = null; // 验证码EditBox
    private _send_code_btn: cc.Node = null; // 发送验证码
    private _add_bind_btn: cc.Node;// 添加绑定
    private _tip_code_node: cc.Node; // 发送验证码
    private _time_node: cc.Node; // 发送验证码
    private _tip_code_label: cc.Label; // 发送验证码
    private _time_label: cc.Label; // 发送验证码
    private _djs_seconds: number = 59; // 倒计时label
    _djs_interval: any = null; // 倒计时计时器
    _bindType: number = 1; // 1 为绑定 2 为修改绑定
    _userBindInfo: UserBindInfoData;
    // private _back:cc.Node;

    init(): void {
        super.init();

        this._wallet_agreement_btn = UNodeHelper.find(this._root, "wallet_agreement_btn");
        this._erc_btn = UNodeHelper.find(this._root, "erc_btn");
        this._send_code_btn = UNodeHelper.find(this._root, "send_code_btn");
        this._description_btn = UNodeHelper.find(this._root, "description_btn");
        this._add_bind_btn = UNodeHelper.find(this._root, "add_bind_btn");
        this._usdt_address_editbox = UNodeHelper.getComponent(this._root, "usdt_address_editbox", cc.EditBox);
        this._phone_num_editbox = UNodeHelper.getComponent(this._root, "phone_number_editbox", cc.EditBox);
        this._code_editbox = UNodeHelper.getComponent(this._root, "code_editbox", cc.EditBox);
        this._tip_code_node = UNodeHelper.find(this._root, "send_code_btn/tip_code");
        this._time_node = UNodeHelper.find(this._root, "send_code_btn/time");
        this._tip_code_label = UNodeHelper.getComponent(this._root, "send_code_btn/tip_code", cc.Label);
        this._time_label = UNodeHelper.getComponent(this._root, "send_code_btn/time", cc.Label);
        this._usdt_address_editbox.node.on('editing-did-began', this.editDidBegan, this);
        this._usdt_address_editbox.node.on('editing-did-ended', this.editDidEnded, this);  
        this._phone_num_editbox.node.on('editing-did-began', this.editDidBegan2, this);
        this._phone_num_editbox.node.on('editing-did-ended', this.editDidEnded2, this);  
        this._code_editbox.node.on('editing-did-began', this.editDidBegan3, this);
        this._code_editbox.node.on('editing-did-ended', this.editDidEnded3, this); 
        UEventHandler.addClick(this._wallet_agreement_btn, this.node, "VBlindUsdtAccount", "onclickWalletAgreementBtn");
        UEventHandler.addClick(this._erc_btn, this.node, "VBlindUsdtAccount", "onclickErcBtn");
        UEventHandler.addClick(this._send_code_btn, this.node, "VBlindUsdtAccount", "onclickSendCodeBtn");
        UEventHandler.addClick(this._description_btn, this.node, "VBlindUsdtAccount", "onclickDescriptionBtn");
        UEventHandler.addClick(this._add_bind_btn, this.node, "VBlindUsdtAccount", "onclickAddBindBtn");
        // this._back = UNodeHelper.find(this.node,"back");
        // UEventHandler.addClick(this._back,this.node,"VBlindUsdtAccount","closeUI");
    }
    editDidBegan(): void {
        super.playclick();
        this._usdt_address_editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.inputImg;
    }

    editDidEnded(): void {
        this._usdt_address_editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.normalImg;
    }
    editDidBegan2(): void {
        super.playclick();
        this._phone_num_editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.inputImg;
    }

    editDidEnded2(): void {
        this._phone_num_editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.normalImg;
    }
    editDidBegan3(): void {
        super.playclick();
        this._code_editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.inputImg;
    }

    editDidEnded3(): void {
        this._code_editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.normalImg;
    }
    /**
   * 显示
   */
    show(data: any): void {
        super.show(data);
        this._bindType = data;
        this.setBindUsdtAccountUI();
        let time = (new Date()).getTime();
        clearInterval(this._djs_interval);
        let t = 60000 - (time - AppGame.ins.LoginModel.getUsdtVerifyCodeTime);
        if(t > 0) { // 倒计时还剩下多久
            // this._codetickContent.string = Math.floor(t * 0.001).toString() + "秒";
            this._djs_seconds = Math.floor(t * 0.001);
            this.showDJSStick(true);
            // 重新开启一个倒计时
            this.initTimeStick();
        } else {
            this._send_code_btn.getComponent(cc.Button).enabled = true;
            this.showDJSStick(false);
        }
    }


    // 展示注册弹框
    showRegisterUI(): void {

    }

    setBindUsdtAccountUI(): void {
        this._userBindInfo = AppGame.ins.roleModel.getBindInfoData();
        if(!UStringHelper.isEmptyString(this._userBindInfo.mobileNum)) {
            this._phone_num_editbox.string = this._userBindInfo.mobileNum;
            this._phone_num_editbox.enabled = false;
        } else {
            // 弹框注册用户账号以绑定手机
            this.showRegisterUI();
        }
    }

    // 钱包协议
    onclickWalletAgreementBtn(): void {
        super.playclick();
        AppGame.ins.showUI(ECommonUI.UI_USDT_HELP, 1);
    }

    // 点击Erc
    onclickErcBtn(): void {

    }

    // 发送验证码
    onclickSendCodeBtn(): void {
        super.playclick();
        if(UStringHelper.isEmptyString(this._phone_num_editbox.string)) {
            this.showRegisterUI();
            return;
        }
        AppGame.ins.LoginModel.requestgetverifycode(this._phone_num_editbox.string, EVerifyCodeType.VERIFYCODE_BINDUSDT, "");
    }

    // 点击钱包充值兑换描述
    onclickDescriptionBtn(): void {
        super.playclick();
        AppGame.ins.showUI(ECommonUI.UI_USDT_HELP, 6);
    }

    // 添加绑定
    onclickAddBindBtn(): void {
        super.playclick();
        if(this.checkBindParam()) {
            AppGame.ins.roleModel.requestBindUsdtAddress(this._usdt_address_editbox.string, this._code_editbox.string, this._bindType);
            // AppGame.ins.closeUI(ECommonUI.EXCHANGE_BIND_ALIPAY)
        }
    }

    // 开启定时器
    private initTimeStick():void {
        this._time_label.string = this._djs_seconds + "秒"; 
        this._djs_interval = setInterval(()=>{
        this._time_label.string = this._djs_seconds + "秒"; 
        if(this._djs_seconds == 0) { // 倒计时可重新点击验证码
            clearInterval(this._djs_interval);
            this._send_code_btn.getComponent(cc.Button).enabled = true;
            this.showDJSStick(false);
        } else {
            this._djs_seconds--;
        }
        }, 1000);
       
    }

    // 获取验证码消息 监听
    private get_verifycode(isStartDJS: boolean, errMsg: string) {
        this._djs_seconds = 59;
        if(isStartDJS) {
            this.showDJSStick(true);
            this._send_code_btn.getComponent(cc.Button).enabled = false;
            this.initTimeStick();
        } else {
            this.showDJSStick(false);
            AppGame.ins.showTips(errMsg);
        }
    }

    // 显示倒计时已否
    showDJSStick(isShow: boolean) {
        this._time_node.active = isShow;
        this._tip_code_node.active = !isShow;
    }

    // 核对绑定的参数
    checkBindParam(): boolean {
        if(UStringHelper.isEmptyString(this._usdt_address_editbox.string)) {
            AppGame.ins.showTips("请输入USDT钱包地址"); 
            this._usdt_address_editbox.focus();
            return false;
        }

        if(!UStringHelper.isEnOrNumber(this._usdt_address_editbox.string) || !UStringHelper.isOxStart(this._usdt_address_editbox.string)) {
            AppGame.ins.showTips("请输入正确的USDT钱包地址");
            // this._usdt_address_editbox.string = ""; 
            this._usdt_address_editbox.focus();
            return false;
        }

        if(this._usdt_address_editbox.string.length != 42) {
            AppGame.ins.showTips("请输入42位USDT钱包地址");
            // this._usdt_address_editbox.string = ""; 
            this._usdt_address_editbox.focus();
            return false;
        }

        if(UStringHelper.isEmptyString(this._phone_num_editbox.string)) {
            AppGame.ins.showTips("请先注册为正式账号");
            this.showRegisterUI();
            return false;
        }

        if(UStringHelper.isEmptyString(this._code_editbox.string)) {
            AppGame.ins.showTips("请输入验证码");
            this._code_editbox.focus();
            return false;
        }

        return true;

    }

//     closeUI(){
//         this.playclick();
//         super.clickClose();
//     }

    protected onEnable(): void {
        AppGame.ins.LoginModel.on(MLogin.GET_VERIFYCODE,this.get_verifycode,this);
    }
    protected onDisable(): void {
        clearInterval(this._djs_interval);
        AppGame.ins.LoginModel.on(MLogin.GET_VERIFYCODE,this.get_verifycode,this);
        // AppGame.ins.roleModel.off(MRole.ON_CHARGE, this.on_charge, this);
    }
}
