

export default interface ISocket {
    /**
     * 连接
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 连接
     * @platform Web,Native
     * @language zh_CN
     */
    connect(host: string, port: number): void;

    /**
     * 连接
     * @method egret.ISocket#connect
     */
    connectByUrl(url: string): void;

    /**
     * 
     * @param onConnect 
     * @param onClose 
     * @param onSocketData 
     * @param onError 
     * @param thisObject 
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 
     * @param onConnect 
     * @param onClose 
     * @param onSocketData 
     * @param onError 
     * @param thisObject 
     * @platform Web,Native
     * @language zh_CN
     */
    addCallBacks(onConnect: Function, onClose: Function, onSocketData: Function, onError: Function, thisObject: any): void;

    /**
     * 
     * @param message 
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 
     * @param message 
     * @platform Web,Native
     * @language zh_CN
     */
    send(message: any): void;

    /**
     * 
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 
     * @platform Web,Native
     * @language zh_CN
     */
    close(): void;
    /**
     * 
     * @platform Web,Native
     * @language en_US
     */
    /**
     * 
     * @platform Web,Native
     * @language zh_CN
     */
    disconnect(): void;
}
