import { ECommonUI } from "../../../common/base/UAllenum";
import { HallServer } from "../../../common/cmd/proto";
import UEventHandler from "../../../common/utility/UEventHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UStringHelper from "../../../common/utility/UStringHelper";
import AppGame from "../../base/AppGame";
import MProxy from "./MProxy";
import VProxyItem from "./VProxyItem";


export const ZJH_SCALE = 0.01;

var curDate = new Date();
var curYear = curDate.getFullYear();
var curMonth = curDate.getMonth() + 1;
var curDay = curDate.getDate();

const {ccclass, property} = cc._decorator;

@ccclass
export default class VProxyPerformanceItem extends VProxyItem {

    private _btn_tw_data_check:cc.Node;
    private _tw_personal_add:cc.Label;
    private _tw_personal_performance:cc.Label;
    private _tw_team_add:cc.Label;
    private _tw_team_performance:cc.Label;
    private _tw_commission:cc.Label;
    private _scrollview:cc.Node;
    private _no_data:cc.Node;
    private _item:cc.Node;
    private _direct_performance:cc.Label;

    init():void{
        super.init();
        this._btn_tw_data_check = UNodeHelper.find(this.contentNode,"btn_tw_data_check");
        this._tw_personal_add = UNodeHelper.getComponent(this.contentNode,"tw_data/personal_add",cc.Label);
        this._direct_performance = UNodeHelper.getComponent(this.contentNode,"tw_data/direct_performance",cc.Label);
        this._tw_personal_performance = UNodeHelper.getComponent(this.contentNode,"tw_data/personal_performance",cc.Label);
        this._tw_team_add = UNodeHelper.getComponent(this.contentNode,"tw_data/team_add",cc.Label);
        this._tw_team_performance = UNodeHelper.getComponent(this.contentNode,"tw_data/team_performance",cc.Label);
        this._tw_commission = UNodeHelper.getComponent(this.contentNode,"tw_data/commission",cc.Label);
        this._scrollview = UNodeHelper.find(this.contentNode,"scrollview");
        this._no_data = UNodeHelper.find(this.contentNode,"no_data");
        this._item = UNodeHelper.find(this.contentNode,"scrollview/view/content/item");
        UEventHandler.addClick(this._btn_tw_data_check,this.node,"VProxyPerformanceItem","checkThisWeekDetail"); 

        this.addEventListener();
    }

    addEventListener() {
        AppGame.ins.proxyModel.on(MProxy.UPDATE_MY_ACHIEVEMENT,this.updateMyAchievement,this);
    }

    /**
     * 我的业绩
     */
    private updateMyAchievement(caller:HallServer.GetMyAchievementMessageResponse):void{
        if(caller.retCode == 0){
            if(caller.dayAchievementItems.length !== 0){
                this._scrollview.active = true;
                this._no_data.active = false;
                this._btn_tw_data_check.active = true;
                this._tw_personal_add.string = caller.thisWeek.newDirPlayerCount.toString();
                this._direct_performance.string = UStringHelper.getMoneyFormat(caller.thisWeek.newDirFlowAmount*ZJH_SCALE).toString();
                this._tw_personal_performance.string = UStringHelper.getMoneyFormat( caller.thisWeek.mySelfFlowAmount*ZJH_SCALE);
                this._tw_team_add.string = caller.thisWeek.newTeamPlayerCount.toString();
                this._tw_team_performance.string = UStringHelper.getMoneyFormat(caller.thisWeek.newTeamFlowAmount*ZJH_SCALE);;
                this._tw_commission.string = UStringHelper.getMoneyFormat(caller.thisWeek.totalProfit*ZJH_SCALE);;
                var content = UNodeHelper.find(this.contentNode,"scrollview/view/content");
                content.removeAllChildren();
                for(var i = 0;i < caller.dayAchievementItems.length;i++){
                    var item = cc.instantiate(this._item);
                    item.parent = content;
                    item.getChildByName("date").getComponent(cc.Label).string = caller.dayAchievementItems[i].strDate;
                    item.getChildByName("personal_add").getComponent(cc.Label).string = caller.dayAchievementItems[i].achievementItem.newDirPlayerCount.toString();
                    item.getChildByName("direct_performance").getComponent(cc.Label).string = UStringHelper.getMoneyFormat( caller.dayAchievementItems[i].achievementItem.newDirFlowAmount*ZJH_SCALE).toString();
                    item.getChildByName("personal_performance").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.dayAchievementItems[i].achievementItem.mySelfFlowAmount*ZJH_SCALE);
                    item.getChildByName("team_add").getComponent(cc.Label).string = caller.dayAchievementItems[i].achievementItem.newTeamPlayerCount.toString();
                    item.getChildByName("team_performance").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.dayAchievementItems[i].achievementItem.newTeamFlowAmount*ZJH_SCALE);
                    item.getChildByName("commission").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.dayAchievementItems[i].achievementItem.totalProfit*ZJH_SCALE);
                    UEventHandler.addClick(item.getChildByName("do"),this.node,"VProxyPerformanceItem","checkSingelDayDetail",caller.dayAchievementItems[i].strDate);
                    
                }
            }else{
                this._scrollview.active = false;
                this._no_data.active = true;
                this._btn_tw_data_check.active = false;
            }
        }else{
            this._scrollview.active = false;
            this._no_data.active = true;
            this._btn_tw_data_check.active = false;
        }
    }

    /**
     * 获取当前时间
     */
    getDays(n){
        var now = new Date();
        var date = new Date( now.getTime() - n*24*3600*1000 );
        var year = date.getFullYear();
        var month = date.getMonth()+1 > 9? date.getMonth()+1 : "0"+(date.getMonth()+1);
        var day = date.getDate() > 9 ?date.getDate() : "0" + date.getDate();
        var a = year + "-" + month + "-" + day;
        return a
    }

    protected isOnafter(): void {
        super.isOnafter();
        if(this.IsOn)
        {
            super.playclick();
            this.node.children[2].color = cc.color(255,255,255,255);
            if(AppGame.ins.proxyModel.requestMyAchievement()){
                this.scheduleOnce(() => {
                    AppGame.ins.showConnect(false);
                }, 5);
            }
        }else{
            this.node.children[2].color = cc.color(164,116,51,255);
        }
    }

    /**
     * 查看本周详情
     */
    private checkThisWeekDetail():void{
        super.playclick();
        var startDay = this.getDays(6);
        var endDay = curYear + "-" + curMonth + "-" + curDay;
        AppGame.ins.showUI(ECommonUI.LB_PerformanceQuery,{
            pid:AppGame.ins.roleModel.useId,
            type:1,
            searchId:0,
            startDate:startDay,
            endDate:endDay,
        });
    }

    private checkLastWeekDetail():void{
        super.playclick();
        AppGame.ins.showUI(ECommonUI.LB_PerformanceQuery,{
            pid:AppGame.ins.roleModel.useId,
            type:2,
            searchId:0,
            startDate:"",
            endDate:"",
        });
    }

    private checkSingelDayDetail(event:Event,date:string):void{
        super.playclick();
        AppGame.ins.showUI(ECommonUI.LB_PerformanceQuery,{
            pid:AppGame.ins.roleModel.useId,
            type:0,
            searchId:0,
            startDate:date,
            endDate:date,
        });
        
    }

    onDisable(){
        this.contentNode.getChildByName("scrollview").active = false;
        this.contentNode.getChildByName("no_data").active = true;
        this.contentNode.getChildByName("tw_data").getChildByName("personal_add").getComponent(cc.Label).string = "-";
        this.contentNode.getChildByName("tw_data").getChildByName("direct_performance").getComponent(cc.Label).string = "-";
        this.contentNode.getChildByName("tw_data").getChildByName("personal_performance").getComponent(cc.Label).string = "-";
        this.contentNode.getChildByName("tw_data").getChildByName("team_add").getComponent(cc.Label).string = "-";
        this.contentNode.getChildByName("tw_data").getChildByName("team_performance").getComponent(cc.Label).string = "-";
        this.contentNode.getChildByName("tw_data").getChildByName("commission").getComponent(cc.Label).string = "-";
        this.contentNode.getChildByName("btn_tw_data_check").active = false;
    }

}
