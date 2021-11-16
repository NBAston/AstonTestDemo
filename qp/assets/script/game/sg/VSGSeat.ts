import USpriteFrames from "../../common/base/USpriteFrames";
import UNodeHelper from "../../common/utility/UNodeHelper";
import UEventListener from "../../common/utility/UEventListener";
import UHandler from "../../common/utility/UHandler";
import AppGame from "../../public/base/AppGame";
import UResManager from "../../common/base/UResManager";
import { EIconType, ERoomKind } from "../../common/base/UAllenum";
import USGHelper, { SGBattlePlayerInfo, ESGBattlePlayerPaiState, UISGPoker, ESGState } from "./USGHelper";
import VSGPaiAction from "./VSGPaiAction";
import UStringHelper from "../../common/utility/UStringHelper";
import UDebug from "../../common/utility/UDebug";
import { SG_SELF_SEAT } from "./MSGModel";
import VSG from "./VSG";
import UPokerHelper from "../../common/utility/UPokerHelper";
import GamePropManager from "../../public/GameProp/GamePropManager";
import VGameChatPropManager from "../../public/gamechat/VGameChatPropManager";

/**总的操作时间 */
const totalTurnTime = 10;


/**
 * 创建:dz
 * 作用:三公座位
 */

export default class VSGSeat {
    private _seatId: number;
    /**作为根节点 */
    private _seatRoot: cc.Node;
    /**扑克牌节点 */
    private _pokerRoot: cc.Node;
    /**状态标记节点 */
    private _flagRoot: cc.Node;
    /**抢庄结果 下注结果 */
    private _flagLabel: cc.Label;

    /**筹码背景节点 */
    // private _chipBg: cc.Node;
    /**筹码值节点 */
    // private _chipValue: cc.Node;
    /**牌型节点 */
    private _paiXing: cc.Node;
    /**cd sg的庄家框*/
    private _bankerKuang: cc.Sprite;
    /**头像 */
    private _head: cc.Sprite;
    /**先手 庄家 */
    private _xian: cc.Node;
    /**赢的节点 */
    private _win: cc.Node;
    /**赢多少 */
    private _winNum: cc.Label;
    /**输的节点 */
    private _lose: cc.Node;
    /**输多少 */
    private _loseNum: cc.Label;
    /**玩家名字 */
    private _nickName: cc.Label;
    private _vip: cc.Label;
    private _vip_bg: cc.Node;
    private _headbox: cc.Sprite;
    /**分数 */
    private _gold: cc.Label;
    /**已看片节点 */
    // private _seePai: cc.Node;
    private _winnode: cc.Node;
    /**玩家状态底板 */
    private _flagBg: cc.Sprite;
    /**玩家状态的内容 */
    private _flagContent: cc.Sprite;
    /** 玩家下注总数*/
    private _chipCount: cc.Label;
    /**点击看牌按钮 */
    private _clickPai: cc.Node;
    /**翻牌动画控制 */
    private _paiAction: VSGPaiAction;
    /**图片资源集合 */
    private _res: USpriteFrames;
    /**进入轮巡 */
    private _isTurn: boolean;
    /**总的cd时间 */
    private _cdTime: number;
    /**发牌的源点 */
    private _fapai: cc.Node;
    /**等待 */
    private _wsz: cc.Node;
    /**数据*/

    // private _winfx: dragonBones.ArmatureDisplay;
    private _winself: sp.Skeleton = null;

    public _userId: number;

    private _oriFlag: cc.Vec2;
    private _targetFlag: cc.Vec2;
    /**座位玩家是否离开 */
    private _isfree: boolean;
    /**定庄动画 */
    private _sp_zhuang: sp.Skeleton;
    /**赢家 */
    private _sp_winner: sp.Skeleton;

    private _sex: number;

    /**玩家金币 */
    private _score: number = 0;
    /**get score */
    get score(): number {
        return this._score;
    }
    /**set score */
    set score(num: number) {
        this._score = num;
    }

    /**
     * 座位号
     */
    get seatId(): number {
        return this._seatId;
    }
    get isFree(): boolean {
        return this._isfree;
    }

    get sex(): number {
        return this._sex;
    }
    /**是否上座正玩，还是下局玩家 */
    private _is_round: boolean = false;
    get isOnRound(): boolean {
        return this._is_round;
    }
    set onRound(r: boolean) {
        this._is_round = r;
    }
    /**结算的分数 */
    private _totalScore: number = -1;

    constructor(seatId: number, ori: cc.Node, seatRoot: cc.Node, pokerRoot: cc.Node, flagRoot: cc.Node,
        paiXing: cc.Node, win: cc.Node, res: USpriteFrames, sp_zhuang: sp.Skeleton
        , sp_winner: sp.Skeleton, chipBg?: cc.Node, chipValue?: cc.Node) {

        this._sex = 0;
        this._fapai = ori;
        this._seatId = seatId - 1;
        this._seatRoot = seatRoot;
        this._pokerRoot = pokerRoot;
        this._flagRoot = flagRoot;
        this._paiXing = paiXing;
        this._res = res;
        this._winnode = win;
        this._oriFlag = new cc.Vec2(this._flagRoot.x, this._flagRoot.y - 30);
        this._targetFlag = new cc.Vec2(this._flagRoot.x, this._flagRoot.y - 10);//80
        this._sp_zhuang = sp_zhuang;
        this._sp_winner = sp_winner;

        this.init();
    }

    get paiAction(): VSGPaiAction {
        return this._paiAction;
    }


    /**
     * @description 得到道具节点
     * @returns 返回道具节点
     */
    getPropNode(): cc.Node {
        let prop = this._seatRoot.getChildByName("prop");
        return prop;
    };

    /**
     * @description 得到聊天节点
     * @returns 返回聊天节点
     */
    getChatPropNode(): cc.Node {
        let chatProp = this._seatRoot.getChildByName("chatProp");
        return chatProp;
    };
    /**初始化 */
    private init(): void {
        var self = this;

        this._bankerKuang = UNodeHelper.getComponent(this._seatRoot, "gf_ct", cc.Sprite);
        this._head = UNodeHelper.getComponent(this._seatRoot, "head_icon", cc.Sprite);
        // this._xian = UNodeHelper.find(this._seatRoot, "icon_xian");
        this._win = UNodeHelper.find(this._seatRoot, "get_win_gold");
        this._winNum = UNodeHelper.getComponent(this._seatRoot, "get_win_gold/win_value", cc.Label);
        this._lose = UNodeHelper.find(this._seatRoot, "get_lose_gold");
        this._loseNum = UNodeHelper.getComponent(this._seatRoot, "get_lose_gold/lose_value", cc.Label);
        this._nickName = UNodeHelper.getComponent(this._seatRoot, "name", cc.Label);
        this._gold = UNodeHelper.getComponent(this._seatRoot, "gold", cc.Label);
        this._headbox = UNodeHelper.getComponent(this._seatRoot, "frame_0", cc.Sprite);
        this._vip = UNodeHelper.getComponent(this._seatRoot, "vip", cc.Label);
        this._vip_bg = UNodeHelper.find(this._seatRoot, "vip_03");

        this._wsz = UNodeHelper.find(this._seatRoot, "outNode");

        this._paiAction = new VSGPaiAction(this.seatId, this._pokerRoot, this._paiXing, this._res);

        this._flagLabel = this._flagRoot.getComponent(cc.Label);

        this._sp_zhuang.node.active = false;
        this._sp_winner.node.active = false;
        this._wsz.active = false;
    }

    /**
     * 设置显示的抢庄 或 下注结果
     * @param b 是否显示
     * @param content 字样
     * @param isAction 是否播放动画
     */
    private setflag(b?: boolean, content?: string, isAction?: boolean): void {

        this._flagRoot.stopAllActions();
        this._flagRoot.active = b;
        if (b == true) {
            let _flagLabel = this._flagLabel.node.getChildByName("flag").getComponent(cc.Label);
            this._flagLabel.string = "";
            _flagLabel.string = "";
            if (content == "不抢") {
                _flagLabel.string = content;
            } else {
                this._flagLabel.string = content;
            };

            if (isAction == true) {
                this._flagRoot.setPosition(this._oriFlag);
                this._flagRoot.runAction(cc.moveTo(0.3, this._targetFlag));
            }

        }
    }

    /**展示基础信息 */
    showbaseInfo(data: SGBattlePlayerInfo) {
        this._seatRoot.opacity = 255;
        this._isfree = true;
        this._seatRoot.active = true;
        this._pokerRoot.active = false;
        this._flagRoot.active = false;
        this._paiXing.active = false;
        this._win.active = false;
        this._lose.active = false;
        this._winnode.active = false;
        this._bankerKuang.node.active = false;
        this._sp_zhuang.node.active = false;
        this._sp_winner.node.active = false;

        this._userId = data.userId;

        if (this._score == 0 && this._seatId == SG_SELF_SEAT) {
            if (this._totalScore != null && this._totalScore != -1) {
                this._score = this._totalScore;
            } else {
                this._score = AppGame.ins.roleModel.score;
            }
        }

        if (data.playStatus == 1 || data.playStatus == 6) {
            this._wsz.active = false;
        } else {
            this._wsz.active = true;
            let children = this._wsz.children;
            for (let i = 0; i < children.length; i++) {
                children[i].active = AppGame.ins.sgModel._state == ESGState.Match ? false : true
            }
        }


        this._gold.string = UStringHelper.formatPlayerCoin(this._score / 100);
        let isClub = AppGame.ins.currRoomKind == ERoomKind.Club;
        if (data.seatId == 0) {
            this._nickName.string = data.nickName.toString();//UStringHelper.spliteString(data.nickName.toString(), 12);
        } else {
            this._nickName.string = isClub ? data.nickName : UStringHelper.coverName(data.nickName.toString());
        }

        if (data.vipLevel == 0) {
            this._vip.node.active = false;
            this._vip_bg.active = false;
        } else {
            this._vip.node.active = true;
            this._vip_bg.active = true;
            this._vip.string = data.vipLevel.toString();
        }
        UResManager.load(data.headboxId, EIconType.Frame, this._headbox);

        UResManager.load(data.headId, EIconType.Head, this._head, data.headImgUrl);
    }


    /**获取位置的世界坐标 */
    getSeatWordPos(): cc.Vec2 {
        return this._seatRoot.convertToWorldSpaceAR(cc.Vec2.ZERO);
    }
    /**更新分数和下注 */
    updateScore(score: number, usetotal: number): void {
        this.setScore(score);
    }
    setScore(score: number): void {
        this._totalScore = score;
        this._gold.string = UStringHelper.formatPlayerCoin(score / 100);//score.toString();
    }
    /**结果 */
    result(win: boolean, score: number, waittime?: number, acTime?: number): void {
        this._win.active = win;
        this._lose.active = !win;
        let show = win ? this._win : this._lose;
        let label = win ? this._winNum : this._loseNum;

        var scoreTemp = (score / 100);

        var score1 = "";

        if (scoreTemp > 0) {
            score1 = "+" + UStringHelper.getMoneyFormat(scoreTemp, -1);

        } else {
            score1 = UStringHelper.getMoneyFormat(scoreTemp, -1);
        }

        label.string = score1;
        show.setPosition(0, -10);
        show.runAction(cc.moveTo(acTime == null ? 1 : acTime, 0, 17));
        if (win) {
            // this._winnode.active = true;
        }
        else {
            this._winnode.active = false;

        }
    }

    showWinnerSpine() {
        this._sp_winner.node.active = true;
        this._sp_winner.animation = "get";
        this._sp_winner.setAnimation(0, "get", false);
    }

    /**更新turntime */
    updateturnTime(time: number): void {
        this._cdTime = time;
    }
    /**绑定数据 */
    bind(data: SGBattlePlayerInfo): void {
        UDebug.log("绑定数据" + JSON.stringify(data));
        this._isfree = false;
        this._seatRoot.active = true;
        this._bankerKuang.node.active = false;

        this._winnode.active = false;
        if (this._winself) {
            this._winself.node.active = false;
        }
        this._sp_winner.node.active = false;

        this._sex = data.sex;
        this._userId = data.userId;
        this.setPlayerPropUserId(data.userId);
        UResManager.load(data.headId, EIconType.Head, this._head, data.headImgUrl);
        if (data.vipLevel == 0) {
            this._vip.node.active = false;
            this._vip_bg.active = false;
        } else {
            this._vip.node.active = true;
            this._vip_bg.active = true;
            this._vip.string = data.vipLevel.toString();
        }

        UResManager.load(data.headboxId, EIconType.Frame, this._headbox);
        this.updateScore(data.score, data.userTotal);

        if (data.playStatus == 1 || data.userStatus == 6) { // 正在游戏
            this._wsz.active = false;
            this.onRound = true;
        } else {
            this._wsz.active = true;
            this.onRound = false;
            let children = this._wsz.children;
            for (let i = 0; i < children.length; i++) {
                children[i].active = AppGame.ins.sgModel.state == ESGState.Wait ? false : true;
            }
        }

        this._totalScore = -1;
        let seadId = AppGame.ins.sgModel.getUISeatId(data.chairId);
        let isClub = AppGame.ins.currRoomKind == ERoomKind.Club;
        if (seadId == 0) {
            this._nickName.string = isClub ? data.nickName : data.userId.toString();// UStringHelper.spliteString(data.userId.toString(), 12);
        } else {
            this._nickName.string = isClub ? data.nickName : UStringHelper.coverName(data.userId.toString());
        }

        UDebug.log(this._userId + "手牌状态" + data.paiState);


        if (AppGame.ins.sgModel._state == ESGState.Wait) {
            return
        }

        switch (data.paiState) {
            // case ESGBattlePlayerPaiState.kanPai:
            //     {
            //         this._pokerRoot.active = true;
            //         this._paiAction.normalState()
            //     }
            //     break;
            case ESGBattlePlayerPaiState.mengPai:
                {
                    // this._paiAction.showback();
                    // // this._pokerRoot.active = true;
                    // this._paiAction.normalState();
                }
                break;
            case ESGBattlePlayerPaiState.none:
                {

                    cc.log("bbbb");
                    this._pokerRoot.active = false;
                    this._paiAction.normalState();
                }
                break;
        }
    }


    /**绑定道具和聊天节点userId */
    setPlayerPropUserId(userId: number) {
        let prop = UNodeHelper.find(this._seatRoot, "prop");
        prop.getComponent(GamePropManager).bindUserId(userId);
        let chatProp = UNodeHelper.find(this._seatRoot, "chatProp");
        chatProp.getComponent(VGameChatPropManager).bindUserId(userId);
    }


    randomPickBanker(bIndex: number, delayOffest: number) {
        var self = this;
        //重复2次 闪光(将透明度调亮和调暗)
        let rep = cc.repeat(cc.sequence(
            cc.fadeIn(0.05),
            cc.delayTime(0.05),
            cc.fadeOut(0.05),
            cc.callFunc(() => {
                VSG.ins.music.playChooseZhuang();
            })
        ), 4);
        //每个人延迟执行，并加回调
        let act = cc.sequence(cc.delayTime(delayOffest * 0.05), rep, cc.callFunc((node) => {

            if (bIndex == self._seatId) {
                self._bankerKuang.node.opacity = 255;
                self.setBankerSpine(true, bIndex);
            }
        }));

        this._bankerKuang.node.active = true;
        this._bankerKuang.node.runAction(act);
    }
    /**
     * 定庄
     * @param b 是否显示
     * @param cb 回调
     */
    setBankerSpine(b: boolean, cb?: any) {
        if (b) {
            this._sp_zhuang.animation = "zhuang_02";
            this._sp_zhuang.setAnimation(0, "zhuang_02", false);

            if (cb != null) {

                this._sp_zhuang.setCompleteListener(() => {
                    AppGame.ins.sgModel.emit(USGHelper.SG_SELF_EVENT.SG_CHOOSE_BANKER_COMPLETE, cb);
                });
            }

        }
        this._sp_zhuang.node.active = b;
    }

    /**设置 sg的庄家框*/
    setBankerCircle(b: boolean): void {
        // this._xian.active = b;
    }
    /**设置庄家框 */
    setZhuangKuang(b: boolean): void {
        this._bankerKuang.node.active = b;
    }
    /**设置叫庄结果 下注结果 */
    setCallOrXiaZhu(b: boolean, str?: string, isAction?: boolean) {
        this.setflag(b, str, isAction);
    }

    clear() {
        this._pokerRoot.active = false;
        this._paiXing.active = false;
        this._winnode.active = false;
        this._win.active = false;
        this._win.stopAllActions();
        this._lose.active = false;
        this._lose.stopAllActions();
        this._sp_zhuang.node.active = false;
        this._bankerKuang.node.active = false;
        this._flagRoot.stopAllActions();
        this._flagRoot.active = false;
        this._paiAction.showback();
        // this._pokerRoot.active = true;
        this._paiAction.normalState();
    }

    hidePoker(value: boolean): void {
        this._pokerRoot.active = value;

    }

    /**看牌 */
    seePai(pai: Array<number>, pokerType: string): void {
        // this._seePai.active = true;
        var poker = new UISGPoker();
        poker.pokerIcons = [];
        poker.pokerType = pokerType;
        pai.forEach(element => {
            poker.pokerIcons.push(UPokerHelper.getCardSpriteName(element));
        });

        this._paiAction.playFanPai(poker, false);
    }

    /**翻牌 */
    fanpai(poker: UISGPoker, handler?: UHandler): void {
        this._paiAction.playFanPai(poker, true, handler);
    }

    /**翻牌 */
    fanpai2(poker: [], handler?: UHandler): void {
        this._paiAction.playFanPai2(poker, true, handler);
    }

    fapai(overHandler: UHandler): void {
        this._pokerRoot.active = true;
        let start = this._fapai.parent.convertToWorldSpaceAR(new cc.Vec2(this._fapai.position.x, this._fapai.position.y));
        let handler = null;
        if (this.seatId == 0) {
            handler = UHandler.create(() => {
                if (overHandler) overHandler.run();
            }, this);
        }
        this._paiAction.playfapai(start, handler);
    }
    /**座位玩家离开 */
    free(): void {
        this._isfree = true;
        this._seatRoot.active = false;
        this._pokerRoot.active = false;
        this._flagRoot.active = false;
        this._paiXing.active = false;

        this._win.active = false;
        this._win.stopAllActions();
        this._lose.active = false;
        this._lose.stopAllActions();
        this._winnode.active = false;
        if (this._winself) {
            this._winself.node.active = false;
            this._winself.unscheduleAllCallbacks();
        }

        if (this._paiAction != null) {
            this._paiAction.free();
        }

        this._totalScore = -1;
        this._is_round = false;
        this._sp_zhuang.node.active = false;
        this._sp_winner.node.active = false;
        let prop = UNodeHelper.find(this._seatRoot, "prop");
        prop.getComponent(GamePropManager).closePropPanelByUserId(this._userId);
    }



}
