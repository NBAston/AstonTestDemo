import VChargeRecordsBtn from "./VChargeRecordsBtn";
import VChargeRecordsItem from "./VChargeRecordsItem";
import AppGame from "../../base/AppGame";
import MRole from "../lobby/MRole";
import UNodeHelper from "../../../common/utility/UNodeHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VChargeRecordsAll extends VChargeRecordsBtn {

    /**
     * 头像预制
     */
    private _prefab: cc.Node;
    /**
     * 根对象
     */
    private _parent: cc.Node;

    private _pool: Array<VChargeRecordsItem>;

    private _noNode: cc.Node;
    /**
     * 
     */
    private _run: Array<VChargeRecordsItem>;
    init(): void {
        super.init();
        this._run = [];
        this._pool = [];
        this._prefab = UNodeHelper.find(this.content, "item");
        this._parent = UNodeHelper.find(this.content, "view/content");
        this._noNode = UNodeHelper.find(this.content, "nonode");
    }
    private getInstance(): VChargeRecordsItem {
        if (this._pool.length > 0) {
            var it = this._pool.shift();
            it.node.setParent(this._parent);
            return it;
        }
        let ins = cc.instantiate(this._prefab);
        let item = ins.getComponent(VChargeRecordsItem);
        if (!item) {
            item = ins.addComponent(VChargeRecordsItem);
        }
        ins.setParent(this._parent);
        item.init();
        return item;
    }
    private reclaimAll(): void {
        let len = this._run.length;
        for (let index = 0; index < len; index++) {
            let element = this._run[index];
            element.reset();
            element.node.parent = null;
            this._pool.push(element);
        }
        this._run = [];
    }
    protected isOnafter(): void {
        this.content.active = this.IsOn;
        if (this.IsOn) {
            UDebug.Log("执行了几次");
            AppGame.ins.roleModel.requestChargeRecords();
        }
    }
    private update_charge_records(sucess: boolean, msg: string): void {
        if (sucess) {
            this.refreshdata();
        } else {
            AppGame.ins.showTips(msg);
        }
    }
    protected onEnable(): void {
        AppGame.ins.roleModel.on(MRole.UPDATE_CHARGE_RECORDS, this.update_charge_records, this);
    }
    protected onDisable(): void {
        AppGame.ins.roleModel.off(MRole.UPDATE_CHARGE_RECORDS, this.update_charge_records, this);
    }
    private refreshdata(): void {
        this.reclaimAll();
        var data = AppGame.ins.roleModel.getChargeRecords();
        data.forEach(element => {
            var item = this.getInstance();
            item.bind(element);
            this._run.push(item);
        });
        this._noNode.active = data.length == 0;
    }
}
