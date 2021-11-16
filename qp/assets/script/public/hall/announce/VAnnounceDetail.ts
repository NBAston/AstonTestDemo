import VWindow from "../../../common/base/VWindow";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import { mailData } from "./AnnounceData";


const { ccclass, property } = cc._decorator;

@ccclass
export default class VAnnounceDetail extends VWindow {
    private _content: cc.Label;
    private _title: cc.Label;
    private _name: cc.Label;
    private _back: cc.Node;
    init(): void {
        super.init();
        this._title = UNodeHelper.getComponent(this._root, "title", cc.Label);
        this._content = UNodeHelper.getComponent(this._root, "content", cc.Label);
        this._name = UNodeHelper.getComponent(this._root, "name", cc.Label);
        this._back = UNodeHelper.find(this._root, "ann_desc_bg");
    }
    /**
    * 显示
    */
    show(data: mailData): void {
        super.show(data);
        this._title.string = data.mailTitle;
        this._content.string = data.mailContent;
        this._name.string = "发件人:" + data.senderName;

        let or: any = this._name;
        or._updateRenderData(true);
        let len = 20 + this._name.node.width;
        this._back.width = len;
    }
}
