import UNodeHelper from "../../../common/utility/UNodeHelper";
import { UIProxyTeamItem, UIProxyDetailItem } from "./ProxyData";
import UStringHelper from "../../../common/utility/UStringHelper";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VProxyDetailInfoItem extends cc.Component {

    private _time: cc.Label;
    private _totalCharge: cc.Label;
    private _totalSuishou: cc.Label;
    private _bili: cc.Label;
    private _chargeGold: cc.Label;
    init(): void {
        this._bili = UNodeHelper.getComponent(this.node, "bili", cc.Label);
        this._totalCharge = UNodeHelper.getComponent(this.node, "charge", cc.Label);
        this._totalSuishou = UNodeHelper.getComponent(this.node, "excharge", cc.Label);
        this._time = UNodeHelper.getComponent(this.node, "time", cc.Label);
        this._chargeGold = UNodeHelper.getComponent(this.node, "total", cc.Label);
    }
    bind(dt: UIProxyDetailItem): void {
        this.node.active = true;
        this._bili.string = (dt.percent + "%");
        this._time.string = dt.time;
        this._totalCharge.string = UStringHelper.getMoneyFormat(dt.totalCharge, 4, false);
        this._totalSuishou.string = UStringHelper.getMoneyFormat(dt.totalShuiShou, 4, false);
        this._chargeGold.string=UStringHelper.getMoneyFormat(dt.charge, 4, false);
    }
    hide(): void {
        this.node.active = false;
    }
}
