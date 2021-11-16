import VZJHRoom from "../room_zjh/VZJHRoom";
import AppGame from "../../base/AppGame";
import { ECommonUI } from "../../../common/base/UAllenum";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VSHRoom extends VZJHRoom {
    // protected openhelp(): void {
    //     AppGame.ins.showUI(ECommonUI.SH_Help);
    // }
}
