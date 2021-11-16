import { Bcbm } from "../../common/cmd/proto";
import UDebug from "../../common/utility/UDebug";
import UNodeHelper from "../../common/utility/UNodeHelper";
import AppGame from "../../public/base/AppGame";
import MBcbm from "./model/MBcbm";

const {ccclass, property} = cc._decorator;

@ccclass
export default class BcbmDeskManager extends cc.Component {
    public _lightPos = [];
    public _lightPos2 = [];
    public _lightPos3 = [];
    public _lightPos3a = [];
    public _lightPos3b = [];
    public _lightPos3c = [];
    public _lightPos3d = [];
    public _lightPos3e = [];
    public _lightAllPos = [];
    private _lightNum : number;
    private _bcbm_model:MBcbm;
    private _records = [];
    
    onLoad () {
        this._lightNum = 28;
        this.initModelEventListener();
        this.setLightPos();
    }

    onDestroy() {
        this.removeModelEventListener();
        this._bcbm_model = null;
    }

    initModelEventListener() {
        this._bcbm_model = AppGame.ins.bcbmModel;
        this._bcbm_model.on(MBcbm.S_SEND_RECORD, this.onGameRecord, this);
        this._bcbm_model.on(MBcbm.S_GAME_END, this.onGameEnd, this);
    }

    private removeModelEventListener() {
        this._bcbm_model.off(MBcbm.S_SEND_RECORD, this.onGameRecord, this);
        this._bcbm_model.off(MBcbm.S_GAME_END, this.onGameEnd, this);
    }

    //初始化light坐标
    setLightPos() :void {
        let lightRoot  = UNodeHelper.find(this.node, "node_circle_logo");
        let lightRoot2  = UNodeHelper.find(this.node, "node_car");
        let node_car_position  = UNodeHelper.find(this.node, "node_car_position");
        for (let index = 0; index < this._lightNum; index++) {
            let lightName = "bcbm_carlogo" + (index);
            let lightNamea = "bcbm_carlogo" + (index) + "a";
            let lightNameb = "bcbm_carlogo" + (index) + "b";
            let lightNamec = "bcbm_carlogo" + (index) + "c";
            let lightNamed = "bcbm_carlogo" + (index) + "d";
            let lightNamee = "bcbm_carlogo" + (index) + "e";
            let light = UNodeHelper.find(lightRoot, lightName);
            let light2 = UNodeHelper.find(lightRoot2, lightName);

            let light3 = UNodeHelper.find(node_car_position, lightName);
            let light3a = UNodeHelper.find(node_car_position, lightNamea);
            let light3b = UNodeHelper.find(node_car_position, lightNameb);
            let light3c = UNodeHelper.find(node_car_position, lightNamec);
            let light3d = UNodeHelper.find(node_car_position, lightNamed);
            let light3e = UNodeHelper.find(node_car_position, lightNamee);

            this._lightPos.push(light.position);
            this._lightPos2.push(light2.position);
            this._lightPos3.push(light3.position);
            this._lightPos3a.push(light3a.position);
            this._lightPos3b.push(light3b.position);
            this._lightPos3c.push(light3c.position);
            this._lightPos3d.push(light3d.position);
            this._lightPos3e.push(light3e.position);
            this._lightAllPos.push(light3.position,light3a.position,light3b.position,light3c.position,light3d.position,light3e.position);
        }
    }

    getLightBlinkNode() :cc.Node{
        let lightBlinkNode :cc.Node=  UNodeHelper.find(this.node, "node_circle_logo/bcbm_carlogo_light");
        return lightBlinkNode;
    }
    getLightBlinkNode2() :cc.Node{
        return this.node.getChildByName("node_car").getChildByName("bcbm_carlogo_light");
    }

    start () {

    }
 
    /**通知监听回调函数 start */
    onGameRecord(data: Bcbm.GameOpenRecord) {
        UDebug.log('BcbmDeskManager:onGameRecord' + data);
        //刷新游戏记录
    }

    onGameEnd(data: Bcbm.CMD_S_GameEnd) {
        // this.
    }
    /**通知监听回调函数 end */
    // update (dt) {}
}