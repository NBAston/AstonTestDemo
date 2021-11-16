import { ECommonUI, EUIPos } from "./UAllenum";
import UHandler from "../utility/UHandler";
import UAudioRes from "./UAudioRes";
import UAudioManager from "./UAudioManager";
import USpriteFrames from "./USpriteFrames";


const { ccclass, property } = cc._decorator;

/**
 * 创建:gj
 * 作用:共有UI的基类
 */
@ccclass
export default class VBaseUI extends cc.Component {

    protected _iscache: boolean = false;
    /**
     * 改UI的主要atlas
     */
    @property(cc.SpriteAtlas)
    atlas: cc.SpriteAtlas = null;
    /**
     * ui的类型
     */
    uiType: ECommonUI;
    @property({ type: cc.Enum(EUIPos) })
    uiPos: EUIPos = EUIPos.Normal;
    protected _res: UAudioRes;
    protected _spriteRes: USpriteFrames;
    get isCache(): boolean {
        return this._iscache;
    }

    /**
     * 初始化 UI创建的时候调用
     */
    init(): void {
        this._res = this.node.getComponent(UAudioRes);
        this._spriteRes = this.node.getComponent(USpriteFrames);
    }
    /**
     *  隐藏
     */
    hide(handler?: UHandler): void {
        this.node.active = false;
    }
    /**
     * 显示
     */
    show(data: any): void {
        this.node.active = true;
    }
    /**
     * 刷新数据
     * @param data 
     */
    refresh(data: any): void {

    }
    /**
     * 设置父对象
     */
    setParent(parent: cc.Node): void {
        this.node.parent = parent;
        this.node.setPosition(0, 0);
    }
    /**设置层级
     * @param index 层级
     */
    setZIndex(index: number = 0): void {
        this.node.zIndex = index;
    }
    protected playclick(): void {
        UAudioManager.ins.playSound("audio_click");
    }
}
