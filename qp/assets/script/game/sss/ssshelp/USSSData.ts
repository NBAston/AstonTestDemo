import { RoomPlayerInfo } from "../../../public/hall/URoomClass";
import { s13s } from "../../../common/cmd/proto";




/**
 * 十三水游戏的状态
 */
export enum ESSSState {

    /**
     * 等待状态
     */
    Wait,
    /**
     * 匹配状态
     */
    Match,
    /**
     * 游戏状态
     */
    Gameing,
    /**
     * 
     */
    Watching,
    /**
     * 取消匹配中
     */
    LeftGame,
}

/**
 * 扑克牌显示数据
 */
export class UISSSPoker {
    pokerType: string;
    pokerIcons: Array<number>
}

/**
 * 墩牌显示数据
 */
export class UISSSDunPoker {
    specialTy: number;
    pokerType: Array<number>;
    pokerIcons: Array<number>[]
}

/**ui命令 */
export class USSSCmd {
    cmd: string;
    needwait: boolean;
    data: any
}

/**SSS玩家的信息 */
export class ESSSPlayerInfo extends RoomPlayerInfo {
    /**剩下的cd时间 */
    cdtime: number = 0;
    //**桌面ui位置 */
    seatId: number;
    /**牌型 */
    paiXing: number = 0;
    /**玩家的牌 */
    pai: Array<number>;
    /**是否理牌 */  // 0 没理  1  理了
    selected: number;
    /**玩家状态 */
    isInGame: boolean;
    /**是否退出 */
    isExit: boolean = false;
}

/**SSS玩家的信息 */
export enum ESSSRoom {
    FAST = 1,
    general,
}

/**十三水注册的信息 */
export class REGSSSSUB {
    sub: s13s.SUBID
    fun: Function
}

/**十三水注册的信息 */
export class REGSSSSTR {
    id: string
    fun: Function
}

export enum SSSPX {
    // NONE=0,
    WL = 0,//乌龙
    DZ = 1,//对子 
    LD = 2,//2对
    ST = 3,//三条
    SZ = 4,//顺子
    TH = 5,//同花
    HL = 6,//葫芦
    TZ = 7,//铁支
    THS = 8,//同花顺
    PTPX = 9,//普通牌型
    //WT=10,//五同
    //特殊牌
    STH = 10,//三同花
    SSZ = 11,//三顺子
    LDB = 12,//六对半
    WDST = 13,//五对三条
    STST = 14,//四套三条
    SGCS = 15,//双怪冲三
    CYS = 16,//凑一色
    QX = 17,//全小
    QD = 18,//全大
    SFTX = 19,//三套炸弹、三分天下
    STHS = 20,//三同花顺
    SEHZ = 21,//十二皇族
    YTL = 22,//一条龙
    ZZQL = 23,//至尊清龙
    // TZP=25,//铁子牌
    // THSBD=26,//同花顺报道
    // WTZ=27//五同钻
};

/** 
    Tysp          = 0,  //散牌(乌龙)：一墩牌不组成任何牌型
    Ty20          = 1,  //对子(一对)：除了两张值相同的牌外没有其它牌型
    Ty22          = 2,  //两对：两个对子加上一张单牌
    Ty30          = 3,  //三条：除了三张值相同的牌外没有其它牌型
    Ty123         = 4,  //顺子：花色不同的连续五张牌(A2345仅小于10JQKA)
    Tysc          = 5,  //同花：花色相同的五张牌，非顺子
    Ty32          = 6,  //葫芦：一组三条加上一组对子
    Ty40          = 7,  //铁支：除了四张值相同的牌外没有其它牌型
    Ty123sc       = 8,  //同花顺：花色相同的连续五张牌(A2345仅小于10JQKA)
    TyAllBase     = 9,  //所有普通牌型
    ////// 特殊牌型
    TyThreesc     = 10,  //三同花：三墩均是同一花色的牌型
    TyThree123    = 11,  //三顺子：三墩均是顺子的牌型
    TySix20       = 12,  //六对半：六个对子加上一张单张的牌型
    TyFive2030    = 13,  //五对三条(五对冲三)：五个对子加上一个三条
    TyFour30      = 14,  //四套三条(四套冲三)：四个三条加上一张单张的牌型
    TyTwo3220     = 15,  //双怪冲三：二对葫芦加上一个对子加上一张单张的牌型
    TyAllOneColor = 16,  //凑一色：全是红牌(方块/红心)或黑牌(黑桃/梅花)的牌型
    TyAllSmall    = 17,  //全小：全是2至8的牌型
    TyAllBig      = 18,  //全大：全是8至A的牌型
    TyThree40     = 19,  //三分天下(三套炸弹)：三副炸弹(四张值相同)加上一张单张的牌型
    TyThree123sc  = 20,  //三同花顺：三墩均是同花顺的牌型
    Ty12Royal     = 21,  //十二皇族：十三张全是J，Q，K，A的牌型
    TyOneDragon   = 22,  //一条龙(十三水)：A到K的牌型，非同花，A2345678910JQK
    TyZZQDragon   = 23,  //至尊青龙：同花A到K的牌型，A2345678910JQK
*/
/**
 * 牌型位图文件对照表
 */
export var SSSPokeFont: { [key: number]: string } =
{

    [SSSPX.WL]: "a",
    [SSSPX.DZ]: "b",
    [SSSPX.LD]: "c",
    [SSSPX.ST]: "d",
    [SSSPX.SZ]: "e",
    [SSSPX.TH]: "f",
    [SSSPX.HL]: "g",
    [SSSPX.TZ]: "h",
    [SSSPX.THS]: "i",
    [SSSPX.PTPX]: "j",
    [SSSPX.STH]: "k",
    [SSSPX.SSZ]: "l",
    [SSSPX.LDB]: "m",
    [SSSPX.WDST]: "n",
    [SSSPX.STST]: "o",
    [SSSPX.SGCS]: "p",
    [SSSPX.CYS]: "q",
    [SSSPX.QX]: "r",
    [SSSPX.QD]: "s",
    [SSSPX.SFTX]: "t",
    [SSSPX.STHS]: "u",
    [SSSPX.SEHZ]: "v",
    [SSSPX.YTL]: "w",
    [SSSPX.ZZQL]: "x",

}

/**
 * 牌型后缀对应表
 */
export var SSSPokeSuffix: { [key: number]: string } =
{

    [SSSPX.WL]: "wl",
    [SSSPX.DZ]: "dz",
    [SSSPX.LD]: "ld",
    [SSSPX.ST]: "st",
    [SSSPX.SZ]: "sz",
    [SSSPX.TH]: "th",
    [SSSPX.HL]: "hl",
    [SSSPX.TZ]: "tz",
    [SSSPX.THS]: "ths",
    [SSSPX.PTPX]: "ptpx", //--备用
    [SSSPX.STH]: "sth",
    [SSSPX.SSZ]: "ssz",
    [SSSPX.LDB]: "ldb",
    [SSSPX.WDST]: "wdst",
    [SSSPX.STST]: "stst",
    [SSSPX.SGCS]: "sgcs",//--备用
    [SSSPX.CYS]: "cys",
    [SSSPX.QX]: "qx",
    [SSSPX.QD]: "qd",
    [SSSPX.SFTX]: "sftx",
    [SSSPX.STHS]: "sths",
    [SSSPX.SEHZ]: "sehz",
    [SSSPX.YTL]: "ytl",
    [SSSPX.ZZQL]: "zzql",

}

export var SSSPXStr: { [key: number]: string } =
{
    [SSSPX.WL]: "乌龙",
    [SSSPX.DZ]: "对子",
    [SSSPX.LD]: "两对",
    [SSSPX.ST]: "三条",
    [SSSPX.SZ]: "顺子",
    [SSSPX.TH]: "同花",
    [SSSPX.HL]: "葫芦",
    [SSSPX.TZ]: "铁支",
    [SSSPX.THS]: "同花顺",
    [SSSPX.PTPX]: "普通牌型", //--备用
    [SSSPX.STH]: "三同花",
    [SSSPX.SSZ]: "三顺子",
    [SSSPX.LDB]: "六对半",
    [SSSPX.WDST]: "五对三条",
    [SSSPX.STST]: "四套三条",
    [SSSPX.SGCS]: "双怪冲三",//--备用
    [SSSPX.CYS]: "凑一色",
    [SSSPX.QX]: "全小",
    [SSSPX.QD]: "全大",
    [SSSPX.SFTX]: "三分天下",
    [SSSPX.STHS]: "三同花顺",
    [SSSPX.SEHZ]: "十二皇族",
    [SSSPX.YTL]: "一条龙",
    [SSSPX.ZZQL]: "至尊清龙",
}




