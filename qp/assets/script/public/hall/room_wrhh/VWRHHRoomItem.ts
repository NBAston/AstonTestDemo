import VZJHRoomItem from "../room_zjh/VZJHRoomItem";
import { UZJHRoomItem } from "../../../common/base/UAllClass";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VBRHHRoomItem extends VZJHRoomItem {
    /**
        * 绑定数据
        * @param data 
        */
    bind(data: UZJHRoomItem): void {
        // this._zizhu.string = data.dizu.toString();
        this._data = data;
    }
}
