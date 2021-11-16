import VBaseUI from "../../common/base/VBaseUI";
import UHandler from "../../common/utility/UHandler";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import AppGame from "../base/AppGame";
import { EMsgType, EUIPos, ECommonUI } from "../../common/base/UAllenum";
import USpriteFrames from "../../common/base/USpriteFrames";
import VWindow from "../../common/base/VWindow";

const { ccclass, property } = cc._decorator;
/**
 * 创建:gj
 * 作用：弹出框
 */
@ccclass
export default class VMsgBox extends VWindow {
    /**
     * 回调
     */
    private _callHandler: UHandler;
    private _ok: cc.Sprite;
    private _cancle: cc.Sprite;
    private _content: cc.Label;
    private _pools: Array<any>;
    private _isrun: boolean;
    private clear(): void {
        if (this._callHandler) {
            this._callHandler.clear();
            this._callHandler = null;
        }
    }

    /**
     * 确定按钮
     */
    private okClick(): void {
        this.close(true);
        this.playclick();
    }

    /**
     * 取消按钮
     */
    private cancleClick(): void {
        this.close(false);
        this.playclick();
    }

    /**
     * 关闭按钮
     */
    protected clickClose(): void {
        this.close(false);
        this.playclick();
        // AppGame.ins.closeCheckNode();
    }

    private close(value: boolean): void {

        let data = this.nextMsg();
        if (!data) {
            this.closeAnimation(UHandler.create(() => {
                if (this._callHandler) {
                    this._callHandler.runWith(value);
                }
                data = this.nextMsg();
                if (data) {
                    this._root.setScale(1);
                    this.showmsg(data);
                } else {
                    AppGame.ins.closeUI(this.uiType);
                }
            }, this));
        } else {
            if (this._callHandler) {
                this._callHandler.runWith(value);
            }
            this.showmsg(data);
        }

    }

    /**
     * 下一个msg
     */
    private nextMsg(): any {
        let len = this._pools.length;
        if (len > 0) {
            return this._pools.shift();
        }
        return null;
    }

    onDestroy(): void {
        this.clear();
        this._pools = [];
    }

    /**
     * 初始化 UI创建的时候调用
     */
    init(): void {
        super.init();
        this._isrun = false;
        this._pools = [];
        this._root = UNodeHelper.find(this.node, "root");
        this._ok = UNodeHelper.getComponent(this.node, "root/gf_btn_y", cc.Sprite);
        this._cancle = UNodeHelper.getComponent(this.node, "root/gf_btn_ford", cc.Sprite);
        this._content = UNodeHelper.getComponent(this.node, "root/content", cc.Label);
        UEventHandler.addClick(this._ok.node, this.node, "VMsgBox", "okClick");
        UEventHandler.addClick(this._cancle.node, this.node, "VMsgBox", "cancleClick");
        this._root.setScale(0.1, 0.1);
        this._spriteRes = this.getComponent(USpriteFrames);
    }

    /**
     *  隐藏
     */
    hide(handler?: UHandler): void {
        this.node.active = false;
        this.clear();
        this._pools = [];
    }

    /**
    * 刷新数据
    * @param data 
    */
    refresh(data: any): void {
        if (this._pools.length > 3) {
            this._pools.shift();
        }
        this._pools.push(data);
    }

    /**
     * 显示
     * {type:{ok==1,quiteRoom ==2,ok Or cancle==3, },data:string,handler:UHandler}
     */
    show(data: any): void {
        super.show(data);
        this.showmsg(data);
    }

    /**
     * 显示的信息
     */
    private showmsg(data: any): void {
        this._callHandler = data.handler;
        var posx = 160;
        if (this.uiType == ECommonUI.NewMsgBox)
            posx = 140;
        switch (data.type) {
            case EMsgType.EExitGame:
                {
                    this._ok.node.setPosition(posx, -100);
                    this._cancle.node.active = true;
                }
                break;
            case EMsgType.EOK:
                {
                    this._cancle.node.active = false;
                    this._ok.node.setPosition(0, -100);
                }
                break;
            case EMsgType.EOKAndCancel:
                {
                    this._ok.node.setPosition(posx, -100);
                    this._cancle.node.active = true;
                }
                break;
        }
        this._content.string = data.data;
    }

    protected update(dt: number): void {
        // let len = this._pools.length;
        // for (let i = len - 1; i >= 0; i--) {
        //     let item = this._pools[i];
        //     if (!item.handler.isValid()) {
        //         this._pools.splice(i, 1);
        //         item.clear();
        //     }
        // }
        if (this._callHandler && !this._callHandler.isValid()) {
            this._callHandler.clear();
        }
    }

}
