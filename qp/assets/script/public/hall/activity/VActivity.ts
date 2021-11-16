import UImgBtn from "../../../common/utility/UImgBtn";
import VActivityItem from "./VActivityItem";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UEventHandler from "../../../common/utility/UEventHandler";
import VPersonal from "../personal/VPersonal";
import { ifError } from "assert";
import { UIActivityItemData } from "./ActivityData";

const { ccclass, property } = cc._decorator;
const time = 10;
@ccclass
export default class VActivity extends cc.Component {

    private _allActivity: { [key: number]: VActivityItem };
    private _view: cc.PageView;
    private _next: number;

    start(): void {

    }
    
    init(): void {
        this._allActivity = {};
        var content = UNodeHelper.find(this.node, "view/content");
        content.children.forEach(element => {
            let item = element.getComponent(VActivityItem);
            item.init();
            this._allActivity[item.type] = item;
        });
        this._view = UNodeHelper.getComponent(this.node, "", cc.PageView);
        this._next = time;
    }
    protected onEnable(): void {
        this._next = time;
    }
    protected update(dt: number): void {
        this._next -= dt;
        if (this._next < 0) {
            if (this._view.getCurrentPageIndex() == 1) {
                this._view.scrollToPage(0, 0.5);
            } else if (this._view.getCurrentPageIndex() == 0) {
                this._view.scrollToPage(1, 0.5);
            }
            this._next = time;
        }
    }
    /**
     * 绑定数据
     */
    bind(data: { [key: number]: UIActivityItemData }): void {
        for (const key in this._allActivity) {
            if (this._allActivity.hasOwnProperty(key)) {
                const element = this._allActivity[key];
                var item = data[key];
                if (item) {
                    element.bind(item.data);
                } else {
                    element.hide();
                }
            }
        }
    }

}
