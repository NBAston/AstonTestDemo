import IMsgHandler from "./IMsgHandler";
import protoMap from "../cmd/UOpcode";


/**
 * 创建:gj
 * 作用:解析protobuf协议
 */
export default class UProtoMsg implements IMsgHandler {
    /**
     * 反序列化
     * @param cmd 
     */
    unserialize(mainId: number, subId: number, buff: ArrayBuffer): any {
        let main = protoMap[mainId];
        if (!main) {
            throw new Error("未处理的命令，请在protoMap主命令" + mainId);
        }
        let proto = main[subId];
        if (!proto) {
            throw new Error("未处理的命令，请在主命令中添加子命令->主:" + mainId + "  子:" + subId);
        }
        return proto.response.decode(new Uint8Array(buff));
    }
    /**
     * 序列化
     * @param cmd 
     */
    serialize(mainId: number, subId: number, data: any): Uint8Array {
        let main = protoMap[mainId];
        if (!main) {
            throw new Error("未处理的命令，请在protoMap主命令" + mainId);
        }
        let proto = main[subId];
        if (!proto) {
            throw new Error("未处理的命令，请在主命令中添加子命令->主:" + mainId + "  子:" + subId);
        }
        let buf = proto.request.encode(data);
        return buf.finish();
    }
}
