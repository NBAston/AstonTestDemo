import { encryptType, sign, other, ver, USerializer } from "../common/net/USerializer";
import UHandler from "../common/utility/UHandler";
import { Game, GameServer } from "../common/cmd/proto";
import UHeader, { headLen } from "../common/net/UHeader";
import UDebug from "../common/utility/UDebug";
import UDateHelper from "../common/utility/UDateHelper";
import AppGame from "../public/base/AppGame";
import cfg_global from "../config/cfg_global";
import ErrorLogUtil, { LogLevelType } from "../public/errorlog/ErrorLogUtil";
const MYAES = require('../common/utility/AES.js');
export const signInner1 = 0xF5F5F5F5;
/**
 * 游戏逻辑的包解析器 继承这个 
 */
export abstract class UGameSerializer extends USerializer {

    /**
     * 发送命令
     * @param mainId 主id
     * @param subId 次id
     * @param data proto数据
     * @param handler 回调
     * @param unLock 是否锁屏
     */
    send(mainId: number, subId: number, data: any, handler?: UHandler, unLock?: boolean) {

        if (!this._peer || !this._peer.isConnect) {
            return;
        }
        unLock = unLock || false;

        let request = this.pushRequest(handler, unLock);
        let pb = GameServer.MSG_CSC_Passageway.create();
        pb.header = new Game.Common.Header();
        pb.header.sign = signInner1;

        let map = this.getProtoMap(mainId, subId);
        if (!map) {
            ErrorLogUtil.ins.addErrorLog("没有对应的proto->" + mainId + "   " + subId, LogLevelType.DEBUG);
            throw new Error("没有对应的proto->" + mainId + "  " + subId);
        }
        let bytes = null;
        if (map.request != null) {
            bytes = map.request.encode(data).finish();
        } else {
            bytes = new Uint8Array(0);
        }

        pb.passData = bytes;
        let protobuf = GameServer.MSG_CSC_Passageway.encode(pb).finish();
        // UDebug.Log("protobuf22@@@@@",protobuf);
        // let protobuf1 = MYAES.aesCbcPkcs7Encrypt(protobuf, AppGame.ins.commonAesKey);
        //console.log("类型。。。。。", typeof protobuf);
        let header = new UHeader();
        header.encryptType = 0x02;
        header.mainId = mainId;
        header.other = other;
        header.realSize = protobuf.length;
        header.requestId = request.requestId;
        header.sign = sign;
        header.subId = subId;
        header.ver = ver;
        if (cfg_global.isencrypt) {
            let protobuf1 = MYAES.aesCbcPkcs7Encrypt(protobuf, AppGame.ins.commonAesKey);
            header.encryptType = 0x32;
            header.len = headLen + protobuf1.length;
            //UDebug.Log("game加密后的protobuf"+ protobuf1);
            let deprotobuf1 = MYAES.aesCbcPkcs7Decrypt(protobuf1, AppGame.ins.commonAesKey);
            this._peer.send(header, protobuf1);
        } else {
            header.encryptType = 0x02;
            header.len = headLen + protobuf.length;
            this._peer.send(header, protobuf);
        }

        // this._peer.send(header, protobuf);
        if ((mainId == 2 && subId == 1) || (mainId == 3 && subId == 1) || (mainId == 4 && subId == 122)) {
            //UDebug.Log("发送命令->" + mainId + "   " + subId + "   " + UDateHelper.format(new Date(), "yyyy-MM-dd hh:mm:ss") + "    " + JSON.stringify(data));
        } else {
            UDebug.log("%c" + UDateHelper.format(new Date(), "[yyyy-MM-dd hh:mm:ss.S]") + "发送: main=" + header.mainId + " sub=" + header.subId + "  " + JSON.stringify(data), "color:#75AF40");
        }
        // UDebug.Log("发送命令->" + mainId + "   " + subId + "   " + UDateHelper.format(new Date(), "yyyy-MM-dd hh:mm:ss") + "    " + JSON.stringify(data));
    }
}
