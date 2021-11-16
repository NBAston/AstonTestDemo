import VZJHRoom from "../room_zjh/VZJHRoom";
import AppGame from "../../base/AppGame";
import { ECommonUI, EGameType } from "../../../common/base/UAllenum";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VTBNNRoom extends VZJHRoom {
    // protected openhelp(): void {
    //     AppGame.ins.showUI(ECommonUI.ZJH_Help, {gameType: EGameType.TBNN});
    // }
}
