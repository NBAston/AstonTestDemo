import UDebug from "../utility/UDebug";
import UPingPong from "./UPingPong";
import { USerializer } from "./USerializer";
import UPeer from "./UPeer";
import UHeader from "./UHeader";
import { Game, GameServer } from "../cmd/proto";
import UHandler from "../utility/UHandler";
import { UHttpManager } from "./UHttpManager";
import NodeRSA = require("node-rsa");
import AppGame from "../../public/base/AppGame";
const MYAES = require('../utility/AES.js');
import JSEncrypt from 'jsencrypt'
import RsaKey from "../utility/RsaKey";

/**
 * 创建:sq
 * 作用：消息处理中心
 */
export default class UMsgCenter extends cc.EventTarget {

    private static _ins: UMsgCenter;
    /**
     * 消息中心实例
     */
    static get ins(): UMsgCenter {
        if (!UMsgCenter._ins) {
            UMsgCenter._ins = new UMsgCenter();
        }
        return UMsgCenter._ins;
    }
    /**
     * 是否初始化
     */
    private _init: boolean;
    /**
      * ping
      */
    private _ping: UPingPong;
    /**
     * 
     */
    private _serializers: { [key: number]: USerializer };
    /**
     * 当前运行的游戏
     */
    private _runGameId: number;
    /**
     * 连接
     */
    public _peer: UPeer;

    /**客户端主动关闭 */
    private _clientClose: boolean = false;

    //是否已经有成功的连接
    public _connectOk: boolean = false

    //socket队列
    public _peerList: Array<UPeer> = []

    //连接失败的个数
    public  _connectErrorCount: number = 0;


    /**
       * http请求控制器
       */
    private _http: UHttpManager;
    /**
    * http
    */
    get http(): UHttpManager {
        return this._http;
    }

    /**
     * 连接上了
     */
    private onconnect(successPeer: UPeer): void {
        //使用最先返回的连接
        if (!this._connectOk) {
            this._peer = successPeer
            for (const key in this._serializers) {
                if (this._serializers.hasOwnProperty(key)) {
                    const element = this._serializers[key];
                    element.setPeer(this._peer);
                }
            }

            //释放队列里面其它连接
            for (var k in this._peerList) {
                if (this._peerList[k]._socketId != successPeer._socketId && this._peerList[k].close != null) {
                    this._peerList[k].close()
                    this._peerList[k] = null
                }
            }
            this._peerList = []
            this.emit("connect")
            this._connectOk = true
        }
    }

    private onclose(): void {
        if (!this._clientClose)
            this.emit("close");
    }

    private onerror() {
        if (!this._clientClose)
            this.emit("error");
    }

    private receiveping(ping: number): void {
        this.emit("ping", ping);
    }
    private onreceive(header: UHeader, buffer: ArrayBuffer): void {
        /**这里因为 每个游戏的主命令和子命令一模一样 但是结构体是不一样的 所以再这里需要分流 */
        let uint8buffer = new Uint8Array(buffer)
        if (header.mainId == 1 && header.subId == 4) {
            uint8buffer = MYAES.aesCbcPkcs7Decrypt(uint8buffer, new RsaKey().stringToUint8Array(AppGame.ins._localRsaKey.aesKey));
        } else if (header.encryptType == 0x32) {
            uint8buffer = MYAES.aesCbcPkcs7Decrypt(uint8buffer, AppGame.ins.commonAesKey);
        }

        // 游戏服通道消息
        if ((header.mainId == Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC || header.mainId == Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND) && header.subId == GameServer.SUBID.SUB_S2C_MESSAGE_RES) {
            this._serializers[0].deserialize(header, uint8buffer);
            return;
        }

        switch (header.mainId) {
            case Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_PROXY:
            case Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_FRIEND:
            case Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL:
            case Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER:
            case Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL_CLUB:
            case Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER_CLUB:
            case Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_SERVER_FRIEND:
                {
                    /**0默认是大厅的 */
                    this._serializers[0].deserialize(header, uint8buffer);
                }
                break;
            case Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC:
            case Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_GAME_LOGIC_FRIEND:
                {
                    let pbpares = GameServer.MSG_CSC_Passageway.decode(uint8buffer);
                    if (this._runGameId > 0) {
                        if (this._serializers[this._runGameId]) {
                            this._serializers[this._runGameId].deserialize(header, pbpares.passData);
                        } else {
                            throw new Error("没有加入对应的序列化器->" + this._runGameId);
                        }
                    } else {

                    }
                }
                break;
            default:
                {
                    UDebug.Log("未处理的命令->" + header.mainId)
                }
                break;
        }
    }

    get isconnenct(): boolean {
        if (this._peer) {
            return this._peer.isConnect;
        }
        return false;
    }
    constructor() {
        super();
        this._runGameId = 0;
        this._serializers = {};
        window["se"] = this._serializers;
    }
    /**
     * 添加序列化 (大厅的序列化器 gameid==0)
     * @param gameId 
     * @param value 
     */
    addSerializer(gameId: number, value: USerializer): void {
        if (this._serializers[gameId]) {
            UDebug.Log("已经添加了序列化器 请不要重复添加" + gameId);
            return;
        }
        this._serializers[gameId] = value;
        if (this._peer) this._serializers[gameId].setPeer(this._peer);
    }
    /**
     * 移除序列化器
     * @param gameId 
     */
    removeSerializer(gameId: number) {
        if (this._serializers[gameId]) {
            delete this._serializers[gameId];
            return;
        }
    }
    /**
     * 设置当前运行的游戏
     * @param gameId 
     */
    setRunGame(gameId: number): void {
        this._runGameId = gameId;
    }
    /**
     * 初始化
     */
    init(): void {
        if (this._init) {
            UDebug.Log("请不要重复初始化")
            return;
        }
        this._init = true;
        this._connectOk = false;
        this._ping = new UPingPong((data) => {
            this.sendPkg(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL, Game.Common.MESSAGE_CLIENT_TO_SERVER_SUBID.KEEP_ALIVE_REQ, data)
        }, 5, 120);
        this._http = new UHttpManager();

        this.regester(0, Game.Common.MAINID.MAIN_MESSAGE_CLIENT_TO_HALL, Game.Common.MESSAGE_CLIENT_TO_SERVER_SUBID.KEEP_ALIVE_RES, new UHandler(this.keep_alive_res, this));
    }
    private longNoPong(): void {
        if (this._peer)
            this._peer.close();
    }
    private keep_alive_res(): void {
        this._ping.recivePong();
        this.receiveping(this._ping.ping);
    }
    update(dt: number): void {
        if (this._ping) {
            this._ping.update(dt);
        }
    }
    /**
    * 启用计时器
    */
    startHeart(seesion: any): void {
        this._ping.startHeart(seesion);
    }
    /**
     * 停止计时器
     */
    stopHeart(): void {
        this._ping.stopHeart();
    }
    /**
       * 注册消息 (大厅的消息 gameid==0)
       * @param mainId 主id
       * @param subId 子id
       * @param handler 回调
       */
    regester(gameId: number, mainId: number, subId: number, handler: UHandler): void {
        if (this._serializers[gameId]) {
            this._serializers[gameId].regester(mainId, subId, handler);
        }
    }
    /**
     * 注销事件注册(大厅的消息 gameid==0
     * @param mainId 
     * @param subId
     * @param handler 
     */
    unregester(gameId: number, mainId: number, subId: number, handler: UHandler): void {
        if (this._serializers[gameId]) {
            this._serializers[gameId].unregester(mainId, subId, handler);
        }
    }
    /**
     * 发送(大厅的消息 gameid==0)
     * @param mainId 
     * @param subId 
     * @param handler 
     */
    sendPkg(gameId: number, mainId: number, subId: number, data: any, handler?: UHandler, unLock?: boolean) {
        if (this._serializers[gameId]) {
            this._serializers[gameId].send(mainId, subId, data, handler, unLock);
        }
    }
    /**
     * ws连接
     * @param ip ip 
     * @param port 端口
     */
    connect(ip: string, port: number): void {
        var tempPeer = new UPeer();
        tempPeer.on("connect", this.onconnect, this);
        tempPeer.on("close", this.onclose, this);
        tempPeer.on("receive", this.onreceive, this);
        tempPeer.on("error", this.onerror, this);
        tempPeer.on("longNoPong", this.longNoPong, this);
        tempPeer.connect(ip, port);
        this._clientClose = false;
        tempPeer._socketId = this._peerList.length
        this._peerList.push(tempPeer)

        UDebug.Log("正在连接个数：" + this._peerList.length)
    }

    /**关闭连接 */
    closepeer(): void {
        this._clientClose = true;
        if (this._peer)
            UDebug.Log("前端主动关闭连接")
            this._peer.close();
    }
}
