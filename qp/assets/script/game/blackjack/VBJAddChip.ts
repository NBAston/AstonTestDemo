import UDebug from "../../common/utility/UDebug";
import AppGame from "../../public/base/AppGame";
import MBJ, { BJ_SCALE } from "./MBJ";


const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Button)
    btn_confirm: cc.Button = null;

    @property(cc.Sprite)
    progress: cc.Sprite = null;

    @property(cc.Slider)
    slider: cc.Slider = null;

    @property(cc.Label)
    gold: cc.Label = null;

    /**最小下注数值 */
    private _minBet: number = 100;
    /**最大下注数值 */
    private _maxBet: number = 100;

    onEnable() {
        AppGame.ins.bjModel.on(MBJ.GET_SCORE, this.getscore, this)
        this._minBet = AppGame.ins.bjModel.getCurDiZhu / BJ_SCALE  //放大
        AppGame.ins.bjModel.emit(MBJ.PUSH_SCORE);
        this.slider.progress = 0;
        this.progress.fillRange = 0;
        let a = this._maxBet - this._minBet;
        this.gold.string = parseInt(this._minBet * BJ_SCALE + this.slider.progress * (a * BJ_SCALE) + "") + "";
    }

    onDisable() {
        AppGame.ins.bjModel.off(MBJ.GET_SCORE, this.getscore, this)
    }

    onLoad() {
        this.slider.node.on("slide", this.chip_slider, this);
    }

    start() {

    }

    /**获取下注的最大值和最小值 */
    private getscore(score: number) {
        let tempscore = score / BJ_SCALE
        this._maxBet = this._minBet * 20 < tempscore ? this._minBet * 20 : tempscore
        let tempmin = this._minBet * BJ_SCALE
        this.gold.string = tempmin.toString()
        // this.bgBet.setPosition(this.bgBet.position.x, - this.bet2.node.height / 2+20 )

        // this.loadPrefab()
        // this.testBetArea();

        // this.chipAni.setCompleteListener(()=>{ this.chipAni.node.active =false})
        // this.myCurBet = this._minBet ;
    }

    /**滑动选择其他下注额 */
    private chip_slider(): void {
        this.progress.fillRange = this.slider.progress;
        let a = this._maxBet - this._minBet;
        this.gold.string = parseInt(this._minBet * BJ_SCALE + this.slider.progress * (a * BJ_SCALE) + "") + "";
    }

    /**其他下注额 */
    private bet(): void {
        AppGame.ins.bjModel.requestaddScore(parseInt(parseInt(this.gold.string) / BJ_SCALE + ""));
        this.node.active = false;
    }


    // update (dt) {}
}
