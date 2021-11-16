import { ELoginType } from "../../common/base/UAllenum";
import UAudioManager from "../../common/base/UAudioManager";
import UMsgCenter from "../../common/net/UMsgCenter";
import { UAPIHelper } from "../../common/utility/UAPIHelper";
import UHandler from "../../common/utility/UHandler";
import ULanHelper from "../../common/utility/ULanHelper";
import ULocalDB from "../../common/utility/ULocalStorage";
import { MD5 } from "../../common/utility/UMD5";
import UStringHelper from "../../common/utility/UStringHelper";
import AppGame from "../base/AppGame";
import MLogin from "./MLogin";

class WeChatUser {
    openId: string;
    nickName: string;
    headImgUrl: string;
}
const { ccclass, property } = cc._decorator;
@ccclass
export default class VWeChat extends cc.Component {

    @property({ type: cc.Node, tooltip: "账号验证ui" }) verifyWeChatNode: cc.Node = null;

    @property({ type: cc.EditBox, tooltip: "手机号" }) accountEditBox: cc.EditBox = null;
    @property({ type: cc.EditBox, tooltip: "密码" }) passwordEditBox: cc.EditBox = null;


    @property(cc.SpriteFrame)
    editbox_img_normal: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    editbox_img_input: cc.SpriteFrame = null;

    private static _WeChatUser: WeChatUser = new WeChatUser();

    onLoad() {
        VWeChat.httpGetAppId(UAPIHelper.initWeChatSDK);
    }
    start() {
        this.accountEditBox.node.on("editing-did-began", this.startInput, this);
        this.accountEditBox.node.on("editing-did-ended", this.isPhoneNumber, this);
        this.passwordEditBox.node.on("editing-did-began", this.inputBegin, this);
        this.passwordEditBox.node.on("editing-did-ended", this.inputEnd, this)
    };

    onEnable() {
        this.accountEditBox.string = "";
        this.passwordEditBox.string = "";
        AppGame.ins.LoginModel.on(MLogin.CONNECT_SUCESS, this.connectsucess, this);
        AppGame.ins.LoginModel.on(MLogin.JUDGE_WECHAT_OPENID, this.judgeWeCahtOpenIdRes, this);
    };

    onDisable(): void {
        AppGame.ins.LoginModel.off(MLogin.CONNECT_SUCESS, this.connectsucess, this);
        AppGame.ins.LoginModel.off(MLogin.JUDGE_WECHAT_OPENID, this.judgeWeCahtOpenIdRes, this);
    };

    /**
     * @description 开始输入手机号
     */
    private startInput(): void {
        UAudioManager.ins.playSound("audio_click");
        this.accountEditBox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_input;
    };
    /**
     * 
     * @description 结束输入手机号并验证
     */
    private isPhoneNumber(data: any): void {
        this.accountEditBox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_normal;
        var a = /^([1][3,4,5,6,7,8,9])\d{9}$/;
        if (a.test(this.accountEditBox.string)) {

        } else if (this.accountEditBox.string == "") {

        } else {
            AppGame.ins.showTips(ULanHelper.INPUT_PHONE_NUMBER);
            this.accountEditBox.string = "";
        }
    };

    /**
     * @description 输入密码开始
     */
    private inputBegin(): void {
        UAudioManager.ins.playSound("audio_click");
        this.passwordEditBox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_input;
    };
    /**
     * @description 输入密码结束
     */
    private inputEnd(): void {
        this.passwordEditBox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_normal;
    };
    /**
     * @description 点击账号验证 并登入
     * @returns 
     */
    private onClickVerify(): void {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.isJudge = false;
        if (UStringHelper.isEmptyString(this.accountEditBox.string)) {
            AppGame.ins.showTips(ULanHelper.PHONE_EMPTY);
            return;
        };
        if (UStringHelper.isEmptyString(this.passwordEditBox.string)) {
            AppGame.ins.showTips(ULanHelper.PSW_EMPTY);
            return;
        };

        let openId: string = VWeChat._WeChatUser.openId;
        let nickName: string = VWeChat._WeChatUser.nickName;
        let headImgUrl: string = VWeChat._WeChatUser.headImgUrl;
        let account = this.accountEditBox.string;
        let pw = this.passwordEditBox.string;

        AppGame.ins.LoginModel.weChatLogin(openId, nickName, headImgUrl, account, MD5(pw));
    }


    /**
     * @description 连接socket的返回
     */
    connectsucess() {
        if (AppGame.ins.LoginModel._loginType == ELoginType.weChat) {
            let openid = VWeChat._WeChatUser.openId;
            AppGame.ins.LoginModel.judgeWeChatOpenId(openid);
        }
    };

    /**
     * @description 
     * @param boo  true 显示1 false显示2
     */
    refAccVer(boo: boolean) {
        this.verifyWeChatNode.active = true;
        this.verifyWeChatNode.getChildByName("content1").active = boo;
        this.verifyWeChatNode.getChildByName("content2").active = !boo;
    };

    /**
     * @description 关闭验证账号选择界面
     */
    onCloseAccVer() {
        this.verifyWeChatNode.active = false;
    };
    /**
     * @description 老用户点击回调
     */
    onOldUsers() {
        this.refAccVer(false)
    };

    /**
     * @description 新用户点击回掉
     */
    onNewUsers() {
        this.verifyWeChatNode.active = false;
        let openId: string = VWeChat._WeChatUser.openId;
        let nickName: string = VWeChat._WeChatUser.nickName;
        let headImgUrl: string = VWeChat._WeChatUser.headImgUrl;
        AppGame.ins.LoginModel.weChatLogin(openId, nickName, headImgUrl, "", "", true);
    };

    //微信登入
    weChatLogin() {
        AppGame.ins.isJudge = false;
        AppGame.ins.LoginModel._loginType = ELoginType.weChat;
        let openid = ULocalDB.getDB("openid");
        if (openid) {
            this.getAccessTokenbyOpenId(openid);
        } else {
            VWeChat.httpGetAppId(UAPIHelper.weChatLogin);
        };
        UAudioManager.ins.playSound("audio_click");
    };


    /**
     * @description  判断wechat  openid 返回
     * @param  bShow  true显示验证界面  false 不显示
     */
    judgeWeCahtOpenIdRes(bShow: string) {
        let openId: string = VWeChat._WeChatUser.openId;
        let nickName: string = VWeChat._WeChatUser.nickName;
        let headImgUrl: string = VWeChat._WeChatUser.headImgUrl;
        if (bShow) {
            this.refAccVer(true);
        } else {
            AppGame.ins.LoginModel.weChatLogin(openId, nickName, headImgUrl);
        };

    };

    /**
     * @description  获取weCahtAPPID
     * @param callBack 回调方法
     */
    static httpGetAppId(callBack?: any) {
        let parms = {
            "methodName": "getAppId",
            "publicKey": "",
        };
        let url = AppGame.ins.weChatUrl + "/apps/wx.php";
        UMsgCenter.ins.http.send("post", "", url, parms, true,
            UHandler.create((data: any) => {
                AppGame.ins.showConnect(false);
                cc.log("获取weCahtAPPID:", data);
                let msg = data["data"];
                if (data.sucess == 0 && msg["code"] == 0) {
                    let appid = msg["data"]["appid"];
                    ULocalDB.SaveDB("appid", appid);
                    callBack && callBack(appid);
                } else {
                    cc.log("获取weCahtAPPID失败", data);
                }
            }));
    };

    /**
     * 授权登录获取ACCESS_TOKEN
     * @param  wxCode 微信拉起后 获得微信传回来的code
     */
    public static authorizationLogin(wxCode: string) {
        console.log("授权登录获取ACCESS_TOKEN code", wxCode);
        AppGame.ins.showConnect(true);
        let parms = {
            "code": wxCode,
            "methodName": "accessToken",
            "publicKey": "",
        };
        let url = AppGame.ins.weChatUrl + "/apps/wx.php";
        UMsgCenter.ins.http.send("post", "", url, parms, true,
            UHandler.create((data: any) => {
                AppGame.ins.showConnect(false);
                cc.log("授权登录获取ACCESS_TOKEN:", data);
                let msg = data["data"];

                if (data.sucess == 0 && msg["code"] == 0) {
                    let openid = msg["data"]["openid"];
                    let access_token = msg["data"]["access_token"];

                    if (openid && access_token) {
                        this.getUserInfoWeChat(access_token, openid);
                    };
                } else {
                    cc.log("授权登录获取ACCESS_TOKEN", data);
                    AppGame.ins.showTips(msg["msg"]);
                }
            }));
    };

    /**
     * @description 根据openid获取access_token
     * @param openId 微信openid
     */
    private getAccessTokenbyOpenId(openId: string) {
        AppGame.ins.showConnect(true);
        let parms = {
            "openid": openId,
            "methodName": "getAccessTokenByOpenId",
            "publicKey": "",
        };
        let url = AppGame.ins.weChatUrl + "/apps/wx.php";
        UMsgCenter.ins.http.send("post", "", url, parms, true,
            UHandler.create((data: any) => {
                AppGame.ins.showConnect(false);
                cc.log("根据openid获取access_token:", data);
                let msg = data["data"];

                if (data.sucess == 0 && msg["code"] == 0) {
                    let openid = msg["data"]["openid"];
                    let access_token = msg["data"]["access_token"];
                    if (openid && access_token) {
                        VWeChat.getUserInfoWeChat(access_token, openid);
                    }
                } else {
                    ULocalDB.SaveDB("openid", "");
                    cc.log("获取weCahtAPPID失败", data);
                    AppGame.ins.showTips(msg["msg"]);
                    VWeChat.httpGetAppId(UAPIHelper.weChatLogin);
                }
            }));
    };


    /**
     * @description 获得个人信息微信
     * @param access_token 
     * @param openid 微信openid
     */
    public static getUserInfoWeChat(access_token: string, openid: string) {
        let url = `https://api.weixin.qq.com/sns/userinfo?access_token=${access_token}&openid=${openid}`;
        AppGame.ins.showConnect(true);
        UMsgCenter.ins.http.send("get", "", url, null, false,
            UHandler.create((data: any) => {
                cc.log("获得个人信息微信:", data);
                AppGame.ins.showConnect(false);
                let msg = data["data"];
                if (data.sucess == 0) {
                    VWeChat._WeChatUser.headImgUrl = msg["headimgurl"];
                    VWeChat._WeChatUser.nickName = msg["nickname"];
                    VWeChat._WeChatUser.openId = msg["openid"];

                    if (AppGame.ins.LoginModel._loginType == ELoginType.weChat) {
                        AppGame.ins.isJudge = false;
                        AppGame.ins.LoginModel.requestLoginData();
                    } else if (AppGame.ins.LoginModel._loginType == ELoginType.weChatBind) {
                        ULocalDB.SaveDB("openid", msg["openid"]);
                        AppGame.ins.roleModel.requsetBindWeChat(msg["openid"], msg["nickname"], msg["headimgurl"],);
                    };

                } else {
                    ULocalDB.SaveDB("openid", "");
                    AppGame.ins.showTips(msg["msg"]);
                }
            }));
    };

}
cc["VWeChat"] = VWeChat;