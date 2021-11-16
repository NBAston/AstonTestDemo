// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

/**
 * 创建:gj
 * 作用:byte[] 和 number互转 小端
 */
export class ConvertTools {
    constructor() {

    }
    /**
    * byte to bytes
    * @param num 
    */
    public static getInt8Bytes(num: number): ArrayBuffer {
        let bs = new ArrayBuffer(1);
        bs[0] = (num);
        return bs;
    }
    /**
    * int16 to bytes
    * @param num 
    */
    public static getInt16Bytes(value: number): ArrayBuffer {
        let buffer = new ArrayBuffer(2);
        let v1 = value & 0xff;
        let v2 = value >> 8 & 0xff;
        buffer[1] = v1;
        buffer[0] = v2;
        return buffer;
    }
    /**
    * int32 to bytes
    * @param num 
    */
    public static getInt32Bytes(value: number): ArrayBuffer {
        let buffer = new ArrayBuffer(4);
        buffer[3] = (value & 0xff);
        buffer[2] = (value >> 8 & 0xff);
        buffer[1] = (value >> 16 & 0xff);
        buffer[0] = (value >> 24 & 0xff);
        return buffer;
    }
    /**
     * int64 to bytes
     * @param num 
     */
    public static getInt64Bytes(num: number): ArrayBuffer {
        let buffer = new ArrayBuffer(8);
        let low = num;
        let hi = (num >> 32);
        buffer[3] = (low & 0xff);
        buffer[2] = (low >> 8 & 0xff);
        buffer[1] = (low >> 16 & 0xff);
        buffer[0] = (low >> 24 & 0xff);
        buffer[7] = (hi & 0xff);
        buffer[6] = (hi >> 8 & 0xff);
        buffer[5] = (hi >> 16 & 0xff);
        buffer[4] = (hi >> 24 & 0xff);
        return buffer;
    }
    /**
     * byte
     * @param buffer 
     */
    public static toInt8(buffer: ArrayBuffer,start?:number): number {
        let idx = start ? start : 0;
        return buffer[idx];
    }
    /**
     * 字节流转换int16
     * @param buffer 
     * @param start 
     */
    public static toInt16(buffer: ArrayBuffer, start?: number): number {
        let idx = start ? start : 0;
        let value1: number = buffer[idx] << 8;
        idx++;
        let value = value1 + buffer[idx];
        return value;
    }
    /**
     * 字节流转换成int32
     * @param buffer 
     * @param start 
     */
    public static toInt32(buffer: ArrayBuffer, start?: number): number {
        let idx = start ? start : 0;
        let v1 = buffer[idx] << 24;
        idx++;
        let v2 = buffer[idx] << 16;
        idx++;
        let v3 = buffer[idx] << 8;
        idx++;
        return v1 + v2 + v3 + buffer[idx];
    }
    /**
     * 字节流转换成int64
     * @param buffer 
     */
    public static toInt64(buffer: ArrayBuffer): number {

        let v1 = buffer[0] << 24;
        let v2 = buffer[1] << 16;
        let v3 = buffer[2] << 8 + buffer[3];
        let low = v1 + v2 + v3;
        let v4 = buffer[4] << 24;
        let v5 = buffer[5] << 16;
        let v6 = buffer[6] << 8 + buffer[7];

        let hi = v4 + v5 + v6;
        let value = (hi*256*256*256*256) + low;
        return value;
    }

}
