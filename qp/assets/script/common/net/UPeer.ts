import { Cmd_RequestData } from "./UMsgObj";
import IMsgHandler from "./IMsgHandler";
import { UPool } from "../utility/UPool";
import UDebug from "../utility/UDebug";
import TXWebSocket from "./socket/TXWebSocket";
import ByteArray, { Endian } from "./socket/ByteArray";
import UHeader, { headLen } from "./UHeader";
import UPingPong from "./UPingPong";
import { USerializer } from "./USerializer";
import { Game } from "../cmd/proto";
import UHandler from "../utility/UHandler";
import ErrorLogUtil, { LogLevelType } from "../../public/errorlog/ErrorLogUtil";
import UDateHelper from "../utility/UDateHelper";


const { ccclass, property } = cc._decorator;

/**
 * 创建:gj
 * 作用:socket消息传递
 */
export default class UPeer extends cc.EventTarget {

	/**
	 * socket连接
	 */
	private _socket: TXWebSocket;

	/**
	 * 临时读bytearray
	 */
	private _readyArray: ByteArray;
	/**
	 * 临时写bytearray
	 */
	private _writeArray: ByteArray;
	/**
	 * 临时的proto
	 */
	private _protoArray: ByteArray;

	private _isConnect: boolean;

	public _socketId:number = 0;

	private ip:string;
	private port:number;

	/**
	 * ws是否连接
	 */
	get isConnect(): boolean {
		return this._isConnect;
	}
	constructor() {
		super();
		this._readyArray = new ByteArray();
		this._readyArray.endian = Endian.LITTLE_ENDIAN;
		this._writeArray = new ByteArray();
		this._writeArray.endian = Endian.LITTLE_ENDIAN;
		this._protoArray = new ByteArray();
		this._protoArray.endian = Endian.LITTLE_ENDIAN;
	}
	/**
	 * 连接
	 * @param address 连接地址
	 */
	connect(host: string = "", port: number = 0): void {
		this.ip = host
		this.port = port
		if (this._socket) {
			this._isConnect = false;
			this.removeEvent();
			this._socket.close();
			this._socket.targetOff(this);
		}
		this._socket = new TXWebSocket(host, port);
		this._socket.type = TXWebSocket.TYPE_BINARY;

		this.addEvent();
		this._socket.connect(host, port);
		UDebug.log(UDateHelper.format(new Date(), "[yyyy-MM-dd hh:mm:ss.S]") + " 连接socket " ,this.ip ,this.port);
	}

	onConnectHandler(){
		UDebug.log( UDateHelper.format(new Date(), "[yyyy-MM-dd hh:mm:ss.S]") + "连接成功 " , this.ip , this.port);
		this._isConnect = true;
		this.emit("connect",this);
	}

	onCloseSocketHandler(){
		this._socket.close();
		ErrorLogUtil.ins.addErrorLog(UDateHelper.format(new Date(), "[yyyy-MM-dd hh:mm:ss.S] ") + this.ip + ":" + this.port + " socket连接失败", LogLevelType.ERROR);
		this._isConnect = false;
		this.emit("close");
	}

	onAcceptHandler(){
		this._readyArray.clear();
		this._protoArray.clear();
		this._socket.readBytes(this._readyArray);
		let header = new UHeader();
		if (!header.decode(this._readyArray)) {
			UDebug.Log("解析错误crc不一致->");
			return;
		}
		this._readyArray.readBytes(this._protoArray);
		this.emit("receive", header, this._protoArray.buffer);
	}

	onErrorHandler(){
		this._isConnect = false;
		ErrorLogUtil.ins.addErrorLog(this.ip + ":"+this.port + " socket连接错误", LogLevelType.ERROR);
		this.emit("error");
	}


	addEvent(){
		this._socket.on("connect",this.onConnectHandler,this);
		this._socket.on("close",this.onCloseSocketHandler,this);
		this._socket.on("message",this.onAcceptHandler,this);
		this._socket.on("error",this.onErrorHandler,this);
	}

	removeEvent(){
		this._socket.off("connect",this.onConnectHandler,this);
		this._socket.off("close",this.onCloseSocketHandler,this);
		this._socket.off("message",this.onAcceptHandler,this);
		this._socket.off("error",this.onErrorHandler,this);
	}

	//断线重连
	reConnect(){
		UDebug.log("断线重连" , this.ip , this.port)
		this._socket.connect(this.ip, this.port);
	}

	/**
	 * 关闭
	 */
	close(): void {
		if (this._socket) {
			this._isConnect = false;
			this.removeEvent();
			this._socket.close();
			this._socket.targetOff(this);
			this._socket = null;
		}
	}
	/**
	 * 发送消息
	 * @param opCode
	 * @param data 数据
	 * @param thisObj 回调的object
	 * @param callback 回调方法
	 * @param param 参数
	 * @param unLock 是否需要锁操作
	 */
	send(header: UHeader, protobuf: Uint8Array) {
		header.encode(this._writeArray, protobuf);
		this._socket.writeBytes(this._writeArray);
		this._writeArray.clear();
	}
}
