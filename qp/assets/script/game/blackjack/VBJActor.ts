import UNodeHelper from "../../common//utility/UNodeHelper";
import UDebug from "../../common/utility/UDebug";
const { ccclass, property } = cc._decorator;
/**
 * 创建:dw/dz
 * 作用:练手-角色类 和一些测试代码
 */
@ccclass
export default class VBJActor extends cc.Component {
    /**
    * 是否轮到该玩家
    */
    private _myturn: boolean = false;
    /**
    * 剩余时间
    */
    private _turntime: number = 0;
    /** cd图片obj*/
    private _cd: cc.Sprite = null;
    /** cd时间*/
    private _cdTime: number = 10;
    /** 角色信息node*/
    private _roleInfoNode: cc.Node = null;
    /**头像*/
    private _headIcon: cc.Sprite = null;
    /**金币*/
    private _gold: cc.Label = null;
    /**名字*/
    private _name: cc.Label = null;
    /**获得金币*/
    private _getCoin: cc.Label = null;
    /**下注 */
    private _xiazhu: cc.Node = null;

    /**下注区域 */
    private _xiazhu_1: cc.Sprite = null;
    /**下注区域亮 */
    private _xiazhu_2: cc.Sprite = null;
    /**保险 */
    private _baoxian: cc.Sprite = null;
    /**顺序 */
    private _shunxu: cc.Sprite = null;
    /**顺序字体 */
    private _label_shunxu: cc.Label = null;
    /**光标标识 编辑器赋值 */
    @property(cc.Sprite)
    curindex: cc.Sprite = null;
    // onLoad () {}

    /**target 发牌器  */
    @property(cc.Sprite)
    sendCardPicArea: cc.Sprite = null;


    start() {
        this._roleInfoNode = UNodeHelper.find(this.node, "info");
        this._cd = UNodeHelper.getComponent(this._roleInfoNode, "cd", cc.Sprite);

        this._headIcon = UNodeHelper.getComponent(this._roleInfoNode, "headicon", cc.Sprite);
        this._baoxian = UNodeHelper.getComponent(this._roleInfoNode, "baoxian", cc.Sprite);

        this._xiazhu = UNodeHelper.find(this.node, "xiazhu");

        this._xiazhu_1 = UNodeHelper.getComponent(this._xiazhu, "xiazhuArea_1", cc.Sprite);
        this._xiazhu_2 = UNodeHelper.getComponent(this._xiazhu, "xiazhuArea_2", cc.Sprite);

        this._gold = UNodeHelper.getComponent(this._roleInfoNode, "gold", cc.Label);
        this._name = UNodeHelper.getComponent(this._roleInfoNode, "name", cc.Label);
        this._getCoin = UNodeHelper.getComponent(this._roleInfoNode, "getCoin", cc.Label);

        this._shunxu = UNodeHelper.getComponent(this._roleInfoNode, "shunxu", cc.Sprite);
        this._label_shunxu = UNodeHelper.getComponent(this._roleInfoNode, "label_shunxu", cc.Label);

        this.testDtAni();
        // this.testBJAni();
        if (this.sendCardPicArea != null) {
            // this.testClickMutile();
        }
        this.testMutilTouch();

        // this.testCurIndex(30);
        // this.schedule(this.circleMove, 0.01);

    }
    /**设置顺序是否显示
     * visable 是否激活
     */
    setShunXuActive(visable: boolean): void {
        this._shunxu.node.active = visable
        this._label_shunxu.node.active = visable
    }
    /**设置顺序序号
     * index 序号
     */
    setShunXuNum(index?: number): void {
        this._label_shunxu.string = index.toString();
    }

    /**not use */
    getRotatePos(angel: number, targetPoint: cc.Vec2, nowPoint: cc.Vec2): cc.Vec2 {
        var pos: cc.Vec2 = new cc.Vec2(0, 0);
        let posx = Math.cos(angel) * (nowPoint.x - targetPoint.x) -
            Math.sin(angel) * (nowPoint.y - targetPoint.y) + targetPoint.x;
        let posy = Math.sin(angel) * (nowPoint.x - targetPoint.x) -
            Math.cos(angel) * (nowPoint.y - targetPoint.y) + targetPoint.y;
        pos = cc.v2(posx, posy);
        return pos;
    }

    /**测试下注闪烁动画 */
    testBJAni(): void {
        this._myturn = true;
        this._xiazhu_2.node.active = true;
        if (this._xiazhu_2.node.active == true) { //this._xiazhu_2 && this._xiazhu_2.node && 
            this._xiazhu_2.node.runAction(cc.blink(20, 30));
            // this._xiazhu_2.node.runAction(cc.repeat(cc.sequence(cc.fadeTo(1, 0), cc.fadeTo(1, 1)), 5));
        }
    }

    /**
    * 测试cd动画
    */
    testDtAni(): void {
        this._myturn = true;
        this._turntime = 10;
        this._cdTime = 10;

        this._cd.node.active = true;

        this._cd.fillStart = 0.16;//0.16:从右上角开始 0.25:从上 中点开始  0.35:从上左点开始
        this._cd.fillRange = 1;
    }

    testMutilTouch(): void {

        let back = UNodeHelper.find(this.node, "info/back");

        //on 要加在size不为(0,0)的节点上
        back.on(cc.Node.EventType.MOUSE_ENTER, (touches) => {
            // for(let i = 0; i < touches.length; i++){
            //     var pos = new cc.Node("touch" + i)
            //     var text = pos.addComponent(cc.Label);
            //     text.string = "X = " + touches[i].getLocation().x.toFixed(2) + "---Y = " + touches[i].getLocation().y.toFixed(2);
            //     text.fontSize = 30;
            //     pos.setPosition(0, 0);
            //     cc.find("Canvas/battle").addChild(pos);
            // }
            // return true;
        }, this);
        // back.on(cc.Node.EventType.TOUCH_MOVE,(touches,event)=>{
        // },this);

    }

    time: number = 0;


    update(dt) {
        if (this._myturn) {
            this._turntime -= dt;
            if (this._turntime > 0) {
                this._cd.fillRange = this._turntime / this._cdTime;


            } else {
                this._myturn = false;
                this._cd.node.active = false;

                this._xiazhu_2.node.stopAllActions();
                this._xiazhu_2.node.active = false;
            }
            // || && !
        }
        /**可实现 不过有小问题 */
        // if (this._testRotate == true) {
        //     this.radian += dt * (this.Speed / 100);
        //     var angle = 0;
        //     if (this.targetAngle > 0) {
        //         angle = 360 - 180 / Math.PI * this.radian; //360- 逆时针
        //     }
        //     else {
        //         angle = 180 / Math.PI * this.radian;//顺时针
        //     }
        //     this.curindex.node.rotation = angle;
        //     if (Math.ceil(angle) == this.targetAngle) {
        //         this._testRotate = false;
        //     }
        // }

        /**绕某点做圆周运动 notuse */
        // {
        //     let r = 80;
        //     this.curindex.node.setPosition(cc.v2(Math.cos(this.time * 2) * r, Math.sin(this.time * 2) * r));
        //     this.time -= dt;
        // } 

    }




    /**测试当前光标
     * angle 角度 work
     */
    testCurIndex(angle: number) {
        // let windowSize = cc.winSize;
        // var pos = this.getRotatePos(angle, cc.v2(windowSize.width / 2, windowSize.height),
        //     cc.v2(this.curindex.node.getPosition().x, this.curindex.node.getPosition().y));
        // this.curindex.node.setPosition(pos.x, pos.y);

        this._testRotate = true;
        this.targetAngle = angle;
        //变速移动
        let moveTo = cc.rotateTo(1, this.targetAngle).easing(cc.easeInOut(3));
        //回调函数
        let callfunc = cc.callFunc(function () {

        }, this);
        //让sprite移动
        this.curindex.node.runAction(cc.sequence(moveTo, callfunc));
    }
    buttonClick(event, CustomEventData) {
        this.testCurIndex(parseInt(CustomEventData));
    }

    ///// 测试光标 
    // 圆心
    circleCenter: cc.Vec2 = cc.v2(0, 360);

    // 半径
    circleRadius: number = 360;

    // 速度
    Speed: number = 200;
    // 弧度
    radian: number = 0;
    targetAngle: number = 0;
    _testRotate: boolean = false;
    /**圆周运动 test code*/
    circleMove(dt) {
        // 先计算弧度
        this.radian += dt * (this.Speed / 100);
        let x = this.circleRadius * Math.cos(this.radian) + this.circleCenter.x;
        let y = this.circleRadius * Math.sin(this.radian) + this.circleCenter.y;
        let angle = 360 - 180 / Math.PI * this.radian;
        this.curindex.node.rotation = angle;
        // this.curindex.node.position = cc.v2(x, y);
    }
    ////////


}
