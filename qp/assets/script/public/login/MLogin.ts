import Model from "../../common/base/Model";
import AppGame from "../base/AppGame";
import { ELevelType, ECommonUI, EAppStatus, EGameType, ELoginType } from "../../common/base/UAllenum";
import { Game, ProxyServer, HallServer } from "../../common/cmd/proto";
import UHandler from "../../common/utility/UHandler";
import UMsgCenter from "../../common/net/UMsgCenter";
import ULanHelper from "../../common/utility/ULanHelper";
import UPlatformHelper, { plateform_name } from "./UPlatformHelper";
import ULocalDB, { AccountInfo, ULocalStorage } from "../../common/utility/ULocalStorage";
import { UAccountItemData } from "./ULoginData";
import { MD5 } from "../../common/utility/UMD5";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import UStringHelper from "../../common/utility/UStringHelper";
import { LoginData, SysEvent } from "../../common/base/UAllClass";
import cfg_global from "../../config/cfg_global";
import UDebug from "../../common/utility/UDebug";
import { ZJH_SCALE } from "../../game/zjh/MZJH";
import { EVerifyCodeType } from "../hall/personal/RoleInfoClass";
import MRole from "../hall/lobby/MRole";
import RsaKey from "../../common/utility/RsaKey";
import NodeRSA = require("node-rsa");
import JSEncrypt from 'jsencrypt'
import { EventManager } from "../../common/utility/EventManager";
import cfg_event from "../../config/cfg_event";
import UDateHelper from "../../common/utility/UDateHelper";
import VLogin from "./VLogin";

const common = Game.Common;
const hallSunb = common.MESSAGE_CLIENT_TO_HALL_SUBID;

const enum ServerType {
    COMMON = "common",
    SPARE = "spare",
    LOCAL = "local",
}

/**
 * 创建：sq
 * 作用:登陆模块
 */
export default class MLogin extends Model {

    static CONNECT_SUCESS = "CONNECT_SUCESS";
    static CONNECT_CLOSE = "COONECT_CLOSE";
    static UPDATE_PING = "UPDATA_PING";
    static LOGIN_ERROR = "LOGIN_ERROR";
    static HTTP_ERROR = "HTTP_ERROR";
    static REGESTER_ERROR = "REGESTER_ERROR";
    static REFRESH_ACCOUNT = "REFRESH_ACCOUNT";
    static GET_VERIFYCODE = "GET_VERIFYCODE";
    static GET_IMG_VERIFYCODE = "GET_IMG_VERIFYCODE";// 获取图形验证码
    static BIND_MOBILE = "BIND_MOBILE";
    static RESET_PASSWORD = "RESET_PASSWORD";
    static REPEAT_LOGIN = "REPEAT_LOGIN";
    static REGISTRATION_SUCCESS = "REGISTRATION_SUCCESS";
    static JUDGE_WECHAT_OPENID = "JUDGE_WECHAT_OPENID";

    private _channelId: number;
    private overseasList: string[] = [];


    //登录的类型
    public _loginType: number = 1;

    get channelId(): number {
        return this._channelId;
    }
    private _gamePass: Uint8Array;
    /**
     * 登陆游戏用
     */
    get gamePass(): Uint8Array {
        return this._gamePass;
    }
    private _session = "123";
    /**
     * 游戏session
     */
    get session(): string {
        return this._session;
    }
    set session(str: string) {
        this._session = str;
    }
    /**ip */
    private _ip: string;
    /**api */
    private _api: string;
    /**端口 */
    private _port: number;
    private _ping: number;
    /**
     * 账号
     */
    private _accounts: Array<AccountInfo>;

    // serverType
    private _serverType: ServerType;
    /**
   * 上一次获取verifycode的时间
   */
    private _getVerifyCodeTime: number = 0; // 注册登录重置用
    /**上一次获取USDTverfycode时间 */
    private _getUsdtVerifyCodeTime: number = 0; // usdt用
    /**
     * 上次获得微信验证的时间
     */
    private _getWeChatVerifyCodeTime: number = 0; // 微信绑定用
    /**
     * 是否需要进行倒计时
     */
    private _isStartTickTime: boolean = true;
    /**
     * 登录的账号
     */
    private _tempaccouts: AccountInfo;



    private _loginData: LoginData;
    get LoginData(): LoginData {
        return this._loginData;
    }
    get getVerifyCodeTime(): number {
        return this._getVerifyCodeTime;
    }

    get getUsdtVerifyCodeTime(): number {
        return this._getUsdtVerifyCodeTime;
    }

    get getWeChatVerifyCodeTime(): number {
        return this._getWeChatVerifyCodeTime;
    }


    get isStartTickTime(): boolean {
        return this._isStartTickTime;
    }
    /**
     * 获取ping值
     */
    get ping(): number {
        return this._ping;
    }
    //#region 抽象类
    init(): void {
        UMsgCenter.ins.on("connect", this.connectcall, this);
        UMsgCenter.ins.on("close", this.disconnect, this);
        UMsgCenter.ins.on("ping", this.ping_pong, this);
        UMsgCenter.ins.on("error", this.connecterror, this);
        UMsgCenter.ins.regester(0, common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            hallSunb.CLIENT_TO_HALL_LOGIN_MESSAGE_RES,
            new UHandler(this.login_message_res, this));
        UMsgCenter.ins.regester(0, common.MAINID.MAIN_MESSAGE_CLIENT_TO_PROXY,
            common.MESSAGE_CLIENT_TO_PROXY_SUBID.PROXY_NOTIFY_SHUTDOWN_USER_CLIENT_MESSAGE_NOTIFY,
            new UHandler(this.shutdown_user_client_message_req, this));
        UMsgCenter.ins.regester(0, common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            hallSunb.CLIENT_TO_HALL_REGISTER_MESSAGE_RES,
            new UHandler(this.register_message_res, this));
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MOBILE_VERIFY_CODE_MESSAGE_RES,
            new UHandler(this.get_mobile_verify_code_message_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_MOBILE_MESSAGE_RES,
            new UHandler(this.bind_mobile_message_res, this));
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TWO_VERIFY_CODE_IMG_MESSAGE_RES,
            new UHandler(this.get_two_verify_code_img_message_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_RESET_PASSWORD_MESSAGE_RES,
            new UHandler(this.reset_password_message_res, this));
        this._accounts = ULocalDB.getDB("accounts");

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_PROXY,
            Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.CLIENT_TO_PROXY_GET_AES_KEY_MESSAGE_RES
            , new UHandler(this.getAesKey, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            hallSunb.CLIENT_TO_HALL_CHECK_OPENID_MESSAGE_RES
            , new UHandler(this.judgeWeChatOpenIdRes, this));

        //初始化海外服务器列表
        for (let i = 0; i < cfg_global.overseasUrl.length; i++) {
            this.overseasList.push(cfg_global.overseasUrl[i]);
        }
    }

    resetData(): void {

    }
    update(dt: number): void {

    }
    //#endregion
    //#region 消息处理

    private reset_password_message_res(caller: HallServer.ResetPasswordMessageResponse): void {
        if (caller.retCode == 0) {
            AppGame.ins.showTips(ULanHelper.CHANGE_PASSWORD_SUCCESS);
            this.saveAccount(caller.userId, caller.mobileNum, caller.password);
            this.emit(MLogin.RESET_PASSWORD, true, "");
        } else {
            this.emit(MLogin.RESET_PASSWORD, false, caller.errorMsg);
        }
    }
    private bind_mobile_message_res(caller: HallServer.BindMobileMessageResponse): void {
        if (caller.retCode == 0) {
            this.saveAccount(caller.userId, caller.mobileNum, caller.password);
            AppGame.ins.roleModel.savemobile(caller.mobileNum);
            AppGame.ins.roleModel.saveGold(caller.score);
            if (caller.rewardScore > 0) {
                ULocalStorage.saveItem("RegRewardScore", caller.rewardScore);
                if (AppGame.ins.appStatus.status != EAppStatus.Login) {
                    cc.systemEvent.emit(SysEvent.SHOW_AWARDS, caller.rewardScore, `恭喜收到注册奖励${caller.rewardScore * ZJH_SCALE}金币`);
                } else {
                    // AppGame.ins.LoginModel.accountlogin(caller.mobileNum,caller.password);
                }
            }
            this.emit(MLogin.BIND_MOBILE, true, ULanHelper.BIND_MOBILE_SUCESS);
            AppGame.ins.roleModel.emit(MRole.CLOSE_REGISTER, null);
        } else {
            this.emit(MLogin.BIND_MOBILE, false, caller.errorMsg);
        }
    }
    private get_mobile_verify_code_message_res(caller: Game.Common.GetVerifyCodeMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this._isStartTickTime = true;
            this.emit(MLogin.GET_VERIFYCODE, true, "");
        } else {
            this._isStartTickTime = false;
            this.emit(MLogin.GET_VERIFYCODE, false, caller.errorMsg);
        }
    }

    private get_two_verify_code_img_message_res(caller: Game.Common.GetTwoVerifyCodeImgMessageResponse): void {
        if (caller.retCode == 0) {
            let callerStr = JSON.stringify(caller);
            let callerJson = JSON.parse(callerStr);
            // JSON.parse
            // UDebug.Log("获取图形验证码成功->callerJson="+callerJson);
            if (callerJson.verifyCodeImg && callerJson.verifyCodeImg.length > 0)
                this.emit(MLogin.GET_IMG_VERIFYCODE, true, callerJson.verifyCodeImg[0]);
        } else {
            UDebug.Log("获取图形验证码失败-->");
        }
    }

    private ping_pong(ping: number): void {
        this._ping = ping;
        this.emit(MLogin.UPDATE_PING, ping);
    }
    /**
     * 断开连接,客户端主动关闭不会触发
     * 
     */
    private disconnect(): void {
        this.emit(MLogin.CONNECT_CLOSE);
    }

    /**
     * 连接失败，客户端主动关闭不会触发
     */
    private connecterror(): void {
    }

    /**
     * socket连接成功回调
     */
    private connectcall(): void {
        if (AppGame.ins.isJudge) {
            AppGame.ins.showConnect(false);
        }
        if (cfg_global.isencrypt) {
            AppGame.ins.generateAesKey(this.rsaCallback);
        } else {
            this.emit(MLogin.CONNECT_SUCESS);
        }
    }

    rsaCallback() {
        let data = new ProxyServer.Message.GetAESKeyMessage();
        data.pubKey = new RsaKey().stringToUint8Array(AppGame.ins._localRsaKey.aesKey);
        UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_PROXY, Game.Common.MESSAGE_CLIENT_TO_PROXY_SUBID.CLIENT_TO_PROXY_GET_AES_KEY_MESSAGE_REQ, data)
    }

    private addAcount(userId: number, mobile: string, psw: string, isuse: boolean, truePsw: string = "") {
        this._accounts = []
        var account = this.getAccount((ac: AccountInfo) => {
            if (ac.userId == userId || ac.mobilenum == mobile) {
                return true;
            }
            return false;
        });
        if (!account) {
            account = new AccountInfo();
            this._accounts.forEach(element => {
                element.value = false;
            });

            this._accounts.push(account);
        } else {
            var index = this._accounts.findIndex(item => (item.userId == userId || item.mobilenum == mobile));
            this._accounts.splice(index, 1)
            account = new AccountInfo();
            this._accounts.forEach(element => {
                element.value = false;
            });
            this._accounts.push(account);
        }
        account.value = isuse;
        account.mobilenum = mobile;
        account.psw = psw;
        account.userId = userId;
        account.truePsw = truePsw == "" ? (this._tempaccouts ? this._tempaccouts.truePsw : "") : truePsw;
        this.saveData();
    }
    /**保存账号信息 */
    private saveAccount(userId: number, mobile: string, psd: string): void {
        var account = this.getAccount((a: AccountInfo) => {
            if (a.userId == userId || a.mobilenum == mobile) {
                return true;
            }
            return false;
        });
        if (account) {
            var index = this._accounts.findIndex(item => (item.userId == userId || item.mobilenum == mobile));
            this._accounts.splice(index, 1)
            account.mobilenum = mobile;
            account.truePsw = this._tempaccouts ? this._tempaccouts.truePsw : "";
            account.psw = psd;
            this.addAcount(userId, mobile, psd, true);
            this.saveData();
        } else {
            this.addAcount(userId, mobile, psd, true);
        }
    }
    /**
     * 根据条件获取账号
     * 
     * @param condition 
     * @param lastSuccessLogin 最后成功登陆的账号 
     */
    getAccount(condition: Function, lastSuccessLogin?: number): AccountInfo {
        if (this._accounts && this._accounts.length > 0) {
            let len = this._accounts.length;
            if (len > 0 && lastSuccessLogin == 1) {
                condition(this._accounts[len - 1])
                return this._accounts[len - 1];
            }
            for (let index = 0; index < len; index++) {
                let element = this._accounts[index];
                if (condition(element)) {
                    return element;
                }
            }
        }
        return null;
    }
    /**
     * 获取userId的 idx
     * @param userId 
     */
    private getAccountIdx(userId: number): number {
        let len = this._accounts.length;
        for (let index = 0; index < len; index++) {
            let element = this._accounts[index];
            if (element.userId == userId) {
                return index;
            }
        }
        return -1;
    }

    /**
     * 创建账号
     */
    createAccount(openId: string = "", nickName: string = "", headImgUrl: string = "", mobileNum: string = "", password: string = "", verifyCode: string = ""): void {
        var regester = HallServer.RegisterMessage.create();
        var plate = UPlatformHelper.getPlateForm();
        UDebug.Log("创建账号plate" + plate);
        UDebug.Log("plate.machineType:" + plate.machineType);
        UDebug.Log("plate.machineSerial:" + plate.machineSerial);
        UDebug.Log("plate.emulator:" + plate.emulator);
        UDebug.Log("plate.osType:" + plate.osType);
        UDebug.Log("plate.channelId:" + plate.channelId);
        UDebug.Log("plate.platformId:" + plate.platformId);
        regester.channelId = plate.channelId;
        regester.emulator = plate.emulator;
        regester.inviterId = 0;
        regester.machineSerial = plate.machineSerial;
        regester.machineType = plate.machineType;
        regester.osType = plate.osType;
        regester.platformId = plate.platformId;
        regester.openId = openId;
        regester.nickName = nickName;
        regester.headImgUrl = headImgUrl;
        regester.mobileNum = mobileNum;
        regester.password = password;
        regester.verifyCode = verifyCode;
        this._tempaccouts = new AccountInfo();
        this._tempaccouts.mobilenum = mobileNum;
        this._tempaccouts.psw = password;
        this._tempaccouts.truePsw = password;
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            // regester.inviterId  = parseInt(UAPIHelper.getDelegateID()); 
            if (UAPIHelper.readCliboad() && UAPIHelper.readCliboad() != "") {
                if (UAPIHelper.readCliboad().slice(0, 4) == "&8#@") {
                    regester.inviterId = parseInt(UAPIHelper.readCliboad().slice(4));
                } else {
                    regester.inviterId = 0;
                }
            } else {
                regester.inviterId = 0;
            }
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            if (UAPIHelper.readCliboad() && UAPIHelper.readCliboad() != "") {
                if (UAPIHelper.readCliboad().slice(0, 4) == "&8#@") {
                    regester.inviterId = parseInt(UAPIHelper.readCliboad().slice(4));
                } else {
                    regester.inviterId = 0;
                }
            } else {
                regester.inviterId = 0;
            }
        }
        // regester.inviterId = 13791240;
        UMsgCenter.ins.sendPkg(0, common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL, hallSunb.CLIENT_TO_HALL_REGISTER_MESSAGE_REQ, regester);
        AppGame.ins.showConnect(true);
    }
    /**
     * 注册账号消息回调
     * @param caller 
     */
    private register_message_res(caller: HallServer.RegisterMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.addAcount(caller.userId, caller.mobileNum, caller.password, true);
            this.loginResult(caller.registerRetInfo);
            // this.emit(MLogin.REGISTRATION_SUCCESS);
            //this.fastLogin(caller.userId);
        } else {
            if (caller.retCode == 1) {   //账号已经注册
                if (caller.userId != "" && caller.password != "") {
                    this.addAcount(caller.userId, caller.mobileNum, caller.password, true);
                    AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                        data: caller.errorMsg + "ID:" + caller.userId, type: 1, handler: UHandler.create(() => {
                        }, this)
                    });
                    // this.login(caller.userId, caller.mobileNum, caller.password);
                } else if (caller.mobileNum != "" && caller.password != "") {
                    this.addAcount(caller.userId, caller.mobileNum, caller.password, true);
                    AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                        data: caller.errorMsg + "手机:" + caller.mobileNum, type: 1, handler: UHandler.create(() => {
                        }, this)
                    });
                } else {
                    AppGame.ins.showTips(caller.errorMsg);
                }

            } else {
                this.emit(MLogin.REGESTER_ERROR, caller.errorMsg);
            }
        }
    }
    /**
     * 重复登陆消息回调
     * @param caller 
     */
    private shutdown_user_client_message_req(caller: ProxyServer.Message.ProxyNotifyShutDownUserClientMessage): void {
        // UMsgCenter.ins.closepeer();
        // AppGame.ins.showUI(ECommonUI.MsgBox, {
        //     data: ULanHelper.LOGIN_REPEAT, type: 1, handler: UHandler.create(() => {
        //         AppGame.ins.exitGame();
        //     }, this)
        // });
        this.emit(MLogin.REPEAT_LOGIN);
    }
    /**
     * 登陆消息回调
     * @param caller 
     */
    private login_message_res(caller: HallServer.LoginMessageResponse): void {
        if (caller.retCode == 0) {
            this.loginResult(caller.loginRetInfo);
            let loginRetInfo = caller.loginRetInfo;
            if (this._tempaccouts || loginRetInfo["mobileNum"]) {
                this.addAcount(loginRetInfo["userId"], loginRetInfo["mobileNum"], this._tempaccouts.psw, true);
                this._tempaccouts = null;
            }
        } else {
            this._tempaccouts = null;
            AppGame.ins.showConnect(false);
            this.emit(MLogin.LOGIN_ERROR, caller.errorMsg);
        }
    }
    private loginResult(loginRetInfo: any): void {
        AppGame.ins.roleModel.saveRoleinfo(loginRetInfo);
        EventManager.getInstance().raiseEvent(cfg_event.INIT_CHATDB);
        EventManager.getInstance().raiseEvent(cfg_event.LOGIN_YUNXIN);
        /**登陆成功之后发送心跳包 */
        UMsgCenter.ins.startHeart(this.session);
        /**请求 */
        AppGame.ins.hallModel.requestGameHallMessage();
        this._gamePass = loginRetInfo.gamePass;
        //保存VIP信息
        if (loginRetInfo.vipLevel > 0) {
            AppGame.ins.vipLevel = loginRetInfo.vipLevel;
            var vipObj = {
                level: loginRetInfo.vipLevel,
                aesKey: loginRetInfo.aes
            }
            ULocalStorage.saveItem("VIP", vipObj);
        }
        //保存接口配置信息
        ULocalStorage.saveItem("API_CONFIG_INFO", AppGame.ins.apiConfigData)
    }
    /**
     * 登陆
     * @param account 
     * @param psw 
     * @param isUserId 
     */
    private login(account: any, mobile: string, psw: string, openId: string = "", nickName: string = "", headImgUrl: string = ""): void {
        UDebug.Log(`账号登陆......账号：${account}.....手机号：${mobile}.......密码:${psw}`);
        AppGame.ins.showConnect(true, 2);
        var plate = UPlatformHelper.getPlateForm();
        let login = HallServer.LoginMessage.create();
        login.mobile = mobile.toString();
        login.userId = mobile == "" ? account : -1;
        login.password = psw;
        login.channelId = plate.channelId;
        login.emulator = plate.emulator;
        login.machineSerial = plate.machineSerial;
        login.machineType = plate.machineType;
        login.osType = plate.osType;
        login.platformId = plate.platformId;
        login.openId = openId;
        login.nickName = nickName;
        login.headImgUrl = headImgUrl;
        this._channelId = plate.channelId;
        UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            hallSunb.CLIENT_TO_HALL_LOGIN_MESSAGE_REQ, login);
    }

    /**
     * 自动登录
     */
    autoLogin(): void {
        AppGame.ins.showConnect(true, 2);
        /**没有可用于登陆的账号 那么先走创建账号流程 */
        if (!this._accounts || this._accounts.length == 0) {
            this.createAccount();
        } else {
            /**获取当前使用的账号 直接登陆 */
            let acinfo = this.getAccount((ac: AccountInfo) => {
                return ac.value;
            });
            this.fastLogin(acinfo.userId, acinfo.mobilenum);
        }
    }


    /**
     * 请求登录信息
     */
    requestLoginData(): void {
        //初始化
        var ip = "";
        var port = 0;
        //释放上次全部失败情况下队列里面其它连接
        UMsgCenter.ins._connectOk = false
        for (let k in UMsgCenter.ins._peerList) {
            let item = UMsgCenter.ins._peerList[k];
            if (item != null && item.close != null) {
                item.close()
            }
            UMsgCenter.ins._peerList[k] = null
        }
        UMsgCenter.ins._peerList = []
        UMsgCenter.ins._connectErrorCount = 0

        let localIps = cfg_global.ips;
        //用户输入IP地址,供调试用
        if (cfg_global.isUseInputServer) {
            this._serverType = ServerType.LOCAL;
            let ip = AppGame.ins.editboxserver.string.split(":")[0];
            let port = parseInt(AppGame.ins.editboxserver.string.split(":")[1]);
            this.connectSocket(ip, port, "");
            return;
        }

        //使用本地固定IP
        if (cfg_global.isUseLocalServer) {
            this._serverType = ServerType.LOCAL;
            let ip = localIps[0].split(":")[0];
            let port = parseInt(localIps[0].split(":")[1]);
            this.connectSocket(ip, port, "");
            return;
        }

        //国内线路
        if (cfg_global.isOverseas) {
            for (var i = 0; i < AppGame.ins.serverList.length; i++) {
                ip = AppGame.ins.serverList[i]["server"].ip
                port = AppGame.ins.serverList[i]["server"].port
                this.connectSocket(ip, port, "")
            }
        }
        //海外线路
        else {
            for (let i = 0; i < this.overseasList.length; i++) {
                ip = this.overseasList[i].split(":")[0];
                port = parseInt(this.overseasList[i].split(":")[1]);
                let serverObj = {
                    key: "outServer",
                    server: { ip: ip, port: port },
                }
                AppGame.ins.selectServer = serverObj;
                this.connectSocket(ip, port, "");
            }
            UDebug.log("连接海外服务器");
        }
    }


    /**
     * 登陆成功 跳转场景
     */
    loginSucess(value: boolean): void {
        AppGame.ins.showConnect(false);
        if (value) AppGame.ins.loadLevel(ELevelType.Hall);
    }
    /**
     * 账号密码登陆
     */
    accountlogin(account: string, psw: string, truePsw: string = ""): void {
        this._tempaccouts = new AccountInfo();
        psw = psw;
        this._tempaccouts.mobilenum = account;
        this._tempaccouts.userId = -1;
        this._tempaccouts.psw = psw;
        this._tempaccouts.truePsw = truePsw;
        this.login(-1, account, psw);
    }
    /**
     * 快速登陆
     * @param userId 登陆的玩家账号id
     */
    fastLogin(userId: number, mobile: string, truePsw: string = ""): void {
        var accountInfo = this.getAccount((ac: AccountInfo) => {
            if (ac.userId == userId || ac.mobilenum == mobile) return true;
            return false;
        });
        this._tempaccouts = new AccountInfo();
        this._tempaccouts.mobilenum = accountInfo.mobilenum;
        this._tempaccouts.psw = accountInfo.psw;
        this._tempaccouts.userId = accountInfo.userId;
        this._tempaccouts.truePsw = truePsw;

        this.login(accountInfo.userId, accountInfo.mobilenum, accountInfo.psw);
    }
    /**
     * @description 微信登入
     */
    weChatLogin(openId: string, nickName: string, headImgUrl: string, account: string = "", psw: string = "", isFast: boolean = false, truePsw: string = "") {
        this._tempaccouts = new AccountInfo();
        if (isFast) {
            this.createAccount(openId, nickName, headImgUrl);
            return
        };

        if (account == "" || psw == "") {
            /**获取当前使用的账号 直接登陆 */
            let acinfo = this.getAccount((ac: AccountInfo) => {
                return ac.value;
            });
            let userId = acinfo.userId;
            let mobile = acinfo.mobilenum;
            var accountInfo = this.getAccount((ac: AccountInfo) => {
                if (ac.userId == userId || ac.mobilenum == mobile) return true;
                return false;
            });
            psw = accountInfo.psw;
            userId = accountInfo.userId;
            account = accountInfo.mobilenum;
        }
        account = account;
        psw = psw;
        this._tempaccouts.mobilenum = account;
        this._tempaccouts.userId = -1;
        this._tempaccouts.psw = psw;
        this._tempaccouts.truePsw = truePsw;
        this.login(this._tempaccouts.userId, account, psw, openId, nickName, headImgUrl);
    };
    /**
     * @description 校验微信openid
     * @param openId 
     */
    judgeWeChatOpenId(openId: string) {
        AppGame.ins.showConnect(true);
        let _CheckOpenIdMessage = HallServer.CheckOpenIdMessage.create();
        _CheckOpenIdMessage.openId = openId;
        UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_CHECK_OPENID_MESSAGE_REQ, _CheckOpenIdMessage);

    };

    /**
     * @description  微信openid校验返回
     * @param caller 
     */
    judgeWeChatOpenIdRes(caller: HallServer.CheckOpenIdMessageResponse) {
        AppGame.ins.showConnect(false);
        let retCode = caller.retCode;
        if (retCode == 0) {
            let bShow = caller.bShow;
            let openid = ULocalDB.getDB("openid");
            if (!this._accounts || this._accounts.length == 0 || !openid) {
                bShow = true;
            }
            this.emit(MLogin.JUDGE_WECHAT_OPENID, bShow);
        } else {
            this.emit(MLogin.LOGIN_ERROR, caller.errorMsg);
            AppGame.ins.showTips(caller.errorMsg);
        }

    };


    /**
     * 连接socket
     * @param ip 
     * @param port 
     */
    connectSocket(ip: string, port: number, api: string): void {
        this._ip = ip;
        this._port = port;
        this._api = api;
        this.connect();
    }
    /**ws 连接 */
    connect(): void {
        AppGame.ins.showConnect(true);
        UMsgCenter.ins.connect(this._ip, this._port);
    }

    /**
     * 删除本地存储的账号
     * @param userId 
     */
    deleteDbAccount(userId): number {
        let len = this._accounts.length;
        if (len <= 1) {
            return 1;//至少有一个保存的账号
        }
        let idx = this.getAccountIdx(userId);
        if (idx > -1) {

            this._accounts.splice(idx, 1);
            this._accounts[0].value = true;
            this.saveData();
            this.emit(MLogin.REFRESH_ACCOUNT);

        } else {
            return 2;//没有该账号
        }
    }
    /**
     * 切换当前选中的账号
     * @param userId 
     */
    selectUserId(userId): void {
        let len = this._accounts.length;
        for (let i = 0; i < len; i++) {
            let element = this._accounts[i];
            if (element.userId == userId) {
                element.value = true;
            } else {
                element.value = false;
            }
        }
        this.emit(MLogin.REFRESH_ACCOUNT);
    }
    /**
   * 绑定电话 修改密码
   * @param mobileNum 
   * @param verifyCode 
   * @param psd  
   */
    requestbindMobile(mobileNum: string, verifyCode: string, psd: string, ostype: number): void {
        var data = new HallServer.BindMobileMessage();
        data.userId = AppGame.ins.roleModel.useId;
        data.mobileNum = mobileNum;
        data.verifyCode = verifyCode;
        data.password = MD5(psd);
        data.osType = ostype;
        this._tempaccouts = new AccountInfo();
        this._tempaccouts.mobilenum = mobileNum;
        this._tempaccouts.truePsw = psd;
        UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BIND_MOBILE_MESSAGE_REQ
            , data);
    }

    /**获取图形验证码 */
    requestVerifycodeImageMsg(phoneNum: string): void {
        var data = new Game.Common.GetTwoVerifyCodeImgMessage();
        data.userId = AppGame.ins.roleModel.useId;
        data.mobileNum = phoneNum;
        UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_TWO_VERIFY_CODE_IMG_MESSAGE_REQ
            , data);
    }

    /**获取手机验证码 */
    requestgetverifycode(mobileNum: string, type: number, verifycodeImgCode: string): void {
        let time = (new Date()).getTime();
        // if (time - this._getVerifyCodeTime > 60000) {/**60秒后可以重新请求*/
        if (time - this._getVerifyCodeTime > 3000) {/**3秒后可以重新请求*/
            AppGame.ins.showConnect(true);
            if (type == EVerifyCodeType.VERIFYCODE_REGISTERMOBILE || type == EVerifyCodeType.VERIFYCODE_RESETPASSWORD) {
                this._getVerifyCodeTime = time;
            } else if (type == EVerifyCodeType.VERIFYCODE_BINDUSDT) {
                this._getUsdtVerifyCodeTime = time;
            } else if (type == EVerifyCodeType.VERIFYCODE_BIND_WECHAT) {
                this._getWeChatVerifyCodeTime = time;
            }
            var data = new Game.Common.GetVerifyCodeMessage();
            data.mobileNum = mobileNum;
            data.type = type;
            data.userId = AppGame.ins.roleModel.useId;
            data.verifycodeImgCode = verifycodeImgCode;
            UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
                Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MOBILE_VERIFY_CODE_MESSAGE_REQ
                , data);
        }
    }
    /**
     * 请求重置密码
     * @param newPsd 
     */
    requestResetPsd(mobileNum: string, verifyCode: string, psd: string): void {
        var data = new HallServer.ResetPasswordMessage();
        data.mobileNum = mobileNum;
        data.password = MD5(psd);
        data.userId = AppGame.ins.roleModel.useId;
        data.verifyCode = verifyCode;
        this._tempaccouts = new AccountInfo();
        this._tempaccouts.mobilenum = mobileNum;
        this._tempaccouts.truePsw = psd;
        UMsgCenter.ins.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_RESET_PASSWORD_MESSAGE_REQ
            , data);
    }
    /**
     * 获取本地存储的账号信息
     */
    getAccountInfo(): Array<UAccountItemData> {
        let data = new Array<UAccountItemData>();
        let len = this._accounts.length;
        for (let i = 0; i < len; i++) {
            const element = this._accounts[i];
            let dt = new UAccountItemData();
            dt.current = element.value;
            dt.userId = element.userId;
            dt.mobile = element.mobilenum;
            data.push(dt);
        }
        return data;
    }
    private saveData(): void {
        ULocalDB.SaveDB("accounts", this._accounts);
    }

    getAesKey(data: ProxyServer.Message.GetAESKeyMessageResponse) {
        AppGame.ins.commonAesKey = data.aesKey;
        this.emit(MLogin.CONNECT_SUCESS);
    }

}
