import UImgBtn from "../../../common/utility/UImgBtn";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VProxyItem extends UImgBtn {

    @property(cc.Integer)
    type: number = 0;
    @property(cc.Node)
    contentNode: cc.Node = null;
    
    init(): void {

    }
    protected isOnafter(): void {
        super.isOnafter();
        this.contentNode.active = this.IsOn;
    }
}
