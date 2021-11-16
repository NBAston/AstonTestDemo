import Model from "../../../../common/base/Model";
import { ERoomKind, InformMessageType } from "../../../../common/base/UAllenum";
import UAudioManager from "../../../../common/base/UAudioManager";
import UResManager from "../../../../common/base/UResManager";
import VWindow from "../../../../common/base/VWindow";
import UDebug from "../../../../common/utility/UDebug";
import UEventHandler from "../../../../common/utility/UEventHandler";
import UHandler from "../../../../common/utility/UHandler";
import ULanHelper from "../../../../common/utility/ULanHelper";
import UNodeHelper from "../../../../common/utility/UNodeHelper";
import { cfg_InGameTalk, chat_item } from "../../../../config/cfg_InGameTalk";
import AppGame from "../../../base/AppGame";
import MBaseGameModel from "../../MBaseGameModel";
import MRoomModel from "../../room_zjh/MRoomModel";


const enum game_chat_type {
    TEXT = 1, // 文本
    EMOJ = 2, // 表情
    SELF_DEFINE_TEXT = 3, // 自定义文本内容
}
class callBack {
    func: Function;
    target: any;
    constructor(func: Function, target: Node) {
        this.func = func;
        this.target = target;
    }
}
// const chat_item_pos_x : number=  -171.047;
const { ccclass, property } = cc._decorator;

@ccclass
export default class VFriendGameChat extends VWindow {
    @property(cc.Prefab) text_item_prefab: cc.Prefab = null;
    @property(cc.Prefab) text_item_prefab1: cc.Prefab = null;
    @property(cc.Prefab) emoj_item_prefab: cc.Prefab = null;
    @property(cc.Prefab) chat_item_prefab: cc.Prefab = null;
    @property(cc.Prefab) common_chat_item_prefab: cc.Prefab = null;
    @property(cc.ScrollView) chatScrollView: cc.ScrollView = null;
    @property(cc.ScrollView) commonScrollView: cc.ScrollView = null;
    @property(cc.EditBox) editBox: cc.EditBox = null;
    @property(cc.Node) content: cc.Node = null;
    @property(cc.Node) commonContent: cc.Node = null;
    @property(cc.Node) expressionContent: cc.Node = null;
    @property(cc.Node) chatContent: cc.Node = null;
    @property(cc.Node) toggleContainer: cc.Node = null;
    @property(cc.Node) toggleFriendContainer: cc.Node = null;
    private _vGameChatMusic: UAudioManager;
    _cfg_InGameTalk: chat_item[];
    _page: number = 0;
    _pageSize: number = 11;
    _pageIndex: number = 0;
    _isNeedInit: boolean = true;
    _isNeedPlay: boolean = false;
    _isCanClick: boolean = true;
    _lastTime: number = 0;
    _onClickTimes: number = 0;
    _friendRoomId: number = 0;

    init(): void {
        super.init();
        AppGame.ins.roomModel.on(MRoomModel.GAME_INFORM_MESSAGE, this.onInformMessage, this);
        this.commonScrollView.node.on('scroll-ended', this.onCommonChatScrollEnd, this)
        this._vGameChatMusic = new UAudioManager();
        this.initChatTextContent();
    }

    onLoad() {

    }

    onEnable() {
        this.toggleContainer.children[0].getComponent(cc.Toggle).isChecked = true;
        this.toggleFriendContainer.children[0].getComponent(cc.Toggle).isChecked = true;
        this.showContent(0);
    }

    onDestroy() {
        AppGame.ins.roomModel.off(MRoomModel.GAME_INFORM_MESSAGE, this.onInformMessage, this);
    }


    show(data: any): void {
        super.show(data);
        if (AppGame.ins.currRoomKind == ERoomKind.Friend) {
            this.setToggleContainerShow(false, true)
            this.initChatHistory(AppGame.ins.gamebaseModel.getFriendRoomChatMessage(AppGame.ins.gamebaseModel._friendRoomId));
        } else {
            this.setToggleContainerShow(true, false)
        }
    }

    setToggleContainerShow(isShowGoldRoom: boolean, isShowFriend: boolean) {
        this.toggleContainer.active = isShowGoldRoom;
        this.toggleFriendContainer.active = isShowFriend;
    }

    closeUI() {
        super.playclick();
        super.clickClose();
    }

    onCommonChatScrollEnd() {
        let maxoffset = this.commonScrollView.getMaxScrollOffset()
        let offset = this.commonScrollView.getScrollOffset()
        if (Math.abs(maxoffset.y) - Math.abs(offset.y) <= 100 && this.commonContent.childrenCount > 10) {
            this.initChatItems();
        }
    }

    initChatTextContent() {
        this._cfg_InGameTalk = cfg_InGameTalk;
        this.initChatItems();
    }

    initChatItems() {
        if (this._pageIndex == 0) {
            this.commonContent.removeAllChildren()
            this._page = 0;
            this._pageIndex = -1;
            this.commonScrollView.stopAutoScroll();
            this.commonScrollView.scrollToTop(0.1);
        } else {
            this._page += 1;
        }

        if ((this._page * this._pageSize) >= this._cfg_InGameTalk.length) {
            //没有更多元素了
            return;
        }

        if (this._cfg_InGameTalk.length > 0) {
            for (var j = (this._page * this._pageSize); j < this._cfg_InGameTalk.length && j < ((this._page + 1) * this._pageSize); j++) {
                const element = this._cfg_InGameTalk[j];
                let chat_item = cc.instantiate(this.text_item_prefab);
                let lb_text = UNodeHelper.getComponent(chat_item, "lb_text", cc.Label);
                chat_item.parent = this.commonContent;
                lb_text.string = element.VoiceText;
                UEventHandler.addClick(chat_item, this.node, "VFriendGameChat", "onClickTextItem", element);
            }
            if (this._pageIndex == 0) {

            }
        }
    }

    initChatEmojContent() {
        for (let index = 0; index < 6; index++) {
            let emoj_item = cc.instantiate(this.common_chat_item_prefab);
            emoj_item.getComponent('CommonChatItem').setEmojItem(index, this);
            this.expressionContent.addChild(emoj_item);
        }
    }

    onClickTextItem(event: TouchEvent, element: chat_item) {
        UAudioManager.ins.playSound("audio_click");
        if (this._lastTime == 0) {
            this._lastTime = new Date().getTime();
        }
        let nowTime = new Date().getTime();
        if ((nowTime - this._lastTime) / 1000 <= 60) {
            if (this._onClickTimes == 3) {
                AppGame.ins.showTips(ULanHelper.GAME_HY.CHAT_MORE_TIPS);
                return;
            }
        } else {
            this._lastTime = new Date().getTime();
            this._onClickTimes = 0;
        }
        this._onClickTimes++;
        this.onSendChatMessage(-1, element.VoiceText, game_chat_type.TEXT);
        // this.closeUI()
    }

    onClickEmojItem(id: number) {
        UAudioManager.ins.playSound("audio_click");
        if (this._lastTime == 0) {
            this._lastTime = new Date().getTime();
        }
        let nowTime = new Date().getTime();
        if ((nowTime - this._lastTime) / 1000 <= 60) {
            if (this._onClickTimes == 3) {
                AppGame.ins.showTips(ULanHelper.GAME_HY.CHAT_MORE_TIPS);
                return;
            }
        } else {
            this._lastTime = new Date().getTime();
            this._onClickTimes = 0;
        }
        this._onClickTimes++;
        this.onSendChatMessage(id, "", game_chat_type.EMOJ);
        // this.closeUI()
    }

    onClickSendMsg() {
        if (this.editBox.string.length < 1) {
            AppGame.ins.showTips('请输入内容!');
            return;
        }
        UAudioManager.ins.playSound("audio_click");
        this.onSendChatMessage(-1, this.editBox.string, game_chat_type.SELF_DEFINE_TEXT);
    }

    /**
    * 发送聊天内容
    * @param faceId 表情ID
    * @param msgbody 消息内容 文本
    * @param type 消息类型 type = 1 常用语音文字 type = 2 表情， type = 3 自定义的输入文本
    */
    onSendChatMessage(faceId: number, msgbody: string, type: number = 3) {
        let body = {
            type: InformMessageType.gameChatProp,
            msg: {
                sendUserId: AppGame.ins.roleModel.useId,
                sendUserNickName: encodeURI(AppGame.ins.roleModel.nickName),
                sendUserHeadId: AppGame.ins.roleModel.headId,
                sendUserHeadImgUrl: encodeURI(AppGame.ins.roleModel.headImgUrl),
                message: encodeURI(msgbody),
                faceId: faceId,
                chatMsgType: type,
            }
        }
        let str = JSON.stringify(body);
        AppGame.ins.roomModel.requestInformMessage(str);
    }

    /**点击左边菜单 */
    onClickLeftToggle(t: any, customData: string) {
        UAudioManager.ins.playSound("audio_click");
        this.showContent(parseInt(customData));
    }

    /**展示聊天面板 */
    showContent(index: number) {
        for (let i = 0; i < this.content.childrenCount; i++) {
            let node = this.content.children[i];
            node.active = false;
            if (i == index) {
                node.active = true;
                if (this._isNeedInit && index == 1) {
                    this.initChatEmojContent();
                    this._isNeedInit = false;
                }
                if (index == 2) {
                    this.chatScrollView.scrollToBottom(0.5);
                }
            }
        }
    }

    // 初始化聊天历史记录
    initChatHistory(data: any, playSound: boolean = false): void {

        if (this._friendRoomId == AppGame.ins.gamebaseModel._friendRoomId) {
            this.chatContent.removeAllChildren();
            if (data && data.length > 0) {
                data.forEach(item => {
                    this.onNotifyChatInfo(item);
                });
            }
        }
        this._friendRoomId = AppGame.ins.gamebaseModel._friendRoomId;
        this._isNeedPlay = true;
    }


    private onInformMessage(jsonData: any): void {
        if (jsonData && jsonData.type == InformMessageType.gameChatProp) {
            var data = jsonData.msg;
            this.onNotifyChatInfo(data);
            this._isNeedPlay = true;
        }
    }

    // 聊天消息通知
    private onNotifyChatInfo(data: any): void {
        if (data) {
            this.editBox.string = "";
            let item = cc.instantiate(this.chat_item_prefab);
            let userId = "";
            if (AppGame.ins.currRoomKind == ERoomKind.Normal) {
                userId = data.hasOwnProperty("sendUserId") ? `${data.sendUserId}` : "";
            } else {
                userId = data.hasOwnProperty("sendUserNickName") ? `${decodeURI(data.sendUserNickName)}` : "";
            }

            let headId = data.hasOwnProperty("sendUserHeadId") ? decodeURI(data.sendUserHeadId) : 1;
            let headImgUrl = data.hasOwnProperty("sendUserHeadImgUrl") ? decodeURI(data.sendUserHeadImgUrl) : ``;
            let msg = data.hasOwnProperty("message") ? `${decodeURI(data.message)}` : "";
            let faceId = data.hasOwnProperty("faceId") ? `${data.faceId}` : "";
            let height = 98;
            if (msg.length > 0) {
                height = this.getItemHeight(msg, game_chat_type.TEXT);
                item.getComponent("VFriendChatItem").setMessageInfo(headId, userId, msg, 1, height, headImgUrl);
                if (data.hasOwnProperty('chatMsgType') && data.chatMsgType == 1 && this._isNeedPlay) {
                    for (var j = 0; j < this._cfg_InGameTalk.length; j++) {
                        if (this._cfg_InGameTalk[j].VoiceText == msg) {
                            // UDebug.log("播放音效文件---" + this._cfg_InGameTalk[j].voice);
                            this._vGameChatMusic.playSound(this._cfg_InGameTalk[j].voice);
                            break;
                        }
                    }
                }
            } else if (data.faceId != -1) { // 表情
                height = this.getItemHeight(msg, game_chat_type.EMOJ);
                item.getComponent("VFriendChatItem").setMessageInfo(headId, userId, faceId, 2, height, headImgUrl);
            }
            item.active = true;
            this.chatContent.addChild(item);
            this.chatScrollView.scrollToBottom(0.5);
        }
    }

    getItemHeight(msgstr: string, msgType: game_chat_type): number {
        let height = 98;
        if (msgType == game_chat_type.TEXT) {
            if (msgstr.length > 15) {
                height += Math.ceil(msgstr.length / 15) * 18
            }
        } else if (msgType == game_chat_type.EMOJ) {
            height = 128;
        }
        return height;
    }

    /**关闭的动画 */
    protected closeAnimation(completHandler?: UHandler): void {
        this._root.stopAllActions();
        var actionMove = cc.moveTo(0.2, cc.v2(255 + cc.winSize.width / 2, 0));
        this._root.runAction(cc.sequence(actionMove, cc.callFunc(() => {
            if (completHandler) completHandler.run();
            // this._root.getComponent(cc.Widget).right = -640;
        }, this)));

    }
    /**显示的动画 */
    protected showAnimation(completHandler?: UHandler): void {
        this._root.stopAllActions();
        this._root.setPosition(cc.v2(255 + cc.winSize.width / 2, 0))
        var actionMove = cc.moveTo(0.2, cc.v2(cc.winSize.width / 2 - 255, 0));
        this._root.runAction(cc.sequence(actionMove, cc.callFunc(() => {
            if (completHandler) completHandler.run();
            // this._root.getComponent(cc.Widget).right = 0;
        }, this)));
    }

}
