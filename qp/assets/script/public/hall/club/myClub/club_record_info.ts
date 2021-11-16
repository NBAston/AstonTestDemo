// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import UAudioManager from "../../../../common/base/UAudioManager";
import { ClubHallServer } from "../../../../common/cmd/proto";
import { UAPIHelper } from "../../../../common/utility/UAPIHelper";
import UDateHelper from "../../../../common/utility/UDateHelper";
import UEventHandler from "../../../../common/utility/UEventHandler";
import ULanHelper from "../../../../common/utility/ULanHelper";
import UStringHelper from "../../../../common/utility/UStringHelper";
import AppGame from "../../../base/AppGame";
import { ZJH_SCALE } from "../../lobby/VHall";
import MClub from "./MClub";

const {ccclass, property} = cc._decorator;

@ccclass
export default class club_record_info extends cc.Component {

    @property(cc.Label)
    extracted_num: cc.Label = null;

    @property(cc.Toggle)
    toggle: cc.Toggle = null;

    @property(cc.Node)
    item: cc.Node = null;

    @property(cc.Node)
    no_data: cc.Node = null;

    @property(cc.Label)
    toggle_label: cc.Label = null;

    @property(cc.Sprite)
    toggle_arrow: cc.Sprite = null;

    @property(cc.SpriteFrame)
    arrow_up: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    arrow_down: cc.SpriteFrame = null;

    @property(cc.Node)
    content:cc.Node = null;

    private lastEndTime:string;
    private startTime:string;
    private endTime:string;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.lastEndTime = "";
        this.startTime = "" ;
        this.endTime = "" ;
    }

    start () {

    }

    private resetUI(){
        this.toggle.isChecked = false;
        this.toggle_label.string = '全部时间';
        this.content.removeAllChildren();
        let no_data = cc.instantiate(this.no_data);
        no_data.parent = this.content;
        this.startTime = "" ;
        this.endTime = "" ;
    }

    private clickToggle():void{
        if(this.toggle.isChecked){
            this.toggle_arrow.spriteFrame = this.arrow_up;
        }else{
            this.toggle_arrow.spriteFrame = this.arrow_down;
        }
    }

    private toggleClick(event, customEventData): void {
        UAudioManager.ins.playSound("audio_click");
        this.toggle.isChecked = false;
        this.toggle_arrow.spriteFrame = this.arrow_down;
        switch (customEventData) {

            case 'alltime':
                    this.toggle_label.string = "全部时间";
                    this.startTime = "" 
                    this.endTime = "" 
                break;

            case 'today':
                    this.toggle_label.string = "今天";
                    this.startTime = UDateHelper.format(new Date(), "yyyy-MM-dd")
                    this.endTime = UDateHelper.format(new Date(), "yyyy-MM-dd")
                break;

            case 'yesterday':
                    this.toggle_label.string = "昨天";
                    this.startTime = this.getDays(1);
                    this.endTime = this.getDays(1);
                break;

            case 'seven_days':
                    this.toggle_label.string = "七天以内";
                    this.endTime= UDateHelper.format(new Date(), "yyyy-MM-dd")
                    this.startTime = this.getDays(6)
                break;

            case 'fifteen_days':
                    this.toggle_label.string = "十五天以内";
                    this.endTime= UDateHelper.format(new Date(), "yyyy-MM-dd")
                    this.startTime = this.getDays(14)
                break;
            case 'thirty_days':
                    this.toggle_label.string = "三十天以内";
                    this.endTime = UDateHelper.format(new Date(), "yyyy-MM-dd")
                    this.startTime = this.getDays(29)
                break;
            default:
                break;
        }
        //刷新记录
        this.refreshRecord()
    }

    
    //重新查询数据
    refreshRecord(){
        //重置之前数据
        this.content.removeAllChildren()
        //发求请求
        AppGame.ins.myClubModel.requestClubCommissionRecord(this.startTime,this.endTime);
    }

    private getMyClubRevenueRecord(caller:ClubHallServer.GetExchangeRevenueRecordMessageResponse):void{
        this.extracted_num.string = UStringHelper.format(caller.hasGetMoney * ZJH_SCALE + "");
        if(caller.exchangeRevenueItem.length == 0){
            this.content.removeAllChildren();
            let no_data = cc.instantiate(this.no_data);
            no_data.parent = this.content;
        }else{
            this.content.removeAllChildren();
            for(let index = 0;index < caller.exchangeRevenueItem.length;index++){
                let item = cc.instantiate(this.item);
                item.parent = this.content;
                item.getChildByName("time").getComponent(cc.Label).string = caller.exchangeRevenueItem[index].strDateTime;
                item.getChildByName("order_num").getComponent(cc.Label).string = caller.exchangeRevenueItem[index].orderId;
                let data = caller.exchangeRevenueItem[index].orderId;
                UEventHandler.addClick(item.getChildByName("order_num"),this.node,"club_record_info","copySucess",{data});
                item.getChildByName("commission").getComponent(cc.Label).string = UStringHelper.format(caller.exchangeRevenueItem[index].requestMoney * ZJH_SCALE + "") ;
                item.getChildByName("status").getComponent(cc.Label).string = this.getStatus(caller.exchangeRevenueItem[index].status);
            }
        }
    }


    //获得前N天的时间字符串
    getDays(n:number):string{
        // var now = new Date();
        var now = new Date(new Date().getTime() + (new Date().getTimezoneOffset() / 60 + 8) * 3600 * 1000);
        var date = new Date( now.getTime() - n*24*3600*1000 );
        var year = date.getFullYear();
        var month = date.getMonth()+1 > 9 ? date.getMonth()+1 : "0" + (date.getMonth() + 1);
        var day = date.getDate() > 9 ? date.getDate() : "0" + date.getDate();
        var result = year + "-" + month + "-" + day;

        return result
    }

    getStatus(n:number):string{
        let a = "";
        if(n == 8){
            a = "审核中";
        }else if(n == 9){
            a = "已驳回"
        }else if(n == 18){
            a = "兑换成功"
        }else if(n == 20){
            a = "已拒绝"
        }else if(n == 30){
            a = "取消订单"
        }
        return a
    }

    private copySucess(e,a):void{
        AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        UAPIHelper.onCopyClicked(a.data);
    }

    protected onEnable():void{
        this.resetUI();
        AppGame.ins.myClubModel.requestClubCommissionRecord(this.startTime,this.endTime);
        AppGame.ins.myClubModel.on(MClub.UPDATE_CLUB_REVENUE_RECORD, this.getMyClubRevenueRecord, this);
    }

    protected onDisable():void{
        AppGame.ins.myClubModel.off(MClub.UPDATE_CLUB_REVENUE_RECORD, this.getMyClubRevenueRecord, this);
    }

    clickClose(){
        UAudioManager.ins.playSound("audio_click");
        this.toggle.isChecked = false;
        this.toggle_arrow.spriteFrame = this.arrow_down;
    }

    showTips(){
        
    }
    // update (dt) {}
}
