import AppGame from "../../../public/base/AppGame";
import { ELevelType, ECommonUI, EGameType } from "../../../common/base/UAllenum";
import { RoomInfo } from "../../../public/hall/URoomClass";
import VBrhhScene from "../VBrhhScene";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VBrhhMenu extends cc.Component {

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
        this.node_menu_bg.runAction(cc.sequence(cc.spawn(cc.fadeOut(0.2), cc.scaleTo(0.2, 1, 0)), cc.callFunc(() => {
            this.node.active = false;
            this.toggle_menu.isChecked = false;
            this.toggle_menu.interactable = true;
        }, this)));
    }

    show(data: any) {
        this.node.active = true;
        this.node_menu_bg.scaleY = 0;
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
        VBrhhScene.ins._music_mgr.playClick();
        this.hide();
        // AppGame.ins.loadLevel(ELevelType.Hall, {});

        AppGame.ins.brhhModel.sendLeftGame(this._room_info.gameId, this._room_info.roomId);

    }

    private onClickSetting() {
        VBrhhScene.ins._music_mgr.playClick();
        AppGame.ins.showUI(ECommonUI.LB_Setting);
        this.hide();
    }

    private onClickJiLv() {
        VBrhhScene.ins._music_mgr.playClick();
        AppGame.ins.showUI(ECommonUI.LB_Record, EGameType.BRHH);
        this.hide();
    }

    private onClickHelp() {
        VBrhhScene.ins._music_mgr.playClick();
        AppGame.ins.showUI(ECommonUI.ZJH_Help, {gameType: EGameType.BRHH});
        this.hide();
    }

    private onClickFankui() {
        VBrhhScene.ins._music_mgr.playClick();
        // AppGame.ins.showUI(ECommonUI.BRLH_Feedback, {});
        this.hide();
    }
}
