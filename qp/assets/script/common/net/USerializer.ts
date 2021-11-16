import { ProtoMapItem } from "../cmd/UOpcode";
import UHandler from "../utility/UHandler";
import { UPool } from "../utility/UPool";
import UHeader from "./UHeader";
import { Game, Common, HallServer } from "../cmd/proto";
import UDebug from "../utility/UDebug";
import UPeer from "./UPeer";
import UDateHelper from "../utility/UDateHelper";
import AppGame from "../../public/base/AppGame";
import cfg_global from "../../config/cfg_global";
const CryptoJS = require('crypto-js');
import * as NodeRSA from 'node-rsa';
import RsaKey from "../utility/RsaKey";
const MYAES = require('../utility/AES.js');
import JSEncrypt from 'jsencrypt'
import cfg_key from "../../config/cfg_key";
import ErrorLogUtil, { LogLevelType } from "../../public/errorlog/ErrorLogUtil";

/**
 * socket 请求的结构体
 */
export class SocketReuest {
    /**
     * 请求id
     */
    requestId: number;
    /**
     * 是否锁屏
     */
    unLock: boolean;
    /**
     * 回调
     */
    handler: UHandler;
    /**
     * 发包时间
     */
    time: number;
}
export const ver = 0x0001;
export const other = 0;
export const sign = 0x5F5F;
export const signInner = 0xF5F5F5F5;
export const encryptType = 0x02;
export const headLen: number = 18;
/**
 * 创建:sq
 * 作用:网络命令包的序列化器
 */
export abstract class USerializer extends cc.EventTarget {
    /**
   * 当前的requestId
   */
    private _reuestId: number;
    /**
    * 请求数据的池
    */
    private _pool: UPool<SocketReuest>;
    /**
     * 当前的请求
     */
    private _requests: { [key: number]: SocketReuest };
    /**
    * 注册事件
    */
    private _regesterMsg: { [key: number]: { [key1: number]: Array<UHandler> } };
    /**
     * 消息发送器
     */
    protected _peer: UPeer;

    constructor() {
        super();
        this._regesterMsg = {};
        this._requests = {};
        this._pool = new UPool<SocketReuest>(SocketReuest);
        this._reuestId = 1;
    }

    /**
    * 获取本地时间
    */
    protected getLocalTime(): number {
        return (new Date()).getTime();
    }
    /**
     * 获取Request
     * @param thisObj 
     * @param callback { fuction(data,params) data//接收到的数据,params//回调的参数}
     * @param param 
     * @param unLock 
     */
    protected pushRequest(handler: UHandler, unLock: boolean): SocketReuest {

        if (this._reuestId >= 32767)
            this._reuestId = 1;
        else
            this._reuestId = this._reuestId + 1;
        let request = this._pool.getGo();
        request.handler = handler;
        request.requestId = this._reuestId;
        request.time = this.getLocalTime();
        this._requests[this._reuestId] = request;
        return request;
    }
    /**
     * 获取请求
     * @param requetId 请求ID 
     */
    protected popRequest(requetId: number): SocketReuest {
        let request = this._requests[requetId];
        if (request) {
            delete this._requests[requetId];
            return request;
        }
        return request;
    }
    /**
     * 
     * @param mainId 
     * @param subId 
     */
    protected abstract getProtoMap(mainId: number, subId: number): ProtoMapItem;
    /**
     * 设置peer
     * @param peer 
     */
    setPeer(peer: UPeer): void {
        this._peer = peer;
    }
    /**
     * 解包
     */
    deserialize(header: UHeader, buffer: Uint8Array): void {
        // UDebug.Log("解析包的长度header", header.len);
        // UDebug.Log("解析包的长度buffer", buffer.length);

        let protoitem = this.getProtoMap(header.mainId, header.subId);
        if (!protoitem) {
            UDebug.Log("没有对应的包解析->" + header.mainId + "   " + header.subId);
            ErrorLogUtil.ins.addErrorLog("没有对应的包解析->" + header.mainId + "   " + header.subId, LogLevelType.DEBUG);
            return;
        }
        //UDebug.Log("有对应的包解析->" + header.mainId + "   " + header.subId);

        let dt = null;
        if (protoitem.response != null) {
            dt = protoitem.response.decode(buffer);
            if ((header.mainId == 2 && header.subId == 2) || (header.mainId == 3 && header.subId == 2) ||  (header.mainId == 4 && header.subId == 122) || (header.mainId == 1 && header.subId == 10)) {
                //let time = new Date();
                //UDebug.Log("接收命令->" + header.mainId + "  " + header.subId + "  " + (time.getTime()).toString() + "   " + UDateHelper.format(time, "yyyy-MM-dd hh:mm:ss") + "  " + JSON.stringify(dt));
            }
            else {
                  let time = new Date();
                  //广播消息不打印日志
                  UDebug.log("%c "+ UDateHelper.format(time, "[yyyy-MM-dd hh:mm:ss.S]")  +"接受: main="+ header.mainId + " sub=" + header.subId + "  " + JSON.stringify(dt),"color:#B49A40");
                //   UDebug.Log("接收命令->" + header.mainId + "  " + header.subId + "  " + (time.getTime()).toString() + "   " + UDateHelper.format(time, "yyyy-MM-dd hh:mm:ss") + "  " );
                // UDebug.Log("接收命令->" + header.mainId + "  " + header.subId + "  " + (new Date().getTime()).toString() + "  " );
            }
        } 
        // if (header.requestId > 0) {
        //     let request = this.popRequest(header.requestId);
        //     if (request) {
        //         let ping = this.getLocalTime() - request.time;
        //         cc.systemEvent.emit("cmd_ping", ping);
        //         /**使用全局时间抛出 */
        //         // if (request.handler) {
        //         //     request.handler.runWith(dt);
        //         //     return;
        //         // }
        //     }
        // }
        /**
         * 分发
         */
        if (this._regesterMsg[header.mainId]) {
            let ar = this._regesterMsg[header.mainId][header.subId];
            if (ar) {
                let len = ar.length;
                for (let index = 0; index < len; index++) {
                    let element = ar[index];
                    element.runWith(dt);
                }
            }

        }
    }
    /**
     * 发送命令
     * @param mainId 主id
     * @param subId 次id
     * @param data proto数据
     * @param handler 回调
     * @param unLock 是否锁屏
     */
    send(mainId: number, subId: number, data: any, handler?: UHandler, unLock?: boolean) {
        //UDebug.Log("解密后。。。。。。。");
        if (!this._peer || !this._peer.isConnect) {
            return;
        }
        unLock = unLock || false;

        let request = this.pushRequest(handler, unLock);

        /**补齐头 */
        if (!data.header) {
            data.header = new Game.Common.Header();
            // data.header.sign = signInner;
        } 
        data.header.sign = signInner;
        let map = this.getProtoMap(mainId, subId);
        if (!map) {
            ErrorLogUtil.ins.addErrorLog("没有对应的proto->" + mainId + "  " + subId, LogLevelType.DEBUG);
            throw new Error("没有对应的proto->" + mainId + "  " + subId);
        }
        let protobuf = null;
        if (map.request != null) {
            protobuf = map.request.encode(data).finish();
        } else {
            protobuf = new Uint8Array(0);
        }
        let header = new UHeader();
        //RSA
        if (mainId == 1&& subId == 3) {
            var encrypt = new JSEncrypt();
            encrypt.setPublicKey(cfg_key.publickey);
            let protobuf1 = encrypt.encrypt(protobuf);
            // UDebug.Log("类型。。。。。"+ typeof protobuf1 );
            header.encryptType = 0x22;
            header.len = headLen + protobuf1.length;
            // UDebug.Log("protobuf 长度"+ protobuf1.length );
            header.mainId = mainId;
            header.other = other;
            header.realSize = protobuf.length;
            header.requestId = request.requestId;
            header.sign = sign;
            header.subId = subId;
            header.ver = ver;
            this._peer.send(header, protobuf1);
        } else {
            // let protobuf1 = MYAES.aesCbcPkcs7Encrypt(protobuf, AppGame.ins.commonAesKey);
            // let unit = new Uint8Array(protobuf.length + 3);
            // protobuf = protobuf 
            //UDebug.Log("加密后前protobuf", protobuf);
            header.mainId = mainId;
            header.other = other;
            header.realSize = protobuf.length;
            header.requestId = request.requestId;
            header.sign = sign;
            header.subId = subId;
            header.ver = ver;
            // let protobuf1 = new RsaKey().encryptAesNew(protobuf, AppGame.ins.commonAesKey);
            // let deprotobuf1 = new RsaKey().decryptAesNew(protobuf1, AppGame.ins.commonAesKey);
            if (cfg_global.isencrypt) {
                let protobuf1 = MYAES.aesCbcPkcs7Encrypt(protobuf, AppGame.ins.commonAesKey);
                header.encryptType = 0x32;
                header.len = headLen + protobuf1.length;
                // UDebug.Log("加密后的protobuf"+ protobuf1);
                let deprotobuf1 = MYAES.aesCbcPkcs7Decrypt(protobuf1, AppGame.ins.commonAesKey);
                this._peer.send(header, protobuf1);
            } else {
                header.encryptType = 0x02;
                header.len = headLen + protobuf.length;
                this._peer.send(header, protobuf);
            }   
        }
        
        
        // this._peer.send(header, this.protobuf1);
        if ((mainId == 2 && subId == 1) || (mainId == 3 && subId == 1)) {
           // UDebug.Log("发送命令->" + mainId + "   " + subId + "   " + UDateHelper.format(new Date(), "yyyy-MM-dd hh:mm:ss") + "   " + JSON.stringify(data));
        } else {
            UDebug.log("%c "+UDateHelper.format(new Date(), "[yyyy-MM-dd hh:mm:ss.S]")  +"发送: main="+ header.mainId + " sub=" + header.subId + "  " + JSON.stringify(data),"color:#75AF40");
        }
        // UDebug.Log("发送命令->" + mainId + "   " + subId + "   " + UDateHelper.format(new Date(), "yyyy-MM-dd hh:mm:ss") + "   " + JSON.stringify(data));
    }
    /**
    * 注册消息
    * @param mainId 主id
    * @param subId 子id
    * @param handler 回调
    */
    regester(mainId: number, subId: number, handler: UHandler): void {
        let mainRe = this._regesterMsg[mainId];
        if (!mainRe) {
            mainRe = {};
            this._regesterMsg[mainId] = mainRe;
        }
        let subRe = mainRe[subId];
        if (!subRe) {
            subRe = new Array<UHandler>();
            mainRe[subId] = subRe;
        }
        subRe.push(handler);
    }
    /**
     * 注销事件注册
     * @param mainId 
     * @param subId 
     * @param handler 
     */
    unregester(mainId: number, subId: number, handler: UHandler): void {
        let mainRe = this._regesterMsg[mainId];
        if (!mainRe) {
            return;
        }
        let subRe = mainRe[subId];
        if (!subRe) {
            return;
        }

        //清空数组
        //subRe.splice(0, subRe.length);
    }
}
