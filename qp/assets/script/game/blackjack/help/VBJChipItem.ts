
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UHandler from "../../../common/utility/UHandler";
import { BJ_SCALE } from "../MBJ";


const { ccclass, property } = cc._decorator;
/**
 * 创建:sq
 * 单个筹码
 */
@ccclass
export default class VChipItem extends cc.Component {

    recoverHandler: UHandler;
    /**
     * 筹码的唯一ID
     */
    private _objId: number;
    /**
     * 筹码的icon
     */
    private _icon: cc.Label;
    /**
     * 筹码的数值
     */
    private _chip: cc.Label;

    private _start: cc.Vec2;

    private _seatid: number;  //所属的区 0-4
    /**
    * 筹码的唯一ID
    */
    get objId(): number {
        return this._objId;
    }
    get seatid(): number {
        return this._seatid;
    }

    init(): void {
        this._icon = UNodeHelper.getComponent(this.node, "icon", cc.Label);
        this._chip = UNodeHelper.getComponent(this.node, "count", cc.Label);
    }
    /**
     * 
     * @param objId 
     * @param chipType 
     * @param chipCount 
     */
    bind(start: cc.Vec2, objId: number, seatid: number, frames: string, chipCount: number): void {
        this.node.active = true;
        this._objId = objId;
        //this._chip.string = Math.floor((chipCount * BJ_SCALE)).toString();
        this._chip.string = ""
        this._icon.string = "d";
        this._seatid = seatid;
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
    moveTo(end: cc.Vec2, isIn?: boolean, time?: number, value?: boolean): void {
        time = time || 0.5;
        isIn = isIn || false;
        this.node.stopAllActions()
        if (isIn) {
            this.node.runAction(cc.sequence(cc.moveTo(time, end), cc.callFunc(() => {
                if (value) this.node.active = false
            }, this)));
        }
        else {
            let action = cc.sequence(cc.moveTo(time, end).easing(cc.easeBackIn()), cc.callFunc(() => {
                if (value) this.node.active = false
                if (this.recoverHandler) this.recoverHandler.runWith(this);
            }, this));
            this.node.runAction(action);
        }
    }

    /**
     * 回收筹码
     * @param end 
     */
    moveToBack(end: cc.Vec2): void {
        let time = 0.35;
        this.node.runAction(cc.moveTo(time, end));
        let action = cc.sequence(cc.moveTo(time, end).easing(cc.easeBackIn()), cc.callFunc(() => {
            this.reset()
        }, this));
        this.node.runAction(action);
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
