import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../../public/base/AppGame";
import VBaseUI from "../../../common/base/VBaseUI";
import UHandler from "../../../common/utility/UHandler";
import UDebug from "../../../common/utility/UDebug";

/**
 * 创建：朱武
 * 作用：百人龙虎路单界面 （弹框）
 */

const NULL_FLAG = -1
const HE_FLAG = 1   // 和
const LONG_FLAG = 2  // 龙
const HU_FLAG = 3   // 虎


const DA_LU_W = 39
const DA_YAN_LU_W = 21
const ZHUPANLU_W = 18
const DEFAULT_H = 6


const { ccclass, property } = cc._decorator;

@ccclass
export default class VBrlhLudan extends VBaseUI {

    @property(cc.SpriteAtlas)
    sp_atlas: cc.SpriteAtlas = null;

    private _node_bg: cc.Node;

    private _node_mask: cc.Node;

    private _node_dalus: Array<cc.Node>;            // 大路  icon
    private _node_dayanlus: Array<cc.Node>;         // 大眼路 icon    
    private _node_xiaoyanlus: Array<cc.Node>;       // 小眼路 icon
    private _node_zhanglanglus: Array<cc.Node>;     // 蟑螂路 icon
    private _node_zhupanlus: Array<cc.Node>;     // 珠盘路 icon

    _record_data: Array<number>;   // 开奖记录


    _dalu_data: Array<Array<Object>>;

    _dalu_ui_data: Array<number>;


    _dayanlu_data: Object;
    _xiaoyanlu_data: Object;
    _zhanglanglu_data: Object;


    _show_data: Array<Array<Object>>;

    init(): void {
        this.node.zIndex = 200;

        this._node_bg = UNodeHelper.find(this.node, 'sp_bg');
        this._node_mask = UNodeHelper.find(this.node, 'sp_mask');
        this.initUI();
        // 测试
        this.initData([2,3,3,2,3,2,2,3,2,2,3,3,2,2,2,3,2,2,2,2,2,2,2,2,3,3,2,3,3,3,3,3,3,3,2,2,2,3,2,3,3,3,3,1,2,3,3,2,3,2,3,2,2,2,2,2,2,3,2,3,2,2,3,2,3,2,3,3,3,3,3,2,2,3,2]);
        this.daluShow();
        
        this.allOtherluInitData();
        this.allOtherluShow();
        
    
    }


    private initUI(): void {
        let dalu_layout = UNodeHelper.find(this._node_bg, 'layout_dalu');
        let dalu_item = UNodeHelper.find(dalu_layout, 'item_row_1');
        this._node_dalus = [];
        this._node_dalus[0] = dalu_item;

        for (var i = 1; i < DA_LU_W; i++) {
            var item = cc.instantiate(dalu_item);
            item.parent = dalu_layout;
            this._node_dalus[i] = item;
            // this._node_dalus[i]['aaaaa'] = 'qqqqqq';
        }

        let dayanlu_layout = UNodeHelper.find(this._node_bg, 'layout_dayanlu');
        let dayanlu_item = UNodeHelper.find(dayanlu_layout, 'item_row_1');
        this._node_dayanlus = [];
        this._node_dayanlus[0] = dayanlu_item;

        for (var i = 1; i < DA_YAN_LU_W; i++) {
            var item = cc.instantiate(dayanlu_item);
            item.parent = dayanlu_layout;
            this._node_dayanlus[i] = item;
        }

        let xiaoyanlu_layout = UNodeHelper.find(this._node_bg, 'layout_xiaoyanlu');
        let xiaoyanlu_item = UNodeHelper.find(xiaoyanlu_layout, 'item_row_1');
        this._node_xiaoyanlus = [];
        this._node_xiaoyanlus[0] = xiaoyanlu_item;

        for (var i = 1; i < DA_YAN_LU_W; i++) {
            var item = cc.instantiate(xiaoyanlu_item);
            item.parent = xiaoyanlu_layout;
            this._node_xiaoyanlus[i] = item;
        }

        let zhanglanglu_layout = UNodeHelper.find(this._node_bg, 'layout_zhanglanglu');
        let zhanglanglu_item = UNodeHelper.find(zhanglanglu_layout, 'item_row_1');
        this._node_zhanglanglus = [];
        this._node_zhanglanglus[0] = zhanglanglu_item;

        for (var i = 1; i < DA_YAN_LU_W; i++) {
            var item = cc.instantiate(zhanglanglu_item);
            item.parent = zhanglanglu_layout;
            this._node_zhanglanglus[i] = item;
        }

        let zhupanlu_layout = UNodeHelper.find(this._node_bg, 'layout_zhupanlu');
        let zhupanlu_item = UNodeHelper.find(zhupanlu_layout, 'item_row_1');
        this._node_zhupanlus = [];
        // this._node_zhupanlus[1] = zhupanlu_item;
        zhupanlu_item.active = false;

        for (var i = 1; i <= ZHUPANLU_W; i++) {
            var item = cc.instantiate(zhupanlu_item);
            item.parent = zhupanlu_layout;
            item.active = true;
            for (var j = 1; j <= 6; j++) {
                let sp_item = item.getChildByName('sp_' + j);
                this._node_zhupanlus.push(sp_item);
            }
        }

        this._node_zhupanlus[3]['data'] = LONG_FLAG;

        UDebug.Log('aaaaa');
    }


    testludan(num: number, type: number) {
        for (var i = 1; i <= num; i++) {
            this._record_data.push(type);
        }
    }

    initData(data: any) {
        this._record_data = [];
        this._record_data = data;

        // this.testludan(6, HE_FLAG);

        // this.testludan(1, LONG_FLAG);
        // this.testludan(3, HU_FLAG);
        // this.testludan(3, LONG_FLAG);
        // this.testludan(3, HU_FLAG);
        // this.testludan(3, LONG_FLAG);
        // this.testludan(8, LONG_FLAG);
        // this.testludan(8, HU_FLAG);
        // this.testludan(8, LONG_FLAG);
        // this.testludan(8, HU_FLAG);
        // this.testludan(8, LONG_FLAG);
        // this.testludan(8, HU_FLAG);
        // this.testludan(36, LONG_FLAG);
        // this.testludan(36, HE_FLAG);



        this.initZhuPanLu();
        this.updateZhuPanLu();


        this.daluInitData();

    }


    refresh(data: any) {
        UDebug.Log('aaaa');
    }



    /**初始化珠盘路 */
    initZhuPanLu() {

        let temp_data = JSON.parse(JSON.stringify(this._record_data));

        while (temp_data.length > DEFAULT_H * ZHUPANLU_W) {
            temp_data.shift();
        }


        for (let index = 0; index < this._node_zhupanlus.length; index++) {
            var item = this._node_zhupanlus[index];
            if (temp_data[index]) {
                item['data'] = temp_data[index];
            }
        }
    }

    /**更新珠盘路 */
    updateZhuPanLu() {
        this._node_zhupanlus.forEach(item => {
            item.active = true;
            if (item['data'] == LONG_FLAG) {
                item.getComponent(cc.Sprite).spriteFrame = this.sp_atlas.getSpriteFrame('lh_game_chart_ZPL_long');
            }
            else if (item['data'] == HU_FLAG) {
                item.getComponent(cc.Sprite).spriteFrame = this.sp_atlas.getSpriteFrame('lh_game_chart_ZPL_hu');

            }
            else if (item['data'] == HE_FLAG) {
                item.getComponent(cc.Sprite).spriteFrame = this.sp_atlas.getSpriteFrame('lh_game_chart_ZPL_he');
            }
            else {
                item.active = false;
            }
        });
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
                if (data == HE_FLAG) {
                    this._show_data[numW][numH]['numValue'] += 1;
                    break;
                }

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
        for (var i = 0; i < DA_LU_W; i++) {
            this._dalu_data[i] = [];
            for (var j = 0; j < 6; j++) {
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
                if (data == HE_FLAG) {
                    this._dalu_data[dalu_numW][dalu_numH]['numValue'] += 1;
                    startPos += 1;
                    break;
                }

                if (index == startPos) {
                    this._dalu_data[numW][numH]['data'] = data;
                    break;
                }

                if (this._dalu_data[numW][numH]['data'] == data) {

                    if (this._dalu_data[numW][numH + 1] == undefined || this._dalu_data[numW][numH + 1]['data'] != NULL_FLAG) {

                        var movedis = numW + 1;

                        while (true) {
                            if (this._dalu_data[movedis][numH]['data'] == NULL_FLAG) {

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

        for (var i = 0; i < DA_LU_W; i++) {

            for (var j = 0; j < 6; j++) {

                var item = this._node_dalus[i].getChildByName('sp_' + (j + 1));
                var lab_he = item.getChildByName('lab_he')
                item.active = true;
                var data = this._dalu_data[i][j];

                if (data['data'] == HU_FLAG) {

                    item.getComponent(cc.Sprite).spriteFrame = this.sp_atlas.getSpriteFrame('lh_game_chart_DL_hu');
                }
                else if (data['data'] == LONG_FLAG) {

                    item.getComponent(cc.Sprite).spriteFrame = this.sp_atlas.getSpriteFrame('lh_game_chart_DL_long');
                } else {
                    item.active = false;
                }

                if (data['numValue'] == 1) {
                    if (data['data'] == HU_FLAG) {

                        item.getComponent(cc.Sprite).spriteFrame = this.sp_atlas.getSpriteFrame('lh_game_chart_DL_huh');
                    }
                    else if (data['data'] == LONG_FLAG) {

                        item.getComponent(cc.Sprite).spriteFrame = this.sp_atlas.getSpriteFrame('lh_game_chart_DL_longh');
                    } else {
                        item.active = false;
                    }
                    lab_he.active = false;
                }
                else if (data['numValue'] > 1) {
                    lab_he.getComponent(cc.Label).string = data['numValue'];
                    lab_he.active = true;
                }
                else {
                    lab_he.active = false;
                }
            }

        }

    }



    /**************************************
     *  更新其他三路，， 大眼路， 小眼路， 蟑螂路
     */

    allOtherluInitData() {

        this._dayanlu_data = {};
        this._xiaoyanlu_data = {};
        this._zhanglanglu_data = {};

        this.otherluInitData(this._dayanlu_data, 1);
        this.otherluInitData(this._xiaoyanlu_data, 2);
        this.otherluInitData(this._zhanglanglu_data, 3);
    }


    otherluInitData(viewlist, offset) {
        // viewlist = {};
        viewlist['uidata'] = [];
        viewlist['startPos_w'] = offset;
        viewlist['startPos_h'] = 1;


        if (this._show_data[offset]) {

            if (! this._show_data[offset][1]) {
                viewlist['startPos_w'] += 1;
                viewlist['startPos_h'] = 0;
            }
        }
    }


    moveOtherluData(viewlist, offset) {
        var tmp_data = viewlist['uidata'];
        var value = viewlist['data'][0][0].data;


        while (true) {
            if (!tmp_data[0]) {
                viewlist['uidata'] = [];
                break;
            }

            if (tmp_data[0] == value) {

                tmp_data.shift();
            }
            else {
                break;
            }
        }
        if (!tmp_data) {
            return;
        }

        this.loadOtherlu(viewlist, offset);

    }


    allOtherluShow() {

        this.otherluShow(this._dayanlu_data, 1);
        this.otherluShow(this._xiaoyanlu_data, 2);
        this.otherluShow(this._zhanglanglu_data, 3);
    }


    otherluShow(viewlist, offset) {

        viewlist['uidata'] = [];
        var i = viewlist['startPos_w'];
        var j = viewlist['startPos_h'];

        while (this._show_data[i]) {

            while (this._show_data[i][j]) {

                if (j == 0) {
                    if (this._show_data[i - 1].length == this._show_data[i - offset - 1].length) {

                        viewlist['uidata'].push(HU_FLAG);
                    } else if (this._show_data[i - 1].length != this._show_data[i - offset - 1].length) {

                        viewlist['uidata'].push(LONG_FLAG);
                    }
                }
                else {
                    if (this._show_data[i - offset][j]) {

                        viewlist['uidata'].push(HU_FLAG);
                    }
                    else {
                        if (!this._show_data[i - offset][j - 1] && j >= 2) {
                            viewlist['uidata'].push(HU_FLAG);
                        }
                        else {
                            viewlist['uidata'].push(LONG_FLAG);
                        }
                    }
                }
                j++;
            }
            i++;
            j = 0;
        }

        this.loadOtherlu(viewlist, offset);
    }



    loadOtherlu(viewlist, offset) {
        viewlist['data'] = [];
        for (var i = 0; i < DA_YAN_LU_W; i++) {
            viewlist['data'][i] = [];
            for (var j = 0; j < 6; j++) {
                viewlist['data'][i][j] = [];
                viewlist['data'][i][j]['data'] = NULL_FLAG;
            }
        }

        var datalist = viewlist['data'];

        var numW = 0;
        var numH = 0;

        var startPos = 0;

        for (let index = 0; index < viewlist['uidata'].length; index++) {
            let data = viewlist['uidata'][index];

            while (true) {
                if (index == startPos) {
                    datalist[numW][numH]['data'] = data;

                    break;
                }

                if (datalist[numW][numH].data == data) {
                    if (datalist[numW][numH + 1] == undefined || datalist[numW][numH + 1].data != NULL_FLAG) {
                        var movedis = numW + 1;


                        while (true) {
                            if (datalist[movedis][numH].data == NULL_FLAG) {
                                datalist[movedis][numH].data = data;
                                break;
                            }
                            else {
                                movedis += 1;
                                if (movedis > DA_YAN_LU_W - 1) {
                                    movedis = DA_YAN_LU_W - 1
                                    this.moveOtherluData(viewlist, offset);
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
                    while (datalist[numW][0].data != NULL_FLAG) {
                        numW += 1;
                        if (numW > DA_YAN_LU_W - 1) {
                            self: this.moveOtherluData(viewlist, offset);
                            return;
                        }

                    }

                    numH = 0;
                }


                datalist[numW][numH].data = data;
                break;
            }
        }

        this.updateOtherlu(offset);

    }

    updateOtherlu(offset) {

        for (var i = 0; i < DA_YAN_LU_W; i++) {
            for (var j = 0; j < 6; j++) {
                if (offset == 1) {
                    // 大眼路
                    var item = this._node_dayanlus[i].getChildByName('sp_' + (j + 1));
                    var data = this._dayanlu_data['data'][i][j].data;
                    item.active = true;
                    if (data == LONG_FLAG) {
                        item.getComponent(cc.Sprite).spriteFrame = this.sp_atlas.getSpriteFrame('lh_game_chart_DYL_long2');
                    }else if (data == HU_FLAG) {
                        item.getComponent(cc.Sprite).spriteFrame = this.sp_atlas.getSpriteFrame('lh_game_chart_DYL_hu2');
                    }else {
                        item.active = false;
                    }
                }else if (offset == 2) {
                    // 小眼路
                    var item = this._node_xiaoyanlus[i].getChildByName('sp_' + (j + 1));
                    var data = this._xiaoyanlu_data['data'][i][j].data;
                    item.active = true;
                    if (data == LONG_FLAG) {
                        item.getComponent(cc.Sprite).spriteFrame = this.sp_atlas.getSpriteFrame('lh_game_chart_XYL_long');
                    }else if (data == HU_FLAG) {
                        item.getComponent(cc.Sprite).spriteFrame = this.sp_atlas.getSpriteFrame('lh_game_chart_XYL_hu');
                    }else {
                        item.active = false;
                    }

                }else if (offset == 3) {
                    // 蟑螂路
                    var item = this._node_zhanglanglus[i].getChildByName('sp_' + (j + 1));
                    var data = this._zhanglanglu_data['data'][i][j].data;
                    item.active = true;
                    if (data == LONG_FLAG) {
                        item.getComponent(cc.Sprite).spriteFrame = this.sp_atlas.getSpriteFrame('lh_game_chart_YYL_long');
                    }else if (data == HU_FLAG) {
                        item.getComponent(cc.Sprite).spriteFrame = this.sp_atlas.getSpriteFrame('lh_game_chart_YYL_hu');
                    }else {
                        item.active = false;
                    }

                }else {

                }



            }

        }



    }







    onClickClose() {
        let ac = cc.scaleTo(0.2, 0.8, .8);
        ac.easing(cc.easeInOut(2.0));
        let ac2 = cc.fadeOut(0.2);

        let spa = cc.spawn(ac, ac2);

        this._node_mask.runAction(cc.fadeOut(0.1));
        this._node_bg.stopAllActions();
        this._node_bg.runAction(cc.sequence(spa, cc.callFunc(() => {
            AppGame.ins.closeUI(this.uiType);
        }, this)));
    }


    hide(handler?: UHandler) {
        this.node.active = false;
    }

    show(data: any): void {
        this.node.active = true;
        this._node_bg.opacity = 255;
        this._node_bg.scale = 0.01;
        let ac = cc.scaleTo(0.2, 1.1, 1.1);
        let ac2 = cc.scaleTo(0.1, 1, 1);
        let seq = cc.sequence(ac, ac2);
        ac.easing(cc.easeInOut(2.0));
        this._node_bg.runAction(seq);

        this._node_mask.opacity = 0.1;
        this._node_mask.runAction(cc.fadeTo(0.5, 120));

        data = {
            [1]: 11,
            [2]: 22,
            [3]: 33,
        }
    }




    // update (dt) {}
}
