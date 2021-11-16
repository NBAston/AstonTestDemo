import UNodeHelper from "../../common/utility/UNodeHelper";
import { EBattlePlayerPaiState, UIZJHPoker } from "./UZJHClass";
import USpriteFrames from "../../common/base/USpriteFrames";
import UHandler from "../../common/utility/UHandler";
import VZJHFanPaiEffect from "./VZJHFanPaiEffect";
import VPokerAnimation from "./VZJHPokerAnimation";
import MZJH, { ZJH_SELF_SEAT } from "./MZJH";
import UDebug from "../../common/utility/UDebug";
import AppGame from "../../public/base/AppGame";


/**
 * 创建:sq
 * 作用:展示翻牌效果(加了这个多了 30-40个drawcall 如果低端机性能有问题 那么再找美术做动画)
 */
export default class VZJHPaiAction {

    /**扑克牌1 */
    public _poker1: cc.Sprite;
    /**扑克牌2 */
    public _poker2: cc.Sprite;
    /**扑克牌3 */
    public _poker3: cc.Sprite;
    /**
     * 扑克牌节点
     */
    public _pokerRoot: cc.Node;
    /**牌型动画 */
    public _paixingAnim: sp.Skeleton;

    private _fanpaiAnim: Array<sp.Skeleton>;
    /**看牌 */
    private _seePaiAction: cc.Animation;

    private _fanpaiNode: cc.Node;
    /**
     * 是否在运行
     */
    private _run: boolean;
    /**资源 */
    private _res: USpriteFrames;
    /**扑克牌的数据 */
    private _poker: UIZJHPoker;
    private _pokerPosX: Array<cc.Vec2>;
    private _oriScale: number;
    public _fapaiAct1: VPokerAnimation;
    public _fapaiAct2: VPokerAnimation;
    public _fapaiAct3: VPokerAnimation;
    private _animation: string;
    private _ori: cc.Vec2;
    private _playQipaiAction: boolean;
    private _fanDelay: boolean;
    /**跑 */
    get run(): boolean {
        return this._run;
    }

    constructor(seatId: number, root: cc.Node, fanpan: cc.Node, paixing: cc.Node, res: USpriteFrames) {
        this._animation = "blue1";
        this._fanpaiAnim = [];
        this._oriScale = seatId == ZJH_SELF_SEAT ? 0.67 : 1;
        this._playQipaiAction = seatId != ZJH_SELF_SEAT;
        this._pokerRoot = root;
        this._res = res;
        this._fanDelay = seatId == ZJH_SELF_SEAT;
        this._poker1 = UNodeHelper.getComponent(this._pokerRoot, "gf_poker1", cc.Sprite);
        this._poker2 = UNodeHelper.getComponent(this._pokerRoot, "gf_poker2", cc.Sprite);
        this._poker3 = UNodeHelper.getComponent(this._pokerRoot, "gf_poker3", cc.Sprite);
        this._pokerPosX = new Array<cc.Vec2>();
        this._pokerPosX.push(new cc.Vec2(this._poker1.node.x, this._poker1.node.y));
        this._pokerPosX.push(new cc.Vec2(this._poker2.node.x, this._poker2.node.y));
        this._pokerPosX.push(new cc.Vec2(this._poker3.node.x, this._poker3.node.y));
        this._ori = new cc.Vec2(this._pokerRoot.x, this._pokerRoot.y);
        this._paixingAnim = UNodeHelper.getComponent(paixing, "paixing", sp.Skeleton);
        let len = fanpan.childrenCount;
        this._fanpaiNode = fanpan;
        for (let i = 0; i < len; i++) {
            const element = fanpan.children[i];
            let ani = element.getComponent(sp.Skeleton);
            if (ani) {
                this._fanpaiAnim.push(ani);
            }
        }
        this.showback();
        this._fapaiAct1 = this._poker1.getComponent(VPokerAnimation);
        this._fapaiAct2 = this._poker2.getComponent(VPokerAnimation);
        this._fapaiAct3 = this._poker3.getComponent(VPokerAnimation);
        this._fapaiAct1.init();
        this._fapaiAct2.init();
        this._fapaiAct3.init();

        this._seePaiAction = this._pokerRoot.getComponent(cc.Animation);
        this.showkanpai(false);
    }
    resetTransform(): void {
        this.showkanpai(false);
        this._pokerRoot.setPosition(this._ori);
        this._pokerRoot.opacity = 255;
        this._poker1.node.setPosition(this._pokerPosX[0]);
        this._poker2.node.setPosition(this._pokerPosX[1]);
        this._poker3.node.setPosition(this._pokerPosX[2]);

        this._poker1.node.setRotation(0);
        this._poker2.node.setRotation(0);
        this._poker3.node.setRotation(0);
    }
    showback(): void {
        this._poker1.spriteFrame = this.getRes("poker_b1");
        this._poker2.spriteFrame = this.getRes("poker_b1");
        this._poker3.spriteFrame = this.getRes("poker_b1");


    }
    /**还原普通状态 */
    normalState(): void {
        this._fapaiAct1.setState(1);
        this._fapaiAct2.setState(1);
        this._fapaiAct3.setState(1);
        this.resetTransform();
    }
    grayState(): void {
        this._fapaiAct1.setState(0);
        this._fapaiAct2.setState(0);
        this._fapaiAct3.setState(0);
    }
    /**弃牌时候牌变灰 */
    playqipai(end: cc.Vec2, handler?: UHandler): void {
        this.grayState();
        this.resetTransform();
        if (this._playQipaiAction) {
            let action = cc.fadeTo(0.5, 50);
            this._pokerRoot.runAction(cc.sequence(action, cc.callFunc(() => {
                this._pokerRoot.setPosition(this._ori);
                this._pokerRoot.opacity = 255;
                if (handler) handler.run();
            }, this)));
        } else {
        }
    }
    /**播放看片 */
    playSeePai(): void {
        if (this._seePaiAction) {
            this.showkanpai(true);
            this._seePaiAction.play();
        }
    }
    /**
     * 发牌
     * @param seatId 
     */
    playfapai(start: cc.Vec2, handler?: UHandler): void {
        this.resetTransform();
        start = this._pokerRoot.convertToNodeSpaceAR(start);
        this._fapaiAct1.playFapai(start, this._pokerPosX[0], this._oriScale, 0);
        this._fapaiAct2.playFapai(start, this._pokerPosX[1], this._oriScale, 0.05);
        this._fapaiAct3.playFapai(start, this._pokerPosX[2], this._oriScale, 0.1, handler);
    }
    /**
     * 播放翻牌动画
     * @param poker 
     */
    playFanPai(poker: UIZJHPoker, withAnimation: boolean, self: boolean, hander?: UHandler): void {
        this._poker = poker;
        this.resetTransform();
        if (withAnimation) {
            this._pokerRoot.active = false;
            this._fanpaiNode.active = true;
            let len = this._fanpaiAnim.length;
            for (let i = 0; i < len; i++) {
                const element = this._fanpaiAnim[i];
                element.setAnimation(0, this._animation, false);
                if (i == 0) {
                    element.setCompleteListener(() => {
                        this._fanpaiNode.active = false;
                        this._pokerRoot.active = true;
                        this._poker1.spriteFrame = this.getRes(this._poker.pokerIcons[0]);
                        this._poker2.spriteFrame = this.getRes(this._poker.pokerIcons[1]);
                        this._poker3.spriteFrame = this.getRes(this._poker.pokerIcons[2]);

                        this.playPokerAction(this._poker1.node);
                        this.playPokerAction(this._poker2.node);
                        this.playPokerAction(this._poker3.node, UHandler.create(() => {
                            if (self) {
                                this.playpaiPaiover(true);
                            } else {
                                this.playpaiPaiover(false);
                            }
                            if (hander) hander.run();
                        }, this));
                    });
                }
            }

        } else {

            this._poker1.spriteFrame = this.getRes(this._poker.pokerIcons[0]);
            this._poker2.spriteFrame = this.getRes(this._poker.pokerIcons[1]);
            this._poker3.spriteFrame = this.getRes(this._poker.pokerIcons[2]);
            if (self) {
                this.playpaiPaiover(true);
            } else {
                this.playpaiPaiover(false);
            }
            if (hander) hander.run();
        }
    }

    free(): void {
        this._pokerRoot.stopAllActions();
        this.resetTransform();
        this._fapaiAct1.free();
        this._fapaiAct2.free();
        this._fapaiAct3.free();
    }
    private showkanpai(value: boolean) {
        if (this._seePaiAction) {
            this._seePaiAction.enabled = value;
            this._seePaiAction.setCurrentTime(0);
        }
    }
    private getRes(name: string): cc.SpriteFrame {
        return this._res.getFrames(name);
    }
    /**翻牌动作播放完毕 */
    public playpaiPaiover(self: boolean): void {
        this._paixingAnim.node.parent.active = true;
        this._paixingAnim.node.active = true;
        this._paixingAnim.paused = true;
        if (self) {
            this._paixingAnim.setAnimation(0, "wanjia_" + this._poker.pokerType, false);
        } else {
            this._paixingAnim.setAnimation(0, this._poker.pokerType, false);
        }

        this._paixingAnim.paused = false;
    }
    private playPokerAction(poker: cc.Node, handler?: UHandler): void {
        poker.setScale(1.2, 1.1);
        let action = cc.sequence(cc.scaleTo(0.2, 1), cc.callFunc(() => {
            if (handler) handler.run();
        }, this));
        poker.runAction(action);
    }
}

