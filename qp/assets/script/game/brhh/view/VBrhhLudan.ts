import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../../public/base/AppGame";
import VBaseUI from "../../../common/base/VBaseUI";
import UHandler from "../../../common/utility/UHandler";
import USpriteFrames from "../../../common/base/USpriteFrames";
import { HongHei } from "../../../common/cmd/proto";
import MBrhh from "../model/MBrhh";
import UDebug from "../../../common/utility/UDebug";
import HHConstants from "../HHConstants";
import VBrhhScene from "../VBrhhScene";
import AppStatus from "../../../public/base/AppStatus";

/**
 * 创建：朱武
 * 作用：百人红黑路单界面 （弹框）
 */

const NULL_FLAG = -1
const HE_FLAG = 0   // 特殊
const HONG_FLAG = 2  // 红
const HEI_FLAG = 1   // 黑


const DA_LU_W = 24
const DA_YAN_LU_W = 21
const ZHUPANLU_W = 18
const DEFAULT_H = 6


const { ccclass, property } = cc._decorator;

@ccclass
export default class VBrhhLudan extends VBaseUI {

    @property(USpriteFrames)
    spf_frames: USpriteFrames = null;
    @property(cc.Node) Scroll_dalu: cc.Node = null;

    private _node_bg: cc.Node;

    private _node_mask: cc.Node;


    _record_data: Array<Object>;   // 开奖记录

    _is_blink: boolean = false;

    _dalu_data: Array<Array<Object>>;

    _dalu_ui_data: Array<HongHei.IHongHeiGameRecord>;


    _dayanlu_data: Object;
    _xiaoyanlu_data: Object;
    _zhanglanglu_data: Object;


    _show_data: Array<Array<Object>>;
    @property(cc.ScrollView) zhuluScrollView: cc.ScrollView = null;
    private _zhulu_layout: cc.Node; // 珠盘路 
    private _dalu_layout: cc.Node; // 大路
    /*private _dayanzai_layout: cc.Node; // 大眼仔路
    private _xiaolu_layout: cc.Node; // 小路
    private _yueyoulu_layout: cc.Node; // 曱甴路*/
    private _item_row_zhupanlu: cc.Node; // 珠盘路Item
    private _node_dalus: Array<cc.Node>;            // 大路  icon
    private _node_zhupanlus: Array<cc.Node>;     // 珠盘路 icon
    private _node_zhulus: Array<cc.Node>;     // 珠路 icon
    private _node_paixinglus: Array<cc.Node>;     // 牌型路 icon
    _tipSpace: Array<number> = [0, 0];
    /**************************
     * 
     */
    _lab_hong: cc.Label = null;
    _lab_hei: cc.Label = null;

    init(): void {
        this.node.zIndex = 200;

        this._node_bg = UNodeHelper.find(this.node, 'sp_bg');
        this._node_mask = UNodeHelper.find(this.node, 'sp_mask');

        this._lab_hong = UNodeHelper.getComponent(this._node_bg, 'lab_hong', cc.Label);
        this._lab_hei = UNodeHelper.getComponent(this._node_bg, 'lab_hei', cc.Label);
        this.initUI();
    }


    private initUI(): void {

        this._tipSpace = [0, 0];

        this._zhulu_layout = UNodeHelper.find(this._node_bg, 'layout_zhupanlu/view/content');
        this._dalu_layout = UNodeHelper.find(this._node_bg, 'scroll_layout_dalu/view/content');
        /* this._dayanzai_layout = UNodeHelper.find(this._node_bg, 'layout_dayanzailu');
         this._xiaolu_layout = UNodeHelper.find(this._node_bg, 'layout_xiaolu');
         this._yueyoulu_layout = UNodeHelper.find(this._node_bg, 'layout_yueyoulu');*/
        this._item_row_zhupanlu = UNodeHelper.find(this._node_bg, 'item_row');
        this._node_zhulus = [];
        this._node_dalus = [];
        let zhupan_layout = UNodeHelper.find(this._node_bg, 'layout_zhupan');
        this._node_zhupanlus = [];

        for (var i = 0; i < zhupan_layout.children.length; i++) {
            this._node_zhupanlus[i] = zhupan_layout.children[i];
        }

        let paixing_layout = UNodeHelper.find(this._node_bg, 'layout_paixing');
        this._node_paixinglus = [];
        for (var i = 0; i < paixing_layout.children.length; i++) {
            this._node_paixinglus[i] = paixing_layout.children[i];
        }

    }


    testludan(num: number, type: number) {
        for (var i = 1; i <= num; i++) {
            this._record_data.push(type);
        }
    }

    initData(data: any, is_blink?: boolean) {
        this._record_data = [];
        this._record_data = data;
        this._tipSpace = [0, 0];
        this.initZhuluList();
        this.initZhuPanLu();
        this.initZhuLu(is_blink);
        this.initPaixingLu();
    }

    onDisable() {
        AppGame.ins.brhhModel.off(MBrhh.S_GAME_END, this.onGameEnd, this);
        AppGame.ins.brhhModel.off(MBrhh.S_SEND_RECORD, this.onRefleshRecord, this);


    }
    onEnable() {
        AppGame.ins.brhhModel.on(MBrhh.S_GAME_END, this.onGameEnd, this);
        AppGame.ins.brhhModel.on(MBrhh.S_SEND_RECORD, this.onRefleshRecord, this);
    }

    onRefleshRecord(data: any) {
        if (data.hasOwnProperty('record')) {
            this._is_blink = false;
            this.initData(AppGame.ins.brhhModel._game_record.record);
            this._dalu_layout.getComponent('VBrhhDaluController').initData(AppGame.ins.brlhModel._game_record.record);
        }
    }

    onGameEnd(data: any) {
        this._is_blink = true;
        let temp_data = JSON.parse(JSON.stringify(AppGame.ins.brhhModel.gameRecord.record));
        this._record_data = [];
        this._record_data = AppGame.ins.brhhModel.gameRecord.record;
        this.setZhuluTips(temp_data[temp_data.length - 1].winArea, this._is_blink);
        this.initZhuPanLu();
        this.initPaixingLu();
        this._dalu_layout.getComponent('VBrhhDaluController').setTip(temp_data[temp_data.length - 1].winArea, this._is_blink);
    }

    refresh(data: any) {
        UDebug.Log('aaaa');
    }


    // 初始化珠路列表
    initZhuluList() {
        this._zhulu_layout.removeAllChildren();
        let parent = this._zhulu_layout;
        for (let index = 0; index < HHConstants.m_ZlListNumber; index++) {
            var item = cc.instantiate(this._item_row_zhupanlu);
            item.setPosition(cc.v2(0, 0));
            item.parent = parent;
        }
    }

    // 初始化珠路数据
    initZhuLu(is_blink?: boolean) {
        let temp_data = JSON.parse(JSON.stringify(this._record_data));
        // while (temp_data.length > 6 * HHConstants.m_ZlListNumber) {
        //     temp_data.shift();
        // }
        for (let index = 0; index < temp_data.length; index++) {
            if (temp_data[index]) {
                this.setZhuluTips(temp_data[index].winArea, (index == temp_data.length - 1 && is_blink) ? true : false);
            }
            if (index == temp_data.length) {
                this.zhuluScrollView.scrollToRight(0.5);
            }
        }

    }

    setZhuluTips(flag: number, isblink?: boolean) {
        let parent = this._zhulu_layout;
        if (this._tipSpace[0] > parent.children.length - 1) {
            var item = cc.instantiate(this._item_row_zhupanlu);
            item.setPosition(cc.v2(0, 0));
            item.parent = parent;
        }
        var child = parent.children;
        var item = child[this._tipSpace[0]];
        var tips = item.children;
        tips[this._tipSpace[1]].active = true;
        if (flag == HONG_FLAG) {
            tips[this._tipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getFrames('hhdz_roadlist_hong1');
        } else if (flag == HEI_FLAG) {
            tips[this._tipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getFrames('hhdz_roadlist_hei1');
        }
        if (isblink) {
            tips[this._tipSpace[1]].runAction(cc.blink(3, 6));
        }
        this.count();
        if (this._tipSpace[0] >= HHConstants.m_ZlListNumber) {
            this.zhuluScrollView.scrollToRight(0.5);
        }
    }

    setDaluTip(flag: number) {
        var js = this.Scroll_dalu.getComponent('VBrhhDaluController')
        var b = js.setTip(flag)
    }
    // setZhuluTipSpriteFrame() {

    // }
    count() {
        if (this._tipSpace[1] == 5) {
            this._tipSpace[0]++;
            this._tipSpace[1] = 0;
        } else {
            this._tipSpace[1]++
        }
    }


    initZhuPanLu() {
        let temp_data = JSON.parse(JSON.stringify(this._record_data));

        if (temp_data.length == 0) {
            this._lab_hei.string = '0%';
            this._lab_hong.string = '0%';
            return;
        }
        while (temp_data.length > 20/*this._node_zhupanlus.length*/) {
            temp_data.shift();
        }

        var hong_count = 0;
        var hei_count = 0;

        for (let index = 0; index < temp_data.length/*this._node_zhupanlus.length*/; index++) {
            // var item = this._node_zhupanlus[index];
            if (temp_data[index]) {
                // item['data'] = temp_data[index].winArea;
                if (temp_data[index].winArea == HONG_FLAG) {
                    hong_count += 1;
                } else if (temp_data[index].winArea == HEI_FLAG) {
                    hei_count += 1;
                }
            }
        }

        let temp_length = temp_data.length == 0 ? 100 : temp_data.length;

        let ret_hong = hong_count / temp_length * 100;
        ret_hong = Math.round(ret_hong);
        let ret_hei = 100 - ret_hong//Math.floor(ret_hei);

        this._lab_hei.string = ret_hei + '%';
        this._lab_hong.string = ret_hong + '%';
    }


    updateZhuPanLu() {
        let last_node = null;
        this._node_zhupanlus.forEach(item => {
            item.active = true;
            if (item['data'] == HONG_FLAG) {
                item.getComponent(cc.Sprite).spriteFrame = this.spf_frames.getFrames('hhdz_roadlist_hong1');
            }
            else if (item['data'] == HEI_FLAG) {
                item.getComponent(cc.Sprite).spriteFrame = this.spf_frames.getFrames('hhdz_roadlist_hei1');
            }
            else {
                item.active = false;
            }
            if (item.active)
                last_node = item;
        });
        if (last_node && this._is_blink)
            last_node.runAction(cc.blink(3, 6));
    }


    initPaixingLu() {
        let temp_data = JSON.parse(JSON.stringify(this._record_data));

        while (temp_data.length > this._node_paixinglus.length) {
            temp_data.shift();
        }

        var hong_count = 0;
        var hei_count = 0;
        let last_node = null;
        for (let index = 0; index < this._node_paixinglus.length; index++) {
            var item = this._node_paixinglus[index];
            item.active = true;

            if (temp_data[index]) {
                if (temp_data[index].cardGroupType == 0) {  // 单张
                    item.getComponent(cc.Sprite).spriteFrame = this.spf_frames.getFrames('hhdz_roadlist_danz');
                } else if (temp_data[index].cardGroupType == 1) {  // 对子
                    item.getComponent(cc.Sprite).spriteFrame = this.spf_frames.getFrames('hhdz_roadlist_dz');

                } else if (temp_data[index].cardGroupType == 2) { // 顺子
                    item.getComponent(cc.Sprite).spriteFrame = this.spf_frames.getFrames('hhdz_roadlist_sz');
                } else if (temp_data[index].cardGroupType == 3) {    //金花
                    item.getComponent(cc.Sprite).spriteFrame = this.spf_frames.getFrames('hhdz_roadlist_jh');
                } else if (temp_data[index].cardGroupType == 4) { // 顺金
                    item.getComponent(cc.Sprite).spriteFrame = this.spf_frames.getFrames('hhdz_roadlist_sj');
                } else if (temp_data[index].cardGroupType == 5) { // 豹子
                    item.getComponent(cc.Sprite).spriteFrame = this.spf_frames.getFrames('hhdz_roadlist_bz');
                } else {
                    item.active = false;
                }
            } else {
                item.active = false;
            }
            if (item.active && this._is_blink)
                last_node = item;
        }

        if (last_node && this._is_blink)
            last_node.runAction(cc.blink(3, 6));

    }




    /** 初始化大路 */
    initDaLu() {

        this.initShowData();



        UDebug.Log('aaabb');
    }



    initShowData() {
        let numW = 0;
        let numH = 0;
        this._show_data = [];
        this._show_data[numW] = [];
        this._show_data[numW][numH] = {};
        this._show_data[numW][numH]['numValue'] = 0;

        for (var i = 0; i < this._dalu_ui_data.length; i++) {

            var data = this._dalu_ui_data[i].winArea;
            while (true) {

                if (numH == 0 && this._show_data[numW][numH]['data'] == undefined) {
                    this._show_data[numW][numH]['data'] = data;
                    break;
                }

                if (this._show_data[numW][numH]['data'] == data) {
                    numH += 1;
                }
                else {
                    numH = 0;
                    numW += 1;
                    this._show_data[numW] = [];
                }
                this._show_data[numW][numH] = {};
                this._show_data[numW][numH]['numValue'] = 0;
                this._show_data[numW][numH]['data'] = data;
                break;
            }
        }
    }


    daluInitData() {
        this._dalu_ui_data = JSON.parse(JSON.stringify(this._record_data));
        this.initShowData();
    }

    daluAddData(data) {

        this._dalu_ui_data.push(data);

        this.initShowData();
    }


    moveDaLuData() {
        var tmpdata = this._dalu_ui_data

        var value = this._dalu_data[0][0]['data'];

        var i = 0;
        while (true) {
            if (!tmpdata[i]) {
                this._dalu_ui_data = [];
                this._dalu_data['numW'] = 0;
                this._dalu_data['numH'] = 0;
                break;
            }

            if (tmpdata[i].winArea == value || tmpdata[i].winArea == HE_FLAG) {
                tmpdata.shift();
            }
            else {
                break;
            }
        }

        if (!tmpdata) { return; }

        this.daluShow();
    }


    /**
     * 刷新对应的大路数据
     */
    daluShow() {

        this._dalu_data = [];
        for (var i = 0; i < DA_LU_W; i++) {
            this._dalu_data[i] = [];
            for (var j = 0; j < DEFAULT_H; j++) {
                this._dalu_data[i][j] = {};
                this._dalu_data[i][j]['data'] = NULL_FLAG;
                this._dalu_data[i][j]['numValue'] = 0;
            }
        }

        if (!this._dalu_ui_data) { return; }

        var numW = 0;
        var numH = 0;

        var startPos = 0;

        var dalu_numW = numW;
        var dalu_numH = numH;

        for (let index = 0; index < this._dalu_ui_data.length; index++) {
            var data = this._dalu_ui_data[index].winArea;

            while (true) {


                if (index == startPos) {
                    this._dalu_data[numW][numH]['data'] = data;
                    break;
                }

                if (this._dalu_data[numW][numH]['data'] == data) {

                    if (this._dalu_data[numW][numH + 1] == undefined || this._dalu_data[numW][numH + 1]['data'] != NULL_FLAG) {

                        var movedis = numW + 1;

                        while (true) {
                            if (this._dalu_data[movedis] && this._dalu_data[movedis][numH]['data'] == NULL_FLAG) {

                                this._dalu_data[movedis][numH]['data'] = data;
                                dalu_numW = movedis;
                                dalu_numH = numH;
                                break;
                            }
                            else {
                                movedis += 1;
                                if (movedis > DA_LU_W - 1) {
                                    this.moveDaLuData();
                                    return;
                                }
                            }
                        }

                        break;
                    }
                    else {
                        numH += 1;
                    }
                }
                else {
                    numW = 0;

                    while (this._dalu_data[numW][0]['data'] != NULL_FLAG) {
                        numW += 1;
                        if (numW > this._node_dalus.length - 1) {
                            this.moveDaLuData();
                            return;
                        }
                    }
                    numH = 0;
                }

                this._dalu_data[numW][numH]['data'] = data;
                dalu_numH = numH;
                dalu_numW = numW;
                break;
            }
        }
        this.updateDaLu();

    }


    /** 更新大路 */
    updateDaLu() {
        let last_node = null;
        for (var i = 0; i < this._node_dalus.length; i++) {

            for (var j = 0; j < DEFAULT_H; j++) {

                var item = this._node_dalus[i].getChildByName('sp_' + (j + 1));
                var lab_he = item.getChildByName('lab_he')
                item.active = true;
                var data = this._dalu_data[i][j];

                if (data['data'] == HEI_FLAG) {

                    item.getComponent(cc.Sprite).spriteFrame = this.spf_frames.getFrames('hhdz_roadlist_hei2');
                }
                else if (data['data'] == HONG_FLAG) {

                    item.getComponent(cc.Sprite).spriteFrame = this.spf_frames.getFrames('hhdz_roadlist_hong2');
                } else {
                    item.active = false;
                }
                if (item.active)
                    last_node = item;
            }
        }

        if (last_node && this._is_blink)
            last_node.runAction(cc.blink(3, 6));

    }



    onClickClose() {
        // let ac = cc.scaleTo(0.2, 0.8, .8);
        // ac.easing(cc.easeInOut(2.0));
        // let ac2 = cc.fadeOut(0.2);

        // let spa = cc.spawn(ac, ac2);

        // this._node_mask.runAction(cc.fadeOut(0.1));
        // this._node_bg.stopAllActions();
        // this._node_bg.runAction(cc.sequence(spa, cc.callFunc(() => {
        //     AppGame.ins.closeUI(this.uiType);
        // }, this)));

        // let ac = cc.scaleTo(0.2, 1, 0.01);
        // ac.easing(cc.easeInOut(2.0));
        // // let ac2 = cc.fadeOut(0.2);

        // // let spa = cc.spawn(ac, ac2);

        // this._node_mask.runAction(cc.fadeOut(0.1));
        // this._node_bg.stopAllActions();
        // this._node_bg.runAction(cc.sequence(ac, cc.callFunc(() => {
        //     AppGame.ins.closeUI(this.uiType);
        // }, this)));
        AppGame.ins.closeUI(this.uiType);

    }


    hide(handler?: UHandler) {
        VBrhhScene.ins._music_mgr.playClick();
        this.node.active = false;
    }

    show(data: any): void {
        // this.node.active = true;
        // this._node_bg.opacity = 255;
        // this._node_bg.scale = 0.01;
        // let ac = cc.scaleTo(0.2, 1.1, 1.1);
        // let ac2 = cc.scaleTo(0.1, 1, 1);
        // let seq = cc.sequence(ac, ac2);
        // ac.easing(cc.easeInOut(2.0));
        // this._node_bg.runAction(seq);

        // this._node_mask.opacity = 0.1;
        // this._node_mask.runAction(cc.fadeTo(0.5, 120));
        // this.initData(AppGame.ins.brhhModel.gameRecord.record);

        // this.node.active = true;
        // // this._node_bg.opacity = 255;
        // // // this._node_bg.scale = 0.01;
        // // this._node_bg.y = 672;
        // // let ac = cc.moveTo(0.2, 0, 60);
        // // let ac2 = cc.moveTo(0.1, 0, 65);
        // // let seq = cc.sequence(ac, ac2);
        // // ac.easing(cc.easeInOut(2.0));

        // let ac = cc.scaleTo(0.2, 1, 1.05);
        // let ac2 = cc.scaleTo(0.05, 1);
        // let seq = cc.sequence(ac, ac2);
        // this._node_bg.scaleY = 0;
        // // let ac = cc.scaleTo(0.2, 1, 1);
        // this._node_bg.runAction(seq);

        // this._node_mask.opacity = 0.1;
        // this._node_mask.runAction(cc.fadeTo(0.5, 120));

        this._is_blink = false;
        this.initData(AppGame.ins.brhhModel.gameRecord.record);
        this._dalu_layout.getComponent('VBrhhDaluController').initData(AppGame.ins.brhhModel.gameRecord.record);


    }




    // update (dt) {}
}
