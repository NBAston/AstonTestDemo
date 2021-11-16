import VBaseUI from "../../../common/base/VBaseUI";
import UHandler from "../../../common/utility/UHandler";
import UToggle from "../../../common/utility/UToggle";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import AppGame from "../../base/AppGame";
import UEventListener from "../../../common/utility/UEventListener";
import VWindow from "../../../common/base/VWindow";

import cfg_global from "../../../config/cfg_global";
import UDebug from "../../../common/utility/UDebug";
import MBaseGameModel from "../MBaseGameModel";
import { ECommonUI, EGameType } from "../../../common/base/UAllenum";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import ULanHelper from "../../../common/utility/ULanHelper";


const { ccclass, property } = cc._decorator;
/**
 * 创建:sq
 * 作用:游戏音乐设置
 */
@ccclass
export default class ui_setting_hy extends VWindow {
    @property({ type: cc.ProgressBar, tooltip: "自动开局人数进度条" }) autoProgressBar: cc.ProgressBar = null;
    @property({ type: cc.Slider, tooltip: "自动开局人数滑动条" }) slider: cc.Slider = null;
    @property({ type: cc.Label, tooltip: "自动开局人数Lable" }) autoPlayerLab: cc.Label = null;
    @property({ type: cc.Layout, tooltip: "自动开局人数滑动条icon得Layout" }) proIconLayout: cc.Layout = null;
    @property({ type: cc.Node, tooltip: "自动开局人数滑动条icon" }) proIcon: cc.Node = null;
    @property({ type: cc.Node, tooltip: "自动开局人数滑动条 跟随滑动icon" }) proBarIcon: cc.Node = null;
    @property([cc.Node]) tipsArr: cc.Node[] = [];
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

    private _music_toggle: cc.Toggle;

    private _sound_toggle: cc.Toggle;

    private _chat_toggle: cc.Toggle;
    private _back: cc.Node;

    private _master: cc.Node;
    private _ipToggle: cc.Toggle;
    private _autoToggleNode: cc.Node;
    private _bringInToggle: cc.Toggle;
    private _autoPre_toggle: cc.Toggle;
    private _ip_limit_btn: cc.Node;
    private _ctr_score_btn: cc.Node;
    private _auto_start_btn: cc.Node;
    private _btn_chat_tip: cc.Node;


    private _tip_node: cc.Node;

    private _callback: Function = null;

    private _autoOpenPlayer: number = 4;//自动开始人数
    private _autoOpenMaxPlayer: number = 5;//自动开始人数


    private musicBtnClick(caller: cc.Toggle): void {
        if (this._music_toggle.isChecked) {
            AppGame.ins.setting.music = 1;
        } else {
            AppGame.ins.setting.music = 0;
        }
    }

    private soundBtnClick(caller: cc.Toggle): void {
        if (this._sound_toggle.isChecked) {
            AppGame.ins.setting.sound = 1;
        } else {
            AppGame.ins.setting.sound = 0;
        }
    }

    /**
    * 初始化 UI创建的时候调用
    */
    init(): void {
        super.init();

        this._music_toggle = UNodeHelper.getComponent(this.node, "root/master/music_toggle", cc.Toggle);
        this._sound_toggle = UNodeHelper.getComponent(this.node, "root/master/sound_toggle", cc.Toggle);
        UEventHandler.addToggle(this._music_toggle.node, this.node, "ui_setting_hy", "musicBtnClick");
        UEventHandler.addToggle(this._sound_toggle.node, this.node, "ui_setting_hy", "soundBtnClick");
        this._back = UNodeHelper.find(this.node, "back");
        UEventHandler.addClick(this._back, this.node, "ui_setting_hy", "closeUI");
        let lab_version = UNodeHelper.getComponent(this.node, "root/lab_version", cc.Label).string = "版本  " + cfg_global.version;

        this._master = UNodeHelper.find(this.node, "root/master");
        this._ipToggle = UNodeHelper.getComponent(this.node, "root/master/ip_toggle", cc.Toggle);
        this._bringInToggle = UNodeHelper.getComponent(this.node, "root/master/control_toggle", cc.Toggle);
        this._autoToggleNode = UNodeHelper.find(this.node, "root/master/auto_toggle");
        this._chat_toggle = UNodeHelper.getComponent(this.node, "root/master/chat_toggle", cc.Toggle);
        this._autoPre_toggle = UNodeHelper.getComponent(this.node, "root/master/autoPre_toggle", cc.Toggle);

        UEventHandler.addToggle(this._ipToggle.node, this.node, "ui_setting_hy", "onClickIpLimit");
        UEventHandler.addToggle(this._bringInToggle.node, this.node, "ui_setting_hy", "onClickBringInLimit");
        // UEventHandler.addToggle(this._autoToggle.node, this.node, "ui_setting_hy", "onClickAutoPlay");
        UEventHandler.addToggle(this._chat_toggle.node, this.node, "ui_setting_hy", "onClickChat");
        UEventHandler.addToggle(this._autoPre_toggle.node, this.node, "ui_setting_hy", "onClickAutoPre");

        this._ip_limit_btn = UNodeHelper.find(this.node, "root/master/ip_toggle/btn_ip_limit");
        this._ctr_score_btn = UNodeHelper.find(this.node, "root/master/control_toggle/btn_ctr_carry");
        this._auto_start_btn = UNodeHelper.find(this.node, "root/master/auto_toggle/btn_auto_start");
        this._btn_chat_tip = UNodeHelper.find(this.node, "root/master/chat_toggle/btn_chat_tip");
        let btn_autoPre_tips = UNodeHelper.find(this.node, "root/master/autoPre_toggle/btn_autoPre_tips");
        this._tip_node = UNodeHelper.find(this.node, "root/tip");

        UEventHandler.addClick(this._ip_limit_btn, this.node, "ui_setting_hy", "show_tip_info", 1);
        UEventHandler.addClick(this._auto_start_btn, this.node, "ui_setting_hy", "show_tip_info", 2);
        UEventHandler.addClick(this._ctr_score_btn, this.node, "ui_setting_hy", "show_tip_info", 3);
        UEventHandler.addClick(this._btn_chat_tip, this.node, "ui_setting_hy", "show_tip_info", 4);
        UEventHandler.addClick(btn_autoPre_tips, this.node, "ui_setting_hy", "show_tip_info", 5);
    }



    /**
     * @description  滑动条触摸结束
     */
    sliderTouchEnd() {
        let progress = this.slider.progress;
        this.refProIcon(progress);
    };

    sliderCallBack() {
        let progress = this.slider.progress;
        this.refProIcon(progress, false);
    };

    /**
     * @description  滑动刷新进度条icon
     * @param n 
     * @param  isClick 是否点击
     */
    refProIcon(progress: number, isClick: boolean = true) {

        let jianGeW = 1 / (this._autoOpenMaxPlayer - 2);
        let nowPos = this._autoOpenPlayer * jianGeW;
        // let iconP = this.proIcon.width / this.slider.node.width;

        let iconP = this._proIconLayoutSpacingX / 2 / this.slider.node.width;
        let n = Math.ceil((progress - iconP) / jianGeW);
        if (progress < nowPos && isClick) {//向左
            n = Math.floor((progress + iconP) / jianGeW);
        };

        let b = this.getProIconByIconIndex(n);
        if (isClick) {
            this.autoProgressBar.progress = b * 1;
            // this.slider.progress = b * 1;
            this._autoOpenPlayer = n;

            let f = this.slider.node.width * b;
            this.proBarIcon.setPosition(f, 0)
            this.onClickAutoPlay(n + 2);
            let childs = this.proIconLayout.node.children;
            for (let i = 0; i < childs.length; i++) {
                let node = childs[i];
                this.refProIcon2(node, n, i);
            };
        } else {
            this.autoProgressBar.progress = b * 1;
            // this.slider.progress = b * 1;
            this._autoOpenPlayer = n;
            let f = this.slider.node.width * b;
            this.proBarIcon.setPosition(f, 0)

            let childs = this.proIconLayout.node.children;
            for (let i = 0; i < childs.length; i++) {
                let node = childs[i];
                this.refProIcon2(node, n, i);
            };
        };
        this.autoPlayerLab.string = (n + 2).toString();

    };

    private refProIcon2(node: cc.Node, n: number, i: number) {
        let icon = node.getChildByName("icon");
        let labelNode = node.getChildByName("label");

        icon.active = i <= n ? true : false;
        if (i == n) {
            labelNode.setPosition(0, 35);
            labelNode.color = cc.color(160, 119, 53, 255);
        } else {
            labelNode.setPosition(0, 27);
            labelNode.color = cc.color(200, 189, 167, 255);
        }
    };

    private _proIconLayoutSpacingX: number = 0;

    /**
     * @description  初始化自动开始人数 
     * @param num 人数
     */
    private initAutoOpenPlayer(num: number) {
        this.autoPlayerLab.string = `${num}`;
        let width = this.autoProgressBar.node.width;
        let iconW = this.proIcon.width * this.proIcon.scaleX;
        let w = (width - 10 - iconW) / (this._autoOpenMaxPlayer - 2) - iconW;
        this.proIconLayout.spacingX = w;
        this._proIconLayoutSpacingX = w;
        this.proIconLayout.node.removeAllChildren();
        let index = num - 2 <= 0 ? 0 : num - 2;
        for (let i = 0; i < this._autoOpenMaxPlayer - 1; i++) {
            let item = cc.instantiate(this.proIcon);
            item.active = true;

            let lab = item.getChildByName("label").getComponent(cc.Label);
            lab.string = (i + 2).toString();
            this.refProIcon2(item, index, i);
            // item.x = i * w + 5 + this.proIcon.width;
            item.y = 0;
            this.proIconLayout.node.addChild(item);
        };
        this.scheduleOnce(() => {
            let b = this.getProIconByIconIndex(index);
            let f = this.slider.node.width * b;
            this.proBarIcon.setPosition(f, 0);
            this.autoProgressBar.progress = b * 1;
        }, 0.01)

    };

    /**
     * @description 得到进度条 icon得比例
     */
    getProIconByIconIndex(index: number): number {

        let childs = this.proIconLayout.node.children;
        let iconPos = childs[index].x;
        let sliderW = this.slider.node.width;
        let b = iconPos / sliderW;
        return b;
    }



    show_tip_info(event: any, tip_flag: number): void {
        this._tip_node.active = true;
        let len = this.tipsArr.length
        for (let i = 0; i < len; i++) {
            this.tipsArr[i].active = false;
        };
        this.tipsArr[tip_flag - 1].active = true;

    }

    closeTip() {
        this._tip_node.active = false;
        let len = this.tipsArr.length
        for (let i = 0; i < len; i++) {
            this.tipsArr[i].active = false;
        };
    }

    /**点击ip限制 */
    onClickIpLimit() {
        this._callback && this._callback(1, this._ipToggle.isChecked);
        this._ipToggle.isChecked = !this._ipToggle.isChecked;
        cc.warn(">> 点击ip限制 >> ", this._ipToggle.isChecked)
    }

    /**点击控制带入 */
    onClickBringInLimit() {
        this._callback && this._callback(2, this._bringInToggle.isChecked);
        this._bringInToggle.isChecked = !this._bringInToggle.isChecked;
    }

    /**开局人数 */
    onClickAutoPlay(n: number) {
        this._callback && this._callback(3, n);
        // this._autoToggle.isChecked = !this._autoToggle.isChecked;
        cc.warn(">> 点击自动开局 >> ", n)
    }
    /**点击聊天开关 */
    onClickChat() {
        this._callback && this._callback(4, this._chat_toggle.isChecked);
        // this._chat_toggle.isChecked = !this._chat_toggle.isChecked;
        cc.warn(">> 点击聊天开关 >> ", this._chat_toggle.isChecked)
    };
    /**
     * @description 自动准备
     */
    onClickAutoPre() {
        this._callback && this._callback(5, this._autoPre_toggle.isChecked);
        // this._chat_toggle.isChecked = !this._chat_toggle.isChecked;
        cc.warn(">> 点击自动准备开关 >> ", this._autoPre_toggle.isChecked)
    };

    closeUI() {
        super.playclick();
        super.clickClose();
    }

    /**
     *  隐藏
     */
    hide(): void {
        this.node.active = false;
        AppGame.ins.gamebaseModel.off(MBaseGameModel.SC_UPDATE_SETTING_PANEL, this.onUpdateToggle, this);
    }

    /**
     * 显示
     */
    show(data: any): void {
        UDebug.log('显示设置  ', data)
        super.show(data);
        this.refreshData();
        AppGame.ins.gamebaseModel.on(MBaseGameModel.SC_UPDATE_SETTING_PANEL, this.onUpdateToggle, this);

        if (data && data.roomInfo) {
            this._callback = data.callback;
            let isRoomMaster = data.roomInfo.roomUserId == AppGame.ins.roleModel.useId ? true : false;
            this._ipToggle.isChecked = data.roomInfo.bIPLimit;
            this._bringInToggle.isChecked = data.roomInfo.bAddScoreLimit;
            // this._autoToggleNode.isChecked = data.roomInfo.bAutoStart;
            this._chat_toggle.isChecked = data.roomInfo.bChatLimit;
            this._autoPre_toggle.isChecked = data.roomInfo.autoStart;

            this._chat_toggle.node.active = false;
            this._ipToggle.node.active = false;
            this._autoToggleNode.active = false;
            this._autoPre_toggle.node.active = false;
            this._bringInToggle.node.active = false;
            isRoomMaster && this.refSettingView(data.roomInfo);
        };
    }

    /**
     * @description 根据是否是房主 显示设置界面
     * @param  roomInfo  房间信息
     */
    refSettingView(roomInfo: any) {
        //带入限制只有炸金花有
        this._bringInToggle.node.active = roomInfo.gameId == EGameType.ZJH_HY ? true : false;
        this._chat_toggle.node.active = true;
        this._ipToggle.node.active = true;
        //跑得快、斗地主只有ip限制
        if (roomInfo.gameId == EGameType.PDK_HY || roomInfo.gameId == EGameType.DDZ_HY) {
            this._autoToggleNode.active = false;
        } else {
            if (roomInfo.gameId == EGameType.ZJH_HY) {
                this._autoOpenMaxPlayer = 5;
            } else if (roomInfo.gameId == EGameType.TBNN_HY || roomInfo.gameId == EGameType.KPQZNN_HY) {
                this._autoOpenMaxPlayer = 4;
            }
            this._autoPre_toggle.node.active = true;
            this._autoToggleNode.active = true;
            this._autoOpenPlayer = roomInfo.playerNumLimit;
            this.initAutoOpenPlayer(this._autoOpenPlayer);

        }
    }

    /**
     * 点击响应回调 1、点击ip限制 2、点击控制带入 3.开局人数 4禁止聊天 5.自动准备
     */
    onUpdateToggle(data: any) {
        // UDebug.log('更新按钮 => ', data)
        switch (data.type) {
            case 1:
                this._ipToggle.isChecked = data.bLimit;
                break;
            case 2:
                this._bringInToggle.isChecked = data.bLimit;
                break;
            case 3:
                this._autoOpenPlayer = data.playerNumLimit;
                let index = this._autoOpenPlayer - 2 <= 0 ? 0 : this._autoOpenPlayer - 2;
                let b = this.getProIconByIconIndex(index);
                let f = this.slider.node.width * b;
                this.proBarIcon.setPosition(f, 0);
                this.autoProgressBar.progress = b * 1;
                break;
            case 4:
                this._chat_toggle.isChecked = data.bLimit;
                break;
            case 5:
                this._autoPre_toggle.isChecked = data.bAutoStart;
                break;
            default:
                break;
        }
    }

    private refreshData(): void {
        if (AppGame.ins.setting.music == 1) {
            this._music_toggle.isChecked = true;
        } else if (AppGame.ins.setting.music == 0) {
            this._music_toggle.isChecked = false;
        };

        if (AppGame.ins.setting.sound == 1) {
            this._sound_toggle.isChecked = true;
        } else if (AppGame.ins.setting.sound == 0) {
            this._sound_toggle.isChecked = false;
        }
    }


    onEnable() {
        this.slider.node.on(cc.Node.EventType.TOUCH_END, this.sliderTouchEnd.bind(this));
        this.slider.node.on(cc.Node.EventType.TOUCH_CANCEL, this.sliderTouchEnd.bind(this));
    };
    onDisable() {
        this.slider.node.off(cc.Node.EventType.TOUCH_END);
        this.slider.node.off(cc.Node.EventType.TOUCH_CANCEL);
    };

}

