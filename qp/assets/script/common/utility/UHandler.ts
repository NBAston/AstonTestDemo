// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;
/**
 * 创建:gj
 * 作用:事件call
 */
export default class UHandler {
    private _thisObj: any;
    private _params: any;
    private _callback: Function;
    private _onece: boolean;
    
    /**
     * 创建Handler 
     * 注：只执行一次
     * @param callback 
     * @param thisObj 
     * @param onece 
     * @param params 
     */
    static create(callback: Function, thisObj?: any, onece: boolean = true, params?: any): UHandler {
        return new UHandler(callback, thisObj, params, onece);
    }

    /**
     * 构造函数
     * @param callback 回调方法 
     * @param thisObj 回调的this
     * @param params 参数
     * @param onece 是否只执行一次
     */
    constructor(callback: Function, thisObj?: any, params?: any, onece?: boolean) {
        this._onece = onece || false;
        this._thisObj = thisObj || this;
        this._params = params;
        this._callback = callback;
    }
    isValid(): boolean {
        if (this._thisObj && (this._thisObj instanceof cc.Object)) {
            return this._thisObj.isValid;
        }
        if (!this._callback) return false;
        return true;
    }
    /**
     * 清空回调
     */
    clear(): void {
        this._callback = null;
        this._params = null;
        this._thisObj = null;
    }
    /**
     * 执行回调
     */
    run(): any {
        let rt = this._callback.call(this._thisObj, this._params);
        if (this._onece) {
            this.clear();
        }
        return rt;
    }

    runWith(data: any): any {
        let rt = null;
        if (this._callback) {
            if (this._params) {
                if (this.isValid()) {
                    rt = this._callback.call(this._thisObj, this._params, data);
                }
            } else {
                if (this.isValid()) {
                    rt = this._callback.call(this._thisObj, data);
                }
            }
            if (this._onece) {
                this.clear();
            }
        }
        return rt;
    }
}
