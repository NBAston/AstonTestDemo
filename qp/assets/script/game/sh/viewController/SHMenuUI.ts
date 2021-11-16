import UToggle from "../../../common/utility/UToggle";
import SHMusic from "../SHMusic";
import SHModel from "../model/SHModel";
import AppGame from "../../../public/base/AppGame";
import { ECommonUI, EGameType } from "../../../common/base/UAllenum";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventListener from "../../../common/utility/UEventListener";
import UHandler from "../../../common/utility/UHandler";



const offset = { x: -300, y: -66, t: 0.3 };
/**
 * 菜单控制
 */
export default class SHMenuUI {


    /**主节点 */
    private _btnMain: UToggle;
    /**menu节点 */
    private _menu: cc.Node;
    private _music: SHMusic;
    // private _btnPaiXing: cc.Node;
    private _bntContent: cc.Node;
    private _hideBack: cc.Node;
    /**
     * 离开游戏
     */
    private on_leave(): void {
        SHModel.ins.exitGame();
        this.closemenu();
        this._music.playclick();
    }

    private on_shezhi(): void {
        AppGame.ins.showUI(ECommonUI.LB_Setting, EGameType.SH);
        this.closemenu();
        this._music.playclick();
    }
    private on_record(): void {
        AppGame.ins.showUI(ECommonUI.LB_Record, EGameType.SH);
        this.closemenu();
        this._music.playclick();
    }
    private on_wanfa(): void {
        AppGame.ins.showUI(ECommonUI.ZJH_Help, { gameType: EGameType.SH });
        this.closemenu();
        this._music.playclick();
    }

    private on_fankui(): void {

    }
    private clickMenu(isOn: boolean): void {
        this._menu.active = isOn;
        // this._btnPaiXing.active = !isOn;
    }
    private closemenu(): void {
        this.showMenu(false);
        this._music.playclick();
    }
    private clickhideContent(): void {
        this._hideBack.active = false;
        this._bntContent.stopAllActions();
        let ac = cc.sequence(cc.moveTo(offset.t, offset.x, offset.y), cc.callFunc(() => {
            this.activePaixing(false);
        }));
        this._bntContent.runAction(ac);
    }
    private on_showPaixing(): void {
        this.activePaixing(true);
        this._bntContent.stopAllActions();
        let ac = cc.moveTo(offset.t, 0, offset.y);
        this._bntContent.runAction(ac);
        this._music.playclick();
    }
    private activePaixing(value): void {
        this._hideBack.active = value;
        if (this._btnMain.IsOn) {
            // this._btnPaiXing.active = false;
        } else
            // this._btnPaiXing.active = !value;
            this._bntContent.active = value;
        this._bntContent.setPosition(offset.x, offset.y);
    }
    constructor(root: cc.Node, menu: cc.Node, music: SHMusic) {
        this._music = music;
        let main = UNodeHelper.find(root, "btn_menu");
        this._btnMain = main.getComponent(UToggle);

        // this._btnPaiXing = UNodeHelper.find(root, "btn_paixing");
        this._bntContent = UNodeHelper.find(root, "paixing_content");
        this._menu = menu;
        let btn_leave = UNodeHelper.find(menu, "gf_bg_menu/btn_leave");
        let btn_shezhi = UNodeHelper.find(menu, "gf_bg_menu/btn_shezhi");
        let btn_record = UNodeHelper.find(menu, "gf_bg_menu/btn_record");
        let btn_wanfa = UNodeHelper.find(menu, "gf_bg_menu/btn_wanfa");
        let btn_fankui = UNodeHelper.find(menu, "gf_bg_menu/btn_fankui");
        let bg = UNodeHelper.find(menu, "gf_bg_menu/bg");
        this._hideBack = UNodeHelper.find(root, "paixing_bag");
        UEventListener.get(btn_leave).onClick = new UHandler(this.on_leave, this);
        UEventListener.get(btn_shezhi).onClick = new UHandler(this.on_shezhi, this);
        UEventListener.get(btn_record).onClick = new UHandler(this.on_record, this);
        UEventListener.get(btn_wanfa).onClick = new UHandler(this.on_wanfa, this);
        UEventListener.get(btn_fankui).onClick = new UHandler(this.on_fankui, this);
        // UEventListener.get(this._btnPaiXing).onClick = new UHandler(this.on_showPaixing, this);
        UEventListener.get(bg).onClick = new UHandler(this.closemenu, this);
        UEventListener.get(this._hideBack).onClick = new UHandler(this.clickhideContent, this);
        this._btnMain.clickHandler = new UHandler(this.clickMenu, this);
    }
    /**隐藏牌型按钮 */
    hideContent(): void {
        this._bntContent.stopAllActions();
        this.activePaixing(false);
    }
    /**
    * 显示Menubtn
    */
    showMenu(value: boolean): void {
        this._menu.active = value;
        this._btnMain.IsOn = value;
        // this._btnPaiXing.active = !value;
    }
}
