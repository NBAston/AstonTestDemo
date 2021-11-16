import UResManager from "../../../common/base/UResManager";
import AppGame from "../../base/AppGame";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventListener from "../../../common/utility/UEventListener";
import UHandler from "../../../common/utility/UHandler";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VChargeProxyItem extends cc.Component {
    private _icon: cc.Sprite;
    private _name: cc.Label;
    private _lv: cc.Label;
    private _data: any;
    init(): void {
        this._icon = UNodeHelper.getComponent(this.node, "mask/icon", cc.Sprite);
        this._name = UNodeHelper.getComponent(this.node, "name", cc.Label);
        this._lv = UNodeHelper.getComponent(this.node, "lv", cc.Label);
        var btn = UNodeHelper.find(this.node, "charge_detail_bg");
        UEventListener.get(btn).onClick = new UHandler(this.onclick, this);
    }
    bind(data: any): void {
        this.node.active = true;
        this._data = data;
        this._name.string = data["nick_name"];
        this._lv.string = data["star_level"];
        UResManager.loadRemote(AppGame.ins.LoginModel.LoginData.avatarUrl + data["avatar"], this._icon);
    }
    hide(): void {
        this.node.active = false;
    }
    private onclick(): void {
        if (this._data) {
            AppGame.ins.roleModel.requestOpenMessageDetail(this._data["service_id"], this._data["nick_name"], this._data["avatar"]);
        }
    }
}
