import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../../public/base/AppGame";
import VBaseUI from "../../../common/base/VBaseUI";
import UHandler from "../../../common/utility/UHandler";
import MBrebg from "../model/MBrebg";
import { Ebg } from "../../../common/cmd/proto";
import UDebug from "../../../common/utility/UDebug";


/**
 * 创建：朱武
 * 作用：百人牛牛路单界面 （弹框）
 */

const NULL_FLAG = -1


const MAX_W = 10

class LUDAN_ITEM {
    [1]: 1;
    [2]: 1;
    [3]: 1;
}

const { ccclass, property } = cc._decorator;

@ccclass
export default class VBrnnLudan extends VBaseUI {

    @property(cc.SpriteFrame)
    spf_win: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spf_lose: cc.SpriteFrame = null;

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
        // 测试   
    }


    onDisable() {

        AppGame.ins.brebgModel.off(MBrebg.S_GameEnd, this.onGameEnd, this);
    }
    onEnable() {
        AppGame.ins.brebgModel.on(MBrebg.S_GameEnd, this.onGameEnd, this);
    }

    private initUI(): void {

        for (let i = 1; i <= 10; i++) {
            let item_row = UNodeHelper.find(this._node_bg, 'item_row_' + i);
            this._node_items.push(item_row);
        }
    }


    initData(data: any) {
        this._record_data = [];
        this._record_data = JSON.parse(JSON.stringify(data));
        this.updateUI();
    }

    addRecordData(data: any) {

        this._record_data.push(data);
        this.updateUI();
    }


    updateUI() {

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

            for (let i = 1; i <= 3; i++) {
                let sp_item = UNodeHelper.getComponent(item_node , 'sp_' + i , cc.Sprite);
                let node_new = UNodeHelper.find(sp_item.node , 'sp_new');
                node_new.active = false;
                if (element[i-1]) {
                    sp_item.spriteFrame = this.spf_win;
                }
                else {
                    sp_item.spriteFrame = this.spf_lose;
                }
            }
        }

        if (last_row) {
            for (let i = 1; i <= 3; i++) {
                let sp_item = UNodeHelper.getComponent(last_row , 'sp_' + i , cc.Sprite);
                let node_new = UNodeHelper.find(sp_item.node , 'sp_new');
                node_new.active = true;
            }

            if (this._is_blink) {
                last_row.runAction(cc.blink(3,6));
            }

        }
    }


    getWinTag(code: number): any {
        let tian = (code & 8) != 0;
        let di = (code & 4) != 0;
        let xuan = (code & 2) != 0;
        let huang = (code & 1) != 0;

        return { [1]: tian, [2]: di, [3]: xuan, [4]: huang };
    }

    onGameEnd(data: Ebg.CMD_S_GameEnd) {

        let code = data.deskData.winTag;

        let shun = (code & 4) != 0;
        let tian = (code & 2) != 0;
        let di = (code & 1) != 0;

        let temp_data = { [0]: shun, [1]: tian, [2]: di}

        this._is_blink = true;

        this.node.runAction(cc.sequence(cc.delayTime(6) , cc.callFunc(()=>{
            this.addRecordData(temp_data);
        }))) 
    }



    onClickClose() {
        let ac = cc.scaleTo(0.2, 0.8);
        let ac2 = cc.fadeOut(0.2);
        let spw = cc.spawn(ac , ac2);

        ac.easing(cc.easeInOut(2.0));
    

        this._node_mask.runAction(cc.fadeOut(0.2));
        this._node_bg.stopAllActions();
        this._node_bg.runAction(cc.sequence(spw, cc.callFunc(() => {
            AppGame.ins.closeUI(this.uiType);
        }, this)));
    }


    hide(handler?: UHandler) {
        this.node.active = false;
    }

    show(data: any): void {
        this.node.active = true;
        this._node_bg.opacity = 255;
        this._node_bg.scale = 0.8;
        // this._node_bg.scale = 0.01;
        // this._node_bg.y = 672;
        let ac = cc.scaleTo(0.1, 1.05);
        let ac2 = cc.scaleTo(0.05, 1);
        let seq = cc.sequence(ac, ac2);
        // ac.easing(cc.easeInOut(2.0));
        this._node_bg.runAction(seq);

        this._node_mask.opacity = 0.1;
        this._node_mask.runAction(cc.fadeTo(0.5, 120));
        this._is_blink = false;
        this.initData(data);
    }
}
