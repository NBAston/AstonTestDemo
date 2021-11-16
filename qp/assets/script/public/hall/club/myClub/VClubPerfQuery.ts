

import { ECommonUI } from "../../../../common/base/UAllenum";
import VWindow from "../../../../common/base/VWindow";
import { ClubHallServer, HallServer } from "../../../../common/cmd/proto";
import UEventHandler from "../../../../common/utility/UEventHandler";
import UNodeHelper from "../../../../common/utility/UNodeHelper";
import UStringHelper from "../../../../common/utility/UStringHelper";
import AppGame from "../../../base/AppGame";
import MProxy from "../../proxy/MProxy";
import MClub from "./MClub";

export const ZJH_SCALE = 0.01;
const { ccclass, property } = cc._decorator;

@ccclass
export default class VClubPerfQuery extends VWindow {

    @property(cc.SpriteFrame)
    editbox_img_normal: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    editbox_img_input: cc.SpriteFrame = null;


    @property(cc.Node) partnerTitle: cc.Node = null; //合伙人Title
    @property(cc.Node) memberTitle: cc.Node = null; //直属会员Title
    @property(cc.Label) inquireBtnLab: cc.Label = null;//查询按钮lab
    @property(cc.Label) editboxTipLab: cc.Label = null;// 输入框Lab
    @property(cc.Node) memberItem: cc.Node = null;// 会员item
    @property(cc.Node) partnerItem: cc.Node = null;//合伙人partnerItem


    private _btn_start_date: cc.Node;
    private _btn_end_date: cc.Node;
    private _start_date: cc.Label;
    private _end_date: cc.Label;
    private _begin_controller: cc.Node;
    private _end_controller: cc.Node;
    private _lab_year_begin_controller: cc.Label;
    private _lab_month_begin_controller: cc.Label;
    private _lab_year_end_controller: cc.Label;
    private _lab_month_end_controller: cc.Label;
    private _item: cc.Node;
    // private _view_item: cc.Node;
    private _begin_controller_content: cc.Node;
    private _end_controller_content: cc.Node;
    private _btn_reduce_begin_controller: cc.Node;
    private _btn_add_begin_controller: cc.Node;
    private _btn_reduce_end_controller: cc.Node;
    private _btn_add_end_controller: cc.Node;
    private _member_editbox: cc.EditBox;
    private _btn_inquire_member: cc.Node;
    private _scrollview: cc.Node;
    private _no_data: cc.Node;
    private _back: cc.Node;

    init(): void {
        super.init();

        this._btn_start_date = UNodeHelper.find(this.node, "root/btn_start_date");
        this._btn_end_date = UNodeHelper.find(this.node, "root/btn_end_date");
        this._start_date = UNodeHelper.getComponent(this.node, "root/btn_start_date/date", cc.Label);
        this._end_date = UNodeHelper.getComponent(this.node, "root/btn_end_date/date", cc.Label);
        this._begin_controller = UNodeHelper.find(this.node, "root/begin_controller");
        this._end_controller = UNodeHelper.find(this.node, "root/end_controller");
        this._lab_year_begin_controller = UNodeHelper.getComponent(this.node, "root/begin_controller/year", cc.Label);
        this._lab_month_begin_controller = UNodeHelper.getComponent(this.node, "root/begin_controller/month", cc.Label);
        this._lab_year_end_controller = UNodeHelper.getComponent(this.node, "root/end_controller/year", cc.Label);
        this._lab_month_end_controller = UNodeHelper.getComponent(this.node, "root/end_controller/month", cc.Label);
        this._item = UNodeHelper.find(this.node, "root/begin_controller/scrollView/view/content/item");
        // this._view_item = UNodeHelper.find(this.node, "root/ScrollView/view/content/item");
        this._begin_controller_content = UNodeHelper.find(this.node, "root/begin_controller/scrollView/view/content");
        this._end_controller_content = UNodeHelper.find(this.node, "root/end_controller/scrollView/view/content");
        this._btn_reduce_begin_controller = UNodeHelper.find(this.node, "root/begin_controller/btn_left");
        this._btn_add_begin_controller = UNodeHelper.find(this.node, "root/begin_controller/btn_right");
        this._btn_reduce_end_controller = UNodeHelper.find(this.node, "root/end_controller/btn_left");
        this._btn_add_end_controller = UNodeHelper.find(this.node, "root/end_controller/btn_right");
        this._member_editbox = UNodeHelper.getComponent(this.node, "root/member_editbox", cc.EditBox);
        this._btn_inquire_member = UNodeHelper.find(this.node, "root/btn_inquire");
        this._scrollview = UNodeHelper.find(this.node, "root/ScrollView");
        this._no_data = UNodeHelper.find(this.node, "root/no_data");
        this._back = UNodeHelper.find(this.node, "back");
        UEventHandler.addClick(this._back, this.node, "VClubPerfQuery.ts", "closeUI");
        UEventHandler.addClick(this._btn_start_date, this.node, "VClubPerfQuery", "selectStartdata");
        UEventHandler.addClick(this._btn_end_date, this.node, "VClubPerfQuery", "selectEndDate");
        UEventHandler.addClick(this._btn_reduce_begin_controller, this.node, "VClubPerfQuery", "begin_controller_reduce");
        UEventHandler.addClick(this._btn_add_begin_controller, this.node, "VClubPerfQuery", "begin_controller_add");
        UEventHandler.addClick(this._btn_reduce_end_controller, this.node, "VClubPerfQuery", "end_controller_reduce");
        UEventHandler.addClick(this._btn_add_end_controller, this.node, "VClubPerfQuery", "end_controller_add");
        UEventHandler.addClick(this._btn_inquire_member, this.node, "VClubPerfQuery", "inquireMember");
        this._member_editbox.node.on("editing-did-began", this.startInput, this);
        this._member_editbox.node.on("editing-did-ended", this.getInput, this);
        this.setCurrentDays();
    }

    onLoad() {
        // this._scrollview.children[1].children[0].removeAllChildren();
    }

    /**
     * 开始输入
     */
    private startInput(): void {
        super.playclick();
        this._member_editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_input;
    }

    /**
     * 结束输入
     */
    private getInput(): void {
        this._member_editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.editbox_img_normal;
    }


    /**
     * 开始日期选择框
     */
    private selectStartdata(): void {
        super.playclick();
        var curDate = new Date();
        var curYear = curDate.getFullYear();
        var curMonth = curDate.getMonth() + 1;
        var curDay = curDate.getDate();
        var a = this._start_date.string;
        var b = this._end_date.string;
        var start_day = a.split("/", 3);
        var end_day = b.split("/", 3);
        this._lab_year_begin_controller.string = start_day[0];
        this._lab_month_begin_controller.string = start_day[1];
        this._begin_controller_content.removeAllChildren();
        if (parseInt(start_day[0]) == parseInt(end_day[0]) && parseInt(start_day[1]) == parseInt(end_day[1])) {
            this.instantiateNode(0, parseInt(end_day[2]), this._begin_controller_content, "chooseBeginDate");
        } else if (parseInt(this._lab_year_begin_controller.string) == curYear && parseInt(this._lab_month_begin_controller.string) == curMonth) {
            this.instantiateNode(0, curDay, this._begin_controller_content, "chooseBeginDate");
        } else {
            var c = this.getDaysInYearMonth(parseInt(this._lab_year_begin_controller.string), parseInt(this._lab_month_begin_controller.string));
            this.instantiateNode(0, c, this._begin_controller_content, "chooseBeginDate");
        }
        UNodeHelper.getComponent(this.node, "root/begin_controller/scrollView", cc.ScrollView).scrollToPercentHorizontal(0.5, 0.1);
        if (this._begin_controller.active == false) {
            if (this._end_controller.active == true) {
                this._end_controller.active = false;
            }
            this._begin_controller.active = true;
        } else {
            this._begin_controller.active = false;
        }
    }

    /**
     * 结束日期选择框
     */
    private selectEndDate(): void {
        super.playclick();

        var curDate = new Date();
        var curYear = curDate.getFullYear();
        var curMonth = curDate.getMonth() + 1;
        var curDay = curDate.getDate();
        if (this._end_controller.active == true) {
            this._end_controller.active = false;
        } else {
            if (this._begin_controller.active == true) {
                this._begin_controller.active = false;
            }
            this._end_controller.active = true;
        };
        var a = this._start_date.string;
        var b = this._end_date.string;
        var start_day = a.split("/", 3);
        var end_day = b.split("/", 3);
        this._lab_year_end_controller.string = end_day[0];
        this._lab_month_end_controller.string = end_day[1];
        this._end_controller_content.removeAllChildren();
        if (start_day[0] == end_day[0] && start_day[1] == end_day[1] && start_day[0] == curYear.toString() && start_day[1] == curMonth.toString()) {        //当前月份
            for (var i = parseInt(start_day[2]); i < curDay + 1; i++) {
                var item = cc.instantiate(this._item);
                item.children[0].getComponent(cc.Label).string = i + "";
                item.parent = this._end_controller_content;
                item.setPosition(40 + 80 * i, 0);
                this._end_controller_content.width = 80 * (i + 1);
                UEventHandler.addClick(item, this.node, "VClubPerfQuery", "chooseEndDate", i);
            }
        } else if (start_day[0] == end_day[0] && start_day[1] == end_day[1]) {
            var c = this.getDaysInYearMonth(parseInt(start_day[0]), parseInt(start_day[1]));
            for (var i = parseInt(start_day[2]); i < c + 1; i++) {
                var item = cc.instantiate(this._item);
                item.children[0].getComponent(cc.Label).string = i + "";
                item.parent = this._end_controller_content;
                item.setPosition(40 + 80 * i, 0);
                this._end_controller_content.width = 80 * (i + 1);
                UEventHandler.addClick(item, this.node, "VClubPerfQuery", "chooseEndDate", i);
            }
        } else if (parseInt(end_day[0]) == curYear && parseInt(end_day[1]) == curMonth) {
            this.instantiateNode(0, curDay, this._end_controller_content, "chooseEndDate");
        } else {
            var c = this.getDaysInYearMonth(parseInt(end_day[0]), parseInt(end_day[1]));
            this.instantiateNode(0, c, this._end_controller_content, "chooseEndDate");
        }

        UNodeHelper.getComponent(this.node, "root/end_controller/scrollView", cc.ScrollView).scrollToPercentHorizontal(0.5, 0.1);
    }

    /**
     * 获取某年某月的天数
     */
    getDaysInYearMonth(year: number, month: number) {
        var date = new Date(year, month, 0);
        var a = date.getDate();
        return a
    }

    /**
     * 获取当前时间
     */
    protected setCurrentDays(): void {
        var curDate = new Date();
        var curYear = curDate.getFullYear();
        var curMonth = curDate.getMonth() + 1;
        var curDay = curDate.getDate();
        this._start_date.string = curYear + "/" + curMonth + "/" + curDay;
        this._end_date.string = curYear + "/" + curMonth + "/" + curDay;
        this._lab_year_begin_controller.string = curYear + "";
        this._lab_month_begin_controller.string = curMonth + "";
        this._lab_year_end_controller.string = curYear + "";
        this._lab_month_end_controller.string = curMonth + "";

    }

    /**
     * 选择开始日期
     */
    private chooseBeginDate(event: TouchEvent, i): void {
        super.playclick();
        this._start_date.string = this._lab_year_begin_controller.string + "/" + this._lab_month_begin_controller.string + "/" + i;
        this._begin_controller.active = false;
    }

    /**
     * 选择结束日期
     */
    private chooseEndDate(event: TouchEvent, j): void {
        super.playclick();
        this._end_date.string = this._lab_year_end_controller.string + "/" + this._lab_month_end_controller.string + "/" + j;
        this._end_controller.active = false;
    }

    /**
     * 选择开始日期中减少月份按钮
     */
    private begin_controller_reduce(): void {
        super.playclick();
        if (parseInt(this._lab_month_begin_controller.string) == 1) {
            this._lab_year_begin_controller.string = parseInt(this._lab_year_begin_controller.string) - 1 + "";
            this._lab_month_begin_controller.string = "12";
        } else {
            this._lab_month_begin_controller.string = parseInt(this._lab_month_begin_controller.string) - 1 + "";
        }
        this._begin_controller_content.removeAllChildren();
        var a = this.getDaysInYearMonth(parseInt(this._lab_year_begin_controller.string), parseInt(this._lab_month_begin_controller.string));
        this.instantiateNode(0, a, this._begin_controller_content, "chooseBeginDate");
        UNodeHelper.getComponent(this.node, "root/begin_controller/scrollView", cc.ScrollView).scrollToPercentHorizontal(0.5, 0.1)

    }

    /**
     * 选择开始日期中增加月份按钮
     */
    private begin_controller_add(): void {
        super.playclick();
        var b = this._end_date.string;
        var end_day = b.split("/", 3);
        this._begin_controller_content.removeAllChildren();
        if (parseInt(this._lab_year_begin_controller.string) == parseInt(end_day[0]) && parseInt(this._lab_month_begin_controller.string) == (parseInt(end_day[1]) - 1)) {
            this._lab_month_begin_controller.string = parseInt(this._lab_month_begin_controller.string) + 1 + "";
            this.instantiateNode(0, parseInt(end_day[2]), this._begin_controller_content, "chooseBeginDate");
        } else if (parseInt(this._lab_year_begin_controller.string) == parseInt(end_day[0]) && parseInt(this._lab_month_begin_controller.string) == parseInt(end_day[1])) {
            this.instantiateNode(0, parseInt(end_day[2]), this._begin_controller_content, "chooseBeginDate");
        } else {
            if (parseInt(this._lab_month_begin_controller.string) == 12) {
                this._lab_month_begin_controller.string = 1 + "";
                this._lab_year_begin_controller.string = parseInt(this._lab_year_begin_controller.string) + 1 + "";
            } else {
                this._lab_month_begin_controller.string = parseInt(this._lab_month_begin_controller.string) + 1 + "";
            }
            var c = this.getDaysInYearMonth(parseInt(this._lab_year_begin_controller.string), parseInt(this._lab_month_begin_controller.string));
            this.instantiateNode(0, c, this._begin_controller_content, "chooseBeginDate");
        }
        UNodeHelper.getComponent(this.node, "root/begin_controller/scrollView", cc.ScrollView).scrollToPercentHorizontal(0.5, 0.1);
    }

    /**
     * 选择结束日期中减少月份按钮
     */
    private end_controller_reduce(): void {
        super.playclick();
        var curDate = new Date();
        var curMonth = curDate.getMonth() + 1;
        var curDay = curDate.getDate();
        var curYear = curDate.getFullYear();
        var a = this._start_date.string;
        var start_day = a.split("/", 3);
        this._end_controller_content.removeAllChildren();
        var c = this.getDaysInYearMonth(parseInt(this._lab_year_end_controller.string), parseInt(this._lab_month_end_controller.string));
        if (parseInt(this._lab_year_end_controller.string) == parseInt(start_day[0]) && parseInt(this._lab_month_end_controller.string) == parseInt(start_day[1]) + 1) {
            this._lab_month_end_controller.string = parseInt(this._lab_month_end_controller.string) - 1 + "";
            for (var i = parseInt(start_day[2]); i < c; i++) {
                var item = cc.instantiate(this._item);
                item.children[0].getComponent(cc.Label).string = i + "";
                item.parent = this._end_controller_content;
                item.setPosition(40 + 80 * i, 0);
                this._end_controller_content.width = 80 * (i + 1);
                UEventHandler.addClick(item, this.node, "VClubPerfQuery", "chooseEndDate", i);
            }
        } else if ((parseInt(this._lab_year_end_controller.string) == parseInt(start_day[0]) && parseInt(this._lab_month_end_controller.string) == parseInt(start_day[1]))) {
            if (parseInt(this._lab_month_end_controller.string) == curMonth && parseInt(this._lab_year_end_controller.string) == curYear) {
                for (var i = parseInt(start_day[2]); i < curDay + 1; i++) {
                    var item = cc.instantiate(this._item);
                    item.children[0].getComponent(cc.Label).string = i + "";
                    item.parent = this._end_controller_content;
                    item.setPosition(40 + 80 * i, 0);
                    this._end_controller_content.width = 80 * (i + 1);
                    UEventHandler.addClick(item, this.node, "VClubPerfQuery", "chooseEndDate", i);
                }
            } else {
                for (var i = parseInt(start_day[2]); i < c + 1; i++) {
                    var item = cc.instantiate(this._item);
                    item.children[0].getComponent(cc.Label).string = i + "";
                    item.parent = this._end_controller_content;
                    item.setPosition(40 + 80 * i, 0);
                    this._end_controller_content.width = 80 * (i + 1);
                    UEventHandler.addClick(item, this.node, "VClubPerfQuery", "chooseEndDate", i);
                }
            }
        } else if (parseInt(this._lab_year_end_controller.string) == (parseInt(start_day[0]) + 1) && parseInt(start_day[1]) == 12) {
            if (parseInt(this._lab_month_end_controller.string) == 1) {
                this._lab_year_end_controller.string = parseInt(start_day[0]) + "";
                this._lab_month_end_controller.string = 12 + "";

                for (var i = parseInt(start_day[2]); i < c; i++) {
                    var item = cc.instantiate(this._item);
                    item.children[0].getComponent(cc.Label).string = i + "";
                    item.parent = this._end_controller_content;
                    item.setPosition(40 + 80 * i, 0);
                    this._end_controller_content.width = 80 * (i + 1);
                    UEventHandler.addClick(item, this.node, "VClubPerfQuery", "chooseEndDate", i);
                }
            } else {
                this._lab_month_end_controller.string = parseInt(this._lab_month_end_controller.string) - 1 + "";
                for (var i = 0; i < c; i++) {
                    var item = cc.instantiate(this._item);
                    item.children[0].getComponent(cc.Label).string = i + 1 + "";
                    item.parent = this._end_controller_content;
                    item.setPosition(40 + 80 * i, 0);
                    this._end_controller_content.width = 80 * (i + 1);
                    UEventHandler.addClick(item, this.node, "VClubPerfQuery", "chooseEndDate", i + 1);
                }
            }
        } else {
            if (parseInt(this._lab_month_end_controller.string) == 1) {
                this._lab_year_end_controller.string = parseInt(this._lab_year_end_controller.string) - 1 + "";
                this._lab_month_end_controller.string = "12";
            } else {
                this._lab_month_end_controller.string = parseInt(this._lab_month_end_controller.string) - 1 + "";
            }
            this.instantiateNode(0, c, this._end_controller_content, "chooseEndDate");
        }
        UNodeHelper.getComponent(this.node, "root/end_controller/scrollView", cc.ScrollView).scrollToPercentHorizontal(0.5, 0.1)
    }

    /**
     * 选择结束日期中增加月份按钮
     */
    private end_controller_add(): void {
        super.playclick();
        var curDate = new Date();
        var curYear = curDate.getFullYear();
        var curMonth = curDate.getMonth() + 1;
        var curDay = curDate.getDate();
        var a = this._start_date.string;
        var b = this._end_date.string;
        var start_day = a.split("/", 3);
        var end_day = b.split("/", 3);
        this._end_controller_content.removeAllChildren();
        if (parseInt(this._lab_year_end_controller.string) == curYear && parseInt(this._lab_month_end_controller.string) == curMonth) {
            if (parseInt(start_day[0]) == parseInt(end_day[0]) && parseInt(start_day[1]) == parseInt(end_day[1]) && parseInt(end_day[0]) == curYear && parseInt(end_day[1]) == curMonth) {
                this.instantiateNode(parseInt(start_day[2]) - 1, curDay, this._end_controller_content, "chooseEndDate");
            } else {
                this.instantiateNode(0, curDay, this._end_controller_content, "chooseEndDate");
            }
        } else if (parseInt(this._lab_year_end_controller.string) == curYear && parseInt(this._lab_month_end_controller.string) == (curMonth - 1)) {
            this._lab_month_end_controller.string = parseInt(this._lab_month_end_controller.string) + 1 + "";
            this.instantiateNode(0, curDay, this._end_controller_content, "chooseEndDate");
        } else {
            if (parseInt(this._lab_month_end_controller.string) == 12) {
                this._lab_year_end_controller.string = parseInt(this._lab_year_end_controller.string) + 1 + "";
                this._lab_month_end_controller.string = "1";
            } else {
                this._lab_month_end_controller.string = parseInt(this._lab_month_end_controller.string) + 1 + "";
            }
            var c = this.getDaysInYearMonth(parseInt(this._lab_year_end_controller.string), parseInt(this._lab_month_end_controller.string));
            this.instantiateNode(0, c, this._end_controller_content, "chooseEndDate");
        }
        UNodeHelper.getComponent(this.node, "root/end_controller/scrollView", cc.ScrollView).scrollToPercentHorizontal(0.5, 0.1)
    }

    private instantiateNode(a: number, b: number, c: cc.Node, d: string): void {
        for (var i = a; i < b; i++) {
            var item = cc.instantiate(this._item);
            item.children[0].getComponent(cc.Label).string = i + 1 + "";
            item.parent = c;
            item.setPosition(40 + 80 * i, 0);
            c.width = 80 * (i + 1);
            UEventHandler.addClick(item, this.node, "VClubPerfQuery", d, i + 1);
        };
    }

    /**
     * 查询会员
     */
    private inquireMember(): void {
        super.playclick();
        if (UStringHelper.isInt(this._member_editbox.string)) {
            this._member_editbox.string = parseInt(this._member_editbox.string) + "";
        } else {
            this._member_editbox.string = "";
            AppGame.ins.showTips("请输入正确的玩家ID");
            return
        }

        var pid = AppGame.ins.roleModel.useId;
        var type = 3;
        var searchId = parseInt(this._member_editbox.string);
        var startDate = this._btn_start_date.getChildByName("date").getComponent(cc.Label).string.split("/", 3)[0] + "-" + this._btn_start_date.getChildByName("date").getComponent(cc.Label).string.split("/", 3)[1] + "-" + this._btn_start_date.getChildByName("date").getComponent(cc.Label).string.split("/", 3)[2];
        var endDate = this._btn_end_date.getChildByName("date").getComponent(cc.Label).string.split("/", 3)[0] + "-" + this._btn_end_date.getChildByName("date").getComponent(cc.Label).string.split("/", 3)[1] + "-" + this._btn_end_date.getChildByName("date").getComponent(cc.Label).string.split("/", 3)[2];
        AppGame.ins.myClubModel.requestClubMyPerDetail(pid, type, searchId, startDate, endDate, this._viewType);
    }

    private getData(data: any): void {
        if (AppGame.ins.myClubModel.requestClubMyPerDetail(data.pid, data.type, data.searchId, data.startDate, data.endDate, this._viewType)) {
            this.scheduleOnce(() => {
                AppGame.ins.showConnect(false);
            }, 5);
        }
    }

    /**
     * 查询会员数据刷新
     */
    private getMyClubDetatlRes(caller: ClubHallServer.GetAchievementDetailMemberMessageResponse | ClubHallServer.GetAchievementDetailPartnerMessageResponse) {
        if (caller.retCode == 0) {
            if (caller.dayAchievementItems.length !== 0) {
                this._scrollview.active = true;
                this._no_data.active = false;
                var content = UNodeHelper.find(this.node, "root/ScrollView/view/content");
                content.removeAllChildren();
                for (var i = 0; i < caller.dayAchievementItems.length; i++) {
                    var item = cc.instantiate(this._viewType == 0 ? this.memberItem : this.partnerItem);
                    item.parent = content;
                    item.active = true;
                    let dayAchievementItem = caller.dayAchievementItems[i];
                    let achievementItem = dayAchievementItem.achievementItem;
                    item.getChildByName("date").getComponent(cc.Label).string = dayAchievementItem.strDate;
                    if (this._viewType == 0) {
                        item.getChildByName("userId").getComponent(cc.Label).string = achievementItem["memberId"].toString();
                        item.getChildByName("allPerf").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(achievementItem["revenue"] * ZJH_SCALE).toString();
                        item.getChildByName("expIncome").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(achievementItem["myProfit"] * ZJH_SCALE).toString();
                    } else {
                        item.getChildByName("userId").getComponent(cc.Label).string = achievementItem["partnerId"].toString();
                        item.getChildByName("newAdded").getComponent(cc.Label).string = achievementItem["newTeamRegPeople"].toString();
                        item.getChildByName("teamPerf").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(achievementItem["teamRevenue"] * ZJH_SCALE).toString();
                        item.getChildByName("revenue").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(achievementItem["revenue"] * ZJH_SCALE).toString();
                        item.getChildByName("devoteProfit").getComponent(cc.Label).string = UStringHelper.getMoneyFormat(achievementItem["devoteProfit"] * ZJH_SCALE).toString();
                    };
                    item.getChildByName("incomeRatio").getComponent(cc.Label).string = achievementItem["rate"] + "%";

                    item.getChildByName("clubName").getComponent(cc.Label).string = achievementItem["clubName"].toString();
                }
            } else {
                this._scrollview.active = false;
                this._no_data.active = true;
            }

        } else {
            AppGame.ins.showTips(caller.errorMsg);
            this._scrollview.active = false;
            this._no_data.active = true;
        }

    };

    onEnable() {
        AppGame.ins.myClubModel.on(MClub.UPDATE_CLUB_MY_PERF_DETAIL, this.getMyClubDetatlRes, this);
    };

    onDisable() {
        AppGame.ins.myClubModel.off(MClub.UPDATE_CLUB_MY_PERF_DETAIL, this.getMyClubDetatlRes, this);
    }

    closeUI() {
        super.playclick();
        super.clickClose();
    };

    private _viewType: number = 0;  //0 直属会员 , 1合伙人
    show(data: any): void {
        let ViewType = data["ViewType"];
        this._viewType = ViewType;
        this.showContentByType(ViewType == "0" ? true : false);
        super.show(data);
        this.getData(data);
        this.showAnimation();
    };

    /**
     * @description 根据类型 显示界面
     * @param type 
     */
    showContentByType(boo: boolean) {
        this.partnerTitle.active = !boo;
        this.memberTitle.active = boo;
        this.inquireBtnLab.string = boo ? "查询直属会员" : "查询合伙人";
        this.editboxTipLab.string = boo ? "请输入会员ID" : "请输入合伙人ID";

    };
}
