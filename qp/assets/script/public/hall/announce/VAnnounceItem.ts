import UNodeHelper from "../../../common/utility/UNodeHelper";
import UHandler from "../../../common/utility/UHandler";
import UEventListener from "../../../common/utility/UEventListener";
import { mailData } from "./AnnounceData";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VAnnounceItem extends cc.Component {
    clickhander: UHandler;
    private _title: cc.Label;
    private _name: cc.Label;
    private _flag: cc.Node;
    private _time: cc.Label
    private _data: mailData;
    private _nameBack: cc.Node;
    private _timeBack: cc.Node;

    get Data(): mailData {
        return this._data;
    }
    init(): void {
        this._title = UNodeHelper.getComponent(this.node, "root/title", cc.Label);
        this._name = UNodeHelper.getComponent(this.node, "root/sendname", cc.Label);
        this._flag = UNodeHelper.find(this.node, "root/ann_readed");
        this._nameBack = UNodeHelper.find(this.node, "root/ann_desc_bg");
        this._timeBack = UNodeHelper.find(this.node, "root/ann_date_bg");
        this._time = UNodeHelper.getComponent(this.node, "root/sendtime", cc.Label);
        UEventListener.get(this.node).onClick = new UHandler(this.onclick, this);
    }
    private onclick(): void {
        if (this.clickhander) this.clickhander.runWith(this);
    }
    /**
   * 显示
   */
    show(data: mailData): void {
        this._data = data;
        this.node.active = true;
        this._title.string = data.mailTitle;
        this._flag.active = data.status != 0;
        // this._name.string = "发件人:" + data.senderName;
        this._time.string = data.sendTime;

        let or: any = this._name;
        or._updateRenderData(true);
        let len = 20 + this._name.node.width;
        this._nameBack.width = len;

        or = this._time;
        or._updateRenderData(true);
        len = 20 + this._time.node.width;
        this._timeBack.width = len;
        this._timeBack.x = this._name.node.x + this._nameBack.width;
        this._time.node.x = this._name.node.x + this._nameBack.width;
    }
    hide(): void {
        this.node.active = false;
    }
}
