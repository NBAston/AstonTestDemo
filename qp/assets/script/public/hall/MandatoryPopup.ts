// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import VWindow from "../../common/base/VWindow";
import UEventHandler from "../../common/utility/UEventHandler";
import UNodeHelper from "../../common/utility/UNodeHelper";

const {ccclass, property} = cc._decorator;

@ccclass
export default class MandatoryPopup extends VWindow {

    private _lab_title:cc.Node;
    private _lab_content:cc.Node;
    private _back:cc.Node;

    init():void{
        super.init();
        this._lab_title = UNodeHelper.find(this._root,"lab_title");
        this._lab_content = UNodeHelper.find(this._root,"scrollView/view/content/lab_content");
        this._back = UNodeHelper.find(this.node,"back");
        UEventHandler.addClick(this._back,this.node,"MandatoryPopup","closeUI");
    }

    private updata(a:string,b:string):void{
        this._lab_title.getComponent(cc.Label).string = a;
        this._lab_content.getComponent(cc.Label).string = b;
    }

    closeUI(){
        super.playclick();
        super.clickClose();
    }

    show(data:any){
        super.show(data);
        this.updata(data.title,data.content);
    }

}
