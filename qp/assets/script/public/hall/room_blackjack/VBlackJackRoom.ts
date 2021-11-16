import VZJHRoom from "../room_zjh/VZJHRoom";
import AppGame from "../../base/AppGame";
import { ECommonUI, EGameType } from "../../../common/base/UAllenum";
import VTablePerson from "./VTablePerson";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import USpriteFrames from "../../../common/base/USpriteFrames";
import UAudioManager from "../../../common/base/UAudioManager";


const { ccclass, property } = cc._decorator;

/**
 * 创建:sq
 * 功能:21点房间
 */
@ccclass
export default class VBlackJackRoom extends VZJHRoom {

    /**
     * 桌子人物
     */
    private _tablePersion: Array<VTablePerson>;
    /**
     * 资源
     */
    //private _res: USpriteFrames;
    protected openhelp(): void {
        // AppGame.ins.showUI(ECommonUI.BJ_Help);
    }
    protected openrecord(): void {
        // AppGame.ins.showUI(ECommonUI.BJ_Records, this._gameType);
    }

    init(): void {
        super.init();
        // this._res = this.node.getComponent(USpriteFrames);
        // this._tablePersion = [];
        // for (let i = 1; i < 5; i++) {
        //     let node = UNodeHelper.find(this.node, "black_room_table_" + i);
        //     let com = node.getComponent(VTablePerson);
        //     if (!com) {
        //         com = node.addComponent(VTablePerson);
        //     }
        //     com.init(this._res);
        //     this._tablePersion.push(com);
        // }
    }

    private on_wanfa(): void {
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.showUI(ECommonUI.ZJH_Help, {gameType: EGameType.BJ});
    }

}
