import VZJHRoom from "../room_zjh/VZJHRoom";
import AppGame from "../../base/AppGame";
import { ECommonUI } from "../../../common/base/UAllenum";


const {ccclass, property} = cc._decorator;

@ccclass
export default class VEBGRoom extends VZJHRoom {

    protected openhelp(): void {
        AppGame.ins.showUI(ECommonUI.EBG_Help);
    }
    protected openrecord(): void {
        AppGame.ins.showUI(ECommonUI.EBG_Record, this._gameType);
    }
    
}
