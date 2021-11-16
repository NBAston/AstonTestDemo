import VAnnounceSelect from "./VAnnounceSelect";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VOnlineGM extends VAnnounceSelect {
    private _input: cc.EditBox;
    init(): void {
        super.init();
        this._input = UNodeHelper.getComponent(this.content, "input", cc.EditBox);
        let btn = UNodeHelper.find(this.content, "btn_b_mid");
        UEventHandler.addClick(btn, this.content, "VOnlineGM", "sumbmit");
    }
    private sumbmit(): void {

    }
    hide():void{
       super.hide();
       this._input.string="";
    }
    bindData(data: any): void {
        super.bindData(data);
        this._input.string = data;
        this._input.setFocus();
    }
    protected isOnafter(): void {
        super.isOnafter();
    }
}
