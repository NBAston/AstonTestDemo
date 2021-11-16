import { threadId } from "worker_threads";
import USpriteFrames from "../../common/base/USpriteFrames";
import { FZJH, ZJH } from "../../common/cmd/proto";
import UDebug from "../../common/utility/UDebug";
import UPokerHelper from "../../common/utility/UPokerHelper";
import cfg_paixing from "../../config/cfg_paixing";
import AppGame from "../../public/base/AppGame";
import MZJH_hy from "../zjh_hy/MZJH_hy";
import MZJH from "./MZJH";
import VZJH from "./VZJH";
import VZJH2 from "./VZJH2";
import VZJHSeat from "./VZJHSeat";

const { ccclass, property } = cc._decorator;

@ccclass
export default class VCuoPai extends cc.Component {

    @property(cc.Node)
    touch_node: cc.Node = null;

    @property(sp.Skeleton)
    ani: sp.Skeleton = null;

    @property(sp.Skeleton)
    fanpaiAni: sp.Skeleton = null;

    @property(cc.Sprite)
    poker_1: cc.Sprite = null;

    @property(cc.Sprite)
    poker_2: cc.Sprite = null;

    @property(cc.Sprite)
    poker_3: cc.Sprite = null;

    @property(sp.Skeleton)
    number: sp.Skeleton = null;

    private cuoPai: boolean = false;
    private seen: boolean = false;
    private cbCardData: number[] = null;
    private cbCardType: number = 0;
    private wLookCardUser: any;
    private yiKanPai: boolean = false;

    onLoad() {

    }

    start() {

    }

    private touch_move(event): void {
        if (!this.seen) {
            if (event.getDeltaX() > 10 && event.getStartLocation().x < this.node.width / 2) {
                this.seen = true;
                this.cuoPai = true;
                
                this.ani.node.active = false;
                var spawn = cc.spawn(cc.moveTo(0.2, -30, -180), cc.rotateTo(0.2, 325));
                var spawn2 = cc.spawn(cc.moveTo(0.2, 28, -171), cc.rotateTo(0.2, 355));
                var spawn3 = cc.spawn(cc.moveTo(0.2, 30, -186), cc.rotateTo(0.2, 17));
                this.poker_1.node.runAction(spawn);
                this.poker_2.node.runAction(spawn2);
                this.poker_3.node.runAction(spawn3);
                this.touch_node.off(cc.Node.EventType.TOUCH_MOVE, this.touch_move, this);
                this.scheduleOnce(function () {
                    this.fanpaiAni.node.active = true;
                    this.fanpaiAni.setAnimation(0, "kaipai_" + cfg_paixing[this.cbCardType], false);
                    this.number.node.active = false;
                }, 0.2);
                if (AppGame.ins.currRoomKind == 1) {
                    this.scheduleOnce(function () {
                        this.yiKanPai = true;
                        AppGame.ins.fzjhModel.update_fanpai(this.wLookCardUser, this.cbCardData, this.cbCardType, 0);
                        this.node.active = false;
                    }, 1.5)
                } else {
                    this.scheduleOnce(function () {
                        this.yiKanPai = true;
                        AppGame.ins.zjhModel.update_fanpai(this.wLookCardUser, this.cbCardData, this.cbCardType, 0);
                        this.node.active = false;
                    }, 1.5)
                }
            } else if (event.getDeltaX() > 0 && event.getDeltaX() < 10) {
                var spawn4 = cc.rotateTo(0.2, 334);
                var spawn5 = cc.rotateTo(0.2, 346);
                var spawn6 = cc.rotateTo(0.2, 358);
                //  cc.spawn(cc.moveTo(0.2,-6,-184),cc.rotateTo(0.2,358));
                this.poker_1.node.runAction(spawn4);
                this.poker_2.node.runAction(spawn5);
                this.poker_3.node.runAction(spawn6);
            } else if (event.getDeltaX() < 0) {
                var spawn7 = cc.rotateTo(0.2, 350);
                var spawn8 = cc.rotateTo(0.2, 351);
                var spawn9 = cc.rotateTo(0.2, 353)
                //  cc.spawn(cc.moveTo(0.2,-6.-178),cc.rotateTo(0.2,353));
                this.poker_1.node.runAction(spawn7);
                this.poker_2.node.runAction(spawn8);
                this.poker_3.node.runAction(spawn9);
            }
        }
    }



    private showPaiXing(caller): void {

        this.poker_1.spriteFrame = this.node.getComponent(USpriteFrames).getFrames(UPokerHelper.getCardSpriteName(caller.cbCardData[0]));
        this.poker_2.spriteFrame = this.node.getComponent(USpriteFrames).getFrames(UPokerHelper.getCardSpriteName(caller.cbCardData[1]));
        this.poker_3.spriteFrame = this.node.getComponent(USpriteFrames).getFrames(UPokerHelper.getCardSpriteName(caller.cbCardData[2]));
        this.wLookCardUser = caller.wLookCardUser;
        this.cbCardData = caller.cbCardData;
        this.cbCardType = caller.cbCardType;
        this.scheduleOnce(function () {
            if (!this.cuoPai) {
                this.scheduleOnce(function () {
                    this.fanpaiAni.node.active = true;
                    this.fanpaiAni.setAnimation(0, "kaipai_" + cfg_paixing[this.cbCardType], false);
                    this.number.node.active = false;
                }, 0.5)
                this.ani.node.active = false;
                // this.touch_node.off(cc.Node.EventType.TOUCH_MOVE,this.touch_move,this);
                var spawn = cc.spawn(cc.moveTo(0.2, -30, -180), cc.rotateTo(0.2, 325));
                var spawn2 = cc.spawn(cc.moveTo(0.2, 28, -171), cc.rotateTo(0.2, 355));
                var spawn3 = cc.spawn(cc.moveTo(0.2, 30, -178), cc.rotateTo(0.2, 17));
                this.poker_1.node.runAction(spawn);
                this.poker_2.node.runAction(spawn2);
                this.poker_3.node.runAction(spawn3);
                this.scheduleOnce(function () {
                    if (AppGame.ins.currRoomKind == 1) {
                        this.yiKanPai = true;
                        AppGame.ins.fzjhModel.update_fanpai(caller.wLookCardUser, caller.cbCardData, caller.cbCardType, 0);
                    } else {
                        this.yiKanPai = true;
                        AppGame.ins.zjhModel.update_fanpai(caller.wLookCardUser, caller.cbCardData, caller.cbCardType, 0);
                    }
                    this.node.active = false;
                }, 3)
            }
        }, 5)
    }

    private gameEnd(): void {
        this.yiKanPai = false;
        this.seen = false;
        this.cuoPai = false;
        this.node.active = false;

    }

    private reStart(): void {
        this.yiKanPai = false;
        this.ani.node.active = true;
        this.ani.paused = true;
        this.ani.setAnimation(0, "zjh_kb", true);
        this.ani.paused = false;
        this.touch_node.on(cc.Node.EventType.TOUCH_MOVE, this.touch_move, this);
        this.poker_1.node.setPosition(-15, -176);
        this.poker_1.node.angle = 10;
        this.poker_2.node.setPosition(28, -171);
        this.poker_2.node.angle = 9;
        this.poker_3.node.setPosition(-6, -178);
        this.poker_3.node.angle = 7;
        this.cbCardData = [];
        this.cbCardType = 0;
        this.wLookCardUser = null;
        // this.number.string = "5";
        this.number.node.active = true;
        this.number.setAnimation(0, "timer", false);
        this.poker_1.spriteFrame = this.node.getComponent(USpriteFrames).getFrames("poker_b1");
        this.poker_2.spriteFrame = this.node.getComponent(USpriteFrames).getFrames("poker_b1");
        this.poker_3.spriteFrame = this.node.getComponent(USpriteFrames).getFrames("poker_b1");
        // this.countDown();
        if (AppGame.ins.currRoomKind == 1) {
            AppGame.ins.fzjhModel.requestSeepai();
        } else {
            AppGame.ins.zjhModel.requestSeepai();
        }
        this.fanpaiAni.node.active = false;

    }

    private resetPai(): void {
        this.poker_1.spriteFrame = this.node.getComponent(USpriteFrames).getFrames("poker_b1");
        this.poker_2.spriteFrame = this.node.getComponent(USpriteFrames).getFrames("poker_b1");
        this.poker_3.spriteFrame = this.node.getComponent(USpriteFrames).getFrames("poker_b1");
        this.seen = false;

        if (this.yiKanPai == false) {
            if (AppGame.ins.currRoomKind == 1) {
                AppGame.ins.fzjhModel.update_fanpai(this.wLookCardUser, this.cbCardData, this.cbCardType, 0);
            } else {
                AppGame.ins.zjhModel.update_fanpai(this.wLookCardUser, this.cbCardData, this.cbCardType, 0);
            }

        }
    }

    private closePanel(caller): void {
        if (caller.wGiveUpUser == AppGame.ins.roleModel.useId) {
            this.node.active = false;
        }
    }

    protected onEnable() {
        this.reStart();
        AppGame.ins.zjhModel.on(MZJH.SC_TS_FANPAI, this.showPaiXing, this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_GAME_END, this.gameEnd, this);
        // AppGame.ins.zjhModel.on(MZJH.GAME_START,this.gameEnd,this);
        AppGame.ins.zjhModel.on(MZJH.SC_TS_PLAYER_GIVE_UP, this.closePanel, this)

        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_FANPAI, this.showPaiXing, this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_GAME_END, this.gameEnd, this);
        // AppGame.ins.fzjhModel.on(MZJH_hy.SC_TS_UPDATA_GAME_NUMBER,this.gameEnd,this);
        AppGame.ins.fzjhModel.on(MZJH_hy.SELF_GIVEUP, this.closePanel, this);
    }

    protected onDisable() {
        AppGame.ins.zjhModel.off(MZJH.SC_TS_FANPAI, this.showPaiXing, this);
        AppGame.ins.fzjhModel.off(MZJH_hy.SC_TS_FANPAI, this.showPaiXing, this);

        this.touch_node.off(cc.Node.EventType.TOUCH_MOVE, this.touch_move, this);
        this.resetPai();
        this.unscheduleAllCallbacks();
        // AppGame.ins.zjhModel.off(MZJH.SC_TS_GAME_END,this.gameEnd,this);
    }

    // update (dt) {}
}
