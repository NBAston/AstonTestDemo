import UImgBtn from "../../../common/utility/UImgBtn";
import UIChargeData from "./ChargeData";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import UEventListener from "../../../common/utility/UEventListener";
import UHandler from "../../../common/utility/UHandler";
import { ZJH_SCALE, UNIT } from "../../../game/zjh/MZJH";
import UStringHelper from "../../../common/utility/UStringHelper";
import AppGame from "../../base/AppGame";
import VChargeItem from "./VChargeItem";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VChargeWeb extends VChargeItem {
    private _data: UIChargeData;
    private _itemNodes: Array<cc.Node>;
    private _itemLabel: Array<cc.Label>;
    private _chargeBox: cc.EditBox;

    init(): void {
        this._itemLabel = [];
        this._itemNodes = [];
        this._chargeBox = UNodeHelper.getComponent(this.contentRoot, "count", cc.EditBox);
        var btnClear = UNodeHelper.find(this.contentRoot, "btn_clear");
        var btnCharge = UNodeHelper.find(this.contentRoot, "btn_y_big");
        var goldnode = UNodeHelper.find(this.contentRoot, "goldnode");
        var goldlabel = UNodeHelper.find(this.contentRoot, "goldlabel");
        var len = goldnode.childrenCount;
        for (let index = 0; index < len; index++) {
            const node_1 = goldnode.getChildByName("charge_online_" + (index + 1));
            const label_1 = goldlabel.getChildByName("charge_online_" + (index + 1)).getComponent(cc.Label);
            this._itemNodes.push(node_1);
            this._itemLabel.push(label_1);
            UEventListener.get(node_1).onClick = new UHandler(this.onsetgold, this, index + 1);
        }
        UEventHandler.addClick(btnClear, this.node, "VChargeWeb", "onclear");
        UEventHandler.addClick(btnCharge, this.node, "VChargeWeb", "oncharge");
    }

    bind(data: UIChargeData): void {
        this._data = data;
        if (!data) {
            this.node.active = false;
            return;
        }
        this.hideall();
        this.node.active = true;
        var len = data.charges.length;
        var maxCount = this._itemNodes.length;
        for (let index = 0; index < len; index++) {
            const element = data.charges[index];
            if (index < maxCount) {
                this._itemLabel[index].string = (element * ZJH_SCALE).toString() + "y";
                this._itemNodes[index].active = true;
                this._itemLabel[index].node.active = true;
            }
        }
        this._chargeBox.placeholder = `请输入充值金额，最低${(data.minmoneylimit * ZJH_SCALE)}元`;
    }
    private onclear(): void {
        this._chargeBox.string = "";
    }
    private oncharge(): void {
        if (!this._data) return;
        if (UStringHelper.isEmptyString(this._chargeBox.string)) {
            AppGame.ins.showTips("请输入正确的充值金额");
            return;
        }
        var gold = parseInt(this._chargeBox.string);
        if (gold < this._data.minmoneylimit * ZJH_SCALE) {
            AppGame.ins.showTips(`单次最低的充值金额为${(this._data.minmoneylimit * ZJH_SCALE)}元`);
            return;
        }
        if (gold > this._data.maxmoneylimit * ZJH_SCALE) {
            AppGame.ins.showTips(`单次最高的充值金额为${(this._data.maxmoneylimit * ZJH_SCALE)}元`);
            return;
        }
        AppGame.ins.showConnect(true);
        AppGame.ins.roleModel.requestCharge(this._data.chargetype, gold * UNIT, this._data.chargeurl);
    }
    private hideall(): void {
        this._itemLabel.forEach(element => {
            element.node.active = false;
        });
        this._itemNodes.forEach(element => {
            element.active = false;
        });
    }
    private onsetgold(idx: number): void {
        idx = idx - 1;
        if (this._data && idx < this._data.charges.length) {
            var gold = this._data.charges[idx];
            this._chargeBox.string = (gold * ZJH_SCALE).toString();
        }
    }
    protected isOnafter(): void {
        this.contentRoot.active = this.IsOn;
    }
}
