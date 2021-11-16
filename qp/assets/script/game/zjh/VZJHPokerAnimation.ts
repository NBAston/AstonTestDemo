import UHandler from "../../common/utility/UHandler";
// import ShaderMaterial from "../../common/shader/ShaderMaterial";
// import ShaderManager from "../../common/shader/ShaderManager";
// import FanPaiShader from "../../common/shader/FanPaiShader";
import URandomHelper from "../../common/utility/URandomHelper";


const { ccclass, property } = cc._decorator;
const grayColor: cc.Color = new cc.Color(125, 125, 125);
const normalColor: cc.Color = new cc.Color(255.0, 255.0, 255.0);
/**
 * 扑克牌的动画效果
 */
@ccclass
export default class VZJHPokerAnimation extends cc.Component {

    private _state: number = 1;
    // private _mat: ShaderMaterial;
    private _sprite: cc.Sprite;

    protected start(): void {
        // this._mat = new ShaderMaterial().create(new FanPaiShader());
        // this._mat.setProperty("instanceid", URandomHelper.random());

        // cc.loader.setAutoRelease(this._mat);
        // this._mat = ShaderManager.useShader(this._sprite, new FanPaiShader());
        // this._mat.setMainTexture(this._sprite.spriteFrame.getTexture());
        // this._mat.setProperty("instanceid", URandomHelper.random());
        // this._sprite.setState(cc.Sprite.State.NORMAL);
    }
    init(): void {
        this._sprite = this.getComponent(cc.Sprite);
        this._back = this._sprite.spriteFrame;
    }
    /**
    * 0表示叠加灰色 1表示正常
    * @param state 
    */
    setState(state: number): void {
        if (this._state == state) return;
        this._state = state;
        this.node.color = state == 0 ? grayColor : normalColor;
    }
    /**播放发牌动作 0.2秒 */
    playFapai(start: cc.Vec2, end: cc.Vec2, startScale: number, delay?: number, handler?: UHandler): void {

        this.node.setPosition(start);
        this.node.setScale(startScale);
        this.node.setRotation(180);
        this.scheduleOnce(() => {
            let action = cc.spawn(cc.moveTo(0.1, end), cc.scaleTo(0.1, 1.0), cc.rotateTo(0.1, 360));
            this.node.runAction(cc.sequence(action, cc.callFunc(() => {
                this.node.setRotation(0);
                if (handler) handler.run();
            })));
        }, delay);

    }
    free(): void {
        this.node.stopAllActions();
        this.unscheduleAllCallbacks();
    }

    private _isback: boolean = false;
    private _play: boolean = false;
    private _dt: number = 0;
    private _front: cc.SpriteFrame;
    private _back: cc.SpriteFrame;
    hander: UHandler;
    /**播放翻牌 */
    playfanpai(front: cc.SpriteFrame, delay: number): void {
        // this._front = front;
        // this.scheduleOnce(() => {
        //     this._sprite.spriteFrame = this._back;
        //     ShaderManager.activeMat(this._sprite, this._mat);
        //     let vct = this.node.convertToWorldSpaceAR(new cc.Vec2(0, 0));
        //     this._mat.setProperty("offset", vct.x);
        //     this._mat.setProperty("angel", 0);
        //     this._isback = true;
        //     this._play = true;
        //     this._dt = 0;
        //     let ac = cc.scaleTo(0.2, 1.2);
        //     this.node.runAction(cc.sequence(ac, cc.scaleTo(0.2, 1)));
        // }, delay + 0.01);
    }
    /**进度 */
    private process(value: number): void {
        // let angel = -value * 180;
        // let vct = this.node.convertToWorldSpaceAR(new cc.Vec2(0, 0));
        // this._mat.setProperty("offset", vct.x);
        // this._mat.setProperty("angel", angel);
        // if (angel < -90 && this._isback) {
        //     this._isback = false;
        //     this._sprite.spriteFrame=this._front;
        //     ShaderManager.activeMat(this._sprite, this._mat);
        // }
    }
    update(time: number): void {
        if (!this._play) return;
        this._dt += 2.5 * time;
        if (this._dt < 1) {
            this.process(this._dt);
        } else {
            this.process(1);
            this._play = false;
            this._sprite.spriteFrame = this._front;
            if (this.hander) this.hander.run();
        }
    }
}
