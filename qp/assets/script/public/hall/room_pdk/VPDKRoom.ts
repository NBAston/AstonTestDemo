import VZJHRoom from "../room_zjh/VZJHRoom";
import AppGame from "../../base/AppGame";
import { ECommonUI, EGameType } from "../../../common/base/UAllenum";
import UDebug from "../../../common/utility/UDebug";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VPDKRoom extends VZJHRoom {
    onLoad(){
        UDebug.log("onLoad");
    }
    show(data: any): void {
        UDebug.log("show_______________");
        super.show(data);
    }

    init() {
        UDebug.log("init_______________");
        super.init();
    }
}
