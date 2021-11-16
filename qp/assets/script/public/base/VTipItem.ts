import UNodeHelper from "../../common/utility/UNodeHelper";

/**
 * tipitem
 */
export default class VTipItem {
    /**
     * 内容
     */
    private _content: cc.Label;
    /**
     * 节点
     */
    private _node: cc.Node;
    /**
     * 是否处于运行状态
     */
    private _isRun: boolean;
    /**
     * 停留多少时间
     */
    private _duration: number;

    private _contentStr: string;

    isSame(content: string): boolean {
        if (content == this._contentStr) {
            return true;
        }
        return false;
    }

    init(node: cc.Node): void {
        this._node = node;
        this._content = UNodeHelper.getComponent(this._node, "content", cc.Label);
        this._isRun = false;
        this._duration = 0;
        this.setActivity(false);
    }
    pos(x: number, y: number): void {
        this._node.setPosition(x, y);
    }
    setActivity(value: boolean): void {
        this._node.active = value;
        this._isRun = true;
    }
    /**
     * 绑定数据
     * @param content 
     */
    bind(content: string, time: number): void {
        this._contentStr = content;
        this._content.string = content;
        this.setActivity(true);
        this._node.opacity = 255;
        this._duration = time;

        let or: any = this._content;
        // or._updateRenderData(true);
        this._content._forceUpdateRenderData(true)
        let len = 100 + this._content.node.width;
        this._node.width = len;
        // if (len > 143) {
        //     this._back.width = len;
        // } else {
        //     this._back.width = 143;
        // }
    }
    /**
     * 帧更新
     * @param dt 
     */
    update(dt: number): boolean {
        if (!this._isRun) return true;
        this._duration -= dt;
        if (this._duration < 0) {
            let op = this._node.opacity - 255 * dt;
            if (op > 0) {
                this._node.opacity = op;
            } else {
                this._isRun = false;
                return true;
            }
        }
        return false;
    }
}
