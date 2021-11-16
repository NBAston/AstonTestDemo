import UNodeHelper from "../../../common/utility/UNodeHelper";
import AppGame from "../../../public/base/AppGame"; 
import VBaseUI from "../../../common/base/VBaseUI";
import UHandler from "../../../common/utility/UHandler";
import UDebug from "../../../common/utility/UDebug";
import BJLConstants from "../BJLConstants";
import USpriteFrames from "../../../common/base/USpriteFrames";
import MBrbjl from "../model/MBrbjl";
import { Bjl } from "../../../common/cmd/proto";
import { UZJHRoomItem } from "../../../common/base/UAllClass";
import BrbjlSummaryData from "../BrbjlSummaryData";
import UDateHelper from "../../../common/utility/UDateHelper";

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
export default class VBrbjlRoomItem extends cc.Component {

    @property(USpriteFrames)
    spf_frames: USpriteFrames = null;
    @property(cc.SpriteFrame)
    spf_xian: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    spf_zhuang: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    spf_he: cc.SpriteFrame = null;



    @property(cc.Node)
    roomTitleImg: cc.Node = null;
    @property(cc.Label)
    limit_score: cc.Label = null;
    @property(cc.Label)
    game_status: cc.Label = null;
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
    private _node_bg: cc.Node;
    private _node_mask: cc.Node;

    @property(cc.ScrollView) zhuluScrollView: cc.ScrollView = null;
    private _zhulu_layout: cc.Node; // 珠盘路 
    private _dalu_layout: cc.Node; // 大路
    private _xiaolu_layout: cc.Node; // 小路
    private _dayanlu_layout: cc.Node; // 大眼路
    private _yeyoulu_layout: cc.Node; // yueyou路
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
    _timeStatusSeconds: number = -1; //状态倒计时
    _status: number = 103; // 状态 100-开始； 102 - 洗牌  103-下注； 104-开牌  105 结算
    bjlSummaryData: BrbjlSummaryData = null;
    isReflesh: boolean = false;
    roomId: number = 0;
    _manager: any = null;
    isHadRun: boolean = false;

    _tipSpace: Array<number> = [0, 0];
    init(): void {
        this._node_bg = UNodeHelper.find(this.node, 'sp_bg');
        this._node_mask = UNodeHelper.find(this.node, 'sp_mask');
        this.initUI();
    }

    update(dt: number) {
        if (this._timeStatusSeconds > 0) {
            this._timeStatusSeconds -= dt;
            if (this._timeStatusSeconds < 0) {
                this._timeStatusSeconds = 0;
            }
            let second = Math.ceil(this._timeStatusSeconds);
            // if (second == 3) {
            //     if (this._status == 105 && !this.isReflesh) {
            //         // cc.warn("打印次数------------------second" + second);
            //         if (!this.isHadRun) {
            //             this.refleshRoomItemData(this.bjlSummaryData, true);
            //             this.isHadRun = true;
            //         }
            //     }

            // }
            /*if(second == 2) {
                if(this._status == 100) {
                    this.refleshRoomItemData(this.bjlSummaryData, true);
                }
            }*/
            this.setStatusTime(second);
        }
    }

    /**设置超时时间 */
    setStatusTime(seconds: number) {
        let statusStr = '空闲中 ';
        if (this._status == 103) {
            statusStr = '下注中 '
        } else if (this._status == 104) {
            statusStr = '开牌中 '
        } else if (this._status == 105) {
            statusStr = '结算中 '
        } else if (this._status == 102) {
            statusStr = '洗牌中'
        }
        this.game_status.string = statusStr + seconds;
    }

    onDestroy() {

    }

    onDisable() {
        // AppGame.ins.brbjlModel.off(MBrbjl.S_SEND_RECORD, this.onGameEnd, this);
        // AppGame.ins.brbjlModel.off(MBrbjl.S_GAME_END, this.onGameEnd, this);

    }
    onEnable() {
        // AppGame.ins.brbjlModel.on(MBrbjl.S_SEND_RECORD, this.onGameEnd, this);
        // AppGame.ins.brbjlModel.on(MBrbjl.S_GAME_END, this.onGameEnd, this);
    }




    onGameEnd(data: any) {
        this._is_blink = true;

        this.node.stopAllActions();
        this.node.runAction(cc.sequence(cc.delayTime(6), cc.callFunc(() => {
            // this._tipSpace = [0,0];
            // this._zhulu_layout.removeAllChildren();// 游戏结束前清理掉
            let temp_data = JSON.parse(JSON.stringify(AppGame.ins.brbjlModel._game_record.record));
            // this.initData(AppGame.ins.brlhModel._game_record.record,this._is_blink);
            this._record_data = [];
            this._record_data = AppGame.ins.brbjlModel._game_record.record;
            this.setZhuluTips(temp_data[temp_data.length - 1], this._is_blink);
            this.initZhuPanLu();
            this._dalu_layout.getComponent('VBrbjlDaluController').setTip(temp_data[temp_data.length - 1].winArea, this._is_blink);
        })))
    }

    private initUI(): void {
        this._tipSpace = [0, 0];
        this._zhulu_layout = UNodeHelper.find(this._node_bg, 'layout_zhupanlu/view/content');
        this._dalu_layout = UNodeHelper.find(this._node_bg, 'scroll_layout_dalu/view/content');
        this._xiaolu_layout = UNodeHelper.find(this._node_bg, 'scroll_layout_xiaolu/view/content');
        this._yeyoulu_layout = UNodeHelper.find(this._node_bg, 'scroll_layout_yueyoulu/view/content');
        this._dayanlu_layout = UNodeHelper.find(this._node_bg, 'scroll_layout_dayanzailu/view/content');
        this._item_row_zhupanlu = UNodeHelper.find(this._node_bg, 'item_row');
    }



    testludan(num: number, type: number) {
        // for (var i = 1; i <= num; i++) {
        //     this._record_data.push(type);
        // }
    }

    initData(data: any, is_blink?: boolean) {
        this._record_data = [];
        this._record_data = data;

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
        for (let index = 0; index < BJLConstants.m_ZlListNumber; index++) {
            var item = cc.instantiate(this._item_row_zhupanlu);
            item.setPosition(cc.v2(0, 0));
            item.parent = parent;
        }
    }

    // 初始化珠路数据
    initZhuLu(is_blink?: boolean) {
        // this._zhulu_layout.removeAllChildren();
        let temp_data = JSON.parse(JSON.stringify(this._record_data));
        // while (temp_data.length > 6 * BJLConstants.m_ZlListNumber) {
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

    setZhuluTips(recordItem: any, isblink?: boolean) {
        let parent = this._zhulu_layout;
        let winFlag = recordItem.winArea;
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
        tips[this._tipSpace[1]].getChildByName('xian_dui').active = recordItem.playerTwoPair;
        tips[this._tipSpace[1]].getChildByName('zhuang_dui').active = recordItem.bankerTwoPair;
        if (winFlag == XIAN_FLAG) {
            tips[this._tipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getFrames('xian_1');
        } else if (winFlag == ZHUANG_FLAG) {
            tips[this._tipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getFrames('zhuang_1');
        } else if (winFlag == HE_FLAG) {
            tips[this._tipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getFrames('he_1');
        }
        if (isblink) {
            tips[this._tipSpace[1]].runAction(cc.blink(3, 6));
        }
        this.count();
        if (this._tipSpace[0] >= BJLConstants.m_ZlListNumber) {
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

    resetRoomCountData(){
        this.count_xian.string = "0" ;
        this.count_zhuang.string = "0" ;
        this.count_he.string = "0" ;
        this.count_xian_pair.string = "0" ;
        this.count_zhuang_pair.string = "0" ;
        this.count_all.string = "局数  0"
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
            if (element) {

                if (element.playerTwoPair) {
                    all_count_xian_pair += 1;
                }

                if (element.bankerTwoPair) {
                    all_count_zhuang_pair += 1;
                }

                if (element.winArea == XIAN_FLAG) {
                    all_count_xian += 1;
                } else if (element.winArea == ZHUANG_FLAG) {
                    all_count_zhuang += 1;
                } else if (element.winArea == HE_FLAG) {
                    all_count_he += 1;
                }
            }
        }

        this.count_xian.string = "" + all_count_xian;
        this.count_zhuang.string = "" + all_count_zhuang;
        this.count_he.string = "" + all_count_he;
        this.count_xian_pair.string = "" + all_count_xian_pair;
        this.count_zhuang_pair.string = "" + all_count_zhuang_pair;
        this.count_all.string = "局数  " + temp_count_data.length;

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

    }


    hide(handler?: UHandler) {
        // this.onLuDanMove(false);
    }

    show(data: any): void {
        this._status = data.status;
        this._timeStatusSeconds = Math.ceil(data.leftTime);
        this.refleshUI(data);
    }

    refleshUI(data: any) {
        if (data.status == 105) { // 结算才开始刷新界面数据
            this.init();
            this._tipSpace = [0, 0];
            this._is_blink = false;
            this.initData(data.game_record.record);
            this._dalu_layout.getComponent('VBrbjlRoomDaluController').initData(data.game_record.record);
        }
    }

    configRoomTitleLimitScore(roomId: number, roomItem: UZJHRoomItem, manager: any) {
        this._manager = manager;
        this.roomId = roomId;
        switch (roomId) {
            case 9101:
                this.roomTitleImg.getComponent(cc.Sprite).spriteFrame = this.spf_frames.getComponent('USpriteFrames').getFrames('room_title_1');
                break;
            case 9102:
                this.roomTitleImg.getComponent(cc.Sprite).spriteFrame = this.spf_frames.getComponent('USpriteFrames').getFrames('room_title_2');
                break;
            case 9103:
                this.roomTitleImg.getComponent(cc.Sprite).spriteFrame = this.spf_frames.getComponent('USpriteFrames').getFrames('room_title_3');
                break;
            case 9104:
                this.roomTitleImg.getComponent(cc.Sprite).spriteFrame = this.spf_frames.getComponent('USpriteFrames').getFrames('room_title_4');
                break;
            default:
                this.roomTitleImg.getComponent(cc.Sprite).spriteFrame = this.spf_frames.getComponent('USpriteFrames').getFrames('room_title_1');
                break;
        }

        if (roomItem) {
            UDebug.log("设置限红-------" + JSON.stringify(roomItem));
            this.limit_score.string = `限红` + (roomItem.jettons.length > 0 ? roomItem.jettons[0] / 100 : 1) + `~` + (roomItem.maxJettonScore / 100).toString();
            //非正常开发的房间
            if (roomItem.status != 1) {
                //房间背景置灰
                // this._icon.setMaterial(0, cc.Material.createWithBuiltin("2d-gray-sprite", 0));
                // this._lock.node.active = true
            }
            else {
                // this._lock.node.active = false
            }
        }

    }

    initRoomItemData(data: BrbjlSummaryData, roomItem: UZJHRoomItem, isReflesh: boolean, manager: any): void {
        // this.bind(roomItem);
        this.isHadRun = false;
        this.bjlSummaryData = data;
        this.roomId = data.roomId;
        this._manager = manager
        this._status = data.status;
        // cc.warn("(UDateHelper.getCurrentBeijingTime() - data.updateTime*1000=" + (data.statusTime - (data.currentServerTime - data.updateTime)));
        //Math.ceil((UDateHelper.getCurrentBeijingTime() - data.updateTime*1000) / 1000); 
        this.isReflesh = isReflesh;

        if (isReflesh) {
            this._timeStatusSeconds = data.statusTime - ((data.currentServerTime - data.updateTime) < 0 ? 0 : (data.currentServerTime - data.updateTime));
            this.refleshRoomItemData(data);
        } else {
            this._timeStatusSeconds = data.statusTime;
            if(this._status == 105) {
                this.refleshRoomItemData(this.bjlSummaryData, true);
            }
            // 开奖状态的最后三秒才开奖
            if (data.status == 102) { // 
                this._zhulu_layout.removeAllChildren(); 
                this.resetRoomCountData();
                this._tipSpace = [0, 0];
                this.initData([], false);
                this._dalu_layout.getComponent('VBrbjlRoomDaluController').initData(data.game_record.record, this._status, false);
            } 
        }
    }

    refleshRoomItemData(data: BrbjlSummaryData, isLastRecordBink: boolean = false) {

        if (!isLastRecordBink) {
            this.init();
            // this._node_bg.opacity = 255;
            this._tipSpace = [0, 0];
            this._is_blink = false;
            this.initData(data.game_record.record, isLastRecordBink);
            this._dalu_layout.getComponent('VBrbjlRoomDaluController').initData(data.game_record.record, this._status, isLastRecordBink);
        } else {
            // cc.warn("---------------------" + data.game_record.record[data.game_record.record.length - 1].winArea);
            this.setZhuluTips(data.game_record.record[data.game_record.record.length - 1], true);
            this._record_data = data.game_record.record;
            this.initZhuPanLu();
            this._dalu_layout.getComponent('VBrbjlRoomDaluController').setTip(data.game_record.record[data.game_record.record.length - 1].winArea, true);
        }

    }

    onclickEnterGame() {
        this._manager.enterGame(this.roomId);
    }

}
