import { ECommonUI } from "../../../../common/base/UAllenum";
import { ClubHallServer, HallServer } from "../../../../common/cmd/proto";
import UEventHandler from "../../../../common/utility/UEventHandler";
import UNodeHelper from "../../../../common/utility/UNodeHelper";
import UStringHelper from "../../../../common/utility/UStringHelper";
import AppGame from "../../../base/AppGame";
import MProxy from "../../proxy/MProxy";
import VProxyItem from "../../proxy/VProxyItem";
import MClub from "./MClub";



export const ZJH_SCALE = 0.01;

var curDate = new Date();
var curYear = curDate.getFullYear();
var curMonth = curDate.getMonth() + 1;
var curDay = curDate.getDate();

const { ccclass, property } = cc._decorator;

@ccclass
export default class VClubPerformance extends cc.Component {
    @property(cc.Node) contentNode: cc.Node = null; //信息详情 content

    @property({ type: cc.Label, tooltip: "本周直属新增" }) weekNewAdded: cc.Label = null;
    @property({ type: cc.Label, tooltip: "本周直属业绩" }) weekPerformance: cc.Label = null;
    @property({ type: cc.Label, tooltip: "本周直属收益" }) weekIncome: cc.Label = null;
    @property({ type: cc.Label, tooltip: "本周合伙人业绩" }) weekPartnerPerf: cc.Label = null;
    @property({ type: cc.Label, tooltip: "本周团队分成" }) weekFengCeng: cc.Label = null;
    @property({ type: cc.Label, tooltip: "本周预计佣金" }) weekCommission: cc.Label = null;
    @property({ type: cc.Node, tooltip: "没有数据提示 " }) noDataTips: cc.Node = null;
    @property({ type: cc.Node, tooltip: "数据item " }) itemNode: cc.Node = null;

    init(): void {
        this.noDataTips.active = true;
        this.weekNewAdded.string = "-";
        this.weekPerformance.string = "-";
        this.weekIncome.string = "-";
        this.weekPartnerPerf.string = "-";
        this.weekFengCeng.string = "-";
        this.weekCommission.string = "-";
        let items = this.contentNode.children;
        for (let i = 0; i < items.length; i++) {
            items[i].active = false;
        };

    };

    /**
     * 我的业绩
     */
    private updateClubMyAchievement(caller: ClubHallServer.GetMyAchievementMessageResponse): void {
        cc.log("我的业绩", caller)
        this.noDataTips.active = true;
        if (caller.retCode == 0 && caller.dayAchievementItems.length !== 0) {
            this.noDataTips.active = false;

            this.weekNewAdded.string = caller.thisWeek.newPlayerCount.toString();;
            this.weekPerformance.string = UStringHelper.getMoneyFormat(caller.thisWeek.newRevenue * ZJH_SCALE);
            this.weekIncome.string = UStringHelper.getMoneyFormat(caller.thisWeek.newMyProfit * ZJH_SCALE);
            this.weekPartnerPerf.string = UStringHelper.getMoneyFormat(caller.thisWeek.newTeamRevenue * ZJH_SCALE);
            this.weekFengCeng.string = UStringHelper.getMoneyFormat(caller.thisWeek.teamProfit * ZJH_SCALE);
            this.weekCommission.string = UStringHelper.getMoneyFormat(caller.thisWeek.myTeamProfit * ZJH_SCALE);

            let items = this.contentNode.children;

            for (var i = 0; i < caller.dayAchievementItems.length; i++) {
                let item = items[i];
                if (!item) {
                    item = cc.instantiate(this.itemNode);
                    this.contentNode.addChild(item);
                };
                item.active = true;
                item.getChildByName("date").getComponent(cc.Label).string = caller.dayAchievementItems[i].strDate;
                item.getChildByName("newAdded").getComponent(cc.Label).string = caller.dayAchievementItems[i].achievementItem.newPlayerCount.toString();
                item.getChildByName("performance").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.dayAchievementItems[i].achievementItem.newRevenue * ZJH_SCALE).toString();
                item.getChildByName("income").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.dayAchievementItems[i].achievementItem.newMyProfit * ZJH_SCALE);
                item.getChildByName("partnerPerf").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.dayAchievementItems[i].achievementItem.newTeamRevenue * ZJH_SCALE);
                item.getChildByName("fengCeng").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.dayAchievementItems[i].achievementItem.teamProfit * ZJH_SCALE);
                item.getChildByName("commission").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(caller.dayAchievementItems[i].achievementItem.myTeamProfit * ZJH_SCALE);

                let performanceBtn = item.getChildByName("performance").getChildByName("btn");
                let partnerPerfBtn = item.getChildByName("partnerPerf").getChildByName("btn");
                performanceBtn["strDate"] = caller.dayAchievementItems[i].strDate;
                partnerPerfBtn["strDate"] = caller.dayAchievementItems[i].strDate;
            }

        }
    }

    /**
     * 获取当前时间
     */
    getDays(n) {
        var now = new Date();
        var date = new Date(now.getTime() - n * 24 * 3600 * 1000);
        var year = date.getFullYear();
        var month = date.getMonth() + 1 > 9 ? date.getMonth() + 1 : "0" + (date.getMonth() + 1);
        var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        var a = year + "-" + month + "-" + day;
        return a
    };

    /**
     * @description 点击详情
     * @param event 
     * @param date 
     */
    private clickDetail(event: Event, customData: string): void {
        // super.playclick();
        let strDate = event.target["strDate"];

        AppGame.ins.showUI(ECommonUI.CLUB_PERF_QUERY, {
            pid: AppGame.ins.roleModel.useId,
            type: 0,
            searchId: 0,
            startDate: strDate,
            endDate: strDate,
            ViewType: customData,
        });

    };

    onEnable() {
        this.init();
        AppGame.ins.myClubModel.on(MClub.UPDATE_CLUB_MY_ACHIEVEMENT, this.updateClubMyAchievement, this);
        if (AppGame.ins.myClubModel.requestClubMyAchievement()) {
            this.scheduleOnce(() => {
                AppGame.ins.showConnect(false);
            }, 5);
        };
    };

    onDisable() {
        AppGame.ins.myClubModel.off(MClub.UPDATE_CLUB_MY_ACHIEVEMENT, this.updateClubMyAchievement, this);
    };

}
