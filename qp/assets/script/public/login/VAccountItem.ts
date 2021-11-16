import UHandler from "../../common/utility/UHandler";
import { UAccountItemData } from "./ULoginData";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import AppGame from "../base/AppGame";
import UEventListener from "../../common/utility/UEventListener";
import UStringHelper from "../../common/utility/UStringHelper";


const { ccclass, property } = cc._decorator;
/**
 * 账号的item
 */
@ccclass
export default class VAccountItem extends cc.Component {
    /**
     * 选中的回调
     */
    selectHander: UHandler;
    /**
     * 删除回调
     */
    deleteHanlder: UHandler;
    /**
     * 玩家id
     */
    private _userId: number;
    /**
     * 是否当前选中
     */
    private _isCurrent: boolean;
    /**
     * 是否为选中标记
     */
    private _flag: cc.Node;
    /**
     * 
     */
    private _account: cc.Label;
    /**
     * 关闭
     */
    private onclose(): void {
        if (this.deleteHanlder) this.deleteHanlder.runWith(this._userId);
    }
    private onselect(): void {
        if (this.selectHander) this.selectHander.runWith(this._userId);
    }
    /**
     * 初始化
     */
    init(): void {
        this._flag = UNodeHelper.find(this.node, "flag");
        this._account = UNodeHelper.getComponent(this.node, "account", cc.Label);
        var close = UNodeHelper.find(this.node, "wait_close");
        UEventHandler.addClick(close, this.node, "VAccountItem", "onclose");
        UEventListener.get(this.node).onClick = new UHandler(this.onselect, this);
    }
    /**
     * 绑定数据
     */
    bind(data: UAccountItemData): void {
        this.setactive(true);
        this._userId = data.userId;
        this._isCurrent = data.current;
        this._account.string = UStringHelper.isEmptyString(data.mobile) ? data.userId.toString() : data.mobile;
        this._flag.active = data.current;
    }
    /**
     * 设置显示
     * @param value 
     */
    setactive(value: boolean): void {
        this.node.active = value;
    }
    reset(): void {
        this.setactive(false);
    }
}
