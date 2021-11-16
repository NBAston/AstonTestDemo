
import UDebug from "../../common/utility/UDebug";
import AppGame from "../../public/base/AppGame";
import MBJ, { BJ_SCALE } from "./MBJ";

const { ccclass, property } = cc._decorator;
/**
 * 创建:gss
 * 作用:BlackJack场景控制 效果等
 */
@ccclass
export default class VBJBattle extends cc.Component {


    // onLoad () {}
    /**下注 空节点 界面 */
    @property(cc.Node)
    betArea: cc.Node = null;


    /**最小下注数值 */
    private _minBet: number = 100;
    /**最大下注数值 */
    private _maxBet: number = 100;
    /**按钮 显示下注滑动界面 */

    @property(cc.Button)
    private chip_addBtn: cc.Button = null;  //下注额确定


    /**滑动填充的精灵 */
    @property(cc.Sprite)
    private bet2: cc.Sprite = null;
    /**滑动选择的下注金额 */
    private myCurBet: number;
    /**已选下注金额提示界面 */
    @property(cc.Node)
    private bgBet: cc.Node = null;
    /**显示的下注金额数值 */
    @property(cc.Label)
    private betNum: cc.Label = null;
    @property(sp.Skeleton)
    private chipAni: sp.Skeleton = null;

    @property(cc.Prefab)
    private chipPrefab: cc.Prefab = null;

    @property(cc.Node)
    private chipScrollView: cc.Node = null;

    @property(cc.Node)
    private bgbetfull: cc.Node = null;



    onEnable() {
        AppGame.ins.bjModel.on(MBJ.GET_SCORE, this.getscore, this)
        this.chip_addBtn.node.active = false
        this._minBet = AppGame.ins.bjModel.getCurDiZhu / BJ_SCALE  //放大

        //this._minBet = 10 //ces  s测试数据

        this.chipScrollView.removeAllChildren()
        AppGame.ins.bjModel.emit(MBJ.PUSH_SCORE)


    }

    onDisable() {
        AppGame.ins.bjModel.off(MBJ.GET_SCORE, this.getscore, this)
    }

    private getscore(score: number) {
        let tempscore = score / BJ_SCALE
        this._maxBet = this._minBet * 20 < tempscore ? this._minBet * 20 : tempscore
        let tempmin = this._minBet * BJ_SCALE
        this.betNum.string = tempmin.toString()
        this.bgBet.setPosition(this.bgBet.position.x, - this.bet2.node.height / 2 + 20)

        this.loadPrefab()
        this.testBetArea();

        this.chipAni.setCompleteListener(() => { this.chipAni.node.active = false })
        this.myCurBet = this._minBet;
    }
    start() {
        this.bgbetfull.active = false
        this.betNum.node.color = new cc.Color(54, 33, 12)
    }

    /**
     * 点击 "下注" 执行的逻辑 
     * 注册 相应的滑动选择事件
    */
    testBetArea(): void {


        this.bet2.node.on(cc.Node.EventType.TOUCH_START, (event) => {
            // this.bet2.fillRange = 0;
            let pos = event.getLocation();
            this.setBet(pos);
        }, this);

        this.bet2.node.on(cc.Node.EventType.TOUCH_MOVE, (event) => {

            let pos = event.getLocation();
            this.setBet(pos);

            // cc.log("bet："+ Math.floor(this.maxBet*this.bet2.fillRange));
        }, this);

        this.bet2.node.on(cc.Node.EventType.TOUCH_END, (event) => {
        }, this);
    }
    /**
     * 设置下注金额
     * @param pos 滑动触碰获得 鼠标坐标
     */
    setBet(pos: cc.Vec2): void {
        let localPos = this.betArea.convertToNodeSpaceAR(pos);
        var offest = (localPos.y + (this.bet2.node.height / 2)) / (this.bet2.node.height);
        if (offest > 1) offest = 1;
        if (offest < 0) offest = 0;

        this.bet2.fillRange = offest;

        this.myCurBet = Math.floor((this._maxBet - this._minBet) * this.bet2.fillRange) + this._minBet;

        if (this.myCurBet <= 0) {
            this.myCurBet = this._minBet;
        }
        let tempmin = this.myCurBet * BJ_SCALE;

        let tempnum = Math.floor(tempmin);
        this.myCurBet = tempnum / BJ_SCALE;
        this.betNum.string = tempnum.toString();

        //let localBetPos = this.bet2.node.convertToNodeSpaceAR(this.bet2.node)
        //54  33  12  正常色号   
        //255 255 255 满色号
        if (offest > 0.05) {
            let temp = offest * this.bet2.node.height - this.bet2.node.height / 2
            this.bgBet.setPosition(this.bgBet.x, temp);
            this.chipAni.scheduleOnce(() => {
                this.chipAni.unscheduleAllCallbacks()
                this.chipAni.setAnimation(0, "chip", false)
            }, 0.2)
            this.chipAni.node.active = true
            while (offest / 0.05 > this.chipScrollView.childrenCount) {
                this.loadPrefab()
            }
            while (offest / 0.05 < this.chipScrollView.childrenCount) {
                this.delOnePrefab()
            }
        }
        if (this.myCurBet >= this._maxBet) {
            this.bgbetfull.active = true
            this.betNum.node.color = new cc.Color(255, 255, 255);
        }
        else {
            this.bgbetfull.active = false
            this.betNum.node.color = new cc.Color(54, 33, 12)
        }
    }

    /**其他下注额确定 */
    onclickAddotherOk() {
        this.node.parent.active = false
        AppGame.ins.bjModel.requestaddScore(this.myCurBet) //滑动的数字
    }

    //实例化预制件，设置父节点
    loadPrefab() {
        let node = cc.instantiate(this.chipPrefab);
        //当父节点不存在时，使用当前组件为父节点
        node.parent = this.chipScrollView;
    }
    delOnePrefab() {
        if (this.chipScrollView.childrenCount == 1) return
        let item = this.chipScrollView.getChildByName(this.chipPrefab.name)
        if (item) this.chipScrollView.removeChild(item)
    }
}
