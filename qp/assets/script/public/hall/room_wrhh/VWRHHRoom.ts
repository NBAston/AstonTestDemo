import VZJHRoom from "../room_zjh/VZJHRoom";
import AppGame from "../../base/AppGame";
import { ECommonUI, EGameType } from "../../../common/base/UAllenum";


const {ccclass, property} = cc._decorator;
/**
 * 创建:sq
 * 作用:红黑大战房间
 */
@ccclass
export default class VWRHHRoom extends VZJHRoom {
    // protected openhelp(): void {
    //     AppGame.ins.showUI(ECommonUI.ZJH_Help, {gameType: EGameType.QZLH});
    // }
}
