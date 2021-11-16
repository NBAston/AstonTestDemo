import UNodeHelper from "../../common/utility/UNodeHelper";
import { UIZJHPoker, EBattlePlayerPaiState, ZJHBattlePlayerInfo, EFlagState, EZJHState } from "./UZJHClass";
import VPaiAction from "./VZJHPaiAction";
import USpriteFrames from "../../common/base/USpriteFrames";
import UHandler from "../../common/utility/UHandler";
import UEventListener from "../../common/utility/UEventListener";
import UResManager from "../../common/base/UResManager";
import { EIconType } from "../../common/base/UAllenum";
import AppGame from "../../public/base/AppGame";
import MZJH, { ZJH_SELF_SEAT, ZJH_SCALE } from "./MZJH";
import UStringHelper from "../../common/utility/UStringHelper";
import VZJHFlag from "./VZJHFlag";
import UAudioManager from "../../common/base/UAudioManager";
import UDebug from "../../common/utility/UDebug";
import VZJHOperate from "./VZJHOperate";
import GamePropManager from "../../public/GameProp/GamePropManager";
import VGameChatPropManager from "../../public/gamechat/VGameChatPropManager";


/**总的操作时间 */
const totalTurnTime = 15;

/**
 * 创建:sq
 * 作用:座位号控制
 */
export default class VZJHSeat {
    static SEEN: any;
    static getSeatWordPos(arg0: boolean) {
        throw new Error("Method not implemented.");
    }

    private _seatId: number;
    /**作为根节点 */
    public _seatRoot: cc.Node;
    private _score: cc.Node;
    /**扑克牌节点 */
    public _pokerRoot: cc.Node;

    private _myTurn: cc.Node;
    /**状态标记节点 */
    public _flagRoot: cc.Node;
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
    /**先手 */
    private _xian: cc.Node;
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
    /**分数 */
    private _gold: cc.Label;
    /**已看片节点 */
    private _seePai: cc.Node;
    private _winnode: cc.Node;
    public _qipai: cc.Node;
    private _vipLv: cc.Label;
    private _headBox: cc.Sprite;
    public _out_node: cc.Node;
    /** 玩家下注总数*/
    public _chipCount: cc.Label;
    /**点击看牌按钮 */
    public _clickPai: cc.Node;
    /**翻牌动画控制 */
    public _paiAction: VPaiAction;
    /**图片资源集合 */
    private _res: USpriteFrames;
    /**进入轮巡 */
    private _isTurn: boolean;
    /**总的cd时间 */
    private _cdTime: number;
    /**发牌的源点 */
    private _fapai: cc.Node;
    public _paixingNode: cc.Node;
    private _qipaiOri: cc.Node;
    /**数据*/
    public _bipaiShuNode: cc.Node;
    private _winself: sp.Skeleton;
    public _win2: cc.Node;
    private _win2Fx: sp.Skeleton;

    private _userId: number;
    public _isfree: boolean;
    private _sex: number;
    public _flagAction: VZJHFlag;
    private _vip: cc.Node;
    private _cuopai: cc.Node;
    public prop: cc.Node;
    public chatProp: cc.Node;

    /**
     * 座位号
     */
    get seatId(): number {
        return this._seatId;
    }
    get sex(): number {
        return this._sex;
    }
    get isFree(): boolean {
        return this._isfree;
    }
    constructor(seatId: number, qipaiOri: cc.Node, ori: cc.Node, seatRoot: cc.Node, score: cc.Node, pokerRoot: cc.Node, turn: cc.Node, flagRoot: cc.Node,
        chipBg: cc.Node, chipValue: cc.Node, fanpai: cc.Node, paiXing: cc.Node, win: cc.Node, win2: cc.Node, res: USpriteFrames) {
        this._sex = 0;
        this._score = score;
        this._qipaiOri = qipaiOri;
        this._fapai = ori;
        this._seatId = seatId - 1;
        this._seatRoot = seatRoot;
        this._pokerRoot = pokerRoot;
        this._myTurn = turn;
        this._flagRoot = flagRoot;
        this._chipBg = chipBg;
        this._chipValue = chipValue;
        this._paiXing = paiXing;
        this._fanpai = fanpai;
        this._res = res;
        this._winnode = win;
        this._score = score;
        this._win2 = win2;

        this.init();
    }
    /**初始化 */
    private init(): void {

        this._cd = UNodeHelper.getComponent(this._seatRoot, "gf_ct", cc.Sprite);
        this._head = UNodeHelper.getComponent(this._seatRoot, "head_icon", cc.Sprite);
        this._headBox = UNodeHelper.getComponent(this._seatRoot, "head_box", cc.Sprite);
        this._out_node = UNodeHelper.find(this._seatRoot, "outNode");
        this._vipLv = UNodeHelper.getComponent(this._seatRoot, "viplv", cc.Label);
        this._vip = UNodeHelper.find(this._seatRoot, 'vip_03');
        this._xian = UNodeHelper.find(this._seatRoot, "icon_xian");
        this._win = UNodeHelper.find(this._score, "get_win_gold");
        this._winNum = UNodeHelper.getComponent(this._score, "get_win_gold/win_value", cc.Label);
        this._lose = UNodeHelper.find(this._score, "get_lose_gold");
        this._loseNum = UNodeHelper.getComponent(this._score, "get_lose_gold/lose_value", cc.Label);
        this._nickName = UNodeHelper.getComponent(this._seatRoot, "name", cc.Label);
        this._gold = UNodeHelper.getComponent(this._seatRoot, "gold", cc.Label);
        this._seePai = UNodeHelper.find(this._pokerRoot, "see_pai");
        this._qipai = UNodeHelper.find(this._pokerRoot, "qipai");
        this._bipaiShuNode = UNodeHelper.find(this._pokerRoot, "gf_flag_bpsb");
        this._paixingNode = UNodeHelper.find(this._paiXing, "paixing");
        let constFlag = UNodeHelper.find(this._seatRoot, "headflag");
        this._cuopai = UNodeHelper.find(this._pokerRoot, "cuopai");
        this.prop = UNodeHelper.find(this._seatRoot, "prop");
        this.chatProp = UNodeHelper.find(this._seatRoot, "chatProp");

        this._clickPai = UNodeHelper.find(this._pokerRoot, "click_pai");
        if (this._clickPai) UEventListener.get(this._clickPai).onClick = new UHandler(this.onclickseepai, this);
        let winself = UNodeHelper.find(this._winnode, "win_self");
        if (winself) {
            this._winself = winself.getComponent(sp.Skeleton);
        }
        this._win2Fx = this._win2.getComponent(sp.Skeleton);
        this._win2Fx.setCompleteListener(() => {
            this._win2.active = false;
        });
        this._chipCount = this._chipValue.getComponent(cc.Label);
        this._paiAction = new VPaiAction(this.seatId, this._pokerRoot, this._fanpai, this._paiXing, this._res);
        this._flagAction = new VZJHFlag(constFlag, this._flagRoot, this._res);
        this._flagAction.reset();
    }


    private onclickseepai(): void {
        this.showclickpai(false);
        if (this._myTurn.getChildByName("cuoPaiToggle").getComponent(cc.Toggle).isChecked == true) {
            this._cuopai.active = true;
        } else {
            AppGame.ins.zjhModel.requestSeepai();
        }
    }

    showclickpai(value: boolean) {
        if (this._clickPai) this._clickPai.active = value;
    }
    /**获取位置的世界坐标 */
    getSeatWordPos(): cc.Vec2 {
        return this._seatRoot.convertToWorldSpaceAR(cc.Vec2.ZERO);
    }
    getPaiWordsPos(): cc.Vec2 {
        return this._pokerRoot.convertToWorldSpaceAR(cc.Vec2.ZERO);
    }
    /**更新分数和下注 */
    updateScore(score: number, usetotal: number): void {
        this._chipCount.string = UStringHelper.formatPlayerCoin((usetotal * ZJH_SCALE)).toString();
        this.setScore(score);
    }
    setScore(score: number): void {
        this._gold.string = UStringHelper.formatPlayerCoin((score * ZJH_SCALE)).toString();
    }
    /**结果 */
    result(win: boolean, score): void {
        this.prop.active = false;
        // this.chatProp.active = false;
        this.stopcd();
        this._win.active = win;
        this._lose.active = !win;
        score = score * ZJH_SCALE;
        let show = win ? this._win : this._lose;
        let label = win ? this._winNum : this._loseNum;
        label.string = win ? "+" + UStringHelper.getMoneyFormat(score) : UStringHelper.getMoneyFormat(score, -1);
        show.setPosition(0, -70);
        show.runAction(cc.moveTo(0.3, 0, 5));
        if (win) {
            this._winnode.active = true;
            this._win2.active = true;
            if (this._winself) {
                UAudioManager.ins.playSound("audio_qznn_gxnyl");
                this._winself.node.active = true;
                this._winself.setAnimation(0, "win", false);
            }
            // this._win2Fx.setAnimation(0, "animation", false);

        } else {
            this._winnode.active = true;
            // this._winnode.getComponent(cc.Sprite).enabled = false;
            if (this._winself) {
                UAudioManager.ins.playSound("audio_qznn_nsl");
                this._winself.node.active = true;
                this._winself.setAnimation(0, "lose", false);
            }

        }
    }
    closewinfx(): void {
        if (this._winself) this._winself.node.active = false;
        this._win2.active = false
    }
    /**更新turntime */
    updateturnTime(time: number): void {
        this._cdTime = time;

    }
    /**展示基础信息 */
    showbaseInfo(data: ZJHBattlePlayerInfo) {
        this._seatRoot.opacity = 255;
        this._isfree = true;
        this._seatRoot.active = true;
        this._pokerRoot.active = false;
        this._flagRoot.active = false;
        this._chipBg.active = false;
        this._chipValue.active = false;
        this._paixingNode.active = false;
        this._win.active = false;
        this._win2.active = false;
        this._lose.active = false;
        this._winnode.active = false;
        this._cd.node.active = false;
        this._qipai.active = false;
        this._xian.active = false;
        this._bipaiShuNode.active = false;
        this._flagAction.reset();
        this.showclickpai(false);
        this._userId = data.userId;
        if (AppGame.ins.currRoomKind == 2) {
            this._nickName.string = data.nickName;
        } else {
            this._nickName.string = data.userId.toString();
        }
        this._vipLv.string = data.vipLevel.toString();
        this.setScore(data.score);
        // for(const key in AppGame.ins.zjhModel._battleplayer){
        //     if(AppGame.ins.zjhModel._battleplayer[key].seatId == this.seatId && AppGame){

        //     }
        // }
        for (const key in AppGame.ins.zjhModel._battleplayer) {
            if (AppGame.ins.zjhModel._battleplayer[key].seatId == this.seatId && AppGame.ins.zjhModel._state == EZJHState.Gameing) {
                this._out_node.active = true;
            }
        }

        UResManager.load(data.headId, EIconType.Head, this._head, data.headImgUrl);
        UResManager.load(data.headboxId, EIconType.Frame, this._headBox);
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

    /**通过userId获取道具节点 */
    getPropNodeByUserId(userId: number, callback: any = null) {
        // for (let i = 0; i < this._maxplayer; i++) {
        //     let player = this._players[i.toString()];
        //     let bindUserId = player.prop.getComponent(GamePropManager).getBindUserId();
        //     if (bindUserId && (userId == bindUserId)) {
        //         callback && callback(player.prop);
        //     }
        // }
    }
    /**绑定数据 */
    bind(data: ZJHBattlePlayerInfo): void {
        this._seatRoot.opacity = 255;
        this._isfree = false;
        this._seatRoot.active = true;
        this._cd.node.active = false;
        this._chipBg.active = true;
        this._chipValue.active = true;
        this._xian.active = false;
        this._qipai.active = false;
        this.showclickpai(false);
        this._sex = data.sex;
        this._userId = data.userId;
        // if(this._out_node.active == true){
        //     this.prop.active = false;
        //     this.closePropPanelByUserId(data.userId);  
        // }else{
        this.prop.active = true;
        // this.chatProp.active = true;
        this.setPlayerPropUserId(data.userId);

        // }


        UResManager.load(data.headId, EIconType.Head, this._head, data.headImgUrl);
        UResManager.load(data.headboxId, EIconType.Frame, this._headBox);
        this._vipLv.string = data.vipLevel.toString();
        this.updateScore(data.score, data.userTotal);

        if (this.seatId == ZJH_SELF_SEAT) {
            if (AppGame.ins.currRoomKind == 2) {
                this._nickName.string = data.nickName;
            } else {
                this._nickName.string = data.userId.toString();
            }

        } else {
            if (AppGame.ins.currRoomKind == 2) {
                this._nickName.string = data.nickName;
            } else {
                this._nickName.string = UStringHelper.coverName(data.userId.toString());
            }
        }

        if (data.isFirst) this.setXianShou();
        if (data.isturn) this.enterTurn(data.cdtime);
        if (data.paiState == EBattlePlayerPaiState.none) {
            this._paiAction.free();
        } else if (data.paiState == EBattlePlayerPaiState.qiPai || data.paiState == EBattlePlayerPaiState.kanPai || data.paiState == EBattlePlayerPaiState.biPaiShu) {

        } else {
            this._paiAction.showback();
        }
        switch (data.paiState) {
            case EBattlePlayerPaiState.kanPai:
                {
                    this._out_node.active = false;
                    this._pokerRoot.active = true;
                    this._paiAction.normalState();
                    this.seePai();
                    this._flagAction.bind(EFlagState.KanPai, false);
                    // this.showclickpai(false);
                }
                break;
            case EBattlePlayerPaiState.mengPai:
                {
                    this._out_node.active = false;
                    this._paiAction.normalState();
                    this._pokerRoot.active = true;
                    if (AppGame.ins.currRoomKind == 0) {
                        this.showclickpai(true);
                    }
                }
                break;
            case EBattlePlayerPaiState.none:
                {
                    for (const key in AppGame.ins.zjhModel._battleplayer) {
                        if (AppGame.ins.zjhModel._battleplayer[key].seatId == this.seatId && AppGame.ins.zjhModel._state == EZJHState.Gameing) {
                            this._out_node.active = true;
                        }
                    }
                    this._paiAction.normalState();
                    this._pokerRoot.active = false;
                }
                break;
            case EBattlePlayerPaiState.qiPai:
                {
                    this._out_node.active = false;
                    this._pokerRoot.active = true;
                    this.qipai();
                    this._flagAction.bind(EFlagState.QiPai, false);
                }
                break;

            case EBattlePlayerPaiState.biPaiShu:
                {
                    this._pokerRoot.active = true;
                    this._bipaiShuNode.active = true;
                    this._paiAction.grayState();
                    this._seatRoot.opacity = 170;
                    this.showclickpai(false);
                    this._flagRoot.active = false;
                    this._seePai.active = false;
                }
                break;
        }
    }
    /**是否比牌 */
    bipai(isstart: boolean): void {
        this._seatRoot.active = !isstart;
        this._pokerRoot.active = !isstart;
        this._paiXing.active = !isstart;
    }
    /**设置先手标记 */
    setXianShou(): void {
        this._xian.active = true;
    }
    /**进入玩家的操作伦 */
    enterTurn(cd: number): void {
        this._isTurn = true;
        this._cd.node.active = true;
        this._cdTime = cd;
        this._flagRoot.active = false;
    }
    /**离开玩家的操作伦 */
    leaveTurn(): void {
        this._isTurn = false;
        this._cd.node.active = false;
        // UAudioManager.ins.stopAll();
    }
    /**看牌 */
    seePai(): void {
        this._seePai.active = true;
        this._paiAction.playSeePai();
        this._flagAction.bind(EFlagState.KanPai);

    }
    jiazhu(): void {
        this._flagAction.bind(EFlagState.JiaZhu);
    }
    genzhu(): void {
        this._flagAction.bind(EFlagState.GenZhu);
    }
    /**弃牌 */
    qipai(): void {
        this._seePai.active = false;
        let end = new cc.Vec2(this._qipaiOri.x, this._qipaiOri.y);
        this._paiAction.playqipai(end, UHandler.create(() => {
            this._qipai.active = true;
        }, this));
        this._seatRoot.opacity = 170;
        this._flagAction.bind(EFlagState.QiPai);
    }
    /**翻牌 */
    fanpai(poker: UIZJHPoker, widthAnimation: boolean = true, handler?: UHandler,): void {
        this.showclickpai(false);
        if(AppGame.ins.zjhModel._battleplayer[AppGame.ins.roleModel.useId].paiState == EBattlePlayerPaiState.biPaiShu && this.seatId == 0){
            this._bipaiShuNode.active = true;
        }else{
            this._bipaiShuNode.active = false;
        }
        let self = false;
        if (this.seatId == 0) {
            self = true;
        }
        this._paiAction.playFanPai(poker, widthAnimation, self, handler);
        this._seePai.active = false;
    }
    /**比牌输 */
    bipai_shu(): void {
        this._bipaiShuNode.active = true;
        this._paiAction.grayState();
        this._seatRoot.opacity = 170;
        this.showclickpai(false);
        this._flagRoot.active = false;
        this._seePai.active = false;

    }
    /**发牌 */
    fapai(overHandler: UHandler): void {
        this._pokerRoot.active = true;
        this._chipBg.active = true;
        this._chipValue.active = true;
        let start = this._fapai.parent.convertToWorldSpaceAR(new cc.Vec2(this._fapai.position.x, this._fapai.position.y));
        let handler = null;
        if (this.seatId == ZJH_SELF_SEAT) {
            handler = UHandler.create(() => {
                if (AppGame.ins.currRoomKind == 0) {
                    this.showclickpai(true);
                }

                if (overHandler) overHandler.run();
            }, this);
        }
        this._paiAction.playfapai(start, handler);
    }
    /**停止cd */
    stopcd(): void {
        this._isfree = true;
        this._cd.node.active = false;
    }
    /**座位玩家离开 */
    free(): void {
        this._isTurn = false;
        this._isfree = true;
        this._seatRoot.active = false;
        this._pokerRoot.active = false;
        this._flagRoot.active = false;
        this._chipBg.active = false;
        this._chipValue.active = false;
        this._win.active = false;
        this._lose.active = false;
        this._winnode.active = false;
        this._bipaiShuNode.active = false;
        this._paixingNode.active = false;
        this._seePai.active = false;
        this._qipai.active = false;
        this._win2.active = false;
        this._paiAction.free();
        this._flagAction.reset();
    }

    /**帧更新 */
    update(dt: number): void {
        if (this._isfree) return;
        if (this._isTurn) {
            this._cdTime -= dt;
            for (const key in AppGame.ins.zjhModel._battleplayer) {
                if (AppGame.ins.zjhModel._battleplayer[key].seatId == this.seatId) {
                    AppGame.ins.zjhModel._battleplayer[key].cdtime = this._cdTime;
                }
            }
            if (this._cdTime > 0) {
                this._cd.fillRange = this._cdTime / totalTurnTime;
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
}
