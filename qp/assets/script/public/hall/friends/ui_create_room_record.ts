
import VWindow from "../../../common/base/VWindow";
import UDebug from "../../../common/utility/UDebug";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../base/AppGame";
import MRoomModel from "../room_zjh/MRoomModel";
import VCreateRecordItem from "./ui_create_record_item";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ui_create_room_record extends VWindow {

    private _nothing: cc.Node;
    private _prefab: cc.Node;
    private _parent: cc.Node;

    init():void{
        super.init();
        this._prefab = UNodeHelper.find(this._root, "scrollView/item");
        this._parent = UNodeHelper.find(this._root, "scrollView/view/content");
        this._nothing = UNodeHelper.find(this._root, "default_node");
    }

    onEnable(){
        AppGame.ins.roomModel.on(MRoomModel.UPDATA_FRIEND_CREATE_RECORDS, this.updateRecordList, this);
    }

    onDisable(){
        AppGame.ins.roomModel.on(MRoomModel.UPDATA_FRIEND_CREATE_RECORDS, this.updateRecordList, this);
    }

    show(data:any){
        super.show(data)
        this.refreshRecord()
    }

    //获得一个约牌记录实例
    private getInstance(): VCreateRecordItem {
        let ins = cc.instantiate(this._prefab);
        let item = ins.getComponent(VCreateRecordItem);
        if (!item) {
            item = ins.addComponent(VCreateRecordItem);
        }
        ins.setParent(this._parent);
        item.init();
        return item;
    }

    //刷新约牌记录列表
    private updateRecordList(data:any): void{
        if (!data || data.length == 0){
            this._nothing.active =  true;
            return
        } 
        data.forEach(element => {
            var item = this.getInstance();
            item.bind(element);
        });
        this._nothing.active =  false;
    }

    //重新查询数据
    refreshRecord(){
        //重置之前数据
        this._parent.removeAllChildren()
        //发求请求
        AppGame.ins.roomModel.requestCreateRoomRcord()
    }

}
