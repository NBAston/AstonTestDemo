import UDebug from "../../common/utility/UDebug";


const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:测试屏蔽点击事件 多点触摸
 */
@ccclass
export default class VMask extends cc.Component {
    /** */
    @property(cc.Node)
    circleNode: cc.Node = null;



    onLoad() {

        this.node.width = this.node.height = 10000;
        this.node.on(cc.Node.EventType.TOUCH_START, this.onTouchBg, this);
    }

    onTouchBg(event) {
        // event.stopPropagation
        let point = event.getLocation();
        let retWord = this.circleNode.getBoundingBoxToWorld();
        let space = 40;
        retWord.width -= space;
        retWord.width = retWord.width <= 0 ? 0 : retWord.width;
        retWord.height -= space;
        retWord.height = retWord.height <= 0 ? 0 : retWord.height;
        if (retWord.contains(point)) {
            this.node["_touchListener"].setSwallowTouches(false);
        } else {
            this.node["_touchListener"].setSwallowTouches(true); //默认吞噬的
        }
    }
    // update (dt) {}
}


