import UHandler from "../../../common/utility/UHandler";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventListener from "../../../common/utility/UEventListener";
import { MailData } from "./MailServiceData";
import UResManager from "../../../common/base/UResManager";
import AppGame from "../../base/AppGame";
import { ECommonUI } from "../../../common/base/UAllenum";
import { ULocalStorage } from "../../../common/utility/ULocalStorage";


const { ccclass, property } = cc._decorator;

/**
 * 创建:sq
 * 作用:客服列表子项
 */
@ccclass
export default class VMailItem extends cc.Component {
    clickhander: UHandler;
    private _title: cc.Label;
    private _name: cc.Label;
    private _flag: cc.Sprite;
    private _time: cc.Label
    private _data: MailData;
    private _nameBack: cc.Node;
    private _timeBack: cc.Node;

    get Data(): MailData {
        return this._data;
    }
    init(): void {
        this._title = UNodeHelper.getComponent(this.node, "title", cc.Label);
        this._name = UNodeHelper.getComponent(this.node, "sendname", cc.Label);
        this._flag = UNodeHelper.getComponent(this.node, "readed", cc.Sprite);
        UEventListener.get(this.node).onClick = new UHandler(this.onclick, this);
    }

    private onclick(): void {
        if (this.clickhander) this.clickhander.runWith(this);
    }

    /**
   * 显示
   */
    show(data: MailData): void {
        this._data = data;
        this._title.string = data.mailTitle;
         this._name.string = "发件人: 博弈圈官方";
        this.node.active = true;
        //系统邮件读取本地状态
        if (data.userId == 0){
            if (ULocalStorage.getItem(data.mailId) == 1) data.status = 1
        }
        var url = "common/hall/texture/chat/mail_read_" + data.status;
        UResManager.loadUrl(url, this._flag);
        
    }
    hide(): void {
        this.node.active = false;
    }
}
