import VBaseUI from "../../common/base/VBaseUI";
import AppGame from "../../public/base/AppGame";
import { ECommonUI } from "../../common/base/UAllenum";
import { EQZJHUITipType } from "./UQZJHHelper";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UDebug from "../../common/utility/UDebug";
import UHandler from "../../common/utility/UHandler";

const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:抢庄牛牛 提示界面 (可改为公用的)  not use
 */
@ccclass
export default class VQZJHTipNode extends VBaseUI {

    private _tiptext: cc.Label = null;
    private _btn_close: cc.Button = null;
    private _btn_yes: cc.Button = null;
    private _btn_cancel: cc.Button = null;
    private _isBgClick: boolean = false;

    private _isRepatText: boolean = false;

    private _textindex: number = 0;
    // private _textArray : any = null;//Array = new String[];
    private _textArray: Array<string> = [];

    _textaction: any = null;

    onLoad() {

        this._tiptext = UNodeHelper.getComponent(this.node, "qznn_tips_bg/label_tip", cc.Label);
        this._btn_close = UNodeHelper.getComponent(this.node, "qznn_tips_bg/qznn_help_close", cc.Button);
        this._btn_yes = UNodeHelper.getComponent(this.node, "qznn_tips_bg/qznn_tips_btn2", cc.Button);
        this._btn_cancel = UNodeHelper.getComponent(this.node, "qznn_tips_bg/qznn_tips_btn1", cc.Button);

        let qznn_tips_bg = UNodeHelper.find(this.node, "qznn_tips_bg");

        qznn_tips_bg.on(cc.Node.EventType.TOUCH_END, (event) => {
            event.stopPropagation();
        });
    }
    // start() {
    // }

    setParent(parent: cc.Node): void {
        this.node.parent = parent;
    }

    /**显示函数
     * @param data 应是一个字典 (除标注参数,其他都可选)
     * @param data.parent :cc.node 父节点
     * @param data.type :number  提示类型 0:无按钮 1:1个按钮(关闭) 
     * 2:2个按钮(关闭,确定) 3:3个按钮(关闭,确定,取消)  --(必选)
     * @param data.texts :string数组  多条显示的文字  提示文本
     * @param data.closecbfunc 关闭按钮回调
     * @param data.yescbfunc   确定按钮回调
     * @param data.cancelcbfunc 取消按钮回调
     * @param data.isBgClick :boolean 背景是否可点击关闭
     * @param data.isRepatText :boolean 字体是否循环播放
     */
    show(data: any) {
        super.show(data);//参数随便传,用不到

        if (data === null)
            return;

        this.node.setScale(1);
        if (data.parent != null) {
            this.setParent(data.parent);
        }
        if (data.type != null) {
            this.initByType(data.type);
        }

        if ((data.closecbfunc != null) && (this._btn_close != null)) {
            this._btn_close.node.on(cc.Node.EventType.TOUCH_END, () => {
                data.closecbfunc();

                this.hideAction();
            });
        }

        if ((data.yescbfunc != null) && (this._btn_yes != null)) {
            this._btn_yes.node.on(cc.Node.EventType.TOUCH_END, () => {
                data.yescbfunc();

                this.hideAction();

            });
        }
        if ((data.cancelcbfunc != null) && (this._btn_cancel != null)) {
            this._btn_cancel.node.on(cc.Node.EventType.TOUCH_END, () => {
                data.cancelcbfunc();

                this.hideAction();
            });
        }

        if ((data.text != null) && (this._tiptext != null)) {
            this._tiptext.string = data.text[0];
            this._isRepatText = data.isRepatText;

            if (data.isRepatText == true && data.text.length > 1) {
                this._textArray = data.text;
                this._tiptext.string = data.text[0];
                this._textindex = 0;

                let changeText = cc.delayTime(0.5);
                let callFunc = cc.callFunc(function () {

                    if (this._textindex >= (this._textArray.length - 1))//2
                        this._textindex = 0;
                    else
                        this._textindex++;

                    this._tiptext.string = this._textArray[this._textindex];
                }, this);

                // this._tiptext.
                // this._tiptext.node.runAction(cc.repeatForever(callFunc));  //,0.2
                // this._tiptext.node.runAction(cc.repeat(callFunc,0.2));

                this._textaction = cc.repeatForever(cc.sequence(changeText, callFunc));
                this.node.runAction(this._textaction);
            }

        }
        if (data.isBgClick != null) {
            this._isBgClick = data.isBgClick;
        }

        if (this._isBgClick == true) {
            // UDebug.Log("注册 隐藏 ");
            this.node.on(cc.Node.EventType.TOUCH_END, this.hideAction, this);
        }
        else {
            // UDebug.Log("取消注册 隐藏 ");
            this.node.off(cc.Node.EventType.TOUCH_END, this.hideAction, this);
        }
    }

    hide(handler?: UHandler): void {
        if (this._textaction != null)
            this.node.stopAction(this._textaction);

        super.hide(handler);
    }

    /**根据type初始化 */
    initByType(type: number = 0): void {
        this.node.active = true;
        switch (type) {
            case EQZJHUITipType.Zero:
                {
                    this._btn_close.node.active = false;
                    this._btn_cancel.node.active = false;
                    this._btn_yes.node.active = false;
                }
                break;
            case EQZJHUITipType.One:
                {
                    this._btn_close.node.active = true;

                    this._btn_cancel.node.active = false;
                    this._btn_yes.node.active = false;
                }
                break;
            case EQZJHUITipType.Two:
                {
                    this._btn_close.node.active = true;
                    this._btn_yes.node.active = true;

                    this._btn_cancel.node.active = false;
                    this._btn_yes.node.setPosition(cc.v2(-17, -141)); // (-17,-141)
                }
                break;
            case EQZJHUITipType.Three:
                {
                    this._btn_close.node.active = true;
                    this._btn_yes.node.active = true;
                    this._btn_cancel.node.active = true;

                    this._btn_yes.node.setPosition(cc.v2(129, -141));
                }
                break;
        }
    }

    hideAction() {
        // if (this._isBgClick == true) {
        let hide = cc.scaleTo(0.3, 0).easing(cc.easeInOut(3));
        let callfunc = cc.callFunc(function () {
            AppGame.ins.closeUI(ECommonUI.QZJH_Tip);
        }, this);
        this.node.runAction(cc.sequence(hide, callfunc));
        // }
        // else {
        //     AppGame.ins.closeUI(ECommonUI.QZJH_Tip);
        // }

    }



    // update(dt) {
    //     if(this._isRunText == false) 
    //         return;
    // }

    /**传参测试代码 别的界面传进来 */
    test() {
        ////// 示例 1:

        // 确定要退出游戏吗?
        // 游戏中途禁止退出，请打完这局哦~
        // 正在为您匹配牌桌\n\n 游戏即将开始,请耐心等待...

        let data = {
            text: "cccccccccccccc",
            type: 1,
            parent: this.node.parent,
            closecbfunc: () => {
                UDebug.log("背景点击无效 closecbfunc");
            },

            isBgClick: false
        };
        AppGame.ins.showUI(ECommonUI.QZJH_Tip, data);

        //////示例 2:
        let data1 = {
            text: "zzzzzzzzzz",
            type: 0,

            isBgClick: true
        };

        AppGame.ins.showUI(ECommonUI.QZJH_Tip, data1);

        /////示例 3:
        let data2 = {
            text: "hhhhhhhhhhhhhhh",
            type: 2,
            parent: this.node.parent,
            closecbfunc: () => {
                UDebug.log("22222222222222 closecbfunc");
            },

            yescbfunc: () => {
                UDebug.log("222222222222222 yescbfunc");
            },

            isBgClick: true
        };

        AppGame.ins.showUI(ECommonUI.QZJH_Tip, data2);


        /////示例 4:
        let data3 = {
            text: "sssss",
            type: 3,
            closecbfunc: () => {
                UDebug.log("3333333333333333 closecbfunc");
            },
            parent: this.node.parent,
            yescbfunc: () => {
                UDebug.log("3333333333333333 yescbfunc");
            },
            cancelcbfunc: () => {
                UDebug.log("3333333333333333 cancelcbfunc");
            },
            isBgClick: true
        };
        // UDebug.Log(data.parent.uuid);
        AppGame.ins.showUI(ECommonUI.QZJH_Tip, data3);

        ////示例 5
        let data4 = {
            text: [
                "正在为您匹配牌桌\n\n游戏即将开始，请耐心等待.",
                "正在为您匹配牌桌\n\n游戏即将开始，请耐心等待..",
                "正在为您匹配牌桌\n\n游戏即将开始，请耐心等待...",
            ],
            type: 1,
            parent: this.node.parent,
            isRepatText: true,
            closecbfunc: () => {
                
            },

            isBgClick: false
        };
        AppGame.ins.showUI(ECommonUI.QZJH_Tip, data4);
    }

}
