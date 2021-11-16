import { EIconType } from "../../../../common/base/UAllenum";
import UResManager from "../../../../common/base/UResManager";

const {ccclass, property} = cc._decorator;
@ccclass
export default class VFriendChatItem extends cc.Component {
  
    @property(cc.Node) iconNode: cc.Node = null; // 头像框
    @property(cc.Label) userid_text: cc.Label = null; // userid
    @property(cc.Label) lb_text: cc.Label = null;  // 文本内容
    @property(cc.Node) emojNode: cc.Node = null; // 表情节点

    onLoad () {
       
    }


    setMessageInfo(headId: number = 1, userId: string, msg: string, msgtype: number, height: number, headImgUrl: string = ``) {
        UResManager.load(headId, EIconType.Head, this.iconNode.getComponent(cc.Sprite),headImgUrl);
        this.userid_text.string = userId;
        this.node.height = height;
        if(msgtype == 1) { // 文本
            this.lb_text.string = msg;
            this.setChatItemContent(msg);
            this.emojNode.parent.active = false;
        } else if(msgtype == 2) { // 表情
            this.lb_text.node.parent.active = false;
            UResManager.loadUrl(`common/texture/game_chat/game_chat_emoj/game_emoj_${msg}`, this.emojNode.getComponent(cc.Sprite));
        }
    }



    /**
     * 设置内容文本
     * @param msgstr 内容
     * @param isBgReverse 背景是否倒置 
     */
    setChatItemContent(msgstr: string, isBgReverse: boolean = false) {
        if(msgstr.length <= 15) {
            this.lb_text.node.width = 16 + 16*(msgstr.length - 1);
            this.lb_text.node.parent.width = 50 + 16*(msgstr.length - 1);
        } else {
            this.lb_text.node.width = 245;
            this.lb_text.node.parent.width = 280;
        }
        this.lb_text.string = msgstr;
        if(isBgReverse) {
            this.node.scaleX = -1;
            this.lb_text.node.scaleX = -1;
        } else {
            this.node.scaleX = 1;
            this.lb_text.node.scaleX = 1;
        }

    }

    
}
