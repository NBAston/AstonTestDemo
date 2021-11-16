import USubManager from "../../hotupdate/USubManager";
import cfg_game from "../../../config/cfg_game";
import AppGame from "../../base/AppGame";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VUpdateTips extends cc.Component {

    protected onEnable(): void {
        USubManager.ins.on(USubManager.UpdaterEvent.UPDATE_FINISHED, this.update_complete, this);
    }
    protected onDisable(): void {
        USubManager.ins.off(USubManager.UpdaterEvent.UPDATE_FINISHED, this.update_complete, this);
    }
    private update_complete(caller: number): void {
        var cfg=cfg_game[caller];
        if(cfg)
        {
            AppGame.ins.showTips(`${cfg.gameName}更新完毕`);
        }
    }

}
