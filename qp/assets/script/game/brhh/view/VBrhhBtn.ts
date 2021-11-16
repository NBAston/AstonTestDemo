import VBrhhMenu from "./VBrhhMenu";
import VBrhhScene from "../VBrhhScene";
import AppGame from "../../../public/base/AppGame";
import { ECommonUI } from "../../../common/base/UAllenum";
import { HongHei } from "../../../common/cmd/proto";
import UDebug from "../../../common/utility/UDebug";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VBrhhBtn extends cc.Component {

    @property({ type: cc.Node, tooltip: "菜单界面" })
    node_menu: cc.Node = null;
   
    @property({ type: cc.Node, tooltip: "玩家列表" })
    node_playerlist: cc.Node = null;

    @property({ type: VBrhhScene})
    brhh_scene: VBrhhScene = null;

    @property(cc.ToggleContainer)
    toggle_ct_chip: cc.ToggleContainer = null;


    start () {
        this.node_playerlist.active = false;

        this.node_playerlist.on(cc.Node.EventType.TOUCH_END, () => {
            this.node_playerlist.active = false;

        }, this);

        this.node_playerlist['_touchListener'].setSwallowTouches(false);
    }


        /**
     * 点击菜单按钮
     * @param toggle 菜单按钮
     */
    onClickMenu(toggle: cc.Toggle) {
        VBrhhScene.ins._music_mgr.playClick();
        var node = toggle.node;
        let is_check = toggle.isChecked;

        var v_menu = this.node_menu.getComponent(VBrhhMenu);


        var sp_bg = node.getChildByName('sp_bk');
        if (is_check) {
            // sp_bg.active = false;
            v_menu.show(this.brhh_scene._room_info);
            // toggle.interactable = false;
        }
        else {

            sp_bg.active = true;
        }
    }


    /**
     * 点击路单按钮
     */
    private onClickLuDan() {
        VBrhhScene.ins._music_mgr.playClick();
        AppGame.ins.showBundleUI(ECommonUI.BRHH_Ludan,this.brhh_scene._room_info.gameId,{})
    }



    /**
     * 点击换桌按钮
     */
    private onClickSwitchDesk() {
        UDebug.log('aaaaaaaaa');
    }

    /**
     * 点击玩家列表按钮
     */
    private onClickPlayerList() {
        // this.node_playerlist.active = true;
        UDebug.log('aaaaaaaaa');
        // this.showVsAnima();
        // this.openCard(12, 13);
    }

    
    private onClickReBet(node: cc.Button) {

        // this.brhh_scene.showTips("暂未开放");
        // return;
        
        if (this.brhh_scene._game_status != 6 && this.brhh_scene._game_status != 1 && this.brhh_scene._game_status != 4) {
            // UDebug.log('当前不是下注时间');
            this.brhh_scene.showTips('当前不是下注时间');
            return;
        }

        this.brhh_scene.unRebet();
        AppGame.ins.brhhModel.sendRebet();
    }


     /**
     * 点击下注区域
     * @param btn 
     */
    private onClickRect(btn: cc.Button) {

        var cur_chip_sel = this.brhh_scene._chipgroup.curSel;;

        if (this.brhh_scene._game_status != 6 && this.brhh_scene._game_status != 1 && this.brhh_scene._game_status != 4) { 
            // UDebug.log('当前不是下注时间');
            this.brhh_scene.showTips('当前不是下注时间');
            return;
        }

        if (cur_chip_sel == -1) {
            AppGame.ins.showTips('金币不足！');
            return;
        }

        var chipvalue = this.brhh_scene.chipIndexToValue(cur_chip_sel);


        switch (btn.target.name) {

            case 'sp_rect_hong':
                {

                    AppGame.ins.brhhModel.sendBet(HongHei.JET_AREA.RED_AREA, chipvalue);

                    // this.playerBet(1000,cur_chip_sel , 1);
                    break;
                }
            case 'sp_rect_hei':
                {
                    // this.playerBet(1000,cur_chip_sel , 2);
                    AppGame.ins.brhhModel.sendBet(HongHei.JET_AREA.BLACK_AREA, chipvalue);

                    break;
                }
            case 'sp_rect_teshu':
                {
                    // this.playerBet(1000,cur_chip_sel , 3);
                    AppGame.ins.brhhModel.sendBet(HongHei.JET_AREA.SPECIAL_AREA, chipvalue);
                    break;
                }
        }
    }
}
