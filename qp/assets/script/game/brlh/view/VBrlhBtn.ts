import VBrlhMenu from "./VBrlhMenu";
import VBrlhScene from "../VBrlhScene";
import AppGame from "../../../public/base/AppGame";
import { ECommonUI, ETipType } from "../../../common/base/UAllenum";
import { LongHu } from "../../../common/cmd/proto";
import UDebug from "../../../common/utility/UDebug";
import UHandler from "../../../common/utility/UHandler";
import MRole from "../../../public/hall/lobby/MRole";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VBrlhBtn extends cc.Component {

    @property({ type: cc.Node, tooltip: "菜单界面" })
    node_menu: cc.Node = null;
   
    @property({ type: cc.Node, tooltip: "玩家列表" })
    node_playerlist: cc.Node = null;

    @property({ type: VBrlhScene})
    brlh_scene: VBrlhScene = null;

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
        VBrlhScene.ins._music_mgr.playClick();
        var node = toggle.node;
        let is_check = toggle.isChecked;

        var v_menu = this.node_menu.getComponent(VBrlhMenu);


        var sp_bg = node.getChildByName('sp_bk');
        if (is_check) {
            // sp_bg.active = false;
            v_menu.show(this.brlh_scene._room_info);
            // toggle.interactable = false;
        }
        else {
            v_menu.hide(); 
            sp_bg.active = true;
        }
    }


    /**
     * 点击路单按钮
     */
    private onClickLuDan() {
        VBrlhScene.ins._music_mgr.playClick();
        AppGame.ins.showBundleUI(ECommonUI.BRLH_Ludan,this.brlh_scene._room_info.gameId,{})
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
        // AppGame.ins.brlhModel.sendSyncTime();
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

        var cur_chip_sel = this.brlh_scene._chipgroup.curSel;

        // if (cur_chip_sel == -1) {
        //     this.brlh_scene.showTips('');
        //     return;
        // }
        let game_status = this.brlh_scene._game_status;  
        if ( game_status != 2 && game_status != 1 && game_status != 6) {
            UDebug.log('当前不是下注时间,当前状态：' + game_status );
            this.brlh_scene.showTips('当前不是下注时间');
            return;
        }

       
        var chipvalue = this.brlh_scene.chipIndexToValue(cur_chip_sel);
        // let gold = this.brlh_scene.getMyGold();
        // if (chipvalue > gold) {
        //     this.brlh_scene.showTips('筹码不足');
        //     return;
        // }

        if (cur_chip_sel == -1) {
            AppGame.ins.showTips('金币不足！');
            return;
        }


        switch (btn.target.name) {

            case 'sp_rect_2':
                {

                    AppGame.ins.brlhModel.sendBet(LongHu.JET_AREA.AREA_LONG, chipvalue);

                    // this.playerBet(1000,cur_chip_sel , 1);
                    break;
                }
            case 'sp_rect_3':
                {
                    // this.playerBet(1000,cur_chip_sel , 2);
                    AppGame.ins.brlhModel.sendBet(LongHu.JET_AREA.AREA_HU, chipvalue);

                    break;
                }
            case 'sp_rect_1':
                {
                    // this.playerBet(1000,cur_chip_sel , 3);
                    AppGame.ins.brlhModel.sendBet(LongHu.JET_AREA.AREA_HEE, chipvalue);
                    break;
                }
        }
    }

    //点击上庄、下庄
    onClickVillage(event, customEventData){
        VBrlhScene.ins._music_mgr.playClick();
        if(event.target.getComponent(cc.Sprite).spriteFrame.name!="shangzhuangAN2"){
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: 3, data: "您确定要下庄吗？", handler: UHandler.create((a) => {
                    if (a) {
                        AppGame.ins.brlhModel.downBanker();//申请下庄
                        AppGame.ins.showTips({ data: "申请下庄成功,请耐心等待这局结束!", type: ETipType.onlyone });
                    }
                }, this)
            });
        }
        else{
            AppGame.ins.showUI(ECommonUI.LB_Village);
        }
    }
}
