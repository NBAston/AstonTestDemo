/**金币飞行动画 */
export default class UCoinDFlyHelper {
    /**金币缓存池 */
    private _cache: Array<cc.Node> = new Array<cc.Node>();
    /**金币模板 */
    private _coinTemp: cc.Node;
    /**金币父节点 */
    private _coinFlyNode: cc.Node;
    /**缓存 数组长度 */
    private _length: number = 1800;
    /**位置数组 */
    private _pos: any = {};
    /**随机偏差值 */
    private _offest: number = 50;


    constructor(coinTemp: cc.Node, coinFlyNode: cc.Node, pos: any, offest?: number, length?: number) {
        this._coinTemp = coinTemp;
        this._coinFlyNode = coinFlyNode;
        if (length != null) {
            this._length = length;
        }
        if (offest != null) {
            this._offest = offest;
        }

        this._pos = pos;
    }

    /**取金币 */
    getInstans(): cc.Node {
        if (this._cache.length > 0) {
            return this._cache.shift();
        }
        let item = cc.instantiate(this._coinTemp);
        item.parent = this._coinFlyNode;
        item.active = true;
        return item;
    }

    /**回收金币 */
    reclaim(item: cc.Node) {
        item.active = false;
        if (this._cache.length > this._length) {
            item.destroy();
        }
        else {
            this._cache.push(item);
        }
    }

    resetAll(){
        if(this._coinFlyNode != null){
            for (let i = 0; i < this._coinFlyNode.childrenCount; i++) {
                const element = this._coinFlyNode.children[i];
                if(element != null){
                    element.stopAllActions();
                    this.reclaim(element);
                }
            }
        }

        this._cache = [];

    }


    /**获得随机点 */
    private geRandomPos(index: number): cc.Vec2 {
        var dest_pos = new cc.Vec2(0, 0);

        var end_center_pos = this._pos[index];
        let offset = this._offest;

        dest_pos.x = end_center_pos.x + Math.random() * offset - offset / 2;
        dest_pos.y = end_center_pos.y + Math.random() * offset - offset / 2;

        return dest_pos;
    }

    /**金币飞行随机轨迹 */
    moveChipToRect(node: cc.Node, sIndex: number, eIndex: number) {
        node.active = true;

        var start = this.geRandomPos(sIndex);
        var end = this.geRandomPos(eIndex);
        var desc_scale = 0.8;
        var act_time = 0.5;
        node.opacity = 200;
        var dt_time = Math.random() * 0.6;
        var rote = Math.random() * 180;

        var bezier = [start,
            cc.v2(start.x + (end.x - start.x) * 0.5,
                start.y + (end.y - start.y) * 0.5 + 200),
            end];

        var self = this;
        var bezierTo = cc.bezierTo(0.6, bezier);
        var seq = cc.sequence(cc.delayTime(dt_time),
            cc.spawn(bezierTo,
                cc.fadeIn(act_time / 1.5),
                cc.rotateBy(act_time, rote)
                ),
            cc.scaleTo(0.2, desc_scale),
            cc.callFunc(() => {
                self.reclaim(node);

            })
        );
        node.stopAllActions();
        node.runAction(seq);
    }

}
