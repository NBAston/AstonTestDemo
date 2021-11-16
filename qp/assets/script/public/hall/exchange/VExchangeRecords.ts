import VWindow from "../../../common/base/VWindow";
import VExchangeRecordsItem from "./VExchangeRecordsItem";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../base/AppGame";
import MRole from "../lobby/MRole";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VExchangeRecords extends VWindow {


    /**
     * 头像预制
     */
    private _prefab: cc.Node;
    /**
     * 根对象
     */
    private _parent: cc.Node;

    private _pool: Array<VExchangeRecordsItem>;

    private _noNode: cc.Node;

    private _run: Array<VExchangeRecordsItem>;

    private getInstance(): VExchangeRecordsItem {
        if (this._pool.length > 0) {
            var it = this._pool.shift();
            it.node.setParent(this._parent);
            return it;
        }
        let ins = cc.instantiate(this._prefab);
        let item = ins.getComponent(VExchangeRecordsItem);
        if (!item) {
            item = ins.addComponent(VExchangeRecordsItem);
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
    init(): void {
        super.init();
        this._pool = [];
        this._run = [];
        this._prefab = UNodeHelper.find(this._root, "item");
        this._parent = UNodeHelper.find(this._root, "content/all/view/content");
        this._noNode = UNodeHelper.find(this._root, "nonode");
    }
    /**
  * 显示
  */
    show(data: any): void {
        super.show(data);
        if (AppGame.ins.roleModel.requesetExchangeRecords()) {
            this.scheduleOnce(() => {
                AppGame.ins.showConnect(false);
            }, 5);
        }
    }
    protected onEnable(): void {
        AppGame.ins.roleModel.on(MRole.UPDATE_EXCHARGE_RECORDS, this.update_exchargerecords, this);
    }
    protected onDestroy(): void {
        AppGame.ins.roleModel.off(MRole.UPDATE_EXCHARGE_RECORDS, this.update_exchargerecords, this);
        this.unscheduleAllCallbacks();
        AppGame.ins.showConnect(false);
    }
    private update_exchargerecords(sucess: boolean, msg): void {
        this.unscheduleAllCallbacks();
        if (sucess) {
            this.refreshdata();
        } else {
            AppGame.ins.showTips(msg);
        }
    }
    private refreshdata(): void {
        var dt = AppGame.ins.roleModel.getExChargeRecords();
        dt.forEach(element => {
            var item = this.getInstance();
            item.bind(element);
            this._run.push(item);
        });
        this._noNode.active = dt.length == 0;
    }
}
