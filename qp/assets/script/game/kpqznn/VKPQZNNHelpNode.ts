import VBaseUI from "../../common/base/VBaseUI";
import UAudioRes from "../../common/base/UAudioRes";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import UEventListener from "../../common/utility/UEventListener";
import UHandler from "../../common/utility/UHandler";
import UAudioManager from "../../common/base/UAudioManager";
import AppGame from "../../public/base/AppGame";



const { ccclass, property } = cc._decorator;
/**
 * 创建:dz
 * 作用:抢庄牛牛/三公 帮助界面 到时放公有
 */
@ccclass
export default class VKPQZNNHelpNode extends VBaseUI {// cc.Component {
    /**关闭按钮 */
    @property(cc.Button)
    btn_helpclose: cc.Button = null;
    /**滑动显示的内容(图片) */
    @property(cc.Sprite)
    scroll_content: cc.Sprite = null;

    /**图片数组 */
    @property([cc.SpriteFrame])
    spriteArry: Array<cc.SpriteFrame> = [];
    /**黑色背景 点击隐藏本节点 */
    @property(cc.Node)
    help_bg1: cc.Node = null;
    /**拦截小框点击事件冒泡 */
    @property(cc.Node)
    qznn_help_bg: cc.Node = null;

    private _audioRes: UAudioRes;

    private _toggle0: cc.Toggle;
    private _toggle1: cc.Toggle;
    private _toggle2: cc.Toggle;
    private _toggle3: cc.Toggle;

    private _srollview: cc.ScrollView;

    onLoad() {
        this.node.scale = 1;
        this.help_bg1.active = true;

        this._audioRes = this.node.getComponent(UAudioRes);
        this._toggle0 = UNodeHelper.getComponent(this.node, "qznn_toggleContainer/toggle0", cc.Toggle);
        this._toggle1 = UNodeHelper.getComponent(this.node, "qznn_toggleContainer/toggle1", cc.Toggle);
        this._toggle2 = UNodeHelper.getComponent(this.node, "qznn_toggleContainer/toggle2", cc.Toggle);
        this._toggle3 = UNodeHelper.getComponent(this.node, "qznn_toggleContainer/toggle3", cc.Toggle);

        UEventHandler.addToggle(this._toggle0.node, this.node, "VKPQZNNHelpNode", "onCheckEvent", 0);
        UEventHandler.addToggle(this._toggle1.node, this.node, "VKPQZNNHelpNode", "onCheckEvent", 1);
        UEventHandler.addToggle(this._toggle2.node, this.node, "VKPQZNNHelpNode", "onCheckEvent", 2);
        UEventHandler.addToggle(this._toggle3.node, this.node, "VKPQZNNHelpNode", "onCheckEvent", 3);

        this._srollview = UNodeHelper.getComponent(this.node, "qznn_help_scrollview", cc.ScrollView);



        if (this.btn_helpclose != null) {
            // this.btn_helpclose.node.on(cc.Node.EventType.MOUSE_UP, this.onBtnHelpCloseClick, this);

            UEventListener.get(this.btn_helpclose.node).onClick = new UHandler(() => { 
                    this.onBtnHelpCloseClick();
                   
                }, this);

        }
        UEventListener.get(this.help_bg1).onClick = new UHandler(() => { this.onBtnHelpCloseClick(); }, this);

        // UEventListener.get(this.qznn_help_bg).onClick=new UHandler((event)=>{ event.stopPropagation();},this);
        UEventListener.get(this.qznn_help_bg).onClick = null;
        // new UHandler(() => {
        //     this.qznn_help_bg["_touchListener"].setSwallowTouches(true);
        // }, this);


        // this.qznn_help_bg.on(cc.Node.EventType.MOUSE_UP, (event) => {
        //     event.stopPropagation();
        // });
        // this.setZIndex(200);
    }

    show(data: any) {
        super.show(data);
        
        let seq = cc.sequence(cc.show(), cc.spawn(cc.scaleTo(0.1, 1.05), cc.fadeIn(0.1)), cc.scaleTo(0.05, 1));
        this.node.runAction(seq);

        this.help_bg1.opacity = 0;
        this.help_bg1.stopAllActions();
        this.help_bg1.runAction(cc.sequence(cc.delayTime(0.1) , cc.fadeTo(0.2,120)));
    }

    onEnable() {
        this.node.scale = 1;
        this.help_bg1.active = true;

        this.scroll_content.spriteFrame = this.spriteArry[0];

        this._toggle0.isChecked = true;
        this._toggle1.isChecked = false;
        this._toggle2.isChecked = false;
        this._toggle3.isChecked = false;
    }

    /**关闭按钮点击事件 */
    onBtnHelpCloseClick() {
        // this.node.active = false;
        this.hideAction();

        // UAudioManager.ins.playSound(this.getAudio("click"));
        UAudioManager.ins.playSound("audio_click");

    }

    hideAction() {
        // this.help_bg1.active = false;

        this.help_bg1.runAction(cc.fadeOut(0.1));


        // let hide = cc.scaleTo(0.3, 0).easing(cc.easeInOut(3));
        let hide = cc.spawn(cc.scaleTo(0.1, 0.2), cc.fadeOut(0.05));
        let callfunc = cc.callFunc(function () {
            // this.node.active = false;
            // this.node.scaleTo(0,1);
            AppGame.ins.closeUI(this.uiType);
        }, this);
        this.node.runAction(cc.sequence(hide, callfunc));
    }

    /**toggle 点击事件 */
    onCheckEvent(event, customIndex: number) {
        if (customIndex < 4 && customIndex >= 0) {
            this.scroll_content.spriteFrame = this.spriteArry[customIndex];
            this._srollview.stopAutoScroll();
            this._srollview.scrollToTop(0);
        }
        // UAudioManager.ins.playSound(this.getAudio("click"));

        UAudioManager.ins.playSound("audio_click");
    }

    // private getAudio(name: string): cc.AudioClip {
    //     return this._audioRes.getAudio(name);
    // }
}
