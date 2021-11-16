import VAnnounceSelect from "./VAnnounceSelect";
import VGMItem from "./VGMItem";
import AppGame from "../../base/AppGame";
import UNodeHelper from "../../../common/utility/UNodeHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VQQGm extends VAnnounceSelect {


    private _parentGM: cc.Node;
    private _prefabGM: cc.Node;
    private _poolGM: Array<VGMItem>;
    private _runGM: Array<VGMItem>;


    private getInstanceGM(): VGMItem {
        if (this._poolGM.length > 0) {
            var it = this._poolGM.shift();
            it.node.setParent(this._parentGM);
            return it;
        }
        let ins = cc.instantiate(this._prefabGM);
        let item = ins.getComponent(VGMItem);
        if (!item) {
            item = ins.addComponent(VGMItem);
        }
        item.init();
        ins.setParent(this._parentGM);
        return item;
    }
    private reclaimAllGM(): void {
        let len = this._runGM.length;
        for (let index = 0; index < len; index++) {
            let element = this._runGM[index];
            element.hide();
            element.node.parent = null;
            this._poolGM.push(element);
        }
        this._runGM = [];
    }
    protected isOnafter(): void {
        super.isOnafter();
        if (this.IsOn) {
            // this.reclaimAllGM();
            // var gmdata = AppGame.ins.LoginModel.LoginData.QQ;
            // gmdata.forEach(element => {
            //     var item = this.getInstanceGM();
            //     item.bind(element);
            //     this._runGM.push(item);
            // });
        }
    }
    init(): void {
        this._poolGM = [];
        this._runGM = [];
        this._prefabGM = UNodeHelper.find(this.content, "node1");
        this._parentGM = UNodeHelper.find(this.content, "");
    }
}
