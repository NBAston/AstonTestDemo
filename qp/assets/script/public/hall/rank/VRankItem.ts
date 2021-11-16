import { UIRankDataItem } from "./RankData";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UResManager from "../../../common/base/UResManager";
import { EIconType } from "../../../common/base/UAllenum";
import UStringHelper from "../../../common/utility/UStringHelper";

export const ZJH_SCALE = 0.01;
const { ccclass, property } = cc._decorator;

@ccclass
export default class VRankItem extends cc.Component {
    private _nodeOne: cc.Node;
    private _nodeTwo: cc.Node;
    private _nodeThree: cc.Node;
    private _nodeOther: cc.Node;
    private _nodeNoRank: cc.Node;
    private _user_id: cc.Label;
    private _rank: cc.Label;
    private _gold: cc.Label;
    private _name: cc.Label;
    private _vip: cc.Label;
    private _head: cc.Sprite;
    private _frame: cc.Sprite;
    private _rect: cc.Node;
    private _root: cc.Node;
    init(): void {
        this._root = UNodeHelper.find(this.node, "root");
        this._nodeOne = UNodeHelper.find(this.node, "root/rank_cell_1");
        this._nodeTwo = UNodeHelper.find(this.node, "root/rank_cell_2");
        this._nodeThree = UNodeHelper.find(this.node, "root/rank_cell_3");
        this._nodeOther = UNodeHelper.find(this.node, "root/rank_cell_icon");
        this._nodeNoRank = UNodeHelper.find(this.node, "root/rank_no_rank");
        this._user_id = UNodeHelper.getComponent(this.node, "root/user_id", cc.Label);
        this._rank = UNodeHelper.getComponent(this.node, "root/rank_cell_icon/rank", cc.Label);
        this._gold = UNodeHelper.getComponent(this.node, "root/gold", cc.Label);
        this._name = UNodeHelper.getComponent(this.node, "root/name", cc.Label);
        this._vip = UNodeHelper.getComponent(this.node, "root/vip", cc.Label);
        this._head = UNodeHelper.getComponent(this.node, "root/head", cc.Sprite);
        this._frame = UNodeHelper.getComponent(this.node, "root/head/frame", cc.Sprite);
    }
    hide(): void {
        this.node.active = false;
    }
    show(content: cc.Node): void {
        this.node.active = true;
        this._rect = content;
    }
    protected update(dt: number): void {
        if (this._rect) {
            var posY = this._rect.y + this.node.y;
            if (posY < -300) {
                this._root.active = false;
            } else if (posY > 300) {
                this._root.active = false;
            } else {
                this._root.active = true;
            }
        }
    }
    bind(data: UIRankDataItem): void {
        this.node.active = true;
        this._vip.string = data.vip.toString();
        this._user_id.string = "ID:" + data.userId;
        this._gold.string = UStringHelper.getMoneyFormat(data.gold * ZJH_SCALE, -1).toString();
        this._name.string = data.name;
        UResManager.load(data.frameId, EIconType.Frame, this._frame);
        UResManager.load(data.headId, EIconType.Head, this._head);
        if (data.rankId == 1) {

            if (this._nodeNoRank) this._nodeNoRank.active = false;
            this._nodeOne.active = true;
            this._nodeTwo.active = false;
            this._nodeThree.active = false;
            this._nodeOther.active = false;
        } else if (data.rankId == 2) {

            if (this._nodeNoRank) this._nodeNoRank.active = false;
            this._nodeOne.active = false;
            this._nodeTwo.active = true;
            this._nodeThree.active = false;
            this._nodeOther.active = false;
        } else if (data.rankId == 3) {

            if (this._nodeNoRank) this._nodeNoRank.active = false;
            this._nodeOne.active = false;
            this._nodeTwo.active = false;
            this._nodeOther.active = false;
            this._nodeThree.active = true;
        } else if (data.rankId <= 0) {

            if (this._nodeNoRank) this._nodeNoRank.active = true;
            this._nodeOne.active = false;true
            this._nodeTwo.active = false;
            this._nodeThree.active = false;
            this._nodeOther.active = false;

        } else {
            if (this._nodeNoRank) this._nodeNoRank.active = false;
            this._nodeOne.active = false;
            this._nodeTwo.active = false;
            this._nodeThree.active = false;
            this._nodeOther.active = true;
            this._rank.string = data.rankId.toString();

        }
    }

}
