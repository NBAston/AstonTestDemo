import VZJHRoom from "../room_zjh/VZJHRoom";
import AppGame from "../../base/AppGame";
import { ECommonUI, EGameType } from "../../../common/base/UAllenum";


const { ccclass, property } = cc._decorator;
/**
 * 创建:sq
 * 作用:抢庄牛牛房间
 */
@ccclass
export default class VQZNNRoom extends VZJHRoom {

    // protected openhelp(): void {
    //     AppGame.ins.showUI(ECommonUI.ZJH_Help, {gameType: EGameType.QZNN});
    // }
    protected openrecord(): void {
        AppGame.ins.showUI(ECommonUI.QZNN_Record, this._gameType);
    }
}
