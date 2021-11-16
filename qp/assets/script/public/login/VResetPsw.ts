import VWindow from "../../common/base/VWindow";
import VPopuWindow from "../base/VPopuWindow";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import AppGame from "../base/AppGame";
import { basename } from "path";
import UStringHelper from "../../common/utility/UStringHelper";
import ULanHelper from "../../common/utility/ULanHelper";
import { EVerifyCodeType } from "../hall/personal/RoleInfoClass";
import MLogin from "./MLogin";
import UImageCodeHelper from "../../common/utility/UImageCodeHelper";
import UDebug from "../../common/utility/UDebug";
import { Game, HallServer } from "../../common/cmd/proto";
import UMsgCenter from "../../common/net/UMsgCenter";
import UHandler from "../../common/utility/UHandler";
import { ECommonUI } from "../../common/base/UAllenum";



const { ccclass, property } = cc._decorator;
/**
 * 重置密码
 */
@ccclass
export default class VResetPsw extends VPopuWindow {

    @property(cc.SpriteFrame)
    editbox_img_normal:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    editbox_img_input:cc.SpriteFrame = null;

    private _account: cc.EditBox;
    private _code: cc.EditBox;
    private _verifyImgCode: cc.EditBox;//图形码验证框
    private _psw: cc.EditBox;
    private _okpsw: cc.EditBox;
    private _btncode: cc.Node;
    private _codetick: cc.Node;
    private _imgverify: cc.Node;
    private _imgverify_img: cc.Node;
    private _codetickContent: cc.Label;
    // private _get_code_title: cc.Label;
    private _djs_seconds: number = 59; // 倒计时label
    _djs_interval: any = null; // 倒计时计时器
    private _img_verify_str: string; // 输入的图形验证码字符串

    init(): void {
        super.init();
        this.hide();
    }

    onLoad(): void {
        this._account = UNodeHelper.getComponent(this._root, "account", cc.EditBox);
        this._code = UNodeHelper.getComponent(this._root, "yanzhengma", cc.EditBox);
        this._verifyImgCode = UNodeHelper.getComponent(this._root, "img_panel/img_verify/yanzhengma", cc.EditBox);
        this._psw = UNodeHelper.getComponent(this._root, "psw", cc.EditBox);
        this._okpsw = UNodeHelper.getComponent(this._root, "okpsw", cc.EditBox);
        this._btncode = UNodeHelper.find(this._root, "btn_get_code");
        this._codetick = UNodeHelper.find(this._root, "codetick_bg");
        this._imgverify = UNodeHelper.find(this._root, "img_panel");
        this._imgverify_img = UNodeHelper.find(this._root, "img_panel/img_verify/verify_img/img");
        this._codetickContent = this._codetick.getChildByName('codetick').getComponent(cc.Label);
        // this._get_code_title = UNodeHelper.getComponent(this._root, "btn_get_code/title", cc.Label);
        var btnreset = UNodeHelper.find(this._root, "btn_rest_psw");
        var btn_img_verfy = UNodeHelper.find(this._root, "img_panel/img_verify/verify_img");// 图形二维码按钮 用于点击刷新
        UEventHandler.addClick(this._btncode, this.node, "VResetPsw", "get_reset_psw_code");
        UEventHandler.addClick(btnreset, this.node, "VResetPsw", "reset_psw");
        UEventHandler.addClick(btn_img_verfy, this.node, "VResetPsw", "reflesh_img_verify_code");
        this._account.node.on("editing-did-began",this.accountStartInput,this);
        this._account.node.on("editing-did-ended",this.isPhoneNumber,this);

        this._code.node.on("editing-did-began",this.codeStartInput,this);
        this._code.node.on("editing-did-ended",this.isCode,this);

        this._verifyImgCode.node.on("editing-did-began",this.verifyStartInput,this);
        this._verifyImgCode.node.on("editing-did-ended",this.verifyEndInput,this);
        // this._verifyImgCode.node.on("text-changed",this.verifyCodeTextChange,this);

        this._psw.node.on("editing-did-began",this.pswStartInput,this);
        this._psw.node.on("editing-did-ended",this.pswEndInput,this);
        
        this._okpsw.node.on("editing-did-began",this.okpswStartInput,this);
        this._okpsw.node.on("editing-did-ended",this.okpswEndInput,this);
    }

    show(data: any): void {
        super.show(data);
        let time = (new Date()).getTime();
        let t = 60000 - (time - AppGame.ins.LoginModel.getVerifyCodeTime);
        clearInterval(this._djs_interval);
        if(t > 0) { // 倒计时还剩下多久
            this._djs_seconds = Math.floor(t * 0.001);
            this.settickShow(true);
            // 重新开启一个倒计时
            this.initTimeStick();
        } else {
            // this._send_code_btn.getComponent(cc.Button).enabled = true;
            this.settickShow(false);
        }
      
        this._account.string = "";
        this._code.string = "";
        this._okpsw.string = "";
        this._psw.string = "";
    }

     // 开启定时器非usDT
     initTimeStick():void {
        this._codetickContent.string = this._djs_seconds + "秒";
        this.scheduleOnce(()=>{
            this.runTimeStick();
        },0.8); 
        this._djs_interval = setInterval(()=>{
            this.runTimeStick();
        }, 1000);
    }

    private runTimeStick():void {
        this._codetickContent.string = this._djs_seconds + "秒"; 
        if(this._djs_seconds == 0) { // 倒计时可重新点击验证码
            // this._btncode.getComponent(cc.Button).enabled = true;
            this.settickShow(false);
            clearInterval(this._djs_interval);
        } else {
            this._djs_seconds--;
        }
    }
    private settickShow(value: boolean): void {
        this._btncode.active = !value;
        this._codetick.active = value;
    }
    private reset_psw(): void {
        super.playclick();
        if (UStringHelper.isEmptyString(this._account.string)) {
            AppGame.ins.showTips(ULanHelper.PHONE_EMPTY);
            return;
        }
        if (UStringHelper.isEmptyString(this._code.string)) {
            AppGame.ins.showTips(ULanHelper.CODE_EMPTY);
            return;
        }
        if (UStringHelper.isEmptyString(this._psw.string)) {
            AppGame.ins.showTips(ULanHelper.PSW_EMPTY);
            return;
        }
        if (this._psw.string.length < 5 || this._psw.string.length > 12|| UStringHelper.hasSpace(this._psw.string)) {
            AppGame.ins.showTips(ULanHelper.PSW_ERROR_LENGTH);
            return;
        }
        if (this._psw.string != this._okpsw.string) {
            AppGame.ins.showTips(ULanHelper.PSW_NO_SAME);
            return;
        }
        AppGame.ins.LoginModel.requestResetPsd(this._account.string, this._code.string, this._psw.string); 
       
        

    }
    
    // 刷新图形验证码
    private reflesh_img_verify_code(): void {
        // UDebug.log("刷新图形二维码！！！");
        super.playclick();
        AppGame.ins.LoginModel.requestVerifycodeImageMsg(this._account.string);
    }


    // 获取验证码
    private get_reset_psw_code(): void {
        super.playclick();
        if (UStringHelper.isEmptyString(this._account.string)) {
            AppGame.ins.showTips(ULanHelper.PHONE_EMPTY);
            return;
        }
        this._imgverify.active = true;
        this._verifyImgCode.string = "";
        this._img_verify_str = "";// 置空图形验证码字符串
        AppGame.ins.LoginModel.requestVerifycodeImageMsg(this._account.string);
        // AppGame.ins.LoginModel.requestgetverifycode(this._account.string, EVerifyCodeType.VERIFYCODE_RESETPASSWORD);
    }
    private accountStartInput():void{
        super.playclick();
        this._account.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_input;
    }

    private isPhoneNumber(data:any):void{
        this._account.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_normal;
        var a = /^([1][3,4,5,6,7,8,9])\d{9}$/;
        if(a.test(this._account.string)){
            
        }else if(this._account.string == ""){
            
        }else{
            AppGame.ins.showTips(ULanHelper.INPUT_PHONE_NUMBER);
            this._account.string = "";
        }
    }

    private codeStartInput():void{
        super.playclick();
        this._code.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_input;
    }

    private isCode(data:any):void{
        this._code.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_normal;
        var b = /^\d+$/;
        if(b.test(this._code.string)){

        }else if(this._code.string == ""){

        }else{
            AppGame.ins.showTips(ULanHelper.INPUT_NUMBER);
            this._code.string = "";
        }
    }

    private get_verifycode(sucess:boolean, msg:string):void{
        super.playclick();
        this._djs_seconds = 59;
        if(!sucess) {
            AppGame.ins.showTips(msg);
            this.reflesh_img_verify_code();
            this.settickShow(false);
        } else {
            this._imgverify.active = false;
            this.settickShow(true);
            // this._btncode.getComponent(cc.Button).enabled = false;
            this.initTimeStick();
        }
    }

    private pswStartInput():void{
        super.playclick();
        this._psw.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_input;
    }

    private pswEndInput():void{
        this._psw.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_normal;
    }

    private okpswStartInput():void{
        super.playclick();
        this._okpsw.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_input;
    }

    private okpswEndInput():void{
        this._okpsw.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_normal;
    }

    private verifyStartInput():void{
        super.playclick();
        this._verifyImgCode.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_input;
    }

    private verifyEndInput():void{
        this._verifyImgCode.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_normal;
    }

    //  /**
    //  * 验证码输入文本改变的时候判断
    //  */
    // private verifyCodeTextChange(): void {
    //     if(this._verifyImgCode.string.length == 4) {
    //         UDebug.log("已经输入了4位有效验证码并且验证码正确");
    //         this._img_verify_str = this._verifyImgCode.string;
    //         // 请求短信验证码
    //         AppGame.ins.LoginModel.requestgetverifycode(this._account.string, EVerifyCodeType.VERIFYCODE_RESETPASSWORD,this._img_verify_str);
    //     }
        
    // }
    
    /**发送图形验证码 */
    sendImgVerifyCode() {
        if(this._verifyImgCode.string.length == 4) {
            UDebug.log("已经输入了4位有效验证码并且验证码正确");
            this._img_verify_str = this._verifyImgCode.string;
            // 请求短信验证码
            AppGame.ins.LoginModel.requestgetverifycode(this._account.string, EVerifyCodeType.VERIFYCODE_RESETPASSWORD,this._img_verify_str);
        } else {
            AppGame.ins.showTips("请正确输入右边四位图形验证码");
        }
    }

    closeImgVerifyPanel() {
        this._imgverify.active = false;
    }

    // 获取图形验证码返回消息
    private get_img_verifycode(sucess:boolean, base64imageData:string):void {
        if(sucess) {
            // 这里显示获取到的验证码图片
            let baseHeader = "data:image/png;base64,";
            UImageCodeHelper.showBase64Png(baseHeader+base64imageData, this._imgverify_img);
        }
    }

    private reset_password(success: boolean, errorMsg: string): void {
        if(success) {
            this.clickClose();
        } else {
            AppGame.ins.showTips(errorMsg);
        }
    }

    protected onEnable():void{
        this._imgverify.active = false;
        AppGame.ins.LoginModel.on(MLogin.GET_VERIFYCODE,this.get_verifycode,this);
        AppGame.ins.LoginModel.on(MLogin.GET_IMG_VERIFYCODE,this.get_img_verifycode,this);
        AppGame.ins.LoginModel.on(MLogin.RESET_PASSWORD,this.reset_password,this);
        AppGame.ins.LoginModel.on(MLogin.CONNECT_CLOSE, this.connect_close, this);

    }
    protected onDisable():void{
        clearInterval(this._djs_interval);
        this._imgverify.active = false;
        AppGame.ins.LoginModel.off(MLogin.GET_VERIFYCODE,this.get_verifycode,this);
        AppGame.ins.LoginModel.off(MLogin.GET_IMG_VERIFYCODE,this.get_img_verifycode,this);
        AppGame.ins.LoginModel.off(MLogin.RESET_PASSWORD,this.reset_password,this);
        AppGame.ins.LoginModel.off(MLogin.CONNECT_CLOSE, this.connect_close, this);
        //主动关闭当前连接
        UMsgCenter.ins.closepeer();
    }

    connect_close(){
        AppGame.ins.showConnect(false);
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: 1, data: "当前网络较差，请检查网络后重试。", handler: UHandler.create(() => {
                UMsgCenter.ins._connectOk = false
                AppGame.ins.showConnect(true);
                if (UMsgCenter.ins._peer){
                    UMsgCenter.ins._peer.reConnect()
                }
            }, this)
        })
    }
}
