
const {ccclass, property} = cc._decorator;
@ccclass
export default class VGameChatItem extends cc.Component {
  
    @property(cc.Label) lb_text: cc.Label = null;

    onLoad () {
       
    }

    /**
     * 设置内容文本
     * @param msgstr 内容
     * @param isBgReverse 背景是否倒置 
     */
    setChatItemContent(msgstr: string, isBgReverse: boolean,oneLineMaxCahat=15,baseWidth = 330) {
        if(msgstr.length < oneLineMaxCahat) {
            this.lb_text.node.width = 20 + 20*(msgstr.length - 1);
            this.lb_text.node.parent.width = 80 + 20*(msgstr.length - 1);
        } else {
            this.lb_text.node.width = baseWidth - 30;
            this.lb_text.node.parent.width = baseWidth;
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
