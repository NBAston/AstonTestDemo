/**
 * 创建： 朱武
 * 作用： 百人牛牛 下注区域控制
 */

import UNodeHelper from "../../../common/utility/UNodeHelper";

const { ccclass, property } = cc._decorator;
const GoldRate = 100;  //
export default class VBrnnRect {

    private _node_root: cc.Node = null;
    private _lab_total_score: cc.Label = null;
    public _lab_self_score: cc.Label = null;
    private _node_win_bg: cc.Node = null;
    private _lab_gold_total_Desc: cc.Node = null;

    constructor(root: cc.Node , lab_total:cc.Label , lab_self:cc.Label, desc_bg:cc.Node) {
        this._node_root = root;
        this._lab_total_score = lab_total;
        this._lab_self_score = lab_self;
        this._lab_gold_total_Desc = desc_bg;
        this._node_root.on(cc.Node.EventType.TOUCH_START, this.onTouchStartHandler, this);
        this._node_root.on(cc.Node.EventType.TOUCH_END, this.onTouchEndHandler, this);
        this._node_root.on(cc.Node.EventType.TOUCH_CANCEL, this.onTouchEndHandler, this);
        this.init();
    }

    onTouchStartHandler(){
        this._node_root.getChildByName("toushClickBg").active = true;
    }

    onTouchEndHandler(){
        this._node_root.getChildByName("toushClickBg").active = false;
    }

    init() {
        this._node_win_bg = UNodeHelper.find(this._node_root, 'sp_win');
    }

    get position() {

        return this._node_root.position;
    }

    clear() {
        this._node_root.stopAllActions();
        if(this._lab_total_score != null){
            this._lab_total_score.string = '0';
        }
        if(this._lab_self_score != null){
            this._lab_self_score.string = '0';
        }
    }

    winBlink() {
        this._node_root.getChildByName("toushClickBg").active = false;
        this._node_root.stopAllActions();
        this._node_root.runAction(cc.sequence(
            // cc.delayTime(4.5),
            cc.callFunc(()=>{
                this._node_win_bg.active = true;
            }),
            cc.delayTime(1.5),
            cc.callFunc(()=>{
                this._node_win_bg.active = false;
            })
        ));
    }
    recover() {
        this._node_root.getChildByName("sp_win").active = false;
        this._node_root.getChildByName("toushClickBg").active = false;
        this._node_root.stopAllActions();
    }

    setSelfGold(gold: number) {
        if (gold > 0) {
            this._lab_self_score.string = (gold/GoldRate).toString();
        }else {
            this._lab_self_score.string = "0";
        }
    }

    setTotalGold(gold: number) {
        this._lab_total_score.string = (gold/GoldRate).toString();
    }
}