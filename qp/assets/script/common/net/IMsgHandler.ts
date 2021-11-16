
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
 *  创建:gj
 * 作用:消息处理接口
 */
export default interface IMsgHandler {
    /**
     * 序列换
     * @param data  需要发送的对象
     */
    serialize(mainId: number, subId: number, data: any): Uint8Array;
    /**
     * 反序列号
     * @param cmd 收到的命令
     */
    unserialize(mainId: number, subId: number, buff: ArrayBuffer): any;
}
