import UNodeHelper from "../../common/utility/UNodeHelper";
import UResManager from "../../common/base/UResManager";
import { EIconType } from "../../common/base/UAllenum";
import USpriteFrames from "../../common/base/USpriteFrames";
import { ZJH_SCALE } from "./MZJH_hy";
import UStringHelper from "../../common/utility/UStringHelper";
import AppGame from "../../public/base/AppGame";



/**
 * 创建:sq
 * 比牌玩家
 */
export default class VZJHComparePlayer_hy {
    /**节点 */
    private _node: cc.Node;
    /**头像 */
    private _headIcon: cc.Sprite;
    /**名字 */
    private _name: cc.Label;
    private _gold:cc.Label;
    private _vip:cc.Label;
    private _headBox:cc.Sprite;
    /**赢 */
    private _win: sp.Skeleton;
    private _lose: sp.Skeleton;
    private _poker1: cc.Sprite;
    private _poker2: cc.Sprite;
    private _poker3: cc.Sprite;

    private _pai: cc.Node;
    private _res: USpriteFrames;
    private _isLeft: boolean;
    get pai(): cc.Node {
        return this._pai;
    }
    get node(): cc.Node {
        return this._node;
    }
    constructor(node: cc.Node, pai: cc.Node, res: USpriteFrames, isLeft: boolean) {
        this._node = node;
        this._pai = pai;
        this._res = res;
        this._isLeft = isLeft;
        this._headIcon = UNodeHelper.getComponent(node, "headicon", cc.Sprite);
        this._name = UNodeHelper.getComponent(node, "name", cc.Label);
        this._gold = UNodeHelper.getComponent(node, "gold", cc.Label);
        this._win = UNodeHelper.getComponent(node, "win", sp.Skeleton);
        this._lose = UNodeHelper.getComponent(node, "lose", sp.Skeleton);
        this._poker1 = UNodeHelper.getComponent(pai, "poker1", cc.Sprite);
        this._poker2 = UNodeHelper.getComponent(pai, "poker2", cc.Sprite);
        this._poker3 = UNodeHelper.getComponent(pai, "poker3", cc.Sprite);
        this._vip=UNodeHelper.getComponent(node,"viplv",cc.Label);
        this._headBox=UNodeHelper.getComponent(node,"frame_0",cc.Sprite);

        this._lose.setCompleteListener(() => {
            this._lose.node.active = false;
        });
    }
    /**绑定数据 */
    bind(nickName: string, headId: number,gold:number,vip:number,headboxId:number,headImgUrl:string): void {
        this.setNodeactive(true);
        this._name.string = nickName;
        this._gold.string = (gold*ZJH_SCALE) + "";
        this._vip.string=vip.toString();
        UResManager.load(headboxId, EIconType.Frame, this._headBox);
        UResManager.load(headId, EIconType.Head, this._headIcon,headImgUrl);
    }
    /**綁定牌 */
    bindpai(poker: Array<string>): void {
        this.setPaiActive(true);
        this._poker1.spriteFrame = this._res.getFrames(poker[0]);
        this._poker2.spriteFrame = this._res.getFrames(poker[1]);
        this._poker3.spriteFrame = this._res.getFrames(poker[2]);
    }
    /**显示 */
    setNodeactive(value: boolean): void {
        this._node.active = value;
        if (!value) {
            this._win.node.active = false;
            this._lose.node.active = false;
        }
    }
    setPaiActive(value: boolean): void {
        this._pai.active = value;
    }
    /**显示胜利 */
    showwin() {
        this._win.node.active = true;
        this._win.setAnimation(0, "animation", false);
    }
    /**隐藏胜利 */
    hidewin(): void {
        this._win.node.active = false;
    }
    /**显示失败效果 */
    showlose(): void {
        let offset = this._isLeft ? -10 : 10;
        let ac = cc.sequence(cc.rotateTo(0.2, offset).easing(cc.easeBackOut()), cc.rotateTo(0.2, 0).easing(cc.easeBackOut()));
        this._node.runAction(ac);
        this._lose.node.active = true;
        this._lose.setAnimation(0, "animation", false);
    }
    reset():void{
        this.hidewin();
        this.setPaiActive(false);
        this.setNodeactive(false);
        this._lose.node.active=false;
        this._win.node.active=false;
        this._node.stopAllActions();
    }
}
