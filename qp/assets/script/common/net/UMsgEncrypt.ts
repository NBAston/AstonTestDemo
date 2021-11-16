import UDebug from "../utility/UDebug";
import * as NodeRSA from 'node-rsa';
import cfg_global from "../../config/cfg_global";

/**
 * 加密路由
 */
export default class UMsgEncryptRoute {

    /**
     * 默认的rsa公钥
     */
    private static _default_rsa_public_key: string;
    /**
     * 服务器交换的aes密钥
     */
    private static _aes_key: string;
    /**
     * client的rsa私钥
     */
    private static _client_rsa_public_key: string;
    /**
     * client的rsa密钥
     */
    private static _client_rsa_private_key: string;
    /**
     * 解密路由器
     */
    private static _routesDecode: { [key: number]: Function };
    /**
     * 加密路由器
     */
    private static _routesEncode: { [key: number]: Function };
    /**
     * 获取客户端产生的公钥
     */
    static get client_rsa_public_key() {
        return UMsgEncryptRoute._client_rsa_public_key;
    }
    /**
     * 设置和服务器交换的密钥
     * @param key 
     */
    static set_ase_key(key: string): void {
        UMsgEncryptRoute._aes_key = key;
    }
    /**
     * 初始化路由器
     */
    static init(): void {
        /**
     * 加密类型
     * 1B
     *  0x01  不加密 Json
        0x02  不加密 protobuf
        0x11  位运算 Json
        0x12  位运算 protobuf
        0x21  RSA    Json
        0x22  RSA    protobuf
        0x31  AES    Json
        0x32  AES    protobuf
     */
        UMsgEncryptRoute._routesDecode = {};
        UMsgEncryptRoute._routesDecode[0x02] = UMsgEncryptRoute.decode_encry_no_protobuf;
        UMsgEncryptRoute._routesDecode[0x12] = UMsgEncryptRoute.decode_encry_bit_operation_protobuf;
        UMsgEncryptRoute._routesDecode[0x22] = UMsgEncryptRoute.decode_encry_rsa_protobuf;
        UMsgEncryptRoute._routesDecode[0x32] = UMsgEncryptRoute.decode_encry_aes_protobuf;


        UMsgEncryptRoute._routesEncode = {};
        UMsgEncryptRoute._routesEncode[0x02] = UMsgEncryptRoute.encode_encry_no_protobuf;
        UMsgEncryptRoute._routesEncode[0x12] = UMsgEncryptRoute.encode_encry_bit_operation_protobuf;
        UMsgEncryptRoute._routesEncode[0x22] = UMsgEncryptRoute.encode_encry_rsa_protobuf;
        UMsgEncryptRoute._routesEncode[0x32] = UMsgEncryptRoute.encode_encry_aes_protobuf;

        UMsgEncryptRoute.createRSA_KEY();
    }
    /***
     * 创建rsakey
     */
    static createRSA_KEY(): void {
        var rsa = new NodeRSA({ b: 64 });
        UMsgEncryptRoute._client_rsa_public_key = rsa.exportKey('public');
        UMsgEncryptRoute._client_rsa_private_key = rsa.exportKey('private');
        UMsgEncryptRoute._default_rsa_public_key = cfg_global.publickey;
    }
    /**
     * 根据key的类型获取对应的key
     * @param keytype 
     */
    private static getDecodeKey(keytype: number): string {
        if (keytype == 1) {
            return UMsgEncryptRoute._default_rsa_public_key;
        } else if (keytype == 2) {
            return UMsgEncryptRoute._client_rsa_public_key;
        } else {
            return UMsgEncryptRoute._aes_key;
        }
    }
    /**
     *  根据key的类型获取加密的key
     * @param keytype 
     */
    private static getEncodeKey(keytype: number): string {
        if (keytype == 1) {
            return UMsgEncryptRoute._default_rsa_public_key;
        } else if (keytype == 2) {
            return UMsgEncryptRoute._client_rsa_private_key;
        } else {
            return UMsgEncryptRoute._aes_key;
        }
    }
    /**
     * 没加密的Protobuff
     * @param buffer 
     */
    private static decode_encry_no_protobuf(buffer: ArrayBuffer): ArrayBuffer {
        return buffer;
    }
    /**
     * 位运算加密的protobuff
     * @param buffer 
     */
    private static decode_encry_bit_operation_protobuf(key: string, buffer: ArrayBuffer): ArrayBuffer {
        return buffer;
    }
    /**
     * rsa加密的protobuff
     * @param buffer 
     */
    private static decode_encry_rsa_protobuf(key: string, buffer: ArrayBuffer): ArrayBuffer {

        return buffer;
    }
    /**
     * aes加密的protobuff
     * @param buffer 
     */
    private static decode_encry_aes_protobuf(key: string, buffer: ArrayBuffer): ArrayBuffer {
        return buffer;
    }

    /**
     * 没加密的Protobuff
     * @param buffer 
     */
    private static encode_encry_no_protobuf(key: string, buffer: ArrayBuffer): ArrayBuffer {
        return buffer;
    }
    /**
     * 位运算加密的protobuff
     * @param buffer 
     */
    private static encode_encry_bit_operation_protobuf(key: string, buffer: ArrayBuffer): ArrayBuffer {
        return buffer;
    }
    /**
     * rsa加密的protobuff
     * @param buffer 
     */
    private static encode_encry_rsa_protobuf(key: string, buffer: ArrayBuffer): ArrayBuffer {

        return buffer;
    }
    /**
     * aes加密的protobuff
     * @param buffer 
     */
    private static encode_encry_aes_protobuf(key: string, buffer: ArrayBuffer): ArrayBuffer {
        return buffer;
    }
    /**
     * 解密
     * @param encryType 
     * @param buffer 
     */
    static decode_encry(encryType: number, buffer: ArrayBuffer, keytype: number): ArrayBuffer {
        let decode = this._routesDecode[encryType];
        if (decode) {
            let key = UMsgEncryptRoute.getDecodeKey(keytype);
            return decode(key);

        } else {
            UDebug.log("没有对用的解密接口！");
            return buffer;
        }
    }
    static encode_encry(encryType: number, buffer: ArrayBuffer, keytype: number): ArrayBuffer {
        let decode = this._routesEncode[encryType];
        if (decode) {
            let key = UMsgEncryptRoute.getEncodeKey(keytype);
            return decode(key);
        } else {
            UDebug.log("没有对用的解密接口！");
            return buffer;
        }
    }
    //字符串转字节序列
    private static stringToByte(str): Array<number> {
        var bytes = new Array();
        var len, c;
        len = str.length;
        for (var i = 0; i < len; i++) {
            c = str.charCodeAt(i);
            if (c >= 0x010000 && c <= 0x10FFFF) {
                bytes.push(((c >> 18) & 0x07) | 0xF0);
                bytes.push(((c >> 12) & 0x3F) | 0x80);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000800 && c <= 0x00FFFF) {
                bytes.push(((c >> 12) & 0x0F) | 0xE0);
                bytes.push(((c >> 6) & 0x3F) | 0x80);
                bytes.push((c & 0x3F) | 0x80);
            } else if (c >= 0x000080 && c <= 0x0007FF) {
                bytes.push(((c >> 6) & 0x1F) | 0xC0);
                bytes.push((c & 0x3F) | 0x80);
            } else {
                bytes.push(c & 0xFF);
            }
        }
        return bytes;
    }
    //字节序列转ASCII码
    //[0x24, 0x26, 0x28, 0x2A] ==> "$&C*"
    private static byteToString(arr): string {
        if (typeof arr === 'string') {
            return arr;
        }
        var str = '',
            _arr = arr;
        for (var i = 0; i < _arr.length; i++) {
            var one = _arr[i].toString(2),
                v = one.match(/^1+?(?=0)/);
            if (v && one.length == 8) {
                var bytesLength = v[0].length;
                var store = _arr[i].toString(2).slice(7 - bytesLength);
                for (var st = 1; st < bytesLength; st++) {
                    store += _arr[st + i].toString(2).slice(2);
                }
                str += String.fromCharCode(parseInt(store, 2));
                i += bytesLength - 1;
            } else {
                str += String.fromCharCode(_arr[i]);
            }
        }
        return str;
    }
}
