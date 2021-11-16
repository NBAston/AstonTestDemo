import UNodeHelper from "../../common/utility/UNodeHelper";


const GoldRate = 100;  //

/**
 * 百人红黑下注区域 管理
 */

export default class BrhhRect {

    private _node_root: cc.Node = null;

    private _node_win: cc.Node = null;  // 中了之后闪烁的node
    _node_score_self: cc.Node = null;
    _lab_total_score: cc.Label = null;
    _lab_self_score: cc.Label = null;


    constructor(root:cc.Node , lab_total:cc.Label , lab_self:cc.Label ) {
        this._node_root = root;
        this._lab_total_score = lab_total;
        this._lab_self_score = lab_self;
        this.init();
    }


    clear() {

        this._lab_self_score.string = '0';
        // this._lab_self_score.node.active = false;
        // this._node_score_self.active = false;
        this._lab_total_score.string = '0';

        this._node_win.stopAllActions();
        this._node_win.opacity = 0;

    }

    get position() {
        return this._node_root.position;
    }

    init() {

        this._node_win = UNodeHelper.find(this._node_root , 'sp_win');
        // this._node_score_self = UNodeHelper.find(this._node_root , 'sp_my_jetton_bg');
        // this._lab_total_score = UNodeHelper.getComponent(this._node_root , 'lab_gold' , cc.Label);
        // this._lab_self_score = UNodeHelper.getComponent(this._node_score_self , 'lab_my_xiazhu' , cc.Label);
    }

    setTotalGold(gold:number) {
        this._lab_total_score.string = (gold / GoldRate).toString();
    }

    setSelfGold(gold:number) {

        // if (gold > 0) {
        //     // this._node_score_self.active = true;
        //     // this._lab_self_score.node.active = true;
        // }
        this._lab_self_score.string = (gold / GoldRate).toString();
    }
  
    
    showBlink() {
        this._node_win.runAction( cc.sequence(cc.delayTime(4) , cc.callFunc(()=>{
            this._node_win.stopAllActions();
            this._node_win.runAction(cc.repeatForever(cc.sequence(cc.fadeTo(0.5, 100), cc.fadeTo(0.5, 255))));
        })));
    }


    // playWinOrLoseScore(score:number , del_time: number) {
    //     let str_score = (score / GoldRate).toString();
    //     if (score >= 0) {
    //         str_score = '+' + str_score;
    //         this._sp_score_bg.spriteFrame = this._spf_win_bg;
    //     }
    //     else{
    //         this._sp_score_bg.spriteFrame = this._spf_lose_bg;
    //     }

    //     this._lab_score.string = str_score;
        
    //     this._sp_score_bg.node.active = true;
    //     this._sp_score_bg.node.position = cc.v2(0,0);
    //     this._sp_score_bg.node.opacity = 0;
    //     this._sp_score_bg.node.runAction(cc.sequence(cc.delayTime(del_time), cc.fadeIn(0.1), cc.moveBy(0.5, 0, 20), cc.delayTime(1.0), cc.fadeOut(0.1))); 
    // }

}
