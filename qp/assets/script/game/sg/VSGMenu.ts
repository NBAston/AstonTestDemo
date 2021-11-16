import UHandler from "../../common/utility/UHandler";
import UEventListener from "../../common/utility/UEventListener";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UToggle from "../../common/utility/UToggle";
import { ECommonUI, EGameType } from "../../common/base/UAllenum";
import AppGame from "../../public/base/AppGame";
import VSG from "./VSG";
import UMsgCenter from "../../common/net/UMsgCenter";


/**
 * 作用:dz
 * 创建:三公菜单界面
 */

export default class VSGMenu {


    /**主节点 */
    private _btnMain: UToggle;
    /**menu节点 */
    private _menu: cc.Node;

    private _vsg: VSG;

    private _node_menu_bg: cc.Node;
    private _gf_bg_menu: cc.Node;

    /**
     * 离开游戏
     */
    private on_leave(): void {
        this._vsg.playClick();
        AppGame.ins.sgModel.exitGame();
        this.closemenu();
    }

    private on_shezhi(): void {
        AppGame.ins.showUI(ECommonUI.LB_Setting);
        this._vsg.playClick();
        this.closemenu();
    }
    private on_record(): void {
        AppGame.ins.showUI(ECommonUI.LB_Record, EGameType.SG);
        this._vsg.playClick();
        this.closemenu();
    }
    private on_wanfa(): void {
        AppGame.ins.showUI(ECommonUI.ZJH_Help, { gameType: EGameType.SG });
        this._vsg.playClick();
        this.closemenu();
    }

    private on_fankui(): void {

    }
    private clickMenu(isOn: boolean): void {
        this._vsg.playClick();

        // this._menu.active = isOn;
        this.showMenu(isOn);

    }
    private closemenu(): void {
        this._vsg.playClick();

        this.showMenu(false);

    }
    setOn(value: boolean) {
        this._btnMain.IsOn = value;
    }
    constructor(main: cc.Node, menu1: cc.Node, sg: VSG) {
        this._vsg = sg;
        this._btnMain = main.getComponent(UToggle);

        this._menu = menu1;
        var menu = UNodeHelper.find(menu1, "menu_node");

        this._node_menu_bg = UNodeHelper.find(menu1, "menu_bg");

        this._gf_bg_menu = UNodeHelper.find(menu, "gf_bg_menu");

        let btn_leave = UNodeHelper.find(menu, "gf_bg_menu/btn_leave");
        let btn_shezhi = UNodeHelper.find(menu, "gf_bg_menu/btn_shezhi");
        let btn_record = UNodeHelper.find(menu, "gf_bg_menu/btn_record");
        let btn_wanfa = UNodeHelper.find(menu, "gf_bg_menu/btn_wanfa");
        let btn_fankui = UNodeHelper.find(menu, "gf_bg_menu/btn_fankui");
        let bg = UNodeHelper.find(menu, "bg");

        UEventListener.get(btn_leave).onClick = new UHandler(this.on_leave, this);
        UEventListener.get(btn_shezhi).onClick = new UHandler(this.on_shezhi, this);
        UEventListener.get(btn_record).onClick = new UHandler(this.on_record, this);
        UEventListener.get(btn_wanfa).onClick = new UHandler(this.on_wanfa, this);
        UEventListener.get(btn_fankui).onClick = new UHandler(this.on_fankui, this);
        UEventListener.get(bg).onClick = new UHandler(this.closemenu, this);

        this._btnMain.clickHandler = new UHandler(this.clickMenu, this);
    }
    /**
    * 显示Menubtn
    */
    showMenu(value: boolean): void {
        // this._menu.active = value;
        // this._btnMain.IsOn = value;

        if (value == true) {
            this._btnMain.IsOn = value;
            this._menu.active = true;
            this._gf_bg_menu.stopAllActions();
            this._node_menu_bg.stopAllActions();

            this._gf_bg_menu.scaleY = 0;
            this._gf_bg_menu.opacity = 255;
            this._gf_bg_menu.runAction(cc.scaleTo(0.1, 1));

            this._node_menu_bg.opacity = 0;
            this._node_menu_bg.runAction(cc.fadeTo(0.2, 100));
        }
        else {
            this._node_menu_bg.stopAllActions();
            this._node_menu_bg.runAction(cc.fadeOut(0.2));

            this._gf_bg_menu.stopAllActions();
            this._gf_bg_menu.runAction(cc.sequence(cc.spawn(cc.fadeOut(0.2), cc.scaleTo(0.2, 1, 0)), cc.callFunc(() => {
                this._menu.active = false;
                this._btnMain.IsOn = value;
            }, this)));
        }
    }

    // onDestroy() {
    //     this._vsg = null;
    // }
}
