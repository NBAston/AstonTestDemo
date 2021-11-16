import UHandler from "../../../common/utility/UHandler";
import UResManager from "../../../common/base/UResManager";
import { ECommonUI, EIconType } from "../../../common/base/UAllenum";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../base/AppGame";
import UEventHandler from "../../../common/utility/UEventHandler";
import VWindow from "../../../common/base/VWindow";
import { Vlb_service_data } from "./Vlb_service_data";
import VHall from "../lobby/VHall";
import { EventManager } from "../../../common/utility/EventManager";
import VChat from "../lb_chat/Vlb_chat";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import UStringHelper from "../../../common/utility/UStringHelper";
import cfg_avatar from "../../../config/cfg_avatar";
import UAudioManager from "../../../common/base/UAudioManager";
import cfg_event from "../../../config/cfg_event";

const { ccclass, property } = cc._decorator;

/**
 * 创建:sq
 * 作用:客服列表子项
 */
@ccclass
export default class VServiceItem extends cc.Component {

    private _service_data_item :Object;
 
    _messageRevoke = "F04A63";

    private _icon : cc.Node;
    private _nickName : cc.Label;
    private _min: any;
    private _serviceType : string;  //charge   excharge   activity
    private _chatMark: cc.Node;
    private btnCommit: cc.Node;

    init(): void {     
        this._icon = UNodeHelper.find(this.node, "face");
        this._chatMark = UNodeHelper.find(this.node, "commit/redicon");
        this._nickName =  UNodeHelper.getComponent(this.node, "name", cc.Label);
        this.btnCommit = UNodeHelper.find(this.node, "commit");
        UEventHandler.addClick(this.btnCommit, this.node, "Vlb_service_item", "onCommit");
    }

    // commitCallBack() {
        
    // }

    onCommit(){
        UAudioManager.ins.playSound("audio_click");
        AppGame.ins.closeUI(ECommonUI.LB_Service_Mail);
        AppGame.ins.showUI(ECommonUI.LB_Chat, this._service_data_item);
    }

    bind(service_data_item: {}): void {
        this._service_data_item = service_data_item;
        let reverUrl = UStringHelper.charAtReverse(service_data_item["avatar"]);
        let url = cfg_avatar[parseInt(reverUrl[4])-1];
        UResManager.loadUrl(url,  this._icon.getComponent(cc.Sprite));
        this._nickName.string = service_data_item["nickname"];
        this.refreshChatMark();
        this.node.active = true;
    }

    refreshChatMark() {
        AppGame.ins.selfChatMsg.chatInfoArr.forEach(element => {
            let self = this;
            if (element.msgId == self._service_data_item["name"]) {
                if (element.unread>0) {
                    self._chatMark.active = false;
                } else {
                    self._chatMark.active = false;
                }
            }
        });
    }

    onEnable() {
        EventManager.getInstance().addEventListener(cfg_event.REFRESH_MSG_MARK, this.refreshChatMark.bind(this), this);
    }

    onDisable() {
        EventManager.getInstance().removeEventListener(cfg_event.REFRESH_MSG_MARK, this.refreshChatMark.bind(this), this);
    }

    reset(): void {
        this.node.active = false;
    }

    onDestroy() {

    }
}
