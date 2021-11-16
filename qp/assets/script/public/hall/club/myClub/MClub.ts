import Model from "../../../../common/base/Model";
import { ECommonUI } from "../../../../common/base/UAllenum";
import { ClubGameServer, ClubHallServer, Game, HallServer } from "../../../../common/cmd/proto";
import UMsgCenter from "../../../../common/net/UMsgCenter";
import UDebug from "../../../../common/utility/UDebug";
import UHandler from "../../../../common/utility/UHandler";
import ULanHelper from "../../../../common/utility/ULanHelper";
import AppGame from "../../../base/AppGame";
import { MyInfo } from "../../proxy/ProxyData";
import { MClubMsg } from "./MClubMsg";


export default class MClub extends Model {

    static UPDATE_MYCLUB = "UPDATE_MYCLUB"; //请求我的俱乐部信息
    static UPDATE_GETGOLD_CLUB = "UODATE_GETGOLD_CLUB"; //确认提现
    static JOIN_CLUB = "JOIN_CLUB"; //加入俱乐部
    static CLUB_REF_QRCODE = "CLUB_REF_QRCODE"; //刷新二维码
    static UPDATE_CLUB_MY_ACHIEVEMENT = "UPDATE_CLUB_MY_ACHIEVEMENT"; //我的俱乐部业绩
    static UPDATE_CLUB_MY_PERF_DETAIL = "UPDATE_CLUB_MY_PERF_DETAIL"; //我的业绩详情
    static AUTO_BCPARTNER_RATE = "AUTO_BCPARTNER_RATE";//自动合伙人
    static EXIT_CLUB = "EXIT_CLUB";//退出俱乐部
    static UPDATE_CLUB_REVENUE_RECORD = "UPDATE_CLUB_REVENUE_RECORD";//佣金提取记录结果
    static UPDATE_CLUB_TEAM = "UPDATE_CLUB_TEAM";// 返回我的团队成员
    static UPDATE_SUBORDINATE_RATE = "UPDATE_SUBORDINATE_RATE";//返回设置下一级合伙人提成比例
    static MY_CLUB_FIRE_MEMBER = "MY_CLUB_FIRE_MEMBER";// 开除此用户 
    static MY_CLUB_GET_MY_CLUB = "MY_CLUB_GET_MY_CLUB";// 返回俱乐部内我的俱乐部
    static BECOME_PARTNER = "BECOME_PARTNER";// 成为合伙人
    static Get_All_Play_Record = "Get_All_Play_Record";//获取俱乐部投注记录
    static REF_GLOBAL_MATCH_STATIC = "refGlobalMatchStatic"; //刷新全局匹配得状态

    //我的俱乐部信息
    public static myClubMessgeRes: ClubHallServer.GetMyClubHallMessageResponse = null;

    init(): void {

        //请求我的俱乐部返回
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_HALL_MESSAGE_RES,
            new UHandler(this.getMyClubHallRes, this));

        //加入俱乐部返回    
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_JOIN_THE_CLUB_MESSAGE_RES,
            new UHandler(this.joinClubRes, this));

        //设置是否开启自动成为合伙人
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_EXIT_THE_CLUB_MESSAGE_RES,
            new UHandler(this.exitClubRes, this));

        //设置是否开启自动成为合伙人
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_SET_AUTO_BECOME_PARTNER_MESSAGE_RES,
            new UHandler(this.setAutoBecomePartnerRes, this));

        //俱乐部佣金转化金币返回    
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_EXCHANGE_MY_REVENUE_RES,
            new UHandler(this.exchanegeMyRevenueClubRes, this));

        //请求刷新二维码返回
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_REFRESH_SPREAD_URL_RES,
            new UHandler(this.refreshCodeRes, this));
        //------------------------------
        //请求我的俱乐部业绩返回        
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_ACHIEVEMENT_RES,
            new UHandler(this.getMyClubAchievementRes, this));

        //返回会员业绩详情结果
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_ACHIEVEMENT_DETAIL_MEMBER_RES,
            new UHandler(this.getMyClubDetatlMemberRes, this));

        //返回合伙人业绩详情结果
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_ACHIEVEMENT_DETAIL_PARTNER_RES,
            new UHandler(this.getMyClubDetatlPartnerRes, this));

        //返回佣金提取记录结果
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_EXCHANGE_MY_REVENUE_RECORD_RES,
            new UHandler(this.getMyClubRevenueRecord, this));

        //返回我的团队成员
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_TEAM_RES,
            new UHandler(this.getMyClubTeam, this));

        //返回设置下一级合伙人提成比例
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_SET_SUBORDINATE_RATE_RES,
            new UHandler(this.getSubordinateRate, this));

        //开除此用户
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_FIRE_MEMBER_RES,
            new UHandler(this.fireMember, this));

        //返回俱乐部内我的俱乐部
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_RES,
            new UHandler(this.getMyClub, this));

        //成为合伙人
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_BECOME_PARTNER_MESSAGE_RES,
            new UHandler(this.becomePartner, this));

        //俱乐部投注记录
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_ALL_PLAY_RECORD_RES,
            new UHandler(this.getAllPlayRecord, this));

        //设置我的俱乐部 全局匹配 
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_SET_MY_CLUB_GLOBAL_MATCH_MESSAGE_RES,
            new UHandler(this.respSetMyClubGlobalMatchMessage, this));
        //设置我的俱乐部 全局匹配 
        UMsgCenter.ins.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_GLOBAL_MATCH_MESSAGE_RES,
            new UHandler(this.respGetMyClubGlobalMatch, this));
    }

    resetData(): void {

    }

    update(dt: number): void {

    }

    /**
     * @description 设置本地俱乐部数据 
     * @param isAdd  是否添加俱乐部  true添加 false 删除
     */
    setClubInfos(clubInfo: ClubHallServer.IClubHallInfo, isAdd: boolean) {

        if (isAdd) {
            MClub.myClubMessgeRes = MClub.myClubMessgeRes ? MClub.myClubMessgeRes : new ClubHallServer.GetMyClubHallMessageResponse();
            MClub.myClubMessgeRes.clubInfos.push(clubInfo);
        } else {
            let clubInfos = MClub.myClubMessgeRes.clubInfos;
            for (let i = 0; i < clubInfos.length; i++) {
                let clubId = clubInfo.clubId;
                let clubId1 = clubInfos[i].clubId;
                if (clubId1 == clubId) {
                    clubInfos.splice(i, 1);
                };
            };
        };
    };

    /**
     * @description  根据俱乐部id 刷新俱乐部
     * @param clubId  俱乐部信息id
     * @param propertys 属性列表
     */
    refClubInfo(clubId: number, propertys: {}) {
        let clubInfos = MClub.myClubMessgeRes.clubInfos;
        for (let i = 0; i < clubInfos.length; i++) {
            let clubId1 = clubInfos[i].clubId;
            if (clubId1 == clubId) {
                Object.assign(clubInfos[i], propertys);
                break;
            };
        };
    };

    /**
     * @description  根据俱乐部id  获得俱乐部信息
     * @param clubId 俱乐部id
     * @returns 
     */
    static getClubInfoByClubId(clubId: number): ClubHallServer.IClubHallInfo {
        let clubInfos = MClub.myClubMessgeRes.clubInfos;
        let clubInfo: ClubHallServer.IClubHallInfo = null;
        for (let i = 0; i < clubInfos.length; i++) {
            let clubId1 = clubInfos[i].clubId;
            if (clubId1 == clubId) {
                clubInfo = clubInfos[i];
                break;
            };
        };
        return clubInfo;
    };

    /**
     * @description  得到我是否加入俱乐部 和是否是合伙人盟主
     * @returns  number  0没有加入俱乐部 , 1加入俱乐部但是普通会员  ，2是合伙人或者盟主
     */
    static getMyClubsStatus(): number {
        let clubInfos = MClub.myClubMessgeRes.clubInfos;
        let myInfo = AppGame.ins.myClubModel.getMyInfo();
        if (clubInfos.length > 0) {
            for (let i = 0; i < clubInfos.length; i++) {
                let clubInfo = clubInfos[i];
                if (clubInfo.status != 1 || myInfo.id == clubInfo.clubId) {
                    return 2;
                };
            }
            return 1;
        } else {
            return 0;
        };
    };

    /**
     * @description 得到盟主俱乐部信息
     */
    static getLeaderClubMsg(): ClubHallServer.IClubHallInfo {
        let clubInfos = MClub.myClubMessgeRes.clubInfos;
        let myInfo = AppGame.ins.myClubModel.getMyInfo();
        for (let i = 0; i < clubInfos.length; i++) {
            let clubInfo = clubInfos[i];
            if (clubInfo.status != 1 && myInfo.id == clubInfo.clubId) {
                return clubInfo;
            };
        };
    };

    /**
     * 获取俱乐部界面个人数据
     */
    getMyInfo(): MyInfo {
        var dt = new MyInfo();
        dt.id = AppGame.ins.roleModel.useId;
        dt.headId = AppGame.ins.roleModel.headId;
        dt.frameId = AppGame.ins.roleModel.headboxId;
        dt.name = AppGame.ins.roleModel.nickName;
        dt.url = AppGame.ins.roleModel.spreadUrl;
        return dt;
    }


    /**
    * 请求我的俱乐部信息
    */
    requestMyClubInfo(): boolean {
        // this.emit(MClub.UPDATE_MYCLUB, true, "");
        AppGame.ins.showConnect(true);
        var data = new ClubHallServer.GetMyClubHallMessage();

        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_HALL_MESSAGE_REQ, data);
        return true;
    }


    /**
     * 我的俱乐部信息返回
     */
    private getMyClubHallRes(caller: ClubHallServer.GetMyClubHallMessageResponse): void {
        cc.log("我的俱乐部信息返回:", caller)
        AppGame.ins.showConnect(false);
        let clubInfos = caller.clubInfos;
        MClub.myClubMessgeRes = null;
        MClub.myClubMessgeRes = caller;
        if (caller.retCode == 0 && clubInfos.length > 0) {
            this.emit(MClub.UPDATE_MYCLUB, true, "");
        } else if (caller.retCode == 1 || clubInfos.length < 1) {
            this.emit(MClub.UPDATE_MYCLUB, false, caller.errorMsg);
        }
    };

    /**
     * 佣金兑换金币
     */
    exchanegeMyRevenueClub(input: number) {
        AppGame.ins.showConnect(true);
        var data = new ClubHallServer.ExchangeRevenueMessage();
        data.userId = AppGame.ins.roleModel.useId;
        data.type = 3;
        data.exchangeScore = input;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_EXCHANGE_MY_REVENUE_REQ, data);
        return true
    };

    /**
     * 兑换佣金返回
     */
    private exchanegeMyRevenueClubRes(caller: ClubHallServer.ExchangeRevenueMessageResponse): void {
        cc.log("兑换佣金返回:", caller)
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            MClub.myClubMessgeRes.allowDrawScore = caller.leftScore;
            this.emit(MClub.UPDATE_GETGOLD_CLUB, caller);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
            UDebug.Log(caller.errorMsg);
        }
    };

    /**
     * 请求加入俱乐部
     * @param code 邀请码  
     */
    requestJoinClub(code: number) {
        AppGame.ins.showConnect(true);
        var data = new ClubHallServer.JoinTheClubMessage();
        data.invitationCode = code;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_JOIN_THE_CLUB_MESSAGE_REQ, data);
        return true
    }

    /**
     * @description 加入俱乐部返回
     */
    joinClubRes(caller: ClubHallServer.JoinTheClubMessageResponse): void {
        cc.log("加入俱乐部返回:", caller)
        AppGame.ins.showConnect(false);
        // caller = MClubMsg.joinClubRes(caller);
        if (caller.retCode == 0) {
            this.setClubInfos(caller.clubInfo, true);
            this.emit(MClub.JOIN_CLUB, caller);
            // this.requestMyClubInfo();
            AppGame.ins.clubHallModel.requestMyClub(false, true);
            AppGame.ins.showTips("你成功加入俱乐部");
            AppGame.ins.closeUI(ECommonUI.CLUB_HALL_JOIN);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    };

    /**
     * @description 设置是否开启自动成为合伙人
     * @param clubId  俱乐部 id 
     * @param autoBCPartnerRate 分成比例
     * @returns 
     */
    setAutoBecomePartner(clubId: number, autoBCPartnerRate: number) {
        AppGame.ins.showConnect(true);
        var data = new ClubHallServer.SetAutoBecomePartnerMessage();
        data.clubId = clubId;
        data.autoBCPartnerRate = autoBCPartnerRate;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_SET_AUTO_BECOME_PARTNER_MESSAGE_REQ, data);
        return true
    };

    /**
     * @description  设置是否开启自动成为合伙人返回
     * @param caller 
     */
    setAutoBecomePartnerRes(caller: ClubHallServer.SetAutoBecomePartnerMessageResponse) {
        AppGame.ins.showConnect(false);
        cc.log("设置是否开启自动成为合伙人返回:", caller);
        // caller = MClubMsg.setAutoBecomePartnerRes(caller);
        if (caller.retCode == 0) {
            this.refClubInfo(caller.clubId, { autoBCPartnerRate: caller.autoBCPartnerRate });
            this.emit(MClub.AUTO_BCPARTNER_RATE, caller);
            AppGame.ins.showTips(caller.autoBCPartnerRate == 0 ? "关闭自动升级合伙人" : "开启自动升级合伙人");
        } else {
            AppGame.ins.showTips(caller.errorMsg);
            UDebug.Log(caller.errorMsg);
        }
    };

    /**
     * @description  推出俱乐部
     * @param clubId 俱乐部id
     */
    requestExitClub(clubId: number) {
        AppGame.ins.showConnect(true);
        var data = new ClubHallServer.ExitTheClubMessage();
        data.clubId = clubId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_EXIT_THE_CLUB_MESSAGE_REQ, data);
        return true
    };

    /**
     * @description  推出俱乐部返回
     * @param caller 
     */
    exitClubRes(caller: ClubHallServer.ExitTheClubMessageResponse) {
        AppGame.ins.showConnect(false);
        cc.log("推出俱乐部返回:", caller);
        if (caller.retCode == 0) {
            let clubId = caller.clubId;
            let clubInfo = MClub.getClubInfoByClubId(clubId);
            this.emit(MClub.EXIT_CLUB, caller);
            AppGame.ins.clubHallModel.requestMyClub(false, true);
            this.setClubInfos(clubInfo, false);
            AppGame.ins.showTips("已成功退出俱乐部");
        } else {
            AppGame.ins.showTips(caller.errorMsg);
            UDebug.Log(caller.errorMsg);
        }
    };

    /**
     * 请求刷新二维码
     * @param
     */
    private _refQRCodeClubId: number = 0;
    requestClubQRcode(clucbId: number) {
        this._refQRCodeClubId = clucbId;
        AppGame.ins.showConnect(true);
        var data = new HallServer.RefreshSpreadURLMessage();
        data.userId = AppGame.ins.roleModel.useId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL,
            Game.Common.MESSAGE_CLIENT_TO_HALL_SUBID.CLIENT_TO_HALL_REFRESH_SPREAD_URL_REQ, data);
        return true
    };

    /**
     * 刷新二维码
     */
    private refreshCodeRes(caller: HallServer.RefreshSpreadURLMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (!this._refQRCodeClubId) return;
        if (caller.retCode == 0) {
            this.refClubInfo(this._refQRCodeClubId, { url: caller.spreadUrl });
            this.emit(MClub.CLUB_REF_QRCODE, caller);

        } else {
            AppGame.ins.showTips(caller.errorMsg);
            UDebug.Log(caller.errorMsg);
        };
        this._refQRCodeClubId = 0;
    };



    //----------------------我的俱乐部业绩
    /**
     * 请求我的业绩
     */
    requestClubMyAchievement() {
        AppGame.ins.showConnect(true);
        var data = new ClubHallServer.GetMyAchievementMessage();
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_ACHIEVEMENT_REQ, data);
        return true
    };

    /**
     * 我的业绩返回
     */
    private getMyClubAchievementRes(caller: ClubHallServer.GetMyAchievementMessageResponse): void {
        AppGame.ins.showConnect(false);

        if (caller.retCode == 0) {
            this.emit(MClub.UPDATE_CLUB_MY_ACHIEVEMENT, caller);
        } else {
            UDebug.Log(caller.errorMsg);
        }
    };

    /**
     * 请求我的俱乐部业绩详情
     * @param viewType 0 是会员  1 是合伙人
    */
    requestClubMyPerDetail(pid, type, searchId, startDate, endDate, viewType) {
        AppGame.ins.showConnect(true);
        let data = null;
        if (viewType == "0") {
            data = new ClubHallServer.GetAchievementDetailMemberMessage();
        } else {
            data = new ClubHallServer.GetAchievementDetailPartnerMessage();
            data.userId = AppGame.ins.roleModel.useId;
        };


        data.pid = pid;
        data.type = type;
        data.searchId = searchId;
        data.startDate = startDate;
        data.endDate = endDate;

        let subId = viewType == 0 ? "CLIENT_TO_HALL_CLUB_GET_MY_ACHIEVEMENT_DETAIL_MEMBER_REQ" : "CLIENT_TO_HALL_CLUB_GET_MY_ACHIEVEMENT_DETAIL_PARTNER_REQ";
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID[subId], data);
        return true
    };

    /**
     * 返回会员业绩详情结果
     */
    private getMyClubDetatlMemberRes(caller: ClubHallServer.GetAchievementDetailMemberMessageResponse): void {
        cc.log("返回会员业绩详情结果", caller);
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MClub.UPDATE_CLUB_MY_PERF_DETAIL, caller);
        } else {
            this.emit(MClub.UPDATE_CLUB_MY_PERF_DETAIL, caller);
            UDebug.Log(caller.errorMsg);
        }
    };

    /**
     * 返回合伙人业绩详情结果
     */
    private getMyClubDetatlPartnerRes(caller: ClubHallServer.GetAchievementDetailPartnerMessageResponse): void {
        cc.log("返回合伙人业绩详情结果", caller);
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MClub.UPDATE_CLUB_MY_PERF_DETAIL, caller);
        } else {
            this.emit(MClub.UPDATE_CLUB_MY_PERF_DETAIL, caller);
            UDebug.Log(caller.errorMsg);
        }
    };


    //----------------------我的俱乐部佣金记录
    /**
     * 请求佣金记录
     */
    requestClubCommissionRecord(startDate, endDate) {
        AppGame.ins.showConnect(true);
        var data = new ClubHallServer.GetExchangeRevenueRecordMessage();
        data.userId = AppGame.ins.roleModel.useId;
        data.startDate = startDate;
        data.endDate = endDate;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_EXCHANGE_MY_REVENUE_RECORD_REQ, data);
        return true
    };


    /**
     * 返回佣金提取记录结果
     */
    private getMyClubRevenueRecord(caller: ClubHallServer.GetExchangeRevenueRecordMessageResponse): void {
        AppGame.ins.showConnect(false);
        // caller = MClubMsg.getExchangeRevenueRecord(caller);
        if (caller.retCode == 0) {
            this.emit(MClub.UPDATE_CLUB_REVENUE_RECORD, caller);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }


    //----------------------我的俱乐部我的成员
    /**
     * 请求我的成员
     */
    requestClubMyTeam(clubId, type, searchPromoterId) {
        AppGame.ins.showConnect(true);
        var data = new ClubHallServer.GetMyTeamMessage();
        // data.userId = AppGame.ins.roleModel.useId;
        data.clubId = clubId;
        data.type = type;
        data.searchPromoterId = searchPromoterId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_TEAM_REQ, data);
        return true
    };

    //返回我的团队成员
    private getMyClubTeam(caller: ClubHallServer.GetMyTeamMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MClub.UPDATE_CLUB_TEAM, caller);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }

    // 设置下一级合伙人提成比例 
    requestSetSubordinateRate(clubId, promoterId, setRate) {
        AppGame.ins.showConnect(true);
        var data = new ClubHallServer.SetSubordinateRateMessage();
        data.clubId = clubId;
        data.promoterId = promoterId;
        data.setRate = setRate;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_SET_SUBORDINATE_RATE_REQ, data);
        return true
    };

    //返回设置下一级合伙人提成比例
    private getSubordinateRate(caller: ClubHallServer.SetSubordinateRateMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MClub.UPDATE_SUBORDINATE_RATE, caller);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }

    //请求开除此用户
    requestFireMember(clubId, promoterId, userId) {
        AppGame.ins.showConnect(true);
        var data = new ClubHallServer.FireMemberMessage();
        data.clubId = clubId;
        data.promoterId = promoterId;
        data.userId = userId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_FIRE_MEMBER_REQ, data);
        return true
    }

    //开除此用户
    private fireMember(caller: ClubHallServer.FireMemberMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MClub.MY_CLUB_FIRE_MEMBER, caller);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }

    // 获取俱乐部内我的俱乐部
    requestGetMyClub() {
        AppGame.ins.showConnect(true);
        var data = new ClubHallServer.GetMyClubMessage();
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_REQ, data);
        return true
    }

    //返回俱乐部内我的俱乐部
    private getMyClub(caller: ClubHallServer.GetMyClubMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MClub.MY_CLUB_GET_MY_CLUB, caller);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }

    // 成为合伙人
    requestBecomePartner(clubId, memberId, rate) {
        AppGame.ins.showConnect(true);
        var data = new ClubHallServer.BecomePartnerMessage();
        data.clubId = clubId;
        data.memberId = memberId;
        data.rate = rate;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_BECOME_PARTNER_MESSAGE_REQ, data);
        return true
    }

    //成为合伙人
    private becomePartner(caller: ClubHallServer.BecomePartnerMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MClub.BECOME_PARTNER, caller);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }


    //----------------------我的俱乐部投注记录
    /**
     * 请求投注记录
     */

    requestGetAllPlayRecordMessage(startDate, endDate, clubId, gameId, lastGameEndTime) {
        AppGame.ins.showConnect(true);
        var data = new ClubHallServer.GetAllPlayRecordMessage();
        data.startDate = startDate;
        data.endDate = endDate;
        data.clubId = clubId;
        data.gameId = gameId;
        data.lastGameEndTime = lastGameEndTime;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_ALL_PLAY_RECORD_REQ, data);
        return true
    }

    private getAllPlayRecord(caller: ClubHallServer.GetAllPlayRecordMessageResponse): void {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MClub.Get_All_Play_Record, caller);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
        }
    }


    /**
     * @description 盟主设置是否全局匹配
     * @param isNum  //0-不全局匹配 1-全局匹配\
     */
    requestSetMyClubGlobalMatchMessage(isNum: number) {
        AppGame.ins.showConnect(true);
        let clubId = MClub.getLeaderClubMsg().clubId;
        let data = new ClubHallServer.SetMyClubGlobalMatchMessage();
        data.globalMatch = isNum;
        data.clubId = clubId;
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_SET_MY_CLUB_GLOBAL_MATCH_MESSAGE_REQ, data);
    };

    //设置我的俱乐部 全局匹配  返回
    respSetMyClubGlobalMatchMessage(caller: ClubHallServer.SetMyClubGlobalMatchMessageResponse) {
        AppGame.ins.showConnect(false);
        cc.log("设置我的俱乐部 全局匹配  返回", caller);
        if (caller.retCode == 0) {
            let globalMatch = caller.globalMatch;
            this.emit(MClub.REF_GLOBAL_MATCH_STATIC, globalMatch);
            let tips1 = "全局模式已关闭，现在你的会员只能在俱乐部内部进行匹配。";
            let tips2 = "全局模式已开启，现在你的会员可以和其他俱乐部进行匹配。";
            AppGame.ins.showTips(globalMatch ? tips2 : tips1);
            AppGame.ins.clubHallModel.requestMyClub(false, true);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
            this.emit(MClub.REF_GLOBAL_MATCH_STATIC, -2);
        }
    };

    /**
     * @description  获取我的俱乐部 全局匹配
     */
    requestGetMyClubGlobalMatch() {
        AppGame.ins.showConnect(true);
        let data = new ClubHallServer.GetMyClubGlobalMatchMessage();
        UMsgCenter.ins.sendPkg(0,
            Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB,
            Game.Common.MESSAGE_CLIENT_TO_HALL_CLUB_SUBID.CLIENT_TO_HALL_CLUB_GET_MY_CLUB_GLOBAL_MATCH_MESSAGE_REQ, data);
    };

    /**
     * @description 获取我的俱乐部 全局匹配返回
     */
    respGetMyClubGlobalMatch(caller: ClubHallServer.GetMyClubGlobalMatchMessageResponse) {
        AppGame.ins.showConnect(false);
        if (caller.retCode == 0) {
            this.emit(MClub.REF_GLOBAL_MATCH_STATIC, caller.globalMatch);
        } else {
            AppGame.ins.showTips(caller.errorMsg);
            this.emit(MClub.REF_GLOBAL_MATCH_STATIC, -2);
        }

    };

}
