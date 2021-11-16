import VZJHRoom from "../room_zjh/VZJHRoom";
import AppGame from "../../base/AppGame";
import { ECommonUI, EGameType } from "../../../common/base/UAllenum";


const { ccclass, property } = cc._decorator;
/**
 * 创建:sq
 * 作用:三公房间
 */
@ccclass
export default class VSGRoom extends VZJHRoom {

    // protected openhelp(): void {
    //     AppGame.ins.showUI(ECommonUI.ZJH_Help, {gameType: EGameType.SG});
    // }
    protected openrecord(): void {
        AppGame.ins.showUI(ECommonUI.SG_Records, this._gameType);
    }
}
