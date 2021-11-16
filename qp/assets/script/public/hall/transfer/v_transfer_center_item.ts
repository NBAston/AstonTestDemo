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
export default class V_Transfer_Center_Item extends cc.Component {
   
    private _head: cc.Sprite;
    private _frame: cc.Sprite;
    private _name: cc.Label;
    private _userid: cc.Label;
    private _btnTransfer:cc.Node;
    private _data:any


    init(): void {
        this._head = UNodeHelper.getComponent(this.node, "head", cc.Sprite);
        this._frame = UNodeHelper.getComponent(this.node, "head/frame", cc.Sprite);
        this._name = UNodeHelper.getComponent(this.node, "name", cc.Label);
        this._userid = UNodeHelper.getComponent(this.node, "userid", cc.Label);
        this._btnTransfer = UNodeHelper.find(this.node,"commit")
        UEventListener.get(this._btnTransfer).onClick = new UHandler(this.onClickTransfer, this);
    }

    show(data: any): void {
        this._name.string = data.nickName;
        this._userid.string = data.userId;
        UResManager.load(data.headId, EIconType.Head, this._head);
        UResManager.load(data.headboxId, EIconType.Frame, this._frame)
        this.node.active = true;
        this._data = data
    }

    hide(): void {
        this.node.active = false;
    }

    onClickTransfer(){
        var data ={
            nickName: this._name.string,
            userId: this._userid.string,
            roomCard: AppGame.ins.roleModel.roomCard
        }
        AppGame.ins.showUI(ECommonUI.UI_TRANSFER_POP,data)
        AppGame.ins.friendsRoomCardModel.transferUserInfo = this._data
    }
}
