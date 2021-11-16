
export class MyInfo {
    name: string;
    id: number;
    url: string;
    frameId: number;
    headId: number;
   
}
export class UIProxyTGData{
    pid:number;
    level:number;
    rate:number;
    teamPlayerCount:number;
    myPlayerCount:number;
    todayNewPlayerCount:number;
    thisWeekNewPlayerCount:number;
    leftMoney:number;
    canGetMoney:number;
    hasGetMoney:number;
    todayRevenue:number;
    totalRevenue:number;
    todayMoney:number;
    spreadUrl:string;
    levelName:string
}

export class UIProxyMyAchievementData{
    myNewPlayerCount:number;
    myNewRevenue:number;
    teamNewPlayerCount:number;
    teamNewRevenue:number;
    totalProfit:number;
    devoteProfit:number;
    members: Array<UIProxyMyAchievementItem>;
}

export class UIProxyMyAchievementItem {
    strDate: string;
    achievementItem: number;
}

// export class UIProxyTeamData {
//     onlinePayer: number;
//     totalPlayer: number;
//     currentPage: number;
//     totalPage: number;
//     menbers: Array<UIProxyTeamItem>;
// }

export class UIProxyChargeData {
    allLeftGold: number;
    callCanGetGold: number;
}

export class UIProxyDetailItem {
    time: string;
    totalCharge: number;
    totalShuiShou: number;
    percent: number;
    charge: number;
}
export class UIProxyDetailData {
    frameId: number;
    headId: number;
    totalShouru: number;
    currentPage: number;
    totalPage: number;
    details: Array<UIProxyDetailItem>
}