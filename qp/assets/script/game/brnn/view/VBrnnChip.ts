
const { ccclass, property } = cc._decorator;
/**
 * 百人牛牛 筹码管理
 */


export default class VBrnnChip {

    private _node_root: cc.Node = null;

    private _rect: number = 0;   // 所属区域  

    private _type: number = 0;    // 筹码类型   1，2，3，4，5，6

    private _userid: number = 0;   // 所属用户
    

    constructor(root: cc.Node) {
        this._node_root = root;
        this.init();
    }

    init() {

    }


    moveTo(pos: cc.Vec2, funcBack: Function) {
        var delt_time = 0.4;
        var pos1 = pos;
        var pos2 = this._node_root.getPosition();
        var anit_x = (pos2.x - pos1.x) / 15;
        var anit_y = (pos2.y - pos1.y) / 15;
        this._node_root.stopAllActions();
        this._node_root.runAction(cc.sequence(cc.moveBy(delt_time * 0.5, anit_x, anit_y), cc.moveTo(delt_time, pos).easing(cc.easeQuadraticActionOut()),
            cc.callFunc(funcBack)));
    }



    betToRect(stop_pos: cc.Vec2, funcBack: Function, isself: boolean = false) {
        var act_time = 0.6;
        this._node_root.opacity = 200;
        var disc_scale = 0.35;
        var dt_time = Math.random() * 0.05;
        var rote = Math.random() * 180;
        this._node_root.scale = disc_scale;

        if (isself)
            dt_time = 0;

        var seq = cc.sequence(cc.delayTime(dt_time),
            cc.spawn(cc.moveTo(act_time, stop_pos).easing(cc.easeQuadraticActionOut()),
                cc.fadeIn(act_time / 1.5),
                cc.rotateBy(act_time, rote),
                cc.scaleTo(act_time, disc_scale * 1.1)),
            cc.scaleTo(0.2, disc_scale),
            cc.callFunc(funcBack));

        this._node_root.stopAllActions();
        this._node_root.runAction(seq);
    }

    hide() {
        this._node_root.opacity = 0;
    }

    show() {
        this._node_root.opacity = 255;
    }
}
