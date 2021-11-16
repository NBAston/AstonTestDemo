import UImgBtn from "../../../common/utility/UImgBtn";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VChargeRecordsBtn extends UImgBtn {

    @property(cc.Integer)
    type: number = 0;
    @property(cc.Node)
    content: cc.Node = null;

    init(): void {

    }
    protected isOnafter(): void {
        this.content.active = this.IsOn;
    }
}
