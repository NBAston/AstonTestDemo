import VPing from "../../public/base/VPing";

/**
 * 创建:gj
 * 作用:数据处理中心抽象类
 */
export default abstract class Model extends cc.EventTarget {
    /**当前model是否处于运行状态 */
    protected _run: boolean;
    /**
     * 初始化
     */
    abstract init(): void;
    /**
     * 重置数据
     */
    abstract resetData(): void;
    /**
     * 帧更新
     * @param dt 
     */
    abstract update(dt: number): void;

    run(): void {
        this._run = true;
    }
    exit(): void {
        this._run = false;
    }
}