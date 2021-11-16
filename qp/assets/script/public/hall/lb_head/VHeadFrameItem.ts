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
export default class VHeadFrameItem extends cc.Component {

    clickHandler: UHandler;
    /**
     * 头像
     */
    private _icon: cc.Sprite;
    /**
     * 选中
     */
    private _selecte: cc.Node;

    private _lock: cc.Node;
    private _isSelect: boolean;

    private _data: UIHeadItem;


    get Id(): number {
        return this._data.frameId;
    }
    get IsSelect(): boolean {
        return this._isSelect;
    }
    set IsSelect(value: boolean) {
        this._isSelect = value;
        this._selecte.active = value;
    }
    private onclick(): void {
        if (!this._data || this._data.lock) {
            // AppGame.ins.showTips(ULanHelper.UPDATE_VIP_LEVEL);
            return;
        }
        if(this.clickHandler){
            this.clickHandler.runWith(this);
        }
    }

    init(): void {
        this._icon = UNodeHelper.getComponent(this.node, "icon", cc.Sprite);
        this._selecte = UNodeHelper.find(this.node, "select");
        this._lock = UNodeHelper.find(this.node, "lock");
        UEventListener.get(this._icon.node).onClick = new UHandler(this.onclick, this);
        this.IsSelect = false;
    }

    bind(data: UIHeadItem, type: EIconType): void {
        this._data = data;
        UResManager.load(data.frameId, type, this._icon);
        this.node.active = true;
        this._lock.active = data.lock;
    }

    reset(): void {
        this.node.active = false;
        this.IsSelect = false;
        this._lock.active = false;
    }
}
