import UResLoader from "./UResLoader";

const { ccclass, property } = cc._decorator;
/**
 * 创建:sq
 * 作用:节点再销毁的时候自动卸载资源
 */
@ccclass
export default class UAutoRelease extends cc.Component {
    /**
     * 资源地址
     */
    resUrl: string = "";

    onDestroy() {
        UResLoader.ins.release(this.resUrl);
    }
}
