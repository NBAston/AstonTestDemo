import UHandler from "./UHandler";
import UDebug from "./UDebug";


/**
 * 创建：朱武
 * 作用：特殊button组件功能 （不规则点击）
 * 用法：在node上添加 UButton 组件， 可在编辑器通过点击鼠标左键push点击的点到points
 */

const {ccclass, property} = cc._decorator;

@ccclass
export default class UButton extends cc.Component {

    @property(cc.Boolean) 
    irregular:boolean = true;

    @property(cc.SpriteFrame)
    NormalSprite: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    PressedSprite: cc.SpriteFrame = null;

    @property([cc.Component.EventHandler])
    ClickEvents:cc.Component.EventHandler[] = [];

    @property([cc.Vec2])
    points:cc.Vec2[] = [];
    
    _sprite: cc.Sprite = null;
    
    _is_push_start: boolean = false;
    
    _call_funs : UHandler[] = [];

    onDisable() {
        this.unregister();
    }
    onEnable() {
        this.register();
        this._sprite = this.node.getComponent(cc.Sprite);
        if (!this._sprite) {
            this._sprite = this.node.addComponent(cc.Sprite);
        }

        this.node['_touchListener'].setSwallowTouches(false);   // 事件提供穿透。。。

        this._sprite.spriteFrame = this.NormalSprite;

    }

    unregister() {
        this.node.off(cc.Node.EventType.TOUCH_START , this.onTouchStart , this);
        this.node.off(cc.Node.EventType.TOUCH_END , this.onTouchEnd , this);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL , this.onTouchCancel , this);
        this.node.off(cc.Node.EventType.TOUCH_MOVE , this.onTouchMove , this);
    }

    register () {
        this.node.on(cc.Node.EventType.TOUCH_START , this.onTouchStart , this);
        this.node.on(cc.Node.EventType.TOUCH_END , this.onTouchEnd , this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL , this.onTouchCancel , this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE , this.onTouchMove , this);
    }


    onTouchStart(event:any) {

        if (!this.irregular || this.check(event.touch._point)) {
            this._is_push_start = true;
            this._sprite.spriteFrame = this.PressedSprite;
        }else {
            this._is_push_start = false;
            return false;
        }

    }

    onTouchEnd(event:any) {

        if (this._is_push_start && (!this.irregular || this.check(event.touch._point))) {
            cc.Component.EventHandler.emitEvents(this.ClickEvents , event);
            if (this._call_funs.length) {
                for (let index = 0; index < this._call_funs.length; index++) {
                    this._call_funs[index].runWith(event);
                }
            }
        }
        this._sprite.spriteFrame = this.NormalSprite; 
    }

    onTouchCancel(event:any) {
        this._sprite.spriteFrame = this.NormalSprite;
    }

    onTouchMove(event:any) {
    }

    check(location) {
        let node = this.node;
        let pointInNode = node.convertToNodeSpaceAR(location);
        if(pointInNode.x < -node.width/2 || pointInNode.x > node.width/2 || pointInNode.y > node.height/2 || pointInNode.y < -node.height/2){
            return false;
        }
        
        let i, j, c = false;
        
        let nvert = this.points.length;
        let testx = pointInNode.x;
        let testy = pointInNode.y;
        let vert = this.points;
        
        for(i = 0, j = nvert - 1; i < nvert; j = i++){
            if ( ( (vert[i].y > testy) != (vert[j].y > testy) ) && 
                ( testx < ( vert[j].x - vert[i].x ) * ( testy - vert[i].y ) / ( vert[j].y - vert[i].y ) + vert[i].x ) ) 
                c = !c; 
        }         
        return c; 
    }


    /***************************
     * 
     */
    addClickCall(call: UHandler) {
       if (this._call_funs==null ) this.clearClickCall()
        this._call_funs.push(call);
    }

    clearClickCall() {
        this._call_funs =  new Array<UHandler>();
    }
}
