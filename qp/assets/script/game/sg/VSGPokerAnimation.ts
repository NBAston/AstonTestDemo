import UHandler from "../../common/utility/UHandler";
// import ShaderMaterial from "../../common/shader/ShaderMaterial";
// import ShaderManager from "../../common/shader/ShaderManager";
// import FanPaiShader from "../../common/shader/FanPaiShader";
import AppGame from "../../public/base/AppGame";
import USGHelper from "./USGHelper";
import VSG from "./VSG";

const { ccclass, property } = cc._decorator;

const grayColor: cc.Color = new cc.Color(125, 125, 125);
const normalColor: cc.Color = new cc.Color(255.0, 255.0, 255.0);

// const grayColor = { r: 0.5, g: 0.5, b: 0.5 };
// const normalColor = { r: 1.0, g: 1.0, b: 1.0 };
/**
 * 创建:dz
 * 作用:扑克牌的动画效果
 */
@ccclass
export default class VSGPokerAnimation extends cc.Component {


    //#region animation
    private _state: number = 1;
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
    playFapai(start: cc.Vec2, end: cc.Vec2, startScale: number, endScale: number, delay?: number, handler?: UHandler): void {
        this.node.setPosition(start);
        this.node.setScale(startScale);
        this.node.angle = 0;

        delay = delay || 0;
        let action = cc.spawn(cc.moveTo(0.2, end), cc.scaleTo(0.2, endScale), cc.rotateTo(0.2, 360));
        this.node.runAction(cc.sequence(cc.delayTime(delay), action, cc.callFunc(() => {
            this.node.angle = 0;
            this.node.setPosition(end);//确保最后位置对
            if (handler) handler.run();

            if (delay == 0.2)//最后一张
            {
                AppGame.ins.sgModel.emit(USGHelper.SG_SELF_EVENT.SG_MOVE_NEXT_CMD);
            }
            VSG.ins.music.playSendCard();
        })));


        // this.scheduleOnce(() => {
        // }, delay);
    }

    free(): void {
        this.node.stopAllActions();
        // this.unscheduleAllCallbacks();
    }

    //#endregion
}
