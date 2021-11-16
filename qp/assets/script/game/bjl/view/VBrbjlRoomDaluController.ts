
import { Bjl } from "../../../common/cmd/proto";
import UDebug from "../../../common/utility/UDebug";
import BJLConstants from "../BJLConstants";
import MBrhh from "../model/MBrbjl";

const { ccclass, property } = cc._decorator;
@ccclass
export default class VBrbjlRoomDaluController extends cc.Component {
    TipSpace: Array<number> = [0, 0];
    SignalLine: Array<number> = [0, 0, 0, 0, 0, 0];
    PreLine: Array<number> = [];
    _TipSpace: [0, 0];
    _SignalLine: [0, 0, 0, 0, 0, 0];
    _record_data: Array<Bjl.IGameRecord>;   // 开奖记录
    _PreLine: Array<number> = [];
    _currentLine: 0;
    CurrentLine: 0;
    isline: boolean;
    isThroughPoint: boolean;
    isThroughXiaoluPoint: boolean;
    isThroughYueyouluPoint: boolean;
    isTurn: boolean;
    tempTipSpace: Array<number> = [0, 0]
    DoubleArrayOfHistory: Array<Array<number>> = [];
    lastTip: number = 0;
    isLastRecordBink: boolean = false;
    @property(cc.Node) spf_frames: cc.Node = null;
    @property(cc.ScrollView) daluScrollView: cc.ScrollView = null;
    @property(cc.Node) ListItem: cc.Node = null;
    @property(cc.Node) Scoll_dayanlu: cc.Node = null;
    @property(cc.Node) Scoll_xiaolu: cc.Node = null;
    @property(cc.Node) Scoll_yueyoulu: cc.Node = null;
    @property(cc.Node) Node_ForeZhuang: cc.Node = null; // 预测位庄
    @property(cc.Node) Node_ForeXian: cc.Node = null; // 预测位闲

    onLoad() {
    }

    initDaluFirstData() {

        this.TipSpace = [0, 0]
        this.SignalLine = [0, 0, 0, 0, 0, 0]
        this.tempTipSpace = [0, 0]
        this.PreLine = []
        this.DoubleArrayOfHistory = [];

        ////////////////////预测记录数据////////////////////////
        this._TipSpace = [0, 0]
        this._SignalLine = [0, 0, 0, 0, 0, 0]
        this._PreLine = []
        this._currentLine = 0

        ////////////////////预测记录数据//////////////////////// 

        this.CurrentLine = 0
        this.isline = false

        this.isThroughPoint = false //是否经大眼仔路过基准点
        this.isThroughXiaoluPoint = false
        this.isThroughYueyouluPoint = false
        this.lastTip = 0;
        this.isTurn = false
        // UDebug.log("初始化-----tipSpace = " + this.TipSpace.toString());
        this.initList(BJLConstants.m_DlListNumber)
        this.initArray()
        this.initDaLu();
    }

    initData(data: any, status: number, isLastRecordBink: boolean = false,) {
        // if((status == 100 && data.length == 0) || status == 102) {
        //     this.clearLudanData();
        //     return;
        // }
        this.isLastRecordBink = isLastRecordBink;
        this._record_data = [];
        this._record_data = data
        this.initDaluFirstData();

    }

    initDaLu() {
        this.TipSpace = [0, 0]
        let temp_data = JSON.parse(JSON.stringify(this._record_data));
        for (let index = 0; index < temp_data.length; index++) {
            if (temp_data[index]) {
                this.setTip(temp_data[index].winArea, (index == temp_data.length - 1 && this.isLastRecordBink) ? true : false);
            }
            if (index == temp_data.length) {
                this.daluScrollView.scrollToRight(0.5);
            }
        }
    }
    start() {

    }
    /**
      * @description 初始化列表
      * @param {} _number 
      */
    initList(_number) {

        this.clearLudanData();
        // UDebug.log("--------清除数据---removeAllChildren");
        var parent = this.node;
        for (let index = 0; index < _number; index++) {
            var item = cc.instantiate(this.ListItem)
            item.setPosition(cc.v2(0, 0));
            item.parent = parent
        }
    }

    clearLudanData() {
        this.node.removeAllChildren();
        this.Scoll_dayanlu.removeAllChildren();
        this.Scoll_xiaolu.removeAllChildren();
        this.Scoll_yueyoulu.removeAllChildren();
        this.Scoll_dayanlu.getComponent('VBrbjlRoomXiaoluController').resetData();
        this.Scoll_xiaolu.getComponent('VBrbjlRoomXiaoluController').resetData();
        this.Scoll_yueyoulu.getComponent('VBrbjlRoomXiaoluController').resetData();
        this.setFore([0, 0, 0, 0, 0, 0]);
    }


    initArray() {
        var len = this.node.children.length
        for (let index = 0; index < len; index++) {
            var newArray = this.SignalLine.map(item => item);
            this.DoubleArrayOfHistory.push(newArray)
        }
    }

    ////////////////////预测记录数据////////////////////////
    setTip(flag: number, isblink?: boolean) {
        var temp = flag;
        if (flag == BJLConstants.DaLu.he) {
            this.setHe();
            return;
        } else {
            this.countSpace(flag)
        }
        // this.countSpace(flag)
        var parent = this.node
        // var foreVlaue = this.coutSp(flag)
        // this.setFore(foreVlaue)

        this.judgeDayanzai(temp, isblink, true)
        this.judgeXiaolu(temp, isblink, true)
        this.judgeYueyoulu(temp, isblink, true)
        var child = parent.children;
        var item = child[this.TipSpace[0]];

        var tips = item.children;
        tips[this.TipSpace[1]].active = true;
        if (isblink) {
            cc.warn("tip[]=======" + JSON.stringify(this.TipSpace));
        }
        var js = tips[this.TipSpace[1]].getComponent('VBrbjlTipItemController');
        js.setFrameDalu(flag, isblink)

        this.lastTip = temp
        if (this.TipSpace[0] >= BJLConstants.m_DlListNumber - 6) {
            this.daluScrollView.scrollToRight(0.5);
        }
        // 下局开闲预测值
        let foreValue = [];
        this.countSpace(2);
        foreValue.push(this.judgeDayanzai(2, isblink, false));
        foreValue.push(this.judgeXiaolu(2, isblink, false));
        foreValue.push(this.judgeYueyoulu(2, isblink, false));
        this.DoubleArrayOfHistory[this.TipSpace[0]][this.TipSpace[1]] = 0;
        this.TipSpace[0] = this.tempTipSpace[0];
        this.TipSpace[1] = this.tempTipSpace[1];

        // 下局开庄预测值
        this.countSpace(3);
        foreValue.push(this.judgeDayanzai(3, isblink, false));
        foreValue.push(this.judgeXiaolu(3, isblink, false));
        foreValue.push(this.judgeYueyoulu(3, isblink, false));
        this.DoubleArrayOfHistory[this.TipSpace[0]][this.TipSpace[1]] = 0;
        this.TipSpace[0] = this.tempTipSpace[0];
        this.TipSpace[1] = this.tempTipSpace[1];
        this.setFore(foreValue)

        this.daluScrollView.scrollToRight(0.5);
    }

    setHe() {
        var parent = this.node
        var child = parent.children
        var item = child[this.TipSpace[0]]
        var tips = item.children
        tips[this.TipSpace[1]].active = true;
        var js = tips[this.TipSpace[1]].getComponent('VBrbjlTipItemController')
        js.setHe()

    }
    countSpace(_type) {
        var parent = this.node;
        this.tempTipSpace[0] = this.TipSpace[0];
        this.tempTipSpace[1] = this.TipSpace[1];
        if (_type == this.lastTip) {
            if (this.TipSpace[1] == 5 || this.getArrayNext() != 0) {
                this.TipSpace[0]++
                if (this.TipSpace[0] > parent.children.length - 1) {
                    var parent = this.node;
                    var item = cc.instantiate(this.ListItem);
                    item.setPosition(cc.v2(0, 0));
                    item.parent = parent;
                    var newArray = this.SignalLine.map(item => item);
                    this.DoubleArrayOfHistory.push(newArray);
                }
                this.setArray(_type)
                this.isTurn = true
                return
            }
            this.TipSpace[1]++
        } else {
            this.TipSpace[0] = this.getFirstLine()
            this.TipSpace[1] = 0
            if (this.isline) {
                this.CurrentLine++
            }
            this.isline = true
            this.PreLine[this.CurrentLine] = 0
            if (this.TipSpace[0] > parent.children.length - 1) {
                var parent = this.node//this.getComponent(cc.ScrollView).content
                var item = cc.instantiate(this.ListItem)
                item.setPosition(cc.v2(0, 0));
                item.parent = parent
                var newArray = this.SignalLine.map(item => item);
                this.DoubleArrayOfHistory.push(newArray)
            }
        }
        this.setArray(_type)
    }

    setArray(_type) {
        this.DoubleArrayOfHistory[this.TipSpace[0]][this.TipSpace[1]] = _type
        this.PreLine[this.CurrentLine] += 1
    }

    // deleArray(_space){
    //     this.DoubleArrayOfHistory[this._space[0]][this._space[1]] = 0
    //     this.PreLine[this.CurrentLine] -= 1
    // }

    getArrayNext() {
        return this.DoubleArrayOfHistory[this.TipSpace[0]][this.TipSpace[1] + 1]
    }

    getFirstLine() {
        for (let index = 0; index < this.DoubleArrayOfHistory.length; index++) {
            if (this.DoubleArrayOfHistory[index][0] == 0) {
                return index
            }
        }
        return this.DoubleArrayOfHistory.length
    }

    /**
    * @description 大眼仔路走势判断
    * @param {当前庄闲类型}} _type 
    */
    judgeDayanzai(_type, isblink, flag) {

        if (this.TipSpace[0] > 0 && this.TipSpace[1] > 0 || this.TipSpace[0] > 1 && this.TipSpace[1] >= 0 || this.isThroughPoint) {
            if (_type != this.lastTip) { //换列
                let a = 0;
                let b = 0;
                for (let index = 0; index < this.DoubleArrayOfHistory[this.TipSpace[0] - 1].length; index++) {
                    if (this.DoubleArrayOfHistory[this.TipSpace[0] - 1][index] != 0 && this.DoubleArrayOfHistory[this.TipSpace[0] - 1][index] == this.DoubleArrayOfHistory[this.TipSpace[0] - 1][0]) {
                        a += 1;
                    }
                }
                for (let j = 0; j < this.DoubleArrayOfHistory[this.TipSpace[0] - 2].length; j++) {
                    if (this.DoubleArrayOfHistory[this.TipSpace[0] - 2][j] != 0 && this.DoubleArrayOfHistory[this.TipSpace[0] - 2][j] == this.DoubleArrayOfHistory[this.TipSpace[0] - 2][0]) {
                        b += 1;
                    }
                }

                if (a == b) {
                    if (flag) {
                        this.setDayanluTip(BJLConstants.DaYanLu.zhuang, isblink)
                    }
                    return BJLConstants.DaYanLu.zhuang
                } else {
                    if (flag) {
                        this.setDayanluTip(BJLConstants.DaYanLu.xian, isblink)
                    }
                    return BJLConstants.DaYanLu.xian
                }

            } else {  //向下

                if (this.DoubleArrayOfHistory[this.TipSpace[0] - 1][this.TipSpace[1]] != 0 || this.DoubleArrayOfHistory[this.TipSpace[0] - 1][this.TipSpace[1]] == 1 || (this.TipSpace[0] >= 1 && this.DoubleArrayOfHistory[this.TipSpace[0] - 1][this.TipSpace[1]] == 0 && this.DoubleArrayOfHistory[this.TipSpace[0] - 1][this.TipSpace[1] - 1] == 0)) {
                    if (flag) {
                        this.setDayanluTip(BJLConstants.DaYanLu.zhuang, isblink)
                    }
                    return BJLConstants.DaYanLu.zhuang
                } else {
                    if (flag) {
                        this.setDayanluTip(BJLConstants.DaYanLu.xian, isblink)
                    }
                    return BJLConstants.DaYanLu.xian
                }
            }

            this.isThroughPoint = true
        }
        return -1;
    }

    judgeXiaolu(_type, isblink, flag) {

        if (this.TipSpace[0] > 1 && this.TipSpace[1] > 0 || this.TipSpace[0] > 2 && this.TipSpace[1] >= 0 || this.isThroughXiaoluPoint) {
            if (_type != this.lastTip) { //换列
                let a = 0;
                let b = 0;
                for (let index = 0; index < this.DoubleArrayOfHistory[this.TipSpace[0] - 1].length; index++) {
                    if (this.DoubleArrayOfHistory[this.TipSpace[0] - 1][index] != 0 && this.DoubleArrayOfHistory[this.TipSpace[0] - 1][index] == this.DoubleArrayOfHistory[this.TipSpace[0] - 1][0]) {
                        a += 1;
                    }
                }
                for (let j = 0; j < this.DoubleArrayOfHistory[this.TipSpace[0] - 3].length; j++) {
                    if (this.DoubleArrayOfHistory[this.TipSpace[0] - 3][j] != 0 && this.DoubleArrayOfHistory[this.TipSpace[0] - 3][j] == this.DoubleArrayOfHistory[this.TipSpace[0] - 3][0]) {
                        b += 1;
                    }
                }

                if (a == b) {
                    if (flag) {
                        this.setXiaoluTip(BJLConstants.XiaoLu.zhuang, isblink)
                    }
                    return BJLConstants.XiaoLu.zhuang
                } else {
                    if (flag) {
                        this.setXiaoluTip(BJLConstants.XiaoLu.xian, isblink)
                    }
                    return BJLConstants.XiaoLu.xian
                }

            } else {  //向下
                if (this.DoubleArrayOfHistory[this.TipSpace[0] - 2][this.TipSpace[1]] != 0 || this.DoubleArrayOfHistory[this.TipSpace[0] - 2][this.TipSpace[1]] == 1 || (this.TipSpace[0] >= 2 && this.DoubleArrayOfHistory[this.TipSpace[0] - 2][this.TipSpace[1]] == 0 && this.DoubleArrayOfHistory[this.TipSpace[0] - 2][this.TipSpace[1] - 1] == 0)) {
                    if (flag) {
                        this.setXiaoluTip(BJLConstants.XiaoLu.zhuang, isblink)
                        // UDebug.log("------------------long------this.TipSpace[0]-2 = "+(this.TipSpace[0]-2)+" ---this.TipSpace[1] = "+this.TipSpace[1]);
                    }
                    return BJLConstants.XiaoLu.zhuang
                } else {
                    if (flag) {
                        this.setXiaoluTip(BJLConstants.XiaoLu.xian, isblink)
                        // UDebug.log("------------------huuuuuu------this.TipSpace[0]-2 = "+(this.TipSpace[0]-2)+" ---this.TipSpace[1] = "+this.TipSpace[1]);
                    }
                    return BJLConstants.XiaoLu.xian
                }
            }
            this.isThroughXiaoluPoint = true
        }
        return -1;
    }

    judgeYueyoulu(_type, isblink, flag) {

        if (this.TipSpace[0] > 2 && this.TipSpace[1] > 0 || this.TipSpace[0] > 3 && this.TipSpace[1] >= 0 || this.isThroughYueyouluPoint) {
            if (_type != this.lastTip) { //换列
                let a = 0;
                let b = 0;
                for (let index = 0; index < this.DoubleArrayOfHistory[this.TipSpace[0] - 1].length; index++) {
                    if (this.DoubleArrayOfHistory[this.TipSpace[0] - 1][index] != 0 && this.DoubleArrayOfHistory[this.TipSpace[0] - 1][index] == this.DoubleArrayOfHistory[this.TipSpace[0] - 1][0]) {
                        a += 1;
                    }
                }
                for (let j = 0; j < this.DoubleArrayOfHistory[this.TipSpace[0] - 4].length; j++) {
                    if (this.DoubleArrayOfHistory[this.TipSpace[0] - 4][j] != 0 && this.DoubleArrayOfHistory[this.TipSpace[0] - 4][j] == this.DoubleArrayOfHistory[this.TipSpace[0] - 4][0]) {
                        b += 1;
                    }
                }

                if (a == b) {
                    if (flag) {
                        this.setYueyouluTip(BJLConstants.YueYouLu.zhuang, isblink)
                    }
                    return BJLConstants.YueYouLu.zhuang
                } else {
                    if (flag) {
                        this.setYueyouluTip(BJLConstants.YueYouLu.xian, isblink)
                    }
                    return BJLConstants.YueYouLu.xian
                }

            } else {  //向下
                if (this.DoubleArrayOfHistory[this.TipSpace[0] - 3][this.TipSpace[1]] != 0 || this.DoubleArrayOfHistory[this.TipSpace[0] - 3][this.TipSpace[1]] == 1 || (this.TipSpace[0] >= 3 && this.DoubleArrayOfHistory[this.TipSpace[0] - 3][this.TipSpace[1]] == 0 && this.DoubleArrayOfHistory[this.TipSpace[0] - 3][this.TipSpace[1] - 1] == 0)) {
                    if (flag) {
                        this.setYueyouluTip(BJLConstants.YueYouLu.zhuang, isblink)
                        // UDebug.log("------------------long------this.TipSpace[0]-3 = "+(this.TipSpace[0]-3)+" ---this.TipSpace[1] = "+this.TipSpace[1]);
                    }
                    return BJLConstants.YueYouLu.zhuang
                } else {
                    if (flag) {
                        this.setYueyouluTip(BJLConstants.YueYouLu.xian, isblink)
                        // UDebug.log("------------------huuuuuu------this.TipSpace[0]-3 = "+(this.TipSpace[0]-3)+" ---this.TipSpace[1] = "+this.TipSpace[1]);
                    }
                    return BJLConstants.YueYouLu.xian
                }
            }
            this.isThroughYueyouluPoint = true
        }
        return -1;
    }
    /**
     * @description 设置预测值
     * @param {预测值数组}} _stringArray 
     */
    setFore(_stringArray) {
        var Framez_dyl = this.Node_ForeZhuang.getChildByName('img_dayanlu').getComponent('MagicSprite')
        var Framez_xl = this.Node_ForeZhuang.getChildByName('img_xiaolu').getComponent('MagicSprite')
        var Framez_yyl = this.Node_ForeZhuang.getChildByName('img_yueyoulu').getComponent('MagicSprite')

        var Framex_dyl = this.Node_ForeXian.getChildByName('img_dayanlu').getComponent('MagicSprite')
        var Framex_xl = this.Node_ForeXian.getChildByName('img_xiaolu').getComponent('MagicSprite')
        var Framex_yyl = this.Node_ForeXian.getChildByName('img_yueyoulu').getComponent('MagicSprite')

        if (_stringArray[0] == 2) {
            Framez_dyl.index = 1
        }
        else if (_stringArray[0] == 3) {
            Framez_dyl.index = 0
        } else {
            Framez_dyl.index = 2
        }

        if (_stringArray[1] == 2) {
            Framez_xl.index = 1
        }
        else if (_stringArray[1] == 3) {
            Framez_xl.index = 0
        } else {
            Framez_xl.index = 2
        }


        if (_stringArray[2] == 2) {
            Framez_yyl.index = 1
        }
        else if (_stringArray[2] == 3) {
            Framez_yyl.index = 0
        } else {
            Framez_yyl.index = 2
        }

        if (_stringArray[3] == 2) {
            Framex_dyl.index = 1
        }
        else if (_stringArray[3] == 3) {
            Framex_dyl.index = 0
        } else {
            Framex_dyl.index = 2
        }

        if (_stringArray[4] == 2) {
            Framex_xl.index = 1
        }
        else if (_stringArray[4] == 3) {
            Framex_xl.index = 0
        } else {
            Framex_xl.index = 2
        }

        if (_stringArray[5] == 2) {
            Framex_yyl.index = 1
        }
        else if (_stringArray[5] == 3) {
            Framex_yyl.index = 0
        } else {
            Framex_yyl.index = 2
        }
    }

    setDayanluTip(flag: number, isblink?: boolean) {
        var js = this.Scoll_dayanlu.getComponent('VBrbjlRoomXiaoluController')
        js.setTip(1, flag, isblink)
    }

    setXiaoluTip(flag: number, isblink?: boolean) {
        var js = this.Scoll_xiaolu.getComponent('VBrbjlRoomXiaoluController')
        js.setTip(2, flag, isblink)
    }
    setYueyouluTip(flag: number, isblink?: boolean) {
        var js = this.Scoll_yueyoulu.getComponent('VBrbjlRoomXiaoluController')
        js.setTip(3, flag, isblink)

    }

}
