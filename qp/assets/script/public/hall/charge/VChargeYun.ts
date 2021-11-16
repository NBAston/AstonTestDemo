import VChargeWeb from "./VChargeWeb";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventListener from "../../../common/utility/UEventListener";
import UHandler from "../../../common/utility/UHandler";
import cfg_global from "../../../config/cfg_global";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VChargeYun extends VChargeWeb {

    init(): void {
        super.init();
        var btn = UNodeHelper.find(this.contentRoot, "btn_down");
        UEventListener.get(btn).onClick = new UHandler(this.onclickback, this);
    }
    private onclickback(): void {
        cc.sys.openURL(cfg_global.yundown_url);
    }
}
