import VProxyItem from "./VProxyItem";
import VProxyTeamInfoItem from "./VProxyTeamInfoItem";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import AppGame from "../../base/AppGame";
import MProxy from "./MProxy";
import UStringHelper from "../../../common/utility/UStringHelper";
import ULanHelper from "../../../common/utility/ULanHelper";
import { HallServer } from "../../../common/cmd/proto";
import { ECommonUI } from "../../../common/base/UAllenum";

export const ZJH_SCALE = 0.01;

const { ccclass, property } = cc._decorator;

@ccclass
export default class VProxyMyTeamItem extends VProxyItem {

    @property(cc.SpriteFrame)
    editbox_img_normal:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    editbox_img_input:cc.SpriteFrame = null;

    private _directly_under_num:cc.Label;
    private _editbox:cc.EditBox;
    private _btn_check_member:cc.Node;
    private _no_data:cc.Node;
    private _scrollView:cc.Node;
    private _content:cc.Node;
    private _item:cc.Node;


    init():void{
        super.init();
        this._directly_under_num = UNodeHelper.getComponent(this.contentNode,"directly_under_bg/directly_under_num",cc.Label);
        this._editbox = UNodeHelper.getComponent(this.contentNode,"editbox",cc.EditBox);
        this._btn_check_member = UNodeHelper.find(this.contentNode,"btn_check_member");
        this._no_data = UNodeHelper.find(this.contentNode,"no_data");
        this._scrollView = UNodeHelper.find(this.contentNode,"scrollView");
        this._content = UNodeHelper.find(this.contentNode,"scrollView/view/content");
        this._item = UNodeHelper.find(this.contentNode,"scrollView/view/content/item");
        UEventHandler.addClick(this._btn_check_member,this.node,"VProxyMyTeamItem","checkMember");
        this._editbox.node.on("editing-did-began",this.startInput,this);
        this._editbox.node.on("editing-did-ended",this.getInput,this);
        // var dt = AppGame.ins.proxyModel.geTUIProxyTGData();
        // if(dt){
        //     this._directly_under_num.string = dt.myPlayerCount.toString();
        // };
        this.addEventListener();
    }

    addEventListener() {
        AppGame.ins.proxyModel.on(MProxy.UPDATE_MY_TEAM,this.getMyTeam,this);
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
    }

    protected isOnafter(): void {
        super.isOnafter();
        if(this.IsOn)
        {
            super.playclick();
            this.node.children[2].color = cc.color(255,255,255,255);
            AppGame.ins.proxyModel.requestMyTeamDetail(0);
        }else{
            this.node.children[2].color = cc.color(164,116,51,255)
        }
    }

    /**
     * 查询会员
     */
    private checkMember():void{
        super.playclick();
        if(UStringHelper.isEmptyString(this._editbox.string)){
            AppGame.ins.showTips(ULanHelper.ACCOUNT_EMPTY);
            return
        }
        AppGame.ins.proxyModel.requestMyTeamDetail(parseInt(this._editbox.string));
        
    }

    /**
     * 刷新数据
     */
    private getMyTeam(caller:HallServer.GetMyTeamMessageResponse):void{
        if(caller.retCode == 0){
            this._directly_under_num.string = caller.teamItems.length.toString();
            if(caller.teamItems.length !==0 ){
                this._scrollView.active = true;
                this._no_data.active = false;
                this._content.removeAllChildren();
                for(var i = 0;i < caller.teamItems.length;i++){
                    var item = cc.instantiate(this._item);
                    item.parent = this._content;
                    item.getChildByName("user_id").getComponent(cc.Label).string = caller.teamItems[i].promoterId;
                    item.getChildByName("user_name").getComponent(cc.Label).string = caller.teamItems[i].promoterName;
                    item.getChildByName("agency_level").getComponent(cc.Label).string = caller.teamItems[i].promoterLevelName;
                    item.getChildByName("today_performance").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.teamItems[i].todayTeamRevenue*ZJH_SCALE);;
                    item.getChildByName("week_performance").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.teamItems[i].thisWeekTeamRevenue*ZJH_SCALE);
                    item.getChildByName("team_num").getComponent(cc.Label).string = caller.teamItems[i].teamPlayerCount.toString();
                    item.getChildByName("under_directly_num").getComponent(cc.Label).string = caller.teamItems[i].myPlayerCount.toString();
                    item.getChildByName("guaranteed").getComponent(cc.Label).string = caller.teamItems[i].promoterRate.toString();
                    UEventHandler.addClick(item.getChildByName("btn_setting"),this.node,"VProxyMyTeamItem","setCommission",{
                        promoterRate:caller.teamItems[i].promoterRate,
                        promoterId:caller.teamItems[i].promoterId,
                        promoterName:caller.teamItems[i].promoterName
                    });

                }
            }else{
                this._scrollView.active = false;
                this._no_data.active = true;
            }
        }else{
            this._scrollView.active = false;
            this._no_data.active = true;
        }
    }

    /**
     * 修改返佣比例弹窗
     */
    private setCommission(event:Event,a):void{
        super.playclick();
        AppGame.ins.showUI(ECommonUI.LB_SET_COMMISSION,a);
    }

    onDisable(){
        this.contentNode.getChildByName("directly_under_bg").getChildByName("directly_under_num").getComponent(cc.Label).string = "0";
        this.contentNode.getChildByName("no_data").active = true;
        this.contentNode.getChildByName("scrollView").active = false;
    }
}
