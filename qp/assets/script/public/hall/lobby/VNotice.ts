import UNodeHelper from "../../../common/utility/UNodeHelper";


const { ccclass, property } = cc._decorator;
/**
 * 创建:sq
 * 作用:公告栏
 */
@ccclass
export default class VNotice extends cc.Component {

    /**根节点 */
    private _root: cc.Node;
    /**内容 */
    private _content: cc.RichText;
    /**遮罩节点 */
    private _mask: cc.Node;
    /**开始的位置 */
    private _startPos: cc.Vec2;

    protected start() {
        this._root = UNodeHelper.find(this.node, "content");
        this._mask = UNodeHelper.find(this.node, "content/mask");
        this._content = UNodeHelper.getComponent(this._mask, "content", cc.RichText);
        this._startPos = new cc.Vec2(this._mask.width * 0.5 + 10, 0);
    }
    protected update(dt: number): void {

    }
}
