import UToggle from "../../common/utility/UToggle";
import UAudioManager from "../../common/base/UAudioManager";
import MSSS from "./MSSS";
import AppGame from "../../public/base/AppGame";
import { ECommonUI, EGameType, ELevelType } from "../../common/base/UAllenum";
import UDebug from "../../common/utility/UDebug";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventListener from "../../common/utility/UEventListener";
import UHandler from "../../common/utility/UHandler";





/**
 * 创建:gss
 * 作用：21点的菜单控制
 */
export default class SSSMenu {
    /**menu节点 */
    private _menu: cc.Node;
    /**
     * 离开游戏
     */
    private on_leave(): void {
        UAudioManager.ins.playSound("audio_click");
        MSSS.ins.exitGame();
        this.closemenu();
    }

    private on_shezhi(): void {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.showUI(ECommonUI.LB_Setting, EGameType.SSS);
        this.closemenu();
    }
    private on_record(): void {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.showUI(ECommonUI.LB_Record, EGameType.SSS);
        this.closemenu();
    }
    private on_wanfa(): void {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.showUI(ECommonUI.ZJH_Help, { gameType: EGameType.SSS });
        this.closemenu();
    }

    private on_fankui(): void {

    }
    private clickMenu(isOn: boolean): void {
        this._menu.active = isOn;
        UDebug.Log("显示clickMenu" + isOn)
    }
    private closemenu(): void {
        this.showMenu(false);

    }

    constructor(menu: cc.Node) {
        this._menu = menu;
        let btn_leave = UNodeHelper.find(menu, "menu_node/gf_bg_menu/btn_leave");
        let btn_shezhi = UNodeHelper.find(menu, "menu_node/gf_bg_menu/btn_shezhi");
        let btn_record = UNodeHelper.find(menu, "menu_node/gf_bg_menu/btn_record");
        let btn_wanfa = UNodeHelper.find(menu, "menu_node/gf_bg_menu/btn_wanfa");
        let btn_fankui = UNodeHelper.find(menu, "menu_node/gf_bg_menu/btn_fankui");
        let bg = UNodeHelper.find(menu, "menu_node/bg");
        UEventListener.get(btn_leave).onClick = new UHandler(this.on_leave, this);
        UEventListener.get(btn_shezhi).onClick = new UHandler(this.on_shezhi, this);
        UEventListener.get(btn_record).onClick = new UHandler(this.on_record, this);
        UEventListener.get(btn_wanfa).onClick = new UHandler(this.on_wanfa, this);
        UEventListener.get(btn_fankui).onClick = new UHandler(this.on_fankui, this);
        UEventListener.get(bg).onClick = new UHandler(this.closemenu, this);
    }
    /**
    * 显示Menubtn
    */
    showMenu(value: boolean): void {
        UDebug.Log("显示Menubtn" + value)
        this._menu.active = value;
    }
}
