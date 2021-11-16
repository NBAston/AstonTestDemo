import VWindow from "../../../common/base/VWindow";
import VChargeRecordsBtn from "./VChargeRecordsBtn";
import UNodeHelper from "../../../common/utility/UNodeHelper";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VChargeRecords extends VWindow {
    private _allBtns: Array<VChargeRecordsBtn>;
    init(): void {
        super.init();
        this._allBtns = [];
        var btns = UNodeHelper.find(this._root, "btns");
        btns.children.forEach(element => {
            var item = element.getComponent(VChargeRecordsBtn);
            item.init();
            item.IsOn = false;
            this._allBtns.push(item);
        });
    }
    /**
    * 显示
    */
    show(data: any): void {
        super.show(data);
        this._allBtns[0].IsOn = true;
    }
}
