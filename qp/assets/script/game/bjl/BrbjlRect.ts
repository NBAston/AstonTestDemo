import UDebug from "../../common/utility/UDebug";
import UNodeHelper from "../../common/utility/UNodeHelper";

/**
 * 百人百家乐下注区域管理
 */
const GoldRate = 100;  //
export default class BrbjlRect {

    _root_node: cc.Node = null;
    _node_win: cc.Node = null;
    _lab_total: cc.Label = null;
    _node_self_bg: cc.Node = null;

    _lab_self: cc.Label = null;  // 自己的下注

    constructor(root_node: cc.Node  , lab_total: cc.Label , lab_self: cc.Label) {
        this._root_node = root_node;
        this._lab_total = lab_total;
        this._lab_self = lab_self;
        this.init();
    }

    clear() {
        this.setTotalJetton(0);
        this.setSelfJetton(0);
        this._node_win.stopAllActions();
        this._node_win.opacity = 0;
    }


    init() {
        this._node_win = UNodeHelper.find(this._root_node, 'sp_win');
        // this._lab_self = UNodeHelper.getComponent(this._root_node, 'lab_self_jetton', cc.Label);
        // this._lab_total = UNodeHelper.getComponent(this._root_node, 'lab_total_jetton', cc.Label);
        this._node_self_bg = UNodeHelper.find(this._root_node, 'sp_self_jetton_bg');

    }

    getPosition() {
        return this._root_node.position;
    }

    setSelfJetton(jetton: number) {
        this._lab_self.string = (jetton/GoldRate).toString();
        if((jetton/GoldRate)>=100000){
            this._lab_self.node.setScale(0.8);
            this._lab_total.node.setScale(0.8);
        } else {
            this._lab_self.node.setScale(1.0);
            this._lab_total.node.setScale(1.0);
        }
        /*if (jetton > 0) {
            this._lab_self.node.active = true;
            this._node_self_bg.active = true;

        } else {
            this._lab_self.node.active = false;
            this._node_self_bg.active = false;

        }*/
    }

    setTotalJetton(jetton: number) {
        // if (jetton == 0) 
        // {UDebug.Log('aaaa')}
        if((jetton/GoldRate)>=100000){
            this._lab_total.node.setScale(0.8);
            this._lab_self.node.setScale(0.8);
        } else {
            this._lab_total.node.setScale(1.0);
            this._lab_self.node.setScale(1.0);
        }
        this._lab_total.string = (jetton/GoldRate).toString();
    }


    blink() {
        this._node_win.runAction( cc.sequence(cc.delayTime(5) , cc.callFunc(()=>{ 
            this._node_win.stopAllActions();
            this._node_win.runAction(cc.repeat(cc.sequence(cc.fadeTo(0.5, 100), cc.fadeTo(0.5, 255)), 15));
        })));

    }


}
