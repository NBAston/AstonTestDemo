import UNodeHelper from "../../common/utility/UNodeHelper"

/**
 * 奔驰宝马下注区域管理
 */
const GoldRate = 100;
export default class BcbmRect  {
    
    _root_node: cc.Node = null;
    _node_win: cc.Node = null;
    _lab_total: cc.Label = null;
    _node_self_bg: cc.Node = null;
    _lab_self: cc.Label = null;  // 自己的下注
    _spine_light_back: sp.Skeleton = null;  

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
        this._node_win.active = false;
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
        this._lab_total.string = (jetton/GoldRate).toString();
    }

    public getSetSelfJetton(){
        return Number(this._lab_total.string);
    }

    setTotalJetton(jetton: number) {
        this._lab_self.string = (jetton/GoldRate).toString();
    }

    blink() {
        this._node_win.active = true
        this._node_win.stopAllActions();
        this._node_win.runAction(cc.repeat(cc.sequence(cc.fadeTo(0.5, 0), cc.fadeTo(0.5, 255)), 5));
    }
    recover() {
        this._node_win.stopAllActions();
        this._node_win.active = false
    }
}
