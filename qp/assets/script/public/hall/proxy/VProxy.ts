import VWindow from "../../../common/base/VWindow";
import VProxyItem from "./VProxyItem";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UHandler from "../../../common/utility/UHandler";
import UEventListener from "../../../common/utility/UEventListener";
import VProxyTGItem from "./VProxyTGItem";
import VProxyMyTeamItem from "./VProxyMyTeamItem";
import VProxyChargeItem from "./VProxyChargeItem";
import VProxyDetailItem from "./VProxyDetailItem";
import VProxyPerformanceItem from "./VProxyPerformanceItem";
import VProxyTutorialsItem from "./VProxyTutorialsItem";
import VProxyRebateItem from "./VProxyRebateItem";
import UEventHandler from "../../../common/utility/UEventHandler";
import AppGame from "../../base/AppGame";
import { EAgentLevelReqType, ECommonUI } from "../../../common/base/UAllenum";
import UStringHelper from "../../../common/utility/UStringHelper";
import MRole from "../lobby/MRole";
import VProxyMallItem from "./VProxyMallItem";
import ULanHelper from "../../../common/utility/ULanHelper";
import UAudioManager from "../../../common/base/UAudioManager";
import MFriendsRoomCardModel from "../friends/friends_room_card/MFriendsRoomCardModel";
import MHall from "../lobby/MHall";

export const ZJH_SCALE = 0.01;

const { ccclass, property } = cc._decorator;

@ccclass
export default class VProxy extends VWindow {
    private _btns: Array<VProxyItem>;
    private _helpNode: cc.Node;
    private _helpNodeBack: cc.Node;
    private _setting_btn: cc.Node;
    private _gold_num: cc.Label;
    private _card_num: cc.Label;
    init(): void {
        super.init();
        this._btns = [];
        AppGame.ins.roleModel.requestUpdateScore();
        // this._setting_btn = UNodeHelper.find(this._root, "btn_setting");
        this._gold_num = UNodeHelper.find(this._root, "top_right_menu/user_gold/gold_num").getComponent(cc.Label);
        this._card_num = UNodeHelper.find(this._root, "top_right_menu/user_room_card/gold_num").getComponent(cc.Label);
        var item_tg = UNodeHelper.getComponent(this._root, "mask/btn_tg", VProxyTGItem);
        var item_performance = UNodeHelper.getComponent(this._root, "mask/btn_performance", VProxyPerformanceItem);
        var item_rebate = UNodeHelper.getComponent(this._root, "mask/btn_rebate", VProxyRebateItem)
        var item_team = UNodeHelper.getComponent(this._root, "mask/btn_team", VProxyMyTeamItem);
        var item_tutorials = UNodeHelper.getComponent(this._root, "mask/btn_tutorials", VProxyTutorialsItem)
        var item_detlai = UNodeHelper.getComponent(this._root, "mask/btn_detail", VProxyDetailItem);
        // var item_proxyMall = UNodeHelper.getComponent(this._root, "mask/btn_proxyMall", VProxyMallItem);

        this._btns.push(item_tg);
        this._btns.push(item_performance);
        this._btns.push(item_team);
        this._btns.push(item_tutorials);
        this._btns.push(item_rebate);
        this._btns.push(item_detlai);
        // this._btns.push(item_proxyMall);

        this._btns.forEach(element => {
            element.init();
            element.clickHandler = new UHandler(this.btnclick, this, element.type);
        });
        // var help_btn = UNodeHelper.find(this._root, "help_btn");
        // UEventListener.get(help_btn).onClick = new UHandler(() => {
        //     this.showhelp(true);
        // }, this);
        // UEventListener.get(this._helpNodeBack).onClick = new UHandler(() => {
        //     this.showhelp(false);
        // }, this);

        // UEventHandler.addClick(this._setting_btn, this.node, "VProxy", "onsetting");
    }

    /**
     * 设置按钮
     */
    private onsetting(): void {
        AppGame.ins.showUI(ECommonUI.LB_Setting);
        this.playclick();
    }

    private showhelp(value: boolean): void {
        this._helpNode.active = value;
        this._helpNodeBack.active = value;
    }

    private btnclick(type: number, isOn: boolean): void {
        this._btns.forEach(element => {
            if (element.type != type) {
                element.IsOn = false;
            } else {
                this.showTitle(element);
            };
        });
    }

    private turnOn(type: number): void {
        this._btns.forEach(element => {
            if (element.type == type) {
                this.showTitle(element);
                element.IsOn = true;
            }
            else
                element.IsOn = false;
        });
    }

    /**
     * @description 显示界面title
     */
    showTitle(element: any) {
        let lab = UNodeHelper.find(this._root, "dl_title_tuiguang").getComponent(cc.Label);
        let lab1 = UNodeHelper.find(element.node, "lab").getComponent(cc.Label);;
        lab.string = `无限级代理·${lab1.string}`
    }

    /**
    * 显示
    */
    show(data: { showViewType: number } = { showViewType: 1 }): void {
        super.show(data);
        this.turnOn(data.showViewType);
        // this.update_score(AppGame.ins.roleModel.getRoleGold());
        // this.update_card(AppGame.ins.roleModel.getRoomCard());
        // AppGame.ins.hallModel.requestAgentLevel();
    }

    /**
     * @description 充值界面
     */
    private onopencharge(): void {
        if (!AppGame.ins.roleModel.bindMobile) {
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: 3, data: ULanHelper.NO_BIND_PHONE, handler: UHandler.create((a) => {
                    if (a) {
                        // AppGame.ins.showUI(ECommonUI.LB_Charge,{});
                        AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: true });
                    } else {
                        AppGame.ins.showUI(ECommonUI.LB_Regester);
                    }
                }, this)
            });

        } else {
            // AppGame.ins.showUI(ECommonUI.LB_Charge,{});
            AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: true });
        }
        UAudioManager.ins.playSound("audio_click");
        UAudioManager.ins.playSound("audio_vhall_vcharge");
    };

    //转帐
    private onTransfer() {
        AppGame.ins.showUI(ECommonUI.UI_TRANSFER);
        UAudioManager.ins.playSound("audio_click");
    }

    /**房卡充值 */
    private onChargeRoomCard() {
        AppGame.ins.hallModel.requestAgentLevel(EAgentLevelReqType.promotion);
        // let proxyLevel = 1;
        // if (proxyLevel < 5) {
        //     this.onopencharge();
        // } else {
        //     this.turnOn(7);
        // }
    }

    // /**获取到代理等级 */
    // onAgentLevelRes(data: any) {
    //     if (AppGame.ins.hallModel.reqAgentLevelType != EAgentLevelReqType.promotion) return;
    //     if (!data || data.retCode != 0 || !data.hasOwnProperty('level')) {
    //         this.onopencharge();
    //         return;
    //     }
    //     if (data.level < 5) {
    //         this.onopencharge();
    //     } else {
    //         this.turnOn(7);
    //     }
    // }

    // /**
    //  * @description 刷新代理商城按钮的状态
    //  * @param level 
    //  */
    // fefProxyMallAct(data: any) {
    //     cc.log("代理等级:", data);
    //     let btn_proxyMall = UNodeHelper.find(this.node, "root/mask/btn_proxyMall");
    //     if (!data || data.retCode != 0 || !data.hasOwnProperty('level')) {
    //         btn_proxyMall.active = false;
    //         return;
    //     }
    //     let level = data.level

    //     if (level && level > 4) {
    //         let isShowHedIcon = cc.sys.localStorage.getItem("PROXY_MALL_BTN_HED_ICON");
    //         let hedIcon = UNodeHelper.find(btn_proxyMall, "chat_img_redpoint");
    //         hedIcon.active = !isShowHedIcon
    //         // cc.sys.localStorage.setItem('PROXY_MALL_BTN_HED_ICON', "1");
    //         btn_proxyMall.active = true;
    //     };
    // };

    /**
    //  * 刷新金币
    //  */
    // private update_score(score: number): void {
    //     this._gold_num.string = UStringHelper.getMoneyFormat(score * ZJH_SCALE, -1, false, true, false).toString();
    // }
    // /**
    //  * @description  更新房卡
    //  * @param score 房卡数量
    //  */
    // private update_card(score: number): void {
    //     this._card_num.string = UStringHelper.getMoneyFormat(score * ZJH_SCALE, -1, false, true, false).toString();
    // }

    private friend_room_card_gold_no_enough(): void {
        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
            type: 3, data: `您的金币不足,是否充值?`, handler: UHandler.create((a) => {
                if (a) {
                    AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: true, index: 0 });
                }
            }, this)
        });
    }
    protected onEnable(): void {
        // AppGame.ins.roleModel.on(MRole.UPDATA_SCORE, this.update_score, this);
        // AppGame.ins.roleModel.on(MRole.UPDATA_ROOM_CARD, this.update_card, this);
        AppGame.ins.friendsRoomCardModel.on(MFriendsRoomCardModel.FRIEND_ROOM_CARD_GOLD_NO_ENOUGH, this.friend_room_card_gold_no_enough, this);
        // AppGame.ins.hallModel.on(MHall.GET_AGENT_LEVEL_RES, this.fefProxyMallAct, this);
        // AppGame.ins.hallModel.on(MHall.GET_AGENT_LEVEL_RES, this.onAgentLevelRes, this);
    };

    protected onDisable(): void {
        // AppGame.ins.roleModel.off(MRole.UPDATA_SCORE, this.update_score, this);
        // AppGame.ins.roleModel.off(MRole.UPDATA_ROOM_CARD, this.update_card, this);
        AppGame.ins.friendsRoomCardModel.off(MFriendsRoomCardModel.FRIEND_ROOM_CARD_GOLD_NO_ENOUGH, this.friend_room_card_gold_no_enough, this);
        // AppGame.ins.hallModel.off(MHall.GET_AGENT_LEVEL_RES, this.fefProxyMallAct, this);
        // AppGame.ins.hallModel.off(MHall.GET_AGENT_LEVEL_RES, this.onAgentLevelRes, this);
    };


}
