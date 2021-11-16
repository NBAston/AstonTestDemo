import { EAppStatus, ECommonUI } from './../../../common/base/UAllenum';
import VWindow from "../../../common/base/VWindow";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import AppGame from "../../base/AppGame";
import UStringHelper from "../../../common/utility/UStringHelper";
import ULanHelper from "../../../common/utility/ULanHelper";
import { EVerifyCodeType } from "./RoleInfoClass";
import MLogin from "../../login/MLogin";
import { Game } from "../../../common/cmd/proto";
import UMsgCenter from "../../../common/net/UMsgCenter";
import UHandler from "../../../common/utility/UHandler";
import UDebug from "../../../common/utility/UDebug";
import UImageCodeHelper from "../../../common/utility/UImageCodeHelper";
import { AccountInfo, ULocalStorage } from "../../../common/utility/ULocalStorage";
import { ELoginType } from "../../../common/base/UAllenum";
import AppStatus from "../../base/AppStatus";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VRegester extends VWindow {

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

    private _startTick: boolean;
    private _ticktime: number;
    private _img_verify_str: string; // 输入的图形验证码字符串
    private _succeTime: number;
    private _isRegister:boolean = false;
    init(): void {
        super.init();
        // this.hide();
        this._account = UNodeHelper.getComponent(this._root, "account", cc.EditBox);
        this._code = UNodeHelper.getComponent(this._root, "yanzhengma", cc.EditBox);
        // this._verifyImgCode = UNodeHelper.getComponent(this._root, "img_verify/yanzhengma", cc.EditBox);
        this._psw = UNodeHelper.getComponent(this._root, "psw", cc.EditBox);
        this._okpsw = UNodeHelper.getComponent(this._root, "okpsw", cc.EditBox);

        this._verifyImgCode = UNodeHelper.getComponent(this._root, "img_panel/img_verify/yanzhengma", cc.EditBox);
      
        this._btncode = UNodeHelper.find(this._root, "btn_get_code");
        this._codetick = UNodeHelper.find(this._root, "codetick_bg");
        this._imgverify = UNodeHelper.find(this._root, "img_panel");
        this._imgverify_img = UNodeHelper.find(this._root, "img_panel/img_verify/verify_img/img");
        this._codetickContent = this._codetick.getChildByName('codetick').getComponent(cc.Label);
        var btnreset = UNodeHelper.find(this._root, "btn_rest_psw");
        var btn_img_verfy = UNodeHelper.find(this._root, "img_panel/img_verify/verify_img");// 图形二维码按钮 用于点击刷新
        UEventHandler.addClick(this._btncode, this.node, "VRegester", "get_reset_psw_code");
        UEventHandler.addClick(btnreset, this.node, "VRegester", "reset_psw");
        UEventHandler.addClick(btn_img_verfy, this.node, "VRegester", "reflesh_img_verify_code");
        this._account.node.on("editing-did-began",this.accountStartInput,this);
        this._account.node.on("editing-did-ended",this.isPhoneNumber,this);
        this._code.node.on("editing-did-began",this.codeStartInput,this);
        this._code.node.on("editing-did-ended",this.isCode,this);
        // this._verifyImgCode.node.on("text-changed",this.verifyCodeTextChange,this);
        this._verifyImgCode.node.on("editing-did-began",this.verifyStartInput,this);
        this._verifyImgCode.node.on("editing-did-ended",this.verifyStopInput,this);
        this._psw.node.on("editing-did-began",this.pswStartInput,this);
        this._psw.node.on("editing-did-ended",this.pswStopInput,this);
        this._okpsw.node.on("editing-did-began",this.okpswStartInput,this);
        this._okpsw.node.on("editing-did-ended",this.okpswStopInput,this);

     
    }
    show(data: any): void {
        super.show(data);
        if(data && data.hasOwnProperty('isRegister')) {
            this._isRegister = data.isRegister;
        }
        let time = (new Date()).getTime();
        let t = 60000 - (time - AppGame.ins.LoginModel.getVerifyCodeTime);
        if (t > 0 &&  AppGame.ins.LoginModel.isStartTickTime) {
            this._startTick = true;
            this._ticktime = 1;
            this.settickShow(true);
            this._succeTime = AppGame.ins.LoginModel.getVerifyCodeTime;
            this.calutetickTime();
        } else {
            this._startTick = false;
            this._ticktime = 1;
            this.settickShow(false);
        }
        this._account.string = "";
        this._code.string = "";
        this._okpsw.string = ""; 
        this._psw.string = "";
    }

    hide() {
        super.hide();
    }

    clickClose(){
        this.playclick();
        this.closeAnimation(UHandler.create(() => {
            AppGame.ins.closeUI(ECommonUI.LB_Regester);
        }, this));

        if (AppGame.ins.appStatus.status == EAppStatus.Login) {
            UMsgCenter.ins.closepeer();
        }
    }

    protected update(dt: number): void {
        if (this._startTick) {
            this._ticktime -= dt;
            if (this._ticktime < 0) {
                this._ticktime = 1;
                this.calutetickTime();
            }
        }

    }

    private verifyStartInput():void{
        super.playclick();
        this._verifyImgCode.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_input;
    }

    private verifyStopInput():void{
        this._verifyImgCode.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_normal;
    }

    private pswStartInput():void{
        super.playclick();
        this._psw.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_input;
    }

    private pswStopInput():void{
        this._psw.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_normal;
    }

    private okpswStartInput():void{
        super.playclick();
        this._okpsw.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_input;
    }

    private okpswStopInput():void{
        this._okpsw.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_normal;
    }

    private accountStartInput():void{
        super.playclick();
        this._account.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_input;
    }

    private isPhoneNumber(data:any):void{
        this._account.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_normal;
        var a = /^([1][3,4,5,6,7,8,9])\d{9}$/;
        // var b = /^[A-Za-z0-9]+$/;
        if(a.test(this._account.string)){
            
        }else if(this._account.string == ""){
            
        }else{
            AppGame.ins.showTips(ULanHelper.INPUT_PHONE_NUMBER);
            this._account.string = "";
        }
    }

    private codeStartInput():void{
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
        if (this._psw.string.length < 5 || this._psw.string.length > 12 || UStringHelper.hasSpace(this._psw.string)) {
            AppGame.ins.showTips(ULanHelper.PSW_ERROR_LENGTH);
            return;
        }
        if (this._psw.string != this._okpsw.string) {
            AppGame.ins.showTips(ULanHelper.PSW_NO_SAME);
            return;
        }
        let acc = null;
        var account = AppGame.ins.LoginModel.getAccount((a: AccountInfo) => {
            UDebug.log("账号。。。。"+a);
            acc = a;
        });

        if(this._isRegister) { 
            ULocalStorage.saveItem("isRegister", "true");
            AppGame.ins.LoginModel.createAccount("","","",this._account.string,this._psw.string,this._code.string); 
        } else {
            if(!acc) {
                //手机注册
                AppGame.ins.LoginModel.createAccount(); 
            } else if ( acc.mobilenum =="" && acc.userId !=0 ) {
                //手机登陆
                let osType = 0;
                if (CC_JSB && cc.sys.OS_ANDROID == cc.sys.os) {
                    osType = 2;
                }else if(CC_JSB && cc.sys.OS_IOS == cc.sys.os){
                    osType = 1;
                }else{
                    osType = 3; 
                }
                AppGame.ins.LoginModel.requestbindMobile(this._account.string, this._code.string, this._psw.string,osType);
            } else if(acc.userId && acc.userId == 0){
                //手机注册
                AppGame.ins.LoginModel.createAccount();
            }
        }
        // this.clickClose();
    }
  
    onRegisterSuccess() {
        let osType = 0;
        if (CC_JSB && cc.sys.OS_ANDROID == cc.sys.os) {
            osType = 2;
        }else if(CC_JSB && cc.sys.OS_IOS == cc.sys.os){
            osType = 1;
        }else{
            osType = 3;
        }
        AppGame.ins.LoginModel.requestbindMobile(this._account.string, this._code.string, this._psw.string,osType);
    }


    // 刷新图形验证码
    private reflesh_img_verify_code(): void {
        UDebug.log("刷新图形二维码！！！");
        super.playclick();
        AppGame.ins.LoginModel.requestVerifycodeImageMsg(this._account.string);
    }

    /**
     * 获取验证码
     */
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

        // AppGame.ins.LoginModel.requestgetverifycode(this._account.string, EVerifyCodeType.VERIFYCODE_REGISTERMOBILE);
        //     this._startTick = true;
        //     this._ticktime = 1;
        //     this.settickShow(true);
        //     this.calutetickTime();
    }

    // /**
    //  * 验证码输入文本改变的时候判断
    //  */
    // private verifyCodeTextChange(): void {
    //    /* if(this._verifyImgCode.string.length == 4) {
    //         UDebug.log("已经输入了4位有效验证码并且验证码正确");
    //         this._img_verify_str = this._verifyImgCode.string;
    //         // 请求短信验证码
    //         AppGame.ins.LoginModel.requestgetverifycode(this._account.string, EVerifyCodeType.VERIFYCODE_REGISTERMOBILE,this._img_verify_str);
    //     }*/
        
    // }

    /**发送图形验证码 */
    sendImgVerifyCode() {
        if(this._verifyImgCode.string.length == 4) {
            UDebug.log("已经输入了4位有效验证码并且验证码正确");
            this._img_verify_str = this._verifyImgCode.string;
            // 请求短信验证码
            AppGame.ins.LoginModel.requestgetverifycode(this._account.string, EVerifyCodeType.VERIFYCODE_REGISTERMOBILE,this._img_verify_str);
        } else {
            AppGame.ins.showTips("请正确输入右边四位图形验证码");
        }
    }

    closeImgVerifyPanel() {
        this._imgverify.active = false;
    }


    private calutetickTime(): void {
        let time = (new Date()).getTime();
        let t = 60000 - (time - this._succeTime);//(time - AppGame.ins.LoginModel.getVerifyCodeTime);
        if (t < 0) {
            this._startTick = false;
            this.settickShow(false);

        } else {
            this._codetickContent.string = Math.floor(t * 0.001).toString() + " 秒";
        }
    }
    private get_verifycode(sucess:boolean,msg:string):void {
        if(!sucess) {
            AppGame.ins.showTips(msg);
            this.reflesh_img_verify_code();
        } else {
            UDebug.Log("获取验证码成功，进行倒计时->");
            this._imgverify.active = false;
            this._startTick = true;
            this._succeTime = (new Date()).getTime();
            this._ticktime = 0;
            this._codetickContent.string = "59 秒";
            this.settickShow(true);
        }
    }

    // 获取图形验证码返回消息
    private get_img_verifycode(sucess:boolean, base64imageData:string):void {
        if(sucess) {
            // 这里显示获取到的验证码图片
            let baseHeader = "data:image/png;base64,";
            UImageCodeHelper.showBase64Png(baseHeader+base64imageData, this._imgverify_img);
        }
    }

    protected onEnable():void{
        this._imgverify.active = false;
        AppGame.ins.LoginModel.on(MLogin.GET_VERIFYCODE,this.get_verifycode,this);
        AppGame.ins.LoginModel.on(MLogin.GET_IMG_VERIFYCODE,this.get_img_verifycode,this);
        AppGame.ins.LoginModel.on(MLogin.REGISTRATION_SUCCESS, this.onRegisterSuccess, this);
        AppGame.ins.LoginModel.on(MLogin.CONNECT_CLOSE, this.connect_close, this);
    }
    protected onDisable():void{
        this._imgverify.active = false;
        AppGame.ins.LoginModel.off(MLogin.GET_VERIFYCODE,this.get_verifycode,this);
        AppGame.ins.LoginModel.off(MLogin.GET_IMG_VERIFYCODE,this.get_img_verifycode,this);
        AppGame.ins.LoginModel.off(MLogin.REGISTRATION_SUCCESS, this.onRegisterSuccess, this);
        AppGame.ins.LoginModel.off(MLogin.CONNECT_CLOSE, this.connect_close, this);
    }


    connect_close(){
        if (AppGame.ins.appStatus.status == EAppStatus.Login){
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
}
