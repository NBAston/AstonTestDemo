import { ECommonUI, EGameType } from "../../../common/base/UAllenum";
import AppGame from "../../../public/base/AppGame";
import { RoomInfo } from "../../../public/hall/URoomClass";
import UAudioManager from "../../../common/base/UAudioManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VBcbmMenu extends cc.Component {

    @property(cc.Node)
    node_menu_bg: cc.Node = null;

    @property(cc.Node)
    node_mask: cc.Node = null;

    @property(cc.Toggle)
    toggle_menu: cc.Toggle = null;

    private _room_info: RoomInfo = null;

    onLoad() {
        this.node.active = false;


        this.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.hide();
        }, this);
        this.node['_touchListener'].setSwallowTouches(false);
    }

    hide() {
        // this.node.active = false;
        this.node_mask.runAction(cc.fadeOut(0.2));

        this.node_menu_bg.stopAllActions();
        this.node_menu_bg.runAction(cc.sequence(cc.spawn(cc.fadeOut(0.2), cc.scaleTo(0.2, 1, 0.01)), cc.callFunc(() => {
            this.node.active = false;
            this.toggle_menu.isChecked = false;
            this.toggle_menu.interactable = true;
        }, this)));
    }

    show(data) {
        this.node.active = true;
        this.node_menu_bg.scaleY = 0.01;
        this.node_menu_bg.scaleX = 1;
        this.node_menu_bg.opacity = 255;

        this._room_info = data;

        this.node_menu_bg.runAction(cc.scaleTo(0.1, 1));

        this.node_mask.opacity = 0;
        this.node_mask.runAction(cc.fadeTo(0.2, 100));

    }

    // private onClickPanel(){
    //     this.hide();
    // }

    private onClickExit() {
        UAudioManager.ins.playSound("audio_click");
        this.hide();
        // AppGame.ins.loadLevel(ELevelType.Hall, {});
        AppGame.ins.brlhModel.sendLeftGame(this._room_info.gameId, this._room_info.roomId);
    }

    private onClickSetting() {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.showUI(ECommonUI.LB_Setting);
        this.hide();
    }

    private onClickJiLv() {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.showUI(ECommonUI.LB_Record, EGameType.BCBM);
        this.hide();
    }

    private onClickHelp() {
        UAudioManager.ins.playSound("audio_click");
        // AppGame.ins.showUI(ECommonUI.BRLH_Help, {});
        AppGame.ins.showUI(ECommonUI.ZJH_Help, {gameType: EGameType.BCBM});
        this.hide();
    }

    private onClickFankui() {
        AppGame.ins.showUI(ECommonUI.BRLH_Feedback, {});
        this.hide();
        UAudioManager.ins.playSound("audio_click");
    }
}
