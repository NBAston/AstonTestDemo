import VBaseUI from "../../../common/base/VBaseUI";
import UToggle from "../../../common/utility/UToggle";
import AppGame from "../../../public/base/AppGame";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UHandler from "../../../common/utility/UHandler";
import UEventHandler from "../../../common/utility/UEventHandler";
import UEventListener from "../../../common/utility/UEventListener";
var MAX_MUSIC_WIDTH = 375
var MAX_SOUND_WIDTH = 375

const { ccclass, property } = cc._decorator;
/**
 * 创建:朱武 （复制sq大厅设置界面）
 * 作用:百人龙虎游戏音乐设置 
 */
@ccclass
export default class VBrjhSetting extends VBaseUI {
    /**
     * 设置背景
     */
    private _node_bg: cc.Node;

    /**
     * 背景音乐
     */
    private _musicBtn: UToggle;
    /**
     * 音效
     */
    private _soundBtn: UToggle;
    /**
     * 音乐大小
     */
    private _musicBar: cc.Slider;
    /**
     * 音效大小
     */
    private _soundBar: cc.Slider;

    private _musicBall: cc.Node;
    private _soundBall: cc.Node;
    private _mumask:cc.Node;
    private _sdmask:cc.Node;
    private _back:cc.Node;

    private onmusicClick(isOn: boolean): void {
        AppGame.ins.setting.musicmute = !isOn;
        this.refreshData();
    }
    private soundClick(isOn: boolean): void {
        AppGame.ins.setting.soundmute = !isOn;
        this.refreshData();
    }
    private musicchange(caller: cc.Slider): void {
        AppGame.ins.setting.music = caller.progress;
        this.refreshData();
    }
    private soundchange(caller: cc.Slider): void {
        AppGame.ins.setting.sound = caller.progress;
        this.refreshData();
    }
    private close(): void {
        let ac = cc.scaleTo(0.2, 0.8, .8);
        ac.easing(cc.easeInOut(2.0));
        let ac2 = cc.fadeOut(0.2);

        let spa = cc.spawn(ac , ac2);

        this._back.runAction(cc.fadeOut(0.1));
        this._node_bg.stopAllActions();
        this._node_bg.runAction(cc.sequence(spa, cc.callFunc(() => {
            AppGame.ins.closeUI(this.uiType);
        }, this)));
    }
    /**
    * 初始化 UI创建的时候调用
    */
    init(): void {
        this.node.zIndex = 200;
        this._node_bg = UNodeHelper.find(this.node , 'sp_bg');
        this._musicBtn = UNodeHelper.getComponent(this._node_bg, "music_select", UToggle);
        this._soundBtn = UNodeHelper.getComponent(this._node_bg, "sound_select", UToggle);
        this._musicBar = UNodeHelper.getComponent(this._node_bg, "musicbar", cc.Slider);
        this._soundBar = UNodeHelper.getComponent(this._node_bg, "soundbar", cc.Slider);
        this._musicBall = UNodeHelper.find(this._node_bg, "music_select/sp_ball");
        this._soundBall = UNodeHelper.find(this._node_bg, "sound_select/sp_ball");
        this._mumask = UNodeHelper.find(this._node_bg, "musicbar/mask");
        this._sdmask = UNodeHelper.find(this._node_bg, "soundbar/mask");
        this._back = UNodeHelper.find(this.node, "back");
        this._musicBtn.clickHandler = new UHandler(this.onmusicClick, this);
        this._soundBtn.clickHandler = new UHandler(this.soundClick, this);
        UEventHandler.addSliderClick(this._musicBar.node, this.node, "VBrlhSetting", "musicchange");
        UEventHandler.addSliderClick(this._soundBar.node, this.node, "VBrlhSetting", "soundchange");
        UEventListener.get(this._node_bg).onClick = null;
    }
    /**
     *  隐藏
     */
    hide(handler?: UHandler): void {
        
        this.node.active = false;
    }
    /**
     * 显示
     */
    show(data: any): void {
        this.node.active = true;
        this._node_bg.opacity = 255;
        this._node_bg.scale = 0.01;
        let ac = cc.scaleTo(0.2, 1.1, 1.1);
        let ac2 = cc.scaleTo(0.1,1,1);
        let seq = cc.sequence(ac,ac2);
        ac.easing(cc.easeInOut(2.0));
        this._node_bg.runAction(seq);
        this._back.opacity = 0;
        this._back.runAction(cc.fadeTo(0.5,120));
        this.refreshData();
    }

    private refreshData(): void {
        this._musicBar.progress = AppGame.ins.setting.music;
        this._soundBar.progress = AppGame.ins.setting.sound;
            if (this._musicBtn.IsOn)
                this._musicBall.x = 70;
            else
                this._musicBall.x = -70;

            if (this._soundBtn.IsOn)
                this._soundBall.x = 70;
            else
                this._soundBall.x = -70;

        this._musicBtn.IsOn = !AppGame.ins.setting.musicmute;
        this._soundBtn.IsOn = !AppGame.ins.setting.soundmute;
        this._mumask.width = MAX_MUSIC_WIDTH * AppGame.ins.setting.music;
        this._sdmask.width = MAX_SOUND_WIDTH * AppGame.ins.setting.sound;
    }
}