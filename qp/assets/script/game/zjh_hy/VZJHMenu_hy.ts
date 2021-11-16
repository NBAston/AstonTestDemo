import VZJH_hy from "./VZJH_hy";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventListener from "../../common/utility/UEventListener";
import UHandler from "../../common/utility/UHandler";
import AppGame from "../../public/base/AppGame";
import { ECommonUI, EGameType, EMsgType } from "../../common/base/UAllenum";
import ULanHelper from "../../common/utility/ULanHelper";
import UToggle from "../../common/utility/UToggle";
import UMsgCenter from "../../common/net/UMsgCenter";

import UZJHMusic_hy from "./UZJHMusic_hy";
import MZJH_hy from "./MZJH_hy";
import UDebug from "../../common/utility/UDebug";


const offset = { x: -300, y: -66, t: 0.3 };
/**
 * 创建:sq
 * 作用：扎金花的菜单控制
 */
export default class VZJHMenu_hy {


    /**主节点 */
    private _btnMain: UToggle;
    /**menu节点 */
    private _menu: cc.Node;
    private _music: UZJHMusic_hy;
    private _btnPaiXing: cc.Node;
    private _bntContent: cc.Node;
    private _hideBack: cc.Node;
    private _hideBtn: cc.Node;
    private _is_homeowner:boolean = false;
    /**
     * 离开游戏
     */
    private on_leave(): void {
        // AppGame.ins.fzjhModel.exitGame();
        this.closemenu();
        this._music.playclick();
        if(AppGame.ins.fzjhModel.roomInfo && AppGame.ins.roleModel.useId == AppGame.ins.fzjhModel.roomInfo.roomUserId){
            // AppGame.ins.showUI(ECommonUI.NewMsgBox,{
            //     type:EMsgType.EOKAndCancel,
            //     data:ULanHelper.GAME_HY.HOST_EXIT,
            //     handler:UHandler.create((v:boolean) =>{
            //         v && AppGame.ins.fzjhModel.exitGame();
            //     })
            // })
            let data = ULanHelper.GAME_HY.HOST_EXIT;
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: 2, data, handler: UHandler.create((a) => {
                    if (a) {
                        AppGame.ins.fzjhModel.exitGame();
                    }
                }, this)
            });
        }else{
            AppGame.ins.fzjhModel.exitGame();
        }
    }

    /**
     * 邀请好友
     */
    private on_invite():void{
        if(AppGame.ins.fzjhModel._battleplayer[AppGame.ins.fzjhModel._roomInfo.roomUserId]){
            AppGame.ins.showUI(ECommonUI.UI_SHARED_HY,{eGameType:EGameType.ZJH_HY,roomInfo:AppGame.ins.fzjhModel._roomInfo,headId:AppGame.ins.fzjhModel._battleplayer[AppGame.ins.fzjhModel._roomInfo.roomUserId].headId});
        }else{
            AppGame.ins.showUI(ECommonUI.UI_SHARED_HY,{eGameType:EGameType.ZJH_HY,roomInfo:AppGame.ins.fzjhModel._roomInfo,headId:0});
        }
        
        this.closemenu();
        this._music.playclick();
    }

    /**
     * 立即结算
     */
    private on_settlement():void{
        let data = ULanHelper.GAME_HY.HOST_CHECK_OUT;
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: 2, data, handler: UHandler.create((a) => {
                if (a) {
                    AppGame.ins.fzjhModel.requestSettleEarly();
                }
            }, this)
        });

        
        this.closemenu();
        this._music.playclick();
    }

    
    /**
     * 补充积分
     */
    private on_supplement():void{
        AppGame.ins.showUI(ECommonUI.UI_BRING_POINTS);
        this.closemenu();
        this._music.playclick();
    }

    private on_shezhi(): void {
        AppGame.ins.showUI(ECommonUI.UI_SETTING_HY, 
            { callback: AppGame.ins.fzjhModel.sendSettingToggleRequest, roomInfo: AppGame.ins.fzjhModel.roomInfo});
        this.closemenu();
        this._music.playclick();
    }
    // private on_record(): void {
    //     AppGame.ins.showUI(ECommonUI.LB_Record, EGameType.ZJH_HY);
    //     this.closemenu();
    //     this._music.playclick();
    // }
    private on_wanfa(): void {
        AppGame.ins.showUI(ECommonUI.ZJH_Help, {gameType: EGameType.ZJH});
        this.closemenu();
        this._music.playclick();
    }

    // private on_fankui(): void {

    // }
    private clickMenu(isOn: boolean): void {
        this._menu.active = isOn;
        this._btnPaiXing.active = !isOn;
        if(AppGame.ins.roleModel.useId == AppGame.ins.fzjhModel._roomInfo.roomUserId){
            this._hideBtn.active = true;
        }else{
            this._hideBtn.active = false;
        }
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
            this._btnPaiXing.active = false;
        } else
            this._btnPaiXing.active = !value;
        this._bntContent.active = value;
        this._bntContent.setPosition(offset.x, offset.y);
    }
    constructor(root: cc.Node, menu: cc.Node, music: UZJHMusic_hy) {
        this._music = music;
        let main = UNodeHelper.find(root, "btn_menu");
        this._btnMain = main.getComponent(UToggle);
        this._btnPaiXing = UNodeHelper.find(root, "btn_paixing");
        this._bntContent = UNodeHelper.find(root, "paixing_content");
        this._menu = menu;
        let btn_leave = UNodeHelper.find(menu, "gf_bg_menu/gf_bg_menu/btn_leave");
        let btn_invite = UNodeHelper.find(menu,"gf_bg_menu/gf_bg_menu/btn_invite");
        let btn_settlement = UNodeHelper.find(menu,"gf_bg_menu/gf_bg_menu/btn_settlement");
        let btn_supplement = UNodeHelper.find(menu,"gf_bg_menu/gf_bg_menu/btn_supplement")
        
        // let btn_record = UNodeHelper.find(menu, "gf_bg_menu/gf_bg_menu/btn_record");
        let btn_wanfa = UNodeHelper.find(menu, "gf_bg_menu/gf_bg_menu/btn_help");
        let btn_shezhi = UNodeHelper.find(menu, "gf_bg_menu/gf_bg_menu/btn_settle");
        this._hideBtn = btn_settlement;
        // let btn_fankui = UNodeHelper.find(menu, "gf_bg_menu/btn_fankui");
        let bg = UNodeHelper.find(menu, "gf_bg_menu/bg");
        this._hideBack = UNodeHelper.find(root, "paixing_bag");
        UEventListener.get(btn_leave).onClick = new UHandler(this.on_leave, this);
        UEventListener.get(btn_invite).onClick = new UHandler(this.on_invite,this);
        UEventListener.get(btn_settlement).onClick = new UHandler(this.on_settlement,this);
        UEventListener.get(btn_supplement).onClick = new UHandler(this.on_supplement,this);
        // UEventListener.get(btn_record).onClick = new UHandler(this.on_record, this);
        UEventListener.get(btn_wanfa).onClick = new UHandler(this.on_wanfa, this);
        UEventListener.get(btn_shezhi).onClick = new UHandler(this.on_shezhi, this);
        // UEventListener.get(btn_fankui).onClick = new UHandler(this.on_fankui, this);
        UEventListener.get(this._btnPaiXing).onClick = new UHandler(this.on_showPaixing, this);
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
        this._btnPaiXing.active = !value;
    }


}
