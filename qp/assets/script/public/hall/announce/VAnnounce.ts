import VWindow from "../../../common/base/VWindow";
import UHandler from "../../../common/utility/UHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import VAnnounceNotice from "./VAnnounceNotice";
import { UIAnnData, EAnnType, PublicNoticeItem } from "./AnnounceData";
import AppGame from "../../base/AppGame";
import MAnnounceModel from "./MAnnounceModel";
import VAnnounceLeftItem from "./VAnnounceLeftItem";
import UEventHandler from "../../../common/utility/UEventHandler";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VAnnounce extends VWindow {

    _left_itemArr: Array<VAnnounceLeftItem> = [];
    _left_item: cc.Node = null;
    _left_content: cc.Node = null;
    _title:cc.Label = null;
    _content_richText: cc.RichText = null;
    _left_bg: cc.Node = null;
    _none_data: cc.Node = null;
    _right_content: cc.Node = null;
    _publicNoticeItemData: Array<PublicNoticeItem> = [];
    private _back:cc.Node;

    private getInstance(): VAnnounceLeftItem {
        let ins = cc.instantiate(this._left_item);
        let item = ins.getComponent(VAnnounceLeftItem);
        if (!item) {
            item = ins.addComponent(VAnnounceLeftItem);
        }
        item.init();
        ins.setPosition(cc.v2(0,0));
        ins.setParent(this._left_content);
        return item;
    }

    init(): void {
        super.init();
        this._left_item = UNodeHelper.find(this._root, "left_item");
        this._left_bg = UNodeHelper.find(this._root, "mask_bg/left_bg");
        this._left_content = UNodeHelper.find(this._root, "mask_bg/left_bg/view/content");
        this._right_content = UNodeHelper.find(this._root, "mask_bg/right_content");
        this._title = UNodeHelper.getComponent(this._root,"mask_bg/right_content/view/content/title", cc.Label);
        this._content_richText = UNodeHelper.getComponent(this._root,"mask_bg/right_content/view/content/content_text", cc.RichText);
        this._none_data = UNodeHelper.find(this._root, "mask_bg/none_data");
        this._back = UNodeHelper.find(this.node,"back");
        UEventHandler.addClick(this._back,this.node,"VAnnounce","closeUI");
    }


    hide(hander?: UHandler): void {
        super.hide(hander);
       
    }

    /**
    * 显示
    */
    show(data): void {
        super.show(data);
        if(data) { // 如果有弹窗信息 直接弹窗
            this.refreshUI(data);
        } else {
            AppGame.ins.announceModel.requestGameAnnounceListData();
            AppGame.ins.showConnect(true);
        }
    }

    onclickItem(index: number) {
        this.setSelectedItem(index);
        this.refreshContentUI(index);

    }

    refreshContentUI(index: number) {
        if(this._publicNoticeItemData != null && this._publicNoticeItemData.length > 0) {
            let data = this._publicNoticeItemData[index];
            this._title.string = data!=null?data.title:"";
            this._content_richText.string = data!=null?data.content:"";
        }
    }

    setSelectedItem(index: number) {
        super.playclick();
        for (let i = 0; i < this._left_itemArr.length; i++) {
            let element = this._left_itemArr[i];
            if(index == i) {
               element.setItemCheck(true);
            } else {
               element.setItemCheck(false);
            }
        }
    }

    private initLeftItemUI() {
        this._left_content.removeAllChildren();
        this._left_itemArr = [];
        if(this._publicNoticeItemData.length > 0) {
            this._left_bg.active = true;
            this._right_content.active = true;
            this._none_data.active = false;
            for (let index = 0; index < this._publicNoticeItemData.length; index++) {
                const element = this._publicNoticeItemData[index];
                var item = this.getInstance();
                item.show();
                item.getComponent("VAnnounceLeftItem").initItemInfo(index, index == 0?true:false, element, this);
                this._left_itemArr.push(item);
            }
        } else {
            this._right_content.active = false;
            this._left_bg.active = false;
            this._none_data.active = true;
        }
    }

    private refreshUI(index: number): void {
        this._publicNoticeItemData = AppGame.ins.announceModel.getPublicNoticeListData();
        this.initLeftItemUI();
        this.onclickItem(index);
    }

    private update_announce_list(sucess: boolean, msg: string): void {
        if (sucess)
            this.refreshUI(0);
        else {
            AppGame.ins.showTips(msg);
        }
    }
    closeUI(){
        this.playclick();
        super.clickClose();
    }

    protected onEnable(): void {
        AppGame.ins.announceModel.on(MAnnounceModel.UPDATE_ANNOUNCE_LIST, this.update_announce_list, this);
    }

    protected onDisable(): void {
        AppGame.ins.announceModel.off(MAnnounceModel.UPDATE_ANNOUNCE_LIST, this.update_announce_list, this);
    }
}
