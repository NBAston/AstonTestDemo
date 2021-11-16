import { ECommonUI } from "../../../common/base/UAllenum";
import UAudioManager from "../../../common/base/UAudioManager";
import { HallServer } from "../../../common/cmd/proto";
import { EventManager } from "../../../common/utility/EventManager";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import cfg_event from "../../../config/cfg_event";
import AppGame from "../../base/AppGame";
import MLogin from "../../login/MLogin";
import { EBtnType } from "../lb_service_mail/MailServiceData";
import MRole from "../lobby/MRole";
import { ZJH_SCALE } from "../lobby/VHall";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VRegister_reward extends cc.Component {

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    }

    start () {

    }

    show(activityId: number) {
        this.requestActivity(activityId);
    }

    initView(data: HallServer.GetActivityListMessageResponse) {

        /**
         *  required int32                  bBindMobile      = 2;                // 是否绑定手机 正式注册
            required int32                  bBindBankAccount = 3;                // 是否绑定支付账户
            required int64                  rechargeAmount   = 4;                // 充值金额
            required int64                  allBet           = 5;                // 有效投注
         */
        let isRegester = AppGame.ins.roleModel.bindMobile;
        let isBindAli = (AppGame.ins.roleModel.alipayAccount == (null||undefined || "")) && (data.registerActivity.bBindBankAccount == 0 ) ? false :true; 
        let registgerLb = UNodeHelper.getComponent(this.node, "dialog_box_bg_1/register_lb_1", cc.Label);
        let bindLb = UNodeHelper.getComponent(this.node, "dialog_box_bg_2/register_lb_1", cc.Label);
        let rechargeAmount = UNodeHelper.getComponent(this.node,"dialog_box_bg_3/register_lb_1",cc.Label);
        let betAmount = UNodeHelper.getComponent(this.node,"dialog_box_bg_4/register_lb_1",cc.Label);
        registgerLb.string = isRegester ? "已注册" : "未注册";
        registgerLb.node.color = isRegester ? cc.color(0,128,0,255) : cc.color(255,0,0,255);
        bindLb.string = isBindAli ? "已绑定" : "未绑定";
        bindLb.node.color = isBindAli ? cc.color(0,128,0,255) : cc.color(255,0,0,255);
        rechargeAmount.string = (data.registerActivity.rechargeAmount*ZJH_SCALE).toFixed(2) + "/500";
        betAmount.string = (data.registerActivity.allBet*ZJH_SCALE).toFixed(2) + "/5880";

        let btn_goto = UNodeHelper.find(this.node, "dialog_box_bg_1/btn_goto");
        let btn_getted = UNodeHelper.find(this.node, "dialog_box_bg_1/btn_getted");
        btn_goto.active = !isRegester;
        btn_getted.active = isRegester;
        let btn_goto1 = UNodeHelper.find(this.node,  "dialog_box_bg_2/btn_goto");
        let btn_getted1 = UNodeHelper.find(this.node, "dialog_box_bg_2/btn_getted");
        btn_goto1.active = !isBindAli;
        btn_getted1.active = isBindAli;
        let btn_goto2 = UNodeHelper.find(this.node,  "dialog_box_bg_3/btn_goto");
        let btn_getted2 = UNodeHelper.find(this.node, "dialog_box_bg_3/btn_getted");
        if(data.registerActivity.rechargeAmount*ZJH_SCALE > 500){
            btn_goto2.active = false;
            btn_getted2.active = true;
            rechargeAmount.string = "500/500"
            rechargeAmount.node.color = cc.color(0,128,0,255);
        }else{
            btn_goto2.active = true;
            btn_getted2.active = false;
            rechargeAmount.node.color = cc.color(255,0,0,255);
        }

        let btn_goto3 = UNodeHelper.find(this.node,  "dialog_box_bg_4/btn_goto");
        let btn_getted3 = UNodeHelper.find(this.node, "dialog_box_bg_4/btn_getted");
        if(data.registerActivity.allBet*ZJH_SCALE > 5880){
            btn_goto3.active = false;
            btn_getted3.active = true;
            betAmount.string = "5880/5880";
            betAmount.node.color = cc.color(0,128,0,255);
        }else{
            btn_goto3.active = true;
            btn_getted3.active = false;
            betAmount.node.color = cc.color(255,0,0,255);
        }

    }


    goToRegister() {
        UAudioManager.ins.playSound("audio_click");
        // AppGame.ins.closeUI(ECommonUI.LB_ACTIVITY);
        AppGame.ins.showUI(ECommonUI.LB_Regester);
    }

    goToBindAli() {
        UAudioManager.ins.playSound("audio_click");
        // AppGame.ins.closeUI(ECommonUI.LB_ACTIVITY);
        AppGame.ins.showUI(ECommonUI.EXCHANGE_BIND_ALIPAY, 1);
    }

    goToDeposit() {
        UAudioManager.ins.playSound("audio_click");
        // AppGame.ins.closeUI(ECommonUI.LB_ACTIVITY);
        AppGame.ins.showUI(ECommonUI.LB_Charge, { isFullScreen: true, index: 1 });
    }

    goToBet() {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.closeUI(ECommonUI.LB_ACTIVITY);
    }

    goToCustum() {
        UAudioManager.ins.playSound("audio_click");
        // AppGame.ins.closeUI(ECommonUI.LB_ACTIVITY);
        AppGame.ins.showUI(ECommonUI.LB_Service_Mail,{ type: EBtnType.service, data:{service_type:3}  });
    }

    getActivityData(eventName: string, data: HallServer.GetActivityListMessageResponse) {
        AppGame.ins.showConnect(false);
        this.initView(data);
    }

    // 监听绑卡之后的消息
    private bind_bank_card_message_res(isSuccess: boolean, errMsg: string) {
        if(isSuccess) {
            AppGame.ins.showTips("绑定支付宝成功");
            AppGame.ins.closeUI(ECommonUI.EXCHANGE_BIND_ALIPAY);
            let bindLb = UNodeHelper.getComponent(this.node, "dialog_box_bg_2/register_lb_1", cc.Label);
            bindLb.string =  "已绑定";
            bindLb.node.color = cc.color(0,128,0,255);
            let btn_goto1 = UNodeHelper.find(this.node,  "dialog_box_bg_2/btn_goto");
            let btn_getted1 = UNodeHelper.find(this.node, "dialog_box_bg_2/btn_getted");
            btn_goto1.active = false;
            btn_getted1.active = true;
        } else {
            AppGame.ins.showTips(errMsg);
        }
    }

    private update_account(isSuccess: boolean, errMsg: string):void{
        if(isSuccess){
            AppGame.ins.closeUI(ECommonUI.LB_Regester);
            let registgerLb = UNodeHelper.getComponent(this.node, "dialog_box_bg_1/register_lb_1", cc.Label);
            registgerLb.string = "已注册";
            registgerLb.node.color = cc.color(0,128,0,255);
            
            let btn_goto = UNodeHelper.find(this.node, "dialog_box_bg_1/btn_goto");
            let btn_getted = UNodeHelper.find(this.node, "dialog_box_bg_1/btn_getted");
            btn_goto.active = false;
            btn_getted.active = true;
        }else{
            AppGame.ins.showTips(errMsg);
        }
    }

    private bind_bank_card():void{
        let bindLb = UNodeHelper.getComponent(this.node, "dialog_box_bg_2/register_lb_1", cc.Label);
            bindLb.string =  "已绑定";
            bindLb.node.color = cc.color(0,128,0,255);
            let btn_goto1 = UNodeHelper.find(this.node,  "dialog_box_bg_2/btn_goto");
            let btn_getted1 = UNodeHelper.find(this.node, "dialog_box_bg_2/btn_getted");
            btn_goto1.active = false;
            btn_getted1.active = true;
    }

    onEnable() {
        AppGame.ins.LoginModel.on(MLogin.BIND_MOBILE, this.update_account, this);
        AppGame.ins.roleModel.on(MRole.BIND_BANK, this.bind_bank_card, this);
        AppGame.ins.roleModel.on(MRole.BIND_ALIPAY, this.bind_bank_card_message_res, this);
        EventManager.getInstance().addEventListener(cfg_event.ACTIVITY_LIST, this.getActivityData, this);
    }

    onDisable() {
        AppGame.ins.LoginModel.off(MLogin.BIND_MOBILE, this.update_account, this);
        AppGame.ins.roleModel.on(MRole.BIND_BANK, this.bind_bank_card, this);
        AppGame.ins.roleModel.off(MRole.BIND_ALIPAY, this.bind_bank_card_message_res, this);
        EventManager.getInstance().removeEventListener(cfg_event.ACTIVITY_LIST, this.getActivityData, this);
        this.node.getChildByName("dialog_box_bg_1").getChildByName("register_lb_1").getComponent(cc.Label).string = "未注册";
        this.node.getChildByName("dialog_box_bg_1").getChildByName("register_lb_1").color = cc.color(255,0,0,255);
        this.node.getChildByName("dialog_box_bg_2").getChildByName("register_lb_1").getComponent(cc.Label).string = "未绑定";
        this.node.getChildByName("dialog_box_bg_2").getChildByName("register_lb_1").color = cc.color(255,0,0,255);
        this.node.getChildByName("dialog_box_bg_3").getChildByName("register_lb_1").getComponent(cc.Label).string = "0/0";
        this.node.getChildByName("dialog_box_bg_3").getChildByName("register_lb_1").color = cc.color(255,0,0,255);
        this.node.getChildByName("dialog_box_bg_4").getChildByName("register_lb_1").getComponent(cc.Label).string = "0/0";
        this.node.getChildByName("dialog_box_bg_4").getChildByName("register_lb_1").color = cc.color(255,0,0,255);
    }



    requestActivity(activityId: number) {
        AppGame.ins.showConnect(true);
        AppGame.ins.activityModel.sendActivityList(activityId);
    }
    // update (dt) {}
}
