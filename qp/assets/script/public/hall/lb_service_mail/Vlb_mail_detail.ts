import UHandler from "../../../common/utility/UHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventListener from "../../../common/utility/UEventListener";
import { MailData } from "./MailServiceData";
import UResManager from "../../../common/base/UResManager";
import VWindow from "../../../common/base/VWindow";
import AppGame from "../../base/AppGame";
import MMailModel from "./Mmail_Model";
import { ECommonUI } from "../../../common/base/UAllenum";
import UEventHandler from "../../../common/utility/UEventHandler";


const { ccclass, property } = cc._decorator;

/**
 * 创建:sq
 * 作用:客服列表子项
 */
@ccclass
export default class VMailDetail extends VWindow {

    private data:any;
    private _title: cc.Label;
    private _name: cc.Label;
    private _content: cc.RichText;
    private _reward: cc.Label;
    private _btnDelete:cc.Node;
    private _rewardNode:cc.Node;
    private _back:cc.Node;


    init(): void {
        super.init()
        this._title = UNodeHelper.getComponent(this.node, "root/title", cc.Label);
        this._name = UNodeHelper.getComponent(this.node, "root/title/sender", cc.Label);
        this._content = UNodeHelper.getComponent(this.node, "root/scrollView/view/content/text", cc.RichText);
        this._reward = UNodeHelper.getComponent(this.node, "root/reward/bg/score", cc.Label);
        this._btnDelete = UNodeHelper.find(this.node, "root/btn_delete")
        this._rewardNode = UNodeHelper.find(this.node, "root/reward")
        UEventListener.get(this._btnDelete).onClick = new UHandler(this.onclick, this);
        this._back = UNodeHelper.find(this.node,"back");
        UEventHandler.addClick(this._back,this.node,"VMailDetail","closeUI");
        
    }
   
    /**
   * 显示
   */
    show(data: MailData): void {
        super.show(data);
        this.data = data
        this._title.string = data.mailTitle;
        this._name.string = "发件人: 博弈圈官方" ;
        this._btnDelete.active = data.userId == 0 ? false : true
        this._content.string = data.mailContent;
        this._reward.string = (data.rewardScore/100).toString();
        this.node.active = true;
        this.node.zIndex = 500
        this._rewardNode.active = data.userId == 0 ? false : true
    }

    onclick(){
        super.playclick();
        if (AppGame.ins.mailModel.requestDeteleMail(this.data.mailId)) {
            this.scheduleOnce(() => {
                AppGame.ins.showConnect(false);
            }, 0.1);
        }
    }

    closeUI(){
        super.playclick();
        super.clickClose();
    }


    hide(): void {
        this.node.active = false;
    }

 
}
