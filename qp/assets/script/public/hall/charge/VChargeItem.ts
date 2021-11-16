import UImgBtn from "../../../common/utility/UImgBtn";
import UIChargeData from "./ChargeData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VChargeItem extends UImgBtn {
    @property(cc.Integer)
    type: number = 0;
    @property(cc.Node)
    contentRoot: cc.Node = null;
    init(): void {

    }
    protected isOnafter(): void {
        super.isOnafter();
        this.contentRoot.active = this.IsOn;
    }
}
