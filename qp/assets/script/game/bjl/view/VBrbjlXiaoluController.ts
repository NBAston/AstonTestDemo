
import LHConstants from "../BJLConstants";

const { ccclass, property } = cc._decorator;
@ccclass
export default class VBrbjlXiaoluController extends cc.Component {
    @property(cc.Node)
    spf_frames: cc.Node = null;
    TipSpace:Array<number>=[0,0];
    SignalLine:Array<number> = [0,0,0,0,0,0];
    DoubleArrayOfHistory:Array<Array<number>>= [];
    _record_data: Array<Object>;   // 开奖记录
    lastTip:number;
    isTurn:boolean;
    @property(cc.ScrollView) luduanScrollView: cc.ScrollView = null;
    @property(cc.Node) ListItem: cc.Node = null;
    onLoad() {

        this.SignalLine = [0,0,0,0,0,0]
        this.DoubleArrayOfHistory = [];
        this.isTurn = false
        this.initArray()
    }
    start() {
    }

    initData() {
        // this._record_data = [];
        // this._record_data = AppGame.ins.brModel.gameRecord.record;
    }
    resetData() {
        this.SignalLine = [0, 0, 0, 0, 0, 0]; 
        this.DoubleArrayOfHistory = [];
        this.isTurn = false
        this.lastTip = -1
        this.TipSpace = [0, 0];
        this.initList(12);
        this.initArray()
    }
   /**
     * @description 初始化列表
     * @param {} _number 
     */
    initList(_number){
        var parent = this.node;
        for (let index = 0; index < _number; index++) {
            var item = cc.instantiate(this.ListItem) 
            item.setPosition(cc.v2(0,0)); 
            item.parent = parent      
        }
    }
    
    initArray(){
        var len = this.node.children.length
        for (let index = 0; index < len; index++) {
            var newArray = this.SignalLine.map(item => item);
            this.DoubleArrayOfHistory.push(newArray)   
        }
    }
    
    setTip(type: number,flag: number,isblink?:boolean){
        var parent = this.node;
        this.countSpace(flag)
        var child = parent.children;
        var item = child[this.TipSpace[0]] ;
        var tips = item.children;
        tips[this.TipSpace[1]].active = true;
        switch(type) {
        case 1:// 大眼仔路
            if(flag == 2) {
                tips[this.TipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getComponent('USpriteFrames').getFrames('xian_2');
            } else {
                tips[this.TipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getComponent('USpriteFrames').getFrames('zhuang_2');
            }
            break
        case 2:// 小路
            if(flag == 2) {
                tips[this.TipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getComponent('USpriteFrames').getFrames('xian_3');
            } else {
                tips[this.TipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getComponent('USpriteFrames').getFrames('zhuang_3');
            }
            break
        case 3:// 曱甴路
            if(flag == 2) {
                tips[this.TipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getComponent('USpriteFrames').getFrames('xian_4');
            } else {
                tips[this.TipSpace[1]].getComponent(cc.Sprite).spriteFrame = this.spf_frames.getComponent('USpriteFrames').getFrames('zhuang_4');
            }
            break
        }
        if(isblink) {
            tips[this.TipSpace[1]].runAction(cc.blink(3, 6));
        }
        this.lastTip = flag;

        if(this.TipSpace[0] >= LHConstants.m_XllListNumber-7){
            this.luduanScrollView.scrollToRight(0.5);
        }
    }

    countSpace(_type){
        var parent = this.node
        if(_type == this.lastTip){
            if(this.TipSpace[1] == 5||this.getArrayNext() != 0){
                this.TipSpace[0]++
                if(this.TipSpace[0] > parent.children.length - 1)
                {  
                    var parent = this.node
                    var item = cc.instantiate(this.ListItem) 
                    item.setPosition(cc.v2(0,0)); 
                    item.parent = parent
                    var newArray = this.SignalLine.map(item => item);
                    this.DoubleArrayOfHistory.push(newArray) 
                }
                this.setArray(_type)
                this.isTurn = true
                return 
            }
            this.TipSpace[1]++
        }else{
          this.TipSpace[0] = this.getFirstLine()
            this.TipSpace[1] = 0
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
    }

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

}
