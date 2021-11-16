import { UIChargeRecordsItem } from "./ChargeData";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import ULanHelper from "../../../common/utility/ULanHelper";
import UStringHelper from "../../../common/utility/UStringHelper";
import { ZJH_SCALE } from "../../../game/zjh/MZJH";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import AppGame from "../../base/AppGame";
import { ECommonUI } from "../../../common/base/UAllenum";
import { UIAnnData, EAnnType } from "../announce/AnnounceData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VChargeRecordsItem extends cc.Component {

    private _data: UIChargeRecordsItem;
    private _time: cc.Label;
    private _num: cc.Label;
    private _payType: cc.Label;
    private _status: cc.Label;
    private _gold: cc.Label;
    private _rect: cc.Node;
    private _root: cc.Node;

    init(): void {
        this._rect = this.node.parent;
        this._root = UNodeHelper.find(this.node, "root");
        this._time = UNodeHelper.getComponent(this._root, "time", cc.Label);
        this._num = UNodeHelper.getComponent(this._root, "num", cc.Label);
        this._payType = UNodeHelper.getComponent(this._root, "type", cc.Label);
        this._status = UNodeHelper.getComponent(this._root, "status", cc.Label);
        this._gold = UNodeHelper.getComponent(this._root, "chargenum", cc.Label);

        var copy = UNodeHelper.find(this._root, "btn_copy");
        var gm = UNodeHelper.find(this._root, "btn_kefu");

        UEventHandler.addClick(copy, this.node, "VChargeRecordsItem", "oncopy");
        UEventHandler.addClick(gm, this.node, "VChargeRecordsItem", "opengm");
    }
    private oncopy(): void {
        if (UAPIHelper.writeCliboad(this._data.listNum)) {
            AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        }
    }
    private opengm(): void {
        var data = new UIAnnData();
        data.type = EAnnType.OnlineGM;
        data.data = `您好，我的支付订单号是\n${this._data.listNum},我对此订单有疑问，疑问是:\n`;
        AppGame.ins.showUI(ECommonUI.LB_Announce, data);
    }
    protected update(dt: number): void {
        if (this._rect) {
            var posY = this._rect.y + this.node.y;
            if (posY < -300) {
                this._root.active = false;
            } else if (posY > 300) {
                this._root.active = false;
            } else {
                this._root.active = true;
            }
        }
    }
    reset(): void {
        this.node.active = false;
    }
    bind(data: UIChargeRecordsItem): void {
        this.node.active = true;
        this._data = data;
        this._time.string = data.chargetime;
        this._payType.string = ULanHelper.PAY_TYPE[data.chargeType];
        this._num.string = data.listNum;
        this._status.string = ULanHelper.PAY_STATUS[data.status];
        this._gold.string = UStringHelper.getMoneyFormat(data.gold * ZJH_SCALE, 4, false);
    }
}
