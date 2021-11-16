
import { RoomPlayerInfo } from "../../public/hall/URoomClass";

/**
 * 21点游戏的状态
 */
export enum EBJState {

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
 * 扑克牌显示数据
 */
export class UIBJPoker {
    pokerType: string;
    pokerIcons: Array<number>
}

/**ui命令 */
export class UBJCmd {
    cmd: string;
    needwait: boolean;
    data: any
}

/**21点玩家的信息 */
export class EBJPlayerInfo extends RoomPlayerInfo {
    /**玩家的总过的下注数 */
    userTotal: number = 0;
    paiState: EPlayerPaiState = EPlayerPaiState.none;
    /**剩下的cd时间 */
    cdtime: number = 0;
    //**桌面ui位置 */
    seatId: number;
    /**牌型 */
    paiXing: number = 0;
    /**玩家的牌 */
    pai: Array<number>;
    headImgUrl: string;
}

export class UIBJChipItem {
    chipType: string;
    objId: number;
    gold: number;
    seatId: number;
}

/**筹码的数据 */
export class UIBJChip {
    items: Array<UIBJChipItem>;
    /**
     * 出筹码的状态
     *（0：没有,1:跟注 2 加注）
     */
    chipState: number;
}
/**翻牌 */
export class UIBJFanPai {
    seatId: number;
    isOneHand: boolean;
    withAnimation: boolean;
    deal: number //动画延迟时间
    poker: UIBJPoker;
    showNum: boolean;
}

/**
 * 筹码
 */
export class UIBJChips {
    canUse: boolean;
    count: number;
}


/**
 *玩家牌的状态
 */
export enum EPlayerPaiState {
    none,
    /**双倍下注之中 */
    doublexiazhu,
    /**分牌 */
    fenPai,
    /**要牌 */
    yaopai,
    /**爆牌 */
    baoPai,
    /**停牌 */
    tingpai,
}
