import VWindow from "../../../common/base/VWindow";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import UStringHelper from "../../../common/utility/UStringHelper";
import AppGame from "../../base/AppGame";
import ULanHelper from "../../../common/utility/ULanHelper";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VRename extends VWindow {

    @property(cc.SpriteFrame)
    editbox_img_normal:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    editbox_img_input:cc.SpriteFrame = null;

    private _name: cc.EditBox;
    init(): void {
        super.init();
        this._name = UNodeHelper.getComponent(this._root, "name", cc.EditBox);
        var btnchange = UNodeHelper.find(this._root, "btn_change");
        this._name.node.on("editing-did-began",this.startInput,this);
        this._name.node.on("editing-did-ended",this.endInput,this);
        UEventHandler.addClick(btnchange, this.node, "VRename", "onchange");
    }
    show(data: any): void {
        super.show(data);
        this._name.string = "";
    }

    private startInput():void{
        super.playclick();
        this._name.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_input;
    }

    private endInput():void{
        this._name.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_input;
    }

    private onchange(): void {
        super.playclick();
        if (UStringHelper.isEmptyString(this._name.string)) {
            AppGame.ins.showTips(ULanHelper.NAME_CANT_EMPTY);
            return;
        }
        
        if(this._name.string.length>12)
        {
            AppGame.ins.showTips(ULanHelper.NAME_TOO_LONG);
            return;
        }

        var flag = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>《》/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？ 0123456789]")
        if(flag.test(this._name.string)){
            AppGame.ins.showTips("不能包含特殊字符或者数字");
            return;
        }

        AppGame.ins.roleModel.requestReNickName(this._name.string);
        this.clickClose();
    }

}
