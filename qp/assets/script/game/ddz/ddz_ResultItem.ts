import { ERoomKind } from "../../common/base/UAllenum";
import UResManager from "../../common/base/UResManager";
import { Ddz } from "../../common/cmd/proto";
import UStringHelper from "../../common/utility/UStringHelper";
import AppGame from "../../public/base/AppGame";
import UDDZHelper from "./ddz_Helper";
import ddz_Main from "./ddz_Main";

const { ccclass, property } = cc._decorator;
@ccclass
export default class ddz_ResultItem extends cc.Component {
    @property(cc.Label) userid: cc.Label = null
    @property(cc.Label) cell: cc.Label = null
    @property(cc.Label) bet: cc.Label = null
    @property(cc.Label) score: cc.Label = null
    @property(cc.Node) banker: cc.Node = null
    @property(cc.Sprite) status: cc.Sprite = null
    @property(cc.Node) multipleTipPopup: cc.Node = null
    private _is_multiple_open: boolean;

    onLoad() {
        this._is_multiple_open = false;
    } 

    show(data:any){
        //昵称
        if(AppGame.ins.currRoomKind == ERoomKind.Normal){
            if (data.chairid != AppGame.ins.ddzModel.gMeChairId)
            this.userid.string = UStringHelper.coverName(data.userid + "")
            else
            this.userid.string = data.userid 
        }else{
            this.userid.string = data.nickname 
        }

        //分数
        this.score.string = (data.scorechange/100).toString()
        //底分
        this.cell.string = (AppGame.ins.ddzModel.cellScore/100).toString()
        //倍数
        this.bet.string = data.playerbeilv.totalbeilv
        //地主标识
        this.banker.active = data.chairid == AppGame.ins.ddzModel.gBankerIndex ? true : false
        //输赢状态
        if (data.scorestatus == 0) {
            this.status.node.active = false
        }
        else if (data.scorestatus == 1) {
            var url =  "texture/fengding"
            UResManager.loadUrlByBundle(AppGame.ins.roomModel.BundleName,url, this.status)
            this.status.node.active = true
        }
        else if (data.scorestatus == 2){
            url =  "texture/pochan"
            UResManager.loadUrlByBundle(AppGame.ins.roomModel.BundleName,url, this.status)
            this.status.node.active = true
        }
        if (data.chairid == AppGame.ins.ddzModel.gMeChairId){
            this.multipleTipPopup.runAction(cc.scaleTo(0.15, 0));
            this.refreshMultiple(data.playerbeilv);

            //根据输赢改变自己的颜色
            var color = cc.Color.BLACK;
            if (data.scorechange >= 0) {
                this.userid.node.color = color.fromHEX("#FFF583");
                this.score.node.color = color.fromHEX("#FFF583");
                this.cell.node.color = color.fromHEX("#FFF583");
                this.bet.node.color = color.fromHEX("#FFF583");
            }else{
                this.userid.node.color = color.fromHEX("#83d2ff");
                this.score.node.color = color.fromHEX("#83d2ff");
                this.cell.node.color = color.fromHEX("#83d2ff");
                this.bet.node.color = color.fromHEX("#83d2ff");      
            }
        }
    }

    refreshMultiple(data: any){
        let ddz_PlusView = this.multipleTipPopup.getComponent("ddz_PlusView");
        ddz_PlusView.resetView();
        // //基础倍率
        // ddz_PlusView.setBase(data.basebeilv);
        //炸弹倍率
        ddz_PlusView.setBomb(data.bombbeilv);
        //春天倍率
        ddz_PlusView.setSpring(data.springbeilv);
        ddz_PlusView.setCommon(data.bombbeilv*data.springbeilv*data.jdzbeilv);
        //叫地主倍率
        ddz_PlusView.setLandlord(data.jdzbeilv);
        //农民加倍倍率
        ddz_PlusView.setFarmer(data.jiabeibeilv);
        //总倍率
        ddz_PlusView.setTotal(data.totalbeilv);
        ddz_PlusView.setUser(AppGame.ins.roleModel.useId);
    }

    onMultiple() {
        if (this._is_multiple_open) {
            this.multipleTipPopup.runAction(cc.scaleTo(0.15, 0));  
        } else {
            this.multipleTipPopup.runAction(cc.scaleTo(0.15, 1));
        }
        this._is_multiple_open = !this._is_multiple_open;
    }

}
