import Model from "../../../common/base/Model";
import { UIProxyTGData, UIProxyChargeData, UIProxyDetailData, UIProxyDetailItem, MyInfo, UIProxyMyAchievementData } from "./ProxyData";
import AppGame from "../../base/AppGame";
import { UNIT } from "../../../game/zjh/MZJH";
import UMsgCenter from "../../../common/net/UMsgCenter";
import UHandler from "../../../common/utility/UHandler";
import { HallServer, Game } from "../../../common/cmd/proto";
import UPlatformHelper, { PlateformInfo } from "../../login/UPlatformHelper";
import ULanHelper from "../../../common/utility/ULanHelper";
import UDebug from "../../../common/utility/UDebug";


export default class MProxy extends Model {

    static ON_SPREAD_INFO = "ON_SPREAD_INFO";
    static UPDATE_GETGOLD = "UPDATE_GETGOLD";
    static ON_GETGOLD = "ON_GETGOLD";
    static Exchange_Revenue = "Exchange_Revenue"
    static UPDATE_TGINFO = "UPDATE_TGINFO";
    static UPDATE_MY_ACHIEVEMENT = "UPDATE_MY_ACHIEVEMENT";
    static UPDATE_MY_ACHIEVEMENT_DETAIL = "UPDATE_MY_ACHIEVEMENT_DETAIL";
    static UPDATE_COMMISSION_DETAIL = "UPDATE_COMMISSION_DETAIL";
    static UPDATE_MY_TEAM = "UPDATE_MY_TEAM";
    static CHANGE_COMMISSION = "CHANGE_COMMISSION";
    static REFRESH_QRCODE = "REFRESH_QRCODE";
    static BECOME_PROMOTE = "BECOME_PROMOTE";
    private _proxyDetails: Array<UIProxyDetailItem>;
    /**
     * 我的推广
     **/
    private _mySpreadInfo_pid: number = 0;
    private _level: number = 0;
    private _level_name: string = "";
    private _mySpreadInfo_rate: number = 0;
    private _mySpreadInfo_teamPlayerCount: number = 0;
    private _mySpreadInfo_myPlayerCount: number = 0;
    private _mySpreadInfo_todayNewPlayerCount: number = 0;
    private _mySpreadInfo_thisWeekNewPlayerCount: number = 0;
    private _mySpreadInfo_canGetMoney: number = 0;
    private _mySpreadInfo_hasGetMoney: number = 0;
    private _todayMoney: number = 0;
    private _leftMoney: number = 0;
    private _mySpreadInfo_spreadUrl: string = "";

    set mySpreadInfo_spreadUrl(url: string) {
        this._mySpreadInfo_spreadUrl = url;
    }
    /**
     * 我的队伍当前总玩家
     */
    private _totalPlayer: number = -1;
    /**
     * 当前余额
     */
    private _allleftCanGetGold: number = -1;
    /**
     * 可领取额度
     */
    private _allLeftGold: number = -1;
    /**
     * 佣金总收入
     */
    private _totoalShouru: number = -1;


    init(): void {

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PROMOTER_LEVEL_MESSAGE_RES,
            new UHandler(this.get_promoter_level_message_res, this));


        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_SPREAD_INFO_RES,
            new UHandler(this.get_my_spread_message_res, this));


        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_EXCHANGE_MY_REVENUE_RES,
            new UHandler(this.exchanege_my_revenue_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BECOME_PROMOTER_MESSAGE_RES,
            new UHandler(this.become_promoter_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_ACHIEVEMENT_RES,
            new UHandler(this.get_my_achievement_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_ACHIEVEMENT_DETAIL_RES,
            new UHandler(this.get_my_achievement_detail_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_EXCHANGE_REVENUE_RECORD_RES,
            new UHandler(this.get_commission_detail_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_TEAM_RES,
            new UHandler(this.get_my_team_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_SUBORDINATE_RATE_RES,
            new UHandler(this.change_commission_res, this));

        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_REFRESH_SPREAD_URL_RES,
            new UHandler(this.refresh_qr_code_res, this));

    }

    resetData(): void {
        this._mySpreadInfo_pid = -1;
        this._level = -1;
        this._mySpreadInfo_rate = -1;
        this._mySpreadInfo_teamPlayerCount = -1;
        this._mySpreadInfo_myPlayerCount = -1;
        this._mySpreadInfo_todayNewPlayerCount = -1;
        this._mySpreadInfo_thisWeekNewPlayerCount = -1;
        this._mySpreadInfo_canGetMoney = -1;
        this._mySpreadInfo_hasGetMoney = -1;
        this._todayMoney = -1;
        this._leftMoney = -1;
        this._mySpreadInfo_spreadUrl = "";
        this._level_name = "";
    }

    update(dt: number): void {

    }

    /**
     * 返佣比例
     */
    private get_promoter_level_message_res(caller: HallServer.GetPromoterLevelMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MProxy.Exchange_Revenue, caller)
        } else {
            UDebug.Log(caller.errorMsg);
        }
    }

    /**
     * 我的推广
     */
    private get_my_spread_message_res(caller: HallServer.GetMySpreadInfoMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this._mySpreadInfo_pid = caller.mySpreadInfo.pid;
            this._mySpreadInfo_rate = caller.mySpreadInfo.rate;
            this._level = caller.mySpreadInfo.level;
            this._mySpreadInfo_teamPlayerCount = caller.mySpreadInfo.teamPlayerCount;
            this._mySpreadInfo_myPlayerCount = caller.mySpreadInfo.myPlayerCount;
            this._mySpreadInfo_todayNewPlayerCount = caller.mySpreadInfo.todayNewPlayerCount;
            this._mySpreadInfo_thisWeekNewPlayerCount = caller.mySpreadInfo.thisWeekNewPlayerCount;
            this._mySpreadInfo_canGetMoney = caller.mySpreadInfo.canGetMoney;
            this._mySpreadInfo_hasGetMoney = caller.mySpreadInfo.hasGetMoney;
            this._mySpreadInfo_spreadUrl = caller.mySpreadInfo.spreadUrl;
            this._todayMoney = caller.mySpreadInfo.todayMoney;
            this._level_name = caller.mySpreadInfo.levelName;
            this._leftMoney = caller.mySpreadInfo.leftMoney;
            this.emit(MProxy.UPDATE_TGINFO, true, "");
        } else if (caller.retCode == 1) {
            this.emit(MProxy.UPDATE_TGINFO, false, caller.errorMsg);
        }
    }

    /**
     * 我的佣金
     */
    private exchanege_my_revenue_res(caller: HallServer.ExchangeRevenueMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MProxy.UPDATE_GETGOLD, caller);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
            UDebug.Log(caller.errorMsg);
        }
    }

    /**
     * 成为代理
     */
    private become_promoter_res(caller: HallServer.BecomePromoterMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MProxy.BECOME_PROMOTE, true, caller);
        } else {
            UDebug.Log(caller.errorMsg);
            this.emit(MProxy.BECOME_PROMOTE, false, caller.errorMsg);
            // AppGame.ins.showTips(caller.errorMsg);
            AppGame.ins.showTips("网络异常，请稍后重试！");
        }
    }

    /**
     * 我的业绩
     */
    private get_my_achievement_res(caller: HallServer.GetMyAchievementMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MProxy.UPDATE_MY_ACHIEVEMENT, caller);
        } else {
            UDebug.Log(caller.errorMsg);
        }
    }

    /**
     * 我的业绩详情
     */
    private get_my_achievement_detail_res(caller: HallServer.GetAchievementDetailMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MProxy.UPDATE_MY_ACHIEVEMENT_DETAIL, caller);
        } else {
            this.emit(MProxy.UPDATE_MY_ACHIEVEMENT_DETAIL, caller);
            UDebug.Log(caller.errorMsg);
        }
    }

    /**
     * 佣金记录
     */
    private get_commission_detail_res(caller: HallServer.GetExchangeRevenueRecordMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MProxy.UPDATE_COMMISSION_DETAIL, caller);
        } else {
            UDebug.Log(caller.errorMsg);
        }
    }

    /**
     * 团队成员
     */
    private get_my_team_res(caller: HallServer.GetMyTeamMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MProxy.UPDATE_MY_TEAM, caller);
        } else {
            UDebug.Log(caller.errorMsg);
        }
    }

    /**
     * 修改佣金比例
     */
    private change_commission_res(caller: HallServer.SetSubordinateRateMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MProxy.CHANGE_COMMISSION, caller);
            AppGame.ins.showTips(ULanHelper.CHANGE_COMMISSION_SUCCESS);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
            UDebug.Log(caller.errorMsg);
        }
    }

    /**
     * 刷新二维码
     */
    private refresh_qr_code_res(caller: HallServer.RefreshSpreadURLMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MProxy.REFRESH_QRCODE, caller);

            // AppGame.ins.showTips(ULanHelper.CHANGE_COMMISSION_SUCCESS);
        } else {
            AppGame.ins.showTips("网络异常，请稍后重试");
            // AppGame.ins.showTips(ULanHelper.CHANGE_COMMISSION_FAIL);
            UDebug.Log(caller.errorMsg);
        }
    }


    /**
     * 请求代理
     * @param force 
     */

    /**
     * 请求代理级别信息
     */
    requestPromoterLevel(): boolean {
        AppGame.ins.showConnect(true);
        var data = new HallServer.GetPromoterLevelMessage();
        data.userId = AppGame.ins.roleModel.useId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_PROMOTER_LEVEL_MESSAGE_REQ, data);
        return true;
    }

    /**
     * 请求我的推广信息
     */
    requestMySpreadInfo(): boolean {
        // AppGame.ins.showConnect(true);
        var data = new HallServer.GetMySpreadInfoMessage();
        data.userId = AppGame.ins.roleModel.useId;
        data.channelId = 1;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_SPREAD_INFO_REQ, data);
        return true;
    }

    /**
     * 佣金兑换金币
     */
    exchanegeMyRevenue(input) {
        AppGame.ins.showConnect(true);
        var data = new HallServer.ExchangeRevenueMessage();
        data.userId = AppGame.ins.roleModel.useId;
        data.type = 3;
        data.exchangeScore = parseInt(input);
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_EXCHANGE_MY_REVENUE_REQ, data);
        return true
    }

    /**
     * 请求成为代理
     */
    requestBeAgent() {
        AppGame.ins.showConnect(true);
        var data = new HallServer.BecomePromoterMessage();
        data.userId = AppGame.ins.roleModel.useId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_BECOME_PROMOTER_MESSAGE_REQ, data);
        return true
    }

    /**
     * 请求我的业绩
     */
    requestMyAchievement() {
        AppGame.ins.showConnect(true);
        var data = new HallServer.GetMyAchievementMessage();
        data.userId = AppGame.ins.roleModel.useId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_ACHIEVEMENT_REQ, data);
        return true
    }

    /**
     * 请求我的业绩详情
     */
    requestMyAchievementDetail(pid, type, searchId, startDate, endDate) {
        AppGame.ins.showConnect(true);
        var data = new HallServer.GetAchievementDetailMessage();
        data.userId = AppGame.ins.roleModel.useId;
        data.pid = pid;
        data.type = type;
        data.searchId = searchId;
        data.startDate = startDate;
        data.endDate = endDate;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_ACHIEVEMENT_DETAIL_REQ, data);
        return true
    }

    /**
     * 请求我的佣金提取记录
     */
    requestMyRevenueRecordDetail(startDate: string, endDate: string) {
        AppGame.ins.showConnect(true);
        var data = new HallServer.GetExchangeRevenueRecordMessage();
        data.userId = AppGame.ins.roleModel.useId;
        data.startDate = startDate;
        data.endDate = endDate;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_EXCHANGE_REVENUE_RECORD_REQ, data);
        return true
    }

    /**
     * 请求我的团队信息
     */
    requestMyTeamDetail(id: number) {
        AppGame.ins.showConnect(true);
        var data = new HallServer.GetMyTeamMessage();
        data.userId = AppGame.ins.roleModel.useId;
        data.searchPromoterId = id;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_GET_MY_TEAM_REQ, data);
        return true
    }

    /**
     * 请求修改返佣比例
     */
    requestChangeCommission(promoterId: number, setRate: number) {
        AppGame.ins.showConnect(true);
        var data = new HallServer.SetSubordinateRateMessage();
        data.userId = AppGame.ins.roleModel.useId;
        data.promoterId = promoterId;
        data.setRate = setRate;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_SET_SUBORDINATE_RATE_REQ, data);
        return true
    }

    /**
     * 请求刷新二维码
     */
    requestQRcode() {
        AppGame.ins.showConnect(true);
        var data = new HallServer.SetSubordinateRateMessage();
        data.userId = AppGame.ins.roleModel.useId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_REFRESH_SPREAD_URL_REQ, data);
        return true
    }

    /**
     * 获取推广界面个人数据
     */
    getMyInfo(): MyInfo {
        // AppGame.ins.showConnect(true);
        var dt = new MyInfo();
        dt.id = AppGame.ins.roleModel.useId;
        dt.headId = AppGame.ins.roleModel.headId;
        dt.frameId = AppGame.ins.roleModel.headboxId;
        dt.name = AppGame.ins.roleModel.nickName;
        dt.url = AppGame.ins.roleModel.spreadUrl;
        return dt;
    }

    /**
     * 获取推广界面数据
     */
    geTUIProxyTGData(): UIProxyTGData {
        // AppGame.ins.showConnect(true);
        var dt = new UIProxyTGData();
        dt.pid = this._mySpreadInfo_pid;
        dt.level = this._level;
        dt.rate = this._mySpreadInfo_rate;
        dt.teamPlayerCount = this._mySpreadInfo_teamPlayerCount;
        dt.myPlayerCount = this._mySpreadInfo_myPlayerCount;
        dt.todayNewPlayerCount = this._mySpreadInfo_todayNewPlayerCount;
        dt.thisWeekNewPlayerCount = this._mySpreadInfo_thisWeekNewPlayerCount;
        dt.canGetMoney = this._mySpreadInfo_canGetMoney;
        dt.hasGetMoney = this._mySpreadInfo_hasGetMoney;
        dt.todayMoney = this._todayMoney;
        dt.leftMoney = this._leftMoney;
        dt.spreadUrl = this._mySpreadInfo_spreadUrl;
        dt.levelName = this._level_name;
        return dt
    }

}
