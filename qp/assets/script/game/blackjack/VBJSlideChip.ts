
const { ccclass, property } = cc._decorator;

@ccclass
export default class VBJSlideChip extends cc.Component {

    @property(cc.Label)
    chipNum: cc.Label = null;

    @property(cc.Button)
    chipButton: cc.Label = null;

    @property(cc.Sprite)
    chipBg: cc.Label = null;


    onLoad() { }

    start() {
    }

    // update (dt) {}
}
