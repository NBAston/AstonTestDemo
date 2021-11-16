import { ConfirmTipBoxType, ECommonUI, EExchareType } from "../../../../common/base/UAllenum";
import UResManager from "../../../../common/base/UResManager";
import UEventHandler from "../../../../common/utility/UEventHandler";
import UNodeHelper from "../../../../common/utility/UNodeHelper";
import UStringHelper from "../../../../common/utility/UStringHelper";
import cfg_avatar from "../../../../config/cfg_avatar";
import AppGame from "../../../base/AppGame";
import { ExchangeLimitMoneyInfoData, UserBindInfoData } from "../../charge/ChargeData";
import { EBtnType } from "../../lb_service_mail/MailServiceData";
import MRole, { CHARGE_SCALE } from "../../lobby/MRole";
import VExChange from "../VExchange";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VExchargeUsdt extends cc.Component {
    @property(cc.SpriteFrame)
    normalImg:cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    inputImg:cc.SpriteFrame = null;
    _no_bind_page: cc.Node = null; // 未绑定节点
    _had_bind_page: cc.Node = null; // 已绑定节点
    _exchange_page: cc.Node = null; // 已提交转账节点
    _bindAccountBtn: cc.Node = null;// 绑定账户节点
    _kefuBtn: cc.Node = null; // 客服节点
    
    _usdt_logo: cc.Sprite = null; // 图标
    _usdt_name: cc.Label = null; // 名字
    _usdt_number: cc.Label = null; // USDT号
    _cancel_bind_btn: cc.Node = null; // 取消绑定
    _user_gold: cc.Label = null; // 用户金币
    _lab_limit: cc.Label = null; // 限额
    _lab2_limit: cc.Label = null; // 兑换次数， 两次兑换的时间间隔
    _all_exchange_btn: cc.Node = null; // 全部兑换按钮
    _exchange_editbox: cc.EditBox = null; // 兑换金额EditBox
    _change_usdt_num: cc.Label = null;// usdt 个数
    _exchange_usdt_rate: cc.Label = null; // 实时汇率
    _reflesh_rate_btn: cc.Node = null; // 刷新
    _confirm_exchange_btn: cc.Node = null; // 确认兑换按钮
    _had_bind_kefu_btn: cc.Node = null; // 已绑定客服兑换
    _exchange_contact_kefu_btn: cc.Node = null; // 已转账 联系客服
    _manager: VExChange;
    _userBindInfo: UserBindInfoData;
    _exchangeLimitInfo: ExchangeLimitMoneyInfoData;
    _isShow:boolean = false;


    /**
     * @param index 索引
     * @param payType 支付类型
     * @param manager Vcharge
     */
    initItemInfo(index: number, offLineItem: any, manager: VExChange): void {
        this._bindAccountBtn = UNodeHelper.find(this.node, "no_bind_page/bind_count_btn");
        this._kefuBtn = UNodeHelper.find(this.node, "no_bind_page/kefu_withdraw_btn");
        this._usdt_logo = UNodeHelper.find(this.node, "had_bind_page/usdt_logo").getComponent(cc.Sprite);
        this._usdt_name = UNodeHelper.find(this.node, "had_bind_page/usdt_name").getComponent(cc.Label);
        this._usdt_number = UNodeHelper.find(this.node, "had_bind_page/usdt_number").getComponent(cc.Label);
        this._user_gold = UNodeHelper.find(this.node, "had_bind_page/current_gold").getComponent(cc.Label);
        this._cancel_bind_btn = UNodeHelper.find(this.node, "had_bind_page/cancel_bind_btn");
        this._exchange_editbox = UNodeHelper.find(this.node, "had_bind_page/exchange_editbox").getComponent(cc.EditBox);
        this._all_exchange_btn = UNodeHelper.find(this.node, "had_bind_page/btn_max");
        this._reflesh_rate_btn = UNodeHelper.find(this.node, "had_bind_page/reflesh_rate_btn");
        this._exchange_usdt_rate = UNodeHelper.find(this.node, "had_bind_page/exchange_usdt_rate").getComponent(cc.Label);
        this._change_usdt_num = UNodeHelper.find(this.node, "had_bind_page/change_usdt_num").getComponent(cc.Label);
        this._lab_limit = UNodeHelper.find(this.node, "had_bind_page/lab").getComponent(cc.Label);
        this._lab2_limit = UNodeHelper.find(this.node, "had_bind_page/lab2").getComponent(cc.Label);
        this._confirm_exchange_btn = UNodeHelper.find(this.node, "had_bind_page/confirm_exchange_btn");
        this._had_bind_kefu_btn = UNodeHelper.find(this.node, "had_bind_page/contact_kefu_btn");
        this._exchange_contact_kefu_btn = UNodeHelper.find(this.node, "exchange_page/contect_bg/contact_kefu_btn");
        //初始化usdt充值客服
        let serviceNum = AppGame.ins.exCharge_service_items.length;
        let randServiceItem = Math.floor(Math.random()*serviceNum+1)
        let randService:any = AppGame.ins.exCharge_service_items[randServiceItem -1];
        if(randService) {
            let serviceName = UNodeHelper.getComponent(this.node, "exchange_page/contect_bg/kefu_name", cc.Label);
            let icon = UNodeHelper.find(this.node, "exchange_page/contect_bg/kefu_icon");
            serviceName.string = (randService && randService.hasOwnProperty('nickname'))?randService.nickname:"";//randService.nickname;
            let reverUrl = UStringHelper.charAtReverse(randService.avatar);
            let url = cfg_avatar[parseInt(reverUrl[4])-1];
            UResManager.loadUrl(url,  icon.getComponent(cc.Sprite));
        }


        UEventHandler.addClick(this._bindAccountBtn, this.node, "VExchargeUsdt", "onclickBindAccountBtn");
        UEventHandler.addClick(this._kefuBtn, this.node, "VExchargeUsdt", "onclickKefuBtn");
        UEventHandler.addClick(this._cancel_bind_btn, this.node, "VExchargeUsdt", "onclickCancelBindBtn");
        UEventHandler.addClick(this._all_exchange_btn, this.node, "VExchargeUsdt", "onclickAllExchangeBtn");
        UEventHandler.addClick(this._confirm_exchange_btn, this.node, "VExchargeUsdt", "onclickConfirmExchangeBtn");
        UEventHandler.addClick(this._had_bind_kefu_btn, this.node, "VExchargeUsdt", "onclickKefuBtn");
        UEventHandler.addClick(this._exchange_contact_kefu_btn, this.node, "VExchargeUsdt", "onclickKefuBtn");
        UEventHandler.addClick(this._reflesh_rate_btn, this.node, "VExchargeUsdt", "refleshUsdtRate");


        this._no_bind_page = UNodeHelper.find(this.node, "no_bind_page");
        this._had_bind_page = UNodeHelper.find(this.node, "had_bind_page");
        this._exchange_page = UNodeHelper.find(this.node, "exchange_page");
        this._exchange_editbox.node.on("text-changed",this.setUsdtAmount,this)
        this._exchange_editbox.node.on('editing-did-began', this.editDidBegan, this);
        this._exchange_editbox.node.on('editing-did-ended', this.editDidEnded, this);  
        this._userBindInfo = AppGame.ins.roleModel.getBindInfoData();
        if(!UStringHelper.isEmptyString(this._userBindInfo.usdtAddress) ) { // 已绑定USDT
            this.setItemActive(false, true, false);
            this.refleshHadBindCardUI();
            AppGame.ins.roleModel.requestGetUsdtExchangeRate();
        } else {
            this.setItemActive(true, false, false);
        }
    }

   /**
     * 设置不同状态界面显示
     * @param isShow1 未绑定page节点
     * @param isShow2 已经绑定page节点
     * @param isShow3 已提交page节点
     */
    setItemActive(isShow1: boolean, isShow2: boolean, isShow3: boolean): void {
        this._no_bind_page.active = isShow1;
        this._had_bind_page.active = isShow2;
        this._exchange_page.active = isShow3;
    }

    // 绑定账户
    onclickBindAccountBtn(): void {
      // 弹框 绑定账户
      AppGame.ins.showUI(ECommonUI.EXCHANGE_BIND_USDT, 1);

    }
    editDidBegan(): void {
        this._exchange_editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.inputImg;
    }

    editDidEnded(): void {
        this._exchange_editbox.node.children[0].getComponent(cc.Sprite).spriteFrame = this.normalImg;
    }
    setUsdtAmount(): void {
        if(this._exchange_editbox.string == "") {
            this._exchange_editbox.string  = "";
            this._change_usdt_num.string = "0";
        } else {
            let money = parseFloat(this._exchange_editbox.string == ""?"0":this._exchange_editbox.string);
            let rate = parseFloat(this._exchange_usdt_rate.string);
            this._change_usdt_num.string = parseFloat((money/rate)+"").toFixed(3).slice(0,-1);
        }
    }


    // 取消绑定
    onclickCancelBindBtn(): void {
        // 弹框 
        AppGame.ins.showUI(ECommonUI.EXCHANGE_CANCEL_BIND_BOX, EExchareType.usdt);
    }

    // 全部兑换
    onclickAllExchangeBtn(): void {
        this._exchange_editbox.string = parseInt(this._user_gold.string) + "";
        this.setUsdtAmount();
    }

    // 确认兑换
    onclickConfirmExchangeBtn(): void {
        if(this.checkMoney()) {
            // 弹出确认框提示确认
            let data = {"ConfirmExchangeType":ConfirmTipBoxType.ConfirmExchangeType,"money":this._exchange_editbox.string, "usdtAmount":this._change_usdt_num.string};
            AppGame.ins.showUI(ECommonUI.CHARGE_CONFIRM_BOX, data);
        }
    }

    checkMoney(): boolean {
        if(UStringHelper.isEmptyString(this._exchange_editbox.string)) {
            AppGame.ins.showTips("请输入兑换金额"); 
            return false;
        }
        if(!UStringHelper.isInt(this._exchange_editbox.string)) {
            AppGame.ins.showTips("兑换金额请输入正整数"); 
            return false;
        }
        return true;
    }

    // 客服兑换
    onclickKefuBtn(): void {
        AppGame.ins.showUI(ECommonUI.LB_Service_Mail,{ type: EBtnType.service, data:{service_type:2}  });
    }

    // 刷新绑USDT界面
    refleshHadBindCardUI(): void {
        this._userBindInfo = AppGame.ins.roleModel.getBindInfoData();
        // this._usdt_name.string = this._userBindInfo.bankCardName;
        this._exchangeLimitInfo = AppGame.ins.roleModel.getExchangeLimitMoneyInfoData();
        if(this._exchangeLimitInfo.exchangeMinMoneyAlipay != 0) { // 如果为0 则请求 数据
            this._lab_limit.string = "账号需保留"+this._exchangeLimitInfo.exchangeMinLeftMoney * CHARGE_SCALE+"金币，" + "兑换额度" + (this._exchangeLimitInfo.exchangeMinMoneyUsdt * CHARGE_SCALE) +"~"+(this._exchangeLimitInfo.exchangeMaxMoneyUsdt * CHARGE_SCALE);
            this._lab2_limit.string = "每天最多兑换"+this._exchangeLimitInfo.exchangeTimesOneDay +"笔，"+"两次提交兑换订单时间间隔至少"+this._exchangeLimitInfo.exchangeInterval+"分钟";
            this.update_score(AppGame.ins.roleModel.getRoleGold());
        } else {
            AppGame.ins.roleModel.requestExchangeScoreToRMBLimitMessage();
        }
        this._usdt_number.string = UStringHelper.replaceStringFristEndNum(this._userBindInfo.usdtAddress, 4);
        this._exchange_usdt_rate.string = this._userBindInfo.exchangeRate + "";
        this.update_score(AppGame.ins.roleModel.getRoleGold());
    }

    // 刷新USDT费率
    refleshUsdtRate(): void {
        AppGame.ins.roleModel.requestGetUsdtExchangeRate();
    }

    // 清空输入
    clearExchangeInput(): void {
        this._exchange_editbox.string = "";
        this._change_usdt_num.string = "0";
    }

    // 更新USDT费率消息监听
    private update_usdt_rate(isSuccess: boolean, usdeRate: number, errMsg: string) {
        if(isSuccess) {
            if(this._isShow) {
                AppGame.ins.showTips("刷新成功");
            }
            this._isShow = true;
            this._exchange_usdt_rate.string = usdeRate+"";
        } else {
            AppGame.ins.showTips("刷新失败，请重新再试");
        }
    }

    // 监听确认更换绑卡弹框的消息
    private confirm_cancel_bindcard(isSuccess: boolean) {
        if(isSuccess) {
            // 更换绑定
            AppGame.ins.showUI(ECommonUI.EXCHANGE_BIND_USDT, 2);
        }
    }

    // 监听确认兑换弹框
    private confirm_exchange(isSuccess: boolean) {
        if(isSuccess) {
            // 发起兑换请求
            AppGame.ins.roleModel.requesetExchange(parseFloat(this._exchange_editbox.string), EExchareType.usdt);

        }
    }

    // 监听绑USDT之后的消息
    private bind_usdt_address(isSuccess: boolean, errMsg: string) {
        AppGame.ins.showTips(errMsg);
        if(isSuccess) {
            AppGame.ins.closeUI(ECommonUI.EXCHANGE_BIND_USDT);
            this.refleshHadBindCardUI();
            this.setItemActive(false, true, false);
        }
    }

    // 兑换之后的监听
    private exchange_score(resMsg: string, isSuccess: boolean) { 
        AppGame.ins.showTips(resMsg);
        if(isSuccess) {
            this.setItemActive(false, false, true);
        }
        AppGame.ins.closeUI(ECommonUI.CHARGE_CONFIRM_BOX);
        this.clearExchangeInput();
    }

    // 刷新金币
    private update_score(score: number): void {
        let finalScore = (score - this._exchangeLimitInfo.exchangeMinLeftMoney) <= 0 ? 0 : (score - this._exchangeLimitInfo.exchangeMinLeftMoney);
        this._user_gold.string = (finalScore * CHARGE_SCALE).toFixed(2).slice(0,-3);
    }

    // 获取兑换金币限额监听
    private exchange_scoreto_rmb_limit(isSuccess: boolean, errMsg: string) {
        if(isSuccess) {
            this._exchangeLimitInfo = AppGame.ins.roleModel.getExchangeLimitMoneyInfoData();
            this._lab_limit.string = "账号需保留"+this._exchangeLimitInfo.exchangeMinLeftMoney * CHARGE_SCALE+"金币，" + "兑换额度" + (this._exchangeLimitInfo.exchangeMinMoneyUsdt * CHARGE_SCALE) +"~"+(this._exchangeLimitInfo.exchangeMaxMoneyUsdt * CHARGE_SCALE)+"元";
            this._lab2_limit.string = "每天最多兑换"+this._exchangeLimitInfo.exchangeTimesOneDay +"笔，"+"两次提交兑换订单时间间隔至少"+this._exchangeLimitInfo.exchangeInterval+"分钟";
            this.update_score(AppGame.ins.roleModel.getRoleGold());
        }
}
    protected onEnable(): void {
        AppGame.ins.roleModel.on(MRole.BIND_USDT_ADDRESS, this.bind_usdt_address, this);
        AppGame.ins.roleModel.on(MRole.UPDATA_SCORE, this.update_score, this);
        AppGame.ins.roleModel.on(MRole.COMFIRM_CANCEL_BINDCARD, this.confirm_cancel_bindcard, this);
        AppGame.ins.roleModel.on(MRole.CONFIRM_EXCHANGE, this.confirm_exchange, this);
        AppGame.ins.roleModel.on(MRole.EXCHANGE_SOCRE, this.exchange_score, this);
        AppGame.ins.roleModel.on(MRole.UPDATE_USDT_RATE, this.update_usdt_rate, this);
        AppGame.ins.roleModel.on(MRole.EXCHANGE_SCORETO_RMB_LIMIT, this.exchange_scoreto_rmb_limit, this);   
    }

    protected onDisable(): void {
        this._isShow = false;
        AppGame.ins.roleModel.off(MRole.BIND_USDT_ADDRESS, this.bind_usdt_address, this);
        AppGame.ins.roleModel.off(MRole.UPDATA_SCORE, this.update_score, this);
        AppGame.ins.roleModel.off(MRole.COMFIRM_CANCEL_BINDCARD, this.confirm_cancel_bindcard, this);
        AppGame.ins.roleModel.off(MRole.CONFIRM_EXCHANGE, this.confirm_exchange, this);
        AppGame.ins.roleModel.off(MRole.EXCHANGE_SOCRE, this.exchange_score, this);
        AppGame.ins.roleModel.off(MRole.UPDATE_USDT_RATE, this.update_usdt_rate, this);
        AppGame.ins.roleModel.off(MRole.EXCHANGE_SCORETO_RMB_LIMIT, this.exchange_scoreto_rmb_limit, this);
    }

}
