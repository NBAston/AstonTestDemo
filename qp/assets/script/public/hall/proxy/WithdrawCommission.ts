import VBaseUI from "../../../common/base/VBaseUI";
import VWindow from "../../../common/base/VWindow";
import { HallServer } from "../../../common/cmd/proto";
import UDebug from "../../../common/utility/UDebug";
import UEventHandler from "../../../common/utility/UEventHandler";
import UHandler from "../../../common/utility/UHandler";
import ULanHelper from "../../../common/utility/ULanHelper";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UStringHelper from "../../../common/utility/UStringHelper";
import AppGame from "../../base/AppGame";
import MProxy from "./MProxy";
import VProxyTGItem from "./VProxyTGItem";

export const ZJH_SCALE = 0.01;

const {ccclass, property} = cc._decorator;

@ccclass
export default class WithdrawCommission extends VWindow {

    @property(cc.SpriteFrame)
    editbox_img_normal:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    editbox_img_input:cc.SpriteFrame = null;

    private _num_commission:cc.Label;
    private _num_gold:cc.Label;
    private _editbox:cc.EditBox;
    private _btn_withdraw:cc.Node;
    private _btn_confitm:cc.Node;
    private _back:cc.Node;

    init():void{
        super.init();
        this._num_commission = UNodeHelper.getComponent(this._root,"num_commission",cc.Label);
        this._num_gold = UNodeHelper.getComponent(this._root,"num_gold",cc.Label);
        this._editbox = UNodeHelper.getComponent(this._root,"editbox",cc.EditBox);
        this._btn_withdraw = UNodeHelper.find(this._root,"btn_withdraw");
        this._btn_confitm = UNodeHelper.find(this._root,"btn_confitm");
        UEventHandler.addClick(this._btn_withdraw,this.node,"WithdrawCommission","getAll");
        UEventHandler.addClick(this._btn_confitm,this.node,"WithdrawCommission","confirmCommission");
        this._num_gold.string = "0.00";
        this._num_commission.string = "0.00";
        this._editbox.node.on("editing-did-began",this.startInput,this);
        this._editbox.node.on("editing-did-ended",this.getInput,this);
        this._back = UNodeHelper.find(this.node,"back");
        UEventHandler.addClick(this._back,this.node,"WithdrawCommission","closeUI");
        this.addEventListener();
    }

    addEventListener() {
        AppGame.ins.proxyModel.on(MProxy.UPDATE_GETGOLD,this.updateCommission,this);
    }

    private getAll():void{
        super.playclick();
        // if(parseInt(this._editbox.string) == 0){
        //     AppGame.ins.showTips("最小提取佣金为50，请重新输入！");
        //     this._editbox.string = "";
        // }else 
        // if(parseInt(this._editbox.string) < 50){
        //     AppGame.ins.showTips("最小提取佣金为50，请重新输入！");
        //     this._editbox.string = "";
        // }else if(this._editbox.string == ""){
        //     AppGame.ins.showTips("最小提取佣金为50，请重新输入！");
        //     this._editbox.string = "";
        // }else{
            this._editbox.string = parseInt(this._num_commission.string) + "";
        // }
        
    }

    private updateData():void{
        var dt = AppGame.ins.proxyModel.geTUIProxyTGData();
        if(dt){
            this._num_commission.string = UStringHelper.getMoneyFormat(dt.canGetMoney*ZJH_SCALE); 
            this._num_gold.string = UStringHelper.getMoneyFormat(dt.leftMoney*ZJH_SCALE);
        }else{
            this._num_gold.string = "0.00";
            this._num_commission.string = "0.00";
        }
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
        // if(UStringHelper.isEmptyString(this._editbox.string)){
        //     this._editbox.string = "";
        //     AppGame.ins.showTips(ULanHelper.ERROR_GOLD);
        //     return;
        // };
        // if(parseInt(this._editbox.string) > parseInt(this._num_commission.string)){
        //     AppGame.ins.showTips(ULanHelper.COMMISSION_LACK);
        //     if(parseInt(this._num_commission.string) == 0){
        //         this._editbox.string = "";
        //         return
        //     }else{
        //         this._editbox.string = parseInt(this._num_commission.string) + "";
        //         return
        //     }
            
        // }else if(parseInt(this._editbox.string) < parseInt(this._num_commission.string) && parseInt(this._editbox.string) >= 50){
        //     this._editbox.string = parseInt(this._editbox.string) + "";
        //     return
        // }else{
        //     AppGame.ins.showTips(ULanHelper.MINCOMMISSION);
        //     this._editbox.string =  "";
        //     return
        // }
    }

    /**
     * 确认提现
     */
    private confirmCommission():void{
        super.playclick();
        if(UStringHelper.isEmptyString(this._editbox.string)){
            AppGame.ins.showTips(ULanHelper.ERROR_GOLD);
            return;
        };
        if(parseInt(this._editbox.string) == 0){
            AppGame.ins.showTips(ULanHelper.ERROR_GOLD);
            this._editbox.string = "";
            return
        }
        AppGame.ins.proxyModel.exchanegeMyRevenue(parseInt(this._editbox.string)*100);
        this._editbox.string = "";
    }

    /**
     * 更新佣金
     */
    private updateCommission(caller:HallServer.ExchangeRevenueMessageResponse):void{
        if(caller.retCode == 0){
            AppGame.ins.showTips(ULanHelper.GETCOMMISSIONSUCCESS);
            this._num_commission.string = (caller.leftScore/100).toFixed(2);
            AppGame.ins.roleModel.requestUpdateScore();
            AppGame.ins.proxyModel.requestMySpreadInfo();
            this.clickClose();
        }else{

        }
    }

    show(data: any): void {
        super.show(data);
        UDebug.log(data);
        AppGame.ins.proxyModel.requestMySpreadInfo();
        this.updateData();
        // this.showAnimation();
    }

    closeUI(){
        this.playclick();
        super.clickClose();
    }

    protected onEnable(): void {
        AppGame.ins.roleModel.on(MProxy.UPDATE_TGINFO, this.updateCommission, this);
    }

    protected onDisable(): void {
        AppGame.ins.roleModel.off(MProxy.UPDATE_TGINFO, this.updateCommission, this);
    }


}
