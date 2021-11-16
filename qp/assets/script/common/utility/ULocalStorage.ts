import UStringHelper from "./UStringHelper";


const dbname = "db_qp_42";

/**
 * 账号信息
 */
export class AccountInfo {
    /**
     * userId
     */
    userId: number = 0;
    /**
     * 密码
     */
    psw: string;
    truePsw: string;
    /**
     * 是否是当前使用账号
     */
    value: boolean;
    /**
     * 电话号码
     */
    mobilenum: string = "";
}

export class MsgObj {
    isSelf: boolean;
    content: string;
    msgType: string;
    isRead: boolean;
    msgId: string;
    time: number;
    originalMag: any; //原始数据
}

/**
* 聊天消息
*/
export class ChatInfo {
    /**
     * userId
     */
    msgId: string;
    /**
     * msgBody
     */
    msgBody: Array<MsgObj>;
    /**
     * unread
     */
    unread: number;
}

//某个账号的消息
export class chatMsgItem {
    accountId: number;
    chatInfoArr: Array<ChatInfo>;
}

/**
 * 存储的的信息
 */
export class DBData {
    /**
     * 声音
     */
    sound: number = 0.4;
    /**
     * 背景音乐
     */
    music: number = 0.5;
    musicmute: boolean = false;
    soundmute: boolean = false;
    ip: string = "192.168.0.11";
    port: number = 10000;
    api: string = "";
    qznnfyxbd: boolean = false;
    sgfyxbd: boolean = false;
    kpqznnfyxbd: boolean = false;
    tbnnfyxbd: boolean;
    /**
     * 账号信息
     */
    accounts: Array<AccountInfo> = [];
    /**
     * chat info
     *
     */
    chatMsg: Array<chatMsgItem> = [];
}
/**
 * 创建：sq
 * 作用:本地数据的存储
 */
export default class ULocalDB {

    private static _init: boolean = false;
    private static _db: DBData;

    private static initDB(): void {
        ULocalDB._init = true;
        let str = ULocalStorage.getItem(dbname);
        if (UStringHelper.isEmptyString(str)) {
            ULocalDB._db = new DBData();
            return;
        }
        ULocalDB._db = JSON.parse(str);
    }
    /**
     * 获取本地数据
     * @param key 
     */
    static getDB(key: string): any {
        if (!ULocalDB._init) {
            ULocalDB.initDB();
        }
        return ULocalDB._db[key];
    }
    /**
     * 保存本地数据
     * @param key 
     * @param data 
     */
    static SaveDB(key: string, value: any): void {
        if (!ULocalDB._init) {
            ULocalDB.initDB();
        }
        ULocalDB._db[key] = value;
        ULocalStorage.saveItem(dbname, ULocalDB._db)
    }
}
/**
 * 本地存储类
 */
export class ULocalStorage {
    /**
    * 存储
    * @param key 
    * @param value 
    */
    static saveItem(key: string, value: any): void {
        if (typeof (value) == "string") {
            cc.sys.localStorage.setItem(key, value);
        } else {
            let json = JSON.stringify(value);
            cc.sys.localStorage.setItem(key, json);
        }
    }
    /**
     * 获取信息
     * @param key 
     */
    static getItem(key: string): any {
        return cc.sys.localStorage.getItem(key);
    }
}
