import UHandler from "./UHandler";

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
 * 作用:事件监听
 */
@ccclass
export default class UEventListener extends cc.Component {
    /**
     * 设置click监听事件
     * @param node 所需要监听的node
     */
    static get(node: cc.Node): UEventListener {
        let listener = node.getComponent(UEventListener);
        if (!listener)
            listener = node.addComponent(UEventListener);
        return listener;
    }
    /**
     * Node的click事件
     */
    onClick: UHandler;
    private _press: boolean;
    /**
     * 按钮触发
     */
    private ontouchdown(): void {
        this._press = true;
    }
    /**
     * 按钮抬起
     */
    private ontouchup(): void {
        if (this._press) {
            if (this.onClick) this.onClick.runWith(this.node);
        }
        this._press = false;
    }
    protected start(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.ontouchup, this);
        this.node.on(cc.Node.EventType.TOUCH_START, this.ontouchdown, this);
    }
    protected onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_END, this.ontouchup, this);
        this.node.off(cc.Node.EventType.TOUCH_START, this.ontouchdown, this);
        if (this.onClick) {
            this.onClick.clear();
            this.onClick = null;
        }
    }

}
