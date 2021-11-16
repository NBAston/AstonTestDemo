import AppGame from "../../public/base/AppGame";
import UQZJHScene from "./UQZJHScene";
import UQZJHHelper from "./UQZJHHelper";

const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:拼牌的牌
 */
@ccclass
export default class VQZJHPinCard extends cc.Component {

    // private _sprite :cc.Sprite = null;
    eventTarget: cc.EventTarget = new cc.EventTarget();

    /**牌值 */
    private _cardvalue: number = 0;
    /**该父节点下的坐标 */
    private _localpos: cc.Vec2 = null;
    /**初始y */
    private _posy: number = -15;

    /**cardvalue 外部接口 */
    set setCardValue(num: number) {
        this._cardvalue = num;
    }
    get cardValue(): number {
        return this._cardvalue;
    }
    /**初始坐标 */
    set setfirstLocalPos(pos: cc.Vec2) {
        this._localpos = pos;
    }
    get firstLocalPos(): cc.Vec2 {
        return this._localpos;
    }

    /**牌是否选中弹起 */
    private _isUp = false;

    setIsUp(b: boolean) {
        this._isUp = b;

        if(b)
        {
            UQZJHScene.ins.getMusic.playSelect();
        }
    }
    get isUp(): boolean {
        return this._isUp;
    }
    /**是否锁住不往上 */
    private _isLock: boolean = false
    setIsLock(b: boolean) {
        this._isLock = b;
    }
    get isLock(): boolean {
        return this._isLock;
    }

    /**牌索引 */
    private _index: number = 0;
    set setIndex(i: number) {
        this._index = i;
    }
    get getIndex(): number {
        return this._index;
    }


    start() {
        // this._sprite = this.node.getComponent(cc.Sprite);

        if (this._localpos == null) { this._localpos = this.node.getPosition(); }

        this.setIsUp(false);
        var self = this;
        this.node.on(cc.Node.EventType.TOUCH_END, (event) => {


            if (!self._isUp) {

                if (!self._isLock) {

                    self.node.setPosition(self._localpos.x, self._localpos.y + 20);
                    self.setIsUp(true);

                    AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_PINPAI_ADD, self._cardvalue, self._index);
                }
            }
            else {
                self.node.setPosition(self._localpos);
                self.setIsUp(false);

                AppGame.ins.qzjhModel.emit(UQZJHHelper.QZJH_SELF_EVENT.QZJH_PINPAI_DEL, self._cardvalue, self._index);
            }


        });
    }

    onEnable() {
        this.setIsUp(false);
    }


}
