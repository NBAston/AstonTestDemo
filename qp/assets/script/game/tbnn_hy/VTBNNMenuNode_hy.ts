import VBaseUI from "../../common/base/VBaseUI";
import UToggle from "../../common/utility/UToggle";
import UEventListener from "../../common/utility/UEventListener";
import UHandler from "../../common/utility/UHandler";
import AppGame from "../../public/base/AppGame";
import { ECommonUI, EGameType } from "../../common/base/UAllenum";
import MTBNNModel_hy from "./model/MTBNNModel_hy";


const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:菜单各按钮功能
 */
@ccclass
export default class VTBNNMenuNode_hy extends VBaseUI {//cc.Component {
    // onLoad () {}
    
    /**退出按钮 */
    @property(cc.Button)
    btn_exit: cc.Button = null;
    /**设置按钮 */
    @property(cc.Button)
    btn_set: cc.Button = null;
    /**记录按钮 */
    @property(cc.Button)
    btn_record: cc.Button = null;
    /**牌型按钮 */
    @property(cc.Button)
    btn_px: cc.Button = null;
    /**帮助按钮 */
    @property(cc.Button)
    btn_help: cc.Button = null;
    /**反馈按钮 */
    @property(cc.Button)
    btn_fankui: cc.Button = null;
    /**背景 */
    @property(cc.Button)
    btn_menuArea: cc.Button = null;

    private qznnHelpNode: cc.Node = null;

    private _menuToggle:UToggle = null;

    start() {
        //注册 点空白处回收本节点 事件
        UEventListener.get(this.node).onClick = new UHandler(() => {
            AppGame.ins.closeUI(ECommonUI.TBNN_Menu);
        }, this);


        if (this.btn_exit != null) {
            this.btn_exit.node.on(cc.Node.EventType.TOUCH_END, this.onBtnExitClick, this);

            // var handler = new cc.Component.EventHandler();
            // handler.target = this.btn_exit.node;
            // handler.component = this.getComponent("VTBNNMenuNode_hy");
            // handler.handler = "onBtnExitClick";

            // this.btn_exit.clickEvents.push( handler);

            /**
             * 您对我们游戏的建议和吐槽都可以在这里告诉我们噢~如果游戏中遇到了任何问题请联系网站人工客服协助解决，谢谢您的支持~(10-60个字符)
             */
        }
        if (this.btn_set != null) {
            this.btn_set.node.on(cc.Node.EventType.MOUSE_UP, this.onBtnSetClick, this);
        }
        if (this.btn_record != null) {
            this.btn_record.node.on(cc.Node.EventType.MOUSE_UP, this.onBtnRecordClick, this);
        }
        if (this.btn_px != null) {
            this.btn_px.node.on(cc.Node.EventType.MOUSE_UP, this.onBtnPXClick, this);
        }
        if (this.btn_help != null) {
            this.btn_help.node.on(cc.Node.EventType.MOUSE_UP, this.onBtnHelpClick, this);
        }
        if (this.btn_fankui != null) {
            this.btn_fankui.node.on(cc.Node.EventType.MOUSE_UP, this.onBtnFanKuiClick, this);
        }
        if (this.btn_menuArea != null) {
            this.btn_menuArea.node.on(cc.Node.EventType.MOUSE_UP, this.onBtnAreaClick, this);
        }


        var tmp = this.node.parent;
        // this.qznnHelpNode = UNodeHelper.find(this.node.parent,"qznnHelpNode")
    }

    show(data:any){
        super.show(data);

        if(data != null)
        {
            if(this._menuToggle == null)
            {
                this._menuToggle = data.getComponent("UToggle");
            }

            // if(this._menuToggle != null)
            // {
                // this._menuToggle.IsOn = true;
            // }
        }
    }

    hide(handler?: UHandler){
        if(this._menuToggle != null)
        {
            this._menuToggle.IsOn = false;
        }
        this._menuToggle = null;
        super.hide();
    }

    /**退出按钮点击事件 */
    onBtnExitClick(event) {
        
        this._menuToggle = null;

        MTBNNModel_hy.ins.exitGame();

        // AppGame.ins.loadLevel(ELevelType.Hall, EGameType.TBNN);
        AppGame.ins.closeUI(ECommonUI.TBNN_Menu);
    }
    /**设置按钮点击事件 */
    onBtnSetClick(event) {
        AppGame.ins.showUI(ECommonUI.TBNN_Setting);
    }
    /**记录按钮点击事件 */
    onBtnRecordClick(event) {
        AppGame.ins.showUI(ECommonUI.TBNN_Record, AppGame.ins.roomModel.requestGameRecords(EGameType.TBNN));
    }
    /**牌型按钮点击事件 */
    onBtnPXClick(event) {
        AppGame.ins.showUI(ECommonUI.TBNN_PX);
    }

    /**帮助按钮点击事件 */
    onBtnHelpClick(event) {
        AppGame.ins.showUI(ECommonUI.TBNN_Help);
    }
    /**反馈按钮点击事件 */
    onBtnFanKuiClick(event) {
        AppGame.ins.showUI(ECommonUI.TBNN_FanKui);
    }
    /**拦截小框点击事件冒泡 */
    onBtnAreaClick(event) {
        event.stopPropagation();
    }
}
