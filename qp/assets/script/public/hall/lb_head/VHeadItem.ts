import UHandler from "../../../common/utility/UHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventListener from "../../../common/utility/UEventListener";
import UResManager from "../../../common/base/UResManager";
import { ECommonUI, EIconType } from "../../../common/base/UAllenum";
import { UIHeadItem } from "../../../common/base/UAllClass";
import AppGame from "../../base/AppGame";
import ULanHelper from "../../../common/utility/ULanHelper";


const { ccclass, property } = cc._decorator;

/**
 * 创建:sq
 * 作用:显示头像
 */
@ccclass
export default class VHeadItem extends cc.Component {

    clickHandler: UHandler;
    private _lock: cc.Node;
    private _isSelect: boolean;
    private _data: UIHeadItem;
    private _type: EIconType;

    private _icon: cc.Sprite;
    private _flag: cc.Sprite;
    public _toplab: cc.Label;
    public _bottomlab: cc.Label;
    


    get Id(): number {
        return this._data.frameId;
    }
    get IsSelect(): boolean {
        return this._isSelect;
    }
    set IsSelect(value: boolean) {
        this._isSelect = value;
        if ( this._type == EIconType.Head ){
            var url = value ? "common/hall/texture/personal/head_check" : "common/hall/texture/personal/head_uncheck"
            this._toplab.node.active = false
            this._bottomlab.node.active =  false
        }
        if ( this._type == EIconType.Frame ){
            url = value ? "common/hall/texture/personal/frame_check" : "common/hall/texture/personal/frame_uncheck"
            var color = cc.Color.BLACK;
            if (!this._isSelect){
                this._toplab.node.color =  color.fromHEX("#5F5144")
                this._bottomlab.node.color =  color.fromHEX("#5F5144")
            }else{
                this._toplab.node.color =  color.fromHEX("#CC5516")
                this._bottomlab.node.color =  color.fromHEX("#CC5516")
            }
        }
        UResManager.loadUrl(url, this._flag);
    }

    private onclick(): void {
        if (!this._data || this._data.lock) {
            return;
        }
        if(this.clickHandler){
            this._toplab.node.active = true
            this._bottomlab.node.active = true
            this.clickHandler.runWith(this);
        }
    }

    init(): void {
        this._icon = UNodeHelper.getComponent(this.node, "icon", cc.Sprite);
        this._flag = UNodeHelper.getComponent(this.node, "flag", cc.Sprite);
        this._toplab = UNodeHelper.getComponent(this.node, "toplab", cc.Label);
        this._bottomlab = UNodeHelper.getComponent(this.node, "bottomlab", cc.Label);
        this._lock = UNodeHelper.find(this.node, "lock");
        UEventListener.get(this._flag.node).onClick = new UHandler(this.onclick, this);
        this.IsSelect = false;
    }

    bind(data: UIHeadItem, type: EIconType): void {
        this._data = data;
        this._type = type;
        UResManager.load(data.frameId, type, this._icon);

        if ( type == EIconType.Head ){
            this._toplab.node.active = false
            this._bottomlab.node.active = false
            var url = "common/hall/texture/personal/head_uncheck"
        }
        if ( type == EIconType.Frame){
            this._toplab.string = data.toplab
            this._bottomlab.string = data.bottomlab
            this._toplab.node.active =  true
            this._bottomlab.node.active = true
            var url = "common/hall/texture/personal/frame_uncheck"
        } 
        UResManager.loadUrl(url, this._flag);
        this._lock.active = data.lock;
        this.node.active = true;
        
    }

    reset(): void {
        this.node.active = false;
        this.IsSelect = false;
        this._lock.active = false;
    }

    onDestroy() {
        if (this.clickHandler) {
            this.clickHandler.clear();
            this.clickHandler = null;
        }
    }
}
