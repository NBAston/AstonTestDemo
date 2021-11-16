import UImgBtn from "../../../common/utility/UImgBtn";
import { EBtnType } from "./MailServiceData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class Vlb_left_select extends UImgBtn {
    @property(cc.Node)
    content: cc.Node = null;
    @property({ type: cc.Enum(EBtnType) })
    type: EBtnType = EBtnType.email;
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
