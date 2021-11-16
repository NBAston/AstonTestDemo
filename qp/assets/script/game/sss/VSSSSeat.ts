import UNodeHelper from "../../common/utility/UNodeHelper";
import UStringHelper from "../../common/utility/UStringHelper";
import { SSS_SCALE, SSS_SELF_SEAT } from "./MSSS";
import UDebug from "../../common/utility/UDebug";
import { ESSSPlayerInfo, ESSSState } from "./ssshelp/USSSData";
import UResManager from "../../common/base/UResManager";
import { ECommonUI, EIconType, ERoomKind } from "../../common/base/UAllenum";
import AppGame from "../../public/base/AppGame";
import UHandler from "../../common/utility/UHandler";
import UEventHandler from "../../common/utility/UEventHandler";
import { COIN_RATE } from "../../config/cfg_common";
import GamePropManager from "../../public/GameProp/GamePropManager";
import VGameChatPropManager from "../../public/gamechat/VGameChatPropManager";



/*
 //扑克类型




/**
 * 创建:gss
 * 作用:座位号控制
 */
export default class VSSSSeat {

    private _seatId: number;
    /**作为根节点 */
    private _seatRoot: cc.Node;
    /**扑克牌节点 */
    private _pokerRoot: cc.Node;
    /**状态标记节点 */
    private _flagRoot: cc.Node;

    //等待中
    private _waitting: cc.Node;

    /**牌型节点 */
    private _paiXing: cc.Node;
    /**cd */
    private _cd: cc.Sprite;
    /**头像 */
    private _head: cc.Sprite;
    //头像框
    private _headFrame: cc.Sprite;
    //VIP等级
    private _vipLevel: cc.Label;

    /**是否理牌 */  // 0 没理  1  理了
    private _selected: number;
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
    /**分数 */
    private _gold: cc.Label;
    /**玩家状态的内容 */
    private _flagContent: cc.Sprite;

    /**进入轮巡 */
    private _isTurn: boolean;

    /**总的操作时间 */
    private _totalTurnTime = 20;
    /**现在的cd时间 */
    private _cdTime: number;
    /**发牌的源点 */
    private _fapai: cc.Node;
    private _winself: sp.Skeleton;

    public _userId: number = 0;
    /**赢家 */
    private _sp_winner: sp.Skeleton;

    private _oriFlag: cc.Vec2;
    private _targetFlag: cc.Vec2;
    private _isfree: boolean;
    private _sex: number;
    private _clubWait: cc.Node; //俱乐部等待提示

    private _chipNum1: number;  //本座位1下注底分
    //private _aniArea: sp.Skeleton;  //打枪动画
    /**
     * 座位号 0- 4
     */
    get seatId(): number {
        return this._seatId;
    }
    get playerName(): cc.Label {
        return this._nickName;
    }
    get sex(): number {
        return this._sex;
    }
    get isFree(): boolean {
        return this._isfree;
    }

    get selected(): number {
        return this._selected;
    }

    constructor(seatId: number, seatRoot: cc.Node) {
        this._sex = 0;
        this._seatId = seatId - 1;
        this._seatRoot = seatRoot;
        this.init();
    }
    /**初始化 */
    private init(): void {
        this._cd = UNodeHelper.getComponent(this._seatRoot, "gf_ct", cc.Sprite);
        this._head = UNodeHelper.getComponent(this._seatRoot, "head_icon", cc.Sprite);
        this._headFrame = UNodeHelper.getComponent(this._seatRoot, "frame_0", cc.Sprite);
        this._win = UNodeHelper.find(this._seatRoot, "get_win_gold");
        this._winNum = UNodeHelper.getComponent(this._seatRoot, "get_win_gold/win_value", cc.Label);
        this._vipLevel = UNodeHelper.getComponent(this._seatRoot, "vip/level", cc.Label);
        this._lose = UNodeHelper.find(this._seatRoot, "get_lose_gold");
        this._loseNum = UNodeHelper.getComponent(this._seatRoot, "get_lose_gold/lose_value", cc.Label);
        this._nickName = UNodeHelper.getComponent(this._seatRoot, "name", cc.Label);
        this._gold = UNodeHelper.getComponent(this._seatRoot, "gold", cc.Label);
        this._waitting = UNodeHelper.find(this._seatRoot, "outNode");

        this._sp_winner = UNodeHelper.getComponent(this._seatRoot, "spine_winner", sp.Skeleton);
        this._waitting.active = false

    }
    /**
     * @description 得到道具节点
     * @returns 返回道具节点
     */
    getPropNode(): cc.Node {
        let prop = this._seatRoot.getChildByName("prop");
        return prop
    };

    /**
     * @description 得到聊天节点
     * @returns 返回聊天节点
     */
    getChatPropNode(): cc.Node {
        let chatProp = this._seatRoot.getChildByName("chatProp");
        return chatProp;
    };
    /**
     * @description 俱乐部游戏中游戏结束
     */
    clubHideHead() {
        if (this._seatRoot.active) {
            this._gold.node.active = true;
            this._seatRoot.active = true;
            this._head.node.active = true;
            this._nickName.node.active = true;
            this._lose.active = false;
            this._loseNum.node.active = true;
            this._win.active = false;
            this._winNum.node.active = true;
        };
    }

    /**获取位置的世界坐标 */
    getSeatWordPos(): cc.Vec2 {
        return this._seatRoot.convertToWorldSpaceAR(cc.Vec2.ZERO);
    }

    getPaiWordsPos(): cc.Vec2 {
        return this._pokerRoot.convertToWorldSpaceAR(cc.Vec2.ZERO);
    }

    get getChipNum(): number {
        return this._chipNum1
    }

    //更新分数
    setScore(score: number): void {
        this._gold.string = UStringHelper.formatPlayerCoin((score / COIN_RATE)).toString();

    }
    //设置总操作时间
    setTotalTurnTime(value: number): void {
        this._totalTurnTime = value
    }

    /**结果飘分 */
    result(score: number): void {
        UDebug.Log("结果" + score)
        this.stopcd();
        let win = score > 0 ? true : false;
        this._win.active = win;
        this._lose.active = !win;
        score = score * SSS_SCALE;
        let show = win ? this._win : this._lose;
        let label = win ? this._winNum : this._loseNum;
        label.string = win ? "+" + UStringHelper.getMoneyFormat(score) : UStringHelper.getMoneyFormat(score);
        show.setPosition(0, 0);
        let seq = cc.moveBy(0.5, cc.v2(0, 100))
        show.stopAllActions()
        show.runAction(seq);
    }

    showWinnerSpine() {
        this._sp_winner.node.active = true;
        this._sp_winner.animation = "get";
        this._sp_winner.setAnimation(0, "get", false);
    }
    hideWinnerSpine() {
        this._sp_winner.node.active = false;
    }


    /**结果 飘分后删除*/
    resultDel(score: number): void {
        this.stopcd();
        let win = score > 0 ? true : false;
        this._win.active = win;
        this._lose.active = !win;
        score = score * SSS_SCALE;
        let show = win ? this._win : this._lose;
        let label = win ? this._winNum : this._loseNum;
        label.string = win ? "+" + UStringHelper.getMoneyFormat(score) : UStringHelper.getMoneyFormat(score);
        show.setPosition(0, -10);
        show.stopAllActions()
        show.runAction(cc.sequence(cc.moveTo(0.5, 0, 17),
            cc.delayTime(2),
            cc.callFunc(() => {
                //this._win.active = false;
                //this._lose.active = false;
            })));
    }

    closewinfx(): void {
        if (this._winself) this._winself.node.active = false;
    }

    /**更新turntime */
    updateturnTime(time: number): void {
        this._cdTime = time;
    }

    /**展示基础信息 */
    showbaseInfo(data: ESSSPlayerInfo) {
        this._seatRoot.opacity = 255;
        this._isfree = false;
        this._pokerRoot.active = false;
        this._flagRoot.active = false;
        this._win.active = false;
        this._lose.active = false;
        this._cd.node.active = false;
        this._userId = data.userId;
        this._nickName.string = AppGame.ins.currRoomKind != ERoomKind.Club ? data.userId.toString() : data.nickName;
        this._selected = data.selected
        UResManager.load(data.headId, EIconType.Head, this._head, data.headImgUrl);
    }


    /**进入玩家的操作伦 */
    enterTurn(cd: number): void {
        this._isTurn = true;
        this._cd.node.active = true;
        this._cdTime = cd;
        UDebug.Log("进入玩家的操作伦" + this._cdTime)
        //this._flagRoot.active = false;
    }
    /**离开玩家的操作伦 */
    leaveTurn(): void {
        this._isTurn = false;
        this._cd.node.active = false;
    }

    /**绑定数据 */
    bind(data: ESSSPlayerInfo): void {
        this._isfree = false;
        this._seatRoot.active = true;
        this._cd.node.active = false;
        this._sex = data.sex;
        this._userId = data.userId;
        UResManager.load(data.headId, EIconType.Head, this._head, data.headImgUrl);
        UResManager.load(data.headboxId, EIconType.Frame, this._headFrame);
        // this._vipLevel.node.parent.active = data.vipLevel == 0 ? false : true;
        this._vipLevel.string = data.vipLevel.toString()
        this.setScore(data.score);
        this._selected = data.selected
        let show_nick = data.userId.toString();
        if (AppGame.ins.currRoomKind != ERoomKind.Club) {
            if (data.userId != AppGame.ins.roleModel.useId) {
                show_nick = UStringHelper.coverName(show_nick);
            }
        } else {
            show_nick = data.nickName.toString();
        };
        this._nickName.string = show_nick
        if (AppGame.ins.currRoomKind == ERoomKind.Club) {
            if (data.userStatus == 4) {
                this._waitting.active = true;
                let children = this._waitting.children;
                for (let i = 0; i < children.length; i++) {
                    // cc.log("aaaaaaaaaaaaaaaa", AppGame.ins.sssModel._state);
                    children[i].active = AppGame.ins.sssModel._state == ESSSState.Wait ? false : true;
                };
            } else {
                this._waitting.active = false;
            };
        }
        this.setPlayerPropUserId(data.userId);

    }

    /**绑定道具节点userId */
    setPlayerPropUserId(userId: number) {
        let prop = UNodeHelper.find(this._seatRoot, "prop");
        prop.getComponent(GamePropManager).bindUserId(userId);
        let chatProp = UNodeHelper.find(this._seatRoot, "chatProp");
        chatProp.getComponent(VGameChatPropManager).bindUserId(userId);
    }

    /**发牌 */
    fapai(overHandler: UHandler): void {
        this._pokerRoot.active = true;
        let start = this._fapai.parent.convertToWorldSpaceAR(this._fapai.position);
        let handler = null;
        if (this.seatId == SSS_SELF_SEAT) {
            handler = UHandler.create(() => {
                if (overHandler) overHandler.run();
            }, this);
        }

    }

    /**停止cd */
    stopcd(): void {
        this._cd.node.active = false;

    }
    /**座位玩家离开 */
    free(): void {
        return
        this._isTurn = false;
        this._isfree = true;
        this._seatRoot.active = false;
        this._win.active = false;
        this._lose.active = false;
    }

    hideHead(): void {
        this._seatRoot.active = false;
        this._head.node.active = false;
        this._win.stopAllActions();
        this._win.active = false;
        this._winNum.node.active = true;
        this._lose.stopAllActions();
        this._lose.active = false;
        this._loseNum.node.active = true;
        this._nickName.node.active = false;
        this._gold.node.active = false;

        let prop = UNodeHelper.find(this._seatRoot, "prop");
        prop.getComponent(GamePropManager).closePropPanelByUserId(this._userId);
    }

    showHead(): void {
        this._seatRoot.active = true;
        this._head.node.active = true;
        this._nickName.node.active = true;
        this._gold.node.active = true;

        if (AppGame.ins.currRoomKind == ERoomKind.Club) {
            if (AppGame.ins.sssModel._state == ESSSState.Gameing) {
                this.refFloatingPoints();
            };
        } else {
            this.refFloatingPoints();
        };
    }

    /**
     * @description 设置飘分
     */
    refFloatingPoints() {
        this._winNum.node.active = true;
        this._win.stopAllActions();
        this._win.active = false;
        this._lose.stopAllActions();
        this._lose.active = false;
        this._loseNum.node.active = true;
    };

    /**帧更新 */
    update(dt: number): void {
        if (this._isfree) return;
        if (this._isTurn) {
            this._cdTime -= dt;
            if (this._cdTime > 0)
                this._cd.fillRange = this._cdTime / this._totalTurnTime;
            else {
                this._cd.fillRange = 0;
                this.leaveTurn();
            }
        }
    }

    clear(): void {
        this.free()
        if (AppGame.ins.currRoomKind == ERoomKind.Club) {
            this.clubHideHead();
        } else {
            this.hideHead()
        }
        this.stopcd()
        this._chipNum1 = 0;
    }


}
