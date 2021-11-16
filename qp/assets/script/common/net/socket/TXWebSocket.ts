import ByteArray from "./ByteArray";
import HTML5WebSocket from "./HTML5WebSocket";
/**
 * WebSocket 类启用代码以建立传输控制协议 (TCP) 套接字连接，用于发送和接收字符串或二进制数据。
 * 要使用 WebSocket 类的方法，请先使用构造函数 new TXWebSocket 创建一个 TXWebSocket 对象。
 * 套接字以异步方式传输和接收数据。
 * @event "connect" 连接服务器成功。
 * @event "message" 接收服务器数据。
 * @event "close" 在服务器关闭连接时调度。
 * @event "error" 在出现输入/输出错误并导致发送或加载操作失败时调度。。
 * @platform Web,Native
 * @includeExample extension/socket/WebSocket.ts
 * @language zh_CN
 */
export default class TXWebSocket extends cc.EventTarget {
    /**
     * Send and receive data in character string format
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 以字符串格式发送和接收数据
     * @platform Web,Native
     * @language zh_CN
     */
    public static TYPE_STRING: string = "webSocketTypeString";
   
    /**
     * 以二进制格式发送和接收数据
     * @platform Web,Native
     * @language zh_CN
     */
    public static TYPE_BINARY: string = "webSocketTypeBinary";

    /**
     * @private
     */
    private socket: HTML5WebSocket;

    /**
     * @private
     */
    private _writeMessage: string = "";
    /**
     * @private
     */
    private _readMessage: string = "";

    /**
     * @private
     */
    private _connected: boolean = false;
    /**
     * @private
     */
    private _connecting: boolean = false;
   
    /**
     * 创建一个 egret.WebSocket 对象
     * 参数为预留参数，现版本暂不处理，连接地址和端口号在 connect 函数中传入
     * @platform Web,Native
     * @language zh_CN
     */
    constructor(host: string = "", port: number = 0) {
        super();
        this._connected = false;
        this._writeMessage = "";
        this._readMessage = "";

        this.socket = new HTML5WebSocket();
        this.socket.addCallBacks(this.onConnect, this.onClose, this.onSocketData, this.onError, this);
    }
    /**
     * 将套接字连接到指定的主机和端口
     * @param host 要连接到的主机的名称或 IP 地址
     * @param port 要连接到的端口号
     * @platform Web,Native
     * @language zh_CN
     */
    public connect(host: string, port: number): void {
        if (!this._connecting && !this._connected) {
            this._connecting = true;
            this.socket.connect(host, port);
        }
    }

    /**
     * 根据提供的url连接
     */
    public connectByUrl(url: string): void {
        if (!this._connecting && !this._connected) {
            this._connecting = true;
            this.socket.connectByUrl(url);
        }
    }

    /**
     * 关闭套接字
     * @platform Web,Native
     * @language zh_CN
     */
    public close(): void {
        if (this._connected) {
            this.socket.close();
        }
    }

    /**
     * @private
     * 
     */
    private onConnect(): void {
        this._connected = true;
        this._connecting = false;
        this.emit("connect");
    }

    /**
     * @private
     * 
     */
    private onClose(): void {
        this._connected = false;
        this.emit("close");
    }

    /**
     * @private
     * 
     */
    private onError(): void {
        if (this._connecting) {
            this._connecting = false;
        }
        this.emit("error");
    }

    /**
     * @private
     * 
     * @param message 
     */
    private onSocketData(message: any): void {
        if (typeof message == "string") {
            this._readMessage += message;
        }
        else {
            this._readByte._writeUint8Array(new Uint8Array(message));
        }
        this.emit("message");
    }

    /**
     * 对套接字输出缓冲区中积累的所有数据进行刷新
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public flush(): void {
        if (!this._connected) {
            // egret.$warn(3101);
            return;
        }
        if (this._writeMessage) {
            this.socket.send(this._writeMessage);
            this._writeMessage = "";
        }
        if (this._bytesWrite) {
            this.socket.send(this._writeByte.buffer);
            this._bytesWrite = false;
            this._writeByte.clear();
        }
        this._isReadySend = false;
    }

    /**
     * @private
     */
    private _isReadySend: boolean = false;

 
    /**
     * 将字符串数据写入套接字
     * @param message 要写入套接字的字符串
     * @platform Web,Native
     * @language zh_CN
     */
    public writeUTF(message: string): void {
        if (!this._connected) {
            // egret.$warn(3101);
            return;
        }
        if (this._type == TXWebSocket.TYPE_BINARY) {
            this._bytesWrite = true;
            this._writeByte.writeUTF(message);
        }
        else {
            this._writeMessage += message;
        }

        this.flush();
        // return;
        // if (this._isReadySend) {
        //     return;
        // }
        // this._isReadySend = true;
        // egret.callLater(this.flush, this);
    }

    /**
     * Read a UTF-8 character string from the socket
     * @returns {string}
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 从套接字读取一个 UTF-8 字符串
     * @returns {string}
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public readUTF(): string {
        let message: string;
        if (this._type == TXWebSocket.TYPE_BINARY) {
            this._readByte.position = 0;
            message = this._readByte.readUTF();
            this._readByte.clear();
        }
        else {
            message = this._readMessage;
            this._readMessage = "";
        }
        return message;
    }

    /**
     * @private
     */
    private _readByte: ByteArray;
    /**
     * @private
     */
    private _writeByte: ByteArray;
    /**
     * @private
     */
    private _bytesWrite: boolean = false;
   
    /**
     * 从指定的字节数组写入一系列字节。写入操作从 offset 指定的位置开始。
     * 如果省略了 length 参数，则默认长度 0 将导致该方法从 offset 开始写入整个缓冲区。
     * 如果还省略了 offset 参数，则写入整个缓冲区。
     * @param bytes 要从中读取数据的 ByteArray 对象
     * @param offset ByteArray 对象中从零开始的偏移量，应由此开始执行数据写入
     * @param length 要写入的字节数。默认值 0 导致从 offset 参数指定的值开始写入整个缓冲区
     * @platform Web,Native
     * @language zh_CN
     */
    public writeBytes(bytes: ByteArray, offset: number = 0, length: number = 0): void {
        if (!this._connected) {
            //egret.$warn(3101);
            return;
        }
        if (!this._writeByte) {
            //egret.$warn(3102);
            return;
        }
        this._bytesWrite = true;
        this._writeByte.writeBytes(bytes, offset, length);
        this.flush();
    }

    /**
     * Read data byte number specified by the length parameter from the socket. Read these bytes into the specified byte array starting from the location expressed by offset.
     * @param bytes The ByteArray object that data is read into
     * @param offset The offset for data reading starts from this byte array
     * @param length Byte number to be read Default value 0 indicates reading all available data
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 从套接字读取 length 参数指定的数据字节数。从 offset 所表示的位置开始，将这些字节读入指定的字节数组
     * @param bytes 要将数据读入的 ByteArray 对象
     * @param offset 数据读取的偏移量应从该字节数组中开始
     * @param length 要读取的字节数。默认值 0 导致读取所有可用的数据
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public readBytes(bytes: ByteArray, offset: number = 0, length: number = 0): void {
        if (!this._readByte) {
            //egret.$warn(3102);
            return;
        }
        this._readByte.position = 0;
        this._readByte.readBytes(bytes, offset, length);
        this._readByte.clear();
    }

    /**
     * Indicates whether the Socket object is connected currently
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 表示此 Socket 对象目前是否已连接
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public get connected(): boolean {
        return this._connected;
    }

    /**
     * @private
     */
    private _type: string = TXWebSocket.TYPE_STRING;

    /**
     * Format for sending and receiving data. The default setting is the character string format
     * @version Egret 2.4
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 发送和接收数据的格式，默认是字符串格式
     * @version Egret 2.4
     * @platform Web,Native
     * @language zh_CN
     */
    public get type(): string {
        return this._type;
    }

    public set type(value: string) {
        this._type = value;
        if (value == TXWebSocket.TYPE_BINARY && !this._writeByte) {
            this._readByte = new ByteArray();
            this._writeByte = new ByteArray();
        }
    }
}
