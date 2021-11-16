import AppGame from "../../public/base/AppGame";
import ErrorLogUtil, { LogLevelType } from "../../public/errorlog/ErrorLogUtil";
import { SysEvent } from "../base/UAllClass";
import UDebug from "./UDebug";
import { ECommonUI } from "../base/UAllenum";
import UHandler from "./UHandler";
import { roomInfo } from "../../config/cfg_game";
import VWeChat from "../../public/login/VWeChat";

/**
 * api帮助类
 */
export class UAPIHelper {


    static GetServerMsgCallBack(sucess: boolean, content: string): void {
        cc.systemEvent.emit(SysEvent.GET_SERVERLIST_CALLBACK, sucess.toString() == "true", content);
    }
    /**初始化sdk */
    static initSDK(visiterId: string, visiterName: string, avatar: string, bid: string): void {
        if (!CC_JSB) return;
        if (cc.sys.OS_ANDROID == cc.sys.os) {
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod('JSCBridge', 'initWith:visiterName:avatar:businessId:', visiterId, visiterName, avatar, bid);
        }
    }
    /**
     * 
     * @param bid 商户id
     * @param vid 用户id
     * @param nickname 用户名字
     */
    static OpenCustomerServiceList(bid: string, vid: string, nickname: string): void {
        var data = { bid: bid, vid: vid, nickname: nickname };
        if (CC_JSB) {
            if (cc.sys.OS_ANDROID == cc.sys.os) {
                jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "OpenCustomerServiceList", '(Ljava/lang/String;)V', JSON.stringify(data));
            } else if (cc.sys.OS_IOS == cc.sys.os) {
                jsb.reflection.callStaticMethod('JSCBridge', 'showChatListView');
            }
        }
    }

    //复制功能  写入
    static onCopyClicked(str: string): void {

        if (cc.sys.os == cc.sys.OS_ANDROID) {
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "JavaCopy", "(Ljava/lang/String;)V", str);
        }
        if (cc.sys.isBrowser) {
            var textArea: any = null;
            textArea = document.getElementById("clipBoard");
            if (textArea === null) {
                textArea = document.createElement("textarea");
                textArea.id = "clipBoard";
                textArea.textContent = str;
                document.body.appendChild(textArea);
            }
            textArea.select();
            try {
                const msg = document.execCommand('copy') ? 'successful' : 'unsuccessful';
                UDebug.log("已经复制到剪贴板");
                document.body.removeChild(textArea);
            } catch (err) {
                UDebug.log("复制到剪贴板失败");
                ErrorLogUtil.ins.addErrorLog("复制到剪贴板失败 = " + err, LogLevelType.ERROR);
            }
        }
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod('JSCBridge', 'writeboard:', str);
        }
    }

    /**
    *打开详细信息
    * @param serviceid 客服id
    * @param serviceName 客服名字
    * @param bid 商户id
    * @param vid 用户id
    * @param vname 用户名字
    * @param avatar 客服头像id
    */
    static OpenMessageDetail(serviceid: string, serviceName: string, bid: string, vid: string, vname: string, avatar: string): void {
        if (!CC_JSB) return;
        var data = { serviceid: serviceid, serviceName: serviceName, bid: bid, vid: vid, vname: vname, avatar: avatar };
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "OpenMessageDetail", '(Ljava/lang/String;)V', JSON.stringify(data));
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            UDebug.log(serviceid + "    " + serviceName + "   " + avatar);
            jsb.reflection.callStaticMethod('JSCBridge', 'showChatView:businessName:avatar:', serviceid, serviceName, avatar);
        }
    }
    /**
     * 获取ServerList
     */
    static GetServerPayList(bid: string): void {
        if (!CC_JSB) return;
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "GetServerPayList", '(Ljava/lang/String;)V', bid);
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('JSCBridge', 'getServiceList:', bid);
        }
    }
    /**
     * 获取渠道ID
     */
    static getPlatformId(): string {
        if (!CC_JSB) return "";
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "GetPlatformId", '()Ljava/lang/String;');
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('JSCBridge', 'getPlatformId');
        }
    }
    /**
     * 获取总代理ID
     */
    static getChannleId(): string {
        if (!CC_JSB) return "";
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "GetChannelId", '()Ljava/lang/String;');
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('JSCBridge', 'getChannelId');
        }
    }
    /**
     * 写剪切板
     */
    static writeCliboad(content: string): string {
        if (!CC_JSB) return "false";
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "writeClipboard", '(Ljava/lang/String;)Ljava/lang/String;', content);
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('JSCBridge', 'writeboard:', content);
        }
        return "false";
    }
    /**
     * 都剪切板
     */
    static readCliboad(): string {
        if (!CC_JSB) return "0";
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "readClipboard", '()Ljava/lang/String;');
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('JSCBridge', 'readboard');
        }
        return "0";
    }
    /**
     * 是否为模拟器
     */
    static isEmulator(): number {
        if (!CC_JSB) return 0;
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            // return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "GetIsEmulator", '()Ljava/lang/String;');
            return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "GetIsEmulatorByLib", '()Ljava/lang/String;');
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('JSCBridge', 'getIsEmulator');
        }
        return 1;
    }
    /**
     * 获取设备唯一ID
     */
    static getDeviceId(): string {
        if (!CC_JSB) return "0";
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "GetDeviceId", '()Ljava/lang/String;');
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('JSCBridge', 'getUUID');
        }
        return "";
    }
    /**
     * 打开QQ
     * @param qq 
     */
    static openQQ(qq: string): string {
        if (!CC_JSB) return "1";
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "OpenQQ", '(Ljava/lang/String;)Ljava/lang/String;', qq);
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('JSCBridge', 'openQQ:', qq);
        }
        return "1";
    }

    /**
     * 打开微信
     */
    static openWechat() {
        if (cc.sys.OS_IOS == cc.sys.os) {
            let v = jsb.reflection.callStaticMethod('JSCBridge', 'openWechat:', "");
            if (v == 1) {
                AppGame.ins.showTips('未安装微信');
            }
        } else if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', 'OpenWX', "()V");
        }
    }

    /**
    * 读取渠道号
    */
    static readChannel() {
        if (cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('JSCBridge', 'readChannel:', "");
        } else if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "GetDelegateID", '()Ljava/lang/String;');
        }
    }

    /**
    * 读取其他参数
    */
     static readElseStr() {
        if (cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('JSCBridge', 'readElseStr:', "");
        } else if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "readElseStr", '()Ljava/lang/String;');
        }
    }

    /**
     * @description 微信登入
     */
    static weChatLogin(appid: string) {
        UDebug.log("点击微信登入",appid);
        if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod("AppController" , "sendAuthRequest:",appid);
        } else if (cc.sys.OS_ANDROID == cc.sys.os) {
            var o = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/wechat/WechatMain", "login", '(Ljava/lang/String;)V', appid)
        };

    };

    /**
     * @description  初始化微信sdk
     * @param 
     */
    static initWeChatSDK(appid: string) {
        UDebug.log("初始化微信sdk" ,appid);
        if (cc.sys.OS_IOS == cc.sys.os) {
            let v = jsb.reflection.callStaticMethod('AppController', 'registerWeChat:', appid);
        } else if (cc.sys.OS_ANDROID == cc.sys.os) {
            var o = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/wechat/WechatMain", "initSDK", '(Ljava/lang/String;)V', appid)
        };

    }

    /**
     * 返回第三方拉取APP的参数
     */
    static returnOption(): number {
        let roomId = 0;
        if (cc.sys.os == cc.sys.OS_IOS) {
            roomId = Number(jsb.reflection.callStaticMethod("AppController", "optionsValue:", null));
        } else if (cc.sys.os == cc.sys.OS_ANDROID) {
            let tmpStr = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "getRoomInfo", "()Ljava/lang/String;");
            roomId = Number(tmpStr.split("roomid=")[1]);
        }
        UDebug.log('第三方拉取APP传回的参数 roomid => ', roomId);
        //TODO
        return roomId;
    }

    /**
     * 获取手机型号(安卓的是手机品牌厂商)
     */
    static getSystemModel(): string {
        if (!CC_JSB) return "";
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "GetSystemModel", '()Ljava/lang/String;');
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('JSCBridge', 'GetSystemModel');
        }
        return "";
    }

    /**
     * 获取手机型号(安卓)
     */
    static getSystemModelAndroid(): string {
        if (!CC_JSB) return "";
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "GetSystemModelReal", '()Ljava/lang/String;');
        }
        return "";
    }


    /**
     * 获取系统类型
     */
    static getOsType(): string {
        if (!CC_JSB) return "";
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "GetSystemVersion", '()Ljava/lang/String;');
        }else if (cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('JSCBridge', 'GetSystemVersion');
        }
        return "";
    }
    
    /**
     * 获取代理ID  安卓
     * @param account 
     * @param token 
     */
    static getDelegateID(): string {
        return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "GetDelegateID", '()Ljava/lang/String;');
    }

    /**
     * 初始化云信
     */
    static initYunxin(account: string, token: string) {
        if (!CC_JSB) return "";
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            let params = {
                "account": account,
                "token": token,
            }
            return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "InitYunxinWithAccount", '(Ljava/lang/String;)V', JSON.stringify(params));
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('RootViewController', 'InitYunxinWithAccount:withToken:', account, token);
        }
        return "";
    }

    /**
     * 注销登录
     * @param sendText 
     */
    static logout() {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "Logout", '()Ljava/lang/String;');
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod('RootViewController', 'Logout', "");
        }
    }

    /**
     * UAPIHelper.sendText();
        UAPIHelper.sendPicture()
     */
    static sendText(sendText: string) {
        if (!CC_JSB) return "";
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "SendText", '(Ljava/lang/String;)V', sendText);
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            return jsb.reflection.callStaticMethod('RootViewController', 'SendText:', sendText);
        }
        return "";
    }

    static sendPicture() {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "sendPicture", '()Ljava/lang/String;');
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod('RootViewController', 'SendPicture', "");
        }
    }


    static openPhoto(): string {
        if (!CC_JSB) return;
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "OpenPhoto", '()Ljava/lang/String;');
        } else if (cc.sys.OS_IOS == cc.sys.os) {
            jsb.reflection.callStaticMethod('ThumbDataTool', 'getImg');
            // jsb.reflection.callStaticMethod('RootViewController', 'OpenPhoto',"");
            return "";
        }
    }

    // 截图 
    static takePhoto(node: cc.Node, picName: string): void {
        let width = Math.floor(node.width);
        let height = Math.floor(node.height);
        if (CC_JSB) {
            let fullPath = jsb.fileUtils.getWritablePath() + picName;
            if (jsb.fileUtils.isFileExist(fullPath)) {
                jsb.fileUtils.removeFile(fullPath);
            }
            let cameraNode = new cc.Node();
            cameraNode.parent = node.parent;
            let camera = cameraNode.addComponent(cc.Camera);
            camera.cullingMask = 0xffffffff;
            let texture = new cc.RenderTexture();
            let gl = cc.game._renderContext;
            texture.initWithSize(width, height, gl.STENCIL_INDEX8);
            camera.targetTexture = texture;
            camera.render(node);
            let data = texture.readPixels();
            //以下代码将截图后默认倒置的图片回正
            let picData = new Uint8Array(width * height * 4);
            let rowBytes = width * 4;
            for (let row = 0; row < height; row++) {
                let srow = height - 1 - row;
                let start = Math.floor(srow * width * 4);
                let reStart = row * width * 4;
                // save the piexls data
                for (let i = 0; i < rowBytes; i++) {
                    picData[reStart + i] = data[start + i];
                }
            }
            //保存图片
            jsb.saveImageData(picData, width, height, fullPath);
            UDebug.Log("截图成功，图片保存在 ====>" + fullPath);
            node.parent.removeChild(cameraNode);
        }
    }

    // 保存图片
    static savePhoto(picName: string): void {
        setTimeout(function () {
            if (cc.sys.os == cc.sys.OS_ANDROID) {
                jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "photoTo", "(Ljava/lang/String;)V", jsb.fileUtils.getWritablePath() + picName + '.jpg');
            } else if (cc.sys.os == cc.sys.OS_IOS) {
                let value = jsb.reflection.callStaticMethod("AppController", "CanPhotoLibary:", jsb.fileUtils.getWritablePath() + picName + ".jpg");
                if (value == 0)//拒绝
                {
                    AppGame.ins.showTips("您已拒绝使用相册！");
                }
                else if (value == 1)//同意
                {
                    jsb.reflection.callStaticMethod("AppController", "photoTo:", jsb.fileUtils.getWritablePath() + picName + ".jpg");
                }
                else if (value == 2)//等你做决定呢
                {

                }
            }
        }, 200);
    }

    // 保存图片
    static savePhoto2(node: cc.Node, picName: string, isOpenWechat: boolean = false, cb = null): void {
        window.isOpenWechat = isOpenWechat;
        window.openWechatCB = cb;
        UAPIHelper.takePhoto(node, `${picName}.jpg`);
        UAPIHelper.savePhoto(picName);
    }

    // 保存图片 picName: string 图片名字
    static savePhoFormWeb(picName: string = null): void {
        if (!picName) {
            picName = Date.now() + "";
        }
        let node = new cc.Node();
        node.parent = cc.director.getScene();
        let camera = node.addComponent(cc.Camera);
        camera.cullingMask = 0xffffffff;
        let texture = new cc.RenderTexture();
        let gl = cc.game["_renderContext"];
        texture.initWithSize(cc.visibleRect.width, cc.visibleRect.height, gl.STENCIL_INDEX8);
        camera.targetTexture = texture;
        let width = texture.width;
        let height = texture.height;
        node.x = width / 2;
        node.y = height / 2;
        camera.render();
        let data = texture.readPixels();
        let canvas = document.createElement('canvas');
        let ctx = canvas.getContext('2d');
        canvas.width = texture.width;
        canvas.height = texture.height;
        let rowBytes = width * 4;
        for (let row = 0; row < height; row++) {
            let srow = height - 1 - row;
            let imageData = ctx.createImageData(width, 1);
            let start = srow * width * 4;
            for (let i = 0; i < rowBytes; i++) {
                imageData.data[i] = data[start + i];
            }
            ctx.putImageData(imageData, 0, row);
        }
        let dataURL = canvas.toDataURL("image/jpeg");
        let img = document.createElement("img");
        img.src = dataURL;

        let div = document.createElement("div");
        let textFileAsBlob;
        img.onload = () => {
            let urlData = dataURL;
            let arr = urlData.split(',');
            let mime = arr[0].match(/:(.*?);/)[1] || "image/png";
            let bytes = this.dataURItoBlob(urlData);
            textFileAsBlob = new Blob([bytes], { type: mime });
            let downloadLink = document.createElement("a");
            downloadLink.download = picName + ".png";
            downloadLink.innerHTML = "Download File";
            if (window.webkitURL != null) {
                downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
            } else {
                downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
                downloadLink.style.display = "none";
                document.body.appendChild(downloadLink);
            }
            downloadLink.click();
        };
        div.style.position = 'absolute';
        div.setAttribute('z-index', '99');
        img.src = dataURL;
        div.appendChild(img);
    }
    //base64 解码 图片 转为 二进制字节数组
    private static dataURItoBlob(base64Data) {
        var byteString;
        if (base64Data.split(',')[0].indexOf('base64') >= 0)
            byteString = atob(base64Data.split(',')[1]);//base64 解码
        else {
            byteString = unescape(base64Data.split(',')[1]);
        }
        var ia = new Uint8Array(byteString.length);//创建视图
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }
        return ia;
    }

    //下载App
    static downloadApkAndInstall(url: string): void {
        // if (cc.sys.os == cc.sys.OS_ANDROID) {
        //     let msg = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", "downloadApkAndInstall", "(Ljava/lang/String;)Ljava/lang/String;",url);
        //     AppGame.ins.showTips(msg);
        // }
        // else if(cc.sys.os == cc.sys.OS_IOS){
        //     window.location.href = "https://ag.boyi2025.com/byq.plist";
        // }
    }

    static openDeskClip(url: string): void {
        if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod('AppController', 'openDeskClip:', url);
        }
    }

    static getItemHeight(msgstr: string): number {
        let height = 70;
        if (msgstr.length > 18) {
            height += Math.ceil(msgstr.length / 18) * 25
        } else {
            height += 25;
        }
        return height;
    }

    /**
     * @description  云信撤回消息
     * @param webCallBack 网页撤回方法
     */
    static chatDeleteMsg(IMMessage: string, webCallBack) {
        if (cc.sys.os == cc.sys.OS_ANDROID) {
            console.log("android 撤回:", IMMessage)
            jsb.reflection.callStaticMethod("org/cocos2dx/javascript/AppActivity", 'deleteMsg', '(Ljava/lang/String;)V', IMMessage.toString());
        } else if (cc.sys.os == cc.sys.OS_IOS) {
            jsb.reflection.callStaticMethod('RootViewController', 'DeleteMsg:', IMMessage);
        } else {
            webCallBack && webCallBack()
        };
    };
    /**
         * @description 微信登入
         */
    public static wechatCallback(param: string) {
        UDebug.log("wechatCallback: ", param);
        let splArr = param.split("#");
        let key = splArr[0];
        let errCode = splArr[1];
        switch (key) {
            case "event_wxlogin":
                let wxCode = splArr[2];
                if(wxCode == "您没有安装微信"){
                    AppGame.ins.showTips('您没有安装微信');
                    return;
                }
                VWeChat.authorizationLogin(wxCode);
                break;
            case "event_wxshare":

                break;
            default:
                break;
        }
    };

    //打开相册
    static openPhotoEx(): string {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "openPhotoEx", '(II)Ljava/lang/String;',200,200);
        }else if (cc.sys.OS_IOS == cc.sys.os) {
            // return "";
            jsb.reflection.callStaticMethod('RootViewController', 'openPhotoEx:height:quality:','200','200','80');

        }
    }

    //打开相机
    static openCameraEx(): string {
        if (cc.sys.OS_ANDROID == cc.sys.os) {
            return jsb.reflection.callStaticMethod('org/cocos2dx/javascript/AppActivity', "openCameraEx", '(II)Ljava/lang/String;',200,200);
        }else if (cc.sys.OS_IOS == cc.sys.os) {
            // return "";
            jsb.reflection.callStaticMethod('RootViewController', 'openCameraEx:height:quality:','200','200','80');

        }
    }

}
window.isOpenWechat = false;
window.savePhotoTips = () => {
    if (window.isOpenWechat) {
        window.isOpenWechat = false;
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: 3, data: "分享二维码界面已保存相册,是否要打开微信？", handler: UHandler.create((a) => {
                if (a) {
                    UAPIHelper.openWechat();
                }
                if (window.openWechatCB != null) {
                    window.openWechatCB(a);
                    window.openWechatCB = null;
                }
            }, this)
        });
    } else {
        AppGame.ins.showTips("保存成功");
    }
}

window.uploadHeadStrCallBack = (headStr: string) =>{
    if(headStr) {
        AppGame.ins.roleModel.requestUploadImage(headStr);
    }
}

cc["api"] = UAPIHelper;
function 您没有安装微信(您没有安装微信: any) {
    throw new Error("Function not implemented.");
}

