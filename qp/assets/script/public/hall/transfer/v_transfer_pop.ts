import UHandler from "../../../common/utility/UHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import VWindow from "../../../common/base/VWindow";
import AppGame from "../../base/AppGame";
import MFriendsRoomCardModel from "../friends/friends_room_card/MFriendsRoomCardModel";
import { ECommonUI } from "../../../common/base/UAllenum";
import UDebug from "../../../common/utility/UDebug";





const { ccclass, property } = cc._decorator;
/**
 *作用:转账弹窗
 */
@ccclass
export default class V_Transfer_Pop extends VWindow {
    private _nickName:cc.Label
    private _userId:cc.Label
    private _cardNumber:cc.Label
    private _transferNumber:cc.EditBox

    init(): void {
        super.init();
        this._nickName =  UNodeHelper.getComponent(this._root, "account/TEXT_LABEL",cc.Label);
        this._userId =  UNodeHelper.getComponent(this._root, "id/TEXT_LABEL",cc.Label);
        this._cardNumber =  UNodeHelper.getComponent(this._root, "allnumber/TEXT_LABEL",cc.Label);
        this._transferNumber =  UNodeHelper.getComponent(this._root, "outnumber",cc.EditBox);
    }

    show(data: any): void {
        super.show(data);
        this._nickName.string = data.nickName
        this._userId.string = data.userId
        this._cardNumber.string = (data.roomCard / 100).toFixed(2)
        this._transferNumber.string = ""
        this.node.active = true
    }

    //确认转账
    onClickSure(){ 
        if  (this._userId.string == AppGame.ins.roleModel.useId.toString()){
            AppGame.ins.showTips("房卡不能转给自己");
            return
        }
        if (this._transferNumber.string == ""){
            AppGame.ins.showTips("转账数量不能为空");
            return
        }
        var transferNum = parseFloat(this._transferNumber.string)
        if ( transferNum <= 0){
            AppGame.ins.showTips("请输入正确的房卡数量");
            this._transferNumber.string = ""
            return
        }

        AppGame.ins.friendsRoomCardModel.requestTransfer(parseInt(this._userId.string),transferNum * 100)
    }

    //输入回车
    onInputReturn(){
        if (this._transferNumber.string != "")
        this._transferNumber.string = parseInt(this._transferNumber.string).toString()
    }

    protected onEnable():void{
        AppGame.ins.friendsRoomCardModel.on(MFriendsRoomCardModel.TRANSFER_RESLUT, this.onGetTranseferResult, this);
    }

    protected onDisable():void{
        AppGame.ins.friendsRoomCardModel.off(MFriendsRoomCardModel.OTHER_USER_INFO, this.onGetTranseferResult, this);

    }

    onGetTranseferResult(data:any){
        if (data.retCode == 0) {
            AppGame.ins.showTips("转账成功");
            //更新剩下房卡数量
            if (data.roomCard){
                AppGame.ins.roleModel.roomCard = data.roomCard
            }
             //关闭窗口
             AppGame.ins.closeUI(ECommonUI.UI_TRANSFER_POP)
        }else{ 
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: 3, data: data.errorMsg, handler: UHandler.create((a) => {
                    if (a){
                        //AppGame.ins.closeUI(ECommonUI.UI_TRANSFER_POP)
                        //AppGame.ins.closeUI(ECommonUI.UI_TRANSFER)
                        var data = {
                            index: 2,
                            isFullScreen: true
                        }
                        AppGame.ins.showUI(ECommonUI.LB_Charge,data);
                    }
                })
            });
        } 
    }


}
