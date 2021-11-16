import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../../public/base/AppGame";
import VBaseUI from "../../../common/base/VBaseUI";
import UHandler from "../../../common/utility/UHandler";
import MBrjh from "../model/MBrjh";
import { Brjh } from "../../../common/cmd/proto";

const NULL_FLAG = -1
const MAX_W = 10
class LUDAN_ITEM {
    [1]: false;
    [2]: false;
    [3]: false;
    [4]: false;
}
const { ccclass, property } = cc._decorator;

@ccclass
export default class VBrjhLudan extends VBaseUI {

    @property(cc.SpriteFrame) spf_win: cc.SpriteFrame = null;
    @property(cc.SpriteFrame) spf_lose: cc.SpriteFrame = null;
    private _node_bg: cc.Node;
    private _node_mask: cc.Node;
    private _node_items: cc.Node[] = [];
    private _record_data: LUDAN_ITEM[] = [];
    private _is_blink: boolean = false;   // 是否需要闪烁

    init(): void {
        this.node.zIndex = 200;
        this._node_bg = UNodeHelper.find(this.node, 'sp_bg');
        this._node_mask = UNodeHelper.find(this.node, 'sp_mask');
        this.initUI();
    }

    onEnable() {
        AppGame.ins.brjhModel.on(MBrjh.S_GAME_END, this.onGameEnd, this);
        AppGame.ins.brjhModel.on(MBrjh.TO_BACK_CLEAR, this.toBackClear, this);

        AppGame.ins.brjhModel.on(MBrjh.GAMESCENE_STATUS_JETTON, this.onGameSceneStatusJetton, this);
        AppGame.ins.brjhModel.on(MBrjh.GAMESCENE_STATUS_OPEN, this.onGameSceneStatusOpen, this);
        AppGame.ins.brjhModel.on(MBrjh.GAMESCENE_STATUS_END, this.onGameSceneStatusEnd, this);

        AppGame.ins.brjhModel.on(MBrjh.S_SEND_RECORD, this.onGameRecord, this);
    }

    onDisable() {
        AppGame.ins.brjhModel.off(MBrjh.S_GAME_END, this.onGameEnd, this);
        AppGame.ins.brjhModel.off(MBrjh.TO_BACK_CLEAR, this.toBackClear, this);

        AppGame.ins.brjhModel.off(MBrjh.GAMESCENE_STATUS_JETTON, this.onGameSceneStatusJetton, this);
        AppGame.ins.brjhModel.off(MBrjh.GAMESCENE_STATUS_OPEN, this.onGameSceneStatusOpen, this);
        AppGame.ins.brjhModel.off(MBrjh.GAMESCENE_STATUS_END, this.onGameSceneStatusEnd, this);

        AppGame.ins.brjhModel.off(MBrjh.S_SEND_RECORD, this.onGameRecord, this);
    }

    onGameRecord() {
        this.updateUI();
    }

    onGameSceneStatusJetton(data: Brjh.CMD_Scene_StatusJetton) {
        this.initData(AppGame.ins.brjhModel.recordData);
    }

    onGameSceneStatusOpen(data: Brjh.CMD_Scene_StatusOpen) {
        this.initData(AppGame.ins.brjhModel.recordData);
    }

    onGameSceneStatusEnd(data: Brjh.CMD_Scene_StatusEnd) {
        this.initData(AppGame.ins.brjhModel.recordData);
    }

    private initUI(): void {
        for (let i = 1; i <= 10; i++) {
            let item_row = UNodeHelper.find(this._node_bg, 'item_row_' + i);
            this._node_items.push(item_row);
        }
    }

    initData(data: any) {
        this._record_data = [];
    }

    updateUI() {
        let data = AppGame.ins.brjhModel.recordData;
        this._record_data = JSON.parse(JSON.stringify(data));
        while (this._record_data.length > MAX_W) {
            this._record_data.shift();
        }
        this._node_items.forEach(element => {
            element.active = false;
        });
        let last_row = null;
        for (let index = 0; index < this._record_data.length; index++) {
            const element = this._record_data[index];
            let item_node = this._node_items[index];
            item_node.active = true;
            last_row = item_node;
            for (let i = 1; i <= 4; i++) {
                let sp_item = UNodeHelper.getComponent(item_node, 'sp_' + i, cc.Sprite);
                let node_new = UNodeHelper.find(sp_item.node, 'sp_new');
                node_new.active = false;
                if (element[i]) {
                    sp_item.spriteFrame = this.spf_win.clone();
                }
                else {
                    sp_item.spriteFrame = this.spf_lose.clone();
                }
            }
        }

        if (last_row) {
            for (let i = 1; i <= 4; i++) {
                let sp_item = UNodeHelper.getComponent(last_row, 'sp_' + i, cc.Sprite);
                let node_new = UNodeHelper.find(sp_item.node, 'sp_new');
                node_new.active = true;
            }
            if (this._is_blink) {
                last_row.runAction(cc.blink(3, 6));
            }
        }

        this._is_blink = false;
    }

    onGameEnd(data: any) {
        this._is_blink = true;
    }

    toBackClear() {
        this.node.stopAllActions();
    }

    onClickClose() {
        AppGame.ins.closeUI(this.uiType);
    }

    hide(handler?: UHandler) {
        this.node.active = false;
    }

    show(data: any): void {
        this.node.active = true;
        this._node_bg.opacity = 255;
        this._node_bg.scale = 0.8;
        let ac = cc.scaleTo(0.1, 1.05);
        let ac2 = cc.scaleTo(0.05, 1);
        let seq = cc.sequence(ac, ac2);
        this._node_bg.runAction(seq);
        this._node_mask.opacity = 0.1;
        this._node_mask.runAction(cc.fadeTo(0.5, 120));
        this._is_blink = false;
        this.initData(data);
        this.updateUI();
    }
}