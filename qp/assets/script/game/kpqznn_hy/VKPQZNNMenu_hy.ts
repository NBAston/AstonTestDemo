import UToggle from "../../common/utility/UToggle";
import UKPQZNNScene_hy from "./UKPQZNNScene_hy";
import MKPQZNNModel_hy from "./model/MKPQZNNModel_hy";
import AppGame from "../../public/base/AppGame";
import { ECommonUI, EGameType, ELevelType, EMsgType } from "../../common/base/UAllenum";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventListener from "../../common/utility/UEventListener";
import UHandler from "../../common/utility/UHandler";
import UDebug from "../../common/utility/UDebug";
import ULanHelper from "../../common/utility/ULanHelper";



/**
 * 创建:dz
 * 作用：qznn的菜单控制
 */

export default class VKPQZNNMenu_hy {

    /**主节点 */
    private _btnMain: UToggle;
    /**menu节点 */
    private _menu: cc.Node;

    private _node_menu_bg: cc.Node;
    private _gf_bg_menu: cc.Node;
    private btn_checkout: cc.Node;

    /**
     * 离开游戏
     */
    private on_leave(): void {
        UKPQZNNScene_hy.ins.playClick();
        this.closemenu();

        if (MKPQZNNModel_hy.ins.roomInfoHy && AppGame.ins.roleModel.useId == MKPQZNNModel_hy.ins.roomInfoHy.roomUserId) {
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: EMsgType.EOKAndCancel,
                data: ULanHelper.GAME_HY.HOST_EXIT,
                handler: UHandler.create((v: boolean) => {
                    v && MKPQZNNModel_hy.ins.exitGame();
                })
            })
        } else {
            MKPQZNNModel_hy.ins.exitGame();
        }
    }

    /**设置 */
    private on_shezhi(): void {
        UKPQZNNScene_hy.ins.playClick();
        AppGame.ins.showUI(ECommonUI.UI_SETTING_HY,
            { callback: MKPQZNNModel_hy.ins.sendSettingToggleRequest, roomInfo: MKPQZNNModel_hy.ins.roomInfoHy });
        this.closemenu();
    }

    /**游戏记录 */
    private on_record(): void {
        UKPQZNNScene_hy.ins.playClick();
        AppGame.ins.showUI(ECommonUI.LB_Record, EGameType.KPQZNN);
        // AppGame.ins.showUI(ECommonUI.QZNN_Record, AppGame.ins.roomModel.requestGameRecords(EGameType.KPQZNN));
        this.closemenu();
    }

    /**帮助 */
    private on_wanfa(): void {
        UKPQZNNScene_hy.ins.playClick();
        AppGame.ins.showUI(ECommonUI.ZJH_Help, { gameType: EGameType.KPQZNN });
        this.closemenu();
    }

    /**点击邀请 */
    private onClickInvite(): void {
        UKPQZNNScene_hy.ins.playClick();
        this.closemenu();
        let headId = 0;
        for (const key in MKPQZNNModel_hy.ins.gBattlePlayer) {
            let player = MKPQZNNModel_hy.ins.gBattlePlayer[key];
            if (player.userId == MKPQZNNModel_hy.ins.roomInfoHy.roomUserId) {
                headId = player.headId;
                break;
            }
        }
        AppGame.ins.showUI(ECommonUI.UI_SHARED_HY, { eGameType: EGameType.KPQZNN_HY, roomInfo: MKPQZNNModel_hy.ins.roomInfoHy, headId: headId });
    }

    /**结算 */
    private onClickCheckout(): void {
        UKPQZNNScene_hy.ins.playClick();
        this.closemenu();
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: EMsgType.EOKAndCancel,
            data: ULanHelper.GAME_HY.HOST_CHECK_OUT,
            handler: UHandler.create((v: boolean) => {
                UDebug.log('v => ' + v)
                v && MKPQZNNModel_hy.ins.sendCheckout();
            })
        })
    }

    /**菜单 */
    private clickMenu(isOn: boolean): void {
        // this._menu.active = isOn;
        this.showMenu(isOn);
        UKPQZNNScene_hy.ins.playClick();
    }

    private closemenu(): void {
        this.showMenu(false);
    }

    setOn(value: boolean) {
        this._btnMain.IsOn = value;
    }

    constructor(main: cc.Node, menu1: cc.Node) {

        this._btnMain = main.getComponent(UToggle);

        this._menu = menu1;
        var menu = UNodeHelper.find(menu1, "menu_node");

        this._node_menu_bg = UNodeHelper.find(menu1, "menu_bg");

        this._gf_bg_menu = UNodeHelper.find(menu, "gf_bg_menu");

        let btn_leave = UNodeHelper.find(menu, "gf_bg_menu/btn_leave");
        let btn_shezhi = UNodeHelper.find(menu, "gf_bg_menu/btn_shezhi");
        let btn_record = UNodeHelper.find(menu, "gf_bg_menu/btn_record");
        let btn_wanfa = UNodeHelper.find(menu, "gf_bg_menu/btn_wanfa");
        let btn_invite = UNodeHelper.find(menu, "gf_bg_menu/btn_invite");
        this.btn_checkout = UNodeHelper.find(menu, "gf_bg_menu/btn_checkout");
        let bg = UNodeHelper.find(menu, "bg");
        UEventListener.get(btn_leave).onClick = new UHandler(this.on_leave, this);
        UEventListener.get(btn_shezhi).onClick = new UHandler(this.on_shezhi, this);
        UEventListener.get(btn_record).onClick = new UHandler(this.on_record, this);
        UEventListener.get(btn_wanfa).onClick = new UHandler(this.on_wanfa, this);
        UEventListener.get(btn_invite).onClick = new UHandler(this.onClickInvite, this);
        UEventListener.get(this.btn_checkout).onClick = new UHandler(this.onClickCheckout, this);
        UEventListener.get(bg).onClick = new UHandler(this.closemenu, this);

        this._btnMain.clickHandler = new UHandler(this.clickMenu, this);
    }
    /**
    * 显示Menubtn
    */
    showMenu(value: boolean): void {
        // this._menu.active = value;
        // this._btnMain.IsOn = value;

        if (value == true) {
            if (MKPQZNNModel_hy.ins.roomInfoHy && MKPQZNNModel_hy.ins.roomInfoHy.roomUserId) {
                this.btn_checkout.active = MKPQZNNModel_hy.ins.roomInfoHy.roomUserId == AppGame.ins.roleModel.useId ? true : false;
            }

            this._menu.active = true;
            this._btnMain.IsOn = value;

            this._gf_bg_menu.stopAllActions();
            this._node_menu_bg.stopAllActions();

            this._gf_bg_menu.scaleY = 0;
            this._gf_bg_menu.opacity = 255;
            this._gf_bg_menu.runAction(cc.scaleTo(0.1, 1));

            this._node_menu_bg.opacity = 0;
            this._node_menu_bg.runAction(cc.fadeTo(0.2, 100));
        }
        else {
            this._node_menu_bg.stopAllActions();
            this._node_menu_bg.runAction(cc.fadeOut(0.2));

            this._gf_bg_menu.stopAllActions();
            this._gf_bg_menu.runAction(cc.sequence(cc.spawn(cc.fadeOut(0.2), cc.scaleTo(0.2, 1, 0)), cc.callFunc(() => {
                this._menu.active = false;
                this._btnMain.IsOn = value;
            }, this)));
        }

    }
}
