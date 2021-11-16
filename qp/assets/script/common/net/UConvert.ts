// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 创建:sq
 * 作用:大端 int16 int32 int64 byte互转
 */
export default class UConvert {
    /**
    * byte to bytes
    * @param num 
    */
    public static getInt8Bytes(num: number): Uint8Array {
        let bs = new Uint8Array(1);
        bs[0] = (num);
        return bs;
    }
    /**
    * int16 to bytes
    * @param num 
    */
    public static getInt16Bytes(value: number): Uint8Array {
        let buffer = new Uint8Array(2);
        let v1 = value & 0xff;
        let v2 = value >> 8 & 0xff;
        buffer[1] = v2;
        buffer[0] = v1;
        return buffer;
    }
    /**
    * int32 to bytes
    * @param num 
    */
    public static getInt32Bytes(value: number): Uint8Array {
        let buffer = new Uint8Array(4);
        buffer[0] = (value & 0xff);
        buffer[1] = (value >> 8 & 0xff);
        buffer[2] = (value >> 16 & 0xff);
        buffer[3] = (value >> 24 & 0xff);
        return buffer;
    }
    /**
     * int64 to bytes
     * @param num 
     */
    public static getInt64Bytes(num: number): Uint8Array {
        let buffer = new Uint8Array(8);
        let low = num;
        let hi = (num / (256 * 256 * 256 * 256));
        buffer[0] = (low & 0xff);
        buffer[1] = (Math.floor(low / 256) & 0xff);
        buffer[2] = (Math.floor(low / (256 * 256)) & 0xff);
        buffer[3] = (Math.floor((low / (256 * 256 * 256))) & 0xff);

        buffer[4] = (hi & 0xff);
        buffer[5] = (Math.floor(hi / 256) & 0xff);
        buffer[6] = (Math.floor(hi / (256 * 256)) & 0xff);
        buffer[7] = (Math.floor(hi / (256 * 256 * 256)) & 0xff);
        return buffer;
    }
    /**
     * byte
     * @param buffer 
     */
    public static toInt8(buffer: Uint8Array): number {
        return buffer[0];
    }
    /**
     * 字节流转换int16
     * @param buffer 
     * @param start 
     */
    public static toInt16(buffer: Uint8Array, start?: number): number {
        let idx = start ? start : 0;
        let value = (buffer[idx] & 0xff) | ((buffer[idx + 1] & 0xff) << 8);
        return value;
    }
    /**
     * 字节流转换成int32
     * @param buffer 
     * @param start 
     */
    public static toInt32(buffer: Uint8Array, start?: number): number {
        let value: number = 0;
        let idx = start ? start : 0;
        value = ((buffer[idx] & 0xFF)
            | ((buffer[idx + 1] & 0xFF) << 8)
            | ((buffer[idx + 2] & 0xFF) << 16)
            | ((buffer[idx + 3] & 0xFF) << 24));
        return value;
    }
    /**
     * 字节流转换成int64
     * @param buffer 
     */
    public static toInt64(buffer: Uint8Array): number {

        let v1 = (buffer[3] & 0xFF) << 24;
        let v2 = (buffer[2] & 0xFF) << 16;
        let v3 = (buffer[1] & 0xFF) << 8;
        let low = v1 + v2 + v3 + (buffer[0] & 0xFF);
        let v4 = (buffer[7] & 0xFF) << 24;
        let v5 = (buffer[6] & 0xFF) << 16;
        let v6 = (buffer[5] & 0xFF) << 8;
        let v7 = buffer[4];
        let hi= v4 + v5 + v6 + v7;
        let value = (hi *256*256*256*256) + low;
        return value;
    }
}
