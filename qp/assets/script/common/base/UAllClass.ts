import { EGameType, ELevelType, EGameHot, EGameState, EGameStatus } from "./UAllenum";
import { RoomInfo, RoomInfoHy } from "../../public/hall/URoomClass";
import { StreamState } from "http2";


/**
 * 创建:gj
 * 作用:放置UI所需要的数据结构
 */

export class UIGameItem {

    isBig: boolean;
    /**
     * gameIcon
     */
    gameIcon: string;
    /**
     * 游戏类型
     */
    gameType: EGameType;
    /**
     * 是否为大热游戏
     */
    gameState: EGameState;
    /**
     * 在线人数
     */
    isOnline: boolean;
    /**
     * 在线人数
     */
    onlineNum: number;
    /**排序id */
    sort: number;
    /**
     * gameSpine
     */
    gameSpine: string;
    /**
     * clubGameSpine
     */
    clubGameSpine: string;
    /**
     * abbreviateName
     */
    abbreviateName: string;
}

/**
 * 玩家信息显示结构体
 */
export class URoleInfo {
    roleName: string;
    headId: number;
    roleId: number;
    gold: number;
    frameId: number;
    vip: number;
}
/**
 * 跳转场景时候的数据
 */
export class JumpSceneData {
    /**
     * 跳转场景类型
     */
    type: ELevelType;
    /**
     * 跳转场景数据
     */
    data: any;
}
/**
 * 扎金花记录数据
 */
export class UZJHRecords {
    rank: number;
    biaohao: string;
    room: string;
    yinli: number;
    time: string;
    color: cc.Color;
}
/**
 * 扎金花房间数据
 */
export class UZJHRoomItem {
    type: number;
    status: number;
    dizu: number;
    zhunru: number;
    minScore: number;
    maxScore: number;
    online: number;
    jettons: Array<number> = [];
    maxJettonScore: number;
}

export class CarryingRoom {
    gameId: number;
    type: number;
    minScore: number;
    maxScore: number;
    clubId: number;
    tableId: number;
}
export class UIHeadItem {
    frameId: number;
    lock: boolean;
    toplab: string;
    bottomlab: string;
}

//聊天数据
export class UChatDataItem {
    type: number; //消息类型，0：系统时间，1：文字消息，2：图片消息  3: 自动显示，充值等
    info: string;  //消息内容
    self: boolean; //是否自己
    originalMag?: any; //原始消息
    msgId?: string; //消息id
}
/**
 * 头像
 */
export class UHeadData {
    /**
     * 男头像
     */
    heads: Array<UIHeadItem>;
    /**
     * 女头像
     */
    frames: Array<UIHeadItem>;
    /**
     * 自己的头像
     */
    owner: number;
    sex: number;
    /**
     * 当前使用头像框
     */
    frameId: number;
}
export class ToBattle {
    roomData: RoomInfo;
    fromReconnet: boolean;
}
export class JettonItem {
    jetton: number;
    count: number;
}
export class LoginData {

    loginips: Array<string>;
    avatarUrl: string;
    businessId: string;
    QQ: Array<string>;

}
export class SysEvent {
    static SHOW_AWARDS = "SHOW_AWARDS";
    static CHANGE_CONTENT_DESC = "CHANGE_CONTENT_DESC";
    static GET_SERVERLIST_CALLBACK = "GET_SERVERLIST_CALLBACK";
}

