import VProxyItem from "./VProxyItem";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import AppGame from "../../base/AppGame";
import UStringHelper from "../../../common/utility/UStringHelper";
import { ZJH_SCALE } from "../../../game/zjh/MZJH";
import MProxy from "./MProxy";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VProxyChargeItem extends VProxyItem {
    private _allLeftGold: cc.Label;
    private _allCanGetGold: cc.Label;
    init(): void {
        this._allLeftGold = UNodeHelper.getComponent(this.contentNode, "currentgold", cc.Label);
        this._allCanGetGold = UNodeHelper.getComponent(this.contentNode, "leftgold", cc.Label);
        var btn = UNodeHelper.find(this.contentNode, "btn_yjlq");

        UEventHandler.addClick(btn, this.node, "VProxyChargeItem", "getleftGold");
    }
    private getleftGold(): void {
        AppGame.ins.proxyModel.requestProxyGetCharge();
    }
    protected isOnafter(): void {
        this.contentNode.active = this.IsOn;
        if (this.IsOn) {
            this._allLeftGold.string = "0";
            this._allCanGetGold.string = "0";
            if (AppGame.ins.proxyModel.requestProxyCharge()) {
                this.scheduleOnce(() => {
                    AppGame.ins.showConnect(false);
                }, 5);
            }
        }
    }
    private update_getgold(sucess: boolean, msg: string): void {
        this.unscheduleAllCallbacks();
        if (sucess) {
            this.refreshdata();
        } else {
            AppGame.ins.showTips(msg);
            this._allLeftGold.string = "0";
            this._allCanGetGold.string = "0";
        }
    }
    private on_getgold(sucess: boolean, msg: string): void {
        if (sucess) {
            this.refreshdata();
        } else {
          
        }
        AppGame.ins.showTips(msg);
    }
    private refreshdata(): void {
        var dt = AppGame.ins.proxyModel.getProxyChargeData();
        this._allLeftGold.string = UStringHelper.getMoneyFormat(dt.allLeftGold * ZJH_SCALE, 4, false);
        this._allCanGetGold.string = UStringHelper.getMoneyFormat(dt.callCanGetGold * ZJH_SCALE, 4, false);
    }
    protected onEnable(): void {
        AppGame.ins.proxyModel.on(MProxy.UPDATE_GETGOLD, this.update_getgold, this);
        AppGame.ins.proxyModel.on(MProxy.ON_GETGOLD, this.on_getgold, this);
    }
    protected onDisable(): void {
        AppGame.ins.showConnect(false);
        this.unscheduleAllCallbacks();
        AppGame.ins.proxyModel.off(MProxy.UPDATE_GETGOLD, this.update_getgold, this);
        AppGame.ins.proxyModel.off(MProxy.ON_GETGOLD, this.on_getgold, this);
    }
}
