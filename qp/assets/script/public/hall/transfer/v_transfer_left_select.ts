import UImgBtn from "../../../common/utility/UImgBtn";

const { ccclass, property } = cc._decorator;

export enum ETransferBtnType {
    transfer = 1,
    record = 2,
}

@ccclass
export default class V_Transfer_Left_Select extends UImgBtn {
    @property(cc.Node)
    content: cc.Node = null;
    @property({ type: cc.Enum(ETransferBtnType) })
    type: ETransferBtnType = ETransferBtnType.transfer;

    init(): void {

    }

    bindData(data: any): void {

    }
    
    protected isOnafter(): void {
        this.content.active = this.IsOn;
    }

    hide():void{
        this.IsOn=false;
    }
}
