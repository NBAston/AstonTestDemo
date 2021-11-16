
/**
 * 创建:斗地主菜单界面
 */

import { ECommonUI, EGameType } from "../../common/base/UAllenum";
import AppGame from "../../public/base/AppGame";
import ddz_Main_hy from "./ddz_Main_hy";
import MDDZModel_hy from "./model/MDDZ_hy";
import UHandler from "../../common/utility/UHandler";
import ULanHelper from "../../common/utility/ULanHelper";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ddz_MenuPanel_hy extends cc.Component{
    @property(cc.Node) node_menu_bg: cc.Node = null;
    @property(cc.Node) gf_bg_menu: cc.Node = null;

    private on_leave(): void {
        ddz_Main_hy.ins.musicMgr.playClickBtn();
        ddz_Main_hy.ins.menu.scale = 0;
        if(AppGame.ins.ddzModel_hy.gameStatus == MDDZModel_hy.DDZ_GAMESTATUS.OVER || AppGame.ins.ddzModel_hy.gameStatus == MDDZModel_hy.DDZ_GAMESTATUS.FREE){
            if(ddz_Main_hy.ins.gameOver){//当轮结束
                this.exitGame();
            }else{
                let tip:string = ddz_Main_hy.ins.isRoomHost ? ULanHelper.GAME_HY.HOST_EXIT:ULanHelper.GAME_HY.HOST_EXIT_GUEST;
                AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                    type: 3, data: tip, handler: UHandler.create((a) => {
                        if (a) {
                            this.exitGame();
                        }
                    }, this)
                });
            }
        }else{
            AppGame.ins.showTips(ULanHelper.GAME_HY.EXIT_OFF_TIP);
            return;
        }
    }

    exitGame(){
        AppGame.ins.ddzModel_hy.exitGame();
    }

    private on_shezhi(): void {
        ddz_Main_hy.ins.musicMgr.playClickBtn();
        ddz_Main_hy.ins.menu.scale = 0;
        AppGame.ins.showUI(ECommonUI.UI_SETTING_HY,{callback:ddz_Main_hy.ins.sendSettingToggleRequest, roomInfo: ddz_Main_hy.ins.roomInfo});
    }
    private on_record(): void {
        ddz_Main_hy.ins.menu.scale = 0;
        AppGame.ins.showUI(ECommonUI.LB_Record, EGameType.DDZ);
    }

    private on_wanfa(): void {
        ddz_Main_hy.ins.musicMgr.playClickBtn();
        ddz_Main_hy.ins.menu.scale = 0;
        AppGame.ins.showUI(ECommonUI.ZJH_Help, {gameType: EGameType.DDZ});
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
