import USpriteFrames from "../../common/base/USpriteFrames";
import { UISGPoker } from "./USGHelper";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UHandler from "../../common/utility/UHandler";
import VSGPokerAnimation from "./VSGPokerAnimation";
import { SG_SELF_SEAT } from "./MSGModel";
import AppGame from "../../public/base/AppGame";
import { ECommonUI } from "../../common/base/UAllenum";


/**
 * 创建:sq  
 * 修改:dz
 * 作用:展示翻牌效果(加了这个多了 30-40个drawcall 如果低端机性能有问题 那么再找美术做动画)
 */
export default class VSGPaiAction {

    /**扑克牌1 */
    private _poker1: cc.Node;
    /**扑克牌2 */
    private _poker2: cc.Node;
    /**扑克牌3 */
    private _poker3: cc.Node;
    /**
     * 扑克牌节点
     */
    private _pokerRoot: cc.Node;
    /**牌型动画 */
    private _paixingAnim: sp.Skeleton;

    private _fanpaiAnim: Array<sp.Skeleton> = new Array<sp.Skeleton>();

    /**看牌 */
    private _seePaiAction: cc.Animation;
    /**
     * 是否在运行
     */
    private _run: boolean;
    /**资源 */
    private _res: USpriteFrames;
    /**扑克牌的数据 */
    private _poker: UISGPoker;

    private _pokerPosX: Array<cc.Vec2>;
    private _oriScale: number;
    private _fapaiAct1: VSGPokerAnimation;
    private _fapaiAct2: VSGPokerAnimation;
    private _fapaiAct3: VSGPokerAnimation;
    private _animation: string;
    private _seatId: number = 0;
    private _ori: cc.Vec2;

    /**跑 */
    get run(): boolean {
        return this._run;
    }

    constructor(seatId: number, root: cc.Node, paixing: cc.Node, res: USpriteFrames) {
        this._oriScale = seatId == SG_SELF_SEAT ? 0.67 : 1;
        // this._playQipaiAction = seatId != SG_SELF_SEAT;
        this._seatId = seatId;
        this._pokerRoot = root;
        this._res = res;
        this._poker1 = UNodeHelper.find(this._pokerRoot, "gf_poker1");
        this._poker2 = UNodeHelper.find(this._pokerRoot, "gf_poker2");
        this._poker3 = UNodeHelper.find(this._pokerRoot, "gf_poker3");
        this._pokerRoot.active = false;
        // this._poker1.setScale(0, 0);
        // this._poker2.setScale(0, 0);
        // this._poker3.setScale(0, 0);

        this._pokerPosX = new Array<cc.Vec2>();
        this._pokerPosX.push(new cc.Vec2(this._poker1.x, this._poker1.y));
        this._pokerPosX.push(new cc.Vec2(this._poker2.x, this._poker2.y));
        this._pokerPosX.push(new cc.Vec2(this._poker3.x, this._poker3.y));
        this._ori = new cc.Vec2(this._pokerRoot.x, this._pokerRoot.y);
        this._paixingAnim = paixing.getComponent(sp.Skeleton);
        let len = root.childrenCount;
        for (let i = 0; i < len; i++) {
            const element = root.children[i];
            let ani = element.getComponent(sp.Skeleton);
            if (ani) {
                this._fanpaiAnim.push(ani);
            }
        }
        this.showback();
        this._fapaiAct1 = this._poker1.getComponent(VSGPokerAnimation);
        this._fapaiAct2 = this._poker2.getComponent(VSGPokerAnimation);
        this._fapaiAct3 = this._poker3.getComponent(VSGPokerAnimation);
    }

    private resetTransform(): void {
        this._pokerRoot.setPosition(this._ori);
        this._pokerRoot.opacity = 255;
        this._poker1.setPosition(this._pokerPosX[0]);
        this._poker2.setPosition(this._pokerPosX[1]);
        this._poker3.setPosition(this._pokerPosX[2]);

        this._poker1.angle = 0;
        this._poker2.angle = 0;
        this._poker3.angle = 0;
    }
    showback(): void {
        this._poker1.getComponent(sp.Skeleton).animation = "";
        this._poker2.getComponent(sp.Skeleton).animation = "";
        this._poker3.getComponent(sp.Skeleton).animation = "";
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

    /**播放看片 */
    playSeePai(): void {
        // if (this._seePaiAction) {
        //     this.showkanpai(true);
        //     this._seePaiAction.play();
        // }
    }
    /**
     * 发牌
     * @param seatId 
     */
    playfapai(start: cc.Vec2, handler?: UHandler): void {
        this.resetTransform();
        start = this._pokerRoot.convertToNodeSpaceAR(start);
        let endScale = this._seatId ? 0.6 : 1;
        this._fapaiAct1.playFapai(start, this._pokerPosX[0], this._oriScale, endScale, 0);
        this._fapaiAct2.playFapai(start, this._pokerPosX[1], this._oriScale, endScale, 0.1);
        this._fapaiAct3.playFapai(start, this._pokerPosX[2], this._oriScale, endScale, 0.2, handler);
    }
    /**
     * 播放翻牌动画
     * @param poker 
     */
    playFanPai(poker: UISGPoker, withAnimation: boolean, hander?: UHandler): void {
        this._poker = poker;

        this.resetTransform();
        // if (withAnimation) {
        let len = this._seatId == 0 ? 1 : this._fanpaiAnim.length;
        if (this._seatId == 0) {
            AppGame.ins.closeUI(ECommonUI.UI_GAME_MIPAI);
        };

        let endScale = this._seatId ? 0.6 : 1;
        this._poker1.setScale(endScale, endScale);
        this._poker2.setScale(endScale, endScale);
        this._poker3.setScale(endScale, endScale);

        for (let i = 0; i < len; i++) {
            let index = len == 1 ? 2 : i;
            const element = this._fanpaiAnim[index];

            let aniName = this._poker.pokerIcons[index];

            element.setAnimation(0, aniName, false);
            if (i == 0) {
                element.setCompleteListener(() => {
                    this.playPokerAction(this._poker1);
                    this.playPokerAction(this._poker2);
                    this.playPokerAction(this._poker3, UHandler.create(() => {
                        this.playpaiPaiover();
                        if (hander) hander.run();
                    }, this));

                });
            }
        }
    };

    /**
     * 播放翻牌动画2(玩家显示两张牌)
     * @param poker 
     */
    playFanPai2(poker: [], withAnimation: boolean, hander?: UHandler): void {
        for (let i = 0; i < 2; i++) {
            const element = this._fanpaiAnim[i];
            if (poker[i] != 0) {
                let aniName = "poker_" + poker[i]; //this._poker.pokerIcons[i];
                element.setCompleteListener(() => { });
                element.setAnimation(0, aniName, false);
                if (i == 1) {
                    // element.setCompleteListener(() => {
                    // element.setCompleteListener(() => { });
                    if (hander) hander.run();
                    // });
                };
            };
        };
    };


    free(): void {
        this._pokerRoot.stopAllActions();
        this.resetTransform();
        this._fapaiAct1.free();
        this._fapaiAct2.free();
        this._fapaiAct3.free();
    }


    /**翻牌动作播放完毕 */
    private playpaiPaiover(): void {
        this._poker1.setPosition(this._pokerPosX[0]);
        this._poker2.setPosition(this._pokerPosX[1]);
        this._poker3.setPosition(this._pokerPosX[2]);

        this._paixingAnim.node.active = true;
        this._paixingAnim.setAnimation(0, this._poker.pokerType, false);
    }
    private playPokerAction(poker: cc.Node, handler?: UHandler): void {
        // poker.setScale(1.2, 1.2);
        // let action = cc.sequence(cc.scaleTo(0.2, 1), cc.callFunc(() => {
        //     if (handler) handler.run();
        // }, this));
        // poker.runAction(action);
        if (handler) handler.run();

    }
}

