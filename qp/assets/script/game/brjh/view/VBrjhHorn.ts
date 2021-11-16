const {ccclass, property} = cc._decorator;
/**
 * 创建: 朱武
 * 作用：百人龙虎走马灯 （可以提取出来共享）
 */
@ccclass
export default class VBrjhHorn extends cc.Component {

    @property(cc.RichText)
    rich_mess: cc.RichText = null;
    @property(cc.Node)
    node_mask: cc.Node = null;
    _messages: Array<string>;
    _isrun: boolean;

    start () {
        this._messages = [];
        this._isrun = false;
        this.runMess();
    }

    runMess () {
        if (this._isrun) {return ;}
        var tmp_mes = '欢迎来到 四海棋牌 百人龙虎测试服'
        if (this._messages.length >= 1) {var tmp_mes = this._messages.shift();}
        var rich_tmp = cc.instantiate(this.rich_mess.node);
        rich_tmp.parent = this.node_mask;
        rich_tmp.x = 220;
        rich_tmp.getComponent(cc.RichText).string = tmp_mes;
        var rt_dist = rich_tmp.width + this.node_mask.width;
        var speed = 100;
        var rtime = rt_dist / speed;
        this._isrun = true;
        rich_tmp.runAction(cc.sequence( cc.delayTime(2), cc.moveBy(rtime, -rt_dist , 0)  , cc.callFunc((nnde:cc.Node)=>{
            this._isrun = false;
            this.runMess();
            nnde.destroy();
        },this) ));
    }
    
    /** 
     * @param str 走马灯消息
     */
    pushRoldMess(str: string) {
        this._messages.push(str);
        this.runMess();
    }
}