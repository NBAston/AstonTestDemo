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
 * 创建:sq
 * 发送msg消息的时候 禁止玩家操作
 */
@ccclass
export default class VShowMsg extends cc.Component {
    /** 
     * msglabel
    */
    private _msgLable: cc.Label;
    /**
     * 禁止点击
     */
    private _back: cc.Button;

    onLoad() { }

    start() {

    }

    // update (dt) {}
}
