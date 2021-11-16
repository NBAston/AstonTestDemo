import USpriteFrames from "../../common/base/USpriteFrames";
import { EFlagState } from "./UZJHClass";
import { ELeftType } from "../../common/base/UAllenum";
import UStringHelper from "../../common/utility/UStringHelper";
import UNodeHelper from "../../common/utility/UNodeHelper";

/**
 * 创建:sq
 * 作用:管理flag状态
 */
export default class VZJHFlag {
    /**常驻的节点 */
    private _costNode: cc.Node;
    /**移动的节点 */
    private _moveNode: cc.Node;
    /**资源 */
    private _res: USpriteFrames;
    /**常驻节点内容 */
    private _constContent: cc.Sprite;
    /**移动节点的内容 */
    private _moveContet: cc.Sprite;
    /**目标位置 */
    private _targetFlag: cc.Vec2;
    /**源flag */
    private _oriFlag: cc.Vec2;
    constructor(costNode: cc.Node, moveNode: cc.Node, res: USpriteFrames) {
        this._costNode = costNode;
        this._moveNode = moveNode;
        this._constContent = UNodeHelper.getComponent(costNode, "flag_icon", cc.Sprite);
        this._moveContet = UNodeHelper.getComponent(moveNode, "icon", cc.Sprite);
        this._oriFlag = new cc.Vec2(moveNode.x, moveNode.y);
        this._targetFlag = new cc.Vec2(this._moveNode.x, this._moveNode.y + 20);
        this._res = res;
    }
    bind(state: EFlagState, withAnimation: boolean = true): void {
        let constStr = "";
        let moveStr = "";
        switch (state) {
            case EFlagState.GenZhu:
                constStr = "zjh_headtext_gz";
                moveStr = "zjh_talktext_gz";
                break;
            case EFlagState.JiaZhu:
                constStr = "zjh_headtext_jz";
                moveStr = "zjh_talktext_jz";
                break;
            case EFlagState.KanPai:
                constStr = null;
                moveStr = "zjh_talktext_kp";
                break;
            case EFlagState.QiPai:
                constStr = "zjh_headtext_qp";
                moveStr = "zjh_talktext_qp";
                break;
        }
        this.setContent(constStr, moveStr, withAnimation);
    }
    reset(): void {
        this._moveNode.stopAllActions();
        this._moveNode.active = false;
        this._costNode.active = false;
    }
    private setContent(constStr: string, moveStr: string, withAnimation: boolean): void {
        if (!UStringHelper.isEmptyString(constStr)) {
            this._costNode.active = true;
            this._constContent.spriteFrame = this._res.getFrames(constStr);
        }
        this._moveContet.spriteFrame = this._res.getFrames(moveStr);
        this._moveNode.active = true;
        if (withAnimation) {
            this._moveNode.stopAllActions();
            this._moveNode.setPosition(this._oriFlag);
            this._moveNode.setScale(0, 0);
            this._moveNode.runAction(cc.sequence(cc.scaleTo(0.2, 1), cc.moveTo(0.5, this._targetFlag), cc.moveTo(0.5, this._targetFlag), cc.callFunc(() => {
                this._moveNode.active = false;
            }, this)));
        }
    }
}
