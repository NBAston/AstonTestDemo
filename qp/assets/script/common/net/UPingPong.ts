import { Game } from "../cmd/proto";
import UMsgCenter from "./UMsgCenter";
import UDateHelper from "../utility/UDateHelper";

/**
 * 创建:sq
 * 功能:ping
 */
export default class UPingPong extends cc.EventTarget {


    /**
    * 开始发送pingpong
    */
    private _pingpong: boolean;
    /**
     * 等待时间
     */
    private _waittime: number;
    private _pingdata: any;
    private _sendMsg: Function;
    private _pintime: number;
    private _reciveTime: number;
    private _checkTime: number;
    private _disconnectTime: number;
    private _sendTime: number;
    private _sendLong: boolean;
    private _runTime: number;
    constructor(sendfunction: Function, sendcd: number, disconnectTime: number) {
        super();
        this._disconnectTime = disconnectTime;
        this._pintime = sendcd;
        this._sendMsg = sendfunction;
        this._checkTime = 0;
        this._sendLong = false;
    }
    update(dt: number): void {
        if (this._pingpong) {
            this._waittime -= dt;
            if (this._waittime < 0) {
                this._waittime = this._pintime;
                this._sendTime = UDateHelper.Date().getTime();
                this._runTime = this._disconnectTime;
                let msg = new Game.Common.KeepAliveMessage();
                msg.session = this._pingdata;
                this._sendMsg.call(this, msg);
            }
            if (!this._sendLong) {
                this._runTime -= dt;
                if (this._runTime < 0) {
                    this.emit("longNoPong");
                    this._sendLong = true;
                }
            }
        }
    }
    recivePong(): void {
        this._runTime = this._disconnectTime;
        this._reciveTime = UDateHelper.Date().getTime();
    }
    get ping(): number {
        return this._reciveTime - this._sendTime;
    }
    /**
  * 启用计时器
  */
    startHeart(seesion: any): void {
        this._runTime = this._disconnectTime;
        this._pingdata = seesion;
        this._pingpong = true;
        this._waittime = 0;
        this._reciveTime = UDateHelper.Date().getTime();
        this._sendTime = this._reciveTime;
        this._sendLong = false;
    }
    /**
     * 停止计时器
     */
    stopHeart(): void {
        this._pingpong = false;
        this._sendLong = true;
        this._reciveTime = UDateHelper.Date().getTime();
    }
}
