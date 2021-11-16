
const { ccclass, property } = cc._decorator;
/**
 * 显示连接禁用玩家操作
 * websocket 默认超时时间在20-30s才收到onclose
 */
@ccclass
export default class VConnect extends cc.Component {

    @property(cc.Node) aniNode: cc.Node = null;
    @property(cc.Node) maskNode: cc.Node = null;

    init() {

    }

    show(value: boolean, type = 1): void {
        this.aniNode.opacity = 0;
        this.maskNode.opacity = 0;
        this.node.active = value;
        if (value) {
            let timer0 = setTimeout(() => {
                if (this.node.active) {
                    this.aniNode.opacity = 255;
                    this.maskNode.opacity = 50;
                }
                clearTimeout(timer0);
            }, 300);

            let timer = setTimeout(() => {
                if (this.node.active) {
                    this.node.active = false;
                }
                clearTimeout(timer);
            }, 20000)
        }
    }
}
