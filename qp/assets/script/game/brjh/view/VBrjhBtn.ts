
import AppGame from "../../../public/base/AppGame";
import { ECommonUI, ETipType } from "../../../common/base/UAllenum";
import {Brjh } from "../../../common/cmd/proto";
import VBrjhScene from "../VBrjhScene";
import VBrjhMenu from "./VBrjhMenu";
import UDebug from "../../../common/utility/UDebug";
import MRole from "../../../public/hall/lobby/MRole";
import UAudioManager from "../../../common/base/UAudioManager";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VBrjhBtn extends cc.Component {

    @property({ type: cc.Node, tooltip: "菜单界面" })
    node_menu: cc.Node = null;
    @property({ type: VBrjhScene })
    brjh_scene: VBrjhScene = null;
    @property(cc.ToggleContainer)
    toggle_ct_chip: cc.ToggleContainer = null;

    start() {
    }
    /**
     * 点击菜单按钮
     * @param toggle 菜单按钮
     */
    onClickMenu(toggle: cc.Toggle) {
        UAudioManager.ins.playSound("audio_click");
        var node = toggle.node;
        let is_check = toggle.isChecked;
        var v_menu = this.node_menu.getComponent(VBrjhMenu);
        var sp_bg = node.getChildByName('sp_bk');
        if (is_check) {
            v_menu.show(this.brjh_scene._room_info);
            toggle.interactable = false;
        }
        else {
            sp_bg.active = true;
        }
    }

    /**
     * 点击路单按钮
     */
    private onClickLuDan() {
        AppGame.ins.showBundleUI(ECommonUI.BRJH_Ludan,this.brjh_scene._room_info.gameId,null)
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
    }

    /**
    * 点击下注区域
    * @param btn 
    */
    private onClickRect(btn: cc.Button) {
        if(MRole.bankerBool){
            AppGame.ins.showTips({ data: "自己是庄家时,不能下注!", type: ETipType.onlyone });
            return;
        }
        var cur_chip_sel = 0;
        if (VBrjhScene.game_status != 1 && VBrjhScene.game_status != 2) {
            UDebug.log('当前不是下注时间 ' + VBrjhScene.game_status);
            this.brjh_scene.showTips('当前不是下注时间');
            return;
        }
        for (let index = 0; index < this.toggle_ct_chip.toggleItems.length; index++) {
            const element = this.toggle_ct_chip.toggleItems[index];
            if (element.isChecked) {

                cur_chip_sel = index;
            }
        }

        var chipvalue = this.brjh_scene.chipIndexToValue(cur_chip_sel);
        switch (btn.target.name) {

            case 'sp_rect_1':
                {
                    AppGame.ins.brjhModel.sendBet(Brjh.JET_AREA.TIAN_AREA, chipvalue);
                    break;
                }
            case 'sp_rect_2':
                {
                    AppGame.ins.brjhModel.sendBet(Brjh.JET_AREA.DI_AREA, chipvalue);

                    break;
                }
            case 'sp_rect_3':
                {
                    AppGame.ins.brjhModel.sendBet(Brjh.JET_AREA.XUAN_AREA, chipvalue);
                    break;
                }
            case 'sp_rect_4':
                {
                    AppGame.ins.brjhModel.sendBet(Brjh.JET_AREA.HUANG_AREA, chipvalue);
                    break;
                }
        }
    }
}