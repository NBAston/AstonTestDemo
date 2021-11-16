import { AnyARecord } from "dns";
import { ECommonUI } from "../../../common/base/UAllenum";
import VWindow from "../../../common/base/VWindow";
import UHandler from "../../../common/utility/UHandler";
import AppGame from "../../base/AppGame";


const {ccclass, property} = cc._decorator;
@ccclass
export default class VFriendTip extends VWindow {
  
    @property(cc.Label) lb_text: cc.Label = null;  // 文本内容
    @property(cc.Node) tip_node: cc.Node = null;  // 文本内容

    init(): void {
        super.init();
    }

    show(data: any): void {
        super.show(data);
        if(data) {
            this.setMessageInfo(data.msg, data.height, data.v_point);
        }
    }

    closeUI() {
        AppGame.ins.closeUI(ECommonUI.UI_TIP_HY);
    }

    setMessageInfo(msg: string, height: number, v_point: any) {
        this.tip_node.height = height;
        this.tip_node.setPosition(cc.v2(v_point.x -45, v_point.y +height - 15));//v_point;
        this.setChatItemContent(msg);
    }

    /**
     * 设置内容文本
     * @param msgstr 内容
     * @param isBgReverse 背景是否倒置 
     */
    setChatItemContent(msgstr: string) {
        if(msgstr.length <= 18) {
            this.lb_text.node.width = 20 + 20*(msgstr.length - 1);
            this.lb_text.node.parent.width = 50 + 20*(msgstr.length - 1);
        } else {
            this.lb_text.node.width = 360;
            this.lb_text.node.parent.width = 390;
        }
        this.lb_text.string = msgstr;
    }

     /**关闭的动画 */
     protected closeAnimation(completHandler?: UHandler): void {

    }
    /**显示的动画 */
    protected showAnimation(completHandler?: UHandler): void {
       
    }

    
}
