import VBaseUI from "../../../common/base/VBaseUI";
import UHandler from "../../../common/utility/UHandler";
import UToggle from "../../../common/utility/UToggle";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import AppGame from "../../base/AppGame";
import UEventListener from "../../../common/utility/UEventListener";
import VWindow from "../../../common/base/VWindow";
import MSettingModel from "./MSettingModel";
import cfg_global from "../../../config/cfg_global";
import MZJH_hy from "../../../game/zjh_hy/MZJH_hy";
import UDebug from "../../../common/utility/UDebug";


const { ccclass, property } = cc._decorator;
/**
 * 创建:sq
 * 作用:游戏音乐设置
 */
@ccclass
export default class VSetting extends VWindow {
    /**
     * 音乐大小
     */
    private _musicBar: cc.Slider;
    /**
     * 音效大小
     */
    private _soundBar: cc.Slider;

    private _muback: cc.Sprite;

    private _sdback: cc.Sprite;

    private _music_toggle:cc.Toggle;

    private _sound_toggle:cc.Toggle;

    private _back:cc.Node;

    private musicBtnClick(caller:cc.Toggle):void{
        if(this._music_toggle.isChecked){
            AppGame.ins.setting.music = 1;
        }else{
            AppGame.ins.setting.music = 0;
        }
    }

    private soundBtnClick(caller:cc.Toggle):void{
        if(this._sound_toggle.isChecked){
            AppGame.ins.setting.sound = 1;
        }else{
            AppGame.ins.setting.sound = 0;
        }
    }

    // private onmusicClick(isOn: boolean): void {
    //     AppGame.ins.setting.musicmute = !isOn;

    //     this.refreshData();
    // }
    // private soundClick(isOn: boolean): void {
    //     AppGame.ins.setting.soundmute = !isOn;
    //     this.refreshData();
    // }
    // private musicchange(caller: cc.Slider): void {
    //     AppGame.ins.setting.music = caller.progress;
    //     this.refreshData();
    // }
    // private soundchange(caller: cc.Slider): void {
    //     AppGame.ins.setting.sound = caller.progress;
    //     this.refreshData();
    // }

    /**
    * 初始化 UI创建的时候调用
    */
    init(): void {
        // super.init();
        // this._musicBar = UNodeHelper.getComponent(this.node, "root/musicbar", cc.Slider);
        // this._soundBar = UNodeHelper.getComponent(this.node, "root/soundbar", cc.Slider);
        // this._muback = UNodeHelper.getComponent(this.node, "root/musicbar/Background", cc.Sprite);
        // this._sdback = UNodeHelper.getComponent(this.node, "root/soundbar/Background", cc.Sprite);
        // UEventHandler.addSliderClick(this._musicBar.node, this.node, "VSetting", "musicchange");
        // UEventHandler.addSliderClick(this._soundBar.node, this.node, "VSetting", "soundchange");
        super.init();
        this._music_toggle = UNodeHelper.getComponent(this.node,"root/music_toggle",cc.Toggle);
        this._sound_toggle = UNodeHelper.getComponent(this.node,"root/sound_toggle",cc.Toggle);
        UEventHandler.addToggle(this._music_toggle.node,this.node,"VSetting","musicBtnClick");
        UEventHandler.addToggle(this._sound_toggle.node,this.node,"VSetting","soundBtnClick");
        this._back = UNodeHelper.find(this.node,"back");
        UEventHandler.addClick(this._back,this.node,"VSetting","closeUI");
        let lab_version = UNodeHelper.getComponent(this.node, "root/lab_version", cc.Label).string = "版本  "+ cfg_global.version;
    }

    closeUI(){
        super.playclick();
        super.clickClose();
    }

    /**
     *  隐藏
     */
    hide(): void {
        this.node.active = false;
    }
    /**
     * 显示
     */
    show(data: any): void {
        super.show(data);
        this.refreshData();
    }

    private refreshData(): void {
        // this._musicBar.progress = AppGame.ins.setting.music;
        // this._soundBar.progress = AppGame.ins.setting.sound;
        // this._muback.fillRange = AppGame.ins.setting.music;
        // this._sdback.fillRange = AppGame.ins.setting.sound;
        if(AppGame.ins.setting.music == 1){
            this._music_toggle.isChecked = true;
        }else if(AppGame.ins.setting.music == 0){
            this._music_toggle.isChecked = false;
        };

        if(AppGame.ins.setting.sound == 1){
            this._sound_toggle.isChecked = true;
        }else if(AppGame.ins.setting.sound == 0){
            this._sound_toggle.isChecked = false;
        }

    }



}

