import UNodeHelper from "../../common/utility/UNodeHelper";
import AppGame from "../base/AppGame";
import MHall from "../hall/lobby/MHall";

const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:公告
 */
@ccclass
export default class VNoticeMsg extends cc.Component {

    private _rich_mess: cc.Label = null;
    private _node_mask: cc.Node = null;

    private _messages: Array<string>;
    private _firstMark: {
        [key: string]: number
        //{
        //     first:number,
        //     // isrepat:boolean
        // }
    };

    private _isrun: boolean;

    private _offestX: number = 400;
    private _nextOffestX: number = 100;
    private _speed: number = 100;
    private _isRound: boolean = false;

    private _content: cc.Node;

    onLoad() {

        this._rich_mess = UNodeHelper.getComponent(this.node, "content/mask/content", cc.Label);
        this._node_mask = UNodeHelper.find(this.node, "content/mask");
        this._content = UNodeHelper.find(this.node, "content");

        this._messages = [];
        this._isrun = false;
        this._firstMark = {};

        this._content.active = false;
        // this.runMess();
    }

    start() {
        // this._rich_mess = UNodeHelper.getComponent(this.node, "content/mask/content", cc.Label);
    }

    onEnable() {

        this._messages = [];
        this._isrun = false;

        AppGame.ins.hallModel.on(MHall.HALL_NOTICE_NOTIFY, this.onNoticeNotifty, this);
        // AppGame.ins.hallModel.setCanSend(true);

        // this._messages.push("aushdjahs:s实打实打算地看了看九年asdasdasd");

        var msg_tmp = AppGame.ins.hallModel.getNoticeNotify();
        for (const key in msg_tmp) {
            if (msg_tmp.hasOwnProperty(key)) {
                const element = msg_tmp[key];
                var str = element.title + ":" + element.message;
                this._messages.push(str);
            }
        }

        if(this._messages.length > 0){
            this._content.active = true;
        }else{
            this._content.active = false;
        }

        AppGame.ins.hallModel.resetNotices();

        // this.gundongText();
        // this.runMess();

    }

    onDisable() {
        this._messages = [];
        this._isrun = false;

        // AppGame.ins.hallModel.setCanSend(false);
        AppGame.ins.hallModel.off(MHall.HALL_NOTICE_NOTIFY, this.onNoticeNotifty, this);
    }

    private onNoticeNotifty(title: string, msg: string) {
        var str = title + ":" + msg;

        this._content.active = true;
        // this.pushRoldMess(str,true,10);
        this.pushRoldMess(str, false);
    }

    /** 
     * @param str 走马灯消息
     */
    pushRoldMess(str: string, repeat?: boolean, repeatTime?: number) {
        this._messages.push(str);
        // this.runMess();

        if (repeat && repeatTime != null) {
            this._firstMark[str] = repeatTime;
        }
    }


    update(dt: number) {
        if (!this._isrun && this._messages.length >= 1) {
            this._isrun = true;
            // var rich_tmp = cc.instantiate(this._rich_mess.node);

            var tmp_mes = this._messages.shift();
            var rich_tmp = this.getTextObj(tmp_mes);

            let a: any = rich_tmp.getComponent(cc.Label);
            // a._updateRenderData(true);//设置后获取长度

            var rt_dist = rich_tmp.width + this._node_mask.width + 60;

            var speed = this._speed;
            var rtime = rt_dist / speed;

            rich_tmp.runAction(
                cc.sequence(
                    cc.moveBy(rtime, -rt_dist, 0),
                    cc.callFunc((nnde: cc.Node) => {

                        this._isrun = false;
                        this._firstMark[tmp_mes] = this._firstMark[tmp_mes] || 0;
                        this._firstMark[tmp_mes]--;

                        if (this._firstMark[tmp_mes] > 0) {
                            this._messages.push(tmp_mes);
                        }
                        if(this._messages.length <= 0){
                            this._content.active = false;
                        }
                        nnde.destroy();
                    }, this)
                )
            );
        }
    }


    getTextObj(tmp_mes: string): cc.Node {
        var rich_tmp = cc.instantiate(this._rich_mess.node);

        rich_tmp.parent = this._node_mask;
        rich_tmp.x = this._offestX;

        rich_tmp.getComponent(cc.Label).string = tmp_mes;

        // var rt_dist = rich_tmp.width + this._node_mask.width;

        return rich_tmp;
    }




    private runMess() {

        if (this._isrun) { return; }
        var tmp_mes = ''

        if (this._messages.length >= 1) { tmp_mes = this._messages.shift(); }
        // else{
        //     return;
        // }

        var rich_tmp = cc.instantiate(this._rich_mess.node);

        rich_tmp.parent = this._node_mask;

        rich_tmp.x = this._offestX;

        rich_tmp.getComponent(cc.Label).string = tmp_mes;

        var rt_dist = rich_tmp.width + this._node_mask.width;


        var speed = this._speed;
        var rtime = rt_dist / speed;
        this._isrun = true;

        var tmp_atleaest_timer = 3;
        var tmp_timer = 0;


        // var nextOffest = this._node_mask.width - (rich_tmp.width + this._nextOffestX);
        // var nextSpeed = nextOffest / speed;

        // UDebug.Log("rt_dist:"+rt_dist);
        // UDebug.Log("rich_tmp.width:"+rich_tmp.width);
        // UDebug.Log("nextOffest:"+nextOffest);
        // UDebug.Log("rt_dist:"+rt_dist);

        //cc.delayTime(2),
        rich_tmp.runAction(
            cc.repeatForever(
                cc.sequence(
                    // cc.moveBy(nextSpeed, -rt_dist + nextOffest, 0),
                    // cc.callFunc(() => {
                    //     this._isrun = false;
                    //     this._nextOffestX += (rich_tmp.width + this._nextOffestX);
                    //     this.runMess();
                    // }, this),
                    cc.moveBy(rtime, -rt_dist, 0),
                    cc.callFunc((nnde: cc.Node) => {
                        ++tmp_timer;
                        this._isrun = false;
                        rich_tmp.setPosition(this._offestX, rich_tmp.y);

                        this.runMess();
                        if (tmp_timer >= tmp_atleaest_timer) {
                            tmp_timer = 0;
                            nnde.destroy();
                        }
                    }, this)
                )
            )
        );
    }

    //#region  别人1
    /*
    //滚动公告字幕
    gundongText() {
        var self = this;
        setTimeout(function () {
            var notifyRes = JSON.parse(cc.sys.localStorage.getItem('notify'));
            // var gundongNode = cc.find("Canvas/gundong");
            // if(notifyRes != null){
            //     if(gundongNode){
            //         gundongNode.active = true;
            //     }
            //     self.Gundong.string = notifyRes;
            // }
            // else{
            //     if(gundongNode){
            //         gundongNode.active = false;
            //     }
            // }
            var text = self._rich_mess;
            var width = self._node_mask.width;
            text.node.runAction(cc.repeatForever(
                cc.sequence(
                    cc.moveTo(text.node.width / width * 10, cc.p(-text.node.width - width / 5, text.node.y)),
                    cc.callFunc(function () {
                        text.node.x = width;
                    })
                )
            )
            );
        }, 300);
    }*/
    //#endregion


    //#region  别人的
    /*
    update() {

        try {

            var endIndex = this._messages.length - 1

            var desc = this._messages[endIndex]

            if (desc) {

                this.runMarqeeBar(desc)

                this._messages[endIndex] = null;

            }

        } catch (e) {

        }

    }

    runMarqeeBar(desc: string) {

        // this.marqueeBg.opacity = 255;

        this._rich_mess.node.x = this._node_mask.width;

        this._rich_mess.string = desc;

        this._rich_mess.node.runAction(cc.sequence(

            cc.moveTo(10, -this._rich_mess.node.width, 0),

            cc.callFunc(() => {

                this._messages.pop();

                if (!this.isExistContent()) {

                    // this.descs.unshift(this.desc1)

                    // this.marqueeBg.opacity = 0;

                }

            }, this, this)
        ));

    }



    isExistContent() {

        if (this._messages[this._messages.length - 1]) {

            return true;

        }

        return false;

    }*/
    //#endregion
}
