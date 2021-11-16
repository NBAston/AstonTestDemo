import UHandler from "../../../common/utility/UHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import VWindow from "../../../common/base/VWindow";
import VChatItem from "./Vlb_chatitem";
import UEventHandler from "../../../common/utility/UEventHandler";
import { UChatDataItem } from "../../../common/base/UAllClass";
import { Vlb_service_data } from "../lb_service_mail/Vlb_service_data";
import { EventManager } from "../../../common/utility/EventManager";
import UResManager from "../../../common/base/UResManager";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import UIManager from "../../base/UIManager";
import AppGame from "../../base/AppGame";
import { ECommonUI, EIconType } from "../../../common/base/UAllenum";
import ULocalDB, { ChatInfo, chatMsgItem } from "../../../common/utility/ULocalStorage";
import RsaKey from "../../../common/utility/RsaKey";
import UMsgCenter from "../../../common/net/UMsgCenter";
import cfg_event from "../../../config/cfg_event";
import cfg_avatar from "../../../config/cfg_avatar";
import UStringHelper from "../../../common/utility/UStringHelper";
import UDebug from "../../../common/utility/UDebug";
import Vlb_emoj_text from "./Vlb_emoj_text";
import { MD5 } from "../../../common/utility/UMD5";
import cfg_global from "../../../config/cfg_global";
import ErrorLogUtil, { LogLevelType } from "../../errorlog/ErrorLogUtil";
var CryptoJS = require("crypto-js");

const UPLOADFILES = "F00A06"
const { ccclass, property } = cc._decorator;
const enum messageType {
    TEXT = 0,
    PIC = 1,
    VIDEO = 2,
}
/**
 *创建:
 *作用:邮件和客服中心
 */
@ccclass
export default class VChat extends VWindow {
    @property(cc.Prefab)
    charge_prefab: cc.Prefab = null;
    @property(cc.Prefab)
    itemL: cc.Prefab = null;
    @property(cc.Prefab)
    itemR: cc.Prefab = null;
    private _parent: cc.Node;
    public _scrollView: cc.Node;
    private _editbox_input: cc.EditBox;
    public scrollHeight: number = 10;//顶部10个像素
    public _sourceImage: cc.Sprite;  //原图
    public _preview: cc.Node;  //图片预览节点
    private _service_data_item: Vlb_service_data;
    private _btn_open_image: cc.Node;
    private _emoj_popup: cc.Node;
    private _emoj_content: cc.Node;
    private _btn_emoj: cc.Node;
    private _chat_btn_del: cc.Node;
    private _layoutW: number;
    private _layoutH: number;
    private _isShow: boolean;
    private _avatar: string;
    _type: number = 2;
    private _itemLJson: {} = {};
    private _isOpenEmoj: boolean;
    _key = "49KdgB8_9=12+3hF"; //16位
    _iv1 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    _iv2 = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    static CHAT_MESSAGE: string = "CHAT_MESSAGE"

    //测试数据
    data = [
        //{type:0, info:"15:30",self:false},
        //{type:1, info:"你好啊我是李四",self:false},
        //{type:1, info:"你好啊我是李四你好啊我是李四你好啊我是李四你好啊我是李四你好啊我是李四你好啊我是李四你好啊我是李四",self:true},
        //{type:1, info:"你好啊我是李四你好啊我是李四你好啊我是李四你好啊我是李四你好啊我是李四你好啊我是李四你好啊我是李四",self:true},
        { type: 2, info: "common/texture/gameroom/room1", self: false },
        { type: 2, info: "common/texture/gameroom/room1", self: true },
        //{type:1, info:"你好啊我是李四你好啊我是李四你好啊我是李四你好啊我是李四你好啊我是李四你好啊我是李四你好啊我是李四",self:true},
        //{type:2, info:"common/texture/gameroom/room2",self:true},
    ]

    /**
     * 初始化 UI创建的时候调用
     */
    init(): void {
        super.init();
        this._parent = UNodeHelper.find(this.node, "root/middle/view/content");
        this._scrollView = UNodeHelper.find(this.node, "root/middle");
        this._preview = UNodeHelper.find(this.node, "root/preview");
        this._editbox_input = UNodeHelper.getComponent(this.node, "root/bottom/editbox_input", cc.EditBox);
        this._sourceImage = UNodeHelper.getComponent(this.node, "root/preview/image", cc.Sprite);
        this._btn_open_image = UNodeHelper.find(this.node, "root/bottom/btn_open_image");
        let btn_order_list = UNodeHelper.find(this.node, "root/top/btn_order_list");
        this._chat_btn_del = UNodeHelper.find(this.node, "root/top/chat_btn_del");
        this._emoj_popup = UNodeHelper.find(this.node, "root/bottom/emoj_popup");
        this._emoj_content = UNodeHelper.find(this._emoj_popup, "view/content");
        this._btn_emoj = UNodeHelper.find(this.node, "root/bottom/btn_emoj");
        this._emoj_content.children.forEach(element => {
            element.on(cc.Node.EventType.TOUCH_END, this.onSelectEmoj, this);
        });
        // this._chatMsg = ULocalDB.getDB("chatMsg");
        this._layoutH = this.node.height;
        this._layoutW = this.node.width;
        this._isShow = false;
        UDebug.Log("聊天室长度1" + this._layoutH);
        UDebug.Log("聊天室宽度1" + this._layoutW);
        UEventHandler.addClick(btn_order_list, this.node, "Vlb_chat", "onOpenOrderList");
        UEventHandler.addClick(this._chat_btn_del, this.node, "Vlb_chat", "clearChatHsittory");
        UEventHandler.addClick(this._btn_open_image, this.node, "Vlb_chat", "onOpenPhotp");
        var btnSend = UNodeHelper.find(this.node, "root/bottom/btn_send");
        UEventHandler.addClick(btnSend, this.node, "Vlb_chat", "onSend", messageType.TEXT);
        var btnPreviewBg = UNodeHelper.find(this.node, "root/preview/bg");
        UEventHandler.addClick(btnPreviewBg, this.node, "Vlb_chat", "onClosePreview");
        UEventHandler.addClick(this._btn_emoj, this.node, "Vlb_chat", "onEmoj");
        // this._editbox_input.
        this._editbox_input.node.on("editing-did-began", this.onEdit, this);
        EventManager.getInstance().addEventListener(cfg_event.RECIEVE_MSG, this.onMessage.bind(this), this);
        EventManager.getInstance().addEventListener(cfg_event.SEND_ORDER_MESSAGE, this.sendOrderMessage, this);
        EventManager.getInstance().addEventListener(cfg_event.ON_DELET_MSG, this.deleteMsg, this)

        VChatItem.itemL = this.itemL;
        VChatItem.itemR = this.itemR;
        this._isOpenEmoj = false;
        window.getImageData = (imageData) => {
            let self = this;
            UDebug.log("js 收到照片数据,", imageData);
            self.SendPicture(imageData);
        };

        //根节点触摸
        this.node.on(cc.Node.EventType.TOUCH_START, () => {
            console.log("根节点触摸")
            EventManager.getInstance().raiseEvent(cfg_event.CHAT_TOOL_HIDE);
        }, this, true);
    }

    onOpenOrderList() {
        super.playclick();
        if (this._type == 2) { // 订单充值列表
            AppGame.ins.showUI(ECommonUI.UI_CUSTOM_ORDERLIST, false);

        } else if (this._type == 3) { // 兑换列表
            AppGame.ins.showUI(ECommonUI.UI_EXCHANGE_ORDER_LIST, false);
        }
    }

    onClosePreview() {
        super.playclick();
        this._preview.active = false
    }

    private getInstance(isSelf: boolean): VChatItem {
        let ins = null;
        if (isSelf) {
            ins = cc.instantiate(this.itemR);
        } else {
            ins = cc.instantiate(this.itemL);
        }
        var item = ins.addComponent(VChatItem);
        ins.setParent(this._parent);
        item.init();
        return item;
    }

    sendOrderMessage(eventName: string, data: any) {
        let _charge_score = data.amount + "";
        let _recieve_account = data.name;
        let _create_time = data.createTime;
        let _recieve_account_no = data.accountNo;
        let _user_id = data.userId + "";
        let _order_no = data.orderId;

        let datainfo = '用户id：' + _user_id + "\n" + '订单编号：' + _order_no + "\n" + '创建时间：' + _create_time
            + "\n" + "转账金额：" + _charge_score + "\n" + "收款姓名：" + _recieve_account + '\n' + '收款账号：' + _recieve_account_no
        this._editbox_input.string = datainfo;
        this.onSend(null, messageType.TEXT);
    }

    private getInstanceCharge(rechargeTypeId: number, rechargeTypeName: string) {
        let ins = cc.instantiate(this.charge_prefab);
        var item = ins.addComponent(VChatItem);
        ins.setParent(this._parent);
        item.initWithrechargeTypeId(rechargeTypeId, rechargeTypeName);

        UEventHandler.addClick(ins, this.node, "Vlb_chat", "onStartCharge", ins);
        return item;
    }

    onStartCharge(targetevent: TouchEvent, ins) {
        let rechargetypeId = targetevent.target.getComponent("Vlb_chatitem").rechargetypeId;
        AppGame.ins.showUI(ECommonUI.UI_CUSTOM_CHARGE, rechargetypeId);
    }

    /**
     *  隐藏
     */
    hide(handler?: UHandler): void {
        this.node.active = false;
        this._parent.removeAllChildren();
        // UAPIHelper.logout();
        this._isShow = false;
    }
    /**
     * 显示
     */
    show(data: any): void {
        this._isShow = true;
        UDebug.Log("Vlb_chat: show");
        UDebug.Log("聊天室长度3" + this.node.height);
        UDebug.Log("聊天室宽度3" + this.node.width);
        this.scrollHeight = 0;
        this._parent.height = 0
        // this.node.height = 0;
        super.show(data);
        this._service_data_item = data;
        let face = UNodeHelper.find(this.node, "root/top/face");
        let name = UNodeHelper.find(this.node, "root/top/name");
        let title = UNodeHelper.find(this.node, "root/top/title");

        this._type = data.type;
        if (data.type == 1) {
            UNodeHelper.find(this.node, "root/top/btn_order_list").active = false;
            this._chat_btn_del.setPosition(cc.v2(775, 0));
        } else {
            UNodeHelper.find(this.node, "root/top/btn_order_list").active = true;
            this._chat_btn_del.setPosition(cc.v2(653, 0));
        }
        // if(data.type == "3") {

        //     // UNodeHelper.find(this.node, "root/top/btn_order_list").active = false;
        // } else if(data.type = "2") {
        //     UNodeHelper.find(this.node, "root/top/btn_order_list").active = true;
        // }
        UNodeHelper.getComponent(name, "", cc.Label).string = data.nickname;
        UNodeHelper.getComponent(title, "", cc.Label).string = ""
        let reverUrl = UStringHelper.charAtReverse(data.avatar);
        let url = cfg_avatar[parseInt(reverUrl[4]) - 1];
        UResManager.loadUrl(url, face.getComponent(cc.Sprite));
        this._avatar = data.avatar;

        // this._chatMsg = ULocalDB.getDB("chatMsg");
        // UDebug.Log("打印本地存储chat", JSON.stringify(this._chatMsg));

        AppGame.ins.selfChatMsg.chatInfoArr.forEach(element => {
            if (element.msgId == this._service_data_item.name + "") {
                UDebug.Log("查到消息记录msgId。。。。。。" + element.msgId)
                UDebug.Log("查到消息记录msgBody。。。。。。" + element.msgBody)
                element.msgBody.forEach(element1 => {
                    UDebug.Log("查到消息记录2。。。。。。" + element1.isSelf);
                    UDebug.Log("查到消息记录2。。。。。。" + element1.content);
                    this.onMessage("", element1)
                    if (!element1.isRead) {
                        element1.isRead = true;
                        AppGame.ins.unreadMsg--;
                    }
                });
            } else {
                UDebug.Log("没有消息记录");

            }
        });
        this.scheduleOnce(() => {

            this._scrollView.getComponent(cc.ScrollView).scrollToBottom(0.1)
        }, 0.5)
    }

    getchatIcon(item, isSelf: boolean, timeFormat: string): cc.Node {
        let sprite = UNodeHelper.getComponent(item.node, "image/sprite", cc.Sprite);
        let timeLb = UNodeHelper.getComponent(item.node, "time", cc.Label);
        if (!isSelf) {
            // icon.x = 25;
            // UResManager.loadRemote(this._avatar, icon.getComponent(cc.Sprite));
            let reverUrl = UStringHelper.charAtReverse(this._avatar);
            let url = cfg_avatar[parseInt(reverUrl[4]) - 1];
            UResManager.loadUrl(url, sprite);
            timeLb.string = timeFormat;
        } else {
            // icon.x = 795;
            let headId = AppGame.ins.roleModel.headId;
            // UResManager.load(headId, EIconType.chatHead, sprite);
            UResManager.load(AppGame.ins.roleModel.headId, EIconType.Head, sprite, AppGame.ins.roleModel.headImgUrl);
            timeLb.string = timeFormat;
            // icon.getChildByName('timeLb').getComponent(cc.Label).string = timeFormat;
        }
        return;
    }

    isSend: boolean = false;//限制不好，消息发送延时，连续点击发送相同消息
    //发送消息
    onSend(event: TouchEvent, type: messageType, picUrl?: string) {
        if (this.isSend) {
            return;
        }
        this.isSend = true;
        this.scheduleOnce(function () {
            this.isSend = false;
        }, 1);
        super.playclick();
        let self = this;
        let root: Object = {};
        let result: Object = {};
        if (self._isOpenEmoj) {
            self.onEmoj();
        }
        if (type == messageType.TEXT) {
            root["messageType"] = "1";
            root["content"] = this._editbox_input.string;
            if (this._editbox_input.string == "") return
        } else if (type == messageType.PIC) {
            root["messageType"] = "2";
            result = {
                "video_url": picUrl,
                "image_big": picUrl,
                "duration": 0,
                "width": 0,
                "height": 0,
            };
            let resultJson = JSON.stringify(result);
            root["content"] = resultJson;
        }
        // var data: UChatDataItem = { type: 1, info: this._editbox_input.string, self: false }
        this._scrollView.getComponent(cc.ScrollView).scrollToBottom(0.1)

        root["conversationType"] = "1";

        root["from"] = AppGame.ins.roleModel.useId;
        root["my_avatar"] = self._service_data_item.avatar;
        root["my_name"] = AppGame.ins.roleModel.nickName;

        root["to"] = this._service_data_item.name;
        // root["to"] = "service_300_2";
        root["to_avatar"] = self._service_data_item.avatar;
        root["to_name"] = this._service_data_item.name;
        // root["to_name"] = "service_300_2";

        root["my_group_member"] = "3";

        let msg_id: string = UStringHelper.createUUID();
        root["client_msg_id_"] = msg_id;

        let sendMsg = JSON.stringify(root);
        let sendMsgStr: string = new RsaKey().crypt_password(sendMsg).toString();

        let msgObj = { sendMsgStr: sendMsgStr, to: this._service_data_item.name };
        let msgObjLocal: Object = null;
        let msgStr = JSON.stringify(msgObj);
        UDebug.Log("发送消息json串" + msgStr);
        if (type == messageType.TEXT) {
            msgObjLocal = { sendMsgStr: this._editbox_input.string, to: this._service_data_item.name };
            AppGame.ins.message = msgObjLocal;
            UDebug.log("文本消息初始化" + JSON.stringify(AppGame.ins.message));
        } else if (type == messageType.PIC) {
            msgObjLocal = { sendMsgStr: picUrl, to: this._service_data_item.name };
            AppGame.ins.picMessage = msgObjLocal;
            UDebug.log("图片消息初始化" + JSON.stringify(AppGame.ins.picMessage));
        }

        if (cc.sys.isNative) {
            UAPIHelper.sendText(msgStr);
            // UAPIHelper.sendPicture();
        } else {
            window.nim.sendText({
                scene: 'p2p',
                to: this._service_data_item.name,
                // to: "service_300_2",
                text: sendMsgStr,
                done: (err, msg) => {
                    window.pushMsg(msg);
                }
            })
        }
    }


    SendPicture(imageData: string) {
        let jkid = UPLOADFILES;
        let uid = AppGame.ins.roleModel.useId;
        let file = "data:image/" + "png" + ";base64," + imageData;
        let sign_password = AppGame.ins.sign_password;

        // var timenum = new Date().getTime()/1000; 
        // let timestamp = parseInt(timenum.toString());
        let time = Date.now();
        let timestamp = (new Date(time)).valueOf()
        let timestampSec = parseInt((timestamp / 1000).toString());
        UDebug.log('sigin-token:', AppGame.ins.sign_sign);
        UDebug.log('MD5 sigin-token', MD5(AppGame.ins.sign_sign));
        UDebug.log('timestampSec: ', timestampSec);
        UDebug.log('MD5 MD5 : ', MD5(MD5(AppGame.ins.sign_sign) + timestampSec));
        let sign_sign = MD5(MD5(AppGame.ins.sign_sign).toLowerCase() + timestampSec).toLowerCase();
        let header: Object =
        {
            'sign-device': "windows",
            'sign-password': sign_password,
            'sign-rst': timestampSec,
            'sign-sign': sign_sign,
            'sign-uid': uid,
            'sign-version': 100
        };
        let url = AppGame.ins.chargeUrl + "/sbin";
        let client = { "jkid": UPLOADFILES, "uid": uid, "sign_password": sign_password, "file": file, header: header };
        UMsgCenter.ins.http.send("post", "", url, client, false, UHandler.create((response: any) => {
            UDebug.log("上传图片回掉函数", JSON.stringify(response));
            if (response.sucess == 0) {
                let picUrl = response.data.root.result[0].image_big;
                if (response.data.root.result.length == 0) {
                    ErrorLogUtil.ins.addErrorLog("上传图片接口异常url= " + url + " ,请求参数" + JSON.stringify(client), LogLevelType.ERROR);
                }
                UDebug.log("发送图片地址", picUrl);
                this.onSend(null, messageType.PIC, picUrl);
            }
        }));
    }



    onMessage(msgName: string, msgNotify: Object) {
        AppGame.ins.showConnect(false);
        let self = this;
        UDebug.Log("onMessage.........1" + JSON.stringify(msgNotify));
        console.log("onMessage.........1" + JSON.stringify(msgNotify));
        let isSelf = msgNotify["isSelf"];
        let content = msgNotify["content"];
        let msgType = msgNotify["msgType"];
        let msgId = msgNotify["msgId"];
        let time = msgNotify["time"];
        let originalMag = msgNotify["originalMag"];
        let timeFormat = UStringHelper.createTime(time);
        UDebug.log("消息時間。。。。。", timeFormat);

        let addItemFun = (item) => {
            // !isSelf &&
            if (originalMag) {
                let idServer = originalMag["idServer"];
                this._itemLJson = this._itemLJson ? this._itemLJson : (this._itemLJson = {});
                this._itemLJson[idServer] = item;
            }
        }

        if (self._isShow) {
            if (!isSelf) {
                AppGame.ins.selfChatMsg.chatInfoArr.forEach(element => {
                    if (element.msgId == msgId) {
                        element.msgBody.forEach(element1 => {
                            if (!element1.isRead) {
                                element1.isRead = true;
                                AppGame.ins.unreadMsg--;
                                element.unread--;
                            }
                        })
                    }
                });
            }
            ULocalDB.SaveDB("chatMsg", AppGame.ins.chatMsg);
            EventManager.getInstance().raiseEvent(cfg_event.REFRESH_MSG_MARK);
            // AppGame.ins.
            if (msgType == '1') {
                let item = this.getInstance(isSelf);
                this.getchatIcon(item, isSelf, timeFormat);
                var data: UChatDataItem = { type: 1, info: content, self: isSelf, originalMag: originalMag, msgId: msgId }
                item.addItem(data, this);
                if (isSelf) {
                    this._editbox_input.string = "";
                }
                this.scheduleOnce(function () {
                    this._scrollView.getComponent(cc.ScrollView).scrollToBottom(0.1)
                }, 1 / 5);
                addItemFun(item);
            } else if (msgType == '2') {
                let item = this.getInstance(isSelf);
                this.getchatIcon(item, isSelf, timeFormat);
                addItemFun(item);
                if (cc.sys.isNative) {
                    if (isSelf) {
                        if (cc.sys.OS_IOS == cc.sys.os) {
                            let info = JSON.parse(content)["image_big"];
                            var data: UChatDataItem = { type: 2, info: info, self: isSelf, originalMag: originalMag, msgId: msgId };
                        } else {
                            var data: UChatDataItem = { type: 2, info: content, self: isSelf, originalMag: originalMag, msgId: msgId };
                        }
                    } else {
                        let info = JSON.parse(content)
                        var data: UChatDataItem = { type: 2, info: info["image_big"], self: isSelf, originalMag: originalMag, msgId: msgId };
                    }

                } else {
                    let info = JSON.parse(content)
                    var data: UChatDataItem = { type: 2, info: info["image_big"], self: isSelf, originalMag: originalMag, msgId: msgId };
                }
                item.addItem(data, this);
                this.scheduleOnce(function () {
                    this._scrollView.getComponent(cc.ScrollView).scrollToBottom(0.1)
                }, 1 / 5);
            } else if (msgType == '0') {
                let jsonContent = JSON.parse(content);
                let rechargeTypeId = jsonContent["rechargeTypeId"];
                let rechargeTypeName = jsonContent["rechargeTypeName"];
                let item = this.getInstanceCharge(rechargeTypeId, rechargeTypeName);
                let itemData: UChatDataItem = new UChatDataItem();
                itemData.type = 3;
                itemData.self = false;
                item.addItem(itemData, this);
                this.scheduleOnce(function () {
                    this._scrollView.getComponent(cc.ScrollView).scrollToBottom(0.1)
                }, 1 / 5);
            } else if (msgType == '6') {
                //視頻
                let item = this.getInstance(isSelf);
                addItemFun(item);
                let jsonContent = JSON.parse(content);
                var data: UChatDataItem = { type: 6, info: jsonContent["image_big"], self: isSelf, originalMag: originalMag, msgId: msgId };
            }
        }
    }

    protected onEnable(): void {

    }
    protected onDisable(): void {
        this._itemLJson = null;
    }



    onOpenPhotp() {
        super.playclick();
        UAPIHelper.openPhoto();
    }

    onEmoj() {
        // let self = this;
        super.playclick();
        if (this._isOpenEmoj) {
            this._emoj_popup.runAction(cc.scaleTo(0.1, 0));
            this._isOpenEmoj = false;
        } else {
            this._emoj_popup.runAction(cc.scaleTo(0.1, 1));
            this._isOpenEmoj = true;
        }
    }

    onEdit() {
        if (this._isOpenEmoj) {
            this._emoj_popup.runAction(cc.scaleTo(0.1, 0));
            this._isOpenEmoj = false;
        }
    }

    onSelectEmoj(event: TouchEvent) {
        let emojStr = event.target.name;
        this._editbox_input.string = this._editbox_input.string + Vlb_emoj_text[emojStr]
        // this.onSend(null ,messageType.EMOJ, emojStr);
        // this.onEmoj();
    }

    clearChatHsittory() {
        super.playclick();
        AppGame.ins.selfChatMsg.chatInfoArr.forEach(element => {
            if (element.msgId == this._service_data_item.name) {
                element.unread = 0;
                element.msgBody = [];
                this._parent.removeAllChildren();
                this.scrollHeight = 0;
                this._parent.height = 0;
            }
        });
        AppGame.ins.chatMsg.forEach(element => {
            if (element.accountId == AppGame.ins.roleModel.useId) {
                element = AppGame.ins.selfChatMsg;
            }
        });
        ULocalDB.SaveDB("chatMsg", AppGame.ins.chatMsg);
    }
    /**
     * @description  消息撤回 本地信息处理
     * @param data: { DBidServer: number, msgId: string }
     * @param msgName 事件名字
     */
    deleteMsg(msgName: string, data: { DBidServer: number, msgId: string }) {
        console.log(" 消息撤回 本地信息处理:", JSON.stringify(data))
        let DBidServer = data["DBidServer"];
        let msgId = data["msgId"];

        let fun = (element: any, msgBody: any) => {
            if (element["msgId"] == msgId) {
                for (let i = 0; i < msgBody.length; i++) {
                    let original = msgBody[i]["originalMag"];
                    if (original) {
                        let idServer = original.idServer;
                        if (idServer == DBidServer) {
                            msgBody[i]["content"] = "此消息已撤回";
                            msgBody[i]["msgType"] = "1";
                            if (this._itemLJson) {
                                let item: cc.Node = this._itemLJson[DBidServer]
                                if (item) {
                                    let vChatItem = item.getComponent(VChatItem);
                                    vChatItem.text = "此消息已撤回";
                                    delete this._itemLJson[DBidServer]
                                };
                            };
                            msgBody[i]["originalMag"] = null;
                        };
                    };
                }
            };

        };

        AppGame.ins.selfChatMsg.chatInfoArr.forEach(element => {
            let msgBody = element.msgBody;
            fun(element, msgBody);
        });
        AppGame.ins.chatMsg.forEach(element => {
            let chatInfoArr = element.chatInfoArr;
            for (let i = 0; i < chatInfoArr.length; i++) {
                let chatInfo = chatInfoArr[i];
                let msgBody = chatInfo.msgBody;
                fun(element, msgBody);
            };
        });
        ULocalDB.SaveDB("chatMsg", AppGame.ins.chatMsg);
    };


}
