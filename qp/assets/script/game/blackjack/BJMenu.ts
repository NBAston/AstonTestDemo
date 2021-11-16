
import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventListener from "../../common/utility/UEventListener";
import UHandler from "../../common/utility/UHandler";
import AppGame from "../../public/base/AppGame";
import { ECommonUI, EGameType } from "../../common/base/UAllenum";
import UToggle from "../../common/utility/UToggle";
import UDebug from "../../common/utility/UDebug";
import UAudioManager from "../../common/base/UAudioManager";



/**
 * 创建:gss
 * 作用：21点的菜单控制
 */
export default class BJMenu {


    /**主节点 */
    private _btnMain: UToggle;
    /**menu节点 */
    private _menu: cc.Node;
    private _baodian_node: cc.Node;
    private _baodianMenu: cc.Node;
    /**
     * 离开游戏
     */
    private on_leave(): void {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.bjModel.exitGame();
        this.closemenu();
    }

    private on_shezhi(): void {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.showUI(ECommonUI.LB_Setting);
        this.closemenu();
    }
    private on_record(): void {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.showUI(ECommonUI.LB_Record, EGameType.BJ);
        this.closemenu();
    }
    private on_wanfa(): void {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.showUI(ECommonUI.ZJH_Help, { gameType: EGameType.BJ });
        //this.closemenu();
    }

    private on_fankui(): void {

    }
    private clickMenu(isOn: boolean): void {
        this._menu.active = isOn;
        this._baodianMenu.active = !isOn
    }
    private closemenu(): void {
        this.showMenu(false);

    }
    private clicbaodian(isOn: boolean): void {
        this._baodian_node.active = true
    }
    private openbaodian(): void {
        this._baodian_node.active = true
        this._baodian_node.opacity = 255;
        this._baodian_node.scaleY = 0.1;
        // this._node_bg.scale = 0.01;
        // this._node_bg.y = 672;
        let ac = cc.scaleTo(0.2, 1, 1.05);
        let ac2 = cc.scaleTo(0.05, 1);
        let seq = cc.sequence(ac, ac2);
        // ac.easing(cc.easeInOut(2.0));
        this._baodian_node.runAction(seq);

        // this._node_mask.opacity = 0.1;
        // this._node_mask.runAction(cc.fadeTo(0.5, 120));
    }
    private closebaodian(): void {
        UAudioManager.ins.playSound("audio_click");
        this._baodian_node.active = false

    }
    constructor(main: cc.Node, menu: cc.Node, baodianMenu: cc.Node, baodianNode: cc.Node) {

        this._btnMain = main.getComponent(UToggle);

        this._menu = menu;
        this._baodian_node = baodianNode;
        this._baodianMenu = baodianMenu
        this._baodianMenu.active = false
        this._baodian_node.active = false
        let btn_leave = UNodeHelper.find(menu, "gf_bg_menu/btn_leave");
        let btn_shezhi = UNodeHelper.find(menu, "gf_bg_menu/btn_shezhi");
        let btn_record = UNodeHelper.find(menu, "gf_bg_menu/btn_record");
        let btn_wanfa = UNodeHelper.find(menu, "gf_bg_menu/btn_wanfa");
        let btn_fankui = UNodeHelper.find(menu, "gf_bg_menu/btn_fankui");
        let bg = UNodeHelper.find(menu, "gf_bg_menu/bg");
        let baodianbg = UNodeHelper.find(this._baodian_node, "baodianBg");
        UEventListener.get(btn_leave).onClick = new UHandler(this.on_leave, this);
        UEventListener.get(btn_shezhi).onClick = new UHandler(this.on_shezhi, this);
        UEventListener.get(btn_record).onClick = new UHandler(this.on_record, this);
        UEventListener.get(btn_wanfa).onClick = new UHandler(this.on_wanfa, this);
        UEventListener.get(btn_fankui).onClick = new UHandler(this.on_fankui, this);
        UEventListener.get(bg).onClick = new UHandler(this.closemenu, this);
        UEventListener.get(this._baodianMenu).onClick = new UHandler(this.openbaodian, this);
        UEventListener.get(baodianbg).onClick = new UHandler(this.closebaodian, this);
        this._btnMain.clickHandler = new UHandler(this.clickMenu, this);
    }
    /**
    * 显示Menubtn
    */
    showMenu(value: boolean): void {
        this._menu.active = value;
        this._btnMain.IsOn = value;
        this._baodianMenu.active = !value
    }
}
