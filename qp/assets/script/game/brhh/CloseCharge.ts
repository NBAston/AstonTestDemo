

import { ECommonUI } from "../../common/base/UAllenum";
import { EventManager } from "../../common/utility/EventManager";
import UEventHandler from "../../common/utility/UEventHandler";
import UNodeHelper from "../../common/utility/UNodeHelper";
import cfg_event from "../../config/cfg_event";
import AppGame from "../../public/base/AppGame";

const {ccclass, property} = cc._decorator;

@ccclass
export default class CloseCharge extends cc.Component {

    private _game_watch_limit_score:number = 3000;
    private _charge_btn:cc.Node;

    onLoad () {

    }

    start () {

    }
    
    //判读玩家的金币余额能否进入游戏房间
    checkEnterMinScore(a:number):void{
        if(a < this._game_watch_limit_score){
            this.node.active = true;
        }else{
            this.node.active = false;
        }
    }

    closeCheckNode():void{
        this.node.active = false;
    }

        
    private intoCharge():void{
        AppGame.ins.showUI(ECommonUI.LB_Charge);
    }

    private initModelEventListener() {
        // EventManager.getInstance().addEventListener(cfg_event.CLOSE_CHARGE, this.closeCheckNode, this);
    }

    
    private removeModelEventListener() {
        // EventManager.getInstance().removeEventListener(cfg_event.CLOSE_CHARGE, this.closeCheckNode, this);
    }

    onDestroy() {
        this.removeModelEventListener();
    }

    protected onEnable():void{
        this.checkEnterMinScore(AppGame.ins.roleModel.score);
        this.initModelEventListener();
        this._charge_btn = UNodeHelper.find(this.node,"chargeBtn");
        UEventHandler.addClick(this._charge_btn,this.node,"CloseCharge","intoCharge");
    }

    protected onDisable():void{
        
    }

    // update (dt) {}
}
