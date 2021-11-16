import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventListener from "../../common/utility/UEventListener";
import UHandler from "../../common/utility/UHandler";
import VZJH_hy from "./VZJH_hy";
import VZJHComparePlayer_hy from "./VZJHComparePlayer_hy";
import AppGame from "../../public/base/AppGame";
import { UIZJHCompare } from "./UZJHClass_hy";
import USpriteFrames from "../../common/base/USpriteFrames";
import UStringHelper from "../../common/utility/UStringHelper";

const { ccclass, property } = cc._decorator;

/**
 * 创建:sp
 * 作用:pk动画的控制
 */
@ccclass
export default class VZJHPKAction_hy extends cc.Component {
    /**比牌效果的节点 */
    private _vsNode: cc.Node;
    /**选择比牌的节点 */
    private _bipaiNode: cc.Node;
    /**
     * 看牌
     */
    private _seatPai: { [key: number]: Array<cc.Node> };
    /**
     * 扎金花
     */
    private _zjh: VZJH_hy;
    /**左边的玩家 */
    private _vsLeft: VZJHComparePlayer_hy;
    /**右边的玩家 */
    private _vsRight: VZJHComparePlayer_hy;
    /**比较的动画 */
    private _vsanim: sp.Skeleton;

    private _leftOri: cc.Node;
    private _rightOri: cc.Node;
    private _leftPaiOri: cc.Node;
    private _rightPaiOri: cc.Node;

    private _leftStart: cc.Vec2;
    private _rightStart: cc.Vec2;
    private _leftPaiStart: cc.Vec2;
    private _rightPaiStart: cc.Vec2;

    private _leftWin: boolean;
    private _res: USpriteFrames;
    private _leftSeat: number;
    private _rightSeat: number;
    /**是否已经点击 */
    init(zjh: VZJH_hy, vs: cc.Node, bipai: cc.Node, res: USpriteFrames) {
        this._zjh = zjh;
        this._vsNode = vs;
        this._bipaiNode = bipai;
        this._seatPai = {};
        for (let i = 2; i < 6; i++) {

            this._seatPai[i - 1] = new Array<cc.Node>();
            let pk1 = UNodeHelper.find(bipai, "gf_poker_" + i + "_" + 1);
            let pk2 = UNodeHelper.find(bipai, "gf_poker_" + i + "_" + 2);
            let pk3 = UNodeHelper.find(bipai, "gf_poker_" + i + "_" + 3);
            let fx1 = UNodeHelper.find(bipai, "bipai_" + i);

            this._seatPai[i - 1].push(pk1);
            this._seatPai[i - 1].push(pk2);
            this._seatPai[i - 1].push(pk3);
            this._seatPai[i - 1].push(fx1);

            UEventListener.get(fx1).onClick = new UHandler(this.compare, this, i - 1);
        }
        let vs_left = UNodeHelper.find(vs, "vs_left");
        let vs_leftPai = UNodeHelper.find(vs, "vs_leftpai");
        this._vsLeft = new VZJHComparePlayer_hy(vs_left, vs_leftPai, res, true);
        let vs_rightPai = UNodeHelper.find(vs, "vs_rightpai");
        let vs_right = UNodeHelper.find(vs, "vs_right");
        this._vsRight = new VZJHComparePlayer_hy(vs_right, vs_rightPai, res, false);

        this._vsanim = UNodeHelper.getComponent(vs, "vs_anim", sp.Skeleton);
        this._vsanim.node.active = false;

        this._leftOri = UNodeHelper.find(vs, "leftOri");
        this._rightOri = UNodeHelper.find(vs, "rightOri");

        this._leftPaiOri = UNodeHelper.find(vs, "leftpaiOri");
        this._rightPaiOri = UNodeHelper.find(vs, "rightpaiOri");


        let bg = UNodeHelper.find(vs, "vsbg");
        UEventListener.get(bg).onClick = null;
        let bg2 = UNodeHelper.find(bipai, "bg");
        UEventListener.get(bg2).onClick = new UHandler(this.hideCompareUI, this);

        this._vsLeft.setNodeactive(false);
        this._vsRight.setNodeactive(false);

        /**播放胜利事件 */
        this._vsanim.setEventListener(() => {
            this.playwin();
        });
        /**播放完成事件 */
        this._vsanim.setCompleteListener(() => {
            this.scheduleOnce(this.playover, 0.3);
        });

    }

    battleOver(): void {
        this.hideCompareUI();
        this._vsLeft.reset();
        this._vsRight.reset();
    }
    /**显示选择compare界面 */
    selectCompare(compare: Array<number>): void {
        this.hideCompareUI();
        this._bipaiNode.active = true;
        compare.forEach(element => {
            let seat = this._seatPai[element];
            seat.forEach(el => {
                el.active = true;
            });
        });
    }
    /**播放pk动画 */
    playPkAction(left: cc.Vec2, right: cc.Vec2, paiLeft: cc.Vec2, paiRight: cc.Vec2, data: UIZJHCompare): void {
        this.hideCompareUI();
        this._leftSeat = data.leftSeatId;
        this._rightSeat = data.rightSeatId;

        this._leftStart = this._vsNode.convertToNodeSpaceAR(left);
        this._rightStart = this._vsNode.convertToNodeSpaceAR(right);

        this._leftPaiStart = this._vsNode.convertToNodeSpaceAR(paiLeft);
        this._rightPaiStart = this._vsNode.convertToNodeSpaceAR(paiRight);

        this._vsNode.active = true;
        this._leftWin = data.winseat == data.leftSeatId;

        this._vsLeft.bind(data.leftName, data.leftHeadId, data.leftGold,data.leftvipLv,data.leftheadBoxId,data.leftHeadUrl);
        // this._vsLeft.bindpai(data.leftPai);
        this._vsRight.bind(data.rightName, data.rightHeadId, data.rightGold,data.rightvipLv,data.rightheadBoxId,data.rightHeadUrl);
        // this._vsRight.bindpai(data.rightPai);
        if(this._leftWin){
            this.scheduleOnce(() => {
                this._vsanim.node.active = true;
                this._vsanim.setAnimation(0, "red_win", false);
            }, 0.6);
        }else{
            this.scheduleOnce(() => {
                this._vsanim.node.active = true;
                this._vsanim.setAnimation(0, "blue_win", false);
            }, 0.6);
        }


        this.playRoleAction(this._vsLeft, this._leftStart, cc.v2(-400,15), this._leftPaiStart, this._leftPaiOri.position);
        this.playRoleAction(this._vsRight, this._rightStart, cc.v2(400,-25), this._rightPaiStart, this._rightPaiOri.position);
        // this.scheduleOnce(() => {
        //     this._vsanim.node.active = true;
        //     this._vsanim.setAnimation(0, "animation", false);
        // }, 0.6);
    }
    private playover(): void {

        this._vsanim.node.active = false;
        this._vsLeft.hidewin();
        this._vsRight.hidewin();

        let ac5 = cc.moveTo(0.5, this._leftPaiStart);
        this._vsLeft.pai.runAction(cc.sequence(ac5, cc.callFunc(() => {
            this._vsLeft.setPaiActive(false);
        }, this)));

        let ac7 = cc.moveTo(0.5, this._rightPaiStart);

        this._vsRight.pai.runAction(cc.sequence(ac7, cc.callFunc(() => {
            this._vsRight.setPaiActive(false);
        }, this)));


        let ac = cc.moveTo(0.5, this._leftStart);
        this._vsLeft.node.runAction(cc.sequence(ac, cc.callFunc(() => {

            this._vsLeft.setNodeactive(false);

        }, this)));

        let ac3 = cc.moveTo(0.5, this._rightStart);
        this._vsRight.node.runAction(cc.sequence(ac3, cc.callFunc(() => {
            this._vsRight.setNodeactive(false);
            this._zjh.play_vs_finised = true;
            this._vsNode.active = false;
            this._zjh.pkActionOver(this._leftSeat, this._rightSeat);
        }, this)));



    }
    /**
     * 播放赢的效果
     */
    private playwin(): void {
        let win = this._leftWin ? this._vsLeft : this._vsRight;
        let lose = !this._leftWin ? this._vsLeft : this._vsRight;
        win.showwin();
        lose.showlose();
        this._zjh["_music"].playhit();
    }
    /**播放角色移动画面 */
    private playRoleAction(comp: VZJHComparePlayer_hy, start: cc.Vec2, end: cc.Vec2, paiStart: cc.Vec2, paiEnd: cc.Vec2): void {
        comp.setNodeactive(true);
        comp.node.setPosition(start);
        comp.node.runAction(cc.moveTo(0.5, end));

        comp.pai.setPosition(paiStart);
        comp.pai.runAction(cc.moveTo(0.5, paiEnd));
    }
    /**选择比牌 */
    private compare(idx: number): void {
        AppGame.ins.fzjhModel.requestComparePoker(idx);
        this.hideCompareUI();
    }
    hideCompareUI(): void {
        this._bipaiNode.active = false;
        for (const key in this._seatPai) {
            if (this._seatPai.hasOwnProperty(key)) {
                let element = this._seatPai[key];
                element.forEach(el => {
                    el.active = false;
                });
            }
        }
    }
}
