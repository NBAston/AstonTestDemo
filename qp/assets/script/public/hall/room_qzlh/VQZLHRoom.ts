import VZJHRoom from "../room_zjh/VZJHRoom";
import AppGame from "../../base/AppGame";
import { ECommonUI, EGameType } from "../../../common/base/UAllenum";

const { ccclass, property } = cc._decorator;
/**
 * 创建:sq
 * 作用:抢庄龙虎房间
 */
@ccclass
export default class VQZLHRoom extends VZJHRoom {
    // protected openhelp(): void {
    //     AppGame.ins.showUI(ECommonUI.ZJH_Help, {gameType: EGameType.QZLH});
    // }
    protected openrecord(): void {
        AppGame.ins.showUI(ECommonUI.BRLH_Records, this._gameType);
    }
}
