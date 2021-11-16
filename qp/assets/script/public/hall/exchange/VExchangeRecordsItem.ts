import UNodeHelper from "../../../common/utility/UNodeHelper";
import { UIExchargeRecordsItem } from "./ExchangeData";
import UStringHelper from "../../../common/utility/UStringHelper";
import { ZJH_SCALE } from "../../../game/zjh/MZJH";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VExchangeRecordsItem extends cc.Component {
    private _root: cc.Node;
    private _rect: cc.Node;
    private _num: cc.Label;
    private _type: cc.Label;
    private _gold: cc.Label;
    private _time: cc.Label;
    private _status: cc.Label;
    private _op: cc.Label;
    init(): void {
        this._root = UNodeHelper.find(this.node, "root");
        this._rect = this.node.parent;
        this._num = UNodeHelper.getComponent(this._root, "num", cc.Label);
        this._type = UNodeHelper.getComponent(this._root, "type", cc.Label);
        this._gold = UNodeHelper.getComponent(this._root, "chargenum", cc.Label);
        this._time = UNodeHelper.getComponent(this._root, "time", cc.Label);
        this._status = UNodeHelper.getComponent(this._root, "status", cc.Label);
        this._op = UNodeHelper.getComponent(this._root, "op", cc.Label);
    }
    reset(): void {
        this.node.active=false;
    }
    protected update(dt: number): void {
        if (this._rect) {
            var posY = this._rect.y + this.node.y;
            if (posY < -250) {
                this._root.active = false;
            } else if (posY > 250) {
                this._root.active = false;
            } else {
                this._root.active = true;
            }
        }
    }
    bind(data: UIExchargeRecordsItem): void {
        this.node.active=true;
        this._num.string = data.num;
        // this._type.string = data.type;
        this._gold.string = UStringHelper.getMoneyFormat(data.gold * ZJH_SCALE, 4, false);
        this._time.string = data.time;
        // this._status.string = data.status;
        this._op.string = data.op;
    }
}
