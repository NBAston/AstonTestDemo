import UNodeHelper from "../../common/utility/UNodeHelper";
import ULanHelper from "../../common/utility/ULanHelper";
import AppGame from "../base/AppGame";
import MLogin from "./MLogin";
import UEventHandler from "../../common/utility/UEventHandler";
import MHall from "../hall/lobby/MHall";
import ULocalDB, { AccountInfo } from "../../common/utility/ULocalStorage";
import UStringHelper from "../../common/utility/UStringHelper";
import UScene from "../../common/base/UScene";
import VChangeAccount from "./VChangeAccount";
import { EAppStatus, ECommonUI, ELoginType, ERoomKind } from "../../common/base/UAllenum";
import { strict } from "assert";
import UMsgCenter from "../../common/net/UMsgCenter";
import cfg_global from "../../config/cfg_global";
import UDebug from "../../common/utility/UDebug";
import cfg_lucky from "../../config/cfg_lucky";
import VWindow from "../../common/base/VWindow";
import UAudioManager from "../../common/base/UAudioManager";
import VLoginOtherAccount from "./VLoginOtherAccount";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import { EventManager } from "../../common/utility/EventManager";
import cfg_event from "../../config/cfg_event";
import UHandler from "../../common/utility/UHandler";
import UResManager from "../../common/base/UResManager";
import VHall from "../hall/lobby/VHall";

const { ccclass, property } = cc._decorator;
/**
 * 创建:sq
 * 功能:登陆模块
 */
@ccclass
export default class VLogin extends UScene {


    @property({ type: cc.Node })
    toggleContainer: cc.Node = null;
    @property({ type: cc.Node })
    lableNode_1: cc.Node = null;
    @property({ type: cc.Node })
    lableNode_2: cc.Node = null;

    /**
     * 账号输入框
     */
    private _account: cc.Label;
    /**
     * 登陆UI节点
     */
    private _input: cc.Node;
    /**
     * IP输入框
     */
    private _ip: cc.EditBox;
    /**
     * 端口输入框
     */
    private _port: cc.EditBox;
    /**
     * api输入框
     */
    private _api: cc.EditBox;
    /**
     * 密码输入框
     */
    private _psw: cc.EditBox;
    /**
     * 版本号
     */
    private _versionText: cc.Label;
    /**
     * 账号切换面板
     */
    private _changeAccount: VChangeAccount;
    /*
     *手机登录
     */
    private _btnLoginMobile: cc.Node;
    /*
     *游客登录
     */
    private _btnLoginYouke: cc.Node;

    private _needautoLogin: boolean;
    private _lucky: cc.Label;
    private _errorTouchNode: cc.Node;
    private _touchTag: number = 0;
    private _lastTouchTime: number = 0;
    private _isNeedDowload: boolean = false;
    private _editbox_string: string;

    protected init(): void {
        this._input = UNodeHelper.find(this.node, "login");
        this._psw = UNodeHelper.getComponent(this.node, "login/password", cc.EditBox);
        this._api = UNodeHelper.getComponent(this.node, "login/api", cc.EditBox);
        this._ip = UNodeHelper.getComponent(this.node, "login/ip", cc.EditBox);
        this._port = UNodeHelper.getComponent(this.node, "login/port", cc.EditBox);
        let lgbtn = UNodeHelper.find(this.node, "login/loginbtn");
        let btn = UNodeHelper.find(this.node, "loginaccount/btn_start");
        let btn_change = UNodeHelper.find(this.node, "loginaccount/btn_change");
        this._lucky = UNodeHelper.getComponent(this.node, "lucky", cc.Label);
        this.getRandom();
        this._account = UNodeHelper.getComponent(this.node, "loginaccount/account_id", cc.Label);
        this._changeAccount = UNodeHelper.getComponent(this.node, "changeAccount", VChangeAccount);
        this._errorTouchNode = UNodeHelper.find(this.node, "errorTouchNode");
        this._changeAccount.init();
        this.onErrorNodeTouch()
        UEventHandler.addClick(btn, this.node, "VLogin", "login");
        UEventHandler.addClick(btn_change, this.node, "VLogin", "on_showAccount");
        UEventHandler.addClick(lgbtn, this.node, "VLogin", "connect");
        UNodeHelper.getComponent(this.node, "versionText", cc.Label).string = "版本  " + cfg_global.version;
        UNodeHelper.getComponent(this.node, "timeText", cc.Label).string = "构建时间  " + cfg_global.buildTime;
        this._btnLoginMobile = UNodeHelper.find(this.node, "loginaccount/loginBtnLayout/btn_login_mobile");
        this._btnLoginYouke = UNodeHelper.find(this.node, "loginaccount/loginBtnLayout/btn_login_yk");
        UEventHandler.addClick(this._btnLoginMobile, this.node, "VLogin", "mobileLogin");
        UEventHandler.addClick(this._btnLoginYouke, this.node, "VLogin", "login");
        let btn_create_icon = UNodeHelper.find(this.node, "btn_Layout/btn_create_icon");
        this._editbox_string = UNodeHelper.find(this.node, "editBox").getComponent(cc.EditBox).string;
        if (!cfg_global.isUseInputServer) {
            UNodeHelper.find(this.node, "editBox").active = false;
        }
        if (cc.sys.OS_IOS == cc.sys.os) {
            btn_create_icon.active = true;
        } else {
            btn_create_icon.active = false;
        }
        UEventHandler.addClick(btn_create_icon, this.node, "VLogin", "createDeskIcon");
        let acc = null;
        var account = AppGame.ins.LoginModel.getAccount((a: AccountInfo) => {
            UDebug.log("账号。。。。" + a);
            acc = a;
        });
        if (!acc || (acc.userId != 0 && acc.mobilenum == "")) {

        } else if (acc.userId != 0 && acc.mobilenum != "") {
            this._btnLoginYouke.active = false;
            // this._btnLoginMobile.x = 0;
        }
        cfg_global.isOverseas = true;
        AppGame.ins.isJudge = true;

        AppGame.ins.editboxserver = UNodeHelper.find(this.node, "editBox").getComponent(cc.EditBox);

        //清除缓存
        let clearbtn = UNodeHelper.find(this.node, "btn_Layout/btn_clear_game");
        UEventHandler.addClick(clearbtn, this.node, "VLogin", "clearAppCache");
        clearbtn.active = cc.sys.isNative ? true : false
        VHall.isLogin = true;
    }

    //清除缓存
    clearAppCache() {
        AppGame.ins.clearAppCache()
    }

    start(){
        //线上不显示线路选择
        if(cfg_global.env != 2){
            this.toggleContainer.active=true;
        }
    }


    showQQ() {
        if (AppGame.ins.serviceUrl) {
            cc.sys.openURL(AppGame.ins.serviceUrl);
        }
        // let acc = null;
        // let account = AppGame.ins.LoginModel.getAccount((a: AccountInfo) => {
        //     acc = a;
        // });
        // let tempStr = ""
        // if (acc != null) {
        //     tempStr = "\nID:" + acc.userId;
        // }
        // AppGame.ins.showUI(ECommonUI.NewMsgBox, {
        //     type: 1, data: "请联系客服QQ:2318701585" + tempStr, handler: UHandler.create((() => {
        //     }))
        // });
    }

    //切换线路
    SwitchingCircuit(event, eventData) {
        var color = cc.Color.BLACK;
        if (eventData != 1) {
            cfg_global.isOverseas = true;
            this.lableNode_1.color = color.fromHEX("#7CEB8A");
            this.lableNode_2.color = color.fromHEX("#8E90A4");
        }
        else {
            cfg_global.isOverseas = false;
            this.lableNode_2.color = color.fromHEX("#7CEB8A");
            this.lableNode_1.color = color.fromHEX("#8E90A4");
        }
    }

    private on_showAccount(): void {
        UAudioManager.ins.playSound("audio_click");
        this._changeAccount.show(null);
        this.refresh_account();
    }
    private getRandom(): void {
        var a = Math.floor(Math.random() * (cfg_lucky.tips.length));
        this._lucky.string = cfg_lucky.tips[a];
    }
    /**
     * 切换账号
     */
    private refresh_account(): void {
        var data = AppGame.ins.LoginModel.getAccountInfo();
        this._changeAccount.bind(data);
        let len = data.length;
        this._account.string = "";
        for (let i = 0; i < len; i++) {
            if (data[i].current) {
                if (UStringHelper.isEmptyString(data[i].mobile)) {
                    this._account.string = data[i].userId.toString();

                } else {
                    this._account.string = data[i].mobile;
                }
                break;
            }
        }
    }
    private showLogin(value: boolean): void {
        this._input.active = value;
    }
    /**
    * 登陆
    */
    private connect(): void {
        if (AppGame.ins.offline) {
            this.updategameInfo(true, "");
            return;
        }
        //cfg_global.ips = [this._ip.string + ":" + this._port.string];
        AppGame.ins.LoginModel.requestLoginData();
        this.saveLocaldb();
    }
    private login(): void {
        AppGame.ins.isJudge = false;
        AppGame.ins.LoginModel._loginType = ELoginType.autoLogin;
        AppGame.ins.LoginModel.requestLoginData();
        UAudioManager.ins.playSound("audio_click");
    }



    private mobileLogin(): void {
        // ULocalDB.getDB();
        // let acc = null;
        // var account = AppGame.ins.LoginModel.getAccount((a: AccountInfo) => {
        //     UDebug.log("账号。。。。"+a);
        //     acc = a;
        // });
        // if(!acc) {
        //     //手机注册
        //     // AppGame.ins.LoginModel.requestLoginData();
        //     // AppGame.ins.showUI(ECommonUI.LB_Regester);
        //     // AppGame.ins.LoginModel._loginType = ELoginType.accountLogin;
        //     let loginOtherAccount:VLoginOtherAccount = UNodeHelper.getComponent(this.node, "loginOtherAccount", VLoginOtherAccount);
        //     loginOtherAccount.show(null);
        // } else if (acc.mobilenum && acc.mobilenum!="") {
        //     //手机登陆
        //     let loginOtherAccount:VLoginOtherAccount = UNodeHelper.getComponent(this.node, "loginOtherAccount", VLoginOtherAccount);
        //     loginOtherAccount.show(null);
        // } else {
        //     //手机注册
        //     // AppGame.ins.LoginModel.requestLoginData();
        //     // AppGame.ins.showUI(ECommonUI.LB_Regester);
        //     // AppGame.ins.LoginModel._loginType = ELoginType.accountLogin; 
        //     let loginOtherAccount:VLoginOtherAccount = UNodeHelper.getComponent(this.node, "loginOtherAccount", VLoginOtherAccount);
        //     loginOtherAccount.show(null);
        // }
        // UDebug.log("账号。。。。"+ acc);
        let loginOtherAccount: VLoginOtherAccount = UNodeHelper.getComponent(this.node, "loginOtherAccount", VLoginOtherAccount);
        loginOtherAccount.show(null);
    }

    private saveLocaldb(): void {
        ULocalDB.SaveDB("ip", this._ip.string);
        ULocalDB.SaveDB("port", this._port.string);
    }
    private connectsucess(): void {
        //连接成功后，再自动登录
        if (AppGame.ins.LoginModel._loginType == ELoginType.autoLogin) {
            AppGame.ins.LoginModel.autoLogin();
        };
    }
    private onclose(): void {
        //this._content.string = ULanHelper.CONNECT_CLOSE;
    }
    private regester_error(msg: string): void {
        AppGame.ins.showTips(msg);
    }
    private loginError(caller: string): void {
        //this._content.string = caller;
    }
    private updategameInfo(value: boolean, msg: string): void {
        AppGame.ins.LoginModel.loginSucess(value);
        if (!value) AppGame.ins.showTips(msg);
    }
    openScene(isLogout: boolean): void {
        super.openScene(isLogout);
        AppGame.ins.appStatus.status = EAppStatus.Login;
        this._api.string = ULocalDB.getDB("api");
        this._ip.string = ULocalDB.getDB("ip");
        this._port.string = ULocalDB.getDB("port").toString();
        this.refresh_account();
        this.showLogin(false);
        this._needautoLogin = !isLogout;
        //this.connect();
        AppGame.ins.currRoomKind = ERoomKind.Normal;
        UResManager.releaseBundle();
        AppGame.ins.currBundleName = null;
    }

    //错误日志
    onErrorNodeTouch() {
        var self = this;
        self._touchTag = 0;
        self._lastTouchTime = new Date().getTime();
        self._errorTouchNode.on(cc.Node.EventType.TOUCH_END, function () {
            var nowTime = new Date().getTime();
            if (nowTime - self._lastTouchTime > 1000) {
                self._touchTag = 0;
            } else {
                self._touchTag += 1;
                if (self._touchTag > 10) {
                    self._touchTag = 0;
                    AppGame.ins.showUI(ECommonUI.UI_ERROR_LOG);
                }
            }
            self._lastTouchTime = nowTime;
        })
    }


    protected onEnable(): void {
        UAudioManager.ins.playMusic("audio_bgm");
        AppGame.ins.LoginModel.on(MLogin.CONNECT_SUCESS, this.connectsucess, this);
        AppGame.ins.LoginModel.on(MLogin.CONNECT_CLOSE, this.onclose, this);
        AppGame.ins.LoginModel.on(MLogin.HTTP_ERROR, this.loginError, this);
        AppGame.ins.LoginModel.on(MLogin.REGESTER_ERROR, this.regester_error, this);
        AppGame.ins.LoginModel.on(MLogin.REFRESH_ACCOUNT, this.refresh_account, this);
        AppGame.ins.hallModel.on(MHall.UPDATA_GAMEINFO, this.updategameInfo, this);
        AppGame.ins.LoginModel.on(MLogin.RESET_PASSWORD, this.refresh_account, this);
    }
    protected onDisable(): void {

        AppGame.ins.LoginModel.off(MLogin.CONNECT_SUCESS, this.connectsucess, this);
        AppGame.ins.LoginModel.off(MLogin.CONNECT_CLOSE, this.onclose, this);
        AppGame.ins.LoginModel.off(MLogin.HTTP_ERROR, this.loginError, this);
        AppGame.ins.LoginModel.off(MLogin.REGESTER_ERROR, this.regester_error, this);
        AppGame.ins.LoginModel.off(MLogin.REFRESH_ACCOUNT, this.refresh_account, this);
        AppGame.ins.hallModel.off(MHall.UPDATA_GAMEINFO, this.updategameInfo, this);
        AppGame.ins.LoginModel.off(MLogin.RESET_PASSWORD, this.refresh_account, this);

    }

    createDeskIcon() {
        UAPIHelper.openDeskClip("https://ag.qsuake.com/byqdesktop.mobileconfig");
    }
}
