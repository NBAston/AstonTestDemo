export enum EUSER_STATUS {
    sGetOut = 0,		// 离开.
    sFree = 1,		// 空闲.
    sStop = 2,
    sSit = 3,		// 坐下.
    sReady = 4,		// 就绪.
    sPlaying = 5,		// 正在游戏.
    sOffLine = 6,		// 离线。
    sLookOn = 7,		// 旁观.
    sGetOutAtPlaying = 8,		// 游戏中离开.
}

/**游戏记录 */
export class GameRecordsItem {
    gameNo: string = "";
    roomtypeid: number = 0;
    winlosescore: number = 0;
    gameendtime: any = 0;
}
export class GameRecords {
    canRequest: boolean = true;
    records: Array<GameRecordsItem>;
}
/**
 * 房间信息
 */
export class RoomInfo {
    gameId: number = 0;
    /**房间类型 初 中 高 房间 */
    roomId: number = 0;
    /** 类型名称  初 中 高*/
    roomName: string = "";
    /**桌子数量 有几桌游戏在开启 */
    tableCount: number = 0;
    /** 底注*/
    floorScore: number = 0;
    /** 顶注 */
    ceilScore: number = 0;
    /** 进游戏需要的最低分*/
    enterMinScore: number = 0;
    /** 进游戏最大分*/
    enterMaxScore: number = 0;
    /** 最少数量玩家在房间里面*/
    minPlayerNum: number = 0;
    /** 最大*/
    maxPlayerNum: number = 0;
    /**-1:关停 0:暂未开放 1：正常开启  2：敬 */
    status: number = 0;
    maxJettonScore: number = 0;
    jettons: Array<number> = [];
    online: number = 0;
    /* 0:普通房 1：好友房  2：俱乐部 */
    roomKind:number = 0 
}

/**
 * 房间信息
 */
 export class RoomInfoHy {
    jettons: Array<number> = [];
    /**创建房间的Id */
    userGameKindId: string = '';
    /**房间号码 */
    roomId: number = 0;
    /**游戏Id */
    gameId: number = 0;
    /**游戏名称 */
    gameName: string = '';
    /**底分 */
    floorScore: number = 0;
    /**顶注 -1没有顶注 诈金花需要此字段 */
    ceilScore: number = 0;
    /**房主Id */
    roomUserId: number = 0;
    /**开始最少人数 N:人数满足后开始游戏 */
    playerNumLimit: number = 0;
    /**局数   <=0-以时间为准的房间   N-共几局 */
    allRound: number = 0;
    /**当前局数 <=0游戏没开始  N-当前第几局 */
    currentRound: number = 0;
    /**大局总共多少秒  <=0-是以局数来统计  N-大局总共多少秒 */
    allSeconds: number = 0;
    /**大局还剩多少秒 <0-游戏没开始  N-当前还剩秒数 */
    leftSeconds: number = 0;
    /**是否自动开始 */
    bAutoStart: boolean = false;
    /**是否同一IP段限制进入 */
    bIPLimit: boolean = false;
    /**是否控制玩家带入积分 */
    bAddScoreLimit: boolean = false;
    /**是否控制聊天 */
    bChatLimit: boolean = false;
    /**自动开局 */
    autoStart: boolean = false;
    extent:string = "";


    
    // /**最小携带倍数 诈金花需要此字段 */
    // enterMinScoreTimes: number = 0;
    // /**最大携带倍数 诈金花需要此字段 */
    // enterMaxScoreTimes: number = 0;
    
}

/**
 * 游戏房间的玩家信息
 */
export class RoomPlayerInfo {
    /**玩家id */
    userId: number = 0;
    /**玩家账号 */
    account: string = "";
    /**玩家名字 */
    nickName: string = "";
    /**玩家头像 */
    headId: number = 0;
    /**玩家远程头像地址 */
    headImgUrl: string = '';
    /** */
    headboxId: number = 0;
    /**vip等级 */
    vipLevel: number = 0;
    /**桌子id */
    tableId: number = 0;
    /**椅子id */
    chairId: number = 0;
    /**玩家状态 */
    userStatus: EUSER_STATUS = 1;
    /**玩家所在城市信息 */
    location: string = "";
    /**得分 */
    score: number = 0;
    /**性别 */
    sex: number;
    szLocation: string;
}