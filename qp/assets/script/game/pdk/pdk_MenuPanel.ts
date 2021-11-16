
/**
 * 创建:斗地主菜单界面
 */

import { ECommonUI, EGameType } from "../../common/base/UAllenum";
import AppGame from "../../public/base/AppGame";
import pdk_Main from "./pdk_Main";

const { ccclass, property } = cc._decorator;
@ccclass
export default class pdk_MenuPanel extends cc.Component{
    @property(cc.Node) node_menu_bg: cc.Node = null;
    @property(cc.Node) gf_bg_menu: cc.Node = null;

    private on_leave(): void {
        pdk_Main.ins._music_mgr.playClick();
        AppGame.ins.pdkModel.exitGame();
        this.node.active = false
    }

    private on_shezhi(): void {
        pdk_Main.ins._music_mgr.playClick();
        AppGame.ins.showUI(ECommonUI.LB_Setting);
        this.node.active = false
    }
    private on_record(): void {
        pdk_Main.ins._music_mgr.playClick();
        AppGame.ins.showUI(ECommonUI.LB_Record, EGameType.PDK);
        this.node.active = false
    }

    private on_wanfa(): void {
        pdk_Main.ins._music_mgr.playClick();
        AppGame.ins.showUI(ECommonUI.ZJH_Help, {gameType: EGameType.PDK});
        this.node.active = false
    }

    onEnable(){
        this.gf_bg_menu.stopAllActions();
        this.node_menu_bg.stopAllActions();
        this.gf_bg_menu.scaleY = 0;
        this.gf_bg_menu.opacity = 255;
        this.gf_bg_menu.runAction(cc.scaleTo(0.1, 1));
        //this.node_menu_bg.opacity = 0;
        //this.node_menu_bg.runAction(cc.fadeTo(0.2, 100));
    }

    onDisable(){
        this.node_menu_bg.stopAllActions();
        this.node_menu_bg.runAction(cc.fadeOut(0.2));
        this.gf_bg_menu.stopAllActions();
        this.gf_bg_menu.runAction(cc.sequence(cc.spawn(cc.fadeOut(0.2), cc.scaleTo(0.2, 1, 0)), cc.callFunc(() => {
        }, this)));
    }
}
