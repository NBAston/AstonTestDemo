

import { HallServer } from "../../../common/cmd/proto";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../base/AppGame";
import MProxy from "./MProxy";
import VProxyItem from "./VProxyItem";


export const ZJH_SCALE = 0.01;

const {ccclass, property} = cc._decorator;

@ccclass
export default class VProxyRebateItem extends VProxyItem {

    private _scrollView:cc.Node;
    private _description:cc.Node;
    private _content:cc.Node;
    private _item:cc.Node;


    init():void{
        super.init();
        this._scrollView = UNodeHelper.find(this.contentNode,"scrollView");
        this._content = UNodeHelper.find(this.contentNode,"scrollView/view/content");
        this._item = UNodeHelper.find(this.contentNode,"scrollView/view/content/item");
        this._description = UNodeHelper.find(this.contentNode,"scrollView/view/content/description");
        this.addEventListener();
        
    }
    addEventListener() {
        AppGame.ins.proxyModel.on(MProxy.Exchange_Revenue,this.exchangeRevenue,this);
    }

    /**
     * 返佣比例
     */
    private exchangeRevenue(caller:HallServer.GetPromoterLevelMessageResponse){
        this.contentNode.active = true;
        this._content.removeAllChildren();
        var description = cc.instantiate(this._description);
        description.parent = this._content;
        for(var i = caller.promoterLevelItems.length - 1;i>=0;i--){
            var item = cc.instantiate(this._item);
            item.parent = this._content;
            item.getChildByName("level").getComponent(cc.Label).string = caller.promoterLevelItems[i].Id.toString();
            item.getChildByName("agency_level").getComponent(cc.Label).string = caller.promoterLevelItems[i].name;
            if(caller.promoterLevelItems[i].levelScore >= 1000000){
                item.getChildByName("team_amount").getComponent(cc.Label).string = caller.promoterLevelItems[i].levelScore/1000000 + "万以上"
            }else{
                if(caller.promoterLevelItems[i].Id == 1){
                    item.getChildByName("team_amount").getComponent(cc.Label).string = "2000以下";
                }else{
                    item.getChildByName("team_amount").getComponent(cc.Label).string = caller.promoterLevelItems[i].levelScore*ZJH_SCALE + "以上";
                }
                
            }
            if(caller.promoterLevelItems[i].rate == -1){
                item.getChildByName("proportion").getComponent(cc.Label).string = "请咨询平台";
            }else{
                item.getChildByName("proportion").getComponent(cc.Label).string = "每万返佣" + caller.promoterLevelItems[i].rate.toString();
            }
            
        }

    }

    protected isOnafter(): void {
        super.isOnafter();
        if(this.IsOn)
        {
            super.playclick();
            this.node.children[2].color = cc.color(255,255,255,255);
            this.contentNode.active = false;
            AppGame.ins.proxyModel.requestPromoterLevel();
        }else{
            this.node.children[2].color = cc.color(164,116,51,255);
        }
    }
}
