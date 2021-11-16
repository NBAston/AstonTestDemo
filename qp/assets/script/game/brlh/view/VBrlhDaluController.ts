
import UDebug from "../../../common/utility/UDebug";
import LHConstants from "../LHConstants";
import MBrhh from "../model/MBrlh";

const { ccclass, property } = cc._decorator;
@ccclass
export default class VBrlhDaluController extends cc.Component {
    TipSpace:Array<number>=[0,0];
    SignalLine:Array<number> = [0,0,0,0,0,0];
    PreLine:Array<number>=[];
    _TipSpace:[0,0];
    _SignalLine:[0,0,0,0,0,0];
    _record_data: Array<Object>;   // 开奖记录
    _PreLine:Array<number>=[];
    _currentLine:0;
    CurrentLine:0;
    isline:boolean;
    isThroughPoint:boolean;
    isThroughXiaoluPoint:boolean;
    isThroughYueyouluPoint:boolean;
    isTurn:boolean;
    tempTipSpace:Array<number>=[0,0]
    DoubleArrayOfHistory:Array<Array<number>> = [];
    lastTip:number = 0;
    @property(cc.Node) spf_frames: cc.Node = null;
    @property(cc.ScrollView) daluScrollView: cc.ScrollView = null;
    @property(cc.Node) ListItem: cc.Node = null;
    @property(cc.Node) Scoll_dayanlu: cc.Node = null;
    @property(cc.Node) Scoll_xiaolu: cc.Node = null;
    @property(cc.Node) Scoll_yueyoulu: cc.Node = null;
    @property(cc.Node) Node_ForeLong: cc.Node = null; // 预测位龙
    @property(cc.Node) Node_ForeHu: cc.Node = null; // 预测位虎

    onLoad() {
    }

    initDaluFirstData() {
       
        this.TipSpace = [0,0]
        this.SignalLine = [0,0,0,0,0,0]
        this.PreLine = []
        this.tempTipSpace = [0, 0]
        this.DoubleArrayOfHistory = [];
        ////////////////////预测记录数据////////////////////////
        this._TipSpace = [0,0]
        this._SignalLine = [0,0,0,0,0,0]
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
        this.initList(LHConstants.m_DlListNumber)
        this.initArray()
        this.initDaLu();
    }

    initData(data:any) {
        this._record_data = [];
        this._record_data = data
        this.initDaluFirstData();
       
    }

    initDaLu() {
        this.TipSpace = [0,0]
        let temp_data = JSON.parse(JSON.stringify(this._record_data));
        /*while (temp_data.length > 6 * LHConstants.m_ZlListNumber) { 
            temp_data.shift();
        }*/
        
        for (let index = 0; index < temp_data.length; index++) {
            if (temp_data[index]) {
                this.setTip(temp_data[index]);
            }
            if(index == temp_data.length) {
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
    initList(_number){
        this.clearLudanData();
        var parent = this.node;
        for (let index = 0; index < _number; index++) {
            var item = cc.instantiate(this.ListItem) 
            item.setPosition(cc.v2(0,0)); 
            item.parent = parent      
        }
    }

    clearLudanData() {
        this.node.removeAllChildren();
        this.Scoll_dayanlu.removeAllChildren();
        this.Scoll_xiaolu.removeAllChildren();
        this.Scoll_yueyoulu.removeAllChildren();
        this.Scoll_dayanlu.getComponent('VBrlhXiaoluController').resetData();
        this.Scoll_xiaolu.getComponent('VBrlhXiaoluController').resetData();
        this.Scoll_yueyoulu.getComponent('VBrlhXiaoluController').resetData();
        this.setFore([0, 0, 0, 0, 0, 0]);
    }
    
    initArray(){
        var len = this.node.children.length
        for (let index = 0; index < len; index++) {
            var newArray = this.SignalLine.map(item => item);
            this.DoubleArrayOfHistory.push(newArray)   
        }
    }

    ////////////////////预测记录数据////////////////////////
    coutSp(_type){
        var temp_preline1 = [];
        var temp_preline2 = [];
        temp_preline1 = this.PreLine.map(item => item)
        temp_preline2 = this.PreLine.map(item => item)
        
        if(_type == 2){
            temp_preline1[temp_preline1.length - 1]++ 
            var long = temp_preline1
            temp_preline2[temp_preline2.length] = 1
            var hu = temp_preline2
        }
        else if(_type == 3){
            temp_preline1[temp_preline1.length] = 1 
            var long = temp_preline1
            temp_preline2[temp_preline2.length - 1]++
            var hu = temp_preline2
        }

        var foreValue = []
        
        foreValue.push(this.judgeWay(long,3))
        foreValue.push(this.judgeWay(long,4))
        foreValue.push(this.judgeWay(long,5))
        foreValue.push(this.judgeWay(hu,3)) //第二个参数为与向前第几行比较
        foreValue.push(this.judgeWay(hu,4))
        foreValue.push(this.judgeWay(hu,5))

        return foreValue
    }

    judgeWay(_arrayLine,_lastLineNum){
        if(_arrayLine[_arrayLine.length - 1] == 1){ //换列
            if(_arrayLine[_arrayLine.length - 2] == _arrayLine[_arrayLine.length - _lastLineNum]){
                return LHConstants.DaYanLu.long
            }else{
                return LHConstants.DaYanLu.hu
            }
        }else{//向下
            if(_arrayLine[_arrayLine.length - 1] <= _arrayLine[_arrayLine.length - _lastLineNum + 1]){
                return LHConstants.DaYanLu.long
            }
            else if(_arrayLine[_arrayLine.length - 1] - _arrayLine[_arrayLine.length - _lastLineNum + 1] == 1){
                return LHConstants.DaYanLu.hu
            }else{
                return LHConstants.DaYanLu.long
            }
        }
    }

     ////////////////////预测记录数据////////////////////////
     setTip(flag: number,isblink?: boolean){
        var temp = flag;
        if(flag == LHConstants.DaLu.he) {
            this.setHe();
            return;
        } else {
            this.countSpace(flag)
        }
        // this.countSpace(flag)
        var parent = this.node
        // var foreVlaue = this.coutSp(flag)
        // this.setFore(foreVlaue)
        
        this.judgeDayanzai(temp,isblink,true)
        this.judgeXiaolu(temp,isblink,true)
        this.judgeYueyoulu(temp,isblink,true)
        var child = parent.children;
        var item = child[this.TipSpace[0]] ;
        
        var tips = item.children;
        tips[this.TipSpace[1]].active = true;

        // console.log("初始化----flag == "+flag+" Tip[0] = "+this.TipSpace[0]+" this.TipSpace[1]="+this.TipSpace[1]);
        var js = tips[this.TipSpace[1]].getComponent('VBrlhTipItemController');
        js.setFrameDalu(flag,isblink)
       /* if(flag == LHConstants.DaLu.long) {
            tips[this.TipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getComponent('USpriteFrames').getFrames('lhd_roadlist_long2');
        } else if(flag == LHConstants.DaLu.hu) {
            tips[this.TipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getComponent('USpriteFrames').getFrames('lhd_roadlist_hu2');
        } else if(flag == LHConstants.DaLu.he) {
            tips[this.TipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getComponent('USpriteFrames').getFrames('lhd_roadlist_he2');
        }
        if(isblink) {
            tips[this.TipSpace[1]].runAction(cc.blink(3, 6));
        }*/
        this.lastTip = temp
        if(this.TipSpace[0] >= LHConstants.m_DlListNumber-6 ){
            this.daluScrollView.scrollToRight(1);
        }
        // 下局开龙预测值
        let foreValue = [];
        this.countSpace(2);
        foreValue.push(this.judgeDayanzai(2,isblink,false));
        foreValue.push(this.judgeXiaolu(2,isblink,false));
        foreValue.push(this.judgeYueyoulu(2,isblink,false));
        this.DoubleArrayOfHistory[this.TipSpace[0]][this.TipSpace[1]] = 0;
        this.TipSpace[0] = this.tempTipSpace[0];
        this.TipSpace[1] = this.tempTipSpace[1];
        
        // 下局开虎预测值
        this.countSpace(3);
        foreValue.push(this.judgeDayanzai(3,isblink,false));
        foreValue.push(this.judgeXiaolu(3,isblink,false));
        foreValue.push(this.judgeYueyoulu(3,isblink,false));
        this.DoubleArrayOfHistory[this.TipSpace[0]][this.TipSpace[1]] = 0;
        this.TipSpace[0] = this.tempTipSpace[0];
        this.TipSpace[1] = this.tempTipSpace[1];
        this.setFore(foreValue)

        this.daluScrollView.scrollToRight(1);
        // return foreVlaue
    }

    setHe(){
        var parent = this.node
        var child = parent.children
        var item = child[this.TipSpace[0]] 
        var tips = item.children
        tips[this.TipSpace[1]].active = true;
        // tips[this.TipSpace[1]+1].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getComponent('USpriteFrames').getFrames('lhd_roadlist_he2');
        // this.TipSpace[1]++;
        var js = tips[this.TipSpace[1]].getComponent('VBrlhTipItemController')
        js.setHe()

    }
    countSpace(_type){
        var parent = this.node;
        this.tempTipSpace[0] = this.TipSpace[0];
        this.tempTipSpace[1] = this.TipSpace[1];
        if(_type == this.lastTip){
            if(this.TipSpace[1] == 5||this.getArrayNext() != 0){
                this.TipSpace[0]++     
                if(this.TipSpace[0] > parent.children.length - 1)
                {  
                    // this.TipSpace[0]--;
                    // this.node.children[0].removeFromParent();
                    var parent = this.node;
                    var item = cc.instantiate(this.ListItem) ;
                    item.setPosition(cc.v2(0,0)); 
                    item.parent = parent;
                    var newArray = this.SignalLine.map(item => item);
                    this.DoubleArrayOfHistory.push(newArray); 
                }
                this.setArray(_type)
                this.isTurn = true 
                return 
            }
            this.TipSpace[1]++ 
        }else{   
            this.TipSpace[0] = this.getFirstLine()
            this.TipSpace[1] = 0
            if(this.isline){
                this.CurrentLine++ 
            }
            this.isline = true
            this.PreLine[this.CurrentLine] = 0
            if(this.TipSpace[0] > parent.children.length - 1)
            {  
                // this.TipSpace[0]--;
                // this.node.children[0].removeFromParent();
                var parent = this.node//this.getComponent(cc.ScrollView).content
                var item = cc.instantiate(this.ListItem) 
                item.setPosition(cc.v2(0,0));  
                item.parent = parent
                var newArray = this.SignalLine.map(item => item);
                this.DoubleArrayOfHistory.push(newArray) 
            }
        }
        this.setArray(_type)
    }

    setArray(_type){
        this.DoubleArrayOfHistory[this.TipSpace[0]][this.TipSpace[1]] = _type
        this.PreLine[this.CurrentLine] += 1
    }

    // deleArray(_space){
    //     this.DoubleArrayOfHistory[this._space[0]][this._space[1]] = 0
    //     this.PreLine[this.CurrentLine] -= 1
    // }

    getArrayNext(){
        return this.DoubleArrayOfHistory[this.TipSpace[0]][this.TipSpace[1] + 1]
    }

    getFirstLine(){
        for (let index = 0; index < this.DoubleArrayOfHistory.length; index++) {
            if(this.DoubleArrayOfHistory[index][0] == 0){
                return index
            }   
        }
        return this.DoubleArrayOfHistory.length
    }

     /**
     * @description 大眼仔路走势判断
     * @param {当前庄闲类型}} _type 
     */
      judgeDayanzai(_type,isblink,flag){
        console.log("#########this.TipSpace[0]====="+this.TipSpace[0]);
        // if(this.TipSpace[0] < 2) {
        //     return;
        // }
        if(this.TipSpace[0]>0 && this.TipSpace[1]>0 || this.TipSpace[0]>1 && this.TipSpace[1]>=0 || this.isThroughPoint){
            if(_type != this.lastTip){ //换列
                let a = 0;
                let b = 0;
                for (let index = 0; index < this.DoubleArrayOfHistory[this.TipSpace[0]-1].length; index++) {
                    if(this.DoubleArrayOfHistory[this.TipSpace[0]-1][index] != 0 && this.DoubleArrayOfHistory[this.TipSpace[0]-1][index] == this.DoubleArrayOfHistory[this.TipSpace[0]-1][0]) {
                        a += 1;
                    }
                }
                for (let j = 0; j < this.DoubleArrayOfHistory[this.TipSpace[0]-2].length; j++) {
                    if(this.DoubleArrayOfHistory[this.TipSpace[0]-2][j] != 0 && this.DoubleArrayOfHistory[this.TipSpace[0]-2][j] == this.DoubleArrayOfHistory[this.TipSpace[0]-2][0]) {
                        b += 1;
                    }
                }

                if(a == b) {
                    if(flag) {
                        this.setDayanluTip(LHConstants.DaYanLu.long,isblink)
                    }
                    return LHConstants.DaYanLu.long
                } else {
                    if(flag) {
                        this.setDayanluTip(LHConstants.DaYanLu.hu,isblink)
                    }
                    return LHConstants.DaYanLu.hu
                }

            }else{  //向下
                
                if(this.DoubleArrayOfHistory[this.TipSpace[0]-1][this.TipSpace[1]] != 0 || this.DoubleArrayOfHistory[this.TipSpace[0]-1][this.TipSpace[1]] == 1 || (this.TipSpace[0] >= 1 && this.DoubleArrayOfHistory[this.TipSpace[0]-1][this.TipSpace[1]] == 0 && this.DoubleArrayOfHistory[this.TipSpace[0]-1][this.TipSpace[1]-1] == 0)){
                    if(flag) {
                        this.setDayanluTip(LHConstants.DaYanLu.long,isblink)
                    }
                    return LHConstants.DaYanLu.long
                } else {
                    if(flag) {
                        this.setDayanluTip(LHConstants.DaYanLu.hu,isblink)
                    }
                    return LHConstants.DaYanLu.hu
                }
            }

            this.isThroughPoint = true
        }
        return -1;
    }

    judgeXiaolu(_type,isblink,flag){
       
        if(this.TipSpace[0]>1 && this.TipSpace[1]>0 || this.TipSpace[0]>2 && this.TipSpace[1]>=0 || this.isThroughXiaoluPoint){
            if(_type != this.lastTip){ //换列
                let a = 0;
                let b = 0;
                for (let index = 0; index < this.DoubleArrayOfHistory[this.TipSpace[0]-1].length; index++) {
                    if(this.DoubleArrayOfHistory[this.TipSpace[0]-1][index] != 0 && this.DoubleArrayOfHistory[this.TipSpace[0]-1][index] == this.DoubleArrayOfHistory[this.TipSpace[0]-1][0]) {
                        a += 1;
                    }
                }
                for (let j = 0; j < this.DoubleArrayOfHistory[this.TipSpace[0]-3].length; j++) {
                    if(this.DoubleArrayOfHistory[this.TipSpace[0]-3][j] != 0 && this.DoubleArrayOfHistory[this.TipSpace[0]-3][j] == this.DoubleArrayOfHistory[this.TipSpace[0]-3][0]) {
                        b += 1;
                    }
                }

                if(a == b) {
                    if(flag) {
                        this.setXiaoluTip(LHConstants.XiaoLu.long,isblink)
                    }
                    return LHConstants.XiaoLu.long
                } else {
                    if(flag) {
                        this.setXiaoluTip(LHConstants.XiaoLu.hu,isblink)
                    }
                    return LHConstants.XiaoLu.hu
                }

            }else{  //向下
                if(this.DoubleArrayOfHistory[this.TipSpace[0]-2][this.TipSpace[1]] != 0 || this.DoubleArrayOfHistory[this.TipSpace[0]-2][this.TipSpace[1]] == 1 || (this.TipSpace[0] >= 2 && this.DoubleArrayOfHistory[this.TipSpace[0]-2][this.TipSpace[1]] == 0 && this.DoubleArrayOfHistory[this.TipSpace[0]-2][this.TipSpace[1]-1] == 0)){
                    if(flag) {
                        this.setXiaoluTip(LHConstants.XiaoLu.long,isblink)
                        UDebug.log("------------------long------this.TipSpace[0]-2 = "+(this.TipSpace[0]-2)+" ---this.TipSpace[1] = "+this.TipSpace[1]);
                    }
                    return LHConstants.XiaoLu.long
                } else {
                    if(flag) {
                        this.setXiaoluTip(LHConstants.XiaoLu.hu,isblink)
                        UDebug.log("------------------huuuuuu------this.TipSpace[0]-2 = "+(this.TipSpace[0]-2)+" ---this.TipSpace[1] = "+this.TipSpace[1]);
                    }
                    return LHConstants.XiaoLu.hu
                }
            }
            this.isThroughXiaoluPoint = true
        }
        return -1;
    }

    judgeYueyoulu(_type,isblink,flag){
       
        if(this.TipSpace[0]>2 && this.TipSpace[1]>0 || this.TipSpace[0]>3 && this.TipSpace[1]>=0 || this.isThroughYueyouluPoint){
            if(_type != this.lastTip){ //换列
                let a = 0;
                let b = 0;
                for (let index = 0; index < this.DoubleArrayOfHistory[this.TipSpace[0]-1].length; index++) {
                    if(this.DoubleArrayOfHistory[this.TipSpace[0]-1][index] != 0 && this.DoubleArrayOfHistory[this.TipSpace[0]-1][index] == this.DoubleArrayOfHistory[this.TipSpace[0]-1][0]) {
                        a += 1;
                    }
                }
                for (let j = 0; j < this.DoubleArrayOfHistory[this.TipSpace[0]-4].length; j++) {
                    if(this.DoubleArrayOfHistory[this.TipSpace[0]-4][j] != 0 && this.DoubleArrayOfHistory[this.TipSpace[0]-4][j] == this.DoubleArrayOfHistory[this.TipSpace[0]-4][0]) {
                        b += 1;
                    }
                }

                if(a == b) {
                    if(flag) {
                        this.setYueyouluTip(LHConstants.YueYouLu.long,isblink)
                    }
                    return LHConstants.YueYouLu.long
                } else {
                    if(flag) {
                        this.setYueyouluTip(LHConstants.YueYouLu.hu,isblink)
                    }
                    return LHConstants.YueYouLu.hu
                }

            }else{  //向下
                if(this.DoubleArrayOfHistory[this.TipSpace[0]-3][this.TipSpace[1]] != 0 || this.DoubleArrayOfHistory[this.TipSpace[0]-3][this.TipSpace[1]] == 1 || (this.TipSpace[0] >= 3 && this.DoubleArrayOfHistory[this.TipSpace[0]-3][this.TipSpace[1]] == 0 && this.DoubleArrayOfHistory[this.TipSpace[0]-3][this.TipSpace[1]-1] == 0)){
                    if(flag) {
                        this.setYueyouluTip(LHConstants.YueYouLu.long,isblink)
                        UDebug.log("------------------long------this.TipSpace[0]-3 = "+(this.TipSpace[0]-3)+" ---this.TipSpace[1] = "+this.TipSpace[1]);
                    }
                    return LHConstants.YueYouLu.long
                } else {
                    if(flag) {
                        this.setYueyouluTip(LHConstants.YueYouLu.hu,isblink)
                        UDebug.log("------------------huuuuuu------this.TipSpace[0]-3 = "+(this.TipSpace[0]-3)+" ---this.TipSpace[1] = "+this.TipSpace[1]);
                    }
                    return LHConstants.YueYouLu.hu
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
    setFore(_stringArray){
        var Framez_dyl = this.Node_ForeLong.getChildByName('img_dayanlu').getComponent('MagicSprite')
        var Framez_xl = this.Node_ForeLong.getChildByName('img_xiaolu').getComponent('MagicSprite')
        var Framez_yyl = this.Node_ForeLong.getChildByName('img_yueyoulu').getComponent('MagicSprite')

        var Framex_dyl = this.Node_ForeHu.getChildByName('img_dayanlu').getComponent('MagicSprite')
        var Framex_xl = this.Node_ForeHu.getChildByName('img_xiaolu').getComponent('MagicSprite')
        var Framex_yyl = this.Node_ForeHu.getChildByName('img_yueyoulu').getComponent('MagicSprite')

        if(_stringArray[0] == 2){
            Framez_dyl.index = 1
        }   
        else if(_stringArray[0] == 3){
            Framez_dyl.index = 0
        }

        if(_stringArray[1] == 2){
            Framez_xl.index = 1
        }   
        else if(_stringArray[1] == 3){
            Framez_xl.index = 0
        }


        if(_stringArray[2] == 2){
            Framez_yyl.index = 1
        }   
        else if(_stringArray[2] == 3){
            Framez_yyl.index = 0
        }

        if(_stringArray[3] == 2){
            Framex_dyl.index = 1
        }   
        else if(_stringArray[3] == 3){
            Framex_dyl.index = 0
        }

        if(_stringArray[4] == 2){
            Framex_xl.index = 1
        }   
        else if(_stringArray[4] == 3){
            Framex_xl.index = 0
        }

        if(_stringArray[5] == 2){
            Framex_yyl.index = 1
        }   
        else if(_stringArray[5] == 3){
            Framex_yyl.index = 0
        }
    }

    setDayanluTip(flag: number,isblink?:boolean){
        var js = this.Scoll_dayanlu.getComponent('VBrlhXiaoluController')
        js.setTip(1,flag,isblink)
    }

    setXiaoluTip(flag: number,isblink?:boolean){
        var js = this.Scoll_xiaolu.getComponent('VBrlhXiaoluController')
        js.setTip(2,flag,isblink)
    }
    setYueyouluTip(flag: number,isblink?:boolean){
        var js = this.Scoll_yueyoulu.getComponent('VBrlhXiaoluController')
        js.setTip(3,flag,isblink)
        
    }
    
}
