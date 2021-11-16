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

export enum EAxis {
    Horizontal = 1,
    Vertical = 2,
}
/**
 *创建:gj
 *作用:用于补充cc.Layout布局
 */
@ccclass
@cc._decorator.requireComponent(cc.Layout)
export default class ULayout extends cc.Component {
    /**
     * 重复的个数
     */
    @property({ type: cc.Integer, displayName: "重复的个数" })
    repeatCount: number = 1;
    /**
     * 轴
     */
    @property({ type: cc.Enum(EAxis), displayName: "轴" })
    axis: EAxis = EAxis.Horizontal;
    /**
     * 布局器
     */
    private _layOut: cc.Layout;
    /**
     * 子节点个数
     */
    private _lastChildCount: number;


    protected start(): void {
        this._layOut = this.getComponent(cc.Layout);
        this._lastChildCount = 0;
    }
    protected update(dt) {
        switch (this.axis) {
            case EAxis.Horizontal:
                {
                    this.updateHorizontal();
                }
                break;
            case EAxis.Vertical:
                {
                    this.updatevertical();
                }
                break;
        }

    }
    private updateHorizontal(): void {
        let curr = this.node.childrenCount;
        if (this._lastChildCount != curr) {
            this._lastChildCount = curr;
            let count = Math.ceil(curr / this.repeatCount);
            let xheight = this._layOut.paddingTop + count * this._layOut.cellSize.height + (count - 1) * this._layOut.spacingY;
            this.node.height = xheight;
        }
    }
    private updatevertical(): void {
        let curr = this.node.childrenCount;
        if (this._lastChildCount != curr) {
            this._lastChildCount = curr;
            let count = Math.ceil(curr / this.repeatCount);
            let xwidth = this._layOut.paddingLeft + count * this._layOut.cellSize.width + (count - 1) * this._layOut.spacingX;
            this.node.width = xwidth;
        }
    }
}
