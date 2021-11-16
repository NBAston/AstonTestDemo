import VChargeItem from "./VChargeItem";
import UIChargeData from "./ChargeData";
import VChargeProxyItem from "./VChargeProxyItem";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import AppGame from "../../base/AppGame";
import MRole from "../lobby/MRole";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VChargeProxy extends VChargeItem {
    private _parent: cc.Node;
    private _prefab: cc.Node;
    private _pool: Array<VChargeProxyItem>;
    private _run: Array<VChargeProxyItem>;

    private getInstance(): VChargeProxyItem {
        if (this._pool.length > 0) {
            var it = this._pool.shift();
            it.node.setParent(this._parent);
            return it;
        }
        let ins = cc.instantiate(this._prefab);
        let item = ins.getComponent(VChargeProxyItem);
        if (!item) {
            item = ins.addComponent(VChargeProxyItem);
        }
        ins.setParent(this._parent);
        item.init();
        return item;
    }
    private reclaimAll(): void {
        let len = this._run.length;
        for (let index = 0; index < len; index++) {
            let element = this._run[index];
            element.hide();
            element.node.parent = null;
            this._pool.push(element);
        }
        this._run = [];
    }
    private openserverlist(): void {
        AppGame.ins.roleModel.requestOpenCustomerServiceList();
    }
    private update_proxy(sucess: boolean, data: string): void {
        this.unscheduleAllCallbacks();
        if (sucess) {
            var dt = JSON.parse(data);
            dt.forEach(element => {
                var item = this.getInstance();
                item.bind(element);
                this._run.push(item);
            });
        } else {
            AppGame.ins.showTips(data);
        }
    }
    init(): void {
        this._run = [];
        this._pool = [];
        this._parent = UNodeHelper.find(this.contentRoot, "bar/view/content");
        this._prefab = UNodeHelper.find(this.contentRoot, "item");
        var btn = UNodeHelper.find(this.contentRoot, "btn_charchat");
        UEventHandler.addClick(btn, this.node, "VChargeProxy", "openserverlist");
    }
    bind(data: UIChargeData): void {

    }
    protected isOnafter(): void {
        super.isOnafter();
        this.contentRoot.active = this.IsOn;
        if (this.IsOn) {
            this.reclaimAll();
            AppGame.ins.roleModel.requsetProxyRecharge();
            this.scheduleOnce(() => {
                AppGame.ins.showConnect(false);
            }, 5);
        }
    }
    protected onEnable(): void {
        AppGame.ins.roleModel.on(MRole.UPDATE_PROXY, this.update_proxy, this);
    }
    protected onDisable(): void {
        this.unscheduleAllCallbacks();
        AppGame.ins.roleModel.off(MRole.UPDATE_PROXY, this.update_proxy, this);
    }
}
