
import UHandler from "../../common/utility/UHandler";

const { ccclass, property } = cc._decorator;
/**
 * 创建:gj
 * 作用:加载ui时候的圈圈
 */
@ccclass
export default class VCircle extends cc.Component {
    clickHander: UHandler;
    /**
     * 圈圈节点
     */
    private _node: cc.Node;
    /**
     * 是否处于运行状态
     */
    private _run: boolean;

    private _process: cc.Label;

    private _uiType: string;

    @property(cc.Node) aniNode: cc.Node = null;
    @property(cc.Node) maskNode: cc.Node = null;

    onLoad() {
        // this._node = UNodeHelper.find(this.node, "icon");
        // let bg = UNodeHelper.find(this.node, "bg");
        // this._process = UNodeHelper.getComponent(this.node, "process", cc.Label);
        // this._process.string = "0";
        // this._process.enabled = false;
        this.node.zIndex = 50;
        // UEventListener.get(bg).onClick = new UHandler(() => {

        // }, this);
    }

    update(dt: number): void {
        // if (!this._run) return;
        // let rot = this._node.angle;
        // rot += dt * 150;
        // this._node.angle = rot;
    }

    updateProcess(process: number): void {
        //  if (this._process) this._process.string = (process * 100).toFixed(2);
    }

    //#region 私有方法
    private setactive(value: boolean): void {
        this.aniNode.opacity = 0;
        this.maskNode.opacity = 0;
        this.node.active = value;
        // this._run = value;
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
            }, 10000)
        }
    }

    //#region 公有方法 
    show(assetName: string): void {
        this._uiType = assetName;
        this.setactive(true);
        this.updateProcess(0);
    }

    hide(): void {
        this.setactive(false);
    }

    /**
     * 设置父对象
     * @param parent 
     */
    setParent(parent: cc.Node): void {
        this.node.parent = parent;
        this.node.setPosition(0, 0);
    }

}
