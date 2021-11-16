import UAudioManager from "../../common/base/UAudioManager";
import UResManager from "../../common/base/UResManager";
import VWindow from "../../common/base/VWindow";
import UDebug from "../../common/utility/UDebug";
import UEventHandler from "../../common/utility/UEventHandler";
import UNodeHelper from "../../common/utility/UNodeHelper";
import { cfg_InGameTalk, chat_item } from "../../config/cfg_InGameTalk";

const enum game_chat_type {
    TEXT = 0,
    EMOJ = 1,
}
class callBack {
	func: Function;
    target : any;
    constructor(func: Function, target: Node) {
        this.func = func;
        this.target = target;
    }
}
const chat_item_pos_x : number=  0;
const {ccclass, property} = cc._decorator;
@ccclass
export default class VGameChat extends cc.Component {
    @property (cc.Prefab)
    text_item_prefab: cc.Prefab = null;
    @property (cc.Prefab)
    text_item_prefab1: cc.Prefab = null;
    @property (cc.Prefab)
    emoj_item_prefab: cc.Prefab = null;
    private text_click_callback : callBack= null;
    private emoj_click_callback : callBack= null;

    private _vGameChatMusic: UAudioManager;
    private _default_type:game_chat_type ;
    private _emoj_btn: cc.Toggle;
    private _text_btn: cc.Toggle;
    private _emoj_content: cc.Node;
    private _text_content: cc.Node;
    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this._default_type = game_chat_type.TEXT;
        this._vGameChatMusic = new UAudioManager();
        this._emoj_btn = UNodeHelper.getComponent(this.node, 'mask/emoj_btn', cc.Toggle);
        this._text_btn = UNodeHelper.getComponent(this.node, 'mask/text_btn', cc.Toggle);
        this._emoj_content = UNodeHelper.find(this.node, "scrollview/view/content/emoj_content");
        this._text_content = UNodeHelper.find(this.node, "scrollview/view/content/text_content");

        UEventHandler.addToggle(this._emoj_btn.node, this.node, "VGameChat", "_onToggle", game_chat_type.EMOJ);
        UEventHandler.addToggle(this._text_btn.node, this.node, "VGameChat", "_onToggle", game_chat_type.TEXT);
        this._initChatTextContent();
        this._initChatEmojContent();
    }

    //使用时先初始化   点击文本回调，emoj回调
    init(clickTextFun: Function, clickEmojFun: Function, target: any) {
        if (clickTextFun && clickEmojFun && target) {
            this.text_click_callback = new callBack(clickTextFun, target);
            this.emoj_click_callback = new callBack(clickEmojFun, target);
        } else {
            UDebug.log("参数不对");
        }
    }

    _onToggle(touEvent: TouchEvent, chat_type: game_chat_type) {
        this._default_type = chat_type;
        if (chat_type == game_chat_type.TEXT) {
            this._emoj_btn.isChecked = false;
            this._text_btn.isChecked = true;
            this._emoj_content.active = false;
            this._text_content.active = true; 

        } else if(chat_type == game_chat_type.EMOJ) {
            this._text_btn.isChecked = false;
            this._emoj_btn.isChecked = true;
            this._emoj_content.active = true;
            this._text_content.active = false; 
        }
    }

    _initChatTextContent() {
        let InGameTalk = cfg_InGameTalk;
        InGameTalk.forEach(element => {
            let VoiceText = element.VoiceText;
            let chat_item = cc.instantiate(this.text_item_prefab);
            let lb_text = UNodeHelper.getComponent(chat_item, "lb_text", cc.Label);
            chat_item.x = chat_item_pos_x;
            chat_item.parent = this._text_content;
            lb_text.string = VoiceText;
            UEventHandler.addClick(chat_item, this.node, "VGameChat", "_onClickTextItem", element);
        });
    }

    _initChatEmojContent() {
        this._emoj_content.children.forEach(element => {
            element.on(cc.Node.EventType.TOUCH_END,this._onClickEmojItem,this);
        });
    }

    _onClickTextItem(event:TouchEvent, element: chat_item) {
        let text_item = cc.instantiate(this.text_item_prefab1);
        let lb_text = UNodeHelper.getComponent(text_item, "text_bg/lb_text", cc.Label);
        lb_text.string = element.VoiceText;
        let voice = element.voice;
        this._vGameChatMusic.playSound(voice);
        this.text_click_callback.func.call(this.text_click_callback.target, text_item, element.VoiceText);
    }

    _onClickEmojItem(event:TouchEvent, args: any) {
        let emoj = cc.instantiate(this.emoj_item_prefab);
        let emojSp = UNodeHelper.getComponent(emoj, "emoj_item_img", cc.Sprite);
        let id = event.target.name.slice(5)
        let emojUrl = "common/texture/game_chat/game_chat_emoj/game_emoj_"+id;
        UResManager.loadUrl(emojUrl, emojSp);
        this.emoj_click_callback.func.call(this.emoj_click_callback.target, emoj, event.target.name);
    }

    start () {
        this._onToggle(null, this._default_type);
    }

    show() {
        this.node.runAction(cc.scaleTo(0.1, 1));
    }

    hide() {
        this.node.runAction(cc.scaleTo(0.1, 0));
    }
}
