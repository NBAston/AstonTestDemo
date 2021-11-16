import UHandler from "../../../common/utility/UHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventListener from "../../../common/utility/UEventListener";
import UResManager from "../../../common/base/UResManager";
import AppGame from "../../base/AppGame";
import { ECommonUI, EIconType } from "../../../common/base/UAllenum";


const { ccclass } = cc._decorator;

/*
 * 作用:客服列表子项
 */
@ccclass
export default class V_Transfer_Record_Item extends cc.Component {
   

    private _type: cc.Label;
    private _userid: cc.Label;
    private _time: cc.Label;
    private _changeNumber: cc.Label;
    private _leftNumber: cc.Label;


    init(): void {
        this._type = UNodeHelper.getComponent(this.node, "type", cc.Label);
        this._time = UNodeHelper.getComponent(this.node, "time", cc.Label);
        this._changeNumber = UNodeHelper.getComponent(this.node, "change/number", cc.Label);
        this._leftNumber = UNodeHelper.getComponent(this.node, "left/number", cc.Label);
        this._userid = UNodeHelper.getComponent(this.node, "userid/title", cc.Label);
    }

    show(data: any): void {
        this._time.string = data.createTime;
        this._userid.string =  data.anotherInfo;
        var color = cc.Color.BLACK;
        this._changeNumber.string = (data.addRoomCard / 100).toFixed(2)
        this._leftNumber.string = (data.afterRoomCard / 100).toFixed(2)
        this._changeNumber.node.color = data.addRoomCard <= 0 ? color.fromHEX("#32A07C") : color.fromHEX("#CC5516")
        if (data.changeType == 15){
            this._type.string = "转出房卡"
        }
        else if (data.changeType == 14){
            this._type.string = "转入房卡"
        }
        this.node.active = true;
    }

    hide(): void {
        this.node.active = false;
    }

}
