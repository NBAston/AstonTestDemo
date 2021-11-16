// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const {ccclass, property} = cc._decorator;


/**
 * 创建: 朱武
 * 作用：百人龙虎走马灯 （可以提取出来共享）
 */


@ccclass
export default class VBrbjlHorn extends cc.Component {

    @property(cc.RichText)
    rich_mess: cc.RichText = null;

    @property(cc.Node)
    node_mask: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    _messages: Array<string>;

    _isrun: boolean;

    start () {
        this._messages = [];
        this._isrun = false;
        // this._messages.push('aaaaaaaaaaaaaaaaaaaaaa');
        // this._messages.push('bbbbbbbbbbbbbbbbbbbbbb');
        // this._messages.push('cccccccccccccccccccccccc');
        // this._messages.push('ddddddddddddddddddddddd');
        // this._messages.push('eeeeeeeeeeeeeeeeeeeeeeeeeee');
        // this._messages.push('ffffffffffffffffffffffff');
        // this._messages.push('gggggggggggggggggggggg');

        this.runMess();
 
    }


    runMess () {

        if (this._isrun) {return ;}
        var tmp_mes = '欢迎来到 四海棋牌 百人龙虎测试服'

        if (this._messages.length >= 1) {var tmp_mes = this._messages.shift();} 

        // UDebug.Log(tmp_mes);
        
        var rich_tmp = cc.instantiate(this.rich_mess.node);

        rich_tmp.parent = this.node_mask;

        rich_tmp.x = 220;

        rich_tmp.getComponent(cc.RichText).string = tmp_mes;

        var rt_dist = rich_tmp.width + this.node_mask.width ;

        // UDebug.Log('rt_dist = ' + rt_dist);

        var speed = 100;

        var rtime = rt_dist / speed;

        this._isrun = true;
        // rich_tmp.destroy
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

    // update (dt) {}
}
