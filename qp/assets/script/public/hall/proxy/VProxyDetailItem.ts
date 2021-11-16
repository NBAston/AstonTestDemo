import VProxyItem from "./VProxyItem";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import AppGame from "../../base/AppGame";
import UStringHelper from "../../../common/utility/UStringHelper";
import { ZJH_SCALE } from "../../../game/zjh/MZJH";
import VProxyDetailInfoItem from "./VProxyDetailInfoItem";
import UResManager from "../../../common/base/UResManager";
import { EIconType } from "../../../common/base/UAllenum";
import MProxy from "./MProxy";
import { HallServer } from "../../../common/cmd/proto";
import ULanHelper from "../../../common/utility/ULanHelper";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";

var curDate = new Date();
var curYear = curDate.getFullYear();
var curMonth = curDate.getMonth() + 1;
var curDay = curDate.getDate();


const { ccclass, property } = cc._decorator;

@ccclass
export default class VProxyDetailItem extends VProxyItem {

    @property(cc.SpriteFrame)
    normal_img:cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    press_img:cc.SpriteFrame = null;

    private _extracted_num:cc.Label; 
    private _toggle_date:cc.Node;
    private _default_time:cc.Label;
    private _logo:cc.Sprite;
    private _no_data:cc.Node;
    private _scrollview:cc.Node;
    private _btn_today:cc.Node;
    private _btn_yesterday:cc.Node;
    private _btn_three_days:cc.Node;
    private _btn_five_days:cc.Node;
    private _btn_ten_days:cc.Node;
    private _btn_twenty_days:cc.Node;
    private _btn_a_month:cc.Node;
    private _btn_two_month:cc.Node;
    private _item:cc.Node;
    private _menu:cc.Node;
    

    init():void{
        super.init();
        this._extracted_num = UNodeHelper.getComponent(this.contentNode,"extracted_bg/extracted_num",cc.Label);
        this._toggle_date = UNodeHelper.find(this.contentNode,"toggle_date");
        this._default_time = UNodeHelper.getComponent(this.contentNode,"toggle_date/default_time",cc.Label);
        this._logo = UNodeHelper.getComponent(this.contentNode,"toggle_date/logo",cc.Sprite);
        this._no_data = UNodeHelper.find(this.contentNode,"no_data");
        this._scrollview = UNodeHelper.find(this.contentNode,"scrollview");
        this._btn_today = UNodeHelper.find(this.contentNode,"toggle_date/menu/content/btn_today");
        this._btn_yesterday = UNodeHelper.find(this.contentNode,"toggle_date/menu/content/btn_yesterday");
        this._btn_three_days = UNodeHelper.find(this.contentNode,"toggle_date/menu/content/btn_three_days");
        this._btn_five_days = UNodeHelper.find(this.contentNode,"toggle_date/menu/content/btn_five_days");
        this._btn_ten_days = UNodeHelper.find(this.contentNode,"toggle_date/menu/content/btn_ten_days");
        this._btn_twenty_days = UNodeHelper.find(this.contentNode,"toggle_date/menu/content/btn_twenty_days");
        this._btn_a_month = UNodeHelper.find(this.contentNode,"toggle_date/menu/content/btn_a_month");
        this._btn_two_month = UNodeHelper.find(this.contentNode,"toggle_date/menu/content/btn_two_month");
        this._item = UNodeHelper.find(this.contentNode,"scrollview/view/content/item");
        this._menu = UNodeHelper.find(this.contentNode,"toggle_date/menu");

        UEventHandler.addClick(this._toggle_date,this.node,"VProxyDetailItem","toggleClick");
        UEventHandler.addClick(this._btn_today,this.node,"VProxyDetailItem","getTodayData");
        UEventHandler.addClick(this._btn_yesterday,this.node,"VProxyDetailItem","getYesterdayData");
        UEventHandler.addClick(this._btn_three_days,this.node,"VProxyDetailItem","getThreeDaysData");
        UEventHandler.addClick(this._btn_five_days,this.node,"VProxyDetailItem","getFiveDaysData");
        UEventHandler.addClick(this._btn_ten_days,this.node,"VProxyDetailItem","getTenDaysData");
        UEventHandler.addClick(this._btn_twenty_days,this.node,"VProxyDetailItem","getTwentyDaysData");
        UEventHandler.addClick(this._btn_a_month,this.node,"VProxyDetailItem","getOneMonthData");
        UEventHandler.addClick(this._btn_two_month,this.node,"VProxyDetailItem","getTwoMonthData");
        UEventHandler.addClick(this._menu,this.node,"VProxyDetailItem","hiddenMenu");
        
        this.addEventListener();
    }

    addEventListener() {
        AppGame.ins.proxyModel.on(MProxy.UPDATE_COMMISSION_DETAIL,this.UpdateCommissionRecord,this);
    }

    protected isOnafter(): void {
        super.isOnafter();
        if(this.IsOn)
        {
            super.playclick();
            this.node.children[2].color = cc.color(255,255,255,255);
            this._menu.active = false;
            this._default_time.string = "今天";
            this._toggle_date.getComponent(cc.Toggle).isChecked = false;
            this._logo.spriteFrame = this.normal_img;
            var startDay = curYear + "-" + curMonth + "-" + curDay;
            AppGame.ins.proxyModel.requestMyRevenueRecordDetail(startDay,startDay);
        }else{ 
            this.node.children[2].color = cc.color(164,116,51,255)
        }
    }

    private toggleClick():void{
        super.playclick();
        if(this._toggle_date.getComponent(cc.Toggle).isChecked == true){
            this._logo.spriteFrame = this.normal_img;
        }else{
            this._logo.spriteFrame = this.press_img;
        }
    }

    getDays(n){
        var now = new Date();
        var date = new Date( now.getTime() - n*24*3600*1000 );
        var year = date.getFullYear();
        var month = date.getMonth()+1 > 9? date.getMonth()+1 : "0"+(date.getMonth()+1);
        var day = date.getDate() > 9 ?date.getDate() : "0" + date.getDate();
        var a = year + "-" + month + "-" + day;
        return a
    }

    private hiddenMenu():void{
        this._toggle_date.getComponent(cc.Toggle).isChecked = false;
    }

    private UpdateCommissionRecord(caller:HallServer.GetExchangeRevenueRecordMessageResponse):void{
        if(caller.retCode == 0){
            this._extracted_num.string = UStringHelper.getMoneyFormat(caller.hasGetMoney*ZJH_SCALE);
            if(caller.exchangeRevenueItem.length !== 0){
                this._scrollview.active = true;
                this._no_data.active = false;
                var content = UNodeHelper.find(this.contentNode,"scrollview/view/content");
                content.removeAllChildren();
                for(var i = 0; i < caller.exchangeRevenueItem.length;i++){
                    var item = cc.instantiate(this._item);
                    item.parent = content;
                    item.children[0].getComponent(cc.Label).string = caller.exchangeRevenueItem[i].strDateTime;
                    item.children[1].getComponent(cc.Label).string = caller.exchangeRevenueItem[i].orderId;
                    item.children[2].getComponent(cc.Label).string = (caller.exchangeRevenueItem[i].requestMoney/100) + "";
                    UEventHandler.addClick(item.children[1],this.node,"VProxyDetailItem","copyOrderNumber",item.children[1].getComponent(cc.Label).string);
                    if(caller.exchangeRevenueItem[i].status == 8){
                        item.children[3].getComponent(cc.Label).string = "审核中";
                        item.children[3].color = cc.color(70,170,35,255);
                        item.children[5].active = false;
                    }else if(caller.exchangeRevenueItem[i].status == 9){
                        item.children[3].getComponent(cc.Label).string = "已驳回";
                        item.children[3].color = cc.color(204,85,255,255);
                        item.children[5].active = true;
                    }else if(caller.exchangeRevenueItem[i].status == 18){
                        item.children[3].getComponent(cc.Label).string = "兑换成功";
                        item.children[3].color = cc.color(160,140,113,255);
                        item.children[5].active = false;
                    }else if(caller.exchangeRevenueItem[i].status == 20){
                        item.children[3].getComponent(cc.Label).string = "已拒绝";
                        item.children[3].color = cc.color(204,85,255,255);
                        item.children[5].active = true;
                    }else if(caller.exchangeRevenueItem[i].status == 30){
                        item.children[3].getComponent(cc.Label).string = "取消订单";
                        item.children[3].color = cc.color(160,140,113,255);
                        item.children[5].active = false;
                    }
                }
            }else{
                this._scrollview.active = false;
                this._no_data.active = true;
            }
        }else{

        }
    }

    private getHelp():void{
        super.playclick();
        AppGame.ins.showTips(ULanHelper.CONTACT_CUSTOMER_SERVICE);
    }

    private copyOrderNumber(event:TouchEvent,orderNum:string):void{
        super.playclick();
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked(orderNum);
    }

    private getTodayData():void{
        super.playclick();
        var startDay = curYear + "-" + curMonth + "-" + curDay;
        var endDay = curYear + "-" + curMonth + "-" + curDay;
        this._default_time.string = "今天";
        this._toggle_date.getComponent(cc.Toggle).isChecked = false;
        this._logo.spriteFrame = this.normal_img;
        this._menu.active = false;
        AppGame.ins.proxyModel.requestMyRevenueRecordDetail(startDay,endDay);
    }

    private getYesterdayData():void{
        super.playclick();
        var startDay = this.getDays(1);
        var endDay = this.getDays(1);
        this._default_time.string = "昨天";
        this._toggle_date.getComponent(cc.Toggle).isChecked = false;
        this._logo.spriteFrame = this.normal_img;
        this._menu.active = false;
        AppGame.ins.proxyModel.requestMyRevenueRecordDetail(startDay,endDay);
    }

    private getThreeDaysData():void{
        super.playclick();
        var startDay = this.getDays(2);
        var endDay = curYear + "-" + curMonth + "-" + curDay;
        this._default_time.string = "近三天";
        this._toggle_date.getComponent(cc.Toggle).isChecked = false;
        this._logo.spriteFrame = this.normal_img;
        this._menu.active = false;
        AppGame.ins.proxyModel.requestMyRevenueRecordDetail(startDay,endDay);
    }

    private getFiveDaysData():void{
        super.playclick();
        var startDay = this.getDays(4);
        var endDay = curYear + "-" + curMonth + "-" + curDay;
        this._default_time.string = "近五天";
        this._toggle_date.getComponent(cc.Toggle).isChecked = false;
        this._logo.spriteFrame = this.normal_img;
        this._menu.active = false;
        AppGame.ins.proxyModel.requestMyRevenueRecordDetail(startDay,endDay);
    }

    private getTenDaysData():void{
        super.playclick();
        var startDay = this.getDays(9);
        var endDay = curYear + "-" + curMonth + "-" + curDay;
        this._default_time.string = "近十天";
        this._toggle_date.getComponent(cc.Toggle).isChecked = false;
        this._logo.spriteFrame = this.normal_img;
        this._menu.active = false;
        AppGame.ins.proxyModel.requestMyRevenueRecordDetail(startDay,endDay);
    }

    private getTwentyDaysData():void{
        super.playclick();
        var startDay = this.getDays(19);
        var endDay = curYear + "-" + curMonth + "-" + curDay;
        this._default_time.string = "近二十天";
        this._toggle_date.getComponent(cc.Toggle).isChecked = false;
        this._logo.spriteFrame = this.normal_img;
        this._menu.active = false;
        AppGame.ins.proxyModel.requestMyRevenueRecordDetail(startDay,endDay);
    }

    private getOneMonthData():void{
        super.playclick();
        var startDay = this.getDays(29);
        var endDay = curYear + "-" + curMonth + "-" + curDay;
        this._default_time.string = "近三十天";
        this._toggle_date.getComponent(cc.Toggle).isChecked = false;
        this._logo.spriteFrame = this.normal_img;
        this._menu.active = false;
        AppGame.ins.proxyModel.requestMyRevenueRecordDetail(startDay,endDay);
    }

    private getTwoMonthData():void{
        super.playclick();
        var startDay = this.getDays(59);
        var endDay = curYear + "-" + curMonth + "-" + curDay;
        this._default_time.string = "近六十天";
        this._toggle_date.getComponent(cc.Toggle).isChecked = false;
        this._logo.spriteFrame = this.normal_img;
        this._menu.active = false;
        AppGame.ins.proxyModel.requestMyRevenueRecordDetail(startDay,endDay);
    }

}
