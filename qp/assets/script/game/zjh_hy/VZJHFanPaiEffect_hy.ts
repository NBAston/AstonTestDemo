// import ShaderMaterial, { SpriteShader } from "../../common/shader/ShaderMaterial";
// import ShaderManager from "../../common/shader/ShaderManager";
// import FanPaiShader from "../../common/shader/FanPaiShader";
import UHandler from "../../common/utility/UHandler";


export enum EActionState {
    /**idle */
    Idle,
    /**发牌 */
    FaPai,
    /**翻牌 */
    FanPai,
}

const { ccclass, property, requireComponent } = cc._decorator;
@ccclass
@requireComponent(cc.Sprite)
export default class VZJHFanPaiEffect_hy extends cc.Component {
    /**
     * 背面图片
     */
    @property(cc.SpriteFrame)
    back: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    font: cc.SpriteFrame = null;
    @property(cc.Float)
    color: number = 0;
    hander: UHandler;
    private _state: EActionState;
    /**
     * 前面图片
     */
    private _front: cc.SpriteFrame;
    /**
     * 材质
     */
    private _mat: any;
    /**
     * sp
     */
    private _sprite: cc.Sprite;
    /**
     * 是否处于back
     */
    private _isback: boolean;
    /**
     * 播放动画
     */
    private _play: boolean;
    /**
     * 时间
     */
    private _dt: number;
    /**初始化 */
    private _isInit: boolean;
    /**收到的命令 */
    private _cmds: Array<any> = [];
    /**
     * 初始化
     */
    start() {
        //this.init();
        this._sprite = this.getComponent(cc.Sprite);
        this._sprite.spriteFrame = this.back;
        // this._mat = ShaderManager.useSpriteSpine(this._sprite, new FanPaiShader());
        this._mat.setMainTexture(this.back.getTexture());
        this._mat.setProperty("color", { x: this.color, y: this.color, z: this.color, w: 1.0 })
        this._mat.setProperty("angel", 0);
    }
    /**
     * 播放动画
     */
    playFanPai(poker: cc.SpriteFrame, delay: number): void {
        this._state = EActionState.FanPai;
        this.scheduleOnce(() => {
            this._mat.setProperty("angel", 0);
            this._isback = true;
            this._play = true;
            this._dt = 0;
            let ac = cc.scaleTo(0.2, 1.3);
            this.node.runAction(ac);
            this.scheduleOnce(() => {
                let ac2 = cc.scaleTo(0.2, 1);
                this.node.runAction(ac2);
            }, 1);
        }, delay + 0.01);
    }
    /**进度 */
    private process(value: number): void {
        let angel = -value * 180;
        let vct = this.node.convertToWorldSpaceAR(new cc.Vec2(0, 0));
        this._mat.setProperty("offset", vct.x);
        this._mat.setProperty("angel", angel);
        if (angel < -90 && this._isback) {
            this._isback = false;
            this._mat.setMainTexture(this.font.getTexture());
        }
    }
    update(time: number): void {
        if (!this._play) return;
        this._dt += 2.5 * time;
        if (this._dt < 1) {
            this.process(this._dt);
        } else {
            this.process(1);
            this._play = false;
            if (this.hander) this.hander.run();
            this._state = EActionState.Idle;
        }
    }
}
