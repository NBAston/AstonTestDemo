import UImgTxt from "../../common/utility/UImgTxt";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UHandler from "../../common/utility/UHandler";
import { ZJH_SCALE } from "./MZJH_hy";
import UDebug from "../../common/utility/UDebug";


const { ccclass, property } = cc._decorator;
/**
 * 创建:sq
 * 单个筹码
 */
@ccclass
export default class VZJHChipItem_hy extends cc.Component {

    recoverHandler: UHandler;
    /**
     * 筹码的唯一ID
     */
    private _objId: number;
    /**
     * 筹码的icon
     */
    private _icon: cc.Label;

    private _icon2: cc.Label;

    private _count2: cc.Label;
    /**
     * 筹码的数值
     */
    private _chip: cc.Label;

    private _start: cc.Vec2;
    /**
    * 筹码的唯一ID
    */
    get objId(): number {
        return this._objId;
    }

    private showgold(value: boolean): void {
        this._icon.node.active = !value;
        this._chip.node.active = !value;
        this._icon2.node.active = value;
        this._count2.node.active = value;
    }
    init(): void {
        this._icon = UNodeHelper.getComponent(this.node, "icon", cc.Label);
        this._chip = UNodeHelper.getComponent(this.node, "count", cc.Label);

        this._icon2 = UNodeHelper.getComponent(this.node, "icon_1", cc.Label);
        this._count2 = UNodeHelper.getComponent(this.node, "count_1", cc.Label);
        this.showgold(false);
    }
    /**
     * 
     * @param objId 
     * @param chipType 
     * @param chipCount 
     */
    bind(start: cc.Vec2, objId: number, frames: string, chipCount: number, chipState: number): void {
        this.node.active = true;
        this._objId = objId;
        this.showgold(chipState==2);
        if (chipState == 2) {
            this._count2.string = Math.floor((chipCount * ZJH_SCALE)).toString();
            this._icon2.string = frames;
            if(frames == "a"){
                this._count2.node.color = cc.color(115,156,96,255);
            }else if(frames == "b"){
                this._count2.node.color = cc.color(185,134,61,255);
            }else if(frames == "c"){
                this._count2.node.color = cc.color(59,149,175,255);
            }else if(frames == "d"){
                this._count2.node.color = cc.color(111,98,216,255);
            }else if(frames == "e"){
                this._count2.node.color = cc.color(191,107,60,255);
            }else if(frames == "f"){
                this._count2.node.color = cc.color(183,74,94,255);
            }
        } else {
            this._chip.string = Math.floor((chipCount * ZJH_SCALE)).toString();
            this._icon.string = frames;
            if(this._icon.string == "a"){
                this._chip.node.color = cc.color(115,156,96,255);
            }else if(this._icon.string == "b"){
                this._chip.node.color = cc.color(185,134,61,255);
            }else if(this._icon.string == "c"){
                this._chip.node.color = cc.color(59,149,175,255);
            }else if(this._icon.string == "d"){
                this._chip.node.color = cc.color(111,98,216,255);
            }else if(this._icon.string == "e"){
                this._chip.node.color = cc.color(191,107,60,255);
            }else if(this._icon.string == "f"){
                this._chip.node.color = cc.color(183,74,94,255);
            }
        }
        this.node.zIndex=objId;
        this.node.setPosition(start);
        this.node.setRotation(0);
    }
    /**
     * 移动
     * @param end 
     * @param rot 
     * @param rotAngel 
     * @param handler 
     */
    moveTo(end: cc.Vec2, rote: number, isIn?: boolean, time?: number): void {
        time = time || 0.35;
        isIn = isIn || false;
        if (isIn) {
            var seq = cc.sequence(
                cc.spawn(cc.moveTo(time, end).easing(cc.easeQuadraticActionOut()),
                    cc.fadeIn(time / 1.5),
                    cc.rotateBy(time, 0),
                    cc.scaleTo(time, 1.05)),
                cc.scaleTo(0.2, 1.0)
            );
            this.node.stopAllActions();
            this.node.runAction(seq);
        }
        else {

            let del_rand = Math.random() * 0.5;
            let del_time = Math.random() * 0.2;
            this.node.stopAllActions();
            this.node.runAction(cc.sequence(cc.delayTime(del_time), cc.moveTo(time, end).easing(cc.easeBackIn()), cc.fadeOut(0.1), cc.callFunc(() => {
                if (this.recoverHandler) this.recoverHandler.runWith(this);
            }, this)));
        }
    }
    /**移动还原回去 */
    moveBack(): void {
        let time = 0.2;
        this.node.stopAllActions();
        let action = cc.sequence(cc.moveTo(time, this._start), cc.callFunc(() => {
            if (this.recoverHandler) this.recoverHandler.runWith(this);
        }, this));
        this.node.runAction(action);
    }
    reset(): void {
        this.node.active = false;
        this.node.stopAllActions();
    }
    onDestroy() {
        if (this.recoverHandler) {
            this.recoverHandler.clear();
        }
    }
}   
