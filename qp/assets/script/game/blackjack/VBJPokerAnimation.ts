import UHandler from "../../common/utility/UHandler";


const { ccclass, property } = cc._decorator;
const grayColor: cc.Color = new cc.Color(125, 125, 125);
const normalColor: cc.Color = new cc.Color(255.0, 255.0, 255.0);
/**
 * 扑克牌的动画效果
 */
@ccclass
export default class VBJPokerAnimation extends cc.Component {
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
    /**播放发牌动作 0.1秒 */
    playFapai(start: cc.Vec3, end: cc.Vec2, startScale: number, delay?: number, handler?: UHandler): void {
        this.node.setPosition(start);
        this.node.setRotation(293);
        //this.scheduleOnce(() => {
            
            this.node.active =true ;
            let action = cc.spawn(cc.moveTo(0.1, end), cc.rotateTo(0.1, 360));
            this.node.stopAllActions()
            this.node.runAction(cc.sequence(action, cc.callFunc(() => {
                this.node.setRotation(0);
                if (handler) handler.run();
            })));
       // }, delay);
    }
    free():void{
        this.node.stopAllActions();
        this.unscheduleAllCallbacks();
    }
}
