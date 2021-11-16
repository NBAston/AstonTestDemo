import UHandler from "../../../common/utility/UHandler";
import { UChatDataItem } from "../../../common/base/UAllClass";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UDebug from "../../../common/utility/UDebug";
import VChat from "./Vlb_chat";
import UStringHelper from "../../../common/utility/UStringHelper";
import UEventListener from "../../../common/utility/UEventListener";
import UResManager from "../../../common/base/UResManager";
import AppGame from "../../base/AppGame";
import { ECommonUI, EGameType, ELevelType } from "../../../common/base/UAllenum";
import ULocalDB from "../../../common/utility/ULocalStorage";
import { UAPIHelper } from "../../../common/utility/UAPIHelper";
import { EventManager } from "../../../common/utility/EventManager";
import cfg_event from "../../../config/cfg_event";

const { ccclass, property } = cc._decorator;
class PicData {
    index: number;
    spriteFrame: cc.SpriteFrame;
    size: cc.Size;
    constructor(index: number, spriteFrame: cc.SpriteFrame, size: cc.Size) {
        this.index = index;
        this.spriteFrame = spriteFrame;
        this.size = size;
    }
}
/**
 * 创建:sq
 * 作用:客服列表子项
 */
@ccclass
export default class VChatItem extends cc.Component {
    static itemL: cc.Prefab = null;
    static itemR: cc.Prefab = null;
    clickHandler: UHandler;
    private _timeLb: cc.Label;
    private _image: cc.Sprite;  //等比缩放
    private _msgbg: cc.Sprite;  //背景图片
    private _text: cc.RichText;    //文本
    private _parent: VChat;    //父节点
    private _chat_img_toolBg: cc.Node; //操作框的bg
    private _chat_fuzhi_btn: cc.Node; //复制按钮
    private _chat_shanchu_tbn: cc.Node; //撤回按钮
    private _touchTime: number = 0;//触摸计时器
    // private _spriteFrameIndex: number;
    private _spriteFrame: cc.SpriteFrame;
    private _size: cc.Size;
    // private _picDatas: Array<PicData>;
    private _data: UChatDataItem = null;
    private _rechargetypeId: number;

    public get rechargetypeId(): number {
        return this._rechargetypeId;
    }

    init(): void {
        this._spriteFrame = null;
        this._size = null;
        // this._spriteFrameIndex = 0;
        // this._picDatas = null;
        this._msgbg = UNodeHelper.getComponent(this.node, "image/msgbg", cc.Sprite);
        this._image = UNodeHelper.getComponent(this.node, "image/image", cc.Sprite);
        this._text = UNodeHelper.getComponent(this.node, "image/msgbg/text", cc.RichText);

        this._timeLb = UNodeHelper.getComponent(this.node, "time", cc.Label);
        // UEventListener.get(this._image.node).onClick = new UHandler(this.onclick, this);


        // imageLayout
        this._msgbg.node.on(cc.Node.EventType.TOUCH_START, this.itemTouch.bind(this));

        this._image.node.on(cc.Node.EventType.TOUCH_START, this.itemTouch.bind(this));

        this._msgbg.node.on(cc.Node.EventType.TOUCH_END, this.itemTouchEnd.bind(this));

        this._image.node.on(cc.Node.EventType.TOUCH_END, this.itemTouchEnd.bind(this));

    }

    itemTouch() {
        this.schedule(() => {
            this._touchTime = 1
        }, 1);
    };

    itemTouchEnd() {
        if (this._touchTime > 0) {
            let imageLayout = this.node.getChildByName("image");

            let w = imageLayout.width / 2 + 25;
            if (this.node.name == "itemR") {
                w = -w;
            }
            this._chat_img_toolBg.x = w;
            this._chat_img_toolBg.active = true;
            let isSelf = this._data.self;
            this._chat_shanchu_tbn.active = isSelf;
            EventManager.getInstance().addEventListener(cfg_event.CHAT_TOOL_HIDE, this.hideTool.bind(this), this);
        } else {
            let image = UNodeHelper.find(this.node, "image/image");
            if (image.active) {
                this.onclick();
            };
        };

        this._touchTime = 0;
        this.unscheduleAllCallbacks();
    };



    onDestroy() {
        EventManager.getInstance().removeEventListener(cfg_event.CHAT_TOOL_HIDE, this.hideTool, this);
    };

    hideTool() {
        this._chat_img_toolBg.active = false;
        EventManager.getInstance().removeEventListener(cfg_event.CHAT_TOOL_HIDE, this.hideTool, this);
    };

    /**
     * @description 云信删除消息
     */
    deleteMsg() {
        let originalMag = this._data.originalMag;
        let isSelf = this._data.self;
        if (!isSelf) {
            cc.log("此消息不可删除:")
            return;
        };
        if (!originalMag) {
            AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                type: 1, data: "此消息已撤回"
            });
            return;
        };
        console.log("aaaaaaaaaaaaaaaaaaaaa:", JSON.stringify(this._data))
        UAPIHelper.chatDeleteMsg(JSON.stringify(originalMag), () => {
            window.nim.deleteMsg({
                msg: originalMag,
                done: (error) => {
                    cc.log("消息撤回:", error);
                    if (!error) {
                        // this.text = "此消息已撤回";
                        let msgId = this._data.msgId;

                        this._parent.deleteMsg("", {
                            DBidServer: this._data["originalMag"]["idServer"],
                            msgId: msgId
                        });


                    } else {
                        let msg = error["message"];
                        AppGame.ins.showUI(ECommonUI.NewMsgBox, {
                            type: 1, data: "超过2分钟的消息，不能撤回"
                        });
                    }
                }
            });
        });

    };

    set text(v: string) {
        let msgText = UNodeHelper.find(this.node, "image/msgbg");
        let image = UNodeHelper.find(this.node, "image/image");
        msgText.active = true;
        image.active = false

        this._data["info"] = "此消息已撤回";
        this._text.string = v;
        this._data.originalMag = null;

    };

    initWithrechargeTypeId(rechargetypeId, rechargeTypeName): void {
        this._msgbg = UNodeHelper.getComponent(this.node, "image/msgbg", cc.Sprite);
        // this._image = UNodeHelper.getComponent(this.node, "msgbg/image", cc.Sprite);
        this._text = UNodeHelper.getComponent(this.node, "msgbg/text", cc.RichText);
        // let icon = UNodeHelper.getComponent(this.node, "msgbg/card_logo", cc.Sprite);
        let rechargeTypeNameLb = UNodeHelper.getComponent(this.node, "msgbg/label", cc.Label)
        this._rechargetypeId = rechargetypeId;
        rechargeTypeNameLb.string = '使用' + rechargeTypeName + '充值';
        // UEventListener.get(this._image.node).onClick = new UHandler(this.onclick, this);
    }

    onclick() {
        this._parent._sourceImage.spriteFrame = this._spriteFrame;

        let canvasSize = cc.view.getCanvasSize();
        if (this._size.width >= canvasSize.width - 100) {
            this._parent._sourceImage.node.width = canvasSize.width * this._size.height / this._size.width;
        }
        else {
            this._parent._sourceImage.node.width = this._size.width;
        }

        if (this._size.height >= canvasSize.height - 50) {
            this._parent._sourceImage.node.height = canvasSize.height * this._size.height / this._size.width;
        }
        else {
            this._parent._sourceImage.node.height = this._size.height;
        }

        this._parent._preview.active = true
    }


    addItemTouch() {
        let toolBgName = "chat_img_toolBg";

        if (this.node.parent.childrenCount < 3) {
            toolBgName = "chat_img_toolBg2"
        }
        this._chat_img_toolBg = this.node.getChildByName(toolBgName);
        this._chat_fuzhi_btn = this._chat_img_toolBg.getChildByName("chat_fuzhi_btn");
        this._chat_shanchu_tbn = this._chat_img_toolBg.getChildByName("chat_shanchu_tbn");

        this._chat_fuzhi_btn.on(cc.Node.EventType.TOUCH_START, () => {
            UAPIHelper.onCopyClicked(this._text.string);
        });
        this._chat_shanchu_tbn.on(cc.Node.EventType.TOUCH_START, () => {
            this.deleteMsg();
        });

    };

    addItem(data: UChatDataItem, vchat: VChat): void {
        this._parent = vchat;
        var itemSpace = 0
        this._data = data;
        //时间
        if (data.type == 0) {
            if (data.info) this._text.string = data.info;
            this.node.width = 40
            this.node.height = 14
            this.node.x = this.node.parent.width / 2 - this.node.width / 2
            this._text.fontSize = 16
            vchat.scrollHeight += this.node.height + itemSpace
            if (vchat.scrollHeight > this.node.parent.height) this.node.parent.height = vchat.scrollHeight
        } else if (data.type == 3) {
            this.scheduleOnce(function () {
                this.node.width = 325;
                this.node.height = 115;
                this.node.x = 40;
                this.node.y = -vchat.scrollHeight - 0;
                vchat.scrollHeight += this.node.height + itemSpace
                if (vchat.scrollHeight > this.node.parent.height) this.node.parent.height = vchat.scrollHeight
            }, 1 / 30);
        }
        else {
            var spaceH = 30 //左右偏移量
            var spaceV = 10; //上下偏移量
            // var spaceTime = 5; //时间间隔
            if (data.info) {
                //文字信息
                if (data.type == 1) {
                    let msgText = UNodeHelper.find(this.node, "image/msgbg");
                    let image = UNodeHelper.find(this.node, "image/image");
                    msgText.active = true;
                    image.active = false;
                    this._text.string = UStringHelper.chatStrReplace(data.info);
                    this._text.maxWidth = 0;
                    this._text.fontSize = 22
                    this.scheduleOnce(function () {
                        if (this._text.node.width >= 500) {
                            this._text.maxWidth = 500;
                            this._text.node.width = 500;
                            this.node.height = this._text.node.height + 20 + 10 + 37.8;
                        } else {
                            this.node.height = this._text.node.height + 20 + 10 + 37.8;
                        }
                        this.node.y = -vchat.scrollHeight - 15;
                        this._timeLb.node.y = - this._text.node.height - 8;
                        if (!data.self) {
                            this.node.x = spaceH - 10
                        } else {
                            this.node.x = 830 - 30;
                        }
                        UDebug.log("聊天item坐标x", this.node.x);
                        UDebug.log("聊天item坐标y", this.node.y);
                        vchat.scrollHeight += (this.node.height + itemSpace);
                        UDebug.log("聊天content", vchat.scrollHeight);
                        if (vchat.scrollHeight > this.node.parent.height) this.node.parent.height = vchat.scrollHeight;
                    }, 1 / 30);
                    // this.getchatIcon(data.self, avatar);
                }
                //图片信息
                else if (data.type == 2) {
                    let msgText = UNodeHelper.find(this.node, "image/msgbg");
                    let image = UNodeHelper.find(this.node, "image/image");
                    msgText.active = false;
                    image.active = true;
                    //最大宽度限制和高底限制，超过后按最大值等比例缩放
                    var maxWidth = vchat.node.width / 3;
                    var maxHeight = 720 / 2;
                    UDebug.log("聊天窗口宽。。。。。。。", vchat.node.width);
                    UDebug.log("聊天窗口高。。。。。。。", vchat.node.height);

                    UDebug.log("最大宽。。。。。。。", maxWidth);
                    UDebug.log("最大高。。。。。。。", maxHeight);
                    //先加载一次获得当前图片的真实大小，计算是否要缩放
                    this.scheduleOnce(function () {
                        this.node.height = image.height + 20 + 10 + 37.8;
                        if (!data.self) {
                            this.node.x = spaceH - 10
                        } else {
                            this.node.x = 830 - 30;
                        }
                        this.node.y = -vchat.scrollHeight - 15;
                        this._timeLb.node.y = - image.height - 2;
                        vchat.scrollHeight += this.node.height + itemSpace
                        if (vchat.scrollHeight > this.node.parent.height) this.node.parent.height = vchat.scrollHeight
                        UDebug.log("显示的图片。。。。。。", data.info)
                        UResManager.loadRemote(data.info, image.getComponent(cc.Sprite), (error, res) => {
                            let self = this;
                            if (!error) {
                                let sp = image.getComponent(cc.Sprite).spriteFrame;
                                let _realSize = sp.getOriginalSize();
                                if (_realSize.height > maxHeight) {
                                    _realSize.width = maxHeight * _realSize.width / _realSize.height
                                    _realSize.height = maxHeight
                                }
                                if (_realSize.width > maxWidth) {
                                    _realSize.height = maxWidth * _realSize.height / _realSize.width
                                    _realSize.width = maxWidth
                                }
                                image.width = 100 / _realSize.height * _realSize.width
                                UDebug.log("图片宽。。。。。。。", image.width);

                                UDebug.log("真实宽。。。。。。。", _realSize.width);
                                UDebug.log("真实高。。。。。。。", _realSize.height);
                                self._spriteFrame = sp;
                                self._size = sp.getOriginalSize();
                                // let size = new cc.Size(_realSize.width, _realSize.height);
                                // let picData = new PicData(self._spriteFrameIndex, sp, size);
                                // self._picDatas.push(picData);
                                // image.width = _realSize.width;
                                // image.height = _realSize.height;

                                //缩放显示
                                // cc.loader.load(data.info, function (error, res){
                                //     if (error == null) {
                                //         image.getComponent(cc.Sprite).spriteFrame = res;
                                //         // this._msgbg.node.height = this._image.node.height + spacePos;
                                //         // this._msgbg.node.width = this._image.node.width + spacePos;
                                //         this.node.height = image.node.height + 20 + 10 +37.8;
                                //         if (!data.self){
                                //             this.node.x = spaceH -10
                                //         } else {
                                //             this.node.x = 830 - 30;
                                //         }
                                //         vchat.scrollHeight += this.node.height + itemSpace
                                //         if (vchat.scrollHeight >this.node.parent.height) this.node.parent.height = vchat.scrollHeight
                                //         //回调函数重新刷新位置
                                //         // vchat._scrollView.getComponent(cc.ScrollView).scrollToBottom(0.5)
                                //         // if (!data.self) this.node.x = spacePos
                                //         // else this.node.x = this.node.parent.width-this._msgbg.node.width-spacePos
                                //     } else {
                                //         UDebug.Log(error);
                                //     }
                                // }.bind(this));
                            }
                        });
                    }, 1 / 30);
                }
            }
        }
        this.node.active = true;
        this.addItemTouch();
    }

    // getchatIcon(isSelf: boolean, avatar:string) :cc.Node{
    //     let icon :cc.Node = null;
    //     let _iconR = this.node;
    //     let _iconL = ;
    //     if (!isSelf) {
    //         icon = cc.instantiate(_iconR);
    //         let frameid = AppGame.ins.roleModel.headId;
    //         icon.x = 0;
    //         UResManager.load(frameid, EIconType.Head, icon.getComponent(cc.Sprite));
    //     } else {
    //         icon = cc.instantiate(_iconL);
    //         icon.x = 780;
    //         UResManager.loadRemote(avatar, icon.getComponent(cc.Sprite));
    //     }
    //     icon.setParent(this.node.parent);
    //     return icon;
    //     // let timeLb = UNodeHelper.getComponent(icon, "timeLb", cc.Label);
    //     // timeLb.string = ;
    // }

    getStrLength(str): number {
        var len = 0;
        for (var i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) > 255) len += 2;//中文算2
            else len++;
        }
        return len + 1;
    }

    getStrRow(str): number {
        let row = 1;
        var len = 0;
        for (let i = 0; i < str.length; i++) {
            if (str.charCodeAt(i) == 10) {
                row++;
                len = 0;
            } else {
                if (str.charCodeAt(i) > 255) len += 2;
                else len++;
                if (len % 51 == 0 && len / 51 > 0) {
                    row++;
                }
            }
        }
        return row;
    }
}
