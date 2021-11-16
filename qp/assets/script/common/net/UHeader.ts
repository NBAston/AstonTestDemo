import { ConvertTools } from "./UConvertTools";
import UDebug from "../utility/UDebug";
import ByteArray, { Endian } from "./socket/ByteArray";

export const headLen: number = 18;
/**
 * 创建:sq
 * 作用:包头
 */
export default class UHeader {

    /**
     * 包整体长度
     *  4B
     */
    len: number;
    /**
     * 校验
     * 2B
     */
    crc: number;
    /**
     * 版本
     * 2B
     */
    ver: number;
    /**
     * 标记
     * 2B
     */
    sign: number;
    /**
     *主命令
     1B 
     */
    mainId: number;
    /**
     *子命令
     1B 
     */
    subId: number;
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
    encryptType: number;
    /**
     * 备用
     * 1B
     */
    other: number;
    /**
     * 请求命令流水号
     * 4B
     */
    requestId: number;
    /**
     * 原始包长度
     * 2B
     */
    realSize: number;

    private _tempByteArr: ByteArray;

    constructor() {
        this._tempByteArr = new ByteArray();
        this._tempByteArr.endian = Endian.LITTLE_ENDIAN;
    }
    /**
     * 
     * @param buff 解码
     */
    decode(buff: ByteArray): boolean {
        if (buff.length < 18) {
            UDebug.Log("Buff的长度不够" + headLen);
            return false;
        }
        let arr = buff.buffer;
        this.len = buff.readUnsignedShort();
        this.crc = buff.readUnsignedShort();
        let pos = buff.position;
        let bufflen = (buff.length - 4);
        let sum = this.getCrc(buff, bufflen);
        if (sum != this.crc) {
            return false;
        }
        buff.position = pos;
        this.ver = buff.readUnsignedShort();
        this.sign = buff.readUnsignedShort();
        this.mainId = buff.readUnsignedByte();
        this.subId = buff.readUnsignedByte();
        this.encryptType = buff.readUnsignedByte();
        this.other = buff.readUnsignedByte();
        this.requestId = buff.readUnsignedInt();
        this.realSize = buff.readUnsignedShort();
        return true;
    }
    /**
     * to ByteArray
     */
    encode(writeArr: ByteArray, protobuf: Uint8Array): void {

        this._tempByteArr.writeUnsignedShort(this.ver);
        this._tempByteArr.writeUnsignedShort(this.sign);
        this._tempByteArr.writeByte(this.mainId);
        this._tempByteArr.writeByte(this.subId);
        this._tempByteArr.writeByte(this.encryptType);
        this._tempByteArr.writeByte(this.other);
        this._tempByteArr.writeUnsignedInt(this.requestId);
        this._tempByteArr.writeUnsignedShort(this.realSize);
        let ar = new ByteArray(protobuf);
        ar.endian = Endian.LITTLE_ENDIAN;
        this._tempByteArr.writeBytes(ar);
        this._tempByteArr.position = 0;
        let len = this._tempByteArr.length;
        this.crc = this.getCrc(this._tempByteArr, len);
        this._tempByteArr.position = 0;
        writeArr.writeUnsignedShort(this.len);
        writeArr.writeUnsignedShort(this.crc);
        writeArr.writeBytes(this._tempByteArr);
        this._tempByteArr.clear();

    }

    private getCrc(buff: ByteArray, len: number): number {
        let bufflen = Math.floor(len / 2);
        let sum = 0;
        /**校验 crc */
        for (let i = 0; i < bufflen; i++) {
            sum += buff.readUnsignedShort();
        }
        let aa = len % 2;
        if (aa != 0) {
            sum += buff.readUnsignedByte();
        }
        sum = sum % 65536;
        return sum;
    }
}
