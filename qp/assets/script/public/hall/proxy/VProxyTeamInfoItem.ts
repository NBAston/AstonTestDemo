import { UIProxyTeamItem, UIProxyTeamData } from "./ProxyData";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import { ZJH_SCALE } from "../../../game/zjh/MZJH";
import UStringHelper from "../../../common/utility/UStringHelper";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VProxyTeamInfoItem extends cc.Component {
    private _id: cc.Label;
    private _totalCharge: cc.Label;
    private _totalExcharge: cc.Label;
    private _time: cc.Label;
    init(): void {
        this._id = UNodeHelper.getComponent(this.node, "id", cc.Label);
        this._totalCharge = UNodeHelper.getComponent(this.node, "charge", cc.Label);
        this._totalExcharge = UNodeHelper.getComponent(this.node, "excharge", cc.Label);
        this._time = UNodeHelper.getComponent(this.node, "time", cc.Label);
    }
    bind(dt: UIProxyTeamItem): void {
        this.node.active = true;
        this._id.string = dt.id.toString();
        this._time.string = dt.regesterTime;
        this._totalCharge.string = UStringHelper.getMoneyFormat(dt.totalCharge, 4, false).toString();
        this._totalExcharge.string = UStringHelper.getMoneyFormat(dt.totalExcharge, 4, false);
    }
    hide(): void {
        this.node.active = false;
    }
}
