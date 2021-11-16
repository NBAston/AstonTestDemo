
import UEventHandler from "../../../common/utility/UEventHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import { PublicNoticeItem } from "./AnnounceData";
import VAnnounce from "./VAnnounce";
const {ccclass, property} = cc._decorator;

@ccclass
export default class VAnnounceLeftItem extends cc.Component {

    _icon: cc.Sprite = null;
    _title: cc.Label = null;
    _range: cc.Label = null;
    _checkmark: cc.Node = null;
    _manager: VAnnounce;
    _index: number;
    _payType: number;


    init() {
        UEventHandler.addClick(this.node, this.node, "VAnnounceLeftItem", "onclickItem");
        this._checkmark = UNodeHelper.find(this.node, "checkmark");
        this._title = UNodeHelper.find(this.node, "title").getComponent(cc.Label);
    }

    /**
     * @param index 索引
     * @param isCheck 是否选中
     * @param noticeItem PublicNoticeItem
     * @param manager 
     */
    initItemInfo(index: number, isCheck: boolean, noticeItem: PublicNoticeItem, manager: VAnnounce): void {
        this._title.string = noticeItem.title;
        this.setItemCheck(isCheck);
        this._manager = manager;
        this._index = index;
        this.node.active = true;
    }

    setItemCheck(isCheck: boolean) {
        this._checkmark.active = isCheck;
        if(isCheck) {
            var color = new cc.Color(255, 255, 255);
            this._title.node.color = color;
        } else {
            var color2 = new cc.Color(164, 116, 51);
            this._title.node.color = color2;
        }
    }

    hide(): void {
        this.node.active = false;
    }

    show(): void {
        this.node.active = true;
    }

    onclickItem() {
        this._manager.onclickItem(this._index);
    }

}
