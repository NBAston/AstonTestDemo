import UNodeHelper from "../../common/utility/UNodeHelper";
import { EBJPlayerInfo, EPlayerPaiState, UIBJPoker, UIBJFanPai, EBJState } from "./UBJData";
import VBJPaiAction from "./VBJPaiAction";
import USpriteFrames from "../../common/base/USpriteFrames";
import UHandler from "../../common/utility/UHandler";
import UResManager from "../../common/base/UResManager";
import { EIconType } from "../../common/base/UAllenum";
import AppGame from "../../public/base/AppGame";
import MBJ, { BJ_SELF_SEAT, BJ_SCALE } from "./MBJ";
import UStringHelper from "../../common/utility/UStringHelper";
import UDebug from "../../common/utility/UDebug";
import UAudioManager from "../../common/base/UAudioManager";
import GamePropManager from "../../public/GameProp/GamePropManager";
import VGameChatPropManager from "../../public/gamechat/VGameChatPropManager";


/*
 //扑克类型
 CT_BUST          1                  //爆牌
 CT_POINTS        2                  //点数
 CT_FIVE_DRAGON      3                  //五小龙
 CT_BLACKJACK      4                  //黑杰克



/**
 * 创建:gss
 * 作用:座位号控制
 */
export default class VBJSeat {

    private _seatId: number;
    /**作为根节点 */
    private _seatRoot: cc.Node;
    /**扑克牌节点 */
    public _pokerRoot: cc.Node;
    /**状态标记节点 */
    private _flagRoot: cc.Node;
    /**筹码背景节点 */
    public _chipBg: cc.Node;
    /**筹码值节点 */
    public _chipValue: cc.Node;
    /**牌型节点 */
    private _paiXing: cc.Node;
    /**翻牌的节点*/
    private _fanpai: cc.Node;
    /**cd */
    private _cd: cc.Sprite;
    /**头像 */
    private _head: cc.Sprite;
    /**玩家座位号 */
    private _orderNum: cc.Label;
    /**筹码下注点击区域 */
    private _winLight: cc.Node;

    //保险图片
    private _baoImg: cc.Sprite;
    //其他保险图片
    private _otherbaoImg: cc.Sprite;

    //请下注图片
    private _qxzImg: cc.Sprite;
    /**筹码下注点击区域事件接收 */
    private _uButton: cc.Button;

    // 下注筹码位置 0-4  0 中间下注位置 1 保险下注位置 2 左边分牌筹码位置  3 右边分牌筹码位置
    /**筹码放置区 */
    private _chipArea: cc.Node[];
    /**赢的节点 */
    public _win: cc.Node;
    /**赢多少 */
    public _winNum: cc.Label;
    /**输的节点 */
    public _lose: cc.Node;
    /**输多少 */
    public _loseNum: cc.Label;
    /**玩家名字 */
    private _nickName: cc.Label;
    _gf_mengban1: cc.Sprite;
    private _seat_numBg: cc.Sprite;
    public _otherSeatsName: cc.Sprite;
    private _otherSeatsImage: cc.Sprite;
    private _caozuoLight: cc.Sprite; //操作闪动图
    private _vip: cc.Label;
    private _headbox: cc.Sprite;
    private _vipNode: cc.Node;
    private _bgNode: cc.Node;
    /**分数 */
    private _gold: cc.Label;
    private _winnode: cc.Node;
    /**玩家状态的内容 */
    private _flagContent: cc.Sprite;
    /** 玩家下注总数*/
    public _chipCount: cc.Label;
    /**翻牌动画控制 */
    public _paiAction: VBJPaiAction;
    /**图片资源集合 */
    private _res: USpriteFrames;
    /**进入轮巡 */
    public _isTurn: boolean;

    /**总的操作时间 */
    private _totalTurnTime = 20;
    /**现在的cd时间 */
    private _cdTime: number;
    /**发牌的源点 */
    private _fapai: cc.Node;
    private _winfx: dragonBones.ArmatureDisplay;
    private _winself: sp.Skeleton;

    private _userId: number = 0;

    private _oriFlag: cc.Vec2;
    private _targetFlag: cc.Vec2;
    private _isfree: boolean;
    private _sex: number;
    private _cacheName: string;

    private _chipNum1: number;  //本座位1下注底分
    private _chipNum2: number;  //本座位二手牌下注底分
    private _baoxianNum: number;  //保险金额
    private _isfenpai: boolean = false;
    private _selfScore = 0;
    private _charge_btn: cc.Node;
    private _bg: cc.Node;
    public prop: cc.Node;
    public chatProp: cc.Node;
    public userId: number = 0;
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
    //** 一手牌下注金币*/
    get chipNum1(): number {
        return this._chipNum1;
    }
    //** 二手牌下注金币*/
    get chipNum2(): number {
        return this._chipNum2;
    }

    constructor(seatId: number, ori: cc.Node, seatRoot: cc.Node, pokerRoot: cc.Node,
        chipBg: cc.Node, chipValue: cc.Node, fanpai: cc.Node, paiXing: cc.Node, win: cc.Node, res: USpriteFrames) {
        this._sex = 0;
        this._fapai = ori;
        this._seatId = seatId - 1;
        this._seatRoot = seatRoot;
        this._pokerRoot = pokerRoot;
        this._chipBg = chipBg;
        this._chipValue = chipValue;
        this._paiXing = paiXing;
        this._fanpai = fanpai;
        this._res = res;
        this._winnode = win;
        this._chipNum1 = 0;
        this._chipNum2 = 0;
        this._isfenpai = false;
        this._selfScore = 0;
        this._baoxianNum = 0;
        this.init();
    }
    /**初始化 */
    private init(): void {

        this._cd = UNodeHelper.getComponent(this._seatRoot, "gf_ct", cc.Sprite);
        this._head = UNodeHelper.getComponent(this._seatRoot, "head_icon", cc.Sprite);
        this._winLight = UNodeHelper.find(this._seatRoot, "winLight");
        this._chipArea = new Array()
        for (let i = 0; i < 4; i++) {
            this._chipArea.push(UNodeHelper.find(this._seatRoot, "chipArea_" + i));
        }
        this._win = UNodeHelper.find(this._seatRoot, "get_win_gold");
        this._winNum = UNodeHelper.getComponent(this._seatRoot, "get_win_gold/win_value", cc.Label);
        this._lose = UNodeHelper.find(this._seatRoot, "get_lose_gold");
        this._loseNum = UNodeHelper.getComponent(this._seatRoot, "get_lose_gold/lose_value", cc.Label);
        this._nickName = UNodeHelper.getComponent(this._seatRoot, "name", cc.Label);
        this._gold = UNodeHelper.getComponent(this._seatRoot, "gold", cc.Label);
        this._orderNum = UNodeHelper.getComponent(this._seatRoot, "orderNum", cc.Label);
        this._flagContent = UNodeHelper.getComponent(this._flagRoot, "icon", cc.Sprite);
        this._winfx = this._winnode.getComponent(dragonBones.ArmatureDisplay);
        this._vip = UNodeHelper.getComponent(this._seatRoot, "vip", cc.Label);
        this._headbox = UNodeHelper.getComponent(this._seatRoot, "head_box", cc.Sprite);
        this._vipNode = UNodeHelper.find(this._seatRoot, "vip_03");
        this._bgNode = UNodeHelper.find(this._seatRoot, "brnn_tip_bg");
        this._gf_mengban1 = UNodeHelper.getComponent(this._seatRoot, "gf_mengban1", cc.Sprite);
        this._seat_numBg = UNodeHelper.getComponent(this._seatRoot, "seat_numBg", cc.Sprite);
        this._baoImg = UNodeHelper.getComponent(this._seatRoot, "bao", cc.Sprite);
        this._otherbaoImg = UNodeHelper.getComponent(this._seatRoot, "otherbao", cc.Sprite);
        this._otherSeatsName = UNodeHelper.find(this._seatRoot, "otherSeat").getComponent(cc.Sprite);
        this._otherSeatsName.node.active = false
        this._otherSeatsImage = UNodeHelper.find(this._seatRoot, "otherSeatClick").getComponent(cc.Sprite);
        this._otherSeatsImage.node.active = false
        this._caozuoLight = UNodeHelper.find(this._seatRoot, "caozuoLight").getComponent(cc.Sprite);
        this._caozuoLight.node.active = false

        this._qxzImg = UNodeHelper.find(this._seatRoot, "qxzImg").getComponent(cc.Sprite);
        this._qxzImg.node.active = false

        this._uButton = this._winLight.getComponent(cc.Button);
        this._chipCount = this._chipValue.getComponent(cc.Label);
        this._bg = UNodeHelper.find(this._seatRoot, "bg");
        this.prop = UNodeHelper.find(this._seatRoot, "prop");
        this.chatProp = UNodeHelper.find(this._seatRoot, "chatProp");

        this._paiAction = new VBJPaiAction(this.seatId, this._pokerRoot, this._fanpai, this._paiXing, this._res);
        this.setChipLightSprite(false)
        this.addChipTouch()
    }


    private setflag(back: string, content: string): void {
        this._flagRoot.active = true;
        this._flagRoot.stopAllActions();
        this._flagContent.spriteFrame = this._res.getFrames(content);
        this._flagRoot.setPosition(this._oriFlag);
        this._flagRoot.setScale(0, 0);
        this._flagRoot.runAction(cc.sequence(cc.scaleTo(0.2, 1), cc.moveTo(0.3, this._targetFlag), cc.moveTo(0.5, this._targetFlag), cc.callFunc(() => {
            this._flagRoot.active = false;
        }, this)));
    }
    /**获取位置的世界坐标 */
    getSeatWordPos(): cc.Vec2 {
        return this._seatRoot.convertToWorldSpaceAR(cc.Vec2.ZERO);
    }
    /**获取下注位置的世界坐标 */
    getChipWordPos(index: number): cc.Vec2 {
        return this._chipArea[index].convertToWorldSpaceAR(cc.Vec2.ZERO);
    }
    getPaiWordsPos(): cc.Vec2 {
        return this._pokerRoot.convertToWorldSpaceAR(cc.Vec2.ZERO);
    }
    get getselfScore(): number {
        return this._selfScore
    }
    get getChipNum(): number {
        return this._chipNum1
    }
    /**更新下注 */
    updateChip(usetotal: number): void {
        this._chipBg.active = true;
        this._chipValue.active = true;
        this._chipCount.string = parseFloat(usetotal * BJ_SCALE + "") + "";
        // UStringHelper.formatPlayerCoin((usetotal * BJ_SCALE)).toString();
        this._chipNum1 = usetotal * BJ_SCALE;
        this.setChipLightSprite(false)
    }
    //更新分数
    setScore(score: number): void {
        this._gold.string = UStringHelper.formatPlayerCoin((score * BJ_SCALE)).toString();
        this._selfScore = score * BJ_SCALE
    }
    //设置总操作时间
    setTotalTurnTime(value: number): void {
        this._totalTurnTime = value
    }
    /**结果 */
    result(score: number): void {
        this.stopcd();
        this.prop.active = false;
        let win = score > 0 ? true : false;
        this._win.active = win;
        this._lose.active = !win;
        score = score * BJ_SCALE;
        let show = win ? this._win : this._lose;
        let label = win ? this._winNum : this._loseNum;
        label.string = win ? "+" + UStringHelper.getMoneyFormat(score) : UStringHelper.getMoneyFormat(score);
        if (this.seatId == 0) {
            show.setPosition(0, 0);
        } else {
            show.setPosition(0, -11);
        }

        let seq = cc.sequence(cc.moveBy(0.8, cc.v2(0, 5)), cc.delayTime(2.2))
        show.stopAllActions()
        show.runAction(seq);
    }
    /**结果 */
    resultDel(score: number): void {
        this.stopcd();
        let win = score > 0 ? true : false;
        this._win.active = win;
        this._lose.active = !win;
        score = score * BJ_SCALE;
        let show = win ? this._win : this._lose;
        let label = win ? this._winNum : this._loseNum;
        label.string = win ? "+" + UStringHelper.getMoneyFormat(score) : UStringHelper.getMoneyFormat(score);
        show.setPosition(0, -30);
        show.stopAllActions()
        show.runAction(cc.sequence(cc.moveTo(0.5, 0, 40),
            cc.delayTime(0.2)
            ,
            cc.callFunc(() => {
                this._win.active = false;
                this._lose.active = false;
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
    showbaseInfo(data: EBJPlayerInfo) {
        this._seatRoot.opacity = 255;
        this._isfree = false;
        this._pokerRoot.active = false;
        this._flagRoot.active = false;
        this._chipBg.active = false;
        this._chipValue.active = false;
        this._baoImg.node.active = false;
        this._win.active = false;
        this._lose.active = false;
        this._winnode.active = false;
        this._cd.node.active = false;
        this._winLight.active = false;
        // this._gf_mengban1.node.active = true;
        this._seat_numBg.node.active = true;
        this._seatRoot.active = true;
        this._paiXing.active = true;
        this._userId = data.userId;
        // if()
        // this._nickName.string = data.userId.toString();
        this._bg.active = true;
        this.userId = data.userId;
        if (data.userId == AppGame.ins.roleModel.useId) {
            this._nickName.string = data.userId.toString();
        } else {
            this._nickName.string = UStringHelper.coverName(data.userId.toString());
        }


        this._orderNum.string = (data.chairId + 1).toString();
        this._vip.string = data.vipLevel.toString();
        UResManager.load(data.headboxId, EIconType.Frame, this._headbox);
        UResManager.load(data.headId, EIconType.Head, this._head, data.headImgUrl);

    }

    /**设置先手标记 */
    setXianShou(): void {
        this._winLight.active = true;
    }
    /**进入玩家的操作伦 */
    enterTurn(cd: number): void {
        this._isTurn = true;
        this._cd.node.active = true;
        this._cdTime = cd;
        //this._flagRoot.active = false;
    }
    /**离开玩家的操作伦 */
    leaveTurn(): void {
        this._isTurn = false;
        this._cd.node.active = false;
        //this.clearChipTouch();
    }

    /**绑定道具节点userId */
    setPlayerPropUserId(userId: number) {
        this.prop.getComponent(GamePropManager).bindUserId(userId);
        this.chatProp.getComponent(VGameChatPropManager).bindUserId(userId);
    }
    /**关闭对应道具面板 */
    closePropPanelByUserId(userId: number) {
        this.prop.getComponent(GamePropManager).closePropPanelByUserId(userId);
    }
    /**绑定数据 */
    bind(data: EBJPlayerInfo): void {
        this._seatRoot.opacity = 255;
        this._isfree = false;
        this._seatRoot.active = true;
        this._cd.node.active = false;
        this._winLight.active = false;
        this._sex = data.sex;
        this._userId = data.userId;
        // this._gf_mengban1.node.active = true;
        this._seat_numBg.node.active = true;
        this._otherSeatsName.node.active = false
        this._otherSeatsImage.node.active = false
        this._caozuoLight.node.active = false
        this._qxzImg.node.active = false
        this._otherbaoImg.node.active = false;
        UResManager.load(data.headId, EIconType.Head, this._head, data.headImgUrl);
        this._bg.active = true;
        // this.updateChip(data.userTotal);

        this.setScore(data.score);
        this.userId = data.userId;
        if (data.userId == AppGame.ins.roleModel.useId) {
            this._nickName.string = data.userId.toString();
        } else {
            this._nickName.string = UStringHelper.coverName(data.userId.toString());
        }
        this._cacheName = data.userId.toString();
        this._orderNum.string = (data.chairId + 1).toString();
        this._vip.string = data.vipLevel.toString();
        UResManager.load(data.headboxId, EIconType.Frame, this._headbox);
        this.prop.active = true;
        this.setPlayerPropUserId(data.userId);
    }

    /**发牌 */
    fapai(overHandler: UHandler): void {
        this._pokerRoot.active = true;
        let start = this._fapai.parent.convertToWorldSpaceAR(this._fapai.position);
        let handler = null;
        if (this.seatId == BJ_SELF_SEAT) {
            handler = UHandler.create(() => {
                if (overHandler) overHandler.run();
            }, this);
        }
        this._paiAction.playfapai(start, overHandler);

    }
    /**发单张牌 */
    fapaiOne(data: UIBJFanPai, overHandler?: UHandler): void {
        this._pokerRoot.active = true;
        let start = this._fapai.parent.convertToWorldSpaceAR(this._fapai.position);
        this._paiAction.playfapaiOne(data.isOneHand, start, data, overHandler);
    }
    /**翻牌 */
    fanpai(poker: UIBJPoker, widthAnimation: boolean = true, handler?: UHandler,): void {
        //this.showclickpai(false);
        this._paiAction.playFanPai(poker, widthAnimation, handler);
    }
    /**翻单张牌 */
    fanpaiOne(poker: UIBJPoker, index: number, widthAnimation: boolean = true, handler?: UHandler,): void {
        //this._paiAction.playFanPaiOne(poker,index, widthAnimation, handler);
    }
    /**停止cd */
    stopcd(): void {
        this._cd.node.active = false;
        for (let i = 0; i < 2; i++) {
            this._paiAction.setState(1, i)
        }
    }
    /**座位玩家离开 */
    free(): void {
        this._paiAction.free()
        this._isTurn = false;
        this._isfree = true;
        this._seatRoot.active = false;
        this._pokerRoot.active = false;
        this._chipBg.active = false;
        this._chipValue.active = false;
        this._paiXing.active = true;
        this._win.active = false;
        this._lose.active = false;
        this._winnode.active = false;
        this._otherSeatsName.node.active = false
        this._otherSeatsImage.node.active = false
        this._caozuoLight.node.active = false
        this._qxzImg.node.active = false
        this._otherbaoImg.node.active = false;
        this._baoImg.node.active = false;
        this._bg.active = false;


    }
    hideHead(): void {
        this._seatRoot.active = true;
        this._pokerRoot.active = true;
        this._gf_mengban1.node.active = false;
        this._seat_numBg.node.active = false;
        this._cd.node.active = false
        this._head.node.active = false;
        this._winLight.active = false
        this._win.active = false;
        this._winNum.node.active = true;
        this._lose.active = false;
        this._loseNum.node.active = true;
        this._nickName.node.active = false;
        this._vip.node.active = false;
        this._headbox.node.active = false;
        this._vipNode.active = false;
        this._bgNode.active = false;
        this._gold.node.active = false;
        this._orderNum.node.active = false;
        this._baoImg.node.active = false;
        this._otherSeatsName.node.active = false
        this._otherSeatsImage.node.active = false
        this._qxzImg.node.active = false
        this._otherbaoImg.node.active = false;
        for (let i = 0; i < 4; i++) {
            this._chipArea[i].active = false;
        }
        this._bg.active = false;
    }
    showHead(): void {
        this._seatRoot.active = true;
        this._pokerRoot.active = true;
        this._paiXing.active = true;
        this._gf_mengban1.node.active = false;
        this._seat_numBg.node.active = true;
        if (AppGame.ins.bjModel._state == EBJState.Gameing) {
            this._cd.node.active = true;
        } else {
            this._cd.node.active = false;
        }

        this._head.node.active = true;
        this._nickName.node.active = true;
        this._gold.node.active = true;
        this._orderNum.node.active = true;
        this._winNum.node.active = true;

        this._nickName.node.active = true;
        this._vip.node.active = true;
        this._headbox.node.active = true;
        this._vipNode.active = true;
        this._bgNode.active = true;
        this._otherSeatsName.node.active = false
        this._otherSeatsImage.node.active = false
        this._qxzImg.node.active = false
        this._otherbaoImg.node.active = false;
        for (let i = 0; i < 4; i++) {
            this._chipArea[i].active = true;
        }
        this._bg.active = true;
    }

    showOffHead(): void {
        this._seatRoot.active = true;
        this._pokerRoot.active = true;
        this._paiXing.active = true;
        this._gf_mengban1.node.active = true;
        this._seat_numBg.node.active = true;
        this._cd.node.active = false;
        this._head.node.active = true;
        this._nickName.node.active = true;
        this._gold.node.active = true;
        this._orderNum.node.active = true;
        this._winNum.node.active = true;

        this._nickName.node.active = true;
        this._vip.node.active = true;
        this._headbox.node.active = true;
        this._vipNode.active = true;
        this._bgNode.active = true;
        this._otherSeatsName.node.active = false
        this._otherSeatsImage.node.active = false
        this._qxzImg.node.active = false
        this._otherbaoImg.node.active = false;
        for (let i = 0; i < 4; i++) {
            this._chipArea[i].active = true;
        }
        this._bg.active = true;
    }

    /**下注区域事件 */
    addChipTouch() {
        this._uButton.node.on('click', this.onClickChip, this);
        //UEventHandler.addClick(this._uButton.node, this._seatRoot, "VBJSeat", "onClickChip");
    }
    /**取消下注区域事件 */
    clearChipTouch() {


    }

    //**刷新单个牌点 */
    refreshPointMax(isOnehand: number) {
        this._paiAction.setPointMax(isOnehand)

    }
    startfenPai(isvalue?: boolean) {
        this._chipNum2 = this._chipNum1
        this._chipCount.string = parseFloat(this._chipNum1 + this._chipNum2 + this._baoxianNum + "") + "";
        // UStringHelper.getMoneyFormat((this._chipNum1+this._chipNum2+this._baoxianNum)).toString();//下注分翻倍
        this._paiAction.fenpai(isvalue)
        this._isfenpai = true;
    }
    /**下注逻辑 */
    private onClickChip(e: cc.Event.EventTouch) {

        //UDebug.Info(e.target.parent.parent.name)
        let seatNum = 0
        switch (e.target.parent.parent.name) {
            case "seat_1":
                seatNum = 0;
                break;
            case "seat_2":
                seatNum = 1;
                break;
            case "seat_3":
                seatNum = 2;
                break;
            case "seat_4":
                seatNum = 3;
                break;
            case "seat_5":
                seatNum = 4;
                break;
        }
        AppGame.ins.bjModel.emit(MBJ.CC_TS_SHOW_OTHER_AREA, true)  //显示其他区
        AppGame.ins.bjModel.setChipArea(seatNum)
        AppGame.ins.bjModel.emit(MBJ.CC_TS_SHOW_CAOZUO_BTN, true, 2) //打开下注按钮
        //显示请下注图片
        //this.setChipLight(false);
        this._qxzImg.node.active = true;
        this._winLight.active = false;
        this.setOtherImage(false)
    }

    //设置下注区域 other 和亮 
    setChipLight(value: boolean): void {
        this._winLight.active = value;
        this.setChipLightSprite(value)
    }
    //设置下注区域点击灯光是否开启图片
    setChipLightSprite(value: boolean): void {
        this._winLight.getComponentInChildren(cc.Sprite).enabled = value
        if (value) {
            this.playClickPlaceEffect()
            this.setOtherImage(true)
            this._qxzImg.node.active = false;
            this.prop.active = false;
        }
        else {
            this.setOtherImage(false)
            this._qxzImg.node.active = false;
        }
    }

    // 播放下注点击淡出动画
    private playClickPlaceEffect(time?: number) {
        this._winLight.active = true
        time = time ? time : 0
        let delay = cc.delayTime(time)
        let fadeOut = cc.fadeOut(0.5)
        let fadeIn = cc.fadeIn(0.5)

        let action = cc.sequence(delay, fadeIn, fadeOut, fadeIn, fadeOut)
        this._winLight.stopAllActions()
        this._winLight.runAction(cc.repeatForever(action))

    }

    showOrderNum(orderNum): void {
        this._orderNum.node.active = true;
        this._orderNum.string = orderNum;
        this._seat_numBg.node.active = true;
    }

    startCaozuo(value: boolean): void {
        this._caozuoLight.node.active = value
        if (value) {
            let fadeOut = cc.fadeOut(0.5)
            let fadeIn = cc.fadeIn(0.5)

            let action = cc.sequence(fadeIn, fadeOut, fadeIn, fadeOut)
            this._caozuoLight.node.stopAllActions()
            this._caozuoLight.node.runAction(cc.repeatForever(action))
        }
        else {
            this._caozuoLight.node.stopAllActions()
        }
    }

    //**设置保险标志是否亮起 默认开启*/
    setBaoxianInfo(value?: boolean) {
        value = value ? value : true
        this._baoImg.node.active = value
    }
    //**设置某副牌是否亮起亮0 */
    setPokeLight(isOnehand?: boolean): void {
        if (isOnehand) {
            this._paiAction.setState(1, 0)
            this._paiAction.setState(0, 1)
        }
        else {
            this._paiAction.setState(0, 0)
            this._paiAction.setState(1, 1)
        }

    }
    //**设置双倍图片位置  几手牌*/
    setsbImgPos(id: number) {
        this._paiAction.setsbImgPos(id);

        if (this._isfenpai) {
            if (id == 0) {
                this._chipNum1 = this._chipNum1 * 2
            }
            else if (id == 1) {
                this._chipNum2 = this._chipNum2 * 2
            }
            this._chipCount.string = parseFloat(this._chipNum1 + this._chipNum2 + this._baoxianNum + "") + "";
            // UStringHelper.getMoneyFormat((this._chipNum1+this._chipNum2+this._baoxianNum)).toString();//下注分翻倍
        }
        else {
            this._chipNum1 = this._chipNum1 * 2
            this._chipCount.string = parseFloat(this._chipNum1 + this._baoxianNum + "") + "";
            // UStringHelper.getMoneyFormat((this._chipNum1+this._baoxianNum)).toString();//下注分翻倍
        }


    }
    /**显示 第几手牌赢 */
    setWin(index: number): void {
        //this._paiAction.setWin(index);
    }

    //设置其他区域提示信息
    setOtherImage(value: boolean): void {
        this._otherSeatsImage.node.active = value
    }

    //设置其他区域保险信息
    setOtherBaoImage(value: boolean): void {
        this._otherbaoImg.node.active = value
    }

    updatebaoxianScore(value: boolean) {
        if (value) {
            this._baoxianNum = this._chipNum1 / 2
            this._chipCount.string = parseFloat(this._chipNum1 + this._baoxianNum + "") + "";
            // UStringHelper.getMoneyFormat((this._chipNum1+this._baoxianNum)).toString();//下注分翻倍
        }

    }
    //设置本下注区域其他玩家信息
    setOtherName(value: boolean, otherName?: string): void {
        // this._otherSeatsName.string =  otherName?otherName:""
        var seq = cc.repeatForever(cc.sequence(cc.moveBy(1, 0, 5), cc.moveBy(1, 0, -5)));

        if (parseInt(otherName) == AppGame.ins.roleModel.useId) {
            this.prop.active = false;
            this._otherSeatsName.node.active = true;
            this._otherSeatsName.spriteFrame = this._res.getFrames("self_seat");
            this._otherSeatsName.node.runAction(seq);
        } else {
            if (parseInt(otherName) !== 0 || parseInt(otherName) !== NaN) {
                for (const key in AppGame.ins.bjModel._battleplayer) {
                    if (AppGame.ins.bjModel._battleplayer[key].userId == parseInt(otherName)) {
                        this.prop.active = false;
                        this._otherSeatsName.node.active = true;
                        let a = (AppGame.ins.bjModel.getRealSeatId(AppGame.ins.bjModel._battleplayer[key].seatId)) + 1;
                        this._otherSeatsName.spriteFrame = this._res.getFrames("seat" + a);
                        this._otherSeatsName.node.runAction(seq);
                    }
                }
            }

        }

        if (!otherName) {
            this.prop.active = false;
        }
        this.setOtherImage(!value)
        if (value) {
            this._isfree = false
        }
    }

    showOperateState(state: number): void {
        let stateName = this._cacheName
        this._nickName.node.color = new cc.Color(255, 255, 255)
        if (state == 1) //停牌
        {
            stateName = "停牌"
            this._nickName.node.color = new cc.Color(176, 27, 27)
        }
        else if (state == 2) //要牌
        {
            stateName = "要牌"
            this._nickName.node.color = new cc.Color(46, 188, 46)
        }
        else if (state == 4) //双倍
        {
            stateName = "双倍下注"
            this._nickName.node.color = new cc.Color(46, 188, 46)
        }
        else if (state == 8) //分牌
        {
            stateName = "分牌"
            this._nickName.node.color = new cc.Color(46, 188, 46)
        }
        else if (state == 0) //下注完成
        {
            stateName = "下注完成"
            this._nickName.node.color = new cc.Color(46, 188, 46)
        }
        this._nickName.node.stopAllActions();
        this._nickName.string = stateName
        let action = cc.fadeIn(0.2)
        let act2 = cc.delayTime(3)
        this._nickName.node.runAction(cc.sequence(action, act2, cc.callFunc(() => {
            if (parseInt(this._cacheName) == AppGame.ins.roleModel.useId) {
                this._nickName.string = this._cacheName;
            } else {
                this._nickName.string = UStringHelper.coverName(this._cacheName);
            }

            // this._nickName.string = this._cacheName;
            // cc.error("1111111" +this._cacheName )
            this._nickName.node.color = new cc.Color(255, 255, 255)
        })));

    }
    /**帧更新 */
    update(dt: number): void {
        if (this._isfree) return;
        if (this._isTurn) {
            this._cdTime -= dt;
            if (this._cdTime > 0) {
                this._cd.fillRange = this._cdTime / this._totalTurnTime;
                // if(this._cd.fillRange > (2/3) && this._cd.fillRange <= 1){
                //     this._cd.node.color = cc.color(0,255,23,255);
                // }else if(this._cd.fillRange > (1/3) && this._cd.fillRange <= (2/3)){
                //     this._cd.node.color = cc.color(255,255,0,255);
                // }else if(this._cd.fillRange < (1/3)){
                //     this._cd.node.color = cc.color(255,0,0,255);
                // }

            } else {
                this._cd.fillRange = 0;
                this.leaveTurn();
            }

            if (parseFloat(this._cdTime + "").toFixed(2) == "3.00") {
                UAudioManager.ins.playSound("audio_Special");
                return
            }
            if (parseFloat(this._cdTime + "").toFixed(2) == "2.00") {
                UAudioManager.ins.playSound("audio_Special");
                return
            }
            if (parseFloat(this._cdTime + "").toFixed(2) == "1.00") {
                UAudioManager.ins.playSound("audio_Special");
                return
            }

        }
    }

    clear(): void {
        this.free()
        this.hideHead()
        this._paiAction.clear()
        this.stopcd()
        this._chipNum1 = 0;
        this._chipNum2 = 0;
        this._baoxianNum = 0;
        this._isfenpai = false;
    }
}
