import USpriteFrames from "../../../common/base/USpriteFrames";
import AppGame from "../../../public/base/AppGame";
import HHConstants from "../HHConstants";
import MBrhh from "../model/MBrhh";

const { ccclass, property } = cc._decorator;
@ccclass
export default class VBrhhDaluController extends cc.Component {
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
    tempTipSpace:Array<number>=[0,0];
    DoubleArrayOfHistory:Array<Array<number>> = [];
    lastTip:number = 3;
    @property(cc.Node) spf_frames: cc.Node = null;
    @property(cc.ScrollView) daluScrollView: cc.ScrollView = null;
    @property(cc.Node) ListItem: cc.Node = null;
    @property(cc.Node) Scoll_dayanlu: cc.Node = null;
    @property(cc.Node) Scoll_xiaolu: cc.Node = null;
    @property(cc.Node) Scoll_yueyoulu: cc.Node = null;
    @property(cc.Node) Node_ForeHong: cc.Node = null; // 预测位红
    @property(cc.Node) Node_ForeHei: cc.Node = null; // 预测位黑
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
        this.initList(HHConstants.m_DlListNumber)
        this.initArray()
        this.initDaLu();
    }

    initData(data:any) {
        this._record_data = [];
        this._record_data = AppGame.ins.brhhModel.gameRecord.record;
        this.initDaluFirstData();
       
    }

    initDaLu() {
        this.TipSpace = [0,0]
        let temp_data = JSON.parse(JSON.stringify(this._record_data));
       /* while (temp_data.length > 6 * HHConstants.m_ZlListNumber) { 
            temp_data.shift();
        }*/
        
        for (let index = 0; index < temp_data.length; index++) {
            if (temp_data[index]) {
                this.setTip(temp_data[index].winArea);
            }
            if(index == temp_data.length) {
                this.daluScrollView.scrollToRight(0.5);
            }
        }
    }

    onDisable() {
       
        // AppGame.ins.brhhModel.off(MBrhh.S_GAME_END, this.onGameEnd, this);
    }
    onEnable() {
        // AppGame.ins.brhhModel.on(MBrhh.S_GAME_END, this.onGameEnd, this);
    }
    onGameEnd(data: any) {
        this.TipSpace = [0,0];
        this.node.removeAllChildren();
        // this.initData();
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
        // this.node.removeAllChildren();
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
        this.Scoll_dayanlu.getComponent('VBrhhXiaoluController').resetData();
        this.Scoll_xiaolu.getComponent('VBrhhXiaoluController').resetData();
        this.Scoll_yueyoulu.getComponent('VBrhhXiaoluController').resetData();
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
        
        if(_type == 1){
            temp_preline1[temp_preline1.length - 1]++ 
            var hei = temp_preline1
            temp_preline2[temp_preline2.length] = 1
            var hong = temp_preline2
        }
        else if(_type == 2){
            temp_preline1[temp_preline1.length] = 1 
            var hong = temp_preline1
            temp_preline2[temp_preline2.length - 1]++
            var hei = temp_preline2
        }

        var foreValue = []
        
        foreValue.push(this.judgeWay(hong,3))
        foreValue.push(this.judgeWay(hong,4))
        foreValue.push(this.judgeWay(hong,5))
        foreValue.push(this.judgeWay(hei,3)) //第二个参数为与向前第几行比较
        foreValue.push(this.judgeWay(hei,4))
        foreValue.push(this.judgeWay(hei,5))

        return foreValue
    }

    judgeWay(_arrayLine,_lastLineNum){
        if(_arrayLine[_arrayLine.length - 1] == 1){ //换列
            if(_arrayLine[_arrayLine.length - 2] == _arrayLine[_arrayLine.length - _lastLineNum]){
                return HHConstants.DaYanLu.hei
            }else{
                return HHConstants.DaYanLu.hong
            }
        }else{//向下
            if(_arrayLine[_arrayLine.length - 1] <= _arrayLine[_arrayLine.length - _lastLineNum + 1]){
                return HHConstants.DaYanLu.hei
            }
            else if(_arrayLine[_arrayLine.length - 1] - _arrayLine[_arrayLine.length - _lastLineNum + 1] == 1){
                return HHConstants.DaYanLu.hong
            }else{
                return HHConstants.DaYanLu.hei
            }
        }
    }

     ////////////////////预测记录数据////////////////////////
     setTip(flag: number, isblink?: boolean){
        var temp = flag;
        console.log("this._dalu_layout.length1 = "+this.node.childrenCount);
        var parent = this.node//this.getComponent(cc.ScrollView).content
     /* if(this.TipSpace[0] > parent.children.length - 1) {  
            // this.node.children[0].removeFromParent();
            // this.TipSpace[0]--;
            console.log("删除了一行------------------this.TipSpace[0]="+this.TipSpace[0]);
            var item = cc.instantiate(this.ListItem);
            item.setPosition(cc.v2(0,0)); 
            item.parent = parent;
            this.daluScrollView.scrollToRight(0.5);
        }
*/
        this.countSpace(flag)
        // var foreVlaue = this.coutSp(flag)
        // this.setFore(foreVlaue)
        
        this.judgeDayanzai(temp,isblink,true)
        this.judgeXiaolu(temp,isblink,true)
        this.judgeYueyoulu(temp,isblink,true)
        var child = parent.children;
        var item = child[this.TipSpace[0]] ;
        var tips = item.children;
        tips[this.TipSpace[1]].active = true;
        if(flag == 2) {
            tips[this.TipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getComponent('USpriteFrames').getFrames('hhdz_roadlist_hong2');
        } else {
            tips[this.TipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getComponent('USpriteFrames').getFrames('hhdz_roadlist_hei2');
        }
        if(isblink) {
            tips[this.TipSpace[1]].runAction(cc.blink(3, 6));
        }
        this.lastTip = temp
        if(this.TipSpace[0] >= HHConstants.m_DlListNumber ){
            this.daluScrollView.scrollToRight(1);
        }

        // 下局开红预测值
        let foreValue = [];
        this.countSpace(2);
        foreValue.push(this.judgeDayanzai(2,isblink,false));
        foreValue.push(this.judgeXiaolu(2,isblink,false));
        foreValue.push(this.judgeYueyoulu(2,isblink,false));
        this.DoubleArrayOfHistory[this.TipSpace[0]][this.TipSpace[1]] = 0;
        this.TipSpace[0] = this.tempTipSpace[0];
        this.TipSpace[1] = this.tempTipSpace[1];
        
        // 下局开黑预测值
        this.countSpace(1);
        foreValue.push(this.judgeDayanzai(1,isblink,false));
        foreValue.push(this.judgeXiaolu(1,isblink,false));
        foreValue.push(this.judgeYueyoulu(1,isblink,false));
        this.DoubleArrayOfHistory[this.TipSpace[0]][this.TipSpace[1]] = 0;
        this.TipSpace[0] = this.tempTipSpace[0];
        this.TipSpace[1] = this.tempTipSpace[1];
        this.setFore(foreValue)

        this.daluScrollView.scrollToRight(1);
        // return foreVlaue
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
                    console.log("删除了一行22222------------------");
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
                var parent = this.node
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
                        this.setDayanluTip(HHConstants.DaYanLu.hong,isblink)
                    }
                    return HHConstants.DaYanLu.hong
                } else {
                    if(flag) {
                        this.setDayanluTip(HHConstants.DaYanLu.hei,isblink)
                    }
                    return HHConstants.DaYanLu.hei
                }

            }else{  //向下
                if(this.DoubleArrayOfHistory[this.TipSpace[0]-1][this.TipSpace[1]] != 0  || (this.TipSpace[0] >= 1 && this.DoubleArrayOfHistory[this.TipSpace[0]-1][this.TipSpace[1]] == 0 && this.DoubleArrayOfHistory[this.TipSpace[0]-1][this.TipSpace[1]-1] == 0)){
                    if(flag) {
                        this.setDayanluTip(HHConstants.DaYanLu.hong,isblink)
                    }
                    return HHConstants.DaYanLu.hong
                } else {
                    if(flag) {
                        this.setDayanluTip(HHConstants.DaYanLu.hei,isblink)
                    }
                    return HHConstants.DaYanLu.hei
                }
            }

            this.isThroughPoint = true
        }
        return -1;
    }

    judgeXiaolu(_type, isblink, flag){
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
                        this.setXiaoluTip(HHConstants.DaYanLu.hong,isblink)
                    }
                    return HHConstants.DaYanLu.hong
                } else {
                    if(flag) {
                        this.setXiaoluTip(HHConstants.DaYanLu.hei,isblink)
                    }
                    return HHConstants.DaYanLu.hei
                }
            }else{  //向下
                if(this.DoubleArrayOfHistory[this.TipSpace[0]-2][this.TipSpace[1]] != 0 || (this.TipSpace[0] >= 2 && this.DoubleArrayOfHistory[this.TipSpace[0]-2][this.TipSpace[1]] == 0 && this.DoubleArrayOfHistory[this.TipSpace[0]-2][this.TipSpace[1]-1] == 0)){
                    if(flag) {
                        this.setXiaoluTip(HHConstants.DaYanLu.hong,isblink)
                    }
                    return HHConstants.DaYanLu.hong
                } else {
                    if(flag) {
                        this.setXiaoluTip(HHConstants.DaYanLu.hei,isblink)
                    }
                    return HHConstants.DaYanLu.hei
                }
            }
            this.isThroughXiaoluPoint = true
        }
        return -1;
    }

    judgeYueyoulu(_type, isblink, flag){
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
                        this.setYueyouluTip(HHConstants.DaYanLu.hong,isblink)
                    }
                    return HHConstants.DaYanLu.hong
                } else {
                    if(flag) {
                        this.setYueyouluTip(HHConstants.DaYanLu.hei,isblink)
                    }
                    return HHConstants.DaYanLu.hei
                }

            }else{  //向下
                
                if(this.DoubleArrayOfHistory[this.TipSpace[0]-3][this.TipSpace[1]] != 0 || (this.TipSpace[0] >= 3 && this.DoubleArrayOfHistory[this.TipSpace[0]-3][this.TipSpace[1]] == 0 && this.DoubleArrayOfHistory[this.TipSpace[0]-3][this.TipSpace[1]-1] == 0)){
                    if(flag) {
                        this.setYueyouluTip(HHConstants.DaYanLu.hong,isblink)
                    }
                    return HHConstants.DaYanLu.hong
                } else {
                    if(flag) {
                        this.setYueyouluTip(HHConstants.DaYanLu.hei,isblink)
                    }
                    return HHConstants.DaYanLu.hei
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
        var Framez_dyl = this.Node_ForeHong.getChildByName('img_dayanlu').getComponent('MagicSprite')
        var Framez_xl = this.Node_ForeHong.getChildByName('img_xiaolu').getComponent('MagicSprite')
        var Framez_yyl = this.Node_ForeHong.getChildByName('img_yueyoulu').getComponent('MagicSprite')

        var Framex_dyl = this.Node_ForeHei.getChildByName('img_dayanlu').getComponent('MagicSprite')
        var Framex_xl = this.Node_ForeHei.getChildByName('img_xiaolu').getComponent('MagicSprite')
        var Framex_yyl = this.Node_ForeHei.getChildByName('img_yueyoulu').getComponent('MagicSprite')

        if(_stringArray[0] == 2){
            Framez_dyl.index = 0
        }   
        else if(_stringArray[0] == 1){
            Framez_dyl.index = 1
        }

        if(_stringArray[1] == 2){
            Framez_xl.index = 0
        }   
        else if(_stringArray[1] == 1){
            Framez_xl.index = 1
        }


        if(_stringArray[2] == 2){
            Framez_yyl.index = 0
        }   
        else if(_stringArray[2] == 1){
            Framez_yyl.index = 1
        }

        if(_stringArray[3] == 2){
            Framex_dyl.index = 0
        }   
        else if(_stringArray[3] == 1){
            Framex_dyl.index = 1
        }

        if(_stringArray[4] == 2){
            Framex_xl.index = 0
        }   
        else if(_stringArray[4] == 1){
            Framex_xl.index = 1
        }

        if(_stringArray[5] == 2){
            Framex_yyl.index = 0
        }   
        else if(_stringArray[5] == 1){
            Framex_yyl.index = 1
        }
    }

    setDayanluTip(flag: number,isblink?:boolean){
        var js = this.Scoll_dayanlu.getComponent('VBrhhXiaoluController')
        js.setTip(1,flag,isblink)
    }

    setXiaoluTip(flag: number,isblink?:boolean){
        var js = this.Scoll_xiaolu.getComponent('VBrhhXiaoluController')
        js.setTip(2,flag,isblink)
    }
    setYueyouluTip(flag: number,isblink?:boolean){
        var js = this.Scoll_yueyoulu.getComponent('VBrhhXiaoluController')
        js.setTip(3,flag,isblink)
        
    }
    
}
