import AppGame from "../../../public/base/AppGame";
import { ELevelType, ECommonUI, EGameType } from "../../../common/base/UAllenum";
import { RoomInfo } from "../../../public/hall/URoomClass";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VBrebgMenu extends cc.Component {

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
        this.node_menu_bg.runAction(cc.sequence(cc.spawn(cc.fadeOut(0.2), cc.scaleTo(0.2,1, 0)), cc.callFunc(() => {
            this.node.active = false;
            // this.toggle_menu.uncheck(); 
            this.toggle_menu.isChecked = false;
            var sp_bg = this.toggle_menu.node.getChildByName('sp_bk');
            sp_bg.active = true;
            this.toggle_menu.interactable = true;
            
        }, this)));
    }

    show(data) {
        this.node.active = true;

        this._room_info = data;

        this.node_menu_bg.scaleY = 0;
        this.node_menu_bg.opacity = 255;
        this.node_menu_bg.runAction(cc.scaleTo(0.1, 1));

        this.node_mask.opacity = 0;
        this.node_mask.runAction(cc.fadeTo(0.2, 100));

    }

    // private onClickPanel(){
    //     this.hide();
    // }

    private onClickExit() {

        this.hide();
        AppGame.ins.brebgModel.sendLeftGame(this._room_info.gameId, this._room_info.roomId);
        // AppGame.ins.loadLevel(ELevelType.Hall, {});
    }

    private onClickSetting() {
        AppGame.ins.showUI(ECommonUI.LB_Setting);
        this.hide();
    }

    private onClickJiLv() {
        AppGame.ins.showUI(ECommonUI.LB_Record, EGameType.BREBG);

        this.hide();
    }

    private onClickHelp() {
        AppGame.ins.showUI(ECommonUI.ZJH_Help, {gameType: EGameType.BREBG});
        this.hide();
    }

    private onClickFankui() {
        // AppGame.ins.showUI(ECommonUI.EBG_Record, {});
        this.hide();
    }
}
