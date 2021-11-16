import { ECommonUI, InformMessageType } from "../../common/base/UAllenum";
import UAudioManager from "../../common/base/UAudioManager";
import UResManager from "../../common/base/UResManager";
import UDebug from "../../common/utility/UDebug";
import UNodeHelper from "../../common/utility/UNodeHelper";
import AppGame from "../base/AppGame";
import MRoomModel from "../hall/room_zjh/MRoomModel";

const ArrowDirection = cc.Enum({
    LEFT: 0,   // 左
    RIGHT: 1,  // 右
})

const enum game_chat_type {
    TEXT = 1, // 文本
    EMOJ = 2, // 表情
    SELF_DEFINE_TEXT = 3, // 自定义文本内容
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class VGameChatPropManager extends cc.Component {
    @property({
        type: cc.Component.EventHandler,
        tooltip: '根据userId获取聊天节点方法'
    })
    getChatPropNodeFunc: cc.Component.EventHandler = null;

    @property({
        type: ArrowDirection,
        tooltip: '头像，文字箭头指向'
    })
    arrowDirection = ArrowDirection.LEFT;

    @property(cc.Prefab) emojItem: cc.Prefab = null; // 表情预制体
    @property(cc.Prefab) textItem: cc.Prefab = null; // 文本预制体

    private _bindUserId: number = 0;
    private _data: any = null;
    private _item: cc.Node = null;
    private _textItem: cc.Node = null;

    onLoad() {

    }

    onEnable() {
        AppGame.ins.roomModel.on(MRoomModel.GAME_INFORM_MESSAGE, this.onInformMessage, this);
    }

    onDisable() {
        AppGame.ins.roomModel.off(MRoomModel.GAME_INFORM_MESSAGE, this.onInformMessage, this);
    }

    /**收到广播 */
    private onInformMessage(data: any) {
        if (data.type == InformMessageType.gameChatProp && data.msg.sendUserId == this._bindUserId) {
            this._data = data;
            if (this.getChatPropNodeFunc && this._data) {
                this.getChatPropNodeFunc.emit([data.msg.sendUserId, this.getPropNodeCallback.bind(this)]);
            }
        }
    }

    /**获取聊天节点回调 */
    getPropNodeCallback(sendPropNode: cc.Node) {
        // UDebug.log("this._data = " + JSON.stringify(this._data));

        let scene = cc.director.getScene();
        if(this._item) {
            this._item.removeFromParent();
        }
        if(this._textItem) {
            this._textItem.removeFromParent();
        }
        this._item = null;
        this._textItem = null;
        // scene.getChildByName();
        let targetNodeWorldPos = this.node.convertToWorldSpaceAR(cc.Vec2.ZERO);
        let targetPos = scene.convertToNodeSpaceAR(targetNodeWorldPos);
        if (this._data) {
            // var item = null;
            if (this._data.msg.chatMsgType == game_chat_type.EMOJ) {
                if (this._data.msg.faceId != -1) {
                    this._item = cc.instantiate(this.emojItem);
                    let emojSp = UNodeHelper.getComponent(this._item, "emoj_item_img", cc.Sprite);
                    let emojUrl = "common/texture/game_chat/game_chat_emoj/game_emoj_" + this._data.msg.faceId;
                    UResManager.loadUrl(emojUrl, emojSp);
                    if (this.arrowDirection == ArrowDirection.LEFT) {
                        this._item.scaleX = -1;
                        emojSp.node.scaleX = -1.25;
                    } else {
                        this._item.scaleX = 1;
                        emojSp.node.scaleX = 1.25;
                    }
                }
                this._item.setPosition(cc.v2(targetPos.x, targetPos.y));
                setTimeout(() => {
                    if (this._item) {
                        this._item.removeFromParent();
                    }
                }, 1500)
                this._item.parent = scene;

            } else if (this._data.msg.chatMsgType == game_chat_type.TEXT || this._data.msg.chatMsgType == game_chat_type.SELF_DEFINE_TEXT) {
                this._textItem = cc.instantiate(this.textItem);
                this._textItem.getComponent("VGameChatItem").setChatItemContent(decodeURI(this._data.msg.message), this.arrowDirection == ArrowDirection.LEFT ? true : false);
                this._textItem.setPosition(cc.v2(targetPos.x, targetPos.y));
                setTimeout(() => {
                    if (this._textItem) {
                        this._textItem.removeFromParent();
                    }
                }, 1500)
                this._textItem.parent = scene;
            }
           
        }
    }

    /**设置userId */
    bindUserId(userId: number) {
        this._bindUserId = userId;
    }

    getBindUserId():number {
        return this._bindUserId;
    }

}
