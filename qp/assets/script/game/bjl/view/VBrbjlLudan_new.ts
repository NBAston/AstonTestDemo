import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../../public/base/AppGame";
import VBaseUI from "../../../common/base/VBaseUI";
import UHandler from "../../../common/utility/UHandler";
import UDebug from "../../../common/utility/UDebug";
import BJLConstants from "../BJLConstants";
import USpriteFrames from "../../../common/base/USpriteFrames";
import MBrbjl from "../model/MBrbjl";
import { Bjl } from "../../../common/cmd/proto";
import VBrbjlScene from "../VBrbjlScene";
import AppStatus from "../../../public/base/AppStatus";

/**
 * 创建：朱武
 * 作用：百人龙虎路单界面 （弹框）
 */

const NULL_FLAG = -1 
const HE_FLAG = 4   // 和
const XIAN_FLAG = 2  // 闲
const ZHUANG_FLAG = 3   // 庄


const DA_LU_W = 20
const DA_YAN_LU_W = 21
const ZHUPANLU_W = 20
const DEFAULT_H = 7


const { ccclass, property } = cc._decorator;

@ccclass
export default class VBrbjlLudan_new extends VBaseUI  {
   
    @property(USpriteFrames)
    spf_frames: USpriteFrames = null;
    @property(cc.SpriteFrame)
    spf_xian: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spf_zhuang: cc.SpriteFrame = null;

    @property(cc.SpriteFrame)
    spf_he: cc.SpriteFrame = null;

    @property(cc.Label)
    limit_score: cc.Label = null;
    @property(cc.Label)
    count_xian: cc.Label = null;
    @property(cc.Label)
    count_zhuang: cc.Label = null;
    @property(cc.Label)
    count_he: cc.Label = null;
    @property(cc.Label)
    count_xian_pair: cc.Label = null;
    @property(cc.Label)
    count_zhuang_pair: cc.Label = null;
    @property(cc.Label)
    count_all: cc.Label = null;
    @property(cc.Toggle)
    autoOpenToggle:cc.Toggle = null;


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

    _record_data: Array<Bjl.IGameRecord>;   // 开奖记录

    _is_blink: boolean = false;

    _dalu_data: Array<Array<Object>>;

    _dalu_ui_data: Array<number>;



    _dayanlu_data: Object;
    _xiaoyanlu_data: Object;
    _zhanglanglu_data: Object;


    _show_data: Array<Array<Object>>;


    // _lab_long: cc.Label;
    // _lab_hu: cc.Label;

    _tipSpace:Array<number> = [0,0];
    _minScore: number = 0;
    init(): void {
        this.node.zIndex = 200;
        this._node_bg = UNodeHelper.find(this.node, 'sp_bg');
        this._node_mask = UNodeHelper.find(this.node, 'sp_mask');
        // this._lab_hu = UNodeHelper.getComponent(this._node_bg, 'lab_hu', cc.Label);
        // this._lab_long = UNodeHelper.getComponent(this._node_bg, 'lab_long', cc.Label);
        this.initUI();
        // 测试
        // this.initData([2,3,3,2,3,2,2,3,2,2,3,3,2,2,2,3,2,2,2,2,2,2,2,2,3,3,2,3,3,3,3,3,3,3,2,2,2,3,2,3,3,3,3,1,2,3,3,2,3,2,3,2,2,2,2,2,2,3,2,3,2,2,3,2,3,2,3,3,3,3,3,2,2,3,2]);
        // this.initData([ 2, 2, 2, 2, 2, 2, 3, 1, 2, 3, 1, 2, 3, 1, 2, 3, 3, 3, 3, 3, 3, 3]);
        // this.initData([1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3]);




    }


    onDestroy() {

    }

    onDisable() {
        AppGame.ins.brbjlModel.off(MBrbjl.S_GAME_END, this.onGameEnd, this);
        AppGame.ins.brbjlModel.off(MBrbjl.S_SEND_RECORD, this.onRefleshRecord, this);
    }
    onEnable() {
        AppGame.ins.brbjlModel.on(MBrbjl.S_GAME_END, this.onGameEnd, this);
        AppGame.ins.brbjlModel.on(MBrbjl.S_SEND_RECORD, this.onRefleshRecord, this);
    }

    onRefleshRecord(data: any) {
        if (data.hasOwnProperty('record')) {
            this._is_blink = false;
            this.initData(AppGame.ins.brbjlModel._game_record.record);
            this._dalu_layout.getComponent('VBrbjlDaluController').initData(AppGame.ins.brbjlModel._game_record.record);
        }
    }

    onGameEnd(data: any) {
        this._is_blink = true;
        let temp_data = JSON.parse(JSON.stringify(AppGame.ins.brbjlModel._game_record.record));
        this._record_data = [];
        this._record_data = AppGame.ins.brbjlModel._game_record.record;
        this.setZhuluTips(temp_data[temp_data.length - 1], this._is_blink);
        this.initZhuPanLu(); 
        this._dalu_layout.getComponent('VBrbjlDaluController').setTip(temp_data[temp_data.length - 1].winArea,this._is_blink);
    }

    private initUI(): void {
        this._tipSpace = [0,0];
        this._zhulu_layout = UNodeHelper.find(this._node_bg, 'layout_zhupanlu/view/content');
        this._dalu_layout = UNodeHelper.find(this._node_bg, 'scroll_layout_dalu/view/content');
        this._item_row_zhupanlu = UNodeHelper.find(this._node_bg, 'item_row');

    }


    testludan(num: number, type: number) {
        // for (var i = 1; i <= num; i++) {
        //     this._record_data.push(type);
        // }
    }

    initData(data: any, is_blink?:boolean) {
        this._record_data = [];
        this._record_data = data;
        this._tipSpace = [0, 0];
        this.initZhuluList();
        this.initZhuPanLu();
        this.initZhuLu(is_blink);
        // this.daluInitData();
        // this.daluShow();

    }


    refresh(data: any) {
        UDebug.Log('aaaa');
    }

    // 初始化珠路列表
    initZhuluList() {
        this._zhulu_layout.removeAllChildren();
        let parent = this._zhulu_layout;
        for (let index = 0; index < BJLConstants.m_ZlListNumber; index++) {
            var item = cc.instantiate(this._item_row_zhupanlu);
            item.setPosition(cc.v2(0,0)); 
            item.parent = parent;     
        }
    }

     // 初始化珠路数据
     initZhuLu(is_blink?:boolean) {
        let temp_data = JSON.parse(JSON.stringify(this._record_data));
        for (let index = 0; index < temp_data.length; index++) {
            if (temp_data[index]) {
                this.setZhuluTips(temp_data[index],(index == temp_data.length - 1 && is_blink)? true:false);
            }
            if(index == temp_data.length) {
                this.zhuluScrollView.scrollToRight(0.5);
            }
        }
        
    }

    setZhuluTips(recordItem: any, isblink?: boolean) {
        let parent = this._zhulu_layout;
        let winFlag = recordItem.winArea;
        if(this._tipSpace[0] > parent.children.length - 1) {  
            var item = cc.instantiate(this._item_row_zhupanlu);
            item.setPosition(cc.v2(0,0)); 
            item.parent = parent;
        }
        var child = parent.children;
        var item = child[this._tipSpace[0]] ;
        var tips = item.children;
        tips[this._tipSpace[1]].active = true;
        tips[this._tipSpace[1]].getChildByName('xian_dui').active = recordItem.playerTwoPair;
        tips[this._tipSpace[1]].getChildByName('zhuang_dui').active = recordItem.bankerTwoPair;
        if(winFlag == XIAN_FLAG) {
            tips[this._tipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getFrames('xian_1');
        } else if(winFlag == ZHUANG_FLAG) {
            tips[this._tipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getFrames('zhuang_1');
        } else if(winFlag == HE_FLAG) {
            tips[this._tipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getFrames('he_1');
        }
        if(isblink) {
            tips[this._tipSpace[1]].runAction(cc.blink(3, 6));
        }
        this.count();
        if(this._tipSpace[0] >= BJLConstants.m_ZlListNumber ){
            this.zhuluScrollView.scrollToRight(0.5);
        }
        // this.setDaluTip(flag)
    }

    count() {
        if(this._tipSpace[1] == 5){
            this._tipSpace[0]++;
            this._tipSpace[1] = 0;
        }else{
            this._tipSpace[1]++
        }
    }

    /**初始化珠盘路 */
    initZhuPanLu() {

        let temp_data = JSON.parse(JSON.stringify(this._record_data));
        let temp_count_data = temp_data;
        var all_count_xian = 0;
        var all_count_zhuang = 0;
        var all_count_he = 0;
        var all_count_zhuang_pair = 0;
        var all_count_xian_pair = 0;
        for (let i = 0; i < temp_count_data.length; i++) {
            const element = temp_count_data[i];
            if(element) {

                if(element.playerTwoPair) {
                    all_count_xian_pair +=1;
                }

                if(element.bankerTwoPair) {
                    all_count_zhuang_pair +=1;
                }

                if(element.winArea == XIAN_FLAG) {
                    all_count_xian += 1;
                } else if(element.winArea == ZHUANG_FLAG) {
                    all_count_zhuang += 1;
                } else if(element.winArea == HE_FLAG) {
                    all_count_he += 1;
                }
            }
        }
        this.limit_score.string = "限红 "+this._minScore/100+"~"+AppGame.ins.brbjlModel._maxJettonScore/100;
        this.count_xian.string = "闲  "+ all_count_xian;
        this.count_zhuang.string = "庄  "+ all_count_zhuang;
        this.count_he.string = "和  "+ all_count_he;
        this.count_xian_pair.string = "闲对  "+ all_count_xian_pair;
        this.count_zhuang_pair.string = "庄对  "+ all_count_zhuang_pair;
        this.count_all.string = "局数  "+ temp_count_data.length;

        // while (temp_data.length > ZHUPANLU_W) {
        //     temp_data.shift();
        // }

        
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

            var data = this._dalu_ui_data[i];
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
    }

    onClickClose() {
        VBrbjlScene.ins._music_mgr.playClick();
        this._node_bg.runAction(cc.sequence(cc.callFunc(() => {this.onLuDanMove(false)}), cc.callFunc(() => {
            AppGame.ins.closeUI(this.uiType);
        }, this)));
    }


    hide(handler?: UHandler) {
        this.onLuDanMove(false);
    }

    onAutoOpenToggle() {
        this.autoOpenToggle.isChecked = !AppGame.ins.brbjlModel.isAutoOpenRecord;
        AppGame.ins.brbjlModel.isAutoOpenRecord = this.autoOpenToggle.isChecked;
    }

    onLuDanMove(isShow:boolean=false) {
        if(isShow) {
            this._node_bg.setPosition(cc.v2(0,230+cc.winSize.height/2));
            var actionMove =  cc.moveTo(0.1, cc.v2(0,cc.winSize.height/2 - 230));
            this._node_bg.runAction(cc.sequence(cc.callFunc(() => {
                this._node_bg.active = true;
            }),actionMove));

        } else {
            this._node_bg.setPosition(cc.v2(0,cc.winSize.height/2 - 230))
            var actionMove2 =  cc.moveTo(0.1, cc.v2(0,230+cc.winSize.height/2));
            this._node_bg.runAction(cc.sequence(actionMove2,cc.callFunc(() => {this.node.active = false;})));
        }

    }

    show(data: any): void {
        if(data && data.hasOwnProperty('minScore')) {
            this._minScore = data.minScore;
        }
        this.node.active = true;
        this._node_bg.opacity = 255;
        this.autoOpenToggle.isChecked = AppGame.ins.brbjlModel.isAutoOpenRecord;
        this.onLuDanMove(true);
        // this._node_bg.opacity = 255;

        // let ac = cc.scaleTo(0.2, 1, 1.05);
        // let ac2 = cc.scaleTo(0.05, 1);
        // let seq = cc.sequence(ac, ac2);
        // this._node_bg.scaleY = 0;

        // this._node_bg.runAction(seq); 

        // this._node_mask.opacity = 0.1;
        // this._node_mask.runAction(cc.fadeTo(0.5, 150));
        this._tipSpace = [0,0];
        this._is_blink = false;
        this.initData(AppGame.ins.brbjlModel._game_record.record);
        this._dalu_layout.getComponent('VBrbjlDaluController').initData(AppGame.ins.brbjlModel._game_record.record);

    }

    




    // update (dt) {}
}
