import VActivityItem from "./VActivityItem";
import { UIActivityCopyData } from "./ActivityData";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import AppGame from "../../base/AppGame";
import ULanHelper from "../../../common/utility/ULanHelper";
import { ECommonUI } from "../../../common/base/UAllenum";



const { ccclass, property } = cc._decorator;

@ccclass
export default class VCopyActivity extends VActivityItem {
    private _data: UIActivityCopyData;
    private _url: cc.Label;

    init(): void {
        var btn = UNodeHelper.find(this.node, "btn_yjlq");
        this._url = UNodeHelper.getComponent(this.node, "url", cc.Label);
        UEventHandler.addClick(btn, this.node, "VCopyActivity", "oncopy");
        UEventHandler.addClick(this.node,this.node,"VCopyActivity","openProxy");
    }
    bind(data: UIActivityCopyData): void {
        super.bind(data);
        this._data = data;
        this._url.string = data.url;
    }
    private oncopy(): void {
        if (UAPIHelper.writeCliboad(this._data.url)) {
            AppGame.ins.showTips(ULanHelper.COPY_SUCESS);
        }
    }

    private openProxy():void{
        AppGame.ins.showUI(ECommonUI.LB_Proxy);
    }
}
