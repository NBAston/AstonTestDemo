import { ECommonUI, ETipType } from "../../../common/base/UAllenum";
import { Bcbm } from "../../../common/cmd/proto";
import UDebug from "../../../common/utility/UDebug";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../../public/base/AppGame";
import VbcbmScene from "../VbcbmScene";
import VBcbmMenu from "./VBcbmMenu";
import UAudioManager from "../../../common/base/UAudioManager";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VBcbmBtn extends cc.Component {

    private _bcbmScene:VbcbmScene = null;
    
    @property({ type: cc.Node, tooltip: "菜单界面" })
    node_menu: cc.Node = null;
   
    // @property({ type: cc.Node, tooltip: "玩家列表" })
    // node_playerlist: cc.Node = null;

    @property({ type: VbcbmScene})
    bcbm_scene: VbcbmScene = null;

    @property(cc.ToggleContainer)
    toggle_ct_chip: cc.ToggleContainer = null;

    onLoad() {
        this._bcbmScene = UNodeHelper.getComponent(this.node.parent, "", VbcbmScene);
    }

    start() {
        // this.node_playerlist.active = false;

        // this.node_playerlist.on(cc.Node.EventType.TOUCH_END, () => {
        //     this.node_playerlist.active = false;

        // }, this);

        // this.node_playerlist['_touchListener'].setSwallowTouches(false);
    }

    /**
 * 点击菜单按钮
 * @param toggle 菜单按钮
 */
    onClickMenu(toggle: cc.Toggle) {
        UAudioManager.ins.playSound("audio_click");
        var node = toggle.node;
        let is_check = toggle.isChecked;
        var v_menu = this.node_menu.getComponent(VBcbmMenu);
        var sp_bg = node.getChildByName('sp_bk');
        if (is_check) {
            // sp_bg.active = false;
            v_menu.show(this.bcbm_scene._room_info);
            toggle.interactable = false;
        }
        else {
            sp_bg.active = true;
        }
    }

    /**
     * 点击换桌按钮
     */
    private onClickSwitchDesk() {

    }

    /**
     * 点击玩家列表按钮
     */
    private onClickPlayerList() {
        // this.node_playerlist.active = true;
        // this.showVsAnima();
        // this.openCard(12, 13);
    }

    /**
    * 点击下注区域
    * @param btn 
    */
    private onClickBetArea(btn: cc.Button) {
        var cur_chip_sel = this._bcbmScene._chipgroup.curSel;
        let game_status = this._bcbmScene._game_status;
        if ( game_status != 2 && game_status != 5) {
            UDebug.log('当前不是下注时间,当前状态：' + game_status );
            AppGame.ins.showTips('当前不是下注时间');
            return;
        }
        var chipvalue = this._bcbmScene.chipIndexToValue(cur_chip_sel);
        if (cur_chip_sel == -1) {
            AppGame.ins.showTips('金币不足！');
            return;
        }
        switch (btn.target.name) {
            case 'sp_rect_0':
                {
                    AppGame.ins.bcbmModel.sendBet(Bcbm.JET_AREA.BENZ_AREA, chipvalue);
                    UDebug.Log("自己下注区域0");
                    break;
                }
            case 'sp_rect_1':
                {
                    AppGame.ins.bcbmModel.sendBet(Bcbm.JET_AREA.BMW_AREA, chipvalue);
                    UDebug.Log("自己下注区域1");
                    break;
                }
            case 'sp_rect_2':
                {
                    AppGame.ins.bcbmModel.sendBet(Bcbm.JET_AREA.AUDI_AREA, chipvalue);
                    UDebug.Log("自己下注区域2");
                    break;
                }
            case 'sp_rect_3':
                {
                    AppGame.ins.bcbmModel.sendBet(Bcbm.JET_AREA.JAGUAR_AREA, chipvalue);
                    UDebug.Log("自己下注区域3");
                    break;
                }
            case 'sp_rect_4':
                {
                    AppGame.ins.bcbmModel.sendBet(Bcbm.JET_AREA.PORSCHE_AREA, chipvalue);
                    UDebug.Log("自己下注区域4");
                    break;
                }
            case 'sp_rect_5':
                {
                    AppGame.ins.bcbmModel.sendBet(Bcbm.JET_AREA.MASERATI_AREA, chipvalue);
                    UDebug.Log("自己下注区域5");
                    break;
                }
            case 'sp_rect_6':
                {
                    AppGame.ins.bcbmModel.sendBet(Bcbm.JET_AREA.LAMBORGHINI_AREA, chipvalue);
                    UDebug.Log("自己下注区域6");
                    break;
                }
            case 'sp_rect_7':
                {
                    AppGame.ins.bcbmModel.sendBet(Bcbm.JET_AREA.FERRARI_AREA, chipvalue);
                    UDebug.Log("自己下注区域7");
                    break;
                }
        }
    }
}
