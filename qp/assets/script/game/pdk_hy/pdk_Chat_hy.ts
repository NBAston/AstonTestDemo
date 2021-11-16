import VWindow from "../../common/base/VWindow";
import AppGame from "../../public/base/AppGame";

import UEventHandler from "../../common/utility/UEventHandler";
import pdk_Main_hy from "./pdk_Main_hy";
import UResManager from "../../common/base/UResManager";
import {EIconType} from "../../common/base/UAllenum";
import { ChatMsgType, ReceiveChairidType } from "./poker/PDKEnum_hy";
import UPDKHelper_hy from "./pdk_Helper_hy";

const {ccclass, property} = cc._decorator;

@ccclass
export default class pdk_Chat_hy extends VWindow {

    @property(cc.EditBox) editBox: cc.EditBox = null;
    @property(cc.Node) content: cc.Node = null;
    @property(cc.Node) toggleContainer: cc.Node = null;
    @property(cc.Node) view1Content: cc.Node = null;
    @property(cc.Node) view2Content: cc.Node = null;
    @property(cc.Node) view3Content: cc.Node = null;
    @property(cc.Node) view3Item: cc.Node = null;
    @property(cc.ScrollView) view3ScrollView: cc.ScrollView = null;

    onLoad(){
        // this.closeView();
        AppGame.ins.fPdkModel.on(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_CHAT_MESSAGE, this.onNotifyChatInfo, this);
    }

    onDestroy(){
        AppGame.ins.fPdkModel.off(UPDKHelper_hy.PDK_EVENT.PDK_NOTIFY_CHAT_MESSAGE, this.onNotifyChatInfo, this);
    }
    start() {
        for (let i=0;i<this.view1Content.childrenCount;i++){
            UEventHandler.addClick(this.view1Content.children[i], this.node, "pdk_Chat_hy", "onClickEnumerateItem");
        }
        for (let i=0;i<this.view2Content.childrenCount;i++){
            let itemList = this.view2Content.children[i];
            for (let k=0;k<itemList.childrenCount;k++){
                UEventHandler.addClick(itemList.children[k], this.node, "pdk_Chat_hy", "onClickEmojEnumerateItem");
            }
        }

    }

    onEnable() {
        // this.toggleContainer.children[0].getComponent(cc.Toggle).isChecked = true;
        // this.showContent(0);
    }

    /**点击左边菜单 */
    public onClickLeftToggle(t: any, customData: string) {
        this.showContent(parseInt(customData));
    }

    /**点击发送消息 */
    onClickSendMsg() {
        if (this.editBox.string.length < 1) {
            AppGame.ins.showTips('请输入内容!');
            return;
        }
        this.sendMsg(this.editBox.string+"");
        this.editBox.string = "";
    }

    onClickEnumerateItem(evt){
        let chatMsg = evt.target.getChildByName("label").getComponent(cc.Label).string;
        this.sendMsg(chatMsg);
        this.closeView();
    }

    onClickEmojEnumerateItem(evt){
        let emojName = `emoj_${evt.target.getChildByName("chat").getComponent(cc.Sprite).spriteFrame.name.split("_emoj_")[1]}`;
        this.sendEmoj(emojName);
        this.closeView();
    }

    sendEmoj(emojName){
        AppGame.ins.fPdkModel.onSendChartMessage(AppGame.ins.fPdkModel.gMeChairId, ReceiveChairidType.PDK_CHAT_RECEIVE_CHAIRID_ALL,ChatMsgType.PDK_CHAT_TYPE_EMOJ,emojName);
    }

    sendMsg(voiceText){
        AppGame.ins.fPdkModel.onSendChartMessage(AppGame.ins.fPdkModel.gMeChairId, ReceiveChairidType.PDK_CHAT_RECEIVE_CHAIRID_ALL,ChatMsgType.PDK_CHAT_TYPE_TEXT,voiceText);
    }

    closeView(){
        this.node.parent.active = false;
    }
    // 聊天消息通知
    private onNotifyChatInfo(message: any): void {
        let data = message.chartmessage;
        if(data.msgtype == ChatMsgType.PDK_CHAT_TYPE_TEXT) {
            let item = cc.instantiate(this.view3Item);
            item.active = true;
            for (let i=0;i<pdk_Main_hy.ins.playerList.length;i++){
                if(pdk_Main_hy.ins.playerList[i].chairId == Number(data.sendchairid)){
                    UResManager.load(this.findHeadId(pdk_Main_hy.ins.playerList[i].chairId), EIconType.Head, item.getChildByName("head").getComponent(cc.Sprite));
                    item.getChildByName("id").getComponent(cc.Label).string = `${pdk_Main_hy.ins.playerList[i].userid.string}`;
                    break;
                }
            }
            if(data.msgtype == ChatMsgType.PDK_CHAT_TYPE_EMOJ) {
                let emoji = item.getChildByName("emoj");
                emoji.active = true;
                UResManager.loadUrl(`common/texture/game_chat/game_chat_emoj/game_${data.msgbody}`, emoji.getComponent(cc.Sprite));
            } else if(data.msgtype == ChatMsgType.PDK_CHAT_TYPE_TEXT) {
                let rich = item.getChildByName("richText");
                let richText = rich.getComponent(cc.RichText);
                richText.maxWidth = 428;
                rich.active = true;
                richText.string = data.msgbody;
                let txtHeight = Math.ceil(data.msgbody.length / 17) * 42;
                item.height = txtHeight > item.height ? txtHeight : item.height;
    
            }
            this.view3Content.addChild(item);
            if(!this.view3ScrollView.isScrolling()){
                this.view3ScrollView.scrollToBottom();
            }
        }
    }
    findHeadId (chairId):any{
        for (const key in pdk_Main_hy.ins.playerDataList){
            let element =  pdk_Main_hy.ins.playerDataList[key];
            if (element.chairId == chairId) {
                return element.headId
            }
        }
        return null;
    }
    /**展示聊天面板 */
    showContent(index: number) {
        for (let i = 0; i < this.content.childrenCount; i++) {
            let node = this.content.children[i];
            node.active = false;
            if (i == index) {
                node.active = true;
            }
        }
    }
}
