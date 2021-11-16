import ISocket from "./ISocket";

/**
 * @private
 */
export default class HTML5WebSocket implements ISocket {
    private socket;

    constructor() {

    }

    private onConnect: Function;
    private onClose: Function;
    private onSocketData: Function;
    private onError: Function;
    private thisObject: any;
    public addCallBacks(onConnect: Function, onClose: Function, onSocketData: Function, onError: Function, thisObject: any): void {
        this.onConnect = onConnect;
        this.onClose = onClose;
        this.onSocketData = onSocketData;
        this.onError = onError;
        this.thisObject = thisObject;
    }

    private host: string = "";
    private port: number = 0;
    public connect(host: string, port: number): void {
        this.host = host;
        this.port = port;

        let socketServerUrl = "ws://" + this.host + ":" + this.port;
        //UDebug.Log(socketServerUrl);
        this.socket = new WebSocket(socketServerUrl);
        this.socket.binaryType = "arraybuffer";
        this._bindEvent();
    }

    public connectByUrl(url: string): void {
        this.socket = new WebSocket(url);
        this.socket.binaryType = "arraybuffer";
        this._bindEvent();
    }

    private _bindEvent(): void {
        let that = this;
        let socket = this.socket;
        socket.onopen = function () {
            if (that.onConnect) {
                that.onConnect.call(that.thisObject);
            }
        };
        socket.onclose = function (e) {
            if (that.onClose) {
                that.onClose.call(that.thisObject);
            }
        };
        socket.onerror = function (e) {
            if (that.onError) {
                that.onError.call(that.thisObject);
            }
        };
        socket.onmessage = function (e) {
            //UDebug.Log("收到数据包")
            if (that.onSocketData) {
                that.onSocketData.call(that.thisObject, e.data);
            }
        };
    }

    public send(message: any): void {
        //UDebug.Log("发送成功.........")
        this.socket.send(message);
    }

    public close(): void {
        this.socket.close();
    }
    public disconnect(): void {
        if (this.socket.disconnect) {
            this.socket.disconnect();
        }
    }
}