import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../../public/base/AppGame";
import VBaseUI from "../../../common/base/VBaseUI";
import UHandler from "../../../common/utility/UHandler";
import MBrlh from "../model/MBrlh";
import UDebug from "../../../common/utility/UDebug";
import LHConstants from "../LHConstants";
import USpriteFrames from "../../../common/base/USpriteFrames";
import VBrlhScene from "../VBrlhScene";
import AppStatus from "../../../public/base/AppStatus";

/**
 * 创建：朱武
 * 作用：百人龙虎路单界面 （弹框）
 */

const NULL_FLAG = -1
const HE_FLAG = 1   // 和
const LONG_FLAG = 2  // 龙
const HU_FLAG = 3   // 虎


const DA_LU_W = 20
const DA_YAN_LU_W = 21
const ZHUPANLU_W = 20
const DEFAULT_H = 7


const { ccclass, property } = cc._decorator;

@ccclass
export default class VBrlhLudan_new extends VBaseUI {
    @property(USpriteFrames)
    spf_frames: USpriteFrames = null;
    @property(cc.Node) Scroll_dalu: cc.Node = null;
    // @property(cc.SpriteAtlas)
    sp_atlas: cc.SpriteAtlas = null;

    @property(cc.SpriteFrame)
    spf_long: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spf_hu: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spf_he: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spf_ld_long: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spf_ld_hu: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spf_ld_he: cc.SpriteFrame = null;

    @property(cc.Label)
    count_long: cc.Label = null;
    @property(cc.Label)
    count_hu: cc.Label = null;
    @property(cc.Label)
    count_he: cc.Label = null;
    @property(cc.Label)
    count_all: cc.Label = null;



    private _node_bg: cc.Node;
    private _node_mask: cc.Node;

    @property(cc.ScrollView) zhuluScrollView: cc.ScrollView = null;
    private _zhulu_layout: cc.Node; // 珠盘路 
    private _dalu_layout: cc.Node; // 大路
    private _item_row_zhupanlu: cc.Node; // 珠盘路Item
    private _node_dalus: Array<cc.Node>;            // 大路  icon
    private _node_dayanlus: Array<cc.Node>;         // 大眼路 icon    
    private _node_xiaoyanlus: Array<cc.Node>;       // 小眼路 icon
    private _node_zhanglanglus: Array<cc.Node>;     // 蟑螂路 icon
    private _node_zhupanlus: Array<cc.Node>;     // 珠盘路 icon

    _record_data: Array<number>;   // 开奖记录

    _is_blink: boolean = false;

    _dalu_data: Array<Array<Object>>;

    _dalu_ui_data: Array<number>;



    _dayanlu_data: Object;
    _xiaoyanlu_data: Object;
    _zhanglanglu_data: Object;


    _show_data: Array<Array<Object>>;


    _lab_long: cc.Label;
    _lab_hu: cc.Label;

    _tipSpace: Array<number> = [0, 0];
    init(): void {
        this.node.zIndex = 200;

        this._node_bg = UNodeHelper.find(this.node, 'sp_bg');
        this._node_mask = UNodeHelper.find(this.node, 'sp_mask');

        this._lab_hu = UNodeHelper.getComponent(this._node_bg, 'lab_hu', cc.Label);
        this._lab_long = UNodeHelper.getComponent(this._node_bg, 'lab_long', cc.Label);



        this.initUI();




        // 测试
        // this.initData([2,3,3,2,3,2,2,3,2,2,3,3,2,2,2,3,2,2,2,2,2,2,2,2,3,3,2,3,3,3,3,3,3,3,2,2,2,3,2,3,3,3,3,1,2,3,3,2,3,2,3,2,2,2,2,2,2,3,2,3,2,2,3,2,3,2,3,3,3,3,3,2,2,3,2]);
        // this.initData([ 2, 2, 2, 2, 2, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 3, 3, 3, 3, 3, 3]);
        // this.initData([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3]);




    }


    onDestroy() {

    }

    onDisable() {
        AppGame.ins.brlhModel.off(MBrlh.S_GAME_END, this.onGameEnd, this);
        AppGame.ins.brlhModel.off(MBrlh.S_SEND_RECORD, this.onRefleshRecord, this);

    }
    onEnable() {
        AppGame.ins.brlhModel.on(MBrlh.S_SEND_RECORD, this.onRefleshRecord, this);
        AppGame.ins.brlhModel.on(MBrlh.S_GAME_END, this.onGameEnd, this);

    }

    onRefleshRecord(data: any) {
        if(data.hasOwnProperty('record')) {
            this._is_blink = false;
            this.initData(AppGame.ins.brlhModel._game_record.record);
            this._dalu_layout.getComponent('VBrlhDaluController').initData(AppGame.ins.brlhModel._game_record.record);
        }
    }

    onGameEnd(data: any) {
        this._is_blink = true;
        let temp_data = JSON.parse(JSON.stringify(AppGame.ins.brlhModel._game_record.record));
        this._record_data = [];
        this._record_data = AppGame.ins.brlhModel._game_record.record;
        this.setZhuluTips(temp_data[temp_data.length - 1], this._is_blink);
        this.initZhuPanLu();
        this._dalu_layout.getComponent('VBrlhDaluController').setTip(temp_data[temp_data.length - 1], this._is_blink);

    }

    private initUI(): void {
        this._tipSpace = [0, 0];
        this._zhulu_layout = UNodeHelper.find(this._node_bg, 'layout_zhupanlu/view/content');
        this._dalu_layout = UNodeHelper.find(this._node_bg, 'scroll_layout_dalu/view/content');
        this._item_row_zhupanlu = UNodeHelper.find(this._node_bg, 'item_row');
        let dalu_layout = UNodeHelper.find(this._node_bg, 'layout_dalu');
        let dalu_item = UNodeHelper.find(dalu_layout, 'item_row_1');
        this._node_dalus = [];
        this._node_dalus[0] = dalu_item;

        for (var i = 1; i < DA_LU_W; i++) {
            var item = cc.instantiate(dalu_item);
            item.parent = dalu_layout;
            this._node_dalus[i] = item;
        }


        let zhupan_layout = UNodeHelper.find(this._node_bg, 'layout_zhupan');
        let zhupan_item = UNodeHelper.find(zhupan_layout, 'sp_1');
        this._node_zhupanlus = [];
        this._node_zhupanlus[0] = zhupan_item;

        for (var i = 1; i < ZHUPANLU_W; i++) {
            var item = cc.instantiate(zhupan_item);
            item.parent = zhupan_layout;
            item.x = 43.5 * i + zhupan_item.x;
            this._node_zhupanlus[i] = item;
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
        this.daluInitData();
        this.daluShow();

    }


    refresh(data: any) {
        UDebug.Log('aaaa');
    }

    // 初始化珠路列表
    initZhuluList() {
        this._zhulu_layout.removeAllChildren();
        let parent = this._zhulu_layout;
        for (let index = 0; index < LHConstants.m_ZlListNumber; index++) {
            var item = cc.instantiate(this._item_row_zhupanlu);
            item.setPosition(cc.v2(0, 0));
            item.parent = parent;
        }
    }

    // 初始化珠路数据
    initZhuLu(is_blink?: boolean) {
        // this._zhulu_layout.removeAllChildren();
        let temp_data = JSON.parse(JSON.stringify(this._record_data));
        // while (temp_data.length > 6 * LHConstants.m_ZlListNumber) {
        //     temp_data.shift();
        // }
        for (let index = 0; index < temp_data.length; index++) {
            if (temp_data[index]) {
                this.setZhuluTips(temp_data[index], (index == temp_data.length - 1 && is_blink) ? true : false);
            }
            if (index == temp_data.length) {
                this.zhuluScrollView.scrollToRight(0.5);
            }
        }

    }

    setZhuluTips(flag: number, isblink?: boolean) { 
        let parent = this._zhulu_layout;
        if (this._tipSpace[0] > parent.children.length - 1) {
            // this._zhulu_layout.children[0].removeFromParent();
            // this._tipSpace[0]--;
            var item = cc.instantiate(this._item_row_zhupanlu);
            item.setPosition(cc.v2(0, 0));
            item.parent = parent;
        }
        var child = parent.children;
        var item = child[this._tipSpace[0]];
        var tips = item.children;
        tips[this._tipSpace[1]].active = true;
        if (flag == LONG_FLAG) {
            tips[this._tipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getFrames('lhd_roadlist_long1');
        } else if (flag == HU_FLAG) {
            tips[this._tipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getFrames('lhd_roadlist_hu1');
        } else if (flag == HE_FLAG) {
            tips[this._tipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getFrames('lhd_roadlist_he1');
        }
        if (isblink) {
            tips[this._tipSpace[1]].runAction(cc.blink(3, 6));
        }
        this.count();
        if (this._tipSpace[0] >= LHConstants.m_ZlListNumber) {
            this.zhuluScrollView.scrollToRight(0.5);
        }
        // this.setDaluTip(flag)
    }

    count() {
        if (this._tipSpace[1] == 5) {
            this._tipSpace[0]++;
            this._tipSpace[1] = 0;
        } else {
            this._tipSpace[1]++
        }
    }

    /**初始化珠盘路 */
    initZhuPanLu() {

        let temp_data = JSON.parse(JSON.stringify(this._record_data));
        let temp_count_data = temp_data;
        var all_count_long = 0;
        var all_count_hu = 0;
        var all_count_he = 0;
        for (let i = 0; i < temp_count_data.length; i++) {
            const element = temp_count_data[i];
            if (element) {
                if (element == LONG_FLAG) {
                    all_count_long += 1;
                } else if (element == HU_FLAG) {
                    all_count_hu += 1;
                } else if (element == HE_FLAG) {
                    all_count_he += 1;
                }
            }
        }
        this.count_long.string = "龙" + all_count_long;
        this.count_hu.string = "虎" + all_count_hu;
        this.count_he.string = "和" + all_count_he;
        this.count_all.string = "局数" + temp_count_data.length;

        if (temp_data.length == 0) {
            this._lab_hu.string = '0%';
            this._lab_long.string = '0%';
            return;
        }

        while (temp_data.length > ZHUPANLU_W) {
            temp_data.shift();
        }

        var long_count = 0;
        var hu_count = 0;


        for (let index = 0; index < temp_data.length/*this._node_zhupanlus.length*/; index++) {
            // var item = this._node_zhupanlus[index];
            // item['data'] = NULL_FLAG;
            if (temp_data[index]) {
                // item['data'] = temp_data[index];
                if (temp_data[index] == LONG_FLAG) {
                    long_count += 1;
                } else if (temp_data[index] == HU_FLAG) {
                    hu_count += 1;
                }
            }
        }

        let ret_long = long_count / (long_count + hu_count) * 100;
        // let ret_hu = hu_count / (long_count+hu_count) * 100;

        ret_long = Math.round(ret_long);
        // ret_hu = Math.round(ret_hu);

        this._lab_long.string = ret_long + '%';
        this._lab_hu.string = (100 - ret_long) + '%';
    }

    /**更新珠盘路 */
    updateZhuPanLu() {
        let last_node = null;
        this._node_zhupanlus.forEach(item => {
            item.active = true;
            if (item['data'] == LONG_FLAG) {
                item.getComponent(cc.Sprite).spriteFrame = this.spf_long;
            }
            else if (item['data'] == HU_FLAG) {
                item.getComponent(cc.Sprite).spriteFrame = this.spf_hu;

            }
            else if (item['data'] == HE_FLAG) {
                item.getComponent(cc.Sprite).spriteFrame = this.spf_he;
            }
            else {
                item.active = false;
            }

            if (item.active)
                last_node = item;
        });

        if (last_node && this._is_blink) {
            last_node.stopAllActions();
            last_node.runAction(cc.blink(3, 6));
        }
    }






    /** 初始化大路 */
    initDaLu() {

        this.initShowData();

        // var numW = 0;
        // var numH = 0;
        // var startPos = 0;

        // var cur_posx = 0;
        // var cur_posy = 0;   
        // /**
        //  * 当前坐标系
        //  * 0，1，2，3，4，5，6
        //  * 1，
        //  * 2，
        //  * 3，
        //  * 4，
        //  *  */    


        // this._dalu_data = [];
        // var self = this;

        // // 插入一列新的
        // function pushOneLie (){
        //     var lie = [];
        //     lie[0] = {type:NULL_FLAG , henum:0};
        //     lie[1] = {type:NULL_FLAG , henum:0};
        //     lie[2] = {type:NULL_FLAG , henum:0};
        //     lie[3] = {type:NULL_FLAG , henum:0};
        //     lie[4] = {type:NULL_FLAG , henum:0};
        //     lie[5] = {type:NULL_FLAG , henum:0};
        //     self._dalu_data.push(lie);
        // }


        // pushOneLie();
        // pushOneLie();
        // pushOneLie();
        // pushOneLie();


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

            var data = this._dalu_ui_data[i];
            while (true) {
                // if (data == HE_FLAG) {
                //     this._show_data[numW][numH]['numValue'] += 1;
                //     break;
                // }

                // UDebug.Log(this._show_data[numW][numH]['data']);


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

            if (tmpdata[i] == value || tmpdata[i] == HE_FLAG) {
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
        for (var i = 0; i <= DA_LU_W; i++) {
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
            var data = this._dalu_ui_data[index];

            while (true) {
                // if (data == HE_FLAG) {
                //     this._dalu_data[dalu_numW][dalu_numH]['numValue'] += 1;
                //     startPos += 1;
                //     break;
                // }

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
                        if (numW > DA_LU_W - 1) {
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
        for (var i = 0; i < DA_LU_W; i++) {

            for (var j = 0; j < DEFAULT_H; j++) {

                var item = this._node_dalus[i].getChildByName('sp_' + (j + 1));
                var lab_he = item.getChildByName('lab_he')
                item.active = true;
                var data = this._dalu_data[i][j];

                if (data['data'] == HU_FLAG) {

                    // item.getComponent(cc.Sprite).spriteFrame = this.sp_atlas.getSpriteFrame('lh_game_chart_DL_hu');
                    item.getComponent(cc.Sprite).spriteFrame = this.spf_ld_hu;
                }
                else if (data['data'] == LONG_FLAG) {

                    // item.getComponent(cc.Sprite).spriteFrame = this.sp_atlas.getSpriteFrame('lh_game_chart_DL_long');
                    item.getComponent(cc.Sprite).spriteFrame = this.spf_ld_long;
                }
                else if (data['data'] == HE_FLAG) {
                    item.getComponent(cc.Sprite).spriteFrame = this.spf_ld_he;
                }
                else {
                    item.active = false;
                }

                if (item.active)
                    last_node = item;
            }
        }

        if (last_node && this._is_blink) {
            last_node.stopAllActions();
            last_node.runAction(cc.blink(3, 6));
        }

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

        // let ac2 = cc.moveTo(0.1 , );
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
        VBrlhScene.ins._music_mgr.playClick();
        this.node.active = false;
    }

    show(data: any): void {
        // this.node.active = true;
        // this._node_bg.opacity = 255;
        // // this._node_bg.scale = 0.01;
        // // this._node_bg.y = 672;
        // // this._node_bg.scaleY = 0;
        // // let ac = cc.scaleTo(0.2, 1, 1);
        // // let ac2 = cc.moveTo(0.1, 0, 65);
        // // let seq = cc.sequence(ac, ac2);
        // // ac.easing(cc.easeInOut(2.0));

        // let ac = cc.scaleTo(0.2, 1, 1.05);
        // let ac2 = cc.scaleTo(0.05, 1);
        // let seq = cc.sequence(ac, ac2);
        // this._node_bg.scaleY = 0;

        // this._node_bg.runAction(seq);

        // this._node_mask.opacity = 0.1;
        // this._node_mask.runAction(cc.fadeTo(0.5, 150));

        this._is_blink = false;

        this.initData(AppGame.ins.brlhModel._game_record.record);
        this._dalu_layout.getComponent('VBrlhDaluController').initData(AppGame.ins.brlhModel._game_record.record);
        // this.initData([]);

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
        // this.initData(AppGame.ins.brlhModel._game_record.record);

    }




    // update (dt) {}
}
