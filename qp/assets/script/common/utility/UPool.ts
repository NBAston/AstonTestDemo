// Learn TypeScript:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/typescript.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] https://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/manual/en/scripting/life-cycle-callbacks.html

/**
 * 创建:gj
 * 作用:泛型对象池
 */
export class UPool<T>{
    /**
     * 对象池的最大个数
     */
    private _maxCount: number;
    /**
     * 存放对象的数组
     */
    private _pool: Array<T>;
    /**
     * 对象的创建模板
     */
    private _templte: any;
    /**
     * 构造函数
     * @param c 
     */
    constructor(c: { new(): T }) {
        this._pool = new Array<T>();
        this._templte = c;
    }
    /**
     * 获取一个实例
     */
    getGo(): T {
        if (this._pool.length > 0) {
            return this._pool.shift();
        }
        return new this._templte();
    }
    /**
     * 回收一个实例
     * @param go 
     */
    reclaimGo(go: T): void {
        if (this._pool.length > this._maxCount) {
            this.clearObject(go);
            return;
        }
        this._pool.push(go);
    }
    /**
     * 清空对象池
     */
    clear(): void {
        this._pool.forEach(element => {
            this.clearObject(element);
        });
        this._pool = new Array<T>();
    }
    private clearObject(go: any): void {
        if (go.destroy) {
            go.destroy();
        }
    }
}
