import VProxyItem from "./VProxyItem";
import UQRCode from "../../../common/utility/UQRCode";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../base/AppGame";
import UResManager from "../../../common/base/UResManager";
import { ECommonUI, EIconType } from "../../../common/base/UAllenum";
import UEventHandler from "../../../common/utility/UEventHandler";
import VBaseUI from "../../../common/base/VBaseUI";
import UAudioManager from "../../../common/base/UAudioManager";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import ULanHelper from "../../../common/utility/ULanHelper";
import MProxy from "./MProxy";
import { HallServer, Game } from "../../../common/cmd/proto";
import UStringHelper from "../../../common/utility/UStringHelper";

export const ZJH_SCALE = 0.01;

const { ccclass, property } = cc._decorator;

@ccclass
export default class VProxyTGItem extends VProxyItem {
    private _name: cc.Label;
    private _agency_level: cc.Label;
    private _head: cc.Sprite;
    private _frame: cc.Sprite;
    private _qrCode: UQRCode;
    private _btn_extract: cc.Node;
    private _commission_num: cc.Label;
    private _commission_num_today: cc.Label;
    private _superior_id: cc.Label;
    private _rebate: cc.Label;
    private _team_num: cc.Label;
    private _directly_under: cc.Label;
    private _today_new: cc.Label;
    private _tw_new: cc.Label;
    private _received: cc.Label;
    private _address: cc.Label;
    private _referral_code: cc.Label;
    private _btn_copylink: cc.Node;
    private _btn_refresh_qrcode: cc.Node;
    private _hidden_node: cc.Node;
    private _default_node: cc.Node;
    private _btn_agent: cc.Node;
    private _btn_select: cc.Node;
    private _first_qrcode: UQRCode;
    private _second_qrcode: UQRCode;
    private _third_qrcode: UQRCode;
    private _img_banner:cc.Node;
    private _bg:cc.Node;

    init(): void {
        super.init();
        this._name = UNodeHelper.getComponent(this.contentNode, "name", cc.Label);
        this._agency_level = UNodeHelper.getComponent(this.contentNode, "name/agency_level", cc.Label);
        this._rebate = UNodeHelper.getComponent(this.contentNode, "rebate", cc.Label);

        this._qrCode = UNodeHelper.getComponent(this.contentNode, "hidden_node/qrcode", UQRCode);
        this._head = UNodeHelper.getComponent(this.contentNode, "man_0", cc.Sprite);
        this._frame = UNodeHelper.getComponent(this.contentNode, "frame_0", cc.Sprite);
        this._btn_extract = UNodeHelper.find(this.contentNode, "hidden_node/btn_extract");
        this._commission_num = UNodeHelper.getComponent(this.contentNode, "hidden_node/commission/commission_num", cc.Label);
        this._commission_num_today = UNodeHelper.getComponent(this.contentNode, "hidden_node/commission_today/commission_num_today", cc.Label);

        this._superior_id = UNodeHelper.getComponent(this.contentNode, "hidden_node/information_node/superior_id", cc.Label);
        this._team_num = UNodeHelper.getComponent(this.contentNode, "hidden_node/information_node/team_num", cc.Label);
        this._directly_under = UNodeHelper.getComponent(this.contentNode, "hidden_node/information_node/directly_under", cc.Label);
        this._today_new = UNodeHelper.getComponent(this.contentNode, "hidden_node/information_node/today_new", cc.Label);
        this._tw_new = UNodeHelper.getComponent(this.contentNode, "hidden_node/information_node/tw_new", cc.Label);
        this._received = UNodeHelper.getComponent(this.contentNode, "hidden_node/information_node/received", cc.Label);
        this._btn_agent = UNodeHelper.find(this.contentNode, "default_node/btn_agent");

        this._address = UNodeHelper.getComponent(this.contentNode, "hidden_node/address_bg/address", cc.Label);
        this._btn_copylink = UNodeHelper.find(this.contentNode, "hidden_node/btn_copylink");
        this._btn_refresh_qrcode = UNodeHelper.find(this.contentNode, "hidden_node/btn_refresh_qrcode");
        this._hidden_node = UNodeHelper.find(this.contentNode, "hidden_node");
        this._default_node = UNodeHelper.find(this.contentNode, "default_node");
        this._btn_select = UNodeHelper.find(this.contentNode, "hidden_node/select_bg");
        this._first_qrcode = UNodeHelper.getComponent(this.contentNode, "hidden_node/select_bg/img_first/qrcode", UQRCode);
        this._second_qrcode = UNodeHelper.getComponent(this.contentNode, "hidden_node/select_bg/img_second/qrcode", UQRCode);
        this._third_qrcode = UNodeHelper.getComponent(this.contentNode, "hidden_node/select_bg/img_third/qrcode", UQRCode);
        this._img_banner = UNodeHelper.find(this.contentNode,"img_banner");
        this._bg = UNodeHelper.find(this.contentNode,"bg");

        UEventHandler.addClick(this._btn_extract, this.node, "VProxyTGItem", "btn_extract_click");
        UEventHandler.addClick(this._btn_copylink, this.node, "VProxyTGItem", "copyLink");
        UEventHandler.addClick(this._btn_agent, this.node, "VProxyTGItem", "beAgent");
        UEventHandler.addClick(this._btn_select, this.node, "VProxyTGItem", "selectBg");
        UEventHandler.addClick(this._btn_refresh_qrcode, this.node, "VProxyTGItem", "refreshQrcode");
    }

    protected isOnafter(): void {
        super.isOnafter();
        if (this.IsOn) {
            this._default_node.active = false;
            this._hidden_node.active = false;
            this.playclick();
            this.node.children[2].color = cc.color(255, 255, 255, 255);
            var dt = AppGame.ins.proxyModel.getMyInfo();
            this._name.string = dt.name;
            UResManager.load(dt.headId, EIconType.Head, this._head,AppGame.ins.roleModel.headImgUrl);
            UResManager.load(dt.frameId, EIconType.Frame, this._frame);
            AppGame.ins.proxyModel.requestMySpreadInfo();
            // if () {
            //     this.scheduleOnce(() => {
            //         // AppGame.ins.showConnect(false);
            //     }, 5);
            // }
        } else {
            this.node.children[2].color = cc.color(164, 116, 51, 255)
        }
    }

    /**
     * 更新二维码
     */
    private refreshQrcode(): void {
        this.playclick();
        AppGame.ins.proxyModel.requestQRcode();
        // AppGame.ins.proxyModel.requestMySpreadInfo();
    }

    /**
     * 提取佣金
     */
    private btn_extract_click(): void {
        AppGame.ins.showUI(ECommonUI.LB_WithdrawCommission);
        // UAudioManager.ins.playSound("audio_click");
        super.playclick();
    }

    /**
     * 更新二维码
     */
    private refreshSpreadUrl(caller: HallServer.RefreshSpreadURLMessageResponse): void {
        super.playclick();
        AppGame.ins.showTips("刷新二维码成功");
        AppGame.ins.proxyModel.mySpreadInfo_spreadUrl = caller.spreadUrl;
        this.refreshdata();
    }

    /**
     * 复制链接
     */
    private copyLink(): void {
        super.playclick();
        if (this._address.string == "") {
            return
        } else {
            AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
            UAPIHelper.onCopyClicked(this._address.string);
        }
    }

    /**
     * 成为代理
     */
    private beAgent(): void {
        super.playclick();
        AppGame.ins.proxyModel.requestBeAgent();
        // if () {
        //     this.scheduleOnce(() => {
        //         // AppGame.ins.showConnect(false);
        //     }, 5);
        // }
    }

    /**
     * 更换背景
     */
    private selectBg(): void {
        super.playclick();
        AppGame.ins.showUI(ECommonUI.LB_SELECT_POSTER,
            {
                spreadUrl: this._address.string,
                viewType: 0,
                invitationCode: 0,
            });
    }

    /**
     * 刷新数据
     */
    private refreshdata(): void {
        var dt = AppGame.ins.proxyModel.geTUIProxyTGData();
        if (dt) {
            this._commission_num.string = UStringHelper.getMoneyFormat(dt.canGetMoney * ZJH_SCALE);
            this._agency_level.string = dt.levelName;
            this._superior_id.string = dt.pid.toString();
            this._rebate.string = "每万返佣：" + dt.rate.toString();
            this._team_num.string = dt.teamPlayerCount.toString();
            this._directly_under.string = dt.myPlayerCount.toString();
            this._today_new.string = dt.todayNewPlayerCount.toString();
            this._tw_new.string = dt.thisWeekNewPlayerCount.toString();
            this._received.string = UStringHelper.getMoneyFormat(dt.hasGetMoney * ZJH_SCALE);
            this._commission_num_today.string = UStringHelper.getMoneyFormat(dt.todayMoney * ZJH_SCALE);
            this._address.string = dt.spreadUrl;
            this._qrCode.make(dt.spreadUrl);
            this._first_qrcode.make(dt.spreadUrl);
            this._second_qrcode.make(dt.spreadUrl);
            this._third_qrcode.make(dt.spreadUrl);
        }
    }

    /**
     * 申请成为代理返回
     */
    private become_promote(success: boolean, msg): void {
        this.unscheduleAllCallbacks();
        if (success) {
            AppGame.ins.proxyModel.requestMySpreadInfo();
            this._hidden_node.active = true;
            this._default_node.active = false;
            this._agency_level.node.active = true;
            this._rebate.node.active = true;
            this.refreshdata();
        } else {
            this._hidden_node.active = false;
            this._default_node.active = true;
            this._agency_level.node.active = false;
            this._rebate.node.active = false;
            // AppGame.ins.showTips(msg);
            // AppGame.ins.showTips("网络波动，请手动刷新界面");
        }
    }

    /**
     * 更新数据
     */
    private update_TGItem(success: boolean, msg): void {
        this.unscheduleAllCallbacks();
        if (success) {
            this._hidden_node.active = true;
            this._default_node.active = false;
            this._agency_level.node.active = true;
            this._rebate.node.active = true;

            this._img_banner.y = -16.447;
            this._name.node.anchorX = 0;
            this._name.node.setPosition(-450,253.351);
            this._head.node.setPosition(-503.461,238.855);
            this._frame.node.setPosition(-503.461,238.855);
            this._bg.active = false;
            this.refreshdata();
        } else {
            this._hidden_node.active = false;
            this._default_node.active = true;
            this._agency_level.node.active = false;
            this._rebate.node.active = false;
            this._commission_num.string = "-";
            this._agency_level.string = "-";
            this._superior_id.string = "-";
            this._rebate.string = "-";
            this._team_num.string = "-";
            this._directly_under.string = "-";
            this._today_new.string = "-";
            this._tw_new.string = "-";
            this._received.string = "-";
            this._commission_num_today.string = "-";
            this._address.string = "-";
            
            this._img_banner.y = 200;
            this._name.node.anchorX = 0.5;
            this._name.node.setPosition(0,-110);
            this._head.node.setPosition(0,-40);
            this._frame.node.setPosition(0,-40);
            this._bg.active = true;
            // AppGame.ins.showTips(msg);
        }
    }

    protected onEnable(): void {
        AppGame.ins.proxyModel.on(MProxy.UPDATE_TGINFO, this.update_TGItem, this);
        AppGame.ins.proxyModel.on(MProxy.BECOME_PROMOTE, this.update_TGItem, this);
        AppGame.ins.proxyModel.on(MProxy.BECOME_PROMOTE, this.become_promote, this);
        AppGame.ins.proxyModel.on(MProxy.REFRESH_QRCODE, this.refreshSpreadUrl, this);
        // AppGame.ins.proxyModel.on(MProxy.ON_GETGOLD, this.on_getgold, this);
    }
    protected onDisable(): void {
        // AppGame.ins.showConnect(false);
        this.unscheduleAllCallbacks();
        AppGame.ins.proxyModel.off(MProxy.UPDATE_TGINFO, this.update_TGItem, this);
        AppGame.ins.proxyModel.off(MProxy.BECOME_PROMOTE, this.update_TGItem, this);
        AppGame.ins.proxyModel.off(MProxy.BECOME_PROMOTE, this.become_promote, this);
        AppGame.ins.proxyModel.off(MProxy.REFRESH_QRCODE, this.refreshSpreadUrl, this);
        // AppGame.ins.proxyModel.off(MProxy.ON_GETGOLD, this.on_getgold, this);
    }
}
