import UImgBtn from "../../../common/utility/UImgBtn";
import { EAnnType } from "./AnnounceData";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VAnnounceSelect extends UImgBtn {
    @property(cc.Node)
    content: cc.Node = null;
    @property({ type: cc.Enum(EAnnType) })
    type: EAnnType = EAnnType.Ann;
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
