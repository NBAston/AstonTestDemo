import { EPokerType } from "../../common/base/UAllenum";
import { RoomPlayerInfo } from "../../public/hall/URoomClass";



export enum ESeatState {

}
/**
 * 扎金花游戏的状态
 */
export enum EZJHState {

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

    AlreadLeft,
}


/**
 *战斗玩家牌的状态
 */
export enum EBattlePlayerPaiState {
    none,
    /**闷牌之中 */
    mengPai,
    /**已看牌 */
    kanPai,
    /**已弃牌 */
    qiPai,
    /**比牌输 */
    biPaiShu,
}

export enum EFlagState {
    GenZhu,
    JiaZhu,
    QiPai,
    KanPai,
}

/**ui命令 */
export class UZJHCmd {
    cmd: string;
    needwait: boolean;
    data: any
}
/**
 * 筹码
 */
export class UIZJHChips {
    canUse: boolean;
    count: number;
}
export class UIZJHOperate {
    items: Array<UIZJHChips>;
    isguzhu: boolean;
    isauto: boolean;
    genzhu: number;
    showBipaiValue: boolean;
    canBipai: boolean;
    canJiaZhu: boolean;
}
/**
 * 扑克牌显示数据
 */
export class UIZJHPoker {
    pokerType: string;
    pokerIcons: Array<string>
}
/**看牌 */
export class UIZJHFanPai {
    seatId: number;
    playPos: number;
    withAnimation: boolean;
    poker: UIZJHPoker;
}
/**比牌数据 */
export class UIZJHCompare {

    leftSeatId: number;
    leftName: string;
    leftGold: number;
    leftHeadId: number;
    leftHeadUrl: string;
    leftPai: Array<string>;
    leftvipLv: number;
    leftheadBoxId: number;

    rightSeatId: number;
    rightName: string;
    rightGold: number;
    rightHeadId: number;
    rightHeadUrl: string;
    rightPai: Array<string>;
    rightvipLv: number;
    rightheadBoxId: number;
    winseat: number;

}
export class UIZJHChipItem {
    chipType: string;
    objId: number;
    gold: number;
    seatId: number;
    state: number = 0;
}
/**筹码的数据 */
export class UIZJHChip {
    items: Array<UIZJHChipItem>;
    /**
     * 出筹码的状态
     *（0：没有,1:跟注 2 加注）
     */
    chipState: number;
}

/**下一个人 的turn的数据 */
export class UIZJHNextTurn {
    /**当前伦turn的玩家 */
    seatId: number;
    /**是否自动 */
    auto: boolean;
    /**cd时间 */
    cdtime: number;
}


/**扎金花玩家的战斗数据 */
export class ZJHBattlePlayerInfo extends RoomPlayerInfo {
    /**玩家的总过的下注数 */
    userTotal: number = 0;
    /**玩家玩了几轮 */
    playTurn: number = 0;
    /**是否为turn */
    isturn: boolean;
    /**玩家是否为先手 */
    isFirst: boolean = false;
    /**玩家手牌的状态 */
    paiState: EBattlePlayerPaiState = 0;
    /**自动跟注 */
    auto: boolean = false;
    /**玩家的牌 */
    pai: Array<number>;
    paiXing: number = 0;
    /**剩下的cd时间 */
    cdtime: number;
    /**展示的桌面id */
    seatId: number;
    /**下一次下注的count */
    nextXizhuCount: number;
    /**是否开启防超时 */
    fangchaoshi: boolean;
    headImgUrl: string;
}
/**更新玩家的turn时间 */
export class UIZJHUpdateTurnTime {
    seatId: number;
    leftTime: number;
}
/**更新玩家的基础数据 */
export class UIZJHUpdateSeatRoleInfo {
    seatId: number;
    score: number;
    usetotal: number;
}
/**更新玩家的基础数据 */
export class UIZJHOverTurn {
    seatId: number;
    auto: boolean;
}
/**
 * 游戏结束时候的统计
 */
export class UIZJHStaticsItem {
    seatId: number;//**位置id */
    getScore: number;//得分
    lastscore: number;//最后的总分
    uipoker: UIZJHPoker;//玩家的牌
    paistate: number;//牌的状态
}
/**游戏结束的统计 */
export class UIZJHBattleOver {

    winseatId: number;
    statics: { [key: number]: UIZJHStaticsItem };
}
export class UIZJHSetZHU {
    seatId: number;
    state: number;
}