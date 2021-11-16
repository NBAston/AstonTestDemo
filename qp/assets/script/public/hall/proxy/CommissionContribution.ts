

import VWindow from "../../../common/base/VWindow";
import UEventHandler from "../../../common/utility/UEventHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CommissionContribution extends VWindow {

    private _back:cc.Node;
    
    init():void{
        super.init();
        this._back = UNodeHelper.find(this.node,"back");
        UEventHandler.addClick(this._back,this.node,"CommissionContribution","closeUI");
    }

    closeUI(){
        super.playclick();
        super.clickClose();
    }
}
