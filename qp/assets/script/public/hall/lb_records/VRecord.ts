
import VRecord_Item from "./VRecord_Item";
import VBaseUI from "../../../common/base/VBaseUI";
import { EGameType, ERoomKind } from "../../../common/base/UAllenum";
import AppGame from "../../base/AppGame";
import MRoomModel from "../room_zjh/MRoomModel";
import UNodeHelper from "../../../common/utility/UNodeHelper";
import UHandler from "../../../common/utility/UHandler";
import VWindow from "../../../common/base/VWindow";
import UEventHandler from "../../../common/utility/UEventHandler";
import { UZJHRecords } from "../../../common/base/UAllClass";
import ScrollViewPlus from "../../../common/utility/ScrollViewPlus";
import { ClubHallServer } from "../../../common/cmd/proto";


const { ccclass, property } = cc._decorator;
/**
 * 创建:sq
 * 作用:游戏记录
 */
@ccclass
export default class VRecord extends VWindow {

    private _init: boolean;
    /**
     * item节点
     */
    @property(cc.Prefab) prefab: cc.Node = null;
    @property({ type: cc.Node, tooltip: "content" }) content: cc.Node = null;
    /**
     * item的父对象
     */
    private _parent: cc.Node;

    /**
     * 游戏类型
     */
    private _gameType: EGameType;

    private _noRecords: cc.Node;

    private _tiplab: cc.Node;

    // private _scroll: cc.ScrollView;

    private _back: cc.Node;

    private getInstance(): VRecord_Item {
        let ins = cc.instantiate(this.prefab);

        let com = ins.getComponent(VRecord_Item);
        if (!com) {
            com = ins.addComponent(VRecord_Item);
        }
        ins.parent = this._parent;

        com.init();
        return com;
    }



    private regester(): void {
        AppGame.ins.roomModel.on(MRoomModel.UPDATA_GAME_RECORDS, this.update_game_records, this);
    }
    private cancel(): void {
        AppGame.ins.roomModel.off(MRoomModel.UPDATA_GAME_RECORDS, this.update_game_records, this);
    }
    private update_game_records(caller: ClubHallServer.GetPlayRecordMessageResponse): void {
        let dt = AppGame.ins.roomModel.getRecords(this._gameType);
        if (dt.length > 0) {
            for (let i = 0; i < dt.length; i++) {
                this._initScrollViewItemPrefab(dt[i], i);
            };
        };
        this._noRecords.active = dt.length > 0 ? false : true
        this._tiplab.active = !this._noRecords.active
        this._parent.active = true
    }



    _initScrollViewItemPrefab(data: UZJHRecords, index: number) {
        const element = data;
        let item = this.getInstance();
        item.bind(element);
        item.onEnterSrcollView();
        item.node.zIndex = index;
        item.node.x = 475;
    }
    /**
     * 初始化
     */
    init(): void {
        if (this._init) return;
        super.init();
        this._init = true;
        this._parent = UNodeHelper.find(this._root, "bar/view/content");
        // this._prefab = UNodeHelper.find(this._root, "item");
        this._noRecords = UNodeHelper.find(this._root, "borecords");
        this._tiplab = UNodeHelper.find(this._root, "tiplab");
        // this._scroll = UNodeHelper.getComponent(this._root, "bar", cc.ScrollView);
        this._noRecords.active = false;
        this._tiplab.active = false;
        this._back = UNodeHelper.find(this.node, "back");
        UEventHandler.addClick(this._back, this.node, "VRecord", "closeUI");
    }
    /**
     *  隐藏
     */
    hide(handler?: UHandler): void {
        this.node.active = false;
        this.cancel();
    }

    closeUI() {
        super.playclick();
        super.clickClose();
    }
    /**
     * 显示
     */
    show(data: any): void {
        super.show(data);
        this._parent.removeAllChildren();
        this._gameType = data;
        this.regester();

        if (AppGame.ins.currRoomKind == ERoomKind.Club) {
            AppGame.ins.roomModel.requestClubGameRecords(data);
        } else {
            AppGame.ins.roomModel.requestGameRecords(data);
        };

        this._parent.active = false
        // this._scroll.scrollToTop(1 / 60);
    }

    onDisable(): void {
        this.cancel();
    }
    onDestroy() {
        this.cancel();
    }
}
