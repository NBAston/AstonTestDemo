
import UHandler from "../utility/UHandler";
import UDebug from "../utility/UDebug";
import { MD5 } from "../utility/UMD5";
import AppGame from "../../public/base/AppGame";
import RsaKey from "../utility/RsaKey";
import cfg_key from "../../config/cfg_key";
import JSEncrypt from 'jsencrypt'
import cfg_global from "../../config/cfg_global";
import ErrorLogUtil, { LogLevelType } from "../../public/errorlog/ErrorLogUtil";
import { fork } from "child_process";

const { ccclass, property } = cc._decorator;
const AES_SERVER_LIST_KEY = "2020102423102412";
/**
 * 创建:gj
 * 作用：管理http请求
 */
export class UHttpManager {

    constructor() {

    }
    /**
     * 发送http请求
     * @param method get or post
     * @param opCode 请求的命令
     * @param data 请求或者传入的数据
     * @param callback 回调
     * @param thisObj 回调的this指针
     * @param params 回调时候的传入参数
     * @param unlock 请求时候是否锁操作
     */
    send(method: string, opCode: string, url: string, params: Object, unlock?: boolean, handler?: UHandler): void {
        if (method == "get") {
            this.httpGet(url, params, unlock, handler);
        } else {
            this.httpPost(url, params, unlock, handler);
        }
    }
    /**
     * get形式获取
     * @param data 
     * @param callback 
     * @param thisObj 
     * @param params 
     * @param unlock 
     */
    private httpGet(url: string, params: Object, unlock: boolean, handler?: UHandler,): void {
        let request = cc.loader.getXMLHttpRequest();
        // request.withCredentials = true;
        request.open("get", url);
        AppGame.ins.generateAesKey(this.fun);
        try {
            // 兼容IE
            request.timeout = 25000;
        } catch (err) { }

        //可能出现的堵塞 异常处理 20秒没有返回，
        var intervalId = setTimeout(() => {
            request.abort()
        }, 20000);

        request.ontimeout = function (event) {
            clearInterval(intervalId); //20秒内返回成功了，清除堵塞计时
            if (url) {
                var timeoutStr = 'GET请求接口超时：' + url;
                ErrorLogUtil.ins.addErrorLog(timeoutStr, LogLevelType.ERROR);
            }
        };
        request.onreadystatechange = () => {
            if (request.readyState == 4) {
                if (request.status >= 200 && request.status < 400) {
                    let respone = request.responseText;
                    if (unlock) {
                        respone = AppGame.ins._localRsaKey.decryptAes(respone, AES_SERVER_LIST_KEY);
                    }

                    if (this.isJSON(respone)) {
                        let rsp = JSON.parse(respone);
                        if (handler) handler.runWith({ sucess: 0, data: rsp });
                    } else {
                        var str = "通过Get 请求连接url=" + url + " 返回的数据不是JSON的字符串，解析出错";
                        ErrorLogUtil.ins.addErrorLog(str, LogLevelType.ERROR);
                    }
                } else {
                    //UDebug.Log(request.responseText);
                    if (handler) handler.runWith({ sucess: 1, data: request.responseText });
                }
            } else {

            }
        }
        request.send();
    }
    // 是否是json 字符串
    isJSON(str) {
        if (typeof str == 'string') {
            try {
                var obj = JSON.parse(str);
                if (typeof obj == 'object' && obj) {
                    return true;
                } else {
                    return false;
                }
            } catch (e) {
                return false;
            }
        }
    }
    /**
     * post形式获取
     * @param data 
     * @param callback
     * @param thisObj 
     * @param params 
     * @param unlock 
     */
    private httpPost(url: string, params: Object, unlock: boolean, handler?: UHandler): void {
        let request = cc.loader.getXMLHttpRequest();
        request.open("post", encodeURI(url));
        AppGame.ins.generateAesKey(this.fun);
        try {
            // 兼容IE
            request.timeout = 25000;
        } catch (err) { }

        //可能出现的堵塞 异常处理 20秒没有返回，
        var intervalId = setTimeout(() => {
            request.abort()
        }, 20000);

        request.ontimeout = function (event) {
            clearInterval(intervalId); //20秒内返回成功了，清除堵塞计时
            if (url) {
                var timeoutStr = 'POST请求接口超时：' + url;
                ErrorLogUtil.ins.addErrorLog(timeoutStr, LogLevelType.ERROR);
            }
        };

        request.onreadystatechange = () => {
            if (request.readyState == 4) {
                if (request.status >= 200 && request.status < 400) {
                    let respone = request.responseText;
                    if (unlock) {
                        // let debase64 = window.atob(respone)
                        //UDebug.Log("解密用的aes"+ AppGame.ins._localRsaKey.aesKey);
                        //UDebug.Log("需要解密的数据"+respone);
                        let decryResponse = AppGame.ins._localRsaKey.decryptAes(respone, AppGame.ins._localRsaKey.aesKey);
                        let rsp = JSON.parse(decryResponse);
                        if (this.isJSON(decryResponse)) {
                            //UDebug.Log("接口数据打印rsp============"+JSON.stringify(rsp));
                            if (handler) handler.runWith({ sucess: 0, data: rsp });
                        } else {
                            var str = "通过POST 请求连接url=" + url + " 返回的数据解析之后不是一个JSON的字符串，解析出错";
                            ErrorLogUtil.ins.addErrorLog(str, LogLevelType.ERROR);
                        }
                    } else {
                        let rsp = JSON.parse(respone);
                        if (handler) handler.runWith({ sucess: 0, data: rsp });
                    }
                } else {
                    var str = '返回状态：' + request.status + '__url：' + url;
                    ErrorLogUtil.ins.addErrorLog(str, LogLevelType.ERROR);
                    if (handler) handler.runWith({ sucess: 1 });
                }
            } else {

            }
        }
        request.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;charset=utf-8");
        if (unlock) {
            for (let k of Object.keys(params)) {
                if (k == "publicKey") {
                    UDebug.Log("发送的aes" + AppGame.ins._localRsaKey.aesKey);
                    params[k] = AppGame.ins._localRsaKey.aesKey;
                }
            }
            let jsonParams = JSON.stringify(params);
            var encrypt = new JSEncrypt();
            let encryPackParamsBuffer = new RsaKey().stringToUint8Array(jsonParams);
            encrypt.setPublicKey(cfg_key.publickey1);
            encrypt.setPrivateKey(cfg_key.prikey1);
            let protobuf1 = encrypt.encrypt(encryPackParamsBuffer);
            let deprotobuf1 = encrypt.decrypt(protobuf1);
            let encryPackParamsStr = new RsaKey().Uint8ArrayToString(protobuf1);
            var b64 = window.btoa(encryPackParamsStr);
            let debase64 = window.atob(b64)
            UDebug.Log("发送数据" + b64);
            request.send(b64);
        } else {
            /**
            {
                'sign-device': "windows",
                'sign-password':'',
                'sign-rst':1611936208,
                'sign-sign':'',
                'sign-uid':'',
                'sign-version':100
            }
             */
            if (params.hasOwnProperty('header')) {
                for (const key in params["header"]) {
                    if (Object.prototype.hasOwnProperty.call(params["header"], key)) {
                        const element = params["header"][key];
                        request.setRequestHeader(key, element);
                    }
                }
                delete params["header"]
            }
            let packParams = this.packParam(params);
            UDebug.Log(`云信请求地址：${url}  请求参数：${packParams}`);
            request.send(packParams);
        }
    }
    fun() {

    }

    private getSign(method: string, api_key: string, account: string) {
        return MD5(method + api_key + account).toLowerCase();
    }

    private packParam(param) {
        let str = '';
        for (const key in param) {
            if (param.hasOwnProperty(key)) {
                str = str + key + '=' + param[key];
                str += '&';
            }
        }
        return str.substr(0, str.length - 1);
    };
}
