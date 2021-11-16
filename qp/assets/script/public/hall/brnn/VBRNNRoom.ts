import VZJHRoom from "../room_zjh/VZJHRoom";
import { ECommonUI } from "../../../common/base/UAllenum";
import AppGame from "../../base/AppGame";

const { ccclass, property } = cc._decorator;
/**
 * 创建:sq
 * 功能:百人牛牛
 */
@ccclass
export default class VBRNNRoom extends VZJHRoom {

    protected openhelp(): void {
        AppGame.ins.showUI(ECommonUI.BRNN_Help);
    }
    protected openrecord(): void {
        AppGame.ins.showUI(ECommonUI.BRNN_Record, this._gameType);
    }
}
