import UScene from "../../common/base/UScene";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventHandler from "../../common/utility/UEventHandler";
import UEventListener from "../../common/utility/UEventListener";
import UHandler from "../../common/utility/UHandler";
import AppGame from "../../public/base/AppGame";
import { ELevelType } from "../../common/base/UAllenum";

const {ccclass, property} = cc._decorator;

@ccclass
export default class VZJH2_hy extends UScene {
    protected init(): void {
        
    }

    @property(cc.Node)
    label: cc.Node = null;

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start () {
        UEventListener.get(this.label).onClick=new UHandler(()=>{
            AppGame.ins.loadLevel(ELevelType.Login,true);
        },this);
    }

    // update (dt) {}
}
