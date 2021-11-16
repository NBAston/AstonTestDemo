import VWindow from "../../../common/base/VWindow";
import { HallServer } from "../../../common/cmd/proto";
import UDebug from "../../../common/utility/UDebug";
import UEventHandler from "../../../common/utility/UEventHandler";
import ULanHelper from "../../../common/utility/ULanHelper";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UStringHelper from "../../../common/utility/UStringHelper";
import AppGame from "../../base/AppGame";
import MProxy from "./MProxy";

const {ccclass, property} = cc._decorator;

@ccclass
export default class SetCommission extends VWindow {

    @property(cc.SpriteFrame)
    editbox_img_normal:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    editbox_img_input:cc.SpriteFrame = null;


    private _current_rate:cc.Label;
    private _subordinate_id:cc.Label;
    private _subordinate_name:cc.Label;
    private _min_rate:cc.Label;
    private _editbox:cc.EditBox;
    private _btn_confirm:cc.Node;
    private _back:cc.Node;

    init():void{
        super.init();
        this._current_rate = UNodeHelper.getComponent(this._root,"current_rate",cc.Label);
        this._subordinate_id = UNodeHelper.getComponent(this._root,"subordinate_id",cc.Label);
        this._subordinate_name = UNodeHelper.getComponent(this._root,"subordinate_name",cc.Label);
        this._min_rate = UNodeHelper.getComponent(this._root,"min_rate",cc.Label);
        this._editbox = UNodeHelper.getComponent(this._root,"editBox",cc.EditBox);
        this._btn_confirm = UNodeHelper.find(this._root,"btn_comfirm");
        UEventHandler.addClick(this._btn_confirm,this.node,"SetCommission","changeCommission");
        this._editbox.node.on("editing-did-began",this.startInput,this);
        this._editbox.node.on("editing-did-ended",this.getInput,this);
        this.addEventListener();
        this._back = UNodeHelper.find(this.node,"back");
        UEventHandler.addClick(this._back,this.node,"SetCommission","closeUI");
    }

    addEventListener() {
        AppGame.ins.proxyModel.on(MProxy.CHANGE_COMMISSION,this.showTips,this);
    }

    /**
     * 开始输入
     */
    private startInput():void{
        super.playclick();
        this._editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_input;
    }

    /**
     * 结束输入
     */
    private getInput():void{
        this._editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_normal;
        // this._editbox.string = parseInt(this._editbox.string) + "";
        if(UStringHelper.isEmptyString(this._editbox.string)){
            AppGame.ins.showTips(ULanHelper.ERROR_GOLD);
            return;
        };
        if(!UStringHelper.isInt(this._editbox.string)){
            AppGame.ins.showTips("请输入整数");
            this._editbox.string = "";
            return
        }

    }

    /**
     * 修改返佣比例
     */
    private changeCommission():void{
        super.playclick();
        var a = parseInt(this._subordinate_id.string);
        var b = parseInt(this._editbox.string);
        AppGame.ins.proxyModel.requestChangeCommission(a,b);
    }

    private showTips(caller:HallServer.SetSubordinateRateMessageResponse):void{
        if(caller.retCode == 0){
            AppGame.ins.proxyModel.requestMyTeamDetail(0);
            this.clickClose();
        }else{
            // AppGame.ins.showTips(caller.errorMsg);
        }
    }

	closeUI(){
        super.playclick();
        super.clickClose();
    }

    show(data: any): void {
        super.show(data);
        UDebug.log(data);
        this._current_rate.string = data.promoterRate;
        this._subordinate_id.string = data.promoterId;
        this._subordinate_name.string = data.promoterName;
        this._min_rate.string = data.promoterRate;


    }
}
