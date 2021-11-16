
/**
 * 创建:斗地主菜单界面
 */

import { ECommonUI, EGameType, EMsgType } from "../../common/base/UAllenum";
import UDebug from "../../common/utility/UDebug";
import UHandler from "../../common/utility/UHandler";
import ULanHelper from "../../common/utility/ULanHelper";
import AppGame from "../../public/base/AppGame";
import MPdk_hy from "./model/MPdk_hy";
import pdk_Main_hy from "./pdk_Main_hy";

const { ccclass, property } = cc._decorator;
@ccclass
export default class pdk_MenuPanel_hy extends cc.Component{
    @property(cc.Node) node_menu_bg: cc.Node = null;
    @property(cc.Node) gf_bg_menu: cc.Node = null;

    // 离开牌局
    private on_leave(): void {
        pdk_Main_hy.ins._music_mgr.playClick();
        this.node.active = false
        if (MPdk_hy.ins.roomInfoHy && AppGame.ins.roleModel.useId == MPdk_hy.ins.roomInfoHy.roomUserId) {
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: EMsgType.EOKAndCancel,
                data: ULanHelper.GAME_HY.HOST_EXIT,
                handler: UHandler.create((v: boolean) => {
                    v && MPdk_hy.ins.exitGame();
                })
            })
        } else {
            MPdk_hy.ins.exitGame();
        }
    }

    // 邀请好友
    private on_invite(): void {
        let headId = 1;
        for (const key in pdk_Main_hy.ins.playerDataList){
            let element =  pdk_Main_hy.ins.playerDataList[key];
            if (element.userId == MPdk_hy.ins.roomInfoHy.roomUserId) {
                headId = element.headId;
                break;
            }
        }
        AppGame.ins.showUI(ECommonUI.UI_SHARED_HY,{eGameType:EGameType.PDK_HY,roomInfo:MPdk_hy.ins.roomInfoHy,headId:headId});
        this.node.active = false
    }

    // 立即结算
    private on_now_checkout(): void {
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: 3, data: ULanHelper.GAME_HY.HOST_CHECK_OUT, handler: UHandler.create((a) => {
                if (a) {
                    AppGame.ins.fPdkModel.sendCheckout(); 
                }
            }, this)
        });
        this.node.active = false
    }

    // 游戏设置
    private on_shezhi(): void {
        pdk_Main_hy.ins._music_mgr.playClick();
        AppGame.ins.showUI(ECommonUI.UI_SETTING_HY,{ callback: MPdk_hy.ins.sendSettingToggleRequest, roomInfo: MPdk_hy.ins.roomInfoHy });
        this.node.active = false
    }
    // 记录
    private on_record(): void {
        pdk_Main_hy.ins._music_mgr.playClick();
        AppGame.ins.showUI(ECommonUI.LB_Record, EGameType.PDK);
        this.node.active = false
    }

    // 游戏帮助
    private on_wanfa(): void {
        pdk_Main_hy.ins._music_mgr.playClick();
        AppGame.ins.showUI(ECommonUI.ZJH_Help, {gameType: EGameType.PDK});
        this.node.active = false
    }

    hide():void {
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
