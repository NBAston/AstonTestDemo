import IMsgHandler from "./IMsgHandler";
import ByteArray from "./socket/ByteArray";

/**
 * 创建:gj
 * 作用:处理json格式消息
 */
export default class UJsonMsg implements IMsgHandler {

    unserialize(mainId: number, subId: number, buff: any): any {
        return mainId;
    }
    serialize(maiId: number, sub: number, data: any): Uint8Array {
        return data;
    }

}
