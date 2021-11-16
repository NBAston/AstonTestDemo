import { ClubHallServer } from "../../../../common/cmd/proto";

export class MClubMsg {
    /**
     * @description 我的俱乐部
     * @param caller 
     * @returns 
     */
    static refMyClubHallRes(caller: ClubHallServer.GetMyClubHallMessageResponse): ClubHallServer.GetMyClubHallMessageResponse {
        caller.retCode = 0;
        caller.errorMsg = "您还没有加入俱乐部";
        caller.todayProfit = 123456;
        caller.allowDrawScore = 100000;
        let arr = [];
        for (let i = 0; i < 3; i++) {
            let clubHallServer = new ClubHallServer.ClubHallInfo();
            clubHallServer.clubId = i < 2 ? 123 * (i + 1) : caller.userId;
            clubHallServer.clubName = `aa${i}`;
            clubHallServer.promoterId = 34 * (i + 1);
            clubHallServer.clubIconId = 1;
            clubHallServer.invitationCode = i == 0 ? 0 : 12345678;
            clubHallServer.clubPlayerNum = 56 * (i + 1);
            clubHallServer.rate = i == 0 ? 0 : 10 * i;
            clubHallServer.autoBCPartnerRate = i == 0 ? -1 : 10 * (i - 1);
            clubHallServer.url = i == 0 ? "" : `aaa${i}`;
            clubHallServer.createTime = `2021-12-${i + 1}`;
            arr.push(clubHallServer);;
        };
        caller.clubInfos = arr;
        return caller;
    };

    /**
     * @description 加入俱乐部
     */
    static joinClubRes(caller: ClubHallServer.JoinTheClubMessageResponse): ClubHallServer.JoinTheClubMessageResponse {
        caller.retCode = 0;
        let clubHallServer = new ClubHallServer.ClubHallInfo();
        clubHallServer.clubId = 123456;
        clubHallServer.clubName = "jdfljalk";
        clubHallServer.promoterId = 44564;
        clubHallServer.clubIconId = 2;
        clubHallServer.invitationCode = 12345678;
        clubHallServer.clubPlayerNum = 56;
        clubHallServer.rate = 0;
        clubHallServer.autoBCPartnerRate = -1;
        clubHallServer.url = "jjk;k;lkl";
        clubHallServer.createTime = `2021-12-1`;
        caller.clubInfo = clubHallServer;
        return caller;
    };

    /**
     * @description 设置自动和后人返回
     * @param caller 
     * @returns 
     */
    static setAutoBecomePartnerRes(caller: ClubHallServer.SetAutoBecomePartnerMessageResponse): ClubHallServer.SetAutoBecomePartnerMessageResponse {
        caller.autoBCPartnerRate = 20;
        return caller;
    };

    /**
     * @description 提取佣金
     * @param caller 
     */
    static exchanegeMyRevenueClub(caller: ClubHallServer.ExchangeRevenueMessageResponse): ClubHallServer.ExchangeRevenueMessageResponse {
        caller.retCode = 0;
        caller.leftScore = 20;
        caller.score = 30;
        return caller;
    };

    /**
     * @description 我的业绩放回
     * @param caller 
     * @returns 
     */
    static getMyClubAchievementRes(caller: ClubHallServer.GetMyAchievementMessageResponse): ClubHallServer.GetMyAchievementMessageResponse {
        caller.errorMsg = "暂无数据";
        caller.retCode = 0;

        let _AchievementItem = new ClubHallServer.AchievementItem();
        _AchievementItem.newDirPlayerCount = 10;
        _AchievementItem.newDirFlowAmount = 10000;
        _AchievementItem.newDirProfit = 131564;
        _AchievementItem.teamProfit = 10;
        _AchievementItem.myTeamProfit = 10;
        _AchievementItem.newTeamFlowAmount = 1000
        caller.thisWeek = _AchievementItem;

        let _DayAchievementItem = new ClubHallServer.DayAchievementItem();
        _DayAchievementItem.strDate = "2021-12-11";
        _DayAchievementItem.achievementItem = _AchievementItem;

        caller.dayAchievementItems.push(_DayAchievementItem);
        caller.dayAchievementItems.push(_DayAchievementItem);

        return caller;
    };

    // /**
    //  * @description 佣金记录
    //  * @param caller 
    //  * @returns 
    //  */
    // static getExchangeRevenueRecord(caller: ClubHallServer.GetExchangeRevenueRecordMessageResponse): ClubHallServer.GetExchangeRevenueRecordMessageResponse {
    //     caller.errorMsg = "暂无数据";
    //     caller.retCode = 0;
    //     caller.hasGetMoney = 100;
    //     caller.startDate = "2021-7-10";
    //     caller.endDate = "2017-7-30";
    //     let _ExchangeRevenueItem = new ClubHallServer.ExchangeRevenueItem();
    //     _ExchangeRevenueItem.strDateTime = "2021-7-17";
    //     _ExchangeRevenueItem.orderId = "444444444";
    //     _ExchangeRevenueItem.requestMoney = 2000;
    //     _ExchangeRevenueItem.status = 10;
    //     caller.exchangeRevenueItem.push(_ExchangeRevenueItem);
    //     return caller;
    // };
};

//返回领取结果.
// message ExchangeRevenueMessageResponse
// {
//     required Game.Common.Header     header = 1;  			// 头信息.
//     required int32                  retCode = 2;			// 错误代码
//     required string                 errorMsg = 3;                    // 错误描述.

//     required int64                  userId = 4;			// 玩家ID.
//     required int32                  type = 5;                    // 兑换类型
//     required int64                  exchangeScore = 6;                    // 提取佣金金额
//     required int64                  leftScore = 7;                    // 剩下佣金金额
//     required int64                  score = 8;                    // 游戏账户金币
// }
